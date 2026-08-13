/*
 * planet.jsx — the daily startup's rolling planet (design-notes §12f, §13d)
 * =============================================================================
 * T5.2e, first slice. §12f asks for "a slither of globe along the bottom edge,
 * stretching the full width of the screen, spinning slowly and glowing — a
 * satellite image of a planet turning". This file draws exactly that shape and
 * nothing else: no timing, no fade, no tap-to-skip, no Sunday rule. Those are
 * the ceremony, and the ceremony is the NEXT slice — this one exists so Kimia
 * can look at the planet itself, on the DesignPage workbench, before any of it
 * is wired into the real startup moment (the T5.2c lesson: show the smallest
 * visible thing first).
 *
 * HOW IT IS DRAWN (plain CSS + the shared texture library, no images):
 *
 *   THE SKY (behind everything)
 *     A near-black ground with four dark colours washed faintly across it, so
 *     it is not one flat field, and the same white star layer the home screen
 *     wears — <NightSky/>, untouched, rare unsynchronised twinkle and all.
 *     Same asset, same seed: the startup is showing you the app's own sky, and
 *     the app then fades in over it. The whole layer creeps slowly toward the
 *     top right and back, so the scene is never quite still (Kimia, 2026-08-13).
 *
 *   THE SPHERE
 *     A circle three times wider than the screen, sunk almost entirely below
 *     the bottom edge so only its crown shows. Being that big is what makes
 *     the curve gentle: it reads as a planet rather than a bubble.
 *
 *   THE SURFACE — and this is what makes it a SPHERE and not a stripe
 *     Ground receding toward a horizon does two things at once: it gets
 *     SMALLER and it moves SLOWER. So the surface is not one moving layer but
 *     three DEPTH BANDS stacked between the limb and the viewer:
 *
 *       far   a hairline at the very limb — tiny, squashed flat, slowest
 *       mid   the middle distance
 *       near  the ground closest to us — biggest features, fastest
 *
 *     Each band wears one of the shared rock textures from the library
 *     (design-bible §8): CRATERED STONE at the limb and up close, WEATHERED
 *     ROCK in between. Each drifts sideways at its own pace, and the three
 *     paces disagreeing is the whole trick — that parallax is what the eye
 *     reads as a ball turning rather than a belt scrolling. Under them all, a
 *     slow field of soft blotches gives continent-scale colour variation.
 *
 *     Every band is drawn TWICE, side by side, and slid by exactly one copy's
 *     width, so each loop is seamless and the planet turns forever.
 *
 *   THE LIGHT
 *     One glow blooming OUTWARD off the arc (the atmosphere) and a thin bright
 *     line hugging it (the lit edge), with the face darkening away from it.
 *
 * EVERYTHING IS SIZED IN cqw — 1% of the container's own WIDTH (that is what
 * container-type: inline-size on the wrapper buys us). So the composition is
 * identical in a small workbench box and on a full 27" screen, and it never
 * changes shape when a window gets taller. One rule, no breakpoints.
 *
 * WHERE THE COLOURS LIVE (design-notes §11d). The planet's colour is a CHARM
 * colour — shell pink by default, §12f — so it comes from SYMBOL_COLORS, the
 * existing tokens.css mirror, and is never re-typed here. The rest below is
 * artwork (how big, how bright, how slow, the four sky tints), so it stays
 * beside the drawing like textures.jsx's tints and sky.jsx's palettes do.
 * =============================================================================
 */

import { useMemo } from 'react'
import { SYMBOL_COLORS } from './symbols.js'
import { NightSky } from './sky.jsx'
import TextureDefs from './textures.jsx'

/* -----------------------------------------------------------------------------
 * THE DIALS — every number Kimia's eye might want moved, in one list.
 * Lengths are in cqw (1% of the container width); see the header.
 * --------------------------------------------------------------------------- */
