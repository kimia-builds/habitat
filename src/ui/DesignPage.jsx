// TEMPORARY (T5 prep, Kimia's call 2026-07-21) — the design-assets
// workbench: one shelf per image-asset family of the M5 design pass,
// and one page to eyeball the whole set together. This page and its
// door at the foot of the home screen are scaffolding — they leave (or
// become something deliberate) when the design pass lands.
//
// Assets appear here AS THEY ARE MADE (Kimia's call 2026-07-26 —
// replaces the earlier grids of empty placeholder tiles, which only
// pushed the real art further down the page).
//
// TEXTURE LIBRARY (T5.3, 2026-07-24): the shared surface vocabulary
// (design-bible §8) lands here first for the eyeball pass before it
// dresses real assets. Each primitive is drawn at swatch size so its
// grain reads: the seven filter surfaces (moss/bark glow green, pores/
// sponge glow green, the three rock surfaces NON-glowing per §3/§7) and
// the four procedural hair modes. Grouped by §8 family.
//
// FRIEND EYES (T5.3a, 2026-07-25): candidate glowing eyes (design-bible
// §9c) land here for Kimia to pick ONE canonical eye from. Every
// candidate glows the same living-thing green — they differ only in
// form (§3) — and each is drawn at one clear size so its shape reads.

import { useState } from 'react'

import { TEXTURES, TextureDefs, hairField, pumicePits } from './textures.jsx'
import ArrivalShelf from './ArrivalShelf.jsx'
import Cameo from './Cameo.jsx'
import { arrivalNote } from './arrivalText.js'
import { Eye, EyeDefs } from './eye.jsx'
import { NightSky, AbodeSky, ABODE_PALETTES } from './sky.jsx'
import { RollingPlanet } from './planet.jsx'
import { SYMBOL_COLORS } from './symbols.js'
import { Signer, SIGNER_VIEWBOX, SIGNER_PALETTES } from './signer.jsx'
import {
  Friend10Body,
  Friend10BodyDefs,
  Friend10Eyes,
  EyeDefs as Friend10EyeDefs,
  FRIEND10_VIEWBOX,
  FRIEND10_PALETTES,
} from './friend10.jsx'
import {
  TRACED_FRIENDS,
  FRIEND_TINTS,
  SHELF_BASE_REM,
} from './tracedFriends.js'
import { friendSize } from './friendCanon.js'
import { speciesColours } from './friendColours.js'
import { paletteForTone } from './friendPalettes.js'

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

// The canonical eye (T5.3a: Kimia chose the "orb"), drawn on the same dark
// ground the texture swatches use and clipped to the rounded card. We draw it
// at a few RADII in one row, because size is now the only thing that varies
// per friend (§9c) — this is the eye that gets placed on every friend body.
// Each swatch is a self-contained SVG carrying its OWN <EyeDefs/> under a
// per-size id prefix, so the eye SVGs on the page never share gradient ids.
const EYE_SIZES = [
  { key: 'small', frac: 0.16 },
  { key: 'medium', frac: 0.26 },
  { key: 'large', frac: 0.36 },
]

