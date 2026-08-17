// The friend-name slots (T6.1a).
//
// These tests guard the SHAPE of Kimia's names file and the ladder that
// reads it — never a word inside it. She edits names.js straight on
// GitHub, so anything asserting what a slot says (or that it is still
// blank) would break the deploy the moment she writes: the same trap
// that broke CI in July 2026, twice.
//
// What is worth guarding: that there is exactly one slot for every
// species and every individual the game can ever produce. A friend with
// no slot would have nowhere to be named, and nobody would notice until
// that friend arrived — possibly years in.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'
import {
  NAMES,
  friendDisplayName,
  individualName,
  speciesName,
} from './names.js'
import {
  blankAllNames,
  restoreNames,
  setIndividualName,
  setSpeciesName,
} from '../test/nameFixture.js'

describe('the name slots', () => {
  it('has one species slot per category, keyed the same way', () => {
    expect(Object.keys(NAMES.species)).toEqual(
      FRIEND_CATEGORIES.map((category) => category.key),
    )
  })

  it('has one individual slot per friend the roster can ever send', () => {
    for (const [index, category] of FRIEND_CATEGORIES.entries()) {
      const roster = NAMES.individuals[category.key]
      expect(roster, `${category.key} has an individual roster`).toBeDefined()
      // Numbered 1..N with no gaps — the arrival order the game uses.
      expect(Object.keys(roster).map(Number)).toEqual(
        Array.from({ length: FRIEND_ROSTER[index] }, (_, i) => i + 1),
      )
    }
  })

  it('carries 55 individual slots in all — the lifetime maximum', () => {
    const total = Object.values(NAMES.individuals).reduce(
      (sum, roster) => sum + Object.keys(roster).length,
      0,
    )
    expect(total).toBe(55)
    expect(FRIEND_ROSTER.reduce((a, b) => a + b, 0)).toBe(55)
  })

  it('keeps no drafted names in the game layer', () => {
    // The whole point of T6.1a: the words left constants.js. If a
    // display word ever creeps back in beside the key, this fails.
    for (const category of FRIEND_CATEGORIES) {
      expect(Object.keys(category)).toEqual(['key'])
    }
  })
})

describe('reading a slot', () => {
  // Start from a wiped file every time, so these tests describe the
  // READER and never Kimia's words — or whether she has written yet.
  beforeEach(blankAllNames)
  afterEach(restoreNames)

  it('gives back what is written, trimmed', () => {
    setSpeciesName('plip', '  a written species name  ')
    expect(speciesName('plip')).toBe('a written species name')
  })

  it('gives back null for a blank slot, so screens show nothing', () => {
    setSpeciesName('plip', '')
    expect(speciesName('plip')).toBeNull()
    expect(individualName('plip', 1)).toBeNull()
  })

  it('gives back null for a slot that does not exist', () => {
    // Belt and braces: an unknown key or an individual past the roster
    // must never throw — it simply has no name.
    expect(speciesName('nobody')).toBeNull()
    expect(individualName('plip', 999)).toBeNull()
    expect(individualName('nobody', 1)).toBeNull()
  })
})

describe('the display ladder', () => {
  beforeEach(blankAllNames)
  afterEach(restoreNames)

  it('prefers the individual name over the species name', () => {
    setSpeciesName('plip', 'a species name')
    setIndividualName('plip', 3, 'an individual name')
    expect(friendDisplayName('plip', 3)).toBe('an individual name')
    expect(friendDisplayName('plip', 4)).toBe('a species name')
  })

  it('falls back to the species name, then to nothing at all', () => {
    setSpeciesName('plip', 'a species name')
    setIndividualName('plip', 1, '')
    expect(friendDisplayName('plip', 1)).toBe('a species name')

    setSpeciesName('plip', '')
    expect(friendDisplayName('plip', 1)).toBeNull()
  })
})
