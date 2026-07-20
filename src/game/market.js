// The Market (T4.3b) — pure logic, no React, no storage.
//
// The rotating stall (spec §5 Stream 3): a small selection of
// curiosities, bought with fungi and sold back at EXACTLY the same
// price — no penalty, no spread, ever. The rules that shape it:
//
//   - Objects are PURCHASED, never dropped (spec §5). Until T6.1 names
//     the real objects, every one is a generic "curiosity" (the
//     flora-stay-generic precedent) with a stable key, a placeholder
//     price from constants.js, and a seeded look drawn by the UI.
//   - The pool grows with the Map: each discovered region contributes
//     its MARKET_OBJECTS_PER_REGION curiosities — the one deliberate
//     link between the reward streams.
//   - Rotation runs on LIVED DAYS (spec §4.2: a day with ≥1 habit
//     marked, including retroactive marks), counted straight from
//     completion history — so gap days never advance the clock, a
//     backfilled day counts the moment it exists, and undoing turns
//     the clock back by itself. Nothing is stored that could go stale
//     (the meters principle, decision 2026-07-15).
//   - The stall slides MARKET_STALL_SIZE objects further along the
//     pool each rotation, wrapping around, so every object cycles back
//     within ⌈pool ÷ stall⌉ rotations — nothing is permanently
//     missable, no FOMO (spec §5).
//   - Duplicates are allowed (Kimia's call 2026-07-20): buying does
//     NOT take the object off the stall — each purchase is its own
//     owned instance with its own id, its own place in the Abode, and
//     its own quiet sell button there (compost-style). Selling refunds
//     exactly the price paid, so a buy → sell round trip is always
//     fungus-neutral, and the object is still on the stall anyway.
//
// Purchases are the one thing here that IS stored (storage v7's
// `purchases` list) — everything else is derived. The wallet is always
// the same computation: fungus drops minus what the owned objects cost.

import {
  MAP_REGION_COUNT,
  MARKET_OBJECTS_PER_REGION,
  MARKET_PRICE_TIERS,
  MARKET_ROTATION_LIVED_DAYS,
  MARKET_STALL_SIZE,
} from './constants.js'
import { fungusBalanceFrom } from './arrivals.js'

// ── Lived days & the rotation clock ─────────────────────────────────

// A lived day is a day with at least one habit marked against it —
// whenever and however the mark was made (live tap, check-in,
// backfill). One habit or ten, the day counts once.
export function livedDayCount(completions) {
  return new Set(completions.map((completion) => completion.dayKey)).size
}

// Which rotation the stall is on after this many lived days. The first
// rotation starts at zero lived days (the stall exists from the very
// first mark); crossing each multiple of MARKET_ROTATION_LIVED_DAYS
// turns the stall.
export function rotationIndex(livedDays) {
  if (!Number.isInteger(livedDays) || livedDays < 0) {
    throw new Error('Lived days must be a whole number, zero or more.')
  }
  return Math.floor(livedDays / MARKET_ROTATION_LIVED_DAYS)
}

// ── The catalogue (placeholder objects until T6.1) ──────────────────

// An object's stable identity: the region it comes from and which of
// that region's curiosities it is. The key travels in purchases and
// layout entries, so its shape never changes.
export function objectKey(region, objectIndex) {
  return `${region}:${objectIndex}`
}

function parseObjectKey(key) {
  const match = /^(\d+):(\d+)$/.exec(key)
  if (match === null) {
    throw new Error(`"${key}" is not a market object key (region:index).`)
  }
  return { region: Number(match[1]), objectIndex: Number(match[2]) }
}

// One catalogue entry. The price comes straight from the placeholder
// tiers — each region offers one object per tier, so the cheapest and
// the dearest are always within the same neighbourhood.
export function catalogObject(region, objectIndex) {
  if (
    !Number.isInteger(region) ||
    region < 0 ||
    region >= MAP_REGION_COUNT ||
    !Number.isInteger(objectIndex) ||
    objectIndex < 0 ||
    objectIndex >= MARKET_OBJECTS_PER_REGION
  ) {
    throw new Error('No market object lives at that region and index.')
  }
  return {
    key: objectKey(region, objectIndex),
    region,
    objectIndex,
    price: MARKET_PRICE_TIERS[objectIndex % MARKET_PRICE_TIERS.length],
  }
}

// Every object the discovered regions put on offer, in a stable order:
// region by region outward from the landing site, tier by tier within
// each region. The stall slides along this list.
export function marketPool(discoveredRegions) {
  if (
    !Number.isInteger(discoveredRegions) ||
    discoveredRegions < 0 ||
    discoveredRegions > MAP_REGION_COUNT
  ) {
    throw new Error('A discovered region count must be 0–16.')
  }
  const pool = []
  for (let region = 0; region < discoveredRegions; region++) {
    for (let index = 0; index < MARKET_OBJECTS_PER_REGION; index++) {
      pool.push(catalogObject(region, index))
    }
  }
  return pool
}

