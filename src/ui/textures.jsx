/*
 * textures.jsx — N-Z-D shared texture primitives (design-bible §8)
 * =============================================================================
 * The "texture library written once in code" that asset-production-strategy
 * calls for: every world asset (flora, fungi, curiosities, terrain…) composes
 * its surface from these primitives instead of re-inventing texture per asset.
 * Built in an asset session, merged in the T5.3 coding session. Lives on the
 * DesignPage workbench for the eyeball pass (spec §5b); it moves into the real
 * assets in later T5.3 / T6.1 sessions, and the workbench leaves with them.
 *
 * There are TWO kinds of primitive in here, and they integrate differently:
 *
 *   1. FILTER primitives (7) — pure SVG <filter> defs. You apply one to ANY
 *      shape with filter="url(#tex-moss)". Cheap, reusable, resolution-free.
 *      Render <TextureDefs/> once, high in an SVG tree, then reference the ids.
 *
 *   2. PROCEDURAL primitive (1, four modes) — the hair/fur. A filter can't make
 *      hair, so this is a seeded generator that emits hundreds of tapered
 *      "spindle" strands. Call hairField(...) and drop the result inside a
 *      clipped <g>.
 *
 * DESIGN-BIBLE COMPLIANCE NOTES (keep these true):
 *   • Glow is intrinsic to living things and its COLOUR NEVER VARIES (§3, §7).
 *     Organic textures here glow green; rock/ground do NOT glow. Keep it that way.
 *   • "Silhouette first, texture second, colour last" (§3): these are the
 *     SECOND layer — always applied on top of / clipped to a silhouette shape,
 *     never used to define one.
 *   • Colours below STAY HERE (settled T5.2a, 2026-08-10). The design-tokens
 *     file now exists (`src/tokens.css`), and it holds the colours the
 *     stylesheet wears. These are surface tints fed to SVG filter primitives
 *     as JavaScript strings — no CSS rule reads them — so they live beside the
 *     filters that use them, the same call friendPalettes.js and sky.jsx got.
 *     They are still stand-ins in the sense that matters: the art pass may
 *     retune them, and design-bible §8 is what they answer to.
 *
 * WHAT MAPS TO KIMIA'S APPROVED SCREENSHOTS:
 *   tex-moss      = "moss" / the demo's "fractal-noise grain"
 *   tex-bark      = "bark"
 *   tex-pores     = "pores" / the demo's "thresholded pores"
 *   tex-sponge    = "sponge"
 *   tex-pumice    = "pumice"   (filter grain + optional pumicePits() overlay)
 *   tex-weathered = "weathered rock"
 *   tex-cratered  = "cratered stone" / the demo's "deep-crater rock"
 *   hairField()   = "soft fibres (curled)" | "curly coat" | "wispy waves" | "dense underfur"
 * =============================================================================
 */

/* -----------------------------------------------------------------------------
 * COLOUR TABLE  —  the texture library's own paints (see the header: these do
 * not move to tokens.css; no CSS rule reads them).
 * `light` is the feDiffuseLighting colour (the surface tint). Organic families
 * carry a green light + a glow; rock/ground carry a cool grey light + NO glow.
 * --------------------------------------------------------------------------- */
export const TEX_COLORS = {
  mossLight: '#63d79c', // TODO token: organic surface tint (green)
  barkLight: '#7fce9e', // TODO token
  poresTint: [0.34, 0.93, 0.72], // rgb 0–1 for the pore fill (feColorMatrix)
  spongeLight: '#5fc79a', // TODO token
  pumiceLight: '#a9bccd', // TODO token: rock surface tint (cool grey)
  weatheredLight: '#a9bccd', // TODO token
  crateredLight: '#a9bccd', // TODO token
  // hair depth-of-colour ramp (dark root-shadow → mid body → bright tip)
  hairDark: [0x16, 0x30, 0x20],
  hairMid: [0x4f, 0xb8, 0x82],
  hairBright: [0xc6, 0xff, 0xda],
  hairAccents: [
    [0x3d, 0x9c, 0x72],
    [0x2f, 0x7a, 0x54],
    [0x63, 0xd7, 0xc0],
    [0x7f, 0xe6, 0xab],
    [0x38, 0x8f, 0x66],
  ],
  pumicePit: '#232a31', // dark vesicle holes overlaid on pumice
}

