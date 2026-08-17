/*
 * friendColours.js — which colour each individual friend wears (T5.3e)
 * =============================================================================
 * PERMANENT, like friendCanon.js and for the same reason: it outlives the
 * workbench. friendCanon.js says how BIG a friend is against the others; this
 * says what COLOUR it is against its siblings. Together they are the whole of
 * what code decides about a friend's looks — the drawing itself is Kimia's.
 *
 * KIMIA'S CALL (2026-08-17, T5.3e): individuals of a species differ by BODY
 * COLOUR AND NOTHING ELSE. Not size (T5.3d fixed one size per species and it
 * holds everywhere), not texture, not eye count. Ten plips are one drawing
 * in ten pastels. The species is the creature you recognise; the colour is the
 * one you met. design-bible §9c is written to match.
 *
 * THE PALETTE IS CHOSEN, NOT CALCULATED (revised 2026-08-17, after Kimia saw
 * the first ten). The first cut spread a species evenly around the colour
 * wheel, which is tidy arithmetic and the wrong answer twice over:
 *
 *   - An even sweep must pass through every hue, so it spent four of its ten
 *     on blues and greens. Those tones belong to the FLORA (Kimia's call) —
 *     friends borrowing them blurs the two families the silhouette test is
 *     meant to keep apart (design-bible §9c).
 *   - It could only ever reach one STRENGTH of colour, because saturation was
 *     fixed. Every friend came out equally vivid, and "a pastel" was not in
 *     the vocabulary at all — no baby pink, no pale grey, nothing soft.
 *
 * So the ten are named, and each is a hue AND a saturation. Kimia kept five
 * from the swept set (the gold, teal, violet, magenta and red — numbers 1, 5,
 * 7, 9 and 10 as the shelf showed them) and named five pastels to replace the
 * rest. Her five keep their original slot numbers so that "colour 7" still
 * means what it meant when she said it.
 *
 * COLOURS REPEAT ACROSS SPECIES, deliberately. There are ten colours and 55
 * friendships, so they must. Two friends of DIFFERENT species sharing a pastel
 * are never confusable anyway: they are different drawings at different sizes,
 * and shape is what says which species. Colour only ever has to answer "which
 * one of these" — so the rule it must never break is that no two SIBLINGS
 * share one, and that is what friendColours.test.js guards.
 *
 * WHICH FRIEND GETS WHICH COLOUR IS A ROLL OF THE DICE (Kimia, 2026-08-17,
 * replacing the fixed runs this file shipped with that morning). Her call: "the
 * colours of each friend should pick at random from the existing 10 colours,
 * with no colours ever repeating within the same species — therefore different
 * players might get friends of different colours." So the palette is settled
 * and shared, and the DEAL is personal: your first plip is a colour that is
 * yours, and somebody else's first plip is very likely another.
 *
 * HOW THE DICE ARE KEPT HONEST. The roll is seeded from the WORLD SEED, the
 * same trick every other surprise in Habitat uses (drops.js) — so it is random
 * across players and fixed within one game. A friend cannot change colour
 * because you closed the tab, undid a check-in or restored a backup; the seed
 * travels with the save and always deals the same hand.
 *
 * NO SIBLING EVER REPEATS, and by construction rather than by luck: a species
 * SHUFFLES the ten colours and deals off the top, so its individuals are the
 * first N of a permutation. No roster is bigger than ten (the plips are exactly
 * ten and the rest are smaller), so dealing can never run out and never has to
 * reuse a card.
 * =========================================================================== */

import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'
import { randomUnit } from '../game/drops.js'

