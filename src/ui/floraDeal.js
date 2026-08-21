/*
 * floraDeal.js — which of the 48 a flora find is (T5.3i, Kimia 2026-08-21)
 * =============================================================================
 * A flora find used to be nothing but the word "flora". The drop record on the
 * completion is `{ kind: 'flora' }` and carries no shape, no size and no fill —
 * which was right while the flora were placeholder sprigs and every find looked
 * the same, and is not enough the moment the real drawings go on screen.
 *
 * KIMIA'S CALL (2026-08-21): **deal it from the save's seed.** The same trick
 * that decides which colour a friend was dealt decides which of the 48 a find
 * is — nothing new is written into the save, the answer is the same one for
 * ever, and flora she gathered weeks ago get their looks too rather than only
 * the ones found from today. (The alternative on the table was writing the
 * identity onto the drop, which needs a storage version and still leaves every
 * existing find to be dealt some other way.)
 *
 * THE 48 ARE A CATALOGUE, NOT 48 UNIQUE PLANTS. Two finds that deal the same
 * shape, size and fill ARE the same flora, and they look identical on purpose —
 * that is what "4 silhouettes × 2 sizes × 6 fills = 48 collectible flora"
 * (design-bible §9a) means. Flora.jsx leans on this: it draws one hair field per
 * shape, fill and size and reuses it, which is both the truthful model and the
 * reason an Abode full of flora does not have to grow tens of thousands of
 * strands over again on every frame of a drag.
 *
 * HALF AND HALF (Kimia, 2026-08-21). A find is as likely to be a large flora as
 * a small one. A large one stands 2.75× a small one, so the mix is what the
 * ground looks like; even odds is the flattest answer and the one that sits with
 * the no-front-loading rule — both classes turn up early and keep turning up.
 *
 * WHY THIS FILE IS IN src/ui/ AND NOT src/game/. Shape, size and fill are all
 * LOOKS: no rule in the game reads them, nothing is scored or unlocked by them.
 * That puts them under the §11d boundary with floraColours.js and
 * friendColours.js — artwork values live beside the artwork — and it is the same
 * call friendColours.js got for dealing a friend's colour from the same seed.
 * =========================================================================== */

import { randomUnit } from '../game/drops.js'
import { FLORA_SIZE_CLASSES } from './floraCanon.js'
import { FLORA_FILLS } from './floraFills.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'

// The size classes a FIND may be dealt: the two collectible ones, and only
// those. Landmarks are a separate class (design-bible §9a) — giant, one per Map
// region, and their size is deliberately still unset. floraCanon.js holds the
// two collectible classes today, so this is simply that list; the load-bearing
// part is the test beside this file, which pins the dealt classes to exactly
// small and large. If a landmark class ever joins the canon, that test fails
// loudly and somebody has to decide — instead of the deal quietly starting to
// hand out giants nobody can carry.
const DEALT_SIZE_CLASSES = FLORA_SIZE_CLASSES

// One of `list`, chosen evenly, from a number 0 ≤ r < 1.
function pick(list, roll) {
  return list[Math.min(list.length - 1, Math.floor(roll * list.length))]
}

/**
 * Which flora this find is. Same find, same save → the same answer for ever.
 *
 * `completionId` the completion that dropped the find — how flora are keyed
 *                everywhere else in the game (game/flora.js)
 * `worldSeed`    this save's seed
 *
 * Returns the three things the drawing needs, as the objects themselves rather
 * than keys to look up: `{ silhouette, sizeClass, fill }`.
 */
export function floraIdentity(completionId, worldSeed) {
  if (typeof completionId !== 'string' || completionId === '') {
    throw new Error(
      'floraIdentity needs the id of the completion that dropped the find.',
    )
  }
  if (typeof worldSeed !== 'string' || worldSeed === '') {
    throw new Error("floraIdentity needs this save's world seed.")
  }
  // Three separate rolls off three descriptive seed strings, the drops.js
  // idiom — so shape, size and fill vary independently instead of marching in
  // step the way three slices of one number would.
  return {
    silhouette: pick(
      FLORA_SILHOUETTES,
      randomUnit(`${worldSeed}|flora-shape|${completionId}`),
    ),
    sizeClass: pick(
      DEALT_SIZE_CLASSES,
      randomUnit(`${worldSeed}|flora-size|${completionId}`),
    ),
    fill: pick(
      FLORA_FILLS,
      randomUnit(`${worldSeed}|flora-fill|${completionId}`),
    ),
  }
}

// The catalogue number of a dealt flora — "shape 3 in coat-sky", the pair that
// says which FILL a flora wears. Size is not part of it, because size is not
// part of what a fill is. (Flora.jsx caches its grown hair fields under this
// plus the size class: since 2026-08-21 the two classes wear the same fur at
// the same size on screen, which takes a field each.)
export function floraFillKey({ silhouette, fill }) {
  return `${silhouette.key}|${fill.id}`
}
