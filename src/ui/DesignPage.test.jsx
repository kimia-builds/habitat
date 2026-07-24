// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording): the fixed-size asset
// families size themselves from the constants, and the T5.3 texture
// library draws one live swatch per primitive in its manifest.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import {
  FRIEND_CATEGORIES,
  MAP_REGION_COUNT,
  SYMBOL_COUNT,
} from '../game/constants.js'

afterEach(cleanup)

describe('DesignPage workbench', () => {
  it('sizes the fixed asset families from the constants', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The charms / friends / map-region shelves each hold one empty
    // slot per unit, so the page grows right if a count ever moves.
    const countSlots = (label) =>
      screen.getByLabelText(label).querySelectorAll('.design-slot').length
    expect(countSlots('charms')).toBe(SYMBOL_COUNT)
    expect(countSlots('friends')).toBe(FRIEND_CATEGORIES.length)
    expect(countSlots('map regions')).toBe(MAP_REGION_COUNT)
  })

  it('draws one live swatch for every texture in the manifest', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // Each swatch is an accessible <svg role="img"> labelled by its
    // texture name — so the whole §8 library is present and eyeball-able.
    const names = screen
      .getAllByRole('img')
      .map((img) => img.getAttribute('aria-label'))
    expect(names.slice().sort()).toEqual(TEXTURES.map((t) => t.name).sort())
  })

  it('groups the swatches by their design-bible §8 family', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // One shelf per family that actually has textures; a rock family
    // shelf, for instance, holds exactly its non-glowing rock surfaces.
    for (const family of [...new Set(TEXTURES.map((t) => t.family))]) {
      const shelf = screen.getByLabelText(`textures — ${family}`)
      const expected = TEXTURES.filter((t) => t.family === family).length
      expect(shelf.querySelectorAll('.texture-swatch')).toHaveLength(expected)
    }
  })

  it('leads back to the habits', async () => {
    const onBack = vi.fn()
    render(<DesignPage onBack={onBack} />)
    screen.getByRole('button', { name: /back to the habits/i }).click()
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
