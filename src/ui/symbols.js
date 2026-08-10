// The 6 habit tags are the six charms (design-notes §11a, built in T5.1).
// The data model only ever stores the number 1..6; this file holds how
// the UI draws that number — each charm's colour and its shape name.
// The charm SVGs themselves live in CharmSymbol.jsx (the shared drawer).
// No words, no labels on the tag itself (spec §4.1) — the shape name here
// is a screen-reader-only accessible name, never shown on screen.
//
// MIRROR OF tokens.css (T5.2a, design-notes §11d). The six colours are
// canonical in `src/tokens.css` as --charm-crown … --charm-key; they are
// repeated here because the glow drop-shadows are built as JavaScript
// strings, and §11d chose an honest duplicate over runtime indirection.
// Change a charm colour THERE and here, in the same edit — tokens.test.js
// fails the suite if the two ever disagree.

export const SYMBOL_COLORS = {
  1: '#F0BB3B', // crown — gold
  2: '#F5805A', // cherry — coral
  3: '#E8698C', // shell — pink
  4: '#A98EE0', // anchor — lavender
  5: '#5AB6F3', // shield — sky
  6: '#4FBFA0', // key — teal
}

// Hidden (aria) name for each charm — describes the drawing, not the
// habit's meaning. Kimia's wording, T5.1 (she chose shape names over a
// generic "symbol N", and singular "cherry").
export const SYMBOL_NAMES = {
  1: 'crown',
  2: 'cherry',
  3: 'shell',
  4: 'anchor',
  5: 'shield',
  6: 'key',
}
