import { describe, expect, it } from 'vitest'
import {
  abodeItems,
  defaultSpot,
  GROUND_LINES,
  placeFlora,
  placeObject,
  pruneAbodeLayout,
  SPOTS_PER_ROW,
  validateAbodeLayout,
} from './abode.js'

// A completion whose tap dropped one flora find.
const floraDrop = (id, dayKey = '2026-07-16') => ({
  id,
  habitId: 'h1',
  recordedAt: 2000,
  dayKey,
  drops: [{ kind: 'flora' }],
})

// A completion that dropped nothing — a find can never point at it.
const plainTap = (id) => ({
  id,
  habitId: 'h1',
  recordedAt: 2000,
  dayKey: '2026-07-16',
  drops: [],
})

describe('defaultSpot', () => {
  it('fills the front ground line first, then the next back — deterministic', () => {
    expect(defaultSpot(0)).toEqual({
      x: 0.5 / SPOTS_PER_ROW,
      y: GROUND_LINES[0],
    })
    expect(defaultSpot(SPOTS_PER_ROW - 1).y).toBe(GROUND_LINES[0])
    expect(defaultSpot(SPOTS_PER_ROW).y).toBe(GROUND_LINES[1])
    expect(defaultSpot(2 * SPOTS_PER_ROW).y).toBe(GROUND_LINES[2])
  })

  it('wraps back to the first spot when the ground lines are full, nudged right', () => {
    const capacity = GROUND_LINES.length * SPOTS_PER_ROW
    const wrapped = defaultSpot(capacity)
    expect(wrapped.y).toBe(GROUND_LINES[0])
    expect(wrapped.x).toBeGreaterThan(defaultSpot(0).x)
  })

  it('refuses anything but a whole-number index', () => {
    expect(() => defaultSpot(-1)).toThrow(/whole-number/)
    expect(() => defaultSpot(1.5)).toThrow(/whole-number/)
  })
})

describe('abodeItems', () => {
  it('shows ONLY gathered flora — pending, left and composted stay off the ground', () => {
    const completions = [
      floraDrop('c1'),
      floraDrop('c2'),
      floraDrop('c3'),
      floraDrop('c4'),
    ]
    const decisions = { c1: 'gathered', c2: 'left', c3: 'composted' }
    const items = abodeItems(completions, decisions, {})
    expect(items.map((i) => i.completionId)).toEqual(['c1'])
  })

  it('resolves each flora to its stored place, or its default spot', () => {
    const completions = [floraDrop('c1'), floraDrop('c2')]
    const decisions = { c1: 'gathered', c2: 'gathered' }
    const layout = { c2: { x: 0.9, y: 0.2 } }
    const [first, second] = abodeItems(completions, decisions, layout)
    expect(first).toMatchObject(defaultSpot(0))
    expect(second).toMatchObject({ x: 0.9, y: 0.2 })
  })

  it('ignores layout entries whose flora is gone or no longer gathered', () => {
    const completions = [floraDrop('c1')]
    const decisions = { c1: 'gathered' }
    const layout = { ghost: { x: 0.5, y: 0.5 }, c1: { x: 0.1, y: 0.9 } }
    const items = abodeItems(completions, decisions, layout)
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ completionId: 'c1', x: 0.1, y: 0.9 })
  })

  it('composting an earlier find lets later un-moved flora step forward a spot', () => {
    const completions = [floraDrop('c1'), floraDrop('c2')]
    const both = { c1: 'gathered', c2: 'gathered' }
    const afterCompost = { c1: 'composted', c2: 'gathered' }
    expect(abodeItems(completions, both, {})[1]).toMatchObject(defaultSpot(1))
    expect(abodeItems(completions, afterCompost, {})[0]).toMatchObject(
      defaultSpot(0),
    )
  })
})

describe('placeFlora', () => {
  const completions = [floraDrop('c1')]
  const decisions = { c1: 'gathered' }

  it('records the place, clamped into the scene, and returns a NEW map', () => {
    const layout = {}
    const placed = placeFlora(layout, completions, decisions, 'c1', {
      x: 1.4,
      y: -0.2,
    })
    expect(placed).toEqual({ c1: { x: 1, y: 0 } })
    expect(layout).toEqual({})
  })

  it('refuses a flora that is not gathered on the ground', () => {
    expect(() =>
      placeFlora({}, completions, {}, 'c1', { x: 0.5, y: 0.5 }),
    ).toThrow(/gathered/)
    expect(() =>
      placeFlora({}, completions, { c1: 'composted' }, 'c1', {
        x: 0.5,
        y: 0.5,
      }),
    ).toThrow(/gathered/)
    expect(() =>
      placeFlora({}, [plainTap('c9')], {}, 'c9', { x: 0.5, y: 0.5 }),
    ).toThrow(/gathered/)
  })

  it('refuses a place without finite fractions', () => {
    expect(() =>
      placeFlora({}, completions, decisions, 'c1', { x: NaN, y: 0.5 }),
    ).toThrow(/finite/)
    expect(() => placeFlora({}, completions, decisions, 'c1', null)).toThrow(
      /finite/,
    )
  })
})

