/*
 * friendCanon.js — how big each friend is against the others (T5.3d)
 * =============================================================================
 * PERMANENT. This file outlives the workbench, unlike tracedFriends.js, and it
 * is the ONLY place the cast's proportions are written down.
 *
 * KIMIA'S RULE (2026-08-10, design-bible §9c): "their canon sizes must remain
 * true in relation to each other — not necessarily in absolute values —
 * everywhere and always." So a friend does not HAVE a size. It has a place in
 * one ordered scale. A Guest Book card, an arrival reveal and a home-screen
 * cameo may each pick whatever base size suits them; within any one of them the
 * ten stand in exactly the character sheet's proportions. A tiny friend never
 * out-sizes a large one anywhere in the app.
 *
 * HOW TO USE IT. Never type a friend's size in by hand — that is how a cast
 * loses its scale one screen at a time. Instead a screen decides ONE base size
 * (how big the largest friend may be there) and asks for the rest:
 *
 *     friendSize('drifter', 11.5)   // → 1.6, in whatever unit the base was
 *
 * The unit is the caller's business. Pass rem and you get rem; pass pixels and
 * you get pixels. The canon is unitless on purpose.
 *
 * WHY IT LIVES IN src/ui/ AND NOT constants.js. These are proportions of
 * DRAWINGS, read off Kimia's character sheet, consumed only by the code that
 * paints SVG — the same class of value as the friends' pastels in
 * friendPalettes.js and the surface tints in textures.jsx. Design-notes §11d
 * settled that boundary: artwork keeps its own measurements beside the artwork.
 * constants.js is for tunable GAME numbers (drop rates, meter amounts, pacing),
 * and nothing here can be retuned without redrawing the sheet.
 * =========================================================================== */

import { FRIEND_CATEGORIES } from '../game/constants.js'

// THE CANON, lowest literacy first — the same order as FRIEND_CATEGORIES, and
// the order Kimia drew them in: friend 01 is the smallest and simplest, friend
// 10 the rarest and most sophisticated.
//
// The numbers come from Kimia's pixel character sheet by way of T5.3c, which
// measured each archetype there and reduced its width and height to one "how
// big does it read" figure (the square root of width × height — going by width
// alone made the wide, low friends loom over the tall narrow ones). Those
// figures were card widths in rem; here they are divided through by the
// largest, so the scale is a set of plain ratios instead.
//
// SCHOLAR IS 1 because it is the largest of the ten, which makes every other
// number "a fraction of the biggest friend" and a screen's base size simply
// "how much room the biggest friend gets here". Note that the poet, though the
// top of the literacy ladder, is very slightly smaller — sophistication climbs
// the ladder through texture, appendages and silhouette (design-bible §9c),
// not through size, and the sheet is the authority on size.
//
// The comment on each line is what Kimia calls that species (src/content/names.js).
// The KEY is a permanent internal id that never appears on screen, and it stays
// put even when she renames the species — so the two can safely disagree.
// Six figures, not two: these are ratios, so a rounding error is multiplied by
// whatever base size a screen chooses. Six keeps the whole cast true to the
// sheet to within a thousandth of a percent at any size.
export const FRIEND_CANON = {
  drifter: 0.13913, // plip — the tiny one; Kimia: "its relative size should be tiny"
  nester: 0.417391, // baluhm
  mimic: 0.417391, // klupengk — the same size as the nester on the sheet
  signer: 0.6, // zala
  sprout: 0.817391, // liwi bi-jiji
  chatter: 0.365217, // meuhy — tall and narrow, so it reads smaller than its height
  neighbour: 0.86087, // rassatt
  storyteller: 0.791304, // woigolp
  scholar: 1, // chitu — the largest of the ten, and the scale's anchor
  poet: 0.956522, // hamdi bulo
}

// Where this friend stands in the scale, or the anchor's 1 if the key is
// unknown. An unknown key means a bug elsewhere, but a friend drawn at full
// size is a far better failure than one drawn at zero and invisible.
export function friendScale(key) {
  const scale = FRIEND_CANON[key]
  return typeof scale === 'number' ? scale : 1
}

// How big this friend is where the largest friend gets `base`. The unit rides
// along with `base` — rem in, rem out.
export function friendSize(key, base) {
  return friendScale(key) * base
}

// The canon in ladder order, for anything that walks the whole cast.
export const FRIEND_CANON_ORDER = FRIEND_CATEGORIES.map(({ key }) => key)
