import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import Section4Ecosystem from '@/components/sections/Section4Ecosystem'
import CTAFinal from '@/components/sections/CTAFinal'

export const metadata = {
  title: 'Prodotti & Servizi — Knowow',
  description: "L'ecosistema completo di prodotti e servizi Knowow: dalla caratterizzazione a fatica al controllo qualità, dalla progettazione guidata dalla performance alle simulazioni numeriche.",
}

export default function ProdottiServiziPage() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative z-10 min-h-screen overflow-x-clip">
        <Navbar />
        <Section4Ecosystem />
        <CTAFinal />
        <Footer />
      </main>
    </>
  )
}
