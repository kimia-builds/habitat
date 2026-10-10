// Tests for the market objects' one drawing component (T5.3j).
//
// What these hold on to is the pair of rules Kimia gave on 2026-09-01 and the
// canon that carries them: an object is drawn in a frame of its own Abode-pixel
// size (so one pore is one pore whatever size the object is), its outline is
// hand-drawn in the sense of organic wobble rather than sketchiness (so no
// straight segment is ever emitted), and a family's two sizes are the SAME
// object — same surface, same colour — and not two objects that look alike.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Curiosity, {
  CuriosityDefs,
  curiosityCanonKey,
  curiosityRecipe,
} from './Curiosity.jsx'
import { objectDrawnBox, objectSize } from './objectCanon.js'

afterEach(cleanup)

// The objects that have a recipe so far. A new one arriving here is meant to
// be added: every test below should hold for all of them.
const CHARMS = [
  'charm-crown',
  'charm-cherry',
  'charm-shell',
  'charm-anchor',
  'charm-shield',
  'charm-key',
]

const DRAWN = [
  'column-thin',
  'column-tall',
  'oval-small',
  'oval-large',
  'smoke',
  'stone-1',
  'stone-2',
  'stone-3',
  ...CHARMS,
]

function drawingFor(key, base = 100) {
  const { container } = render(
    <Curiosity objectKey={key} base={base} unit="px" />,
  )
  return container.querySelector('svg')
}

describe('a curiosity', () => {
  it('is drawn in a frame of its own size, and shown at its canon size', () => {
    // The texture rule, mechanically: the viewBox is Kimia's pixel measurement
    // and the rendered size is the canon's answer for this screen's base, so
    // every object on one screen is scaled by the same factor.
    for (const key of DRAWN) {
      const svg = drawingFor(key)
      // Via the recipe's canon key: the three stones are three objects at one
      // canon size, so a stone's own key is not in the sizing table.
      const box = objectDrawnBox(curiosityCanonKey(key))
      expect(svg.getAttribute('viewBox')).toBe(`0 0 ${box.w} ${box.h}`)
      const want = objectSize(curiosityCanonKey(key), 100)
      expect(Number.parseFloat(svg.getAttribute('width'))).toBeCloseTo(
        want.w,
        6,
      )
      expect(Number.parseFloat(svg.getAttribute('height'))).toBeCloseTo(
        want.h,
        6,
      )
    }
  })

  it('draws its outline in curves only, and never strokes it', () => {
    // (The charm objects are line drawings of the charms themselves, below.)
    for (const key of DRAWN.filter((key) => !CHARMS.includes(key))) {
      const path = drawingFor(key).querySelector('path')
      const d = path.getAttribute('d')
      expect(d.startsWith('M')).toBe(true)
      expect(d.endsWith('Z')).toBe(true)
      expect(/[LHVAQSTlhvaqst]/.test(d)).toBe(false)
      expect(path.getAttribute('stroke')).toBeNull()
    }
  })

  it('gives the two discs one surface and one colour, being one object', () => {
    // "one shape at two sizes" (objectCanon.js): the large disc is the small
    // one enlarged, so anything that says WHAT it is must match.
    const small = curiosityRecipe('oval-small')
    const large = curiosityRecipe('oval-large')
    expect(large.surface).toBe(small.surface)
    expect(large.outline).toBe(small.outline)
    const fills = ['oval-small', 'oval-large'].map((key) =>
      drawingFor(key).querySelector('path').getAttribute('fill'),
    )
    expect(fills[0]).toBe(fills[1])
  })

  it('gives the three stones one size and one surface, and three shapes', () => {
    // The discs' relationship upside down (Curiosity.jsx): the discs are one
    // shape at two sizes, the stones three shapes at one size. So everything
    // that says WHAT they are must match, and the outline must not.
    const stones = ['stone-1', 'stone-2', 'stone-3']
    const recipes = stones.map(curiosityRecipe)
    for (const recipe of recipes) {
      expect(recipe.surface).toBe(recipes[0].surface)
      expect(recipe.outline).toBe(recipes[0].outline)
      expect(recipe.canon).toBe('stone')
    }
    const drawings = stones.map(drawingFor)
    const boxes = drawings.map((svg) => svg.getAttribute('viewBox'))
    expect(boxes).toEqual(['0 0 250 250', '0 0 250 250', '0 0 250 250'])
    const shapes = drawings.map((svg) => svg.querySelector('path'))
    expect(new Set(shapes.map((p) => p.getAttribute('fill'))).size).toBe(1)
    expect(new Set(shapes.map((p) => p.getAttribute('d'))).size).toBe(3)
  })

  it('draws each charm object as its charm, in the charm colour, in one pen', () => {
    for (const [i, key] of CHARMS.entries()) {
      const pen = drawingFor(key).querySelector('g > g')
      expect(pen.getAttribute('stroke')).toBe('currentColor')
      expect(pen.style.color).not.toBe('')
      expect(pen.querySelectorAll('*').length).toBeGreaterThan(0)
      // The pen is the same width on screen whatever the charm's size: the
      // stroke times the scale is always the one line weight.
      const k = Number(
        /scale\(([\d.]+)\)/.exec(pen.getAttribute('transform'))[1],
      )
      expect(Number(pen.getAttribute('stroke-width')) * k).toBeCloseTo(6, 6)
      expect(i).toBeLessThan(6)
    }
  })

  it('lets a charm object be grabbed anywhere in its frame, gaps included', () => {
    // A charm is mostly gaps. The invisible rectangle is painted (transparent,
    // not "none"), so a pointer landing between the lines still hits the object.
    for (const key of CHARMS) {
      const svg = drawingFor(key)
      const [vx, vy, vw, vh] = svg
        .getAttribute('viewBox')
        .split(' ')
        .map(Number)
      const grab = svg.querySelector('.curiosity-grab')
      expect(grab).not.toBeNull()
      expect(grab.getAttribute('fill')).toBe('transparent')
      expect(Number(grab.getAttribute('width'))).toBe(vw)
      expect(Number(grab.getAttribute('height'))).toBe(vh)
      expect(vx + vy).toBe(0)
    }
  })

  it('draws nothing at all for a key it has no recipe for', () => {
    // Better than substituting some other object: a wrong drawing on the
    // ground would be a bug you could look straight at and not see.
    const { container } = render(
      <Curiosity objectKey="no-such-thing" base={100} />,
    )
    expect(container.querySelector('svg')).toBeNull()
  })
})

