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
import Curiosity, { CuriosityDefs, curiosityRecipe } from './Curiosity.jsx'
import { objectDrawnBox, objectSize } from './objectCanon.js'

afterEach(cleanup)

// The objects that have a recipe so far. A new one arriving here is meant to
// be added: every test below should hold for all of them.
const DRAWN = ['column-thin', 'column-tall', 'oval-small', 'oval-large']

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
      const box = objectDrawnBox(key)
      expect(svg.getAttribute('viewBox')).toBe(`0 0 ${box.w} ${box.h}`)
      const want = objectSize(key, 100)
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
    for (const key of DRAWN) {
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
      ['curio-bark-vertical', 'curio-pores-sunken'].sort(),
    )
  })

  it('leaves out the surfaces this page does not draw', () => {
    const { container } = render(<CuriosityDefs keys={['oval-small']} />)
    const filters = [...container.querySelectorAll('filter')].map((f) => f.id)
    expect(filters).toEqual(['curio-pores-sunken'])
  })
})
