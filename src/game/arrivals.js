// Drop arrival (T3.2) — pure logic between the drops engine and the
// UI. No React, no storage.
//
// Kimia's decisions 2026-07-19 (T3.2):
//   - Drops START FRESH from this update: completions recorded before
//     the world seed existed carry an empty drops list (the storage
//     upgrade writes it), so old history never showers retroactive
//     rewards — no front-loading, ever.
//   - Every completion STORES what it delivered (deliverDrops below).
//     Undo removes the completion, so its drops leave with it, and no
//     other tap's stored luck ever reshuffles — the T3.1
//     no-slot-machine rule holds even as history changes.
//   - FIVE first-occurrence reveals: first flora, first magazine,
//     first novel, first dictionary, first fungus. Whether a drop is a
//     first is DERIVED from stored history — undo the only flora ever
//     found and the next one counts as a first again.

import { countOn } from './completions.js'
import { EXPEDITION_STEPS_PER_COMPLETION } from './constants.js'
import { rollDrops } from './drops.js'

// The five reveal families a drop can belong to. Reading splits into
// its three types (spec §5: "first flora, first magazine, first
// fungus…" — each rarity is its own moment).
export const DROP_KEYS = ['flora', 'magazine', 'novel', 'dictionary', 'fungi']

// Which reveal family one drop record belongs to.
export function dropKey(drop) {
  return drop.kind === 'reading' ? drop.readingType : drop.kind
}

// Roll everything a new completion delivers and attach it, ready to be
// stored. `existing` is the completions list BEFORE this one: its
// length gives this tap's expedition step (one step per completion —
// the same 1:1 counting as the expedition meter), and its marks on the
// same habit + day give the tapIndex the seeded rolls key on.
export function deliverDrops(completion, habit, existing, worldSeed) {
  const drops = rollDrops({
    worldSeed,
    habitId: completion.habitId,
    dayKey: completion.dayKey,
    tapIndex: countOn(existing, completion.habitId, completion.dayKey),
    stepIndex: existing.length * EXPEDITION_STEPS_PER_COMPLETION,
    difficulty: habit.difficulty,
  })
  return { ...completion, drops }
}

// All reading material ever received, in arrival order — the literacy
// meter's feed AND the Bookcase's contents (reading is never
// discarded, spec §5 Stream 2). Since T3.5 each item also knows the
// day it arrived and which publication it is; publicationId stays
// null until the T6.1 content pools name the publications, so until
// then no spread image can match it and the popup shows its empty
// state.
export function readingItemsFrom(completions) {
  const items = []
  for (const completion of completions) {
    completion.drops.forEach((drop, index) => {
      if (drop.kind !== 'reading') return
      items.push({
        id: `${completion.id}:${index}`,
        type: drop.readingType,
        dayKey: completion.dayKey,
        publicationId: drop.publicationId ?? null,
      })
    })
  }
  return items
}

// The fungus wallet: every fungus ever dropped. Purchases arrive in M4
// and will subtract from this — until then income is the whole story.
export function fungusBalanceFrom(completions) {
  let balance = 0
  for (const completion of completions) {
    for (const drop of completion.drops) {
      if (drop.kind === 'fungi') balance += drop.amount
    }
  }
  return balance
}

// The set of drop keys that have EVER occurred in this history. A drop
// whose key isn't in here yet is a first, and earns its neon reveal.
export function seenDropKeys(completions) {
  const seen = new Set()
  for (const completion of completions) {
    for (const drop of completion.drops) {
      seen.add(dropKey(drop))
    }
  }
  return seen
}
