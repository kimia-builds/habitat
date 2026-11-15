/*
 * LayeredFlora.jsx — a flora painted in the FRIENDS' way (candidate, 2026-11-15)
 * =============================================================================
 * ON THE WORKBENCH ONLY. The game still draws flora through Flora.jsx (a neon
 * outline over a faint fill). This is the proposal Kimia asked to see: the same
 * silhouettes, given a shaded body like the friends have, in a pastel.
 *
 * THE LAYERS ARE NOT DRAWN BY ANYONE — they are worked out from the outline.
 * Think of contour lines on a map: the shape is painted in its lightest tone,
 * then a run of bands is laid along its edge, each one reaching less far in
 * and each one darker, so the edge is darkest and the middle is lightest. A
 * thin tendril has no room for the lighter bands, so it stays dark; a fat lobe
 * gets a light core. That is the rule the friends' drawings already follow.
 *
 * HOW A BAND IS MADE. A band is the silhouette's own outline drawn as a thick
 * line and trimmed to the inside of the shape, so only the inner half shows.
 * Nothing is precomputed: any silhouette, present or future, gets its layers
 * from this one rule.
 *
 * THE COLOURS are the friends' own formula (friendPalettes.paletteForTone):
 * one tone in, a ramp of shades out. So a flora and a friend in neighbouring
 * colours are shaded by the same arithmetic.
 */

import { paletteForTone } from './friendPalettes.js'

// The shades a flora body runs through, darkest (the edge) to lightest (the
// core). The same greys the friends' traces are painted in.
// The core stops at a middle grey, not the lightest: a friend's body is mostly
// its middle tones, and a paler flora looked washed out beside one.
const BAND_GREYS = ['#333333', '#494949', '#606060', '#6b6b6b', '#767676']
const CORE_GREY = '#8c8c8c'

// How far in from the edge each band reaches, as a fraction of the drawing's
// height — the same on every species, so a band is one width across the family.
const BAND_DEPTHS = [0.014, 0.034, 0.06, 0.092, 0.13]

// The aura's blur, the same fraction of the drawing the friends and the
// current flora use.
const GLOW_FRACTION = 0.017

/**
 * `silhouette` one entry of floraSilhouettes.js / newFloraSilhouettes.js
 * `tone`       `{ hue, saturation, lift }` — the friends' way of naming a colour
 * `height`     how tall to draw it, in px
 * `idPrefix`   what makes this drawing's internal svg ids its own
 */
function LayeredFlora({ silhouette, tone, height, idPrefix }) {
  const { viewBox, d, transform } = silhouette
  const width = (height * viewBox.w) / viewBox.h
  const bands = paletteForTone(BAND_GREYS, tone)
  const [core] = paletteForTone([CORE_GREY], tone).ramp
  const id = `layered-${idPrefix}`
  return (
    <svg
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={viewBox.w * GLOW_FRACTION} />
        </filter>
        <clipPath id={`${id}-clip`}>
          <path d={d} transform={transform ?? undefined} />
        </clipPath>
      </defs>
      {/* the aura: the shape, blurred, in its own colour */}
      <path
        d={d}
        transform={transform ?? undefined}
        fill={bands.glow}
        opacity="0.8"
        filter={`url(#${id}-glow)`}
      />
      <g clipPath={`url(#${id}-clip)`}>
        {/* the lightest tone fills the whole body… */}
        <path d={d} transform={transform ?? undefined} fill={core} />
        {/* …then the bands, deepest first, so the darkest lands on the edge */}
        {BAND_DEPTHS.map((_, n) => {
          const i = BAND_DEPTHS.length - 1 - n
          return (
            <path
              key={i}
              d={d}
              transform={transform ?? undefined}
              fill="none"
              stroke={bands.ramp[i]}
              strokeWidth={2 * BAND_DEPTHS[i] * viewBox.h}
              strokeLinejoin="round"
            />
          )
        })}
      </g>
    </svg>
  )
}

export default LayeredFlora
