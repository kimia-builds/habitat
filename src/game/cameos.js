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
//      kind-switch rule: day and week records never compete), on the
//      day the record FALLS and at every CAMEO_STREAK_RECORD_STEP of
//      the run thereafter (Kimia's rule 2026-08-20 — see the anchor
//      note beside streakRecordWin);
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
  CAMEO_STREAK_RECORD_STEP,
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
  return { type: 'livedDays', n: lived }
}

// Is a run at one of its celebration points today?
//
// THE ANCHOR (Kimia's rule 2026-08-20). Once a run has passed the old
// best it passes it again every single day, so "beats its record" on
// its own fires daily and for ever — the bug that had one habit's
// 15-day streak visiting two days running. The visit instead anchors on
// the day the record actually FALLS: the first length at which the run
// is both past the old best and clear of the floor. From there it
// recurs one step at a time.
//
//   old best 6, daily      → 7, 12, 17 …    (anchor 7, step 5)
//   never broken, daily    → 5, 10, 15 …    (floor 5 IS the anchor)
//   old best 3, N-per-week → 4, 5, 6, 7 …   (anchor 4, step 1)
//
// The old best cannot change while the run is alive — it is the longest
// run that ENDED before this one — so the anchor is fixed for the run's
// whole life and the pattern never drifts.
function isCelebrationPoint(current, record, kind) {
  const anchor = Math.max(record + 1, CAMEO_STREAK_RECORD_MIN[kind])
  if (current < anchor) return false
  return (current - anchor) % CAMEO_STREAK_RECORD_STEP[kind] === 0
}

// Win 2: every habit whose run is at a celebration point today.
//
// ALL of them, not just the first (Kimia's call 2026-08-20). Only one
// cameo may visit — scarcity is the mechanic — so the message speaks
// for the first habit in list order, exactly as before. But the visit
// is momentary and easy to miss, and pressing it goes to the field
// notes to see what it meant; if two habits both broke a record today,
// both must be waiting there. So the win carries the whole list.
//
// Each entry carries what the message needs: how long the run is now,
// the word for its unit, the habit's own name, and the best it beat
// (0 when this is the habit's first record — the two cases have their
// own narration slots, since there is no old best to name).
function streakRecordWin(habits, counts, today, cutoffHour) {
  const streaks = []
  for (const habit of habits) {
    const kind = streakKind(habit.schedule.type)
    if (kind === null) continue
    const { current, record } =
      kind === 'week'
        ? weekStreaks(habit, counts, today, cutoffHour)
        : dayStreaks(habit, counts, today, cutoffHour)
    if (!isCelebrationPoint(current, record, kind)) continue
    streaks.push({
      habitId: habit.id,
      habitName: habit.name,
      n: current,
      unit: kind,
      previous: record,
    })
  }
  if (streaks.length === 0) return null
  return { type: 'streakRecord', ...streaks[0], streaks }
}

// Win 3: many completions against one Habitat day, live and retro
// marks alike (a lived day is a lived day, however it was marked).
function bigDayWin(completions, today) {
  const todays = completions.filter(
    (completion) => completion.dayKey === today,
  ).length
  return todays >= CAMEO_BIG_DAY_COMPLETIONS
    ? { type: 'bigDay', n: todays }
    : null
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
//
// Returns { type, friend, n, … } — or null when there is no win, or no
// friend has arrived yet to celebrate it ("only when a friend exists",
// plan T4.6). Every win carries `n`, the number the win is ABOUT, so
// the message can say a true one (2026-08-20): steps taken today for a
// big day, the lived-day count for a milestone, the run's length for a
// record streak. A record streak also carries `habitName`, `unit`,
// `previous` and the full `streaks` list — see streakRecordWin.
//
// `played` (T6.6) is the slice of `completions` the CURRENT game may
// count — see game/newgame.js. The two wins differ in what they are
// about, so they read different lists: a lived-day milestone is game
// progress and counts only played days, while a record streak is a
// fact about Kimia's real life and must see the whole record, or a
// fresh start would hand out a bogus "record" on day one. It defaults
// to `completions`, which is exactly right for a world that has never
// been restarted.
export function cameoWin(
  habits,
  completions,
  worldSeed,
  now,
  cutoffHour,
  played = completions,
) {
  const friends = friendsFrom(played)
  if (friends.length === 0) return null
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const win =
    livedDayWin(played, today) ??
    streakRecordWin(habits, countMap(completions), today, cutoffHour) ??
    bigDayWin(completions, today)
  if (win === null) return null
  return {
    ...win,
    friend: pickCameoFriend(friends, worldSeed, today, win.type),
  }
}
