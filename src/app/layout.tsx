import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/ui/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  title: 'Knowow | Fast Fatigue Testing Technology — beyond ordinary engineering',
  description:
    "Knowow riduce il testing a fatica da ~500 ore a meno di 48 ore con FFTM. Spin-off dell'Università di Messina. Testing, licenza e servizi su misura.",
  keywords:
    'fast fatigue testing technology, FFTM, testing a fatica, curva di Wöhler, termografia, Risitano, materiali',
  openGraph: {
    title: 'Knowow | Fast Fatigue Testing Technology',
    description:
      'Da ~500 ore a meno di 48 ore. Tecnologia di testing a fatica basata su metodi termografici brevettati.',
    url: 'https://www.knowow.tech',
    siteName: 'Knowow',
    locale: 'it_IT',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.knowow.tech' },
  icons: {
    icon: '/favicon.webp',
    shortcut: '/favicon.webp',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.knowow.tech/#organization',
      name: 'Knowow s.r.l.',
      url: 'https://www.knowow.tech',
      logo: 'https://www.knowow.tech/images/logo.png',
      description:
        "Spin-off accademico dell'Università di Messina specializzato in testing a fatica dei materiali con tecnologia FFTM.",
      foundingOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'Università di Messina',
      },
      sameAs: ['https://www.knowow.tech'],
    },
    {
      '@type': 'Service',
      '@id': 'https://www.knowow.tech/#fftm',
      name: 'FFTM — Fast Fatigue Testing Technology',
      provider: { '@id': 'https://www.knowow.tech/#organization' },
      description:
        'Tecnologia proprietaria per il testing a fatica dei materiali che riduce i tempi da ~500 ore a meno di 48 ore, basata su metodi termografici validati dalla ricerca scientifica.',
      serviceType: 'Material Testing',
      areaServed: 'IT',
    },
    {
      '@type': 'Service',
      '@id': 'https://www.knowow.tech/#fqct',
      name: 'FQCT — Fast Quality Control Technology',
      provider: { '@id': 'https://www.knowow.tech/#organization' },
      description:
        'Controllo qualità non distruttivo: analisi della firma meccanico-strutturale di un componente con risultato pass/fail in 50–60 minuti.',
      serviceType: 'Quality Control',
    },
  ],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className="h-full" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-full" suppressHydrationWarning>
      <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}