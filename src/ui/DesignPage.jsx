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
import { TRACED_FRIENDS, FRIEND_TINTS } from './tracedFriends.js'

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
  return (
    <li className="friend10-swatch">
      <div
        className="friend10-swatch-art"
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

function DesignPage({ onBack }) {
  return (
    <section className="stub-page design-page">
      <h2>design assets</h2>

      {/* The family being worked on right now sits FIRST, so it needs no
          scrolling past the whole cast to reach. */}
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

      <button className="pebble" onClick={onBack}>
        ← back to the habits
      </button>
    </section>
  )
}

export default DesignPage
