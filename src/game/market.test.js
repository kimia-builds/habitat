import { describe, expect, it } from 'vitest'
import {
  buyObject,
  catalogObject,
  livedDayCount,
  marketPool,
  ownedTotal,
  rotationIndex,
  sellObject,
  stallObjects,
  validatePurchases,
  walletBalance,
  walletTrueBalance,
} from './market.js'
import {
  MAP_REGION_COUNT,
  MARKET_OBJECTS_PER_REGION,
  MARKET_STALL_SIZE,
} from './constants.js'

// A completion whose tap dropped a cluster of fungi.
const fungiDrop = (id, dayKey, amount = 2) => ({
  id,
  habitId: 'h1',
  recordedAt: 2000,
  dayKey,
  drops: [{ kind: 'fungi', amount }],
})

// A completion that dropped nothing.
const plainTap = (id, dayKey) => ({
  id,
  habitId: 'h1',
  recordedAt: 2000,
  dayKey,
  drops: [],
})

describe('livedDayCount', () => {
  it('counts each day with ≥1 mark ONCE, however many taps it had', () => {
    const completions = [
      plainTap('c1', '2026-07-01'),
      plainTap('c2', '2026-07-01'),
      plainTap('c3', '2026-07-01'),
      plainTap('c4', '2026-07-02'),
    ]
    expect(livedDayCount(completions)).toBe(2)
  })

  it('gap days never advance the clock — only marked days count', () => {
    const completions = [
      plainTap('c1', '2026-07-01'),
      plainTap('c2', '2026-07-05'),
    ]
    expect(livedDayCount(completions)).toBe(2)
  })

  it('a retroactively marked day counts the moment it exists', () => {
    const live = [plainTap('c1', '2026-07-05')]
    // The backfilled mark was RECORDED later (recordedAt 9000) but it
    // belongs to the day it was DONE — and that day becomes lived.
    const backfilled = {
      id: 'c2',
      habitId: 'h1',
      recordedAt: 9000,
      dayKey: '2026-07-01',
      drops: [],
    }
    expect(livedDayCount(live)).toBe(1)
    expect(livedDayCount([...live, backfilled])).toBe(2)
  })
})

describe('rotationIndex', () => {
  it('turns the stall only when a full 28 lived days have passed', () => {
    expect(rotationIndex(0)).toBe(0)
    expect(rotationIndex(27)).toBe(0)
    expect(rotationIndex(28)).toBe(1)
    expect(rotationIndex(55)).toBe(1)
    expect(rotationIndex(56)).toBe(2)
  })

  it('refuses anything but a whole number of days', () => {
    expect(() => rotationIndex(-1)).toThrow(/whole number/)
    expect(() => rotationIndex(2.5)).toThrow(/whole number/)
  })
})

describe('the catalogue', () => {
  it('gives each region one object per placeholder price tier', () => {
    expect(catalogObject(0, 0)).toMatchObject({ key: '0:0', price: 6 })
    expect(catalogObject(0, 1)).toMatchObject({ key: '0:1', price: 12 })
    expect(catalogObject(0, 2)).toMatchObject({ key: '0:2', price: 18 })
  })

  it('refuses objects outside the planet and the region', () => {
    expect(() => catalogObject(-1, 0)).toThrow(/No market object/)
    expect(() => catalogObject(MAP_REGION_COUNT, 0)).toThrow(/No market object/)
    expect(() => catalogObject(0, MARKET_OBJECTS_PER_REGION)).toThrow(
      /No market object/,
    )
  })
})

describe('marketPool', () => {
  it('grows region by region as the Map is discovered', () => {
    expect(marketPool(0)).toEqual([])
    expect(marketPool(1).map((o) => o.key)).toEqual(['0:0', '0:1', '0:2'])
    expect(marketPool(2)).toHaveLength(2 * MARKET_OBJECTS_PER_REGION)
    expect(marketPool(MAP_REGION_COUNT)).toHaveLength(
      MAP_REGION_COUNT * MARKET_OBJECTS_PER_REGION,
    )
  })

  it('refuses an impossible region count', () => {
    expect(() => marketPool(-1)).toThrow(/0–16/)
    expect(() => marketPool(MAP_REGION_COUNT + 1)).toThrow(/0–16/)
  })
})

