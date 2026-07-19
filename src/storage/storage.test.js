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
    // emptyData() mints a fresh world seed every call (T3.2), so the
    // comparison adopts the seed of the data under test.
    const data = loadData()
    expect(data).toEqual({ ...emptyData(), worldSeed: data.worldSeed })
    expect(typeof data.worldSeed).toBe('string')
    expect(data.worldSeed).not.toBe('')
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
    expect(localStorage.getItem('habitat-data')).toBe(null) // nothing landed
  })

  it('clearData wipes everything', () => {
    saveData({ ...emptyData(), habits: [habit('a', 'Read')] })
    clearData()
    expect(localStorage.getItem('habitat-data')).toBe(null)
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
        { ...habit('c', 'Old habit'), archived: true, archivedAt: 2000 },
      ],
    }
    saveData(data)

    const backup = exportData()
    clearData()
    expect(localStorage.getItem('habitat-data')).toBe(null) // truly gone

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

describe('completions and settings in storage (added in T1.2)', () => {
  const completion = (id, dayKey) => ({
    id,
    habitId: 'a',
    recordedAt: 2000,
    dayKey,
    drops: [],
  })

  it('completions survive a save → reload round trip, day attribution intact', () => {
    const data = {
      ...emptyData(),
      habits: [habit('a', 'Read')],
      completions: [
        completion('c1', '2026-07-12'),
        completion('c2', '2026-07-13'),
      ],
    }
    saveData(data)
    expect(loadData()).toEqual(data)
    expect(loadData().completions[0].dayKey).toBe('2026-07-12')
  })

  it('the day-cutoff setting persists', () => {
    expect(loadData().settings.dayCutoffHour).toBe(3) // the default
    saveData({
      ...emptyData(),
      settings: { ...emptyData().settings, dayCutoffHour: 5 },
    })
    expect(loadData().settings.dayCutoffHour).toBe(5)
  })

  it('hasData is true when there are completions, even with no habits', () => {
    saveData({ ...emptyData(), completions: [completion('c1', '2026-07-12')] })
    expect(hasData()).toBe(true)
  })

  it('a T1.1-era backup (no completions/settings) still imports, gaining defaults', () => {
    const oldBackup = JSON.stringify({
      schemaVersion: 1,
      habits: [habit('a', 'Read')],
    })
    const restored = importData(oldBackup)
    expect(restored.habits).toHaveLength(1)
    expect(restored.completions).toEqual([])
    expect(restored.settings.dayCutoffHour).toBe(3)
    expect(loadData()).toEqual(restored)
  })

  it('the check-in marker persists and defaults to null (added in T1.4)', () => {
    expect(loadData().checkedInThrough).toBe(null) // fresh browser
    saveData({ ...emptyData(), checkedInThrough: '2026-07-13' })
    expect(loadData().checkedInThrough).toBe('2026-07-13')

    // Backups from before T1.4 have no marker; they gain the default.
    const oldBackup = JSON.stringify({ schemaVersion: 1, habits: [] })
    expect(importData(oldBackup).checkedInThrough).toBe(null)

    // A broken marker is refused like any other corruption.
    expect(() =>
      importData(
        JSON.stringify({ ...emptyData(), checkedInThrough: 'someday' }),
      ),
    ).toThrow(/check-in/)
  })

  it('rejects backups with broken completions or settings, keeping data intact', () => {
    const data = { ...emptyData(), habits: [habit('a', 'Read')] }
    saveData(data)
    expect(() =>
      importData(
        JSON.stringify({ ...emptyData(), completions: [{ nonsense: 1 }] }),
      ),
    ).toThrow()
    expect(() =>
      importData(
        JSON.stringify({ ...emptyData(), settings: { dayCutoffHour: 99 } }),
      ),
    ).toThrow()
    expect(loadData()).toEqual(data)
  })
})

