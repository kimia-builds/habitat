/*
 * floraFills.js — the six fills of N-Z-D's ordinary flora (design-bible §9a)
 * =============================================================================
 * A FILL IS A COLOUR (Kimia, 2026-10-08, T5.3k). A flora used to wear a hair
 * texture in a colour; the textures are retired from the flora and what is left
 * is the plain colour, so the six fills ARE the six colours and the arithmetic
 * still holds:
 *
 *     4 silhouettes × 2 sizes × 6 colours = 48 collectible flora
 *
 * A find's fill is rolled evenly from these (floraDeal.js): every colour turns
 * up one time in six.
 * =========================================================================== */

import { FLORA_COLOURS } from './floraColours.js'

export const FLORA_FILLS = FLORA_COLOURS
