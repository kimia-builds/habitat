// The Abode ground (T4.3) — pure logic, no React, no storage.
//
// The Abode is OPEN GROUND under sky (Kimia's decision 2026-07-20): a
// patch of N-Z-D, no walls, the same quiet scene whether it holds one
// gathered flora or fifty. Gathered flora — and, since T4.3b, the
// market objects Kimia owns — are floating objects on it: she drags
// them anywhere and arranges them freely. Where each one sits lives in
// ONE map, stored in the envelope (storage v6):
//
//   abodeLayout: { [itemId]: { x, y, angle? } }
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
//   - angle (T5.5, 2026-10-08) is how far Kimia has turned the item, in
//     degrees clockwise, flat in the plane of the screen, about the
//     item's own centre. It is OPTIONAL: no entry, or an entry with no
//     angle, means upright — so every older save loads unchanged and the
//     storage version did not move. An item turned back to upright
//     simply loses the field. Moving an item keeps its angle.
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
// HORIZON is no longer DRAWN (T5.4, 2026-08-21): the Abode's background
// became one opaque nebula sky filling the whole canvas, with no soil
// half and no horizon line, so there is nothing on screen at this
// fraction any more. It stays here because the default spots below are
// still laid out against it — new arrivals land in the lower part of
// the scene rather than floating in the middle of the sky, which is
// what "the ground" means now that there is no ground to draw.
export const HORIZON = 0.42
export const GROUND_LINES = [0.58, 0.76, 0.94]
export const SPOTS_PER_ROW = 6

// ── The four skies (T5.4, 2026-08-21) ───────────────────────────────
// Kimia picks which nebula sky her abode wears, and the choice is
// remembered with the save. THE NAMES LIVE HERE, not with the paint,
// because this is the list of values a stored game may legally hold —
// the same class of fact as a schedule shape. Their COLOURS live in
// src/ui/sky.jsx beside the drawing they paint (design-notes §11d),
// which reads this list to key its palettes, so there is exactly one
// roster and no pair of lists that can drift.
//
// These four words are Claude's from July, when the skies were made
// for the workbench; they are interface copy like any other and live
// in src/content/ui.js for Kimia to rename (`abode.skyEmber` and
// friends). Renaming what a swatch SAYS costs nothing — a save stores
// the key below, not the word.
export const ABODE_SKIES = ['ember', 'teal', 'violet', 'ash']

// The sky a new world starts in, and the answer for any save that
// predates the choice existing.
export const DEFAULT_ABODE_SKY = ABODE_SKIES[0]

export function isAbodeSky(value) {
  return ABODE_SKIES.includes(value)
}

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
      angle: stored?.angle ?? 0,
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
  // Spread the old entry first so a move never forgets the turn.
  return {
    ...layout,
    [itemId]: {
      ...layout[itemId],
      x: clampUnit(point.x),
      y: clampUnit(point.y),
    },
  }
}

// ── Turning things (T5.5, 2026-10-08) ───────────────────────────────
// An angle is kept as degrees clockwise in [0, 360), to a tenth of a
// degree — a turn of 370° is a turn of 10°, and a stored number never
// carries more precision than a hand can give it.
export function normalizeAngle(degrees) {
  if (!Number.isFinite(degrees)) {
    throw new Error('An angle needs a finite number of degrees.')
  }
  const wrapped = ((degrees % 360) + 360) % 360
  const tenth = Math.round(wrapped * 10) / 10
  return tenth >= 360 ? 0 : tenth
}

// The dial: where an item points after the pointer has circled it.
// `centre` is the item's own centre, `from` where the pointer was when
// the press began, `to` where it is now (all in the same units). The item
// turns by how far the pointer has travelled AROUND the centre — not to
// wherever the pointer happens to be — so a press that begins anywhere
// leaves the item exactly where it was. Returns degrees, unwrapped.
export function dialAngle(startAngle, centre, from, to) {
  const around = (point) =>
    Math.atan2(point.y - centre.y, point.x - centre.x) * (180 / Math.PI)
  return startAngle + (around(to) - around(from))
}

// Keep one item's turn. Works for flora and objects alike (the ids can't
// collide). Only an item actually standing on the ground can be turned —
// a stale save must fail loudly, the placeFlora precedent. An item that
// has never been moved has no entry to hang an angle on, so turning it
// writes its present place alongside: the same thing moving it would do.
// Turning back to upright removes the angle (and leaves the place).
// Returns a NEW map.
export function turnItem(
  layout,
  completions,
  decisions,
  purchases,
  itemId,
  degrees,
) {
  const item = abodeItems(completions, decisions, layout, purchases).find(
    (candidate) => candidate.id === itemId,
  )
  if (!item) {
    throw new Error('No item on the ground has this id.')
  }
  const angle = normalizeAngle(degrees)
  if (angle === 0 && layout[itemId] === undefined) return layout
  const { angle: _old, ...place } = layout[itemId] ?? { x: item.x, y: item.y }
  return {
    ...layout,
    [itemId]: angle === 0 ? place : { ...place, angle },
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
    if (
      place.angle !== undefined &&
      (!Number.isFinite(place.angle) || place.angle < 0 || place.angle >= 360)
    ) {
      throw new Error(
        'An abode angle needs a number of degrees from 0 up to 360.',
      )
    }
  }
}
