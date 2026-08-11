// Starting over (T6.6) — wiping the WORLD while keeping the habit
// record. Pure functions: no React, no storage.
//
// Kimia's decision 2026-08-11: a fresh start must leave her habits and
// every completion she has ever logged untouched — the grid, the
// streaks and the field notes are a record of real life, not game
// progress — while the planet itself begins again from nothing.
//
// That takes TWO moves, because the world hangs off history in two
// separate ways:
//
//   1. Drops are stored ON completions (game/drops.js). So a new game
//      empties every completion's drops list. That one move resets the
//      literacy meter, the fungus wallet, the bookcase, the guest book
//      and every flora find at a stroke — all of them are derived from
//      drops, so with no drops there is nothing to derive. It is
//      exactly what the v2→v3 upgrade did on 2026-07-19: old history
//      never showers retroactive rewards.
//
//   2. Three things COUNT completions instead of reading their drops —
//      the expedition meter, region discovery on the map, and the
//      Market's lived-day rotation. Emptying drops does nothing to
//      those, so each old completion is STAMPED `pastGame: true`. It
//      keeps its habit, its day and its moment — the habit record is
//      unchanged in every way that describes Kimia's life — and only
//      the game side reads the stamp, through gameCompletions below.
//
// Why a stamp and not "everything recorded after the reset moment":
// a timestamp boundary has to decide what happens to a mark made in
// the very same millisecond as the reset, and gets it wrong whichever
// way it leans. A stamp put on the exact records being retired has no
// boundary to get wrong, and it stays right through an undo, an
// import, and a second new game later on.

// The completions the CURRENT game may count. Marks from a past game
// keep their place in the record and simply do not count here.
export function gameCompletions(completions) {
  if (!Array.isArray(completions)) {
    throw new Error('gameCompletions needs a completions list.')
  }
  return completions.filter((completion) => !completion.pastGame)
}

// The new envelope after "start a new game". Everything habit-side is
// passed through untouched — habits, completions (minus their drops),
// the check-in marker and every setting, including the backup date.
// Everything world-side is emptied.
//
// The world seed is REPLACED, not kept. Drops are a pure function of
// the seed plus the tap (T3.1's no-slot-machine rule), so keeping it
// would make the new game a note-for-note replay of the old one. A new
// seed is what makes this a new planet rather than a rewind.
export function startNewGame(data, seed = crypto.randomUUID()) {
  if (typeof data !== 'object' || data === null) {
    throw new Error('startNewGame needs the data envelope.')
  }
  if (typeof seed !== 'string' || seed === '') {
    throw new Error('startNewGame needs a non-empty world seed.')
  }
  return {
    ...data,
    completions: data.completions.map((completion) => ({
      ...completion,
      drops: [],
      pastGame: true,
    })),
    floraDecisions: {},
    bookcaseLayout: {},
    abodeLayout: {},
    purchases: [],
    worldSeed: seed,
  }
}
