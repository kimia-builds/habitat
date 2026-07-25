/*
 * eye.jsx — the canonical N-Z-D friend eye (design-bible §9c, task T5.3a)
 * =============================================================================
 * ONE designed glowing eye, shared by every friend in the app. Only the NUMBER
 * and SIZE of eyes vary per individual — never the eye's design. It is built
 * once, here, as a reusable <Eye cx cy r/> and placed on each body.
 *
 * THE CHOSEN DESIGN (Kimia's pick, 2026-07-25): the "orb" — a plain glowing
 * eyeball, no pupil. A bright core fading to a green rim, wrapped in a soft
 * green halo, with a single off-centre catch-light so it reads as wet/alive.
 * Picked from five candidates on the DesignPage workbench (orb · slit · ring ·
 * crescent · compound); the orb won for being the simplest and most "just
 * light". The four rejected forms were exploration only and are not kept.
 *
 * DESIGN-BIBLE COMPLIANCE (keep these true):
 *   • Glow is intrinsic to living things and its COLOUR NEVER VARIES (§3, §7).
 *     The eye glows the one living-thing green; nothing about it varies between
 *     friends except size and how many there are.
 *   • Silhouette first, texture/colour last (§3): a round eye reads as a shape
 *     on black before its glow does.
 *   • No shadow (§3, §7). The only light is the eye's own green glow.
 *   • Scales by SIZE alone (§9c): the eye is parameterised purely by centre
 *     (cx, cy) and radius (r); nothing is hard-coded to one size.
 *
 * HOW THE PIECES FIT — an eye paints from two shared gradients (a soft outward
 * halo + the lit body). Those live in <EyeDefs/>, which must sit in the SAME
 * <svg> as the eyes that use it (SVG paint references resolve most reliably
 * within one root). A real friend renders one <EyeDefs/> then all its eyes. If
 * a page shows several SEPARATE eye SVGs, give each its own <EyeDefs prefix="…"/>
 * so their gradient ids never collide — and pass the matching `prefix` to the
 * eye. Default prefix is empty: the plain, canonical ids.
 *
 * COLOURS ARE STAND-INS. TODO(T5.2): once the CSS design-tokens file exists
 * (design-notes §11d), move each EYE_TOKENS value into it as a named custom
 * property and reference var(--…) here — exactly as textures.jsx's TEX_COLORS
 * and sky.jsx's SKY_TOKENS wait to be wired. The green below deliberately
 * matches the organic-texture green so eyes and bodies read as one glow.
 * =============================================================================
 */

/* -----------------------------------------------------------------------------
 * COLOUR TABLE — TODO(T5.2): replace each value with a design token.
 * The eye is organic life, so it stays in the restrained palette + the one
 * canonical green glow (§3). These are the ONLY colours the eye uses.
 * --------------------------------------------------------------------------- */
export const EYE_TOKENS = {
  glow: '#63d79c', // canonical living-thing glow-green (matches TEX_COLORS)
  coreBright: '#eafff4', // pale near-white centre of a lit eye
  coreMid: '#4fb882', // mid green, the eye's body colour toward its rim
}

// The soft halo is drawn at this multiple of the eye's radius, so the glow
// grows with the eye instead of a fixed blur that would swamp small eyes.
const HALO_SCALE = 1.5

// The two gradient ids the eye paints with, optionally namespaced so several
// eye SVGs on one page never share (and fight over) the same id.
const haloId = (prefix) => `${prefix}eye-halo`
const coreId = (prefix) => `${prefix}eye-core`

/* =============================================================================
 * SHARED DEFS — render one <EyeDefs/> inside the same <svg> as the eyes that
 * reference it. objectBoundingBox gradients remap to whatever circle points at
 * them, so ONE pair of gradients serves every eye size in that SVG.
 * =========================================================================== */
export function EyeDefs({ prefix = '' }) {
  const t = EYE_TOKENS
  return (
    <>
      {/* the outward glow: green at the centre, fading to nothing at the rim */}
      <radialGradient id={haloId(prefix)}>
        <stop offset="0%" stopColor={t.glow} stopOpacity="0.55" />
        <stop offset="55%" stopColor={t.glow} stopOpacity="0.18" />
        <stop offset="100%" stopColor={t.glow} stopOpacity="0" />
      </radialGradient>
      {/* the lit body of the eye: bright core → green rim */}
      <radialGradient id={coreId(prefix)}>
        <stop offset="0%" stopColor={t.coreBright} />
        <stop offset="55%" stopColor={t.glow} />
        <stop offset="100%" stopColor={t.coreMid} />
      </radialGradient>
    </>
  )
}

/* =============================================================================
 * THE CANONICAL EYE — <Eye cx cy r/>. Placed once per eye on a friend's body.
 * `prefix` (default '') namespaces the shared gradient ids; pass the same value
 * to the <EyeDefs/> that sits in the eye's SVG.
 *
 *   1. the soft green halo (drawn first, so the eye lands on its own light)
 *   2. the lit body: bright core → green rim
 *   3. a small off-centre catch-light: the spark that makes it read as alive
 * =========================================================================== */
export function Eye({ cx, cy, r, prefix = '' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * HALO_SCALE} fill={`url(#${haloId(prefix)})`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${coreId(prefix)})`} />
      <circle
        cx={cx - r * 0.32}
        cy={cy - r * 0.34}
        r={r * 0.16}
        fill={EYE_TOKENS.coreBright}
        opacity="0.85"
      />
    </g>
  )
}

export default Eye
