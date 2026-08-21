import { describe, expect, it } from 'vitest'

import { orderedForScreen, sinkOnMute, todayLens } from './lenses.js'

const habits = (...ids) => ids.map((id) => ({ id, name: id }))
const ids = (list) => list.map((h) => h.id)

describe('orderedForScreen (T6.23a)', () => {
  it('with no arrangement, the stored order is the answer', () => {
    const stored = habits('a', 'b', 'c')
    expect(orderedForScreen(stored, null)).toBe(stored)
  })

  it('follows the arrangement rather than the stored order', () => {
    expect(
      ids(orderedForScreen(habits('a', 'b', 'c'), ['c', 'a', 'b'])),
    ).toEqual(['c', 'a', 'b'])
  })

  it('a habit the arrangement never heard of joins at the end', () => {
    // Exactly what a habit created a moment ago is: the arrangement was
    // made before it existed, and the end is where a new habit belongs.
    expect(ids(orderedForScreen(habits('a', 'b', 'new'), ['b', 'a']))).toEqual([
      'b',
      'a',
      'new',
    ])
  })

  it('ignores ids for habits that are no longer here', () => {
    // Archived or deleted since the arrangement was made.
    expect(ids(orderedForScreen(habits('a', 'c'), ['c', 'gone', 'a']))).toEqual(
      ['c', 'a'],
    )
  })
})

