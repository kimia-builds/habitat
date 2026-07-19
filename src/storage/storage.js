// The ONE place that touches the browser's localStorage (CLAUDE.md rule:
// components never do). Everything the app remembers lives under a
// single key, wrapped in a versioned envelope:
//
//   {
//     schemaVersion: 3,
//     habits:      [...],   // since v2 each carries scheduleHistory
//                           // and archivedAt — see game/habits.js
//     completions: [...],   // see game/completions.js — since v3 each
//                           // carries its drops (T3.2)
//     settings:    { dayCutoffHour: 3,
//                    fieldNotesShownOn: null },  // the last Sunday the
//                              // field notes auto-opened — added in T2.3
//     checkedInThrough: null,  // last day whose check-in was answered
//                              // ('YYYY-MM-DD' or null) — added in T1.4
//     worldSeed: '…',          // anchors every seeded drop roll — created
//                              // once, at first run, never changed (T3.2)
//   }
//
// The schemaVersion lets a future Habitat recognise and upgrade old
// backups — upgradeData below does exactly that for v1.

import { validateCompletion } from '../game/completions.js'
import { DEFAULT_DAY_CUTOFF_HOUR } from '../game/constants.js'
import {
  dayKeyFromTimestamp,
  isValidDayKey,
  validateCutoffHour,
} from '../game/days.js'
import { validateHabit } from '../game/habits.js'

const STORAGE_KEY = 'habitat-data'
const SCHEMA_VERSION = 3

// The world seed: the one random act in the whole drops system —
// everything after it is a pure function of this string (T3.1's
// no-slot-machine rule). Created once per world, stored forever, and
// carried along in backups so an import restores the same luck.
function newWorldSeed() {
  return crypto.randomUUID()
}

export function emptyData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    habits: [],
    completions: [],
    settings: {
      dayCutoffHour: DEFAULT_DAY_CUTOFF_HOUR,
      fieldNotesShownOn: null,
    },
    checkedInThrough: null,
    worldSeed: newWorldSeed(),
  }
}

// v1 → v2 (T2.3): habits gain a date-stamped schedule history (so
// streak judgements can never be rewritten by later edits) and an
// archive timestamp. Past schedule edits were never recorded, so a v1
// habit's history reads as its current schedule from birth (Kimia's
// decision 2026-07-16 — the limitation fades as new history
// accumulates). A v1 archive's moment is likewise unknown, so the
// upgrade moment stands in. Anything malformed is left untouched for
// validateData to complain about properly.
function upgradeData(data, now = Date.now()) {
  return upgradeV2toV3(upgradeV1toV2(data, now))
}

function upgradeV1toV2(data, now) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 1) return data
  const rawCutoff = data.settings?.dayCutoffHour
  const cutoff =
    Number.isInteger(rawCutoff) && rawCutoff >= 0 && rawCutoff <= 23
      ? rawCutoff
      : DEFAULT_DAY_CUTOFF_HOUR
  const habits = Array.isArray(data.habits)
    ? data.habits.map((habit) => {
        if (
          typeof habit !== 'object' ||
          habit === null ||
          !Number.isInteger(habit.createdAt)
        ) {
          return habit
        }
        return {
          ...habit,
          scheduleHistory: habit.scheduleHistory ?? [
            {
              schedule: habit.schedule,
              fromDay: dayKeyFromTimestamp(habit.createdAt, cutoff),
            },
          ],
          archivedAt: habit.archivedAt ?? (habit.archived ? now : null),
        }
      })
    : data.habits
  return { ...data, schemaVersion: 2, habits }
}

// v2 → v3 (T3.2): the world gets its seed, and completions start
// carrying their drops. Existing completions get an EMPTY drops list —
// Kimia's decision 2026-07-19: drops start fresh from this update; old
// history never showers retroactive rewards. Anything malformed is
// left untouched for validateData to complain about properly.
function upgradeV2toV3(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 2) return data
  const completions = Array.isArray(data.completions)
    ? data.completions.map((completion) =>
        typeof completion === 'object' && completion !== null
          ? { drops: [], ...completion }
          : completion,
      )
    : data.completions
  return {
    ...data,
    schemaVersion: SCHEMA_VERSION,
    completions,
    worldSeed: data.worldSeed ?? newWorldSeed(),
  }
}

// Older saves and backups predate completions, settings and (from
// T1.4) checkedInThrough; filling ONLY those gaps with defaults lets
// old data load cleanly. Nothing present is ever touched, and
// schemaVersion/habits are deliberately not defaulted — a file
// without them isn't a Habitat backup at all.
function withDefaults(data) {
  if (typeof data !== 'object' || data === null) return data
  return {
    ...data,
    completions: data.completions === undefined ? [] : data.completions,
    settings:
      data.settings === undefined
        ? { dayCutoffHour: DEFAULT_DAY_CUTOFF_HOUR, fieldNotesShownOn: null }
        : typeof data.settings === 'object' && data.settings !== null
          ? { fieldNotesShownOn: null, ...data.settings }
          : data.settings,
    checkedInThrough:
      data.checkedInThrough === undefined ? null : data.checkedInThrough,
  }
}

function validateData(data) {
  if (typeof data !== 'object' || data === null) {
    throw new Error('This file does not look like a Habitat backup.')
  }
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(
      `This backup uses format version ${data.schemaVersion}, but this ` +
        `app expects version ${SCHEMA_VERSION}.`,
    )
  }
  if (!Array.isArray(data.habits)) {
    throw new Error('This backup is missing its habit list.')
  }
  data.habits.forEach(validateHabit)
  if (!Array.isArray(data.completions)) {
    throw new Error('This backup has a broken completions list.')
  }
  data.completions.forEach(validateCompletion)
  if (typeof data.settings !== 'object' || data.settings === null) {
    throw new Error('This backup has broken settings.')
  }
  validateCutoffHour(data.settings.dayCutoffHour)
  if (
    data.settings.fieldNotesShownOn !== null &&
    !isValidDayKey(data.settings.fieldNotesShownOn)
  ) {
    throw new Error('This backup has a broken field-notes marker.')
  }
  if (data.checkedInThrough !== null && !isValidDayKey(data.checkedInThrough)) {
    throw new Error('This backup has a broken check-in marker.')
  }
  if (typeof data.worldSeed !== 'string' || data.worldSeed === '') {
    throw new Error('This backup is missing its world seed.')
  }
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return emptyData()
  const data = upgradeData(withDefaults(JSON.parse(raw)))
  validateData(data)
  return data
}

export function saveData(data) {
  validateData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// True when the app holds anything worth warning about before an import
// overwrites it (the import UI in T1.3 must check this and ask first).
export function hasData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return false
  const data = loadData()
  return data.habits.length > 0 || data.completions.length > 0
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY)
}

// Export: the entire envelope as human-readable JSON — this string is
// what gets saved to a backup file.
export function exportData() {
  return JSON.stringify(loadData(), null, 2)
}

// Import: validate the backup FULLY before anything is overwritten —
// a corrupt or wrong file must never destroy existing data. On success
// the app's state becomes exactly the file's contents (replace, not
// merge — Kimia's decision, 2026-07-12).
export function importData(jsonString) {
  let data
  try {
    data = JSON.parse(jsonString)
  } catch {
    throw new Error('This file is not readable as a Habitat backup (not JSON).')
  }
  data = upgradeData(withDefaults(data))
  validateData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}
