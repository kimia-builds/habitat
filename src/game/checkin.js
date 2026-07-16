// The morning check-in (T1.4): which past days may still be edited,
// and when the app should open with "mark what you completed
// yesterday".
//
// The rules (spec §4.2, decided 2026-07-14):
//   - Yesterday must always be answerable — even on a Monday, when
//     yesterday (Sunday) belongs to last week.
//   - Other past days are editable only while their Mon–Sun week is
//     still the current week; a finished week is frozen history.
//   - A day left unfilled simply counts as not done — neutral data,
//     never a punishment. There is no separate "no data" state.
//
// The app remembers the last day whose check-in was answered as
// `checkedInThrough` (a day key, or null before the first ever
// check-in) — that is the only state this feature needs; everything
// else is derived from habits and completions.

import { canRecordRetroOn, countOn } from './completions.js'
import { addDays, dayKeyFromTimestamp } from './days.js'
import { archivesWhenDone, isDayFulfilled, isScheduledOn } from './schedule.js'

// Every past day that may still be edited, oldest first, ending at
// yesterday. On a Monday that is just [Sunday]; on a Sunday it is
// Monday through Saturday of the same week.
export function editablePastDays(todayKey) {
  const days = []
  for (let day = addDays(todayKey, -7); day < todayKey; day = addDays(day, 1)) {
    if (canRecordRetroOn(day, todayKey)) days.push(day)
  }
  return days
}

// Did this habit exist on this day? Days before a habit was created
// can't be filled in for it — there was nothing to do yet.
function existedOn(habit, dayKey, cutoffHour) {
  return dayKeyFromTimestamp(habit.createdAt, cutoffHour) <= dayKey
}

// The habits the check-in lists for one day: everything unarchived
// that already existed then. "Whenever" habits appear too — the
// question is "what did you do?", not "what were you supposed to do?".
// One exception: a one-time to-do that was checked off ON this very
// day is archived but still shown, so its mark can be undone here.
export function habitsOn(habits, completions, dayKey, cutoffHour) {
  return habits.filter((habit) => {
    if (!existedOn(habit, dayKey, cutoffHour)) return false
    if (!habit.archived) return true
    return archivesWhenDone(habit) && countOn(completions, habit.id, dayKey) > 0
  })
}

// Does this day still have an unmet expectation? True when some
// unarchived habit that existed then was scheduled and the day is not
// fulfilled. Purely informational — an unresolved day is neutral data.
export function hasUnresolved(habits, completions, dayKey, cutoffHour) {
  return habits.some(
    (habit) =>
      !habit.archived &&
      existedOn(habit, dayKey, cutoffHour) &&
      isScheduledOn(habit, dayKey) &&
      !isDayFulfilled(habit, completions, dayKey),
  )
}

// Should the app open with the check-in? Due only when YESTERDAY was
// missed and hasn't been answered yet. Older editable days never
// trigger it — backfill is optional, and optional things don't nag
// (they ride along once the panel is open, or via "edit past days").
// No scheduled habits, or yesterday already done — no check-in, no
// pressure.
export function isCheckInDue(
  habits,
  completions,
  checkedInThrough,
  todayKey,
  cutoffHour,
) {
  const yesterday = addDays(todayKey, -1)
  if (checkedInThrough !== null && checkedInThrough >= yesterday) return false
  return hasUnresolved(habits, completions, yesterday, cutoffHour)
}
