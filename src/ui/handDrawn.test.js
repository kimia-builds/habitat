import { describe, test, expect } from 'vitest'
import { wobblyRect, wobblyEllipse, wobblyBlob } from './handDrawn.js'

// KIMIA'S RULE (2026-09-01): "for all of our designs, the lines should not be
// dead straight but rather hand-drawn" — and, asked which of two readings she
// meant, ORGANIC WOBBLE RATHER THAN SKETCHY. Both halves of that are testable
// and both are tested here: an edge that deviates (or the rule is not kept),
// drawn entirely in curves (or the Design Genome's ban on a hand-sketched
// world is broken).

// Every point a path visits — the anchors and the control points alike, since
// a control point pulled miles out is a bulge too.
function pointsIn(d) {
  return [...d.matchAll(/(-?\d+\.\d+),(-?\d+\.\d+)/g)].map((m) => ({
    x: Number(m[1]),
    y: Number(m[2]),
  }))
}

// The anchors only: the end point of each cubic, plus the opening move.
function anchorsIn(d) {
  const move = d.match(/^M(-?\d+\.\d+),(-?\d+\.\d+)/)
  const ends = [...d.matchAll(/ (-?\d+\.\d+),(-?\d+\.\d+)(?=C|Z)/g)]
  return [
    { x: Number(move[1]), y: Number(move[2]) },
    ...ends.map((m) => ({ x: Number(m[1]), y: Number(m[2]) })),
  ]
}

const SHAPES = {
  wobblyRect: () => wobblyRect({ w: 40, h: 300, r: 14, seed: 77, amp: 2.5 }),
  wobblyEllipse: () => wobblyEllipse({ w: 200, h: 150, seed: 5, amp: 2 }),
  wobblyBlob: () => wobblyBlob({ w: 250, h: 250, seed: 9 }),
}

describe.each(Object.keys(SHAPES))('%s', (name) => {
  const make = SHAPES[name]

  test('is one closed shape drawn only in curves', () => {
    // The whole outline is M + cubics + Z: no L, no H, no V, no arc. This is
    // what keeps the wobble from ever reading as a sketch — whatever the
    // points do, what gets DRAWN between them is a curve.
    const d = make()
    expect(d.startsWith('M')).toBe(true)
    expect(d.endsWith('Z')).toBe(true)
    expect(/[LHVAQSTlhvaqst]/.test(d)).toBe(false)
    expect(d.split('C').length - 1).toBeGreaterThan(8)
  })

  test('is the same shape every time, from its seed alone', () => {
    // No render-time randomness: a curiosity looks the same on the shelf and
    // in the Abode, and after a reload. ObjectGlyph.jsx's rule, kept.
    expect(make()).toBe(make())
  })

  test('is a different shape under a different seed', () => {
    const a = wobblyEllipse({ w: 200, h: 150, seed: 1 })
    const b = wobblyEllipse({ w: 200, h: 150, seed: 2 })
    expect(a).not.toBe(b)
  })
})

