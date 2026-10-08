import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import Flora, { floraBox } from './Flora.jsx'
import { floraHeight, floraWidth } from './floraCanon.js'
import { floraIdentity } from './floraDeal.js'

afterEach(cleanup)

const SEED = 'seed'
const BASE = 100

function draw(completionId, props = {}) {
  const { container } = render(
    <Flora
      completionId={completionId}
      worldSeed={SEED}
      base={BASE}
      {...props}
    />,
  )
  return container.querySelector('svg')
}

describe('a flora drawn for real', () => {
  it('stands at the size the canon gives its dealt class', () => {
    const svg = draw('c1')
    const { silhouette, sizeClass } = floraIdentity('c1', SEED)
    expect(svg.getAttribute('height')).toBe(
      String(floraHeight(sizeClass, BASE)),
    )
    expect(svg.getAttribute('width')).toBe(
      String(floraWidth(sizeClass, silhouette, BASE)),
    )
    // The drawing keeps its own shape: the box is the trace's canvas, so
    // nothing is ever stretched to fit.
    expect(svg.getAttribute('viewBox')).toBe(
      `0 0 ${silhouette.viewBox.w} ${silhouette.viewBox.h}`,
    )
  })

  it('is a plain fill in its own colour over an opaque dark ground', () => {
    const svg = draw('c1')
    const { silhouette, fill } = floraIdentity('c1', SEED)
    const paths = [...svg.querySelectorAll('path')]
    // aura, ground, colour — and no hair, no clip: the textures are gone.
    expect(paths).toHaveLength(3)
    expect(svg.querySelector('clipPath')).toBeNull()
    for (const p of paths) expect(p.getAttribute('d')).toBe(silhouette.d)
    const [, ground, body] = paths
    // The ground is solid, so no star of the sky shows through the body.
    expect(ground.getAttribute('fill-opacity')).toBeNull()
    expect(ground.getAttribute('fill')).not.toBe(fill.hex)
    // The body is the colour at a light strength with a stronger outline.
    expect(body.getAttribute('fill')).toBe(fill.hex)
    expect(body.getAttribute('stroke')).toBe(fill.hex)
    expect(Number(body.getAttribute('fill-opacity'))).toBeLessThan(
      Number(body.getAttribute('stroke-opacity')),
    )
  })

  it('keeps its outline the same thickness on screen whatever its size', () => {
    const small = draw('c1')
    const body = (svg) => svg.querySelectorAll('path')[2]
    expect(body(small).getAttribute('vector-effect')).toBe(
      'non-scaling-stroke',
    )
    // Same fixed width on every flora: the property, not the drawing, scales.
    const other = draw('c2')
    expect(body(other).getAttribute('stroke-width')).toBe(
      body(small).getAttribute('stroke-width'),
    )
  })

  it('glows its own body colour, in the drawing rather than around it', () => {
    const svg = draw('c1')
    const { fill } = floraIdentity('c1', SEED)
    const aura = svg.querySelector('path[filter]')
    expect(aura.getAttribute('fill')).toBe(fill.hex)
    expect(aura.getAttribute('filter')).toMatch(/^url\(#/)
    // The colour is on the element too, so a stylesheet can light a held
    // plant in its own light without knowing which one it is.
    expect(svg.style.color).not.toBe('')
  })

  it('gives two flora on one page ids of their own', () => {
    const { container } = render(
      <>
        <Flora
          completionId="c1"
          worldSeed={SEED}
          base={BASE}
          idPrefix="first-"
        />
        <Flora
          completionId="c1"
          worldSeed={SEED}
          base={BASE}
          idPrefix="second-"
        />
      </>,
    )
    const ids = [...container.querySelectorAll('filter')].map((c) => c.id)
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
  })
})

describe('the room a find needs', () => {
  it('is the same answer the drawing gives itself', () => {
    const svg = draw('c2')
    const box = floraBox('c2', SEED, BASE)
    expect(svg.getAttribute('width')).toBe(String(box.width))
    expect(svg.getAttribute('height')).toBe(String(box.height))
  })
})

describe('the glow at rest', () => {
  it('carries the shared flora class, which the stylesheet lights', () => {
    const svg = draw('c1', { className: 'extra' })
    expect(svg.classList.contains('flora')).toBe(true)
    expect(svg.classList.contains('extra')).toBe(true)
  })
})
