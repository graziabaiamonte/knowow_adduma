'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

// ─── Lista loghi partner ─────────────────────────────────────────────────────
const PARTNERS = [
  { src: '/partners_new/confindustria.webp', alt: 'Confindustria' },
  { src: '/partners_new/sicindustria.webp', alt: 'Sicindustria' },
  { src: '/partners_new/università di messina.webp', alt: 'Università di Messina' },
  { src: '/partners_new/ansys.webp', alt: 'Ansis' },
  { src: '/partners_new/italsigma.webp', alt: 'Italsigma' },
]

// ─── Hero ────────────────────────────────────────────────────────────────────
function PartnerHero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 md:px-16 pt-36 pb-24 overflow-hidden">
      <div aria-hidden="true" className="absolute pointer-events-none" style={{ inset: 0, zIndex: 0 }} />

      <div className="relative z-10 mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-micro text-[#E9704D] block mb-6"
        >
          Collaborazioni
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans font-black uppercase text-white leading-none mb-8"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.2rem)', letterSpacing: '-0.03em' }}
        >
          I nostri
          <br />
          <span
            style={{
              WebkitTextFillColor: 'transparent',
              backgroundImage: 'linear-gradient(90deg, #E9704D 0%, #3B61AB 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            Partner
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-white/45 text-sm leading-relaxed font-medium mx-auto text-balance"
          style={{ maxWidth: '36rem' }}
        >
          Istituzioni, aziende e centri di ricerca con cui collaboriamo
          per portare innovazione nella caratterizzazione dei materiali.
        </motion.p>
      </div>
    </section>
  )
}

// ─── Griglia loghi ───────────────────────────────────────────────────────────
function PartnerGrid() {
  return (
    <section className="px-6 md:px-16 lg:px-24 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center item-center gap-6">
          {PARTNERS.map((partner) => (
            <motion.div
              key={partner.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square w-70 flex-none border border-white/6 rounded-sm overflow-hidden"
              style={{ background: '#0F1120' }}
            >
              {/* Logo */}
              <div className="absolute inset-0 flex items-center justify-center p-8 md:p-10">
                <div className="relative w-full h-full">
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  />
                </div>
              </div>

              {/* Overlay blu scuro per uniformare i colori */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(15, 17, 32, 0.55)',
                  mixBlendMode: 'color',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PartnerPage() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 min-h-screen overflow-x-clip">
        <Navbar />
        <PartnerHero />
        <PartnerGrid />
        <Footer />
      </main>
    </>
  )
}
