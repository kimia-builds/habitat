// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording).
//
// The page is a WAITING ROOM (Kimia, 2026-08-17): a shelf stands only
// while its asset still has a question open, and leaves once she has
// judged it. So these tests cover exactly what is still waiting — the
// texture library, the abode sky, the flora sizes and the flora fills —
// and the last test guards the emptying itself, by failing if a settled
// family creeps back on.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { ABODE_PALETTES } from './sky.jsx'
import { FLORA_FILLS } from './floraFills.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { FLORA_SIZE_CLASSES, floraHeight, floraWidth } from './floraCanon.js'

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

  it('stands every silhouette at both sizes, with a ruler friend each', () => {
    render(<DesignPage onBack={vi.fn()} />)
    const scene = screen.getByRole('img', { name: 'flora sizes' })
    // Four silhouettes × two size classes, plus the two friends the classes
    // are pegged to — ten figures, and a missing one means a flora nobody
    // can judge.
    const figures = scene.querySelectorAll('svg[role="img"]')
    expect(figures).toHaveLength(FLORA_SILHOUETTES.length * 2 + 2)
    const labels = [...figures].map((f) => f.getAttribute('aria-label'))
    expect(labels).toContain('zala — the ruler')
    expect(labels).toContain('chitu — the ruler')
  })

  it('draws every flora in the scene at its canon size, never a typed-in one', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The scene is drawn in canon units (base 1), so each figure's box must
    // be exactly what floraCanon.js says — this is the guard that the
    // workbench cannot drift away from the canon it is illustrating.
    for (const sizeClass of FLORA_SIZE_CLASSES) {
      for (const silhouette of FLORA_SILHOUETTES) {
        const figure = screen.getByRole('img', {
          name: `${sizeClass} ${silhouette.label}`,
        })
        expect(Number(figure.getAttribute('height'))).toBeCloseTo(
          floraHeight(sizeClass, 1),
          6,
        )
        expect(Number(figure.getAttribute('width'))).toBeCloseTo(
          floraWidth(sizeClass, silhouette, 1),
          6,
        )
      }
    }
  })

  it('stands the whole scene on shared ground lines', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Every figure's foot must land on one of the drawn grounds: sizes can
    // only be compared by eye if the things being compared are standing on
    // the same floor, the way they would in the Abode.
    const scene = container.querySelector('.flora-size-scene')
    const grounds = [...scene.querySelectorAll(':scope > rect')].map((r) =>
      Number(r.getAttribute('y')),
    )
    expect(grounds.length).toBeGreaterThan(0)
    for (const figure of scene.querySelectorAll('svg[role="img"]')) {
      const foot =
        Number(figure.getAttribute('y')) + Number(figure.getAttribute('height'))
      expect(grounds.some((g) => Math.abs(g - foot) < 1e-9)).toBe(true)
    }
  })

  it('shows all six flora fills and nothing else', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Six is the number the flora arithmetic depends on (4 silhouettes ×
    // 2 sizes × 6 fills = 48), so a seventh appearing without a decision
    // fails here.
    const names = [
      ...container.querySelectorAll('.flora-fill-swatch svg[role="img"]'),
    ].map((sq) => sq.getAttribute('aria-label'))
    expect(names).toEqual(FLORA_FILLS.map((f) => f.id))
  })

  it('glows each flora fill in its own body colour', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // Design-bible §3: a living thing's light IS its body colour. So each
    // square's glow must be that fill's own hex, never a shared halo.
    for (const fill of FLORA_FILLS) {
      const square = screen.getByRole('img', { name: fill.id })
      expect(square.style.boxShadow).toContain(fill.colour.hex)
    }
  })

  it('keeps every strand of hair inside its fill swatch', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Kimia's rule (2026-08-19): the hair FORMS the fill and never fringes
    // out past the outline. The generator scatters strands that overrun
    // their box by design, so the clip is what enforces it — every strand
    // group must sit inside a clipped <g>.
    for (const swatch of container.querySelectorAll('.flora-fill-swatch')) {
      const clipped = swatch.querySelector('g[clip-path]')
      expect(clipped).not.toBeNull()
      expect(swatch.querySelectorAll('path').length).toBeGreaterThan(0)
      // No strand may be painted outside that clipped group.
      expect(
        [...swatch.querySelectorAll('path')].every((strand) =>
          clipped.contains(strand),
        ),
      ).toBe(true)
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
        'flora sizes',
        'flora fills',
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
