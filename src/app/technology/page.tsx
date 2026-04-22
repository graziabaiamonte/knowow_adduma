'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { GlowCard } from '@/components/ui/GlowCard'
import CTAFinal from '@/components/sections/CTAFinal'
import SectionPerche from '@/components/sections/SectionPerche'
import ThermalChart from '@/components/ui/ThermalChart'
import Image from 'next/image'

// ─── Card + video data ────────────────────────────────────────────────────────
const ALL_ITEMS = [
  {
    num: '01',
    tag: 'Equipment',
    title: 'IR Camera',
    subtitle: 'Infrared Thermal Imaging',
    body: "Rileva l'evoluzione della temperatura superficiale del provino durante il test a fatica.",
    accent: '#E9704D',
    glowRGB: '233,112,77',
    side: 'left'  as const,
    videoSrc: '/video_def/chart_reduced.webm',
    xShift: 80,
  },
  {
    num: '02',
    tag: 'Equipment',
    title: 'Digital Image Correlation',
    subtitle: 'Campo di deformazione',
    body: "Misura la deformazione del provino durante i test meccanici",
    accent: '#3B61AB',
    glowRGB: '59,97,171',
    side: 'right' as const,
    videoSrc: '/video_def/temperature_reduced.webm',
    xShift: -80,
  },
  {
    num: '03',
    tag: 'Metodo / STM',
    title: 'Static Thermographic Method',
    subtitle: 'Limite di primo danneggiamento',
    body: "Valutazione della tensione limite, che induce la prima microplasticizzazione del materiale.",
    accent: '#E9704D',
    glowRGB: '233,112,77',
    side: 'left'  as const,
    videoSrc: '/video_def/Polyline_reduced.webm',
    xShift: 80,
  },
  {
    num: '04',
    tag: 'Metodo / RTM',
    title: "Risitano Thermographic Method",
    subtitle: 'Curva di Wöhler e limite di fatica',
    body: "Derivazione della curva di Wöhler e del limite di fatica mediante analisi dell'andamento della temperatura di stabilizzazione in funzione del livello di tensione applicato.",
    accent: '#3B61AB',
    glowRGB: '59,97,171',
    side: 'right' as const,
    videoSrc: '/video_def/temperature_reduced.webm',
    xShift: -80,
  },
]

// Secondo video per la card RTM — attivato dopo il pin
const RTM_VIDEO_2 = '/video_def/Risitano.webm'

type Item = (typeof ALL_ITEMS)[number]

