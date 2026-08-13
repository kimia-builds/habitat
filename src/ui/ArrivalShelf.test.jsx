// The arrival shelf's star-shimmer (T5.2e, design-notes §5).
//
// The shimmer is decoration — it has no words and no role — so these
// assert its STRUCTURE (CLAUDE.md: roles, counts, behaviour): whether a
// given arrival carries a shimmer at all, and the delays that make
// several of them cascade rather than flash together. Nothing here
// touches Kimia's content, and the one test that needs a friend blanks
// the name slots through the fixture rather than reading what she wrote.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ArrivalShelf from './ArrivalShelf.jsx'
import { SHIMMER_STAGGER_MS } from './shimmer.jsx'
import { blankAllNames, restoreNames } from '../test/nameFixture.js'

afterEach(() => {
  cleanup()
  restoreNames()
})

const shelf = (arrivals) =>
  render(
    <ArrivalShelf
      arrivals={arrivals}
      worldSeed={1}
      headerHeight={0}
      onExpire={vi.fn()}
      onDecide={vi.fn()}
      onRead={vi.fn()}
    />,
  )

// The delay each arrival's shimmer starts at: read off its FIRST star,
// whose own offset in the table is zero, so what is left is the delay
// the shelf handed the whole group.
const startDelays = (container) =>
  [...container.querySelectorAll('.shimmer')].map((shimmer) =>
    shimmer.querySelector('.shimmer-star').style.animationDelay.trim(),
  )

describe('the star-shimmer on a landing drop (§5)', () => {
  it('shimmers an everyday drop', () => {
    const { container } = shelf([{ id: 'a1', key: 'flora', status: 'pending' }])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(1)
    // The stars are decoration and must stay out of the reading order.
    expect(
      container.querySelector('.shimmer').getAttribute('aria-hidden'),
    ).toBe('true')
  })

  it('leaves a first-occurrence find to its reveal', () => {
    // A drop that still owes a reveal gets the firework, not a shimmer.
    const { container } = shelf([
      { id: 'a1', key: 'flora', status: 'pending', awaitingReveal: true },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(0)
  })

  it('leaves a friend arrival to its reveal', () => {
    blankAllNames()
    const { container } = shelf([
      {
        id: 'a1',
        key: 'friend',
        friend: { category: 0, individual: 1 },
        awaitingReveal: true,
      },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(0)
  })

  it('still leaves a friend alone once their reveal has been seen', () => {
    // `awaitingReveal` turns false the moment the reveal is dismissed.
    // The friend keeps lingering on the shelf, and must NOT sparkle then
    // — the firework it just had was the whole moment.
    blankAllNames()
    const { container } = shelf([
      {
        id: 'a1',
        key: 'friend',
        friend: { category: 0, individual: 1 },
        awaitingReveal: false,
      },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(0)
  })

  it('cascades drops that land together, newest first', () => {
    // Three at once — a check-in closing. The newest sits on top and
    // sparkles at once; each one below starts a stagger later.
    const { container } = shelf([
      { id: 'a1', key: 'flora', status: 'pending' },
      { id: 'a2', key: 'novel' },
      { id: 'a3', key: 'fungi', amount: 3 },
    ])
    expect(startDelays(container)).toEqual([
      '0ms',
      `${SHIMMER_STAGGER_MS}ms`,
      `${SHIMMER_STAGGER_MS * 2}ms`,
    ])
  })

  it('gives a drop landing on its own no delay at all', () => {
    const { container } = shelf([{ id: 'a1', key: 'fungi', amount: 1 }])
    expect(startDelays(container)).toEqual(['0ms'])
  })

  it('does not set a second shimmer off when a reveal is dismissed', () => {
    // Same arrival, re-rendered after its reveal was seen. Whether it
    // shimmers is decided when it LANDS, so this one never does — the
    // alternative would fire a sparkle straight after the firework.
    const first = { id: 'a1', key: 'flora', status: 'pending' }
    const { container, rerender } = shelf([{ ...first, awaitingReveal: true }])
    rerender(
      <ArrivalShelf
        arrivals={[{ ...first, awaitingReveal: false }]}
        worldSeed={1}
        headerHeight={0}
        onExpire={vi.fn()}
        onDecide={vi.fn()}
        onRead={vi.fn()}
      />,
    )
    expect(container.querySelectorAll('.shimmer')).toHaveLength(0)
  })
})
