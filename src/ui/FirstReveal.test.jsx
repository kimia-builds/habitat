// Tests for the reveal pop-up reading its words from the narration
// slots (T3.4). App.test.jsx already proves the reveals appear at the
// right moments; here we pin that the words on screen are exactly the
// slots' — and that an EMPTY slot renders gracefully: the pop-up still
// shows its glyph and button, with simply no text where none exists.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NARRATION } from '../content/narration.js'
import FirstReveal from './FirstReveal.jsx'
import { FLORA_CANON } from './floraCanon.js'
import { floraIdentity } from './floraDeal.js'

afterEach(cleanup)

describe('first-occurrence reveals read from narration slots (T3.4)', () => {
  it('shows each reveal with its slot title and line', () => {
    for (const key of ['flora', 'magazine', 'novel', 'dictionary', 'fungi']) {
      const { unmount } = render(
        <FirstReveal
          arrival={{ key, completionId: 'c1' }}
          worldSeed="seed"
          onDismiss={() => {}}
        />,
      )
      const slots = NARRATION.firstReveals[key]
      expect(screen.getByRole('dialog', { name: slots.title })).toBeDefined()
      expect(screen.getByText(slots.line)).toBeDefined()
      unmount()
    }
  })

  it('renders gracefully when both slots are empty — glyph and button, no text', () => {
    const original = { ...NARRATION.firstReveals.flora }
    NARRATION.firstReveals.flora.title = ''
    NARRATION.firstReveals.flora.line = ''
    try {
      render(
        <FirstReveal
          arrival={{ key: 'flora', completionId: 'c1' }}
          worldSeed="seed"
          onDismiss={() => {}}
        />,
      )
      // The pop-up is still there and still usable…
      const dialog = screen.getByRole('dialog', { name: 'a first arrival' })
      expect(dialog.querySelector('.reveal-flora-art')).not.toBeNull()
      expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
      // …but nothing stands in for the missing words.
      expect(dialog.querySelector('.reveal-title')).toBeNull()
      expect(dialog.querySelector('.reveal-line')).toBeNull()
    } finally {
      Object.assign(NARRATION.firstReveals.flora, original)
    }
  })

  it('the dismiss button still works with empty slots', () => {
    const original = { ...NARRATION.firstReveals.novel }
    NARRATION.firstReveals.novel.title = ''
    NARRATION.firstReveals.novel.line = ''
    try {
      const onDismiss = vi.fn()
      render(<FirstReveal arrival={{ key: 'novel' }} onDismiss={onDismiss} />)
      fireEvent.click(screen.getByRole('button', { name: 'onward' }))
      expect(onDismiss).toHaveBeenCalled()
    } finally {
      Object.assign(NARRATION.firstReveals.novel, original)
    }
  })
})

// T5.3i — the first flora she ever meets is the real plant, at the canon's
// size. This screen shows one drop and nothing beside it, and only flora among
// the living things reach it, so it sizes from the smallest FLORA.
describe('the first flora is the real drawing (T5.3i)', () => {
  it('draws the find it was dealt, at its canon size', () => {
    const { container } = render(
      <FirstReveal
        arrival={{ key: 'flora', completionId: 'c1' }}
        worldSeed="seed"
        onDismiss={() => {}}
      />,
    )
    const svg = container.querySelector('.reveal-flora-art')
    expect(svg).not.toBeNull()
    const { silhouette, sizeClass } = floraIdentity('c1', 'seed')
    expect(svg.getAttribute('viewBox')).toBe(
      `0 0 ${silhouette.viewBox.w} ${silhouette.viewBox.h}`,
    )
    // A SMALL find arrives at the 4rem the placeholder sprig stood at; a large
    // one arrives 2.75x that, because the canon says so and this screen may
    // not say otherwise.
    expect(parseFloat(svg.getAttribute('height'))).toBeCloseTo(
      (FLORA_CANON[sizeClass] / FLORA_CANON.small) * 4,
      5,
    )
  })

  it('leaves the drops with no canon on the shared glyph', () => {
    const { container } = render(
      <FirstReveal
        arrival={{ key: 'fungi', completionId: 'c1' }}
        worldSeed="seed"
        onDismiss={() => {}}
      />,
    )
    expect(container.querySelector('.reveal-glyph')).not.toBeNull()
    expect(container.querySelector('.reveal-flora-art')).toBeNull()
  })
})
