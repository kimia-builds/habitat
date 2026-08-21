// The roll-call of Kimia's ten traced archetypes: every species has a
// drawing, every drawing is complete, and no two species share one.
//
// This is the guard behind Friend.jsx's "if there is no art, draw nothing":
// that branch may only ever be reached by a bad category, never by a species
// whose drawing was forgotten.

import { describe, expect, it } from 'vitest'
import { FRIEND_CATEGORIES } from '../game/constants.js'
import { friendArt } from './tracedFriends.js'

const KEYS = FRIEND_CATEGORIES.map(({ key }) => key)

describe('the traced friends', () => {
  it('has a drawing for every one of the ten species', () => {
    expect(KEYS).toHaveLength(10)
    for (const key of KEYS) expect(friendArt(key)).toBeDefined()
  })

  it('gives each drawing its canvas, its greys and both halves', () => {
    for (const key of KEYS) {
      const art = friendArt(key)
      expect(art.viewBox.w).toBeGreaterThan(0)
      expect(art.viewBox.h).toBeGreaterThan(0)
      // The shade list the individual's colour is generated from.
      expect(Array.isArray(art.greys.ramp)).toBe(true)
      expect(art.greys.ramp.length).toBeGreaterThan(0)
      // The body/eyes split every friend ships as, and their defs.
      for (const part of ['Body', 'BodyDefs', 'Eyes', 'EyeDefs']) {
        expect(typeof art[part]).toBe('function')
      }
    }
  })

  it('gives every species its own drawing, in ladder order', () => {
    // 01 is the plip and they follow in exact order (Kimia, 2026-08-17), so
    // walking the ladder should walk the drawings 01…10 with none repeated.
    expect(KEYS.map((key) => friendArt(key).num)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
    ])
  })

  it('knows nothing about a key that is not one of the ten', () => {
    expect(friendArt('not-a-species')).toBeUndefined()
  })
})
