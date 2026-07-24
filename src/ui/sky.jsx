/*
 * sky.jsx — N-Z-D environment sky assets (design-bible §11a)
 * =============================================================================
 * Sibling of textures.jsx: built in an asset session, merged in this T5.3
 * coding session. Both skies land on the DesignPage workbench first (spec §5b,
 * design-bible §11a step d) for the eyeball pass; wiring them into the real
 * screens comes AFTER Kimia has tuned them there:
 *   • the shared NightSky as the app-shell background is part of the M5 layout
 *     pass (T5.2, design-notes §13c) — not this session;
 *   • AbodeSky moves onto the real Abode screen in a later T5.3 step.
 *
 * TWO assets live here, and the design bible treats them differently:
 *
 *   1. <NightSky/>  — the SHARED night sky, everywhere by default. Per §11a it is
 *      a PURE-CSS star layer (design-notes §13c): near-black, very subtle
 *      brightness variation, white stars only (specks → a few gems), twinkling
 *      that is RARE and UNSYNCHRONISED. NOT an image asset. ANIMATED (slow blink).
 *
 *   2. <AbodeSky palette=…/> — the Abode EXCEPTION (§11a, 2026-07-24). A SEPARATE
 *      asset: realistic clouds + nebulae, the SAME COMPOSITION every time, in
 *      four interchangeable colour palettes. STATIC — no animation, ever.
 *
 * DESIGN-BIBLE COMPLIANCE (keep these true):
 *   • Stars are WHITE ONLY, never coloured (§3). Keep it so.
 *   • Neither sky may compete with the POP — nebula colours stay MUTED; bright
 *     neon is reserved for drops/reveals/milestones (spec §7).
 *   • Night sky twinkle is the ONLY motion here and it is momentary/calm — no
 *     motion on the Abode sky.
 *   • prefers-reduced-motion disables the twinkle (handled in the CSS below).
 *
 * COLOURS ARE STAND-INS. TODO(T5.2): once the CSS design-tokens file exists
 * (design-notes §11d), move each SKY_TOKENS value into it as a named custom
 * property and reference var(--…) here — exactly as textures.jsx's TEX_COLORS
 * waits to be wired. Kept as JS stand-ins for now (Kimia's call 2026-07-24):
 * that file is the unbuilt T5.2 task, and this merge stays inside T5.3.
 * =============================================================================
 */

import { useMemo, Fragment } from 'react'

/* -----------------------------------------------------------------------------
 * COLOUR / TIMING TABLE  —  TODO(T5.2): replace each value with a design token.
 * --------------------------------------------------------------------------- */
export const SKY_TOKENS = {
  // shared night sky
  nightTop: '#10151f', // TODO token: faint upper-middle brightness
  nightMid: '#0a0e16', // TODO token
  nightBot: '#05070a', // TODO token: near-black base
  starWhite: '#ffffff', // stars are white ONLY
  twinkleMinS: 8, // slowest-safe blink (seconds)
  twinkleMaxS: 14,
  // Abode sky — four palettes: [baseTop, baseBot, nebulaA, nebulaB, nebulaC, cloud]
  abodePalettes: {
    ember: ['#1a0f14', '#0a0608', '#7a4450', '#835231', '#4a3350', '#2a2430'],
    teal: ['#08161a', '#04090c', '#245f5f', '#2f6f5b', '#2b4c66', '#24343a'],
    violet: ['#150f22', '#08060e', '#4f3a76', '#71406b', '#363363', '#2a2740'],
    ash: ['#12161b', '#070a0d', '#3d4855', '#4e4a44', '#323d48', '#2e353c'],
  },
}

// Deterministic RNG → stable star fields (identical every render/reload).
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* =============================================================================
 * 1. NIGHT SKY — shared, pure-CSS star layer, slow unsynchronised twinkle.
 *
 * The twinkle is a CSS @keyframes opacity fade. Each twinkling gem gets its own
 * duration + a negative delay (inline vars) so they never blink in lockstep =
 * "rare and unsynchronised". Only a few gems twinkle; specks stay steady.
 *
 * Usage:  <NightSky/>   (fills its positioned parent; put it lowest in the tree)
 * =========================================================================== */
