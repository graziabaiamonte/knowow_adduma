import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Section1WhyFFTM from '@/components/sections/Section1WhyFFTM'
import Section2HowToUse from '@/components/sections/Section2HowToUse'
import Section3Sectors from '@/components/sections/Section3Sectors'
import Section4Ecosystem from '@/components/sections/Section4Ecosystem'
import Section5About from '@/components/sections/Section5About'
import CTAFinal from '@/components/sections/CTAFinal'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/ui/AnimatedBackground'



export default function Home() {
  return (
    <>
      {/* Ambient background — fixed, z-0 */}
      <AnimatedBackground />


      {/* Page content — z-10+ */}
      <main className="relative z-10 min-h-screen overflow-x-clip">
        <Navbar />
        <Hero />
   
        <Section1WhyFFTM />
        <Section2HowToUse />
        <Section3Sectors />
        <Section5About />
        <CTAFinal />
        <Footer />
      </main>
    </>
  )
}
