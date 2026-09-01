/*
 * A CURIOSITY, DRAWN FOR REAL (T5.3j, opened 2026-09-01) — the market objects,
 * and the third member of the family Friend.jsx and Flora.jsx started.
 *
 * It puts together the three things the code knows about an object, each
 * settled on its own and living in its own file:
 *
 *   the SIZE     — its place in the one scale all three families share
 *                  (objectCanon.js), never a number typed in by hand
 *   the OUTLINE  — a wobbled shape, because "the lines should not be dead
 *                  straight but rather hand-drawn" (handDrawn.js)
 *   the SURFACE  — one texture from the library, worn in this object's own
 *                  colour (textures.jsx, and the recipes below)
 *
 * A SCREEN CHOOSES A BASE, NOT A SIZE — the friends' rule and the flora's, kept
 * here too. `base` is how much room the LARGEST FRIEND gets on this screen, so
 * an object, a plant and a visitor standing on one ground are true to each other
 * by construction and there is no way to ask for an object at a size of your own.
 *
 * DESIGN-BIBLE §10a, which this answers to: objects are "less blobbish than
 * living things — the line between made and grown"; their colour is "the
 * broadest palette in the app; each object may own its own distinct colours";
 * they "may glow or not (no obligation)"; and their size range is wide, with
 * price correlating directly with physical size.
 *
 * WHERE IT IS UP TO. This is a WORKBENCH asset (spec §5b): the shapes stand on
 * the design-assets shelf to be judged, and they replace ObjectGlyph.jsx's
 * placeholder line-drawings on the stall and in the Abode only once Kimia has
 * passed them. The pool is 64 objects (§10a); these are the first of them, and
 * Kimia's list is explicitly not exhaustive.
 */

import { objectDrawnBox, objectSize } from './objectCanon.js'
import { wobblyEllipse, wobblyRect } from './handDrawn.js'
import { BarkFilter, SunkenPoresFilter } from './textures.jsx'

/*
 * THE RECIPES. One entry per object: how its outline is built, and what surface
 * it wears. Kimia describes an object in a sentence — "10x60px and 40x300px
 * rectangular columns which are dark brown with bark texture (but twist the
 * bark texture by 90 degrees so the lines fall vertical rather than
 * horizontal)... curve the edges rather than having sharp corners" — and an
 * entry here is that sentence, written down.
 *
 * Colours live beside the drawings, the call design-notes §11d settled and the
 * one floraColours.js and friendPalettes.js already keep: the tokens file holds
 * what the STYLESHEET wears, and no CSS rule reads these.
 */

/*
 * THE CORNER — "curve the edges rather than having sharp corners" (Kimia,
 * 2026-09-01). A FRACTION of the narrow side rather than a fixed number of
 * units, because a corner is part of the SHAPE and the shape is what she gave
 * two sizes of. A fixed radius was tried first and looked wrong: it rounded the
 * 10-wide column into a full capsule while leaving the 40-wide one visibly
 * square, so the pair read as two different objects rather than two sizes of
 * one. (The texture and the wobble below go the other way, and deliberately —
 * see objectCanon.js. Surface is drawn by a hand and stays one size; shape is
 * the thing itself and scales with it.)
 */
const COLUMN_CORNER = 0.35

/*
 * THE WOBBLE — "the lines should not be dead straight but rather hand-drawn."
 * In drawing units, so the same hand shows on every object: one number for the
 * whole set, not one per family, because two curiosities standing on the same
 * ground were drawn by the same person on the same day (handDrawn.js).
 *
 * CAPPED AT A TENTH OF THE NARROW SIDE, though, which is the one place the
 * hand has to give way. A deviation that reads as a drawn line on a 40-wide
 * column is a quarter of the width of a 10-wide one, and a stick that thin
 * would stop being a column and start being a squiggle. So the cap: full hand
 * where there is room for it, a proportionally quieter one where there is not.
 */
const OBJECT_WOBBLE = 2.5
const WOBBLE_CAP = 0.1

// The wobble this box actually gets — see OBJECT_WOBBLE for the cap's reason.
function wobbleFor({ w, h }, amp) {
  return Math.min(amp, Math.min(w, h) * WOBBLE_CAP)
}

// Both columns are the same drawing rule at two sizes — which is what makes
// them a pair, even though Kimia's two are not the same proportions.
function columnOutline(box, seed) {
  return wobblyRect({
    ...box,
    r: Math.min(box.w, box.h) * COLUMN_CORNER,
    seed,
    amp: wobbleFor(box, OBJECT_WOBBLE),
  })
}

/*
 * THE DISCS — "200x150px and 400x300px oval discs, orange, with pore texture."
 * One shape at two sizes, which is what the two columns are NOT: both are 4:3,
 * so the large disc is the small one enlarged, the way a large flora is a small
 * one enlarged (objectCanon.js).
 *
 * They share a seed for that reason. The two outlines still are not the same
 * curve traced twice, and deliberately: the hand is a SIZE (see above), so the
 * larger disc carries the same little deviations across twice the distance and
 * comes out the calmer of the two — a bigger thing drawn by the same hand,
 * rather than a photograph of the small one blown up.
 */
