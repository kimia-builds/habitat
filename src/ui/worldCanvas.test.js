// The world-page canvas (T5.4) is written down twice on purpose — as CSS
// custom properties in tokens.css, which is what actually sizes the box, and
// as plain numbers in worldCanvas.js, which is what the SVG viewBox and the
// scene maths can read. Two copies of one fact drift, and this one would
// drift SILENTLY: a scene drawn 1000 units wide inside a box CSS had quietly
// made 900px doesn't look broken, it just stretches, and every arrangement in
// it is a little wrong for ever after.
//
// So this test is the same guard tokens.test.js keeps over the symbols.js
// colour mirror. It reads the stylesheet as text and knows nothing about
// Kimia's content, so it can never fail the deploy on one of her edits.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { ABODE_SKIES } from '../game/abode.js'
import { SKY_TOKENS } from './sky.jsx'
import { CANVAS_HEIGHT, CANVAS_VIEWBOX, CANVAS_WIDTH } from './worldCanvas.js'

const tokens = readFileSync(join(process.cwd(), 'src', 'tokens.css'), 'utf8')

// `--name: 1000px;` → '1000'
function pixelToken(name) {
  const match = tokens.match(new RegExp(`--${name}:\\s*(\\d+(?:\\.\\d+)?)px`))
  return match ? Number(match[1]) : null
}

describe('the world-page canvas (T5.4)', () => {
  it('is the same size in tokens.css as it is in worldCanvas.js', () => {
    expect(pixelToken('world-canvas-width')).toBe(CANVAS_WIDTH)
    expect(pixelToken('world-canvas-height')).toBe(CANVAS_HEIGHT)
  })

  it('is measured in pixels, not rem — a picture, not text', () => {
    // rem would resize the scene whenever the reader's text size changed,
    // which is exactly the shrinking the rule forbids.
    expect(tokens).toMatch(/--world-canvas-width:\s*\d+px/)
    expect(tokens).toMatch(/--world-canvas-height:\s*\d+px/)
  })

  it('hands out a viewBox where one unit is one pixel', () => {
    expect(CANVAS_VIEWBOX).toBe(`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`)
  })

  it('holds no phone size — M8 decides those by eye (2026-08-21)', () => {
    // Nothing may invent a phone canvas in the meantime, the same rule
    // floraCanon.js keeps about the landmark class.
    const source = readFileSync(
      join(process.cwd(), 'src', 'ui', 'worldCanvas.js'),
      'utf8',
    ).replace(/\/\*[\s\S]*?\*\//g, '')
    expect(source).not.toMatch(/phone|mobile/i)
  })
})

// The Abode's four skies are one roster (game/abode.js) wearing paint kept
// beside the drawing (sky.jsx, per design-notes §11d). One list, so they
// cannot drift — but a palette could still be deleted or misspelled, and a
// sky with no paint renders as the fallback without complaining.
describe("the Abode's four skies (T5.4)", () => {
  it('gives every sky in the roster its own paint', () => {
    const painted = Object.keys(SKY_TOKENS.abodePalettes)
    expect(painted.slice().sort()).toEqual(ABODE_SKIES.slice().sort())
  })

  it('paints each sky with a full set of six colours', () => {
    for (const sky of ABODE_SKIES) {
      // [baseTop, baseBot, nebulaA, nebulaB, nebulaC, cloud]
      expect(SKY_TOKENS.abodePalettes[sky]).toHaveLength(6)
    }
  })
})
