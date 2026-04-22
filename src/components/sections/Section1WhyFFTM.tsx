'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { WHY_FFTM } from '@/constants/content'
import { GlowCard } from '@/components/ui/GlowCard'
import { SiteButton } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

// SVG viewBox is always 300×300 — we scale via CSS width
const R  = 130
const CX = 150
const CY = 150

// ─── Circle: Traditional method ───────────────────────────────────────────────
function CircleTraditional({ trigger }: { trigger: boolean }) {
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (trigger && circleRef.current) {
      circleRef.current.classList.add('stroke-animate')
    }
  }, [trigger])

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Info box — above circle */}
      <div className="text-center w-50">
        <span className="text-sm text-white block mb-2">[01] METODO TRADIZIONALE</span>
        <p className="text-sm text-white leading-relaxed font-medium text-balance">
          25 provini (5 livelli di carico x 5 provini)
        </p>
        <p className="text-sm text-white leading-relaxed font-medium text-balance">
          500+ ore
        </p>
        <p className="text-sm text-white leading-relaxed font-medium flex items-center justify-center gap-1 text-balance">
          <span className='h-[13px]'>~</span>1 mese
        </p>
      </div>

      {/* SVG circle — responsive via CSS */}
      <div
        className="relative w-[60vw] max-w-[590px]  min-w-[220px] md:w-[28vw] lg:w-[24vw]"
        style={{ aspectRatio: '1 / 1' }}
      >
        <svg
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden="true"
          className="w-full h-full"
        >
          {/* Background track */}
          <circle cx={CX} cy={CY} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
          {/* Animated stroke — white, slow (3.8s) */}
          <circle
            ref={circleRef}
            cx={CX} cy={CY} r={R}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="stroke-traditional"
            style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
          />
          {/* Number */}
          <text
            x={CX} y={CY - 10}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="54"
            fontFamily="Fussion, Eurostile, Arial"
            fontWeight="900"
          >
            500+
          </text>
          {/* Unit */}
          <text
            x={CX} y={CY + 42}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.22)"
            fontSize="14"
            fontFamily="Eurostile, Arial"
            fontWeight="700"
            letterSpacing="4"
          >
            ORE
          </text>
        </svg>
      </div>

      {/* Info box — below circle */}
      <div className="text-center max-w-[220px]">
        <p className="text-sm text-white leading-relaxed font-medium text-balance">
        Riduce la velocità di innovazione e ritarda
        il time-to-market
        </p>
      </div>
    </div>
  )
}

// ─── Circle: FFTM ─────────────────────────────────────────────────────────────
function CircleFFTM({ trigger }: { trigger: boolean }) {
  const count     = useCountUp(48, 1600, trigger)
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (trigger && circleRef.current) {
      circleRef.current.classList.add('stroke-animate')
    }
  }, [trigger])

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Info box — above circle */}
      <div className="text-center max-w-[200px]">
        <span className="text-sm text-[#E9704D] block mb-2">[02] CON FFTT</span>
        <p className="text-sm text-white leading-relaxed font-medium text-balance">
        Curva di Wöhler e limite di fatica in &lt;48 ore
        </p>
      </div>

      {/* SVG circle — responsive via CSS */}
      <div
        className="relative w-[60vw] min-w-[220px] md:w-[28vw] lg:w-[30vw]"
        style={{ aspectRatio: '1 / 1' }}
      >
        <svg
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden="true"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="fftmStrokeGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="300">
              <stop offset="0%"   stopColor="#E9704D" />
              <stop offset="100%" stopColor="#3B61AB" />
            </linearGradient>
            <linearGradient id="numGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#E9704D" />
              <stop offset="100%" stopColor="#3B61AB" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle cx={CX} cy={CY} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
          {/* Animated stroke — gradient, fast (1.4s) */}
          <circle
            ref={circleRef}
            cx={CX} cy={CY} r={R}
            stroke="url(#fftmStrokeGrad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="stroke-fftm"
            style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
          />
          {/* −90% badge */}
          <rect x="195" y="42" width="70" height="18" rx="0" fill="#E9704D" />
          <text x="230" y="52" textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize="10" fontFamily="Eurostile, Arial" fontWeight="900" letterSpacing="1">
            −90%
          </text>

          {/* Animated count */}
          <text
            x={CX} y={CY - 10}
            textAnchor="middle" dominantBaseline="middle"
            fill="url(#numGrad)"
            fontSize="82"
            fontFamily="Fussion, Eurostile, Arial"
            fontWeight="900"
          >
            &lt;{count}
          </text>
          {/* Unit */}
          <text
            x={CX} y={CY + 46}
            textAnchor="middle" dominantBaseline="middle"
            fill="#E9704D"
            fontSize="14"
            fontFamily="Eurostile, Arial"
            fontWeight="700"
            letterSpacing="4"
          >
            ORE
          </text>
        </svg>
      </div>

      {/* Info box — below circle */}
      <div className="text-center max-w-[450px] text-sm text-white leading-relaxed font-medium text-balance">
        <p>
        Sistema basato su:
        </p>
        <ul>
          <li>•  Sensori Termografici (IR)</li>
          <li>• Digital Image Correlation</li>
          <li>• Algoritmi proprietari per l'analisi dei dati</li>
        </ul>
      </div>
    </div>
  )
}