describe('stallObjects', () => {
  const pool = marketPool(2) // 6 objects: 0:0 0:1 0:2 1:0 1:1 1:2

  it('shows a bare stall when no region is known yet', () => {
    expect(stallObjects([], 0)).toEqual([])
    expect(stallObjects([], 9)).toEqual([])
  })

  it('slides a stall-sized window along the pool each rotation', () => {
    expect(stallObjects(pool, 0).map((o) => o.key)).toEqual([
      '0:0',
      '0:1',
      '0:2',
      '1:0',
    ])
    expect(stallObjects(pool, 1).map((o) => o.key)).toEqual([
      '1:1',
      '1:2',
      '0:0',
      '0:1',
    ])
  })

  it('never shows more than the pool — one region means a stall of three', () => {
    expect(stallObjects(marketPool(1), 0)).toHaveLength(3)
  })

  it('nothing is permanently missable: every object cycles back within ⌈pool/stall⌉ rotations', () => {
    for (const regions of [1, 2, 3, 5, MAP_REGION_COUNT]) {
      const grownPool = marketPool(regions)
      const span = Math.ceil(grownPool.length / MARKET_STALL_SIZE)
      // From ANY starting rotation, one span of rotations shows everything.
      for (const start of [0, 1, 7]) {
        const shown = new Set()
        for (let r = start; r < start + span; r++) {
          for (const object of stallObjects(grownPool, r)) shown.add(object.key)
        }
        expect(shown.size).toBe(grownPool.length)
      }
    }
  })

  it('owned objects stay on the stall — duplicates are allowed', () => {
    // The stall is a pure function of pool + rotation; buying changes
    // neither, so a bought object is right there to be bought again.
    expect(stallObjects(pool, 0).map((o) => o.key)).toContain('0:0')
  })
})

describe('buyObject', () => {
  const object = catalogObject(0, 1) // 12 fungi

  it('adds an owned instance with the price frozen at buy time', () => {
    const bought = buyObject([], object, 20, 5000, 'p1')
    expect(bought).toEqual([
      { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 5000 },
    ])
  })

  it('allows duplicates — two copies are two instances with their own ids', () => {
    let purchases = buyObject([], object, 30, 1, 'p1')
    purchases = buyObject(purchases, object, 30, 2, 'p2')
    expect(purchases).toHaveLength(2)
    expect(purchases.map((p) => p.id)).toEqual(['p1', 'p2'])
    expect(ownedTotal(purchases)).toBe(24)
  })

  it('refuses to overdraw — the wallet can never go below zero', () => {
    expect(() => buyObject([], object, 11, 1, 'p1')).toThrow(/Not enough fungi/)
    expect(() => buyObject([], object, 12, 1, 'p1')).not.toThrow()
  })
})

describe('sellObject', () => {
  it('removes exactly the sold instance, leaving its twin behind', () => {
    const object = catalogObject(0, 1)
    let purchases = buyObject([], object, 30, 1, 'p1')
    purchases = buyObject(purchases, object, 30, 2, 'p2')
    const after = sellObject(purchases, 'p1')
    expect(after.map((p) => p.id)).toEqual(['p2'])
    expect(purchases).toHaveLength(2) // the old list is untouched
  })

  it('fails loudly on a stale sell', () => {
    expect(() => sellObject([], 'ghost')).toThrow(/No owned object/)
  })
})

