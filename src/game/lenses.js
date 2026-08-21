// lenses.js — the ARRANGEMENT the habit list is being looked at through
// (spec §5b "The lenses", design-notes §11f; T6.23).
//
// A lens changes how the list LOOKS. It never touches the record
// underneath: `prioritise` READS what has been done, since a finished
// habit sinks, but nothing here writes anything and nothing it returns
// is ever saved. The arrangement is three things at once — an ORDER, a
// set of MUTED tiles (dim, still fully tappable) and a set of HIDDEN
// ones (not drawn at all — and the reason nothing re-orders while any
// of them exist, design-notes §12a).
//
// The arrangement on screen is TEMPORARY. A refresh or the 3am day turn
// throws it away and the saved DEFAULT VIEW comes back — order, charms
// and mutings, restored at any time by the `default` lens and written
// down by one press of `save as default` (T6.23e, at the foot of this
// file). Dragging never writes anything: that is the whole point of it.

import { priorityTier, todayTier } from './schedule.js'

// The habits in the order the SCREEN is showing them.
//
// `screenOrder` is a list of habit ids — the temporary arrangement — and
// is null when nothing has rearranged anything yet, in which case the
// stored order is the answer and we hand `habits` straight back.
//
// Any habit the arrangement has never heard of goes to the END, in its
// stored order. That is what a habit created a moment ago is, and the
// end is exactly where a new habit has always joined the list.
export function orderedForScreen(habits, screenOrder) {
  if (!Array.isArray(screenOrder)) return habits
  const place = new Map(screenOrder.map((id, index) => [id, index]))
  const known = habits.filter((h) => place.has(h.id))
  const newcomers = habits.filter((h) => !place.has(h.id))
  known.sort((a, b) => place.get(a.id) - place.get(b.id))
  return [...known, ...newcomers]
}

// Where a tile lands when its eye is closed (Kimia's call 2026-08-20).
//
// It sinks to just under the LIVE list — below every tile still in your
// eyeline, and above anything muted earlier. So the dim ones end up
// newest-first, and the tile you just put out of the way is the one
// nearest the habits you are still working through.
//
// MUTING ONLY EVER SINKS. If the tile is already lower than that — it
// was dragged down to the floor at some point, say — it stays exactly
// where it is. Closing an eye must never lift anything up the list.
//
// `order` is the ids on screen, `id` the one being muted, and `muted`
// the ids that were already muted (not counting this one). Hidden tiles
// are not special here (T6.23b): they are not drawn, so they cannot
// change what the sink LOOKS like, and counting them as part of the list
// to sink past is what leaves the dim ones at the true bottom once an
// un-hide brings the rest back.
export function sinkOnMute(order, id, muted) {
  const from = order.indexOf(id)
  if (from === -1) return order
  const rest = order.filter((other) => other !== id)
  // The lowest tile that is not muted; -1 when every other tile is
  // already dim, which sends this one to the very top of them.
  let lastLive = -1
  rest.forEach((other, index) => {
    if (!muted.includes(other)) lastLive = index
  })
  const landing = lastLive + 1
  // Removing the tile shifts everything below it up one, so `landing` is
  // also its final index. Not a sink? Then it doesn't move.
  if (landing <= from) return order
  const sunk = [...rest]
  sunk.splice(landing, 0, id)
  return sunk
}

