// Tests for the hair generator's DENSE FIELD (T5.3g, 2026-08-19).
//
// The rest of textures.jsx is filter definitions and drawing, judged by eye on
// the workbench. This one piece has a property an eye should not have to police
// on every asset, so it is measured here instead: a field must be as thick at
// its bottom edge as it is in its middle.

import { describe, test, expect } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'
import {
  hairField,
  denseHairField,
  hairGrownBox,
  hairReach,
} from './textures.jsx'

afterEach(cleanup)

const MODES = ['curled', 'coat', 'wispy', 'underfur']

// The box every measurement below asks for — the proportions of the widest
// flora, at the size the hair modes were tuned on.
const BOX = { x: 0, y: 0, w: 171, h: 110, seed: 42 }

// Every strand's vertical span, read back off the paths the generator returned.
function strandSpans(nodes) {
  const { container } = render(<svg>{nodes}</svg>)
  return [...container.querySelectorAll('path')].map((p) => {
    const numbers = (p.getAttribute('d').match(/-?\d+(\.\d+)?/g) || []).map(
      Number,
    )
    const ys = numbers.filter((_, i) => i % 2 === 1)
    return { top: Math.min(...ys), bottom: Math.max(...ys) }
  })
}

// How many strands pass through a horizontal band — the closest thing to "how
// thick does it look here" that a test can measure.
function strandsInBand(spans, top, bottom) {
  return spans.filter((s) => s.bottom >= top && s.top <= bottom).length
}

// How the bottom fifth of the asked-for box compares with the middle fifth. 1
// means "as thick at the bottom as in the middle"; 0.3 is the thin underside
// Kimia objected to.
function bottomToMiddle(nodes) {
  const spans = strandSpans(nodes)
  const fifth = BOX.h / 5
  const middle = strandsInBand(spans, 2 * fifth, 3 * fifth)
  const bottom = strandsInBand(spans, BOX.h - fifth, BOX.h)
  return bottom / middle
}

describe('the plain hair field', () => {
  // Not a complaint about `hairField` — this is the behaviour a swatch wants,
  // and it is written down so nobody "fixes" it there and quietly changes
  // every texture swatch on the workbench.
  test('is thinner along its bottom edge, because strands grow upward', () => {
    for (const mode of MODES) {
      expect(bottomToMiddle(hairField({ ...BOX, mode }))).toBeLessThan(0.8)
    }
  })
})

describe('the dense hair field', () => {
  test('is as thick at the bottom as in the middle, in every mode', () => {
    // Kimia's rule (2026-08-19): a shape is cut out of the MIDDLE of a big
    // dense field, so it must not wear a thin band across its underside.
    const thin = []
    for (const mode of MODES) {
      const ratio = bottomToMiddle(denseHairField({ ...BOX, mode }))
      if (ratio < 0.8) thin.push(`${mode} is ${ratio.toFixed(2)}`)
    }
    // Named rather than counted, so a failure says which mode went thin.
    expect(thin).toEqual([])
  })

  test('beats the plain field at the bottom in every mode', () => {
    for (const mode of MODES) {
      expect(bottomToMiddle(denseHairField({ ...BOX, mode }))).toBeGreaterThan(
        bottomToMiddle(hairField({ ...BOX, mode })),
      )
    }
  })

  test('grows its roots below the box it was asked for', () => {
    // The overscan is the mechanism: the strands that fill the underside are
    // rooted underneath it, outside what the caller asked to cover.
    for (const mode of MODES) {
      const spans = strandSpans(denseHairField({ ...BOX, mode }))
      const lowest = Math.max(...spans.map((s) => s.bottom))
      expect(lowest).toBeGreaterThan(BOX.h)
      // …and not absurdly far below it: one strand's reach is the whole point,
      // since every extra unit is strands drawn and thrown away.
      expect(lowest).toBeLessThan(BOX.h + hairReach(mode) * 1.5)
    }
  })

  test('holds the tuned density rather than spreading it thinner', () => {
    // A bigger box with the same strand count would be a sparser field. The
    // passes are what keep it dense, so a dense field always draws more
    // strands than a plain one over the same box.
    for (const mode of MODES) {
      const plain = strandSpans(hairField({ ...BOX, mode })).length
      const dense = strandSpans(denseHairField({ ...BOX, mode })).length
      expect(dense).toBeGreaterThan(plain)
    }
  })

  test('holds that same density on a box SMALLER than the tuning square', () => {
    // Where a small flora's fur is grown since 2026-08-21: its hair space is
    // a third of a large one's, so its field is well under one tuning square.
    // One whole pass there would be several times the tuned density — the same
    // fur wrongly thickened, and none of the strands saved that were the point
    // of growing it small. Density is strands per area of the field actually
    // grown, overscan and all, which is what hairGrownBox gives.
    const perArea = (box, mode) => {
      const grown = hairGrownBox({ ...box, mode })
      return (
        strandSpans(denseHairField({ ...box, mode })).length /
        (grown.w * grown.h)
      )
    }
    const small = { x: 0, y: 0, w: BOX.w / 3, h: BOX.h / 3, seed: 42 }
    const off = []
    for (const mode of MODES) {
      const ratio = perArea(small, mode) / perArea(BOX, mode)
      if (ratio < 0.75 || ratio > 1.35)
        off.push(`${mode} is ${ratio.toFixed(2)}`)
    }
    // Named rather than counted, so a failure says which mode drifted.
    expect(off).toEqual([])
  })

  test('reports a reach for an unknown mode rather than crashing', () => {
    expect(hairReach('nonsense')).toBe(hairReach('curled'))
  })
})
