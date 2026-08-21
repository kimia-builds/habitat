import { describe, expect, it } from 'vitest'
import { FLORA_FILLS } from './floraFills.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { floraFillKey, floraIdentity } from './floraDeal.js'

// A long run of finds to look at the shape of the deal, rather than one.
const ids = (n) => Array.from({ length: n }, (_, i) => `completion-${i}`)

describe('which flora a find is', () => {
  it('deals the same find the same flora, for ever', () => {
    const once = floraIdentity('c1', 'seed')
    const again = floraIdentity('c1', 'seed')
    expect(again.silhouette.key).toBe(once.silhouette.key)
    expect(again.sizeClass).toBe(once.sizeClass)
    expect(again.fill.id).toBe(once.fill.id)
  })

  it('deals two saves different flora from the same finds', () => {
    const here = ids(200).map((id) => floraFillKey(floraIdentity(id, 'seed-a')))
    const there = ids(200).map((id) =>
      floraFillKey(floraIdentity(id, 'seed-b')),
    )
    const same = here.filter((flora, i) => flora === there[i]).length
    // 24 shape-and-fill pairs, so about 8 of 200 would match by chance.
    expect(same).toBeLessThan(40)
  })

  it('only ever deals one of the four shapes and one of the six fills', () => {
    const shapes = new Set(FLORA_SILHOUETTES.map((s) => s.key))
    const fills = new Set(FLORA_FILLS.map((f) => f.id))
    for (const id of ids(500)) {
      const { silhouette, fill } = floraIdentity(id, 'seed')
      expect(shapes.has(silhouette.key)).toBe(true)
      expect(fills.has(fill.id)).toBe(true)
    }
  })

  // THE LOAD-BEARING TEST. Landmarks are a separate size class whose size is
  // deliberately unset (design-bible §9a), and a find must never be dealt one.
  // If a landmark class is ever added to floraCanon.js, this fails loudly and
  // somebody has to decide — instead of the deal quietly handing out giants.
  it('never deals a find anything but the two collectible sizes', () => {
    const dealt = new Set(
      ids(500).map((id) => floraIdentity(id, 'seed').sizeClass),
    )
    expect([...dealt].sort()).toEqual(['large', 'small'])
  })

  // Kimia's call, 2026-08-21: a find is as likely to be large as small.
  it('deals large and small half and half', () => {
    const large = ids(2000).filter(
      (id) => floraIdentity(id, 'seed').sizeClass === 'large',
    ).length
    expect(large / 2000).toBeGreaterThan(0.45)
    expect(large / 2000).toBeLessThan(0.55)
  })

  it('reaches every one of the 48 — nothing is unreachable', () => {
    const seen = new Set()
    for (const id of ids(3000)) {
      const { silhouette, sizeClass, fill } = floraIdentity(id, 'seed')
      seen.add(`${silhouette.key}|${sizeClass}|${fill.id}`)
    }
    expect(seen.size).toBe(
      FLORA_SILHOUETTES.length * 2 * FLORA_FILLS.length, // 4 x 2 x 6
    )
  })

  // Three separate rolls, not three slices of one number: a shape must not
  // drag a fill along with it.
  it('varies shape, size and fill independently', () => {
    const byShape = new Map()
    for (const id of ids(600)) {
      const { silhouette, fill } = floraIdentity(id, 'seed')
      const fills = byShape.get(silhouette.key) ?? new Set()
      fills.add(fill.id)
      byShape.set(silhouette.key, fills)
    }
    for (const fills of byShape.values()) {
      expect(fills.size).toBe(FLORA_FILLS.length)
    }
  })

  it('refuses to deal without a find and a seed', () => {
    expect(() => floraIdentity('', 'seed')).toThrow()
    expect(() => floraIdentity('c1', '')).toThrow()
    expect(() => floraIdentity('c1', undefined)).toThrow()
  })
})

describe('the catalogue number', () => {
  it('is the shape and the fill, so the same flora shares one', () => {
    const [a, b] = [FLORA_SILHOUETTES[0], FLORA_SILHOUETTES[1]]
    expect(floraFillKey({ silhouette: a, fill: FLORA_FILLS[0] })).toBe(
      floraFillKey({ silhouette: a, fill: FLORA_FILLS[0] }),
    )
    expect(floraFillKey({ silhouette: a, fill: FLORA_FILLS[0] })).not.toBe(
      floraFillKey({ silhouette: b, fill: FLORA_FILLS[0] }),
    )
    expect(floraFillKey({ silhouette: a, fill: FLORA_FILLS[0] })).not.toBe(
      floraFillKey({ silhouette: a, fill: FLORA_FILLS[1] }),
    )
  })
})
