// Rounding the corners of a graph line (Kimia's call 2026-08-11).
//
// The habit graphs used to be a <polyline>: dead accurate, and sharp as
// broken glass at every change of direction. This turns the same points
// into an SVG path that keeps every straight run exactly where it was and
// only softens the turns.
//
// How, in one sentence: at each corner we stop a few pixels short of the
// point, curve THROUGH that corner using the point itself as the curve's
// pull, and carry on from a few pixels the other side. The data is not
// smoothed, resampled or averaged — no invented values, no line drifting
// away from a reading. Only the last few pixels either side of a corner
// move, and never further than the corner's own radius.
//
// The radius shrinks automatically on short segments (never more than
// half of one), so a busy day-by-day graph with points two pixels apart
// simply rounds by less rather than overlapping itself.

const round = (value) => Math.round(value * 100) / 100

// A point `distance` along the way from `from` toward `to`.
function step(from, to, distance) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  if (length === 0) return { x: from.x, y: from.y }
  return {
    x: from.x + (dx / length) * distance,
    y: from.y + (dy / length) * distance,
  }
}

const lengthOf = (from, to) => Math.hypot(to.x - from.x, to.y - from.y)

/**
 * Build an SVG path `d` for a line through `points` with rounded corners.
 * `radius` is the most a corner may be rounded by, in the same units as
 * the points (viewBox units here, not screen pixels).
 */
export function roundedPath(points, radius = 6) {
  if (points.length === 0) return ''
  if (points.length === 1)
    return `M ${round(points[0].x)} ${round(points[0].y)}`

  const parts = [`M ${round(points[0].x)} ${round(points[0].y)}`]

  for (let i = 1; i < points.length - 1; i++) {
    const previous = points[i - 1]
    const corner = points[i]
    const next = points[i + 1]

    // Never eat more than half of either neighbouring segment, or the
    // roundings of two adjacent corners would overlap and the line would
    // wander off its own points.
    const cut = Math.min(
      radius,
      lengthOf(previous, corner) / 2,
      lengthOf(corner, next) / 2,
    )
    if (cut === 0) continue // a repeated point: nothing to round

    const before = step(corner, previous, cut)
    const after = step(corner, next, cut)

    // Straight up to the start of the corner, then a quadratic curve
    // pulled by the corner itself — which is what keeps the turn
    // recognisably the same turn, only without the point on it.
    parts.push(`L ${round(before.x)} ${round(before.y)}`)
    parts.push(
      `Q ${round(corner.x)} ${round(corner.y)} ${round(after.x)} ${round(after.y)}`,
    )
  }

  const last = points[points.length - 1]
  parts.push(`L ${round(last.x)} ${round(last.y)}`)
  return parts.join(' ')
}
