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
 * holds everywhere), not texture, not eye count. Ten drifters are one drawing
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
 * NOT YET WIRED TO THE GAME SCREENS. The Guest Book, arrival reveal, cameo and
 * Abode still draw the T4.4 placeholder line-art, whose hue comes from a seeded
 * roll in FriendGlyph.jsx (a different hue in every new game). This file
 * replaces that roll in the task that swaps the real drawings in — the same
 * task friendCanon.js is waiting on. Until then it feeds the workbench only.
 * =========================================================================== */

import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'

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
 * The five she kept sit at lift 0 and are therefore untouched, exactly the
 * colours she approved on the first shelf.
 *
 * WHY SO FEW BLUES AND GREENS (Kimia, 2026-08-17): those tones are mostly
 * reserved for the flora palette. What survives is one teal, one baby blue and
 * a pale grey with a cool cast — enough for variety, not enough to muddle a
 * friend with a plant.
 */
export const FRIEND_COLOURS = [
  { name: 'gold', hue: 40, saturation: 60, lift: 0 }, // kept — was colour 1
  { name: 'soft lilac', hue: 285, saturation: 35, lift: 35 },
  { name: 'pastel peach', hue: 26, saturation: 55, lift: 45 },
  { name: 'baby pink', hue: 350, saturation: 50, lift: 45 },
  { name: 'teal', hue: 184, saturation: 60, lift: 0 }, // kept — was colour 5
  { name: 'pale grey', hue: 225, saturation: 8, lift: 35 },
  { name: 'violet', hue: 256, saturation: 60, lift: 0 }, // kept — was colour 7
  { name: 'baby blue', hue: 202, saturation: 45, lift: 40 },
  { name: 'magenta', hue: 328, saturation: 60, lift: 0 }, // kept — was colour 9
  { name: 'red', hue: 4, saturation: 60, lift: 0 }, // kept — was colour 10
]

/*
 * A CANDIDATE, NOT THE PALETTE (2026-08-17, Kimia: "just wanna test how it
 * looks"). The approved palette above reads as two weights — her five kept
 * colours at full strength and no lift, the five pastels pale. This is the
 * same ten with the five originals lifted into the pastels' range, to see
 * whether the set reads better as ONE family.
 *
 * Only the five at lift 0 are touched. The pastels are left exactly as they
 * are, including the two sitting at 35 rather than 40 — nudging those would
 * mean the two benches differed in more than the one thing being tested, and
 * the comparison would stop being a comparison.
 *
 * TEMPORARY. It leaves with the second shelf when Kimia decides: either the
 * lifted values move into FRIEND_COLOURS above and this goes, or it goes.
 */
export const FAMILY_LIFT = 40

export const FRIEND_COLOURS_LIFTED = FRIEND_COLOURS.map((colour) =>
  colour.lift === 0 ? { ...colour, lift: FAMILY_LIFT } : colour,
)

const INDEX_OF = Object.fromEntries(
  FRIEND_CATEGORIES.map(({ key }, i) => [key, i]),
)

/*
 * WHICH COLOURS A SPECIES GETS. The drifters, being ten, get all ten. Every
 * other species is smaller than the palette, so it takes a RUN of it starting
 * one step further along than the species below it on the ladder, wrapping at
 * the end. Two reasons for the offset rather than "everyone takes the first
 * few": it stops the same handful of colours doing all the work while the
 * later pastels are never seen, and it means the rarest friends are not
 * dressed identically to the commonest. The lone poet lands on the last
 * colour, which feels right for the friend you meet once in five years.
 *
 * Every species' run is still contiguous and wrap-free of repeats, because no
 * roster exceeds the ten colours — which is the guarantee siblings depend on.
 */
function offsetFor(speciesIndex) {
  return speciesIndex % FRIEND_COLOURS.length
}

/**
 * The colour this individual wears — `{ name, hue, saturation }`.
 *
 * `key`        the species key ('drifter', 'nester', …)
 * `individual` which one of that species, 1-based — the same numbering the
 *              game uses (src/game/friends.js: individual = arrival order)
 *
 * An unknown species falls back to the ladder's first slot, and an individual
 * past the roster wraps back onto an earlier sibling's colour. Both are bugs
 * elsewhere if they happen (the roster is capped in the game), but a friend in
 * a repeated colour is a far better failure than one with no colour at all.
 */
export function individualColour(key, individual) {
  const speciesIndex = INDEX_OF[key] ?? 0
  const slot = offsetFor(speciesIndex) + (individual - 1)
  return FRIEND_COLOURS[
    ((slot % FRIEND_COLOURS.length) + FRIEND_COLOURS.length) %
      FRIEND_COLOURS.length
  ]
}

/**
 * Every colour of a species, in arrival order — for anything that shows a
 * whole roster at once, like the workbench shelf.
 */
export function speciesColours(key) {
  const roster = FRIEND_ROSTER[INDEX_OF[key] ?? 0]
  return Array.from({ length: roster }, (_, i) => individualColour(key, i + 1))
}

/**
 * The same roster in the lifted candidate above — for the comparison shelf
 * only. TEMPORARY, and it leaves when Kimia decides.
 */
export function speciesColoursLifted(key) {
  return speciesColours(key).map(
    (colour) => FRIEND_COLOURS_LIFTED[FRIEND_COLOURS.indexOf(colour)],
  )
}
