import { describe, expect, it } from 'vitest'
import { recordCompletion, recordRetroCompletion } from './completions.js'
import { createHabit } from './habits.js'
import {
  archivesWhenDone,
  currentStreak,
  isDayFulfilled,
  isScheduledOn,
  isWeekFulfilled,
  requiredPerDay,
  weekProgress,
} from './schedule.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3
// Every habit here is created long before the test dates (Jan 1st 2020)
// unless a test is specifically about the creation boundary.
const LONG_AGO = at(2020, 1, 1, 12)

const makeHabit = (schedule, createdAt = LONG_AGO) =>
  createHabit(
    { name: 'Test habit', symbol: 1, difficulty: 'medium', schedule },
    createdAt,
    'h1',
  )

// Shorthand: one completion of habit h1 at the given local time.
let nextId = 0
const done = (y, month, d, h, min = 0) =>
  recordCompletion('h1', CUTOFF, at(y, month, d, h, min), `c${nextId++}`)

// Test-date anchors (verified in days.test.js):
// 2026-07-13 is a Monday; 2026-07-12 the Sunday before it.

describe('isScheduledOn', () => {
  it('daily and N-per-day habits are due every day', () => {
    expect(isScheduledOn(makeHabit({ type: 'daily' }), '2026-07-13')).toBe(true)
    expect(
      isScheduledOn(makeHabit({ type: 'nPerDay', n: 3 }), '2026-07-19'),
    ).toBe(true)
  })

  it('weekday habits are due exactly on their days', () => {
    const monWedFri = makeHabit({ type: 'weekdays', days: [1, 3, 5] })
    expect(isScheduledOn(monWedFri, '2026-07-13')).toBe(true) // Monday
    expect(isScheduledOn(monWedFri, '2026-07-14')).toBe(false) // Tuesday
    expect(isScheduledOn(monWedFri, '2026-07-15')).toBe(true) // Wednesday
    expect(isScheduledOn(monWedFri, '2026-07-19')).toBe(false) // Sunday
  })

  it('N-per-week, whenever and one-time habits have no particular due days', () => {
    expect(
      isScheduledOn(makeHabit({ type: 'nPerWeek', n: 3 }), '2026-07-13'),
    ).toBe(false)
    expect(isScheduledOn(makeHabit({ type: 'whenever' }), '2026-07-13')).toBe(
      false,
    )
    expect(isScheduledOn(makeHabit({ type: 'oneTime' }), '2026-07-13')).toBe(
      false,
    )
  })
})

describe('one-time habits — to-dos (added 2026-07-13)', () => {
  it('validates as a schedule shape and needs one completion per "day"', () => {
    const todo = makeHabit({ type: 'oneTime' })
    expect(requiredPerDay(todo)).toBe(1)
  })

  it('only one-time habits archive themselves when done', () => {
    expect(archivesWhenDone(makeHabit({ type: 'oneTime' }))).toBe(true)
    expect(archivesWhenDone(makeHabit({ type: 'daily' }))).toBe(false)
    expect(archivesWhenDone(makeHabit({ type: 'whenever' }))).toBe(false)
  })

  it('has no streak — a to-do happens once', () => {
    const todo = makeHabit({ type: 'oneTime' })
    const completions = [done(2026, 7, 12, 9)]
    expect(
      currentStreak(todo, completions, at(2026, 7, 13, 9), CUTOFF),
    ).toBeNull()
  })
})

describe('day fulfilment', () => {
  it('one completion fulfils a daily habit; none leaves it neutral', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [done(2026, 7, 13, 9)]
    expect(isDayFulfilled(habit, completions, '2026-07-13')).toBe(true)
    expect(isDayFulfilled(habit, completions, '2026-07-12')).toBe(false)
  })

  it('requiredPerDay is N for N-per-day habits, 1 for everything else', () => {
    expect(requiredPerDay(makeHabit({ type: 'nPerDay', n: 3 }))).toBe(3)
    expect(requiredPerDay(makeHabit({ type: 'daily' }))).toBe(1)
    expect(requiredPerDay(makeHabit({ type: 'nPerWeek', n: 2 }))).toBe(1)
  })
})

