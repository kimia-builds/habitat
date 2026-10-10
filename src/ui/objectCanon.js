/*
 * objectCanon.js — where the market objects stand in the sizing table (T5.3j)
 * =============================================================================
 * PERMANENT, and the third of three: friendCanon.js settled the cast's
 * proportions, floraCanon.js put the plants in the same scale, and this puts
 * the CURIOSITIES there too. floraCanon.js's header promised exactly this —
 * "when they are drawn they take their own places in this same table rather
 * than getting a private one" — and this file is that promise kept. All three
 * speak one unitless scale whose 1 is the chitu's WIDTH.
 *
 * That matters because all three families stand on the same ground: the Abode
 * holds flora you found, friends who visit, and objects you bought, and a thing
 * you paid for that turns out to be the wrong size next to a plant is the exact
 * failure the canon exists to prevent.
 *
 * ═══ HOW KIMIA GAVE THE SIZES (2026-09-01) ══════════════════════════════════
 * In pixels, read off the Abode — "10x60px and 40x300px rectangular columns",
 * and so on — with the instruction to convert them into canon ratios against
 * what is already in the world. So the pixel numbers below are hers, written
 * down exactly as she said them, and the ratios are derived from them once.
 *
 * The divisor is THE ABODE'S OWN BASE, because that is the picture she was
 * looking at when she measured. AbodePage.jsx sizes its scene from the smallest
 * thing that can stand on it — a plip, at 24px — which puts the chitu (the
 * scale's 1) at 172.5px. A thing she called 60px tall is therefore 60/172.5 =
 * 0.348 of a chitu's width, and it is that RATIO which is canon from here on.
 *
 * THE NUMBER IS FROZEN ON PURPOSE. It is written out rather than imported from
 * friendCanon.js, and that is not laziness. If the Abode ever decides a plip
 * needs more room, its base goes up and every flora and friend on that ground
 * grows with it — and these objects must grow too, in step, which is precisely
 * what a frozen divisor and a live `base` argument give you. Import it and the
 * arithmetic would run the other way: the ratios themselves would move, and the
 * columns would quietly shrink against the friends. The ratios never bend
 * (design-bible §9c); only the base a screen chooses ever changes.
 *
 * ═══ WHERE THEY LAND, AND IT IS WORTH READING ═══════════════════════════════
 * The ladder floraCanon.js writes out, with the objects folded in by their
 * LARGEST dimension, so a person can see what Kimia's numbers actually asked
 * for:
 *
 *     plip            0.139
 *     small flora     0.280
 *     THIN COLUMN     0.348  ← between a small flora and a baluhm
 *     baluhm          0.397
 *     zala            0.600
 *     large flora     0.770
 *     chitu           1.000
 *     hamdi bulo      1.157
 *     SMALL OVAL      1.159  ← as wide as the biggest friend
 *     SMOKE / STONE   1.449
 *     TALL COLUMN     1.739  ← half again the tallest friend: it TOWERS
 *     LARGE OVAL      2.319  ← twice the small one, and twice a hamdi bulo
 *
 * Four of the six are bigger than anything alive on N-Z-D. That is design-bible
 * §10a working as written — "wide size range; price correlates directly with
 * physical size" — and it is the first time anything in Habitat out-sizes the
 * cast. Flagged rather than smoothed: nothing here was rounded towards the
 * friends to make the picture tidier.
 *
 * ═══ THE TWO COLUMNS ARE NOT ONE SHAPE AT TWO SIZES ═════════════════════════
 * The two ovals are: 200x150 and 400x300 are both 4:3, so the large disc is the
 * small one enlarged, exactly as a large flora is a small one enlarged. The
 * columns are not — 10x60 is 1:6 and 40x300 is 1:7.5, so the big column is
 * relatively narrower as well as bigger. Kimia was asked and confirmed her
 * numbers; they are two distinct shapes, not a size class, and they are named
 * that way below rather than 'small'/'large' pretending otherwise.
 * =========================================================================== */

/*
 * The Abode's base at the moment these were measured: how many pixels one unit
 * of the shared scale was worth on the screen Kimia was looking at. See the
 * header for why it is a literal. (AbodePage.jsx's SCENE_BASE = 172.50054; the
 * rounding here moves a drawn edge by three ten-thousandths of a pixel.)
 */
