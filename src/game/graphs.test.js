import { describe, expect, it } from 'vitest'
import { recordCompletion } from './completions.js'
import {
  graphEndDay,
  graphSeries,
  habitAgeDays,
  hasGraph,
  unlockedZooms,
} from './graphs.js'
import { archiveHabit, createHabit } from './habits.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3

let nextId = 0
const doneBy = (habitId, y, month, d, h = 9) =>
  recordCompletion(habitId, CUTOFF, at(y, month, d, h), `c${nextId++}`)

const makeHabit = (id, schedule, createdAt) =>
  createHabit(
    { name: `habit ${id}`, symbol: 1, difficulty: 'medium', schedule },
    createdAt,
    id,
  )

// Anchor (verified in days.test.js): 2026-07-13 is a Monday.
const NOW = at(2026, 7, 18, 12) // Saturday the 18th, midday

describe('hasGraph (who gets one)', () => {
  it('every schedule shape graphs except one-time to-dos', () => {
    const born = at(2026, 7, 1, 9)
    expect(hasGraph(makeHabit('h1', { type: 'daily' }, born))).toBe(true)
    expect(hasGraph(makeHabit('h2', { type: 'whenever' }, born))).toBe(true)
    expect(hasGraph(makeHabit('h3', { type: 'oneTime' }, born))).toBe(false)
  })
})

describe('unlockedZooms (age is the only key)', () => {
  it('unlocks day / week / 4-week at 3 days, 3 weeks, 12 weeks of age', () => {
    const ageOf = (days) => {
      // Born `days - 1` days before NOW: creation day counts as day 1.
      const habit = makeHabit('h', { type: 'daily' }, NOW - (days - 1) * 86400000)
      return unlockedZooms(habit, NOW, CUTOFF)
    }
    expect(ageOf(1)).toEqual([])
    expect(ageOf(2)).toEqual([])
    expect(ageOf(3)).toEqual(['day'])
    expect(ageOf(20)).toEqual(['day'])
    expect(ageOf(21)).toEqual(['day', 'week'])
    expect(ageOf(83)).toEqual(['day', 'week'])
    expect(ageOf(84)).toEqual(['day', 'week', 'fourWeek'])
  })

  it('completions unlock nothing — a markless old habit still has every zoom', () => {
    const old = makeHabit('h', { type: 'whenever' }, at(2026, 1, 1, 9))
    expect(unlockedZooms(old, NOW, CUTOFF)).toEqual(['day', 'week', 'fourWeek'])
  })

  it('the age clock respects the day cutoff: 1am belongs to the evening before', () => {
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 7, 16, 9))
    // At 1am on the 18th the Habitat day is still the 17th — age 2.
    expect(habitAgeDays(habit, at(2026, 7, 18, 1), CUTOFF)).toBe(2)
    expect(habitAgeDays(habit, at(2026, 7, 18, 9), CUTOFF)).toBe(3)
  })
})

describe('archive freeze', () => {
  const born = at(2026, 5, 1, 9)

  it('an archived habit’s graph and age freeze at the archive day', () => {
    const habit = archiveHabit(
      makeHabit('h', { type: 'daily' }, born),
      at(2026, 5, 10, 9),
    )
    expect(graphEndDay(habit, NOW, CUTOFF)).toBe('2026-05-10')
    expect(habitAgeDays(habit, NOW, CUTOFF)).toBe(10)
    // Frozen at age 10: day zoom only, forever — however long ago.
    expect(unlockedZooms(habit, NOW, CUTOFF)).toEqual(['day'])
    const series = graphSeries(habit, [], 'day', NOW, CUTOFF)
    expect(series).toHaveLength(10)
    expect(series[series.length - 1].startKey).toBe('2026-05-10')
  })

  it('a living habit’s graph ends today', () => {
    const habit = makeHabit('h', { type: 'daily' }, born)
    expect(graphEndDay(habit, NOW, CUTOFF)).toBe('2026-07-18')
  })
})

describe('graphSeries (counts per bucket)', () => {
  it('day zoom: one bucket per day, raw counts, zero days included', () => {
    const habit = makeHabit('h', { type: 'nPerDay', n: 3 }, at(2026, 7, 13, 9))
    const completions = [
      doneBy('h', 2026, 7, 13),
      doneBy('h', 2026, 7, 15),
      doneBy('h', 2026, 7, 15),
      doneBy('h', 2026, 7, 15),
      doneBy('h', 2026, 7, 15), // a 4th mark on a 3-per-day habit: still counted
      doneBy('x', 2026, 7, 14), // someone else's mark — ignored
    ]
    const series = graphSeries(habit, completions, 'day', NOW, CUTOFF)
    expect(series.map((b) => b.startKey)).toEqual([
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
    ])
    expect(series.map((b) => b.count)).toEqual([1, 0, 4, 0, 0, 0])
  })

  it('week zoom: Mon–Sun buckets from the habit’s first week', () => {
    // Born Wednesday July 1st; its first week is Mon June 29th.
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 7, 1, 9))
    const completions = [
      doneBy('h', 2026, 7, 1), // week of June 29
      doneBy('h', 2026, 7, 5), // Sunday, same week
      doneBy('h', 2026, 7, 6), // Monday — next week
      doneBy('h', 2026, 7, 17), // week of July 13
    ]
    const series = graphSeries(habit, completions, 'week', NOW, CUTOFF)
    expect(series.map((b) => b.startKey)).toEqual([
      '2026-06-29',
      '2026-07-06',
      '2026-07-13',
    ])
    expect(series[0].endKey).toBe('2026-07-05')
    expect(series.map((b) => b.count)).toEqual([2, 1, 1])
  })

  it('4-week zoom: groups of four weeks anchored at the habit’s first week', () => {
    // Born Wednesday April 1st → first week is Mon March 30th, so the
    // 4-week buckets begin March 30, April 27, May 25, June 22, July 20…
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 4, 1, 9))
    const completions = [
      doneBy('h', 2026, 4, 1),
      doneBy('h', 2026, 4, 26), // last day of bucket 1
      doneBy('h', 2026, 4, 27), // first day of bucket 2
      doneBy('h', 2026, 7, 18), // today — bucket 4
    ]
    const series = graphSeries(habit, completions, 'fourWeek', NOW, CUTOFF)
    expect(series.map((b) => b.startKey)).toEqual([
      '2026-03-30',
      '2026-04-27',
      '2026-05-25',
      '2026-06-22',
    ])
    expect(series[0].endKey).toBe('2026-04-26')
    expect(series.map((b) => b.count)).toEqual([2, 1, 0, 1])
  })

  it('a markless habit draws a flat zero line, one bucket per day of life', () => {
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 7, 10, 9))
    const series = graphSeries(habit, [], 'day', NOW, CUTOFF)
    expect(series).toHaveLength(9) // July 10th–18th inclusive
    expect(series.every((b) => b.count === 0)).toBe(true)
  })

  it('a mark somehow before the creation day extends the graph back', () => {
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 7, 15, 9))
    const series = graphSeries(
      habit,
      [doneBy('h', 2026, 7, 12)],
      'day',
      NOW,
      CUTOFF,
    )
    expect(series[0].startKey).toBe('2026-07-12')
    expect(series[0].count).toBe(1)
  })

  it('refuses an unknown zoom', () => {
    const habit = makeHabit('h', { type: 'daily' }, at(2026, 7, 10, 9))
    expect(() => graphSeries(habit, [], 'month', NOW, CUTOFF)).toThrow(/zoom/)
  })
})
