// A friend, drawn for real: the component every screen goes through.
//
// The test that matters most here is the CANON one. Kimia's rule is that the
// ten hold their proportions "everywhere and always", and the way this
// component keeps it is by refusing to take a size at all — a screen hands it
// a base and the canon decides the rest. So the test asks for the whole cast
// at one base and checks the widths against friendCanon.js exactly.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FRIEND_CATEGORIES } from '../game/constants.js'
import Friend from './Friend.jsx'
import { FRIEND_CANON } from './friendCanon.js'

afterEach(cleanup)

const draw = (props) =>
  render(<Friend worldSeed="a seed" base={10} {...props} />).container

// The body layer's painted shades, which is where an individual's colour shows.
const bodyFills = (container) =>
  [
    ...container
      .querySelectorAll('.friend-art-layer')[0]
      .querySelectorAll('path'),
  ]
    .map((path) => path.getAttribute('fill'))
    .join(' ')

describe('a friend', () => {
  it('draws the body and the eyes as two stacked layers', () => {
    // The split is load-bearing: a blink may never re-blur the whole aura.
    const container = draw({ category: 0, individual: 1 })
    expect(container.querySelectorAll('.friend-art-layer')).toHaveLength(2)
  })

  it('stands at its canonical size against the rest of the cast', () => {
    for (const [index, { key }] of FRIEND_CATEGORIES.entries()) {
      const container = draw({ category: index, individual: 1 })
      const width = container.querySelector('.friend-art').style.width
      expect(parseFloat(width)).toBeCloseTo(FRIEND_CANON[key] * 10, 5)
      cleanup()
    }
  })

  it('keeps the drawing its own shape, whatever width it is given', () => {
    const container = draw({ category: 0, individual: 1 })
    // The artwork's own canvas decides the height, so nothing is ever squashed.
    expect(container.querySelector('.friend-art').style.aspectRatio).toMatch(
      /^[\d.]+ \/ [\d.]+$/,
    )
  })

  it('gives two of a species different colours, and one of them the same colour twice', () => {
    const first = bodyFills(draw({ category: 0, individual: 1 }))
    cleanup()
    const sibling = bodyFills(draw({ category: 0, individual: 2 }))
    cleanup()
    const again = bodyFills(draw({ category: 0, individual: 1 }))
    expect(sibling).not.toEqual(first)
    expect(again).toEqual(first)
  })

  it('deals a different hand in a different world', () => {
    // The colours are seeded from the world seed, so two players' first plips
    // are very unlikely to match — and a save always deals itself the same hand.
    const here = bodyFills(draw({ category: 0, individual: 1 }))
    cleanup()
    const elsewhere = bodyFills(
      render(
        <Friend category={0} individual={1} worldSeed="another" base={10} />,
      ).container,
    )
    expect(elsewhere).not.toEqual(here)
  })

  it('keeps two friends on one page from borrowing each other ids', () => {
    // Two drawings sharing an id would have one wear the other's glow filter.
    const container = draw({ category: 0, individual: 1, idPrefix: 'here-' })
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id)
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) expect(id.startsWith('here-plip-1-')).toBe(true)
  })

  it('carries the classes its screen gives it', () => {
    const container = draw({ category: 0, individual: 1, className: 'x-anim' })
    expect(container.querySelector('.friend-art').classList).toContain('x-anim')
  })

  it('draws nothing at all for a category that does not exist', () => {
    const container = draw({ category: 99, individual: 1 })
    expect(container.querySelector('.friend-art')).toBeNull()
  })
})
