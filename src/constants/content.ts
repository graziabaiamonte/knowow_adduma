// ─── NAVIGATION ──────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Chi siamo', href: '/#chi-siamo' },
  { label: 'FFTT', href: '/technology' },
  { label: 'Prodotti & Servizi', href: '/prodotti-e-servizi' },
  { label: 'Partner', href: '/partner' },
  { label: 'Contatti', href: '/#contatti' },
]

// ─── HERO ─────────────────────────────────────────────────────────────────────
export const HERO = {
  tag: 'Fast Fatigue Testing Technology',
  h1Line1: 'Testare il comportamento a fatica di materiali, componenti e sistemi non è ',
  h1Line2: 'mai stato così semplice e veloce.',
  subtitle:
    "FFTT riduce i tempi di testing da diverse settimane a poche ore.",
  ctaPrimary: 'Scopri FFTT',
  ctaSecondary: 'Richiedi una demo',
  stats: [
    { value: '< 48h', label: 'Tempi di testing' },
    { value: '90%+', label: 'Riduzione rispetto ai metodi tradizionali' },
    { value: '50+', label: 'Anni di ricerca scientifica' },
  ],
}

// ─── SECTION 1 — WHY FFTM ────────────────────────────────────────────────────
export const WHY_FFTM = {
  label: 'Perché FFTT',
  h2Line1: 'La caratterizzazione a fatica con metodi tradizionali richiede tempi lunghi',
  h2Line2: 'e frena i processi di R&D. FFTT NO.',
  body: "I metodi standard per l’esecuzione delle prove richiedono centinaia di ore e decine di provini per derivare una curva di Wöhler\u00A0(S\u2011N) e ricavare il limite di fatica. FFTT riduce drasticamente il numero dei provini e i tempi di prova garantendo un’affidabilità del dato pari o superiore rispetto ai protocolli tradizionali.",
  traditional: {
    tag: '[01]',
    title: 'Il metodo tradizionale',
    items: [
      '25 provini (5 livelli di carico x 5 provini)',
      '500+ ore',
      '~1 mese',
    ],
  },
  fftm: {
    tag: '[02]',
    title: 'FFTM — Fast Fatigue Testing Technology',
    items: [
      'Curve a fatica in 1–2 giorni lavorativi',
      'Meno di 48 ore — spesso ~24 ore o meno',
      'Un solo sistema integrato: IR + DIC + ML',
      'Metodi validati da pubblicazioni peer-reviewed',
    ],
  },
  benefits: [
    {
      num: '01',
      title: 'Da 500+ ore a <48 ore',
      text: 'Dove i metodi tradizionali impiegano settimane, FFTT restituisce curva di Wöhler\u00A0(S\u2011N) e limite di fatica in < 48 ore',
    },
    {
      num: '02',
      title: 'Una tecnologia integrata',
      text: 'FFTT combina sensori termografici (IR), Digital Image Correlation (DIC) e algoritmi proprietari per l’analisi dei dati in un unico processo.',
    },
    {
      num: '03',
      title: 'Tecnologia fondata su metodi energetici frutto di oltre 35 anni di ricerca scientifica',
      text: 'La tecnologia si basa sul Metodo Termografico Risitano e sul Metodo Termografico Statico, documentati in numerose pubblicazioni peer-reviewed.',
    },
  ],
}

// ─── SECTION 2 — HOW TO USE ───────────────────────────────────────────────────
export const HOW_TO_USE = {
  label: 'al servizio delle esigenze aziendali',
  h2: 'FAST FATIGUE TESTING TECHNOLOGY AL SERVIZIO DELLA TUA AZIENDA',
  body: 'FFTT è disponibile per progetti pilota, come bundle di servizi nell’ambito di una partnership continuativa e come tecnologia in licenza trasferita direttamente presso i vostri laboratori ',
  cards: [
    {
      mode: 'MODALITÀ 01',
      num: '01',
      title: 'Progetto pilota',
      text: 'Il progetto pilota si svolge presso i laboratori Knowow oppure presso i vostri laboratori. Restituiamo curva di Wöhler\u00A0(S\u2011N), limite di fatica e report tecnico completo. Il pilota rappresenta una vetrina delle nostre capacità tecniche pensata per facilitare il primo engagement. Il passo successivo della partnership è l’attivazione di un bundle di servizi.',
      cta: 'Richiedi un preventivo →',
      borderColor: 'border-[#E9704D]',
    },
    {
      mode: 'MODALITÀ 02',
      num: '02',
      title: 'Bundle di servizi',
      text: "Alle attività spot prediligiamo relazioni strutturate e continuative per traferire il massimo del valore ai nostri partner selezionati. I nostri bundle di servizi ci consentono di allinearci ai piani di sviluppo aziendali garantendo tempi di risposta celeri e capacità tecnica dedicata. ",
      cta: 'Scopri i nostri bundle →',
      borderColor: 'border-[#3B61AB]',
    },
    {
      mode: 'MODALITÀ 03',
      num: '03',
      title: 'Porta FFTT nel tuo laboratorio',
      text: "In caso di esigenze frequenti o da parte di diversi team del reparto R&D, è possibile acquisire la licenza della tecnologia e integrarla direttamente presso i vostri laboratori. Forniamo banchi prova su misura o un retrofit per i vostri banchi prova esistenti. Knowow fornisce supporto per l’installazione e la calibrazione, cura la formazione del personale e garantisce assistenza da remoto.",
      cta: 'Richiedi informazioni sulla licenza →',
      borderColor: 'border-white/20',
    },
  ],
}

