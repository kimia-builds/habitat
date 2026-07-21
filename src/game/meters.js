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
  EXPEDITION_SEGMENT_STEPS,
  EXPEDITION_STEPS_PER_COMPLETION,
  LITERACY_LEVEL_SCALE,
  LITERACY_MILESTONES,
  LITERACY_POINTS,
  READING_TYPES,
  WALLET_BAR_MAX,
} from './constants.js'

// ── Expedition ──────────────────────────────────────────────────────

// The whole expedition meter: one fixed step per completion ever
// recorded, regardless of difficulty (1:1:1, decision 2026-07-15) and
// including extras beyond an N-per-day target — every tap counts.
export function expeditionSteps(completions) {
  return completions.length * EXPEDITION_STEPS_PER_COMPLETION
}

// The rolling bar (T2.2, decision 2026-07-16): how far into the
// CURRENT segment the meter is. The bar fills over one segment
// (~a month at Kimia's pace), rolls over to empty, and starts again —
// so every tap visibly moves it. Landing exactly on a segment
// boundary shows a freshly emptied bar (the fill belongs to the NEXT
// segment about to begin).
export function expeditionSegment(steps) {
  return {
    into: steps % EXPEDITION_SEGMENT_STEPS,
    size: EXPEDITION_SEGMENT_STEPS,
  }
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

// The literacy meter's bar (T2.2): progress from the last milestone
// reached toward the next one. Once all 10 doors are open the ladder
// is complete and the bar simply shows full (no eleventh door).
export function literacySegment(points) {
  const reached = milestonesReached(points)
  if (reached === LITERACY_MILESTONES.length) {
    return { into: 1, size: 1 }
  }
  const floor = reached === 0 ? 0 : LITERACY_MILESTONES[reached - 1]
  return {
    into: points - floor,
    size: LITERACY_MILESTONES[reached] - floor,
  }
}

// The literacy meter's HOVER number (T4.5, Kimia's call 2026-07-21):
// the same ladder read out on a plain 0..LITERACY_LEVEL_SCALE scale —
// 10 per friendship level. Each open door contributes its whole 10;
// while the ladder is incomplete, the fraction of the way across the
// current milestone gap adds its share of the next 10. So exactly 10
// at the first threshold (10 points), exactly the top of the scale
// when all 10 doors are open (≥ 730 points), and 0 at zero.
export function literacyLevelNumber(points) {
  const reached = milestonesReached(points)
  if (reached === LITERACY_MILESTONES.length) {
    return LITERACY_LEVEL_SCALE
  }
  const perDoor = LITERACY_LEVEL_SCALE / LITERACY_MILESTONES.length
  const floor = reached === 0 ? 0 : LITERACY_MILESTONES[reached - 1]
  const gap = LITERACY_MILESTONES[reached] - floor
  return reached * perDoor + ((points - floor) / gap) * perDoor
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

// The wallet's BAR display (T4.5, Kimia's call 2026-07-21): the true
// balance clamped onto 0..WALLET_BAR_MAX. The true balance CAN be
// negative — hidden debt from undoing a completion whose fungi were
// already spent (see walletTrueBalance in game/market.js) — so this
// deliberately does NOT route through validateBalance, which rejects
// negatives: the clamping IS the validation. While debt is being
// settled the bar simply rests empty, and past the top it sits full —
// showing the plain number (negative included) is the hover's job,
// not this function's.
export function walletBar(trueBalance) {
  return {
    into: Math.min(Math.max(trueBalance, 0), WALLET_BAR_MAX),
    size: WALLET_BAR_MAX,
  }
}
