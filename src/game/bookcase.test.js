import { describe, expect, it } from 'vitest'
import {
  BOOK_FACING,
  bookcaseItems,
  defaultSlot,
  faceBook,
  placeBook,
  pruneBookcaseLayout,
  SHELF_BASELINES,
  SLOTS_PER_ROW,
  validateBookcaseLayout,
} from './bookcase.js'

// A completion carrying the given drops (defaults to one magazine).
const completion = (
  id,
  drops = [{ kind: 'reading', readingType: 'magazine' }],
  dayKey = '2026-07-16',
) => ({
  id,
  habitId: 'walk',
  recordedAt: 1000,
  dayKey,
  drops,
})

const magazine = { kind: 'reading', readingType: 'magazine' }
const novel = { kind: 'reading', readingType: 'novel' }

describe('default slots', () => {
  it('fills the top plank left to right, then the next one down', () => {
    const first = defaultSlot(0)
    const second = defaultSlot(1)
    expect(first.x).toBeCloseTo(0.5 / SLOTS_PER_ROW)
    expect(second.x).toBeCloseTo(1.5 / SLOTS_PER_ROW)
    expect(first.y).toBe(SHELF_BASELINES[0])
    expect(second.y).toBe(SHELF_BASELINES[0])
    // The 9th book starts the second plank, back at the left.
    const ninth = defaultSlot(SLOTS_PER_ROW)
    expect(ninth.x).toBeCloseTo(0.5 / SLOTS_PER_ROW)
    expect(ninth.y).toBe(SHELF_BASELINES[1])
  })

  it('keeps every slot inside the shelf interior, even far past capacity', () => {
    for (const index of [0, 7, 8, 23, 24, 25, 48, 100, 500]) {
      const { x, y } = defaultSlot(index)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(1)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(1)
    }
  })

  it('nudges overflow books sideways so they never stack invisibly', () => {
    // Book 25 starts the second pass: the first slot again, shifted.
    expect(defaultSlot(24).x).toBeGreaterThan(defaultSlot(0).x)
    expect(defaultSlot(24).y).toBe(defaultSlot(0).y)
  })

  it('refuses a non-whole-number index', () => {
    expect(() => defaultSlot(1.5)).toThrow()
    expect(() => defaultSlot(-1)).toThrow()
  })
})

describe('bookcaseItems — the shelf derived from history', () => {
  it('is empty until reading material drops', () => {
    expect(bookcaseItems([completion('c1', [])], {})).toEqual([])
  })

  it('gives every publication its default slot and spine, in arrival order', () => {
    const completions = [
      completion('c1', [magazine], '2026-07-14'),
      completion('c2', []), // no drops — no book
      completion('c3', [novel, magazine]), // two drops, two books
    ]
    const items = bookcaseItems(completions, {})
    expect(items.map((item) => item.id)).toEqual(['c1:0', 'c3:0', 'c3:1'])
    expect(items.map((item) => item.type)).toEqual([
      'magazine',
      'novel',
      'magazine',
    ])
    expect(items[0].facing).toBe('spine')
    expect(items[0]).toMatchObject(defaultSlot(0))
    expect(items[2]).toMatchObject(defaultSlot(2))
  })

  it('prefers a stored place over the default slot', () => {
    const completions = [completion('c1'), completion('c2')]
    const layout = { 'c2:0': { x: 0.8, y: 0.5, facing: 'front' } }
    const items = bookcaseItems(completions, layout)
    expect(items[0]).toMatchObject({ ...defaultSlot(0), facing: 'spine' })
    expect(items[1]).toMatchObject({ x: 0.8, y: 0.5, facing: 'front' })
  })

  it('ignores places whose publication no longer exists (undo took the book)', () => {
    const items = bookcaseItems([completion('c2')], {
      'c1:0': { x: 0.1, y: 0.1, facing: 'front' },
    })
    expect(items).toHaveLength(1)
    expect(items[0].id).toBe('c2:0')
    expect(items[0].facing).toBe('spine')
  })
})