// The `today` lens (spec §5b, T6.23b) — Kimia's call 2026-08-20.
//
// It reaches into the arrangement on screen, changes it, and lets go.
// It holds nothing: there is no "today mode" to be in, which is what
// lets the verbs stack in any order without any of them starting over.
// Each habit lands in one of three tiers (`todayTier` in schedule.js):
//
//   applies today → KEPT, and brought back to full brightness if it was
//                   muted (Kimia's call 2026-08-21: today is the day's
//                   list, so nothing that belongs to today stays dim)
//   could apply   → MUTED, and sunk to the bottom by the eye's own rule
//   neither       → HIDDEN
//
// Anything ALREADY hidden stays hidden. A lens narrows what is on
// screen rather than re-deciding the whole list, and `un-hide all` is
// the one press back.
//
// `habits` are the habit objects in SCREEN order. Nothing here is
// saved, and nothing here can be: it returns a new arrangement and
// touches no record.
export function todayLens(habits, { muted, hidden }, dayKey) {
  const nextHidden = [...hidden]
  const nextMuted = new Set(muted)
  const sinking = []

  for (const habit of habits) {
    if (nextHidden.includes(habit.id)) continue
    const tier = todayTier(habit, dayKey)
    if (tier === 'applies') nextMuted.delete(habit.id)
    else if (tier === 'could') sinking.push(habit.id)
    else nextHidden.push(habit.id)
  }

  // Sunk BOTTOM-MOST FIRST, so the block arrives in the order it was
  // already in. Each mute lands just above the one muted before it
  // (T6.23a's rule), so muting them top-down would turn the group
  // upside down on the way to the floor.
  let order = habits.map((h) => h.id)
  for (const id of [...sinking].reverse()) {
    order = sinkOnMute(order, id, [...nextMuted])
    nextMuted.add(id)
  }

  return { order, muted: [...nextMuted], hidden: nextHidden }
}

// The `prioritise` lens (spec §5b, T6.23c) — Kimia's call 2026-08-20.
//
// The plainest of the verbs: it ONLY ever re-orders. Nothing is muted,
// un-muted, hidden or un-hidden by it, and a dim tile is sorted exactly
// like a bright one — "prioritise is an ordering tool: keep any
// (un)muted tasks the way that they are, reorder only where applicable"
// (Kimia, 2026-08-21). So it returns an order and nothing else.
//
// Three tiers, from `priorityTier`: owed today · owed this week ·
// everything else. The sort is STABLE, which is the whole point of it —
// two habits in the same tier keep the order they were already in,
// because a daily and a daily are the same priority and a manual
// arrangement of them must survive the press. Filling three buckets in
// screen order and joining them is stable by construction; there is no
// comparison between two habits anywhere, so there is nothing that
// could shuffle equals.
//
// Hidden tiles are sorted along with the rest. They are not drawn, so
// nothing about this is visible until an `un-hide all` brings them
// back — and then they arrive already in their tiers rather than in
// some older order nobody can account for.
//
// `habits` are the habit objects in SCREEN order.
export function prioritiseLens(habits, completions, dayKey) {
  const tiers = { today: [], week: [], rest: [] }
  for (const habit of habits) {
    tiers[priorityTier(habit, completions, dayKey)].push(habit.id)
  }
  return [...tiers.today, ...tiers.week, ...tiers.rest]
}

// The `to-dos` lens (spec §5b, T6.23d) — Kimia's call 2026-08-20.
//
// The only lens that keeps a memory: it walks the one-time to-dos
// through a FOUR-PRESS CYCLE, and the control remembers which press
// comes next. Everything else here is a single act with no position in
// anything.
//
//   'top'    — the to-dos move to the head of the list, keeping the
//              order they were already in among themselves. It ONLY
//              moves them (Kimia's call 2026-08-21): a to-do that was
//              already dim arrives at the top still dim, because
//              un-dimming is 'off's job and nothing else's.
//   'bottom' — they sink and go dim, by the eye's own landing rule
//              (sinkOnMute), which is what "to the bottom" has meant
//              since T6.23a: just under the live list, above anything
//              muted before them.
//   'hidden' — they stop being drawn. Which locks the order, like any
//              other hiding, and brings `un-hide all` out.
//   'off'    — un-hidden and un-dimmed WHERE THEY STAND. It restores no
//              earlier position: to-dos that started scattered through
//              the list end the cycle gathered at the bottom, plainly
//              visible, and that is the whole point of the last press.
//
// `habits` are the habit objects in SCREEN order. A to-do is a habit on
// a `oneTime` schedule — its CURRENT schedule, not the one in force on
// some day, because this lens asks what a habit is rather than what any
// day expects of it. (An active to-do is always unfinished: finishing
// one archives it, `archivesWhenDone`.)
export const TODOS_LENS_STEPS = ['top', 'bottom', 'hidden', 'off']

