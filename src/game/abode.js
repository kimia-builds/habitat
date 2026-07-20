// The Abode ground (T4.3) — pure logic, no React, no storage.
//
// The Abode is OPEN GROUND under sky (Kimia's decision 2026-07-20): a
// patch of N-Z-D, no walls, the same quiet scene whether it holds one
// gathered flora or fifty. Gathered flora are floating objects on it —
// Kimia drags them anywhere and arranges them freely. Where each one
// sits lives in ONE map, stored in the envelope (storage v6):
//
//   abodeLayout: { [floraId]: { x, y } }
//
//   - floraId is the id of the completion whose tap dropped the find
//     (at most one flora per completion — the same key floraDecisions
//     uses). Purchased objects join this map in T4.3b with their own
//     ids; the map itself doesn't care what kind of thing an id names.
//   - x, y are FRACTIONS of the whole scene (0–1), the flora's anchor
//     point at its bottom centre — so the arrangement survives any
//     screen size. The scene includes the sky, and placement is
//     deliberately free: gravity is not guaranteed on this planet
//     (spec §5), so a flora may hang wherever Kimia leaves it.
//
// A flora with NO entry sits in its default spot (defaultSpot below) —
// an entry is written only once Kimia moves it, so the map stays tiny.
//
// Everything is derived from completion history + the decisions map +
// this one (the always-derived principle, same as the meters and the
// bookcase): only GATHERED flora stand on the ground. Compost a find,
// or undo the completion that dropped it, and pruneAbodeLayout —
// called on every save — takes its stored place with it. As if it was
// never there.

import { floraFinds } from './flora.js'

// ── The open ground's geometry ──────────────────────────────────────
// Fractions of the scene. The sky reaches down to the horizon; the
// ground is everything below it. Default spots stand new arrivals on
// three loose ground lines, front line first — 6 per line.
export const HORIZON = 0.42
export const GROUND_LINES = [0.58, 0.76, 0.94]
export const SPOTS_PER_ROW = 6

const DEFAULT_CAPACITY = GROUND_LINES.length * SPOTS_PER_ROW

// Once the default spots are full, further flora start over from the
// first, nudged a little to the right on each pass — late arrivals
// overlap slightly instead of stacking invisibly, and every flora
// stays grabbable. (The ground is constant: it never grows. Kimia's
// own arranging is the remedy for crowding — the bookshelf precedent.)
const WRAP_NUDGE_X = 0.04

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

// The default anchor for the gathered flora that is Nth on the ground.
// Deterministic: the same state always lays out the same untouched
// ground. (Composting an earlier find lets later un-moved flora step
// forward a spot — the ground quietly closes its gaps.)
export function defaultSpot(index) {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('A default spot needs a whole-number index.')
  }
  const pass = Math.floor(index / DEFAULT_CAPACITY)
  const within = index % DEFAULT_CAPACITY
  const row = Math.floor(within / SPOTS_PER_ROW)
  const spot = within % SPOTS_PER_ROW
  return {
    x: clampUnit((spot + 0.5) / SPOTS_PER_ROW + pass * WRAP_NUDGE_X),
    y: GROUND_LINES[row],
  }
}

// Every gathered flora on the ground, in arrival order, with its place
// resolved: the stored place when Kimia has given it one, its default
// spot otherwise. Layout entries whose flora is no longer gathered
// (composted, undone) are simply ignored.
export function abodeItems(completions, decisions, layout) {
  return floraFinds(completions, decisions)
    .filter((find) => find.status === 'gathered')
    .map((find, index) => {
      const stored = layout[find.completionId]
      const spot = defaultSpot(index)
      return {
        ...find,
        x: stored?.x ?? spot.x,
        y: stored?.y ?? spot.y,
      }
    })
}

// Record where one flora was dragged to. Fractions are clamped into
// the scene; only a flora actually standing on the ground (gathered)
// can be placed — a stale drag must never write a place for one that
// isn't there (the placeBook precedent). Returns a NEW map.
export function placeFlora(layout, completions, decisions, floraId, point) {
  const onGround = abodeItems(completions, decisions, layout).some(
    (item) => item.completionId === floraId,
  )
  if (!onGround) {
    throw new Error('No gathered flora on the ground has this id.')
  }
  if (
    typeof point !== 'object' ||
    point === null ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new Error('A flora place needs finite x and y fractions.')
  }
  return {
    ...layout,
    [floraId]: { x: clampUnit(point.x), y: clampUnit(point.y) },
  }
}

// Drop places whose flora no longer stands on the ground — composted,
// left, undone, deleted forever, or an import into a different
// history. Called on every save, so the stored map never carries
// ghosts. (T4.3b extends this to keep purchased objects' places.)
export function pruneAbodeLayout(layout, completions, decisions) {
  const alive = new Set(
    floraFinds(completions, decisions)
      .filter((find) => find.status === 'gathered')
      .map((find) => find.completionId),
  )
  const pruned = {}
  for (const [floraId, place] of Object.entries(layout)) {
    if (alive.has(floraId)) pruned[floraId] = place
  }
  return pruned
}

// Shape check for storage: the map must be an object of complete,
// in-bounds places. (Whether each flora is still gathered is NOT
// checked here — orphans are legal in a freshly imported backup and
// get pruned on the next save.)
export function validateAbodeLayout(layout) {
  if (typeof layout !== 'object' || layout === null || Array.isArray(layout)) {
    throw new Error('The abode layout must be a map of flora id → place.')
  }
  for (const [floraId, place] of Object.entries(layout)) {
    if (floraId === '') {
      throw new Error('An abode place needs the id of its flora.')
    }
    if (typeof place !== 'object' || place === null || Array.isArray(place)) {
      throw new Error('An abode place must be an object.')
    }
    for (const axis of ['x', 'y']) {
      if (!Number.isFinite(place[axis]) || place[axis] < 0 || place[axis] > 1) {
        throw new Error(
          `An abode place needs an ${axis} fraction between 0 and 1.`,
        )
      }
    }
  }
}
