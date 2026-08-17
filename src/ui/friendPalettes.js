/*
 * friendPalettes.js — the one grey→pastel table the traced friends share
 * =============================================================================
 * Every one of Kimia's traced archetypes came out of Inkscape painted in the
 * SAME eight greys (#333333 down to #d0d0d0). So rather than nine copies of
 * the same colour list, the mapping from each grey to its green / violet /
 * amber pastel lives here once, and each friendNN.jsx asks for the ramp its
 * own trace needs — in its own paint order, which is not always light-to-dark.
 *
 * WHY THIS FILE EXISTS (2026-08-10): retuning a hue used to mean editing nine
 * files and hoping they stayed consistent; now it is one edit here, and two
 * archetypes drawn in the same grey are guaranteed to land on the same pastel.
 * The values are exactly the ones the archetypes already wear,
 * so nothing on the workbench changes colour by this file existing.
 *
 * The three hues are the reward-stream pastels (expedition green, literacy
 * violet, fungi amber). A friend's GLOW is its own body colour (design-bible
 * §3), so the glow is a mid tone of the same hue rather than a separate light.
 *
 * WHERE THIS TABLE LIVES (settled T5.2a, 2026-08-10). The design-tokens file
 * now exists (`src/tokens.css`), and this table is deliberately NOT in it. The
 * tokens file holds the colours the STYLESHEET wears — one name, one value,
 * read straight by a CSS rule. These are artwork colours: 24 pastels consumed
 * only as JavaScript strings, painting SVG layers. Moving them would buy no
 * CSS rule anything and would cost a second hand-kept mirror. So the split is:
 * the palette Habitat's interface wears lives in tokens.css; a drawing's own
 * paints live beside the drawing. Same rule as textures.jsx and sky.jsx.
 * =========================================================================== */

// Each row is one of the traces' greys and the pastel it becomes in each hue.
// Listed darkest first. Extending the set later means adding a row here.
export const GREY_TO_PASTEL = {
  '#333333': { green: '#113f28', violet: '#231250', amber: '#4f3a11' },
  '#494949': { green: '#1d754b', violet: '#351d75', amber: '#75581d' },
  '#606060': { green: '#269a62', violet: '#46269a', amber: '#9a7426' },
  '#767676': { green: '#2fbd79', violet: '#562fbd', amber: '#bd8e2f' },
  '#8c8c8c': { green: '#47d18f', violet: '#6c47d1', amber: '#d1a447' },
  '#a3a3a3': { green: '#6cdaa5', violet: '#8a6cda', amber: '#dab66c' },
  '#b9b9b9': { green: '#8fe3bb', violet: '#a68fe3', amber: '#e3c78f' },
  '#d0d0d0': { green: '#b2ecd2', violet: '#c0aeee', amber: '#ecd9b2' },
}

// The tone every hue glows in — the middle of the ramp, bright enough to read
// as light and still plainly the body's own colour.
const GLOW_GREY = '#767676'

// THE RULE HIDING IN THE TABLE ABOVE (found T5.3e, 2026-08-17). Those 24 hand
// -written pastels are not 24 independent choices. Read them in HSL and they
// are one formula: KEEP THE GREY'S OWN LIGHTNESS, SET SATURATION TO 60%, TURN
// THE HUE. Green is that at 151°, violet at 256.5°, amber at 40° — every row
// lands within one or two of 255 per channel of the value typed by hand.
//
// That matters because individuals differ ONLY by body colour (Kimia,
// 2026-08-17), so the app needs ten plip ramps, nine baluhm ramps and so on
// — 55 in all, eight shades each. Nobody is hand-picking 440 hex values. One
// tone in, one ramp out.
//
// SATURATION IS PART OF THE TONE, not a constant (revised 2026-08-17, second
// pass). The first cut fixed it at the table's 60% and turned the hue only,
// which can reach every HUE but only ever at one strength — no pale grey at
// any hue. So a tone carries its own saturation, and 60 is just where the
// three original tints happen to sit. (Saturation alone still did not reach a
// pastel: that took `lift`, below — a pastel turned out to be a LIGHT colour
// more than a weak one.)
//
// The hand table STAYS the source of truth for green/violet/amber. Two
// reasons: the darkest green (#113f28) was deliberately darkened past what the
// formula gives, and regenerating them would shift the nine archetypes already
// standing on the workbench — a colour change nobody asked for, in a task about
// something else.
export const TINT_SATURATION = 60

// A grey's lightness, as a percentage. These are true greys (r = g = b), so the
// red channel alone is the answer and there is no need for a full HSL convert.
function lightnessOf(grey) {
  return (parseInt(expand(grey).slice(1, 3), 16) / 255) * 100
}

