import { describe, expect, it } from 'vitest'
import {
  EXPEDITION_STEPS_PER_COMPLETION,
  LITERACY_MILESTONES,
  LITERACY_POINTS,
} from './constants.js'
import {
  recordCompletion,
  recordRetroCompletion,
  removeLatestOn,
} from './completions.js'
import {
  creditFungi,
  expeditionSteps,
  literacyPoints,
  milestonesReached,
  refundFungi,
  spendFungi,
  validateReadingItem,
} from './meters.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3

// Shorthand: one live completion of the given habit at the given time.
let nextId = 0
const done = (habitId, y, month, d, h, min = 0) =>
  recordCompletion(habitId, CUTOFF, at(y, month, d, h, min), `c${nextId++}`)

describe('expeditionSteps', () => {
  it('an empty history means an untouched meter', () => {
    expect(expeditionSteps([])).toBe(0)
  })

  it('every completion advances the meter by the same fixed amount', () => {
    const completions = [
      done('easy-habit', 2026, 7, 13, 9),
      done('medium-habit', 2026, 7, 13, 12),
      done('difficult-habit', 2026, 7, 13, 20),
    ]
    // 1:1:1 (decision 2026-07-15): difficulty never changes the step.
    expect(expeditionSteps(completions)).toBe(
      3 * EXPEDITION_STEPS_PER_COMPLETION,
    )
  })

  it('extras beyond an N-per-day target still count — every tap is a step', () => {
    // Water 3× a day, tapped 5 times: all 5 advance the meter.
    const completions = [12, 13, 15, 18, 21].map((h) =>
      done('water', 2026, 7, 13, h),
    )
    expect(expeditionSteps(completions)).toBe(
      5 * EXPEDITION_STEPS_PER_COMPLETION,
    )
  })

  it('retroactive check-in marks count exactly like live ones', () => {
    // Monday morning marking Sunday (the T1.4 check-in).
    const retro = recordRetroCompletion(
      'h1',
      '2026-07-12',
      CUTOFF,
      at(2026, 7, 13, 9),
      'retro1',
    )
    const live = done('h1', 2026, 7, 13, 9)
    expect(expeditionSteps([retro, live])).toBe(
      2 * EXPEDITION_STEPS_PER_COMPLETION,
    )
  })

  it('undoing a completion reverses the meter exactly', () => {
    // Decision 2026-07-15: the meter always equals real history, so a
    // mis-tap undone leaves no trace.
    const completions = [
      done('h1', 2026, 7, 13, 9),
      done('h1', 2026, 7, 13, 10),
    ]
    const before = expeditionSteps(completions)
    const after = expeditionSteps(removeLatestOn(completions, 'h1', '2026-07-13'))
    expect(before - after).toBe(EXPEDITION_STEPS_PER_COMPLETION)
  })
})

describe('literacyPoints', () => {
  it('an empty bookcase means zero literacy', () => {
    expect(literacyPoints([])).toBe(0)
  })

  it('scores each piece by its rarity and adds them up', () => {
    const items = [
      { type: 'magazine' },
      { type: 'magazine' },
      { type: 'novel' },
      { type: 'dictionary' },
    ]
    expect(literacyPoints(items)).toBe(
      2 * LITERACY_POINTS.magazine +
        LITERACY_POINTS.novel +
        LITERACY_POINTS.dictionary,
    )
  })

  it('rarer reading is worth more: dictionary > novel > magazine', () => {
    expect(LITERACY_POINTS.dictionary).toBeGreaterThan(LITERACY_POINTS.novel)
    expect(LITERACY_POINTS.novel).toBeGreaterThan(LITERACY_POINTS.magazine)
  })

  it('an unknown reading type fails loudly, never scores silently', () => {
    expect(() => literacyPoints([{ type: 'pamphlet' }])).toThrow(/pamphlet/)
    expect(() => validateReadingItem(null)).toThrow()
    expect(() => validateReadingItem('magazine')).toThrow()
  })
})

describe('milestonesReached', () => {
  it('the milestone ladder is 10 strictly climbing thresholds', () => {
    expect(LITERACY_MILESTONES).toHaveLength(10)
    for (let i = 1; i < LITERACY_MILESTONES.length; i++) {
      expect(LITERACY_MILESTONES[i]).toBeGreaterThan(LITERACY_MILESTONES[i - 1])
    }
  })

  it('no points, no doors open yet', () => {
    expect(milestonesReached(0)).toBe(0)
  })

  it('landing exactly on a threshold reaches it', () => {
    expect(milestonesReached(LITERACY_MILESTONES[0])).toBe(1)
    expect(milestonesReached(LITERACY_MILESTONES[0] - 1)).toBe(0)
    expect(milestonesReached(LITERACY_MILESTONES[4])).toBe(5)
  })

  it('past the top of the ladder, all 10 doors are open', () => {
    expect(milestonesReached(LITERACY_MILESTONES[9])).toBe(10)
    expect(milestonesReached(1_000_000)).toBe(10)
  })
})

describe('fungus wallet', () => {
  it('a fungus drop pays in', () => {
    expect(creditFungi(0, 3)).toBe(3)
    expect(creditFungi(3, 2)).toBe(5)
  })

  it('a purchase pays out, down to exactly zero', () => {
    expect(spendFungi(10, 4)).toBe(6)
    expect(spendFungi(10, 10)).toBe(0)
  })

  it('the wallet can never go negative — overspending is refused', () => {
    expect(() => spendFungi(3, 4)).toThrow(/Not enough fungi/)
    expect(() => spendFungi(0, 1)).toThrow(/Not enough fungi/)
  })

  it('buy then return is always fungus-neutral (symmetric prices)', () => {
    // Spec §5: no penalty, no spread, ever — any price, any balance.
    for (const [balance, price] of [
      [10, 10],
      [10, 1],
      [999, 250],
    ]) {
      expect(refundFungi(spendFungi(balance, price), price)).toBe(balance)
    }
  })

  it('fungi are whole mushrooms — fractions, zero and negatives are refused', () => {
    expect(() => creditFungi(5, 0)).toThrow()
    expect(() => creditFungi(5, -2)).toThrow()
    expect(() => creditFungi(5, 1.5)).toThrow()
    expect(() => spendFungi(5, 0)).toThrow()
    expect(() => refundFungi(5, -1)).toThrow()
    expect(() => creditFungi(-1, 2)).toThrow()
    expect(() => spendFungi(2.5, 1)).toThrow()
  })
})
