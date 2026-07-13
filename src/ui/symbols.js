// Placeholder looks for the 6 abstract symbols. The data model only
// ever stores the number 1..6; these glyphs and pastel colours are just
// how the UI draws that number until the real symbols are designed in
// T5.1. No words, no labels — the shape is all the user ever sees
// (spec §4.1), so the glyph itself is also each button's accessible name.
export const SYMBOL_GLYPHS = {
  1: '●',
  2: '■',
  3: '▲',
  4: '◆',
  5: '✚',
  6: '✶',
}

export const SYMBOL_COLORS = {
  1: '#f4a7b9', // pastel rose
  2: '#a7c7f4', // pastel blue
  3: '#b8e6b8', // pastel green
  4: '#f4d9a7', // pastel sand
  5: '#d4b8e6', // pastel lilac
  6: '#a7e6e0', // pastel teal
}
