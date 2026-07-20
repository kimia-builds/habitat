// Tests for friendships (T4.4) — the delay logic gets the strict
// treatment (plan T4.4's done-when): a literacy milestone only OPENS
// the door; the friend arrives as a surprise drop 1–5 seeded Habitat
// days later, riding the first tap on/after that day. Repeats wait a
// seeded 20–50 days after the previous arrival. One friend per tap,
// earliest-due first, and everything re-derives identically after an
// undo — the delays are pure functions of the world seed.

import { describe, expect, it } from 'vitest'
import {
  FRIEND_CATEGORIES,
  FRIEND_FIRST_DELAY_DAYS,
  FRIEND_REPEAT_GAP_DAYS,
  LITERACY_MILESTONES,
} from './constants.js'
import { addDays } from './days.js'
import { validateDrop } from './drops.js'
import {
  doorOpenDays,
  friendDueDay,
  friendName,
  friendsFrom,
  nextFriendDue,
  withFriendDrop,
} from './friends.js'

const SEED = 'test-world-seed'
const magazine = { kind: 'reading', readingType: 'magazine' }
const novel = { kind: 'reading', readingType: 'novel' }
const dictionary = { kind: 'reading', readingType: 'dictionary' }

// A completion shaped like the real ones.
let clock = 0
function completion(id, dayKey, drops = []) {
  return { id, habitId: 'h', recordedAt: ++clock, dayKey, drops }
}

// A history of `count` magazine drops (1 literacy point each), one per
// day starting at `firstDay` — the simplest way to walk the meter.
function magazineRun(firstDay, count) {
  return Array.from({ length: count }, (_, i) =>
    completion(`m${i}`, addDays(firstDay, i), [magazine]),
  )
}

function daysBetween(a, b) {
  const ms = new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)
  return ms / 86400000
}

describe('doorOpenDays', () => {
  it('no reading anywhere → every door shut', () => {
    expect(doorOpenDays([completion('a', '2026-07-01')])).toEqual(
      LITERACY_MILESTONES.map(() => null),
    )
  })

  it('a door opens on the day of the reading that crosses its threshold', () => {
    // Nine magazines (9 points) open nothing; the tenth crosses the
    // first milestone (10) — the door day is THAT completion's day.
    const nine = magazineRun('2026-07-01', 9)
    expect(doorOpenDays(nine)[0]).toBeNull()
    const ten = [...nine, completion('x', '2026-07-20', [magazine])]
    expect(doorOpenDays(ten)[0]).toBe('2026-07-20')
    expect(doorOpenDays(ten)[1]).toBeNull()
  })

  it('a dictionary (12 points) crosses the first threshold in one drop', () => {
    const doors = doorOpenDays([completion('a', '2026-07-05', [dictionary])])
    expect(doors[0]).toBe('2026-07-05')
    expect(doors[1]).toBeNull()
  })

  it('the door day is the day the reading was DONE, not entered', () => {
    // A retro mark entered later still opens the door on its own day.
    const history = [
      ...magazineRun('2026-07-01', 9),
      completion('retro', '2026-07-19', [magazine]),
      completion('later', '2026-07-21', []),
    ]
    expect(doorOpenDays(history)[0]).toBe('2026-07-19')
  })
})

