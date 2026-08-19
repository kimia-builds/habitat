// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording).
//
// The page is a WAITING ROOM (Kimia, 2026-08-17): a shelf stands only
// while its asset still has a question open, and leaves once she has
// judged it. So these tests cover exactly what is still waiting — the
// texture library, the abode sky, the flora fills and the flora
// themselves — and the last test guards the emptying itself, by failing
// if a settled family creeps back on.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { ABODE_PALETTES } from './sky.jsx'
import { FLORA_FILLS } from './floraFills.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { floraHeight, floraWidth } from './floraCanon.js'

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

  it('dresses every silhouette in every fill', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Four shapes × six fills = 24, which is half the collectible
    // catalogue; the other half is these same drawings at the small size.
    const figures = container.querySelectorAll('.flora-figure svg[role="img"]')
    expect(figures).toHaveLength(FLORA_SILHOUETTES.length * FLORA_FILLS.length)
    for (const silhouette of FLORA_SILHOUETTES) {
      for (const fill of FLORA_FILLS) {
        expect(
          screen.getByRole('img', { name: `${silhouette.label} — ${fill.id}` }),
        ).toBeTruthy()
      }
    }
  })

  it('draws every dressed flora at its canon size, never a typed-in one', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The shelf picks ONE base size and asks the canon for the rest, so a
    // number typed in by hand here would fail — which is the point: the
    // workbench cannot drift away from the canon it is showing.
    const base = 11.5
    for (const silhouette of FLORA_SILHOUETTES) {
      for (const fill of FLORA_FILLS) {
        const figure = screen.getByRole('img', {
          name: `${silhouette.label} — ${fill.id}`,
        })
        expect(figure.getAttribute('height')).toBe(
          `${floraHeight('large', base)}rem`,
        )
        expect(figure.getAttribute('width')).toBe(
          `${floraWidth('large', silhouette, base)}rem`,
        )
      }
    }
  })

  it('keeps every strand of hair inside the silhouette', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Kimia's rule (2026-08-19): the hair FORMS the fill and never fringes
    // out past the outline. The generator scatters strands beyond its box by
    // design, so the clip to the shape is the only thing enforcing it.
    for (const figure of container.querySelectorAll('.flora-figure')) {
      const clipped = figure.querySelector('g[clip-path]')
      expect(clipped).not.toBeNull()
      expect(clipped.querySelectorAll('path').length).toBeGreaterThan(0)
      expect(figure.querySelector('clipPath path')).not.toBeNull()
    }
  })

  it('pulls the dark ground back from every silhouette’s edge', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Kimia's edge rule (2026-08-19): dark must not reach the outline, or the
    // flora reads as having a drawn black edge. The ground is therefore the
    // shape eroded and softened — and clipped too, so the softening cannot
    // push it back out past the outline it was just pulled inside.
    for (const figure of container.querySelectorAll('.flora-figure')) {
      const ground = figure.querySelector('g[clip-path] path[filter]')
      expect(ground).not.toBeNull()
      const filter = figure.querySelector(
        `#${ground.getAttribute('filter').slice(5, -1)}`,
      )
      const erode = filter.querySelector('feMorphology')
      expect(erode.getAttribute('operator')).toBe('erode')
      expect(Number(erode.getAttribute('radius'))).toBeGreaterThan(0)
      // And a softening pass after it, so the pulled-back edge has no second
      // hard line of its own.
      expect(
        Number(
          filter.querySelector('feGaussianBlur').getAttribute('stdDeviation'),
        ),
      ).toBeGreaterThan(0)
    }
  })

  it('glows each dressed flora in its own body colour', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // Design-bible §3: a living thing's light IS its body colour. The aura
    // is the silhouette itself, blurred and painted that fill's colour.
    for (const silhouette of FLORA_SILHOUETTES) {
      for (const fill of FLORA_FILLS) {
        const figure = screen.getByRole('img', {
          name: `${silhouette.label} — ${fill.id}`,
        })
        const aura = figure.querySelector('path[filter]')
        expect(aura.getAttribute('fill')).toBe(fill.colour.hex)
      }
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
        'flora',
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
