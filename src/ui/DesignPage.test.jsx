// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording). Assets appear on the
// page as they are made (2026-07-26 — the empty placeholder tiles are
// gone), so each shelf's test asserts its live swatches.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { ABODE_PALETTES } from './sky.jsx'

afterEach(cleanup)

describe('DesignPage workbench', () => {
  it('draws one live swatch for every texture in the manifest', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Each texture swatch is an accessible <svg role="img"> labelled by its
    // texture name — so the whole §8 library is present and eyeball-able.
    // Scoped to the texture shelves so the environment-sky images below
    // don't count here.
    const names = [...container.querySelectorAll('.texture-swatch svg[role="img"]')].map(
      (img) => img.getAttribute('aria-label'),
    )
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

  it('draws the canonical friend eye at each size', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // The chosen eye (§9c) is drawn at small/medium/large, each an accessible
    // <svg role="img"> — so the one canonical eye and its size range are both
    // present. Scoped to the eye shelf so the texture/sky images don't count.
    const labels = [...container.querySelectorAll('.eye-swatch svg[role="img"]')].map(
      (img) => img.getAttribute('aria-label'),
    )
    expect(labels).toEqual([
      'canonical eye, small',
      'canonical eye, medium',
      'canonical eye, large',
    ])
  })

  it('shows the signer illustration in its three tints', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // The imported signer drawing is shown once per reward-stream pastel, each
    // an accessible <svg role="img"> labelled by tint — so the one artwork and
    // its three colour treatments are all present. Scoped to the signer shelf
    // so the other assets' images don't count.
    const labels = [
      ...container.querySelectorAll('.signer-swatch svg[role="img"]'),
    ].map((img) => img.getAttribute('aria-label'))
    expect(labels).toEqual(['signer, green', 'signer, violet', 'signer, amber'])
  })

  it('shows the storyteller in three tints with two blinking eyes each', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // The imported storyteller drawing is shown once per reward-stream
    // pastel. The accessible image is the swatch's wrapper div (its two
    // stacked svgs — static body, blinking eyes — are decorative).
    const swatches = [
      ...container.querySelectorAll('.storyteller-swatch [role="img"]'),
    ]
    const labels = swatches.map((img) => img.getAttribute('aria-label'))
    expect(labels).toEqual([
      'storyteller, green',
      'storyteller, violet',
      'storyteller, amber',
    ])
    // Every tint arrives assembled: the two canonical eyes are mounted,
    // each in its own blink wrapper (the idle-blink behaviour hangs off
    // that class), and the eyes live in a separate overlay svg from the
    // heavy body so blinking never repaints the blurred figure.
    for (const swatch of swatches) {
      expect(swatch.querySelectorAll('svg')).toHaveLength(2)
      const [body, eyes] = swatch.querySelectorAll('svg')
      expect(body.querySelectorAll('.storyteller-eye-blink')).toHaveLength(0)
      expect(eyes.querySelectorAll('.storyteller-eye-blink')).toHaveLength(2)
    }
  })

  it('surfaces the shared night sky for the eyeball pass', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The night sky is a decorative CSS star layer (aria-hidden), so we
    // assert its labelled shelf holds the one star-layer box.
    const shelf = screen.getByLabelText('night sky')
    expect(shelf.querySelectorAll('.nzd-night-sky')).toHaveLength(1)
  })

  it('draws the abode sky in each of its four palettes', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // One <svg role="img"> per palette, labelled by palette, so the single
    // fixed composition can be compared colour-to-colour.
    const labels = ABODE_PALETTES.map((p) => `Abode sky, ${p}`)
    // getByRole throws if the labelled image is missing, so reaching the
    // end with all four found is the assertion.
    for (const label of labels) {
      expect(screen.getByRole('img', { name: label }).tagName.toLowerCase()).toBe(
        'svg',
      )
    }
    expect(labels).toHaveLength(4)
  })

  it('leads back to the habits', async () => {
    const onBack = vi.fn()
    render(<DesignPage onBack={onBack} />)
    screen.getByRole('button', { name: /back to the habits/i }).click()
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
