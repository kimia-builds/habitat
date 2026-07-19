// Map geometry (T4.1) — pure view maths for MapPage, no React, no
// storage, no game rules (which region is DISCOVERED is game/map.js's
// business; this file only decides what the planet looks like).
//
// The shapes are GENERATIVE PLACEHOLDERS (Kimia's decision 2026-07-19):
// every wobble, cut and colour is derived from the world seed through
// the same seeded-hash trick as the drops engine, so the planet has
// one stable shape — your shape, carried in backups — until the T5.3
// art pass replaces these shapes with real region art, and T6.1 names
// them. Nothing here is random at render time.
//
// The 16 regions are laid out as a landing site in the middle, a ring
// of 5 around it, and a ring of 10 outside that — so discovery radiates
// outward from where we first arrived, region by region.

import { MAP_REGION_COUNT } from '../game/constants.js'
import { randomUnit } from '../game/drops.js'

const TAU = Math.PI * 2

// The drawing frame: one square viewBox, everything placed from its
// centre. Base radii of the three boundary circles (the wobble moves
// them a little, the layout never changes).
const SIZE = 440
const CENTRE = SIZE / 2
const CORE_RADIUS = 58 // around the landing site (region 1)
const RING_RADIUS = 122 // between the inner 5 and the outer 10
const PLANET_RADIUS = 190 // the silhouette — the faint outline

const INNER_RING_COUNT = 5
const OUTER_RING_COUNT = MAP_REGION_COUNT - 1 - INNER_RING_COUNT

// One seeded number 0..1 for a named part of the layout.
function unit(worldSeed, key) {
  return randomUnit(`${worldSeed}|map|${key}`)
}

// A wobbly circle: radius as a function of angle, built from two
// seeded sine waves. Whole-number wave counts keep it seamless all
// the way around; the amplitudes stay small so rings never touch.
function wobblyRadius(worldSeed, key, base, amp) {
  const waves1 = 2 + Math.floor(unit(worldSeed, `${key}-w1`) * 3) // 2..4
  const waves2 = 5 + Math.floor(unit(worldSeed, `${key}-w2`) * 3) // 5..7
  const phase1 = unit(worldSeed, `${key}-p1`) * TAU
  const phase2 = unit(worldSeed, `${key}-p2`) * TAU
  const amp1 = amp * (0.6 + 0.4 * unit(worldSeed, `${key}-a1`))
  const amp2 = amp * 0.5 * (0.6 + 0.4 * unit(worldSeed, `${key}-a2`))
  return (theta) =>
    base *
    (1 +
      amp1 * Math.sin(waves1 * theta + phase1) +
      amp2 * Math.sin(waves2 * theta + phase2))
}

// Where a ring's cell borders sit: evenly spaced cuts, each nudged by
// up to a quarter of the spacing, plus a seeded rotation for the whole
// ring — organic, but never so far that cells swap places.
function ringCuts(worldSeed, key, count) {
  const spacing = TAU / count
  const rotation = unit(worldSeed, `${key}-rot`) * TAU
  return Array.from({ length: count }, (_, i) => {
    const nudge = (unit(worldSeed, `${key}-cut-${i}`) - 0.5) * spacing * 0.5
    return rotation + i * spacing + nudge
  })
}

function point(radius, theta) {
  const x = CENTRE + radius * Math.cos(theta)
  const y = CENTRE + radius * Math.sin(theta)
  return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`
}

// Sample an arc of a wobbly boundary into polygon points.
function arcPoints(radiusAt, from, to) {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) / 0.06))
  const points = []
  for (let i = 0; i <= steps; i++) {
    const theta = from + ((to - from) * i) / steps
    points.push(point(radiusAt(theta), theta))
  }
  return points
}

// A full wobbly circle as a closed path (the silhouette, and the
// landing-site region).
function blobPath(radiusAt) {
  return `M${arcPoints(radiusAt, 0, TAU).join('L')}Z`
}

// One ring cell: out along the inner boundary's arc, back along the
// outer's — a closed, organically wobbling patch.
function cellPath(innerAt, outerAt, from, to) {
  const outer = arcPoints(outerAt, from, to)
  const inner = arcPoints(innerAt, to, from)
  return `M${outer.join('L')}L${inner.join('L')}Z`
}

// Each region's bioluminescent colour: a seeded hue from green-teal
// through blue-violet to pink (150°–310°) — the planet glows in the
// everyday pastel register; neon stays reserved for POP moments.
function regionHue(worldSeed, region) {
  return Math.round(150 + unit(worldSeed, `hue-${region}`) * 160)
}

// The whole layout: the silhouette path plus all 16 region shapes in
// DISCOVERY ORDER (index 0 first), each with its path, colour and the
// polar patch it covers (used to place landmark markers inside it).
export function buildMapLayout(worldSeed) {
  const core = wobblyRadius(worldSeed, 'core', CORE_RADIUS, 0.1)
  const ring = wobblyRadius(worldSeed, 'ring', RING_RADIUS, 0.07)
  const planet = wobblyRadius(worldSeed, 'planet', PLANET_RADIUS, 0.05)

  const regions = [
    {
      region: 0,
      path: blobPath(core),
      hue: regionHue(worldSeed, 0),
      thetaFrom: 0,
      thetaTo: TAU,
      radiusFrom: 0,
      radiusTo: CORE_RADIUS,
    },
  ]

  const rings = [
    { key: 'inner', count: INNER_RING_COUNT, innerAt: core, outerAt: ring, radiusFrom: CORE_RADIUS, radiusTo: RING_RADIUS },
    { key: 'outer', count: OUTER_RING_COUNT, innerAt: ring, outerAt: planet, radiusFrom: RING_RADIUS, radiusTo: PLANET_RADIUS },
  ]
  for (const { key, count, innerAt, outerAt, radiusFrom, radiusTo } of rings) {
    const cuts = ringCuts(worldSeed, key, count)
    for (let i = 0; i < count; i++) {
      const from = cuts[i]
      const to = i + 1 < count ? cuts[i + 1] : cuts[0] + TAU
      const region = regions.length
      regions.push({
        region,
        path: cellPath(innerAt, outerAt, from, to),
        hue: regionHue(worldSeed, region),
        thetaFrom: from,
        thetaTo: to,
        radiusFrom,
        radiusTo,
      })
    }
  }

  return { size: SIZE, silhouettePath: blobPath(planet), regions }
}

// Where a landmark marker sits inside its region: a seeded spot keyed
// by the completion that dropped the find — settled forever, well away
// from the region's edges. (No markers render until T6.1 decides which
// species are landmarks; the placement is ready for that day.)
export function landmarkPoint(worldSeed, layout, marker) {
  const cell = layout.regions[marker.region]
  const across = unit(worldSeed, `landmark-theta-${marker.completionId}`)
  const outward = unit(worldSeed, `landmark-radius-${marker.completionId}`)
  const theta = cell.thetaFrom + (0.25 + 0.5 * across) * (cell.thetaTo - cell.thetaFrom)
  const radius =
    cell.radiusFrom + (0.3 + 0.4 * outward) * (cell.radiusTo - cell.radiusFrom)
  return {
    x: Math.round((CENTRE + radius * Math.cos(theta)) * 10) / 10,
    y: Math.round((CENTRE + radius * Math.sin(theta)) * 10) / 10,
  }
}
