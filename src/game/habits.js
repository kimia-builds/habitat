// The habit model: pure functions only (no React, no localStorage),
// so every rule here is directly testable. A "habit" is a plain object:
//
//   {
//     id:          unique string, never changes
//     name:        non-empty string
//     description: string, may be empty
//     symbol:      integer 1..6 — the abstract tag (never a word)
//     difficulty:  'easy' | 'medium' | 'difficult'
//     schedule:    see SCHEDULE_TYPES in constants.js — the CURRENT one
//     scheduleHistory: [{ schedule, fromDay }] — every schedule this
//                  habit has had, each stamped with the Habitat day it
//                  took effect (ascending; the last entry is `schedule`).
//                  Added in T2.3: schedule edits are never retroactive
//                  (Kimia's decision 2026-07-16), so each past day is
//                  judged by the schedule that was in force THEN.
//     archived:    boolean — hidden from daily use, history kept
//     archivedAt:  timestamp (ms) when archived, else null — added in
//                  T2.3 so the field notes know when a habit's record
//                  stops
//     createdAt:   timestamp (ms)
//   }

import {
  DEFAULT_DAY_CUTOFF_HOUR,
  DIFFICULTIES,
  SCHEDULE_TYPES,
  SYMBOL_COUNT,
  WEEKDAY_MAX,
  WEEKDAY_MIN,
} from './constants.js'
import { dayKeyFromTimestamp, isValidDayKey } from './days.js'

function isInteger(value) {
  return typeof value === 'number' && Number.isInteger(value)
}

export function validateSchedule(schedule) {
  if (typeof schedule !== 'object' || schedule === null) {
    throw new Error('Schedule must be an object like { type: "daily" }.')
  }
  if (!SCHEDULE_TYPES.includes(schedule.type)) {
    throw new Error(
      `Schedule type must be one of: ${SCHEDULE_TYPES.join(', ')}.`,
    )
  }
  if (schedule.type === 'weekdays') {
    const days = schedule.days
    if (!Array.isArray(days) || days.length === 0) {
      throw new Error(
        'A weekdays schedule needs a non-empty list of days (1=Mon … 7=Sun).',
      )
    }
    for (const day of days) {
      if (!isInteger(day) || day < WEEKDAY_MIN || day > WEEKDAY_MAX) {
        throw new Error(`Weekday ${day} is not valid — use 1 (Mon) to 7 (Sun).`)
      }
    }
    if (new Set(days).size !== days.length) {
      throw new Error('A weekdays schedule lists each day at most once.')
    }
  }
  if (schedule.type === 'nPerWeek') {
    if (!isInteger(schedule.n) || schedule.n < 1 || schedule.n > 7) {
      throw new Error('An N-per-week schedule needs n between 1 and 7.')
    }
  }
  if (schedule.type === 'nPerDay') {
    // At least twice — "once per day" is what the daily schedule is for.
    if (!isInteger(schedule.n) || schedule.n < 2) {
      throw new Error(
        'An N-per-day schedule needs a whole number of at least 2 ' +
          '(for once a day, use a daily schedule).',
      )
    }
  }
}

// Are these two schedules the same, in meaning rather than in object
// identity? (Weekday lists compare as sets — Mon/Fri is Fri/Mon.)
export function sameSchedule(a, b) {
  if (a.type !== b.type) return false
  if (a.type === 'weekdays') {
    return [...a.days].sort().join() === [...b.days].sort().join()
  }
  if (a.type === 'nPerWeek' || a.type === 'nPerDay') return a.n === b.n
  return true
}

function validateScheduleHistory(habit) {
  const history = habit.scheduleHistory
  if (!Array.isArray(history) || history.length === 0) {
    throw new Error('Habit needs a schedule history with at least one entry.')
  }
  let previousDay = null
  for (const entry of history) {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('Each schedule history entry must be an object.')
    }
    validateSchedule(entry.schedule)
    if (!isValidDayKey(entry.fromDay)) {
      throw new Error(
        'Each schedule history entry needs the day it took effect.',
      )
    }
    if (previousDay !== null && entry.fromDay <= previousDay) {
      throw new Error('Schedule history must move forward in time.')
    }
    previousDay = entry.fromDay
  }
  if (!sameSchedule(history[history.length - 1].schedule, habit.schedule)) {
    throw new Error(
      "The schedule history's last entry must be the current schedule.",
    )
  }
}

export function validateHabit(habit) {
  if (typeof habit !== 'object' || habit === null) {
    throw new Error('Habit must be an object.')
  }
  if (typeof habit.id !== 'string' || habit.id === '') {
    throw new Error('Habit needs a non-empty string id.')
  }
  if (typeof habit.name !== 'string' || habit.name.trim() === '') {
    throw new Error('Habit needs a name.')
  }
  if (typeof habit.description !== 'string') {
    throw new Error('Habit description must be text (it may be empty).')
  }
  if (
    !isInteger(habit.symbol) ||
    habit.symbol < 1 ||
    habit.symbol > SYMBOL_COUNT
  ) {
    throw new Error(`Habit symbol must be a number from 1 to ${SYMBOL_COUNT}.`)
  }
  if (!DIFFICULTIES.includes(habit.difficulty)) {
    throw new Error(
      `Habit difficulty must be one of: ${DIFFICULTIES.join(', ')}.`,
    )
  }
  validateSchedule(habit.schedule)
  validateScheduleHistory(habit)
  if (typeof habit.archived !== 'boolean') {
    throw new Error('Habit archived flag must be true or false.')
  }
  if (habit.archived) {
    if (!isInteger(habit.archivedAt) || habit.archivedAt < 0) {
      throw new Error('An archived habit needs its archivedAt timestamp.')
    }
  } else if (habit.archivedAt !== null) {
    throw new Error('An unarchived habit must have archivedAt null.')
  }
  if (!isInteger(habit.createdAt) || habit.createdAt < 0) {
    throw new Error('Habit createdAt must be a timestamp.')
  }
}

