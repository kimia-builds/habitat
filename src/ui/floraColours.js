/*
 * floraColours.js — the flora palette (design-bible §9a)
 * =============================================================================
 * WHAT THIS IS FOR. Kimia's call (2026-08-19): the ordinary flora wear
 * **four colours in total**, all rich bioluminescent shades — one green, one
 * aqua, one blue, one indigo. Combined with texture, those four make the SIX
 * "fills" that the 48 collectible flora are built from (4 silhouettes ×
 * 2 sizes × 6 fills = 48).
 *
 * RIGHT NOW IT HOLDS CANDIDATES, NOT THE ANSWER. Three shades are offered per
 * hue so the choice is made by eye on the dark ground, the way the friend
 * palette was ("chosen, not calculated"). Once Kimia picks one per hue, the
 * losers are deleted and what is left is the permanent four — this file is
 * the flora's `friendColours.js`, and it outlives the workbench shelf.
 *
 * WHY THE COLOURS LIVE HERE AND NOT IN tokens.css (§11d): the tokens file
 * holds the colours the STYLESHEET wears. These are paints for artwork,
 * read only by the JavaScript that draws it — the same call friendColours.js,
 * friendPalettes.js, sky.jsx and textures.jsx all got.
 *
 * WHY THEY ARE RICH AND THE FRIENDS' ARE PASTEL. Blues and greens are the
 * flora's by rule (friendColours.js) — the friend palette keeps only one teal
 * and one baby blue so a friend is never mistaken for a plant. Saturation is
 * the second half of that boundary: flora glow deep and vivid, friends stay
 * soft, so the two families read apart even at a glance.
 * =========================================================================== */

/*
 * The four hues, each with three candidate shades. `name` is what the shelf
 * labels the swatch; `hex` is the body colour, and a flora glows its own body
 * colour (design-bible §3), so the same hex is the light it throws.
 */
export const FLORA_COLOUR_CANDIDATES = [
  {
    hue: 'green',
    shades: [
      { name: 'emerald', hex: '#43e08a' },
      { name: 'leaf', hex: '#6cf75f' },
      { name: 'deep green', hex: '#22c46e' },
    ],
  },
  {
    hue: 'aqua',
    shades: [
      { name: 'turquoise', hex: '#3fe0d0' },
      { name: 'pale aqua', hex: '#5df2ea' },
      { name: 'deep teal', hex: '#12b8a6' },
    ],
  },
  {
    hue: 'blue',
    shades: [
      { name: 'sky', hex: '#3aa9ff' },
      { name: 'azure', hex: '#2f7dff' },
      { name: 'pale blue', hex: '#58c6ff' },
    ],
  },
  {
    hue: 'indigo',
    shades: [
      { name: 'indigo', hex: '#6c5cff' },
      { name: 'violet', hex: '#8b6cff' },
      { name: 'deep indigo', hex: '#4b3fd6' },
    ],
  },
]

/* The order the four hues are always listed in — green through to indigo,
 * the way Kimia named them. */
export const FLORA_HUES = FLORA_COLOUR_CANDIDATES.map((group) => group.hue)
