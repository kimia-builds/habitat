// The spread lookup (T3.5): the popup asks spreadFor which image
// belongs to a publication; anything short of a real entry means
// "no spread yet" and the popup shows its quiet empty state instead.

import { describe, expect, it } from 'vitest'
import { spreadFor } from './spreads.js'

describe('spreadFor', () => {
  const table = {
    'moth-almanac': 'spreads/moth-almanac.jpg',
    'blank-entry': '   ',
  }

  it('returns the image path for a publication with a spread', () => {
    expect(spreadFor('moth-almanac', table)).toBe('spreads/moth-almanac.jpg')
  })

  it('returns null for a publication without an entry', () => {
    expect(spreadFor('unheard-of', table)).toBe(null)
  })

  it('returns null for a blank entry — nothing breaks half-filled', () => {
    expect(spreadFor('blank-entry', table)).toBe(null)
  })

  it('returns null before publications have ids at all (until T6.1)', () => {
    // Every reading item carries publicationId null for now, and the
    // real SPREADS table is the default — the answer must be a calm
    // null, never a crash or a broken image.
    expect(spreadFor(null)).toBe(null)
    expect(spreadFor(undefined)).toBe(null)
  })
})
