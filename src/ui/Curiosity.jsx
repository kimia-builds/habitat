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
 * WHERE IT IS UP TO. All eight shapes passed Kimia's eye and went into the game
 * on 2026-10-09: the Market stall and the Abode draw them (game/market.js's
 * DRAWN_CURIOSITIES says which pool slot wears which), and ObjectGlyph.jsx's
 * placeholder line-drawings remain only for the pool slots with no drawing yet.
 * The pool is 48 objects (§10a); these are the first of them, and Kimia's list
 * is explicitly not exhaustive.
 */

import { CHARM_SHAPES } from './CharmSymbol.jsx'
import { SYMBOL_COLORS } from './symbols.js'
import { objectDrawnBox, objectSize } from './objectCanon.js'
import { wobblyBlob, wobblyEllipse, wobblyRect } from './handDrawn.js'
import {
  BarkFilter,
  CrateredFilter,
  SmokeFilter,
  SunkenPoresFilter,
  TEX_COLORS,
} from './textures.jsx'

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

/*
 * THE SMOKE — "250x250px baby pink semi transparent smoke", and then, asked
 * what its edge should do and what surface it should wear: "a soft cloudy
 * puff" with no hard edge at all, and "just vary the level of transparency
 * across the smoke like how real smoke would be".
 *
 * SO THE OUTLINE IS STILL DRAWN, and this is worth being clear about, because
 * a puff with no edge sounds like a thing with no shape. The blob below is what
 * decides where the smoke IS — where it bulges, where it draws in — and
 * SmokeFilter (textures.jsx) then blurs that footprint away to nothing at the
 * rim and eats holes in it, so no line is ever visible. Take the outline away
 * and you would have a circle of fog; take the filter away and you would have a
 * solid pink blob.
 *
 * A BIGGER LOBE than the stones get. A stone is a lump; smoke is pulled about,
 * and a footprint that rolls further in and out is what gives the puff its
 * uneven reach before the filter has done anything at all.
 */
function smokeOutline(box, seed) {
  return wobblyBlob({
    ...box,
    seed,
    lobe: 0.26,
    amp: wobbleFor(box, OBJECT_WOBBLE),
  })
}

/*
 * THE STONES — "three of these should be organic random blob shapes", at 250
 * square, in the cratered stone's own colour and texture (Kimia, 2026-09-01;
 * asked on 2026-09-02 whether she wanted a colour of their own, as she picked
 * the discs' tangerine, she kept the library's cool grey).
 *
 * THREE SHAPES AT ONE SIZE — which is the discs' relationship stood on its
 * head, and it is why they are three recipes over ONE canon entry (see
 * `canon` below). The discs are one shape at two sizes: same seed, so the
 * large is the small enlarged. These are the opposite: one size, three seeds,
 * so they are three different lumps that happen to be equally big — three
 * stones off the same beach rather than one stone photographed three times.
 *
 * The lobes are what makes each one its own: `wobblyBlob` rides a few slow
 * harmonics round the ring, so one side bulges where another draws in, and a
 * different seed deals a different set of them (handDrawn.js).
 */
function stoneOutline(box, seed) {
  return wobblyBlob({
    ...box,
    seed,
    amp: wobbleFor(box, OBJECT_WOBBLE),
  })
}

/*
 * THE CHARM OBJECTS (2026-10-10, Kimia: "6 new objects in the market that
 * resemble the charms"). Each one is the real charm drawing from
 * CharmSymbol.jsx — the same shapes, in the same colour — made big enough to
 * stand in the Abode. They are LINE drawings, which is the one thing the other
 * eight are not, and that is why each also carries an invisible rectangle over
 * its whole frame (see `Curiosity` below): a charm is mostly gaps, and a finger
 * that lands between the cherries or inside the crown must still pick it up.
 *
 * THE LINE IS ONE WEIGHT ACROSS THE FAMILY, as surface detail is everywhere
 * else (objectCanon.js): 6 drawing units on the small charm and on the large
 * one, so the large charm is simply the bigger shape in the same pen.
 */
const CHARM_LINE = 6

// How far the hand drifts off a perfectly drawn line — the same
// "organic wobble, not sketchiness" the other outlines get (handDrawn.js),
// done here as a gentle displacement because a charm is made of many strokes
// rather than one closed outline.
const CHARM_WOBBLE = 5

