// The habit model: pure functions only (no React, no localStorage),
// so every rule here is directly testable. A "habit" is a plain object:
//
//   {
//     id:          unique string, never changes
//     name:        non-empty string
//     description: string, may be empty
//     symbol:      integer 1..6 — the abstract tag (never a word)
//     difficulty:  'easy' | 'medium' | 'difficult'
//     schedule:    see SCHEDULE_TYPES in constants.js
//     archived:    boolean — hidden from daily use, history kept
//     createdAt:   timestamp (ms)
//   }

import {
  DIFFICULTIES,
  SCHEDULE_TYPES,
  SYMBOL_COUNT,
  WEEKDAY_MAX,
  WEEKDAY_MIN,
} from './constants.js'

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
  if (typeof habit.archived !== 'boolean') {
    throw new Error('Habit archived flag must be true or false.')
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
    archived: false,
    createdAt: now,
  }
  validateHabit(habit)
  return habit
}

// Edit a habit's user-changeable fields. Returns a NEW object (the
// original is untouched); identity and history stamps can't change.
export function updateHabit(habit, changes) {
  const allowed = ['name', 'description', 'symbol', 'difficulty', 'schedule']
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

export function archiveHabit(habit) {
  return { ...habit, archived: true }
}

export function unarchiveHabit(habit) {
  return { ...habit, archived: false }
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

export function activeHabits(habits) {
  return habits.filter((h) => !h.archived)
}

export function archivedHabits(habits) {
  return habits.filter((h) => h.archived)
}
