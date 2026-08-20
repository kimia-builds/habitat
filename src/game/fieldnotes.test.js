import { describe, expect, it } from 'vitest'
import { recordCompletion } from './completions.js'
import { earliestWeek, shouldOpenFieldNotes, weekNotes } from './fieldnotes.js'
import { archiveHabit, changeSchedule, createHabit } from './habits.js'

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

  it('an earlier week survives a habit that has since changed counting unit', () => {
    // Daily back then, N-per-week now (switched Monday the 20th).
    // Browsing back to the week of the 6th used to throw and leave a
    // blank page (bug found 2026-07-27). The week still draws; its
    // streak is blank, because that era hadn't begun.
    let habit = makeHabit('h1', { type: 'daily' })
    habit = changeSchedule(habit, { type: 'nPerWeek', n: 3 }, '2026-07-20')
    const completions = [doneBy('h1', 2026, 7, 6), doneBy('h1', 2026, 7, 7)]
    const later = at(2026, 7, 27, 12)
    const shown = weekNotes([habit], completions, WEEK, later, CUTOFF)
    expect(shown.rows).toHaveLength(1)
    expect(shown.rows[0].days[0].count).toBe(1)
    expect(shown.rows[0].streak).toBe(null)
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

// A STREAK "AS OF" A FINISHED WEEK CANNOT SEE PAST IT (2026-08-20).
//
// The bug behind Kimia's report: browsing back, three weeks running all
// said "1-week streak" — which reads like an unbroken pattern, and is
// how a run she had actually broken looked intact. The moment was right
// (late on the Monday after the week) but the walk was handed the WHOLE
// completions list, so it began on the week AFTER the one on show and
// counted a run that need not reach that week at all.
describe('the streak told for a finished week', () => {
  // Mondays: 2026-07-27, 08-03, 08-10, 08-17 (the current week, since
  // "now" below is Thursday the 20th).
  const WEEKS = ['2026-07-27', '2026-08-03', '2026-08-10', '2026-08-17']
  const THURSDAY_20TH = at(2026, 8, 20, 12)
  const weekly = makeHabit('w1', { type: 'nPerWeek', n: 1 })
  const daily = makeHabit('d1', { type: 'daily' })

  const streakOn = (habit, completions, week) =>
    weekNotes([habit], completions, week, THURSDAY_20TH, CUTOFF).rows[0].streak

  it('counts up as an unbroken run is browsed forward, one week at a time', () => {
    // One mark in each of four consecutive weeks, all on the Monday.
    const completions = [
      doneBy('w1', 2026, 7, 27),
      doneBy('w1', 2026, 8, 3),
      doneBy('w1', 2026, 8, 10),
      doneBy('w1', 2026, 8, 17),
    ]
    expect(WEEKS.map((week) => streakOn(weekly, completions, week))).toEqual([
      1, 2, 3, 4,
    ])
  })

  it('reports no streak at all for a week that was missed', () => {
    // Fulfilled, missed, fulfilled — the shape behind the report. The
    // middle week earned a blank; it used to borrow the NEXT week's run.
    const completions = [doneBy('w1', 2026, 8, 3), doneBy('w1', 2026, 8, 17)]
    expect(streakOn(weekly, completions, '2026-08-03')).toBe(1)
    expect(streakOn(weekly, completions, '2026-08-10')).toBe(null)
    expect(streakOn(weekly, completions, '2026-08-17')).toBe(1)
  })

  it('does the same for a day-counted habit', () => {
    // Every day of the week of the 3rd, then nothing until the 17th: as
    // of the 3rd's week the run is 7, and the missed week is blank —
    // neither may borrow from the marks that came after.
    const completions = []
    for (let d = 3; d <= 9; d++) completions.push(doneBy('d1', 2026, 8, d))
    for (let d = 17; d <= 20; d++) completions.push(doneBy('d1', 2026, 8, d))
    expect(streakOn(daily, completions, '2026-08-03')).toBe(7)
    expect(streakOn(daily, completions, '2026-08-10')).toBe(null)
    expect(streakOn(daily, completions, '2026-08-17')).toBe(4)
  })
})