describe('N-per-day habits and the 3am cutoff (the critical interaction)', () => {
  const water3 = makeHabit({ type: 'nPerDay', n: 3 })

  it('11pm, 12:30am and 2:50am are all ONE Habitat day — fulfilled at 3 of 3', () => {
    const completions = [
      done(2026, 7, 12, 23, 0), // Sunday 11pm
      done(2026, 7, 13, 0, 30), // "Sunday night" half past midnight
      done(2026, 7, 13, 2, 50), // still Sunday night, 10 min before cutoff
    ]
    expect(isDayFulfilled(water3, completions, '2026-07-12')).toBe(true)
    expect(isDayFulfilled(water3, completions, '2026-07-13')).toBe(false)
  })

  it('a 3:10am completion opens the NEW day at 1 of 3', () => {
    const completions = [
      done(2026, 7, 12, 23, 0),
      done(2026, 7, 13, 0, 30),
      done(2026, 7, 13, 3, 10), // past the cutoff: Monday's first
    ]
    expect(isDayFulfilled(water3, completions, '2026-07-12')).toBe(false) // 2 of 3
    expect(isDayFulfilled(water3, completions, '2026-07-13')).toBe(false) // 1 of 3
  })

  it('fewer than N is neutral data, never punished — just not fulfilled', () => {
    const completions = [done(2026, 7, 13, 9), done(2026, 7, 13, 14)]
    expect(isDayFulfilled(water3, completions, '2026-07-13')).toBe(false)
  })

  it('more than N is recorded and kept; the day stays fulfilled', () => {
    const completions = [
      done(2026, 7, 13, 9),
      done(2026, 7, 13, 12),
      done(2026, 7, 13, 15),
      done(2026, 7, 13, 20), // the 4th glass
    ]
    expect(completions).toHaveLength(4) // nothing dropped
    expect(isDayFulfilled(water3, completions, '2026-07-13')).toBe(true)
  })
})

describe('N-per-week habits (Monday-start weeks, distinct days)', () => {
  const gym3 = makeHabit({ type: 'nPerWeek', n: 3 })

  it('three completions on ONE day advance the week by one, not three', () => {
    const completions = [
      done(2026, 7, 13, 9),
      done(2026, 7, 13, 12),
      done(2026, 7, 13, 18),
    ]
    expect(weekProgress(gym3, completions, '2026-07-13')).toBe(1)
    expect(isWeekFulfilled(gym3, completions, '2026-07-13')).toBe(false)
  })

  it('three distinct days fulfil the week', () => {
    const completions = [
      done(2026, 7, 13, 9), // Monday
      done(2026, 7, 15, 9), // Wednesday
      done(2026, 7, 18, 9), // Saturday
    ]
    expect(weekProgress(gym3, completions, '2026-07-18')).toBe(3)
    expect(isWeekFulfilled(gym3, completions, '2026-07-18')).toBe(true)
    // Any day of the same week names the same week.
    expect(isWeekFulfilled(gym3, completions, '2026-07-13')).toBe(true)
  })

  it('1am on Monday still belongs to the OLD week (cutoff applies to weeks too)', () => {
    // Monday July 20th, 1am — attributed to Sunday the 19th, previous week.
    const completions = [done(2026, 7, 20, 1, 0)]
    expect(weekProgress(gym3, completions, '2026-07-19')).toBe(1) // old week
    expect(weekProgress(gym3, completions, '2026-07-20')).toBe(0) // new week
  })

  it('week fulfilment is refused for other schedule types', () => {
    expect(() =>
      isWeekFulfilled(makeHabit({ type: 'daily' }), [], '2026-07-13'),
    ).toThrow(/N-per-week/)
  })
})

