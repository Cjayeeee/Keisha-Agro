import { memo, useId, useMemo } from 'react'

/**
 * Hand-built vector illustration of a dragon fruit (pitaya).
 * Generic botanical artwork used as a brand graphic, NOT a photo of
 * Keisha Agro Farm produce. Real photography lives in <Photo />.
 */

type View = 'whole' | 'cut' | 'flower'
type Props = {
  view?: View
  flesh?: 'red' | 'white'
  className?: string
  title?: string
  seed?: number
  shadow?: boolean
}

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const bractPath = (w: number, h: number) =>
  `M${-w / 2} 0 C${-w / 2} ${-h * 0.42} ${-w * 0.16} ${-h * 0.78} 0 ${-h} C${w * 0.16} ${-h * 0.78} ${w / 2} ${-h * 0.42} ${w / 2} 0 Z`

type Bract = { x: number; y: number; w: number; h: number; a: number }

function buildWhole(seed: number) {
  const r = rng(seed)
  const cx = 200
  const cy = 289
  const rx = 142
  const ry = 177
  const bracts: Bract[] = []
  // crown
  ;[-38, -14, 10, 32].forEach((a, i) =>
    bracts.push({ x: cx - 18 + i * 12, y: 128, w: 40, h: 70 + r() * 10, a }),
  )
  let row = 0
  for (let y = 150; y <= 448; y += 46, row++) {
    const hw = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2))
    const n = Math.max(2, Math.round((hw * 2) / 64))
    const step = (hw * 2) / n
    const pts: Bract[] = []
    for (let i = 0; i <= n; i++) {
      const off = row % 2 ? step / 2 : 0
      let x = -hw + i * step + off
      if (x > hw) continue
      const k = x / (hw || 1)
      const scale = 0.72 + 0.28 * (hw / rx)
      pts.push({
        x: cx + x,
        y: y + Math.abs(k) * -6,
        w: (48 + r() * 10) * scale,
        h: (54 + r() * 18) * scale,
        a: k * 58 + (r() * 10 - 5),
      })
    }
    pts.sort((p, q) => Math.abs(q.x - cx) - Math.abs(p.x - cx))
    bracts.push(...pts)
  }
  return bracts
}

function buildSeeds(seed: number, count: number, cx: number, cy: number, rx: number, ry: number) {
  const r = rng(seed)
  const out: { x: number; y: number; a: number; s: number }[] = []
  while (out.length < count) {
    const x = r() * 2 - 1
    const y = r() * 2 - 1
    const d = x * x + y * y
    if (d > 0.86) continue
    // slightly denser toward centre
    if (r() < d * 0.35) continue
    out.push({ x: cx + x * rx, y: cy + y * ry, a: r() * 180, s: 0.75 + r() * 0.5 })
  }
  return out
}

