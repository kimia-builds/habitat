import { describe, expect, test } from 'vitest'
import { KEEPSAKE_SHAPES } from './keepsakeShapes.js'

describe('the sixteen keepsake shapes', () => {
  test('there are sixteen: one per region, one per flora, one per flora shape', () => {
    expect(KEEPSAKE_SHAPES).toHaveLength(16)
    expect(new Set(KEEPSAKE_SHAPES.map((k) => k.region)).size).toBe(16)
    expect(new Set(KEEPSAKE_SHAPES.map((k) => k.flora)).size).toBe(16)
    const shapes = KEEPSAKE_SHAPES.map((k) => k.shape).sort((a, b) => a - b)
    expect(shapes).toEqual(Array.from({ length: 16 }, (_, i) => i + 1))
  })

  test('each carries a drawn canvas and a real path, in the flora files’ shape', () => {
    for (const k of KEEPSAKE_SHAPES) {
      expect(k.viewBox.w).toBeGreaterThan(0)
      expect(k.viewBox.h).toBeGreaterThan(0)
      expect(typeof k.d).toBe('string')
      expect(k.d.length).toBeGreaterThan(100)
      expect(k.d.startsWith('M')).toBe(true)
    }
  })
})