/* =============================================================================
 * 1. FILTER PRIMITIVES
 * Render <TextureDefs/> once. Apply to a shape: <rect ... filter="url(#tex-moss)"/>
 * Every filter ends with feComposite operator="in" against SourceAlpha, so it is
 * CLIPPED to whatever shape you attach it to — give that shape a solid fill.
 * ---------------------------------------------------------------------------
 * TUNING CHEAT-SHEET (what each knob does):
 *   baseFrequency  ↑ = finer grain / smaller features.  Two values = anisotropic.
 *   numOctaves     ↑ = more fine detail layered in (also slower).
 *   surfaceScale   ↑ = deeper relief / taller bumps & craters.
 *   elevation      ↓ = grazing light = longer, more dramatic shadows in the relief.
 *   seed           = change to get a different-but-same-style instance.
 * =========================================================================== */
/* -----------------------------------------------------------------------------
 * SPONGE — a porous holey mass, its tint PARAMETERISED. The discrete alpha
 * table PUNCHES HOLES (the 0s), then diffuse lighting gives the remaining walls
 * relief in `light`. Standalone (not inlined in TextureDefs) because organic
 * surfaces no longer glow one green: a FRIEND wears the sponge in its own body
 * colour (Kimia's rule, T5.3b), so it must be emittable under a per-friend id
 * and tint. TextureDefs renders the default green instance for the swatch.
 * --------------------------------------------------------------------------- */
export function SpongeFilter({
  id = 'tex-sponge',
  light = TEX_COLORS.spongeLight,
}) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.11"
        numOctaves="3"
        seed="14"
        result="n"
      />
      <feComponentTransfer in="n" result="h">
        <feFuncA type="discrete" tableValues="1 1 1 0 0 1 1" />
      </feComponentTransfer>
      <feDiffuseLighting
        in="h"
        surfaceScale="2.2"
        diffuseConstant="1.0"
        lightingColor={light}
        result="l"
      >
        <feDistantLight azimuth="220" elevation="55" />
      </feDiffuseLighting>
      <feComposite in="l" in2="SourceAlpha" operator="in" />
    </filter>
  )
}

