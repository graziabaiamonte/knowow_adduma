'use client'

import { useRef, useState } from 'react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** RGB values, e.g. "233,112,77" for accent orange */
  glowRGB?: string
  glowSize?: number
  glowAlpha?: number
}

export function GlowCard({
  children,
  className = '',
  style,
  glowRGB = '233,112,77',
  glowSize = 440,
  glowAlpha = 0.33,
}: GlowCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Update glow position directly via DOM — no React re-render
    glowRef.current.style.background = `radial-gradient(circle ${glowSize}px at ${x}px ${y}px, rgba(${glowRGB},${glowAlpha}) 0%, transparent 70%)`
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Mouse-following glow — rendered as a sibling div, not ::after */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0, zIndex: 1 }}
      />
      {/* Content sits above glow */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
