/*
 * A FLORA, DRAWN FOR REAL (T5.3i, 2026-08-21) — the one component every screen
 * that shows a flora goes through, and the end of the T3.2 placeholder sprig.
 * The twin of Friend.jsx, and deliberately built the same way.
 *
 * It puts together the four things the code knows about a flora, each settled
 * on its own and living in its own file:
 *
 *   the SHAPE  — one of Kimia's four Inkscape traces (floraSilhouettes.js)
 *   the SIZE   — small or large, its place in the one scale the whole cast
 *                shares (floraCanon.js), never a number typed in by hand
 *   the FILL   — one hair texture worn in one of the four colours
 *                (floraFills.js, floraColours.js)
 *   WHICH ONE  — the three above dealt from the save's seed (floraDeal.js)
 *
 * A SCREEN CHOOSES A BASE, NOT A SIZE — the friends' rule, and the same `base`
 * number serves both families. `base` is how much room the LARGEST FRIEND gets
 * on this screen; this component multiplies by the flora canon, so a flora and
 * a friend standing on the same ground are true to each other by construction
 * and there is no way to ask for a flora at a size of your own choosing.
 *
 * THE RECIPE, exactly as Kimia approved it on the workbench on 2026-08-19
 * (design-bible §9a, §3; the build notes are in history.md):
 *   1. the aura — her silhouette, blurred and painted the fill's OWN colour,
 *      because a living thing's light IS its body colour. It is SVG behind the
 *      shape, never a CSS halo around a box;
 *   2. a dark ground in the shape, so the hair reads as the fill itself rather
 *      than as a texture laid on top of a colour;
 *   3. the hair field, clipped to the outline so no strand fringes out past it.
 *
 * ONE HAIR FIELD PER FLORA, GROWN ONCE AND KEPT. Two finds that dealt the same
 * shape and fill are the same one of the 48 and look identical on purpose
 * (floraDeal.js) — so the field for a shape-and-fill pair is generated the first
 * time it is asked for and reused everywhere after. That matters here more than
 * anywhere: a single flora is two to three THOUSAND drawn strands, and the Abode
 * re-renders on every pointer move of a drag. Without this, dragging one plant
 * would regrow every plant on the ground, sixty times a second.
 */

import { floraHeight, floraWidth } from './floraCanon.js'
import { floraFillKey, floraIdentity } from './floraDeal.js'
import { TextureDefs, denseHairField } from './textures.jsx'

// The near-black the hair is grown against — the same ground the fills were
// judged on. Not a token: it is a value inside a drawing, which §11d leaves
// beside the artwork.
const FLORA_GROUND = '#0b0f14'

// The hair modes were tuned on a 110-unit swatch and a strand's LENGTH is fixed
// in drawing units, so dropping a field straight into a trace's own canvas would
// make the fur a different size on every species — the four canvases run 95 to
// 197 units tall. So the hair is grown in its own space that is always this tall
// and then scaled onto the drawing, which makes a strand the same size on screen
// whichever shape wears it.
const HAIR_UNIT = 110

// The blur that makes the aura, as a fraction of the drawing's own width — the
// same fraction the friends use (friend04.jsx: 6.6 on a 391-wide canvas).
const GLOW_FRACTION = 0.017

// Every hair field grown so far, by shape-and-fill. React elements are just
// immutable descriptions, so one field can be rendered in as many places as
// there are flora wearing it.
const FIELDS = new Map()

function hairFor(identity) {
  const key = floraFillKey(identity)
  const grown = FIELDS.get(key)
  if (grown) return grown
  const { silhouette, fill } = identity
  const aspect = silhouette.viewBox.w / silhouette.viewBox.h
  // denseHairField grows the field bigger than the box asked for and repeats it,
  // so the shape is cut from the MIDDLE of a dense field and never wears a thin
  // band across its underside (its own comment has the why). All that is left
  // here is to put it in the drawing's space.
  const field = (
    <g transform={`scale(${silhouette.viewBox.h / HAIR_UNIT})`}>
      {denseHairField({
        mode: fill.mode,
        x: 0,
        y: 0,
        w: HAIR_UNIT * aspect,
        h: HAIR_UNIT,
        seed: 42,
        colour: fill.colour.hex,
      })}
    </g>
  )
  FIELDS.set(key, field)
  return field
}

/*
 * THE SHARED TEXTURE DEFINITIONS. The hair paints itself through two filters
 * from the texture library, so a page that draws any flora must have the
 * library's <defs> in it exactly once. Screens mount this rather than importing
 * textures.jsx themselves — a screen should not have to know that flora are made
 * of hair.
 */
export function FloraDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="texture-defs">
      <TextureDefs />
    </svg>
  )
}

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
  const shape = <path d={d} transform={transform ?? undefined} />

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
      style={{ color: fill.colour.hex }}
      aria-hidden="true"
      {...rest}
    >
      <defs>
        <clipPath id={`${id}-clip`}>{shape}</clipPath>
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={viewBox.w * GLOW_FRACTION} />
        </filter>
      </defs>
      {/* 1. the aura: her shape, blurred, in the fill's own colour */}
      <path
        d={d}
        transform={transform ?? undefined}
        fill={fill.colour.hex}
        opacity="0.8"
        filter={`url(#${id}-glow)`}
      />
      {/* 2. the dark ground the hair is grown against */}
      <path d={d} transform={transform ?? undefined} fill={FLORA_GROUND} />
      {/* 3. the fill itself, clipped so no strand escapes the outline */}
      <g clipPath={`url(#${id}-clip)`}>{hairFor(identity)}</g>
    </svg>
  )
}

export default Flora
