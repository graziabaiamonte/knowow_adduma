'use client'

import { useRef, useEffect } from 'react'

// ─── Physical constants ────────────────────────────────────────────────────────
// Render at half resolution, CSS scales up → 75 % less pixel work
const W = 160
const H = 240
const DISPLAY_W = 320
const DISPLAY_H = 480

const X_MIN = 176, X_MAX = 208
const Y_MAX = 200

const T_MIN = 31.000
const T_MAX = 33.755

const CX_MM  = 192
const HALF_W = 11

const NOTCH_XL = (CX_MM - HALF_W) + 0.347 * (2 * HALF_W)   // ≈ 188.6 mm
const NOTCH_XR = (CX_MM - HALF_W) + 0.630 * (2 * HALF_W)   // ≈ 194.9 mm
const NOTCH_Y  = 100

const PERIOD = 7000     // ms per animation loop
const N_MAX  = 200000   // max cycles displayed

const CB_H = 440
const CB_W = 14

// ─── Bezier segments — specimen boundary ──────────────────────────────────────
// Each point is [xn, yn] in normalised coordinates

type Pt  = [number, number]
type Seg = [Pt, Pt, Pt, Pt]

const SEG_LEFT: Seg[] = [
  [[0.018,1.000],[0.018,1.000],[0.259,0.841],[0.318,0.687]],
  [[0.318,0.687],[0.340,0.627],[0.340,0.556],[0.340,0.481]],
  [[0.340,0.481],[0.340,0.386],[0.347,0.329],[0.315,0.259]],
  [[0.315,0.259],[0.256,0.129],[0.000,0.000],[0.000,0.000]],
]
const SEG_RIGHT: Seg[] = [
  [[0.969,0.000],[0.969,0.000],[0.667,0.131],[0.643,0.261]],
  [[0.643,0.261],[0.630,0.328],[0.638,0.374],[0.638,0.468]],
  [[0.638,0.468],[0.638,0.540],[0.673,0.635],[0.708,0.693]],
  [[0.708,0.693],[0.762,0.784],[1.000,1.000],[1.000,1.000]],
]

// ─── Inferno colormap stops [t, r, g, b] ──────────────────────────────────────
const INF: [number, number, number, number][] = [
  [0.000,   0,   0,   4],
  [0.130,  40,  11,  84],
  [0.258, 101,  21, 110],
  [0.387, 159,  42,  99],
  [0.516, 212,  72,  66],
  [0.645, 245, 125,  21],
  [0.774, 250, 193,  39],
  [0.903, 252, 244, 147],
  [1.000, 252, 255, 164],
]

// ─── Pure helpers ──────────────────────────────────────────────────────────────


function inferno(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t))
  let i = 0
  while (i < INF.length - 2 && INF[i + 1][0] < t) i++
  const [t0, r0, g0, b0] = INF[i]
  const [t1, r1, g1, b1] = INF[i + 1]
  const f = (t - t0) / (t1 - t0)
  return [(r0 + f * (r1 - r0)) | 0, (g0 + f * (g1 - g0)) | 0, (b0 + f * (b1 - b0)) | 0]
}

function gauss(x: number, y: number, cx: number, cy: number, rx: number, ry: number): number {
  return Math.exp(-((x - cx) ** 2 / (2 * rx * rx) + (y - cy) ** 2 / (2 * ry * ry)))
}

function temperature(mmX: number, mmY: number, phase: number, nt: number): number {
  const base =
    T_MIN + 1.1 + 0.15 * (mmY / Y_MAX) -
    0.22 * Math.pow((mmY - NOTCH_Y) / NOTCH_Y, 2)

  const ni = (T_MAX - T_MIN - 0.3) * 0.5 * Math.pow(phase, 0.6)
  const hNL   = ni * gauss(mmX, mmY, NOTCH_XL, NOTCH_Y, 2.5, 3)
  const hNR   = ni * gauss(mmX, mmY, NOTCH_XR, NOTCH_Y, 2.5, 3)

  const bi    = (T_MAX - T_MIN - 0.8) * Math.max(0, phase - 0.45) * 1.8
  const hBand = bi * gauss(mmX, mmY, CX_MM, NOTCH_Y, 3, 5)

  const hHalo    = ni * 0.55 * gauss(mmX, mmY, CX_MM, NOTCH_Y, 7, 9)
  const gaugeW   = 0.4 * Math.min(phase * 2, 1) * gauss(mmX, mmY, CX_MM, NOTCH_Y, 3, 35)
  const noise    = 0.04 * Math.sin(nt * 3.1 + mmX * 0.4) * Math.cos(nt * 2.3 + mmY * 0.3)

  return base + hNL + hNR + hBand + hHalo + gaugeW + noise
}

// ─── Axis tick data (static, derived from constants) ──────────────────────────
const Y_TICKS = [200, 175, 150, 125, 100, 75, 50, 25, 0]

