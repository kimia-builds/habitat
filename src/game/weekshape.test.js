// The week shape (T6.15): Mon–Sun, Sun–Sat or Sat–Fri. The rule behind
// every test here is Kimia's framing — NOTHING IN THE RECORD CHANGES,
// only the unit of analysis. The same marks are re-grouped; switching
// back and forth loses nothing.
//
// Calendar anchors (verified in days.test.js): 2026-07-13 is a Monday,
// so 07-11 is a Saturday and 07-12 a Sunday; "now" is Wednesday 07-15.

import { describe, expect, it } from 'vitest'
import { editablePastDays } from './checkin.js'
import { streakStatus } from './cameos.js'
import {
  canRecordRetroOn,
  recordCompletion,
  recordRetroCompletion,
} from './completions.js'
import { earliestWeek, weekNotes } from './fieldnotes.js'
import { graphSeries } from './graphs.js'
import { createHabit } from './habits.js'
import { currentStreak, weekProgress } from './schedule.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3
const LONG_AGO = at(2026, 5, 1, 12)
const NOW = at(2026, 7, 15, 12)
const TODAY = '2026-07-15'

let nextId = 0
const doneBy = (habitId, d) =>
  recordCompletion(habitId, CUTOFF, at(2026, 7, d, 9), `c${nextId++}`)

const makeHabit = (id, schedule, createdAt = LONG_AGO) =>
  createHabit(
    { name: `habit ${id}`, symbol: 1, difficulty: 'medium', schedule },
    createdAt,
    id,
  )

describe('which past days stay editable', () => {
  it('follows the shape: Sunday joins this week in Sun–Sat, Saturday too in Sat–Fri', () => {
    // From Wednesday: yesterday (Tuesday) is always open; the rest of
    // the days back to the week's first day are open too.
    expect(editablePastDays(TODAY, 'mon')).toEqual(['2026-07-13', '2026-07-14'])
    expect(editablePastDays(TODAY, 'sun')).toEqual([
      '2026-07-12',
      '2026-07-13',
      '2026-07-14',
    ])
    expect(editablePastDays(TODAY, 'sat')).toEqual([
      '2026-07-11',
      '2026-07-12',
      '2026-07-13',
      '2026-07-14',
    ])
  })

  it('switching can freeze or unfreeze a day at the boundary — and back', () => {
    expect(canRecordRetroOn('2026-07-12', TODAY, 'mon')).toBe(false)
    expect(canRecordRetroOn('2026-07-12', TODAY, 'sun')).toBe(true)
    expect(canRecordRetroOn('2026-07-12', TODAY, 'mon')).toBe(false)
    // Friday the 10th is last week in every shape.
    for (const shape of ['mon', 'sun', 'sat']) {
      expect(canRecordRetroOn('2026-07-10', TODAY, shape)).toBe(false)
    }
  })

  it('calendar yesterday is always editable, even on a new week’s first day', () => {
    // Sunday 07-12 opens a Sun–Sat week; yesterday is last week's Saturday.
    expect(canRecordRetroOn('2026-07-11', '2026-07-12', 'sun')).toBe(true)
    // The same Sunday is the LAST day of a Mon–Sun week.
    expect(canRecordRetroOn('2026-07-06', '2026-07-12', 'mon')).toBe(true)
  })

  it('a retro mark honours the shape too', () => {
    const now = at(2026, 7, 15, 12)
    expect(() =>
      recordRetroCompletion('h1', '2026-07-12', CUTOFF, now, 'x', 'mon'),
    ).toThrow(/frozen/i)
    expect(
      recordRetroCompletion('h1', '2026-07-12', CUTOFF, now, 'x', 'sun').dayKey,
    ).toBe('2026-07-12')
  })
})

describe('N-per-week habits are judged across the chosen week', () => {
  const habit = makeHabit('w', { type: 'nPerWeek', n: 2 })
  // A Saturday and the Sunday right after it.
  const marks = [doneBy('w', 11), doneBy('w', 12)]

  it('the same two marks make a full week, or two half weeks', () => {
    expect(weekProgress(habit, marks, '2026-07-12', 'mon')).toBe(2)
    expect(weekProgress(habit, marks, '2026-07-12', 'sun')).toBe(1)
    expect(weekProgress(habit, marks, '2026-07-12', 'sat')).toBe(2)
  })

  it('the streak moves with the shape and the record stays put', () => {
    const before = JSON.parse(JSON.stringify(marks))
    expect(currentStreak(habit, marks, NOW, CUTOFF, 'mon')).toBe(1)
    expect(currentStreak(habit, marks, NOW, CUTOFF, 'sun')).toBe(0)
    expect(currentStreak(habit, marks, NOW, CUTOFF, 'mon')).toBe(1)
    expect(marks).toEqual(before) // lossless: nothing was rewritten
  })

  it('the cameo walk agrees with the streak, shape by shape', () => {
    for (const shape of ['mon', 'sun', 'sat']) {
      expect(streakStatus(habit, marks, NOW, CUTOFF, shape).current).toBe(
        currentStreak(habit, marks, NOW, CUTOFF, shape),
      )
    }
  })
})

describe('the field notes slice history by the chosen week', () => {
  const habit = makeHabit('d', { type: 'daily' }, at(2026, 7, 8, 9)) // Wednesday

  it('browsing starts at the first day of the earliest week', () => {
    expect(earliestWeek([habit], [], CUTOFF, 'mon')).toBe('2026-07-06')
    expect(earliestWeek([habit], [], CUTOFF, 'sun')).toBe('2026-07-05')
    expect(earliestWeek([habit], [], CUTOFF, 'sat')).toBe('2026-07-04')
  })

  it('a week begins on its own first day, and a Sunday mark moves cells', () => {
    const marks = [doneBy('d', 12)]
    const mon = weekNotes([habit], marks, '2026-07-06', NOW, CUTOFF, 'mon')
    const sun = weekNotes([habit], marks, '2026-07-12', NOW, CUTOFF, 'sun')
    // Last cell of a Mon–Sun week; first cell of a Sun–Sat one.
    expect(mon.rows[0].days[6].dayKey).toBe('2026-07-12')
    expect(mon.rows[0].days[6].count).toBe(1)
    expect(sun.rows[0].days[0].dayKey).toBe('2026-07-12')
    expect(sun.rows[0].days[0].count).toBe(1)
    // Which week is "the current one" depends on the shape as well.
    expect(sun.isCurrent).toBe(true)
    expect(mon.isCurrent).toBe(false)
  })
})

describe('the graphs bucket by the chosen week', () => {
  const habit = makeHabit('g', { type: 'daily' }, at(2026, 7, 8, 9))

  it('the first bucket starts on the shape’s first day; no mark is lost', () => {
    const marks = [doneBy('g', 11), doneBy('g', 12), doneBy('g', 14)]
    const starts = {}
    for (const shape of ['mon', 'sun', 'sat']) {
      const series = graphSeries(habit, marks, 'week', NOW, CUTOFF, shape)
      starts[shape] = series[0].startKey
      expect(series.reduce((sum, b) => sum + b.count, 0)).toBe(3)
    }
    expect(starts).toEqual({
      mon: '2026-07-06',
      sun: '2026-07-05',
      sat: '2026-07-04',
    })
  })
})