describe('the first friend of a category', () => {
  it('is due 1–5 seeded days after its door opens, identically every time', () => {
    const history = magazineRun('2026-07-01', 10) // door: 2026-07-10
    const due = nextFriendDue(history, SEED)
    expect(due.category).toBe(0)
    expect(due.individual).toBe(1)
    const wait = daysBetween('2026-07-10', due.dueDay)
    expect(wait).toBeGreaterThanOrEqual(FRIEND_FIRST_DELAY_DAYS.min)
    expect(wait).toBeLessThanOrEqual(FRIEND_FIRST_DELAY_DAYS.max)
    // Seeded, never shuffled: the same history always waits the same.
    expect(nextFriendDue(history, SEED)).toEqual(due)
    expect(friendDueDay(SEED, '2026-07-10', 0, 1)).toBe(due.dueDay)
  })

  it('never rides a tap before its due day — arrives on the due day itself', () => {
    const history = magazineRun('2026-07-01', 10)
    const { dueDay } = nextFriendDue(history, SEED)

    const tooEarly = withFriendDrop(
      completion('t1', addDays(dueDay, -1)),
      history,
      SEED,
    )
    expect(tooEarly.drops).toEqual([])

    const onTheDay = withFriendDrop(completion('t2', dueDay), history, SEED)
    expect(onTheDay.drops).toEqual([
      { kind: 'friend', category: 0, individual: 1 },
    ])

    const later = withFriendDrop(
      completion('t3', addDays(dueDay, 9)),
      history,
      SEED,
    )
    expect(later.drops).toEqual([
      { kind: 'friend', category: 0, individual: 1 },
    ])
  })

  it("keeps the tap's other drops — the friend rides alongside them", () => {
    const history = magazineRun('2026-07-01', 10)
    const { dueDay } = nextFriendDue(history, SEED)
    const delivered = withFriendDrop(
      completion('t', dueDay, [{ kind: 'fungi', amount: 2 }]),
      history,
      SEED,
    )
    expect(delivered.drops).toEqual([
      { kind: 'fungi', amount: 2 },
      { kind: 'friend', category: 0, individual: 1 },
    ])
  })
})

describe("repeat friends (Kimia's decision 2026-07-20)", () => {
  it('the next friend of a category waits 20–50 seeded days after the previous arrival', () => {
    const history = [
      ...magazineRun('2026-07-01', 10),
      completion('f1', '2026-07-14', [
        { kind: 'friend', category: 0, individual: 1 },
      ]),
    ]
    const due = nextFriendDue(history, SEED)
    expect(due.category).toBe(0)
    expect(due.individual).toBe(2)
    const gap = daysBetween('2026-07-14', due.dueDay)
    expect(gap).toBeGreaterThanOrEqual(FRIEND_REPEAT_GAP_DAYS.min)
    expect(gap).toBeLessThanOrEqual(FRIEND_REPEAT_GAP_DAYS.max)
    expect(nextFriendDue(history, SEED)).toEqual(due)
  })

  it('the gap counts from the previous ARRIVAL, never from its due day', () => {
    // The first friend was due on the 12th but only tapped home on the
    // 30th — the next wait starts from the 30th.
    const history = [
      ...magazineRun('2026-07-01', 10),
      completion('f1', '2026-07-30', [
        { kind: 'friend', category: 0, individual: 1 },
      ]),
    ]
    const due = nextFriendDue(history, SEED)
    expect(due.dueDay).toBe(friendDueDay(SEED, null, 0, 2, '2026-07-30'))
    expect(daysBetween('2026-07-30', due.dueDay)).toBeGreaterThanOrEqual(
      FRIEND_REPEAT_GAP_DAYS.min,
    )
  })

  it('once arrived, a friend never arrives again — the next individual waits instead', () => {
    const history = magazineRun('2026-07-01', 10)
    const { dueDay } = nextFriendDue(history, SEED)
    const arrived = withFriendDrop(completion('t', dueDay), history, SEED)
    const after = [...history, arrived]
    // A same-day tap right after carries no second copy.
    const next = withFriendDrop(completion('t2', dueDay), after, SEED)
    expect(next.drops).toEqual([])
    expect(friendsFrom(after)).toHaveLength(1)
  })
})

