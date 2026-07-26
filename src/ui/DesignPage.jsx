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

import { TEXTURES, TextureDefs, hairField, pumicePits } from './textures.jsx'
import { Eye, EyeDefs } from './eye.jsx'
import { NightSky, AbodeSky, ABODE_PALETTES } from './sky.jsx'
import { Signer, SIGNER_VIEWBOX, SIGNER_PALETTES } from './signer.jsx'
import {
  StorytellerBody,
  StorytellerBodyDefs,
  StorytellerEyes,
  EyeDefs as StorytellerEyeDefs,
  STORYTELLER_VIEWBOX,
  STORYTELLER_PALETTES,
} from './storyteller.jsx'

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
          <Eye cx={SWATCH / 2} cy={SWATCH / 2} r={SWATCH * frac} prefix={prefix} />
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

// The storyteller illustration (storyteller.jsx, added 2026-07-26) — the
// Storytellers-category archetype, imported like the signer and shown in the
// same three reward-stream pastels so the candidate body colours can be
// compared like-for-like. Unlike the bare signer it arrives ASSEMBLED: the
// canonical yellow eyes are mounted (blinking idly) and the body glows its
// own colour. The heavy static body and the small blinking eyes are TWO
// stacked SVGs sharing one viewBox — that split is load-bearing (see the
// note in storyteller.jsx: blinking inside the body svg would re-blur the
// whole figure every blink). The accessible image is the wrapper div; each
// swatch prefixes its ids so the three tints' defs never collide.
const STORYTELLER_TINTS = ['green', 'violet', 'amber']

function StorytellerSwatch({ tint }) {
  const prefix = `storyteller-${tint}-`
  const viewBox = `0 0 ${STORYTELLER_VIEWBOX.w} ${STORYTELLER_VIEWBOX.h}`
  return (
    <li className="storyteller-swatch">
      <div
        className="storyteller-swatch-art"
        role="img"
        aria-label={`storyteller, ${tint}`}
      >
        <svg className="storyteller-swatch-layer" viewBox={viewBox} aria-hidden="true">
          <defs>
            <StorytellerBodyDefs prefix={prefix} />
          </defs>
          <StorytellerBody palette={STORYTELLER_PALETTES[tint]} prefix={prefix} />
        </svg>
        <svg className="storyteller-swatch-layer" viewBox={viewBox} aria-hidden="true">
          <defs>
            <StorytellerEyeDefs prefix={prefix} />
          </defs>
          <StorytellerEyes prefix={prefix} />
        </svg>
      </div>
      <span className="storyteller-swatch-name">{tint}</span>
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

      {/* The storyteller illustration (storyteller.jsx) — the Storytellers
          archetype in the three reward-stream pastels, assembled with the
          canonical blinking eyes and its body-colour glow. */}
      <section className="design-family" aria-label="storyteller">
        <h3>storyteller</h3>
        <ul className="storyteller-swatches">
          {STORYTELLER_TINTS.map((tint) => (
            <StorytellerSwatch key={tint} tint={tint} />
          ))}
        </ul>
      </section>

      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default DesignPage
