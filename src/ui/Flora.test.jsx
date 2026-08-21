import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import Flora, { floraBox } from './Flora.jsx'
import { floraHeight, floraWidth } from './floraCanon.js'
import { floraIdentity } from './floraDeal.js'

afterEach(cleanup)

// Drawing a flora grows a couple of thousand strands, so this file renders as
// few as it can get away with and asks several questions of each.
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

  it('grows its fill inside the outline and nowhere else', () => {
    const svg = draw('c1')
    // The hair sits in one group, clipped to a path that is the silhouette.
    const field = svg.querySelector('g[clip-path]')
    expect(field).not.toBeNull()
    const clipId = field.getAttribute('clip-path').slice(5, -1)
    const clip = [...svg.querySelectorAll('clipPath')].find(
      (node) => node.id === clipId,
    )
    expect(clip).toBeDefined()
    const { silhouette } = floraIdentity('c1', SEED)
    expect(clip.querySelector('path').getAttribute('d')).toBe(silhouette.d)
    // And there is a real field in there, not an empty group.
    expect(field.querySelectorAll('path').length).toBeGreaterThan(100)
  })

  it('glows its own body colour, in the drawing rather than around it', () => {
    const svg = draw('c1')
    const { fill } = floraIdentity('c1', SEED)
    const aura = svg.querySelector('path[filter]')
    expect(aura.getAttribute('fill')).toBe(fill.colour.hex)
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
    const ids = [...container.querySelectorAll('clipPath')].map((c) => c.id)
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
