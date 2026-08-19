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
