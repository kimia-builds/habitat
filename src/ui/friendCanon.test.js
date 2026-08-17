import { describe, test, expect } from 'vitest'
import {
  FRIEND_CANON,
  FRIEND_CANON_ORDER,
  friendScale,
  friendSize,
} from './friendCanon.js'
import { FRIEND_CATEGORIES } from '../game/constants.js'

// THE CHARACTER SHEET, written out again on purpose (T5.3d).
//
// These are the card widths in rem that T5.3c measured off Kimia's pixel sheet
// — the record the canon was derived from. Keeping a SECOND copy here is what
// makes the tests below a guard rather than a mirror: friendCanon.js could be
// edited by accident, or by a future task tuning "just one friend", and the
// proportions would silently stop being hers. If a change to the canon is
// deliberate, these numbers change with it, deliberately.
const SHEET_REM = {
  plip: 1.6,
  baluhm: 4.8,
  klupengk: 4.8,
  zala: 6.9,
  'liwi-bi-jiji': 9.4,
  meuhy: 4.2,
  rassatt: 9.9,
  woigolp: 9.1,
  chitu: 11.5,
  'hamdi-bulo': 11.0,
}

// How far a stored ratio may sit from the sheet, as a FRACTION of itself rather
// than a flat amount. Proportions are relative, so the tolerance has to be too:
// a flat 0.001 would be generous on the largest friend and impossibly tight on
// the smallest. The canon is stored to six figures, which lands about a
// hundredth of this — so the margin catches real drift and never rounding.
const RELATIVE_TOLERANCE = 0.0001

function proportionsMatch(actual, expected) {
  return Math.abs(actual - expected) / expected <= RELATIVE_TOLERANCE
}

describe('the friend size canon', () => {
  test('covers every category, and nothing else', () => {
    expect(Object.keys(FRIEND_CANON).sort()).toEqual(
      FRIEND_CATEGORIES.map(({ key }) => key).sort(),
    )
  })

  test('lists the cast in ladder order', () => {
    expect(FRIEND_CANON_ORDER).toEqual(FRIEND_CATEGORIES.map(({ key }) => key))
  })

  test('is anchored on exactly one friend at 1, and none above it', () => {
    const scales = Object.values(FRIEND_CANON)
    expect(scales.filter((s) => s === 1)).toHaveLength(1)
    expect(Math.max(...scales)).toBe(1)
  })

  test('every scale is a positive number', () => {
    for (const key of FRIEND_CANON_ORDER) {
      expect(FRIEND_CANON[key]).toBeGreaterThan(0)
    }
  })

  // The heart of it: Kimia's rule is about RATIOS, so the test is about ratios.
  // Every pair of friends must stand to each other exactly as they do on the
  // sheet — which is a stronger statement than "each one is the right size",
  // and it is the one that survives a screen choosing its own base size.
  test('every pair of friends keeps the sheet’s proportions', () => {
    const wrong = []
    for (const a of FRIEND_CANON_ORDER) {
      for (const b of FRIEND_CANON_ORDER) {
        const canonRatio = FRIEND_CANON[a] / FRIEND_CANON[b]
        const sheetRatio = SHEET_REM[a] / SHEET_REM[b]
        if (!proportionsMatch(canonRatio, sheetRatio)) {
          wrong.push(`${a}:${b} is ${canonRatio}, sheet says ${sheetRatio}`)
        }
      }
    }
    // Named rather than counted, so a failure says which friend drifted.
    expect(wrong).toEqual([])
  })

  test('the two friends drawn the same size on the sheet stay equal', () => {
    expect(FRIEND_CANON.baluhm).toBe(FRIEND_CANON.klupengk)
  })
})

describe('asking the canon for a size', () => {
  // The sheet's own rem widths are just one base size among many: feed the
  // scale's anchor width in, and every friend comes back at the width T5.3c
  // gave it. This is the check that the derivation was arithmetic, not taste.
  test('reproduces the sheet’s rem widths at the anchor’s base', () => {
    for (const key of FRIEND_CANON_ORDER) {
      // 3 digits: within half a thousandth of a rem, far finer than a screen
      // can draw and far tighter than any drift worth catching.
      expect(friendSize(key, SHEET_REM.chitu)).toBeCloseTo(SHEET_REM[key], 3)
    }
  })

  // The whole point of a unitless canon: a screen picks any base it likes and
  // the cast still stands in the same order, at the same proportions.
  test('holds the proportions at any base size', () => {
    for (const base of [1, 3.5, 40, 512]) {
      for (const key of FRIEND_CANON_ORDER) {
        const ratioToAnchor = friendSize(key, base) / friendSize('chitu', base)
        expect(ratioToAnchor).toBeCloseTo(FRIEND_CANON[key], 6)
      }
    }
  })

  test('a base of zero gives everyone nothing, and no crash', () => {
    for (const key of FRIEND_CANON_ORDER) {
      expect(friendSize(key, 0)).toBe(0)
    }
  })

  // An unknown key is a bug somewhere else. It must not be a bug HERE: a
  // friend drawn at full size is visible and obviously wrong, which is what we
  // want, where a friend drawn at zero or NaN would just vanish.
  test('an unknown friend falls back to full size rather than vanishing', () => {
    expect(friendScale('nobody')).toBe(1)
    expect(friendScale(undefined)).toBe(1)
    expect(friendSize('nobody', 8)).toBe(8)
  })
})
