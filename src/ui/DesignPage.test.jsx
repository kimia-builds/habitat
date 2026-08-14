// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording). Assets appear on the
// page as they are made (2026-07-26 — the empty placeholder tiles are
// gone), so each shelf's test asserts its live swatches.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { ABODE_PALETTES } from './sky.jsx'
import { DEPTH_BANDS } from './planet.jsx'
import { TRACED_FRIENDS } from './tracedFriends.js'

afterEach(cleanup)

// How many eye placeholders each of Kimia's nine traces carries — pinned here
// rather than read from the components, so dropping or doubling a friend's
// eyes fails the suite instead of quietly agreeing with itself.
const EYE_COUNTS = {
  '01': 2,
  '02': 3,
  '03': 4,
  '04': 2,
  '05': 3,
  '06': 2,
  '07': 5,
  '08': 2,
  '09': 2,
}

describe('DesignPage workbench', () => {
  it('draws one live swatch for every texture in the manifest', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Each texture swatch is an accessible <svg role="img"> labelled by its
    // texture name — so the whole §8 library is present and eyeball-able.
    // Scoped to the texture shelves so the environment-sky images below
    // don't count here.
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

  it('draws the canonical friend eye at each size', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // The chosen eye (§9c) is drawn at small/medium/large, each an accessible
    // <svg role="img"> — so the one canonical eye and its size range are both
    // present. Scoped to the eye shelf so the texture/sky images don't count.
    const labels = [
      ...container.querySelectorAll('.eye-swatch svg[role="img"]'),
    ].map((img) => img.getAttribute('aria-label'))
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

  it('shows friend 10 in three tints with two blinking eyes each', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // The tenth archetype follows the storyteller's assembled pattern:
    // one accessible wrapper div per reward-stream pastel, each holding
    // a static body svg and a separate eyes overlay svg (the blink
    // lives only in the overlay, so it never repaints the heavy body).
    const swatches = [
      ...container.querySelectorAll('.friend10-swatch [role="img"]'),
    ]
    const labels = swatches.map((img) => img.getAttribute('aria-label'))
    expect(labels).toEqual([
      'friend 10, green',
      'friend 10, violet',
      'friend 10, amber',
    ])
    for (const swatch of swatches) {
      expect(swatch.querySelectorAll('svg')).toHaveLength(2)
      const [body, eyes] = swatch.querySelectorAll('svg')
      expect(body.querySelectorAll('.friend-eye-blink')).toHaveLength(0)
      expect(eyes.querySelectorAll('.friend-eye-blink')).toHaveLength(2)
    }
  })

  it.each(TRACED_FRIENDS.map((f) => f.num))(
    'shows friend %s in three tints with its eyes blinking in their own overlay',
    (num) => {
      const { container } = render(<DesignPage onBack={vi.fn()} />)
      // Every traced archetype follows the friend-10 pattern: one accessible
      // wrapper div per reward-stream pastel, each holding a static body svg
      // and a separate eyes overlay svg, with the blink living only in the
      // overlay so it never repaints the heavy blurred body.
      const swatches = [
        ...container.querySelectorAll(`.friend${num}-swatch [role="img"]`),
      ]
      const labels = swatches.map((img) => img.getAttribute('aria-label'))
      expect(labels).toEqual([
        `friend ${num}, green`,
        `friend ${num}, violet`,
        `friend ${num}, amber`,
      ])
      // The drawing's own eye placeholders are replaced by the canonical
      // <Eye/>, one per wrapper, so the count is the trace's eye count.
      const eyeCount = EYE_COUNTS[num]
      for (const swatch of swatches) {
        expect(swatch.querySelectorAll('svg')).toHaveLength(2)
        const [body, eyes] = swatch.querySelectorAll('svg')
        expect(body.querySelectorAll('.friend-eye-blink')).toHaveLength(0)
        expect(eyes.querySelectorAll('.friend-eye-blink')).toHaveLength(
          eyeCount,
        )
      }
    },
  )

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
      expect(
        screen.getByRole('img', { name: label }).tagName.toLowerCase(),
      ).toBe('svg')
    }
    expect(labels).toHaveLength(4)
  })

  it('surfaces the startup planet in two colours for the eyeball pass', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The planet is decorative (aria-hidden), so the labelled shelf is the
    // handle. Two planets, each carrying its sky and the three depth bands
    // that make the surface read as a sphere rather than a scrolling belt.
    const shelf = screen.getByLabelText('rolling planet')
    const planets = shelf.querySelectorAll('.nzd-planet')
    expect(planets).toHaveLength(2)
    for (const planet of planets) {
      expect(planet.querySelectorAll('.nzd-night-sky')).toHaveLength(1)
      const bands = planet.querySelectorAll('.p-rock')
      expect(bands).toHaveLength(DEPTH_BANDS.length)
      // Every drifting layer is drawn TWICE, side by side, and slid by
      // exactly one copy — that is what makes each loop seamless.
      for (const band of bands) {
        expect(band.querySelectorAll('.p-rock-copy')).toHaveLength(2)
      }
      expect(planet.querySelectorAll('.p-continents > g > g')).toHaveLength(2)
    }
  })

  it('gives the startup planet the home screen sky, twinkle and all', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // §12f's sky IS the home screen's star layer, unchanged — same asset,
    // same seed, the same rare unsynchronised twinkle (Kimia, 2026-08-13,
    // reversing the same day's "at rest"). Some stars must be twinklers, or
    // the planet has quietly been handed a different sky.
    const shelf = screen.getByLabelText('rolling planet')
    expect(shelf.querySelectorAll('.nzd-night-sky .tw').length).toBeGreaterThan(
      0,
    )
    expect(shelf.querySelectorAll('.nzd-night-sky .s').length).toBeGreaterThan(
      0,
    )
  })

  it('replays the star-shimmer on the real arrival shelf', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The REAL shelf with three demo drops — so what is being eyeballed
    // is the game's own arrival, not a picture of one. Every drop
    // carries a shimmer, since none of them owes a reveal.
    const shelf = screen.getByLabelText('drop arrival')
    expect(shelf.querySelectorAll('.arrival')).toHaveLength(3)
    expect(shelf.querySelectorAll('.shimmer')).toHaveLength(3)
    // The note's half of the shimmer is here too (Kimia: both places).
    expect(
      shelf.querySelectorAll('.shimmer-note-swatch .arrival-note'),
    ).toHaveLength(1)

    // Replay re-mounts them, which is how an on-arrival animation is
    // made to arrive again. The proof it re-mounted is a new element.
    // fireEvent rather than a bare .click(): this press changes state,
    // and only fireEvent lets React finish re-rendering before the next
    // line looks. The other presses on this page just call a spy.
    const before = shelf.querySelector('.arrival')
    fireEvent.click(screen.getByRole('button', { name: /replay/i }))
    expect(shelf.querySelector('.arrival')).not.toBe(before)
  })

  it('leads back to the habits', async () => {
    const onBack = vi.fn()
    render(<DesignPage onBack={onBack} />)
    screen.getByRole('button', { name: /back to the habits/i }).click()
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
