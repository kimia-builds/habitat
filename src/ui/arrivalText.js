// Plain-language names for arriving drops (T3.2) — shared by the
// arrival shelf, the quiet by-the-habit notes, and the first reveals.

import { FRIEND_CATEGORIES } from '../game/constants.js'

// One arrival, named: "a flora find", "a novel", "2 fungi", "a Drifter"…
export function arrivalLabel(arrival) {
  switch (arrival.key) {
    case 'flora':
      return 'a flora find'
    case 'magazine':
      return 'a magazine'
    case 'novel':
      return 'a novel'
    case 'dictionary':
      return 'a dictionary'
    case 'fungi':
      return arrival.amount === 1 ? '1 fungus' : `${arrival.amount} fungi`
    case 'friend':
      // Until T6.1 names the beings: the draft category singular
      // (Kimia's decision 2026-07-20).
      return `a ${FRIEND_CATEGORIES[arrival.friend.category].singular}`
    default:
      return 'something'
  }
}

// The quiet note beside the habit that was tapped: everything its
// still-visible arrivals delivered, in one gentle sentence.
export function arrivalNote(arrivals) {
  if (arrivals.length === 0) return null
  return `you came across ${arrivals.map(arrivalLabel).join(' and ')}`
}
