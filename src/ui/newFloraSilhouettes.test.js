import { describe, expect, test } from 'vitest'
import { NEW_FLORA_SILHOUETTES } from './newFloraSilhouettes.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { floraIdentity } from './floraDeal.js'

describe('the twelve new flora silhouettes', () => {
  test('there are twelve, with keys that are unique and clear of the original four', () => {
    expect(NEW_FLORA_SILHOUETTES).toHaveLength(12)
    const keys = NEW_FLORA_SILHOUETTES.map((s) => s.key)
    expect(new Set(keys).size).toBe(12)
    const original = new Set(FLORA_SILHOUETTES.map((s) => s.key))
    for (const key of keys) expect(original.has(key)).toBe(false)
  })

  test('each carries a drawn canvas and a real path, in the original four’s shape', () => {
    for (const s of NEW_FLORA_SILHOUETTES) {
      expect(s.viewBox.w).toBeGreaterThan(0)
      expect(s.viewBox.h).toBeGreaterThan(0)
      expect(typeof s.d).toBe('string')
      expect(s.d.length).toBeGreaterThan(100)
      expect(s.d.startsWith('M')).toBe(true)
    }
  })

  // The twelve are not dealt yet: adding them to the deal would re-roll the
  // shape of every flora already gathered. This pins that until the region
  // logic stores a shape on the drop — if it fails, someone joined the lists
  // and has to decide about existing finds first.
  test('the deal still hands out only the original four shapes', () => {
    const dealt = new Set()
    for (let i = 0; i < 400; i++) {
      dealt.add(floraIdentity(`completion-${i}`, 'seed').silhouette.key)
    }
    const newKeys = new Set(NEW_FLORA_SILHOUETTES.map((s) => s.key))
    for (const key of dealt) expect(newKeys.has(key)).toBe(false)
  })
})