describe('the v1 → v2 upgrade (T2.3)', () => {
  it('a v1 save gains schedule history, archive stamps and the field-notes marker', () => {
    // A hand-written v1 record, exactly as T1-era Habitat stored it —
    // no scheduleHistory, no archivedAt, no fieldNotesShownOn.
    const v1habit = {
      id: 'a',
      name: 'Read',
      description: '',
      symbol: 1,
      difficulty: 'medium',
      schedule: { type: 'daily' },
      archived: false,
      createdAt: 1000,
    }
    const v1archived = { ...v1habit, id: 'b', name: 'Old', archived: true }
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [v1habit, v1archived],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: null,
      }),
    )

    const data = loadData()
    expect(data.schemaVersion).toBe(5) // upgrades chain: v1 → … → v5
    expect(data.settings.fieldNotesShownOn).toBe(null)
    expect(data.floraDecisions).toEqual({})
    expect(data.bookcaseLayout).toEqual({})
    expect(typeof data.worldSeed).toBe('string')
    const [a, b] = data.habits
    // History reads as the current schedule from birth — past edits
    // were never recorded, so this is all a v1 save can honestly say.
    expect(a.scheduleHistory).toHaveLength(1)
    expect(a.scheduleHistory[0].schedule).toEqual({ type: 'daily' })
    expect(a.archivedAt).toBe(null)
    // The v1 archive's moment is unknown; the upgrade moment stands in.
    expect(typeof b.archivedAt).toBe('number')
    // And the upgraded shape passes full validation on the next save.
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('a v1 backup file imports the same way', () => {
    const backup = JSON.stringify({
      schemaVersion: 1,
      habits: [
        {
          id: 'a',
          name: 'Read',
          description: '',
          symbol: 1,
          difficulty: 'medium',
          schedule: { type: 'nPerWeek', n: 3 },
          archived: false,
          createdAt: 1000,
        },
      ],
    })
    const restored = importData(backup)
    expect(restored.schemaVersion).toBe(5)
    expect(restored.habits[0].scheduleHistory[0].schedule).toEqual({
      type: 'nPerWeek',
      n: 3,
    })
    expect(restored.settings.fieldNotesShownOn).toBe(null)
  })
})

describe('the v2 → v3 upgrade (T3.2)', () => {
  it('a v2 save gains a world seed, and old completions get EMPTY drops — start fresh, no retroactive rewards', () => {
    // A hand-written v2 record, exactly as T2/T3.1-era Habitat stored
    // it — completions without drops, no worldSeed anywhere.
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 2,
        habits: [habit('a', 'Read')],
        completions: [
          { id: 'c1', habitId: 'a', recordedAt: 2000, dayKey: '2026-07-12' },
        ],
        settings: { dayCutoffHour: 3, fieldNotesShownOn: null },
        checkedInThrough: null,
      }),
    )

    const data = loadData()
    expect(data.schemaVersion).toBe(5)
    expect(typeof data.worldSeed).toBe('string')
    expect(data.worldSeed).not.toBe('')
    // Kimia's decision 2026-07-19: pre-update history rolls nothing.
    expect(data.completions[0].drops).toEqual([])
    // And the upgraded shape passes full validation on the next save.
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('a backup carries its world seed — an import restores the same luck', () => {
    saveData({ ...emptyData(), worldSeed: 'the-original-seed' })
    const backup = exportData()
    clearData()
    expect(importData(backup).worldSeed).toBe('the-original-seed')
  })

  it('drops stored on completions survive the save → reload round trip', () => {
    const data = {
      ...emptyData(),
      habits: [habit('a', 'Read')],
      completions: [
        {
          id: 'c1',
          habitId: 'a',
          recordedAt: 2000,
          dayKey: '2026-07-12',
          drops: [
            { kind: 'flora' },
            { kind: 'reading', readingType: 'novel' },
            { kind: 'fungi', amount: 2 },
          ],
        },
      ],
    }
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('rejects a missing world seed or broken drops, like any corruption', () => {
    expect(() => saveData({ ...emptyData(), worldSeed: '' })).toThrow(
      /world seed/,
    )
    expect(() =>
      importData(
        JSON.stringify({
          ...emptyData(),
          completions: [
            {
              id: 'c1',
              habitId: 'a',
              recordedAt: 2000,
              dayKey: '2026-07-12',
              drops: [{ kind: 'gold' }],
            },
          ],
        }),
      ),
    ).toThrow(/drop kind/)
  })
})

describe('the v3 → v4 upgrade (T3.3)', () => {
  it('a v3 save gains an empty flora decisions map — every old find still pending', () => {
    // A hand-written v3 record, exactly as T3.2-era Habitat stored it —
    // no floraDecisions anywhere.
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 3,
        habits: [habit('a', 'Read')],
        completions: [
          {
            id: 'c1',
            habitId: 'a',
            recordedAt: 2000,
            dayKey: '2026-07-12',
            drops: [{ kind: 'flora' }],
          },
        ],
        settings: { dayCutoffHour: 3, fieldNotesShownOn: null },
        checkedInThrough: null,
        worldSeed: 'seed',
      }),
    )

    const data = loadData()
    expect(data.schemaVersion).toBe(5)
    expect(data.floraDecisions).toEqual({})
    // And the upgraded shape passes full validation on the next save.
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('flora decisions survive the save → reload and backup round trips', () => {
    const data = {
      ...emptyData(),
      habits: [habit('a', 'Read')],
      completions: [
        {
          id: 'c1',
          habitId: 'a',
          recordedAt: 2000,
          dayKey: '2026-07-12',
          drops: [{ kind: 'flora' }],
        },
      ],
      floraDecisions: { c1: 'gathered' },
    }
    saveData(data)
    expect(loadData()).toEqual(data)

    const backup = exportData()
    clearData()
    expect(importData(backup).floraDecisions).toEqual({ c1: 'gathered' })
  })

  it('rejects broken flora decisions, like any corruption', () => {
    expect(() =>
      saveData({ ...emptyData(), floraDecisions: { c1: 'eaten' } }),
    ).toThrow(/flora decision/)
    expect(() =>
      importData(JSON.stringify({ ...emptyData(), floraDecisions: [] })),
    ).toThrow(/map/)
  })
})

