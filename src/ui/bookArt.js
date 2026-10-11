/*
 * bookArt.js — how a publication is drawn on the Bookcase (T5.3n, 2026-10-11)
 * =============================================================================
 * Kimia's pick, 2026-10-11, by eye off three rounds of option sheets: an
 * almost-solid block of colour with a hand-wobbled outline, a border of small
 * uneven BEADS just inside the edge (a single bead column down a spine), and a
 * darker wavy MASTHEAD BAND across the top. Beads that land on the band turn
 * pale so they stay visible. The cover carries nothing else but the eye — the
 * magazine / novel / dictionary mark that used to sit on it is gone, because a
 * click anywhere on the book already turns it.
 *
 * Each type has its own soft pastel family, five shades each, darkest first:
 * purple magazines, aquamarine novels, baby-pink dictionaries. A book wears
 * one shade for ever, picked from its own id, so nothing new is stored and the
 * same shelf always looks the same. Colours stay here beside the drawing, like
 * friendPalettes.js — no CSS rule reads them (design-notes §11d).
 *
 * Everything is drawn around the book's anchor (bottom centre at 0, 0), so a
 * finished book is just moved into place — and the shapes are worked out once
 * per look and remembered, not redrawn on every frame of a drag.
 * =========================================================================== */

export const BOOK_SHADES = {
  magazine: ['#7d6bb4', '#9d8cc9', '#b2a3d9', '#c5b8e8', '#d6ccf2'],
  novel: ['#4fbcab', '#6dd2c1', '#8de2d3', '#adede2', '#cbf5ee'],
  dictionary: ['#dc84a8', '#ec9ebe', '#f5b6cf', '#f9cadd', '#fcdde9'],
}

// The faint light each type throws: its middle shade (publications glow
// less than living things, design-bible §7).
export const BOOK_GLOW = {
  magazine: BOOK_SHADES.magazine[3],
  novel: BOOK_SHADES.novel[2],
  dictionary: BOOK_SHADES.dictionary[2],
}

// How far the masthead band reaches down, as a share of the book's height.
const SPINE_BAND = 0.2
const COVER_BAND = 0.3
// The beads: how far in from the edge, how far apart.
const BEAD_INSET = 5.5
const BEAD_GAP = 6
const SPINE_BEAD_GAP = 6.5

// Mix a hex colour toward black (0) or white (255) by a share t.
function mix(hex, toward, t) {
  const n = parseInt(hex.slice(1), 16)
  const parts = [n >> 16, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(v + (toward - v) * t),
  )
  return '#' + parts.map((v) => v.toString(16).padStart(2, '0')).join('')
}

// A seeded random-number source: the same seed wobbles the same way, so a
// book never changes shape between visits.
function seeded(seed) {
  let state = seed
  return () => (state = (state * 16807) % 2147483647) / 2147483647
}

// A number from a book's id: the same id always gives the same number.
function hashId(id) {
  let h = 2166136261
  for (const ch of String(id)) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Which of its type's five shades a book wears, and how its edges wobble.
export function bookLook(id) {
  const h = hashId(id)
  return { shade: h % 5, seed: (h % 2147483645) + 1 }
}

// A smooth curve through points — no sharp corners anywhere.
function curve(points, closed) {
  const at = (i) =>
    closed
      ? points[(i + points.length) % points.length]
      : points[Math.min(Math.max(i, 0), points.length - 1)]
  const f = (v) => v.toFixed(2)
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  const last = closed ? points.length : points.length - 1
  for (let i = 0; i < last; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return closed ? d + 'Z' : d
}

// A rounded rectangle whose edge wanders in and out a little, like a
// hand-drawn line.
function wobblyOutline(x, y, w, h, { amp, r, rand }) {
  const sides = [
    [
      [x + r, y],
      [x + w - r, y],
      [0, -1],
    ],
    [
      [x + w, y + r],
      [x + w, y + h - r],
      [1, 0],
    ],
    [
      [x + w - r, y + h],
      [x + r, y + h],
      [0, 1],
    ],
    [
      [x, y + h - r],
      [x, y + r],
      [-1, 0],
    ],
  ]
  const points = []
  for (const [a, b, [nx, ny]] of sides) {
    const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 7))
    for (let i = 0; i < n; i++) {
      const t = i / n
      const off = (rand() - 0.5) * 2 * amp
      points.push([
        a[0] + (b[0] - a[0]) * t + nx * off,
        a[1] + (b[1] - a[1]) * t + ny * off,
      ])
    }
  }
  return curve(points, true)
}

// The masthead: everything above a gently wavy line `depth` down from the
// top (drawn generously wide; the book's outline clips it).
function mastheadBand(x, y, w, depth, waves, rand) {
  const wave = []
  for (let k = 0; k <= waves; k++) {
    wave.push([
      x + w - (w * k) / waves,
      y + depth + (k % 2 ? 2.5 : -2) + rand(),
    ])
  }
  return (
    `M${x - 2} ${y - 2}L${x + w + 2} ${y - 2}L${x + w + 2} ${y + depth}` +
    curve(wave, false).replace('M', 'L') +
    `L${x - 2} ${y + depth}Z`
  )
}

const cache = new Map()

// Everything needed to draw one book: its outline, its band, its beads and
// the three tones (fill, ink for edges and beads, pale for beads on the band).
export function bookArt({ type, facing, width, height, shade, seed }) {
  const key = [type, facing, width, height, shade, seed].join('|')
  if (cache.has(key)) return cache.get(key)

  const fill = BOOK_SHADES[type][shade]
  const ink = mix(fill, 0, 0.45)
  const band = mix(fill, 0, 0.25)
  const pale = mix(fill, 255, 0.5)
  const x = -width / 2
  const y = -height
  const front = facing === 'front'
  const depth = height * (front ? COVER_BAND : SPINE_BAND)
  const rand = seeded(seed)

  const outline = wobblyOutline(x, y, width, height, {
    amp: front ? 0.8 : 0.7,
    r: front ? 3.5 : 3,
    rand,
  })
  const waves = front ? 8 : Math.max(4, Math.round(width / 5.4))
  const bandPath = mastheadBand(x, y, width, depth, waves, rand)

  const beads = []
  const bead = (cx, cy, r) =>
    beads.push({ cx, cy, r, colour: cy < y + depth + 1 ? pale : ink })
  if (front) {
    const i = BEAD_INSET
    const corners = [
      [x + i, y + i],
      [x + width - i, y + i],
      [x + width - i, -i],
      [x + i, -i],
    ]
    corners.forEach(([ax, ay], c) => {
      const [bx, by] = corners[(c + 1) % 4]
      const n = Math.round(Math.hypot(bx - ax, by - ay) / BEAD_GAP)
      for (let k = 0; k < n; k++) {
        const t = k / n
        bead(
          ax + (bx - ax) * t + (rand() - 0.5) * 1.3,
          ay + (by - ay) * t + (rand() - 0.5) * 1.3,
          1.2 + rand(),
        )
      }
    })
  } else {
    for (let by = y + 7; by < -5; by += SPINE_BEAD_GAP) {
      bead((rand() - 0.5) * 1.4, by + (rand() - 0.5) * 1.2, 1.3 + rand() * 0.9)
    }
  }

  const art = { fill, ink, band, outline, bandPath, beads }
  cache.set(key, art)
  return art
}
