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

/*
 * THE SAME FUR ON BOTH SIZES (Kimia, 2026-08-21). A small flora used to wear
 * the large one's field shrunk to fit — every hair 2.75× finer, and the same
 * two thousand of them. Now the fur is one fur: hairs the same size on screen
 * whichever class wears them, and the small plant simply wears fewer.
 */
describe('the fur a flora wears', () => {
  // The comparison only means something between two finds dealt the SAME shape
  // and fill, since a different fill is a different fur. The deal is
  // deterministic, so this walks it until it turns up such a pair in both
  // classes rather than hard-coding two ids that a re-tuned deal would strand.
  function matchedPair() {
    const seen = new Map()
    for (let i = 0; i < 400; i++) {
      const id = `pair${i}`
      const { silhouette, sizeClass, fill } = floraIdentity(id, SEED)
      const key = `${silhouette.key}|${fill.id}`
      const other = seen.get(key)
      if (other && other.sizeClass !== sizeClass) {
        return sizeClass === 'small'
          ? { small: id, large: other.id }
          : { small: other.id, large: id }
      }
      if (!other) seen.set(key, { id, sizeClass })
    }
    throw new Error('the deal never dealt one shape-and-fill in both sizes')
  }

  // How big a single hair lands ON SCREEN: the scale the drawing is shrunk by,
  // times the scale its hair field is dropped in at.
  function hairSizeOnScreen(svg) {
    const drawingHeight = Number(svg.getAttribute('viewBox').split(' ')[3])
    const shrink = Number(svg.getAttribute('height')) / drawingHeight
    const field = svg.querySelector('g[clip-path] > g')
    const scale = Number(
      /scale\(([^)]+)\)/.exec(field.getAttribute('transform'))[1],
    )
    return shrink * scale
  }

  it('is the same size on screen on a small flora as on a large one', () => {
    const { small, large } = matchedPair()
    const onSmall = hairSizeOnScreen(draw(small))
    const onLarge = hairSizeOnScreen(draw(large))
    expect(onSmall).toBeCloseTo(onLarge, 10)
  })

  it('takes far fewer strands on the small one, which is the point', () => {
    const { small, large } = matchedPair()
    const strands = (id) =>
      draw(id).querySelectorAll('g[clip-path] path').length
    const onSmall = strands(small)
    const onLarge = strands(large)
    // Measured at a third or less when this went in; the assertion is loose
    // enough to survive a re-tuned mode and tight enough to fail loudly if the
    // small class ever goes back to wearing a full-size field.
    expect(onSmall).toBeLessThan(onLarge * 0.6)
    // …and it is still a field, not a handful of hairs.
    expect(onSmall).toBeGreaterThan(100)
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