export function TextureDefs() {
  const c = TEX_COLORS
  const [pr, pg, pb] = c.poresTint
  return (
    <defs>
      {/* MOSS — fine even organic grain. Also serves as the demo "fractal-noise grain". */}
      <filter id="tex-moss" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="4"
          seed="11"
          result="n"
        />
        <feDiffuseLighting
          in="n"
          surfaceScale="1.9"
          diffuseConstant="1.05"
          lightingColor={c.mossLight}
          result="l"
        >
          <feDistantLight azimuth="220" elevation="55" />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceAlpha" operator="in" />
      </filter>

      {/* BARK — vertical ridged furrows (anisotropic: low x-freq, high y-freq). */}
      <filter id="tex-bark" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.016 0.11"
          numOctaves="5"
          seed="7"
          result="n"
        />
        <feDiffuseLighting
          in="n"
          surfaceScale="2.6"
          diffuseConstant="1.05"
          lightingColor={c.barkLight}
          result="l"
        >
          <feDistantLight azimuth="220" elevation="48" />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceAlpha" operator="in" />
      </filter>

      {/* PORES — thresholded noise → scattered raised pore blobs. The big negative
          alpha bias in the last matrix row is the "threshold": push it more
          negative for fewer/tighter pores, less negative for more. */}
      <filter id="tex-pores" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.19"
          numOctaves="2"
          seed="9"
          result="n"
        />
        <feColorMatrix
          in="n"
          type="matrix"
          values={`0 0 0 0 ${pr}  0 0 0 0 ${pg}  0 0 0 0 ${pb}  0 0 0 5 -1.1`}
          result="c"
        />
        <feComposite in="c" in2="SourceAlpha" operator="in" />
      </filter>

      {/* SPONGE — porous holey mass. Default green instance for the swatch;
          the tint is parameterised (see SpongeFilter) because a FRIEND now
          wears the sponge in its OWN body colour (Kimia's rule, T5.3b). */}
      <SpongeFilter />

      {/* PUMICE — fine light rock grain. Pair with pumicePits() below for the
          characteristic vesicle holes. NO glow (rock class). */}
      <filter id="tex-pumice" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.5"
          numOctaves="4"
          seed="23"
          result="n"
        />
        <feDiffuseLighting
          in="n"
          surfaceScale="1.3"
          diffuseConstant="1.05"
          lightingColor={c.pumiceLight}
          result="l"
        >
          <feDistantLight azimuth="220" elevation="55" />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceAlpha" operator="in" />
      </filter>

      {/* WEATHERED ROCK — smooth worn, gentle low-frequency mottling. NO glow. */}
      <filter id="tex-weathered" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.06"
          numOctaves="4"
          seed="17"
          result="n"
        />
        <feDiffuseLighting
          in="n"
          surfaceScale="1.1"
          diffuseConstant="1.05"
          lightingColor={c.weatheredLight}
          result="l"
        >
          <feDistantLight azimuth="220" elevation="58" />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceAlpha" operator="in" />
      </filter>

      {/* CRATERED STONE — deep relief (high surfaceScale) + grazing light (low
          elevation) = pronounced craters. The demo "deep-crater rock". NO glow. */}
      <filter id="tex-cratered" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.055"
          numOctaves="5"
          seed="7"
          result="n"
        />
        <feDiffuseLighting
          in="n"
          surfaceScale="3.4"
          diffuseConstant="1.05"
          lightingColor={c.crateredLight}
          result="l"
        >
          <feDistantLight azimuth="235" elevation="42" />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceAlpha" operator="in" />
      </filter>

      {/* Support filters used by the hair generator's depth passes. */}
      <filter id="tex-soft3">
        <feGaussianBlur stdDeviation="2.4" />
      </filter>
      <filter id="tex-glow1" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
  )
}

/* -----------------------------------------------------------------------------
 * PUMICE PITS — optional procedural overlay that completes the pumice look.
 * Draw AFTER the tex-pumice rect, inside the same clip. Returns <circle> holes.
 * --------------------------------------------------------------------------- */
export function pumicePits({
  x = 0,
  y = 0,
  w = 200,
  h = 200,
  seed = 1,
  count = 90,
} = {}) {
  const rng = mulberry32(seed)
  const pits = []
  for (let i = 0; i < count; i++) {
    const px = x + 6 + rng() * (w - 12)
    const py = y + 6 + rng() * (h - 12)
    const r = 1.5 + rng() * 2.5
    pits.push(
      <circle
        key={`pit${i}`}
        cx={px.toFixed(1)}
        cy={py.toFixed(1)}
        r={r.toFixed(1)}
        fill={TEX_COLORS.pumicePit}
        opacity={(0.5 + rng() * 0.4).toFixed(2)}
      />,
    )
  }
  return pits
}

