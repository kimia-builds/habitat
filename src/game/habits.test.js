import { describe, expect, it } from 'vitest'
import {
  activeHabits,
  addHabit,
  archiveHabit,
  archivedHabits,
  createHabit,
  removeHabit,
  unarchiveHabit,
  updateHabit,
} from './habits.js'

const fields = {
  name: 'Morning walk',
  description: 'Around the block counts.',
  symbol: 3,
  difficulty: 'easy',
  schedule: { type: 'daily' },
}

describe('createHabit', () => {
  it('creates a complete, unarchived habit', () => {
    const habit = createHabit(fields, 1000, 'id-1')
    expect(habit).toEqual({
      ...fields,
      id: 'id-1',
      archived: false,
      createdAt: 1000,
    })
  })

  it('generates unique ids when none is given', () => {
    const a = createHabit(fields)
    const b = createHabit(fields)
    expect(a.id).not.toBe(b.id)
  })

  it('trims the name and defaults description to empty', () => {
    const habit = createHabit({
      ...fields,
      name: '  Stretch  ',
      description: undefined,
    })
    expect(habit.name).toBe('Stretch')
    expect(habit.description).toBe('')
  })

  it('rejects a missing or blank name', () => {
    expect(() => createHabit({ ...fields, name: '   ' })).toThrow(/name/)
    expect(() => createHabit({ ...fields, name: undefined })).toThrow(/name/)
  })

  it('rejects symbols outside 1..6 (the 6 abstract tags)', () => {
    expect(() => createHabit({ ...fields, symbol: 0 })).toThrow(/1 to 6/)
    expect(() => createHabit({ ...fields, symbol: 7 })).toThrow(/1 to 6/)
    expect(() => createHabit({ ...fields, symbol: 2.5 })).toThrow(/1 to 6/)
    expect(() => createHabit({ ...fields, symbol: 'sun' })).toThrow(/1 to 6/)
  })

  it('rejects unknown difficulties', () => {
    expect(() => createHabit({ ...fields, difficulty: 'brutal' })).toThrow(
      /difficulty/,
    )
  })

  it('accepts all four schedule shapes', () => {
    const shapes = [
      { type: 'daily' },
      { type: 'weekdays', days: [1, 3, 5] },
      { type: 'nPerWeek', n: 3 },
      { type: 'whenever' },
    ]
    for (const schedule of shapes) {
      expect(createHabit({ ...fields, schedule }).schedule).toEqual(schedule)
    }
  })

  it('rejects malformed schedules', () => {
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'monthly' } }),
    ).toThrow(/Schedule type/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'weekdays', days: [] } }),
    ).toThrow(/non-empty/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'weekdays', days: [0] } }),
    ).toThrow(/not valid/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'weekdays', days: [8] } }),
    ).toThrow(/not valid/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'weekdays', days: [2, 2] } }),
    ).toThrow(/at most once/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'nPerWeek', n: 0 } }),
    ).toThrow(/between 1 and 7/)
    expect(() =>
      createHabit({ ...fields, schedule: { type: 'nPerWeek', n: 8 } }),
    ).toThrow(/between 1 and 7/)
    expect(() => createHabit({ ...fields, schedule: null })).toThrow(/object/)
  })
})

describe('updateHabit', () => {
  it('changes allowed fields and leaves the original untouched', () => {
    const habit = createHabit(fields, 1000, 'id-1')
    const updated = updateHabit(habit, { name: 'Evening walk', symbol: 5 })
    expect(updated.name).toBe('Evening walk')
    expect(updated.symbol).toBe(5)
    expect(habit.name).toBe('Morning walk')
  })

  it('refuses to change identity or history stamps', () => {
    const habit = createHabit(fields, 1000, 'id-1')
    expect(() => updateHabit(habit, { id: 'other' })).toThrow(
      /cannot be changed/,
    )
    expect(() => updateHabit(habit, { createdAt: 5 })).toThrow(
      /cannot be changed/,
    )
    expect(() => updateHabit(habit, { archived: true })).toThrow(
      /cannot be changed/,
    )
  })

  it('validates the result', () => {
    const habit = createHabit(fields, 1000, 'id-1')
    expect(() => updateHabit(habit, { symbol: 9 })).toThrow(/1 to 6/)
  })
})

describe('archiving and the habit list', () => {
  it('archives and unarchives without losing anything', () => {
    const habit = createHabit(fields, 1000, 'id-1')
    const archived = archiveHabit(habit)
    expect(archived.archived).toBe(true)
    expect(unarchiveHabit(archived)).toEqual(habit)
  })

  it('splits active from archived', () => {
    const a = createHabit(fields, 1000, 'a')
    const b = archiveHabit(createHabit(fields, 1000, 'b'))
    expect(activeHabits([a, b])).toEqual([a])
    expect(archivedHabits([a, b])).toEqual([b])
  })

  it('adds habits and rejects duplicate ids', () => {
    const a = createHabit(fields, 1000, 'a')
    const habits = addHabit([], a)
    expect(habits).toEqual([a])
    expect(() => addHabit(habits, a)).toThrow(/already exists/)
  })

  it('permanently deletes by id, and only by an existing id', () => {
    const a = createHabit(fields, 1000, 'a')
    const b = createHabit(fields, 1000, 'b')
    expect(removeHabit([a, b], 'a')).toEqual([b])
    expect(() => removeHabit([b], 'nope')).toThrow(/No habit/)
  })
})
