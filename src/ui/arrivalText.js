// Plain-language names for arriving drops (T3.2) — shared by the
// arrival shelf, the quiet by-the-habit notes, and the first reveals.

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { friendDisplayName } from '../content/names.js'

// One arrival, named: "a flora find", "a novel", "2 fungi", "a plip"…
// `t` is the translator (useText), so the words come from the copy deck.
export function arrivalLabel(arrival, t) {
  switch (arrival.key) {
    case 'flora':
      return t('arrival.flora')
    case 'magazine':
      return t('arrival.magazine')
    case 'novel':
      return t('arrival.novel')
    case 'dictionary':
      return t('arrival.dictionary')
    case 'fungi':
      return arrival.amount === 1
        ? t('arrival.fungusOne')
        : t('arrival.fungi', { n: arrival.amount })
    case 'friend': {
      // Kimia's name for them once she writes one (T6.1a). Until then
      // the plain functional word, exactly like "a flora find" above —
      // this sentence has to name SOMETHING, and the honest generic is
      // better than a species name Claude invented.
      const key = FRIEND_CATEGORIES[arrival.friend.category].key
      return (
        friendDisplayName(key, arrival.friend.individual) ?? t('arrival.friend')
      )
    }
    default:
      return t('arrival.something')
  }
}

// The quiet note beside the habit that was tapped: everything its
// still-visible arrivals delivered, in one gentle sentence.
export function arrivalNote(arrivals, t) {
  if (arrivals.length === 0) return null
  const list = arrivals
    .map((arrival) => arrivalLabel(arrival, t))
    .join(` ${t('arrival.and')} `)
  return t('arrival.note', { list })
}
