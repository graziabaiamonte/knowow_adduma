'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { HOW_TO_USE } from '@/constants/content'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlowCard } from '@/components/ui/GlowCard'
import { staggerContainer } from '@/lib/animations'

const CARD_W   = 380  // px
const CARD_GAP = 20   // px



export default function Section2HowToUse() {
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible  = useInView(sectionRef, { once: true, amount: 0.15 })

  const cards = HOW_TO_USE.cards

  return (
    <section
      id="applicazioni"
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
    >
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className="px-6 md:px-16 lg:px-24 mb-14"
      >
        <SectionHeading
          label={HOW_TO_USE.label}
          h2={HOW_TO_USE.h2}
          body={HOW_TO_USE.body}
          center={false}
          animate={false}
        />
      </motion.div>

      {/* Slider — scroll nativo orizzontale */}
      <div className="overflow-x-auto scrollbar-hide">
        <div
          className="flex px-6 md:px-16 lg:px-24 select-none lg:justify-center"
          style={{ gap: CARD_GAP }}
        >
          {cards.map((card, i) => {
            const accentColor = '#0F1120'

            return (
              <div
                key={`${card.num}-${i}`}
                className="w-[82vw] sm:w-[380px]"
                style={{ flexShrink: 0 }}
              >
                {/* Wrapper bordo sinistro — segue il clip-path */}
                <div
                  className="clip-card h-full"
                  style={{ paddingLeft: '2px', background: accentColor }}
                >
                 <GlowCard
                    className="glass-card clip-card h-[100%] flex flex-col justify-start  p-10 "
                  >
                    {/* Contenuto — cresce per occupare tutto lo spazio */}
                    <div className="flex-1 min-h-[400px]">
                      {/* <span className="text-micro text-white
                      
                      
                      px-2 py-1 inline-block mb-5">
                        {card.mode}
                      </span> */}
                      <h3
                        className="font-sans font-bold uppercase text-white text-lg leading-tight mb-4 text-balance"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed font-medium text-balance">
                        {card.text}
                      </p>
                    </div>
                    {/* CTA — sempre ancorato in basso */}
                    <div className="pt-5 mt-auto border-t border-white/[0.07]">
                      <a
                        href="#contatti"
                        className="text-micro text-[#E9704D] hover:text-white transition-colors"
                        aria-label={card.title}
                      >
                        {card.cta}
                      </a>
                    </div>
                  </GlowCard>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}