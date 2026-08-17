import { describe, test, expect } from 'vitest'
import {
  GREY_TO_PASTEL,
  TINTS,
  greysFor,
  palettesFor,
  paletteForTone,
  TINT_SATURATION,
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
      const generated = paletteForTone(GREYS, { hue: TINT_HUES[tint] })
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
    const generated = paletteForTone(['#333333'], { hue: TINT_HUES.green })
    expect(
      colourGap(generated.ramp[0], GREY_TO_PASTEL['#333333'].green),
    ).toBeGreaterThan(7)
  })

  test('gives a palette the same shape as the named tints do', () => {
    const named = palettesFor(GREYS).green
    const generated = paletteForTone(GREYS, { hue: 200 })
    expect(Object.keys(generated).sort()).toEqual(Object.keys(named).sort())
    expect(generated.ramp).toHaveLength(named.ramp.length)
  })

  test('carries a reconstructed base shade when the trace has one', () => {
    const generated = paletteForTone(GREYS, { hue: 200 }, '#333333')
    expect(generated.base).toMatch(/^#[0-9a-f]{6}$/)
    expect(paletteForTone(GREYS, { hue: 200 }).base).toBeUndefined()
  })

  test('every shade comes back as a real hex colour', () => {
    for (const hue of [0, 40, 151, 256.5, 359.9]) {
      for (const saturation of [0, 8, 38, 60, 100]) {
        for (const shade of paletteForTone(GREYS, { hue, saturation }).ramp) {
          expect(shade).toMatch(/^#[0-9a-f]{6}$/)
        }
      }
    }
  })

  // Saturation is the STRENGTH dial (added on the second pass, 2026-08-17),
  // and weaker must actually mean weaker: less distance between the channels,
  // at the same brightness. It is not by itself the pastel dial — that is
  // `lift`, below — but the pale grey is unreachable without it.
  test('a lower saturation really is a weaker colour', () => {
    const spread = (hex) => {
      const c = channels(hex)
      return Math.max(...c) - Math.min(...c)
    }
    const vivid = paletteForTone(GREYS, { hue: 345, saturation: 60 }).ramp[4]
    const soft = paletteForTone(GREYS, { hue: 345, saturation: 38 }).ramp[4]
    expect(spread(soft)).toBeLessThan(spread(vivid))
  })

  // A saturation of zero is a true grey — the pale grey in the palette leans
  // on this, and it is the one place the hue stops mattering at all.
  test('no saturation at all gives a grey, whatever the hue', () => {
    const a = paletteForTone(GREYS, { hue: 20, saturation: 0 }).ramp
    const b = paletteForTone(GREYS, { hue: 250, saturation: 0 }).ramp
    expect(a).toEqual(b)
    expect(channels(a[0])[0]).toBe(channels(a[0])[2])
  })

  // Callers that only care about a hue still get the strength the three named
  // tints wear, so the formula-versus-table test above stays honest.
  test('leaving the strength out falls back to the tints’ own', () => {
    expect(paletteForTone(GREYS, { hue: 151 }).ramp).toEqual(
      paletteForTone(GREYS, { hue: 151, saturation: TINT_SATURATION }).ramp,
    )
  })

  // LIFT — the pastel dial (2026-08-17). Hue and saturation cannot reach a
  // baby pink, because the lightness belongs to the drawing.
  test('no lift leaves the drawing’s own brightness alone', () => {
    expect(paletteForTone(GREYS, { hue: 345, saturation: 50 }).ramp).toEqual(
      paletteForTone(GREYS, { hue: 345, saturation: 50, lift: 0 }).ramp,
    )
  })

  test('lifting makes every shade lighter', () => {
    const brightness = (hex) => channels(hex).reduce((a, b) => a + b, 0) / 3
    const plain = paletteForTone(GREYS, { hue: 345, saturation: 50 }).ramp
    const pale = paletteForTone(GREYS, {
      hue: 345,
      saturation: 50,
      lift: 45,
    }).ramp
    plain.forEach((shade, i) => {
      expect(brightness(pale[i])).toBeGreaterThan(brightness(shade))
    })
  })

  // THE REASON LIFT IS A FRACTION AND NOT A FLAT AMOUNT. A flat amount would
  // push the top of the ramp past white, where several shades would clip to
  // #ffffff together and the modelling Kimia drew would flatten into a blob.
  // A fraction of the REMAINING distance can never arrive, so the shades stay
  // distinct and in order at any lift.
  test('the shading survives even an extreme lift', () => {
    const pale = paletteForTone(GREYS, { hue: 345, saturation: 50, lift: 90 })
    expect(new Set(pale.ramp).size).toBe(GREYS.length)
    expect(pale.ramp).not.toContain('#ffffff')
    // GREYS is listed darkest first, so the lifted ramp must climb too.
    const brightness = (hex) => channels(hex).reduce((a, b) => a + b, 0) / 3
    for (let i = 1; i < pale.ramp.length; i++) {
      expect(brightness(pale.ramp[i])).toBeGreaterThan(
        brightness(pale.ramp[i - 1]),
      )
    }
  })

  test('the glow lifts with the body, so a pale friend glows pale', () => {
    const pale = paletteForTone(GREYS, { hue: 345, saturation: 50, lift: 45 })
    const plain = paletteForTone(GREYS, { hue: 345, saturation: 50 })
    const brightness = (hex) => channels(hex).reduce((a, b) => a + b, 0) / 3
    expect(brightness(pale.glow)).toBeGreaterThan(brightness(plain.glow))
  })

  // Inkscape writes some of the traces' greys short (#333), and the ramp has to
  // survive that in the generated path exactly as it does in the hand one.
  test('understands Inkscape’s short greys', () => {
    expect(paletteForTone(['#333'], { hue: 200 }).ramp[0]).toBe(
      paletteForTone(['#333333'], { hue: 200 }).ramp[0],
    )
    expect(greysFor(['#333']).ramp[0]).toBe('#333333')
  })

  // A hue is a point on a wheel: 400° is 40°, and -40° is 320°. Callers should
  // never have to normalise before asking.
  test('a hue past the end of the wheel wraps round', () => {
    expect(paletteForTone(GREYS, { hue: 400 }).ramp).toEqual(
      paletteForTone(GREYS, { hue: 40 }).ramp,
    )
    expect(paletteForTone(GREYS, { hue: -40 }).ramp).toEqual(
      paletteForTone(GREYS, { hue: 320 }).ramp,
    )
  })

  test('a ramp keeps the trace’s paint order, light or dark', () => {
    const backwards = [...GREYS].reverse()
    const generated = paletteForTone(backwards, { hue: 200 })
    expect(generated.ramp[0]).toBe(
      paletteForTone(GREYS, { hue: 200 }).ramp[GREYS.length - 1],
    )
  })
})
