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

import { TEXTURES, TextureDefs, pumicePits } from './textures.jsx'

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
