import { describe, expect, it } from 'vitest'
import { gameCompletions, startNewGame } from './newgame.js'
import { validateCompletion } from './completions.js'
import { expeditionSteps } from './meters.js'
import { livedDayCount, walletBalance } from './market.js'
import { friendsFrom } from './friends.js'
import { readingItemsFrom } from './arrivals.js'
import { floraFinds } from './flora.js'

// A completion, with whatever drops the test needs.
const tap = (id, recordedAt, dayKey, drops = []) => ({
  id,
  habitId: 'h1',
  recordedAt,
  dayKey,
  drops,
})

const world = (over = {}) => ({
  schemaVersion: 10,
  habits: [{ id: 'h1' }],
  completions: [],
  settings: { dayCutoffHour: 3, lastExportedOn: '2026-08-11' },
  checkedInThrough: '2026-08-10',
  worldSeed: 'old-seed',
  floraDecisions: { c1: 'gathered' },
  bookcaseLayout: { p1: { x: 1, y: 2, facing: 'face' } },
  abodeLayout: { f1: { x: 3, y: 4 } },
  purchases: [{ id: 'b1', objectKey: 'r1-o1', price: 5, boughtAt: 1000 }],
  ...over,
})

describe('gameCompletions', () => {
  it('is the whole list while nothing has been started over', () => {
    const list = [tap('c1', 100, '2026-08-01'), tap('c2', 200, '2026-08-02')]
    expect(gameCompletions(list)).toEqual(list)
  })

  it('leaves out the marks stamped as belonging to a past game', () => {
    const list = [
      { ...tap('old', 100, '2026-08-01'), pastGame: true },
      tap('new', 200, '2026-08-02'),
    ]
    expect(gameCompletions(list).map((c) => c.id)).toEqual(['new'])
  })

  // The check-in always asks about yesterday, so the morning after a
  // fresh start Kimia marks days that fall before it. Those taps are
  // made INSIDE the new game and must count, whatever day they name —
  // which is exactly why the rule is a stamp and not a date.
  it('counts a new mark for an old day', () => {
    const retro = tap('retro', 900, '2026-07-01')
    const list = [{ ...tap('old', 100, '2026-08-01'), pastGame: true }, retro]
    expect(gameCompletions(list)).toEqual([retro])
  })

  // A frozen clock, or two events inside one millisecond, must not be
  // able to decide this — the stamp has no boundary to land on.
  it('does not depend on when anything happened', () => {
    const list = [
      { ...tap('old', 500, '2026-08-01'), pastGame: true },
      tap('new', 500, '2026-08-01'),
    ]
    expect(gameCompletions(list).map((c) => c.id)).toEqual(['new'])
  })

  it('refuses anything that is not a list', () => {
    expect(() => gameCompletions(null)).toThrow()
  })
})

describe('startNewGame', () => {
  const before = world({
    completions: [
      tap('c1', 100, '2026-08-01', [
        { kind: 'flora', species: 'f1' },
        { kind: 'fungi', amount: 4 },
      ]),
      tap('c2', 200, '2026-08-02', [
        { kind: 'reading', type: 'novel', publicationId: 'p1' },
        { kind: 'friend', category: 'plip', individual: 0 },
      ]),
    ],
  })
  const after = startNewGame(before, 'new-seed')

  it('keeps every habit and every completion, habit and day intact', () => {
    expect(after.habits).toEqual(before.habits)
    expect(after.completions.map((c) => c.id)).toEqual(['c1', 'c2'])
    expect(after.completions.map((c) => c.habitId)).toEqual(['h1', 'h1'])
    expect(after.completions.map((c) => c.dayKey)).toEqual([
      '2026-08-01',
      '2026-08-02',
    ])
    expect(after.completions.map((c) => c.recordedAt)).toEqual([100, 200])
  })

  it('keeps the settings and the check-in marker untouched', () => {
    expect(after.settings).toEqual(before.settings)
    expect(after.checkedInThrough).toBe(before.checkedInThrough)
  })

  it('stamps every existing mark as belonging to a past game', () => {
    expect(after.completions.every((c) => c.pastGame === true)).toBe(true)
  })

  it('empties every completion of its drops', () => {
    expect(after.completions.every((c) => c.drops.length === 0)).toBe(true)
  })

  it('empties the world: flora, bookcase, abode and purchases', () => {
    expect(after.floraDecisions).toEqual({})
    expect(after.bookcaseLayout).toEqual({})
    expect(after.abodeLayout).toEqual({})
    expect(after.purchases).toEqual([])
  })

  it('replaces the world seed, so the new planet is not a replay', () => {
    expect(after.worldSeed).toBe('new-seed')
    expect(after.worldSeed).not.toBe(before.worldSeed)
  })

  it('leaves the original envelope alone', () => {
    expect(before.purchases).toHaveLength(1)
    expect(before.completions[0].drops).toHaveLength(2)
    expect(before.completions[0].pastGame).toBeUndefined()
  })

  it('produces completions that still pass validation', () => {
    after.completions.forEach((c) =>
      expect(() => validateCompletion(c)).not.toThrow(),
    )
  })

  it('starting over a second time retires the second game too', () => {
    const second = startNewGame(
      {
        ...after,
        completions: [...after.completions, tap('c3', 300, '2026-08-05')],
      },
      'newer-seed',
    )
    expect(second.completions.every((c) => c.pastGame === true)).toBe(true)
    expect(gameCompletions(second.completions)).toEqual([])
  })

  it('refuses a missing envelope or an empty seed', () => {
    expect(() => startNewGame(null)).toThrow()
    expect(() => startNewGame(before, '')).toThrow()
  })
})

// The point of the whole feature, checked end to end: after a new game
// every reward reads empty, while the habit record still holds every
// mark. Checked with the real derivations, not stand-ins, so a future
// change to any of them fails here.
describe('after a new game', () => {
  const before = world({
    completions: [
      tap('c1', 100, '2026-08-01', [
        { kind: 'flora', species: 'f1' },
        { kind: 'fungi', amount: 4 },
      ]),
      tap('c2', 200, '2026-08-02', [
        { kind: 'reading', type: 'novel', publicationId: 'p1' },
        { kind: 'friend', category: 'plip', individual: 0 },
      ]),
      tap('c3', 300, '2026-08-03'),
    ],
  })
  const after = startNewGame(before, 'new-seed')
  const played = gameCompletions(after.completions)

  it('the counted meters start from zero', () => {
    expect(expeditionSteps(played)).toBe(0)
    expect(livedDayCount(played)).toBe(0)
  })

  it('the drop-derived rewards are all gone', () => {
    expect(walletBalance(after.completions, after.purchases)).toBe(0)
    expect(friendsFrom(after.completions)).toEqual([])
    expect(readingItemsFrom(after.completions)).toEqual([])
    expect(floraFinds(after.completions, after.floraDecisions)).toEqual([])
  })

  it('but the habit record still holds every mark, day for day', () => {
    expect(after.completions).toHaveLength(3)
    expect(after.completions.map((c) => c.dayKey)).toEqual([
      '2026-08-01',
      '2026-08-02',
      '2026-08-03',
    ])
  })

  it('and a mark made afterwards moves the meters again', () => {
    const next = [...after.completions, tap('c4', 2000, '2026-08-12')]
    const nowPlayed = gameCompletions(next)
    expect(expeditionSteps(nowPlayed)).toBeGreaterThan(0)
    expect(livedDayCount(nowPlayed)).toBe(1)
  })
})
