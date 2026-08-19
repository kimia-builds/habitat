// TEMPORARY (T5 prep, Kimia's call 2026-07-21) — the design-assets
// workbench: a shelf per image-asset family that is still WAITING TO BE
// JUDGED. This page and its door at the foot of the home screen are
// scaffolding — they leave (or become something deliberate) when the
// design pass lands.
//
// WHAT LIVES HERE, AND WHEN IT LEAVES (Kimia's rule, restated
// 2026-08-17). A shelf earns its place only while there is still a
// question open about the thing on it. Once she has judged an asset and
// it has moved into the game, its shelf goes: the page is a waiting
// room, not a gallery, and every settled asset left standing here is
// one more screenful between her and the thing she actually came to
// look at.
//
// Cleared out on 2026-08-17, when the friends' colours were settled:
// the friend eye, the ten archetype drawings, friend 10, the zala
// pilot, the individuals' colour shelves, the night sky, the rolling
// planet, the drop arrival and the cameo firework — every one of them
// either already plays in the game where it can be watched for real,
// or has had its answer given. What that leaves is the two families
// that have still never been anywhere but here.
//
// TEXTURES (T5.3, 2026-07-24) — the shared surface vocabulary
// (design-bible §8), drawn at swatch size so the grain reads: the seven
// filter surfaces (moss/bark glow green, pores/sponge glow green, the
// three rock surfaces NON-glowing per §3/§7) and the four procedural
// hair modes, grouped by §8 family. They dress no real asset yet.
//
// ABODE SKY (T5.3, design-bible §11a) — the static sky in all four
// palettes, so its one fixed composition can be compared colour to
// colour. It is still workbench-only; the real Abode screen has not
// been given a sky yet.
//
// FLORA SIZES (T5.3g, 2026-08-19) — the four silhouettes Kimia chose, at
// both size classes, standing on shared ground with the two friends the
// classes are pegged to: a small flora is as tall as a zala, a large one
// as tall as a chitu (floraCanon.js). Flat outlines only — the question
// this shelf asks is whether the sizes sit right when flora, friends and
// (one day) objects share the Abode, and a surface would only argue with
// it. It leaves when she has judged the sizes.
//
// FLORA FILLS (T5.3g, 2026-08-19) — the open question of the flora pass.
// The four colours were chosen off this shelf earlier today and their
// swatches have gone; what stands now is the six FILLS those colours make
// with the hair textures (floraFills.js). Squares, not silhouettes: the
// four species shapes are a later session, and Kimia's call was to settle
// the surface first on a shape that is asking nothing. The hair is
// clipped INSIDE each square — her rule that the hair forms the fill and
// never fringes out past the outline.

import { TEXTURES, TextureDefs, hairField, pumicePits } from './textures.jsx'
import { AbodeSky, ABODE_PALETTES } from './sky.jsx'
import { FLORA_FILLS } from './floraFills.js'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { FLORA_SIZE_CLASSES, floraHeight, floraWidth } from './floraCanon.js'
import { friendSize } from './friendCanon.js'
import { FRIEND04_VIEWBOX, FRIEND04_BASE } from './friend04.jsx'
import {
  FRIEND09_VIEWBOX,
  FRIEND09_OFFSET,
  FRIEND09_BASE,
} from './friend09.jsx'

// The §8 texture families, in the order the design bible lists them, so
// the workbench reads top-to-bottom like the catalogue.
const TEXTURE_FAMILIES = ['plant-like', 'fungal', 'rock', 'hair']

// One swatch is drawn at this many user units square. Big enough that a
// noise grain or a coil of hair reads on the dark page, small enough to
// line several up per row.
const SWATCH = 110

// Every filter surface clips its lighting to the shape it's attached to,
// so the swatch just needs an opaque ground the same near-black as the
// page — the rock surfaces (no glow) then read as relief on darkness,
// and the pores/sponge holes fall back to this same dark.
const SWATCH_GROUND = '#0b0f14'

