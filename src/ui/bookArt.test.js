import { describe, expect, it } from 'vitest'
import { BOOK_SHADES, bookArt, bookLook } from './bookArt.js'

describe('the book art (T5.3n, 2026-10-11)', () => {
  it('gives every type five distinct shades', () => {
    for (const shades of Object.values(BOOK_SHADES)) {
      expect(shades).toHaveLength(5)
      expect(new Set(shades).size).toBe(5)
    }
  })

  it('a book wears the same shade and wobble every time, picked from its id', () => {
    expect(bookLook('c1:0')).toEqual(bookLook('c1:0'))
    const ids = Array.from({ length: 200 }, (_, i) => `c${i}:0`)
    const shades = new Set(ids.map((id) => bookLook(id).shade))
    // Every shade gets used across a real-sized shelf, and nothing else.
    expect([...shades].sort()).toEqual([0, 1, 2, 3, 4])
    for (const id of ids) expect(bookLook(id).seed).toBeGreaterThan(0)
  })

  it('draws beads on both views, and the same look draws the same shapes', () => {
    const look = { type: 'novel', width: 28.8, height: 115.2, ...bookLook('x') }
    const spine = bookArt({ ...look, facing: 'spine' })
    const front = bookArt({ ...look, facing: 'front', width: 78 })
    expect(spine.beads.length).toBeGreaterThan(5)
    expect(front.beads.length).toBeGreaterThan(spine.beads.length)
    expect(bookArt({ ...look, facing: 'spine' }).outline).toBe(spine.outline)
  })
})
