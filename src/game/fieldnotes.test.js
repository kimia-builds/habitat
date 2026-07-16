import { describe, expect, it } from 'vitest'
import { recordCompletion } from './completions.js'
import { earliestWeek, shouldOpenFieldNotes, weekNotes } from './fieldnotes.js'
import { archiveHabit, createHabit } from './habits.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3
const LONG_AGO = at(2020, 1, 1, 12)

let nextId = 0
const doneBy = (habitId, y, month, d, h = 9) =>
  recordCompletion(habitId, CUTOFF, at(y, month, d, h), `c${nextId++}`)

const makeHabit = (id, schedule, createdAt = LONG_AGO) =>
  createHabit(
    { name: `habit ${id}`, symbol: 1, difficulty: 'medium', schedule },
    createdAt,
    id,
  )

// Anchors (verified in days.test.js): 2026-07-13 is a Monday. Most
// tests look at the week of July 6th–12th from Wednesday the 15th.
const NOW = at(2026, 7, 15, 12)
const WEEK = '2026-07-06'

describe('earliestWeek (how far back the notes can browse)', () => {
  it('is null on an empty Habitat, else the week of the first sign of life', () => {
    expect(earliestWeek([], [], CUTOFF)).toBe(null)
    const habit = makeHabit('h1', { type: 'daily' }, at(2026, 7, 8, 9)) // a Wednesday
    expect(earliestWeek([habit], [], CUTOFF)).toBe('2026-07-06')
  })
})

describe('weekNotes', () => {
  it('marks land on their days, with the right counts', () => {
    const habit = makeHabit('h1', { type: 'daily' })
    const completions = [
      doneBy('h1', 2026, 7, 6),
      doneBy('h1', 2026, 7, 8),
      doneBy('h1', 2026, 7, 8),
    ]
    const notes = weekNotes([habit], completions, WEEK, NOW, CUTOFF)
    expect(notes.isCurrent).toBe(false)
    expect(notes.rows).toHaveLength(1)
    const days = notes.rows[0].days
    expect(days[0].count).toBe(1) // Monday
    expect(days[1].count).toBe(0) // Tuesday…
    expect(days[1].expected).toBe(true) // …was on the calendar, concluded
    expect(days[2].count).toBe(2) // Wednesday, twice
    expect(days.every((day) => !day.outside)).toBe(true)
  })

  it("streaks are told as of the shown week's end, not as of today", () => {
    // Fulfilled every day of the shown week, nothing since. By today
    // the streak is broken — but that week's notes still say 7 days.
    const habit = makeHabit('h1', { type: 'daily' }, at(2026, 7, 6, 9))
    const completions = [6, 7, 8, 9, 10, 11, 12].map((d) =>
      doneBy('h1', 2026, 7, d),
    )
    const shown = weekNotes([habit], completions, WEEK, NOW, CUTOFF)
    expect(shown.rows[0].streak).toBe(7)
    expect(shown.rows[0].streakUnit).toBe('day')

    // The current week's notes show no streak at all — a broken streak
    // is nothing, not a zero (notable streaks only).
    const current = weekNotes([habit], completions, '2026-07-13', NOW, CUTOFF)
    expect(current.isCurrent).toBe(true)
    expect(current.rows[0].streak).toBe(null)
    // Days still to come are outside, never "expected".
    expect(current.rows[0].days[6].outside).toBe(true)
    expect(current.rows[0].days[6].expected).toBe(false)
  })

  it('a "whenever" habit shows its marks but never a streak or an expectation', () => {
    const habit = makeHabit('h1', { type: 'whenever' })
    const completions = [doneBy('h1', 2026, 7, 7)]
    const { rows } = weekNotes([habit], completions, WEEK, NOW, CUTOFF)
    expect(rows[0].days[1].count).toBe(1)
    expect(rows[0].days.every((day) => !day.expected)).toBe(true)
    expect(rows[0].streak).toBe(null)
  })

  it('a one-time to-do appears under tasks completed, not as a row', () => {
    const todo = makeHabit('t1', { type: 'oneTime' })
    const completions = [doneBy('t1', 2026, 7, 9)]
    const notes = weekNotes([todo], completions, WEEK, NOW, CUTOFF)
    expect(notes.rows).toHaveLength(0)
    expect(notes.tasksCompleted).toEqual([
      { habit: todo, dayKey: '2026-07-09' },
    ])
    // …and only in the week it was done.
    expect(
      weekNotes([todo], completions, '2026-07-13', NOW, CUTOFF).tasksCompleted,
    ).toHaveLength(0)
  })

  it('an archived habit keeps its recorded weeks, then bows out', () => {
    // Archived Wednesday the 8th with a mark on the Monday before: the
    // shown week keeps its record (days after the archive read as
    // outside); the following week shows nothing of it.
    const habit = archiveHabit(
      makeHabit('h1', { type: 'daily' }),
      at(2026, 7, 8, 12),
    )
    const completions = [doneBy('h1', 2026, 7, 6)]
    const shown = weekNotes([habit], completions, WEEK, NOW, CUTOFF)
    expect(shown.rows).toHaveLength(1)
    expect(shown.rows[0].days[0].count).toBe(1)
    expect(shown.rows[0].days[3].outside).toBe(true) // Thursday, post-archive
    expect(shown.rows[0].streak).toBe(null) // an archived streak is over

    const weekAfter = weekNotes([habit], completions, '2026-07-13', NOW, CUTOFF)
    expect(weekAfter.rows).toHaveLength(0)
  })

  it('a habit created after the shown week is absent from it', () => {
    const habit = makeHabit('h1', { type: 'daily' }, at(2026, 7, 14, 9))
    expect(weekNotes([habit], [], WEEK, NOW, CUTOFF).rows).toHaveLength(0)
  })
})

describe('shouldOpenFieldNotes (the Sunday ritual)', () => {
  it('opens on a Sunday not yet shown, and only then', () => {
    expect(shouldOpenFieldNotes('2026-07-19', null)).toBe(true) // a Sunday
    expect(shouldOpenFieldNotes('2026-07-19', '2026-07-19')).toBe(false) // already shown today
    expect(shouldOpenFieldNotes('2026-07-19', '2026-07-12')).toBe(true) // LAST Sunday doesn't count
    expect(shouldOpenFieldNotes('2026-07-15', null)).toBe(false) // a Wednesday
  })
})
