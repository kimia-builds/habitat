import { describe, test, expect } from 'vitest'
import {
  FIRST_HUE,
  SPECIES_HUE_STEP,
  individualHue,
  speciesHues,
} from './friendHues.js'
import { FRIEND_CATEGORIES, FRIEND_ROSTER } from '../game/constants.js'

const KEYS = FRIEND_CATEGORIES.map(({ key }) => key)

// How far apart two hues are on the wheel, the short way round: 350° and 10°
// are 20° apart, not 340°. Every "are these two colours different" question
// below has to be asked this way or the wrap-around lies.
function hueGap(a, b) {
  const raw = Math.abs(a - b) % 360
  return Math.min(raw, 360 - raw)
}

describe('the colour canon', () => {
  test('gives every species exactly its roster of colours', () => {
    KEYS.forEach((key, i) => {
      expect(speciesHues(key)).toHaveLength(FRIEND_ROSTER[i])
    })
  })

  test('covers all 55 friendships', () => {
    const total = KEYS.reduce((sum, key) => sum + speciesHues(key).length, 0)
    expect(total).toBe(55)
  })

  test('every hue is a real point on the wheel', () => {
    for (const key of KEYS) {
      for (const hue of speciesHues(key)) {
        expect(hue).toBeGreaterThanOrEqual(0)
        expect(hue).toBeLessThan(360)
      }
    }
  })

  // THE HEART OF IT. Colour is the only thing telling two siblings apart
  // (Kimia, 2026-08-17) — so if two drifters ever land on the same colour,
  // they are the same friend as far as anyone looking can tell.
  test('no two individuals of a species share a colour', () => {
    const clashes = []
    for (const key of KEYS) {
      const hues = speciesHues(key)
      hues.forEach((hue, i) => {
        hues.slice(i + 1).forEach((other, j) => {
          if (hueGap(hue, other) < 1) {
            clashes.push(`${key} ${i + 1} and ${i + j + 2} are both ${hue}°`)
          }
        })
      })
    }
    expect(clashes).toEqual([])
  })

  // Evenly spaced is what makes those differences as large as they can be. Ten
  // drifters get 36° each, nine nesters 40°, the lone poet the whole wheel.
  test('a species spreads its roster evenly around the wheel', () => {
    KEYS.forEach((key, i) => {
      const expected = 360 / FRIEND_ROSTER[i]
      const hues = speciesHues(key)
      for (let n = 1; n < hues.length; n++) {
        expect(hueGap(hues[n], hues[n - 1])).toBeCloseTo(expected, 6)
      }
    })
  })

  test('no two species begin on the same colour', () => {
    const firsts = KEYS.map((key) => individualHue(key, 1))
    expect(new Set(firsts).size).toBe(firsts.length)
  })

  test('the ladder starts where it says it does, and steps as it says', () => {
    expect(individualHue('drifter', 1)).toBe(FIRST_HUE)
    expect(individualHue('nester', 1)).toBe(FIRST_HUE + SPECIES_HUE_STEP)
  })

  // The single poet is the edge case the roster maths could trip on: one
  // individual, a step of the whole 360°, nothing to be even against.
  test('the lone poet gets one colour and no arithmetic trouble', () => {
    const hues = speciesHues('poet')
    expect(hues).toHaveLength(1)
    expect(Number.isFinite(hues[0])).toBe(true)
  })

  // Same reasoning as friendCanon's fallback: a wrong colour is a visible bug,
  // and a NaN hue is an invisible one.
  test('an unknown species still gets a usable colour', () => {
    expect(individualHue('nobody', 1)).toBe(FIRST_HUE)
    expect(Number.isFinite(individualHue(undefined, 3))).toBe(true)
  })

  test('an individual past the roster wraps instead of breaking', () => {
    // An 11th drifter is a bug in the roster cap, not here — it comes back
    // wearing the first drifter's colour rather than NaN.
    expect(individualHue('drifter', 11)).toBeCloseTo(
      individualHue('drifter', 1),
      6,
    )
  })
})
