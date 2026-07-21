// Home-screen cameos (T4.6) — pure logic, no React, no storage.
//
// The third and last moment a friend's signature animation may play
// (design-notes §8): a friend turns up on the habit list to celebrate a
// BIG WIN, performs once, and the moment settles back to the calm list.
// Three win types (thresholds in constants.js, Kimia's calls
// 2026-07-21), at most one cameo per day — scarcity is the mechanic:
//
//   1. a LIVED-DAY MILESTONE — the lived-day count sits exactly on a
//      multiple of CAMEO_LIVED_DAY_STEP and today is a lived day (so
//      today is the crossing day itself — the count can only sit on the
//      milestone while today's mark is the one that reached it);
//   2. a RECORD STREAK — a habit's current streak beats every run
//      before it inside its current counting era (the schedule.js
//      kind-switch rule: day and week records never compete), and is
//      at least CAMEO_STREAK_RECORD_MIN strong — otherwise every young
//      habit would "beat its record" daily, a learnable schedule;
//   3. a BIG DAY — CAMEO_BIG_DAY_COMPLETIONS or more completions
//      against one Habitat day.
//
// Priority when several wins land together: milestone > record > big
// day (rarest first). The celebrating friend is a seeded surprise pick
// from the friends who have arrived — stable for the day and the win
// type, so undo/redo re-derives the identical visitor (the T3.1
// no-slot-machine rule). No friend yet → no cameo at all.
//
// Everything here is derived fresh from completion history, the meters'
// own principle: undoing today's marks pulls a big day back under its
// threshold, un-lives the milestone day, or un-breaks the record — and
// the cameo simply doesn't fire. Nothing is stored that could go stale.

import {
  CAMEO_BIG_DAY_COMPLETIONS,
  CAMEO_LIVED_DAY_STEP,
  CAMEO_STREAK_RECORD_MIN,
} from './constants.js'
import { addDays, dayKeyFromTimestamp, weekStart } from './days.js'
import { randomUnit } from './drops.js'
import { friendsFrom } from './friends.js'
import { livedDayCount } from './market.js'
import {
  currentKindStart,
  isScheduledOn,
  requiredPerDay,
  scheduleOn,
  streakKind,
} from './schedule.js'

