// The ONE place that touches the browser's localStorage (CLAUDE.md rule:
// components never do). Everything the app remembers lives under a
// single key, wrapped in a versioned envelope:
//
//   {
//     schemaVersion: 1,
//     habits:      [...],
//     completions: [...],   // see game/completions.js — added in T1.2
//     settings:    { dayCutoffHour: 3 },
//   }
//
// The schemaVersion lets a future Habitat recognise and upgrade old
// backups.

import { validateCompletion } from '../game/completions.js'
import { DEFAULT_DAY_CUTOFF_HOUR } from '../game/constants.js'
import { validateCutoffHour } from '../game/days.js'
import { validateHabit } from '../game/habits.js'

const STORAGE_KEY = 'habitat-data'
const SCHEMA_VERSION = 1

export function emptyData() {
  return {
    schemaVersion: SCHEMA_VERSION,
    habits: [],
    completions: [],
    settings: { dayCutoffHour: DEFAULT_DAY_CUTOFF_HOUR },
  }
}

// T1.1-era saves and backups predate completions and settings; filling
// ONLY those gaps with defaults lets old data load cleanly. Nothing
// present is ever touched, and schemaVersion/habits are deliberately
// not defaulted — a file without them isn't a Habitat backup at all.
function withDefaults(data) {
  if (typeof data !== 'object' || data === null) return data
  return {
    ...data,
    completions: data.completions === undefined ? [] : data.completions,
    settings:
      data.settings === undefined
        ? { dayCutoffHour: DEFAULT_DAY_CUTOFF_HOUR }
        : data.settings,
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
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return emptyData()
  const data = withDefaults(JSON.parse(raw))
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
  data = withDefaults(data)
  validateData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}
