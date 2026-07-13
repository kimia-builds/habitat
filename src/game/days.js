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

// The day key `days` days after (or, negative, before) the given one.
export function addDays(dayKey, days) {
  validateDayKey(dayKey)
  const date = atNoon(dayKey)
  date.setDate(date.getDate() + days)
  return toDayKey(date)
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
