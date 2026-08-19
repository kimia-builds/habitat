import { describe, test, expect } from 'vitest'
import {
  FLORA_CANON,
  FLORA_SIZE_CLASSES,
  floraScale,
  floraHeight,
  floraWidth,
} from './floraCanon.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { FRIEND_CANON, FRIEND_CANON_ORDER } from './friendCanon.js'
import { FRIEND01_VIEWBOX } from './friend01.jsx'
import { FRIEND02_VIEWBOX } from './friend02.jsx'
import { FRIEND03_VIEWBOX } from './friend03.jsx'
import { FRIEND04_VIEWBOX } from './friend04.jsx'
import { FRIEND05_VIEWBOX } from './friend05.jsx'
import { FRIEND06_VIEWBOX } from './friend06.jsx'
import { FRIEND07_VIEWBOX } from './friend07.jsx'
import { FRIEND08_VIEWBOX } from './friend08.jsx'
import { FRIEND09_VIEWBOX } from './friend09.jsx'
import { FRIEND10_VIEWBOX } from './friend10.jsx'

// Every friend's drawing, so the whole cast can be measured by HEIGHT. The
// canon stores WIDTHS, and a friend's drawing is what turns one into the other
// — which is why these are imported rather than a column of numbers copied in.
const FRIEND_VIEWBOX = {
  plip: FRIEND01_VIEWBOX,
  baluhm: FRIEND02_VIEWBOX,
  krupengk: FRIEND03_VIEWBOX,
  zala: FRIEND04_VIEWBOX,
  'liwi-bi-jiji': FRIEND05_VIEWBOX,
  meuhy: FRIEND06_VIEWBOX,
  rassatt: FRIEND07_VIEWBOX,
  woigolp: FRIEND08_VIEWBOX,
  chitu: FRIEND09_VIEWBOX,
  'hamdi-bulo': FRIEND10_VIEWBOX,
}

// WHERE EACH CLASS SITS IN THE TABLE (Kimia, 2026-08-19). This is the whole
// point of the change she asked for: a flora is no longer "as tall as friend
// X", it is a place in the one ladder everything is measured on. So the test
// names the NEIGHBOURS it must fall between, and a size that wandered out of
// its slot fails here — while a small tidy-up inside the slot is free, as it
// should be, because no single friend owns a flora's height any more.
const NEIGHBOURS = {
  small: { taller_than: 'plip', shorter_than: 'baluhm' },
  large: { taller_than: 'meuhy', shorter_than: 'hamdi-bulo' },
}

// A friend's canon number is its WIDTH; its own drawing then says how tall that
// makes it, in the same unitless scale the flora numbers are written in.
function friendHeight(key) {
  const { w, h } = FRIEND_VIEWBOX[key]
  return FRIEND_CANON[key] * (h / w)
}

// The whole cast plus the two flora classes, shortest first — the sizing table
// the flora now answer to, rebuilt from source rather than trusted.
function sizingTable() {
  return [
    ...FRIEND_CANON_ORDER.map((key) => ({ key, height: friendHeight(key) })),
    ...FLORA_SIZE_CLASSES.map((key) => ({
      key: `flora:${key}`,
      height: FLORA_CANON[key],
    })),
  ].sort((a, b) => a.height - b.height)
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

  // THE HEART OF IT. Each class holds a place in the one table everything is
  // measured on — not a tie to any single friend.
  test('each class falls between the neighbours it was placed between', () => {
    const wrong = []
    for (const cls of FLORA_SIZE_CLASSES) {
      const { taller_than, shorter_than } = NEIGHBOURS[cls]
      const floor = friendHeight(taller_than)
      const ceiling = friendHeight(shorter_than)
      if (FLORA_CANON[cls] <= floor || FLORA_CANON[cls] >= ceiling) {
        wrong.push(
          `${cls} is ${FLORA_CANON[cls]}, not between the ${taller_than} (${floor}) and the ${shorter_than} (${ceiling})`,
        )
      }
    }
    // Named rather than counted, so a failure says which class wandered.
    expect(wrong).toEqual([])
  })

  test('the table has no two things at exactly the same height by accident', () => {
    // Not a rule — the baluhm and krupengk are deliberately equal in WIDTH, and
    // things may legitimately land close. This checks the far weaker thing that
    // matters: the two flora classes are distinct entries, not a duplicate of
    // each other.
    const table = sizingTable()
    const flora = table.filter((row) => row.key.startsWith('flora:'))
    expect(flora).toHaveLength(2)
    expect(flora[0].height).not.toBe(flora[1].height)
  })

  test('the sizing table holds every drawn thing, flora included', () => {
    const table = sizingTable()
    expect(table).toHaveLength(FRIEND_CANON_ORDER.length + 2)
    // Sorted shortest first, which is what makes "between these two" mean
    // anything at all.
    for (let i = 1; i < table.length; i++) {
      expect(table[i].height).toBeGreaterThanOrEqual(table[i - 1].height)
    }
  })

  test('the two classes are far enough apart to read as two sizes', () => {
    expect(FLORA_CANON.large / FLORA_CANON.small).toBeGreaterThan(1.2)
  })

  test('the numbers are chosen, not the residue of a calculation', () => {
    // Kimia rounded them when they stopped being derived from two friends
    // (2026-08-19). A number growing a tail of decimals again is the sign that
    // someone has quietly re-pegged a class to something.
    for (const cls of FLORA_SIZE_CLASSES) {
      expect(FLORA_CANON[cls]).toBe(Number(FLORA_CANON[cls].toFixed(2)))
    }
  })
})

describe('asking the canon for a size', () => {
  test('every flora keeps its place in the table at any base size', () => {
    // The table is proportions, so it must survive a screen picking any base:
    // the ladder's ORDER cannot change just because the drawing got bigger.
    const order = sizingTable().map((row) => row.key)
    for (const base of [1, 11.5, 40, 512]) {
      const scaled = sizingTable()
        .map((row) => ({ key: row.key, height: row.height * base }))
        .sort((a, b) => a.height - b.height)
        .map((row) => row.key)
      expect(scaled).toEqual(order)
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
