// lenses.js — the ARRANGEMENT the habit list is being looked at through
// (spec §5b "The lenses", design-notes §11f; T6.23).
//
// A lens changes how the list LOOKS. It never touches the record
// underneath: nothing in this file knows what a completion is, and
// nothing it returns is ever saved. The arrangement is three things at
// once — an ORDER, a set of MUTED tiles (dim, still fully tappable), and
// (from T6.23b) a set of hidden ones. This file holds the order and the
// muting; hiding arrives with the `today` lens.
//
// It is all TEMPORARY for now. A refresh or the 3am day turn throws the
// arrangement away and the stored order comes back. T6.23e is the task
// that gives it somewhere to be saved.

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
// the ids that were already muted (not counting this one).
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