describe('wobblyRect — the columns', () => {
  test('has no dead straight edge', () => {
    // The rule itself. Down the long right-hand side of a 40x300 column, the
    // anchors must NOT all share one x — which is exactly what a plain
    // rectangle (or a `border-radius` box) would give.
    const d = wobblyRect({ w: 40, h: 300, r: 14, seed: 77, amp: 2.5 })
    const rightSide = anchorsIn(d).filter(
      (p) => p.x > 30 && p.y > 40 && p.y < 260,
    )
    expect(rightSide.length).toBeGreaterThan(10)
    const xs = rightSide.map((p) => p.x)
    const spread = Math.max(...xs) - Math.min(...xs)
    expect(spread).toBeGreaterThan(1)
  })

  test('keeps the wobble inside the amplitude it was given', () => {
    // Not dead straight, but not a squiggle either: an edge that wandered
    // further than it was told would stop the column being a column.
    const amp = 2.5
    const d = wobblyRect({ w: 40, h: 300, r: 14, seed: 77, amp })
    for (const p of pointsIn(d)) {
      expect(p.x).toBeGreaterThan(-amp * 2)
      expect(p.x).toBeLessThan(40 + amp * 2)
      expect(p.y).toBeGreaterThan(-amp * 2)
      expect(p.y).toBeLessThan(300 + amp * 2)
    }
  })

  test('turns the corners rather than cutting them', () => {
    // "curve the edges rather than having sharp corners." With a radius of 14
    // on a 40-wide column, nothing may sit in the square corner itself.
    const d = wobblyRect({ w: 40, h: 300, r: 14, seed: 77, amp: 0 })
    const inCorner = anchorsIn(d).filter((p) => p.x < 3 && p.y < 3)
    expect(inCorner).toHaveLength(0)
  })

  test('clamps a radius too big for the box instead of folding it', () => {
    // The 10-wide column asks for a radius larger than half its width; the
    // ends come out fully round rather than the outline turning inside out.
    // (Checked on the ANCHORS — the curve passes through those. A spline's
    // control points sit a little outside a tight arc by construction, which
    // is what gives the corner its roundness rather than a fold.)
    const d = wobblyRect({ w: 10, h: 60, r: 999, seed: 1, amp: 0 })
    expect(pointsIn(d).every((p) => Number.isFinite(p.x))).toBe(true)
    for (const p of anchorsIn(d)) {
      expect(p.x).toBeGreaterThanOrEqual(-0.01)
      expect(p.x).toBeLessThanOrEqual(10.01)
    }
  })

  test('gives the same hand to a small box as to a large one', () => {
    // The amplitude is a SIZE, not a percentage (objectCanon.js says why): two
    // columns of one family are drawn by one hand, not photographed at two
    // zooms. So a box twice as tall wanders by the same NUMBER OF UNITS, and
    // in particular not twice as far.
    const amp = 2
    const wander = (h) =>
      Math.max(
        ...anchorsIn(wobblyRect({ w: 40, h, r: 6, seed: 3, amp }))
          .filter((p) => p.x > 20 && p.y > 20 && p.y < h - 20)
          .map((p) => Math.abs(p.x - 40)),
      )
    for (const h of [300, 600, 1200]) {
      expect(wander(h)).toBeLessThanOrEqual(amp + 0.01)
      expect(wander(h)).toBeGreaterThan(amp * 0.4)
    }
  })

  test('gives the same hand the same WAVELENGTH at any size', () => {
    // The other half of it. Points are spaced a fixed number of units apart,
    // so a box twice as tall gets about twice as many of them — rather than
    // the same count stretched, which would make the large column's waves
    // twice as long as the small one's and give the pair away.
    const count = (h) =>
      anchorsIn(wobblyRect({ w: 40, h, r: 6, seed: 3 })).length
    // Twice the extra height, twice the extra points.
    const ratio = (count(600) - count(300)) / (count(300) - count(150))
    expect(ratio).toBeGreaterThan(1.8)
    expect(ratio).toBeLessThan(2.2)
  })
})

describe('wobblyBlob — the stones', () => {
  test('is lumpier than an oval, at more than one scale', () => {
    // "organic random blob shapes": the lobes make one side bulge and another
    // draw in, so the distance from the centre must vary far more than the
    // fine wobble alone would manage.
    const radii = (d) =>
      anchorsIn(d).map((p) => Math.hypot(p.x - 125, p.y - 125))
    const blob = radii(wobblyBlob({ w: 250, h: 250, seed: 9 }))
    const oval = radii(wobblyEllipse({ w: 250, h: 250, seed: 9, amp: 1.6 }))
    const range = (xs) => Math.max(...xs) - Math.min(...xs)
    expect(range(blob)).toBeGreaterThan(range(oval) * 3)
  })

  test('stays a blob rather than becoming a flower', () => {
    // Three slow harmonics, so no lobe may swing the outline past half again
    // its own radius — a stone, not a star.
    const d = wobblyBlob({ w: 250, h: 250, seed: 9 })
    for (const p of anchorsIn(d)) {
      const r = Math.hypot(p.x - 125, p.y - 125)
      expect(r).toBeGreaterThan(125 * 0.6)
      expect(r).toBeLessThan(125 * 1.4)
    }
  })
})
