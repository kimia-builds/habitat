// Reading stages and the reading pool (T6.24) — pure logic, no React,
// no storage.
//
// Two measures grow from the same literacy points (spec §5 Stream 2):
// the literacy LEVEL (which friends can arrive) and the reading STAGE
// (what we get to see inside our reading material). This module is the
// second one.
//
//   - readingStageFor(points): which of the six stages those points
//     have reached (1 = pictures only … 6 = fully comprehensible).
//   - pickPublication(...): when a reading drop lands, which text of
//     the pool does the new book hold? Any text of the current stage or
//     a stage already passed — NEVER a higher one. Early material can
//     recur for ever; stage 1 is always open, so we can always begin.
//
// The answer is SEEDED like every other roll (drops.js): the same tap
// always holds the same text, so undo-and-redo cannot reroll a book.
// It is stored on the drop (`publicationId`), so a book keeps its text
// for good — "old stays old": a stage-1 book is never re-read as
// something grander because the stage has since grown.
//
// A publication id reads  s<stage>-<type>-<nn>,  e.g. 's3-magazine-07'.
// The ids are the keys of the pool in src/content/readingTexts.js.

import {
  READING_POOL_PER_STAGE,
  READING_STAGE_THRESHOLDS,
  READING_TYPES,
} from './constants.js'
import { randomUnit } from './drops.js'

export const READING_STAGE_COUNT = READING_STAGE_THRESHOLDS.length

// The stage these literacy points have reached, 1..6. Landing exactly
// ON a threshold reaches it.
export function readingStageFor(points) {
  if (!Number.isFinite(points) || points < 0) {
    throw new Error('Literacy points must be a number, zero or more.')
  }
  return READING_STAGE_THRESHOLDS.filter((t) => points >= t).length
}

// 's3-magazine-07' from (3, 'magazine', 7). `number` counts from 1.
export function publicationId(stage, type, number) {
  return `s${stage}-${type}-${String(number).padStart(2, '0')}`
}

// Every id in the pool, stage by stage — 126 in all. The content file
// is built from this list, and its test checks that nothing is missing.
export function allPublicationIds() {
  const ids = []
  for (let stage = 1; stage <= READING_STAGE_COUNT; stage++) {
    for (const type of READING_TYPES) {
      for (let n = 1; n <= READING_POOL_PER_STAGE[type]; n++) {
        ids.push(publicationId(stage, type, n))
      }
    }
  }
  return ids
}

// Take an id apart again, or null if it is not one of ours.
export function parsePublicationId(id) {
  if (typeof id !== 'string') return null
  const match = /^s(\d+)-([a-z]+)-(\d+)$/.exec(id)
  if (!match) return null
  const stage = Number(match[1])
  const type = match[2]
  const number = Number(match[3])
  if (
    stage < 1 ||
    stage > READING_STAGE_COUNT ||
    !READING_TYPES.includes(type) ||
    number < 1 ||
    number > READING_POOL_PER_STAGE[type]
  ) {
    return null
  }
  return { stage, type, number }
}

// Which text a new book of this type holds. `maxStage` is the reader's
// current stage; the pick is uniform over every text of that type in
// stages 1..maxStage. `seedString` carries the tap's stable facts.
export function pickPublication(type, maxStage, seedString) {
  if (!READING_TYPES.includes(type)) {
    throw new Error(`Unknown reading type "${type}".`)
  }
  if (
    !Number.isInteger(maxStage) ||
    maxStage < 1 ||
    maxStage > READING_STAGE_COUNT
  ) {
    throw new Error(`A reading stage must be 1–${READING_STAGE_COUNT}.`)
  }
  const perStage = READING_POOL_PER_STAGE[type]
  const slot = Math.floor(randomUnit(seedString) * perStage * maxStage)
  const stage = Math.floor(slot / perStage) + 1
  return publicationId(stage, type, (slot % perStage) + 1)
}

// Books received BEFORE this system existed carry no text. They get a
// stage-1 text, chosen from the book's own id, so a given old book
// always shows the same one (and nothing is ever blank for lack of one).
export function legacyPublicationId(itemId, type) {
  return pickPublication(type, 1, `legacy|${itemId}`)
}
