import { describe, test, expect } from 'vitest'
import {
  FRIEND_COLOURS,
  individualColour,
  speciesColours,
} from './friendColours.js'
import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'

const KEYS = FRIEND_CATEGORIES.map(({ key }) => key)

// The palette has to be at least as big as the largest roster, or two siblings
// must collide however cleverly the runs are chosen. Ten plips, ten
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

  // The five Kimia kept from the first shelf, in the slots she numbered them
  // by, so "colour 7" keeps meaning what it meant when she said it.
  test('keeps the five she chose, in their original slots', () => {
    expect(FRIEND_COLOURS[0].name).toBe('gold')
    expect(FRIEND_COLOURS[4].name).toBe('teal')
    expect(FRIEND_COLOURS[6].name).toBe('violet')
    expect(FRIEND_COLOURS[8].name).toBe('magenta')
    expect(FRIEND_COLOURS[9].name).toBe('red')
    // Their hue and strength are hers. Their LIFT is not pinned here: she
    // later chose to lift them with everyone else, and the family test below
    // is what holds that.
    for (const i of [0, 4, 6, 8, 9]) {
      expect(FRIEND_COLOURS[i].saturation).toBe(60)
    }
  })

  // ONE FAMILY (Kimia, 2026-08-17, choosing between two benches). Nobody sits
  // at no lift any more: a single unlifted colour would stand out as vivid
  // against nine pale ones, which is the split she rejected.
  test('is one family — every colour lifted, none of them starkly', () => {
    for (const colour of FRIEND_COLOURS) {
      expect(colour.lift).toBeGreaterThanOrEqual(35)
      expect(colour.lift).toBeLessThanOrEqual(45)
    }
  })
})

// A handful of stand-in worlds. Colours are dealt per save now, so almost
// everything below has to be asked of a particular game rather than of the
// module — and asked of SEVERAL games, since a rule that only holds for one
// seed is not a rule.
const WORLDS = ['seed-a', 'seed-b', 'seed-c', 'another-world', '12345']

describe('handing colours out', () => {
  test('gives every species exactly its roster of colours', () => {
    for (const world of WORLDS) {
      KEYS.forEach((key, i) => {
        expect(speciesColours(key, world)).toHaveLength(FRIEND_ROSTER[i])
      })
    }
  })

  test('covers all 55 friendships', () => {
    const total = KEYS.reduce(
      (sum, key) => sum + speciesColours(key, 'seed-a').length,
      0,
    )
    expect(total).toBe(55)
  })

  // THE HEART OF IT. Colour is the only thing telling two siblings apart
  // (Kimia, 2026-08-17) — so if two plips ever land on the same colour,
  // they are the same friend as far as anyone looking can tell. Dealing off
  // one shuffled pack is what makes this true by construction, but it is the
  // promise itself that is pinned here, in every world.
  test('no two individuals of a species share a colour', () => {
    const clashes = []
    for (const world of WORLDS) {
      for (const key of KEYS) {
        const names = speciesColours(key, world).map((c) => c.name)
        if (new Set(names).size !== names.length) {
          clashes.push(`${world}/${key}: ${names.join(', ')}`)
        }
      }
    }
    expect(clashes).toEqual([])
  })

  test('the plips wear the whole palette, in some order', () => {
    for (const world of WORLDS) {
      const names = speciesColours('plip', world).map((c) => c.name)
      expect(names.slice().sort()).toEqual(
        FRIEND_COLOURS.map((c) => c.name).sort(),
      )
    }
  })

  // Ten plips wear all ten, so no pastel is ever left in the box.
  test('every colour finds a friend somewhere in the cast', () => {
    for (const world of WORLDS) {
      const worn = new Set(
        KEYS.flatMap((key) => speciesColours(key, world)).map((c) => c.name),
      )
      expect(worn.size).toBe(FRIEND_COLOURS.length)
    }
  })

  // KIMIA'S CALL (2026-08-17): "different players might get friends of
  // different colours." Two saves must be able to disagree — otherwise the
  // deal is decoration, not a deal.
  test('two players get different friends', () => {
    const hand = (world) =>
      KEYS.map((key) => individualColour(key, 1, world).name).join('|')
    const hands = new Set(WORLDS.map(hand))
    expect(hands.size).toBe(WORLDS.length)
  })

  // …and the other half of that promise: WITHIN one save the deal never
  // changes. A friend that re-rolled its colour on every render, undo or
  // backup restore would not be a friend you recognise.
  test('one player gets the same friends every time they look', () => {
    for (const world of WORLDS) {
      for (const key of KEYS) {
        const first = speciesColours(key, world).map((c) => c.name)
        const again = speciesColours(key, world).map((c) => c.name)
        expect(again).toEqual(first)
        // And asking for one friend on its own agrees with the roster —
        // skipping the lone hamdi bulo, who has no second individual.
        if (first.length > 1) {
          expect(individualColour(key, 2, world).name).toBe(first[1])
        }
      }
    }
  })

  // One species' shuffle must not be another's, or the whole cast would line
  // up in matching colours down the ladder.
  test('two species in one world are dealt differently', () => {
    const deals = new Set(
      KEYS.map((key) => speciesColours(key, 'seed-a').map((c) => c.name)[0]),
    )
    expect(deals.size).toBeGreaterThan(1)
  })

  // The single hamdi bulo is the edge case the roster maths could trip on: one
  // individual, nothing to be different from.
  test('the lone hamdi bulo gets one colour and no arithmetic trouble', () => {
    const colours = speciesColours('hamdi-bulo', 'seed-a')
    expect(colours).toHaveLength(1)
    expect(colours[0].name).toBeTruthy()
  })

  // Same reasoning as friendCanon's fallback: a wrong colour is a visible bug,
  // and an undefined one is an invisible crash.
  test('an unknown species still gets a usable colour', () => {
    expect(FRIEND_COLOURS).toContain(individualColour('nobody', 1, 'seed-a'))
    expect(individualColour(undefined, 3, 'seed-a').name).toBeTruthy()
  })

  test('an individual past the roster wraps instead of breaking', () => {
    // An 11th plip is a bug in the roster cap, not here — it comes back
    // wearing the first plip's colour rather than undefined.
    expect(individualColour('plip', 11, 'seed-a')).toEqual(
      individualColour('plip', 1, 'seed-a'),
    )
  })
})
