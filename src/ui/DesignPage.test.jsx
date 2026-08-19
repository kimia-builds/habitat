// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording).
//
// The page is a WAITING ROOM (Kimia, 2026-08-17): a shelf stands only
// while its asset still has a question open, and leaves once she has
// judged it. So these tests cover exactly what is still waiting — the
// texture library, the abode sky and the flora colours — and the last
// test guards the emptying itself, by failing if a settled family creeps
// back on.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { ABODE_PALETTES } from './sky.jsx'
import { FLORA_COLOUR_CANDIDATES } from './floraColours.js'

afterEach(cleanup)

describe('DesignPage workbench', () => {
  it('draws one live swatch for every texture in the manifest', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Each texture swatch is an accessible <svg role="img"> labelled by its
    // texture name — so the whole §8 library is present and eyeball-able.
    // Scoped to the texture shelves so the abode-sky images below don't
    // count here.
    const names = [
      ...container.querySelectorAll('.texture-swatch svg[role="img"]'),
    ].map((img) => img.getAttribute('aria-label'))
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

  it('draws the abode sky in each of its four palettes', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // One <svg role="img"> per palette, labelled by palette, so the single
    // fixed composition can be compared colour-to-colour.
    const labels = ABODE_PALETTES.map((p) => `Abode sky, ${p}`)
    // getByRole throws if the labelled image is missing, so reaching the
    // end with all four found is the assertion.
    for (const label of labels) {
      expect(
        screen.getByRole('img', { name: label }).tagName.toLowerCase(),
      ).toBe('svg')
    }
    expect(labels).toHaveLength(4)
  })

  it('offers every candidate flora shade, grouped by its hue', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // One row per hue, holding exactly that hue's candidates — so the
    // pick is made hue by hue rather than out of one undifferentiated
    // heap (T5.3g).
    for (const group of FLORA_COLOUR_CANDIDATES) {
      const row = screen.getByLabelText(`flora colours — ${group.hue}`)
      expect(row.querySelectorAll('.flora-colour-swatch')).toHaveLength(
        group.shades.length,
      )
    }
  })

  it('glows each flora candidate in its own body colour', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Design-bible §3: a living thing's light IS its body colour. So
    // every square's glow must be the same hex as its fill — never a
    // shared halo colour applied on top.
    // (Checked against the palette rather than against the square's own
    // background, because the DOM rewrites a hex fill as rgb() while
    // leaving the hex inside the shadow alone — comparing the two strings
    // would only be testing that quirk.)
    const squares = [...container.querySelectorAll('.flora-colour-square')]
    const shades = FLORA_COLOUR_CANDIDATES.flatMap((g) => g.shades)
    expect(squares).toHaveLength(shades.length)
    for (const shade of shades) {
      const square = screen.getByRole('img', { name: shade.name })
      expect(square.style.boxShadow).toContain(shade.hex)
    }
  })

  it('holds nothing but the families still waiting to be judged', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The shelves are exactly the texture families plus the abode sky.
    // Anything else standing here is an asset that has had its answer and
    // should have left with the others (2026-08-17).
    const shelves = [...document.querySelectorAll('.design-family')].map((s) =>
      s.getAttribute('aria-label'),
    )
    const families = [...new Set(TEXTURES.map((t) => t.family))]
    expect(shelves.slice().sort()).toEqual(
      [
        ...families.map((f) => `textures — ${f}`),
        'abode sky',
        'flora colours',
      ].sort(),
    )
  })

  it('leads back to the habits', async () => {
    const onBack = vi.fn()
    render(<DesignPage onBack={onBack} />)
    screen.getByRole('button', { name: /back to the habits/i }).click()
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
