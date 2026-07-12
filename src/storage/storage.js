// The ONE place that touches the browser's localStorage (CLAUDE.md rule:
// components never do). Everything the app remembers lives under a
// single key, wrapped in a versioned envelope:
//
//   { schemaVersion: 1, habits: [...] }
//
// Completions and settings will join the envelope in later tasks; the
// schemaVersion lets a future Habitat recognise and upgrade old backups.

import { validateHabit } from '../game/habits.js'

const STORAGE_KEY = 'habitat-data'
const SCHEMA_VERSION = 1

export function emptyData() {
  return { schemaVersion: SCHEMA_VERSION, habits: [] }
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
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null) return emptyData()
  const data = JSON.parse(raw)
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
  return loadData().habits.length > 0
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
  validateData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}