// LIFT — how far toward white a colour is pulled, 0 to 100 (added 2026-08-17,
// the third pass). Hue and saturation alone cannot make a pastel, because a
// pastel is a LIGHT colour and the lightness here belongs to the drawing:
// friend01's mid tone sits near 55%, where a baby pink (about 86%) simply
// cannot exist. Asked for one, the formula returned a dusty rose — correct
// arithmetic, wrong colour.
//
// So lift moves every shade the same FRACTION of its remaining distance to
// white, rather than adding a flat amount. That distinction is the whole
// design: a flat amount would push the top of the ramp past white and clip,
// flattening the shading Kimia drew into a solid blob. A fraction compresses
// the ramp gently toward the light end instead — at lift 45, the darkest shade
// climbs 20% → 56% and the lightest 81% → 90% — so every shade stays distinct,
// in order, and the modelling survives. Nothing can ever clip, because a
// fraction of the remaining distance never arrives.
//
// All ten friend colours are lifted (Kimia, 2026-08-17), between 35 and 45, so
// the cast reads as one family — see friendColours.js. A lift of 0 leaves a
// colour exactly as the drawing's own shading has it.
function lifted(lightness, lift) {
  return lightness + (100 - lightness) * (lift / 100)
}

// HSL → #rrggbb, the standard conversion. Kept here because this is the only
// file in the project that thinks in hues.
function hslHex(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360
  const s = saturation / 100
  const l = lightness / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  const byte = (n) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${byte(r)}${byte(g)}${byte(b)}`
}

/**
 * The same trace in ANY tone — the individuals' path, where `palettesFor` is
 * the three named tints' path. Same shape of palette, so a component cannot
 * tell which one it was handed.
 *
 * `greys`    the trace's shade list, in its source paint order
 * `tone`     `{ hue, saturation, lift }` — degrees round the wheel, how strong
 *            the colour is, and how far it is pulled toward white. Only `hue`
 *            is required. See friendColours.js for whose is whose.
 * `baseGrey` the reconstructed darkest shade, for banded traces only
 */
export function paletteForTone(greys, tone, baseGrey) {
  const { hue, saturation = TINT_SATURATION, lift = 0 } = tone
  const pastel = (grey) =>
    hslHex(hue, saturation, lifted(lightnessOf(grey), lift))
  const palette = {
    ramp: greys.map(pastel),
    glow: pastel(GLOW_GREY),
  }
  if (baseGrey) palette.base = pastel(baseGrey)
  return palette
}

/**
 * ONE tone as a single flat colour, for art that has no shade ramp to re-paint
 * — the T4.4 placeholder line-drawings in FriendGlyph.jsx, which are one
 * stroke colour all through. `paletteForTone` above is the same maths applied
 * to a whole ramp; this is the one-shade version of it, so a placeholder friend
 * and the real drawing that replaces it are lit by the same rule.
 *
 * `lightness` is where on the light-to-dark scale the flat colour sits before
 * the tone's lift pales it, exactly as a ramp shade's own lightness would.
 */
export function toneAtLightness(tone, lightness) {
  const { hue, saturation = TINT_SATURATION, lift = 0 } = tone
  return hslHex(hue, saturation, lifted(lightness, lift))
}

export const TINTS = ['green', 'violet', 'amber']

// Inkscape writes some greys in three-digit shorthand (#333). Normalise so the
// table only needs the long form.
function expand(grey) {
  const g = grey.toLowerCase()
  return g.length === 4 ? `#${g[1]}${g[1]}${g[2]}${g[2]}${g[3]}${g[3]}` : g
}

function look(grey, tint) {
  const row = GREY_TO_PASTEL[expand(grey)]
  if (!row) throw new Error(`friendPalettes: no pastel for grey ${grey}`)
  return row[tint]
}

/**
 * The trace's OWN greys as a palette — the drawing's original neutral look,
 * used as each component's default so a friend renders even with no tint.
 *
 * `greys`    the trace's shade list, in its source paint order
 * `baseGrey` the extra darkest shade a reconstructed base layer paints in
 *            (banded traces only; omitted for stacked ones)
 */
export function greysFor(greys, baseGrey) {
  const palette = { ramp: greys.map(expand), glow: GLOW_GREY }
  if (baseGrey) palette.base = expand(baseGrey)
  return palette
}

/**
 * The same trace in each of the three reward-stream pastels. The ramp keeps
 * the trace's paint order, so ramp[i] is always the pastel for whatever grey
 * layer[i] was drawn in.
 */
export function palettesFor(greys, baseGrey) {
  const out = {}
  for (const tint of TINTS) {
    out[tint] = {
      ramp: greys.map((g) => look(g, tint)),
      glow: look(GLOW_GREY, tint),
    }
    if (baseGrey) out[tint].base = look(baseGrey, tint)
  }
  return out
}
