// T5.1: the six charms replaced the placeholder glyphs. These tests pin
// the swap's structure — each symbol number draws an SVG image with the
// charm's shape name as its (screen-reader-only) accessible name, in the
// charm's colour. Names/colours are a spec decision (design-notes §11a),
// so asserting them is allowed; nothing here touches Kimia's content.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import CharmSymbol from './CharmSymbol.jsx'
import { SYMBOL_COLORS, SYMBOL_NAMES } from './symbols.js'

afterEach(cleanup)

describe('CharmSymbol (the six charms)', () => {
  it('names all six charms by shape, for screen readers and tests', () => {
    expect(SYMBOL_NAMES).toEqual({
      1: 'crown',
      2: 'cherry',
      3: 'shell',
      4: 'anchor',
      5: 'shield',
      6: 'key',
    })
  })

  it('pins each charm to its reference colour (design-notes §11a)', () => {
    expect(SYMBOL_COLORS).toEqual({
      1: '#F0BB3B', // crown — gold
      2: '#F5805A', // cherry — coral
      3: '#E8698C', // shell — pink
      4: '#A98EE0', // anchor — lavender
      5: '#5AB6F3', // shield — sky
      6: '#4FBFA0', // key — teal
    })
  })

  for (const symbol of [1, 2, 3, 4, 5, 6]) {
    it(`draws symbol ${symbol} as the ${SYMBOL_NAMES[symbol]} charm`, () => {
      render(<CharmSymbol symbol={symbol} />)
      const charm = screen.getByRole('img', { name: SYMBOL_NAMES[symbol] })
      // An SVG drawing, not text — the tag stays wordless on screen.
      expect(charm.tagName.toLowerCase()).toBe('svg')
      expect(charm.querySelector('path, line, circle')).not.toBeNull()
      // It carries a colour (stroke inherits it via currentColor); the
      // exact palette is pinned in the SYMBOL_COLORS test above.
      expect(charm.style.color).not.toBe('')
    })
  }
})
