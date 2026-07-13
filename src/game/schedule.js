// The schedule engine: which days a habit is due, when a day or a week
// counts as fulfilled, and streak counting. Completions only ever ADD
// here — an unfulfilled day is neutral data, never a penalty (spec §3).

import { countOn } from './completions.js'
import { addDays, dayKeyFromTimestamp, isoWeekday, weekStart } from './days.js'

// Is this habit expected on this particular day? N-per-week, whenever
// and one-time habits have no particular due days, so the answer is no.
export function isScheduledOn(habit, dayKey) {
  switch (habit.schedule.type) {
    case 'daily':
    case 'nPerDay':
      return true
    case 'weekdays':
      return habit.schedule.days.includes(isoWeekday(dayKey))
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

// How many completions make one day of this habit "fulfilled".
export function requiredPerDay(habit) {
  return habit.schedule.type === 'nPerDay' ? habit.schedule.n : 1
}

// A day is fulfilled at the required count. MORE than required is fine:
// extras are recorded and kept — the day simply stays fulfilled
// (Kimia's decision 2026-07-13). Fewer is neutral, never punished.
export function isDayFulfilled(habit, completions, dayKey) {
  return countOn(completions, habit.id, dayKey) >= requiredPerDay(habit)
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

export function isWeekFulfilled(habit, completions, dayKey) {
  if (habit.schedule.type !== 'nPerWeek') {
    throw new Error('Week fulfilment only applies to N-per-week habits.')
  }
  return weekProgress(habit, completions, dayKey) >= habit.schedule.n
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
// A day (or week) still in progress never counts AGAINST the streak;
// it just doesn't count FOR it until it's fulfilled.
export function currentStreak(habit, completions, now, cutoffHour) {
  const type = habit.schedule.type
  if (type === 'whenever' || type === 'oneTime') return null

  const today = dayKeyFromTimestamp(now, cutoffHour)
  // Days before the habit existed can neither extend nor break a streak;
  // this is also what stops the backwards walk below.
  const firstDay = dayKeyFromTimestamp(habit.createdAt, cutoffHour)

  if (type === 'nPerWeek') {
    const firstWeek = weekStart(firstDay)
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
  // stopping to look on days the habit is actually scheduled.
  let day = today
  if (isScheduledOn(habit, day) && !isDayFulfilled(habit, completions, day)) {
    day = addDays(day, -1) // today is still in progress
  }
  let streak = 0
  // Day keys compare alphabetically = chronologically (see days.js).
  while (day >= firstDay) {
    if (isScheduledOn(habit, day)) {
      if (!isDayFulfilled(habit, completions, day)) break
      streak += 1
    }
    day = addDays(day, -1)
  }
  return streak
}
