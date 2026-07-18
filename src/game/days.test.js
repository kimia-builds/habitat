import { describe, expect, it } from 'vitest'
import {
  addDays,
  dayKeyFromTimestamp,
  daysBetween,
  isValidDayKey,
  isoWeekday,
  validateCutoffHour,
  weekStart,
} from './days.js'

// Build a timestamp from local-clock parts, exactly like the user's
// device does — so these tests pass in any timezone.
const at = (y, month, d, h, min = 0, s = 0) =>
  new Date(y, month - 1, d, h, min, s).getTime()

describe('dayKeyFromTimestamp — the 3am cutoff rule (spec §4.2)', () => {
  it('1am belongs to the evening before', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 1, 0), 3)).toBe('2026-07-12')
  })

  it('9am belongs to today', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 9, 0), 3)).toBe('2026-07-13')
  })

  it('2:59:59am is still yesterday; 3:00:00am exactly starts the new day', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 2, 59, 59), 3)).toBe(
      '2026-07-12',
    )
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 3, 0, 0), 3)).toBe('2026-07-13')
  })

  it('evening hours belong to their own date', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 23, 45), 3)).toBe('2026-07-13')
  })

  it('a different cutoff moves the boundary (5am cutoff: 4am is yesterday)', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 4, 0), 5)).toBe('2026-07-12')
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 4, 0), 3)).toBe('2026-07-13')
  })

  it('cutoff 0 means plain midnight days — 1am counts for its own date', () => {
    expect(dayKeyFromTimestamp(at(2026, 7, 13, 1, 0), 0)).toBe('2026-07-13')
  })

  it('crosses month boundaries correctly (1am Aug 1st → July 31st)', () => {
    expect(dayKeyFromTimestamp(at(2026, 8, 1, 1, 0), 3)).toBe('2026-07-31')
  })

  it('crosses year boundaries correctly (2am Jan 1st → Dec 31st)', () => {
    expect(dayKeyFromTimestamp(at(2026, 1, 1, 2, 0), 3)).toBe('2025-12-31')
  })

  it('rejects impossible cutoffs', () => {
    expect(() => dayKeyFromTimestamp(at(2026, 7, 13, 9, 0), -1)).toThrow()
    expect(() => dayKeyFromTimestamp(at(2026, 7, 13, 9, 0), 24)).toThrow()
    expect(() => dayKeyFromTimestamp(at(2026, 7, 13, 9, 0), 3.5)).toThrow()
    expect(() => dayKeyFromTimestamp(at(2026, 7, 13, 9, 0), '3')).toThrow()
  })
})

describe('validateCutoffHour', () => {
  it('accepts whole hours 0–23 and nothing else', () => {
    expect(() => validateCutoffHour(0)).not.toThrow()
    expect(() => validateCutoffHour(23)).not.toThrow()
    expect(() => validateCutoffHour(24)).toThrow()
    expect(() => validateCutoffHour(null)).toThrow()
  })
})

describe('day-key arithmetic', () => {
  it('addDays moves forward and backward, across months and years', () => {
    expect(addDays('2026-07-13', 1)).toBe('2026-07-14')
    expect(addDays('2026-07-13', -1)).toBe('2026-07-12')
    expect(addDays('2026-07-31', 1)).toBe('2026-08-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29') // leap year
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01') // non-leap year
  })

  it('daysBetween is signed: later minus earlier, zero for the same day', () => {
    expect(daysBetween('2026-07-01', '2026-07-03')).toBe(2)
    expect(daysBetween('2026-07-03', '2026-07-01')).toBe(-2)
    expect(daysBetween('2026-07-13', '2026-07-13')).toBe(0)
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1) // across years
    expect(daysBetween('2026-01-01', '2026-12-31')).toBe(364)
  })

  it('day keys compare chronologically as plain strings', () => {
    // The engine relies on this: earlier day = alphabetically smaller key.
    const day = '2026-07-13'
    expect(addDays(day, -1) < day).toBe(true)
    expect(addDays(day, 1) > day).toBe(true)
    expect(addDays('2026-01-01', -1) < '2026-01-01').toBe(true) // year turn
    expect(addDays('2026-09-30', 1) > '2026-09-30').toBe(true) // month turn
  })

  it('isValidDayKey accepts real dates and rejects everything else', () => {
    expect(isValidDayKey('2026-07-13')).toBe(true)
    expect(isValidDayKey('2028-02-29')).toBe(true) // real leap day
    expect(isValidDayKey('2026-02-31')).toBe(false) // impossible date
    expect(isValidDayKey('2026-7-3')).toBe(false) // missing zero-padding
    expect(isValidDayKey('13-07-2026')).toBe(false)
    expect(isValidDayKey('hello')).toBe(false)
    expect(isValidDayKey(20260713)).toBe(false)
  })
})

describe('weeks (Monday-start, ISO weekday numbers)', () => {
  it('isoWeekday: 2026-07-13 is a Monday, 2026-07-12 a Sunday', () => {
    expect(isoWeekday('2026-07-13')).toBe(1)
    expect(isoWeekday('2026-07-12')).toBe(7)
    expect(isoWeekday('2026-07-15')).toBe(3) // Wednesday
  })

  it('weekStart names the week by its Monday', () => {
    expect(weekStart('2026-07-13')).toBe('2026-07-13') // Monday itself
    expect(weekStart('2026-07-15')).toBe('2026-07-13') // Wednesday
    expect(weekStart('2026-07-19')).toBe('2026-07-13') // Sunday
    expect(weekStart('2026-07-12')).toBe('2026-07-06') // previous week
  })
})
