/*
 * PaintedFlora.jsx — a flora drawn exactly as a friend is (candidate, 2026-11-15)
 * =============================================================================
 * ON THE WORKBENCH ONLY. Takes a silhouette and its seven painted layers
 * (paintedFlora.js) and assembles them the way every friendNN.jsx does: the
 * aura (the shape, blurred, in its own colour), the silhouette in the darkest
 * tone, then the layers on top, each in the next lighter tone. The colours
 * come from the friends' own formula, so the two families are shaded by the
 * same arithmetic. The layers are trimmed to the silhouette, so the edge is
 * always Kimia's own outline.
 */

import { paletteForTone } from './friendPalettes.js'

// Darkest first: the silhouette's own tone, then one per painted layer.
const BASE_GREY = '#333333'
const LAYER_GREYS = [
  '#494949',
  '#606060',
  '#767676',
  '#8c8c8c',
  '#a3a3a3',
  '#b9b9b9',
  '#d0d0d0',
]
const GLOW_FRACTION = 0.017

/**
 * `silhouette` one entry of floraSilhouettes.js / newFloraSilhouettes.js
 * `layers`     its seven painted layers, darkest first
 * `tone`       `{ hue, saturation, lift }` — the friends' way of naming a colour
 * `height`     how tall to draw it, in px
 * `idPrefix`   what makes this drawing's internal svg ids its own
 */
function PaintedFlora({ silhouette, layers, tone, height, idPrefix }) {
  const { viewBox, d, transform } = silhouette
  const palette = paletteForTone(LAYER_GREYS, tone, BASE_GREY)
  const id = `painted-${idPrefix}`
  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      width={(height * viewBox.w) / viewBox.h}
      height={height}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={viewBox.w * GLOW_FRACTION} />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      {/* the trace's own transform, kept rather than folded into her path */}
      <g transform={transform ?? undefined}>
        <path
          d={d}
          fill={palette.glow}
          opacity="0.8"
          filter={`url(#${id}-glow)`}
        />
        <path d={d} fill={palette.base} />
        <g clipPath={`url(#${id}-clip)`}>
          {layers.map((layer, i) => (
            <path key={i} d={layer} fillRule="evenodd" fill={palette.ramp[i]} />
          ))}
        </g>
      </g>
    </svg>
  )
}

export default PaintedFlora
