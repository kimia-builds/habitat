// The schedule engine: which days a habit is due, when a day or a week
// counts as fulfilled, and streak counting. Completions only ever ADD
// here — an unfulfilled day is neutral data, never a penalty (spec §3).
//
// Since T2.3, every question about a particular day is answered by the
// schedule that was IN FORCE on that day (Kimia's decision 2026-07-16:
// schedule edits are never retroactive). The habit's scheduleHistory
// (see habits.js) says which schedule that was.

import { countOn } from './completions.js'
import { addDays, dayKeyFromTimestamp, isoWeekday, weekStart } from './days.js'

// The schedule in force on a given day: the latest history entry that
// had taken effect by then. Days before the first entry (i.e. before
// the habit existed) fall back to the original schedule — harmless,
// since nothing was expected before creation anyway.
export function scheduleOn(habit, dayKey) {
  let schedule = habit.scheduleHistory[0].schedule
  for (const entry of habit.scheduleHistory) {
    if (entry.fromDay <= dayKey) schedule = entry.schedule
    else break
  }
  return schedule
}

// Is this habit expected on this particular day? N-per-week, whenever
// and one-time habits have no particular due days, so the answer is no.
export function isScheduledOn(habit, dayKey) {
  const schedule = scheduleOn(habit, dayKey)
  switch (schedule.type) {
    case 'daily':
    case 'nPerDay':
      return true
    case 'weekdays':
      return schedule.days.includes(isoWeekday(dayKey))
    default: // nPerWeek, whenever, oneTime
      return false
  }
}

// One-time habits are to-dos: a single completion finishes them for
// good, so the app archives them the moment they're done. Undoing that
// completion (same day only) un-archives them again (Kimia's decision
// 2026-07-13).
export function archivesWhenDone(habit) {
  return habit.schedule.type === 'oneTime'
}

// How many completions make one day of this habit "fulfilled". With a
// day key it answers for THAT day's schedule; without one, for the
// current schedule (e.g. the habit list asking about today).
export function requiredPerDay(habit, dayKey) {
  const schedule =
    dayKey === undefined ? habit.schedule : scheduleOn(habit, dayKey)
  return schedule.type === 'nPerDay' ? schedule.n : 1
}

// A day is fulfilled at the required count. MORE than required is fine:
// extras are recorded and kept — the day simply stays fulfilled
// (Kimia's decision 2026-07-13). Fewer is neutral, never punished.
export function isDayFulfilled(habit, completions, dayKey) {
  return countOn(completions, habit.id, dayKey) >= requiredPerDay(habit, dayKey)
}

// For N-per-week habits: how many DISTINCT days of this day's week
// (Monday–Sunday) have at least one completion. Three completions on
// one day advance the week by one, not three (Kimia's decision
// 2026-07-13). Note that "which week" follows each completion's
// attributed day, so 1am on Sunday night still lands in the old week.
export function weekProgress(habit, completions, dayKey) {
  const monday = weekStart(dayKey)
  let fulfilledDays = 0
  for (let i = 0; i < 7; i++) {
    if (isDayFulfilled(habit, completions, addDays(monday, i))) {
      fulfilledDays += 1
    }
  }
  return fulfilledDays
}

// The week's target is the n in force at the week's END — a mid-week
// change to the n applies from the day of the change onward, so what
// the week is finally judged by is where it ended up (never
// retroactively harsher OR kinder than what was asked while it ran).
export function isWeekFulfilled(habit, completions, dayKey) {
  const weekEndSchedule = scheduleOn(habit, addDays(weekStart(dayKey), 6))
  if (weekEndSchedule.type !== 'nPerWeek') {
    throw new Error('Week fulfilment only applies to N-per-week habits.')
  }
  return weekProgress(habit, completions, dayKey) >= weekEndSchedule.n
}

// Streaks come in two counting units: day-based schedules (daily,
// weekdays, N-per-day) count fulfilled days; N-per-week counts
// fulfilled weeks; whenever and one-time have no streak at all.
export function streakKind(scheduleType) {
  if (scheduleType === 'nPerWeek') return 'week'
  if (scheduleType === 'whenever' || scheduleType === 'oneTime') return null
  return 'day'
}

// Where the current streak's counting era began. Kimia's rule
// (2026-07-16): switching between day-counted and week-counted
// schedules restarts the streak at the switch (the UI warns before
// saving such an edit). So we walk the schedule history backwards
// through the unbroken run of same-kind schedules; the run's first
// entry is where this era began. A run reaching the very first entry
// began with the habit itself.
// (Exported for T4.6's cameo module: a record streak only competes
// against records set inside the current counting era.)
export function currentKindStart(habit, firstDay) {
  const kind = streakKind(habit.schedule.type)
  const history = habit.scheduleHistory
  let start = firstDay
  for (let i = history.length - 1; i >= 0; i--) {
    if (streakKind(history[i].schedule.type) !== kind) break
    start = i === 0 ? firstDay : history[i].fromDay
  }
  return start < firstDay ? firstDay : start
}

// The current streak. Purely informational — a break just resets the
// count to zero; nothing is ever lost or damaged (spec §3).
//
//   daily / nPerDay : consecutive fulfilled days
//   weekdays        : consecutive fulfilled SCHEDULED days (a Tuesday
//                     can never break a Mon/Wed/Fri streak)
//   nPerWeek        : consecutive fulfilled weeks
//   whenever        : no streak at all → null (no expectation, no
//                     pressure — Kimia's decision 2026-07-13)
//   oneTime         : no streak either → null (a to-do happens once)
//
// Each day (or week) is judged by the schedule in force THEN — a later
// edit never rewrites it (Kimia's decision 2026-07-16). A day the
// then-current schedule didn't expect is simply skipped over.
//
// A day (or week) still in progress never counts AGAINST the streak;
// it just doesn't count FOR it until it's fulfilled.
export function currentStreak(habit, completions, now, cutoffHour) {
  const kind = streakKind(habit.schedule.type)
  if (kind === null) return null

  const today = dayKeyFromTimestamp(now, cutoffHour)
  // Days before the habit existed can neither extend nor break a
  // streak, and neither can days before the current counting era began;
  // together these stop the backwards walks below.
  const firstDay = dayKeyFromTimestamp(habit.createdAt, cutoffHour)
  const eraStart = currentKindStart(habit, firstDay)

  if (kind === 'week') {
    const firstWeek = weekStart(eraStart)
    let week = weekStart(today)
    if (!isWeekFulfilled(habit, completions, week)) {
      week = addDays(week, -7) // this week is still in progress
    }
    let streak = 0
    while (week >= firstWeek && isWeekFulfilled(habit, completions, week)) {
      streak += 1
      week = addDays(week, -7)
    }
    return streak
  }

  // daily, nPerDay, weekdays: walk backwards one day at a time, only
  // stopping to look on days the habit was actually scheduled — per
  // the schedule each day was living under.
  let day = today
  if (isScheduledOn(habit, day) && !isDayFulfilled(habit, completions, day)) {
    day = addDays(day, -1) // today is still in progress
  }
  let streak = 0
  // Day keys compare alphabetically = chronologically (see days.js).
  while (day >= eraStart) {
    if (isScheduledOn(habit, day)) {
      if (!isDayFulfilled(habit, completions, day)) break
      streak += 1
    }
    day = addDays(day, -1)
  }
  return streak
}