function TextureSwatch({ tex }) {
  const clipId = `swatch-clip-${tex.id}`
  return (
    <li className="texture-swatch">
      <svg
        className="texture-swatch-art"
        viewBox={`0 0 ${SWATCH} ${SWATCH}`}
        role="img"
        aria-label={tex.name}
      >
        <defs>
          <clipPath id={clipId}>
            <rect width={SWATCH} height={SWATCH} rx="12" />
          </clipPath>
        </defs>
        <rect width={SWATCH} height={SWATCH} rx="12" fill={SWATCH_GROUND} />
        {tex.kind === 'procedural' ? (
          // The hair field draws its own hundreds of strands; clip them
          // to the rounded swatch. The mode is the id after "hair-".
          <g clipPath={`url(#${clipId})`}>
            {hairField({
              mode: tex.id.replace('hair-', ''),
              x: 0,
              y: 0,
              w: SWATCH,
              h: SWATCH,
              seed: 42,
            })}
          </g>
        ) : (
          <>
            <rect
              width={SWATCH}
              height={SWATCH}
              rx="12"
              fill={SWATCH_GROUND}
              filter={`url(#${tex.id})`}
            />
            {/* Pumice is filter grain + its vesicle holes (design-bible §8). */}
            {tex.id === 'tex-pumice' && (
              <g clipPath={`url(#${clipId})`}>
                {pumicePits({
                  x: 0,
                  y: 0,
                  w: SWATCH,
                  h: SWATCH,
                  seed: 3,
                  count: 60,
                })}
              </g>
            )}
          </>
        )}
      </svg>
      <span className="texture-swatch-name">{tex.name}</span>
    </li>
  )
}