function EyeSwatch({ size }) {
  const { key, frac } = size
  const clipId = `eye-${key}-clip`
  const prefix = `eye-${key}-`
  return (
    <li className="eye-swatch">
      <svg
        className="eye-swatch-art"
        viewBox={`0 0 ${SWATCH} ${SWATCH}`}
        role="img"
        aria-label={`canonical eye, ${key}`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect width={SWATCH} height={SWATCH} rx="12" />
          </clipPath>
          <EyeDefs prefix={prefix} />
        </defs>
        <rect width={SWATCH} height={SWATCH} rx="12" fill={SWATCH_GROUND} />
        <g clipPath={`url(#${clipId})`}>
          <Eye
            cx={SWATCH / 2}
            cy={SWATCH / 2}
            r={SWATCH * frac}
            prefix={prefix}
          />
        </g>
      </svg>
      <span className="eye-swatch-name">{key}</span>
    </li>
  )
}

// The signer illustration (signer.jsx, added 2026-07-26). It's an imported
// seven-layer drawing rather than a code-drawn asset; here it is in the three
// Habitat reward-stream pastels so Kimia can eyeball which hue reads best on
// the dark page. The order is fixed so the colour row is stable. Each swatch
// is a self-contained accessible <svg role="img">, sized to the artwork's own
// tall portrait viewBox and standing on the same dark ground as the textures.
const SIGNER_TINTS = ['green', 'violet', 'amber']

function SignerSwatch({ tint }) {
  return (
    <li className="signer-swatch">
      <svg
        className="signer-swatch-art"
        viewBox={`0 0 ${SIGNER_VIEWBOX.w} ${SIGNER_VIEWBOX.h}`}
        role="img"
        aria-label={`signer, ${tint}`}
      >
        <Signer palette={SIGNER_PALETTES[tint]} />
      </svg>
      <span className="signer-swatch-name">{tint}</span>
    </li>
  )
}

// Friend 10 (friend10.jsx, added 2026-08-10) — the tenth archetype drawing,
// imported and assembled exactly like the storyteller (three reward-stream
// pastels, canonical blinking eyes, body-colour glow, body/eyes split), plus
// a reconstructed darkest base layer that the trace had lost (see
// friend10.jsx's header for the story).
const FRIEND10_TINTS = ['green', 'violet', 'amber']

function Friend10Swatch({ tint }) {
  const prefix = `friend10-${tint}-`
  const viewBox = `0 0 ${FRIEND10_VIEWBOX.w} ${FRIEND10_VIEWBOX.h}`
  // Friend 10 is the poet (tracedFriends.js records the mapping). Its size used
  // to be an 11rem typed into index.css — the second half of the split T5.3d
  // closed — and now comes from the canon against the same shelf base as the
  // other nine, which reproduces that 11rem exactly.
  const shape = {
    width: `${friendSize('poet', SHELF_BASE_REM)}rem`,
    aspectRatio: `${FRIEND10_VIEWBOX.w} / ${FRIEND10_VIEWBOX.h}`,
  }
  return (
    <li className="friend10-swatch" style={{ width: shape.width }}>
      <div
        className="friend10-swatch-art"
        style={shape}
        role="img"
        aria-label={`friend 10, ${tint}`}
      >
        <svg
          className="friend10-swatch-layer"
          viewBox={viewBox}
          aria-hidden="true"
        >
          <defs>
            <Friend10BodyDefs prefix={prefix} />
          </defs>
          <Friend10Body palette={FRIEND10_PALETTES[tint]} prefix={prefix} />
        </svg>
        <svg
          className="friend10-swatch-layer"
          viewBox={viewBox}
          aria-hidden="true"
        >
          <defs>
            <Friend10EyeDefs prefix={prefix} />
          </defs>
          <Friend10Eyes prefix={prefix} />
        </svg>
      </div>
      <span className="friend10-swatch-name">{tint}</span>
    </li>
  )
}

// Kimia's nine other traced archetypes (friend01.jsx … friend09.jsx, added
// 2026-08-10), each assembled exactly like friend 10 and the storyteller. They
// are all the same shape of component, so one swatch serves all nine, driven
// by tracedFriends.js. Per-friend class names are kept on the card so its size
// can still be tuned one archetype at a time.
function TracedFriendSwatch({ friend, tint }) {
  const prefix = `friend${friend.num}-${tint}-`
  const { Body, BodyDefs, Eyes, EyeDefs: FriendEyeDefs, viewBox } = friend
  const box = `0 0 ${viewBox.w} ${viewBox.h}`
  // The card takes its shape from the artwork's own canvas and its size from
  // the one width column in tracedFriends.js.
  const shape = {
    width: `${friend.width}rem`,
    aspectRatio: `${viewBox.w} / ${viewBox.h}`,
  }
  return (
    <li
      className={`traced-swatch friend${friend.num}-swatch`}
      style={{ width: shape.width }}
    >
      <div
        className="traced-swatch-art"
        style={shape}
        role="img"
        aria-label={`${friend.label}, ${tint}`}
      >
        <svg className="traced-swatch-layer" viewBox={box} aria-hidden="true">
          <defs>
            <BodyDefs prefix={prefix} />
          </defs>
          <Body palette={friend.palettes[tint]} prefix={prefix} />
        </svg>
        <svg className="traced-swatch-layer" viewBox={box} aria-hidden="true">
          <defs>
            <FriendEyeDefs prefix={prefix} />
          </defs>
          <Eyes prefix={prefix} />
        </svg>
      </div>
      <span className="traced-swatch-name">{tint}</span>
    </li>
  )
}

// A SPECIES AND ITS INDIVIDUALS (T5.3e, 2026-08-17).
//
// Kimia's call: individuals of a species differ by BODY COLOUR and nothing
// else. So a shelf is one archetype drawing repeated across its roster —
// same silhouette, same texture, same eyes, same size — wearing the colours
// friendColours.js hands that species. The drifters came first and wear the
// whole palette (theirs is the only roster as long as it is), which is why
// that shelf is where the colours themselves were judged.
//
// SIZE: THESE ARE COLOUR SWATCHES, NOT THE SCALE. Every species is drawn at
// the same card width here, which is deliberately NOT the canon's proportions
// — a drifter is a sixth of a scholar, so a shelf true to the scale would show
// either a scholar that does not fit the page or a drifter too small to judge
// a colour on. The question this shelf asks is "does this drawing wear these
// colours", and the cast shelf above it is where proportions are checked and
// where friendCanon.js is consulted. Nothing here feeds the app: when the real
// drawings reach the Guest Book, the reveal, the cameo and the Abode, those
// screens each pick a base size and multiply by the canon, exactly as
// friendCanon.js says. (Flagged to Kimia 2026-08-17 rather than done quietly,
// since "the canon holds everywhere and always" is her rule.)
const INDIVIDUAL_SWATCH_REM = 7

function FriendIndividual({ friend, individual, colour }) {
  // The species key rather than the drawing number, so the ids stay right when
  // the numbered shelf leaves — and unique per shelf, since two swatches
  // sharing an id would have one silently borrow the other's glow filter.
  const prefix = `${friend.species}-${individual}-`
  const {
    Body,
    BodyDefs,
    Eyes,
    EyeDefs: FriendEyeDefs,
    viewBox,
    greys,
  } = friend
  const box = `0 0 ${viewBox.w} ${viewBox.h}`
  // The trace's own greys re-coloured into this individual's tone. `greys.base`
  // is the reconstructed darkest shade the six banded traces carry and the
  // four stacked ones do not — passing undefined for those is exactly right.
  const palette = paletteForTone(greys.ramp, colour, greys.base)
  const shape = {
    width: `${INDIVIDUAL_SWATCH_REM}rem`,
    aspectRatio: `${viewBox.w} / ${viewBox.h}`,
  }
  return (
    <li className="traced-swatch" style={{ width: shape.width }}>
      <div
        className="traced-swatch-art"
        style={shape}
        role="img"
        aria-label={`${friend.species} ${individual}`}
      >
        <svg className="traced-swatch-layer" viewBox={box} aria-hidden="true">
          <defs>
            <BodyDefs prefix={prefix} />
          </defs>
          <Body palette={palette} prefix={prefix} />
        </svg>
        <svg className="traced-swatch-layer" viewBox={box} aria-hidden="true">
          <defs>
            <FriendEyeDefs prefix={prefix} />
          </defs>
          <Eyes prefix={prefix} />
        </svg>
      </div>
      {/* Numbered AND named: Kimia picks colours out by number ("keep 1, 5, 7,
          9 and 10"), and says what she wants by name ("a baby pink"), so the
          shelf speaks both. */}
      <span className="traced-swatch-name">
        {individual}. {colour.name}
      </span>
    </li>
  )
}

// WHICH SPECIES HAVE HAD THEIR INDIVIDUALS DONE, in ladder order. This list is
// the whole of what "doing the next species" means: add its key, and the
// drawing, the roster length and the colours all already know what to do.
// Kimia approves each shelf before the next is added (design-bible §9c), so it
// grows one species at a time rather than all ten at once.
const INDIVIDUALS_DONE = ['drifter', 'nester'].map((species) =>
  TRACED_FRIENDS.find((friend) => friend.species === species),
)

// One shelf per species that has had its individuals done.
function IndividualsShelf({ friend }) {
  const colours = speciesColours(friend.species)
  return (
    <section className="design-family" aria-label={`the ${friend.species}s`}>
      <h3>
        the {colours.length} {friend.species}s
      </h3>
      <ul className="traced-swatches">
        {colours.map((colour, i) => (
          <FriendIndividual
            key={i}
            friend={friend}
            individual={i + 1}
            colour={colour}
          />
        ))}
      </ul>
    </section>
  )
}

// The star-shimmer's workbench shelf (T5.2e, design-notes §5). It lands
// here first because the real thing plays for a couple of seconds and
// only when a habit happens to give something — this shelf replays it on
// demand.
//
// The drops below are the REAL <ArrivalShelf/> with three made-up
// arrivals, not a picture of one: same blobs, same names, same fade, and
// clicking one holds it exactly as in the game. Only the shelf's pinning
// is undone (see .shimmer-swatch in index.css), because a shelf fixed to
// the window's corner has nowhere to sit on a page.
//
// It was TWO rows for one day, while the star colour was a question
// (white / each stream's own pastel). Kimia answered neither
// (2026-08-13): the stars became the night sky's dots, half white and
// half charm-coloured, and one row is the answer.
const SHIMMER_DEMO = [
  { id: 'demo-flora', key: 'flora', status: 'pending' },
  { id: 'demo-novel', key: 'novel' },
  { id: 'demo-fungi', key: 'fungi', amount: 3 },
]

const ignore = () => {}

function ShimmerFamily() {
  // Bumping this re-mounts everything below it, and an animation that
  // plays on arrival plays again on a fresh element — which is all
  // "replay" has to mean here.
  const [run, setRun] = useState(0)
  return (
    <section className="design-family" aria-label="drop arrival">
      <h3>drop arrival</h3>
      <ul className="shimmer-swatches">
        <li className="shimmer-swatch">
          <ArrivalShelf
            key={run}
            arrivals={SHIMMER_DEMO}
            worldSeed={1}
            headerHeight={0}
            onExpire={ignore}
            onDecide={ignore}
            onRead={ignore}
          />
        </li>
      </ul>
      {/* The other half (Kimia's call: both places) — the by-the-habit
          note and its travelling glint. Its words come from the same
          function the real note uses, so this can never drift into
          showing a sentence the game doesn't say. In the game it sits
          out in the margin beside a tile, and only on a wide window; here
          it is put back in the flow so it can be looked at at all. */}
      <p className="shimmer-note-swatch">
        <span className="arrival-note" key={run}>
          {arrivalNote(SHIMMER_DEMO)}
        </span>
      </p>
      <button className="pebble" onClick={() => setRun(run + 1)}>
        replay
      </button>
    </section>
  )
}

// The cameo's firework (T5.2e, Kimia's call 2026-08-16). The REAL
// Cameo is mounted, so what is looked at here is exactly what the habit
// list shows — including which wins get a burst and which stay quiet.
// A `livedDays` win beside a `bigDay` one is the whole decision on
// screen at once: the milestone bursts, the everyday big day does not.
const FIREWORK_DEMO = [
  { type: 'livedDays', friend: { category: 0, individual: 0 } },
  { type: 'bigDay', friend: { category: 0, individual: 0 } },
]

function FireworkFamily() {
  // Bumping this re-mounts both cameos, and an animation that plays on
  // arrival plays again on a fresh element — all "replay" has to mean.
  const [run, setRun] = useState(0)
  return (
    <section className="design-family" aria-label="cameo firework">
      <h3>cameo firework</h3>
      <ul className="firework-swatches">
        {FIREWORK_DEMO.map((win) => (
          <li className="firework-swatch" key={win.type}>
            <Cameo key={run} win={win} worldSeed={1} onExpire={ignore} />
          </li>
        ))}
      </ul>
      <button className="pebble" onClick={() => setRun(run + 1)}>
        replay
      </button>
    </section>
  )
}

function DesignPage({ onBack }) {
  return (
    <section className="stub-page design-page">
      <h2>design assets</h2>

      {/* The family being worked on right now sits FIRST, so it needs no
          scrolling past the whole cast to reach. */}
      <FireworkFamily />
      <ShimmerFamily />

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

      {/* The canonical friend eye (T5.3a, design-bible §9c). Kimia chose the
          "orb"; here it is at a few sizes, since size is now the only thing
          that varies per friend. Each swatch is self-contained (its own glow
          defs). This is the eye every friend body gets. */}
      <section className="design-family" aria-label="friend eye">
        <h3>friend eye</h3>
        <ul className="eye-swatches">
          {EYE_SIZES.map((size) => (
            <EyeSwatch key={size.key} size={size} />
          ))}
        </ul>
      </section>

      {/* Environment skies (T5.3, design-bible §11a). Both land here first
          for the eyeball pass before wiring into the real screens: the
          shared NightSky (pure-CSS, slow rare twinkle) in one bounded box,
          and the static AbodeSky in all four palettes so its one fixed
          composition can be compared colour-to-colour. */}
      <section className="design-family" aria-label="night sky">
        <h3>night sky</h3>
        <div className="sky-swatch night-sky-swatch">
          <NightSky />
        </div>
      </section>
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

      {/* The daily startup's rolling planet (T5.2e, design-notes §12f). It
          lands here first because the real thing plays once per Habitat day
          and then hides for 24 hours — this box replays it forever. The
          composition is sized off the box's WIDTH, so what is here is what a
          full screen gets, only smaller. Shown in shell pink (the everyday
          colour) and in one of the five Sunday alternatives beside it. */}
      <section className="design-family" aria-label="rolling planet">
        <h3>rolling planet</h3>
        <div className="planet-swatch">
          <RollingPlanet />
        </div>
        <div className="planet-swatch">
          <RollingPlanet color={SYMBOL_COLORS[6]} />
        </div>
      </section>

      {/* The signer illustration (signer.jsx) — an imported drawing shown in
          the three reward-stream pastels so its hue can be chosen by eye. */}
      <section className="design-family" aria-label="signer">
        <h3>signer</h3>
        <ul className="signer-swatches">
          {SIGNER_TINTS.map((tint) => (
            <SignerSwatch key={tint} tint={tint} />
          ))}
        </ul>
      </section>

      {/* Friend 10 (friend10.jsx) — the tenth archetype in the three
          reward-stream pastels, assembled with the canonical blinking eyes,
          its body-colour glow, and the reconstructed darkest base. */}
      <section className="design-family" aria-label="friend 10">
        <h3>friend 10</h3>
        <ul className="friend10-swatches">
          {FRIEND10_TINTS.map((tint) => (
            <Friend10Swatch key={tint} tint={tint} />
          ))}
        </ul>
      </section>

      {/* The nine other traced archetypes (friend01.jsx … friend09.jsx), each
          in the three reward-stream pastels, assembled with the canonical
          blinking eyes and a body-colour glow — six of them over a
          reconstructed darkest base, as friend 10 needed. One shelf each, so
          the whole cast can be read down the page at their relative sizes. */}
      {TRACED_FRIENDS.map((friend) => (
        <section
          className="design-family"
          aria-label={friend.label}
          key={friend.num}
        >
          <h3>{friend.label}</h3>
          <ul className="traced-swatches">
            {FRIEND_TINTS.map((tint) => (
              <TracedFriendSwatch key={tint} friend={friend} tint={tint} />
            ))}
          </ul>
        </section>
      ))}

      {/* The ten drifters (T5.3e) — one species' whole roster, which is one
          drawing in ten colours. The first answer to "what makes two friends
          of a species different"; the other nine species follow the same
          recipe once Kimia has judged this one. */}
      {/* The individuals, one shelf per species that has been done (T5.3e).
          Each is its archetype repeated across its roster in the colours
          friendColours.js hands it. The list grows by one entry per species
          as Kimia approves them. */}
      {INDIVIDUALS_DONE.map((friend) => (
        <IndividualsShelf key={friend.species} friend={friend} />
      ))}

      <button className="pebble" onClick={onBack}>
        ← back to the habits
      </button>
    </section>
  )
}

export default DesignPage
