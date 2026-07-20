// The Abode ground (T4.3) — pure logic, no React, no storage.
//
// The Abode is OPEN GROUND under sky (Kimia's decision 2026-07-20): a
// patch of N-Z-D, no walls, the same quiet scene whether it holds one
// gathered flora or fifty. Gathered flora — and, since T4.3b, the
// market objects Kimia owns — are floating objects on it: she drags
// them anywhere and arranges them freely. Where each one sits lives in
// ONE map, stored in the envelope (storage v6):
//
//   abodeLayout: { [itemId]: { x, y } }
//
//   - For a flora, itemId is the id of the completion whose tap dropped
//     the find (at most one flora per completion — the same key
//     floraDecisions uses). For an owned object, itemId is the
//     purchase's own id (T4.3b — duplicates allowed, so each copy
//     carries its own). The map itself doesn't care which kind of
//     thing an id names, and the two id families can't collide.
//   - x, y are FRACTIONS of the whole scene (0–1), the item's anchor
//     point at its bottom centre — so the arrangement survives any
//     screen size. The scene includes the sky, and placement is
//     deliberately free: gravity is not guaranteed on this planet
//     (spec §5), so a flora or curiosity may hang wherever Kimia
//     leaves it.
//
// An item with NO entry sits in its default spot (defaultSpot below) —
// an entry is written only once Kimia moves it, so the map stays tiny.
//
// Everything is derived from completion history + the decisions map +
// the purchases list + this one (the always-derived principle, same as
// the meters and the bookcase): only GATHERED flora and OWNED objects
// stand on the ground. Compost a find, undo the completion that
// dropped it, or sell an object back to the world, and
// pruneAbodeLayout — called on every save — takes its stored place
// with it. As if it was never there.

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

// The default anchor for the item that is Nth on the ground.
// Deterministic: the same state always lays out the same untouched
// ground. (An earlier item leaving lets later un-moved items step
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

// Everything standing on the ground, with its place resolved: the
// stored place when Kimia has given it one, its default spot
// otherwise. Gathered flora come first (in arrival order), then owned
// objects (in buy order) — each item carries its kind and a single id
// the layout map keys on (a flora's completion id, an object's
// purchase id). Layout entries whose item is gone (composted, undone,
// sold) are simply ignored.
export function abodeItems(completions, decisions, layout, purchases = []) {
  const flora = floraFinds(completions, decisions)
    .filter((find) => find.status === 'gathered')
    .map((find) => ({ ...find, kind: 'flora', id: find.completionId }))
  const objects = purchases.map((purchase) => ({
    kind: 'object',
    id: purchase.id,
    objectKey: purchase.objectKey,
    price: purchase.price,
    boughtAt: purchase.boughtAt,
  }))
  return [...flora, ...objects].map((item, index) => {
    const stored = layout[item.id]
    const spot = defaultSpot(index)
    return {
      ...item,
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
  return placeItem(layout, floraId, point)
}

// Record where one owned object was dragged to (T4.3b). Same rule as
// the flora: only an object actually standing on the ground (owned)
// can be placed. Returns a NEW map.
export function placeObject(layout, purchases, purchaseId, point) {
  const onGround = purchases.some((purchase) => purchase.id === purchaseId)
  if (!onGround) {
    throw new Error('No owned object on the ground has this id.')
  }
  return placeItem(layout, purchaseId, point)
}

function placeItem(layout, itemId, point) {
  if (
    typeof point !== 'object' ||
    point === null ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new Error('A place needs finite x and y fractions.')
  }
  return {
    ...layout,
    [itemId]: { x: clampUnit(point.x), y: clampUnit(point.y) },
  }
}

// Drop places whose item no longer stands on the ground — composted,
// left, undone, deleted forever, sold back to the world, or an import
// into a different history. Called on every save, so the stored map
// never carries ghosts.
export function pruneAbodeLayout(
  layout,
  completions,
  decisions,
  purchases = [],
) {
  const alive = new Set([
    ...floraFinds(completions, decisions)
      .filter((find) => find.status === 'gathered')
      .map((find) => find.completionId),
    ...purchases.map((purchase) => purchase.id),
  ])
  const pruned = {}
  for (const [itemId, place] of Object.entries(layout)) {
    if (alive.has(itemId)) pruned[itemId] = place
  }
  return pruned
}

// Shape check for storage: the map must be an object of complete,
// in-bounds places. (Whether each item still stands on the ground is
// NOT checked here — orphans are legal in a freshly imported backup
// and get pruned on the next save.)
export function validateAbodeLayout(layout) {
  if (typeof layout !== 'object' || layout === null || Array.isArray(layout)) {
    throw new Error('The abode layout must be a map of item id → place.')
  }
  for (const [itemId, place] of Object.entries(layout)) {
    if (itemId === '') {
      throw new Error('An abode place needs the id of its flora or object.')
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