function DragonFruitBase({ view = 'whole', flesh = 'red', className, title, seed = 7, shadow = true }: Props) {
  const uid = useId().replace(/:/g, '')
  const whole = useMemo(() => buildWhole(seed), [seed])
  // All seeds drawn as ONE path (keeps the DOM small: hundreds of seeds, one node)
  const seedPath = useMemo(
    () =>
      buildSeeds(seed + 3, 380, 200, 240, 128, 160)
        .map(({ x, y, a, s }) => {
          const rx = 2.4 * s
          const ry = 1.5 * s
          return `M${(x - rx).toFixed(1)} ${y.toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} ${a.toFixed(0)} 1 0 ${(2 * rx).toFixed(1)} 0a${rx.toFixed(1)} ${ry.toFixed(1)} ${a.toFixed(0)} 1 0 ${(-2 * rx).toFixed(1)} 0z`
        })
        .join(''),
    [seed],
  )
  const label = title ?? (view === 'flower' ? 'Illustration of a dragon fruit flower' : view === 'cut' ? 'Illustration of a halved dragon fruit' : 'Illustration of a dragon fruit')

  if (view === 'flower') {
    const sepals = Array.from({ length: 16 }, (_, i) => (i / 16) * 360)
    const petals = Array.from({ length: 14 }, (_, i) => (i / 14) * 360 + 13)
    const stamens = Array.from({ length: 48 }, (_, i) => (i / 48) * 360)
    return (
      <svg viewBox="0 0 400 400" className={className} role="img" aria-label={label}>
        <defs>
          <linearGradient id={`sep${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#b7c77a" />
            <stop offset="0.7" stopColor="#d9dd96" />
            <stop offset="1" stopColor="#e8457f" />
          </linearGradient>
          <linearGradient id={`pet${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f3edd9" />
            <stop offset="1" stopColor="#fffdf7" />
          </linearGradient>
        </defs>
        <g transform="translate(200 200)">
          {sepals.map((a) => (
            <path key={a} d={bractPath(30, 186)} transform={`rotate(${a})`} fill={`url(#sep${uid})`} />
          ))}
          {petals.map((a) => (
            <path key={a} d={bractPath(84, 150)} transform={`rotate(${a})`} fill={`url(#pet${uid})`} stroke="#e4dcc5" strokeWidth="1" />
          ))}
          {stamens.map((a) => (
            <line key={a} x1="0" y1="0" x2="0" y2="-46" transform={`rotate(${a})`} stroke="#efe3b0" strokeWidth="1.6" />
          ))}
          <circle r="22" fill="#f1e6b8" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={bractPath(5, 30)} transform={`rotate(${i * 30})`} fill="#c8d784" />
          ))}
        </g>
      </svg>
    )
  }

  if (view === 'cut') {
    const outer = Array.from({ length: 12 }, (_, i) => (i / 12) * 360 + 8)
    return (
      <svg viewBox="0 0 400 480" className={className} role="img" aria-label={label}>
        <defs>
          <linearGradient id={`br${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#c81e5f" />
            <stop offset="0.55" stopColor="#e8457f" />
            <stop offset="0.85" stopColor="#9cb55f" />
            <stop offset="1" stopColor="#c9d77d" />
          </linearGradient>
          <radialGradient id={`fl${uid}`} cx="0.45" cy="0.42" r="0.65">
            {flesh === 'red' ? (
              <>
                <stop offset="0" stopColor="#d81f68" />
                <stop offset="0.8" stopColor="#b7134f" />
                <stop offset="1" stopColor="#9a0f43" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#fffdf8" />
                <stop offset="0.82" stopColor="#f4eee1" />
                <stop offset="1" stopColor="#f2c9d7" />
              </>
            )}
          </radialGradient>
        </defs>
        <g transform="translate(200 240)">
          {outer.map((a, i) => {
            const rad = (a * Math.PI) / 180
            const x = Math.sin(rad) * 128
            const y = -Math.cos(rad) * 162
            return <path key={a} d={bractPath(52, 42 + (i % 3) * 8)} transform={`translate(${x} ${y}) rotate(${a})`} fill={`url(#br${uid})`} />
          })}
        </g>
        <ellipse cx="200" cy="240" rx="148" ry="184" fill="#e52d72" />
        <ellipse cx="200" cy="240" rx="148" ry="184" fill="none" stroke="#a3174f" strokeWidth="3" opacity="0.5" />
        <ellipse cx="200" cy="240" rx="134" ry="168" fill={`url(#fl${uid})`} />
        <path d={seedPath} fill={flesh === 'red' ? '#1a0b11' : '#121512'} />
        <ellipse cx="160" cy="180" rx="60" ry="90" fill="#fff" opacity="0.07" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 400 520" className={className} role="img" aria-label={label}>
      <defs>
        <radialGradient id={`body${uid}`} cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#ff5f98" />
          <stop offset="0.5" stopColor="#e52d72" />
          <stop offset="1" stopColor="#8f0f45" />
        </radialGradient>
        <linearGradient id={`br${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#c81e5f" />
          <stop offset="0.45" stopColor="#ea4a84" />
          <stop offset="0.8" stopColor="#9cb55f" />
          <stop offset="1" stopColor="#cfdc85" />
        </linearGradient>
        <radialGradient id={`gl${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {shadow && <ellipse cx="200" cy="498" rx="120" ry="12" fill="#171b17" opacity="0.14" />}
      <path d="M192 466 q8 18 16 0z" fill="#6f8a4c" />
      <path
        d="M200 112 C290 112 345 200 342 300 C338 400 280 466 200 466 C120 466 62 400 58 300 C55 200 110 112 200 112 Z"
        fill={`url(#body${uid})`}
      />
      {whole.map((b, i) => (
        <path
          key={i}
          d={bractPath(b.w, b.h)}
          transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.a.toFixed(1)})`}
          fill={`url(#br${uid})`}
          stroke="#9e1450"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
      <ellipse cx="150" cy="235" rx="62" ry="96" fill={`url(#gl${uid})`} />
    </svg>
  )
}

export const DragonFruit = memo(DragonFruitBase)
