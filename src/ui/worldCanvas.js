/*
 * worldCanvas.js — the size of a world page's picture (T5.4)
 * =============================================================================
 * The Abode, the Map, the Library and the Market are the four GAMEPLAY pages —
 * the places you go to look at what you have, rather than to mark a habit done.
 * Since 2026-08-21 they are all the same size, and that size never changes.
 *
 * KIMIA'S RULE (2026-08-21): "if the window size is smaller, then things get
 * hidden and the user will need to scroll around to find things, rather than
 * for the size to shrink."
 *
 * That is the whole design, and it is the opposite of what the pages did
 * before. Until today the Abode's ground was an SVG stretched to whatever width
 * the 40rem text column happened to give it, so the same abode was a different
 * shape on every screen and a flora you put by the left edge sat somewhere else
 * on a laptop than on a monitor. A place you ARRANGE cannot do that: an
 * arrangement is only yours if it stays put. So the picture is now a fixed
 * 1000 × 600 CSS pixels everywhere, and a window too small to show all of it
 * shows PART of it and scrolls — the same bargain a paper map makes.
 *
 * ONE UNIT IS ONE PIXEL. The SVG viewBox is `0 0 1000 600` and the CSS box is
 * 1000px × 600px, so anything positioned in these units lands on the pixel of
 * the same name. Nothing has to be converted, and a size written here is the
 * size you get.
 *
 * WHY 1000 × 600. Kimia's number ("around 1000x600px"), chosen for the Abode
 * and then given to the other three so that moving between the four gameplay
 * pages never resizes the frame under you. Each page still draws whatever shape
 * it likes INSIDE that frame — the Map's planet stays round, the Market's stall
 * stays a row — but the frame itself is one size, one shape, everywhere.
 *
 * THE PHONE GETS ITS OWN NUMBERS, AND THEY ARE NOT SET (2026-08-21, Kimia).
 * M8 builds a separate phone shell (spec §5b, design-notes §14), and its canvas
 * will be a DIFFERENT size — not this one scaled down. A phone held upright is
 * a tall thin window, and 1000 × 600 shrunk to fit it would make the abode a
 * postage stamp; shown at full size it would be almost entirely off-screen.
 * Which numbers a phone gets is an M8 decision made by eye on a real phone, so
 * this file deliberately holds no phone size — the same discipline floraCanon.js
 * keeps about the landmark class. NOTHING MAY INVENT ONE IN THE MEANTIME.
 *
 * THE MIRROR. These two numbers also live in tokens.css, as
 * `--world-canvas-width` / `--world-canvas-height`, because the stylesheet is
 * what actually sizes the box (design-notes §11d: a value the stylesheet wears
 * is a token). JavaScript needs them too, for the viewBox and for placing
 * things in the scene, and CSS custom properties cannot be read from a module.
 * So this is a MIRROR, in the exact sense symbols.js is a mirror of the charm
 * colours — and like that one it is guarded: worldCanvas.test.js fails the
 * suite if the two ever disagree. Change one, change the other.
 * =========================================================================== */

export const CANVAS_WIDTH = 1000
export const CANVAS_HEIGHT = 600

// The viewBox every world page's scene wears, so no page writes it out.
export const CANVAS_VIEWBOX = `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`