// One flora fill: a square of hair, grown in that fill's colour and
// clipped to the square so no strand escapes it. The square throws a glow
// of the same colour, because a living thing's light IS its body colour
// (design-bible §3) — glow spread --glow-pop, the top of the everyday
// scale, since §7 gives the organics the top and which top step "full"
// finally means is an eyeball call on real art.
//
// Behind the strands sits a dark ground rather than the colour itself: a
// solid backing would make the hair a texture ON a colour, when the point
// is that the hair IS the fill.
function FloraFillSwatch({ fill }) {
  const clipId = `flora-fill-clip-${fill.id}`
  return (
    <li className="flora-fill-swatch">
      <svg
        className="texture-swatch-art"
        viewBox={`0 0 ${SWATCH} ${SWATCH}`}
        role="img"
        aria-label={fill.id}
        style={{ boxShadow: `0 0 var(--glow-pop) ${fill.colour.hex}` }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect width={SWATCH} height={SWATCH} rx="12" />
          </clipPath>
        </defs>
        <rect width={SWATCH} height={SWATCH} rx="12" fill={SWATCH_GROUND} />
        <g clipPath={`url(#${clipId})`}>
          {hairField({
            mode: fill.mode,
            x: 0,
            y: 0,
            w: SWATCH,
            h: SWATCH,
            seed: 42,
            colour: fill.colour.hex,
          })}
        </g>
      </svg>
      <span className="texture-swatch-name">{fill.id}</span>
    </li>
  )
}

/* ── THE FLORA SIZE SCENE (T5.3g, 2026-08-19) ─────────────────────────────
 * Kimia's four chosen silhouettes at both size classes, standing on a shared
 * ground with the two friends the classes are pegged to. Everything here is
 * drawn in CANON UNITS — the unitless scale friendCanon.js and floraCanon.js
 * both speak, whose 1 is the largest friend's width — so the scene cannot
 * quietly stop matching the canon: it has no sizes of its own to drift.
 *
 * Flat silhouettes, no fill and no glow: this shelf asks ONE question, whether
 * the two sizes sit right against the friends, and a surface would only argue
 * with it. The six fills are the shelf below.
 */

// One scene unit = the largest friend's width, so every figure asks the canon
// with a base of 1 and the numbers come back as pure proportions.
const SCENE_BASE = 1

// How far apart the figures stand, and how wide a row may get before the next
// figure starts a new one. Wrapping keeps the scene nearly square instead of a
// long thin strip, which on a phone would draw everything too small to judge.
const SCENE_GAP = 0.14
const SCENE_ROW_GAP = 0.16
const SCENE_ROW_MAX = 3.6

// Air around the whole scene, so no silhouette touches the edge.
const SCENE_PAD = 0.1

// The ruler friends: the small class stands as tall as the zala, the large as
// tall as the chitu. Each is drawn as its reconstructed outer silhouette — the
// sealed body shape behind its tonal bands — which is exactly the flat outline
// the flora are being compared against.
const RULER_FRIENDS = [
  {
    key: 'zala',
    viewBox: FRIEND04_VIEWBOX,
    offset: null,
    d: FRIEND04_BASE,
  },
  {
    key: 'chitu',
    viewBox: FRIEND09_VIEWBOX,
    offset: FRIEND09_OFFSET,
    d: FRIEND09_BASE,
  },
]

// A friend's canon number is its WIDTH; the drawing then gives the height.
function rulerFigure({ key, viewBox, offset, d }) {
  const width = friendSize(key, SCENE_BASE)
  return {
    id: `ruler-${key}`,
    label: `${key} — the ruler`,
    kind: 'ruler',
    viewBox,
    offset,
    d,
    width,
    height: (width * viewBox.h) / viewBox.w,
  }
}

// A flora's canon number is its HEIGHT; the drawing then gives the width.
function floraFigure(silhouette, sizeClass) {
  return {
    id: `flora-${sizeClass}-${silhouette.key}`,
    label: `${sizeClass} ${silhouette.label}`,
    kind: 'flora',
    viewBox: silhouette.viewBox,
    offset: silhouette.transform ?? null,
    d: silhouette.d,
    width: floraWidth(sizeClass, silhouette, SCENE_BASE),
    height: floraHeight(sizeClass, SCENE_BASE),
  }
}

// The cast of the scene, in the order they stand: the zala leading the four
// small flora, then the chitu leading the four large ones.
const SCENE_FIGURES = [
  rulerFigure(RULER_FRIENDS[0]),
  ...FLORA_SILHOUETTES.map((s) => floraFigure(s, FLORA_SIZE_CLASSES[0])),
  rulerFigure(RULER_FRIENDS[1]),
  ...FLORA_SILHOUETTES.map((s) => floraFigure(s, FLORA_SIZE_CLASSES[1])),
]

// Lay the figures out left to right, wrapping to a new row when the next one
// would overrun SCENE_ROW_MAX. Everything in a row shares one baseline, which
// is the whole point: they are standing on the same ground, as they would in
// the Abode.
function sceneLayout(figures) {
  const rows = [[]]
  let rowWidth = 0
  for (const figure of figures) {
    const row = rows[rows.length - 1]
    const added =
      row.length === 0 ? figure.width : rowWidth + SCENE_GAP + figure.width
    if (row.length > 0 && added > SCENE_ROW_MAX) {
      rows.push([figure])
      rowWidth = figure.width
    } else {
      row.push(figure)
      rowWidth = added
    }
  }

  const placed = []
  let top = SCENE_PAD
  let widest = 0
  for (const row of rows) {
    const rowHeight = Math.max(...row.map((f) => f.height))
    const baseline = top + rowHeight
    let x = SCENE_PAD
    for (const figure of row) {
      // y is the TOP of the figure; standing on the baseline means the taller
      // ones start higher up.
      placed.push({ ...figure, x, y: baseline - figure.height, baseline })
      x += figure.width + SCENE_GAP
    }
    widest = Math.max(widest, x - SCENE_GAP + SCENE_PAD)
    top = baseline + SCENE_ROW_GAP
  }

  return {
    figures: placed,
    grounds: [...new Set(placed.map((f) => f.baseline))],
    width: widest,
    height: top - SCENE_ROW_GAP + SCENE_PAD,
  }
}

const FLORA_SIZE_SCENE = sceneLayout(SCENE_FIGURES)

// The two silhouette colours. The flora read bright because they are the thing
// being judged; the ruler friends read dim because they are the measuring
// stick, not the subject.
const SCENE_INK = { flora: 'var(--text-title)', ruler: 'var(--text-faint)' }

function FloraSizeScene() {
  const { figures, grounds, width, height } = FLORA_SIZE_SCENE
  return (
    <svg
      className="flora-size-scene"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="flora sizes"
    >
      {grounds.map((y) => (
        <rect
          key={y}
          x="0"
          y={y}
          width={width}
          height="0.004"
          fill="var(--hairline-faint)"
        />
      ))}
      {figures.map((f) => (
        // A nested <svg> per figure: it carries the drawing's own viewBox, so
        // the trace is placed and scaled without a single hand-worked number.
        <svg
          key={f.id}
          x={f.x}
          y={f.y}
          width={f.width}
          height={f.height}
          viewBox={`0 0 ${f.viewBox.w} ${f.viewBox.h}`}
          role="img"
          aria-label={f.label}
        >
          <g transform={f.offset ?? undefined}>
            <path d={f.d} fill={SCENE_INK[f.kind]} />
          </g>
        </svg>
      ))}
    </svg>
  )
}

function DesignPage({ onBack }) {
  return (
    <section className="stub-page design-page">
      <h2>design assets</h2>

      {/* The shared texture library (T5.3, design-bible §8). One <defs>
          for the whole page, then a shelf of live swatches per family. */}
      <svg width="0" height="0" aria-hidden="true" className="texture-defs">
        <TextureDefs />
      </svg>
      {TEXTURE_FAMILIES.map((family) => (
        <section
          key={family}
          className="design-family"
          aria-label={`textures — ${family}`}
        >
          <h3>textures — {family}</h3>
          <ul className="texture-swatches">
            {TEXTURES.filter((tex) => tex.family === family).map((tex) => (
              <TextureSwatch key={tex.id} tex={tex} />
            ))}
          </ul>
        </section>
      ))}

      {/* The abode sky (T5.3, design-bible §11a), in all four palettes.
          It lands here first for the eyeball pass before it dresses the
          real Abode screen. */}
      <section className="design-family" aria-label="abode sky">
        <h3>abode sky</h3>
        <ul className="sky-swatches">
          {ABODE_PALETTES.map((palette) => (
            <li key={palette} className="sky-swatch abode-sky-swatch">
              <AbodeSky palette={palette} />
              <span className="sky-swatch-name">{palette}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The flora sizes (T5.3g, design-bible §9a) — the four silhouettes at
          both size classes, standing with the two friends they are pegged to
          so the proportions can be judged the way they will be seen. */}
      <section className="design-family" aria-label="flora sizes">
        <h3>flora sizes</h3>
        <p className="design-note">
          the dim shapes are the ruler: a zala leading the small flora, a chitu
          leading the large ones. every flora stands as tall as the friend in
          front of it.
        </p>
        <FloraSizeScene />
      </section>

      {/* The six flora fills (T5.3g, design-bible §9a) — hair textures in
          the four settled colours, waiting on Kimia's eye. */}
      <section className="design-family" aria-label="flora fills">
        <h3>flora fills</h3>
        <ul className="texture-swatches">
          {FLORA_FILLS.map((fill) => (
            <FloraFillSwatch key={fill.id} fill={fill} />
          ))}
        </ul>
      </section>

      <button className="pebble" onClick={onBack}>
        ← back to the habits
      </button>
    </section>
  )
}

export default DesignPage