describe('streaks — informational only, no punishment', () => {
  // "Now" for most streak tests: Monday July 13th, 9am.
  const NOW = at(2026, 7, 13, 9, 0)

  it('daily: consecutive fulfilled days, counting a fulfilled today', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [
      done(2026, 7, 10, 9),
      done(2026, 7, 11, 9),
      done(2026, 7, 12, 9),
    ]
    // Today (the 13th) isn't done yet — streak is 3, not broken.
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(3)
    // Completing today extends it to 4.
    const withToday = [...completions, done(2026, 7, 13, 8)]
    expect(currentStreak(habit, withToday, NOW, CUTOFF)).toBe(4)
  })

  it('daily: a missed day quietly resets the run — the count restarts after it', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [
      done(2026, 7, 10, 9),
      // July 11th missed
      done(2026, 7, 12, 9),
    ]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(1)
  })

  it('daily: a 1am completion extends the PREVIOUS day (cutoff in streaks)', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [
      done(2026, 7, 12, 9), // Sunday, done during the day
      done(2026, 7, 13, 1, 30), // Monday 1:30am → attributed to Sunday too
    ]
    // Sunday fulfilled (twice over), Saturday not: streak 1, today pending.
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(1)
  })

  it('daily: retro check-in marks count exactly like live ones', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [
      done(2026, 7, 11, 9),
      // Sunday marked retroactively on Monday morning:
      recordRetroCompletion('h1', '2026-07-12', CUTOFF, NOW, 'retro1'),
    ]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(2)
  })

  it('weekdays: only scheduled days count; the weekend cannot break a Mon/Wed/Fri streak', () => {
    const habit = makeHabit({ type: 'weekdays', days: [1, 3, 5] })
    const completions = [
      done(2026, 7, 8, 9), // Wednesday
      done(2026, 7, 10, 9), // Friday
      // Sat & Sun unscheduled — skipped, not broken.
    ]
    // Today is Monday (scheduled) but still in progress: streak 2.
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(2)
    // A missed scheduled day DOES end the run: Monday the 6th undone,
    // so the streak never reaches further back than Wednesday.
    const withOlder = [...completions, done(2026, 7, 3, 9)] // Friday the 3rd
    expect(currentStreak(habit, withOlder, NOW, CUTOFF)).toBe(2)
  })

  it('N-per-day: a day only joins the streak at N completions', () => {
    const habit = makeHabit({ type: 'nPerDay', n: 2 })
    const completions = [
      done(2026, 7, 11, 9),
      done(2026, 7, 11, 18), // 2 of 2 — fulfilled
      done(2026, 7, 12, 9), // 1 of 2 — neutral, ends the run
    ]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(0)
    const sundayDone = [...completions, done(2026, 7, 12, 18)]
    expect(currentStreak(habit, sundayDone, NOW, CUTOFF)).toBe(2)
  })

  it('N-per-week: consecutive fulfilled weeks; the current week stays pending', () => {
    const habit = makeHabit({ type: 'nPerWeek', n: 2 })
    const completions = [
      // Week of June 29th: Tuesday + Thursday → fulfilled
      done(2026, 6, 30, 9),
      done(2026, 7, 2, 9),
      // Week of July 6th: Monday + Saturday → fulfilled
      done(2026, 7, 6, 9),
      done(2026, 7, 11, 9),
      // Current week (July 13th): one so far → pending, not breaking
      done(2026, 7, 13, 8),
    ]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(2)
    // Fulfilling the current week counts it immediately: 3.
    const thisWeekDone = [...completions, done(2026, 7, 14, 9)]
    expect(
      currentStreak(habit, thisWeekDone, at(2026, 7, 14, 10, 0), CUTOFF),
    ).toBe(3)
  })

  it('whenever: no streak at all — null, not zero', () => {
    const habit = makeHabit({ type: 'whenever' })
    const completions = [done(2026, 7, 12, 9), done(2026, 7, 13, 8)]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(null)
  })

  it("streaks never look further back than the habit's creation day", () => {
    // Habit created Saturday July 11th; days before it can't count.
    const habit = makeHabit({ type: 'daily' }, at(2026, 7, 11, 12, 0))
    const completions = [
      recordRetroCompletion('h1', '2026-07-10', CUTOFF, NOW, 'r0'), // pre-creation
      done(2026, 7, 11, 14),
      done(2026, 7, 12, 9),
    ]
    expect(currentStreak(habit, completions, NOW, CUTOFF)).toBe(2)
  })

  it('a brand-new habit with nothing done yet has streak 0', () => {
    const habit = makeHabit({ type: 'daily' }, at(2026, 7, 13, 8, 0))
    expect(currentStreak(habit, [], NOW, CUTOFF)).toBe(0)
  })
})
