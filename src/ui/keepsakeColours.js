/*
 * keepsakeColours.js — the four colours a keepsake may wear (T5.3l)
 * =============================================================================
 * Kimia's pick, 2026-10-09, by eye off the workbench from twelve candidates in
 * the reds, pinks and oranges: a true red, a hot magenta-pink, a soft pink and
 * a vivid orange. A keepsake is dealt one of these at random and is drawn by
 * the flora's own recipe (plain opaque fill, outline, glow at the lifted
 * level), so each hex is both the body and the light it throws.
 *
 * Reds, pinks and oranges are the keepsakes' own, apart from the flora's greens
 * and blues. Not yet NAMED — Kimia names things — so each is known by its hex.
 * Nothing reads this yet: the keepsake drawings and drop logic come later.
 * =========================================================================== */

const HEXES = ['#ff0000', '#ff2d95', '#ff9ecb', '#ff5e00']

export const KEEPSAKE_COLOURS = HEXES.map((hex) => ({ id: hex.slice(1), hex }))