function ovalOutline(box, seed) {
  return wobblyEllipse({
    ...box,
    seed,
    amp: wobbleFor(box, OBJECT_WOBBLE),
  })
}

const RECIPES = {
  'column-thin': {
    outline: columnOutline,
    surface: 'bark-vertical',
    seed: 41,
  },
  'column-tall': {
    outline: columnOutline,
    surface: 'bark-vertical',
    seed: 77,
  },
  'oval-small': {
    outline: ovalOutline,
    surface: 'pores-sunken',
    seed: 23,
  },
  'oval-large': {
    outline: ovalOutline,
    surface: 'pores-sunken',
    seed: 23,
  },
}

/*
 * THE SURFACES the recipes name. A surface is a filter to render into the
 * page's <defs> plus the id to hang on the shape — the sponge's arrangement
 * (textures.jsx), because a curiosity wears its OWN colour rather than the
 * library's default green.
 *
 * `glow: false` throughout so far: §7 lets an artificial object glow or not,
 * and a dark brown column that lit itself up would read as alive.
 */
const BROWN = '#8a5c3a'

/*
 * The discs' orange: a bright tangerine (Kimia's pick of three, 2026-09-01).
 * Bright, but not neon — spec §7 keeps neon for POP moments, and this is a
 * thing that simply sits on the ground being orange.
 *
 * It is a LIGHTING colour, so what lands on screen is this hex dimmed by how
 * the surface faces the light: the flat of the disc comes out close to it, and
 * the inside of a pit much darker, which is what makes a pit look sunken.
 */
const TANGERINE = '#ff9445'

const SURFACES = {
  'bark-vertical': {
    glow: false,
    colour: BROWN,
    Filter: ({ id }) => <BarkFilter id={id} light={BROWN} turn="vertical" />,
  },
  // Pores worn as pits rather than as raised bumps — Kimia's call when asked
  // how they should read on a solid disc (textures.jsx says how it is done).
  'pores-sunken': {
    glow: false,
    colour: TANGERINE,
    Filter: ({ id }) => <SunkenPoresFilter id={id} light={TANGERINE} />,
  },
}

export function curiosityRecipe(key) {
  return RECIPES[key]
}

/**
 * The <defs> a page needs before it can draw these — one filter per surface any
 * of the objects on it actually uses. Screens mount this rather than importing
 * textures.jsx themselves: a screen should not have to know that a column is
 * made of bark.
 *
 * `keys` the objects this page draws, so a page pays only for what it shows.
 */
export function CuriosityDefs({ keys }) {
  const used = [
    ...new Set(keys.map((key) => RECIPES[key]?.surface).filter(Boolean)),
  ]
  return (
    <svg width="0" height="0" aria-hidden="true" className="texture-defs">
      <defs>
        {used.map((name) => {
          const { Filter } = SURFACES[name]
          return <Filter key={name} id={`curio-${name}`} />
        })}
      </defs>
    </svg>
  )
}

/**
 * `objectKey`  which curiosity — a key in objectCanon.js
 * `base`       how much room the LARGEST FRIEND gets on this screen
 * `unit`       the unit `base` is in — '' for a drawing's own units (inside
 *              another svg), or 'rem'
 * `x` / `y`    the top-left corner, when this sits inside another svg
 * `className`  extra classes for the svg
 *
 * Nothing is drawn rather than something wrong being drawn: an unknown key is a
 * bug elsewhere and there is no sensible object to substitute.
 */
function Curiosity({
  objectKey,
  base,
  unit = '',
  x,
  y,
  className = '',
  ...rest
}) {
  const recipe = RECIPES[objectKey]
  if (!recipe) return null
  const box = objectDrawnBox(objectKey)
  const surface = SURFACES[recipe.surface]
  const { w, h } = box
  // What this screen's base makes of it. The viewBox stays the drawn box, so
  // the scale from one to the other is the same for every object on the page.
  const drawn = objectSize(objectKey, base)

  /*
   * THE FRAME IS THE OBJECT'S SIZE IN ABODE PIXELS, and the whole texture rule
   * rides on that (objectCanon.js says why at length). The viewBox is the
   * drawn box; the rendered size is the canon's answer for this screen's base.
   * Every object on a screen is therefore scaled by the same factor, so a bark
   * furrow is the same width on the thin column as on the tall one.
   *
   * The filter has to breathe past the edge — a furrow's relief is lit from
   * outside the shape — so the svg carries a little overflow room. It is
   * `overflow: visible` rather than a padded viewBox, which would have changed
   * the drawing's units and broken the very rule above.
   */
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      x={x}
      y={y}
      width={`${drawn.w}${unit}`}
      height={`${drawn.h}${unit}`}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
      {...rest}
    >
      <path
        d={recipe.outline(box, recipe.seed)}
        fill={surface.colour}
        filter={`url(#curio-${recipe.surface})`}
      />
    </svg>
  )
}

export default Curiosity
