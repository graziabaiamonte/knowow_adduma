'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GlowCard } from '@/components/ui/GlowCard'
import Image from 'next/image'

// ─── Table data ───────────────────────────────────────────────────────────────

const TABLE_ROWS = [
  { serie: '1', provini: '5',  r2: '91.19%', giorni: '11', warning: true  },
  { serie: '2', provini: '10', r2: '81.48%', giorni: '23', warning: false },
  { serie: '3', provini: '14', r2: '79.79%', giorni: '29', warning: false },
  { serie: '4', provini: '18', r2: '81.63%', giorni: '37', warning: false },
  { serie: '5', provini: '22', r2: '79.92%', giorni: '45', warning: false },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FadeBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function BlockHeading({ children, accent = '#E9704D' }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-px shrink-0 mt-1 rounded-full" style={{ height: 36, background: accent }} aria-hidden="true" />
      <h3
        className="font-sans font-bold uppercase text-white leading-tight"
        style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)', letterSpacing: '-0.01em' }}
      >
        {children}
      </h3>
    </div>
  )
}

function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm md:text-base text-white/50 leading-relaxed font-medium ${className}`}>
      {children}
    </p>
  )
}

function Hi({ children }: { children: React.ReactNode }) {
  return <span className="text-white/85 font-bold">{children}</span>
}

// ─── Visual comparison card ───────────────────────────────────────────────────

function CompareCard() {
  const cols = [
    {
      label: 'PRASSI INDUSTRIALE',
      badge: '⚠ Insufficiente',
      num: '5',
      unit: 'provini',
      accent: '#E9704D',
      glowRGB: '233,112,77',
      items: [
        '~11 giorni di macchina',
        'R² apparentemente ottimo',
        'Distribuzione non stimabile',
        'Curva S-N inaffidabile',
      ],
      textDim: true,
    },
    {
      label: 'Standard statistico',
      badge: '✓ Affidabile',
      num: '20+',
      unit: 'provini',
      accent: '#3B61AB',
      glowRGB: '59,97,171',
      items: [
        '~45 giorni di macchina',
        'Curva P-S-N completa',
        'Bande di sopravvivenza 5/50/95%',
        'Base per decisioni di progetto',
      ],
      textDim: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-8">
      {cols.map((col) => (
        <GlowCard
          key={col.label}
          className="glass-card clip-card relative overflow-hidden"
          glowRGB={col.glowRGB}
          glowSize={320}
          glowAlpha={0.14}
        >
            {/* Large decorative number behind */}
            <div
              className="absolute -bottom-[8%] -right-[4%] overflow-hidden pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="font-display font-black block leading-none"
                style={{
                  fontSize: 'clamp(3rem,12vw,10rem)',
                  WebkitTextFillColor: col.textDim
                    ? 'rgba(255,255,255,0.04)'
                    : `rgba(${col.glowRGB},0.08)`,
                }}
              >
                {col.num}
              </span>
            </div>

            <div className="relative z-10 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-micro" style={{ color: col.accent }}>{col.label}</span>
                <span
                  className="text-micro px-1.5 py-0.5"
                  style={{ color: col.accent, border: `1px solid ${col.accent}44` }}
                >
                  {col.badge}
                </span>
              </div>

              {/* Number + unit */}
              <div className="mb-6">
                <span
                  className="font-display font-black leading-none"
                  style={{
                    fontSize: 'clamp(1.8rem,5vw,4rem)',
                    color: col.textDim ? 'rgba(255,255,255,0.22)' : col.accent,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {col.num}
                </span>
                <span className="text-sm text-white/40 ml-2">{col.unit}</span>
              </div>

              {/* Bullet list */}
              <div className="flex flex-col gap-2">
                {col.items.map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-4 h-px shrink-0" style={{ background: `${col.accent}55` }} />
                    <span className="text-xs text-white/55 font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
        </GlowCard>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SectionPerche() {
  return (
    <section className="px-6 md:px-16 lg:px-24 py-2 md:pt-36 md:-mb-[5%]">
      <div>


          {/* ── Blocco header: two-column layout ── CASO STUDIO 1 */}
          <FadeBlock>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16 xl:items-stretch">

              {/* ── Left column: narrative ── */}
              <div>
                <span className="text-micro text-[#E9704D] block mb-5">
                  caso di studio 1
                </span>
                <h2
                  className="font-sans font-bold uppercase text-white/35 leading-tight mb-8"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
                >
                 POCHI DATI GENERANO UN’ILLUSIONE DI PRECISIONE.
                 
                  <br />
                  <span className="text-white">MOLTI DATI GARANTISCONO VERA AFFIDABILITA’.</span>
                </h2>

                <Body className="mb-8">
                   La Serie 1 ha il
                  miglior R² — ed è la meno affidabile.
                </Body>

                {/* ASTM callout */}
                <div
                  className="flex items-center gap-4 py-4 px-5"
                  style={{ border: '1px solid rgba(59,97,171,0.25)', borderLeft: '3px solid #3B61AB' }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: '#3B61AB' }}>
                      ASTM E739
                    </p>
                    <p className="text-sm text-white/55 leading-relaxed font-medium text-balance">
                    Lo standard ASTM E739 raccomanda un minimo di <Hi>12–24 provini</Hi> provini per campagne con finalità statistiche. Sotto quella soglia si può parlare di caratterizzazione orientativa, non di affidabilità di progetto. Il range di ASTM E739 è ampio per restituire un intervallo di minore e maggiore affidabilità del dato. La letteratura scientifica sulla caratterizzazione a fatica e diversi decenni di applicazioni industriali indicano 20 provini come soglia pratica sotto la quale la stima delle curve di sopravvivenza diventa troppo incerta per supportare decisioni di progetto affidabili. Non si tratta di una regola normativa, ma una soglia ingegneristica ben fondata.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Right column: table ── */}
              <div className="flex flex-col">
                <GlowCard
                  className="glass-card clip-card overflow-hidden  "
                  glowRGB="59,97,171"
                  glowSize={400}
                  glowAlpha={0.12}
                >
                  <div className="pb-5 lg:pb-7">
                    {/* Header row */}
                    <div
                      className="grid grid-cols-4 px-5 md:px-7 pt-6 pb-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {['Serie', 'Provini', 'R²', 'Giorni'].map((h) => (
                        <span
                          key={h}
                          className="font-sans font-bold uppercase text-white/30"
                          style={{ fontSize: 11, letterSpacing: '0.25em' }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Data rows */}
                    {TABLE_ROWS.map((row, i) => (
                      <div
                        key={row.serie}
                        className="grid grid-cols-4 items-center px-5 md:px-7 py-5 lg:py-7"
                        style={{
                          borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          background: row.warning ? 'rgba(233,112,77,0.06)' : 'transparent',
                        }}
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className="font-mono text-xl lg:text-2xl font-semibold"
                            style={{ color: row.warning ? '#E9704D' : 'rgba(255,255,255,0.55)' }}
                          >
                            {row.serie}
                          </span>
                          {row.warning && (
                            <span
                              className="text-[8px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 self-start"
                              style={{ color: '#E9704D', border: '1px solid rgba(233,112,77,0.35)', borderRadius: 2 }}
                            >
                              R² alto <span className='text-[12px]'>≠</span> migliore
                            </span>
                          )}
                        </div>
                        <span
                          className="font-mono text-xl lg:text-2xl font-bold"
                          style={{ color: row.warning ? '#E9704D' : 'rgba(255,255,255,0.75)' }}
                        >
                          {row.provini}
                        </span>
                        <span
                          className="font-mono text-xl lg:text-2xl"
                          style={{
                            color: row.warning ? 'rgba(233,112,77,0.9)' : 'rgba(255,255,255,0.55)',
                            fontWeight: row.warning ? 700 : 400,
                          }}
                        >
                          {row.r2}
                        </span>
                        <span className="font-mono text-xl lg:text-2xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {row.giorni}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </div>

            </div>
          </FadeBlock>

    

        {/* ── Header ── */}
        <FadeBlock>
          <span className="text-micro mt-[5%] text-[#E9704D] block mb-5">
          L’IMPORTANZA DI UNA CAMPAGNA BEN FATTA
          </span>
          <h2
            className="font-sans font-bold uppercase text-white leading-tight mb-16"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            La fatica dei materiali:
            <br />
            <span className="text-white/35">una materia verticale e poco conosciuta.</span>
          </h2>
        </FadeBlock>

        {/* ── Blocco 1: 5 provini ── */}
        <FadeBlock>
          <div className="mb-16 pb-16">
            <BlockHeading accent="#E9704D">
              Il problema più comune: 5 provini non sono abbastanza
            </BlockHeading>

            <Body>
              Uno degli errori più diffusi è lavorare con curve di Wöhler derivate da appena
              5 provini. <Hi>La differenza rispetto a 20+ provini non è quantitativa, è qualitativa.</Hi>{' '}
              Con 5 provini non si stima una distribuzione, si fitta una curva su un campione
              troppo piccolo: come stimare le precipitazioni annuali di una città misurando
              solo 5 giorni d&apos;estate.
            </Body>

            {/* ── Wöhler chart video — full-bleed ── */}
            <div
              className="-mx-6 md:-mx-16 lg:-mx-24 md:my-12 relative overflow-hidden mt-[10%]"
          
            >
              <video
                src="/video_def/chart_reduced.webm"
                autoPlay
                muted
                loop
                playsInline
                className=" inset-0 w-full h-[28vh] md:h-[85vh]"
                style={{
                  objectFit: 'contain',
                }}
              />
              {/* Label overlay */}
              <div className="absolute top-2 md:bottom-12 left-6 md:left-16 lg:left-24 z-10">
                <span
                  className="text-micro block mb-1"
                  style={{ color: '#E9704D' }}
                >
                  Metodo tradizionale
                </span>
                <span className="text-micro text-white/40 block">
                  Costruzione curva di Wöhler — standard statistico
                </span>
              </div>
            </div>

            <CompareCard />

            <Body>
              Con i metodi tradizionali utilizzando 20+ provini è possibile costruire una <Hi>curva P-S-N</Hi>{' '}
              (Probability-Stress-Number of Cycles): la famiglia di curve isoaffidabilità al
              5%, 50%, 95% su cui si fondano le decisioni di progetto robuste. Con FFTT si raggiunge lo stesso risultato con pochi provini e in meno di 48 ore.
            </Body>
          </div>
        </FadeBlock>

      
       {/* ── CASO STUDIO 2 */}
       <FadeBlock>
            <div>

              {/* ── Testo ── */}
              <div className="mb-10">
                <span className="text-micro text-[#E9704D] block mb-5">
                  caso di studio 2
                </span>
                <h2
                  className="font-sans font-bold uppercase text-white/35 leading-tight mb-8"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
                >
                 Valutazione della fatica di un

                  <br />
                  <span className="text-white">acciaio strutturale navale.</span>
                </h2>

                <Body className="mb-0">
                Confronto tra il metodo tradizionale e la nostra soluzione.
                </Body>
              </div>

              {/* ── card casi studio ── */}
              <div className="clip-card-footer bg-[#18192D] p-6 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[
                    { img: '/casi_studio/card_1_casostudio2.0.png', title: 'Titolo caso studio 1', body: 'Curva S-N con banda di dispersione ottenuta tramite metodi di fatica tradizionali. Tempo di prova: circa 500 ore' },
                    { img: '/casi_studio/card_2_casostudio2.png', title: 'Titolo caso studio 2', body: 'Valutazione del limite di fatica mediante il metodo termografico.Tempo di prova: circa 8 ore' },
                    { img: '/casi_studio/card_3_casostudio2.png', title: 'Titolo caso studio 3', body: 'Confronto tra il valore S-N ottenuto con prove a gradini mediante metodo termografico e la banda di dispersione delle prove di fatica tradizionali' },
                  ].map((card) => (
                    <div
                      key={card.img}
                      className=" rounded-sm overflow-hidden bg-transparent flex flex-col"
                    >
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={card.img}
                          alt={card.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-white/90 leading-relaxed font-medium">
                          {card.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </FadeBlock>

      </div>
    </section>
  )
}
