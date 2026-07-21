import { describe, expect, it } from 'vitest'
import { cameoWin, streakStatus } from './cameos.js'
import { recordCompletion } from './completions.js'
import {
  CAMEO_BIG_DAY_COMPLETIONS,
  CAMEO_LIVED_DAY_STEP,
  CAMEO_STREAK_RECORD_MIN,
} from './constants.js'
import { addDays } from './days.js'
import { changeSchedule, createHabit } from './habits.js'
import { currentStreak } from './schedule.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3
const SEED = 'test-world'
// 2026-07-13 is a Monday (verified in days.test.js), so "today" below —
// 2026-07-15 — is the Wednesday of that week.
const NOW = at(2026, 7, 15, 12)
const TODAY = '2026-07-15'
const LONG_AGO = at(2020, 1, 1, 12)

const makeHabit = (schedule, id = 'h1', createdAt = LONG_AGO) =>
  createHabit(
    { name: 'Test habit', symbol: 1, difficulty: 'medium', schedule },
    createdAt,
    id,
  )

// One completion of `habitId` on the given calendar date, entered at
// midday so the 3am cutoff never shifts its day.
let nextId = 0
const done = (habitId, y, m, d) =>
  recordCompletion(habitId, CUTOFF, at(y, m, d, 12), `c${nextId++}`)

// One completion on a 'YYYY-MM-DD' day key.
const doneOn = (habitId, dayKey) => {
  const [y, m, d] = dayKey.split('-').map(Number)
  return done(habitId, y, m, d)
}

// A friend who has arrived: every cameo needs one ("only when a friend
// exists"). Rides on an ordinary completion, like every drop.
const withFriend = (completion, category = 0, individual = 1) => ({
  ...completion,
  drops: [{ kind: 'friend', category, individual }],
})

// Completions of h1 on n distinct consecutive Habitat days, ending
// today (or ending yesterday when includeToday is false).
const livedHistory = (n, includeToday = true) => {
  const completions = []
  for (let i = includeToday ? 0 : 1; completions.length < n; i++) {
    completions.push(doneOn('h1', addDays(TODAY, -i)))
  }
  return completions
}

// Completions of h1 on n distinct NON-consecutive past days, none of
// them today — lived days that can't accidentally form a streak.
const scatteredHistory = (n) => {
  const completions = []
  for (let i = 0; completions.length < n; i++) {
    completions.push(doneOn('h1', addDays(TODAY, -(i * 2 + 1))))
  }
  return completions
}

// Mark the day's oldest completion as the one a friend arrived on.
const withFriendOnOldest = (completions) => {
  completions[completions.length - 1] = withFriend(completions.at(-1))
  return completions
}