describe('one friend per tap, earliest-due first', () => {
  // 30 points open the first two doors: 2 dictionaries (24) + 1 novel
  // (4) + 2 magazines (2).
  const twoDoors = [
    completion('d1', '2026-07-01', [dictionary]),
    completion('d2', '2026-07-02', [dictionary]),
    completion('n1', '2026-07-03', [novel]),
    ...magazineRun('2026-07-04', 2),
  ]

  it('two doors open two categories in milestone order', () => {
    const doors = doorOpenDays(twoDoors)
    expect(doors[0]).toBe('2026-07-01')
    expect(doors[1]).toBe('2026-07-05')
  })

  it('a tap carries only the earliest-due friend; the other waits for the next tap', () => {
    const doors = doorOpenDays(twoDoors)
    const dueA = friendDueDay(SEED, doors[0], 0, 1)
    const dueB = friendDueDay(SEED, doors[1], 1, 1)
    const latest = dueA <= dueB ? dueB : dueA
    const firstCategory = dueA <= dueB ? 0 : 1

    const farFuture = addDays(latest, 30) // both long due
    const first = withFriendDrop(completion('t1', farFuture), twoDoors, SEED)
    expect(first.drops).toEqual([
      { kind: 'friend', category: firstCategory, individual: 1 },
    ])

    const second = withFriendDrop(
      completion('t2', farFuture),
      [...twoDoors, first],
      SEED,
    )
    expect(second.drops).toEqual([
      { kind: 'friend', category: 1 - firstCategory, individual: 1 },
    ])
  })
})

describe('undo and door-closing consistency', () => {
  it('an undone friend re-derives identically on the next tap', () => {
    const history = magazineRun('2026-07-01', 10)
    const { dueDay } = nextFriendDue(history, SEED)
    const arrived = withFriendDrop(completion('t', dueDay), history, SEED)
    // Undo: the friend is gone from history…
    const undone = history // (the tap never happened)
    // …so the next tap re-derives the identical friend, drop for drop.
    const again = withFriendDrop(
      completion('t2', addDays(dueDay, 3)),
      undone,
      SEED,
    )
    expect(again.drops).toEqual(arrived.drops)
  })

  it('undoing the reading that opened a door quietly closes it again', () => {
    const history = magazineRun('2026-07-01', 10)
    expect(nextFriendDue(history, SEED)).not.toBeNull()
    const withoutTheTenth = history.slice(0, 9)
    expect(nextFriendDue(withoutTheTenth, SEED)).toBeNull()
  })

  it('a retro tap only meets friends its own day had already reached', () => {
    const history = magazineRun('2026-07-01', 10)
    const { dueDay } = nextFriendDue(history, SEED)
    // Marked today but DONE before the due day — no friend.
    const retro = withFriendDrop(
      completion('r', addDays(dueDay, -1)),
      history,
      SEED,
    )
    expect(retro.drops).toEqual([])
  })
})

describe('friendsFrom — the Guest Book’s contents', () => {
  it('lists every arrived friend in arrival order', () => {
    const history = [
      completion('a', '2026-07-01', [dictionary]),
      completion('b', '2026-07-03', [
        { kind: 'fungi', amount: 1 },
        { kind: 'friend', category: 0, individual: 1 },
      ]),
      completion('c', '2026-08-01', [
        { kind: 'friend', category: 0, individual: 2 },
      ]),
    ]
    expect(friendsFrom(history)).toEqual([
      { completionId: 'b', category: 0, individual: 1, dayKey: '2026-07-03' },
      { completionId: 'c', category: 0, individual: 2, dayKey: '2026-08-01' },
    ])
  })
})

describe('friend drop records', () => {
  it('valid friend drops pass; broken ones fail loudly', () => {
    expect(() =>
      validateDrop({ kind: 'friend', category: 0, individual: 1 }),
    ).not.toThrow()
    expect(() =>
      validateDrop({
        kind: 'friend',
        category: FRIEND_CATEGORIES.length - 1,
        individual: 3,
      }),
    ).not.toThrow()
    expect(() =>
      validateDrop({
        kind: 'friend',
        category: FRIEND_CATEGORIES.length,
        individual: 1,
      }),
    ).toThrow(/category/)
    expect(() =>
      validateDrop({ kind: 'friend', category: 0, individual: 0 }),
    ).toThrow(/individual/)
    expect(() => validateDrop({ kind: 'friend' })).toThrow()
  })

  it('friends are named by their draft category singular until T6.1', () => {
    expect(friendName({ category: 0 })).toBe('a Drifter')
    expect(friendName({ category: 9 })).toBe('a Poet')
  })
})
