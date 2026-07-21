import { describe, expect, it } from 'vitest'
import {
  addDays,
  beforeCutoff,
  calendarDateLine,
  dayKeyFromTimestamp,
  daysBetween,
  formatHourAmPm,
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

describe('calendarDateLine — the big date on the home screen (T4.5)', () => {
  // Weekdays verified against the week tests above: 2026-07-13 is a
  // Monday, so the 20th is too; the 19th is a Sunday.
  it('a fixed timestamp gives the exact expected line', () => {
    expect(calendarDateLine(at(2026, 7, 20, 9))).toBe('MONDAY 20 JUL 2026')
    expect(calendarDateLine(at(2026, 7, 19, 23))).toBe('SUNDAY 19 JUL 2026')
  })

  it('the day of month is not zero-padded', () => {
    // 2026-07-06 is the Monday that begins 2026-07-12's week.
    expect(calendarDateLine(at(2026, 7, 6, 10))).toBe('MONDAY 6 JUL 2026')
  })
})

describe('beforeCutoff — the midnight-to-cutoff stretch (T4.5)', () => {
  it('true before the cutoff hour, false at and after it', () => {
    expect(beforeCutoff(at(2026, 7, 13, 1, 0), 3)).toBe(true)
    expect(beforeCutoff(at(2026, 7, 13, 4, 0), 3)).toBe(false)
    expect(beforeCutoff(at(2026, 7, 13, 3, 0), 3)).toBe(false)
  })

  it('the boundary is the hour, so 2:59am is still before a 3am cutoff', () => {
    expect(beforeCutoff(at(2026, 7, 13, 2, 59), 3)).toBe(true)
  })

  it('cutoff 0 means midnight days — no hour is ever before it', () => {
    expect(beforeCutoff(at(2026, 7, 13, 0, 0), 0)).toBe(false)
    expect(beforeCutoff(at(2026, 7, 13, 23, 0), 0)).toBe(false)
  })

  it('rejects impossible cutoffs, like dayKeyFromTimestamp does', () => {
    expect(() => beforeCutoff(at(2026, 7, 13, 9, 0), -1)).toThrow()
    expect(() => beforeCutoff(at(2026, 7, 13, 9, 0), 24)).toThrow()
    expect(() => beforeCutoff(at(2026, 7, 13, 9, 0), 3.5)).toThrow()
  })
})

describe('formatHourAmPm — how the note says the cutoff', () => {
  it('midnight and noon are the twelves; other hours shrink after noon', () => {
    expect(formatHourAmPm(0)).toBe('12 a.m.')
    expect(formatHourAmPm(1)).toBe('1 a.m.')
    expect(formatHourAmPm(11)).toBe('11 a.m.')
    expect(formatHourAmPm(12)).toBe('12 p.m.')
    expect(formatHourAmPm(13)).toBe('1 p.m.')
    expect(formatHourAmPm(23)).toBe('11 p.m.')
  })

  it('accepts whole hours 0–23 and nothing else', () => {
    expect(() => formatHourAmPm(24)).toThrow()
    expect(() => formatHourAmPm(-1)).toThrow()
    expect(() => formatHourAmPm(3.5)).toThrow()
  })
})
