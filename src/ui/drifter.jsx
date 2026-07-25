/*
 * drifter.jsx — the pilot Drifter, the first finished friend (T5.3b)
 * =============================================================================
 * The FIRST friend assembled end-to-end (design-bible §9c): Kimia's hand-drawn,
 * Inkscape-traced silhouette (drifterSilhouette.js) is here dressed IN CODE with
 * the three things every living thing shares — a texture, the canonical eye, and
 * the intrinsic green glow. It proves the whole recipe the other nine category
 * archetypes (T5.3c) will follow.
 *
 * THE DRIFTER'S RECIPE (Kimia's calls, 2026-07-25):
 *   • Texture  — WISPY HAIR (§8 hair "wispy waves"): long, fine, drifting
 *                strands, leaning into the Drifter's "loose wisp passing through"
 *                read. Drifters are the simplest, lowest rung of the literacy
 *                ladder, so this stays a single quiet surface — complexity climbs
 *                from here (§9c), never brighter colour or stronger glow.
 *   • Eyes     — TWO canonical orbs (eye.jsx), the Drifter baseline. Other
 *                Drifter individuals (T5.3d) vary the count/size UP or down from
 *                this; the eye's DESIGN never changes, only how many and how big.
 *   • Glow     — the one living-thing green (§3, §7), a soft aura behind the
 *                body. Colour never varies between friends; nothing here does but
 *                size and eye count.
 *
 * LAYER ORDER (back → front) — silhouette first, texture second, colour last (§3):
 *   1. GLOW aura   — the silhouette blurred and filled green, sitting behind.
 *   2. BODY base   — the silhouette in an opaque near-black, so the hair reads
 *                    against it and the shape reads on the dark page.
 *   3. HAIR        — the wispy field, CLIPPED to the silhouette so it can never
 *                    redraw the outline, only fill it (§3: texture never defines
 *                    a shape).
 *   4. EYES        — two orbs, drawn last so they sit on top of the fur.
 *
 * WHAT THE CONSUMER MUST PROVIDE (kept out of here so many Drifters can share one
 * copy of each): the hair's support filters live in textures.jsx's <TextureDefs/>,
 * so a <TextureDefs/> must sit in the same <svg>. Everything ELSE this component
 * needs — the eye gradients, the silhouette clip, the glow filter — is emitted by
 * <DrifterDefs/>, namespaced by `prefix` so several Drifters never share ids.
 *
 * COLOURS ARE STAND-INS. TODO(T5.2): move BODY_BASE / GLOW into the CSS
 * design-tokens file as named custom properties, exactly as textures.jsx's
 * TEX_COLORS and eye.jsx's EYE_TOKENS wait to be wired. GLOW deliberately equals
 * the canonical living-thing green so body, eyes and aura read as one light.
 * =============================================================================
 */

import { Eye, EyeDefs } from './eye.jsx'
import { hairField } from './textures.jsx'
import { DRIFTER_SILHOUETTE } from './drifterSilhouette.js'

const { d: SIL_D, transform: SIL_TRANSFORM, viewBox: VB } = DRIFTER_SILHOUETTE

// The native art space the silhouette is drawn in. Re-exported so the workbench
// (and later the game) can frame the Drifter without re-reading the trace.
export const DRIFTER_VIEWBOX = VB

/* -----------------------------------------------------------------------------
 * COLOUR TABLE — TODO(T5.2): replace each value with a design token.
 * --------------------------------------------------------------------------- */
const BODY_BASE = '#0c1a13' // opaque near-black green: the ground the hair sits on
const GLOW = '#63d79c' // canonical living-thing glow-green (matches eye + textures)

// The two eyes (Kimia's call). Positions and radii are in native art units, on
// the Drifter's densest mass; tuned on the workbench. Size is the only per-eye
// variable (§9c), so each is just a centre + radius.
const DRIFTER_EYES = [
  { cx: 80, cy: 60, r: 8 },
  { cx: 95, cy: 58, r: 6.5 },
]

// The wispy field is seeded so a given Drifter always grows the same coat.
const DEFAULT_HAIR_SEED = 71

// Namespaced ids, so two Drifters on one page never fight over a paint id.
const clipId = (prefix) => `${prefix}drifter-clip`
const glowId = (prefix) => `${prefix}drifter-glow`

/* =============================================================================
 * SHARED DEFS — render one <DrifterDefs/> inside the same <svg> as the Drifter
 * that references it (pass the matching `prefix`). Emits the eye gradients, the
 * silhouette clip, and the soft-glow blur. The hair's own support filters come
 * from <TextureDefs/>, which the consumer supplies once for the whole page.
 * =========================================================================== */
export function DrifterDefs({ prefix = '' }) {
  return (
    <>
      <EyeDefs prefix={prefix} />
      {/* clip the hair to the exact traced outline (same transform as the body) */}
      <clipPath id={clipId(prefix)}>
        <path d={SIL_D} transform={SIL_TRANSFORM} />
      </clipPath>
      {/* the intrinsic glow: just a soft blur — the green comes from the fill */}
      <filter id={glowId(prefix)} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4.5" />
      </filter>
    </>
  )
}

/* =============================================================================
 * THE PILOT DRIFTER — <Drifter prefix seed/>. Renders the assembled body into
 * whatever <svg viewBox="0 0 {DRIFTER_VIEWBOX.w} {DRIFTER_VIEWBOX.h}"> holds it.
 * Requires <DrifterDefs prefix/> and <TextureDefs/> in the same SVG.
 * =========================================================================== */
export function Drifter({ prefix = '', seed = DEFAULT_HAIR_SEED }) {
  return (
    <g>
      {/* 1. glow aura — the shape blurred and filled the one green, behind all */}
      <path
        d={SIL_D}
        transform={SIL_TRANSFORM}
        fill={GLOW}
        filter={`url(#${glowId(prefix)})`}
        opacity="0.65"
      />
      {/* 2. body base — opaque ground so the hair reads and the shape reads */}
      <path d={SIL_D} transform={SIL_TRANSFORM} fill={BODY_BASE} />
      {/* 3. wispy hair, clipped to the silhouette (never redraws the outline) */}
      <g clipPath={`url(#${clipId(prefix)})`}>
        {hairField({ mode: 'wispy', x: 0, y: 0, w: VB.w, h: VB.h, seed })}
      </g>
      {/* 4. the two canonical eyes, on top of the coat */}
      {DRIFTER_EYES.map((e, i) => (
        <Eye key={i} cx={e.cx} cy={e.cy} r={e.r} prefix={prefix} />
      ))}
    </g>
  )
}

export default Drifter