/*
 * THE TEN FRIEND COLOURS, in shelf order.
 *
 * `hue` is degrees round the colour wheel, `saturation` is how strong the
 * colour is, and `lift` is how far it is pulled toward white — 0 leaves the
 * drawing's own brightness alone, and the higher it goes the paler the friend.
 *
 * LIFT IS WHAT MAKES A PASTEL, and it had to be added (2026-08-17) once the
 * named colours were tried: a pastel is a LIGHT colour, and the lightness of a
 * friend comes from Kimia's shading, whose mid tone sits near 55%. A baby pink
 * lives near 86%, so hue and saturation alone returned a dusty rose — right
 * arithmetic, wrong colour. Lift moves each shade a FRACTION of its remaining
 * distance to white, which pales the body without ever clipping, so the
 * modelling Kimia drew survives intact (the maths is in friendPalettes.js).
 *
 * EVERYBODY IS LIFTED (Kimia, 2026-08-17 — the last of three passes). The five
 * she kept first stood at lift 0, which left the palette reading as two
 * weights: five vivid friends and five pale ones. Shown both versions side by
 * side on the workbench, she took the one where her five are lifted too, so
 * the ten read as one family. Their hues and strengths are untouched — only
 * the lift moved.
 *
 * The band is 35 to 45, and it is deliberately NOT uniform: a soft lilac and a
 * pastel peach do not need the same push to look like they belong together, so
 * each was set by eye.
 *
 * WHY SO FEW BLUES AND GREENS (Kimia, 2026-08-17): those tones are mostly
 * reserved for the flora palette. What survives is one teal, one baby blue and
 * a pale grey with a cool cast — enough for variety, not enough to muddle a
 * friend with a plant.
 */
export const FRIEND_COLOURS = [
  { name: 'gold', hue: 40, saturation: 60, lift: 40 },
  { name: 'soft lilac', hue: 285, saturation: 35, lift: 35 },
  { name: 'pastel peach', hue: 26, saturation: 55, lift: 45 },
  { name: 'baby pink', hue: 350, saturation: 50, lift: 45 },
  { name: 'teal', hue: 184, saturation: 60, lift: 40 },
  { name: 'pale grey', hue: 225, saturation: 8, lift: 35 },
  { name: 'violet', hue: 256, saturation: 60, lift: 40 },
  { name: 'baby blue', hue: 202, saturation: 45, lift: 40 },
  { name: 'magenta', hue: 328, saturation: 60, lift: 40 },
  { name: 'red', hue: 4, saturation: 60, lift: 40 },
]

const INDEX_OF = Object.fromEntries(
  FRIEND_CATEGORIES.map(({ key }, i) => [key, i]),
)

/*
 * ONE SPECIES' SHUFFLED PACK. The ten colours dealt into this species' own
 * order, for this one world.
 *
 * It is a Fisher–Yates shuffle — walk the pack from the back, and swap each
 * card with one drawn from the part not yet walked. That is the standard way
 * to shuffle, and the one that matters here: every one of the ten! orders is
 * equally likely, so no colour is quietly commoner than another.
 *
 * Its randomness comes from `randomUnit`, the same seeded dice the drops use.
 * The seed names the world and the species, so two species in one game shuffle
 * differently (your plips and your baluhms are not colour-matched pairs) and
 * one species in two games shuffles differently too. `i` is in the seed as
 * well, so each swap gets its own throw rather than the pack being turned by
 * one number.
 */
function shuffledPack(key, worldSeed) {
  const pack = [...FRIEND_COLOURS]
  for (let i = pack.length - 1; i > 0; i--) {
    const j = Math.floor(
      randomUnit(`${worldSeed}|friend-colour|${key}|${i}`) * (i + 1),
    )
    ;[pack[i], pack[j]] = [pack[j], pack[i]]
  }
  return pack
}

/**
 * The colour this individual wears — `{ name, hue, saturation, lift }`.
 *
 * `key`        the species key ('plip', 'baluhm', …)
 * `individual` which one of that species, 1-based — the same numbering the
 *              game uses (src/game/friends.js: individual = arrival order)
 * `worldSeed`  this save's seed, so the deal is this player's own
 *
 * An unknown species still gets a colour (it shuffles under its own name), and
 * an individual past the roster wraps back onto an earlier sibling's colour.
 * Both are bugs elsewhere if they happen (the roster is capped in the game),
 * but a friend in a repeated colour is a far better failure than one with no
 * colour at all.
 */
export function individualColour(key, individual, worldSeed) {
  const pack = shuffledPack(key, worldSeed)
  const slot = individual - 1
  return pack[((slot % pack.length) + pack.length) % pack.length]
}

/**
 * Every colour of a species, in arrival order — for anything that shows a
 * whole roster at once. Because it is the top of one shuffled pack, no two of
 * them can be the same colour.
 */
export function speciesColours(key, worldSeed) {
  const roster = FRIEND_ROSTER[INDEX_OF[key] ?? 0]
  return shuffledPack(key, worldSeed).slice(0, roster)
}
