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

import {
  DEFAULT_LANGUAGE,
  JALALI_MONTH_KEYS,
  LANGUAGE_CALENDAR,
  MONTH_KEYS,
  WEEKDAY_KEYS,
  translate,
} from '../content/ui.js'

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

// --- The shape of the week (T6.15) -------------------------------------
//
// Which day a week STARTS on is a setting, not a constant (Kimia's call
// 2026-08-16), and it is independent of language. Three shapes:
//   'mon' — Monday to Sunday (the default; how Habitat began)
//   'sun' — Sunday to Saturday
//   'sat' — Saturday to Friday
// Each is named by the ISO weekday its week starts on (Mon = 1 … Sun = 7).
// Choosing a shape moves only the boundary: the marks themselves are
// never touched, they are simply grouped differently.
export const WEEK_SHAPES = ['mon', 'sun', 'sat']
export const DEFAULT_WEEK_SHAPE = 'mon'

const WEEK_FIRST_DAY = { mon: 1, sun: 7, sat: 6 }

export function isWeekShape(value) {
  return WEEK_SHAPES.includes(value)
}

// Which week shape the habit form's weekday boxes use in each language
// (Kimia's call 2026-10-09): Farsi lists Shanbeh first, English Monday.
// This is only about the order of the boxes — it is NOT the week-shape
// setting, which still decides the grid, the graphs and the editable days.
export const PICKER_SHAPE_BY_LANGUAGE = { en: 'mon', fa: 'sat' }

// The ISO weekdays (1 = Monday … 7 = Sunday) in the order a week of this
// shape lists them — the weekday picker uses it. The stored numbers
// never change; only the order they are shown in.
export function weekdayOrder(shape = DEFAULT_WEEK_SHAPE) {
  const first = WEEK_FIRST_DAY[shape]
  return Array.from({ length: 7 }, (_, i) => ((first - 1 + i) % 7) + 1)
}

// The day that begins this day's week, in the chosen shape. This key
// doubles as the week's name (equal week starts = same week). Always ask
// this function — never assume a week starts on Monday.
export function weekStart(dayKey, shape = DEFAULT_WEEK_SHAPE) {
  const sinceStart = (isoWeekday(dayKey) - WEEK_FIRST_DAY[shape] + 7) % 7
  return addDays(dayKey, -sinceStart)
}

// A day key written the short way: '2026-07-06' → '06-07-26' (DD-MM-YY,
// Kimia's call 2026-08-11). Day first, as she reads dates — and short
// enough that a whole week range fits on one line between the field
// notes' earlier / later buttons. Pure string surgery: a day key is
// already a local calendar date, so there is no clock to consult.
export function shortDate(dayKey, language = DEFAULT_LANGUAGE) {
  validateDayKey(dayKey)
  const [year, month, day] = dayKey.split('-')
  if (LANGUAGE_CALENDAR[language] === 'jalali') {
    const j = jalaliDate(Number(year), Number(month), Number(day))
    const two = (n) => String(n).padStart(2, '0')
    return `${two(j.day)}-${two(j.month)}-${two(j.year % 100)}`
  }
  return `${day}-${month}-${year.slice(2)}`
}

// --- The Persian (Jalali) calendar (T6.18) -----------------------------
//
// Display only. The browser already knows the Persian calendar, so we
// ask it rather than keeping a table of year lengths: Nowruz moves
// between the 20th and 21st of March and Esfand has 29 or 30 days, and
// the browser works both out per date. Each date converts on its own,
// so leap days need no special care. A test pins known Nowruz dates and
// Esfand lengths, so a browser that ever disagrees fails loudly.
// Everything is read in UTC at noon: the Gregorian date is already
// decided by the caller, and noon keeps clock changes out of it.
const PERSIAN_CALENDAR = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
})

// A Gregorian year / month (1–12) / day as { year, month, day } in the
// Jalali calendar, e.g. (2026, 10, 9) → 1405, 7, 17.
export function jalaliDate(year, month, day) {
  const parts = PERSIAN_CALENDAR.formatToParts(
    new Date(Date.UTC(year, month - 1, day, 12)),
  )
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

// --- The calendar date display (T4.5) ----------------------------------
//
// The home screen shows the REAL calendar date in large letterspaced
// type (Kimia's call 2026-07-20; spec §5b), with a quiet note that
// appears only between midnight and the cutoff — the one stretch where
// the calendar date and the Habitat day underneath it disagree.
//
// The words — weekday and month names, the order they come in, and
// a.m./p.m. — live in the copy deck (content/ui.js), not here. They are
// still fixed tables rather than toLocaleDateString: the line must read
// the same whatever language the browser speaks, and tests stay
// locale-proof. `language` picks the deck's language; it defaults to
// English so every existing caller is unchanged. Like everything else
// in this module, the maths runs on the device's local clock — her
// clock is the only truth we need.

// Date.getDay() starts the week on Sunday: 0 = Sunday. The deck's
// weekday keys are in ISO order (Monday first), so Sunday goes on the
// front.
const SUNDAY_FIRST_KEYS = ['sun', ...WEEKDAY_KEYS.slice(0, 6)]

// The date line itself, e.g. 'MONDAY 20 JUL 2026': full uppercase
// weekday, day of month with no zero-padding, uppercase 3-letter month,
// 4-digit year (all as the deck writes them in English). The
// letterspacing is CSS's job — the text itself holds plain single
// spaces so screen readers read it naturally. The ORDER of the four
// parts is the deck's `date.line` slot.
export function calendarDateLine(timestampMs, language = DEFAULT_LANGUAGE) {
  const moment = new Date(timestampMs)
  if (LANGUAGE_CALENDAR[language] === 'jalali') {
    const j = jalaliDate(
      moment.getFullYear(),
      moment.getMonth() + 1,
      moment.getDate(),
    )
    return translate(language, 'date.line', {
      weekday: translate(
        language,
        `weekday.${SUNDAY_FIRST_KEYS[moment.getDay()]}.long`,
      ),
      day: j.day,
      month: translate(language, `jmonth.${JALALI_MONTH_KEYS[j.month - 1]}`),
      year: j.year,
    })
  }
  return translate(language, 'date.line', {
    weekday: translate(
      language,
      `weekday.${SUNDAY_FIRST_KEYS[moment.getDay()]}.long`,
    ),
    day: moment.getDate(),
    month: translate(language, `month.${MONTH_KEYS[moment.getMonth()]}`),
    year: moment.getFullYear(),
  })
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
export function formatHourAmPm(hour, language = DEFAULT_LANGUAGE) {
  validateCutoffHour(hour)
  const half = hour < 12 ? 'time.hourAm' : 'time.hourPm'
  const onClock = hour % 12 === 0 ? 12 : hour % 12
  return translate(language, half, { hour: onClock })
}