export function NightSky({
  seed = 20260724,
  specks = 220,
  mids = 34,
  gems = 11,
  twinklers = 7,
}) {
  const t = SKY_TOKENS
  const stars = useMemo(() => {
    const rng = mulberry32(seed)
    const U = (a, b) => a + rng() * (b - a)
    const out = []
    const push = (kind, sizeR, opR) =>
      out.push({
        kind,
        left: U(0, 100),
        top: U(0, 100),
        size: U(...sizeR),
        op: U(...opR),
      })
    for (let i = 0; i < specks; i++) push('speck', [0.5, 1.3], [0.25, 0.7])
    for (let i = 0; i < mids; i++) push('mid', [1.3, 2.1], [0.55, 0.9])
    for (let i = 0; i < gems; i++) push('gem', [2.4, 3.6], [0.85, 1])
    // assign twinkle to the first N gems, each with its own timing
    let assigned = 0
    for (const s of out) {
      if (s.kind === 'gem' && assigned < twinklers) {
        s.dur = U(t.twinkleMinS, t.twinkleMaxS)
        s.delay = -U(0, t.twinkleMaxS)
        assigned++
      }
    }
    return out
    // t.twinkleMin/MaxS are module-constant stand-ins; the star field only
    // needs to rebuild when the counts/seed change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, specks, mids, gems, twinklers])

  return (
    <div className="nzd-night-sky" aria-hidden="true">
      <style>{`
        .nzd-night-sky { position: absolute; inset: 0; overflow: hidden;
          background: radial-gradient(140% 100% at 50% 22%, ${t.nightTop} 0%, ${t.nightMid} 46%, ${t.nightBot} 100%); }
        .nzd-night-sky .s { position: absolute; border-radius: 50%; background: ${t.starWhite}; }
        .nzd-night-sky .gem { box-shadow: 0 0 4px rgba(255,255,255,.85), 0 0 9px rgba(255,255,255,.45); }
        @keyframes nzd-twinkle { 0%,100% { opacity: 1; } 50% { opacity: .22; } }
        .nzd-night-sky .tw { animation: nzd-twinkle var(--dur) ease-in-out infinite; animation-delay: var(--delay); }
        @media (prefers-reduced-motion: reduce) { .nzd-night-sky .tw { animation: none; } }
      `}</style>
      {stars.map((s, i) => (
        <div
          key={i}
          className={
            's' + (s.kind === 'gem' ? ' gem' : '') + (s.dur ? ' tw' : '')
          }
          style={{
            left: s.left.toFixed(3) + '%',
            top: s.top.toFixed(3) + '%',
            width: s.size.toFixed(2) + 'px',
            height: s.size.toFixed(2) + 'px',
            opacity: s.op.toFixed(2),
            ...(s.dur
              ? { '--dur': s.dur.toFixed(1) + 's', '--delay': s.delay.toFixed(1) + 's' }
              : {}),
          }}
        />
      ))}
    </div>
  )
}

/* =============================================================================
 * 2. ABODE SKY — static clouds + nebulae, four interchangeable palettes.
 *
 * Composition is FIXED: the feTurbulence seeds and the star field never change,
 * so every palette shows the exact same shapes — only the colour differs. SVG
 * because it renders identically forever (no randomness at runtime).
 *
 * Usage:  <AbodeSky palette="ember" />   // 'ember' | 'teal' | 'violet' | 'ash'
 * =========================================================================== */

// Fixed nebula layers (baseFrequency, octaves, seed, alphaGain, alphaBias, blur).
const ABODE_NEB = [
  ['0.007 0.010', 5, 11, 1.25, -0.34, 7],
  ['0.012 0.017', 5, 27, 1.15, -0.3, 5],
  ['0.021 0.030', 4, 42, 1.05, -0.28, 3.5],
]
const ABODE_CLOUD = ['0.010 0.013', 6, 5, 0.9, -0.42, 6]
const AB_W = 440,
  AB_H = 300 // composition space (scales via preserveAspectRatio)

function NebulaFilter({ id, params, tint }) {
  const [bf, oc, seed, gain, bias, blur] = params
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={bf}
        numOctaves={oc}
        seed={seed}
        stitchTiles="stitch"
        result="n"
      />
      <feColorMatrix
        in="n"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${gain} 0 0 0 ${bias}`}
        result="m"
      />
      <feFlood floodColor={tint} result="c" />
      <feComposite in="c" in2="m" operator="in" result="cc" />
      <feGaussianBlur in="cc" stdDeviation={blur} />
    </filter>
  )
}

export function AbodeSky({ palette = 'ember', seed = 99 }) {
  const [top, bot, nA, nB, nC, cloud] =
    SKY_TOKENS.abodePalettes[palette] || SKY_TOKENS.abodePalettes.ember
  const tints = [nA, nB, nC]
  const uid = `ab-${palette}`

  const stars = useMemo(() => {
    const rng = mulberry32(seed)
    const U = (a, b) => a + rng() * (b - a)
    const specks = [],
      gems = []
    for (let i = 0; i < 80; i++)
      specks.push({
        x: U(6, AB_W - 6),
        y: U(6, AB_H - 6),
        r: U(0.5, 1.4),
        o: U(0.25, 0.75),
      })
    for (let i = 0; i < 6; i++)
      gems.push({
        x: U(20, AB_W - 20),
        y: U(20, AB_H - 20),
        r: U(1.8, 2.8),
        o: U(0.7, 0.95),
      })
    return { specks, gems }
  }, [seed])

  return (
    <svg
      viewBox={`0 0 ${AB_W} ${AB_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Abode sky, ${palette}`}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bot} />
        </linearGradient>
        <radialGradient id={`${uid}-vign`} cx="50%" cy="45%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
        <filter id={`${uid}-gem`} x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        {ABODE_NEB.map((p, i) => (
          <NebulaFilter key={i} id={`${uid}-neb${i}`} params={p} tint={tints[i]} />
        ))}
        <NebulaFilter id={`${uid}-cloud`} params={ABODE_CLOUD} tint={cloud} />
      </defs>

      <g style={{ isolation: 'isolate' }}>
        <rect width={AB_W} height={AB_H} fill={`url(#${uid}-bg)`} />
        {ABODE_NEB.map((_, i) => (
          <rect
            key={i}
            width={AB_W}
            height={AB_H}
            filter={`url(#${uid}-neb${i})`}
            style={{ mixBlendMode: 'screen' }}
          />
        ))}
        <rect
          width={AB_W}
          height={AB_H}
          filter={`url(#${uid}-cloud)`}
          style={{ mixBlendMode: 'screen' }}
          opacity="0.7"
        />
        {stars.specks.map((s, i) => (
          <circle
            key={`s${i}`}
            cx={s.x.toFixed(1)}
            cy={s.y.toFixed(1)}
            r={s.r.toFixed(2)}
            fill="#fff"
            opacity={s.o.toFixed(2)}
          />
        ))}
        {stars.gems.map((s, i) => (
          <Fragment key={`g${i}`}>
            <circle
              cx={s.x.toFixed(1)}
              cy={s.y.toFixed(1)}
              r={(s.r + 1.4).toFixed(2)}
              fill="#fff"
              opacity={(s.o * 0.5).toFixed(2)}
              filter={`url(#${uid}-gem)`}
            />
            <circle
              cx={s.x.toFixed(1)}
              cy={s.y.toFixed(1)}
              r={s.r.toFixed(2)}
              fill="#fff"
              opacity={s.o.toFixed(2)}
            />
          </Fragment>
        ))}
        <rect width={AB_W} height={AB_H} fill={`url(#${uid}-vign)`} />
      </g>
    </svg>
  )
}

/* =============================================================================
 * 3. MANIFEST — environment sky assets (design-bible §11a). ABODE_PALETTES is
 * the palette order the workbench draws (also the four allowed `palette` values).
 * =========================================================================== */
export const ABODE_PALETTES = Object.keys(SKY_TOKENS.abodePalettes)

export const SKY_ASSETS = [
  {
    id: 'night-sky',
    name: 'shared night sky',
    kind: 'css-layer',
    animated: true,
    use: '<NightSky/> — lowest background layer, everywhere',
  },
  {
    id: 'abode-sky',
    name: 'Abode sky',
    kind: 'svg',
    animated: false,
    use: "<AbodeSky palette='ember|teal|violet|ash'/> — Abode screen",
  },
]

export default NightSky
