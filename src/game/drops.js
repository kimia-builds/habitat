// The drops engine (T3.1) — pure maths, no React, no storage.
//
// On every habit completion, three independent streams may deliver:
//   - a FLORA find    (steady: guaranteed once per window of steps)
//   - READING material (rare and surprising: magazine/novel/dictionary)
//   - FUNGI            (occasional: a small cluster of currency)
// All rates live in constants.js.
//
// SEEDED, NEVER SHUFFLED (Kimia's decision 2026-07-19): every roll is
// a pure function of a WORLD SEED plus stable facts about the tap —
// which habit, which Habitat day, which tap of that day, which
// expedition step. The same tap always yields the same result. So:
//   - undoing a completion takes its drops back with it,
//   - redoing the identical tap returns the identical drops,
//   - tap–untap–tap can never be used as a slot machine.
// (The world seed itself is created once and stored — wired up in
// T3.2. The engine just takes it as an argument.)
//
// The two "which tap" numbers, defined precisely:
//   stepIndex — how many completions existed anywhere in the app
//               before this one (so this tap IS expedition step
//               number stepIndex, counting from 0). Drives flora.
//   tapIndex  — how many completions of THIS habit on THIS day
//               existed before this one (0 for the day's first tap).
//               Drives reading and fungi.

import {
  DIFFICULTIES,
  DIFFICULTY_DROP_MULTIPLIER,
  FLORA_WINDOW_STEPS,
  FUNGUS_CLUSTER_WEIGHTS,
  FUNGUS_DROP_CHANCE,
  READING_DROP_CHANCES,
  READING_TYPES,
} from './constants.js'
import { validateDayKey } from './days.js'

// ── Seeded randomness ───────────────────────────────────────────────

