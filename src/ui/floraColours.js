/*
 * floraColours.js — the flora palette (design-bible §9a)
 * =============================================================================
 * THE SIX COLOURS OF N-Z-D'S FLORA (Kimia, 2026-10-08, T5.3k). The ordinary
 * flora wear **six colours in total**, and a colour is the WHOLE fill now — the
 * hair textures are gone (4 silhouettes × 2 sizes × 6 colours = 48 collectible
 * flora). They replace the four of 2026-08-19 (emerald, leaf, sky, azure),
 * which she judged too tame.
 *
 * CHOSEN BY EYE, NOT CALCULATED — the same way the friend palette was. Four
 * rounds of glowing squares on the workbench, down to a shortlist of eleven and
 * then to these six, bioluminescent and neon, running from green to blue with
 * no fixed split. They are not yet NAMED — Kimia names things — so each is
 * known by its hex until she does.
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

const HEXES = ['#00ff00', '#50f7d0', '#00ffff', '#73c0f7', '#0ab9ee', '#0080ff']

export const FLORA_COLOURS = HEXES.map((hex) => ({ id: hex.slice(1), hex }))