describe('placeBook', () => {
  const completions = [completion('c1'), completion('c2')]

  it('records where a book was dragged to, keeping its facing', () => {
    const turned = faceBook({}, completions, 'c1:0', 'front')
    const moved = placeBook(turned, completions, 'c1:0', { x: 0.3, y: 0.4 })
    expect(moved['c1:0']).toEqual({ x: 0.3, y: 0.4, facing: 'front' })
  })

  it('clamps the anchor into the shelf interior', () => {
    const moved = placeBook({}, completions, 'c1:0', { x: -0.5, y: 1.7 })
    expect(moved['c1:0']).toEqual({ x: 0, y: 1, facing: 'spine' })
  })

  it('returns a new map and leaves the original untouched', () => {
    const before = { 'c2:0': { x: 0.9, y: 0.9, facing: 'spine' } }
    placeBook(before, completions, 'c1:0', { x: 0.1, y: 0.1 })
    expect(before).toEqual({ 'c2:0': { x: 0.9, y: 0.9, facing: 'spine' } })
  })

  it('refuses books that are not on the shelf, and broken points', () => {
    expect(() => placeBook({}, completions, 'nope:0', { x: 0, y: 0 })).toThrow(
      'No publication on the bookcase has this id.',
    )
    expect(() =>
      placeBook({}, completions, 'c1:0', { x: Number.NaN, y: 0 }),
    ).toThrow()
  })
})

describe('faceBook', () => {
  const completions = [completion('c1'), completion('c2')]

  it('turns a book and freezes its current place into the entry', () => {
    const faced = faceBook({}, completions, 'c2:0', 'front')
    // Never moved: the default slot becomes the frozen position, so the
    // turned book never slides when another book vanishes.
    expect(faced['c2:0']).toEqual({ ...defaultSlot(1), facing: 'front' })
  })

  it('keeps a dragged position when the book is turned', () => {
    const moved = placeBook({}, completions, 'c1:0', { x: 0.2, y: 0.3 })
    const faced = faceBook(moved, completions, 'c1:0', 'front')
    expect(faced['c1:0']).toEqual({ x: 0.2, y: 0.3, facing: 'front' })
  })

  it('refuses unknown facings and unknown books', () => {
    expect(BOOK_FACING).toEqual(['spine', 'front'])
    expect(() => faceBook({}, completions, 'c1:0', 'sideways')).toThrow()
    expect(() => faceBook({}, completions, 'nope:0', 'front')).toThrow()
  })
})

describe('pruneBookcaseLayout', () => {
  it('drops places whose publication is gone, keeps the rest', () => {
    const completions = [completion('c2')]
    const pruned = pruneBookcaseLayout(
      {
        'c1:0': { x: 0.1, y: 0.1, facing: 'front' }, // undone — ghost
        'c2:0': { x: 0.2, y: 0.2, facing: 'spine' },
      },
      completions,
    )
    expect(pruned).toEqual({ 'c2:0': { x: 0.2, y: 0.2, facing: 'spine' } })
  })
})

describe('validateBookcaseLayout', () => {
  it('accepts an empty map and complete in-bounds places', () => {
    expect(() => validateBookcaseLayout({})).not.toThrow()
    expect(() =>
      validateBookcaseLayout({
        'c1:0': { x: 0, y: 1, facing: 'front' },
        'c2:1': { x: 0.5, y: 0.5, facing: 'spine' },
      }),
    ).not.toThrow()
  })

  it('rejects anything that is not a map of complete places', () => {
    expect(() => validateBookcaseLayout(null)).toThrow()
    expect(() => validateBookcaseLayout([])).toThrow()
    expect(() =>
      validateBookcaseLayout({ '': { x: 0.5, y: 0.5, facing: 'spine' } }),
    ).toThrow()
    expect(() =>
      validateBookcaseLayout({ 'c1:0': { x: 1.5, y: 0.5, facing: 'spine' } }),
    ).toThrow()
    expect(() =>
      validateBookcaseLayout({ 'c1:0': { x: 0.5, facing: 'spine' } }),
    ).toThrow()
    expect(() =>
      validateBookcaseLayout({ 'c1:0': { x: 0.5, y: 0.5, facing: 'open' } }),
    ).toThrow()
  })
})
