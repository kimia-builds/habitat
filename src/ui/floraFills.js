/*
 * floraFills.js — the six fills of N-Z-D's ordinary flora (design-bible §9a)
 * =============================================================================
 * WHAT A FILL IS. A collectible flora is a silhouette, a size and a **fill**,
 * where a fill is one texture worn in one colour. Six of them exist, and the
 * arithmetic is exact:
 *
 *     4 silhouettes × 2 sizes × 6 fills = 48 collectible flora
 *
 * KIMIA'S CALLS (2026-08-19, T5.3g):
 *   • The fills are made from the HAIR textures only — none of the solid
 *     surfaces (moss, bark, pores, sponge). Flora are furred, not crusted.
 *   • All four hair modes are used, with **curly coat twice and dense underfur
 *     twice**: 1 + 2 + 1 + 2 = 6.
 *   • The hair is the fill INSIDE the silhouette — it never fringes out past
 *     the outline. Whatever draws a flora clips the field to its shape.
 *   • The four colours are settled in floraColours.js.
 *
 * THE PAIRING (proposed here, for her eye). The two doubled textures each take
 * one green and one blue, so no texture belongs to a single hue and the six
 * fills split three green / three blue. The two single-use textures take the
 * remaining ends of the palette.
 * =========================================================================== */

import { FLORA_COLOURS } from './floraColours.js'

const colour = (name) => {
  const found = FLORA_COLOURS.find((c) => c.name === name)
  // A fill naming a colour the palette does not have is a mistake worth
  // stopping for, not one to paint in black and ship.
  if (!found) throw new Error(`floraFills: no flora colour named "${name}"`)
  return found
}

export const FLORA_FILLS = [
  { id: 'curled-emerald', mode: 'curled', colour: colour('emerald') },
  { id: 'coat-leaf', mode: 'coat', colour: colour('leaf') },
  { id: 'coat-sky', mode: 'coat', colour: colour('sky') },
  { id: 'wispy-azure', mode: 'wispy', colour: colour('azure') },
  { id: 'underfur-emerald', mode: 'underfur', colour: colour('emerald') },
  { id: 'underfur-azure', mode: 'underfur', colour: colour('azure') },
]
