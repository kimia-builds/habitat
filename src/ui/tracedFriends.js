/*
 * tracedFriends.js — the roll-call of Kimia's nine traced archetypes
 * =============================================================================
 * TEMPORARY (2026-08-10), and it leaves with the workbench. Each of the nine
 * friendNN.jsx files is self-contained and identical in shape (a static body,
 * an eyes overlay, three pastel palettes), so the workbench draws them from
 * this one list rather than repeating the same swatch nine times.
 *
 * `width` is the card's width in rem, and it is the ONE place the archetypes'
 * relative sizes are set — the whole point of showing them side by side is
 * that a Drifter should read as small next to a Storyteller. The card's shape
 * comes from each artwork's own viewBox, so setting a width sets the card.
 * =========================================================================== */

import * as f01 from './friend01.jsx'
import * as f02 from './friend02.jsx'
import * as f03 from './friend03.jsx'
import * as f04 from './friend04.jsx'
import * as f05 from './friend05.jsx'
import * as f06 from './friend06.jsx'
import * as f07 from './friend07.jsx'
import * as f08 from './friend08.jsx'
import * as f09 from './friend09.jsx'

// PROVISIONAL WIDTHS (2026-08-10): a placeholder scale taken from each trace's
// own canvas, pending Kimia's pixel character sheet — which is the real source
// of how big each archetype is against the others. TODO: replace this column
// with the sheet's proportions (and re-proportion friend-10 and the
// storyteller to match) once she has sent it.
const PROVISIONAL_WIDTH = {
  '01': 7,
  '02': 9,
  '03': 9,
  '04': 11,
  '05': 13,
  '06': 8,
  '07': 13,
  '08': 13,
  '09': 14,
}

function entry(num, mod) {
  const U = `FRIEND${num}`
  const C = `Friend${num}`
  return {
    num,
    label: `friend ${num}`,
    viewBox: mod[`${U}_VIEWBOX`],
    palettes: mod[`${U}_PALETTES`],
    Body: mod[`${C}Body`],
    BodyDefs: mod[`${C}BodyDefs`],
    Eyes: mod[`${C}Eyes`],
    EyeDefs: mod.EyeDefs,
    width: PROVISIONAL_WIDTH[num],
  }
}

export const TRACED_FRIENDS = [
  entry('01', f01),
  entry('02', f02),
  entry('03', f03),
  entry('04', f04),
  entry('05', f05),
  entry('06', f06),
  entry('07', f07),
  entry('08', f08),
  entry('09', f09),
]

// The three reward-stream pastels every archetype is shown in.
export const FRIEND_TINTS = ['green', 'violet', 'amber']