export const PLANET_TOKENS = {
  sphereWidth: 300, // sphere diameter — 3× the screen's width
  crest: 13, // how high the arc rises above the bottom edge at its centre
  bandDepth: 40, // how far down the sphere the surface is painted
  spinSeconds: 90, // the FAR band's loop — every other pace is a fraction of it
  bloom: 4, // how far the atmosphere glows OUT past the arc
  bloomWide: 14, // the second, fainter halo beyond it
  rim: 0.5, // how far the lit edge glows IN from the arc (a thin bright line)
  rimWide: 4, // the softer inner falloff behind it
  rockStrength: 1, // how hard the rock texture bites into the colour
  rockRelief: 2.3, // how deep the craters read (contrast pushed into the rock)

  // The sky's own drift (Kimia, 2026-08-13): the whole star layer creeps
  // toward the TOP RIGHT, then back again, so the scene breathes instead of
  // sitting still. `skyDrift` is how far it travels each way, in cqw;
  // `skyDriftSeconds` is ONE of those crossings, not the round trip. At these
  // values it moves about a pixel and a half a second: you notice it only if
  // you watch for it, which is the point. Too much slower and the ceremony —
  // a few seconds long — would be over before the sky had visibly moved.
  skyDrift: 5,
  skyDriftSeconds: 90,
  blotches: 26, // continent-scale features in one copy of the loop
  blur: 12, // how soft each of those is (units of the 1000×260 blotch tile)

  // The four dark colours washed across the sky (Kimia, 2026-08-13) so it is
  // not one flat black field. Deliberately DARK and muted: §7 keeps bright
  // colour for drops and reveals, and nothing here may compete with the limb.
  skyTints: [
    ['#1b2340', '18% 20%', 0.55], // deep indigo, upper left
    ['#122a2e', '80% 12%', 0.5], // dark teal, upper right
    ['#2a1b2e', '52% 42%', 0.45], // plum, centre
    ['#241c14', '93% 58%', 0.4], // warm umber, low right
  ],
}

/* -----------------------------------------------------------------------------
 * THE THREE DEPTH BANDS. `top`/`depth` are cqw down from the sphere's crown.
 * `pace` multiplies spinSeconds — a SMALLER pace is a FASTER band, so near
 * ground outruns the horizon, which is the parallax the whole effect rests on.
 * `tile` is the coordinate box one copy is drawn in: it is what sets the
 * texture's apparent size, because the shared filters have a fixed grain and a
 * big box shrinks it. Wide-and-short boxes squash the rock the way distance
 * squashes real ground.
 * --------------------------------------------------------------------------- */
export const DEPTH_BANDS = [
  {
    key: 'far',
    texture: 'tex-cratered',
    top: 0,
    depth: 4.5,
    pace: 1,
    tile: [9000, 340],
    opacity: 0.55,
    fade: 'black 0%, black 40%, transparent 100%',
  },
  {
    key: 'mid',
    texture: 'tex-weathered',
    top: 2.4,
    depth: 8.5,
    pace: 0.62,
    tile: [3000, 170],
    opacity: 0.8,
    fade: 'transparent 0%, black 34%, black 66%, transparent 100%',
  },
  {
    key: 'near',
    texture: 'tex-cratered',
    top: 7,
    depth: 20,
    pace: 0.38,
    tile: [1100, 150],
    opacity: 0.9,
    fade: 'transparent 0%, black 30%, black 100%',
  },
]

// One copy of the continent field, in its own little coordinate space. The SVG
// is stretched to fit (preserveAspectRatio="none") — these are organic blobs,
// so stretching them is free.
const TILE_W = 1000
const TILE_H = 260

// Deterministic RNG → the same planet every single morning. (Same generator
// sky.jsx uses for its star field; kept local so neither file owns the other.)
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// '#E8698C' + 0.4 → 'rgba(232, 105, 140, 0.4)'. The planet wears ONE colour at
// many strengths, so every shade in here is this function of the charm hex.
function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

// One depth band's rock, drawn twice side by side so its drift loops without a
// seam. Two separate <svg>s rather than one drawn twice: an SVG's filter grain
// is generated in its OWN coordinate box, so two identical boxes are
// guaranteed to come out identical — which is exactly what a seamless loop
// needs, and is not guaranteed if you translate one copy of a filtered shape.
function RockBand({ band, seconds }) {
  const [tileW, tileH] = band.tile
  const copy = (
    <svg
      className="p-rock-copy"
      viewBox={`0 0 ${tileW} ${tileH}`}
      preserveAspectRatio="none"
    >
      <rect
        width={tileW}
        height={tileH}
        fill="#ffffff"
        filter={`url(#${band.texture})`}
      />
    </svg>
  )
  return (
    <div
      className={`p-rock p-rock-${band.key}`}
      style={{
        top: `${band.top}cqw`,
        height: `${band.depth}cqw`,
        opacity: band.opacity * PLANET_TOKENS.rockStrength,
        animationDuration: `${seconds}s`,
        maskImage: `linear-gradient(to bottom, ${band.fade})`,
        WebkitMaskImage: `linear-gradient(to bottom, ${band.fade})`,
      }}
    >
      {copy}
      {copy}
    </div>
  )
}

