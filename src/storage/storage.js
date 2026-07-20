// The ONE place that touches the browser's localStorage (CLAUDE.md rule:
// components never do). Everything the app remembers lives under a
// single key, wrapped in a versioned envelope:
//
//   {
//     schemaVersion: 8,
//     habits:      [...],   // since v2 each carries scheduleHistory
//                           // and archivedAt — see game/habits.js
//     completions: [...],   // see game/completions.js — since v3 each
//                           // carries its drops (T3.2); the drops can now
//                           // include FRIENDS (T4.4) — { kind: 'friend',
//                           // category, individual } — the one change v8
//                           // gates (see game/friends.js)
//     settings:    { dayCutoffHour: 3,
//                    fieldNotesShownOn: null },  // the last Sunday the
//                              // field notes auto-opened — added in T2.3
//     checkedInThrough: null,  // last day whose check-in was answered
//                              // ('YYYY-MM-DD' or null) — added in T1.4
//     worldSeed: '…',          // anchors every seeded drop roll — created
//                              // once, at first run, never changed (T3.2)
//     floraDecisions: {},      // completionId → 'gathered' | 'left' |
//                              // 'composted' (no entry = still pending)
//                              // — see game/flora.js, added in T3.3
//     bookcaseLayout: {},      // publicationId → { x, y, facing } —
//                              // where each book sits on the constant
//                              // bookshelf and which way it faces
//                              // (no entry = default slot, spine)
//                              // — see game/bookcase.js, added in T4.2
//     abodeLayout: {},         // floraId | purchaseId → { x, y } — where
//                              // each gathered flora (and, since T4.3b,
//                              // each owned market object) stands on the
//                              // Abode's open ground (no entry = default
//                              // spot) — see game/abode.js, added in T4.3
//     purchases: [],           // the owned market objects, one entry per
//                              // instance: { id, objectKey, price,
//                              // boughtAt } — duplicates allowed, the
//                              // price frozen at buy time so a sell
//                              // always refunds exactly what was paid
//                              // — see game/market.js, added in T4.3b
//   }
//
// The schemaVersion lets a future Habitat recognise and upgrade old
// backups — upgradeData below does exactly that for v1.

import { validateAbodeLayout } from '../game/abode.js'
import { validateCompletion } from '../game/completions.js'
import { DEFAULT_DAY_CUTOFF_HOUR } from '../game/constants.js'
import { validateBookcaseLayout } from '../game/bookcase.js'
import {
  dayKeyFromTimestamp,
  isValidDayKey,
  validateCutoffHour,
} from '../game/days.js'
import { validateFloraDecisions } from '../game/flora.js'
import { validateHabit } from '../game/habits.js'
import { validatePurchases } from '../game/market.js'

const STORAGE_KEY = 'habitat-data'
const SCHEMA_VERSION = 8

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
    floraDecisions: {},
    bookcaseLayout: {},
    abodeLayout: {},
    purchases: [],
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
  return upgradeV7toV8(
    upgradeV6toV7(
      upgradeV5toV6(
        upgradeV4toV5(upgradeV3toV4(upgradeV2toV3(upgradeV1toV2(data, now)))),
      ),
    ),
  )
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
    schemaVersion: 3,
    completions,
    worldSeed: data.worldSeed ?? newWorldSeed(),
  }
}

// v3 → v4 (T3.3): the envelope gains the flora decisions map — what
// happened to each flora find (gathered / left / composted). A v3 save
// predates deciding, so every find it holds is still pending: an empty
// map says exactly that.
function upgradeV3toV4(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 3) return data
  return {
    ...data,
    schemaVersion: 4,
    floraDecisions: data.floraDecisions ?? {},
  }
}

// v4 → v5 (T4.2): the envelope gains the bookcase layout — where each
// publication sits on the constant bookshelf and which way it faces
// (game/bookcase.js). A v4 save predates arranging, so every book it
// holds still stands in its default slot, spine out: an empty map says
// exactly that.
function upgradeV4toV5(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 4) return data
  return {
    ...data,
    schemaVersion: 5,
    bookcaseLayout: data.bookcaseLayout ?? {},
  }
}

// v5 → v6 (T4.3): the envelope gains the abode layout — where each
// gathered flora stands on the Abode's open ground (game/abode.js). A
// v5 save predates arranging, so every flora it holds still stands in
// its default spot: an empty map says exactly that.
function upgradeV5toV6(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 5) return data
  return {
    ...data,
    schemaVersion: 6,
    abodeLayout: data.abodeLayout ?? {},
  }
}

// v6 → v7 (T4.3b): the envelope gains the purchases list — the market
// objects Kimia owns, one entry per instance, its price frozen at buy
// time (game/market.js). A v6 save predates the Market, so it owns
// nothing yet: an empty list says exactly that.
function upgradeV6toV7(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 6) return data
  return {
    ...data,
    schemaVersion: 7,
    purchases: data.purchases ?? [],
  }
}

// v7 → v8 (T4.4): drops can now include FRIENDS — { kind: 'friend',
// category, individual } stored on completions (game/friends.js). No
// field moves and nothing is renumbered: the bump exists so a backup
// that contains friends is never loaded by an older app that couldn't
// validate them. A v7 save simply has no friends yet.
function upgradeV7toV8(data) {
  if (typeof data !== 'object' || data === null) return data
  if (data.schemaVersion !== 7) return data
  return { ...data, schemaVersion: SCHEMA_VERSION }
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
  validateFloraDecisions(data.floraDecisions)
  validateBookcaseLayout(data.bookcaseLayout)
  validateAbodeLayout(data.abodeLayout)
  validatePurchases(data.purchases)
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
