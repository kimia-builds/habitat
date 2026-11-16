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
// or has had its answer given.
//
// Cleared out again on 2026-08-19, when Kimia closed the flora design:
// the four hair textures, the six flora fills and the dressed flora
// themselves all came down together. The hair went with them because it
// existed here to be judged as the flora's surface and has now been
// judged as exactly that — it is still in the library (textures.jsx,
// design-bible §8) and still what every flora is made of; it simply has
// no question left standing over it. The flora's own record lives in
// floraSilhouettes.js, floraColours.js, floraFills.js and floraCanon.js,
// which outlive this page, and the drawing recipe is written up in
// history.md for the task that puts flora on the real screens.
//
// TEXTURES (T5.3, 2026-07-24) — the shared surface vocabulary
// (design-bible §8), drawn at swatch size so the grain reads. What
// stands now is the seven FILTER surfaces (moss/bark glow green,
// pores/sponge glow green, the three rock surfaces NON-glowing per
// §3/§7), grouped by §8 family. They dress no real asset yet, which is
// the question still open on them.
//
// ABODE SKY (T5.3, design-bible §11a) — the static sky in all four
// palettes, so its one fixed composition can be compared colour to
// colour. It is still workbench-only; the real Abode screen has not
// been given a sky yet.
//
// CURIOSITIES (T5.3j, opened 2026-09-01) — the market objects, drawn
// for real at last (objectCanon.js, Curiosity.jsx) and standing here to
// be judged before they replace ObjectGlyph.jsx's placeholder line
// drawings on the stall and in the Abode. They are shown AT ABODE SIZE:
// Kimia gave their sizes in pixels read off the Abode, so the shelf
// shows exactly what that ground will show, side by side and in the
// friends' and flora's own scale.

import Curiosity, { CuriosityDefs, curiosityCanonKey } from './Curiosity.jsx'
import { OBJECT_CANON, objectSize } from './objectCanon.js'
import { baseWhereSmallestIs } from './friendCanon.js'
import { TEXTURES, TextureDefs, pumicePits } from './textures.jsx'
import { CLEANED_FRIENDS } from './cleanedFriends.js'
import { Eye, eyeToneFor } from './eye.jsx'
import { FLORA_SILHOUETTES } from './floraSilhouettes.js'
import { floraHeight } from './floraCanon.js'
import { friendSize } from './friendCanon.js'
import { FRIEND_COLOURS } from './friendColours.js'
import { paletteForTone } from './friendPalettes.js'
import { friendArt } from './tracedFriends.js'
import PaintedFlora from './PaintedFlora.jsx'
import { PAINTED_FLORA } from './paintedFlora.js'

// The §8 texture families still waiting to be judged, in the order the
// design bible lists them, so the workbench reads like the catalogue.
// HAIR is deliberately not here (2026-08-19): it was on the workbench to be
// judged as the flora's surface, Kimia judged it there, and the shelf left
// with the flora. The textures themselves are untouched in the library.
const TEXTURE_FAMILIES = ['plant-like', 'fungal', 'rock']

// One swatch is drawn at this many user units square. Big enough that a
// noise grain or a coil of hair reads on the dark page, small enough to
// line several up per row.
const SWATCH = 110

// Every filter surface clips its lighting to the shape it's attached to,
// so the swatch just needs an opaque ground the same near-black as the
// page — the rock surfaces (no glow) then read as relief on darkness,
// and the pores/sponge holes fall back to this same dark.
const SWATCH_GROUND = '#0b0f14'

// One texture swatch. Every surface left on this page is a FILTER surface —
// the procedural hair went with the flora (see the header) — so a swatch is a
// dark tile wearing that filter, plus pumice's own vesicle holes.
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
      </svg>
      <span className="texture-swatch-name">{tex.name}</span>
    </li>
  )
}

/*
 * THE CURIOSITY SHELF'S BASE. Not a size of its own: it is the ABODE's base,
 * copied, so an object on this shelf is the size it will be on that ground —
 * which is the only question worth asking about a number Kimia read off the
 * Abode in the first place. The same reasoning as AbodePage.jsx's SCENE_BASE,
 * and the same 24px plip.
 *
 * The consequence, and it is deliberate: the shelf is far wider than the
 * page, so it scrolls sideways. Design-bible §9c's rule is that the ratios
 * never bend — a shelf that squared these into matching thumbnails would
 * teach the eye the opposite of what the canon says, which is exactly the
 * mistake the flat-width friend shelves made on 2026-08-17.
 */
const CURIO_BASE = baseWhereSmallestIs(24)

