/*
 * handDrawn.js — outlines that are not dead straight (T5.3j, Kimia 2026-09-01)
 * =============================================================================
 * "for all of our designs, the lines should not be dead straight but rather
 * hand-drawn."
 *
 * WHAT THAT MEANS HERE, EXACTLY. Asked which of two readings she wanted, Kimia
 * chose ORGANIC WOBBLE, NOT SKETCHY: an edge that is irregular and slightly
 * uneven, with nothing ruler-straight or machine-perfect about it — but no
 * visible pencil stroke, no sketch line, no drawn-twice look. That distinction
 * is not a nicety, it is what keeps this inside the Design Genome, whose NEVER
 * list forbids making the world "feel hand-sketched or illustrated (except
 * charms, icons and the map)" while §4's shape language asks for "rounded ·
 * blob-like · soft silhouettes · few straight lines". A wobbled edge satisfies
 * the second without breaking the first; a sketched one would break both.
 *
 * SO EVERY OUTLINE IN HERE IS SMOOTH. The wobble is in WHERE the edge goes, not
 * in how it is stroked: points are pushed a little off the perfect shape and
 * then run through a spline, so the result is one continuous soft curve that
 * simply refuses to be a straight line. Nothing here ever emits a stroke.
 *
 * THE THREE SHAPES, and the one generator under them:
 *
 *     wobblyRect(...)     a rectangle with curved corners  → the columns
 *     wobblyEllipse(...)  an oval                          → the discs, the smoke
 *     wobblyBlob(...)     an oval with lobes               → the stones
 *
 * All three build a ring of points, nudge each point along its own outward
 * normal, and close the ring with a Catmull-Rom spline. Only the ring differs.
 *
 * THE WOBBLE IS A SIZE, NOT A PERCENTAGE — the same rule the textures keep
 * (objectCanon.js explains why at length). `amp` is in drawing units, so a
 * small object and a large one wear the SAME unevenness rather than the large
 * one wearing a magnified copy of it. Two things of one family standing side by
 * side must look like they were drawn by one hand on one day.
 *
 * SEEDED, NEVER RANDOM AT RENDER TIME. A shape is a pure function of its seed,
 * so it is the same shape on every render, on the shelf and in the Abode alike
 * — the rule ObjectGlyph.jsx and floraDeal.js already keep.
 * =========================================================================== */

// The repo's usual deterministic RNG. It is a local copy, as it already is in
// sky.jsx, textures.jsx and planet.jsx — the drawing files each keep their own
// rather than sharing a utility module.
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/*
 * THE WOBBLE ITSELF — one offset per point, in drawing units.
 *
 * Raw random numbers would give a sawtooth: every point pulled a different way
 * from its neighbour, which reads as noise or as a jagged edge, not as a hand.
 * A hand drifts. So the raw values are smoothed AROUND THE RING a few times —
 * a rolling average of each value with its two neighbours, wrapping at the
 * join so the loop has no seam — which leaves long gentle deviations of a
 * couple of units instead of per-point spikes.
 *
 * Smoothing shrinks the range as well as the spikes, so the result is
 * renormalised back to ±amp afterwards; otherwise turning the smoothing up
 * would quietly turn the wobble off.
 */
function wobbleOffsets(count, seed, amp, passes = 3) {
  const rng = mulberry32(seed)
  let v = Array.from({ length: count }, () => rng() * 2 - 1)
  for (let p = 0; p < passes; p += 1) {
    const next = v.map(
      (_, i) =>
        (v[(i - 1 + count) % count] + v[i] * 2 + v[(i + 1) % count]) / 4,
    )
    v = next
  }
  const peak = Math.max(...v.map(Math.abs), 1e-6)
  return v.map((x) => (x / peak) * amp)
}

/*
 * A CLOSED SMOOTH PATH THROUGH POINTS — Catmull-Rom, written out as cubic
 * Béziers because SVG has no spline of its own. `tension` 0 is the standard
 * curve; higher numbers pull it tighter towards the points.
 *
 * This is what keeps the wobble from ever looking sketched: whatever the points
 * do, what gets drawn between them is a curve.
 */
