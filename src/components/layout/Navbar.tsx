'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { NAV_LINKS } from '@/constants/content'
import { SiteButton } from '@/components/ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on route change (anchor click)
  const handleNavClick = (href: string) => {
    setIsOpen(false)
    // Focus trick solo per hash puri sulla pagina corrente
    if (href.startsWith('#')) {
      const target = document.querySelector(href) as HTMLElement | null
      if (target) {
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: false })
      }
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="Navigazione principale"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-[#17192D]/95 backdrop-blur-md border-b border-white/[0.05]'
          : 'bg-transparent'
      }`}
    >
      <div
        className="flex items-center justify-between py-2 md:py-4 navbar-safe"
        style={{ paddingLeft: 'max(1.5rem, env(safe-area-inset-left))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}
      >
        {/* Logo */}
        <a href="/" aria-label="Knowow — torna all'inizio della pagina" className="flex items-center">
          <Image
            src="/images/logo_footer_knowowcompleto.svg"
            alt="Knowow"
            width={120}
            height={32}
            className="h-9 md:h-11"
            style={{ width: 'auto' }}
            quality={90}
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              role="listitem"
              className="text-xs uppercase tracking-widest text-white/65 hover:text-white transition-colors"
              aria-label={`Vai alla sezione ${link.label}`}
            >
              {link.label}
            </a>
          ))}
        </div>

          {/* CTA */}
          <span className="hidden lg:inline-block">
            <SiteButton href="/#contatti" variant="primary" clip="bl" aria-label="Richiedi una demo di FFTT">
              Richiedi un pilota di FFTT
            </SiteButton>
          </span>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-[7px] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden bg-[#17192D] border-t border-white/[0.05] overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col px-6 py-6 gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm uppercase tracking-widest text-white/65 hover:text-white transition-colors"
              onClick={() => handleNavClick(link.href)}
              aria-label={`Vai alla sezione ${link.label}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contatti"
            className="border border-[#E9704D] text-[#E9704D] text-xs uppercase tracking-widest px-5 py-3 text-center hover:bg-[#E9704D] hover:text-white transition-all mt-2"
            onClick={() => setIsOpen(false)}
            aria-label="Richiedi una demo di FFTT"
          >
            Richiedi un pilota di FFTT
          </a>
        </div>
      </div>
    </nav>
  )
}
