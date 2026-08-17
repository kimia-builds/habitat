/*
 * friendHues.js — which colour each individual friend wears (T5.3e)
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
 * THE RULE. A species spreads its roster evenly around the colour wheel, so its
 * individuals are as far apart in colour as that many can be — ten drifters
 * every 36°, nine nesters every 40°, the single poet wherever it starts. Even
 * spacing is the whole point: colour is the ONLY thing telling two siblings
 * apart, so it has to work hard.
 *
 * WHERE A SPECIES STARTS. At 40° — the amber the cast already wears — plus 18°
 * per step down the literacy ladder, so no two species begin on the same
 * colour. 18° is half a drifter step, chosen to be boring and even rather than
 * clever.
 *
 * COLOURS DO REPEAT ACROSS SPECIES, deliberately. Fifty-five friends spread
 * around one wheel would sit 6.5° apart, which no eye reads as different — so
 * chasing 55 unique colours would buy nothing and cost the even spacing that
 * actually works. A drifter and a nester may share a green. They are never
 * confusable anyway: they are different DRAWINGS at different sizes, and shape
 * is what says which species. Colour only ever has to answer "which one of
 * these".
 *
 * NOT YET WIRED TO THE GAME SCREENS. The Guest Book, arrival reveal, cameo and
 * Abode still draw the T4.4 placeholder line-art, whose hue comes from a seeded
 * roll in FriendGlyph.jsx (a different hue in every new game). This file
 * replaces that roll in the task that swaps the real drawings in — the same
 * task friendCanon.js is waiting on. Until then it feeds the workbench only.
 * =========================================================================== */

import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'

// Where the ladder's first species starts on the wheel: 40°, the amber of the
// three pastels the archetypes were first shown in (friendPalettes.js).
export const FIRST_HUE = 40

// How far the next species' starting point moves round the wheel. Half a
// drifter step.
export const SPECIES_HUE_STEP = 18

const INDEX_OF = Object.fromEntries(
  FRIEND_CATEGORIES.map(({ key }, i) => [key, i]),
)

/**
 * The hue this individual wears, in degrees.
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
export function individualHue(key, individual) {
  const speciesIndex = INDEX_OF[key] ?? 0
  const roster = FRIEND_ROSTER[speciesIndex]
  const step = 360 / roster
  const start = FIRST_HUE + speciesIndex * SPECIES_HUE_STEP
  return (start + (individual - 1) * step + 360) % 360
}

/**
 * Every hue of a species, in arrival order — for anything that shows a whole
 * roster at once, like the workbench shelf.
 */
export function speciesHues(key) {
  const roster = FRIEND_ROSTER[INDEX_OF[key] ?? 0]
  return Array.from({ length: roster }, (_, i) => individualHue(key, i + 1))
}
