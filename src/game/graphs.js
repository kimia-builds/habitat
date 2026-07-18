// Habit line graphs (T2.4): raw completion counts over time, one
// graph per habit at the foot of the field notes. "Frequency,
// unrelated to the goal" (Kimia, 2026-07-16): streaks measure goal
// fulfilment; these graphs are neutral data — they never mention
// schedules, targets or misses, and a flat zero line is a perfectly
// valid graph.
//
// The rules (spec §10, 2026-07-16 and 2026-07-18):
//   - Three zoom levels: day-by-day, week-by-week, 4-weeks-at-a-time.
//   - Each level unlocks purely by the habit's AGE (constants.js has
//     the ages) — never by completions.
//   - One-time to-dos get no graph.
//   - An archived habit keeps its graph, frozen at the archive day.
//   - The x-axis is the habit's whole life, squeezed to fit.
//   - Week buckets are the app's Mon–Sun weeks; 4-week buckets count
//     in groups of four from the habit's first week.

import { GRAPH_UNLOCK_AGE_DAYS } from './constants.js'
import { addDays, dayKeyFromTimestamp, daysBetween, weekStart } from './days.js'
import { archivesWhenDone } from './schedule.js'

// Finest first; the UI opens on the LAST unlocked one (coarsest —
// Kimia's decision 2026-07-18: the whole shape of the habit's life at
// a glance, zoom in from there).
export const GRAPH_ZOOMS = ['day', 'week', 'fourWeek']

const BUCKET_DAYS = { day: 1, week: 7, fourWeek: 28 }

// Every habit graphs except one-time to-dos: a to-do's whole story is
// one checkmark — there is no frequency to draw.
export function hasGraph(habit) {
  return !archivesWhenDone(habit)
}

const bornDay = (habit, cutoffHour) =>
  dayKeyFromTimestamp(habit.createdAt, cutoffHour)

// The last day a graph reaches: today — or, for an archived habit, the
// archive day, where its graph (and its age, below) froze.
export function graphEndDay(habit, now, cutoffHour) {
  const today = dayKeyFromTimestamp(now, cutoffHour)
  if (habit.archived && habit.archivedAt !== null) {
    const gone = dayKeyFromTimestamp(habit.archivedAt, cutoffHour)
    return gone < today ? gone : today
  }
  return today
}

// The habit's age in days, counted inclusively: the day it was created
// is day 1. Archiving freezes it — zoom levels stop unlocking, exactly
// as the graph stops growing.
export function habitAgeDays(habit, now, cutoffHour) {
  return (
    daysBetween(bornDay(habit, cutoffHour), graphEndDay(habit, now, cutoffHour)) +
    1
  )
}

// Which zoom levels this habit's age has unlocked, finest first.
// Age is the ONLY key (spec §10): completions never unlock anything.
export function unlockedZooms(habit, now, cutoffHour) {
  const age = habitAgeDays(habit, now, cutoffHour)
  return GRAPH_ZOOMS.filter((zoom) => age >= GRAPH_UNLOCK_AGE_DAYS[zoom])
}

// The line itself: the habit's life as buckets, each with its raw
// completion count. Returns [{ startKey, endKey, count }] in date
// order, zero-count buckets included — silence is data too.
//
// Day buckets start at the habit's first day; week and 4-week buckets
// start at the Monday of its first week (so every bucket is a real
// Mon–Sun week, or four of them). A completion somehow recorded before
// the habit's creation day (defensive — check-in marks shouldn't
// produce one) extends the graph back rather than being dropped.
export function graphSeries(habit, completions, zoom, now, cutoffHour) {
  const span = BUCKET_DAYS[zoom]
  if (span === undefined) {
    throw new Error(`Unknown graph zoom "${zoom}".`)
  }
  const end = graphEndDay(habit, now, cutoffHour)

  let first = bornDay(habit, cutoffHour)
  const countByDay = new Map()
  for (const c of completions) {
    if (c.habitId !== habit.id) continue
    if (c.dayKey < first) first = c.dayKey
    countByDay.set(c.dayKey, (countByDay.get(c.dayKey) ?? 0) + 1)
  }
  if (zoom !== 'day') first = weekStart(first)

  const series = []
  for (let start = first; start <= end; start = addDays(start, span)) {
    let count = 0
    for (let i = 0; i < span; i++) {
      count += countByDay.get(addDays(start, i)) ?? 0
    }
    series.push({ startKey: start, endKey: addDays(start, span - 1), count })
  }
  return series
}