/* =============================================================================
 * 2. PROCEDURAL PRIMITIVE — HAIR / FUR
 * Each strand is a curling, double-tapered "spindle" (thin → thick → thin), so
 * it has no blunt/square root and fades to nothing at both ends. Direction does
 * a biased random walk → the strand coils. Rendered in three depth-of-colour
 * passes: a blurred dark underlayer, a mid body layer (with accent hues), and a
 * thin bright highlight layer that fades at both ends.
 *
 * USAGE:
 *   <g clipPath="url(#someShapeClip)">
 *     {hairField({ mode: 'curled', x, y, w: 200, h: 200, seed: 42 })}
 *   </g>
 * Requires <TextureDefs/> in scope (uses #tex-soft3 and #tex-glow1).
 *
 * MODES (all approved except the dropped "hooked tips"):
 *   'curled'   — soft fibres, gentle coil, medium volume.
 *   'coat'     — thicker, tighter curls (curly coat).
 *   'wispy'    — long, very fine, high count (wispy waves).
 *   'underfur' — tiny dense strands, maximum quantity (dense underfur).
 *
 * COLOUR: pass `colour: '#43e08a'` to grow the field in that hue instead of the
 * library green — hairRamp() below rebuilds the whole depth ramp from it. Used
 * by the flora fills (T5.3g), where hair IS the fill.
 *
 * COUNT SCALE: each mode's strand counts are what covers the tuning square, so
 * a box smaller than one square needs proportionally fewer — `countScale: 0.4`
 * grows four tenths as many. `denseHairField` works it out and passes it; a
 * swatch asking for a plain field never sets it.
 * =========================================================================== */

// Deterministic RNG so a given seed always reproduces the same field.
function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const U = (rng, a, b) => a + rng() * (b - a)
const hx = ([r, g, b]) =>
  '#' +
  [r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, v | 0))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
const lerp = (c1, c2, t) => c1.map((v, i) => v + (c2[i] - v) * t)

