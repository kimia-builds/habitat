/*
 * eye.jsx — N-Z-D friend-eye candidates (design-bible §9c, task T5.3a)
 * =============================================================================
 * The FIRST step of the character sub-plan (plan.md T5.3): candidate glowing
 * eyes, drawn in code, for Kimia to eyeball on the DesignPage workbench and
 * pick ONE from. Whichever she chooses becomes "the canonical eye" recorded in
 * design-bible §9c — built once, then placed on every friend; only the NUMBER
 * and SIZE of eyes vary per individual, never the eye's own design.
 *
 * WHAT THIS SESSION DOES vs DOESN'T:
 *   • DOES: offer a spread of eye FORMS to choose between, each a reusable
 *     <Eye cx cy r/> that scales to any body and any size.
 *   • DOESN'T: pick the winner or edit §9c — that is Kimia's call in a
 *     follow-up, once she has looked at these.
 *
 * DESIGN-BIBLE COMPLIANCE (keep these true):
 *   • Glow is intrinsic to living things and its COLOUR NEVER VARIES (§3, §7).
 *     So every candidate here glows the SAME living-thing green — the
 *     candidates differ ONLY in form (silhouette/structure), never in colour
 *     or glow strength. "Variation lives in form" (§3).
 *   • Silhouette first, texture/colour last (§3): each eye reads as a shape on
 *     black before its glow does.
 *   • No shadow (§3, §7). The only light is the eye's own green glow.
 *   • The canonical eye must scale by SIZE alone (§9c) — hence every candidate
 *     is parameterised purely by centre (cx, cy) and radius (r); nothing is
 *     hard-coded to one size.
 *
 * HOW THE PIECES FIT — an eye draws with two shared gradients (a soft outward
 * halo + the lit body). Those live in <EyeDefs/>, which must sit in the SAME
 * <svg> as the eyes that use it (SVG paint references resolve most reliably
 * within one root). A real friend renders one <EyeDefs/> then all its eyes; a
 * page showing MANY separate eye SVGs (the workbench) gives each its own
 * <EyeDefs prefix="…"/> so their gradient ids never collide — pass the matching
 * `prefix` to the eye. Default prefix is empty: the plain, canonical ids.
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
 * canonical green glow (§3). These are the ONLY colours any candidate uses.
 * --------------------------------------------------------------------------- */
export const EYE_TOKENS = {
  glow: '#63d79c', // canonical living-thing glow-green (matches TEX_COLORS)
  coreBright: '#eafff4', // pale near-white centre of a lit eye
  coreMid: '#4fb882', // mid green, the eye's body colour toward its rim
  base: '#0a1712', // near-black green — sockets, pupils, punched holes
}

// Every eye's soft halo is drawn at this multiple of its radius, so the glow
// grows with the eye instead of a fixed blur that would swamp small eyes.
const HALO_SCALE = 1.5

// The two gradient ids an eye paints with, optionally namespaced so many eye
// SVGs on one page never share (and fight over) the same id.
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

// The soft green halo every candidate sits inside. Drawn first so the eye
// shape lands on top of its own light.
function Halo({ cx, cy, r, prefix }) {
  return <circle cx={cx} cy={cy} r={r * HALO_SCALE} fill={`url(#${haloId(prefix)})`} />
}

// A small off-centre catch-light, the one spark of near-white that makes an
// eye read as wet/alive. Shared by the candidates that want it.
function CatchLight({ cx, cy, r }) {
  return (
    <circle
      cx={cx - r * 0.32}
      cy={cy - r * 0.34}
      r={r * 0.16}
      fill={EYE_TOKENS.coreBright}
      opacity="0.85"
    />
  )
}

/* =============================================================================
 * THE CANDIDATES — each a reusable <Eye cx cy r/>. Same glow, different form.
 * `prefix` (default '') namespaces the shared gradient ids; pass the same value
 * to the <EyeDefs/> that sits in the eye's SVG.
 * =========================================================================== */

