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

import { DEFAULT_LANGUAGE, translate } from '../content/ui.js'
import { daysBetween } from './days.js'

// Plain-English age of the last backup. `lastExportedOn` is a day key
// or null (never exported); `todayKey` is the current Habitat day.
//
// `t` is the caller's translator (T6.13). It is optional, and defaults
// to the English one, so this stays a plain function anything can call —
// including its own tests — without knowing about languages at all.
export function backupAgeLabel(
  lastExportedOn,
  todayKey,
  t = (key, vars) => translate(DEFAULT_LANGUAGE, key, vars),
) {
  if (lastExportedOn === null || lastExportedOn === undefined) {
    return t('backup.ageNone')
  }
  const days = daysBetween(lastExportedOn, todayKey)
  // A clock that has gone backwards, or a backup dated in the future
  // (an imported file from another machine). Nothing useful to say, and
  // certainly nothing alarming — report the fact and move on.
  if (days < 0) return t('backup.ageFuture')
  if (days === 0) return t('backup.ageToday')
  if (days === 1) return t('backup.ageYesterday')
  return t('backup.ageDays', { days })
}
