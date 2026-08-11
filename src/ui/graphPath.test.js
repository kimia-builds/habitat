// The graph line's corner rounding (2026-08-11). Pure geometry, so it is
// tested like the game modules: what matters is that the line still goes
// where the data says, and only the corners move.

import { describe, expect, it } from 'vitest'

import { roundedPath } from './graphPath.js'

// Pull every coordinate pair out of a path string, in order.
const coords = (d) =>
  [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => ({
    x: Number(m[1]),
    y: Number(m[2]),
  }))

describe('roundedPath', () => {
  it('says nothing about no points, and one point is a lone move', () => {
    expect(roundedPath([])).toBe('')
    expect(roundedPath([{ x: 3, y: 4 }])).toBe('M 3 4')
  })

  it('keeps the first and last readings exactly where they are', () => {
    const points = [
      { x: 0, y: 100 },
      { x: 50, y: 20 },
      { x: 100, y: 80 },
    ]
    const drawn = coords(roundedPath(points, 6))
    expect(drawn[0]).toEqual({ x: 0, y: 100 })
    expect(drawn[drawn.length - 1]).toEqual({ x: 100, y: 80 })
  })

  it('a straight run stays straight — a corner is only drawn at a turn', () => {
    // Three points on one line: the "corner" is rounded, but rounding a
    // straight line moves nothing, so every coordinate still sits on it.
    const d = roundedPath(
      [
        { x: 0, y: 10 },
        { x: 10, y: 10 },
        { x: 20, y: 10 },
      ],
      4,
    )
    for (const point of coords(d)) expect(point.y).toBe(10)
  })

  it('rounds a turn without moving further from it than the radius', () => {
    const corner = { x: 50, y: 0 }
    const d = roundedPath([{ x: 0, y: 0 }, corner, { x: 100, y: 0 }], 6)
    // The curve leaves and rejoins the line 6 away from the corner…
    expect(d).toContain('L 44 0')
    expect(d).toContain('Q 50 0 56 0')
    // …and no drawn point is further from the corner than that.
    const near = coords(d).filter((p) => Math.abs(p.x - corner.x) < 20)
    for (const point of near)
      expect(Math.abs(point.x - corner.x)).toBeLessThanOrEqual(6)
  })

  it('shrinks the rounding on short segments instead of overshooting', () => {
    // Points 2 apart cannot be rounded by 6: the cut is capped at half a
    // segment (1), so the curve never reaches past its neighbours.
    const d = roundedPath(
      [
        { x: 0, y: 0 },
        { x: 2, y: 10 },
        { x: 4, y: 0 },
      ],
      6,
    )
    for (const point of coords(d)) {
      expect(point.x).toBeGreaterThanOrEqual(0)
      expect(point.x).toBeLessThanOrEqual(4)
    }
  })

  it('survives a repeated reading without drawing nonsense', () => {
    const d = roundedPath(
      [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 10, y: 10 },
        { x: 20, y: 0 },
      ],
      4,
    )
    expect(d).not.toContain('NaN')
  })
})
