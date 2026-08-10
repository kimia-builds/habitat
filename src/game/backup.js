// How stale is the backup? (T6.4a)
//
// Habitat's whole history lives in one browser store, and browsers do
// evict storage — so the only real safety net is an exported file kept
// somewhere else. That file is only as good as its age, and an age
// nobody can see may as well not exist. This turns the stored
// lastExportedOn marker into one plain line of text.
//
// Tone matters here as much as the maths (design-notes: no punishment
// FEEL, ever). This is a fact, not a telling-off: it never scolds, never
// counts a streak of neglect, and never earns an alarm colour. The
// caller renders it dim and quiet. A tracker with no punishment
// mechanics does not get to make you feel bad about a chore.

import { daysBetween } from './days.js'

// Plain-English age of the last backup. `lastExportedOn` is a day key
// or null (never exported); `todayKey` is the current Habitat day.
export function backupAgeLabel(lastExportedOn, todayKey) {
  if (lastExportedOn === null || lastExportedOn === undefined) {
    return 'no backup yet'
  }
  const days = daysBetween(lastExportedOn, todayKey)
  // A clock that has gone backwards, or a backup dated in the future
  // (an imported file from another machine). Nothing useful to say, and
  // certainly nothing alarming — report the fact and move on.
  if (days < 0) return 'backed up'
  if (days === 0) return 'backed up today'
  if (days === 1) return 'backed up yesterday'
  return `backed up ${days} days ago`
}