export function todosLens(habits, { muted, hidden }, step) {
  const todoIds = habits
    .filter((h) => h.schedule.type === 'oneTime')
    .map((h) => h.id)
  const order = habits.map((h) => h.id)
  const others = order.filter((id) => !todoIds.includes(id))

  if (step === 'top') {
    return {
      order: [...todoIds, ...others],
      muted: [...muted],
      hidden: [...hidden],
    }
  }

  if (step === 'bottom') {
    // Sunk BOTTOM-MOST FIRST, for `todayLens`'s reason: each mute lands
    // just ABOVE the one muted before it, so sinking the group top-down
    // would land it upside down.
    const nextMuted = new Set(muted)
    let sunk = order
    for (const id of [...todoIds].reverse()) {
      sunk = sinkOnMute(sunk, id, [...nextMuted])
      nextMuted.add(id)
    }
    return { order: sunk, muted: [...nextMuted], hidden: [...hidden] }
  }

  if (step === 'hidden') {
    const nextHidden = [...hidden]
    for (const id of todoIds) {
      if (!nextHidden.includes(id)) nextHidden.push(id)
    }
    return { order, muted: [...muted], hidden: nextHidden }
  }

  // 'off' — nothing moves; the to-dos simply come back into view.
  return {
    order,
    muted: muted.filter((id) => !todoIds.includes(id)),
    hidden: hidden.filter((id) => !todoIds.includes(id)),
  }
}

// ── THE DEFAULT VIEW (T6.23e, spec §5b) ──────────────────────────────
//
// The arrangement Habitat opens on: an ORDER, a set of CHARMS and a set
// of MUTED tiles, and only those three. Pressing `default` restores it,
// and a refresh and the 3am day turn restore it by themselves.
//
// Dragging never writes it down (Kimia's call 2026-08-20, kept when
// design mode was retired on 2026-08-21): "temporary reorders feel fun
// to do… they should feel throwaway and flexible, without fear of
// commitment." One press — `save as default` — is the only thing that
// commits, which is what leaves every other re-order free.

// What a press of `save as default` should store.
//
// HIDDEN IS NOT ONE OF THE THREE, and cannot be: a saved view you cannot
// find your habits in is a trap (Kimia's reasoning 2026-08-20). So
// anything hidden at the moment you save is saved MUTED instead — out of
// your eyeline, exactly as it already was, but always findable. It keeps
// the place it is standing in; nothing sinks on the way.
export function viewToSave({ charms, muted, hidden }) {
  const savedMuted = [...muted]
  for (const id of hidden) {
    if (!savedMuted.includes(id)) savedMuted.push(id)
  }
  return { charms: [...charms], muted: savedMuted }
}

// Ids pointing at habits that no longer exist read as nothing at all
// (Kimia's call 2026-08-21). A mute is a note about a tile: delete the
// tile and the note means nothing, and a stale id must never be left
// lying around to dim whatever id gets handed out next.
export function forgetMissing(ids, habits) {
  const alive = new Set(habits.map((h) => h.id))
  return ids.filter((id) => alive.has(id))
}

// The stored habits array, re-ordered so the ACTIVE habits stand in the
// order the screen is showing them — what `save as default` writes into
// the envelope.
//
// Archived habits keep their EXACT slots. They are not on screen, so the
// arrangement has nothing to say about where they sit, and shuffling
// them would quietly re-order the archived drawer behind Kimia's back.
// Any active habit the screen never mentioned keeps its stored place at
// the end of the queue, which is where a habit created a moment ago
// already sits.
export function orderToSave(habits, screenIds) {
  const active = habits.filter((h) => !h.archived)
  const byId = new Map(active.map((h) => [h.id, h]))
  const queue = []
  for (const id of screenIds) {
    const habit = byId.get(id)
    if (habit && !queue.includes(habit)) queue.push(habit)
  }
  for (const habit of active) {
    if (!queue.includes(habit)) queue.push(habit)
  }
  // One active habit per active slot, in the queue's order; the archived
  // ones are simply handed back where they were found.
  let next = 0
  return habits.map((habit) => (habit.archived ? habit : queue[next++]))
}