describe('sinkOnMute (T6.23a)', () => {
  it('sends the tile to the bottom when nothing else is muted', () => {
    expect(sinkOnMute(['a', 'b', 'c'], 'a', [])).toEqual(['b', 'c', 'a'])
  })

  it('stops just above tiles muted earlier — newest nearest the live list', () => {
    // Kimia's call 2026-08-20: mute a, then b, and b sits ABOVE a.
    const once = sinkOnMute(['a', 'b', 'c'], 'a', [])
    expect(once).toEqual(['b', 'c', 'a'])
    expect(sinkOnMute(once, 'b', ['a'])).toEqual(['c', 'b', 'a'])
  })

  it('never lifts a tile that is already below the live list', () => {
    // 'c' is at the floor under a muted 'a'. Closing its eye must not
    // hoist it up to sit above 'a' — muting only ever sinks.
    expect(sinkOnMute(['b', 'a', 'c'], 'c', ['a'])).toEqual(['b', 'a', 'c'])
  })

  it('the last live tile stays where it is', () => {
    expect(sinkOnMute(['a', 'b', 'c'], 'c', [])).toEqual(['a', 'b', 'c'])
  })

  it('the last live tile stays put even when everything above it is muted', () => {
    // There is no live list left to sit under, and lifting 'c' over the
    // dim ones would be a rise. Muting sinks or does nothing, never both.
    expect(sinkOnMute(['a', 'b', 'c'], 'c', ['a', 'b'])).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  it('an id that is not on screen changes nothing', () => {
    expect(sinkOnMute(['a', 'b'], 'ghost', [])).toEqual(['a', 'b'])
  })
})

// The `today` lens (T6.23b) — the first thing in Habitat that HIDES.
//
// Habits here are the smallest shape todayTier can read: an id and a
// schedule history. 2026-07-13 is a Monday throughout.
describe('todayLens (T6.23b)', () => {
  const MONDAY = '2026-07-13'
  const scheduled = (id, type, extra = {}) => ({
    id,
    name: id,
    schedule: { type, ...extra },
    scheduleHistory: [{ fromDay: '2020-01-01', schedule: { type, ...extra } }],
  })
  // Nothing muted, nothing hidden: the list as it stands on a fresh visit.
  const fresh = { muted: [], hidden: [] }

  it('keeps today, mutes what could be today, hides the rest', () => {
    const list = [
      scheduled('daily', 'daily'),
      scheduled('tuesdays', 'weekdays', { days: [2] }),
      scheduled('thrice', 'nPerWeek', { n: 3 }),
      scheduled('mondays', 'weekdays', { days: [1] }),
    ]
    const next = todayLens(list, fresh, MONDAY)

    expect(next.hidden).toEqual(['tuesdays'])
    expect(next.muted).toEqual(['thrice'])
    // The muted one has sunk under the live list; the hidden one keeps
    // its place in the order, since it is only out of sight.
    expect(next.order).toEqual(['daily', 'tuesdays', 'mondays', 'thrice'])
  })

  it('brings a muted habit that applies today back to full brightness', () => {
    // Kimia's call 2026-08-21: `today` is the day's list, so nothing
    // belonging to today is left dim.
    const list = [scheduled('daily', 'daily'), scheduled('other', 'whenever')]
    const next = todayLens(list, { muted: ['daily'], hidden: [] }, MONDAY)

    expect(next.muted).toEqual(['other'])
    // Un-muting is a change of look, never of place (spec §5b) — 'daily'
    // has not moved, and the newly muted one sank below it.
    expect(next.order).toEqual(['daily', 'other'])
  })

  it('the sunk block keeps the order it was already in', () => {
    // Muting one at a time puts each new one ABOVE the last (T6.23a), so
    // a group sunk together has to travel bottom-most first or it lands
    // upside down.
    const list = [
      scheduled('one', 'whenever'),
      scheduled('two', 'whenever'),
      scheduled('three', 'whenever'),
      scheduled('daily', 'daily'),
    ]
    const next = todayLens(list, fresh, MONDAY)

    expect(next.order).toEqual(['daily', 'one', 'two', 'three'])
  })

  it('lands above tiles muted earlier by hand', () => {
    const list = [
      scheduled('daily', 'daily'),
      scheduled('whenever', 'whenever'),
      scheduled('dimmed', 'daily'),
    ]
    // 'dimmed' applies today, so it brightens — and the whenever one
    // sinks below it, because there is no dim list left to sit above.
    const next = todayLens(list, { muted: ['dimmed'], hidden: [] }, MONDAY)
    expect(next.order).toEqual(['daily', 'dimmed', 'whenever'])
    expect(next.muted).toEqual(['whenever'])
  })

  it('leaves what is already hidden hidden', () => {
    // A lens narrows what is on screen; it never re-decides the whole
    // list. `un-hide all` is the one press back (spec §5b).
    const list = [scheduled('daily', 'daily'), scheduled('gone', 'whenever')]
    const next = todayLens(list, { muted: [], hidden: ['daily'] }, MONDAY)

    expect(next.hidden).toEqual(['daily'])
    expect(next.muted).toEqual(['gone'])
  })

  it('sinks past a hidden tile, so an un-hide leaves the dim ones lowest', () => {
    // A hidden tile is not drawn, so it cannot change what the sink
    // LOOKS like either way. Sinking past it is what makes `un-hide all`
    // hand back a tidy list rather than one with a live tile stranded
    // under a dim one.
    const list = [
      scheduled('daily', 'daily'),
      scheduled('whenever', 'whenever'),
      scheduled('tuesdays', 'weekdays', { days: [2] }),
    ]
    const next = todayLens(list, fresh, MONDAY)

    expect(next.hidden).toEqual(['tuesdays'])
    expect(next.order).toEqual(['daily', 'tuesdays', 'whenever'])
  })

  it('presses twice to the same screen as once', () => {
    // Nothing is held, so a second press has nothing left to change.
    const list = [
      scheduled('daily', 'daily'),
      scheduled('tuesdays', 'weekdays', { days: [2] }),
      scheduled('thrice', 'nPerWeek', { n: 3 }),
    ]
    const once = todayLens(list, fresh, MONDAY)
    const twice = todayLens(
      once.order.map((id) => list.find((h) => h.id === id)),
      once,
      MONDAY,
    )
    expect(twice).toEqual(once)
  })

  it('changes nothing about the record — it only returns an arrangement', () => {
    const list = [scheduled('daily', 'daily'), scheduled('w', 'whenever')]
    const before = JSON.stringify(list)
    const arrangement = { muted: [], hidden: [] }
    todayLens(list, arrangement, MONDAY)

    expect(JSON.stringify(list)).toBe(before)
    expect(arrangement).toEqual({ muted: [], hidden: [] })
  })
})