// Turn any string into a number 0 ≤ r < 1, the same number every
// time. This is the whole trick behind "seeded, never shuffled":
// build a descriptive string from the tap's stable facts, hash it,
// and the "random" outcome is fixed forever. (FNV-1a string hash
// with a final bit-mix — standard, boring, well-scattered.)
export function randomUnit(seedString) {
  if (typeof seedString !== 'string' || seedString === '') {
    throw new Error('randomUnit needs a non-empty seed string.')
  }
  let h = 0x811c9dc5
  for (let i = 0; i < seedString.length; i++) {
    h ^= seedString.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

// ── Shared validation ───────────────────────────────────────────────

function validateWorldSeed(worldSeed) {
  if (typeof worldSeed !== 'string' || worldSeed === '') {
    throw new Error('The world seed must be a non-empty string.')
  }
}

function validateIndex(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a whole number, zero or more.`)
  }
}

function validateTapFacts({
  worldSeed,
  habitId,
  dayKey,
  tapIndex,
  difficulty,
}) {
  validateWorldSeed(worldSeed)
  if (typeof habitId !== 'string' || habitId === '') {
    throw new Error('A drop roll needs the id of its habit.')
  }
  validateDayKey(dayKey)
  validateIndex(tapIndex, 'tapIndex')
  if (!DIFFICULTIES.includes(difficulty)) {
    throw new Error(
      `Unknown difficulty "${difficulty}" — expected one of: ` +
        DIFFICULTIES.join(', '),
    )
  }
}

// ── Flora (Stream 1): one guaranteed find per window ────────────────

// Which expedition step hides this window's flora find. Each window
// of FLORA_WINDOW_STEPS steps contains exactly one, at a seeded
// random position inside it — steady (no droughts possible), yet
// each find still lands as a surprise.
export function floraTargetStep(windowIndex, worldSeed) {
  validateIndex(windowIndex, 'windowIndex')
  validateWorldSeed(worldSeed)
  const offset = Math.floor(
    randomUnit(`${worldSeed}|flora|${windowIndex}`) * FLORA_WINDOW_STEPS,
  )
  return windowIndex * FLORA_WINDOW_STEPS + offset
}

// Does the tap that lands on this expedition step find flora?
export function floraAtStep(stepIndex, worldSeed) {
  validateIndex(stepIndex, 'stepIndex')
  validateWorldSeed(worldSeed)
  const windowIndex = Math.floor(stepIndex / FLORA_WINDOW_STEPS)
  return floraTargetStep(windowIndex, worldSeed) === stepIndex
}

// ── Reading material (Stream 2): a plain chance per tap ─────────────

// One roll decides magazine, novel, dictionary or nothing. The types
// are checked rarest first, so a lucky (low) roll wins the rarest
// prize — and a higher difficulty multiplier can only ever upgrade a
// tap's result, never downgrade it.
export function rollReading(tapFacts) {
  validateTapFacts(tapFacts)
  const { worldSeed, habitId, dayKey, tapIndex, difficulty } = tapFacts
  const multiplier = DIFFICULTY_DROP_MULTIPLIER[difficulty]
  const roll = randomUnit(
    `${worldSeed}|reading|${habitId}|${dayKey}|${tapIndex}`,
  )
  const rarestFirst = [...READING_TYPES].sort(
    (a, b) => READING_DROP_CHANCES[a] - READING_DROP_CHANCES[b],
  )
  let threshold = 0
  for (const type of rarestFirst) {
    threshold += READING_DROP_CHANCES[type] * multiplier
    if (roll < threshold) return type
  }
  return null
}

// ── Fungi (Stream 3): an occasional cluster of currency ─────────────

// Returns how many fungi this tap drops — usually 0. When the drop
// roll hits, a second (independently seeded) roll picks the cluster
// size from the weights in constants.js. The size roll ignores
// difficulty on purpose: difficulty nudges WHETHER fungi appear, not
// how many.
export function rollFungi(tapFacts) {
  validateTapFacts(tapFacts)
  const { worldSeed, habitId, dayKey, tapIndex, difficulty } = tapFacts
  const multiplier = DIFFICULTY_DROP_MULTIPLIER[difficulty]
  const roll = randomUnit(`${worldSeed}|fungi|${habitId}|${dayKey}|${tapIndex}`)
  if (roll >= FUNGUS_DROP_CHANCE * multiplier) return 0

  const totalWeight = FUNGUS_CLUSTER_WEIGHTS.reduce(
    (sum, entry) => sum + entry.weight,
    0,
  )
  const sizeRoll =
    randomUnit(`${worldSeed}|fungi-cluster|${habitId}|${dayKey}|${tapIndex}`) *
    totalWeight
  let cumulative = 0
  for (const entry of FUNGUS_CLUSTER_WEIGHTS) {
    cumulative += entry.weight
    if (sizeRoll < cumulative) return entry.amount
  }
  // Unreachable while the weights list is non-empty; guards a future
  // constants typo loudly instead of silently dropping nothing.
  throw new Error('Fungus cluster weights failed to pick a size.')
}

// ── Drop records ────────────────────────────────────────────────────

// One drop record, as stored on a completion (T3.2). Shapes:
//   { kind: 'flora' }
//   { kind: 'reading', readingType: 'magazine' | 'novel' | 'dictionary' }
//   { kind: 'fungi', amount: 1.. }
export function validateDrop(drop) {
  if (typeof drop !== 'object' || drop === null) {
    throw new Error('A drop must be an object.')
  }
  if (drop.kind === 'flora') return
  if (drop.kind === 'reading') {
    if (!READING_TYPES.includes(drop.readingType)) {
      throw new Error(
        `Unknown reading type "${drop.readingType}" — expected one of: ` +
          READING_TYPES.join(', '),
      )
    }
    return
  }
  if (drop.kind === 'fungi') {
    if (!Number.isInteger(drop.amount) || drop.amount <= 0) {
      throw new Error('A fungus drop must carry a positive whole amount.')
    }
    return
  }
  throw new Error(
    `Unknown drop kind "${drop.kind}" — expected flora, reading or fungi.`,
  )
}

// ── The whole tap ───────────────────────────────────────────────────

// Everything one completion delivers, as a list of drop records:
//   { kind: 'flora' }
//   { kind: 'reading', readingType: 'magazine' | 'novel' | 'dictionary' }
//   { kind: 'fungi', amount: 1.. }
// Usually the list is empty. The three streams roll independently
// (spec §5: independent in earning), so a single tap can — rarely —
// deliver more than one kind at once.
export function rollDrops(tapFacts) {
  validateTapFacts(tapFacts)
  validateIndex(tapFacts.stepIndex, 'stepIndex')
  const drops = []
  if (floraAtStep(tapFacts.stepIndex, tapFacts.worldSeed)) {
    drops.push({ kind: 'flora' })
  }
  const readingType = rollReading(tapFacts)
  if (readingType !== null) {
    drops.push({ kind: 'reading', readingType })
  }
  const fungi = rollFungi(tapFacts)
  if (fungi > 0) {
    drops.push({ kind: 'fungi', amount: fungi })
  }
  return drops
}