// One spindle strand → an SVG path `d` string.
function spindle(
  x0,
  y0,
  ang,
  nseg,
  seglen,
  w0,
  curlbias,
  drift,
  rng,
  hook = 0,
) {
  const pts = [[x0, y0]]
  const dirs = []
  let a = ang
  for (let i = 0; i < nseg; i++) {
    a += curlbias + U(rng, -drift, drift)
    if (hook && i >= nseg - 2) a += hook
    pts.push([
      pts[i][0] + Math.cos(a) * seglen,
      pts[i][1] + Math.sin(a) * seglen,
    ])
    dirs.push(a)
  }
  const left = [],
    right = []
  for (let i = 0; i < pts.length; i++) {
    const t = i / nseg
    const w = w0 * Math.sin(Math.PI * t) * 0.6 + 0.04 // spindle: 0 at both ends
    const da = dirs[Math.min(i, dirs.length - 1)]
    const px = -Math.sin(da),
      py = Math.cos(da)
    left.push([pts[i][0] + px * w, pts[i][1] + py * w])
    right.push([pts[i][0] - px * w, pts[i][1] - py * w])
  }
  const fmt = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`
  return (
    'M ' +
    left.map(fmt).join(' L ') +
    ' L ' +
    right.reverse().map(fmt).join(' L ') +
    ' Z'
  )
}

const HAIR_MODES = {
  //          nseg  seglen      width       curl  drift  counts[dark,mid,bright]  lenScale
  curled: {
    nseg: 8,
    sl: [7, 11],
    w: [1.2, 2.6],
    cb: 0.16,
    dr: 0.22,
    counts: [160, 260, 150],
    lens: 1.0,
  },
  coat: {
    nseg: 11,
    sl: [5, 8],
    w: [2.4, 4.4],
    cb: 0.42,
    dr: 0.18,
    counts: [120, 190, 110],
    lens: 1.0,
  },
  wispy: {
    nseg: 10,
    sl: [8, 12],
    w: [0.8, 1.8],
    cb: 0.1,
    dr: 0.3,
    counts: [220, 340, 180],
    lens: 1.15,
  },
  underfur: {
    nseg: 5,
    sl: [3, 5],
    w: [1.4, 2.8],
    cb: 0.2,
    dr: 0.34,
    counts: [340, 520, 300],
    lens: 0.55,
  },
}

/* -----------------------------------------------------------------------------
 * TINTING THE HAIR (T5.3g, 2026-08-19). The filter surfaces take their tint as
 * a lighting colour, but hair is painted strand by strand out of a five-part
 * ramp (a dark root shadow, a mid body, a bright tip, and five accent hues
 * scattered through the body). To wear a colour, hair needs that whole ramp
 * rebuilt in it — so this derives one from a single hex.
 *
 * It is the same idea as the friends' paletteForTone(): one tone in, a whole
 * coherent set out, so nobody hand-picks thirty-odd hex values. The shape of
 * the ramp is copied from the green one that was drawn by hand and approved —
 * root near-black at the same hue, tip nearly white, accents fanned a little
 * either side of the body colour — so a tinted field reads exactly like the
 * original with the hue turned.
 * --------------------------------------------------------------------------- */

// hex → [hue 0–360, saturation 0–1, lightness 0–1]
function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l]
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
  else if (max === g) h = ((b - r) / d + 2) * 60
  else h = ((r - g) / d + 4) * 60
  return [h, s, l]
}

// [hue, saturation, lightness] → [r, g, b] 0–255, the array shape the strand
// painter's lerp() and hx() already expect.
function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360
  const sat = Math.max(0, Math.min(1, s))
  const lum = Math.max(0, Math.min(1, l))
  const c = (1 - Math.abs(2 * lum - 1)) * sat
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = lum - c / 2
  const seg = Math.floor(hue / 60) % 6
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][seg]
  return rgb.map((v) => Math.round((v + m) * 255))
}

export function hairRamp(hex) {
  const [h, s, l] = hexToHsl(hex)
  return {
    // The root shadow: the same hue, drained and taken almost to black, so
    // the field has depth without a second colour appearing in it.
    hairDark: hslToRgb(h, s * 0.6, 0.12),
    // The body: the colour itself, untouched. This is the one the eye reads.
    hairMid: hslToRgb(h, s, l),
    // The tip: nearly white but still tinted, so strands end in light rather
    // than in a hard edge.
    hairBright: hslToRgb(h, Math.min(1, s * 1.1), 0.88),
    // Accents fanned either side of the body hue — the variation that stops a
    // field of one colour looking like a flat fill.
    hairAccents: [
      hslToRgb(h - 12, s, l * 0.8),
      hslToRgb(h + 12, s, Math.min(0.78, l * 1.15)),
      hslToRgb(h - 24, s * 0.85, l),
      hslToRgb(h + 24, s * 0.85, l * 0.9),
      hslToRgb(h, s * 0.7, Math.min(0.82, l * 1.3)),
    ],
  }
}

export function hairField({
  mode = 'curled',
  x = 0,
  y = 0,
  w = 200,
  h = 200,
  seed = 1,
  colour = null,
  countScale = 1,
} = {}) {
  const cfg = HAIR_MODES[mode] || HAIR_MODES.curled
  // No colour asked for = the library's own green, so every existing swatch
  // draws exactly as it did before tinting existed.
  const C = colour ? { ...TEX_COLORS, ...hairRamp(colour) } : TEX_COLORS
  const rng = mulberry32(seed)
  const baseAng = -Math.PI / 2 // hairs grow "up"
  // [palette, opacity, blur/glow filter, count, widthScale]
  const passes = [
    [C.hairDark, 0.55, 'tex-soft3', cfg.counts[0], 0.55],
    [C.hairMid, 1.0, null, cfg.counts[1], 1.0],
    [C.hairBright, 0.38, 'tex-glow1', cfg.counts[2], 0.45],
  ]
  const groups = []
  // The palette (first slot) is chosen per-pass by `pi` below, so it's
  // skipped in the destructure — the pass index carries it.
  passes.forEach(([, opk, filt, n, wscale], pi) => {
    const paths = []
    // A mode's counts are what covers the TUNING SQUARE; `countScale` is the
    // fraction of one square this box actually is, so a smaller box grows
    // proportionally fewer strands instead of the same number packed tighter.
    const count = Math.max(1, Math.round(n * countScale))
    for (let i = 0; i < count; i++) {
      const sx = x + U(rng, 3, w - 3)
      const sy = y + U(rng, 3, h - 3)
      const ang = baseAng + U(rng, -0.5, 0.5)
      const cb = cfg.cb * (rng() < 0.5 ? 1 : -1) // coil either direction
      const w0 = U(rng, cfg.w[0], cfg.w[1]) * wscale
      let col
      if (pi === 0) col = hx(lerp(C.hairDark, C.hairMid, U(rng, 0, 0.3)))
      else if (pi === 1)
        col = hx(
          lerp(
            C.hairAccents[(rng() * C.hairAccents.length) | 0],
            C.hairMid,
            U(rng, 0, 0.5),
          ),
        )
      else
        col = hx(
          lerp(
            C.hairBright,
            C.hairAccents[(rng() * C.hairAccents.length) | 0],
            U(rng, 0, 0.35),
          ),
        )
      const d = spindle(
        sx,
        sy,
        ang,
        cfg.nseg,
        U(rng, cfg.sl[0], cfg.sl[1]) * cfg.lens,
        w0,
        cb,
        cfg.dr,
        rng,
      )
      paths.push(
        <path
          key={`p${pi}_${i}`}
          d={d}
          fill={col}
          opacity={(opk * U(rng, 0.55, 1)).toFixed(2)}
        />,
      )
    }
    groups.push(
      <g key={`pass${pi}`} filter={filt ? `url(#${filt})` : undefined}>
        {paths}
      </g>,
    )
  })
  return groups
}

