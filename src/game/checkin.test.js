import { describe, expect, it } from 'vitest'
import {
  editablePastDays,
  habitsOn,
  hasUnresolved,
  isCheckInDue,
} from './checkin.js'
import { dayKeyFromTimestamp } from './days.js'
import { createHabit } from './habits.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3

// The week in play throughout: Mon 2026-07-13 … Sun 2026-07-19.

// A mark on a day — countOn only reads habitId and dayKey.
const mark = (habitId, dayKey) => ({
  id: `${habitId}-${dayKey}`,
  habitId,
  recordedAt: 0,
  dayKey,
})

// A habit born Monday morning the 13th unless a time is given.
function habit(id, schedule, createdAt = at(2026, 7, 13, 9)) {
  return createHabit(
    { name: id, symbol: 1, difficulty: 'easy', schedule },
    createdAt,
    id,
  )
}

describe('editablePastDays — the backfill window as a list', () => {
  it('mid-week: every earlier day of this week, oldest first', () => {
    expect(editablePastDays('2026-07-15')).toEqual(['2026-07-13', '2026-07-14'])
  })

  it('Sunday: the whole week so far', () => {
    expect(editablePastDays('2026-07-19')).toEqual([
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
    ])
  })

  it('Monday: only yesterday (last week is frozen, Sunday is not)', () => {
    expect(editablePastDays('2026-07-20')).toEqual(['2026-07-19'])
  })
})

describe('habitsOn — what one check-in day lists', () => {
  it('skips habits that did not exist yet, and archived habits', () => {
    const walk = habit('walk', { type: 'daily' })
    const later = habit('later', { type: 'daily' }, at(2026, 7, 15, 9))
    const shelved = { ...habit('shelved', { type: 'daily' }), archived: true }
    const listed = habitsOn([walk, later, shelved], [], '2026-07-14', CUTOFF)
    expect(listed.map((h) => h.id)).toEqual(['walk'])
  })

  it('keeps a one-time to-do visible on the day it was checked off, so it can be undone', () => {
    const todo = { ...habit('todo', { type: 'oneTime' }), archived: true }
    const marks = [mark('todo', '2026-07-14')]
    expect(habitsOn([todo], marks, '2026-07-14', CUTOFF)).toHaveLength(1)
    expect(habitsOn([todo], marks, '2026-07-13', CUTOFF)).toHaveLength(0)
  })
})

describe('hasUnresolved — does a day still have an unmet expectation?', () => {
  const walk = habit('walk', { type: 'daily' })

  it('true for a scheduled, unfulfilled day', () => {
    expect(hasUnresolved([walk], [], '2026-07-14', CUTOFF)).toBe(true)
  })

  it('false once the day is fulfilled', () => {
    const marks = [mark('walk', '2026-07-14')]
    expect(hasUnresolved([walk], marks, '2026-07-14', CUTOFF)).toBe(false)
  })

  it('false before the habit existed', () => {
    expect(hasUnresolved([walk], [], '2026-07-12', CUTOFF)).toBe(false)
  })

  it('false for unscheduled shapes — no expectation, no pressure', () => {
    const flex = habit('flex', { type: 'whenever' })
    const weekly = habit('weekly', { type: 'nPerWeek', n: 3 })
    expect(hasUnresolved([flex, weekly], [], '2026-07-14', CUTOFF)).toBe(false)
  })

  it('false on days a weekdays habit is not scheduled', () => {
    const monOnly = habit('mon', { type: 'weekdays', days: [1] })
    expect(hasUnresolved([monOnly], [], '2026-07-14', CUTOFF)).toBe(false) // Tue
    expect(hasUnresolved([monOnly], [], '2026-07-13', CUTOFF)).toBe(true) // Mon
  })

  it('false for archived habits', () => {
    const shelved = { ...walk, archived: true }
    expect(hasUnresolved([shelved], [], '2026-07-14', CUTOFF)).toBe(false)
  })
})

describe('isCheckInDue — when the app opens with the check-in', () => {
  const walk = habit('walk', { type: 'daily' })

  it('due when yesterday was missed and never answered', () => {
    expect(isCheckInDue([walk], [], null, '2026-07-14', CUTOFF)).toBe(true)
  })

  it('not due once yesterday has been answered', () => {
    expect(isCheckInDue([walk], [], '2026-07-13', '2026-07-14', CUTOFF)).toBe(
      false,
    )
  })

  it('not due when yesterday was simply done', () => {
    const marks = [mark('walk', '2026-07-13')]
    expect(isCheckInDue([walk], marks, null, '2026-07-14', CUTOFF)).toBe(false)
  })

  it('a multi-day gap keeps it due until answered', () => {
    // Answered through Monday; Tuesday and Wednesday missed; today Thursday.
    expect(isCheckInDue([walk], [], '2026-07-13', '2026-07-16', CUTOFF)).toBe(
      true,
    )
  })

  it('frozen missed days never nag: only the window can make it due', () => {
    // Away all last week; today is Monday the 20th. Only Sunday the 19th
    // is still editable — if Sunday was done, there is nothing to ask.
    const marks = [mark('walk', '2026-07-19')]
    expect(
      isCheckInDue([walk], marks, '2026-07-12', '2026-07-20', CUTOFF),
    ).toBe(false)
    // …but an unresolved Sunday IS asked about, across the week boundary.
    expect(isCheckInDue([walk], [], '2026-07-12', '2026-07-20', CUTOFF)).toBe(
      true,
    )
  })

  it('older missed days never nag on their own — optional means optional', () => {
    // Monday and Tuesday missed, but yesterday (Wednesday) was done
    // live: no check-in. The gap days stay quietly editable instead.
    const marks = [mark('walk', '2026-07-15')]
    expect(isCheckInDue([walk], marks, null, '2026-07-16', CUTOFF)).toBe(false)
  })

  it('not due for a habit created today — yesterday predates it', () => {
    const fresh = habit('fresh', { type: 'daily' }, at(2026, 7, 14, 9))
    expect(isCheckInDue([fresh], [], null, '2026-07-14', CUTOFF)).toBe(false)
  })

  it('not due when there are only unscheduled habits', () => {
    const flex = habit('flex', { type: 'whenever' })
    expect(isCheckInDue([flex], [], null, '2026-07-16', CUTOFF)).toBe(false)
  })

  it('at 1am, "yesterday" follows the Habitat day, not the clock', () => {
    // 1am Tuesday the 14th: the Habitat day is still Monday the 13th,
    // so the check-in asks about Sunday the 12th — the habit did not
    // exist then, so nothing is due despite Monday being unfulfilled.
    const today = dayKeyFromTimestamp(at(2026, 7, 14, 1), CUTOFF)
    expect(today).toBe('2026-07-13')
    expect(isCheckInDue([walk], [], null, today, CUTOFF)).toBe(false)
  })
})