// ─── VideoBackground ──────────────────────────────────────────────────────────
// rtmPhase: 1 = Risitano.webm, 2 = temperature.webm (crossfade CSS)
function VideoBackground({
  activeIndex,
  rtmPhase,
}: {
  activeIndex: number
  rtmPhase: 1 | 2
  }) {
  const stmRef   = useRef<HTMLVideoElement>(null)   // STM (index 2)
  const rtmV1Ref = useRef<HTMLVideoElement>(null)   // RTM video 1
  const rtmV2Ref = useRef<HTMLVideoElement>(null)   // RTM video 2

  useEffect(() => {
    // STM
    if (stmRef.current) {
      activeIndex === 2
        ? stmRef.current.play().catch(() => {})
        : stmRef.current.pause()
    }
    // RTM v1
    if (rtmV1Ref.current) {
      activeIndex === 3 && rtmPhase === 1
        ? rtmV1Ref.current.play().catch(() => {})
        : rtmV1Ref.current.pause()
    }
    // RTM v2
    if (rtmV2Ref.current) {
      activeIndex === 3 && rtmPhase === 2
        ? rtmV2Ref.current.play().catch(() => {})
        : rtmV2Ref.current.pause()
    }
  }, [activeIndex, rtmPhase])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {ALL_ITEMS.map((item, i) => (
        <motion.div
          key={item.num}
          className="absolute"
          style={{ width: '80vw', left: 'calc(50% - 40vw)', top: '50%', translateY: '-25%' }}
          animate={{
            opacity: i === activeIndex ? 1 : 0,
            x: i === activeIndex ? item.xShift : 0,
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Card 01: ThermalChart */}
          {i === 0 ? (
            <div className="flex items-center justify-center w-[80vw]">
              <ThermalChart active={i === activeIndex} />
            </div>

          /* Card 02: grafico DIC */
          ) : i === 1 ? (
            <div className="flex items-center justify-center w-[80vw]">
              <Image
                src="/images/grafico_2.png"
                alt="DIC grafico"
                width={900}
                height={600}
                className="w-auto h-auto xl:w-275 2xl:w-300"
                style={{ objectFit: 'contain', maxHeight: '90vh' }}
              />
            </div>

          /* Card 03: STM video */
          ) : i === 2 ? (
            <video
              ref={stmRef}
              src={item.videoSrc}
              muted
              loop
              playsInline
              className="w-[80vw] h-[80vh]"
              style={{ objectFit: 'contain' }}
            />

          /* Card 04: RTM — due video in crossfade */
          ) : (
            <div className="relative w-[80vw] h-[80vh]">
              <video
                ref={rtmV1Ref}
                src={item.videoSrc}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'contain',
                  transition: 'opacity 0.6s ease',
                  opacity: rtmPhase === 1 ? 1 : 0,
                }}
              />
              <video
                ref={rtmV2Ref}
                src={RTM_VIDEO_2}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'contain',
                  transition: 'opacity 0.6s ease',
                  opacity: rtmPhase === 2 ? 1 : 0,
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ─── ContentCard ──────────────────────────────────────────────────────────────
function ContentCard({ item }: { item: Item }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: item.side === 'left' ? -52 : 52 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: 'clamp(300px, 30vw, 440px)' }}
    >
      <GlowCard
        className="glass-card clip-card w-full relative overflow-hidden"
        glowRGB={item.glowRGB}
        glowSize={400}
        glowAlpha={0.22}
        style={{ background: 'rgba(8, 10, 24, 0.92)' }}
      >
        <div
          className="absolute -bottom-[8%] -right-[3%] overflow-hidden pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="font-display font-black block leading-none"
            style={{
              fontSize: 'clamp(8rem, 13vw, 13rem)',
              WebkitTextFillColor: 'rgba(255,255,255,0.04)',
            }}
          >
            {item.num}
          </span>
        </div>

        <div className="relative z-10 p-8 min-h-[340px] flex flex-col justify-center">
          <span className="text-micro text-white/30 block mb-6">{item.tag}</span>
          <h3
            className="font-sans font-bold uppercase text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)', letterSpacing: '-0.015em' }}
          >
            {item.title}
          </h3>
          <p className="text-micro mb-6" style={{ color: item.accent }}>
            {item.subtitle}
          </p>
          <p className="text-sm text-white/75 leading-relaxed text-balance">{item.body}</p>
        </div>
      </GlowCard>
    </motion.div>
  )
}

// ─── TechHero ─────────────────────────────────────────────────────────────────
function TechHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 pt-36 pb-24 overflow-hidden">
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ inset: 0, zIndex: 0 }} />

      <div className="relative z-10  mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-micro text-[#E9704D] block mb-6"
        >
          Il cuore di FFTT
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-black uppercase text-white leading-none mb-8"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.2rem)', letterSpacing: '-0.03em' }}
        >
          Fast Fatigue
          <br />
          <span
            style={{
              WebkitTextFillColor: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #E9704D 0%, #3B61AB 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            TESTING TECHNOLOGY
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-white/45 text-sm leading-relaxed font-medium mx-auto"
          style={{ maxWidth: '36rem' }}
        >
          FFTT si basa sul Metodo Termografico Risitano e sul
Metodo Termografico Statico ed è equipaggiata con sensori termografici (IR)e digital image correlation (DIC). Restituisce
curva di Whöler e limite di fatica in meno di 48 ore.
        </motion.p>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TechnologyPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  // rtmPhase: 1 → Risitano.webm (card entra), 2 → temperature.webm (card pinned)
  const [rtmPhase, setRtmPhase] = useState<1 | 2>(1)

  const sectionRefs      = useRef<(HTMLDivElement | null)[]>([])
  // Ref all'intero container da 500vh della card 4 — usato dallo scroll listener
  const card4ContainerRef = useRef<HTMLDivElement>(null)

  // ── IntersectionObserver: aggiorna activeIndex ──────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.5 },
    )
    sectionRefs.current.forEach((el) => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll listener: gestisce il phase-switch per la card RTM ───────────────
  // Quando il container da 500vh ha scrollato oltre il suo primo 100vh
  // (rect.top ≤ 0 → la card è in posizione sticky al centro), si passa a video 2.
  useEffect(() => {
    const handleScroll = () => {
      if (!card4ContainerRef.current) return
      const { top } = card4ContainerRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      setRtmPhase(top <= -vh * 0.40 ? 2 : 1)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 min-h-screen overflow-x-clip">
        <Navbar />

        {/* ── Hero ── */}
        <TechHero />

        {/* ══ DESKTOP (lg+) — sticky video + scrolling cards ══ */}
        <section className="hidden lg:block relative" style={{ isolation: 'isolate' }}>

          {/* Sticky video layer */}
          <div
            className="flex flex-col justify-center items-center"
            style={{ position: 'sticky', top: 0, height: '90vh', zIndex: 1, overflow: 'hidden' }}
          >
            <div className="absolute top-24 left-0 right-0 text-center px-6 md:px-16 lg:px-24 z-10">
              <span className="text-micro text-white/30 block mb-3">FFTT combina sensori termografici (IR), Digital image Correlation (DIC) metodi termografici e algoritmi proprietari per l'analisi dei dati in un unico processo.</span>
              <h2
                className="font-sans font-bold uppercase text-white"
                style={{ fontSize: 'clamp(1.2rem, 2.2vw, 2rem)', letterSpacing: '-0.015em' }}
              >
                Una tecnologia integrata
              </h2>
            </div>

            <VideoBackground activeIndex={activeIndex} rtmPhase={rtmPhase} />
          </div>

          {/* Cards layer */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: '-90vh' }}>

            {/* Cards 01–03: layout normale 100vh */}
            {ALL_ITEMS.slice(0, 3).map((item, i) => (
              <div
                key={item.num}
                ref={(el) => { sectionRefs.current[i] = el }}
                className="flex items-center px-6 md:px-16 lg:px-24"
                style={{
                  height: '100vh',
                  justifyContent: item.side === 'left' ? 'flex-start' : 'flex-end',
                }}
              >
                <ContentCard item={item} />
              </div>
            ))}

            {/*
              Card 04 (RTM) — 500vh totali:
              · ~100vh: la card entra dal basso verso il centro (non sticky yet)
              · 400vh: la card rimane pinned al centro (position sticky, top 0)
                       il video switcha da Risitano → temperature non appena
                       il container supera il viewport top (rect.top ≤ 0).
            */}
            <div
              ref={card4ContainerRef}
              style={{ position: 'relative', height: '140vh' }}
            >
              {/*
                Sentinel 1px × 100vh usato dall'IntersectionObserver per attivare
                activeIndex = 3 non appena la card RTM entra nel viewport.
              */}
              <div
                ref={(el) => { sectionRefs.current[3] = el }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '1px',
                  height: '100vh',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />

              {/*
                Sticky card centrata verticalmente.
                Con top:0 + height:100vh + alignItems:center, la card si ancora
                al centro del viewport per tutta la durata del container (400vh).
              */}
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  paddingTop: '15vh',
                }}
                className="px-6 md:px-16 lg:px-24"
              >
                <ContentCard item={ALL_ITEMS[3]} />
              </div>
            </div>

          </div>
        </section>

        {/* ══ MOBILE / TABLET (< lg) ══ */}
        <section className="lg:hidden px-6 pb-16">
          <div className="text-center mb-10">
            <span className="text-micro text-white/30 block mb-3">FFTT combina sensori termografici (IR), Digital image Correlation (DIC) metodi termografici e algoritmi proprietari per l'analisi dei dati in un unico processo.</span>
            <h2
              className="font-sans font-bold uppercase text-white"
              style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', letterSpacing: '-0.015em' }}
            >
              Una tecnologia integrata
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            {ALL_ITEMS.map((item, i) => (
              <div key={item.num} className="flex flex-col gap-4">
                <ContentCard item={item} />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7 }}
                  className={`relative w-full flex flex-col justify-center gap-4 ${i === 0 ? '' : 'overflow-hidden'}`}
                >
                  {i === 0 ? (
                    <div className="flex justify-center" style={{ transform: 'scale(0.60)', transformOrigin: 'top center', marginBottom: '-240px' }}>
                      <ThermalChart />
                    </div>
                  ) : i === 1 ? (
                    <Image
                      src="/images/grafico.png"
                      alt="DIC grafico"
                      width={900}
                      height={600}
                      className="w-full h-auto"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : i === 3 ? (
                    // Card RTM mobile: entrambi i video in sequenza
                    <>
                      <video
                        src={item.videoSrc}
                        autoPlay muted loop playsInline
                        className="w-full"
                        style={{ objectFit: 'cover', aspectRatio: '16/9' }}
                      />
                      <video
                        src={RTM_VIDEO_2}
                        autoPlay muted loop playsInline
                        className="w-full"
                        style={{ objectFit: 'cover', aspectRatio: '16/9' }}
                      />
                    </>
                  ) : (
                    <video
                      src={item.videoSrc}
                      autoPlay muted loop playsInline
                      className="w-full h-full"
                      style={{ objectFit: 'cover', aspectRatio: '16/9' }}
                    />
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        <SectionPerche />
        <CTAFinal />
        <Footer />
      </main>
    </>
  )
}