describe('pruneAbodeLayout', () => {
  it('keeps only places whose flora is still gathered', () => {
    const completions = [floraDrop('c1'), floraDrop('c2')]
    const decisions = { c1: 'gathered', c2: 'composted' }
    const layout = {
      c1: { x: 0.1, y: 0.9 },
      c2: { x: 0.2, y: 0.9 },
      undone: { x: 0.3, y: 0.9 },
    }
    expect(pruneAbodeLayout(layout, completions, decisions)).toEqual({
      c1: { x: 0.1, y: 0.9 },
    })
  })
})

describe('validateAbodeLayout', () => {
  it('accepts a map of complete, in-bounds places', () => {
    expect(() =>
      validateAbodeLayout({ c1: { x: 0, y: 1 }, c2: { x: 0.5, y: 0.42 } }),
    ).not.toThrow()
    expect(() => validateAbodeLayout({})).not.toThrow()
  })

  it('rejects anything else', () => {
    expect(() => validateAbodeLayout([])).toThrow(/map/)
    expect(() => validateAbodeLayout(null)).toThrow(/map/)
    expect(() => validateAbodeLayout({ '': { x: 0.5, y: 0.5 } })).toThrow(
      /id of its flora/,
    )
    expect(() => validateAbodeLayout({ c1: { x: 2, y: 0.5 } })).toThrow(
      /between 0 and 1/,
    )
    expect(() => validateAbodeLayout({ c1: { x: 0.5 } })).toThrow(
      /between 0 and 1/,
    )
    expect(() => validateAbodeLayout({ c1: null })).toThrow(/object/)
  })
})

// ── T4.3b: owned market objects share the ground ────────────────────

const purchase = (id, objectKey = '0:1', price = 12, boughtAt = 5000) => ({
  id,
  objectKey,
  price,
  boughtAt,
})

describe('abodeItems with owned objects', () => {
  it('stands owned objects on the ground after the flora, each with its kind and id', () => {
    const completions = [floraDrop('c1')]
    const decisions = { c1: 'gathered' }
    const purchases = [purchase('p1'), purchase('p2', '0:2', 18, 6000)]
    const items = abodeItems(completions, decisions, {}, purchases)
    expect(items.map((i) => [i.kind, i.id])).toEqual([
      ['flora', 'c1'],
      ['object', 'p1'],
      ['object', 'p2'],
    ])
    // Default spots fill across the combined list, flora first.
    expect(items[0]).toMatchObject(defaultSpot(0))
    expect(items[1]).toMatchObject(defaultSpot(1))
    expect(items[2]).toMatchObject({ objectKey: '0:2', price: 18 })
  })

  it('resolves an object to its stored place, keyed by its purchase id', () => {
    const purchases = [purchase('p1')]
    const layout = { p1: { x: 0.3, y: 0.15 } }
    const [item] = abodeItems([], {}, layout, purchases)
    expect(item).toMatchObject({ id: 'p1', kind: 'object', x: 0.3, y: 0.15 })
  })

  it('a flora leaving lets an un-moved object step forward a spot', () => {
    const completions = [floraDrop('c1')]
    const purchases = [purchase('p1')]
    const both = abodeItems(completions, { c1: 'gathered' }, {}, purchases)
    expect(both[1]).toMatchObject({ id: 'p1', ...defaultSpot(1) })
    const floraGone = abodeItems(
      completions,
      { c1: 'composted' },
      {},
      purchases,
    )
    expect(floraGone[0]).toMatchObject({ id: 'p1', ...defaultSpot(0) })
  })
})

describe('placeObject', () => {
  it('records the place, clamped into the scene, and returns a NEW map', () => {
    const layout = {}
    const placed = placeObject(layout, [purchase('p1')], 'p1', {
      x: 1.4,
      y: -0.2,
    })
    expect(placed).toEqual({ p1: { x: 1, y: 0 } })
    expect(layout).toEqual({})
  })

  it('refuses an object that is not owned — a stale drag fails loudly', () => {
    expect(() =>
      placeObject({}, [purchase('p1')], 'ghost', { x: 0.5, y: 0.5 }),
    ).toThrow(/No owned object/)
    expect(() =>
      placeObject({}, [purchase('p1')], 'p1', { x: NaN, y: 0.5 }),
    ).toThrow(/finite/)
  })
})

describe('pruneAbodeLayout with owned objects', () => {
  it('keeps gathered flora AND owned objects, drops everything gone', () => {
    const completions = [floraDrop('c1')]
    const decisions = { c1: 'gathered' }
    const purchases = [purchase('p1')]
    const layout = {
      c1: { x: 0.1, y: 0.9 },
      p1: { x: 0.2, y: 0.8 },
      sold: { x: 0.3, y: 0.7 },
      composted: { x: 0.4, y: 0.6 },
    }
    expect(pruneAbodeLayout(layout, completions, decisions, purchases)).toEqual(
      {
        c1: { x: 0.1, y: 0.9 },
        p1: { x: 0.2, y: 0.8 },
      },
    )
  })
})