describe('the defs a page needs', () => {
  it('emits one filter per surface actually drawn, and no more', () => {
    // A page pays only for what it shows, and two objects wearing one surface
    // share its filter rather than each getting a copy.
    const { container } = render(<CuriosityDefs keys={DRAWN} />)
    const filters = [...container.querySelectorAll('filter')].map((f) => f.id)
    expect(filters.slice().sort()).toEqual(
      [
        'curio-bark-vertical',
        'curio-pores-sunken',
        'curio-smoke-pink',
        'curio-stone-cratered',
        'curio-charm-wobble',
      ].sort(),
    )
  })

  it('lets the smoke out past its own edge, unlike every solid surface', () => {
    // The smoke's defining property, and the only rule about it that can be
    // checked without eyes: every other filter in the set finishes clipped to
    // the shape wearing it, which is what keeps a texture inside its object.
    // Clip the smoke and the blur that makes it a puff would be sliced off by
    // a crisp edge — the one thing Kimia said it must not have.
    const { container } = render(<CuriosityDefs keys={['smoke', 'stone-1']} />)
    const clipped = (id) =>
      [...container.querySelector(id).children].some(
        (el) =>
          el.localName === 'feComposite' &&
          el.getAttribute('in2') === 'SourceAlpha' &&
          el.getAttribute('operator') === 'in',
      )
    expect(clipped('#curio-stone-cratered')).toBe(true)
    expect(clipped('#curio-smoke-pink')).toBe(false)
  })

  it('leaves out the surfaces this page does not draw', () => {
    const { container } = render(<CuriosityDefs keys={['oval-small']} />)
    const filters = [...container.querySelectorAll('filter')].map((f) => f.id)
    expect(filters).toEqual(['curio-pores-sunken'])
  })
})

// The market page and the Abode pick a drawing by pool slot (game/market.js).
// A slot naming a recipe that does not exist would draw nothing at all.
describe('the pool slots that wear drawings', () => {
  it('every drawn slot names a real recipe, and every recipe has a slot', async () => {
    const { DRAWN_CURIOSITIES } = await import('../game/market.js')
    const named = Object.values(DRAWN_CURIOSITIES)
    for (const key of named) expect(curiosityRecipe(key)).toBeDefined()
    expect([...named].sort()).toEqual([...DRAWN].sort())
  })
})