/**
 * <RollingPlanet /> — fills its positioned parent. `color` is a charm hex
 * (shell pink by default, §12f).
 */
export function RollingPlanet({ color = SYMBOL_COLORS[3], seed = 20260812 }) {
  const t = PLANET_TOKENS

  // The continent field: lighter patches catching the light and darker patches
  // in shadow, scattered across one loop tile. Weighted toward the top of the
  // tile, because that is the strip actually on screen.
  const blotches = useMemo(() => {
    const rng = mulberry32(seed)
    const U = (a, b) => a + rng() * (b - a)
    const out = []
    for (let i = 0; i < t.blotches; i++) {
      const lit = rng() < 0.55
      out.push({
        cx: U(0, TILE_W),
        cy: U(-30, TILE_H * 0.55),
        rx: U(45, 200),
        ry: U(14, 52),
        lit,
        op: lit ? U(0.3, 0.7) : U(0.45, 0.8),
      })
    }
    return out
    // The dials are module constants; the field only rebuilds on a new seed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])

  const continents = (
    <g>
      {blotches.map((b, i) => (
        <ellipse
          key={i}
          cx={b.cx.toFixed(1)}
          cy={b.cy.toFixed(1)}
          rx={b.rx.toFixed(1)}
          ry={b.ry.toFixed(1)}
          fill={b.lit ? color : '#000000'}
          opacity={b.op.toFixed(2)}
        />
      ))}
    </g>
  )

  // Every colour the drawing wears, handed to the CSS as custom properties on
  // this instance's root. It has to be done this way round: the stylesheet
  // below is ONE shared block (same class names for every planet on the page),
  // so a colour baked into it would be overwritten by the next instance —
  // which is exactly what happened when the workbench first showed two.
  const paint = {
    '--p-bloom': withAlpha(color, 0.4),
    '--p-bloom-wide': withAlpha(color, 0.14),
    '--p-rim': withAlpha(color, 0.95),
    '--p-rim-wide': withAlpha(color, 0.22),
    '--p-face': withAlpha(color, 0.42),
    '--p-face-dim': withAlpha(color, 0.16),
    '--p-sky': t.skyTints
      .map(
        ([tint, at, alpha]) =>
          `radial-gradient(60% 55% at ${at}, ${withAlpha(tint, alpha)} 0%, transparent 100%)`,
      )
      .join(', '),
  }

  return (
    <div className="nzd-planet" style={paint} aria-hidden="true">
      <style>{`
        .nzd-planet { position: absolute; inset: 0; overflow: hidden;
          container-type: inline-size; background: #05070a; }

        /* THE SKY — four dark washes over the ground, then the home screen's
           own star layer at rest. NightSky paints its own background; here the
           washes are the ground, so its gradient is turned off. */
        /* The sky sits OVERSIZED — bigger than the box by more than it ever
           travels — so drifting it never drags an edge into view. It creeps
           up and to the right, then back, for ever. Alternating rather than
           looping because a star field cannot wrap: at this pace the turn is
           far too slow to read as a reversal. */
        .nzd-planet .p-sky {
          position: absolute; inset: -${t.skyDrift + 1}cqw;
          animation: nzd-planet-sky ${t.skyDriftSeconds}s ease-in-out infinite alternate;
        }
        @keyframes nzd-planet-sky {
          from { transform: translate(-${t.skyDrift}cqw, ${t.skyDrift}cqw); }
          to   { transform: translate(${t.skyDrift}cqw, -${t.skyDrift}cqw); }
        }
        .nzd-planet .p-sky-wash {
          position: absolute; inset: 0; background-image: var(--p-sky);
        }
        .nzd-planet .nzd-night-sky { background: none; }

        /* THE SPHERE — mostly below the bottom edge, only its crown showing */
        .nzd-planet .p-sphere {
          position: absolute; left: 50%;
          width: ${t.sphereWidth}cqw; height: ${t.sphereWidth}cqw;
          margin-left: -${t.sphereWidth / 2}cqw;
          bottom: -${t.sphereWidth - t.crest}cqw;
          border-radius: 50%; overflow: hidden;
          background: #000;
          box-shadow:
            0 0 ${t.bloom}cqw var(--p-bloom),
            0 0 ${t.bloomWide}cqw var(--p-bloom-wide);
        }

        /* THE SURFACE. The band's own background is the LIT FACE — the
           daylight side, brightest at the limb and gone a little way down.
           Everything else sits ON it, so the band isolates its blending. */
        .nzd-planet .p-band {
          position: absolute; top: 0; left: 0;
          width: 100%; height: ${t.bandDepth}cqw; overflow: hidden;
          isolation: isolate;
          background: linear-gradient(to bottom,
            var(--p-face) 0%,
            var(--p-face-dim) 10%,
            transparent 26%);
        }

        /* Every drifting layer is 200% wide, holds two identical copies, and
           slides by exactly one copy — so the loop never shows a seam.
           height MUST be stated on the SVG copies: an SVG is a replaced
           element with an intrinsic ratio from its viewBox, so pinning top and
           bottom alone left one twice its band's height and slid the whole
           surface below the visible strip. */
        .nzd-planet .p-continents, .nzd-planet .p-rock {
          position: absolute; left: 0; width: 200%;
          animation-name: nzd-planet-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .nzd-planet .p-continents {
          top: 0; height: 100%;
          animation-duration: ${(t.spinSeconds * DEPTH_BANDS[1].pace).toFixed(0)}s;
        }
        /* The blend belongs on the BAND, not on the two copies inside it. A
           copy blending with its own parent has nothing to blend with — the
           parent's opacity and mask already sealed it into its own group — so
           the rock simply lay on top as pale grey and bleached the planet
           white. Blended here, the group meets the coloured face beneath it.
           The library lights its rock in a pale COOL grey (textures.jsx), and
           at full strength that blue-grey bleeds into the planet. Draining its
           colour first leaves pure light and shade, so overlay can only carve
           relief and never argues with the charm colour; it is then pulled
           down to mid-grey and its contrast pushed up, so the craters bite. */
        .nzd-planet .p-rock {
          display: flex;
          mix-blend-mode: overlay;
          filter: grayscale(1) brightness(0.5) contrast(${t.rockRelief});
        }
        .nzd-planet .p-rock-copy { width: 50%; height: 100%; flex: none; }
        @keyframes nzd-planet-spin {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .nzd-planet .p-shade {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom,
            transparent 0%,
            rgba(0,0,0,0.35) 14%,
            #000 30%);
        }

        /* THE LIT EDGE, glowing inward along the arc */
        .nzd-planet .p-rim {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow:
            inset 0 0 ${t.rim}cqw var(--p-rim),
            inset 0 0 ${t.rimWide}cqw var(--p-rim-wide);
        }

        /* §9: motion is never compulsory. Still planet, same picture. */
        @media (prefers-reduced-motion: reduce) {
          .nzd-planet .p-continents,
          .nzd-planet .p-rock,
          .nzd-planet .p-sky { animation: none; }
        }
      `}</style>

      {/* The shared texture library's filter defs (design-bible §8), so the
          rock ids resolve wherever a planet is mounted. */}
      <svg width="0" height="0" aria-hidden="true">
        <TextureDefs />
      </svg>

      <div className="p-sky">
        <div className="p-sky-wash" />
        <NightSky />
      </div>

      <div className="p-sphere">
        <div className="p-band">
          <svg
            className="p-continents"
            viewBox={`0 0 ${TILE_W * 2} ${TILE_H}`}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="nzd-planet-blur">
                <feGaussianBlur stdDeviation={t.blur} />
              </filter>
            </defs>
            <g filter="url(#nzd-planet-blur)">
              {continents}
              <g transform={`translate(${TILE_W} 0)`}>{continents}</g>
            </g>
          </svg>
          {DEPTH_BANDS.map((band) => (
            <RockBand
              key={band.key}
              band={band}
              seconds={(t.spinSeconds * band.pace).toFixed(1)}
            />
          ))}
          <div className="p-shade" />
        </div>
        <div className="p-rim" />
      </div>
    </div>
  )
}

export default RollingPlanet
