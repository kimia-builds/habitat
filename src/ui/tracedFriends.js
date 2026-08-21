/*
 * tracedFriends.js — the roll-call of Kimia's ten traced archetypes
 * =============================================================================
 * PERMANENT as of 2026-08-21. This file was written for the workbench shelves
 * and waited, unread, from the day they came down (2026-08-17) until the task
 * that puts the real drawings on the real screens. That task is its reader, and
 * it is now what every screen asks "what does this species look like".
 *
 * Each of the ten friendNN.jsx files is self-contained and identical in shape
 * — a static body, an eyes overlay, its own greys — so anything drawing a
 * friend looks the species up here rather than importing ten modules and
 * choosing between them. Friend 10 joins the other nine here, as its own
 * header always said it would: it was assembled separately on the workbench.
 *
 * KEYED BY SPECIES, NOT BY NUMBER. The numbers were a workbench convenience —
 * a shelf ordered by drawing. The durable identity is the species key (Kimia,
 * 2026-08-17: "01 is the plip, and they follow in exact order" down the
 * literacy ladder, 01 the smallest and simplest, 10 the rarest and most
 * sophisticated). The number is kept alongside each entry only so a drawing can
 * still be traced back to the file it came from.
 *
 * WHAT IT DOES *NOT* HOLD. Not sizes — those are ratios in friendCanon.js, so
 * that the cast's proportions could never die with the shelf. Not colours —
 * an individual's colour is dealt in friendColours.js and painted through
 * friendPalettes.js. The three reward-stream pastels each drawing exports
 * (FRIENDNN_PALETTES) were the workbench's own way of showing an archetype in
 * a tint before the individuals existed; nothing in the game asks for them.
 * What lives here is only the drawing itself.
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
import * as f10 from './friend10.jsx'

// One drawing's parts, gathered from its module's uniformly-named exports.
function art(num, mod) {
  const U = `FRIEND${num}`
  const C = `Friend${num}`
  return {
    // Which of Kimia's files this drawing came from — for reading the source,
    // never for identifying a friend.
    num,
    // The artwork's own canvas, so a screen setting a WIDTH gets the drawing's
    // own shape for free.
    viewBox: mod[`${U}_VIEWBOX`],
    // The trace's own greys in its source paint order, plus the reconstructed
    // darkest `base` on the traces that needed one. This is what an
    // individual's colour is generated FROM (friendPalettes.paletteForTone).
    greys: mod[`${U}_GREYS`],
    // The two halves every friend ships as, and their defs. The split is
    // load-bearing — friend10.jsx's header explains why the blinking eyes may
    // never share an svg with the blurred body.
    Body: mod[`${C}Body`],
    BodyDefs: mod[`${C}BodyDefs`],
    Eyes: mod[`${C}Eyes`],
    EyeDefs: mod.EyeDefs,
  }
}

// THE TEN, in ladder order — the same order as FRIEND_CATEGORIES and
// FRIEND_CANON, so the three read as one table.
const FRIEND_ART = {
  plip: art('01', f01),
  baluhm: art('02', f02),
  krupengk: art('03', f03),
  zala: art('04', f04),
  'liwi-bi-jiji': art('05', f05),
  meuhy: art('06', f06),
  rassatt: art('07', f07),
  woigolp: art('08', f08),
  chitu: art('09', f09),
  'hamdi-bulo': art('10', f10),
}

/**
 * What this species looks like — `{ num, viewBox, greys, Body, BodyDefs,
 * Eyes, EyeDefs }`, or undefined if the key is not one of the ten.
 *
 * All ten keys have a drawing and tracedFriends.test.js keeps it that way, so an
 * undefined here means a bad key was passed, not a missing archetype.
 */
export function friendArt(key) {
  return FRIEND_ART[key]
}