describe('the wallet', () => {
  const completions = [
    fungiDrop('c1', '2026-07-01', 3),
    plainTap('c2', '2026-07-01'),
    fungiDrop('c3', '2026-07-02', 3),
    fungiDrop('c4', '2026-07-03', 3),
    fungiDrop('c5', '2026-07-04', 3),
  ] // income: 12 fungi

  it('is every fungus ever dropped, minus what the owned objects cost', () => {
    expect(walletBalance(completions, [])).toBe(12)
    const purchases = [
      { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 5000 },
    ]
    expect(walletBalance(completions, purchases)).toBe(0)
    expect(walletTrueBalance(completions, purchases)).toBe(0)
  })

  it('SHOWS nothing below zero — but keeps the debt real under the hood', () => {
    // She bought the 12-fungi object at exactly 12, then undid most of
    // the completions whose fungi paid for it: income 3, owned 12.
    // Kimia's rule (2026-07-20): the meter rests at empty and the
    // object stays hers — yet the debt goes on existing in the maths.
    const spent = completions.slice(0, 2) // 3 fungi of income left
    const purchases = [{ id: 'p1', objectKey: '0:1', price: 12, boughtAt: 5 }]
    expect(walletBalance(spent, purchases)).toBe(0) // the display…
    expect(walletTrueBalance(spent, purchases)).toBe(-9) // …the truth

    // New income settles the debt first: 6 more fungi lift the TRUE
    // balance to −3, and the display still shows empty.
    const richer = [
      ...spent,
      fungiDrop('c6', '2026-07-05', 3),
      fungiDrop('c7', '2026-07-06', 3),
    ]
    expect(walletTrueBalance(richer, purchases)).toBe(-3)
    expect(walletBalance(richer, purchases)).toBe(0)
  })

  it('a sale settles the debt first — and still refunds EXACTLY the price', () => {
    // Income 3, owned 12 (true −9): selling the object adds its full
    // 12 to the true balance — most of it quietly paying the debt —
    // so the display climbs from empty to 3, not to 12.
    const spent = completions.slice(0, 2)
    const purchases = [{ id: 'p1', objectKey: '0:1', price: 12, boughtAt: 5 }]
    const sold = sellObject(purchases, 'p1')
    expect(walletTrueBalance(spent, sold)).toBe(3) // −9 + 12 exactly
    expect(walletBalance(spent, sold)).toBe(3)
  })

  it('a deeper debt can swallow a whole refund at empty', () => {
    // Income 12, owned 18 across two objects (true −6). Selling the
    // 6-fungi one repays the debt exactly: the display never leaves
    // empty. Selling the other then shows the full 12.
    const purchases = [
      { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 1 },
      { id: 'p2', objectKey: '0:0', price: 6, boughtAt: 2 },
    ]
    expect(walletBalance(completions, purchases)).toBe(0)
    const afterSmallSale = sellObject(purchases, 'p2')
    expect(walletTrueBalance(completions, afterSmallSale)).toBe(0)
    expect(walletBalance(completions, afterSmallSale)).toBe(0)
    expect(walletBalance(completions, sellObject(afterSmallSale, 'p1'))).toBe(
      12,
    )
  })

  it('a buy → sell round trip is always fungus-neutral', () => {
    const before = walletBalance(completions, [])
    const bought = buyObject([], catalogObject(0, 1), before, 1, 'p1')
    expect(walletBalance(completions, bought)).toBe(before - 12)
    const sold = sellObject(bought, 'p1')
    expect(walletBalance(completions, sold)).toBe(before)
  })

  it('buying the SAME object twice and selling one copy back is neutral too', () => {
    const before = walletBalance(completions, [])
    let purchases = buyObject([], catalogObject(0, 0), before, 1, 'p1')
    purchases = buyObject(purchases, catalogObject(0, 0), before, 2, 'p2')
    expect(walletBalance(completions, purchases)).toBe(before - 12)
    expect(walletBalance(completions, sellObject(purchases, 'p1'))).toBe(
      before - 6,
    )
  })
})

describe('validatePurchases', () => {
  it('accepts a list of well-formed owned instances', () => {
    expect(() =>
      validatePurchases([
        { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 5000 },
        { id: 'p2', objectKey: '15:2', price: 18, boughtAt: 6000 },
      ]),
    ).not.toThrow()
    expect(() => validatePurchases([])).not.toThrow()
  })

  it('rejects anything malformed', () => {
    expect(() => validatePurchases({})).toThrow(/list/)
    expect(() =>
      validatePurchases([
        { id: 'p1', objectKey: 'soon', price: 12, boughtAt: 1 },
      ]),
    ).toThrow(/object key/)
    expect(() =>
      validatePurchases([
        { id: 'p1', objectKey: '0:1', price: 0, boughtAt: 1 },
      ]),
    ).toThrow(/positive whole/)
    expect(() =>
      validatePurchases([{ id: 'p1', objectKey: '0:1', price: 12 }]),
    ).toThrow(/moment/)
    expect(() =>
      validatePurchases([
        { id: 'p1', objectKey: '0:1', price: 12, boughtAt: 1 },
        { id: 'p1', objectKey: '0:2', price: 18, boughtAt: 2 },
      ]),
    ).toThrow(/share an id/)
  })
})
