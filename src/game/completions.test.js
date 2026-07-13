import { describe, expect, it } from 'vitest'
import {
  countFor,
  countOn,
  recordCompletion,
  recordRetroCompletion,
  removeCompletionsFor,
  removeLatestOn,
  validateCompletion,
} from './completions.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3

describe('live completions — attributed by clock + cutoff', () => {
  it('a tap at 9am counts for today', () => {
    const c = recordCompletion('h1', CUTOFF, at(2026, 7, 13, 9, 0), 'c1')
    expect(c.dayKey).toBe('2026-07-13')
    expect(c.recordedAt).toBe(at(2026, 7, 13, 9, 0))
  })

  it('a tap at 1am counts for the evening before', () => {
    const c = recordCompletion('h1', CUTOFF, at(2026, 7, 13, 1, 0), 'c1')
    expect(c.dayKey).toBe('2026-07-12')
    // The entry moment is still recorded truthfully.
    expect(c.recordedAt).toBe(at(2026, 7, 13, 1, 0))
  })
})

describe('cutoff changes never rewrite history (Kimia, 2026-07-13)', () => {
  it('a completion keeps the day it was given, even under a new cutoff', () => {
    // Recorded at 4am under the 3am cutoff: attributed to the 13th.
    const before = recordCompletion('h1', 3, at(2026, 7, 13, 4, 0), 'c1')
    expect(before.dayKey).toBe('2026-07-13')

    // The user changes her cutoff to 5am. The old record is plain data —
    // nothing recomputes it, so it still says the 13th …
    expect(before.dayKey).toBe('2026-07-13')

    // … while a NEW 4am completion under the 5am cutoff lands on the 13th
    // (i.e. the previous evening of the 14th). Forward-only.
    const after = recordCompletion('h1', 5, at(2026, 7, 14, 4, 0), 'c2')
    expect(after.dayKey).toBe('2026-07-13')
  })
})

describe('retroactive completions — the check-in rule (spec §4.2)', () => {
  it('a Monday-morning mark for Sunday says Sunday, not Monday', () => {
    const mondayMorning = at(2026, 7, 13, 9, 30)
    const c = recordRetroCompletion(
      'h1',
      '2026-07-12',
      CUTOFF,
      mondayMorning,
      'c1',
    )
    expect(c.dayKey).toBe('2026-07-12') // done Sunday
    expect(c.recordedAt).toBe(mondayMorning) // entered Monday
  })

  it('can reach further back than yesterday (multi-day gaps)', () => {
    const c = recordRetroCompletion(
      'h1',
      '2026-07-09',
      CUTOFF,
      at(2026, 7, 13, 9, 0),
      'c1',
    )
    expect(c.dayKey).toBe('2026-07-09')
  })

  it('refuses today and the future — today is recorded normally', () => {
    const mondayMorning = at(2026, 7, 13, 9, 0)
    expect(() =>
      recordRetroCompletion('h1', '2026-07-13', CUTOFF, mondayMorning),
    ).toThrow(/before today/)
    expect(() =>
      recordRetroCompletion('h1', '2026-07-14', CUTOFF, mondayMorning),
    ).toThrow(/before today/)
  })

  it('at 1am, "today" itself is still yesterday — so marking two days ago works, yesterday does not', () => {
    // 1am on the 13th: the current Habitat day is the 12th. A retro mark
    // for the 11th is fine; the 12th must be recorded normally instead.
    const oneAm = at(2026, 7, 13, 1, 0)
    const c = recordRetroCompletion('h1', '2026-07-11', CUTOFF, oneAm, 'c1')
    expect(c.dayKey).toBe('2026-07-11')
    expect(() =>
      recordRetroCompletion('h1', '2026-07-12', CUTOFF, oneAm),
    ).toThrow(/before today/)
  })

  it('rejects nonsense day keys', () => {
    expect(() =>
      recordRetroCompletion('h1', '2026-02-31', CUTOFF, at(2026, 7, 13, 9, 0)),
    ).toThrow(/not a real date/)
  })
})

describe('validation and counting', () => {
  it('validateCompletion rejects malformed records', () => {
    const good = recordCompletion('h1', CUTOFF, at(2026, 7, 13, 9, 0), 'c1')
    expect(() => validateCompletion(good)).not.toThrow()
    expect(() => validateCompletion(null)).toThrow()
    expect(() => validateCompletion({ ...good, id: '' })).toThrow()
    expect(() => validateCompletion({ ...good, habitId: 7 })).toThrow()
    expect(() => validateCompletion({ ...good, recordedAt: 'noon' })).toThrow()
    expect(() => validateCompletion({ ...good, dayKey: 'someday' })).toThrow()
  })

  it('countFor counts a habit’s completions across all days', () => {
    const completions = [
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 9, 0), 'a'),
      recordCompletion('water', CUTOFF, at(2026, 7, 12, 9, 0), 'b'),
      recordCompletion('walk', CUTOFF, at(2026, 7, 13, 9, 0), 'c'),
    ]
    expect(countFor(completions, 'water')).toBe(2)
    expect(countFor(completions, 'walk')).toBe(1)
    expect(countFor(completions, 'yoga')).toBe(0)
  })

  it('removeLatestOn undoes the most recently entered mark, only that one', () => {
    const completions = [
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 9, 0), 'a'),
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 14, 0), 'b'), // latest
      recordCompletion('water', CUTOFF, at(2026, 7, 12, 20, 0), 'c'), // other day
      recordCompletion('walk', CUTOFF, at(2026, 7, 13, 15, 0), 'd'), // other habit
    ]
    const after = removeLatestOn(completions, 'water', '2026-07-13')
    expect(after.map((c) => c.id)).toEqual(['a', 'c', 'd'])
    // The original list is untouched (pure function).
    expect(completions).toHaveLength(4)
  })

  it('removeLatestOn undoes one mark at a time', () => {
    const completions = [
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 9, 0), 'a'),
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 14, 0), 'b'),
    ]
    const once = removeLatestOn(completions, 'water', '2026-07-13')
    expect(countOn(once, 'water', '2026-07-13')).toBe(1)
    const twice = removeLatestOn(once, 'water', '2026-07-13')
    expect(countOn(twice, 'water', '2026-07-13')).toBe(0)
  })

  it('removeLatestOn refuses when there is nothing to undo', () => {
    expect(() => removeLatestOn([], 'water', '2026-07-13')).toThrow(
      /nothing to undo/i,
    )
  })

  it('removeCompletionsFor erases exactly one habit’s history', () => {
    const completions = [
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 9, 0), 'a'),
      recordCompletion('walk', CUTOFF, at(2026, 7, 13, 10, 0), 'b'),
      recordCompletion('water', CUTOFF, at(2026, 7, 12, 9, 0), 'c'),
    ]
    const after = removeCompletionsFor(completions, 'water')
    expect(after.map((c) => c.id)).toEqual(['b'])
  })

  it('countOn counts only the right habit on the right day', () => {
    const completions = [
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 9, 0), 'a'),
      recordCompletion('water', CUTOFF, at(2026, 7, 13, 14, 0), 'b'),
      recordCompletion('water', CUTOFF, at(2026, 7, 12, 9, 0), 'c'), // other day
      recordCompletion('walk', CUTOFF, at(2026, 7, 13, 9, 0), 'd'), // other habit
    ]
    expect(countOn(completions, 'water', '2026-07-13')).toBe(2)
    expect(countOn(completions, 'water', '2026-07-12')).toBe(1)
    expect(countOn(completions, 'walk', '2026-07-13')).toBe(1)
    expect(countOn(completions, 'walk', '2026-07-11')).toBe(0)
  })
})
