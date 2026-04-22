// tailwind.config.js — Knowow Design System
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Brand Colors ────────────────────────────────────────────────
      colors: {
        brand: {
          bg:        '#17192D',
          'bg-deep': '#0F1120',
          accent:    '#E9704D',
          blue:      '#3B61AB',
        },
      },
      // ─── Typography ──────────────────────────────────────────────────
      // Numbers (large): font-display  → Fussion
      // Headings/Titles: font-sans font-bold → Eurostile Bold
      // Body:            font-sans font-medium → Eurostile Medium
      // Micro uppercase: font-sans font-normal → Eurostile (light-ish)
      fontFamily: {
        display: ['Fussion', 'Eurostile', 'Arial', 'sans-serif'],
        sans:    ['Eurostile', 'Arial', 'sans-serif'],
        mono:    ['Courier New', 'Courier', 'monospace'],
      },
      // ─── Letter spacing (+1px over default) ──────────────────────────
      // Applied globally via CSS; Tailwind utilities available here for overrides
      letterSpacing: {
        tighter: '-0.02em',
        tight:   '-0.01em',
        normal:  '0.06em',   // +1px over browser default at ~16px
        wide:    '0.12em',
        wider:   '0.2em',
        widest:  '0.3em',
      },
      // ─── Gradients ────────────────────────────────────────────────────
      backgroundImage: {
        'grad-accent': 'linear-gradient(90deg, #E9704D 0%, #3B61AB 100%)',
        'grad-accent-diag': 'linear-gradient(135deg, #E9704D 0%, #3B61AB 100%)',
        'glass': 'linear-gradient(135deg, rgba(15,17,32,0.6) 0%, rgba(23,25,45,0.4) 100%)',
      },
      transitionDuration: { 400: '400ms' },
    },
  },
  plugins: [],
}
