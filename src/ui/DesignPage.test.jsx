// Tests for the design-assets workbench (T5 prep). The page is
// scaffolding, so these prove only its STRUCTURE (CLAUDE.md: roles,
// counts, behaviour — never incidental wording).
//
// The page is a WAITING ROOM (Kimia, 2026-08-17): a shelf stands only
// while its asset still has a question open, and leaves once she has
// judged it. So these tests cover exactly what is still waiting — the
// filter textures and the abode sky — and the last test guards the
// emptying itself, by failing if a settled family creeps back on.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DesignPage from './DesignPage.jsx'
import { TEXTURES } from './textures.jsx'
import { OBJECT_CANON, objectDrawnBox, objectSize } from './objectCanon.js'
import { baseWhereSmallestIs } from './friendCanon.js'

afterEach(cleanup)

describe('DesignPage workbench', () => {
  it('draws one live swatch for every texture still waiting', () => {
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    // Each texture swatch is an accessible <svg role="img"> labelled by its
    // texture name — so the whole §8 library is present and eyeball-able.
    // Scoped to the texture shelves so the abode-sky images below don't
    // count here.
    const names = [
      ...container.querySelectorAll('.texture-swatch svg[role="img"]'),
    ].map((img) => img.getAttribute('aria-label'))
    // Every FILTER surface, and no hair — the hair shelf left with the
    // flora, so a hair swatch reappearing here is a settled asset creeping
    // back into the waiting room.
    const stillWaiting = TEXTURES.filter((t) => t.family !== 'hair')
    expect(names.slice().sort()).toEqual(stillWaiting.map((t) => t.name).sort())
    expect(names.some((n) => n.startsWith('hair'))).toBe(false)
  })

  it('groups the swatches by their design-bible §8 family', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // One shelf per family that actually has textures; a rock family
    // shelf, for instance, holds exactly its non-glowing rock surfaces.
    for (const family of ['plant-like', 'fungal', 'rock']) {
      const shelf = screen.getByLabelText(`textures — ${family}`)
      const expected = TEXTURES.filter((t) => t.family === family).length
      expect(shelf.querySelectorAll('.texture-swatch')).toHaveLength(expected)
    }
  })

  it('holds nothing but the families still waiting to be judged', () => {
    render(<DesignPage onBack={vi.fn()} />)
    // The shelves are exactly the texture families now. Anything else
    // standing here is an asset that has had its answer and should have
    // left with the others (2026-08-17).
    const shelves = [...document.querySelectorAll('.design-family')].map((s) =>
      s.getAttribute('aria-label'),
    )
    // Hair is a family in the LIBRARY but no longer a shelf here: Kimia
    // judged it as the flora's surface on 2026-08-19 and it came down with
    // them (design-bible §8 still carries the textures themselves).
    // The abode sky left on 2026-08-21 (T5.4): its question was answered
    // by becoming the real Abode's four background choices.
    const waiting = ['plant-like', 'fungal', 'rock']
    expect(shelves.slice().sort()).toEqual(
      [
        ...waiting.map((f) => `textures — ${f}`),
        'curiosities',
        'landmark size',
      ].sort(),
    )
  })

  it('stands the curiosities at their canon sizes, never at a shelf size', () => {
    // Design-bible §9c, and the mistake the flat-width friend shelves made on
    // 2026-08-17: a workbench gets no exemption from the canon. Every object
    // here is drawn at the ratio objectCanon.js gives it, times the shelf's
    // one base — which is the Abode's, so this shelf shows Abode sizes.
    const { container } = render(<DesignPage onBack={vi.fn()} />)
    const shelf = screen.getByLabelText('curiosities')
    const drawings = [...shelf.querySelectorAll('.curio-item svg[viewBox]')]
    expect(drawings.length).toBeGreaterThan(0)
    const base = baseWhereSmallestIs(24)
    // The drawn width of each, against what the canon says it should be. The
    // key is read off the viewBox rather than assumed, so this keeps working
    // as more of the 64 objects arrive.
    for (const svg of drawings) {
      const [, , w, h] = svg.getAttribute('viewBox').split(' ').map(Number)
      // Matched on the drawn box, which IS Kimia's pixel measurement, so two
      // objects that merely share an aspect ratio are never confused.
      const key = Object.keys(OBJECT_CANON).find((k) => {
        const box = objectDrawnBox(k)
        return box.w === w && box.h === h
      })
      expect(key).toBeDefined()
      const want = objectSize(key, base)
      expect(Number.parseFloat(svg.getAttribute('width'))).toBeCloseTo(
        want.w,
        3,
      )
      expect(Number.parseFloat(svg.getAttribute('height'))).toBeCloseTo(
        want.h,
        3,
      )
    }
    // Both surfaces the shelf's objects wear are defined on the page: the
    // columns' bark and the discs' pits (Curiosity.jsx).
    expect(container.querySelector('#curio-bark-vertical')).not.toBeNull()
    expect(container.querySelector('#curio-pores-sunken')).not.toBeNull()
  })

  it('leads back to the habits', () => {
    const onBack = vi.fn()
    render(<DesignPage onBack={onBack} />)
    screen.getByRole('button', { name: /back to the habits/i }).click()
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
