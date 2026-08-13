// The daily startup moment (T4.5, spec §5b) — pure logic, no React.

import { isoWeekday } from './days.js'

//
// THE DAILY SEQUENCE: on the first visit of each Habitat day the app
// plays its startup moment, and the morning's fixed order is:
//
//   1. the done-yesterday check-in pop-up (if one is owed, T1.4)
//   2. the startup fade (this module's moment)
//   3. the Sunday field notes (Sundays only, T2.3)
//
// It fires on day ROLLOVER — the Habitat day key already carries the
// 3am cutoff (game/days.js), so a 1am visit still belongs to
// yesterday — and NEVER on a "lived day" (a day with a habit marked);
// the two ideas are unrelated. It plays whether or not a check-in was
// owed. `shownOn` — the last Habitat day it played — lives in
// settings as startupShownOn (storage.js), so a second visit on the
// same Habitat day goes straight past.
export function shouldShowStartup(todayKey, shownOn) {
  return shownOn !== todayKey
}

// WHAT COLOUR THE PLANET GLOWS (T5.2e, design-notes §12f).
//
// Every ordinary day it is the shell charm's pink — the third charm, and
// the one that already reads as PLACE. On Sundays it instead picks at
// random from the other five, so the field-notes day gets a different
// light and you never quite know which. That is the whole rule: it does
// not depend on streaks, milestones or anything you did, because the
// moment its look answered to performance it would be a scoreboard.
export const STARTUP_CHARM = 3 // shell — pink, the everyday planet
export const SUNDAY_CHARMS = [1, 2, 4, 5, 6] // gold, coral, lavender, sky, teal

// `pick` is injected so the choice can be tested; it defaults to real
// randomness, which is the point of the Sunday rule.
export function startupCharm(todayKey, pick = Math.random) {
  if (isoWeekday(todayKey) !== 7) return STARTUP_CHARM
  // Math.random() can never return 1, but an injected pick might, and an
  // out-of-range index would hand the planet `undefined` — clamp it.
  const index = Math.min(
    Math.floor(pick() * SUNDAY_CHARMS.length),
    SUNDAY_CHARMS.length - 1,
  )
  return SUNDAY_CHARMS[index]
}