const specL = CX_MM - HALF_W
const specR = CX_MM + HALF_W
const X_TICKS = [170, 180, 190, 200, 210, 220].map((label) => ({
  label,
  leftPct: ((specL + (label - 170) / (220 - 170) * (specR - specL) - X_MIN) / (X_MAX - X_MIN)) * 100,
}))

const CB_LABELS = Array.from({ length: 10 }, (_, i) => {
  const frac = 1 - i / 9
  return (T_MIN + frac * (T_MAX - T_MIN)).toFixed(3)
})

// ─── Component ────────────────────────────────────────────────────────────────

interface ThermalChartProps {
  /** When false the rAF loop is paused — saves ~150 k pixel calcs / frame */
  active?: boolean
}

export default function ThermalChart({ active = true }: ThermalChartProps) {
  const mainRef   = useRef<HTMLCanvasElement>(null)
  const cbRef     = useRef<HTMLCanvasElement>(null)
  const badgeRef  = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number>(0)
  const renderRef = useRef<((ts: number) => void) | null>(null)

  useEffect(() => {
    const mainCanvas = mainRef.current
    const cbCanvas   = cbRef.current
    if (!mainCanvas || !cbCanvas) return

    const ctxOrNull   = mainCanvas.getContext('2d')
    const cbCtx       = cbCanvas.getContext('2d')
    if (!ctxOrNull || !cbCtx) return
    // Assign to a const so TypeScript keeps the non-null type inside closures
    const ctx = ctxOrNull

    // Offscreen canvas — pixel data is written here, then composited with a
    // smooth bezier clip path so the specimen boundary is anti-aliased.
    const offCanvas = document.createElement('canvas')
    offCanvas.width  = W
    offCanvas.height = H
    const offCtx = offCanvas.getContext('2d')!

    // Pre-build the specimen clip path (normalised → pixel coords)
    function buildSpecimenPath() {
      ctx.beginPath()
      ctx.moveTo(SEG_LEFT[0][0][0] * W, SEG_LEFT[0][0][1] * H)
      for (const [, p1, p2, p3] of SEG_LEFT)
        ctx.bezierCurveTo(p1[0]*W, p1[1]*H, p2[0]*W, p2[1]*H, p3[0]*W, p3[1]*H)
      // bridge top-left → top-right
      ctx.lineTo(SEG_RIGHT[0][0][0] * W, SEG_RIGHT[0][0][1] * H)
      for (const [, p1, p2, p3] of SEG_RIGHT)
        ctx.bezierCurveTo(p1[0]*W, p1[1]*H, p2[0]*W, p2[1]*H, p3[0]*W, p3[1]*H)
      ctx.closePath()
    }


    // ── 2. Precompute per-pixel mm coordinates ────────────────
    const mmXArr = new Float32Array(W * H)
    const mmYArr = new Float32Array(W * H)

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const mmX = X_MIN + (x / W) * (X_MAX - X_MIN)
        const mmY = Y_MAX - (y / H) * Y_MAX          // canvas Y flipped
        const idx = y * W + x
        mmXArr[idx] = mmX
        mmYArr[idx] = mmY
      }
    }

    // ── 3. Draw colorbar (static, drawn once) ──────────────────
    const cbImg = cbCtx.createImageData(CB_W, CB_H)
    for (let i = 0; i < CB_H; i++) {
      const frac = 1 - i / (CB_H - 1)
      const [r, g, b] = inferno(frac)
      for (let x = 0; x < CB_W; x++) {
        const off = (i * CB_W + x) * 4
        cbImg.data[off]     = r
        cbImg.data[off + 1] = g
        cbImg.data[off + 2] = b
        cbImg.data[off + 3] = 255
      }
    }
    cbCtx.putImageData(cbImg, 0, 0)

    // ── 4. Animation loop ──────────────────────────────────────
    // All pixels are written (including outside the specimen) — the bezier
    // clip path applied during compositing produces smooth anti-aliased edges.
    const imgData = offCtx.createImageData(W, H)
    const px      = imgData.data
    let startMs: number | null = null

    function render(ts: number) {
      if (!startMs) startMs = ts
      const loopT = ((ts - startMs) % PERIOD) / PERIOD
      const phase = loopT < 0.6 ? loopT / 0.6 : 1 - (loopT - 0.6) / 0.4
      const nt    = ts * 0.001

      // Update cycle badge directly — no React re-render
      if (badgeRef.current) {
        badgeRef.current.textContent = 'N = ' + Math.round(phase * N_MAX).toLocaleString('en-US')
      }

      // Fill every pixel with temperature colour (mask applied via clip path below)
      for (let i = 0; i < W * H; i++) {
        const off = i * 4
        const temp = temperature(mmXArr[i], mmYArr[i], phase, nt)
        const frac = (temp - T_MIN) / (T_MAX - T_MIN)
        const [r, g, b] = inferno(frac)
        px[off]     = r
        px[off + 1] = g
        px[off + 2] = b
        px[off + 3] = 255
      }

      // Write to offscreen, then composite onto main canvas with smooth clip
      offCtx.putImageData(imgData, 0, 0)

      ctx.clearRect(0, 0, W, H)
      ctx.save()
      buildSpecimenPath()
      ctx.clip()
      ctx.drawImage(offCanvas, 0, 0)
      ctx.restore()

      rafRef.current = requestAnimationFrame(render)
    }

    // Don't start the loop here — the active-dependent effect below controls it
    renderRef.current = render

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start / stop rAF based on `active` prop ────────────────────────────────
  useEffect(() => {
    if (active && renderRef.current) {
      rafRef.current = requestAnimationFrame(renderRef.current)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="font-mono select-none"
      style={{
        fontSize: 10,
        letterSpacing: '0.05em',
        color: 'rgba(180,210,255,0.45)',
        background: 'rgba(6, 9, 28, 0.28)',
        backdropFilter: 'blur(120px)',
        WebkitBackdropFilter: 'blur(120px)',
        padding: 10,
        position: 'relative',
      }}
    >
      {/* Corner brackets */}
      {(['top-left','top-right','bottom-left','bottom-right'] as const).map((pos) => {
        const isTop    = pos.startsWith('top')
        const isLeft   = pos.endsWith('left')
        return (
          <span
            key={pos}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: 14,
              height: 14,
              top:    isTop    ?  6 : undefined,
              bottom: !isTop   ?  6 : undefined,
              left:   isLeft   ?  6 : undefined,
              right:  !isLeft  ?  6 : undefined,
              borderTop:    isTop    ? '1.5px solid #E9704D' : undefined,
              borderBottom: !isTop   ? '1.5px solid #E9704D' : undefined,
              borderLeft:   isLeft   ? '1.5px solid #E9704D' : undefined,
              borderRight:  !isLeft  ? '1.5px solid #E9704D' : undefined,
            }}
          />
        )
      })}
      {/* Viewer row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '14px 14px 14px 0',
        }}
      >

        {/* ── Y-axis ── */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
          {/* Rotated label */}
          <div
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              color: 'rgba(180,210,255,0.32)',
              letterSpacing: '1.5px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              padding: '0 2px',
              height: DISPLAY_H,
              marginTop: 20,
            }}
          >
            y [mm]
          </div>
          {/* Tick values */}
          <div style={{ position: 'relative', width: 28, height: DISPLAY_H, marginTop: 20 }}>
            {Y_TICKS.map((v) => (
              <span
                key={v}
                style={{
                  position: 'absolute',
                  right: 4,
                  top: `${((Y_MAX - v) / Y_MAX) * 100}%`,
                  transform: 'translateY(-50%)',
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* ── Main canvas + X-axis ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {/* Cycle counter — updated directly via DOM ref */}
          <div
            ref={badgeRef}
            style={{
              color: 'rgba(255,180,80,0.85)',
              fontSize: 11,
              letterSpacing: 1,
              padding: '0 4px 4px',
              height: 20,
            }}
          >
            N = 0
          </div>

          {/* Thermal canvas — buffer at half res, CSS scales to display size */}
          <canvas
            ref={mainRef}
            width={W}
            height={H}
            style={{ display: 'block', borderRadius: 2, width: DISPLAY_W, height: DISPLAY_H, imageRendering: 'auto' }}
          />

          {/* X ticks */}
          <div style={{ position: 'relative', width: DISPLAY_W, height: 16, marginTop: 4 }}>
            {X_TICKS.map(({ label, leftPct }) => (
              <span
                key={label}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* X label */}
          <div
            style={{
              color: 'rgba(180,210,255,0.32)',
              letterSpacing: '1.5px',
              textAlign: 'center',
              paddingTop: 2,
              width: DISPLAY_W,
            }}
          >
            x [mm]
          </div>
        </div>

        {/* ── Colorbar ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 3,
            paddingLeft: 12,
            paddingTop: 20,
          }}
        >
          <div style={{ color: 'rgba(200,220,255,0.62)', paddingLeft: 18 }}>°C</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 5 }}>
            <canvas
              ref={cbRef}
              width={CB_W}
              height={CB_H}
              style={{ display: 'block', borderRadius: 2 }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'rgba(200,220,255,0.62)',
                lineHeight: 1,
              }}
            >
              {CB_LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtitle */}
      <div
        style={{
          color: 'rgba(120,160,210,0.45)',
          fontSize: 11,
          letterSpacing: '1.5px',
          textAlign: 'center',
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          paddingBottom: 4,
        }}
      >
        Notched specimen — fatigue loading simulation
      </div>
    </div>
  )
}
