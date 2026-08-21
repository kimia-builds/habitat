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
import { FLORA_CANON } from './floraCanon.js'
import { floraIdentity } from './floraDeal.js'
import { baseWhereSmallestIs } from './friendCanon.js'

afterEach(() => {
  cleanup()
  restoreNames()
})

const shelf = (arrivals) =>
  render(
    <ArrivalShelf
      arrivals={arrivals}
      worldSeed="seed"
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
    const { container } = shelf([
      { id: 'a1', completionId: 'a1', key: 'flora', status: 'pending' },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(1)
    // The stars are decoration and must stay out of the reading order.
    expect(
      container.querySelector('.shimmer').getAttribute('aria-hidden'),
    ).toBe('true')
  })

  it('wears the night sky rather than a fairground', () => {
    // Kimia's call after seeing the first build (2026-08-13): the ring
    // is mostly the sky's DOTS with a couple of four-pointed sparkles
    // left as accents, and it is half white, half charm-coloured. Both
    // halves are pinned decisions, so both are worth failing over.
    const { container } = shelf([
      { id: 'a1', completionId: 'a1', key: 'flora', status: 'pending' },
    ])
    const stars = [...container.querySelectorAll('.shimmer-star')]
    const dots = stars.filter((s) => s.querySelector('circle'))
    const sparkles = stars.filter((s) => s.querySelector('path'))
    expect(sparkles.length).toBeGreaterThan(0)
    expect(dots.length).toBeGreaterThan(sparkles.length * 2)

    // Read off the style ATTRIBUTE rather than the parsed style: these
    // are var() references to tokens.css, and no stylesheet is loaded
    // here to resolve them into colours.
    const styles = stars.map((s) => s.getAttribute('style') ?? '')
    const white = styles.filter((s) => s.includes('--shimmer-star')).length
    const charm = styles.filter((s) => s.includes('--charm-')).length
    expect(white).toBe(charm)
    expect(white + charm).toBe(stars.length)
  })

  it('holds a first-occurrence find’s shimmer back until its reveal is gone', () => {
    // A drop still owing a reveal is hidden behind a full-screen
    // overlay, so a shimmer now would burn out where nobody can see it.
    const { container } = shelf([
      {
        id: 'a1',
        completionId: 'a1',
        key: 'flora',
        status: 'pending',
        awaitingReveal: true,
      },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(0)
  })

  it('holds a friend arrival’s shimmer back the same way', () => {
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

  it('sparkles a friend once their reveal has been seen', () => {
    // Kimia's call 2026-08-16: EVERY arrival shimmers. The firework left
    // the reveals for the cameo, so without this the biggest arrivals
    // would be the only ones landing on the shelf without a sparkle.
    blankAllNames()
    const { container } = shelf([
      {
        id: 'a1',
        key: 'friend',
        friend: { category: 0, individual: 1 },
        awaitingReveal: false,
      },
    ])
    expect(container.querySelectorAll('.shimmer')).toHaveLength(1)
  })

  it('cascades drops that land together, newest first', () => {
    // Three at once — a check-in closing. The newest sits on top and
    // sparkles at once; each one below starts a stagger later.
    const { container } = shelf([
      { id: 'a1', completionId: 'a1', key: 'flora', status: 'pending' },
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

  it('sets the shimmer off when a reveal is dismissed', () => {
    // Same arrival, re-rendered after its reveal was seen. This is the
    // exact moment the arrival becomes visible, so it is the moment the
    // stars should play — the shimmer mounts here, not on landing.
    const first = {
      id: 'a1',
      completionId: 'a1',
      key: 'flora',
      status: 'pending',
    }
    const { container, rerender } = shelf([{ ...first, awaitingReveal: true }])
    rerender(
      <ArrivalShelf
        arrivals={[{ ...first, awaitingReveal: false }]}
        worldSeed="seed"
        headerHeight={0}
        onExpire={vi.fn()}
        onDecide={vi.fn()}
        onRead={vi.fn()}
      />,
    )
    expect(container.querySelectorAll('.shimmer')).toHaveLength(1)
  })
})

// T5.3i — the living things on the shelf are the real drawings, and the one
// thing that must hold between them: a flora and a friend landing on the same
// shelf are true to each other, because both come from one base in one scale.
// Ratios only; never a pixel size, so tuning the shelf's base stays free.
describe('the real flora and friends on the shelf (T5.3i)', () => {
  const rem = (value) => parseFloat(value)
  // The base the shelf picks, derived the way the component derives it —
  // sized up from the smallest friend — rather than typed in here.
  const SHELF_BASE = baseWhereSmallestIs(1.5)

  it('draws an arriving flora as the flora it is, not one shared glyph', () => {
    const { container } = shelf([
      { id: 'a1', completionId: 'c1', key: 'flora', status: 'pending' },
      { id: 'a2', completionId: 'c2', key: 'flora', status: 'pending' },
    ])
    // Newest sits on top, so the shelf reverses: c2 is drawn first.
    const drawn = [...container.querySelectorAll('.arrival-flora-art')]
    expect(drawn).toHaveLength(2)
    for (const [svg, id] of [
      [drawn[0], 'c2'],
      [drawn[1], 'c1'],
    ]) {
      const { silhouette, sizeClass } = floraIdentity(id, 'seed')
      // The shape on screen is the one this find was dealt…
      expect(svg.getAttribute('viewBox')).toBe(
        `0 0 ${silhouette.viewBox.w} ${silhouette.viewBox.h}`,
      )
      // …and its height is the canon's share of the shelf's base, which is
      // the same base for both. Divide the two and the base cancels out,
      // leaving the ratio the canon promises.
      const base = rem(svg.getAttribute('height')) / FLORA_CANON[sizeClass]
      expect(base).toBeCloseTo(SHELF_BASE, 5)
    }
  })

  it('measures a friend and a flora on one shelf against one base', () => {
    const { container } = shelf([
      { id: 'a1', completionId: 'c1', key: 'flora', status: 'pending' },
      {
        id: 'a2',
        completionId: 'c2',
        key: 'friend',
        friend: { category: 8, individual: 1 },
      },
    ])
    const flora = container.querySelector('.arrival-flora-art')
    const friend = container.querySelector('.friend-art')
    const { sizeClass } = floraIdentity('c1', 'seed')
    // The chitu's canon number is 1 — the scale's own anchor — so the base
    // this shelf chose IS its width, and the flora must be its canon share
    // of exactly that.
    const base = rem(friend.style.width)
    expect(rem(flora.getAttribute('height'))).toBeCloseTo(
      FLORA_CANON[sizeClass] * base,
      5,
    )
  })
})
