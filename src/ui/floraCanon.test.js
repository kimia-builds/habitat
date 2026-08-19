import { describe, test, expect } from 'vitest'
import {
  FLORA_CANON,
  FLORA_SIZE_CLASSES,
  floraScale,
  floraHeight,
  floraWidth,
} from './floraCanon.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { FRIEND_CANON, friendSize } from './friendCanon.js'
import { FRIEND04_VIEWBOX } from './friend04.jsx'
import { FRIEND09_VIEWBOX } from './friend09.jsx'

// The two friends the classes are pegged to (Kimia, 2026-08-19): a large flora
// stands as tall as a CHITU, a small one HALF as tall as a ZALA — she halved
// the small class on sight after seeing both drawn. Their drawings are imported
// above rather than copied, because "half a zala tall" has to keep meaning that
// even if the zala is ever redrawn — this is the guard that makes the two
// numbers in floraCanon.js a derivation rather than a pair of taste decisions
// that could quietly stop being true.
const PEGS = { small: 'zala', large: 'chitu' }
const PEG_VIEWBOX = { zala: FRIEND04_VIEWBOX, chitu: FRIEND09_VIEWBOX }

// How much of its peg friend's height each class actually takes.
const PEG_SHARE = { small: 0.5, large: 1 }

// A friend's canon number is its WIDTH; its own drawing then says how tall that
// makes it. That height is what a flora of the matching class must equal.
function friendHeightInCanon(key) {
  const { w, h } = PEG_VIEWBOX[key]
  return FRIEND_CANON[key] * (h / w)
}

// The height a class must come out at: its peg friend's height, times the
// share of it Kimia settled on.
function expectedHeight(sizeClass) {
  return friendHeightInCanon(PEGS[sizeClass]) * PEG_SHARE[sizeClass]
}

// Relative, not flat, for the reason friendCanon.test.js gives: proportions are
// relative, so the tolerance has to be. Six stored figures land far inside this.
const RELATIVE_TOLERANCE = 0.0001

function proportionsMatch(actual, expected) {
  return Math.abs(actual - expected) / expected <= RELATIVE_TOLERANCE
}

describe('the flora size canon', () => {
  test('has exactly the two size classes, and no third', () => {
    // The landmark super-size is deliberately unset (design-bible §9a). If a
    // third class ever appears it must be because Kimia asked for it, which
    // means this test changes in the same breath.
    expect(Object.keys(FLORA_CANON).sort()).toEqual(['large', 'small'])
    expect(FLORA_SIZE_CLASSES).toEqual(['small', 'large'])
  })

  test('every size is a positive number, and large is the larger', () => {
    for (const cls of FLORA_SIZE_CLASSES) {
      expect(FLORA_CANON[cls]).toBeGreaterThan(0)
    }
    expect(FLORA_CANON.large).toBeGreaterThan(FLORA_CANON.small)
  })

  // THE HEART OF IT. Each class is a friend's height, in the friends' own
  // scale, so the two families are one scale and not two.
  test('a small flora is half a zala tall, a large one a whole chitu tall', () => {
    const wrong = []
    for (const cls of FLORA_SIZE_CLASSES) {
      const wanted = expectedHeight(cls)
      if (!proportionsMatch(FLORA_CANON[cls], wanted)) {
        wrong.push(
          `${cls} is ${FLORA_CANON[cls]}, ${PEG_SHARE[cls]} of a ${PEGS[cls]} is ${wanted}`,
        )
      }
    }
    // Named rather than counted, so a failure says which class drifted.
    expect(wrong).toEqual([])
  })

  // The zala and the rassatt are near enough the same height (the rassatt is
  // wide and low), which is why the large class is pegged to the chitu instead.
  // If a later change re-pegs it to a friend that is not actually taller, the
  // two classes collapse into one and nothing else in the suite would notice.
  test('the two classes are far enough apart to read as two sizes', () => {
    expect(FLORA_CANON.large / FLORA_CANON.small).toBeGreaterThan(1.2)
  })

  test('the small class is half its peg, not a whole one', () => {
    // The halving is Kimia's eyeball decision (2026-08-19), and it is the one
    // number here that no arithmetic would have produced on its own — so it
    // gets its own guard rather than living only inside the derivation above.
    expect(PEG_SHARE.small).toBe(0.5)
    expect(
      proportionsMatch(FLORA_CANON.small, friendHeightInCanon('zala') / 2),
    ).toBe(true)
  })
})

describe('asking the canon for a size', () => {
  test('a flora keeps its share of its peg friend’s height at any base', () => {
    for (const base of [1, 11.5, 40, 512]) {
      for (const cls of FLORA_SIZE_CLASSES) {
        const peg = PEGS[cls]
        const { w, h } = PEG_VIEWBOX[peg]
        const pegHeight = friendSize(peg, base) * (h / w) * PEG_SHARE[cls]
        // Relative, not to a fixed number of decimals: an absolute margin that
        // is right at a base of 1 is impossibly tight at a base of 512, since
        // the canon's six stored figures scale up with everything else.
        expect(proportionsMatch(floraHeight(cls, base), pegHeight)).toBe(true)
      }
    }
  })

  test('holds its proportions at any base size', () => {
    for (const base of [1, 3.5, 40, 512]) {
      for (const cls of FLORA_SIZE_CLASSES) {
        expect(floraHeight(cls, base) / base).toBeCloseTo(FLORA_CANON[cls], 6)
      }
    }
  })

  // No silhouette is ever stretched: the class sets the height, the drawing
  // sets the width, and the shape that comes out is the shape Kimia drew.
  test('width follows each drawing’s own proportions, never a stretch', () => {
    for (const silhouette of FLORA_SILHOUETTES) {
      for (const cls of FLORA_SIZE_CLASSES) {
        const width = floraWidth(cls, silhouette, 11.5)
        const height = floraHeight(cls, 11.5)
        const { w, h } = silhouette.viewBox
        expect(width / height).toBeCloseTo(w / h, 6)
      }
    }
  })

  test('all four silhouettes of a class stand the same height', () => {
    for (const cls of FLORA_SIZE_CLASSES) {
      const heights = FLORA_SILHOUETTES.map(() => floraHeight(cls, 11.5))
      expect(new Set(heights).size).toBe(1)
    }
  })

  test('a base of zero gives nothing, and no crash', () => {
    for (const cls of FLORA_SIZE_CLASSES) {
      expect(floraHeight(cls, 0)).toBe(0)
      expect(floraWidth(cls, FLORA_SILHOUETTES[0], 0)).toBe(0)
    }
  })

  // An unknown class is a bug somewhere else. A flora drawn large is visible
  // and obviously wrong; one drawn at zero or NaN would simply vanish.
  test('an unknown size class falls back to the large one rather than vanishing', () => {
    expect(floraScale('enormous')).toBe(FLORA_CANON.large)
    expect(floraScale(undefined)).toBe(FLORA_CANON.large)
  })
})

describe('the four silhouettes', () => {
  test('there are exactly four, keyed by Kimia’s own file numbers', () => {
    expect(FLORA_SILHOUETTES).toHaveLength(4)
    expect(FLORA_SILHOUETTES.map((s) => s.key)).toEqual(['1', '2', '3', '6'])
  })

  test('each carries a drawn canvas and a path', () => {
    for (const s of FLORA_SILHOUETTES) {
      expect(s.viewBox.w).toBeGreaterThan(0)
      expect(s.viewBox.h).toBeGreaterThan(0)
      expect(typeof s.d).toBe('string')
      expect(s.d.length).toBeGreaterThan(100)
    }
  })
})
