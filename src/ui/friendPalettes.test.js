import { describe, test, expect } from 'vitest'
import {
  GREY_TO_PASTEL,
  TINTS,
  greysFor,
  palettesFor,
  paletteForHue,
} from './friendPalettes.js'

// The hues the three hand-written tints turn out to be (T5.3e). These are the
// claim the generator makes about the table, so they are written down here as
// well — if someone retunes a tint by hand, this file is where the two stop
// agreeing, loudly, instead of quietly.
const TINT_HUES = { green: 151, violet: 256.5, amber: 40 }

const GREYS = Object.keys(GREY_TO_PASTEL)

function channels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

// How far apart two colours are, as the worst of their three channels out of
// 255. Two or three apart is invisible; nineteen is a different colour.
function colourGap(a, b) {
  const [x, y] = [channels(a), channels(b)]
  return Math.max(...x.map((v, i) => Math.abs(v - y[i])))
}

describe('generating a ramp from a hue', () => {
  // The ONE row that is not the formula, excluded from the sweep below by name
  // and checked in its own test: the darkest green was hand-darkened past what
  // the maths gives, and that is a decision, not drift.
  const HAND_DARKENED = 'green #333333'

  // THE CLAIM T5.3e RESTS ON: the hand table is one formula — the grey's own
  // lightness, 60% saturation, turn the hue — so 55 individual ramps can be
  // generated instead of hand-picked. This test is the evidence.
  test('reproduces the hand-written pastels from their hue alone', () => {
    const off = []
    for (const tint of TINTS) {
      const generated = paletteForHue(GREYS, TINT_HUES[tint])
      GREYS.forEach((grey, i) => {
        if (`${tint} ${grey}` === HAND_DARKENED) return
        const gap = colourGap(generated.ramp[i], GREY_TO_PASTEL[grey][tint])
        // 7 of 255 per channel: comfortably inside "the same colour" and
        // tight enough that a real drift in the table fails here.
        if (gap > 7) off.push(`${tint} ${grey}: ${gap}/255 out`)
      })
    }
    expect(off).toEqual([])
  })

  // The one row that is NOT the formula, kept on purpose: the darkest green
  // was hand-darkened past what the maths gives. Recorded here so a future
  // reader knows it is a decision, not rot — and so nobody "fixes" it.
  test('the deliberately darkened green is still darker than the formula', () => {
    const generated = paletteForHue(['#333333'], TINT_HUES.green)
    expect(
      colourGap(generated.ramp[0], GREY_TO_PASTEL['#333333'].green),
    ).toBeGreaterThan(7)
  })

  test('gives a palette the same shape as the named tints do', () => {
    const named = palettesFor(GREYS).green
    const generated = paletteForHue(GREYS, 200)
    expect(Object.keys(generated).sort()).toEqual(Object.keys(named).sort())
    expect(generated.ramp).toHaveLength(named.ramp.length)
  })

  test('carries a reconstructed base shade when the trace has one', () => {
    const generated = paletteForHue(GREYS, 200, '#333333')
    expect(generated.base).toMatch(/^#[0-9a-f]{6}$/)
    expect(paletteForHue(GREYS, 200).base).toBeUndefined()
  })

  test('every shade comes back as a real hex colour', () => {
    for (const hue of [0, 40, 151, 256.5, 359.9]) {
      for (const shade of paletteForHue(GREYS, hue).ramp) {
        expect(shade).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })

  // Inkscape writes some of the traces' greys short (#333), and the ramp has to
  // survive that in the generated path exactly as it does in the hand one.
  test('understands Inkscape’s short greys', () => {
    expect(paletteForHue(['#333'], 200).ramp[0]).toBe(
      paletteForHue(['#333333'], 200).ramp[0],
    )
    expect(greysFor(['#333']).ramp[0]).toBe('#333333')
  })

  // A hue is a point on a wheel: 400° is 40°, and -40° is 320°. Callers should
  // never have to normalise before asking.
  test('a hue past the end of the wheel wraps round', () => {
    expect(paletteForHue(GREYS, 400).ramp).toEqual(
      paletteForHue(GREYS, 40).ramp,
    )
    expect(paletteForHue(GREYS, -40).ramp).toEqual(
      paletteForHue(GREYS, 320).ramp,
    )
  })

  test('a ramp keeps the trace’s paint order, light or dark', () => {
    const backwards = [...GREYS].reverse()
    const generated = paletteForHue(backwards, 200)
    expect(generated.ramp[0]).toBe(
      paletteForHue(GREYS, 200).ramp[GREYS.length - 1],
    )
  })
})