// Create a new, validated habit. `now` and `id` can be passed in by
// tests to get predictable results; the app just calls createHabit(fields).
export function createHabit(
  { name, description = '', symbol, difficulty, schedule },
  now = Date.now(),
  id = crypto.randomUUID(),
) {
  const habit = {
    id,
    name: typeof name === 'string' ? name.trim() : name,
    description,
    symbol,
    difficulty,
    schedule,
    // The birth entry. Its fromDay uses the DEFAULT cutoff because
    // createHabit doesn't know the user's setting — harmless, since
    // the first entry governs every day before its own fromDay anyway
    // (see scheduleOn in schedule.js): the exact label can't change
    // any answer.
    scheduleHistory:
      schedule && SCHEDULE_TYPES.includes(schedule.type)
        ? [
            {
              schedule,
              fromDay: dayKeyFromTimestamp(now, DEFAULT_DAY_CUTOFF_HOUR),
            },
          ]
        : [],
    archived: false,
    archivedAt: null,
    createdAt: now,
  }
  validateHabit(habit)
  return habit
}

// Edit a habit's user-changeable fields. Returns a NEW object (the
// original is untouched); identity and history stamps can't change.
// The schedule is deliberately NOT editable here — schedule changes
// must be date-stamped, so they go through changeSchedule below.
export function updateHabit(habit, changes) {
  const allowed = ['name', 'description', 'symbol', 'difficulty']
  for (const key of Object.keys(changes)) {
    if (!allowed.includes(key)) {
      throw new Error(`Habit field "${key}" cannot be changed here.`)
    }
  }
  const updated = { ...habit, ...changes }
  if (typeof updated.name === 'string') updated.name = updated.name.trim()
  validateHabit(updated)
  return updated
}

// A schedule edit, date-stamped and never retroactive (Kimia's decision
// 2026-07-16): the old schedule keeps governing the days before
// `fromDay` (normally today), so past streak judgements can never be
// rewritten by a later edit. Several edits on the same day collapse
// into one — only what the day ended with counts.
export function changeSchedule(habit, schedule, fromDay) {
  validateSchedule(schedule)
  if (sameSchedule(habit.schedule, schedule)) return habit
  const history = habit.scheduleHistory
  const last = history[history.length - 1]
  if (fromDay < last.fromDay) {
    throw new Error(
      'A schedule change cannot take effect before an earlier change — ' +
        'the past is never rewritten.',
    )
  }
  let newHistory
  if (fromDay === last.fromDay) {
    // Second thoughts on the same day: replace, don't stack. If that
    // lands us back on the previous schedule, the day's edits simply
    // cancelled out.
    const kept = history.slice(0, -1)
    const previous = kept[kept.length - 1]
    newHistory =
      previous && sameSchedule(previous.schedule, schedule)
        ? kept
        : [...kept, { schedule, fromDay }]
  } else {
    newHistory = [...history, { schedule, fromDay }]
  }
  const updated = { ...habit, schedule, scheduleHistory: newHistory }
  validateHabit(updated)
  return updated
}

export function archiveHabit(habit, now = Date.now()) {
  return { ...habit, archived: true, archivedAt: now }
}

export function unarchiveHabit(habit) {
  return { ...habit, archived: false, archivedAt: null }
}

// --- Operations on the whole habit list -------------------------------

export function addHabit(habits, habit) {
  validateHabit(habit)
  if (habits.some((h) => h.id === habit.id)) {
    throw new Error('A habit with this id already exists.')
  }
  return [...habits, habit]
}

// Permanent delete — the habit (and, later, its history) is gone for
// good. Archiving is the gentle default; this is for typos and tests.
export function removeHabit(habits, id) {
  if (!habits.some((h) => h.id === id)) {
    throw new Error('No habit with this id exists.')
  }
  return habits.filter((h) => h.id !== id)
}

// Re-order: move one habit to a new position in the list. The array
// order IS the user's chosen order — storage keeps it, the UI shows it.
export function moveHabit(habits, id, toIndex) {
  const fromIndex = habits.findIndex((h) => h.id === id)
  if (fromIndex === -1) {
    throw new Error('No habit with this id exists.')
  }
  if (!isInteger(toIndex) || toIndex < 0 || toIndex >= habits.length) {
    throw new Error(`New position must be between 0 and ${habits.length - 1}.`)
  }
  const reordered = [...habits]
  const [moved] = reordered.splice(fromIndex, 1)
  reordered.splice(toIndex, 0, moved)
  return reordered
}

// Show only habits carrying one of the chosen symbols — the "show me
// just these tags" lens. An empty selection means no filter (show all).
export function filterBySymbols(habits, symbols) {
  if (!Array.isArray(symbols)) {
    throw new Error('Symbol filter must be a list of symbol numbers.')
  }
  if (symbols.length === 0) return habits
  return habits.filter((h) => symbols.includes(h.symbol))
}

export function activeHabits(habits) {
  return habits.filter((h) => !h.archived)
}

export function archivedHabits(habits) {
  return habits.filter((h) => h.archived)
}
