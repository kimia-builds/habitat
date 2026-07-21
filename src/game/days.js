// Day maths for the Habitat day, which starts at the cutoff hour (3am
// by default), not at midnight — so a habit finished at 1am belongs to
// the evening before (spec §4.2).
//
// Days are named by a "day key": a local-calendar date string like
// '2026-07-13'. Day keys have two properties everything else relies on:
//   - equal keys mean the same Habitat day
//   - alphabetical order IS date order, so keys compare with < and >
//
// All maths uses the device's local clock. Habitat has exactly one
// user and her data never leaves her browser, so her clock is the
// only truth we need — no timezone gymnastics.

export function validateCutoffHour(cutoffHour) {
  if (!Number.isInteger(cutoffHour) || cutoffHour < 0 || cutoffHour > 23) {
    throw new Error('Day cutoff must be a whole hour from 0 to 23.')
  }
}

const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function pad2(n) {
  return String(n).padStart(2, '0')
}

function toDayKey(date) {
  return (
    `${date.getFullYear()}-` +
    `${pad2(date.getMonth() + 1)}-` +
    `${pad2(date.getDate())}`
  )
}

// Parse a day key into a Date at local NOON. Noon, not midnight, so
// that daylight-saving jumps — which happen in the small hours — can
// never nudge date arithmetic onto the wrong day.
function atNoon(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function isValidDayKey(dayKey) {
  if (typeof dayKey !== 'string' || !DAY_KEY_PATTERN.test(dayKey)) {
    return false
  }
  // Catch well-formed impossibilities like 2026-02-31: JavaScript rolls
  // them over to a different date, so a round trip exposes them.
  return toDayKey(atNoon(dayKey)) === dayKey
}

export function validateDayKey(dayKey) {
  if (!isValidDayKey(dayKey)) {
    throw new Error(`"${dayKey}" is not a real date in YYYY-MM-DD form.`)
  }
}

// THE core rule of the app: which Habitat day does a moment belong to?
// Before the cutoff hour it still belongs to the previous calendar date
// (1am Tuesday → Monday). At the cutoff exactly, the new day has begun
// (3:00:00am with a 3am cutoff → Tuesday).
export function dayKeyFromTimestamp(timestampMs, cutoffHour) {
  validateCutoffHour(cutoffHour)
  const moment = new Date(timestampMs)
  if (moment.getHours() < cutoffHour) {
    // setDate handles month and year rollover for us (Aug 1st → Jul 31st).
    moment.setDate(moment.getDate() - 1)
  }
  return toDayKey(moment)
}

// The timestamp of a given local hour on a given calendar day. Field
// notes (T2.3) use hour 23 to mean "late that evening": 23 is at or
// after every possible cutoff (0–23), so the moment always belongs to
// dayKey's own Habitat day, never the one before.
export function timestampAtHour(dayKey, hour) {
  validateDayKey(dayKey)
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Date(year, month - 1, day, hour).getTime()
}

// The day key `days` days after (or, negative, before) the given one.
export function addDays(dayKey, days) {
  validateDayKey(dayKey)
  const date = atNoon(dayKey)
  date.setDate(date.getDate() + days)
  return toDayKey(date)
}

// How many days lie from one day key to another (later minus earlier,
// so daysBetween('2026-07-01', '2026-07-03') is 2 and the reverse is
// -2). Noon anchoring keeps daylight-saving out of the arithmetic, but
// a jump still leaves the raw difference an hour off a whole day —
// rounding absorbs it.
export function daysBetween(fromKey, toKey) {
  validateDayKey(fromKey)
  validateDayKey(toKey)
  return Math.round((atNoon(toKey) - atNoon(fromKey)) / (24 * 60 * 60 * 1000))
}

// ISO weekday of a day key: 1 = Monday … 7 = Sunday (the same numbers
// the weekdays schedule stores).
export function isoWeekday(dayKey) {
  validateDayKey(dayKey)
  return ((atNoon(dayKey).getDay() + 6) % 7) + 1
}

// The Monday that begins this day's week. Weeks run Monday–Sunday, and
// this key doubles as the week's name (equal week starts = same week).
export function weekStart(dayKey) {
  return addDays(dayKey, 1 - isoWeekday(dayKey))
}

// --- The calendar date display (T4.5) ----------------------------------
//
// The home screen shows the REAL calendar date in large letterspaced
// type (Kimia's call 2026-07-20; spec §5b), with a quiet note that
// appears only between midnight and the cutoff — the one stretch where
// the calendar date and the Habitat day underneath it disagree.
//
// Fixed English name tables, not toLocaleDateString: the line must read
// the same whatever language the browser speaks, and tests stay
// locale-proof. Like everything else in this module, the maths runs on
// the device's local clock — her clock is the only truth we need.
const WEEKDAY_NAMES = [
  'SUNDAY', // Date.getDay() starts the week on Sunday: 0 = Sunday
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

const MONTH_NAMES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

// The date line itself, e.g. 'MONDAY 20 JUL 2026': full uppercase
// weekday, day of month with no zero-padding, uppercase 3-letter month,
// 4-digit year. The letterspacing is CSS's job — the text itself holds
// plain single spaces so screen readers read it naturally.
export function calendarDateLine(timestampMs) {
  const moment = new Date(timestampMs)
  return (
    `${WEEKDAY_NAMES[moment.getDay()]} ` +
    `${moment.getDate()} ` +
    `${MONTH_NAMES[moment.getMonth()]} ` +
    `${moment.getFullYear()}`
  )
}

// Is this moment in the small hours before the day cutoff? The same
// rule dayKeyFromTimestamp applies: the local hour is simply compared
// to the cutoff hour. True between midnight and the cutoff — exactly
// when the date display and the habit list disagree, so exactly when
// the note should show.
export function beforeCutoff(timestampMs, cutoffHour) {
  validateCutoffHour(cutoffHour)
  return new Date(timestampMs).getHours() < cutoffHour
}

// An hour as the note says it: 1 → '1 a.m.', 12 → '12 p.m.',
// 13 → '1 p.m.', 0 → '12 a.m.'. Whole hours 0–23 only — the cutoff is
// always a whole hour, so this reuses its validation.
export function formatHourAmPm(hour) {
  validateCutoffHour(hour)
  if (hour === 0) return '12 a.m.'
  if (hour < 12) return `${hour} a.m.`
  if (hour === 12) return '12 p.m.'
  return `${hour - 12} p.m.`
}