// One pass over history: per habit, per day, how many completions. The
// streak walks below look days up one by one (a 5-year habit is ~1,800
// lookups); a flat map keeps that instant instead of re-filtering the
// whole history per day.
function countMap(completions) {
  const counts = new Map()
  for (const completion of completions) {
    const key = `${completion.habitId}|${completion.dayKey}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

const countOn = (counts, habitId, dayKey) =>
  counts.get(`${habitId}|${dayKey}`) ?? 0

// A habit's streak picture inside its current counting era:
//   current — the run still alive today (an unfulfilled today is "in
//             progress": it neither extends nor breaks the run, exactly
//             as currentStreak in schedule.js judges it);
//   record  — the longest run that ENDED before the current one.
// Day-kind version: walk the era forward, scheduled days only, runs
// breaking on unfulfilled scheduled days.
function dayStreaks(habit, counts, today, cutoffHour) {
  const eraStart = currentKindStart(
    habit,
    dayKeyFromTimestamp(habit.createdAt, cutoffHour),
  )
  let run = 0
  let record = 0
  for (let day = eraStart; day <= today; day = addDays(day, 1)) {
    if (!isScheduledOn(habit, day)) continue
    const fulfilled =
      countOn(counts, habit.id, day) >= requiredPerDay(habit, day)
    if (day === today && !fulfilled) continue // today still in progress
    if (fulfilled) run += 1
    else {
      record = Math.max(record, run)
      run = 0
    }
  }
  return { current: run, record }
}

// Week-kind version (N-per-week habits): same walk one week at a time,
// a week fulfilled when its count of fulfilled days reaches the n in
// force at that week's END — the isWeekFulfilled rule (the era's first
// week may reach back before eraStart, judging those days by the
// schedule each one lived under, exactly as weekProgress does).
function weekStreaks(habit, counts, today, cutoffHour) {
  const eraStart = currentKindStart(
    habit,
    dayKeyFromTimestamp(habit.createdAt, cutoffHour),
  )
  const thisWeek = weekStart(today)
  let run = 0
  let record = 0
  for (
    let week = weekStart(eraStart);
    week <= thisWeek;
    week = addDays(week, 7)
  ) {
    const n = scheduleOn(habit, addDays(week, 6)).n
    let fulfilledDays = 0
    for (let i = 0; i < 7; i++) {
      const day = addDays(week, i)
      if (countOn(counts, habit.id, day) >= requiredPerDay(habit, day)) {
        fulfilledDays += 1
      }
    }
    const fulfilled = fulfilledDays >= n
    if (week === thisWeek && !fulfilled) continue // this week in progress
    if (fulfilled) run += 1
    else {
      record = Math.max(record, run)
      run = 0
    }
  }
  return { current: run, record }
}

// Win 1: the lived-day count sits exactly on a milestone AND today is a
// lived day — which can only mean today's mark is the crossing one.
// (Yesterday the count was one less; tomorrow it will be one more or
// today will no longer be lived.) Zero lived days is not a milestone.
function livedDayWin(completions, today) {
  const lived = livedDayCount(completions)
  if (lived === 0 || lived % CAMEO_LIVED_DAY_STEP !== 0) return null
  if (!completions.some((completion) => completion.dayKey === today)) {
    return null
  }
  return { type: 'livedDays' }
}

// Win 2: the first habit (list order — stable) whose current streak is
// a genuine all-time record at or above the floor for its kind.
function streakRecordWin(habits, counts, today, cutoffHour) {
  for (const habit of habits) {
    const kind = streakKind(habit.schedule.type)
    if (kind === null) continue
    const { current, record } =
      kind === 'week'
        ? weekStreaks(habit, counts, today, cutoffHour)
        : dayStreaks(habit, counts, today, cutoffHour)
    if (current >= CAMEO_STREAK_RECORD_MIN[kind] && current > record) {
      return { type: 'streakRecord', habitId: habit.id }
    }
  }
  return null
}

// Win 3: many completions against one Habitat day, live and retro
// marks alike (a lived day is a lived day, however it was marked).
function bigDayWin(completions, today) {
  const todays = completions.filter(
    (completion) => completion.dayKey === today,
  ).length
  return todays >= CAMEO_BIG_DAY_COMPLETIONS ? { type: 'bigDay' } : null
}

// The seeded surprise guest: one of the arrived friends, picked by the
// world seed + the win's day and type — stable for that win, so an undo
// and re-mark brings back the identical celebrator.
function pickCameoFriend(friends, worldSeed, today, type) {
  const roll = randomUnit(`${worldSeed}|cameo|${today}|${type}`)
  return friends[Math.floor(roll * friends.length)]
}

// The streak picture behind win 2, exposed so the tests can referee the
// record maths directly (and check the walk stays equivalent to
// schedule.js's currentStreak): { current, record }, or null for a
// streakless schedule type (whenever / one-time).
export function streakStatus(habit, completions, now, cutoffHour) {
  const kind = streakKind(habit.schedule.type)
  if (kind === null) return null
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const counts = countMap(completions)
  return kind === 'week'
    ? weekStreaks(habit, counts, today, cutoffHour)
    : dayStreaks(habit, counts, today, cutoffHour)
}

// The cameo owed right now, or null. `habits` is the FULL list
// (archived included — a record streak stands even if the habit was
// archived today); `now` is a timestamp, like currentStreak takes.
// Returns { type, friend } — plus habitId for a record streak — or
// null when there is no win, or no friend has arrived yet to celebrate
// it ("only when a friend exists", plan T4.6).
export function cameoWin(habits, completions, worldSeed, now, cutoffHour) {
  const friends = friendsFrom(completions)
  if (friends.length === 0) return null
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const win =
    livedDayWin(completions, today) ??
    streakRecordWin(habits, countMap(completions), today, cutoffHour) ??
    bigDayWin(completions, today)
  if (win === null) return null
  return {
    ...win,
    friend: pickCameoFriend(friends, worldSeed, today, win.type),
  }
}
