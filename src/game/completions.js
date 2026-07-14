// A completion is one "I did this" record:
//
//   {
//     id:         unique string
//     habitId:    the habit it belongs to
//     recordedAt: timestamp (ms) — the moment it was ENTERED in the app
//     dayKey:     'YYYY-MM-DD'   — the Habitat day it was DONE
//   }
//
// recordedAt and dayKey are two deliberately separate facts (spec §4.2):
// a morning check-in mark is entered on Monday but was done on Sunday,
// and the data must say Sunday. dayKey is decided ONCE, when the record
// is created, and never recomputed — changing the day cutoff later
// re-labels nothing; history stays frozen (Kimia's decision 2026-07-13).

import {
  addDays,
  dayKeyFromTimestamp,
  isValidDayKey,
  validateDayKey,
  weekStart,
} from './days.js'

export function validateCompletion(completion) {
  if (typeof completion !== 'object' || completion === null) {
    throw new Error('Completion must be an object.')
  }
  if (typeof completion.id !== 'string' || completion.id === '') {
    throw new Error('Completion needs a non-empty string id.')
  }
  if (typeof completion.habitId !== 'string' || completion.habitId === '') {
    throw new Error('Completion needs the id of its habit.')
  }
  if (!Number.isInteger(completion.recordedAt) || completion.recordedAt < 0) {
    throw new Error('Completion recordedAt must be a timestamp.')
  }
  if (!isValidDayKey(completion.dayKey)) {
    throw new Error('Completion dayKey must be a real YYYY-MM-DD date.')
  }
}

// A live completion — the user taps "done" right now. Which day it
// counts for is worked out from the clock and the cutoff, then frozen.
// `now` and `id` can be passed in by tests for predictable results.
export function recordCompletion(
  habitId,
  cutoffHour,
  now = Date.now(),
  id = crypto.randomUUID(),
) {
  const completion = {
    id,
    habitId,
    recordedAt: now,
    dayKey: dayKeyFromTimestamp(now, cutoffHour),
  }
  validateCompletion(completion)
  return completion
}

// The backfill window (Kimia's decision 2026-07-14, spec §4.2): may a
// retroactive mark still target this day? Calendar yesterday: always —
// that's the morning check-in, even when yesterday was last week
// (Monday filling in Sunday). Any other past day: only while its week
// (Mon–Sun) is still the current week. Once a week has passed, its
// days are frozen history. Today and the future are never "retro".
export function canRecordRetroOn(dayKey, todayKey) {
  validateDayKey(dayKey)
  validateDayKey(todayKey)
  if (dayKey >= todayKey) return false
  if (dayKey === addDays(todayKey, -1)) return true
  return weekStart(dayKey) === weekStart(todayKey)
}

// A retroactive completion — the morning check-in (T1.4) saying "I did
// this YESTERDAY" (or on an earlier day of the current week). The
// caller names the day it was done; recordedAt still tells the truth
// about when it was entered.
export function recordRetroCompletion(
  habitId,
  dayKey,
  cutoffHour,
  now = Date.now(),
  id = crypto.randomUUID(),
) {
  validateDayKey(dayKey)
  const today = dayKeyFromTimestamp(now, cutoffHour)
  if (dayKey >= today) {
    throw new Error(
      'A retroactive completion must be for a day before today — ' +
        'for today, record it normally.',
    )
  }
  if (!canRecordRetroOn(dayKey, today)) {
    throw new Error(
      'This day can no longer be filled in — once a week has passed, ' +
        'its days are frozen (only the current week and yesterday stay ' +
        'editable).',
    )
  }
  const completion = { id, habitId, recordedAt: now, dayKey }
  validateCompletion(completion)
  return completion
}

// How many times this habit was done on this Habitat day.
export function countOn(completions, habitId, dayKey) {
  return completions.filter((c) => c.habitId === habitId && c.dayKey === dayKey)
    .length
}

// How many times this habit was ever done. A one-time habit is "done"
// when this is non-zero; its single completion's dayKey says when.
export function countFor(completions, habitId) {
  return completions.filter((c) => c.habitId === habitId).length
}

// Undo one mark: remove the most recently ENTERED completion of this
// habit on this day. The UI only ever offers this for the current day —
// a mis-tap costs nothing (Kimia's decision 2026-07-13), while past
// days stay frozen. Returns a new list; the original is untouched.
export function removeLatestOn(completions, habitId, dayKey) {
  let latest = -1
  for (let i = 0; i < completions.length; i++) {
    const c = completions[i]
    if (c.habitId !== habitId || c.dayKey !== dayKey) continue
    if (latest === -1 || c.recordedAt >= completions[latest].recordedAt) {
      latest = i
    }
  }
  if (latest === -1) {
    throw new Error('Nothing to undo — this habit has no mark on this day.')
  }
  return completions.filter((_, i) => i !== latest)
}

// A permanently deleted habit takes its history with it (spec §10:
// archiving keeps history, deleting is for good) — no orphaned records.
export function removeCompletionsFor(completions, habitId) {
  return completions.filter((c) => c.habitId !== habitId)
}
