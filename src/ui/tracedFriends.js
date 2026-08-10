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

// CARD WIDTHS, in rem, read off Kimia's pixel character sheet (2026-08-10):
// the sheet draws all ten archetypes together at their canonical sizes, so it
// — not the trace canvases, which are just export settings — is what says how
// big each friend is against the others.
//
// How a sheet size became a width: each friend was measured on the sheet, and
// the two numbers reduced to one "how big does it read" figure, the square
// root of width × height. Going by width alone would have made the wide, low
// friends (05, 07) loom over the tall narrow ones (06) even where the sheet
// shows them similar. That figure is then turned back into a card width using
// the artwork's own proportions, so each drawing keeps its shape and only its
// scale changes.
//
// The scale is set by friend 09, the widest, filling the shelf three to a row.
// Friend 10 falls out of the same maths at 11rem — exactly the width its card
// already had, which is a decent check that the mapping is sound.
const CARD_WIDTH = {
  '01': 1.6, // the tiny one — Kimia: "its relative size should be tiny"
  '02': 4.8,
  '03': 4.8,
  '04': 6.9,
  '05': 9.4,
  '06': 4.2,
  '07': 9.9,
  '08': 9.1,
  '09': 11.5, // the widest of the nine, and the scale's anchor
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
    width: CARD_WIDTH[num],
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
