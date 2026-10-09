// narration.js — the reader for Habitat's story words (T3.4, T6.14).
//
// THE WORDS NO LONGER LIVE HERE. Since T6.14 slice 3 every line of story
// is an entry in the copy deck, src/content/ui.js (the `story.*`
// entries, each with a plain-English note) — edit them there. This file
// only walks them: it builds the table below from the deck and hands
// back one slot at a time.
//
// Blank-rule (story half of the deck): a slot left as '' shows nothing
// in the app — no broken text, never invented copy, no fallback.
//
// Narration is momentary (spec decisions 2026-07-19): these lines play
// once, in the moment, and are never stored or re-readable in the app.
// The one standing exception is `friendCards`, re-readable on the Guest
// Book (2026-07-20).

import { fill, nest } from './ui.js'

// The English story, nested by path: firstReveals, spreadPopup,
// friendIntros, friendCards, cameos, mapRegions. Derived from the deck;
// tests may overwrite slots in it, so it is a plain mutable object.
export const NARRATION = nest('story', 'en')

// Look a slot up by its path, e.g. narrationSlot('firstReveals.flora.title').
// Returns the text, or null when the slot is empty, blank, or doesn't
// exist yet — so callers show nothing rather than inventing copy.
//
// `vars` fills the {holes} a slot chose to write (2026-08-20), using the
// same filler the interface words use — narrationSlot('cameos.bigDay',
// { n: 11 }) turns '{n} steps in one day!' into '11 steps in one day!'.
// A slot that writes no holes ignores it entirely, which is every slot
// but the cameos today.
export function narrationSlot(path, vars) {
  let value = NARRATION
  for (const key of path.split('.')) {
    if (value === null || typeof value !== 'object') return null
    value = value[key]
  }
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text === '' ? null : fill(text, vars)
}
