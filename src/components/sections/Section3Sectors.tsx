'use client'

import { useEffect, useRef } from 'react'
import { SECTORS } from '@/constants/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import ElementiSettori from '../ui/ElementiSettori'

export default function Section3Sectors() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const total = SECTORS.items.length
      const half  = Math.ceil(total / 2)

      ctx = gsap.context(() => {
        itemRefs.current.forEach((el, i) => {
          if (!el) return

          const isFirstHalf = i < half
          const label       = el.querySelector<HTMLElement>('.sector-label')

          // Indice locale all'interno del gruppo (0–3 per ciascun gruppo)
          const localIndex = isFirstHalf ? i : i - half

          // Scroll-driven shift: primi 4 → sinistra, ultimi 4 → destra
          gsap.fromTo(
            el,
            { x: '0%' },
            {
              x: isFirstHalf ? '-6%' : '6%',
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                end: 'top 20%',
                scrub: 0.8,
              },
            }
          )

          // Gradient sweep triggered on enter
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              if (!label) return

              label.style.backgroundImage     = 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 40%, #E9704D 45%, #3B61AB 55%, #FFFFFF 60%, #FFFFFF 100%)'
              label.style.backgroundSize      = '250% 100%'
              label.style.backgroundPosition  = '100% 0'
              label.style.webkitBackgroundClip = 'text'
              label.style.backgroundClip       = 'text'
              label.style.webkitTextFillColor  = 'transparent'

              gsap.to(label, {
                backgroundPosition: '0% 0',
                duration: 2.4,
                delay: localIndex * 0.25,
                ease: 'power2.inOut',
                onComplete: () => {
                  label.style.backgroundImage      = 'none'
                  label.style.backgroundSize       = ''
                  label.style.backgroundPosition   = ''
                  label.style.webkitBackgroundClip  = ''
                  label.style.backgroundClip        = ''
                  label.style.webkitTextFillColor   = '#FFFFFF'
                },
              })
            },
          })
        })
      }, sectionRef)
    }

    init()
    return () => ctx?.revert()
  }, [])

  const total = SECTORS.items.length
  const half  = Math.ceil(total / 2)

  return (
    <section
      id="settori"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-16 lg:px-24 overflow-hidden"
    >
     

      {/* ── Contenuto in primo piano ── */}
      <div className="relative z-10 mx-auto pointer-events-none">
        <SectionHeading
          label={SECTORS.label}
          h2={SECTORS.h2}
          body={SECTORS.body}
          className="mb-16"
        />

        <div className="flex flex-col relative h-auto md:h-[100vh] w-full"> 

           {/* ── Canvas particelle come sfondo ── */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
              <ElementiSettori />
            </div>
            
          {SECTORS.items.map((sector, i) => {
            const isFirstHalf = i < half

            return (
              <div key={sector.label}>
                {/* Spacer tra i due gruppi */}
                {i === half && <div className="h-[50vh]" />}

                <div
                  ref={(el) => { itemRefs.current[i] = el }}
                  className={`w-full ${isFirstHalf ? 'text-left' : 'text-right'}`}
                  style={{
                    display: 'flex',
                    justifyContent: isFirstHalf ? 'flex-start' : 'flex-end',
                    paddingLeft: isFirstHalf ? 'clamp(1rem, 4vw, 3rem)' : 0,
                    paddingRight: isFirstHalf ? 0 : 'clamp(1rem, 4vw, 3rem)',
                  }}
                >
                  <div className="group px-2 relative overflow-hidden pointer-events-auto">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(59,97,171,0.1) 0%, transparent 70%)' }}
                      aria-hidden="true"
                    />

                    <span
                      className="sector-label font-display lowercase"
                      style={{
                        fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
                        letterSpacing: '0.06em',
                        color: '#FFFFFF',
                        WebkitTextFillColor: '#FFFFFF',
                      }}
                    >
                      {sector.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}