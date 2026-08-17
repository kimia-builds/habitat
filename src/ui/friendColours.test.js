import { describe, test, expect } from 'vitest'
import {
  FRIEND_COLOURS,
  individualColour,
  speciesColours,
} from './friendColours.js'
import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'

const KEYS = FRIEND_CATEGORIES.map(({ key }) => key)

// The palette has to be at least as big as the largest roster, or two siblings
// must collide however cleverly the runs are chosen. Ten drifters, ten
// colours: this is the assumption the sibling guarantee rests on, so it is
// asserted rather than assumed.
const LARGEST_ROSTER = Math.max(...FRIEND_ROSTER)

describe('the friend palette', () => {
  test('has a colour for every friend of the largest species', () => {
    expect(FRIEND_COLOURS.length).toBeGreaterThanOrEqual(LARGEST_ROSTER)
  })

  test('is ten named colours, each a hue, a strength and a paleness', () => {
    expect(FRIEND_COLOURS).toHaveLength(10)
    for (const colour of FRIEND_COLOURS) {
      expect(colour.name).toBeTruthy()
      expect(colour.hue).toBeGreaterThanOrEqual(0)
      expect(colour.hue).toBeLessThan(360)
      expect(colour.saturation).toBeGreaterThanOrEqual(0)
      expect(colour.saturation).toBeLessThanOrEqual(100)
      expect(colour.lift).toBeGreaterThanOrEqual(0)
      expect(colour.lift).toBeLessThan(100)
    }
  })

  test('names every colour differently', () => {
    const names = FRIEND_COLOURS.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  // KIMIA'S CALL (2026-08-17): blues and greens are mostly the flora's, so
  // friends may only borrow a couple. This is a design boundary rather than an
  // implementation detail, which is exactly why it is pinned in a test — a
  // later "let's add a nice sage green" should have to argue with something.
  test('leaves the blues and greens mostly to the flora', () => {
    // 90°–250° is green through blue; violet at 256° is a purple and does not
    // count. A colour with almost no saturation (the pale grey) is not a blue
    // whatever its hue says, so it is out too.
    const blueOrGreen = FRIEND_COLOURS.filter(
      (c) => c.hue >= 90 && c.hue <= 250 && c.saturation > 15,
    )
    expect(blueOrGreen.length).toBeLessThanOrEqual(2)
  })

  // The pastels are the point of the second pass: a palette that cannot reach
  // a light colour has no baby pink in it, only a dusty rose. At least half
  // the palette must be genuinely pale.
  test('is half pastels, not ten vivid ones', () => {
    const pastel = FRIEND_COLOURS.filter((c) => c.lift >= 30)
    expect(pastel.length).toBeGreaterThanOrEqual(5)
  })

  // The five Kimia kept from the first shelf, in the slots she numbered them
  // by, so "colour 7" keeps meaning what it meant when she said it.
  test('keeps the five she chose, in their original slots', () => {
    expect(FRIEND_COLOURS[0].name).toBe('gold')
    expect(FRIEND_COLOURS[4].name).toBe('teal')
    expect(FRIEND_COLOURS[6].name).toBe('violet')
    expect(FRIEND_COLOURS[8].name).toBe('magenta')
    expect(FRIEND_COLOURS[9].name).toBe('red')
    // Kept means KEPT: full strength and no lift, so they are pixel-for-pixel
    // the five she approved on the first shelf.
    for (const i of [0, 4, 6, 8, 9]) {
      expect(FRIEND_COLOURS[i].saturation).toBe(60)
      expect(FRIEND_COLOURS[i].lift).toBe(0)
    }
  })
})

describe('handing colours out', () => {
  test('gives every species exactly its roster of colours', () => {
    KEYS.forEach((key, i) => {
      expect(speciesColours(key)).toHaveLength(FRIEND_ROSTER[i])
    })
  })

  test('covers all 55 friendships', () => {
    const total = KEYS.reduce((sum, key) => sum + speciesColours(key).length, 0)
    expect(total).toBe(55)
  })

  // THE HEART OF IT. Colour is the only thing telling two siblings apart
  // (Kimia, 2026-08-17) — so if two drifters ever land on the same colour,
  // they are the same friend as far as anyone looking can tell.
  test('no two individuals of a species share a colour', () => {
    const clashes = []
    for (const key of KEYS) {
      const names = speciesColours(key).map((c) => c.name)
      if (new Set(names).size !== names.length) {
        clashes.push(`${key}: ${names.join(', ')}`)
      }
    }
    expect(clashes).toEqual([])
  })

  test('the drifters wear the whole palette', () => {
    expect(speciesColours('drifter')).toEqual(FRIEND_COLOURS)
  })

  // The offset is what stops the later pastels never being worn — every
  // colour in the palette is somebody's, somewhere in the cast.
  test('every colour finds a friend somewhere in the cast', () => {
    const worn = new Set(
      KEYS.flatMap((key) => speciesColours(key)).map((c) => c.name),
    )
    expect(worn.size).toBe(FRIEND_COLOURS.length)
  })

  test('no two species start on the same colour', () => {
    const firsts = KEYS.map((key) => individualColour(key, 1).name)
    expect(new Set(firsts).size).toBe(firsts.length)
  })

  // The single poet is the edge case the roster maths could trip on: one
  // individual, nothing to be different from.
  test('the lone poet gets one colour and no arithmetic trouble', () => {
    const colours = speciesColours('poet')
    expect(colours).toHaveLength(1)
    expect(colours[0].name).toBeTruthy()
  })

  // Same reasoning as friendCanon's fallback: a wrong colour is a visible bug,
  // and an undefined one is an invisible crash.
  test('an unknown species still gets a usable colour', () => {
    expect(individualColour('nobody', 1)).toEqual(FRIEND_COLOURS[0])
    expect(individualColour(undefined, 3).name).toBeTruthy()
  })

  test('an individual past the roster wraps instead of breaking', () => {
    // An 11th drifter is a bug in the roster cap, not here — it comes back
    // wearing the first drifter's colour rather than undefined.
    expect(individualColour('drifter', 11)).toEqual(
      individualColour('drifter', 1),
    )
  })
})
