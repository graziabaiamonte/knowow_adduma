import Image from 'next/image'

const navLinks = [
  'FFTM — Cos\'è FFTM',
  'FFTM — Come funziona',
  'Applicazioni',
  'Servizi',
  'Chi siamo',
  'Contatti',
]

export default function Footer() {
  return (
    <footer className=" py-6 px-6 md:px-16 lg:px-24">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Col 1 — Brand */}
          <div>
            <Image
              src="/images/logo_footer_knowowcompleto.svg"
              alt="Knowow"
              width={100}
              height={28}
              className="h-9 md:h-16 w-auto mb-4"
              quality={100}
            />
         
            <p className="text-sm text-white/50 max-w-xs leading-relaxed text-balance">
              Spin-off dell&apos;Università di Messina
            </p>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed text-balance">
            Fast Fatigue Testing Technology
            </p>
            
            <p className="text-xs text-white/25 mt-6">
              © 2026 Knowow s.r.l. — P.IVA 03698560830
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            {/* TODO decommenta quando crei altre pagine */}
            {/* <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
              Navigazione
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Col 3 — Contacts */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
              Contatti
            </p>
            <ul className="flex flex-col gap-3">
              <li className="text-sm text-white/60">www.knowow.tech</li>
              <li>
                <a
                  href="mailto:info@knowow.tech"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  info@knowow.tech
                </a>
              </li>
             
              <li className="text-xs text-white/25 mt-2">
                Associato Confindustria tramite Sicindustria
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/25">
          <span>Knowow s.r.l. — Tutti i diritti riservati</span>

          {/* TODO_crea pagine e decommenta */}
          {/* <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Cookie Policy</a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
