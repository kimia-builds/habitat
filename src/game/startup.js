// The daily startup moment (T4.5, spec §5b) — pure logic, no React.
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
// same Habitat day goes straight past. The T4.5 fade is a
// placeholder; the real animation is T5.2.
export function shouldShowStartup(todayKey, shownOn) {
  return shownOn !== todayKey
}