/* -----------------------------------------------------------------------------
 * A FIELD WITH NO THIN EDGE (T5.3g, Kimia 2026-08-19)
 * -----------------------------------------------------------------------------
 * `hairField` scatters roots across its box and grows every strand UPWARD. That
 * leaves the box thin along its BOTTOM: a point near the bottom edge is covered
 * only by the few roots between it and the edge, while a point in the middle is
 * covered by everything below it as well. On a square swatch nobody minds. Cut
 * a flora out of one and the shape wears that thin band across its underside —
 * which is exactly what Kimia saw and disliked.
 *
 * THE RULE SHE ASKED FOR: grow one big dense field, and cookie-cut the shape out
 * of the MIDDLE of it. That is all this function does.
 *
 *   • It grows the field over a box larger than the one asked for — enough room
 *     below for a whole strand's worth of roots, so the strands that would have
 *     been missing under the shape's belly exist and grow up into it, plus a
 *     margin at the sides and top for the small inset the generator keeps.
 *   • It then repeats that field until the density is back to what the mode was
 *     tuned for. Density is strands per area, so a box four times the size needs
 *     four passes; each pass reseeds, and because roots are scattered uniformly
 *     the passes lay over each other with no seam.
 *
 * Ask it for the box you actually want covered and clip to your shape. The
 * overscan is its business, not the caller's.
 * -------------------------------------------------------------------------- */

// The tuning square the hair modes were dialled in on. Density everywhere else
// is measured against it.
const HAIR_TUNED_BOX = 110

// The furthest a strand of this mode can travel from its root. Segment count ×
// the longest a segment gets × the mode's length scale — an upper bound, since
// a curling strand does not spend all of that going straight up.
export function hairReach(mode) {
  const cfg = HAIR_MODES[mode] || HAIR_MODES.curled
  return cfg.nseg * cfg.sl[1] * cfg.lens
}

// The small margin at the sides and top: the generator keeps roots 3 units clear
// of its own edges, and a couple more costs nothing and removes the seam.
const HAIR_EDGE_MARGIN = 6

