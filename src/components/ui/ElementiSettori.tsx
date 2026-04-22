'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  tx: number; ty: number; x: number; y: number
  offsetX: number; offsetY: number
  speed: number; phase: number; amplitude: number
  size: number; alpha: number
}

const SHAPE_DURATION    = 3000   // ms per forma
const TRANSITION_DURATION = 1500 // ms transizione
const PARTICLE_COUNT    = 4200
const NUM_SHAPES        = 7      // yacht · DNA · auto · molecola · orologio · moto · tank

export default function ElementiSettori() {
  const canvasRef            = useRef<HTMLCanvasElement>(null)
  const particlesRef         = useRef<Particle[]>([])
  const mouseRef             = useRef({ x: -9999, y: -9999 })
  const animFrameRef         = useRef<number>(0)
  const dimensionsRef        = useRef({ w: 0, h: 0 })
  const shapeIndexRef        = useRef(0)
  const shapeTimeRef         = useRef(0)
  const lastTimestampRef     = useRef(0)
  const currentTargetsRef    = useRef<{ x: number; y: number }[]>([])
  const nextTargetsRef       = useRef<{ x: number; y: number }[]>([])
  const isTransitioningRef   = useRef(false)
  const transitionProgressRef = useRef(0)

  // ── 1. DOPPIA ELICA DNA ──────────────────────────────────────────────────────
  const generateDNAPoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.5; const cy = h * 0.5
    const s  = Math.min(w, h) * (w < 768 ? 0.0028 : 0.0040)
    const helixHeight  = 240 * s
    const helixRadius  = 50 * s
    const turns        = 3.5
    const thickness    = 4 * s

    const strand = Math.floor(count * 0.35)
    for (let i = 0; i < strand; i++) {
      const t = Math.random()
      const y = cy - helixHeight / 2 + t * helixHeight
      const a = t * turns * Math.PI * 2
      points.push({ x: cx + Math.cos(a) * helixRadius + (Math.random() - 0.5) * thickness, y: y + (Math.random() - 0.5) * thickness })
    }
    for (let i = 0; i < strand; i++) {
      const t = Math.random()
      const y = cy - helixHeight / 2 + t * helixHeight
      const a = t * turns * Math.PI * 2 + Math.PI
      points.push({ x: cx + Math.cos(a) * helixRadius + (Math.random() - 0.5) * thickness, y: y + (Math.random() - 0.5) * thickness })
    }

    const bridge = Math.floor(count * 0.2)
    const numBridges = 28
    for (let i = 0; i < bridge; i++) {
      const bi = Math.floor(Math.random() * numBridges)
      const t  = (bi + 0.5) / numBridges
      const y  = cy - helixHeight / 2 + t * helixHeight
      const a  = t * turns * Math.PI * 2
      const x1 = cx + Math.cos(a) * helixRadius
      const x2 = cx + Math.cos(a + Math.PI) * helixRadius
      const bt = Math.random()
      points.push({ x: x1 + (x2 - x1) * bt + (Math.random() - 0.5) * 3 * s, y: y + (Math.random() - 0.5) * 3 * s })
    }

    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x + (Math.random() - 0.5) * 35 * s, y: base.y + (Math.random() - 0.5) * 35 * s })
    }

    const cosA = Math.cos((8 * Math.PI) / 180); const sinA = Math.sin((8 * Math.PI) / 180)
    return points.slice(0, count).map(p => {
      const dx = p.x - cx; const dy = p.y - cy
      return { x: cx + dx * cosA - dy * sinA, y: cy + dx * sinA + dy * cosA }
    })
  }, [])

  // ── 3. AUTO — BMW Serie 3 F30 (cab-back, RWD, proporzioni geometriche precise)
  //
  // Constraint fondamentali verificati:
  //   frontWheelX + archR < frontX   (arco non sporge dal muso)
  //   rearWheelX  - archR > rearX    (arco non sporge dalla coda)
  //   wheelbase ≈ 65% lunghezza totale
  //   sbalzo ant. ≈ 26% del passo (corto per RWD)
  //
  const generateCarPoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.50
    const cy = h * 0.50
    const s  = Math.min(w, h) * (w < 768 ? 0.0036 : 0.0052)

    // ── Helpers ───────────────────────────────────────────────────────────────
    const addLine = (x1: number, y1: number, x2: number, y2: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        points.push({ x: x1+(x2-x1)*t+(Math.random()-0.5)*thick, y: y1+(y2-y1)*t+(Math.random()-0.5)*thick })
      }
    }
    const addBez = (
      x0: number, y0: number, xc: number, yc: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*x0+2*mt*t*xc+t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*y0+2*mt*t*yc+t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }
    const addCubicBez = (
      x0: number, y0: number, xc1: number, yc1: number, xc2: number, yc2: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*mt*x0+3*mt*mt*t*xc1+3*mt*t*t*xc2+t*t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*mt*y0+3*mt*mt*t*yc1+3*mt*t*t*yc2+t*t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }
    const addRing = (ox: number, oy: number, r: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const a = Math.random()*Math.PI*2; const rr = r-thick*0.5+Math.random()*thick
        points.push({ x: ox+Math.cos(a)*rr, y: oy+Math.sin(a)*rr })
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Profilo berlina moderna (ref: BMW F30 3-Series, vista laterale)
    //
    // Proporzioni chiave BMW F30:
    // - Lunghezza totale ~210*s, altezza ~65*s (ratio ~3.2:1, molto basso e lungo)
    // - Cofano lungo ~40% della lunghezza totale
    // - Passo (interasse) ~58% della lunghezza
    // - Tetto basso e teso, NON bombato
    // - Muso inclinato verso il basso (shark nose), NON alto e piatto
    // - Linea di cintura che sale verso la coda (wedge shape)
    // ═══════════════════════════════════════════════════════════════════════════

    const wheelR  = 22 * s
    const groundY = cy + 32 * s
    const axleY   = groundY - wheelR
    const archR   = 25 * s

    // Interasse lungo, sbalzi corti
    const frontWheelX = cx + 55 * s
    const rearWheelX  = cx - 65 * s

    const frontX = cx + 100 * s
    const rearX  = cx - 95 * s
    const sillY  = groundY - 4 * s

    // ── Punti chiave silhouette (calibrati sul profilo F30) ───────────────────
    //
    // Muso: scende verso il basso (shark nose), punta bassa
    const noseTipX = frontX;           const noseTipY = cy + 12 * s
    const hoodFrontX = cx + 90 * s;   const hoodFrontY = cy + 4 * s

    // Cofano: leggera discesa dal cowl verso il muso (~8° pendenza)
    const cowlX = cx + 14 * s;         const cowlY = cy - 8 * s

    // Parabrezza: molto inclinato (~65° da orizzontale), tipico F30
    const wsTopX = cx + 2 * s;         const wsTopY = cy - 32 * s

    // Tetto: arco teso e basso, picco leggermente avanti rispetto al centro
    const roofPkX = cx - 14 * s;       const roofPkY = cy - 36 * s

    // C-pillar: discesa fluida, tipica 3 volumi
    const cpTopX = cx - 42 * s;        const cpTopY = cy - 28 * s

    // Lunotto: inclinazione media
    const rearWindowBotX = cx - 56 * s; const rearWindowBotY = cy - 16 * s

    // Trunk lid: corto e quasi orizzontale con leggero spoiler lip
    const trunkEndX = cx - 84 * s;     const trunkEndY = cy - 14 * s

    // Coda: troncata, verticale
    const rearTopY = cy - 8 * s

    // ── 1. MUSO — shark nose, scende in avanti ───────────────────────────────
    // Cofano: bezier dal cowl al fronte del cofano con leggera discesa
    addCubicBez(cowlX, cowlY, cx+40*s, cowlY+2*s, cx+70*s, hoodFrontY-4*s, hoodFrontX, hoodFrontY, 0.045, 1.4*s)
    // Punta del muso: dal fronte cofano scende alla punta
    addBez(hoodFrontX, hoodFrontY, frontX-4*s, hoodFrontY+4*s, noseTipX, noseTipY, 0.014, 1.3*s)

    // ── 2. FACCIA ANTERIORE — inclinata, non verticale ───────────────────────
    addBez(noseTipX, noseTipY, frontX+2*s, cy+20*s, frontX-2*s, sillY, 0.016, 1.3*s)

    // ── 3. PARABREZZA — molto inclinato ──────────────────────────────────────
    addLine(cowlX, cowlY, wsTopX, wsTopY, 0.030, 1.4*s)

    // ── 4. TETTO — arco teso e basso ─────────────────────────────────────────
    addCubicBez(wsTopX, wsTopY, cx-4*s, roofPkY-1*s, cx-28*s, roofPkY, cpTopX, cpTopY, 0.038, 1.4*s)

    // ── 5. C-PILLAR + LUNOTTO — discesa fluida ───────────────────────────────
    addBez(cpTopX, cpTopY, cx-48*s, cpTopY+4*s, rearWindowBotX, rearWindowBotY, 0.024, 1.4*s)

    // ── 6. TRUNK LID — quasi orizzontale, leggero spoiler lip ────────────────
    addBez(rearWindowBotX, rearWindowBotY, cx-68*s, rearWindowBotY+1*s, trunkEndX, trunkEndY, 0.022, 1.3*s)

    // ── 7. CODA — troncata ───────────────────────────────────────────────────
    addLine(trunkEndX, trunkEndY, rearX, rearTopY, 0.008, 1.3*s)
    addLine(rearX, rearTopY, rearX, sillY, 0.018, 1.3*s)

    // ── 8. FARI ANTERIORI — blade DRL stile F30, allungati ───────────────────
    const hlY = noseTipY - 4 * s
    addBez(frontX-1*s, hlY, cx+82*s, hlY+1*s, cx+72*s, hlY+3*s, 0.014, 0.8*s)
    // DRL strip inferiore
    addBez(frontX-2*s, hlY+6*s, cx+84*s, hlY+7*s, cx+76*s, hlY+8*s, 0.008, 0.7*s)

    // ── 9. FARI POSTERIORI — barra orizzontale ───────────────────────────────
    const rlY = rearTopY + 4 * s
    addLine(rearX, rlY, rearX+14*s, rlY, 0.006, 1.0*s)
    addLine(rearX, rlY+4*s, rearX+10*s, rlY+4*s, 0.004, 0.8*s)

    // ── 10. SOTTOSCOCCA ──────────────────────────────────────────────────────
    addLine(frontX-2*s, sillY, frontWheelX+archR, sillY, 0.005, 1.3*s)
    addLine(frontWheelX-archR, sillY, rearWheelX+archR, sillY, 0.016, 1.3*s)
    addLine(rearWheelX-archR, sillY, rearX, sillY, 0.006, 1.3*s)

    // ── 11. ARCHI RUOTA — semicerchi puliti ──────────────────────────────────
    for (let i = 0; i < Math.floor(count * 0.032); i++) {
      const a = Math.PI + Math.random()*Math.PI
      points.push({ x: frontWheelX+Math.cos(a)*archR+(Math.random()-0.5)*1.1*s, y: axleY+Math.sin(a)*archR+(Math.random()-0.5)*1.1*s })
    }
    for (let i = 0; i < Math.floor(count * 0.032); i++) {
      const a = Math.PI + Math.random()*Math.PI
      points.push({ x: rearWheelX+Math.cos(a)*archR+(Math.random()-0.5)*1.1*s, y: axleY+Math.sin(a)*archR+(Math.random()-0.5)*1.1*s })
    }

    // ── 12. RUOTE — cerchio esterno + mozzo ──────────────────────────────────
    addRing(frontWheelX, axleY, wheelR, 0.040, 3.5*s)
    addRing(rearWheelX, axleY, wheelR, 0.040, 3.5*s)
    addRing(frontWheelX, axleY, wheelR*0.35, 0.008, 2*s)
    addRing(rearWheelX, axleY, wheelR*0.35, 0.008, 2*s)
    // Razze (linee radiali dentro le ruote)
    for (let wi = 0; wi < 2; wi++) {
      const wx = wi === 0 ? frontWheelX : rearWheelX
      for (let ri = 0; ri < 10; ri++) {
        const a = (ri / 10) * Math.PI * 2
        addLine(wx+Math.cos(a)*wheelR*0.35, axleY+Math.sin(a)*wheelR*0.35,
                wx+Math.cos(a)*wheelR*0.85, axleY+Math.sin(a)*wheelR*0.85, 0.002, 1.0*s)
      }
    }

    // ── 13. LINEA DI CINTURA (character line, sale verso la coda) ────────────
    const beltY0 = cy + 2 * s
    addCubicBez(
      frontWheelX-4*s, beltY0,
      cx+10*s, beltY0-1*s,
      cx-20*s, beltY0-4*s,
      rearWheelX+6*s, beltY0-7*s,
      0.016, 1.0*s
    )

    // ── 14. LINEA DI FIANCATA INFERIORE (attraverso maniglie) ────────────────
    const midLY = cy + 14 * s
    addBez(frontWheelX-2*s, midLY, cx, midLY-1*s, rearWheelX+4*s, midLY-2*s, 0.012, 0.9*s)

    // ── 15. DLO (finestrini) ─────────────────────────────────────────────────
    // A-pillar interno
    addLine(cowlX+4*s, cowlY+4*s, wsTopX+2*s, wsTopY+3*s, 0.014, 1.1*s)
    // Tetto greenhouse
    addCubicBez(wsTopX+2*s, wsTopY+3*s, cx-4*s, roofPkY+3*s, cx-28*s, roofPkY+3*s, cpTopX+4*s, cpTopY+4*s, 0.016, 1.1*s)
    // Hofmeister kink: piccolo kick all'indietro prima di scendere
    const kinkTopX = cpTopX + 4*s;  const kinkTopY = cpTopY + 4*s
    const kinkMidX = cpTopX - 4*s;  const kinkMidY = cpTopY + 10*s
    const kinkBotX = cpTopX - 2*s;  const kinkBotY = rearWindowBotY + 2*s
    addLine(kinkTopX, kinkTopY, kinkMidX, kinkMidY, 0.007, 1.1*s)
    addBez(kinkMidX, kinkMidY, kinkMidX-1*s, kinkMidY+3*s, kinkBotX, kinkBotY, 0.006, 1.1*s)
    // Base DLO (sotto finestrini) — sale leggermente come la cintura
    addBez(cowlX+4*s, cowlY+4*s, cx, beltY0-2*s, kinkBotX, kinkBotY, 0.012, 1.0*s)

    // ── 16. GRIGLIA/KIDNEY (accenno) ─────────────────────────────────────────
    const grilleY = noseTipY + 4*s
    addLine(frontX-6*s, grilleY, frontX-6*s, grilleY+8*s, 0.003, 0.8*s)
    addLine(frontX-10*s, grilleY, frontX-10*s, grilleY+8*s, 0.003, 0.8*s)

    // ── 17. SPARSE — alone di particelle ─────────────────────────────────────
    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x+(Math.random()-0.5)*6*s, y: base.y+(Math.random()-0.5)*6*s })
    }

    return points.slice(0, count)
  }, [])

  // ── 4. MOLECOLA STILIZZATA ───────────────────────────────────────────────────
  const generateMoleculePoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.50
    const cy = h * 0.50
    const s  = Math.min(w, h) * (w < 768 ? 0.0028 : 0.0040)

    const ringRadius   = 48 * s
    const atomR        = 11 * s
    const bondThick    = 3.5 * s
    const NUM_VERTICES = 6

    // Helper: cluster di particelle (atomo)
    const addAtom = (ax: number, ay: number, r: number, weight: number) => {
      const n = Math.floor(count * weight)
      for (let i = 0; i < n; i++) {
        const a   = Math.random() * Math.PI * 2
        const rad = Math.sqrt(Math.random()) * r
        points.push({ x: ax + Math.cos(a) * rad, y: ay + Math.sin(a) * rad })
      }
    }

    // Helper: legame (bond) tra due atomi
    const addBond = (x1: number, y1: number, x2: number, y2: number, halfW: number, weight: number) => {
      const n     = Math.floor(count * weight)
      const angle = Math.atan2(y2 - y1, x2 - x1)
      const perp  = angle + Math.PI / 2
      for (let i = 0; i < n; i++) {
        const t      = Math.random()
        const px     = x1 + (x2 - x1) * t
        const py     = y1 + (y2 - y1) * t
        const offset = (Math.random() - 0.5) * halfW * 2
        points.push({ x: px + Math.cos(perp) * offset, y: py + Math.sin(perp) * offset })
      }
    }

    // ── Anello centrale a 6 termini (benzene-like) ──
    const ringAtoms: { x: number; y: number }[] = []
    for (let i = 0; i < NUM_VERTICES; i++) {
      const a = (i * Math.PI * 2) / NUM_VERTICES - Math.PI / 2
      const ax = cx + Math.cos(a) * ringRadius
      const ay = cy + Math.sin(a) * ringRadius
      ringAtoms.push({ x: ax, y: ay })
      addAtom(ax, ay, atomR, 0.024)
    }

    // Legami del ring
    for (let i = 0; i < NUM_VERTICES; i++) {
      const a = ringAtoms[i]
      const b = ringAtoms[(i + 1) % NUM_VERTICES]
      addBond(a.x, a.y, b.x, b.y, bondThick, 0.026)
    }

    // Doppio legame interno (cerchio concentrico parziale)
    const innerR = ringRadius * 0.56
    for (let i = 0; i < NUM_VERTICES; i++) {
      const a1 = ((i + 0.18) * Math.PI * 2) / NUM_VERTICES - Math.PI / 2
      const a2 = ((i + 0.82) * Math.PI * 2) / NUM_VERTICES - Math.PI / 2
      addBond(
        cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR,
        cx + Math.cos(a2) * innerR, cy + Math.sin(a2) * innerR,
        bondThick * 0.55, 0.010
      )
    }

    // ── Catene laterali ai vertici 0, 2, 4 ──
    const branchLen  = 62 * s
    const branchIdxs = [0, 2, 4]

    for (const idx of branchIdxs) {
      const va = ringAtoms[idx]
      const a  = (idx * Math.PI * 2) / NUM_VERTICES - Math.PI / 2 // angolo dal centro

      // Atomo B (fine della catena primaria)
      const bx = cx + Math.cos(a) * (ringRadius + branchLen)
      const by = cy + Math.sin(a) * (ringRadius + branchLen)
      addBond(va.x, va.y, bx, by, bondThick, 0.022)
      addAtom(bx, by, atomR * 1.25, 0.028)

      // Catena secondaria che si biforca a +60° e −60°
      const sec1Angle = a + Math.PI / 3
      const sec2Angle = a - Math.PI / 3
      const secLen    = 40 * s
      const secAtomR  = atomR * 0.85

      const s1x = bx + Math.cos(sec1Angle) * secLen
      const s1y = by + Math.sin(sec1Angle) * secLen
      addBond(bx, by, s1x, s1y, bondThick * 0.7, 0.013)
      addAtom(s1x, s1y, secAtomR, 0.014)

      const s2x = bx + Math.cos(sec2Angle) * secLen
      const s2y = by + Math.sin(sec2Angle) * secLen
      addBond(bx, by, s2x, s2y, bondThick * 0.7, 0.013)
      addAtom(s2x, s2y, secAtomR, 0.014)
    }

    // Atomo centrale (nucleo)
    addAtom(cx, cy, atomR * 0.7, 0.015)

    // Sparse
    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x + (Math.random() - 0.5) * 28 * s, y: base.y + (Math.random() - 0.5) * 28 * s })
    }

    return points.slice(0, count)
  }, [])

  // ── 4. OROLOGIO DA POLSO (Rolex Submariner style) ───────────────────────────
  const generateWatchPoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.50
    const cy = h * 0.50
    const s  = Math.min(w, h) * (w < 768 ? 0.0028 : 0.0040)

    const addLine = (x1: number, y1: number, x2: number, y2: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        points.push({ x: x1+(x2-x1)*t+(Math.random()-0.5)*thick, y: y1+(y2-y1)*t+(Math.random()-0.5)*thick })
      }
    }
    const addBez = (
      x0: number, y0: number, xc: number, yc: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*x0+2*mt*t*xc+t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*y0+2*mt*t*yc+t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }
    const addDisk = (ox: number, oy: number, r: number, wt: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const a = Math.random()*Math.PI*2; const rr = Math.sqrt(Math.random())*r
        points.push({ x: ox+Math.cos(a)*rr, y: oy+Math.sin(a)*rr })
      }
    }
    const addRing = (ox: number, oy: number, r: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const a = Math.random()*Math.PI*2; const rr = r-thick*0.5+Math.random()*thick
        points.push({ x: ox+Math.cos(a)*rr, y: oy+Math.sin(a)*rr })
      }
    }

    // ── Dimensioni ──────────────────────────────────────────────────────────────
    const caseR  = 52 * s   // raggio cassa
    const bzOR   = 60 * s   // ghiera esterno
    const bzIR   = 50 * s   // ghiera interno
    const dialR  = 44 * s   // quadrante
    const lugW   = 19 * s   // semi-larghezza terminali
    const lugExt = 20 * s   // estensione terminali oltre la cassa
    const brHW   =  6 * s   // semi-larghezza del link centrale bracciale
    const linkH  =  8 * s   // altezza di ogni link
    const nLinks =  6        // righe bracciale per lato
    const lugGap =  0.52     // semi-apertura angolare terminali (rad)

    // ── 1. Cassa ────────────────────────────────────────────────────────────────
    addDisk(cx, cy, caseR, 0.10)
    addRing(cx, cy, caseR, 0.022, 2.5*s)

    // ── 2. Ghiera (bezel) con tacche minuto/ora ─────────────────────────────────
    addRing(cx, cy, (bzOR+bzIR)*0.5, 0.050, bzOR-bzIR)
    for (let i = 0; i < 60; i++) {
      const a   = (i / 60) * Math.PI * 2 - Math.PI / 2
      const big = i % 5 === 0
      const r0  = bzIR + (bzOR-bzIR) * 0.20
      const r1  = bzOR - (bzOR-bzIR) * (big ? 0.08 : 0.38)
      const n   = Math.floor(count * (big ? 0.0028 : 0.0010))
      for (let j = 0; j < n; j++) {
        const r = r0 + Math.random()*(r1-r0)
        points.push({ x: cx+Math.cos(a)*r+(Math.random()-0.5)*s, y: cy+Math.sin(a)*r+(Math.random()-0.5)*s })
      }
    }

    // ── 3. Quadrante ────────────────────────────────────────────────────────────
    addDisk(cx, cy, dialR, 0.060)
    addRing(cx, cy, dialR, 0.010, 1.2*s)

    // ── 4. Indici ore — rettangoli radiali luminescenti ─────────────────────────
    for (let i = 0; i < 12; i++) {
      const angle  = (i / 12) * Math.PI * 2 - Math.PI / 2
      const dist   = dialR * 0.80
      const mx     = cx + Math.cos(angle) * dist
      const my     = cy + Math.sin(angle) * dist
      const perp   = angle + Math.PI / 2
      const big    = i % 3 === 0
      const mLen   = big ? 9*s : 5.5*s
      const mThick = big ? 3.2*s : 2.2*s
      addLine(
        mx + Math.cos(perp)*mLen*0.5, my + Math.sin(perp)*mLen*0.5,
        mx - Math.cos(perp)*mLen*0.5, my - Math.sin(perp)*mLen*0.5,
        big ? 0.008 : 0.004, mThick
      )
    }

    // ── 5. Lancette posizione 10:10 ─────────────────────────────────────────────
    // Ore ~10 o'clock
    const hAngle = -Math.PI/2 - (2/12)*Math.PI*2
    // Minuti ~2 o'clock
    const mAngle = -Math.PI/2 + (2/12)*Math.PI*2

    // Lancetta ore: grossa stile "Mercedes" con finestra luminescente interna
    const hHandLen = dialR * 0.55
    addLine(
      cx - Math.cos(hAngle)*hHandLen*0.12, cy - Math.sin(hAngle)*hHandLen*0.12,
      cx + Math.cos(hAngle)*hHandLen,      cy + Math.sin(hAngle)*hHandLen,
      0.020, 5.5*s
    )
    addLine(
      cx + Math.cos(hAngle)*hHandLen*0.22, cy + Math.sin(hAngle)*hHandLen*0.22,
      cx + Math.cos(hAngle)*hHandLen*0.76, cy + Math.sin(hAngle)*hHandLen*0.76,
      0.004, 2*s
    )

    // Lancetta minuti: lunga, più sottile
    const mHandLen = dialR * 0.88
    addLine(
      cx - Math.cos(mAngle)*mHandLen*0.12, cy - Math.sin(mAngle)*mHandLen*0.12,
      cx + Math.cos(mAngle)*mHandLen,      cy + Math.sin(mAngle)*mHandLen,
      0.016, 4*s
    )
    addLine(
      cx + Math.cos(mAngle)*mHandLen*0.18, cy + Math.sin(mAngle)*mHandLen*0.18,
      cx + Math.cos(mAngle)*mHandLen*0.86, cy + Math.sin(mAngle)*mHandLen*0.86,
      0.003, 1.8*s
    )

    // Perno centrale
    addDisk(cx, cy, 4*s, 0.010)
    addRing(cx, cy, 4*s, 0.003, 1*s)

    // ── 6. Coronella (3 o'clock) ────────────────────────────────────────────────
    const crownBX = cx + caseR + 2*s
    const crownEX = cx + caseR + 14*s
    const crownHH = 5*s
    for (let i = 0; i < Math.floor(count * 0.011); i++) {
      const t    = Math.random()
      const xPos = crownBX + t*(crownEX-crownBX)
      const hw   = crownHH * (0.78 + 0.22*(1-t))
      points.push({ x: xPos+(Math.random()-0.5)*s, y: cy+(Math.random()-0.5)*hw*2 })
    }
    for (let r = 0; r < 6; r++) {
      const rx = crownBX + r*(crownEX-crownBX)/5.5
      addLine(rx, cy - crownHH, rx, cy + crownHH, 0.0016, 0.6*s)
    }

    // ── 7. Terminali (lugs) — top-left, top-right, bottom-left, bottom-right ────
    for (const side of [-1, 1]) {
      const ba  = -Math.PI/2 + side * lugGap
      const bx  = cx + Math.cos(ba) * caseR
      const by  = cy + Math.sin(ba) * caseR
      const tx  = cx + side * lugW
      const ty  = cy - caseR - lugExt
      addBez(bx, by, bx + (tx-bx)*0.28, by + (ty-by)*0.35, tx, ty, 0.014, 3.5*s)
    }
    addLine(cx - lugW, cy - caseR - lugExt, cx + lugW, cy - caseR - lugExt, 0.010, 3*s)

    for (const side of [-1, 1]) {
      const ba  = Math.PI/2 - side * lugGap
      const bx  = cx + Math.cos(ba) * caseR
      const by  = cy + Math.sin(ba) * caseR
      const tx  = cx + side * lugW
      const ty  = cy + caseR + lugExt
      addBez(bx, by, bx + (tx-bx)*0.28, by + (ty-by)*0.35, tx, ty, 0.014, 3.5*s)
    }
    addLine(cx - lugW, cy + caseR + lugExt, cx + lugW, cy + caseR + lugExt, 0.010, 3*s)

    // ── 8. Bracciale Oyster — 3 link: centro largo + 2 laterali stretti ─────────
    const bTopY = cy - caseR - lugExt
    const bBotY = cy + caseR + lugExt

    const drawBracelet = (startY: number, dir: number) => {
      for (let row = 0; row < nLinks; row++) {
        const rowY = startY + dir * row * linkH
        const midY = rowY + dir * linkH * 0.5

        // Link centrale
        for (let i = 0; i < Math.floor(count * 0.0050); i++)
          points.push({ x: cx - brHW + Math.random()*brHW*2, y: midY + (Math.random()-0.5)*linkH*0.80 })
        // Link laterale sinistro
        for (let i = 0; i < Math.floor(count * 0.0024); i++)
          points.push({ x: cx - brHW*3 + Math.random()*brHW*2, y: midY + (Math.random()-0.5)*linkH*0.80 })
        // Link laterale destro
        for (let i = 0; i < Math.floor(count * 0.0024); i++)
          points.push({ x: cx + brHW + Math.random()*brHW*2, y: midY + (Math.random()-0.5)*linkH*0.80 })

        // Bordo orizzontale tra righe
        addLine(cx - brHW*3, rowY, cx + brHW*3, rowY, 0.0022, 0.7*s)
        // Divisori verticali centro/laterali
        addLine(cx - brHW, rowY, cx - brHW, rowY + dir*linkH, 0.0007, 0.5*s)
        addLine(cx + brHW, rowY, cx + brHW, rowY + dir*linkH, 0.0007, 0.5*s)
      }
      // Bordo terminale bracciale
      addLine(cx - brHW*3, startY + dir*nLinks*linkH, cx + brHW*3, startY + dir*nLinks*linkH, 0.0028, 1.5*s)
    }
    drawBracelet(bTopY, -1)
    drawBracelet(bBotY,  1)

    // ── Sparse ────────────────────────────────────────────────────────────────────
    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x+(Math.random()-0.5)*12*s, y: base.y+(Math.random()-0.5)*12*s })
    }

    return points.slice(0, count)
  }, [])

  // ── 5. NAVE — vista frontale, stile icona ───────────────────────────────────
  const generateShipPoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.50
    const cy = h * 0.50
    const s  = Math.min(w, h) * (w < 768 ? 0.0032 : 0.0044)

    const addLine = (x1: number, y1: number, x2: number, y2: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        points.push({ x: x1+(x2-x1)*t+(Math.random()-0.5)*thick, y: y1+(y2-y1)*t+(Math.random()-0.5)*thick })
      }
    }
    const addBez = (
      x0: number, y0: number, xc: number, yc: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*x0+2*mt*t*xc+t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*y0+2*mt*t*yc+t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    //             ┌─┐         ciminiera
    //          ┌──┴─┴──┐      ponte comando
    //       ┌──┴───────┴──┐   cabina
    //      ╱               ╲
    //     ╱    ╲     ╱      ╲  scafo (trapezio con linee V)
    //    ╱      ╲   ╱        ╲
    //     ╲      ╲ ╱        ╱
    //       ╲     V       ╱
    //    ~~~~~~~~~~~~~~~~~~~~~~  onde
    // ═══════════════════════════════════════════════════════════════════════════

    // Dimensioni principali
    const deckW   = 70 * s    // metà larghezza al ponte
    const keelY   = cy + 55 * s   // fondo chiglia
    const deckY   = cy - 10 * s   // livello coperta
    const waveY   = cy + 38 * s   // linea onde

    // ── 1. SCAFO — trapezio con fondo curvo ──────────────────────────────────
    // Lato sinistro (diagonale)
    addLine(cx - deckW, deckY, cx - 18*s, keelY, 0.035, 3*s)
    // Lato destro (diagonale)
    addLine(cx + deckW, deckY, cx + 18*s, keelY, 0.035, 3*s)
    // Fondo curvo
    addBez(cx - 18*s, keelY, cx, keelY + 6*s, cx + 18*s, keelY, 0.025, 3*s)
    // Coperta (linea orizzontale in alto)
    addLine(cx - deckW, deckY, cx + deckW, deckY, 0.030, 3*s)

    // Linee V interne dello scafo (struttura)
    addLine(cx - deckW + 15*s, deckY, cx, keelY - 4*s, 0.020, 2*s)
    addLine(cx + deckW - 15*s, deckY, cx, keelY - 4*s, 0.020, 2*s)
    // Linea verticale centrale (chiglia)
    addLine(cx, deckY, cx, keelY, 0.018, 2*s)

    // Fill scafo
    for (let i = 0; i < Math.floor(count * 0.18); i++) {
      const t = Math.random()
      const yPos = deckY + t * (keelY - deckY)
      // Larghezza si restringe verso il basso
      const halfW = deckW * (1 - t * 0.75)
      const xPos = cx + (Math.random() - 0.5) * 2 * halfW
      points.push({ x: xPos, y: yPos })
    }

    // ── 2. CABINA — rettangolo sopra la coperta ─────────────────────────────
    const cabW   = 48 * s    // metà larghezza cabina
    const cabTop = deckY - 36 * s
    const cabBot = deckY

    addLine(cx - cabW, cabBot, cx - cabW, cabTop, 0.020, 3*s)   // parete sx
    addLine(cx + cabW, cabBot, cx + cabW, cabTop, 0.020, 3*s)   // parete dx
    addLine(cx - cabW, cabTop, cx + cabW, cabTop, 0.025, 3*s)   // tetto
    addLine(cx - cabW, cabBot, cx + cabW, cabBot, 0.010, 2*s)   // base

    // Fill cabina
    for (let i = 0; i < Math.floor(count * 0.10); i++) {
      points.push({
        x: cx + (Math.random() - 0.5) * 2 * cabW,
        y: cabTop + Math.random() * (cabBot - cabTop),
      })
    }

    // Finestre cabina (fascia)
    const winY = cabTop + (cabBot - cabTop) * 0.45
    addLine(cx - cabW + 6*s, winY, cx + cabW - 6*s, winY, 0.020, 5*s)

    // ── 3. PONTE COMANDO — rettangolo più piccolo ───────────────────────────
    const brW   = 30 * s
    const brTop = cabTop - 24 * s
    const brBot = cabTop

    addLine(cx - brW, brBot, cx - brW, brTop, 0.014, 2.5*s)
    addLine(cx + brW, brBot, cx + brW, brTop, 0.014, 2.5*s)
    addLine(cx - brW, brTop, cx + brW, brTop, 0.018, 2.5*s)

    // Fill ponte
    for (let i = 0; i < Math.floor(count * 0.06); i++) {
      points.push({
        x: cx + (Math.random() - 0.5) * 2 * brW,
        y: brTop + Math.random() * (brBot - brTop),
      })
    }

    // Finestra ponte
    addLine(cx - brW + 5*s, brTop + (brBot - brTop) * 0.4, cx + brW - 5*s, brTop + (brBot - brTop) * 0.4, 0.014, 4*s)

    // ── 4. CIMINIERA / FUMAIOLO ─────────────────────────────────────────────
    const chW = 7 * s
    const chTop = brTop - 18 * s
    const chBot = brTop

    addLine(cx - chW, chBot, cx - chW, chTop, 0.008, 2*s)
    addLine(cx + chW, chBot, cx + chW, chTop, 0.008, 2*s)
    addLine(cx - chW, chTop, cx + chW, chTop, 0.008, 2*s)

    // Fill ciminiera
    for (let i = 0; i < Math.floor(count * 0.015); i++) {
      points.push({
        x: cx + (Math.random() - 0.5) * 2 * chW,
        y: chTop + Math.random() * (chBot - chTop),
      })
    }

    // ── 5. ONDE (3 curve sinusoidali) ───────────────────────────────────────
    for (let wave = 0; wave < 3; wave++) {
      const wy = waveY + wave * 8*s
      const waveW = deckW + 16*s + wave * 6*s
      const n = Math.floor(count * 0.018)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        const x = cx - waveW + t * 2 * waveW
        const y = wy + Math.sin(t * Math.PI * 3) * 4*s + (Math.random()-0.5) * 2*s
        points.push({ x, y })
      }
    }

    // ── Sparse ──────────────────────────────────────────────────────────────
    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x+(Math.random()-0.5)*2*s, y: base.y+(Math.random()-0.5)*2*s })
    }

    return points.slice(0, count)
  }, [])


  // ── 6. MOTO GP 500cc (ref: Yamaha YZR500, vista laterale — fronte a DESTRA) ─
  const generateMotorcyclePoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    const cx = w * 0.50
    const cy = h * 0.50
    const s  = Math.min(w, h) * (w < 768 ? 0.0034 : 0.0046)

    // ── Helpers ─────────────────────────────────────────────────────────────
    const addLine = (x1: number, y1: number, x2: number, y2: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        points.push({ x: x1+(x2-x1)*t+(Math.random()-0.5)*thick, y: y1+(y2-y1)*t+(Math.random()-0.5)*thick })
      }
    }
    const addBez = (
      x0: number, y0: number, xc: number, yc: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*x0+2*mt*t*xc+t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*y0+2*mt*t*yc+t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }
    const addCubicBez = (
      x0: number, y0: number, xc1: number, yc1: number, xc2: number, yc2: number, x1: number, y1: number,
      wt: number, thick: number,
    ) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const t = Math.random(); const mt = 1 - t
        points.push({
          x: mt*mt*mt*x0+3*mt*mt*t*xc1+3*mt*t*t*xc2+t*t*t*x1+(Math.random()-0.5)*thick,
          y: mt*mt*mt*y0+3*mt*mt*t*yc1+3*mt*t*t*yc2+t*t*t*y1+(Math.random()-0.5)*thick,
        })
      }
    }
    const addRing = (ox: number, oy: number, r: number, wt: number, thick: number) => {
      const n = Math.floor(count * wt)
      for (let i = 0; i < n; i++) {
        const a = Math.random()*Math.PI*2; const rr = r-thick*0.5+Math.random()*thick
        points.push({ x: ox+Math.cos(a)*rr, y: oy+Math.sin(a)*rr })
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    //  Yamaha YZR500 GP — proporzioni dalla reference:
    //  - Moto ALTA: il cupolino arriva molto sopra le ruote
    //  - Ruote grandi (~30% dell'altezza totale)
    //  - Ampio vuoto sotto la pancia (telaio, motore visibili)
    //  - Codone che RISALE nettamente verso l'alto
    //  - Carenatura integrale con forma a goccia
    //  - Forcellone lungo
    // ═══════════════════════════════════════════════════════════════════════════

    const wheelR  = 26 * s
    const groundY = cy + 42 * s
    const axleY   = groundY - wheelR

    // Ruote — interasse (passo) compatto stile GP
    const rearWX  = cx - 60 * s
    const frontWX = cx + 60 * s

    // ── Altezze chiave ─────────────────────────────────────────────────────
    const cupolinoTopY = cy - 38 * s   // punto più alto cupolino
    const tankTopY     = cy - 32 * s   // cresta serbatoio
    const seatY        = cy - 24 * s   // sella
    const tailTopY     = cy - 28 * s   // codone risale
    const tailTipY     = cy - 20 * s   // punta posteriore codone
    const bellyY       = cy + 8 * s    // bordo inferiore carenatura

    // X di riferimento
    const noseX     = cx + 72 * s    // punta muso
    const steerX    = cx + 40 * s    // cannotto sterzo
    const tankEndX  = cx - 6 * s     // fine serbatoio / inizio sella
    const tailEndX  = cx - 56 * s    // punta codone

    // Pivot forcellone
    const pivotX = cx - 14 * s
    const pivotY = cy + 6 * s

    // ── 1. RUOTE — grandi, con cerchio, mozzo, razze ───────────────────────
    for (let wi = 0; wi < 2; wi++) {
      const wx = wi === 0 ? frontWX : rearWX
      // Pneumatico (anello esterno denso)
      addRing(wx, axleY, wheelR, 0.032, 4.0*s)
      // Cerchio interno
      addRing(wx, axleY, wheelR * 0.82, 0.010, 1.8*s)
      // Mozzo
      addRing(wx, axleY, wheelR * 0.22, 0.006, 2.0*s)
      // Razze (5 triple raggi)
      for (let ri = 0; ri < 5; ri++) {
        const a = (ri / 5) * Math.PI * 2
        addLine(
          wx+Math.cos(a)*wheelR*0.22, axleY+Math.sin(a)*wheelR*0.22,
          wx+Math.cos(a)*wheelR*0.78, axleY+Math.sin(a)*wheelR*0.78,
          0.0018, 1.0*s
        )
      }
      // Disco freno anteriore (più grande)
      if (wi === 0) {
        addRing(wx, axleY, wheelR * 0.58, 0.008, 2.0*s)
      }
    }

    // ── 2. FORCELLA ANTERIORE — steli lunghi e inclinati (~24°) ────────────
    const forkTopX = steerX + 4*s
    const forkTopY = cy - 22*s
    // Stelo sx
    addLine(forkTopX - 4*s, forkTopY, frontWX - 4*s, axleY, 0.016, 2.5*s)
    // Stelo dx
    addLine(forkTopX + 4*s, forkTopY, frontWX + 4*s, axleY, 0.016, 2.5*s)
    // Piastra di sterzo
    addLine(forkTopX - 7*s, forkTopY, forkTopX + 7*s, forkTopY, 0.005, 2.5*s)
    // Piastra inferiore (a metà steli)
    const mfx = (forkTopX + frontWX)*0.5
    const mfy = (forkTopY + axleY)*0.5
    addLine(mfx - 6*s, mfy, mfx + 6*s, mfy, 0.004, 2.0*s)

    // ── 3. CUPOLINO — alto e prominente (stile YZR500) ─────────────────────
    // Il cupolino si estende molto sopra la ruota anteriore
    const noseTopY = cy - 20*s   // parte alta del muso
    const noseBotY = cy + 2*s    // parte bassa del muso

    // Profilo superiore cupolino: dalla punta sale al picco poi scende allo sterzo
    addCubicBez(
      noseX, noseTopY,
      noseX - 8*s, cupolinoTopY,
      steerX + 20*s, cupolinoTopY - 2*s,
      steerX, cupolinoTopY + 4*s,
      0.025, 2.0*s
    )
    // Parabrezza (arco dalla cresta del cupolino al cannotto)
    addBez(steerX, cupolinoTopY + 4*s, steerX - 4*s, cy - 42*s, steerX - 2*s, forkTopY + 2*s, 0.012, 1.5*s)

    // Profilo inferiore cupolino (mento): dalla punta scende, poi curva sotto
    addCubicBez(
      noseX, noseBotY,
      noseX - 14*s, cy + 10*s,
      cx + 42*s, bellyY + 2*s,
      cx + 28*s, bellyY,
      0.020, 2.0*s
    )
    // Chiusura verticale del muso (punta)
    addLine(noseX, noseTopY, noseX, noseBotY, 0.008, 2.0*s)

    // Fill cupolino (zona tra profilo superiore e inferiore)
    for (let i = 0; i < Math.floor(count * 0.07); i++) {
      const t = Math.random()
      const xPos = noseX + (steerX - noseX) * t
      const topAtT = noseTopY + (cupolinoTopY - noseTopY) * Math.sin(t * Math.PI * 0.5)
      const botAtT = noseBotY + (bellyY - noseBotY) * t
      const yPos = topAtT + Math.random() * (botAtT - topAtT)
      points.push({ x: xPos + (Math.random()-0.5)*2*s, y: yPos })
    }

    // Presa d'aria / faro (fessura orizzontale a metà muso)
    const slotY = (noseTopY + noseBotY) * 0.5
    addLine(noseX - 2*s, slotY - 2*s, noseX - 14*s, slotY, 0.006, 1.5*s)
    addLine(noseX - 2*s, slotY + 2*s, noseX - 14*s, slotY, 0.006, 1.5*s)

    // ── 4. SERBATOIO — bombatura alta ──────────────────────────────────────
    // Profilo superiore: dallo sterzo al serbatoio e poi giù alla sella
    addCubicBez(
      steerX - 2*s, forkTopY,
      cx + 24*s, tankTopY - 4*s,
      cx + 8*s, tankTopY,
      tankEndX, seatY,
      0.024, 2.0*s
    )
    // Fill serbatoio
    for (let i = 0; i < Math.floor(count * 0.06); i++) {
      const t = Math.random()
      const xPos = steerX + (tankEndX - steerX) * t
      const topLine = forkTopY + (tankTopY - forkTopY) * Math.sin(t * Math.PI * 0.6)
      const botLine = cy - 10*s
      const yPos = topLine + Math.random() * Math.max(0, botLine - topLine)
      points.push({ x: xPos + (Math.random()-0.5)*3*s, y: yPos })
    }

    // ── 5. CODONE — risale nettamente (stile 500cc GP) ─────────────────────
    // Profilo superiore codone: dalla sella risale e poi riscende alla punta
    addCubicBez(
      tankEndX, seatY,
      cx - 20*s, seatY - 4*s,
      cx - 34*s, tailTopY,
      tailEndX, tailTipY,
      0.022, 2.0*s
    )
    // Profilo inferiore codone: scende verso il basso dalla sella alla punta
    addBez(
      tailEndX, tailTipY,
      cx - 44*s, tailTipY + 10*s,
      cx - 20*s, cy - 8*s,
      0.014, 2.0*s
    )
    // Chiusura verticale punta codone
    addLine(tailEndX, tailTipY, tailEndX, tailTipY + 6*s, 0.004, 1.5*s)

    // Fill codone
    for (let i = 0; i < Math.floor(count * 0.04); i++) {
      const t = Math.random()
      const xPos = tankEndX + (tailEndX - tankEndX) * t
      const topAtT = seatY + (tailTopY - seatY) * Math.sin(t * Math.PI * 0.7)
      const botAtT = cy - 8*s + (tailTipY + 6*s - (cy - 8*s)) * t
      const yPos = topAtT + Math.random() * Math.max(0, botAtT - topAtT)
      points.push({ x: xPos + (Math.random()-0.5)*2*s, y: yPos })
    }

    // ── 6. CARENATURA INFERIORE / PANCIA ───────────────────────────────────
    // Bordo inferiore carenatura: dal muso → ventre → risale dietro il motore
    addCubicBez(
      cx + 28*s, bellyY,
      cx + 10*s, bellyY + 6*s,
      cx - 6*s, bellyY + 4*s,
      cx - 20*s, cy - 2*s,
      0.016, 2.0*s
    )
    // Fill pancia (zona sottile tra serbatoio e ventre)
    for (let i = 0; i < Math.floor(count * 0.04); i++) {
      const t = Math.random()
      const xPos = cx + 28*s + ((cx - 20*s) - (cx + 28*s)) * t
      const yy = cy - 8*s + Math.random() * (bellyY + 4*s - (cy - 8*s))
      points.push({ x: xPos + (Math.random()-0.5)*2*s, y: yy })
    }

    // ── 7. MOTORE — V4 compatto visibile sotto la carenatura ───────────────
    const engL = cx - 8*s; const engR = cx + 18*s
    const engTop = cy + 2*s; const engBot = cy + 24*s
    // Contorno
    addLine(engL, engTop, engR + 2*s, engTop, 0.006, 1.8*s)
    addLine(engR + 2*s, engTop, engR + 6*s, engBot, 0.008, 1.8*s)
    addLine(engR + 6*s, engBot, engL - 4*s, engBot, 0.006, 1.8*s)
    addLine(engL - 4*s, engBot, engL, engTop, 0.006, 1.8*s)
    // Fill
    for (let i = 0; i < Math.floor(count * 0.04); i++) {
      points.push({
        x: engL - 2*s + Math.random() * (engR + 4*s - (engL - 2*s)),
        y: engTop + Math.random() * (engBot - engTop),
      })
    }
    // Cilindri V (due linee diagonali che formano la V)
    const engCX = (engL + engR) * 0.5
    addLine(engCX, engBot, engCX - 10*s, engTop - 6*s, 0.006, 2.5*s)
    addLine(engCX, engBot, engCX + 12*s, engTop - 4*s, 0.006, 2.5*s)

    // ── 8. SCARICO — 4 in 1, esce sotto il motore verso il retro ──────────
    addBez(
      engL - 2*s, engBot,
      cx - 24*s, cy + 30*s,
      cx - 46*s, cy + 20*s,
      0.010, 3.0*s
    )
    // Terminale (ovale)
    addRing(cx - 46*s, cy + 20*s, 4*s, 0.005, 2.0*s)

    // ── 9. FORCELLONE — lungo (tipico GP) ──────────────────────────────────
    // Braccio superiore
    addLine(pivotX, pivotY, rearWX + 2*s, axleY - 3*s, 0.016, 3.0*s)
    // Braccio inferiore
    addLine(pivotX, pivotY + 7*s, rearWX + 2*s, axleY + 3*s, 0.016, 3.0*s)
    // Piastrina assale posteriore
    addRing(rearWX, axleY, 4*s, 0.003, 2.0*s)

    // ── 10. TELAIO — tubi perimetrali visibili ─────────────────────────────
    // Tubo dal cannotto al pivot (diagonale, visibile nella "gola")
    addLine(steerX, forkTopY + 6*s, pivotX, pivotY, 0.010, 2.5*s)
    // Tubo dal cannotto al motore (più verticale)
    addLine(steerX + 4*s, forkTopY + 10*s, engR + 2*s, engBot - 4*s, 0.008, 2.0*s)

    // ── 11. AMMORTIZZATORE POSTERIORE (mono) ───────────────────────────────
    addLine(cx - 20*s, seatY + 6*s, pivotX + 4*s, pivotY + 4*s, 0.005, 2.0*s)

    // ── 12. PARAFANGO ANTERIORE (piccolo arco sopra la ruota) ──────────────
    for (let i = 0; i < Math.floor(count * 0.008); i++) {
      const a = Math.PI + Math.random() * Math.PI  // semicerchio superiore
      const r = wheelR + 4*s
      points.push({ x: frontWX + Math.cos(a)*r + (Math.random()-0.5)*2*s, y: axleY + Math.sin(a)*r + (Math.random()-0.5)*2*s })
    }

    // ── Sparse — alone stretto ─────────────────────────────────────────────
    const sparseCount = count - points.length
    for (let i = 0; i < sparseCount; i++) {
      const base = points[Math.floor(Math.random() * points.length)]
      if (base) points.push({ x: base.x+(Math.random()-0.5)*2.5*s, y: base.y+(Math.random()-0.5)*2.5*s })
    }

    return points.slice(0, count)
  }, [])


  const generateTankPoints = useCallback((w: number, h: number, count: number) => {
    const points: { x: number; y: number }[] = []
    
    // Centriamo la forma nel canvas
    const cx = w * 0.50
    const cy = h * 0.50
    
    // Fattore di scala basato sulla dimensione minore del canvas
    const s = Math.min(w, h) * (w < 768 ? 0.003 : 0.004)

    // Helper per linee dense
    const addDenseLine = (x1: number, y1: number, x2: number, y2: number, pointRatio: number, thick: number) => {
      const n = Math.floor(count * pointRatio)
      for (let i = 0; i < n; i++) {
        const t = Math.random()
        points.push({ 
          x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * thick, 
          y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * thick 
        })
      }
    }

    // Helper per cerchi densi
    const addDenseRing = (centerX: number, centerY: number, radius: number, pointRatio: number, thick: number) => {
      const n = Math.floor(count * pointRatio)
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2
        const r = radius + (Math.random() - 0.5) * thick
        points.push({ x: centerX + Math.cos(ang) * r, y: centerY + Math.sin(ang) * r })
      }
    }

    // Helper per aree rettangolari dense
    const fillDenseRect = (x1: number, y1: number, x2: number, y2: number, pointRatio: number) => {
      const n = Math.floor(count * pointRatio)
      for (let i = 0; i < n; i++) {
        points.push({ 
          x: x1 + Math.random() * (x2 - x1), 
          y: y1 + Math.random() * (y2 - y1) 
        })
      }
    }

    // ── Proporzioni Carro Armato (Solido e basso) ─────────────────────────────
    const groundY     = cy + 30 * s    // Base dei cingoli
    const trackH      = 22 * s         // Altezza cingoli
    const hullH       = 25 * s         // Altezza scafo
    const turretH     = 18 * s         // Altezza torretta
    
    const trackL      = cx - 110 * s   // Estremità sinistra cingoli
    const trackR      = cx + 110 * s   // Estremità destra cingoli
    const hullL       = cx - 95 * s    // Estremità sinistra scafo
    const hullR       = cx + 95 * s    // Estremità destra scafo

    // ── 1. CINGOLI (Treads - 35% dei punti) ──────────────────────────────────
    // Il perimetro ovale dei cingoli
    addDenseLine(trackL, groundY, trackR, groundY, 0.05, 4 * s) // Bottom
    addDenseLine(trackL, groundY - trackH, trackR, groundY - trackH, 0.05, 4 * s) // Top
    
    // Ruote dei cingoli (Bogies - 6 ruote piccole)
    const nBogies = 6
    const bogieR = trackH * 0.35
    const bogieStep = (trackR - trackL - bogieR * 2) / (nBogies - 1)
    for (let i = 0; i < nBogies; i++) {
      const bx = trackL + bogieR + i * bogieStep
      addDenseRing(bx, groundY - trackH * 0.5, bogieR, 0.03, 1.5 * s)
    }

    // ── 2. SCAFO (Hull - 30% dei punti) ─────────────────────────────────────
    // Il corpo principale rettangolare sopra i cingoli
    const hullY = groundY - trackH
    fillDenseRect(hullL, hullY - hullH, hullR, hullY, 0.30)
    
    // Dettagli scafo (Bordi netti per definizione)
    addDenseLine(hullL, hullY - hullH, hullR, hullY - hullH, 0.02, 2 * s) // Top hull

    // ── 3. TORRETTA (Turret - 20% dei punti) ──────────────────────────────────
    // La torretta girevole sopra lo scafo
    const turretY = hullY - hullH
    const turretL = cx - 55 * s
    const turretR = cx + 35 * s
    fillDenseRect(turretL, turretY - turretH, turretR, turretY, 0.20)
    
    // Bordo superiore torretta
    addDenseLine(turretL + 5 * s, turretY - turretH, turretR - 5 * s, turretY - turretH, 0.02, 2 * s)

    // ── 4. CANNONE (Gun Barrel - 10% dei punti) ─────────────────────────────
    // Il lungo cannone che sporge in avanti
    const gunY = turretY - turretH * 0.5
    const gunL = turretR
    const gunR = turretR + 90 * s
    const gunThick = 4 * s
    
    fillDenseRect(gunL, gunY - gunThick * 0.5, gunR, gunY + gunThick * 0.5, 0.10)
    
    // Bordo del cannone
    addDenseLine(gunL, gunY, gunR, gunY, 0.01, 1.5 * s)

    // ── 5. RIFINITURA (Contorni netti) ───────────────────────────────────────
    // Noise minimo per riempire senza sfocare la silhouette iconica
    const currentTotal = points.length
    const diff = count - currentTotal
    for (let i = 0; i < diff; i++) {
      const parent = points[Math.floor(Math.random() * currentTotal)]
      points.push({
        x: parent.x + (Math.random() - 0.5) * 1.3 * s,
        y: parent.y + (Math.random() - 0.5) * 1.3 * s
      })
    }

    return points.slice(0, count)
  }, [])
  
  // ── Lista delle 7 forme ──────────────────────────────────────────────────────
  const shapeGenerators = useCallback((w: number, h: number) => [
    generateShipPoints(w, h, PARTICLE_COUNT),
    generateDNAPoints(w, h, PARTICLE_COUNT),
    generateCarPoints(w, h, PARTICLE_COUNT),
    generateMoleculePoints(w, h, PARTICLE_COUNT),
    generateWatchPoints(w, h, PARTICLE_COUNT),
    generateMotorcyclePoints(w, h, PARTICLE_COUNT),
    generateTankPoints(w, h, PARTICLE_COUNT),
  ], [generateShipPoints, generateDNAPoints, generateMotorcyclePoints, generateCarPoints, generateMoleculePoints, generateWatchPoints, generateTankPoints])

  // ── Inizializzazione particelle ──────────────────────────────────────────────
  const initParticles = useCallback((w: number, h: number) => {
    const shapes  = shapeGenerators(w, h)
    const targets = shapes[0]
    currentTargetsRef.current   = targets
    nextTargetsRef.current      = shapes[1]
    shapeIndexRef.current       = 0
    shapeTimeRef.current        = 0
    isTransitioningRef.current  = false
    transitionProgressRef.current = 0

    // Su mobile i pallini devono essere più piccoli per mantenere
    // la stessa densità percepita del desktop (canvas più piccolo → stessi punti)
    const isMobile   = w < 768
    const sizeBase   = isMobile ? 0.3 : 0.5
    const sizeRange  = isMobile ? 0.9 : 1.8

    particlesRef.current = targets.map((t: { x: number; y: number }) => ({
      tx: t.x, ty: t.y,
      x:  t.x + (Math.random() - 0.5) * w * 0.5,
      y:  t.y + (Math.random() - 0.5) * h * 0.5,
      offsetX: 0, offsetY: 0,
      speed:     0.4 + Math.random() * 0.9,
      phase:     Math.random() * Math.PI * 2,
      amplitude: isMobile ? 1.5 + Math.random() * 3 : 2 + Math.random() * 5,
      size:      sizeBase + Math.random() * sizeRange,
      alpha:     0.3 + Math.random() * 0.7,
    }))
  }, [shapeGenerators])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr    = window.devicePixelRatio || 1
      const parent = canvas.parentElement
      const w = parent ? parent.clientWidth  : window.innerWidth
      const h = parent ? parent.clientHeight : window.innerHeight
      canvas.width  = w * dpr; canvas.height = h * dpr
      canvas.style.width  = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w, h }
      initParticles(w, h)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let time = 0
    lastTimestampRef.current = performance.now()

    const animate = (timestamp: number) => {
      const { w, h } = dimensionsRef.current
      ctx.clearRect(0, 0, w, h)
      time += 0.012

      const deltaMs = timestamp - lastTimestampRef.current
      lastTimestampRef.current = timestamp
      shapeTimeRef.current += deltaMs

      // ── Avvia transizione alla forma successiva ──
      if (!isTransitioningRef.current && shapeTimeRef.current >= SHAPE_DURATION) {
        isTransitioningRef.current    = true
        transitionProgressRef.current = 0
        shapeTimeRef.current          = 0
        const nextIndex = (shapeIndexRef.current + 1) % NUM_SHAPES
        nextTargetsRef.current = shapeGenerators(w, h)[nextIndex]
      }

      if (isTransitioningRef.current) {
        transitionProgressRef.current += deltaMs / TRANSITION_DURATION
        if (transitionProgressRef.current >= 1) {
          transitionProgressRef.current = 1
          isTransitioningRef.current    = false
          shapeTimeRef.current          = 0
          shapeIndexRef.current         = (shapeIndexRef.current + 1) % NUM_SHAPES
          currentTargetsRef.current     = nextTargetsRef.current
          for (let i = 0; i < particlesRef.current.length; i++) {
            const target = currentTargetsRef.current[i]
            if (target) { particlesRef.current[i].tx = target.x; particlesRef.current[i].ty = target.y }
          }
        } else {
          const t    = transitionProgressRef.current
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          for (let i = 0; i < particlesRef.current.length; i++) {
            const cur  = currentTargetsRef.current[i]
            const next = nextTargetsRef.current[i]
            if (cur && next) {
              particlesRef.current[i].tx = cur.x + (next.x - cur.x) * ease
              particlesRef.current[i].ty = cur.y + (next.y - cur.y) * ease
            }
          }
        }
      }

      const mouse       = mouseRef.current
      const mouseRadius = 40
      const particles   = particlesRef.current

      // Centroide + raggio max per gradiente colore
      let centroidX = 0, centroidY = 0
      for (const p of particles) { centroidX += p.tx; centroidY += p.ty }
      centroidX /= particles.length; centroidY /= particles.length
      let maxDist = 0
      for (const p of particles) {
        const d = Math.sqrt((p.tx - centroidX) ** 2 + (p.ty - centroidY) ** 2)
        if (d > maxDist) maxDist = d
      }
      if (maxDist === 0) maxDist = 1

      for (const p of particles) {
        // Fluttuamento organico a tre layer
        const w1x = Math.sin(time * p.speed         + p.phase)           * p.amplitude
        const w1y = Math.cos(time * p.speed * 0.8   + p.phase + 1)       * p.amplitude
        const w2x = Math.sin(time * p.speed * 0.3   + p.phase * 2.7)     * p.amplitude * 1.5
        const w2y = Math.cos(time * p.speed * 0.25  + p.phase * 1.3 + 2.5) * p.amplitude * 1.5
        const w3x = Math.sin(time * p.speed * 3.2   + p.phase * 5.1)     * p.amplitude * 0.3
        const w3y = Math.cos(time * p.speed * 2.8   + p.phase * 4.3)     * p.amplitude * 0.3
        p.offsetX = w1x + w2x + w3x
        p.offsetY = w1y + w2y + w3y

        p.x += (p.tx + p.offsetX - p.x) * 0.06
        p.y += (p.ty + p.offsetY - p.y) * 0.06

        // Repulsione mouse organica
        const dx = p.x - mouse.x; const dy = p.y - mouse.y
        const distSq = dx * dx + dy * dy
        if (distSq < mouseRadius * mouseRadius && distSq > 0) {
          const dist         = Math.sqrt(distSq)
          const noiseRadius  = 0.7 + 0.6 * Math.sin(p.phase * 7.3 + time * 0.5)
          const effectiveNorm = Math.min((dist / mouseRadius) / noiseRadius, 1)
          const forceIntensity = 0.6 + 0.8 * Math.abs(Math.sin(p.phase * 3.7))
          const force        = Math.pow(1 - effectiveNorm, 3) * 12 * forceIntensity
          const angleDeviation = Math.sin(p.phase * 11.1 + time * 1.3) * 0.8 + Math.cos(p.phase * 5.3 - time * 0.7) * 0.4
          const finalAngle   = Math.atan2(dy, dx) + angleDeviation
          p.x += Math.cos(finalAngle) * force
          p.y += Math.sin(finalAngle) * force
        }

        // Colore per distanza dal centro: arancione → violetto → blu
        const normDist = Math.min(
          Math.sqrt((p.tx - centroidX) ** 2 + (p.ty - centroidY) ** 2) / maxDist, 1
        )
        let r: number, g: number, b: number
        if (normDist < 0.25) {
          const t2 = normDist / 0.25
          r = 248 + (130 - 248) * t2; g = 120 + (90 - 120) * t2; b = 40 + (200 - 40) * t2
        } else {
          const t2 = (normDist - 0.25) / 0.75
          r = 130 + (60 - 130) * t2; g = 90 + (140 - 90) * t2; b = 200 + (255 - 200) * t2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${p.alpha})`
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [initParticles, shapeGenerators])

  return (
    <section className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute bottom-0 left-0 inset-0 w-auto h-full" />
    </section>
  )
}
