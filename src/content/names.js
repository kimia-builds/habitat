// names.js — the reader for what the beings of N-Z-D are called
// (T6.1a, T6.14).
//
// THE NAMES NO LONGER LIVE HERE. Since T6.14 slice 3 every name is an
// entry in the copy deck, src/content/ui.js (the `name.*` entries) —
// write and change them there. This file only reads them.
//
// Blank-rule (names half of the deck): a slot left as '' shows nothing
// in the app rather than inventing a name, and never falls back to
// another language.
//
// ABOUT THE KEYS (plip, baluhm, …). Those are internal ids, not the
// names themselves — they are how the code, the CSS animations and the
// narration slots find each species, and they never appear on screen.
// Since 2026-08-17 they carry the species' real names (no word N-Z-D
// does not use belongs anywhere in Habitat). The text beside each id in
// the deck is the only thing a player sees. They run low to high on the
// literacy ladder: `plip` is the first species you meet, `hamdi-bulo`
// the last. The two two-word names are hyphenated purely because the
// code needs it; the name itself keeps its space.
//
// HOW A FRIEND GETS ITS NAME ON SCREEN, in order:
//   1. its own individual name, if one is written;
//   2. otherwise its species name;
//   3. otherwise nothing at all — just the art.
// Each species has a FIXED roster (design-bible §9c): 10 plips down to
// a single hamdi bulo, 55 friendships in a lifetime; the number is the
// order they arrive in.

import { nest } from './ui.js'

// English names, derived from the deck: { species: { plip: … },
// individuals: { plip: { 1: … } } }. Tests may overwrite slots, so this
// is a plain mutable object.
export const NAMES = nest('name', 'en')

// ─────────────────────────── the plumbing ────────────────────────────
// Both readers return the trimmed words or null when a slot is blank,
// so a screen shows nothing rather than an empty space or a stand-in
// (mirrors narrationSlot in narration.js).

function filled(value) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text === '' ? null : text
}

// What this species is called, or null while its slot is blank.
export function speciesName(key) {
  return filled(NAMES.species?.[key])
}

// What this particular friend is called, or null while its slot is
// blank. `individual` is 1-based, in arrival order.
export function individualName(key, individual) {
  return filled(NAMES.individuals?.[key]?.[individual])
}

// The name to show for one friend: their own if they have one, else
// their species', else nothing. This is the ladder the whole app uses —
// every screen that names a friend calls this, so a name Kimia writes
// appears everywhere at once.
export function friendDisplayName(key, individual) {
  return individualName(key, individual) ?? speciesName(key)
}