// ─── BenefitNum — stroke-on-hover decorative number ──────────────────────────
function BenefitNum({ num, isActive }: { num: string; isActive: boolean }) {
  const [hovered, setHovered] = useState(false)
  const on = hovered || isActive
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="select-none pointer-events-auto leading-none font-display transition-all duration-500 block"
      style={{
        fontSize: 'clamp(8rem, 20vw, 30rem)',
        WebkitTextFillColor: on ? 'transparent' : 'rgba(255,255,255,0.03)',
        backgroundImage: on ? 'linear-gradient(90deg, #E9704D 0%, #3B61AB 100%)' : 'none',
        WebkitBackgroundClip: on ? 'text' : 'unset',
        backgroundClip: on ? 'text' : 'unset',
        filter: on ? 'drop-shadow(0 0 2px rgba(233,112,77,0.5))' : 'none',
        cursor: 'default',
      }}
      aria-hidden="true"
    >
      {num}
    </span>
  )
}

// ─── Sticky Benefits ──────────────────────────────────────────────────────────
function BenefitsSticky() {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i) },
        { threshold: 0.55 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const active = WHY_FFTM.benefits[activeIndex]

  return (
    <>
      {/* ── Mobile: vertical stack with title above each card ── */}
      <div className="md:hidden flex flex-col gap-12 px-6 py-10">
        <span className="text-micro text-[#E9704D] block">Perché FFTT</span>
        {WHY_FFTM.benefits.map((b, i) => (
          <div key={b.num} className="flex flex-col gap-4">
            {/* Title above card */}
            <h3
              className="font-sans font-bold uppercase text-white leading-tight"
              style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', letterSpacing: '-0.01em' }}
            >
              {b.title}
            </h3>
            <GlowCard className="glass-card clip-card w-full relative overflow-hidden">
              <div className="absolute -bottom-[8%] -right-[5%] overflow-hidden pointer-events-none">
                <BenefitNum num={b.num} isActive={false} />
              </div>
              <div className="relative z-10 p-6 min-h-[220px]">
                <p className="text-sm text-white leading-relaxed font-medium text-balance">
                  {b.text}
                </p>
              </div>
            </GlowCard>
            {/* CTA — only for benefit #03 (methods) */}
            {i === 2 && (
              <SiteButton  variant="primary" href="/technology">
                Scopri i metodi termografici
              </SiteButton>
            )}
          </div>
        ))}
      </div>

      {/* ── Desktop: sticky left panel + scrollable cards ── */}
      <div className="hidden md:flex items-start">
        {/* Left sticky */}
        <div className="sticky top-0 h-screen w-[42%] flex flex-col justify-center pl-16 lg:pl-24 pr-8 shrink-0">
          <span className="text-micro text-[#E9704D] block mb-3">Perché FFTT</span>
          <motion.h3
            key={activeIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-sans font-bold uppercase text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)', letterSpacing: '-0.01em' }}
          >
            {active.title}
          </motion.h3>
          {/* CTA link — shown only when benefit #03 (methods) is active */}
          {activeIndex === 2 && (
            <motion.div
              key="cta-link"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <SiteButton variant="primary" href="/technology">
                Scopri i metodi termografici
              </SiteButton>
            </motion.div>
          )}
        </div>

        {/* Right scrollable cards */}
        <div className="flex-1 py-8 pr-16 lg:pr-24">
          {WHY_FFTM.benefits.map((b, i) => (
            <div
              key={b.num}
              ref={(el) => { cardRefs.current[i] = el }}
              className="flex items-center"
              style={{
                minHeight: '90vh',
                marginBottom: i < WHY_FFTM.benefits.length - 1 ? '50px' : '0',
              }}
            >
              <GlowCard className="glass-card clip-card w-full relative overflow-hidden">
                <div className="absolute -bottom-[8%] -right-[5%] overflow-hidden pointer-events-none">
                  <BenefitNum num={b.num} isActive={activeIndex === i} />
                </div>
                <div className="relative z-10 p-8 md:p-20 min-h-[50vh] flex flex-col justify-center">
                  <p className="text-sm lg:text-2xl text-white leading-relaxed max-w-xl font-medium mb-8 text-balance">
                    {b.text}
                  </p>
                  
                </div>
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Section1WhyFFTM() {
  const circlesRef    = useRef<HTMLDivElement>(null)
  const circlesInView = useInView(circlesRef, { once: true, amount: 0.4 })

  return (
    <section id="fftm" className="">

      {/* Part A — Comparison */}
      <div className="min-h-screen flex flex-col py-16 px-6 md:px-16 lg:px-24">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12 shrink-0"
        >
          <motion.span variants={fadeInUp} className="text-micro text-[#E9704D] block mb-4">
            {WHY_FFTM.label}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-sans font-bold uppercase text-white leading-none text-balance "
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.01em' }}
          >
            {WHY_FFTM.h2Line1}<br />{WHY_FFTM.h2Line2}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white max-w-xl mx-auto mt-5 text-sm font-medium text-balance">
            {WHY_FFTM.body}
          </motion.p>
        </motion.div>

        {/* Circles */}
        <div
          ref={circlesRef}
          className="flex-1 flex items-center justify-center"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full">
            <CircleTraditional trigger={circlesInView} />

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={circlesInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="origin-left hidden lg:block shrink-0"
              aria-hidden="true"
            >
              <svg width="60" height="18" viewBox="0 0 60 18" fill="none">
                <path d="M0 9 L52 9 M44 2 L52 9 L44 16"
                  stroke="#3B61AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            <CircleFFTM trigger={circlesInView} />
          </div>
        </div>
      </div>

      {/* Part B — Sticky Benefits */}
      <BenefitsSticky />

    </section>
  )
}