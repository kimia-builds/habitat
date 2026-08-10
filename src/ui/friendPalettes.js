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
 * The values are exactly the ones the storyteller and friend-10 already wear,
 * so nothing on the workbench changes colour by this file existing.
 *
 * The three hues are the reward-stream pastels (expedition green, literacy
 * violet, fungi amber). A friend's GLOW is its own body colour (design-bible
 * §3), so the glow is a mid tone of the same hue rather than a separate light.
 *
 * COLOURS ARE STAND-INS. TODO(T5.2): move this table into the CSS design-tokens
 * file once it exists — it is now the single place the friend body colours
 * live, so that migration is one file's worth of work.
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