const ABODE_BASE_PX = 172.5

/*
 * KIMIA'S NUMBERS, VERBATIM. These double as the DRAWING SIZES: every object is
 * authored in a frame of exactly these units, which is what makes the textures
 * behave — see `objectDrawnBox` below.
 */
const SIZES_IN_ABODE_PX = {
  'column-thin': { w: 10, h: 60 },
  'column-tall': { w: 40, h: 300 },
  'oval-small': { w: 200, h: 150 },
  'oval-large': { w: 400, h: 300 },
  smoke: { w: 250, h: 250 },
  stone: { w: 250, h: 250 },
  // The three charm objects (2026-10-10). NOT Kimia's numbers: she asked for
  // six objects that resemble the charms without giving sizes, so these are
  // proposals, square like the charms themselves, one per price tier so that
  // "price correlates with size" holds (6 / 12 / 18). She can change them.
  'charm-small': { w: 80, h: 80 },
  'charm-medium': { w: 120, h: 120 },
  'charm-large': { w: 180, h: 180 },
}

// THE CANON. Unlike the flora (a height each) and the friends (a width each),
// an object carries BOTH measurements, because Kimia gave both and because a
// column and a disc are not the same kind of thing stretched — the shape is the
// point. Fractions of a chitu's width, the same 1 the other two files count in.
export const OBJECT_CANON = Object.fromEntries(
  Object.entries(SIZES_IN_ABODE_PX).map(([key, { w, h }]) => [
    key,
    { w: w / ABODE_BASE_PX, h: h / ABODE_BASE_PX },
  ]),
)

// The objects in the order the shelf shows them: smallest first, so the shelf
// itself teaches the range.
export const OBJECT_CANON_ORDER = Object.keys(SIZES_IN_ABODE_PX)

// Where this object stands in the scale. An unknown key means a bug elsewhere;
// answer with the smallest, because an object drawn too small is a far better
// failure than one that swallows the screen.
export function objectScale(key) {
  return OBJECT_CANON[key] ?? OBJECT_CANON['column-thin']
}

/**
 * How big this object is where the largest friend gets `base`. The unit rides
 * along with `base` — rem in, rem out — exactly as friendSize and floraHeight
 * behave, so one screen's base serves all three families.
 */
export function objectSize(key, base) {
  const { w, h } = objectScale(key)
  return { w: w * base, h: h * base }
}

/*
 * THE FRAME AN OBJECT IS DRAWN IN — and the reason the textures come out right.
 *
 * KIMIA'S RULE (2026-09-01, twice: once for the columns and once for the
 * ovals): "as with plants, make the texture size of the columns match." The
 * plants' version of it is in Flora.jsx — a hair is as thick on a small flora
 * as on a large one, and the small plant simply wears fewer hairs — and it is
 * won there by growing the fur in a space scaled to the size class.
 *
 * The objects wear FILTER textures rather than hair, and a filter's grain is
 * measured in the user units of whatever it is attached to. So the same rule is
 * won here by a simpler trick: every object is drawn in a frame of its OWN
 * SIZE IN ABODE PIXELS. A 60-unit-tall frame for the 60px column, a 300-unit
 * one for the 300px column. Both are then scaled to the screen by the same
 * factor — `base / ABODE_BASE_PX`, which has nothing to do with which object it
 * is — so one bark furrow is the same number of pixels wide on the thin column
 * as on the tall one, and one crater is the same crater on both stones.
 *
 * The whole family scales together with the screen's base, which is what the
 * flora do too: the fur is one size across the size classes on any one screen,
 * and larger on a screen that gives everything more room.
 */
export function objectDrawnBox(key) {
  return { ...(SIZES_IN_ABODE_PX[key] ?? SIZES_IN_ABODE_PX['column-thin']) }
}

// What one drawing unit is worth once an object is put on a screen with this
// base. Anything that has to keep a texture or a wobble honest across sizes
// multiplies by this rather than by the object's own size.
export function objectUnitScale(base) {
  return base / ABODE_BASE_PX
}
