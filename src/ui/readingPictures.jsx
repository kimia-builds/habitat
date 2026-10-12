// readingPictures.jsx — the line drawings that illustrate reading material
// (T5.3o, Kimia's call 2026-10-12). Each text slot in readingTexts.js names
// its picture in square brackets ('[a plip]'); this file turns those names
// into real drawings, and a name it does not know yet stays a bracket.
//
// THE STYLE IS THE MARKET CHARMS' (T5.3j): one pen weight (6px), the same
// gentle wobble filter, no fill, no glow, and only the six charm colours
// (SYMBOL_COLORS). Every picture is drawn in a 130px frame and shown at
// exactly that size, so the pen is the same on every page.
//
// WHERE THE DRAWINGS COME FROM
//   - the six charms: CHARM_SHAPES, exactly the market's (anchor included)
//   - the eight rail symbols: IconRail.jsx's glyphs, in the colour each
//     one already brightens to on the rail
//   - unif, toom, gubl, the pataya blossoms and the gubl bauble: Kimia's
//     traced flora and keepsake shapes, outlined
//   - plip and baluhm: outlines of their traced bodies, eyes as solid dots
//   - star, crystal, cliffs with wind, mud-pool: drawn for this
// A flora's number in world-building.md's table is its "shape"; shapes 1, 2,
// 3 and 6 are the original four, the rest run n01.. in order.

import { CHARM_SHAPES, OBJECT_SHAPE_OVERRIDES } from './CharmSymbol.jsx'
import { SYMBOL_COLORS } from './symbols.js'
import { PICTURE_IDS, pictureName } from './readingPictureIds.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { NEW_FLORA_SILHOUETTES } from './newFloraSilhouettes.js'
import { KEEPSAKE_SHAPES } from './keepsakeShapes.js'
import {
  FRIEND01_LAYERS,
  FRIEND01_VIEWBOX,
  FRIEND01_EYES,
} from './friend01.jsx'
import {
  FRIEND02_LAYERS,
  FRIEND02_VIEWBOX,
  FRIEND02_EYES,
} from './friend02.jsx'

const FRAME = 130 // px — the frame every picture is drawn in
const PEN = 6 // px — the same pen as the market charms
const GRID_SCALE = FRAME / 24 // a 24-unit drawing filling the frame

// The six charm colours, by their charm number.
const GOLD = SYMBOL_COLORS[1]
const CORAL = SYMBOL_COLORS[2]
const PINK = SYMBOL_COLORS[3]
const LAVENDER = SYMBOL_COLORS[4]
const SKY = SYMBOL_COLORS[5]
const TEAL = SYMBOL_COLORS[6]

const WOBBLE_ID = 'reading-picture-wobble'

// Same recipe as the market's charm-wobble (Curiosity.jsx).
function WobbleFilter() {
  return (
    <filter id={WOBBLE_ID} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.02"
        numOctaves="2"
        seed="7"
        result="drift"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="drift"
        scale="5"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  )
}

// A drawing made on a 24-unit grid, like the charms and rail glyphs. The
// pen is divided by the same factor so it still lands at PEN px.
function Grid({ children }) {
  return (
    <g transform={`scale(${GRID_SCALE})`} strokeWidth={PEN / GRID_SCALE}>
      {children}
    </g>
  )
}

const floraSilhouette = (key) =>
  [...FLORA_SILHOUETTES, ...NEW_FLORA_SILHOUETTES].find((f) => f.key === key)
const keepsake = (flora) => KEEPSAKE_SHAPES.find((k) => k.flora === flora)