// What the stall shows during a rotation: a window of MARKET_STALL_SIZE
// objects starting STALL_SIZE places further along the pool each
// rotation, wrapping at the far end. A pool smaller than the stall
// simply shows the whole pool (early days, one region discovered). An
// empty pool — no habits ever marked, no regions known — shows
// nothing: a bare stall, no prose (the bookshelf precedent).
export function stallObjects(pool, rotation) {
  if (!Array.isArray(pool)) {
    throw new Error('The market pool must be a list of objects.')
  }
  if (!Number.isInteger(rotation) || rotation < 0) {
    throw new Error('A rotation must be a whole number, zero or more.')
  }
  if (pool.length === 0) return []
  const size = Math.min(MARKET_STALL_SIZE, pool.length)
  const offset = (rotation * MARKET_STALL_SIZE) % pool.length
  const stall = []
  for (let i = 0; i < size; i++) {
    stall.push(pool[(offset + i) % pool.length])
  }
  return stall
}

// ── Purchases (stored in the envelope, storage v7) ──────────────────

function validateObject(object) {
  if (
    typeof object !== 'object' ||
    object === null ||
    typeof object.key !== 'string' ||
    !Number.isInteger(object.price) ||
    object.price <= 0
  ) {
    throw new Error('A market object needs a key and a positive whole price.')
  }
}

// Buy an object off the stall: a new owned instance joins the list.
// Duplicates are allowed (Kimia's call 2026-07-20) — two copies of the
// same object are two instances with different ids. The price is frozen
// onto the instance at buy time, so a later retune of the tiers can
// never make a sell refund more or less than was paid. Refuses to
// overdraw: the wallet can never go below zero (spec §5).
export function buyObject(
  purchases,
  object,
  balance,
  now = Date.now(),
  id = crypto.randomUUID(),
) {
  if (!Array.isArray(purchases)) {
    throw new Error('Purchases must be a list.')
  }
  validateObject(object)
  if (!Number.isInteger(balance) || balance < 0) {
    throw new Error('A wallet balance must be a whole number, zero or more.')
  }
  if (object.price > balance) {
    throw new Error(
      `Not enough fungi — this costs ${object.price} but the wallet holds ${balance}.`,
    )
  }
  return [
    ...purchases,
    { id, objectKey: object.key, price: object.price, boughtAt: now },
  ]
}

// Sell an owned instance back to the world: it leaves the list, and the
// caller refunds exactly its frozen price (walletBalance takes care of
// the maths — the total simply stops counting this instance). A stale
// sell fails loudly rather than vanishing silently.
export function sellObject(purchases, purchaseId) {
  if (!Array.isArray(purchases)) {
    throw new Error('Purchases must be a list.')
  }
  if (!purchases.some((purchase) => purchase.id === purchaseId)) {
    throw new Error('No owned object has this id.')
  }
  return purchases.filter((purchase) => purchase.id !== purchaseId)
}

// What the currently owned objects cost in total — the amount the
// wallet is down from its all-drops income.
export function ownedTotal(purchases) {
  if (!Array.isArray(purchases)) {
    throw new Error('Purchases must be a list.')
  }
  return purchases.reduce((total, purchase) => total + purchase.price, 0)
}

// The fungus wallet's TRUE balance, whole and derived: every fungus
// ever dropped, minus what the owned objects cost. This is the number
// every calculation uses. Buying lowers it by the price, selling
// raises it by exactly the same price — a round trip is always
// fungus-neutral, and buying refuses to overdraw.
//
// It CAN be negative. The one way is undoing a completion whose fungi
// were already spent — and Kimia's rule for that (2026-07-20): the
// debt stays real under the hood. Owned objects are never taken away,
// but later income and later refunds settle the debt first, quietly,
// before anything new can be gained.
export function walletTrueBalance(completions, purchases) {
  return fungusBalanceFrom(completions) - ownedTotal(purchases)
}

// What the wallet SHOWS: the true balance, but never less than zero —
// a negative number would read as debt, which is punishment feel (the
// first guardrail), so the meter simply rests at empty. The debt is
// still in the maths above: while it's being settled, a sale's refund
// (always exactly the price, into the true balance) may lift the
// display by less, or leave it at empty a little longer.
export function walletBalance(completions, purchases) {
  return Math.max(0, walletTrueBalance(completions, purchases))
}

// Shape check for storage: a list of owned instances, each with a
// unique id, a well-formed object key, a positive whole price and a
// real buy moment. (Whether the object's region still exists is NOT
// checked — a retuned catalogue must never invalidate an old backup.)
export function validatePurchases(purchases) {
  if (!Array.isArray(purchases)) {
    throw new Error('Purchases must be a list.')
  }
  const ids = new Set()
  for (const purchase of purchases) {
    if (typeof purchase !== 'object' || purchase === null) {
      throw new Error('A purchase must be an object.')
    }
    if (typeof purchase.id !== 'string' || purchase.id === '') {
      throw new Error('A purchase needs its own id.')
    }
    if (ids.has(purchase.id)) {
      throw new Error('Two purchases share an id.')
    }
    ids.add(purchase.id)
    parseObjectKey(purchase.objectKey)
    if (!Number.isInteger(purchase.price) || purchase.price <= 0) {
      throw new Error('A purchase price must be a positive whole number.')
    }
    if (!Number.isInteger(purchase.boughtAt) || purchase.boughtAt < 0) {
      throw new Error('A purchase needs the moment it was bought.')
    }
  }
}
