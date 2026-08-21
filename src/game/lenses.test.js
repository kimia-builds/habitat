import { describe, expect, it } from 'vitest'

import { orderedForScreen, sinkOnMute } from './lenses.js'

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