// 1. ORB — the simplest: a plain glowing eyeball, no pupil. Blobbiest, most
//    "just light". The baseline the others are read against.
export function OrbEye({ cx, cy, r, prefix = '' }) {
  return (
    <g>
      <Halo cx={cx} cy={cy} r={r} prefix={prefix} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${coreId(prefix)})`} />
      <CatchLight cx={cx} cy={cy} r={r} />
    </g>
  )
}

// 2. SLIT — a vertical slit pupil over a green iris (reptile/cat feel). Adds a
//    direction and a watchfulness the orb lacks.
export function SlitEye({ cx, cy, r, prefix = '' }) {
  return (
    <g>
      <Halo cx={cx} cy={cy} r={r} prefix={prefix} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${coreId(prefix)})`} />
      <ellipse cx={cx} cy={cy} rx={r * 0.16} ry={r * 0.78} fill={EYE_TOKENS.base} />
      <CatchLight cx={cx} cy={cy} r={r} />
    </g>
  )
}

// 3. RING — a bright green annulus around a dark centre: the eye as a halo of
//    light, hollow in the middle. Weird, least Earth-animal.
export function RingEye({ cx, cy, r, prefix = '' }) {
  return (
    <g>
      <Halo cx={cx} cy={cy} r={r} prefix={prefix} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${coreId(prefix)})`} />
      <circle cx={cx} cy={cy} r={r * 0.52} fill={EYE_TOKENS.base} />
      <CatchLight cx={cx} cy={cy} r={r} />
    </g>
  )
}

// 4. CRESCENT — most of the eye in shadow, lit only along one sliver, like a
//    heavy lid or a half-closed eye. The calmest, sleepiest option.
export function CrescentEye({ cx, cy, r, prefix = '' }) {
  return (
    <g>
      <Halo cx={cx} cy={cy} r={r} prefix={prefix} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${coreId(prefix)})`} />
      {/* a dark disc, offset up-and-right, carves the lit body down to a
          crescent hugging the lower-left edge */}
      <circle
        cx={cx + r * 0.4}
        cy={cy - r * 0.3}
        r={r * 0.92}
        fill={EYE_TOKENS.base}
      />
    </g>
  )
}

// 5. COMPOUND — one eye packed with tiny lit facets (insect compound eye).
//    Reads as a single eye up close, a textured dome at a glance. The most
//    complex form, for the higher-literacy friends if chosen.
export function CompoundEye({ cx, cy, r, prefix = '' }) {
  // Lay facets on a hex grid and keep only those that fall inside the eye, so
  // the dome edge stays round. Deterministic — same dome every render.
  const step = r * 0.34
  const facetR = step * 0.42
  const facets = []
  for (let row = -3; row <= 3; row++) {
    const fy = cy + row * step
    const xOffset = (row & 1) === 0 ? 0 : step / 2
    for (let col = -3; col <= 3; col++) {
      const fx = cx + col * step + xOffset
      if (Math.hypot(fx - cx, fy - cy) <= r * 0.86) facets.push([fx, fy])
    }
  }
  return (
    <g>
      <Halo cx={cx} cy={cy} r={r} prefix={prefix} />
      <circle cx={cx} cy={cy} r={r} fill={EYE_TOKENS.base} />
      {facets.map(([fx, fy], i) => (
        <circle key={i} cx={fx} cy={fy} r={facetR} fill={`url(#${coreId(prefix)})`} />
      ))}
      {/* faint rim so the dome edge reads even where no facet reaches it */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={EYE_TOKENS.glow}
        strokeWidth={r * 0.08}
        opacity="0.5"
      />
    </g>
  )
}

/* =============================================================================
 * MANIFEST — the candidate eyes, in the order the workbench draws them
 * (simplest → most complex). `Eye` is the reusable <Eye cx cy r/> component.
 * =========================================================================== */
export const EYE_CANDIDATES = [
  { id: 'eye-orb', name: 'orb', Eye: OrbEye },
  { id: 'eye-slit', name: 'slit', Eye: SlitEye },
  { id: 'eye-ring', name: 'ring', Eye: RingEye },
  { id: 'eye-crescent', name: 'crescent', Eye: CrescentEye },
  { id: 'eye-compound', name: 'compound', Eye: CompoundEye },
]

export default EyeDefs
