import { describe, expect, it } from 'vitest'
import { fungusBalanceFrom } from './arrivals.js'
import { floraAtStep, floraTargetStep } from './drops.js'
import {
  decideFlora,
  floraFinds,
  floraStatus,
  pruneFloraDecisions,
  validateFloraDecisions,
} from './flora.js'

// A completion with the given drops (defaults to one flora find).
const completion = (
  id,
  drops = [{ kind: 'flora' }],
  dayKey = '2026-07-16',
) => ({
  id,
  habitId: 'walk',
  recordedAt: 1000,
  dayKey,
  drops,
})

describe('flora finds derived from history', () => {
  it('lists every completion that dropped flora, in arrival order, pending by default', () => {
    const completions = [
      completion('c1', [{ kind: 'flora' }], '2026-07-14'),
      completion('c2', []), // no drops — not a find
      completion('c3', [{ kind: 'fungi', amount: 2 }]), // fungi — not a find
      completion('c4', [{ kind: 'flora' }, { kind: 'fungi', amount: 1 }]),
    ]
    expect(floraFinds(completions, {})).toEqual([
      {
        completionId: 'c1',
        habitId: 'walk',
        dayKey: '2026-07-14',
        status: 'pending',
      },
      {
        completionId: 'c4',
        habitId: 'walk',
        dayKey: '2026-07-16',
        status: 'pending',
      },
    ])
  })

  it('reads each find’s status from the decisions map', () => {
    const completions = [completion('c1'), completion('c2'), completion('c3')]
    const decisions = { c1: 'gathered', c2: 'left' }
    const statuses = floraFinds(completions, decisions).map((f) => f.status)
    expect(statuses).toEqual(['gathered', 'left', 'pending'])
    expect(floraStatus(decisions, 'c1')).toBe('gathered')
    expect(floraStatus(decisions, 'c3')).toBe('pending')
  })

  it('ignores decisions whose completion no longer exists (undo took the find with it)', () => {
    // c1 was gathered, then its completion was undone: the find is gone
    // from history, so it is gone from the Abode — decision or not.
    expect(floraFinds([completion('c2')], { c1: 'gathered' })).toEqual([
      {
        completionId: 'c2',
        habitId: 'walk',
        dayKey: '2026-07-16',
        status: 'pending',
      },
    ])
  })
})

describe('deciding: gather, leave, compost', () => {
  const completions = [completion('c1')]

  it('a pending find can be gathered or left', () => {
    expect(decideFlora({}, completions, 'c1', 'gathered')).toEqual({
      c1: 'gathered',
    })
    expect(decideFlora({}, completions, 'c1', 'left')).toEqual({ c1: 'left' })
  })

  it('a gathered find can be composted — and only composted', () => {
    const gathered = { c1: 'gathered' }
    expect(decideFlora(gathered, completions, 'c1', 'composted')).toEqual({
      c1: 'composted',
    })
    expect(() => decideFlora(gathered, completions, 'c1', 'gathered')).toThrow(
      /cannot become/,
    )
    expect(() => decideFlora(gathered, completions, 'c1', 'left')).toThrow(
      /cannot become/,
    )
  })

  it('left and composted are final — the flora is back in the world', () => {
    for (const done of ['left', 'composted']) {
      for (const attempt of ['gathered', 'left', 'composted']) {
        expect(() =>
          decideFlora({ c1: done }, completions, 'c1', attempt),
        ).toThrow(/out of our hands/)
      }
    }
  })

  it('a pending find cannot be composted straight away — composting is for gathered flora', () => {
    expect(() => decideFlora({}, completions, 'c1', 'composted')).toThrow(
      /gathered or left/,
    )
  })

  it('refuses a completion that dropped no flora, and unknown decisions', () => {
    const noFlora = [completion('c9', [{ kind: 'fungi', amount: 1 }])]
    expect(() => decideFlora({}, noFlora, 'c9', 'gathered')).toThrow(
      /No flora find/,
    )
    expect(() => decideFlora({}, completions, 'missing', 'gathered')).toThrow(
      /No flora find/,
    )
    expect(() => decideFlora({}, completions, 'c1', 'eaten')).toThrow(
      /Unknown flora decision/,
    )
  })

  it('returns a new map and leaves the original untouched', () => {
    const before = {}
    const after = decideFlora(before, completions, 'c1', 'gathered')
    expect(before).toEqual({})
    expect(after).not.toBe(before)
  })
})

describe('composting yields nothing, and nothing is ever lost (the T3.3 guarantees)', () => {
  it('composting changes no completion and credits no fungi — the wallet is untouched', () => {
    const completions = [
      completion('c1', [{ kind: 'flora' }]),
      completion('c2', [{ kind: 'fungi', amount: 3 }]),
    ]
    const before = fungusBalanceFrom(completions)
    let decisions = decideFlora({}, completions, 'c1', 'gathered')
    decisions = decideFlora(decisions, completions, 'c1', 'composted')
    // Decisions live in their own map; history — and therefore the
    // wallet, which is derived from it — cannot have moved.
    expect(fungusBalanceFrom(completions)).toBe(before)
    expect(completions[0].drops).toEqual([{ kind: 'flora' }])
  })

  it('composted flora can reappear: finds keep arriving on the window schedule, whatever was decided', () => {
    // The drops engine is a pure function of the world seed — it never
    // even sees the decisions map. So after composting the first find,
    // the next window's find arrives exactly where it always would.
    const seed = 'test-world'
    const firstFind = floraTargetStep(0, seed)
    const secondFind = floraTargetStep(1, seed)
    expect(floraAtStep(firstFind, seed)).toBe(true)
    expect(floraAtStep(secondFind, seed)).toBe(true)

    // And composting erases nothing: the composted find stays in the
    // record (status 'composted'), while the new find lists as its own
    // pending one.
    const completions = [completion('c1'), completion('c2')]
    let decisions = decideFlora({}, completions, 'c1', 'gathered')
    decisions = decideFlora(decisions, completions, 'c1', 'composted')
    expect(floraFinds(completions, decisions).map((f) => f.status)).toEqual([
      'composted',
      'pending',
    ])
  })
})

describe('pruning and validation (storage hygiene)', () => {
  it('pruning drops decisions whose completion is gone, keeps the rest', () => {
    const decisions = { c1: 'gathered', c2: 'composted', gone: 'left' }
    expect(
      pruneFloraDecisions(decisions, [completion('c1'), completion('c2')]),
    ).toEqual({ c1: 'gathered', c2: 'composted' })
  })

  it('accepts a valid map — including orphans, which are a fresh import’s business', () => {
    validateFloraDecisions({})
    validateFloraDecisions({ c1: 'gathered', unknown: 'composted' })
  })

  it('rejects anything that is not a map of known decisions', () => {
    expect(() => validateFloraDecisions(null)).toThrow(/map/)
    expect(() => validateFloraDecisions([])).toThrow(/map/)
    expect(() => validateFloraDecisions({ c1: 'pending' })).toThrow(
      /Unknown flora decision/,
    )
    expect(() => validateFloraDecisions({ c1: 'eaten' })).toThrow(
      /Unknown flora decision/,
    )
    expect(() => validateFloraDecisions({ '': 'gathered' })).toThrow(
      /needs the id/,
    )
  })
})