// Every object drawn so far, in the order Kimia named the families and
// smallest-first inside each one, so a family's two sizes stand side by side
// and can be read as one shape at two sizes. Curiosity.jsx knows which of the
// canon's entries it has a recipe for, and only those are shown.
const CURIOSITIES = [
  'column-thin',
  'column-tall',
  'oval-small',
  'oval-large',
  'smoke',
  'stone-1',
  'stone-2',
  'stone-3',
  'charm-key',
  'charm-cherry',
  'charm-shell',
  'charm-anchor',
  'charm-shield',
  'charm-crown',
]

// The shelf stands its objects on one ground line, so the tall column and the
// thin one are read against each other rather than each floating in its own
// box. The row is as tall as the tallest thing on it.
function CuriosityShelf() {
  // Via the recipe's canon key, because the three stones are three objects
  // sharing one entry in the sizing table (Curiosity.jsx).
  const sizes = CURIOSITIES.map((key) =>
    objectSize(curiosityCanonKey(key), CURIO_BASE),
  )
  const tallest = Math.max(...sizes.map(({ h }) => h))
  return (
    <section className="design-family" aria-label="curiosities">
      <h3>curiosities</h3>
      <CuriosityDefs keys={CURIOSITIES} />
      <div className="curio-shelf-window">
        <ul className="curio-shelf" style={{ height: `${tallest}px` }}>
          {CURIOSITIES.map((key, i) => (
            <li key={key} className="curio-item">
              <Curiosity objectKey={key} base={CURIO_BASE} unit="px" />
              <span className="curio-name">
                {key} · {Math.round(sizes[i].w)}×{Math.round(sizes[i].h)}px ·{' '}
                {OBJECT_CANON[curiosityCanonKey(key)].h.toFixed(3)} tall
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/*
 * ONE RECIPE FOR FRIENDS AND FLORA (opened 2026-11-15). Kimia's question: the
 * two families she likes best are each consistent inside themselves and not
 * with each other. This shelf shows the proposed answer beside what the game
 * draws today, so the two can be judged as a pair:
 *
 *   - the krupengk and the zala CLEANED (cleanedFriends.js) — no specks, no
 *     holes under the eyes, glowing their own colour;
 *   - two flora given a shaded pastel body by the friends' own colour rule,
 *     with an interior painted in grey inside her outline and then sliced
 *     into tones the way the friends' drawings were (PaintedFlora.jsx).
 *
 * WHERE IT STANDS (Kimia, 2026-11-15, design-bible §9d): she chose the
 * AI-painted flora ("the top family on the workbench looks great") and the
 * SMALL flora size only. The friends' glow here is the flora's (the aura
 * inside the drawing, without the stylesheet's extra halo). The chitu stands
 * beside them for scale, with its loose tendrils joined back on. What is
 * still waiting to be judged on this shelf is the hamdi bulo, which stands
 * there twice: as the game draws it, then with its specks removed.
 *
 * Everything stands at its canonical size on one base (design-bible §9c: the
 * canon holds on the workbench too). Nothing here is in the game yet.
 */
const PAIR_BASE = 300 // px — how much room the largest friend would get here

// Colours 4 and 7 of the ten friend colours: baby pink and violet.
// The chitu wears colour 1, gold.
const PAIR_FRIENDS = [
  { key: 'krupengk', colour: FRIEND_COLOURS[3], cleaned: true },
  { key: 'zala', colour: FRIEND_COLOURS[6], cleaned: true },
  { key: 'chitu', colour: FRIEND_COLOURS[0], cleaned: true },
  // The hamdi bulo twice (2026-11-16): the game's own drawing, then the same
  // drawing with its specks removed, so the two can be judged side by side.
  { key: 'hamdi-bulo', colour: FRIEND_COLOURS[6], cleaned: false },
  { key: 'hamdi-bulo', colour: FRIEND_COLOURS[6], cleaned: true },
]

// Two flora shapes — one fat-bodied, one mostly tendrils — and the pastel
// each wears. The hues are the flora's own green and blue; saturation and
// lift are the friends' numbers, which is what makes them pastels.
const PAIR_FLORA = [
  { key: '6', tone: { hue: 150, saturation: 55, lift: 40 } },
  { key: '1', tone: { hue: 205, saturation: 55, lift: 40 } },
]

// A friend on this shelf: the game's own drawing, or the cleaned candidate.
// Built like Friend.jsx (body svg + eyes svg) but takes its colour directly,
// so both versions can be shown in the same pastel.
function PairFriend({ speciesKey, colour, cleaned, idPrefix }) {
  const art = friendArt(speciesKey)
  const { Body, BodyDefs, Eyes, EyeDefs, viewBox, greys } = art
  const clean = CLEANED_FRIENDS[speciesKey]
  // A cleaned drawing may bring its own greys, one per layer (the hamdi
  // bulo's layers are restacked, so they are not in the game's paint order).
  const ramp = (cleaned && clean.greys) || greys.ramp
  const palette = paletteForTone(ramp, colour, greys.base)
  const prefix = `${idPrefix}${speciesKey}-${cleaned ? 'clean' : 'raw'}-`
  const box = `0 0 ${viewBox.w} ${viewBox.h}`
  const shades = paletteForTone(['#494949', '#606060'], colour).ramp
  return (
    <span
      className="friend-art"
      style={{
        width: `${friendSize(speciesKey, PAIR_BASE)}px`,
        aspectRatio: `${viewBox.w} / ${viewBox.h}`,
      }}
      aria-hidden="true"
    >
      <svg
        // No `friend-art-body` here: that class adds the stylesheet's halo
        // on top of the drawing's own aura. Left off, a friend glows exactly
        // as much as a flora on this shelf does.
        className="friend-art-layer"
        viewBox={box}
        style={{ color: palette.glow }}
      >
        <defs>
          <BodyDefs prefix={prefix} />
        </defs>
        {cleaned ? (
          <g>
            <path
              d={clean.silhouette}
              fill={palette.glow}
              opacity="0.8"
              filter={`url(#${prefix}friend${art.num}-glow)`}
            />
            <path d={clean.silhouette} fill={palette.base} />
            {clean.shades.map((d, i) => (
              <path key={`s${i}`} d={d} fill={shades[i]} />
            ))}
            {clean.layers.map((d, i) => (
              <path key={i} d={d} fillRule="evenodd" fill={palette.ramp[i]} />
            ))}
          </g>
        ) : (
          <Body palette={palette} prefix={prefix} />
        )}
      </svg>
      <svg className="friend-art-layer" viewBox={box}>
        <defs>
          <EyeDefs prefix={prefix} tone={eyeToneFor(colour)} />
        </defs>
        {/* a cleaned drawing may carry its own eyes (the chitu: one on
            every tendril tip); otherwise the game's own eyes are used */}
        {cleaned && clean.eyes ? (
          <g>
            {clean.eyes.map((eye, i) => (
              <g key={i} className="friend-eye-blink">
                <Eye cx={eye.cx} cy={eye.cy} r={eye.r} prefix={prefix} />
              </g>
            ))}
          </g>
        ) : (
          <Eyes prefix={prefix} />
        )}
      </svg>
    </span>
  )
}

const PAIR_ROWS = [{ id: 'chosen', label: 'cleaned friends, painted flora' }]

function OneRecipeShelf() {
  const height = floraHeight('small', PAIR_BASE)
  return (
    <section
      className="design-family"
      aria-label="friends and flora, one recipe"
    >
      <h3>friends &amp; flora — one recipe</h3>
      {PAIR_ROWS.map((row) => (
        <div key={row.id} style={{ marginBottom: '3rem' }}>
          <p className="curio-name">{row.label}</p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: '3rem',
              padding: '1.5rem 1rem',
            }}
          >
            {PAIR_FRIENDS.map(({ key, colour, cleaned }) => (
              <PairFriend
                key={`${key}-${cleaned}`}
                speciesKey={key}
                colour={colour}
                cleaned={cleaned}
                idPrefix={`pair-${row.id}-`}
              />
            ))}
            {PAIR_FLORA.map(({ key, tone }) => {
              const silhouette = FLORA_SILHOUETTES.find((s) => s.key === key)
              return (
                <PaintedFlora
                  key={key}
                  silhouette={silhouette}
                  layers={PAINTED_FLORA[key]}
                  tone={tone}
                  height={height}
                  idPrefix={`${row.id}-${key}`}
                />
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

function DesignPage({ onBack }) {
  return (
    <section className="stub-page design-page">
      <h2>design assets</h2>

      <OneRecipeShelf />

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

      <CuriosityShelf />

      {/* The abode-sky shelf came down on 2026-08-21 (T5.4). Its question
          — do these four palettes work? — was answered by putting them on
          the real Abode as its four background choices, and this page is a
          waiting room, not a gallery (spec §5b): a settled asset left here
          is another screenful between Kimia and the one she came to see. */}

      <button className="pebble" onClick={onBack}>
        ← back to the habits
      </button>
    </section>
  )
}

export default DesignPage
