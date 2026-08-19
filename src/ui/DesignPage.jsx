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
// FLORA COLOURS (T5.3g, 2026-08-19) — the newest shelf, and the first
// step of the flora pass. Kimia's call: the ordinary flora wear four
// colours in total, one green, one aqua, one blue, one indigo, all rich
// and bioluminescent. Three candidate shades per hue stand here as plain
// glowing squares — no silhouette yet, deliberately, because the species
// shapes are a later session and a colour is easier to judge on a shape
// that is asking nothing. She picks one per hue; the losers are then
// deleted from floraColours.js and this shelf becomes the four.

import { TEXTURES, TextureDefs, hairField, pumicePits } from './textures.jsx'
import { AbodeSky, ABODE_PALETTES } from './sky.jsx'
import { FLORA_COLOUR_CANDIDATES } from './floraColours.js'

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

// One candidate flora colour: a square of the colour throwing a glow of
// that same colour, because a living thing's light IS its body colour
// (design-bible §3). The glow spread is --glow-pop, the top of the
// everyday scale — §7 says the organics take the top, and which top step
// "full" finally means is an eyeball call on the real art, so this shelf
// makes a start at the louder of the two.
function FloraColourSwatch({ shade }) {
  return (
    <li className="flora-colour-swatch">
      <div
        className="flora-colour-square"
        role="img"
        aria-label={shade.name}
        style={{
          background: shade.hex,
          boxShadow: `0 0 var(--glow-pop) ${shade.hex}`,
        }}
      />
      <span className="texture-swatch-name">{shade.name}</span>
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

      {/* The flora colours (T5.3g, design-bible §9a) — three candidates
          per hue, waiting on Kimia's pick of one each. */}
      <section className="design-family" aria-label="flora colours">
        <h3>flora colours</h3>
        {FLORA_COLOUR_CANDIDATES.map((group) => (
          <ul
            key={group.hue}
            className="texture-swatches flora-colour-row"
            aria-label={`flora colours — ${group.hue}`}
          >
            {group.shades.map((shade) => (
              <FloraColourSwatch key={shade.name} shade={shade} />
            ))}
          </ul>
        ))}
      </section>

      <button className="pebble" onClick={onBack}>
        ← back to the habits
      </button>
    </section>
  )
}

export default DesignPage
