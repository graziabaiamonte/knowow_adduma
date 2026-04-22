'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // 1. Crea istanza Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // 2. Collega Lenis → ScrollTrigger (sincronizza lo scroll)
    lenis.on('scroll', ScrollTrigger.update)

    // 3. Aggancia Lenis al ticker GSAP (un solo rAF condiviso)
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000) // GSAP passa secondi, Lenis vuole millisecondi
    }
    gsap.ticker.add(tickerCallback)

    // 4. Disabilita il rAF interno di Lenis (usa quello di GSAP)
    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}