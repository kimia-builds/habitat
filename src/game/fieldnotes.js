// Field notes (T2.3): the weekly view. A quiet record of what
// happened, week by week — completions, and streaks where they exist.
// Deliberately NOT a dashboard: an unfilled day is neutral data
// (spec §3); nothing here scores, grades or nags.
//
// The rules (Kimia's decisions, 2026-07-16):
//   - Weeks are the same Mon–Sun weeks the rest of the app uses.
//   - The page opens on the last COMPLETED week; the current week is
//     browsable too, clearly marked as still unfolding.
//   - Streaks appear only when notable (1 or more) — a broken streak
//     shows nothing at all, not a zero.
//   - Archived habits keep their notes (up to the archive day, plus
//     any week they left marks in); deleted habits take their history
//     with them (removeCompletionsFor already guarantees that).
//   - One-time to-dos get no week row; the week they were completed
//     lists them under "tasks completed" instead.
//   - On the first visit of each Sunday the app opens the field notes
//     by itself, right after any check-in.

import { countOn } from './completions.js'
import {
  addDays,
  dayKeyFromTimestamp,
  isoWeekday,
  timestampAtHour,
  weekStart,
} from './days.js'
import {
  archivesWhenDone,
  currentStreak,
  isScheduledOn,
  requiredPerDay,
  scheduleOn,
  streakKind,
} from './schedule.js'

const bornDay = (habit, cutoffHour) =>
  dayKeyFromTimestamp(habit.createdAt, cutoffHour)

// The Monday of the earliest week with anything to show — how far back
// the field notes can browse. Null on a truly empty Habitat.
export function earliestWeek(habits, completions, cutoffHour) {
  let earliest = null
  for (const habit of habits) {
    const day = bornDay(habit, cutoffHour)
    if (earliest === null || day < earliest) earliest = day
  }
  for (const completion of completions) {
    if (earliest === null || completion.dayKey < earliest) {
      earliest = completion.dayKey
    }
  }
  return earliest === null ? null : weekStart(earliest)
}

// Everything the field-notes page needs to draw one week:
//
//   {
//     weekStartKey, weekEnd, isCurrent,
//     rows: [{ habit, days: [7 cells], streak, streakUnit }],
//     tasksCompleted: [{ habit, dayKey }],   // one-time to-dos done
//   }
//
// Each of a row's 7 day cells:
//   {
//     dayKey,
//     count,        completions recorded for that day
//     required,     what that day's schedule asked for (N-per-day: n)
//     countsWithin, that day ran under an N-per-day schedule
//     expected,     day was scheduled, has concluded, and habit was
//                   alive — drawn as a quiet mark when nothing was done
//     outside,      before creation, after archiving, or still in the
//                   future — drawn as blank nothing
//   }
export function weekNotes(habits, completions, weekStartKey, now, cutoffHour) {
  const weekEnd = addDays(weekStartKey, 6)
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const isCurrent = weekStart(today) === weekStartKey
  // Streaks are reported "as of" the week on show: for a finished
  // week, late on the Monday right after it — so its Sunday counts as
  // concluded; for the current week, right now.
  const asOf = isCurrent ? now : timestampAtHour(addDays(weekEnd, 1), 23)

  const rows = []
  const tasksCompleted = []
  for (const habit of habits) {
    const born = bornDay(habit, cutoffHour)
    if (born > weekEnd) continue // didn't exist yet

    // One-time to-dos: no week row — the week they were checked off
    // lists them as a completed task (constants.js has promised this
    // since 2026-07-13).
    if (archivesWhenDone(habit)) {
      const done = completions.find(
        (c) =>
          c.habitId === habit.id &&
          c.dayKey >= weekStartKey &&
          c.dayKey <= weekEnd,
      )
      if (done) tasksCompleted.push({ habit, dayKey: done.dayKey })
      continue
    }

    const gone =
      habit.archived && habit.archivedAt !== null
        ? dayKeyFromTimestamp(habit.archivedAt, cutoffHour)
        : null
    let weekMarks = 0
    for (let i = 0; i < 7; i++) {
      weekMarks += countOn(completions, habit.id, addDays(weekStartKey, i))
    }
    // A habit archived before this week began only appears if it left
    // marks in it; its living weeks stay on record.
    if (gone !== null && gone < weekStartKey && weekMarks === 0) continue

    const days = []
    for (let i = 0; i < 7; i++) {
      const dayKey = addDays(weekStartKey, i)
      const count = countOn(completions, habit.id, dayKey)
      const outside =
        dayKey < born || dayKey > today || (gone !== null && dayKey > gone)
      days.push({
        dayKey,
        count,
        required: requiredPerDay(habit, dayKey),
        countsWithin: scheduleOn(habit, dayKey).type === 'nPerDay',
        // Only concluded days are "expected" — today is still in
        // progress and shows nothing rather than a not-yet.
        expected: !outside && dayKey < today && isScheduledOn(habit, dayKey),
        outside,
      })
    }
    // An archived habit's streak is over by definition — not notable.
    const streak = habit.archived
      ? null
      : currentStreak(habit, completions, asOf, cutoffHour)
    rows.push({
      habit,
      days,
      streak: streak !== null && streak >= 1 ? streak : null,
      streakUnit: streakKind(habit.schedule.type),
    })
  }
  return { weekStartKey, weekEnd, isCurrent, rows, tasksCompleted }
}

// The Sunday ritual (Kimia's decision 2026-07-16): on the FIRST visit
// of each Sunday — after any check-in — the app opens the field notes
// by itself. `shownOn` is the day it last did (stored in settings), so
// later visits that Sunday go straight to the list.
export function shouldOpenFieldNotes(todayKey, shownOn) {
  return isoWeekday(todayKey) === 7 && shownOn !== todayKey
}
