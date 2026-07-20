// Friendships (T4.4) — pure logic, no React, no storage.
//
// Literacy milestones open doors (spec §5 Stream 2): the moment the
// reading points cross one of the LITERACY_MILESTONES thresholds, that
// friend category becomes possible — and its FIRST friend arrives as a
// surprise drop 1–5 Habitat days later ("anticipation first, surprise
// second"). Repeats are allowed (Kimia's decision 2026-07-20): each
// NEXT friend of the same category waits a seeded 20–50 days after the
// previous one actually arrived, so friends can never bunch up.
//
// A friend arrives exactly like every other drop: rolled at tap time
// and STORED on the completion as
//   { kind: 'friend', category: 0..9, individual: 1.. }
// (individual = which friend of that category, in arrival order).
// One friend per tap — the one who has waited longest. Undoing the
// completion takes the friend back, and the next tap re-derives it:
// the delays are seeded per category + individual, so the identical
// friend returns on the identical day (the T3.1 no-slot-machine rule).
//
// Everything else here is derived from completion history, the meters'
// own principle: undoing the reading that opened a door quietly closes
// it again (pending friends wait; arrived ones stay — their stored
// drops are settled history), and nothing is stored that could go
// stale.

import {
  FRIEND_CATEGORIES,
  FRIEND_FIRST_DELAY_DAYS,
  FRIEND_REPEAT_GAP_DAYS,
  LITERACY_MILESTONES,
  LITERACY_POINTS,
} from './constants.js'
import { addDays } from './days.js'
import { randomUnit } from './drops.js'

// The day each category's door opened: the Habitat day of the reading
// drop that pushed the points past its threshold (completions are
// scanned in entry order; a threshold never yet crossed reads null).
// Derived fresh every time, so undoing the crossing reading quietly
// un-opens the door.
export function doorOpenDays(completions) {
  const doors = LITERACY_MILESTONES.map(() => null)
  let reached = 0
  let points = 0
  for (const completion of completions) {
    for (const drop of completion.drops) {
      if (drop.kind !== 'reading') continue
      points += LITERACY_POINTS[drop.readingType]
      while (
        reached < LITERACY_MILESTONES.length &&
        points >= LITERACY_MILESTONES[reached]
      ) {
        doors[reached] = completion.dayKey
        reached++
      }
    }
  }
  return doors
}

// Every friend who has arrived, in arrival order:
//   { completionId, category, individual, dayKey }
// The Guest Book's whole contents, derived from the stored drops.
export function friendsFrom(completions) {
  const friends = []
  for (const completion of completions) {
    for (const drop of completion.drops) {
      if (drop.kind !== 'friend') continue
      friends.push({
        completionId: completion.id,
        category: drop.category,
        individual: drop.individual,
        dayKey: completion.dayKey,
      })
    }
  }
  return friends
}

// A seeded wait in days, inside its range (min/max from constants).
// The same world seed + category + individual always waits the same —
// that is what makes an undone friend come back identical.
function seededWaitDays(worldSeed, category, individual, range) {
  const span = range.max - range.min + 1
  const roll = randomUnit(`${worldSeed}|friend|${category}|${individual}`)
  return range.min + Math.floor(roll * span)
}

// The Habitat day one friend of one category becomes due:
//   - the FIRST: 1–5 seeded days after the door opened;
//   - each NEXT: 20–50 seeded days after the previous friend of that
//     category actually arrived (never after its due day — a friend who
//     waited weeks for a tap doesn't pull the next one forward).
export function friendDueDay(
  worldSeed,
  doorDay,
  category,
  individual,
  previousArrivalDay,
) {
  if (individual === 1) {
    return addDays(
      doorDay,
      seededWaitDays(worldSeed, category, 1, FRIEND_FIRST_DELAY_DAYS),
    )
  }
  return addDays(
    previousArrivalDay,
    seededWaitDays(worldSeed, category, individual, FRIEND_REPEAT_GAP_DAYS),
  )
}

// The next friend waiting on this history: the earliest-due one whose
// category's door is open and who hasn't arrived yet (ties settle on
// the lower category — the lower door has waited longer by design).
// Returns { category, individual, dueDay } or null when no door is
// open. Whether the friend actually arrives depends on the tap's day —
// withFriendDrop below compares.
export function nextFriendDue(completions, worldSeed) {
  const doors = doorOpenDays(completions)
  const arrived = friendsFrom(completions)
  let best = null
  for (let category = 0; category < FRIEND_CATEGORIES.length; category++) {
    if (doors[category] === null) continue
    const ofCategory = arrived.filter((friend) => friend.category === category)
    const individual = ofCategory.length + 1
    const dueDay = friendDueDay(
      worldSeed,
      doors[category],
      category,
      individual,
      ofCategory[ofCategory.length - 1]?.dayKey,
    )
    if (
      best === null ||
      dueDay < best.dueDay ||
      (dueDay === best.dueDay && category < best.category)
    ) {
      best = { category, individual, dueDay }
    }
  }
  return best
}

// Roll the friendship stream for one new completion: if a friend is
// due — their door open and their due day reached by the tap's OWN day
// (a retro mark only meets friends its day had already reached) — they
// ride along, stored on the completion with the tap's other drops.
// `existing` is the completions list BEFORE this one, exactly as
// deliverDrops takes it. One friend per tap, always.
export function withFriendDrop(completion, existing, worldSeed) {
  const due = nextFriendDue(existing, worldSeed)
  if (due === null || due.dueDay > completion.dayKey) return completion
  return {
    ...completion,
    drops: [
      ...completion.drops,
      { kind: 'friend', category: due.category, individual: due.individual },
    ],
  }
}

// What one friend is called until T6.1 names the beings: the draft
// category singular (Kimia's decision 2026-07-20) — "a Drifter".
export function friendName(friend) {
  return `a ${FRIEND_CATEGORIES[friend.category].singular}`
}