const RECIPES = {
  'charm-crown': { charm: 1, surface: 'charm-wobble', canon: 'charm-large' },
  'charm-cherry': { charm: 2, surface: 'charm-wobble', canon: 'charm-small' },
  'charm-shell': { charm: 3, surface: 'charm-wobble', canon: 'charm-medium' },
  'charm-anchor': { charm: 4, surface: 'charm-wobble', canon: 'charm-medium' },
  'charm-shield': { charm: 5, surface: 'charm-wobble', canon: 'charm-large' },
  'charm-key': { charm: 6, surface: 'charm-wobble', canon: 'charm-small' },
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
  smoke: {
    outline: smokeOutline,
    surface: 'smoke-pink',
    seed: 61,
  },
  /*
   * `canon` — THE ONE PLACE A RECIPE'S KEY IS NOT THE CANON'S KEY. Kimia gave
   * one stone size (250 square) and asked for three stones at it, so there are
   * three objects sharing one entry in the sizing table. Pointing all three at
   * `stone` rather than writing 'stone-1: 250x250' three times into
   * objectCanon.js keeps that file exactly what it claims to be: the sizes she
   * gave, once each, in her own numbers.
   */
  'stone-1': {
    outline: stoneOutline,
    surface: 'stone-cratered',
    canon: 'stone',
    seed: 5,
  },
  'stone-2': {
    outline: stoneOutline,
    surface: 'stone-cratered',
    canon: 'stone',
    seed: 12,
  },
  'stone-3': {
    outline: stoneOutline,
    surface: 'stone-cratered',
    canon: 'stone',
    seed: 31,
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

/*
 * THE SMOKE'S BABY PINK. Light and soft rather than hot — it is the colour of a
 * pale cloud, and it is going to be seen at well under full opacity, so a pink
 * chosen at the strength it looks right on paper comes out grey-ish on screen.
 * Unlike the columns' brown and the discs' tangerine this is NOT a lighting
 * colour: nothing lights the smoke, so what you see is this hex at whatever
 * transparency that patch of the puff has.
 */
const BABY_PINK = '#ffc3d8'

/*
 * The stones keep the texture library's own cool grey (Kimia, 2026-09-02,
 * asked whether she wanted to pick one as she picked the tangerine). It IS a
 * lighting colour: the cratered surface is lit from the same azimuth as the
 * bark furrows and the sunken pores, so a crater's far wall comes out much
 * darker than this and its near wall close to it.
 */
const STONE_GREY = TEX_COLORS.crateredLight

const SURFACES = {
  // Not a texture: a slight, even drift that keeps the charm's lines from being
  // ruler-straight. No glow, like every other made thing.
  'charm-wobble': {
    glow: false,
    colour: null,
    Filter: ({ id }) => (
      <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="2"
          seed="7"
          result="drift"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="drift"
          scale={CHARM_WOBBLE}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    ),
  },
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
  /*
   * The one surface that is not a surface: the smoke has no skin, it has a
   * varying amount of itself (textures.jsx). No glow, as everything else —
   * a puff that lit itself would be a spirit rather than a thing you bought.
   */
  'smoke-pink': {
    glow: false,
    colour: BABY_PINK,
    Filter: ({ id }) => <SmokeFilter id={id} colour={BABY_PINK} />,
  },
  'stone-cratered': {
    glow: false,
    colour: STONE_GREY,
    Filter: ({ id }) => <CrateredFilter id={id} light={STONE_GREY} />,
  },
}

export function curiosityRecipe(key) {
  return RECIPES[key]
}

/**
 * Which entry in objectCanon.js this object takes its size from — its own key
 * for all but the three stones, which share one (see RECIPES). Anything that
 * needs an object's canon size by hand, like the shelf that labels it, asks
 * this rather than assuming the two keys are the same word.
 */
export function curiosityCanonKey(key) {
  return RECIPES[key]?.canon ?? key
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
  // Almost always the object's own key. The three stones are the exception:
  // they are three objects at one canon size, so they say which entry they
  // take their size from (see RECIPES).
  const sizeKey = recipe.canon ?? objectKey
  const box = objectDrawnBox(sizeKey)
  const surface = SURFACES[recipe.surface]
  const { w, h } = box
  // What this screen's base makes of it. The viewBox stays the drawn box, so
  // the scale from one to the other is the same for every object on the page.
  const drawn = objectSize(sizeKey, base)

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
  if (recipe.charm) {
    // The charm's own drawing is 24 units across; scale it to fill the frame,
    // and divide the pen by the same factor so the line stays CHARM_LINE.
    const k = w / 24
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
        {/* The grab area is the WHOLE frame, gaps included — not just the
            lines. Transparent but painted, so a pointer lands on it. */}
        <rect
          className="curiosity-grab"
          width={w}
          height={h}
          fill="transparent"
        />
        <g filter={`url(#curio-${recipe.surface})`}>
          <g
            transform={`scale(${k})`}
            fill="none"
            stroke="currentColor"
            strokeWidth={CHARM_LINE / k}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: SYMBOL_COLORS[recipe.charm] }}
          >
            {CHARM_SHAPES[recipe.charm]}
          </g>
        </g>
      </svg>
    )
  }
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
