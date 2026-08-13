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
 * HOW IT IS DRAWN (four layers, bottom to top — plain CSS, no images):
 *
 *   1. the sphere      a circle three times wider than the screen, sunk almost
 *                      entirely below the bottom edge so only its crown shows.
 *                      Being that big is what makes the curve gentle: it reads
 *                      as a planet rather than a bubble.
 *   2. the surface     soft blurred blotches drifting sideways inside the
 *                      sphere. They are drawn TWICE, side by side, and slid by
 *                      exactly one copy's width — so the loop is seamless and
 *                      the planet appears to turn forever.
 *   3. the shade       a top-to-bottom gradient over the surface: bright at the
 *                      limb, into darkness a little way down. Curvature, cheaply.
 *   4. the light       one glow blooming OUTWARD off the arc (the atmosphere)
 *                      and one glowing INWARD along it (the lit edge).
 *
 * EVERYTHING IS SIZED IN `cqw` — 1% of the container's own WIDTH (that is what
 * `container-type: inline-size` on the wrapper buys us). So the composition is
 * identical in a small workbench box and on a full 27" screen, and it never
 * changes shape when a window gets taller. One rule, no breakpoints.
 *
 * WHERE THE COLOURS LIVE (design-notes §11d). The planet's colour is a CHARM
 * colour — shell pink by default, §12f — so it comes from SYMBOL_COLORS, the
 * existing tokens.css mirror, and is never re-typed here. The numbers below are
 * artwork (how big, how bright, how slow), so they stay beside the drawing like
 * textures.jsx's tints and sky.jsx's palettes do.
 * =============================================================================
 */

import { useMemo } from 'react'
import { SYMBOL_COLORS } from './symbols.js'

/* -----------------------------------------------------------------------------
 * THE DIALS — every number Kimia's eye might want moved, in one list.
 * Lengths are in cqw (1% of the container width); see the header.
 * --------------------------------------------------------------------------- */
export const PLANET_TOKENS = {
  sphereWidth: 300, // sphere diameter — 3× the screen's width
  crest: 13, // how high the arc rises above the bottom edge at its centre
  bandDepth: 40, // how far down the sphere the surface + shade are painted
  spinSeconds: 90, // one full turn of the surface (slow — §12f: "spinning slowly")
  bloom: 4, // how far the atmosphere glows OUT past the arc
  bloomWide: 14, // the second, fainter halo beyond it
  rim: 0.5, // how far the lit edge glows IN from the arc (a thin bright line)
  rimWide: 4, // the softer inner falloff behind it
  blotches: 26, // surface features in one copy of the loop
  blur: 12, // how soft each blotch is (SVG units of the 1000×260 loop tile)
}

// One copy of the drifting surface, in its own little coordinate space. The
// SVG is stretched to fit (preserveAspectRatio="none") — these are organic
// blobs, so stretching them is free.
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

/**
 * <RollingPlanet /> — fills its positioned parent; the parent supplies the
 * black. `color` is a charm hex (shell pink by default, §12f).
 */
export function RollingPlanet({ color = SYMBOL_COLORS[3], seed = 20260812 }) {
  const t = PLANET_TOKENS

  // The surface features: lighter patches catching the light and darker
  // patches in shadow, scattered across one loop tile. Weighted toward the
  // top of the tile, because that is the strip actually on screen.
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

  const surface = (
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
  }

  return (
    <div className="nzd-planet" style={paint} aria-hidden="true">
      <style>{`
        .nzd-planet { position: absolute; inset: 0; overflow: hidden;
          container-type: inline-size; background: #000; }

        /* 1. the sphere — mostly below the bottom edge, only its crown showing */
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

        /* 2 + 3. the painted band across the sphere's crown. The band's own
           background is the LIT FACE — the daylight side, brightest at the
           limb and gone a little way down. The blotches sit ON it (not under
           a wash, which is what made the first attempt read as fog), and the
           shade only darkens what is below them. */
        .nzd-planet .p-band {
          position: absolute; top: 0; left: 0;
          width: 100%; height: ${t.bandDepth}cqw; overflow: hidden;
          background: linear-gradient(to bottom,
            var(--p-face) 0%,
            var(--p-face-dim) 10%,
            transparent 26%);
        }
        /* height MUST be stated. An SVG is a replaced element with an
           intrinsic ratio from its viewBox, so pinning top and bottom alone
           left it twice the band's height and slid every blotch below the
           visible strip — the surface was there all along, just off the
           bottom of the screen. */
        .nzd-planet .p-surface {
          position: absolute; top: 0; left: 0;
          width: 200%; height: 100%;
          animation: nzd-planet-spin ${t.spinSeconds}s linear infinite;
        }
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

        /* 4. the lit edge, glowing inward along the arc */
        .nzd-planet .p-rim {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow:
            inset 0 0 ${t.rim}cqw var(--p-rim),
            inset 0 0 ${t.rimWide}cqw var(--p-rim-wide);
        }

        /* §9: motion is never compulsory. Still planet, same picture. */
        @media (prefers-reduced-motion: reduce) {
          .nzd-planet .p-surface { animation: none; }
        }
      `}</style>

      <div className="p-sphere">
        <div className="p-band">
          <svg
            className="p-surface"
            viewBox={`0 0 ${TILE_W * 2} ${TILE_H}`}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="nzd-planet-blur">
                <feGaussianBlur stdDeviation={t.blur} />
              </filter>
            </defs>
            {/* the tile, then the same tile again one width along, so the
                sideways slide loops without a seam */}
            <g filter="url(#nzd-planet-blur)">
              {surface}
              <g transform={`translate(${TILE_W} 0)`}>{surface}</g>
            </g>
          </svg>
          <div className="p-shade" />
        </div>
        <div className="p-rim" />
      </div>
    </div>
  )
}

export default RollingPlanet
