// The three meters (T2.1) — pure maths, no React, no storage.
//
// Design rule (Kimia's decision 2026-07-15): meters are always COMPUTED
// from history, never stored as a running number. That buys three
// things for free:
//   - undoing a completion reverses the expedition meter exactly,
//   - retroactive check-in marks count the same as live ones,
//   - retuning a pacing constant later can never corrupt history.
// The one exception is the fungus WALLET, whose balance genuinely is a
// number that goes up and down — but only ever down by a purchase the
// user chose, and never below zero (spec §5 Stream 3).

import {
  EXPEDITION_STEPS_PER_COMPLETION,
  LITERACY_MILESTONES,
  LITERACY_POINTS,
  READING_TYPES,
} from './constants.js'

// ── Expedition ──────────────────────────────────────────────────────

// The whole expedition meter: one fixed step per completion ever
// recorded, regardless of difficulty (1:1:1, decision 2026-07-15) and
// including extras beyond an N-per-day target — every tap counts.
export function expeditionSteps(completions) {
  return completions.length * EXPEDITION_STEPS_PER_COMPLETION
}

// ── Literacy ────────────────────────────────────────────────────────

// A reading item is anything with a type of 'magazine', 'novel' or
// 'dictionary'. Unknown types throw rather than silently scoring
// nothing — a typo in M3's drop tables should fail loudly.
export function validateReadingItem(item) {
  if (typeof item !== 'object' || item === null) {
    throw new Error('A reading item must be an object.')
  }
  if (!READING_TYPES.includes(item.type)) {
    throw new Error(
      `Unknown reading type "${item.type}" — expected one of: ` +
        READING_TYPES.join(', '),
    )
  }
}

// The whole literacy meter: every piece of reading material ever
// received, scored by rarity. Reading material is never discarded
// (spec §5 Stream 2), so this only ever grows.
export function literacyPoints(readingItems) {
  let total = 0
  for (const item of readingItems) {
    validateReadingItem(item)
    total += LITERACY_POINTS[item.type]
  }
  return total
}

// How many friendship doors this many points has opened: 0..10,
// counting up the milestone ladder (Drifters first, Poets last).
// Landing exactly ON a threshold reaches it.
export function milestonesReached(points) {
  return LITERACY_MILESTONES.filter((threshold) => points >= threshold).length
}

// ── Fungus wallet ───────────────────────────────────────────────────

// Fungi are whole mushrooms: balances are non-negative whole numbers,
// and every credit, price or refund is a positive whole number.
function validateBalance(balance) {
  if (!Number.isInteger(balance) || balance < 0) {
    throw new Error('A wallet balance must be a whole number, zero or more.')
  }
}

function validateAmount(amount, what) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(`A ${what} must be a positive whole number.`)
  }
}

// A fungus drop pays into the wallet (drops themselves arrive in M3).
export function creditFungi(balance, amount) {
  validateBalance(balance)
  validateAmount(amount, 'fungus credit')
  return balance + amount
}

// A purchase the user chose — the ONLY way the meter ever goes down
// (spec §5). Refuses to overdraw: the wallet can never go negative.
export function spendFungi(balance, price) {
  validateBalance(balance)
  validateAmount(price, 'price')
  if (price > balance) {
    throw new Error(
      `Not enough fungi — this costs ${price} but the wallet holds ${balance}.`,
    )
  }
  return balance - price
}

// Returning an object refunds EXACTLY its price — buy then return is
// always fungus-neutral; no penalty, no spread, ever (spec §5).
export function refundFungi(balance, price) {
  validateBalance(balance)
  validateAmount(price, 'refund')
  return balance + price
}
