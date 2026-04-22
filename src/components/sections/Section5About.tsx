'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ABOUT } from '@/constants/content'
import { fadeInUp, slideInRight, staggerContainer } from '@/lib/animations'

export default function Section5About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible  = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="chi-siamo"
      ref={sectionRef}
      className="md:pb-24 md:-mt-[7%]  px-6 md:px-16 lg:px-24  relative overflow-hidden"
    >
      <div className=" mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left — text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            <motion.span variants={fadeInUp} className="text-xs uppercase tracking-widest text-[#E9704D] block mb-4">
              {ABOUT.label}
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="font-display font-black uppercase text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
            >
              {ABOUT.h2line1}
              <br />
              {ABOUT.h2line2}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white text-sm md:text-base leading-relaxed text-balance">
              {ABOUT.body}
            </motion.p>
            {/* <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-8 mt-8">
              <a
                href="#"
                className="text-xs uppercase tracking-widest text-[#E9704D] hover:text-white transition-colors "
                aria-label="Scopri chi siamo"
              >
                {ABOUT.linkAbout}
              </a>
              <a
                href="#"
                className="text-xs uppercase tracking-widest text-white hover:text-white transition-colors"
                aria-label="Leggi le pubblicazioni scientifiche e brevetti"
              >
                {ABOUT.linkPubs}
              </a>
            </motion.div> */}
          </motion.div>

          {/* Right — decorative 50+ stroke number */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="relative flex flex-col items-center justify-center h-64 md:h-80"
          >
            {/* 50+ in stroke style — gradient outline, transparent fill */}
            <span
              className="font-display font-black leading-none select-none"
              style={{
                fontSize: 'clamp(7rem, 18vw, 24rem)',
                letterSpacing: '-0.05em',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '2px transparent',
                backgroundImage: 'linear-gradient(90deg, #E9704D 0%, #3B61AB 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(59,97,171,0.3))',
              }}
              aria-hidden="true"
            >
              35+
            </span>

            {/* Label below */}
            <p className="text-xs uppercase tracking-[0.3em] text-white mt-4">
              Anni di ricerca scientifica
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white mt-2">
              Università di Messina — Spin-off accademico
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
