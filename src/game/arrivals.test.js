// Tests for drop arrival (T3.2). The heart of the design: drops are
// rolled AT tap time and STORED on the completion, so undo takes a
// tap's drops back with it and nobody else's stored luck ever moves.
// Meter feeds (reading, fungi) and "is this a first?" are all derived
// from that stored history — never kept as separate running numbers.

import { describe, expect, it } from 'vitest'
import {
  deliverDrops,
  dropKey,
  fungusBalanceFrom,
  readingItemsFrom,
  seenDropKeys,
} from './arrivals.js'
import { removeLatestOn } from './completions.js'
import { rollDrops } from './drops.js'

const SEED = 'test-world-seed'
const habit = { id: 'habit-1', difficulty: 'medium' }

// A completion shaped like the real ones (recordedAt increases with
// the id suffix so removeLatestOn's "latest" is predictable).
let clock = 0
function completion(id, habitId, dayKey, drops = []) {
  return { id, habitId, recordedAt: ++clock, dayKey, drops }
}

describe('deliverDrops', () => {
  it('stores exactly what the seeded engine rolls for the tap', () => {
    const delivered = deliverDrops(
      completion('c1', habit.id, '2026-07-19'),
      habit,
      [],
      SEED,
    )
    expect(delivered.drops).toEqual(
      rollDrops({
        worldSeed: SEED,
        habitId: habit.id,
        dayKey: '2026-07-19',
        tapIndex: 0,
        stepIndex: 0,
        difficulty: 'medium',
      }),
    )
    expect(delivered.id).toBe('c1')
    expect(delivered.habitId).toBe(habit.id)
  })

  it('keys the roll on tap-of-day and expedition step', () => {
    // Three completions exist: one of this habit on the same day, one
    // of another habit, one of this habit on another day. So the new
    // tap is expedition step 3, and tap 1 of its habit's day.
    const existing = [
      completion('a', habit.id, '2026-07-19'),
      completion('b', 'other-habit', '2026-07-19'),
      completion('c', habit.id, '2026-07-18'),
    ]
    const delivered = deliverDrops(
      completion('d', habit.id, '2026-07-19'),
      habit,
      existing,
      SEED,
    )
    expect(delivered.drops).toEqual(
      rollDrops({
        worldSeed: SEED,
        habitId: habit.id,
        dayKey: '2026-07-19',
        tapIndex: 1,
        stepIndex: 3,
        difficulty: 'medium',
      }),
    )
  })

  it('redoing the identical tap returns the identical drops', () => {
    const roll = () =>
      deliverDrops(completion('x', habit.id, '2026-07-19'), habit, [], SEED)
        .drops
    expect(roll()).toEqual(roll())
  })
})

describe('derived meters and firsts', () => {
  const history = [
    completion('a', 'h', '2026-07-01', [{ kind: 'fungi', amount: 2 }]),
    completion('b', 'h', '2026-07-02', []),
    completion('c', 'h', '2026-07-03', [
      { kind: 'reading', readingType: 'magazine' },
      { kind: 'fungi', amount: 1 },
    ]),
    completion('d', 'h', '2026-07-04', [{ kind: 'flora' }]),
  ]

  it('collects all reading material, dated, for the meter and the Bookcase', () => {
    // Since T3.5 each item carries the day it arrived and its (not yet
    // named — T6.1) publication, so the Bookcase can list and open it.
    expect(readingItemsFrom(history)).toEqual([
      {
        id: 'c:0',
        type: 'magazine',
        dayKey: '2026-07-03',
        publicationId: null,
      },
    ])
  })

  it('sums all fungi into the wallet', () => {
    expect(fungusBalanceFrom(history)).toBe(3)
  })

  it('knows which drop families have ever occurred', () => {
    const seen = seenDropKeys(history)
    expect(seen.has('flora')).toBe(true)
    expect(seen.has('magazine')).toBe(true)
    expect(seen.has('fungi')).toBe(true)
    expect(seen.has('novel')).toBe(false)
    expect(seen.has('dictionary')).toBe(false)
  })

  it('undo takes drops back: wallet, bookcase and firsts all revert', () => {
    // Undo the 2026-07-03 completion — its magazine and its fungus
    // leave with it, and "magazine" becomes a first again.
    const after = removeLatestOn(history, 'h', '2026-07-03')
    expect(fungusBalanceFrom(after)).toBe(2)
    expect(readingItemsFrom(after)).toEqual([])
    expect(seenDropKeys(after).has('magazine')).toBe(false)
  })

  it('pre-drops history (empty drops lists) contributes nothing', () => {
    const old = [
      completion('p', 'h', '2026-07-10'),
      completion('q', 'h', '2026-07-11'),
    ]
    expect(readingItemsFrom(old)).toEqual([])
    expect(fungusBalanceFrom(old)).toBe(0)
    expect(seenDropKeys(old).size).toBe(0)
  })
})

describe('dropKey', () => {
  it('maps drops to their five reveal families', () => {
    expect(dropKey({ kind: 'flora' })).toBe('flora')
    expect(dropKey({ kind: 'reading', readingType: 'magazine' })).toBe(
      'magazine',
    )
    expect(dropKey({ kind: 'reading', readingType: 'novel' })).toBe('novel')
    expect(dropKey({ kind: 'reading', readingType: 'dictionary' })).toBe(
      'dictionary',
    )
    expect(dropKey({ kind: 'fungi', amount: 2 })).toBe('fungi')
  })
})