function closedSpline(points, tension = 0) {
  const n = points.length
  const k = (1 - tension) / 6
  const at = (i) => points[(i + n) % n]
  let d = `M${at(0).x.toFixed(2)},${at(0).y.toFixed(2)}`
  for (let i = 0; i < n; i += 1) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const c1x = p1.x + (p2.x - p0.x) * k
    const c1y = p1.y + (p2.y - p0.y) * k
    const c2x = p2.x - (p3.x - p1.x) * k
    const c2y = p2.y - (p3.y - p1.y) * k
    d +=
      `C${c1x.toFixed(2)},${c1y.toFixed(2)}` +
      ` ${c2x.toFixed(2)},${c2y.toFixed(2)}` +
      ` ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
  }
  return `${d}Z`
}

// Push every point of a ring along its own outward normal and close it.
function wobbled(ring, seed, amp, tension) {
  const offsets = wobbleOffsets(ring.length, seed, amp)
  return closedSpline(
    ring.map((p, i) => ({
      x: p.x + p.nx * offsets[i],
      y: p.y + p.ny * offsets[i],
    })),
    tension,
  )
}

// How many points a ring of this perimeter gets. Spacing is a SIZE, like the
// amplitude and for the same reason: the wobble on a tall column and on a short
// one must have the same wavelength, or the small one looks like a shrunken
// photograph of the large one instead of its sibling.
const RING_SPACING = 9
function ringCount(perimeter, min) {
  return Math.max(min, Math.round(perimeter / RING_SPACING))
}

/* -----------------------------------------------------------------------------
 * A RECTANGLE WITH CURVED CORNERS — Kimia's columns. "curve the edges rather
 * than having sharp corners."
 *
 * The ring walks the four edges and the four corner arcs, so a corner is a real
 * quarter-round rather than `border-radius` (which cannot be wobbled, and which
 * blob.jsx already found flattens a long thin box into a pill).
 * --------------------------------------------------------------------------- */
export function wobblyRect({ w, h, r, seed = 1, amp = 1.2, tension = 0 }) {
  // A radius bigger than half the short side is not a corner any more; the
  // 10-unit-wide column asks for exactly that, so it is clamped rather than
  // allowed to fold the outline back through itself.
  const rad = Math.max(0, Math.min(r, Math.min(w, h) / 2))
  const ring = []
  const edge = (x0, y0, x1, y1, nx, ny) => {
    const len = Math.hypot(x1 - x0, y1 - y0)
    const steps = Math.max(1, Math.round(len / RING_SPACING))
    // The end point is left to the arc that follows, so no point is emitted
    // twice and the spline has no zero-length segment to divide by.
    for (let i = 0; i < steps; i += 1) {
      const t = i / steps
      ring.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, nx, ny })
    }
  }
  const arc = (cx, cy, a0, a1) => {
    const steps = Math.max(
      2,
      Math.round((rad * Math.PI) / 2 / RING_SPACING) + 2,
    )
    for (let i = 0; i < steps; i += 1) {
      const a = a0 + (a1 - a0) * (i / steps)
      const nx = Math.cos(a)
      const ny = Math.sin(a)
      ring.push({ x: cx + nx * rad, y: cy + ny * rad, nx, ny })
    }
  }
  const HALF = Math.PI / 2
  edge(rad, 0, w - rad, 0, 0, -1) //            top
  arc(w - rad, rad, -HALF, 0) //                top-right corner
  edge(w, rad, w, h - rad, 1, 0) //             right
  arc(w - rad, h - rad, 0, HALF) //             bottom-right corner
  edge(w - rad, h, rad, h, 0, 1) //             bottom
  arc(rad, h - rad, HALF, Math.PI) //           bottom-left corner
  edge(0, h - rad, 0, rad, -1, 0) //            left
  arc(rad, rad, Math.PI, Math.PI * 1.5) //      top-left corner
  return wobbled(ring, seed, amp, tension)
}

/* -----------------------------------------------------------------------------
 * AN OVAL — Kimia's discs, and the smoke. Already all curve, so the wobble is
 * the only thing standing between it and a machine-perfect ellipse.
 * --------------------------------------------------------------------------- */
export function wobblyEllipse({ w, h, seed = 1, amp = 1.6, tension = 0 }) {
  const rx = w / 2
  const ry = h / 2
  // Ramanujan's approximation — close enough to decide a point count by.
  const perimeter =
    Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))
  const n = ringCount(perimeter, 16)
  const ring = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const x = Math.cos(a) * rx
    const y = Math.sin(a) * ry
    // The outward normal of an ellipse is NOT the radius (except on a circle):
    // it is the gradient, which leans towards the flatter end.
    const gx = x / (rx * rx)
    const gy = y / (ry * ry)
    const g = Math.hypot(gx, gy) || 1
    return { x: rx + x, y: ry + y, nx: gx / g, ny: gy / g }
  })
  return wobbled(ring, seed, amp, tension)
}

/* -----------------------------------------------------------------------------
 * A BLOB — Kimia's "organic random blob shapes". An oval with LOBES: a few slow
 * harmonics riding round the ring, which is what makes one side bulge and
 * another draw in. The fine wobble goes on top of that, so a blob is uneven at
 * two scales at once, the way a stone is.
 *
 * `lobe` is a fraction of the radius, not a size in units — this deformation IS
 * the shape rather than the hand that drew it, and a blob twice as big should
 * be twice as lumpy, not the same lumps stretched thin.
 * --------------------------------------------------------------------------- */
export function wobblyBlob({ w, h, seed = 1, lobe = 0.17, amp = 1.6 }) {
  const rng = mulberry32(seed)
  // Three harmonics, each with its own phase: enough for a shape with a couple
  // of bulges and a hollow, few enough that it never reads as a flower.
  const harmonics = [2, 3, 5].map((k) => ({
    k,
    phase: rng() * Math.PI * 2,
    weight: rng() * 0.6 + 0.4,
  }))
  const total = harmonics.reduce((s, x) => s + x.weight, 0)
  const rx = w / 2
  const ry = h / 2
  const n = ringCount(Math.PI * (rx + ry), 24)
  const ring = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const bulge =
      1 +
      (lobe *
        harmonics.reduce(
          (s, x) => s + x.weight * Math.sin(x.k * a + x.phase),
          0,
        )) /
        total
    const x = Math.cos(a) * rx * bulge
    const y = Math.sin(a) * ry * bulge
    const g = Math.hypot(x, y) || 1
    return { x: rx + x, y: ry + y, nx: x / g, ny: y / g }
  })
  // A different seed for the fine wobble than the lobes used, so two blobs that
  // happen to bulge alike are not also uneven alike.
  return wobbled(ring, seed * 7919 + 13, amp, 0)
}