// ─── SECTION 3 — SECTORS ─────────────────────────────────────────────────────
export const SECTORS = {
  label: 'Settori applicativi',
  h2: 'FFTT nel tuo settore',
  body: 'La tecnologia FFTT trova applicazione in diversi settori industriali e su un’ampia gamma di materiali tra cui metalli, compositi, polimeri, tessuti tecnici e fibre ad alte prestazioni.',
  items: [
    { label: 'Automotive' },
    { label: 'Motorsport'},
    { label: 'Luxury manufacturing' },
    { label: 'Biomedicale' },
    { label: 'Aerospace'},
    { label: 'Navale' },
    { label: 'Difesa' },
    { label: 'Additive manufacturing' },
  ],
}

// ─── SECTION 4 — ECOSYSTEM ───────────────────────────────────────────────────
export const ECOSYSTEM = {
  h2line1: 'FFTT è L’AVANGUARDIA TECNOLOGICA',
  h2line2a: "Intorno c'è un ",
  h2accent: 'ecosistema',
  h2line2b: ' completo di prodotti e servizi.',
  body: "Knowow non è solo testing di fatica. I nostri prodotti e servizi coprono l’intero ciclo di vita del prodotto industriale.",
  services: [
    {
      num: '01.',
      title: 'Controllo qualità non distruttivo',
      keyword: 'FQCT',
      subtitle: 'Fast Quality Control Technology — FQCT',
      text: "Facendo leva sulla fisica alla base di FFTT, il nostro controllo qualità non distruttivo analizza l'impronta meccanico-strutturale di un componente e la confronta con quella del suo prototipo validato. Si effettua così uno screening completo in 50-60 minuti che restituisce un risultato pass/fail chiaro e utile a individuare eventuali derive produttive prima che diventino problemi di qualità.",
      icon: '/favicon.webp',
    },
    {
      num: '02.',
      title: 'Progettazione guidata dalla performance',
      keyword: 'Performance Driven Design',
      subtitle: 'Performance Driven Design',
      text: "Un approccio alla progettazione che supera il metodo trial-and-error esplorando matematicamente l'intero spettro delle soluzioni possibili. Meno iterazioni, meno simulazioni, risultati ottimali.",
      icon: '/favicon.webp',
    },
    {
      num: '03.',
      title: 'SIMULAZIONI NUMERICHE',
      keyword: 'FEM, CFD, MBS, CAO/RT',
      subtitle: 'Simulazioni Numeriche',
      text: "Analisi agli elementi finiti, fluidodinamica computazionale, simulazioni multibody, simulazione e ottimizzazione ottica consentono di prevedere con accuratezza il comportamento dei sistemi in condizioni operative reali e forniscono i dati necessari per guidare le decisioni progettuali all’interno del framework Performance Driven Design.",
      icon: '/favicon.webp',
    },
    {
      num: '04.',
      title: 'Innovazione',
      keyword: 'Tailored R&D',
      subtitle: 'Tailored R&D',
      text: "Progettazione e sviluppo di soluzioni ingegneristiche innovative su misura ",
      icon: '/favicon.webp',
    },
  ],
}

// ─── SECTION 5 — ABOUT ───────────────────────────────────────────────────────
export const ABOUT = {
  label: "Dietro FFTT",
  h2line1: 'Oltre 35 anni di ricerca.',
  h2line2: 'Una tecnologia senza pari.',
  body: "Knowow nasce come spin-off accademico dell’Università di Messina. Il team che ha sviluppato e industrializzato FFTT vanta oltre 35 anni di ricerca pionieristica nel campo della fatica dei materiali e della termografia, grazie a cui hanno visto la luce i metodi alla base di FFTT: il Metodo Termografico Risitano e il Metodo Termografico Statico.",
  linkAbout: 'Chi siamo →',
  linkPubs: 'Pubblicazioni & brevetti →',
}

// ─── CTA FINAL ───────────────────────────────────────────────────────────────
export const CTA = {
  h2: 'Contattaci',
  body: 'Entra in contatto con il nostro team. Abbiamo una soluzione per ogni esigenza della tua azienda.',
  ctaPrimary: 'Invia',
  ctaSecondary: 'Contattaci',
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
export const FOOTER = {
  tagline: 'beyond ordinary engineering',
  description: "Spin-off dell'Università di Messina. Fast Fatigue Testing Technology.",
  copyright: '© 2026 Knowow s.r.l. — P.IVA [in registrazione]',
  navLinks: [
    "FFTM — Cos'è FFTM",
    'FFTM — Come funziona',
    'Applicazioni',
    'Servizi',
    'Chi siamo',
    'Contatti',
  ],
  contacts: {
    web: 'www.knowow.tech',
    email: 'info@knowow.tech',
    location: "Università di Messina — Spin-off accademico",
    badge: 'Membro Confindustria',
  },
}
