import { beforeEach, describe, expect, it } from 'vitest'
import { createHabit } from '../game/habits.js'
import {
  clearData,
  emptyData,
  exportData,
  hasData,
  importData,
  loadData,
  saveData,
} from './storage.js'

const habit = (id, name) =>
  createHabit(
    { name, symbol: 1, difficulty: 'medium', schedule: { type: 'whenever' } },
    1000,
    id,
  )

beforeEach(() => {
  localStorage.clear()
})

describe('persistence (the "survives a reload" guarantee)', () => {
  it('starts empty on a fresh browser', () => {
    expect(loadData()).toEqual(emptyData())
    expect(hasData()).toBe(false)
  })

  it('loads back exactly what was saved — loadData reads storage fresh, like a reload', () => {
    const data = {
      ...emptyData(),
      habits: [habit('a', 'Read'), habit('b', 'Walk')],
    }
    saveData(data)
    // loadData() re-reads from localStorage with no in-memory cache, so
    // this is precisely what happens after closing and reopening the page.
    expect(loadData()).toEqual(data)
    expect(hasData()).toBe(true)
  })

  it('refuses to save invalid data', () => {
    expect(() =>
      saveData({ schemaVersion: 1, habits: [{ bad: true }] }),
    ).toThrow()
    expect(() => saveData({ habits: [] })).toThrow(/version/)
    expect(loadData()).toEqual(emptyData())
  })

  it('clearData wipes everything', () => {
    saveData({ ...emptyData(), habits: [habit('a', 'Read')] })
    clearData()
    expect(loadData()).toEqual(emptyData())
    expect(hasData()).toBe(false)
  })
})

describe('backup round trip (export → wipe → import)', () => {
  it('restores identical data', () => {
    const data = {
      ...emptyData(),
      habits: [
        habit('a', 'Read'),
        habit('b', 'Walk'),
        { ...habit('c', 'Old habit'), archived: true },
      ],
    }
    saveData(data)

    const backup = exportData()
    clearData()
    expect(loadData()).toEqual(emptyData()) // truly gone

    const restored = importData(backup)
    expect(restored).toEqual(data)
    expect(loadData()).toEqual(data) // and persisted, not just returned
  })

  it('export is human-readable JSON', () => {
    saveData({ ...emptyData(), habits: [habit('a', 'Read')] })
    const backup = exportData()
    expect(JSON.parse(backup).habits[0].name).toBe('Read')
    expect(backup).toContain('\n') // pretty-printed, not one long line
  })

  it('rejects a non-JSON file and keeps existing data intact', () => {
    const data = { ...emptyData(), habits: [habit('a', 'Read')] }
    saveData(data)
    expect(() => importData('not json at all')).toThrow(/not JSON/)
    expect(loadData()).toEqual(data)
  })

  it('rejects a JSON file that is not a Habitat backup, keeping data intact', () => {
    const data = { ...emptyData(), habits: [habit('a', 'Read')] }
    saveData(data)
    expect(() => importData('{"some":"other file"}')).toThrow()
    expect(() =>
      importData('{"schemaVersion":1,"habits":[{"broken":1}]}'),
    ).toThrow()
    expect(() => importData('{"schemaVersion":99,"habits":[]}')).toThrow(
      /version 99/,
    )
    expect(loadData()).toEqual(data)
  })

  it('replaces existing data entirely on successful import (no merging)', () => {
    saveData({ ...emptyData(), habits: [habit('old', 'Old')] })
    importData(
      JSON.stringify({ ...emptyData(), habits: [habit('new', 'New')] }),
    )
    expect(loadData().habits.map((h) => h.id)).toEqual(['new'])
  })
})
