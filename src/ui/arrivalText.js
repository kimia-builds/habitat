// Plain-language names for arriving drops (T3.2) — shared by the
// arrival shelf, the quiet by-the-habit notes, and the first reveals.

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { friendDisplayName } from '../content/names.js'

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
    case 'friend': {
      // Kimia's name for them once she writes one (T6.1a). Until then
      // the plain functional word, exactly like "a flora find" above —
      // this sentence has to name SOMETHING, and the honest generic is
      // better than a species name Claude invented.
      const key = FRIEND_CATEGORIES[arrival.friend.category].key
      return friendDisplayName(key, arrival.friend.individual) ?? 'a friend'
    }
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