// The box a dense field is actually GROWN over: the one asked for, plus room
// below for a full strand's worth of roots and a hairline everywhere else. Its
// own function because density is strands per area of THIS box, not of the box
// the caller asked to cover — so anything measuring density needs the same sum.
export function hairGrownBox({
  mode = 'curled',
  x = 0,
  y = 0,
  w = 200,
  h = 200,
} = {}) {
  return {
    x: x - HAIR_EDGE_MARGIN,
    y: y - HAIR_EDGE_MARGIN,
    w: w + HAIR_EDGE_MARGIN * 2,
    h: h + HAIR_EDGE_MARGIN + hairReach(mode),
  }
}

export function denseHairField({
  mode = 'curled',
  x = 0,
  y = 0,
  w = 200,
  h = 200,
  seed = 1,
  colour = null,
} = {}) {
  const box = hairGrownBox({ mode, x, y, w, h })
  // Back to the tuned density: one pass per tuning square of area.
  const squares = (box.w * box.h) / (HAIR_TUNED_BOX * HAIR_TUNED_BOX)
  const passes = Math.max(1, Math.round(squares))
  // …and when even ONE pass is more than the box needs — a box SMALLER than the
  // tuning square, which is what a small flora's fur is grown in since 2026-08-21
  // — that single pass is thinned to the fraction that fits. Without it a
  // quarter-square box would wear four times the tuned density: the right fur,
  // wrongly, four times as thick. A box of one square or more is untouched.
  const countScale = Math.min(1, squares)
  return Array.from({ length: passes }, (_, i) =>
    hairField({ mode, ...box, seed: seed + i * 101, colour, countScale }),
  )
}

/* =============================================================================
 * 3. MANIFEST — machine-readable index of every primitive in this file.
 * `family` follows design-bible §8's "who may use what" table.
 * =========================================================================== */
export const TEXTURES = [
  {
    id: 'tex-moss',
    name: 'moss',
    family: 'plant-like',
    kind: 'filter',
    glow: true,
    apply: 'filter="url(#tex-moss)"',
  },
  {
    id: 'tex-bark',
    name: 'bark',
    family: 'plant-like',
    kind: 'filter',
    glow: true,
    apply: 'filter="url(#tex-bark)"',
  },
  {
    id: 'tex-pores',
    name: 'pores',
    family: 'fungal',
    kind: 'filter',
    glow: true,
    apply: 'filter="url(#tex-pores)"',
  },
  {
    id: 'tex-sponge',
    name: 'sponge',
    family: 'fungal',
    kind: 'filter',
    glow: true,
    apply: 'filter="url(#tex-sponge)"',
  },
  {
    id: 'tex-pumice',
    name: 'pumice',
    family: 'rock',
    kind: 'filter',
    glow: false,
    apply: 'filter="url(#tex-pumice)" + pumicePits()',
  },
  {
    id: 'tex-weathered',
    name: 'weathered rock',
    family: 'rock',
    kind: 'filter',
    glow: false,
    apply: 'filter="url(#tex-weathered)"',
  },
  {
    id: 'tex-cratered',
    name: 'cratered stone',
    family: 'rock',
    kind: 'filter',
    glow: false,
    apply: 'filter="url(#tex-cratered)"',
  },
  {
    id: 'hair-curled',
    name: 'soft fibres (curled)',
    family: 'hair',
    kind: 'procedural',
    glow: true,
    apply: "hairField({ mode: 'curled' })",
  },
  {
    id: 'hair-coat',
    name: 'curly coat',
    family: 'hair',
    kind: 'procedural',
    glow: true,
    apply: "hairField({ mode: 'coat' })",
  },
  {
    id: 'hair-wispy',
    name: 'wispy waves',
    family: 'hair',
    kind: 'procedural',
    glow: true,
    apply: "hairField({ mode: 'wispy' })",
  },
  {
    id: 'hair-underfur',
    name: 'dense underfur',
    family: 'hair',
    kind: 'procedural',
    glow: true,
    apply: "hairField({ mode: 'underfur' })",
  },
]

export default TextureDefs
