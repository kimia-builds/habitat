/*
 * eye.jsx — the canonical N-Z-D friend eye (design-bible §9c, task T5.3a)
 * =============================================================================
 * ONE designed glowing eye, shared by every friend in the app. Only the NUMBER
 * and SIZE of eyes vary per individual — never the eye's design. It is built
 * once, here, as a reusable <Eye cx cy r/> and placed on each body.
 *
 * THE CHOSEN DESIGN (Kimia's pick, 2026-07-25): the "orb" — a plain glowing
 * eyeball, no pupil. A bright core fading to its rim, with a single off-centre
 * catch-light so it reads as wet/alive. Picked from five candidates on the
 * DesignPage workbench (orb · slit · ring · crescent · compound); the orb won
 * for being the simplest and most "just light". The four rejected forms were
 * exploration only and are not kept.
 *
 * THE COLOUR RULE (Kimia's call, 2026-07-25, T5.3b — REVERSES the earlier
 * "eyes glow the one green" rule): the eye is ALWAYS YELLOW, on every friend,
 * set in a DARK ("blackish") halo — not a bright bloom but a dark socket that
 * makes the yellow dot pop off the body. The body carries its OWN colour (which
 * varies per friend) and its glow matches that body colour; the eyes stay a
 * fixed yellow accent that, by rule, always differs from the body colour. So
 * the eye's colours never change between friends — only its SIZE and NUMBER do.
 *
 * DESIGN-BIBLE COMPLIANCE (keep these true):
 *   • The eye is one shared design (§9c): only size and number vary per friend,
 *     never its colour or the dark-halo treatment.
 *   • Silhouette first, texture/colour last (§3): a round eye reads as a shape
 *     before its colour does.
 *   • No shadow (§3, §7): the dark halo is the eye's own socket, not a cast shadow.
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
 * and sky.jsx's SKY_TOKENS wait to be wired.
 * =============================================================================
 */

/* -----------------------------------------------------------------------------
 * COLOUR TABLE — TODO(T5.2): replace each value with a design token.
 * The eye is ALWAYS yellow, in a dark halo, on every friend (Kimia's rule,
 * T5.3b). These are the ONLY colours the eye uses, and they never vary.
 * --------------------------------------------------------------------------- */
export const EYE_TOKENS = {
  haloDark: '#04050b', // the dark "blackish" halo — a socket, not a bright bloom
  coreBright: '#fff7d4', // pale warm centre of the lit orb (and its catch-light)
  coreMid: '#ffcf1e', // the yellow body of the eye
  rim: '#e0a400', // deeper amber at the very rim, so the orb has a little depth
}

// The dark halo is drawn at this multiple of the eye's radius, so the socket
// grows with the eye instead of a fixed size that would swamp small eyes.
const HALO_SCALE = 2

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
      {/* the dark socket: near-black at the centre, fading to nothing at the rim,
          so the body darkens just around the eye and the yellow dot pops */}
      <radialGradient id={haloId(prefix)}>
        <stop offset="0%" stopColor={t.haloDark} stopOpacity="0.72" />
        <stop offset="55%" stopColor={t.haloDark} stopOpacity="0.3" />
        <stop offset="100%" stopColor={t.haloDark} stopOpacity="0" />
      </radialGradient>
      {/* the lit body of the eye: pale-warm core → yellow → amber rim */}
      <radialGradient id={coreId(prefix)}>
        <stop offset="0%" stopColor={t.coreBright} />
        <stop offset="55%" stopColor={t.coreMid} />
        <stop offset="100%" stopColor={t.rim} />
      </radialGradient>
    </>
  )
}

/* =============================================================================
 * THE CANONICAL EYE — <Eye cx cy r/>. Placed once per eye on a friend's body.
 * `prefix` (default '') namespaces the shared gradient ids; pass the same value
 * to the <EyeDefs/> that sits in the eye's SVG.
 *
 *   1. the dark socket-halo (drawn first, so the eye lands in its own darkening)
 *   2. the lit body: pale-warm core → yellow → amber rim
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
