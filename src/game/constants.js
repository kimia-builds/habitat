// All tunable game numbers live here (CLAUDE.md rule: no magic numbers
// in logic). Pacing maths for meters/drops arrives in M2/M3 — for now
// this holds the fixed shape of the habit model.

// Habit tags are exactly 6 abstract symbols, stored only as a number
// 1..6. No words, no labels, anywhere (spec §4.1). What each symbol
// looks like is decided in T5.1; what it MEANS lives only in Kimia's head.
export const SYMBOL_COUNT = 6

// Difficulty determines how far a completion advances the expedition
// meter (exact amounts arrive in T2.1).
export const DIFFICULTIES = ['easy', 'medium', 'difficult']

// The five schedule shapes from spec §4.1:
//   daily     — every day
//   weekdays  — specific days of the week, e.g. Mon/Wed/Fri
//   nPerWeek  — any N days each week, e.g. 3× per week
//   nPerDay   — N times each day, e.g. drink water 3× a day; each of the
//               N completions counts on its own, and the day is fulfilled
//               at N (fewer is neutral data, never punished)
//   whenever  — unscheduled; done when done
export const SCHEDULE_TYPES = [
  'daily',
  'weekdays',
  'nPerWeek',
  'nPerDay',
  'whenever',
]

// Weekday numbers use the ISO convention: 1 = Monday … 7 = Sunday.
// (Chosen over JavaScript's own 0=Sunday counting because ISO weeks are
// what the schedule engine in T1.2 will reason about.)
export const WEEKDAY_MIN = 1
export const WEEKDAY_MAX = 7
