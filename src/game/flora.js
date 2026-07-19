// Flora decisions (T3.3) — pure logic, no React, no storage.
//
// A flora find is identified by the completion that dropped it (at most
// one flora per completion — the window guarantee places one find per
// expedition step, T3.1). What happened to the find afterwards lives in
// ONE map, stored in the envelope (storage v4):
//
//   floraDecisions: { [completionId]: 'gathered' | 'left' | 'composted' }
//
// A find with no entry is 'pending' — it waits, quietly, on the Abode
// page until it's decided (Kimia's decision 2026-07-19: undecided flora
// wait to be decided later; no deadline, and never a nag).
//
// The four statuses of a find:
//   pending   — arrived, not yet decided; waits on the Abode page
//   gathered  — taken home; shows in the Abode; compostable ANYTIME
//   left      — declined; stays where it grows, still part of the world
//   composted — was gathered, then returned to the world
//
// NOTHING IS EVER LOST (spec §5 Stream 1): 'left' and 'composted' flora
// are back in the world, and flora finds keep arriving on their steady
// window schedule (drops.js) no matter what was decided — so composted
// flora can always be encountered again. And COMPOSTING YIELDS NOTHING:
// flora are discoveries, not money. No function in this module touches
// the wallet, on purpose.
//
// Everything here is derived from completion history + the decisions
// map (the same always-derived principle as the meters): a decision
// whose completion no longer exists (its tap was undone, or its habit
// deleted forever) simply stops existing — as if the find never was.

// The three decisions that can be recorded. 'pending' is the absence
// of an entry, never a stored value.
export const FLORA_DECISIONS = ['gathered', 'left', 'composted']

// What may follow what: a pending find is gathered or left; a gathered
// one may later be composted. 'left' and 'composted' are final — the
// flora is back in the world, out of our hands.
const ALLOWED_NEXT = {
  pending: ['gathered', 'left'],
  gathered: ['composted'],
  left: [],
  composted: [],
}

// The status of one find, by its completion's id.
export function floraStatus(decisions, completionId) {
  return decisions[completionId] ?? 'pending'
}

// Every flora find in this history, in arrival order:
//   { completionId, habitId, dayKey, status }
// Decisions for completions that no longer exist are ignored.
export function floraFinds(completions, decisions) {
  const finds = []
  for (const completion of completions) {
    if (!completion.drops.some((drop) => drop.kind === 'flora')) continue
    finds.push({
      completionId: completion.id,
      habitId: completion.habitId,
      dayKey: completion.dayKey,
      status: floraStatus(decisions, completion.id),
    })
  }
  return finds
}

// Record one decision about one find. Returns a NEW decisions map (the
// original is untouched); refuses anything the rules above don't allow,
// so a stale button can never corrupt the record.
export function decideFlora(decisions, completions, completionId, decision) {
  if (!FLORA_DECISIONS.includes(decision)) {
    throw new Error(
      `Unknown flora decision "${decision}" — expected one of: ` +
        FLORA_DECISIONS.join(', '),
    )
  }
  const completion = completions.find((c) => c.id === completionId)
  if (!completion || !completion.drops.some((d) => d.kind === 'flora')) {
    throw new Error('No flora find belongs to this completion.')
  }
  const status = floraStatus(decisions, completionId)
  if (!ALLOWED_NEXT[status].includes(decision)) {
    throw new Error(
      `A ${status} flora find cannot become ${decision} — ` +
        (status === 'pending'
          ? 'it can only be gathered or left.'
          : status === 'gathered'
            ? 'it can only be composted.'
            : 'it is back in the world, out of our hands.'),
    )
  }
  return { ...decisions, [completionId]: decision }
}

// Drop decisions whose completion is gone (undo, delete-forever, or an
// import into a different history). Called on every save, so the stored
// map never carries ghosts.
export function pruneFloraDecisions(decisions, completions) {
  const alive = new Set(completions.map((c) => c.id))
  const pruned = {}
  for (const [completionId, decision] of Object.entries(decisions)) {
    if (alive.has(completionId)) pruned[completionId] = decision
  }
  return pruned
}

// Shape check for storage: the map must be an object of known decision
// strings. (Whether each completion still exists is NOT checked here —
// orphans are legal in a freshly imported backup and get pruned on the
// next save.)
export function validateFloraDecisions(decisions) {
  if (
    typeof decisions !== 'object' ||
    decisions === null ||
    Array.isArray(decisions)
  ) {
    throw new Error(
      'Flora decisions must be a map of completion id → decision.',
    )
  }
  for (const [completionId, decision] of Object.entries(decisions)) {
    if (completionId === '') {
      throw new Error('A flora decision needs the id of its completion.')
    }
    if (!FLORA_DECISIONS.includes(decision)) {
      throw new Error(
        `Unknown flora decision "${decision}" — expected one of: ` +
          FLORA_DECISIONS.join(', '),
      )
    }
  }
}
