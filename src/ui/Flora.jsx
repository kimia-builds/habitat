/*
 * A FLORA, DRAWN FOR REAL (T5.3i, 2026-08-21; made a plain fill in T5.3k,
 * 2026-10-08) — the one component every screen that shows a flora goes
 * through. The twin of Friend.jsx, and deliberately built the same way.
 *
 * It puts together the four things the code knows about a flora, each settled
 * on its own and living in its own file:
 *
 *   the SHAPE  — one of Kimia's four Inkscape traces (floraSilhouettes.js)
 *   the SIZE   — small or large, its place in the one scale the whole cast
 *                shares (floraCanon.js), never a number typed in by hand
 *   the FILL   — one of six colours, plain (floraFills.js, floraColours.js)
 *   WHICH ONE  — the three above dealt from the save's seed (floraDeal.js)
 *
 * A SCREEN CHOOSES A BASE, NOT A SIZE — the friends' rule, and the same `base`
 * number serves both families. `base` is how much room the LARGEST FRIEND gets
 * on this screen; this component multiplies by the flora canon, so a flora and
 * a friend standing on the same ground are true to each other by construction
 * and there is no way to ask for a flora at a size of your own choosing.
 *
 * THE RECIPE (Kimia, 2026-10-08; design-bible §9a). A flora is drawn like a
 * frontier region on the Map — a light fill and a stronger outline, both in
 * its own colour — with one change she made on the spot: the fill is OPAQUE.
 *   1. the aura — her silhouette, blurred and painted the flora's OWN colour,
 *      because a living thing's light IS its body colour. It is SVG behind the
 *      shape, never a CSS halo around a box;
 *   2. a near-black ground in the shape, so no star of the nebula behind shows
 *      through the body;
 *   3. the colour laid over that ground at the Map's frontier strengths, with
 *      the outline on top.
 */

import { floraHeight, floraWidth } from './floraCanon.js'
import { floraFillKey, floraIdentity } from './floraDeal.js'

// The near-black ground under the colour — the same ground the fills were
// judged on. Not a token: it is a value inside a drawing, which §11d leaves
// beside the artwork.
const FLORA_GROUND = '#0b0f14'

// The Map's frontier region, which a flora is drawn like (index.css
// .map-region-frontier): a light fill, a strong outline, and an outline 1.2px
// thick. Values inside a drawing, so they stay beside it (§11d).
const FILL_OPACITY = 0.16
const OUTLINE_OPACITY = 0.85
const OUTLINE_PX = 1.2

// The blur that makes the aura, as a fraction of the drawing's own width — the
// same fraction the friends use (friend04.jsx: 6.6 on a 391-wide canvas).
const GLOW_FRACTION = 0.017

/**
 * How much room this find needs, for a caller that has to place it — the Abode
 * stands its flora on a ground line, so it needs the height before it can say
 * where the top goes. Same deal, same answer as <Flora> itself.
 */
export function floraBox(completionId, worldSeed, base) {
  const { silhouette, sizeClass } = floraIdentity(completionId, worldSeed)
  return {
    width: floraWidth(sizeClass, silhouette, base),
    height: floraHeight(sizeClass, base),
  }
}

/**
 * `completionId` the completion that dropped this find — which flora it is
 * `worldSeed`    this save's seed; the two together deal shape, size and fill
 * `base`         how much room the LARGEST FRIEND gets on this screen
 * `unit`         the unit `base` is in — '' for a drawing's own units (inside
 *                another svg, which is how the Abode draws), or 'rem'
 * `x` / `y`      the top-left corner, when this sits inside another svg
 * `idPrefix`     what makes this drawing's internal svg ids its own. Two flora
 *                on one page sharing an id would have one silently borrow the
 *                other's clip or glow, so every caller passes something that
 *                says where on the page this one is.
 * `className`    extra classes for the svg
 *
 * Nothing is drawn rather than something wrong being drawn: an unknown find
 * cannot happen (every deal lands on one of the four shapes), so there is no
 * empty case to handle here.
 */
function Flora({
  completionId,
  worldSeed,
  base,
  unit = '',
  x,
  y,
  idPrefix = '',
  className = '',
  ...rest
}) {
  const identity = floraIdentity(completionId, worldSeed)
  const { silhouette, sizeClass, fill } = identity
  const { viewBox, d, transform } = silhouette
  const id = `flora-${idPrefix}${floraFillKey(identity)}`.replace(/\|/g, '-')
  // Kimia's trace, never redrawn — the transform is Inkscape's own and is kept
  // rather than folded into the coordinates, because folding it in would mean
  // editing her drawing.

  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      x={x}
      y={y}
      width={`${floraWidth(sizeClass, silhouette, base)}${unit}`}
      height={`${floraHeight(sizeClass, base)}${unit}`}
      className={className}
      // A FLORA CARRIES ITS OWN COLOUR as currentColor, so a stylesheet can
      // light one — a held plant's lift, say — in the plant's own light without
      // knowing which of the four it was dealt. §3: a living thing's glow is
      // its body colour, never a colour applied on top.
      style={{ color: fill.hex }}
      aria-hidden="true"
      {...rest}
    >
      <defs>
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={viewBox.w * GLOW_FRACTION} />
        </filter>
      </defs>
      {/* 1. the aura: her shape, blurred, in the fill's own colour */}
      <path
        d={d}
        transform={transform ?? undefined}
        fill={fill.hex}
        opacity="0.8"
        filter={`url(#${id}-glow)`}
      />
      {/* 2. the opaque dark ground: nothing behind shows through the body */}
      <path d={d} transform={transform ?? undefined} fill={FLORA_GROUND} />
      {/* 3. the colour over it, and the outline. The outline is a fixed
          number of SCREEN pixels whatever the trace's size — the four
          drawings are different sizes, so a drawing-unit width would be a
          different line on each. */}
      <path
        d={d}
        transform={transform ?? undefined}
        fill={fill.hex}
        fillOpacity={FILL_OPACITY}
        stroke={fill.hex}
        strokeOpacity={OUTLINE_OPACITY}
        strokeWidth={OUTLINE_PX}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default Flora