describe('big day (win 3)', () => {
  const habit = makeHabit({ type: 'daily' })

  it('fires when today reaches the threshold', () => {
    const completions = [
      withFriend(done('h1', 2026, 7, 1)),
      ...Array.from({ length: CAMEO_BIG_DAY_COMPLETIONS }, () =>
        done('h1', 2026, 7, 15),
      ),
    ]
    const win = cameoWin([habit], completions, SEED, NOW, CUTOFF)
    expect(win.type).toBe('bigDay')
  })

  it('stays quiet one below the threshold', () => {
    const completions = [
      withFriend(done('h1', 2026, 7, 1)),
      ...Array.from({ length: CAMEO_BIG_DAY_COMPLETIONS - 1 }, () =>
        done('h1', 2026, 7, 15),
      ),
    ]
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('counts completions across habits, not per habit', () => {
    const other = makeHabit({ type: 'daily' }, 'h2')
    const completions = [withFriend(done('h1', 2026, 7, 1))]
    for (let i = 0; i < 4; i++) {
      completions.push(done('h1', 2026, 7, 15), done('h2', 2026, 7, 15))
    }
    expect(cameoWin([habit, other], completions, SEED, NOW, CUTOFF).type).toBe(
      'bigDay',
    )
  })

  it('does not fire for a big day that is over', () => {
    const completions = [
      withFriend(done('h1', 2026, 7, 1)),
      ...Array.from({ length: CAMEO_BIG_DAY_COMPLETIONS }, () =>
        done('h1', 2026, 7, 14),
      ),
    ]
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('undo pulls the day back under the threshold and the cameo is gone', () => {
    const todays = Array.from({ length: CAMEO_BIG_DAY_COMPLETIONS }, () =>
      done('h1', 2026, 7, 15),
    )
    const base = [withFriend(done('h1', 2026, 7, 1))]
    const full = [...base, ...todays]
    expect(cameoWin([habit], full, SEED, NOW, CUTOFF)).not.toBe(null)
    // Undo one of today's marks.
    const undone = full.filter((c) => c.id !== todays[0].id)
    expect(cameoWin([habit], undone, SEED, NOW, CUTOFF)).toBe(null)
  })
})

describe('lived-day milestone (win 1)', () => {
  const habit = makeHabit({ type: 'daily' })

  it('fires on the exact crossing day', () => {
    // 50 lived days, today among them — today IS the crossing day.
    // (A 50-day streak also stands, but the milestone outranks it.)
    const completions = withFriendOnOldest(livedHistory(CAMEO_LIVED_DAY_STEP))
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'livedDays',
    )
  })

  it('does not fire the day after the crossing (the milestone has passed)', () => {
    // 50 lived days, none of them today — the crossing was earlier.
    const completions = withFriendOnOldest(
      scatteredHistory(CAMEO_LIVED_DAY_STEP),
    )
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('does not fire between milestones', () => {
    // Today is the 51st lived day — one past the milestone, nothing owed.
    const completions = withFriendOnOldest(
      scatteredHistory(CAMEO_LIVED_DAY_STEP),
    )
    completions.push(done('h1', 2026, 7, 15))
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })
})

describe('record streak (win 2)', () => {
  it('fires when a first-ever streak reaches the floor', () => {
    const habit = makeHabit({ type: 'daily' })
    // Five consecutive fulfilled days ending today; nothing before.
    const completions = livedHistory(CAMEO_STREAK_RECORD_MIN.day)
    completions[0] = withFriend(completions[0])
    const win = cameoWin([habit], completions, SEED, NOW, CUTOFF)
    expect(win.type).toBe('streakRecord')
    expect(win.habitId).toBe('h1')
  })

  it('stays quiet below the floor, however unbeaten', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = livedHistory(CAMEO_STREAK_RECORD_MIN.day - 1)
    completions[0] = withFriend(completions[0])
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('stays quiet when an earlier run was longer', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [withFriend(done('h1', 2025, 1, 1))]
    // An 8-day run in June…
    for (let d = 1; d <= 8; d++) completions.push(done('h1', 2026, 6, d))
    // …a gap… then a 6-day run ending today (above the floor).
    for (let d = 10; d <= 15; d++) completions.push(done('h1', 2026, 7, d))
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('fires when the current run passes the old record', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [withFriend(done('h1', 2025, 1, 1))]
    // A 4-day run in June, a gap, then 6 days ending today.
    for (let d = 1; d <= 4; d++) completions.push(done('h1', 2026, 6, d))
    for (let d = 10; d <= 15; d++) completions.push(done('h1', 2026, 7, d))
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'streakRecord',
    )
  })

  it('counts week-kind streaks against their own floor', () => {
    const habit = makeHabit({ type: 'nPerWeek', n: 1 })
    const completions = [
      withFriend(done('h1', 2025, 1, 1)),
      done('h1', 2026, 6, 29), // week of Mon 2026-06-29
      done('h1', 2026, 7, 7), // week of Mon 2026-07-06
      done('h1', 2026, 7, 13), // this week (Mon 2026-07-13)
    ]
    // Three fulfilled weeks running: at/above the 2-week floor, no
    // earlier week run at all.
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'streakRecord',
    )
  })

  it('keeps week-kind records below their floor quiet', () => {
    const habit = makeHabit({ type: 'nPerWeek', n: 1 })
    const completions = [
      withFriend(done('h1', 2025, 1, 1)),
      done('h1', 2026, 7, 13), // this week only
    ]
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })

  it('forgets records from a dead counting era (kind switch restarts)', () => {
    // Ten daily days in June, then the habit became N-per-week: the old
    // 10-day record belongs to the dead day-era and must not compete.
    const habit = changeSchedule(
      makeHabit({ type: 'daily' }),
      { type: 'nPerWeek', n: 1 },
      '2026-06-29',
    )
    const completions = [withFriend(done('h1', 2025, 1, 1))]
    for (let d = 1; d <= 10; d++) completions.push(done('h1', 2026, 6, d))
    completions.push(
      done('h1', 2026, 6, 29),
      done('h1', 2026, 7, 7),
      done('h1', 2026, 7, 13),
    )
    const status = streakStatus(habit, completions, NOW, CUTOFF)
    expect(status).toEqual({ current: 3, record: 0 })
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'streakRecord',
    )
  })
})

describe('one cameo a day, rarest first', () => {
  const habit = makeHabit({ type: 'daily' })

  it('a milestone outranks a big day', () => {
    const completions = withFriendOnOldest(livedHistory(CAMEO_LIVED_DAY_STEP))
    for (let i = 0; i < CAMEO_BIG_DAY_COMPLETIONS; i++) {
      completions.push(done('h1', 2026, 7, 15))
    }
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'livedDays',
    )
  })

  it('a record streak outranks a big day', () => {
    const completions = [withFriend(done('h1', 2025, 1, 1))].concat(
      livedHistory(CAMEO_STREAK_RECORD_MIN.day - 1, false),
    )
    for (let i = 0; i < CAMEO_BIG_DAY_COMPLETIONS; i++) {
      completions.push(done('h1', 2026, 7, 15))
    }
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).type).toBe(
      'streakRecord',
    )
  })
})

