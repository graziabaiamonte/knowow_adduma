'use client'

// ─── SiteButton ───────────────────────────────────────────────────────────────
// Componente unificato per tutti i bottoni del sito.
//
// Props:
//   variant  — 'primary' (sfondo arancione) | 'ghost' (sfondo scuro, bordo bianco)
//   clip     — 'tr' (taglio alto-destra) | 'bl' (taglio basso-sinistra)
//   href     — se presente, renderizza un <a>; altrimenti un <button>
//   type     — per form submit ('submit' | 'button' | 'reset')
//   disabled — grigia il pulsante e disabilita interazioni
//
// Hover: sfondo → trasparente · testo → bianco · bordo → colore della variante
// Il "bordo" è ottenuto tramite un wrapper con padding 1px + sfondo = colore bordo.

type Clip    = 'tr' | 'bl'
type Variant = 'primary' | 'ghost'

interface SiteButtonProps {
  variant?:   Variant
  clip?:      Clip
  href?:      string
  type?:      'button' | 'submit' | 'reset'
  disabled?:  boolean
  onClick?:   () => void
  className?: string
  children:   React.ReactNode
}

// Classe clip-path per ciascun lato
const CLIP: Record<Clip, string> = {
  tr: 'clip-btn-tr',
  bl: 'clip-btn-bl',
}

// Sfondo del wrapper (= colore del bordo visibile in hover)
const WRAPPER_BG: Record<Variant, string> = {
  primary: 'bg-[#E9704D]',
  ghost:   'bg-white/25',
}

// Sfondo iniziale dell'elemento interno
const INNER_BG: Record<Variant, string> = {
  primary: 'bg-[#E9704D]',
  ghost:   'bg-[#0a0c1c]',
}

// Classe CSS per variante — gestisce hover in globals.css
const HOVER_CLASS: Record<Variant, string> = {
  primary: 'site-btn-primary',
  ghost:   'site-btn-ghost',
}

// Classi base dell'elemento interno (font, padding)
const INNER_BASE =
  'relative inline-flex items-center justify-center w-full ' +
  'px-4 py-2 md:px-8 md:py-4 text-xs uppercase tracking-widest font-bold text-white overflow-hidden'

export function SiteButton({
  variant  = 'primary',
  clip     = 'tr',
  href,
  type     = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
}: SiteButtonProps) {
  const clipCls    = CLIP[clip]
  const wrapperCls = [
    'inline-block p-[1px]',
    clipCls,
    WRAPPER_BG[variant],
    disabled ? 'opacity-60 pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ')
  const innerCls = `${clipCls} ${INNER_BG[variant]} ${HOVER_CLASS[variant]} ${INNER_BASE}`

  if (href) {
    return (
      <span className={wrapperCls}>
        <a href={href} className={innerCls}>
          <span className="relative z-10">{children}</span>
        </a>
      </span>
    )
  }

  return (
    <span className={wrapperCls}>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={innerCls}
      >
        <span className="relative z-10">{children}</span>
      </button>
    </span>
  )
}

// Alias per compatibilità con eventuali import esistenti
export { SiteButton as Button }