describe('the v4 → v5 upgrade (T4.2)', () => {
  it('a v4 save gains an empty bookcase layout — every book still in its default slot, spine out', () => {
    // A hand-written v4 record, exactly as T3.3–T4.1-era Habitat stored
    // it — floraDecisions present, no bookcaseLayout anywhere.
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 4,
        habits: [habit('a', 'Read')],
        completions: [
          {
            id: 'c1',
            habitId: 'a',
            recordedAt: 2000,
            dayKey: '2026-07-12',
            drops: [{ kind: 'reading', readingType: 'magazine' }],
          },
        ],
        settings: { dayCutoffHour: 3, fieldNotesShownOn: null },
        checkedInThrough: null,
        worldSeed: 'seed',
        floraDecisions: {},
      }),
    )

    const data = loadData()
    expect(data.schemaVersion).toBe(5)
    expect(data.bookcaseLayout).toEqual({})
    // And the upgraded shape passes full validation on the next save.
    saveData(data)
    expect(loadData()).toEqual(data)
  })

  it('the bookcase layout survives the save → reload and backup round trips', () => {
    const data = {
      ...emptyData(),
      habits: [habit('a', 'Read')],
      completions: [
        {
          id: 'c1',
          habitId: 'a',
          recordedAt: 2000,
          dayKey: '2026-07-12',
          drops: [{ kind: 'reading', readingType: 'novel' }],
        },
      ],
      bookcaseLayout: { 'c1:0': { x: 0.25, y: 0.99, facing: 'front' } },
    }
    saveData(data)
    expect(loadData()).toEqual(data)

    const backup = exportData()
    clearData()
    expect(importData(backup).bookcaseLayout).toEqual({
      'c1:0': { x: 0.25, y: 0.99, facing: 'front' },
    })
  })

  it('rejects a broken bookcase layout, like any corruption', () => {
    expect(() =>
      saveData({
        ...emptyData(),
        bookcaseLayout: { 'c1:0': { x: 2, y: 0.5, facing: 'spine' } },
      }),
    ).toThrow(/between 0 and 1/)
    expect(() =>
      importData(JSON.stringify({ ...emptyData(), bookcaseLayout: [] })),
    ).toThrow(/map/)
  })
})
