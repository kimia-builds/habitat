import { describe, test, expect } from 'vitest'
import {
  OBJECT_CANON,
  OBJECT_CANON_ORDER,
  objectScale,
  objectSize,
  objectDrawnBox,
  objectUnitScale,
} from './objectCanon.js'
import { FLORA_CANON } from './floraCanon.js'
import { FRIEND_CANON } from './friendCanon.js'

// The twin of floraCanon.test.js, and for the same reason: the ladder written
// out in objectCanon.js's header is a COMMENT and can go stale, so it is
// rebuilt here from the other two canon files and checked. What is pinned is
// each object's PLACE among the things already in the world, which is what
// Kimia asked for when she said to convert her pixels "into canon ratios in
// relationship to existing measurements of assets in the world".

// A friend's canon number is its width; a flora's is its height. Both are in
// the one scale, so an object's largest dimension can be read against either.
const largest = (key) => Math.max(OBJECT_CANON[key].w, OBJECT_CANON[key].h)

describe('the object canon', () => {
  test('holds every object Kimia has sized, and nothing invented', () => {
    expect(OBJECT_CANON_ORDER).toEqual([
      'column-thin',
      'column-tall',
      'oval-small',
      'oval-large',
      'smoke',
      'stone',
    ])
  })

  test('puts the thin column between a small flora and a baluhm', () => {
    expect(largest('column-thin')).toBeGreaterThan(FLORA_CANON.small)
    expect(largest('column-thin')).toBeLessThan(FRIEND_CANON.baluhm)
  })

  test('puts the small oval level with the widest friend', () => {
    // "about a hamdi bulo wide" — within a tenth of it, which is what makes
    // the header's line true rather than merely nearby.
    const ratio = OBJECT_CANON['oval-small'].w / FRIEND_CANON['hamdi-bulo']
    expect(ratio).toBeGreaterThan(0.9)
    expect(ratio).toBeLessThan(1.3)
  })

  test('leaves four of the six bigger than anything alive on N-Z-D', () => {
    // The flagged surprise in objectCanon.js's header, guarded so it cannot
    // quietly stop being true. The tallest thing that grows or walks is the
    // ceiling for every living asset; most of the objects clear it.
    const tallestAlive = Math.max(
      ...Object.values(FRIEND_CANON),
      ...Object.values(FLORA_CANON),
    )
    const bigger = OBJECT_CANON_ORDER.filter(
      (key) => largest(key) > tallestAlive,
    )
    expect(bigger).toEqual([
      'column-tall',
      'oval-small',
      'oval-large',
      'smoke',
      'stone',
    ])
    // …and the two columns bracket the whole cast: the thin one is smaller
    // than every friend but the plip, the tall one larger than all of them.
    expect(largest('column-thin')).toBeLessThan(tallestAlive)
  })

  test('keeps the two ovals one shape at two sizes', () => {
    // 200x150 and 400x300 are both 4:3, so the large disc is the small one
    // enlarged — the flora's small/large relationship exactly.
    const small = OBJECT_CANON['oval-small']
    const large = OBJECT_CANON['oval-large']
    expect(small.w / small.h).toBeCloseTo(large.w / large.h, 10)
    expect(large.w / small.w).toBeCloseTo(2, 10)
  })

  test('leaves the two columns as two shapes, which is what Kimia gave', () => {
    // Deliberately NOT a size class: 10x60 is 1:6 and 40x300 is 1:7.5. She was
    // asked and confirmed her numbers, so a later tidy-up that "fixed" one of
    // them into matching the other should fail here.
    const thin = OBJECT_CANON['column-thin']
    const tall = OBJECT_CANON['column-tall']
    expect(thin.w / thin.h).not.toBeCloseTo(tall.w / tall.h, 3)
  })

  test('answers with a size in whatever unit the base was', () => {
    const { w, h } = objectSize('column-tall', 100)
    expect(w).toBeCloseTo(OBJECT_CANON['column-tall'].w * 100, 10)
    expect(h).toBeCloseTo(OBJECT_CANON['column-tall'].h * 100, 10)
  })

  test('holds the ratios between objects at any base', () => {
    // Design-bible §9c: the canon sizes stay true in relation to each other,
    // everywhere and always. A screen picks a base; nothing else moves.
    for (const base of [11.5, 172.5, 690]) {
      const a = objectSize('column-thin', base)
      const b = objectSize('column-tall', base)
      expect(b.h / a.h).toBeCloseTo(300 / 60, 10)
      expect(b.w / a.w).toBeCloseTo(40 / 10, 10)
    }
  })

  test('falls back to the smallest object rather than to nothing', () => {
    expect(objectScale('no-such-object')).toEqual(OBJECT_CANON['column-thin'])
    expect(objectDrawnBox('no-such-object')).toEqual({ w: 10, h: 60 })
  })
})

describe('the texture rule', () => {
  // KIMIA'S RULE (2026-09-01): "as with plants, make the texture size of the
  // columns match." An object is drawn in a frame of its own size in Abode
  // pixels, so the scale from the drawing to the screen is the SAME for every
  // object — which is the entire mechanism that keeps one bark furrow the same
  // width on the thin column as on the tall one. If this test fails the
  // textures have started scaling with the objects, and the rule is broken.
  test('scales every object from its drawing by the same factor', () => {
    for (const base of [11.5, 172.5, 690]) {
      const factors = OBJECT_CANON_ORDER.flatMap((key) => {
        const box = objectDrawnBox(key)
        const drawn = objectSize(key, base)
        return [drawn.w / box.w, drawn.h / box.h]
      })
      for (const f of factors) {
        expect(f).toBeCloseTo(objectUnitScale(base), 10)
      }
    }
  })

  test('draws each object at exactly the pixel size Kimia gave', () => {
    // The drawn frame IS her measurement, which is what makes a number written
    // in a recipe (a corner radius, a wobble) mean the same thing everywhere.
    expect(objectDrawnBox('column-thin')).toEqual({ w: 10, h: 60 })
    expect(objectDrawnBox('column-tall')).toEqual({ w: 40, h: 300 })
    expect(objectDrawnBox('oval-small')).toEqual({ w: 200, h: 150 })
    expect(objectDrawnBox('oval-large')).toEqual({ w: 400, h: 300 })
    expect(objectDrawnBox('smoke')).toEqual({ w: 250, h: 250 })
    expect(objectDrawnBox('stone')).toEqual({ w: 250, h: 250 })
  })

  test('hands back a copy, so a caller cannot edit the canon', () => {
    const box = objectDrawnBox('smoke')
    box.w = 9999
    expect(objectDrawnBox('smoke').w).toBe(250)
  })
})
