// The full firework (T5.2e, design-notes §5). Which MOMENTS get one is
// Cameo.test.jsx's business; these tests cover the burst itself — the
// star composition Kimia settled on 2026-08-16, and the one property
// that makes a firework a firework rather than a bigger shimmer: every
// star launches from the middle and travels OUTWARD.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Firework from './firework.jsx'

afterEach(cleanup)

const stars = (container) => [...container.querySelectorAll('.firework-star')]

// Read off the style ATTRIBUTE rather than the parsed style: the colours
// are var() references to tokens.css, and no stylesheet is loaded here
// to resolve them.
const styleOf = (star) => star.getAttribute('style') ?? ''

// A star's --fly-x/--fly-y: where it starts, relative to where it ends.
const flightOf = (star) => ({
  x: Number(styleOf(star).match(/--fly-x:\s*(-?[\d.]+)px/)[1]),
  y: Number(styleOf(star).match(/--fly-y:\s*(-?[\d.]+)px/)[1]),
})

describe('the cameo firework (§5)', () => {
  it('is the shimmer’s bigger sibling — more stars, same night sky', () => {
    const { container } = render(<Firework />)
    const all = stars(container)
    // Bigger than the shimmer's twelve; the exact count is design, not
    // contract, so this only pins "a burst, not a sprinkle".
    expect(all.length).toBeGreaterThan(12)

    // Mostly dots, sparkles as accents — the "it's giving Las Vegas"
    // correction of 2026-08-13, inherited.
    const sparkles = all.filter((star) => star.querySelector('path'))
    const dots = all.filter((star) => star.querySelector('circle'))
    expect(sparkles.length).toBeGreaterThan(0)
    expect(dots.length).toBeGreaterThan(sparkles.length * 2)

    // Half white, half across the six charms (Kimia, 2026-08-16).
    const white = all.filter((s) => styleOf(s).includes('--shimmer-star'))
    const charm = all.filter((s) => styleOf(s).includes('--charm-'))
    expect(white.length).toBe(charm.length)
    expect(white.length + charm.length).toBe(all.length)
  })

  it('spends its colour across all six charms, not two favourites', () => {
    const { container } = render(<Firework />)
    const charms = ['crown', 'cherry', 'shell', 'anchor', 'shield', 'key']
    for (const charm of charms) {
      const wearing = stars(container).filter((star) =>
        styleOf(star).includes(`--charm-${charm}`),
      )
      expect(wearing.length, `stars wearing ${charm}`).toBeGreaterThan(0)
    }
  })

  it('launches every star from the middle, so the burst travels outward', () => {
    const { container } = render(<Firework />)
    for (const star of stars(container)) {
      const style = styleOf(star)
      // Where it ends up, as a percentage of the cameo it rings.
      const left = Number(style.match(/left:\s*(-?[\d.]+)%/)[1])
      const top = Number(style.match(/top:\s*(-?[\d.]+)%/)[1])
      const flight = flightOf(star)

      // A star resting to the RIGHT of centre must start to its own
      // left, and so on: the offset always points back at the middle.
      // That is the whole geometry, and getting the sign wrong would
      // make the burst implode instead — which no test of counts or
      // colours would ever catch.
      if (left > 50) expect(flight.x).toBeLessThan(0)
      if (left < 50) expect(flight.x).toBeGreaterThan(0)
      if (top > 50) expect(flight.y).toBeLessThan(0)
      if (top < 50) expect(flight.y).toBeGreaterThan(0)
    }
  })

  it('sends every star the same distance', () => {
    // Travel is absolute, not proportional (firework.jsx): the burst
    // carries the same distance whether the message ran to one line or
    // two. Every star therefore shares one flight length.
    const { container } = render(<Firework />)
    const lengths = stars(container).map((star) => {
      const { x, y } = flightOf(star)
      return Math.round(Math.hypot(x, y))
    })
    expect(new Set(lengths).size).toBe(1)
  })

  it('is decoration only — no words, and hidden from screen readers', () => {
    const { container } = render(<Firework />)
    const burst = container.querySelector('.firework')
    expect(burst.getAttribute('aria-hidden')).toBe('true')
    expect(burst.textContent).toBe('')
    // Nothing in it is pressable, so it can never come between a finger
    // and the habit list underneath.
    expect(burst.querySelector('button, a, input')).toBeNull()
  })
})
