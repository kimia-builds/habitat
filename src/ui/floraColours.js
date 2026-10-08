/*
 * floraColours.js — the flora palette (design-bible §9a)
 * =============================================================================
 * THE FOUR COLOURS OF N-Z-D'S FLORA (Kimia, 2026-08-19, T5.3g). The ordinary
 * flora wear **four colours in total**, and these are them. Combined with
 * texture they make the SIX "fills" the 48 collectible flora are built from
 * (4 silhouettes × 2 sizes × 6 fills = 48).
 *
 * CHOSEN BY EYE, NOT CALCULATED — the same way the friend palette was. Twelve
 * candidates went up on the workbench as plain glowing squares, three per hue;
 * these four came back. Note what that means: she named the hues as "green,
 * blue, indigo and aqua" on paper, and then picked **two greens and two blues**
 * off the screen. The screen won, as it always does here. There is no aqua and
 * no indigo in Habitat's flora.
 *
 * A FLORA GLOWS ITS OWN BODY COLOUR (design-bible §3), so each hex below is
 * both the body and the light it throws — there is no separate glow colour to
 * keep in step.
 *
 * WHY THESE LIVE HERE AND NOT IN tokens.css (§11d): the tokens file holds the
 * colours the STYLESHEET wears. These are paints for artwork, read only by the
 * JavaScript that draws it — the same call friendColours.js, friendPalettes.js,
 * sky.jsx and textures.jsx all got.
 *
 * WHY THEY ARE RICH AND THE FRIENDS' ARE PASTEL. Blues and greens are the
 * flora's by rule (friendColours.js) — the friend palette keeps only one teal
 * and one baby blue so a friend is never mistaken for a plant. Saturation is
 * the second half of that boundary: flora glow deep and vivid, friends stay
 * soft, so the two families read apart even at a glance. That boundary matters
 * more than ever now the flora turn out to be greens and blues and nothing
 * else.
 * =========================================================================== */

export const FLORA_COLOURS = [
  { name: 'emerald', hex: '#43e08a' },
  { name: 'leaf', hex: '#6cf75f' },
  { name: 'sky', hex: '#3aa9ff' },
  { name: 'azure', hex: '#2f7dff' },
]

/*
 * TEMPORARY (T5.3k, 2026-10-08): the second round. Kimia judged the first
 * round and the four settled colours too tame — bar `leaf`, none had enough
 * pop — and wants bioluminescent: neon, electric, luminous. So she picks all
 * six from scratch off a sweep of the blue-to-green range, with no fixed
 * split between greens and blues. Two rows: ELECTRIC (fully saturated) and
 * LUMINOUS (the same hues lifted toward white-hot). Each swatch is named by
 * its hue angle and row letter so she can call it by name ("150b"). Once she
 * picks, the six become FLORA_COLOURS and this list is deleted.
 */
const hex = (h, s, l) => {
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const to = (x) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`
}
const HUES = [120, 135, 150, 165, 180, 195, 210, 225, 240]
export const FLORA_COLOUR_CANDIDATES = [
  {
    hue: 'electric',
    shades: HUES.map((h) => ({ name: `${h}a`, hex: hex(h, 1, 0.5) })),
  },
  {
    hue: 'luminous',
    shades: HUES.map((h) => ({ name: `${h}b`, hex: hex(h, 1, 0.65) })),
  },
  // Round three (Kimia asked for more along the blue spectrum, keeping the
  // rows above): finer hue steps through cobalt, turquoise and aquamarine.
  // Named "cobalt 224" etc. — the word, then the hue angle.
  ...[
    ['cobalt', [212, 218, 224, 230, 236, 242], 0.55],
    ['turquoise', [166, 171, 176, 181, 186, 191], 0.5],
    ['aquamarine', [146, 151, 156, 161, 166, 171], 0.62],
  ].map(([hue, angles, l]) => ({
    hue,
    shades: angles.map((h) => ({ name: `${hue} ${h}`, hex: hex(h, 1, l) })),
  })),
  // Round four: eleven hand-picked hexes from Kimia, named by their hex.
  {
    hue: 'hers',
    shades: [
      '#25f7ff',
      '#10e1eb',
      '#0ab9f5',
      '#0ab9ee',
      '#50d5f6',
      '#73c0f7',
      '#2ba7e1',
      '#6ee8f7',
      '#21fd00',
      '#00fd19',
      '#50f7d0',
    ].map((h) => ({ name: h, hex: h })),
  },
]
