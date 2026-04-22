'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

interface SectionHeadingProps {
  label: string
  h2: string | React.ReactNode
  body?: string
  center?: boolean
  className?: string
  animate?: boolean
}

export function SectionHeading({
  label,
  h2,
  body,
  center = true,
  className = '',
  animate = true,
}: SectionHeadingProps) {
  const Wrapper = animate ? motion.div : 'div'
  const wrapperProps = animate
    ? { variants: staggerContainer, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 } }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={`${center ? 'text-center' : ''} ${className}`}
    >
      {animate ? (
        <>
          <motion.span
            variants={fadeInUp}
            className="text-xs uppercase tracking-widest text-[#E9704D] block mb-4"
          >
            {label}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-black uppercase text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            {h2}
          </motion.h2>
          {body && (
            <motion.p
              variants={fadeInUp}
              className={`text-white/60 text-sm md:text-base leading-relaxed mt-6 ${
                center ? 'max-w-2xl mx-auto' : 'max-w-2xl'
              }`}
            >
              {body}
            </motion.p>
          )}
        </>
      ) : (
        <>
          <span className="text-xs uppercase tracking-widest text-[#E9704D] block mb-4">
            {label}
          </span>
          <h2
            className="font-black uppercase text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            {h2}
          </h2>
          {body && (
            <p
              className={`text-white/60 text-sm md:text-base leading-relaxed mt-6 ${
                center ? 'max-w-2xl mx-auto' : 'max-w-2xl'
              }`}
            >
              {body}
            </p>
          )}
        </>
      )}
    </Wrapper>
  )
}
