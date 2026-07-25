/*
 * drifter.jsx — the pilot Drifter, the first finished friend (T5.3b)
 * =============================================================================
 * The FIRST friend assembled end-to-end (design-bible §9c): Kimia's hand-drawn,
 * Inkscape-traced silhouette (drifterSilhouette.js) is here dressed IN CODE with
 * the three things a friend now carries — a texture, the canonical eye, and an
 * intrinsic glow in its own body colour. It proves the whole recipe the other
 * nine category archetypes (T5.3c) will follow.
 *
 * THE DRIFTER'S RECIPE (Kimia's calls, 2026-07-25):
 *   • Texture  — SPONGE (§8), tinted to the Drifter's body colour. A porous,
 *                holey, weird surface on the plain silhouette (no hair — the
 *                traced outline is kept as-is). Drifters are the simplest,
 *                lowest rung, so this stays a single quiet surface — complexity
 *                climbs from here (§9c), never brighter colour or stronger glow.
 *   • Body     — DEEP BLUE. Each friend has its OWN body colour (Kimia's rule,
 *                T5.3b); the Drifter's is a deep blue. The intrinsic glow behind
 *                the body matches that body colour.
 *   • Eyes     — TWO canonical orbs (eye.jsx), tiny — almost dots. Eyes are
 *                ALWAYS YELLOW in a dark socket (the shared eye), and by rule
 *                always a different colour from the body. Two is the Drifter
 *                baseline; other individuals (T5.3d) vary the count/size, never
 *                the eye's colour.
 *
 * LAYER ORDER (back → front) — silhouette first, texture second, colour last (§3):
 *   1. GLOW aura   — the silhouette blurred and filled the body colour, behind.
 *   2. BODY base   — the silhouette in an opaque dark blue, so the sponge holes
 *                    fall back to a dark ground and the shape reads on the page.
 *   3. SPONGE      — the tinted sponge, self-clipped to the silhouette by the
 *                    filter (it never redraws the outline, only fills it — §3).
 *   4. EYES        — two tiny yellow orbs, drawn last so they sit on top.
 *
 * WHAT THE CONSUMER MUST PROVIDE: nothing shared — <DrifterDefs prefix/> emits
 * everything this component references (the eye gradients, the glow blur, and
 * the Drifter's own tinted sponge filter), namespaced by `prefix` so several
 * Drifters never share ids. (No dependency on <TextureDefs/> anymore, since the
 * sponge is emitted here in the body colour rather than the library's green.)
 *
 * COLOURS ARE STAND-INS. TODO(T5.2): move the body colours into the CSS
 * design-tokens file as named custom properties, exactly as textures.jsx's
 * TEX_COLORS and eye.jsx's EYE_TOKENS wait to be wired.
 * =============================================================================
 */

import { Eye, EyeDefs } from './eye.jsx'
import { SpongeFilter } from './textures.jsx'
import { DRIFTER_SILHOUETTE } from './drifterSilhouette.js'

const { d: SIL_D, transform: SIL_TRANSFORM, viewBox: VB } = DRIFTER_SILHOUETTE

// The native art space the silhouette is drawn in. Re-exported so the workbench
// (and later the game) can frame the Drifter without re-reading the trace.
export const DRIFTER_VIEWBOX = VB

/* -----------------------------------------------------------------------------
 * COLOUR TABLE — TODO(T5.2): replace each value with a design token.
 * The Drifter's body colour is a DEEP BLUE (its own colour, per Kimia's rule).
 * The eyes are yellow — that lives in the shared eye (eye.jsx), never here — and
 * by rule the body colour is never that yellow.
 * --------------------------------------------------------------------------- */
const BODY_GLOW = '#2f66d8' // deep-blue aura: the glow matches the body colour
const SPONGE_LIGHT = '#3d6ad0' // the sponge's lit surface tint → reads deep blue
const BODY_BASE = '#0a1430' // opaque dark blue: the ground the sponge holes fall to

// The two eyes (Kimia's call), tiny — almost dots. Positions/radii are in native
// art units, on the Drifter's densest mass; tuned on the workbench. Size is the
// only per-eye variable (§9c), so each is just a centre + radius.
const DRIFTER_EYES = [
  { cx: 80, cy: 60, r: 3 },
  { cx: 93, cy: 58, r: 2.5 },
]

// Namespaced ids, so two Drifters on one page never fight over a paint id.
const glowId = (prefix) => `${prefix}drifter-glow`
const spongeId = (prefix) => `${prefix}drifter-sponge`

/* =============================================================================
 * SHARED DEFS — render one <DrifterDefs/> inside the same <svg> as the Drifter
 * that references it (pass the matching `prefix`). Emits everything the Drifter
 * paints with: the eye gradients, the soft-glow blur, and the Drifter's own
 * body-coloured sponge filter. Self-contained — no <TextureDefs/> needed.
 * =========================================================================== */
export function DrifterDefs({ prefix = '' }) {
  return (
    <>
      <EyeDefs prefix={prefix} />
      {/* the intrinsic glow: just a soft blur — the colour comes from the fill */}
      <filter id={glowId(prefix)} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4.5" />
      </filter>
      {/* the body's sponge, tinted the Drifter's own deep blue */}
      <SpongeFilter id={spongeId(prefix)} light={SPONGE_LIGHT} />
    </>
  )
}

/* =============================================================================
 * THE PILOT DRIFTER — <Drifter prefix/>. Renders the assembled body into
 * whatever <svg viewBox="0 0 {DRIFTER_VIEWBOX.w} {DRIFTER_VIEWBOX.h}"> holds it.
 * Requires <DrifterDefs prefix/> in the same SVG.
 * =========================================================================== */
export function Drifter({ prefix = '' }) {
  return (
    <g>
      {/* 1. glow aura — the shape blurred and filled the body colour, behind all */}
      <path
        d={SIL_D}
        transform={SIL_TRANSFORM}
        fill={BODY_GLOW}
        filter={`url(#${glowId(prefix)})`}
        opacity="0.6"
      />
      {/* 2. body base — opaque dark-blue ground so the sponge holes read dark */}
      <path d={SIL_D} transform={SIL_TRANSFORM} fill={BODY_BASE} />
      {/* 3. the tinted sponge (self-clips to the silhouette via the filter) */}
      <path d={SIL_D} transform={SIL_TRANSFORM} fill="#000" filter={`url(#${spongeId(prefix)})`} />
      {/* 4. the two tiny yellow eyes, drawn last so they sit on top */}
      {DRIFTER_EYES.map((e, i) => (
        <Eye key={i} cx={e.cx} cy={e.cy} r={e.r} prefix={prefix} />
      ))}
    </g>
  )
}

export default Drifter