describe('the celebrating friend', () => {
  const habit = makeHabit({ type: 'daily' })
  const bigDay = (friends) => [
    ...friends,
    ...Array.from({ length: CAMEO_BIG_DAY_COMPLETIONS }, () =>
      done('h1', 2026, 7, 15),
    ),
  ]

  it('no friend arrived → no cameo, whatever the win', () => {
    expect(cameoWin([habit], bigDay([]), SEED, NOW, CUTOFF)).toBe(null)
  })

  it('the pick is one of the arrived friends, stable for the win', () => {
    const completions = bigDay([
      withFriend(done('h1', 2026, 6, 1), 2, 1),
      withFriend(done('h1', 2026, 6, 20), 7, 1),
      withFriend(done('h1', 2026, 7, 10), 2, 2),
    ])
    const win = cameoWin([habit], completions, SEED, NOW, CUTOFF)
    expect([
      { category: 2, individual: 1 },
      { category: 7, individual: 1 },
      { category: 2, individual: 2 },
    ]).toContainEqual({
      category: win.friend.category,
      individual: win.friend.individual,
    })
    // Same world, same day, same win → the identical celebrator.
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF).friend).toEqual(
      win.friend,
    )
  })

  it('a plain day fires nothing', () => {
    const completions = [withFriend(done('h1', 2026, 7, 15))]
    expect(cameoWin([habit], completions, SEED, NOW, CUTOFF)).toBe(null)
  })
})

describe('streakStatus — the record maths, refereed', () => {
  it('always agrees with currentStreak on the current run', () => {
    const scenarios = [
      // daily: runs of 3 and (current) 6 with a gap between
      [
        makeHabit({ type: 'daily' }),
        [
          ...[1, 2, 3].map((d) => done('h1', 2026, 6, d)),
          ...[10, 11, 12, 13, 14, 15].map((d) => done('h1', 2026, 7, d)),
        ],
      ],
      // weekdays Mon/Wed/Fri: today unfulfilled is "in progress"
      [
        makeHabit({ type: 'weekdays', days: [1, 3, 5] }),
        [1, 3, 6, 10, 13].map((d) => done('h1', 2026, 7, d)),
      ],
      // nPerDay n=2: partial days never fulfil
      [
        makeHabit({ type: 'nPerDay', n: 2 }),
        [
          done('h1', 2026, 7, 10),
          done('h1', 2026, 7, 10),
          done('h1', 2026, 7, 11),
          done('h1', 2026, 7, 13),
          done('h1', 2026, 7, 14),
          done('h1', 2026, 7, 14),
          done('h1', 2026, 7, 15),
        ],
      ],
      // nPerWeek n=2: mixed weeks
      [
        makeHabit({ type: 'nPerWeek', n: 2 }),
        [
          done('h1', 2026, 6, 1),
          done('h1', 2026, 6, 3),
          done('h1', 2026, 6, 8),
          done('h1', 2026, 7, 13),
          done('h1', 2026, 7, 14),
        ],
      ],
    ]
    for (const [habit, completions] of scenarios) {
      expect(streakStatus(habit, completions, NOW, CUTOFF).current).toBe(
        currentStreak(habit, completions, NOW, CUTOFF),
      )
    }
  })

  it('reads past runs as the record', () => {
    const habit = makeHabit({ type: 'daily' })
    const completions = [
      ...[1, 2, 3, 4, 5, 6, 7, 8].map((d) => done('h1', 2026, 5, d)), // 8
      ...[1, 2, 3].map((d) => done('h1', 2026, 6, d)), // 3
      ...[10, 11, 12, 13, 14, 15].map((d) => done('h1', 2026, 7, d)), // 6 now
    ]
    expect(streakStatus(habit, completions, NOW, CUTOFF)).toEqual({
      current: 6,
      record: 8,
    })
  })

  it('is null for streakless schedule types', () => {
    expect(streakStatus(makeHabit({ type: 'whenever' }), [], NOW, CUTOFF)).toBe(
      null,
    )
    expect(streakStatus(makeHabit({ type: 'oneTime' }), [], NOW, CUTOFF)).toBe(
      null,
    )
  })
})
