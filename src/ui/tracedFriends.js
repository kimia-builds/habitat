/*
 * tracedFriends.js — the roll-call of Kimia's nine traced archetypes
 * =============================================================================
 * Each of the nine friendNN.jsx files is self-contained and identical in shape
 * (a static body, an eyes overlay, three pastel palettes), so anything drawing
 * the cast walks this one list rather than repeating the same code nine times.
 *
 * NOTHING IMPORTS IT TODAY (2026-08-17). It was written for the workbench
 * shelves, and those came down once the colours were settled — but it is also
 * the only record of WHICH DRAWING IS WHICH SPECIES, so it waits here for the
 * task that puts the real drawings on the Guest Book, the reveal, the cameo
 * and the Abode. That task is its real reader; the workbench was a rehearsal.
 * (Friend 10 is not in the list: its component was assembled separately, and
 * joins this roll-call in that same task.)
 *
 * SIZES ARE NO LONGER SET HERE (T5.3d). They used to be: a column of rem
 * widths lived in this file, which meant the cast's proportions would have died
 * with the workbench that leaves with it. They now live in friendCanon.js as
 * unitless ratios, permanently, and this shelf is just one more screen picking
 * its own base size and multiplying — the same thing the Guest Book and the
 * arrival reveal will do when the real art reaches them.
 *
 * The card's shape still comes from each artwork's own viewBox, so setting a
 * width sets the card.
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
import { friendSize } from './friendCanon.js'

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
// WHICH DRAWING IS WHICH SPECIES (Kimia, 2026-08-17): "01 is the plip, and
// they follow in exact order" — the numbered drawings run straight down the
// literacy ladder, friend 01 the smallest and simplest, friend 10 the rarest
// and most sophisticated. That makes the NUMBERS a workbench-only convenience;
// the durable identity is the species key, which is what friendCanon.js is
// written against and what survives when this shelf is removed. Friend 10 is
// the hamdi bulo, and is drawn by its own component over in DesignPage.jsx.
const SPECIES_OF = {
  '01': 'plip',
  '02': 'baluhm',
  '03': 'krupengk',
  '04': 'zala',
  '05': 'liwi-bi-jiji',
  '06': 'meuhy',
  '07': 'rassatt',
  '08': 'woigolp',
  '09': 'chitu',
}

// THE SHELF'S OWN BASE SIZE, in rem: how much room the largest friend gets
// here. Every other friend is a fraction of it, straight from the canon. The
// value is the width the largest archetype already had, so the shelf still
// fills three to a row and nothing on screen moves — this task changed where
// the proportions live, not what they are.
export const SHELF_BASE_REM = 11.5

function entry(num, mod) {
  const U = `FRIEND${num}`
  const C = `Friend${num}`
  return {
    num,
    species: SPECIES_OF[num],
    label: `friend ${num}`,
    viewBox: mod[`${U}_VIEWBOX`],
    palettes: mod[`${U}_PALETTES`],
    // The trace's OWN greys — its shade list in paint order, plus the
    // reconstructed darkest `base` on the six banded traces that needed one.
    // The three named tints don't need this (palettesFor already baked them),
    // but the individuals do: their colours are generated per friend from a
    // tone, and `paletteForTone` needs the greys to generate FROM.
    greys: mod[`${U}_GREYS`],
    Body: mod[`${C}Body`],
    BodyDefs: mod[`${C}BodyDefs`],
    Eyes: mod[`${C}Eyes`],
    EyeDefs: mod.EyeDefs,
    width: friendSize(SPECIES_OF[num], SHELF_BASE_REM),
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
