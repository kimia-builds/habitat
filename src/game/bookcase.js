// The Bookcase layout (T4.2) — pure logic, no React, no storage.
//
// The Bookcase is ONE CONSTANT BOOKSHELF (Kimia's decision 2026-07-19):
// the same frame and planks whether it holds one publication or a
// hundred. Publications are floating objects on it — Kimia drags them
// anywhere and arranges them freely, and each can stand as a SPINE or
// turned face-out as a FRONT cover. Where every book sits and which way
// it faces lives in ONE map, stored in the envelope (storage v5):
//
//   bookcaseLayout: { [publicationId]: { x, y, facing } }
//
//   - publicationId comes from readingItemsFrom (game/arrivals.js):
//     the dropping completion's id plus the drop's index within it.
//   - x, y are FRACTIONS of the shelf interior (0–1), the book's
//     anchor point at its bottom centre — so the arrangement survives
//     any screen size, and books stand on the planks.
//   - facing is 'spine' or 'front'. Kimia's call: the view is
//     remembered per book, exactly like its position.
//
// A book with NO entry sits in its default slot (defaultSlot below),
// facing 'spine' — an entry is written only once Kimia moves or turns
// that book, so the map stays tiny. Entries are always COMPLETE
// ({x, y, facing}): turning a book freezes its current position with
// it, so a turned book never slides when another book vanishes.
//
// Everything is derived from completion history + the map (the
// always-derived principle, same as the meters and flora): undoing the
// completion that dropped a publication removes its book, and
// pruneBookcaseLayout — called on every save — takes the book's stored
// place with it. As if it was never there.
//
// READING IS TRACKED NOWHERE (spec 2026-07-19): this module knows
// positions and facings, nothing about reading. The read button opens
// the spread popup and not a byte of that ever reaches this file.

import { readingItemsFrom } from './arrivals.js'

// The two ways a book can stand. 'spine' is the absence of an entry's
// facing, never a missing field — stored entries are always complete.
export const BOOK_FACING = ['spine', 'front']

// ── The constant bookshelf's geometry ───────────────────────────────
// Fractions of the shelf interior. The planks' baselines: books stand
// on these, anchored at their bottom centre. Default slots fill the
// top plank left to right, then the next down — 8 per plank.
export const SHELF_BASELINES = [1 / 3, 2 / 3, 0.99]
export const SLOTS_PER_ROW = 8

const DEFAULT_CAPACITY = SHELF_BASELINES.length * SLOTS_PER_ROW

// Once the default grid is full, further books start over from the
// first slot, nudged a little to the right on each pass — late books
// overlap slightly instead of stacking invisibly, and every book stays
// grabbable. (The bookshelf is constant, Kimia's decision: it never
// grows. Her own arrangements are the remedy for crowding.)
const WRAP_NUDGE_X = 0.03

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

// The default anchor for the publication that is Nth in arrival order.
// Deterministic: the same history always lays the same untouched shelf.
export function defaultSlot(index) {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('A default slot needs a whole-number arrival index.')
  }
  const pass = Math.floor(index / DEFAULT_CAPACITY)
  const within = index % DEFAULT_CAPACITY
  const row = Math.floor(within / SLOTS_PER_ROW)
  const slot = within % SLOTS_PER_ROW
  return {
    x: clampUnit((slot + 0.5) / SLOTS_PER_ROW + pass * WRAP_NUDGE_X),
    y: SHELF_BASELINES[row],
  }
}

// Every publication on the bookshelf, in arrival order, with its place
// resolved: the stored place when Kimia has given it one, its default
// slot otherwise. Layout entries whose publication no longer exists
// (undone, deleted) are simply ignored.
export function bookcaseItems(completions, layout) {
  return readingItemsFrom(completions).map((item, index) => {
    const stored = layout[item.id]
    const slot = defaultSlot(index)
    return {
      ...item,
      x: stored?.x ?? slot.x,
      y: stored?.y ?? slot.y,
      facing: stored?.facing ?? 'spine',
    }
  })
}

// The publication's place right now, stored or default — used when a
// partial change (a turn without a move) must write a complete entry.
function currentPlace(layout, item, index) {
  const stored = layout[item.id]
  const slot = defaultSlot(index)
  return {
    x: stored?.x ?? slot.x,
    y: stored?.y ?? slot.y,
    facing: stored?.facing ?? 'spine',
  }
}

// Find the publication + its arrival index, or throw — a stale button
// must never write a place for a book that isn't there (the
// decideFlora precedent in game/flora.js).
function findPublication(completions, publicationId) {
  const items = readingItemsFrom(completions)
  const index = items.findIndex((item) => item.id === publicationId)
  if (index === -1) {
    throw new Error('No publication on the bookcase has this id.')
  }
  return { item: items[index], index }
}

// Record where one book was dragged to. Fractions are clamped into the
// shelf interior; the book's facing carries over. Returns a NEW map.
export function placeBook(layout, completions, publicationId, point) {
  const { item, index } = findPublication(completions, publicationId)
  if (
    typeof point !== 'object' ||
    point === null ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new Error('A book place needs finite x and y fractions.')
  }
  const current = currentPlace(layout, item, index)
  return {
    ...layout,
    [publicationId]: {
      x: clampUnit(point.x),
      y: clampUnit(point.y),
      facing: current.facing,
    },
  }
}

// Record which way one book stands ('spine' or 'front'). Its current
// position is frozen into the entry with it, so a turned book never
// slides when another book's drop is undone. Returns a NEW map.
export function faceBook(layout, completions, publicationId, facing) {
  if (!BOOK_FACING.includes(facing)) {
    throw new Error(
      `Unknown book facing "${facing}" — expected one of: ` +
        BOOK_FACING.join(', '),
    )
  }
  const { item, index } = findPublication(completions, publicationId)
  const current = currentPlace(layout, item, index)
  return { ...layout, [publicationId]: { ...current, facing } }
}

// Drop places whose publication is gone (undo, delete-forever, or an
// import into a different history). Called on every save, so the
// stored map never carries ghosts.
export function pruneBookcaseLayout(layout, completions) {
  const alive = new Set(readingItemsFrom(completions).map((item) => item.id))
  const pruned = {}
  for (const [publicationId, place] of Object.entries(layout)) {
    if (alive.has(publicationId)) pruned[publicationId] = place
  }
  return pruned
}

// Shape check for storage: the map must be an object of complete,
// in-bounds places. (Whether each publication still exists is NOT
// checked here — orphans are legal in a freshly imported backup and
// get pruned on the next save.)
export function validateBookcaseLayout(layout) {
  if (typeof layout !== 'object' || layout === null || Array.isArray(layout)) {
    throw new Error(
      'The bookcase layout must be a map of publication id → place.',
    )
  }
  for (const [publicationId, place] of Object.entries(layout)) {
    if (publicationId === '') {
      throw new Error('A bookcase place needs the id of its publication.')
    }
    if (typeof place !== 'object' || place === null || Array.isArray(place)) {
      throw new Error('A bookcase place must be an object.')
    }
    for (const axis of ['x', 'y']) {
      if (!Number.isFinite(place[axis]) || place[axis] < 0 || place[axis] > 1) {
        throw new Error(
          `A bookcase place needs an ${axis} fraction between 0 and 1.`,
        )
      }
    }
    if (!BOOK_FACING.includes(place.facing)) {
      throw new Error(
        `Unknown book facing "${place.facing}" — expected one of: ` +
          BOOK_FACING.join(', '),
      )
    }
  }
}