// A traced outline fitted inside a box. The pen does not scale with the
// tracing (non-scaling-stroke), so it stays PEN px.
function Traced({ shape, x, y, box }) {
  const { w, h } = shape.viewBox
  const k = Math.min(box.w / w, box.h / h)
  return (
    <svg
      x={x ?? (FRAME - w * k) / 2}
      y={y ?? (FRAME - h * k) / 2}
      width={w * k}
      height={h * k}
      viewBox={`0 0 ${w} ${h}`}
      overflow="visible"
    >
      <path
        d={shape.d}
        transform={shape.transform}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// A traced friend: the darkest layer is the whole figure, so its outline is
// the body; the eyes become solid dots.
function Being({ layers, viewBox, eyes, x, y, size }) {
  const k = Math.min(size / viewBox.w, size / viewBox.h)
  return (
    <svg
      x={x}
      y={y}
      width={viewBox.w * k}
      height={viewBox.h * k}
      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
      overflow="visible"
    >
      <path d={layers[0]} vectorEffect="non-scaling-stroke" />
      {eyes.map((eye, i) => (
        <circle
          key={i}
          cx={eye.cx}
          cy={eye.cy}
          r={Math.max(eye.r, viewBox.w * 0.03)}
          fill="currentColor"
          stroke="none"
        />
      ))}
    </svg>
  )
}

const plip = (x, y, size) => (
  <Being
    layers={FRIEND01_LAYERS}
    viewBox={FRIEND01_VIEWBOX}
    eyes={FRIEND01_EYES}
    x={x}
    y={y}
    size={size}
  />
)

const dot = (cx, cy) => <circle cx={cx} cy={cy} r=".35" fill="currentColor" />

// ── The drawings ───────────────────────────────────────────────────────────

// charm 1..6 — the market's own drawings.
const charm = (n) => ({
  colour: SYMBOL_COLORS[n],
  draw: () => <Grid>{OBJECT_SHAPE_OVERRIDES[n] ?? CHARM_SHAPES[n]}</Grid>,
})

// The eight rail symbols, in the rail's own order (add, pencil, graph, map,
// abode, community, library, market), each in its hover colour.
const RAIL = [
  [
    SKY,
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>,
  ],
  [GOLD, <path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1z" />],
  [
    TEAL,
    <>
      <path d="M4 4v16h16" />
      <path d="M7 15l4-5 3 3 4-6" />
    </>,
  ],
  [
    PINK,
    <>
      <circle cx="12" cy="12" r="5" />
      <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)" />
    </>,
  ],
  [
    GOLD,
    <>
      <line x1="4" y1="17" x2="20" y2="17" />
      <path d="M9 17 a3 3 0 0 1 6 0" />
    </>,
  ],
  [
    CORAL,
    <>
      <circle cx="9" cy="12" r="4.5" />
      <circle cx="15" cy="12" r="4.5" />
    </>,
  ],
  [
    LAVENDER,
    <>
      <rect x="6.5" y="4.5" width="11" height="15" rx="1" />
      <line x1="12" y1="4.5" x2="12" y2="19.5" />
    </>,
  ],
  [
    TEAL,
    <>
      <path d="M4 9 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0 a2 2 0 0 0 4 0" />
      <line x1="5" y1="16" x2="19" y2="16" />
    </>,
  ],
]

const DRAWINGS = {
  star: {
    colour: GOLD,
    // nine points
    draw: () => (
      <Grid>
        <path d="M12.00 2.30L14.46 6.03L18.75 4.76L18.24 9.20L22.34 10.98L19.09 14.05L21.09 18.05L16.63 18.32L15.59 22.67L12.00 20.00L8.41 22.67L7.37 18.32L2.91 18.05L4.91 14.05L1.66 10.98L5.76 9.20L5.25 4.76L9.54 6.03z" />
      </Grid>
    ),
  },
  crystal: {
    colour: TEAL,
    // a cluster: tall one in the middle, a smaller one each side, a rock
    draw: () => (
      <Grid>
        <path d="M2 18.5V10l2.5-4 2.5 4v8.5" />
        <path d="M8.5 18.5V5L12 1.5 15.5 5v13.5" />
        <path d="M12 1.5v9" />
        <path d="M17 18.5V12l2.5-3.5L22 12v6.5" />
        <path d="M1 21.5h22" />
        <path d="M10 21.5l1.5-3h3l1.5 3" />
      </Grid>
    ),
  },
  cliffs: {
    colour: PINK,
    // three tall rock pillars with two gusts coiling across them
    draw: () => (
      <Grid>
        <path d="M3 22V10l2-3.5L7 9.5V22" />
        <path d="M10.5 22V4l2-3 2 3.5V22" />
        <path d="M18 22V11l2-3 2 3V22" />
        <path d="M1 19c5 3.5 12 2 17-2c3-2.4 2.5-5.5 0-5.2c-1.7.3-1.5 2.5 0 2.8" />
        <path d="M2 11c4 2 9 1 13-2.5c2.5-2 2-4.5-.2-4.3" />
      </Grid>
    ),
  },
  mudpool: {
    colour: TEAL,
    draw: () => (
      <Grid>
        <path d="M2.5 16c0-3 4-5 9.5-5s9.5 2 9.5 5-4 5-9.5 5-9.5-2-9.5-5z" />
        <circle cx="8" cy="15.5" r="1.4" />
        <circle cx="13" cy="17.3" r="1.7" />
        <circle cx="17" cy="15" r="1.1" />
        <circle cx="11" cy="13.6" r=".8" />
        <circle cx="9" cy="7.5" r="1.8" />
        <circle cx="14.5" cy="5" r="1.3" />
        <circle cx="16" cy="8.5" r=".8" />
        <circle cx="12" cy="3.5" r=".7" />
        {dot(6, 18)}
        {dot(19, 17.5)}
        {dot(15.5, 19)}
        {dot(11.5, 9.5)}
        {dot(18, 5.5)}
        {dot(7, 4)}
      </Grid>
    ),
  },
  // shape 14
  unif: {
    colour: LAVENDER,
    draw: () => (
      <Traced shape={floraSilhouette('n10')} box={{ w: 118, h: 118 }} />
    ),
  },
  // shape 3
  toom: {
    colour: PINK,
    draw: () => (
      <Traced shape={floraSilhouette('3')} box={{ w: 118, h: 118 }} />
    ),
  },
  // pataya's keepsake: the seasonal blossoms
  blossoms: {
    colour: CORAL,
    draw: () => <Traced shape={keepsake('pataya')} box={{ w: 118, h: 118 }} />,
  },
  // shape 13, with its keepsake (the bauble) at the foot
  gubl: {
    colour: LAVENDER,
    draw: () => {
      const bauble = keepsake('gubl')
      const k = Math.min(40 / bauble.viewBox.w, 40 / bauble.viewBox.h)
      return (
        <>
          <Traced
            shape={floraSilhouette('n09')}
            x={4}
            y={10}
            box={{ w: 92, h: 92 }}
          />
          <Traced
            shape={bauble}
            x={128 - bauble.viewBox.w * k}
            y={128 - bauble.viewBox.h * k}
            box={{ w: 40, h: 40 }}
          />
        </>
      )
    },
  },
  plip: { colour: SKY, draw: () => plip(22, 22, 86) },
  plips: {
    colour: SKY,
    draw: () => (
      <>
        {plip(4, 40, 62)}
        {plip(60, 6, 52)}
        {plip(66, 66, 50)}
      </>
    ),
  },
  baluhm: {
    colour: CORAL,
    draw: () => (
      <Being
        layers={FRIEND02_LAYERS}
        viewBox={FRIEND02_VIEWBOX}
        eyes={FRIEND02_EYES}
        x={10}
        y={12}
        size={110}
      />
    ),
  },
}

// Drawings by id; readingPictureIds.js says which description gets which.
const BY_ID = { ...DRAWINGS }
for (let n = 1; n <= 6; n += 1) BY_ID[`charm-${n}`] = charm(n)
RAIL.forEach(([colour, glyph], i) => {
  BY_ID[`rail-${i + 1}`] = { colour, draw: () => <Grid>{glyph}</Grid> }
})

export { pictureName }

// The drawing for a written description, or null while it has none.
export function readingPictureFor(description) {
  return BY_ID[PICTURE_IDS[pictureName(description)]] ?? null
}

function ReadingPicture({ description, drawing }) {
  return (
    <svg
      className="spread-drawing"
      viewBox={`0 0 ${FRAME} ${FRAME}`}
      width={FRAME}
      height={FRAME}
      fill="none"
      stroke="currentColor"
      strokeWidth={PEN}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={pictureName(description)}
      style={{ color: drawing.colour, overflow: 'visible' }}
    >
      <defs>
        <WobbleFilter />
      </defs>
      <g filter={`url(#${WOBBLE_ID})`}>{drawing.draw()}</g>
    </svg>
  )
}

export default ReadingPicture
