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
// FLORA (T5.3g, 2026-08-19) — the four silhouettes Kimia chose, at their
// large canon size, wearing all six fills. The sizes themselves are
// SETTLED and this shelf no longer shows them being judged: it stood for
// one session with both classes and two ruler friends beside them, she
// halved the small class on sight and locked both, and the comparison
// came down the same day (floraCanon.js). What is still open is the
// fills on the real shapes, which is what stands here now.
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
import { floraHeight, floraWidth } from './floraCanon.js'

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

/* ── THE FLORA, DRESSED (T5.3g, 2026-08-19) ───────────────────────────────
 * The four silhouettes at their LARGE canon size, each wearing all six fills:
 * 4 × 6 = 24 of the 48 collectible flora, the other 24 being these same
 * drawings at the small size.
 *
 * The recipe, from design-bible §9a and §3:
 *   • the shape is Kimia's trace, never redrawn;
 *   • the hair FORMS the fill and is clipped to the outline, so no strand
 *     fringes out past it;
 *   • a dark ground sits behind the strands, because a solid backing would
 *     make the hair a texture ON a colour when the point is that the hair IS
 *     the fill (the same reasoning as the fill squares above) — but it is
 *     PULLED BACK FROM THE EDGE, see the inset rule below;
 *   • the glow is the silhouette itself, blurred and painted the fill's own
 *     colour — a living thing's light IS its body colour, so it is drawn in
 *     SVG behind the shape rather than as a box-shadow around a rectangle.
 *
 * Nothing here types a size in: the box comes from floraCanon.js at one shelf
 * base, so the whole shelf follows the canon by construction.
 */

// How much room the largest FRIEND would get on this shelf. Every flora size
// is a fraction of it (floraCanon.js), so this single number sets the shelf.
const FLORA_SHELF_BASE_REM = 11.5

// The hair modes were tuned on a 110-unit swatch, and strand length is fixed
// in drawing units rather than relative to the box. So the hair is generated
// in its own space that is always 110 units TALL, then scaled onto the
// drawing — which makes a strand the same size on screen on all four species,
// however big each one's own trace canvas happens to be.
const HAIR_UNIT = 110

// The blur that makes the aura, as a fraction of the drawing's width — the
// same fraction the friends use (friend04.jsx: 6.6 on a 391-wide canvas).
const GLOW_FRACTION = 0.017

/* THE EDGE RULE (Kimia, 2026-08-19). The dark ground is what the hair grows
 * out of, and it belongs in the MIDDLE of a flora, not at its rim: dark
 * reaching the outline reads as a drawn black edge, which is the one thing
 * these silhouettes should never have. So the ground is not the shape — it is
 * the shape SHRUNK, and then softened, so it fades out before the outline and
 * the last stretch of every edge is made of hair alone.
 *
 * Two numbers do it, both fractions of the drawing's own height so the rule
 * lands the same on all four species whatever their trace canvas measures:
 *
 *   INSET — how far the ground is pulled in from the outline. This is the
 *     "minimise the dark around the edges" number: raise it and the dark
 *     retreats further, at the cost of the flora reading thinner and wispier.
 *   FADE — how softly the pulled-back edge dissolves, so there is no second
 *     hard line where the ground stops. Roughly half the inset keeps the
 *     falloff inside the ground the inset just made.
 *
 * A happy side effect on the thin shapes: a tendril arm narrower than twice
 * the inset has no middle left, so it loses its ground entirely and is drawn
 * in pure hair — which is right, since a thin arm is all edge.
 */
const GROUND_INSET = 0.022
const GROUND_FADE = 0.011

// The hair for one shape: enough tiles of roughly-swatch-sized field to cover
// a wide drawing at the density the mode was tuned for, each tile with its own
// seed so the joins do not repeat.
function shapeHair(silhouette, fill) {
  const aspect = silhouette.viewBox.w / silhouette.viewBox.h
  const fieldWidth = HAIR_UNIT * aspect
  const tiles = Math.max(1, Math.round(aspect))
  return (
    <g transform={`scale(${silhouette.viewBox.h / HAIR_UNIT})`}>
      {Array.from({ length: tiles }, (_, i) =>
        hairField({
          mode: fill.mode,
          x: (i * fieldWidth) / tiles,
          y: 0,
          w: fieldWidth / tiles,
          h: HAIR_UNIT,
          seed: 42 + i,
          colour: fill.colour.hex,
        }),
      )}
    </g>
  )
}

// One dressed flora: shape × fill, at the large canon size.
function FloraFigure({ silhouette, fill }) {
  const id = `flora-${silhouette.key}-${fill.id}`
  const { viewBox, d, transform } = silhouette
  const shape = <path d={d} transform={transform ?? undefined} />
  return (
    <li className="flora-figure">
      <svg
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        width={`${floraWidth('large', silhouette, FLORA_SHELF_BASE_REM)}rem`}
        height={`${floraHeight('large', FLORA_SHELF_BASE_REM)}rem`}
        role="img"
        aria-label={`${silhouette.label} — ${fill.id}`}
      >
        <defs>
          <clipPath id={`${id}-clip`}>{shape}</clipPath>
          <filter
            id={`${id}-glow`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation={viewBox.w * GLOW_FRACTION} />
          </filter>
          {/* The edge rule: eat the outline in, then soften what is left. */}
          <filter
            id={`${id}-ground`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feMorphology operator="erode" radius={viewBox.h * GROUND_INSET} />
            <feGaussianBlur stdDeviation={viewBox.h * GROUND_FADE} />
          </filter>
        </defs>
        <path
          d={d}
          transform={transform ?? undefined}
          fill={fill.colour.hex}
          opacity="0.8"
          filter={`url(#${id}-glow)`}
        />
        {/* Clipped as well as inset: the softening blur must never push the
            ground back out past the outline it was just pulled inside. */}
        <g clipPath={`url(#${id}-clip)`}>
          <path
            d={d}
            transform={transform ?? undefined}
            fill={SWATCH_GROUND}
            filter={`url(#${id}-ground)`}
          />
          {shapeHair(silhouette, fill)}
        </g>
      </svg>
      <span className="texture-swatch-name">{fill.id}</span>
    </li>
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

      {/* The dressed flora (T5.3g, design-bible §9a) — the four shapes at
          their large canon size wearing all six fills, which is half the
          collectible catalogue and the last open question of the flora pass. */}
      <section className="design-family" aria-label="flora">
        <h3>flora</h3>
        <p className="design-note">
          the four shapes at their large size, each in all six fills. the small
          size is the same drawings at 2.7 times less height.
        </p>
        {FLORA_SILHOUETTES.map((silhouette) => (
          <ul key={silhouette.key} className="flora-figures">
            {FLORA_FILLS.map((fill) => (
              <FloraFigure key={fill.id} silhouette={silhouette} fill={fill} />
            ))}
          </ul>
        ))}
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
