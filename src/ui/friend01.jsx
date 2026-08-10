// Friend 01 (friend-01-big.svg, added to the workbench 2026-08-10) —
// one of Kimia's nine traced archetype drawings, imported and assembled
// exactly like friend10.jsx and the storyteller: the traced layers are
// kept verbatim in their source paint order and only the shade RAMP is
// swapped, so one drawing can be shown in any candidate body colour.
//
// A STACKED trace, like the storyteller: the darkest layer (#333) is the
// whole figure and the lighter shades stack on top of it, so the glow
// aura blurs that bottom layer and nothing needs reconstructing.
// This is much the COARSEST trace of the nine — a 64-unit canvas against
// the others' 174 to 715 — so its forms read as faceted blocks and its
// lower body as ragged gaps. On the magenta ground those gaps are open
// bays in the drawing itself, not enclosed holes: the #333 silhouette is
// complete and nothing was lost, so there is nothing to reconstruct. The
// coarseness is the trace's own resolution (flagged to Kimia 2026-08-10).
//
// Assembled per the friend conventions (design-bible §3, §7, §9c): Kimia's
// traced eye placeholders are replaced by the canonical yellow <Eye/> at
// their measured centres; the body glows its own colour; the eyes blink in
// their own featherweight overlay svg — the body/eyes split is load-bearing
// (see storyteller.jsx).
//
// COLOURS ARE STAND-INS. TODO(T5.2): move the ramps into the CSS
// design-tokens file once it exists, like every other asset here.

import { Eye, EyeDefs } from './eye.jsx'
import { palettesFor, greysFor } from './friendPalettes.js'
export { EyeDefs }

// The original artwork's canvas, copied verbatim from the source SVG.
export const FRIEND01_VIEWBOX = { w: 64.464, h: 68.255 }

// The seven shade layers in the source's own painting order, DARKEST
// first (the full figure), lighter shades stacked on top.
// NOTE the order is the source's, which is not always light-to-dark — the
// ramps below are listed in this SAME order, so ramp[i] always carries the
// tone layer[i] was drawn in (#333, #494949, #606060, #767676, #8c8c8c, #a3a3a3, #b9b9b9).
export const FRIEND01_LAYERS = [
  'm37.02 65.699-.81-2.553 1.73-6.894h4.543l11.643 5.626 4.769 5.708.089-1.918-2.812-5.394-2.811-5.394 1.744-9.294H58.9l-.75 2.333-.751 2.333 1.439-2 1.438-2 .02-3.255.021-3.254 4.147 5.176-1.274-2.667-1.275-2.666.274-9.329.273-9.328L51.256 6.194 39.36.252H25.565l-8.58 3.729L0 19.97 1.088 39.21l4.552 3.328 8.25 10.381 1.095-.666h2.666v4h9.64l9.027 9.854v2.146h1.513zm1.297-12.113.824-1.333h1.176v2.666h-2.824zm7.95-.082-.875-1.416-6.408-2.436v-5.4h-2.846l1.82 5.737-4.974-2.067-7.193-.566 1.435 2.681 1.435 2.682-10.062-5.937-3.321 1.274-1.627-8.137v-6.333h3.466l3.2 3.2v-3.2h4l.041 3.333.98-1.43.98-1.43 9.867.06 5.152-4.662 6.829 1.713 2.788-1.723-4.171-6.367-3.799 1.458v-2.625l4.083-3.39 3.832 5.063.09-3.333.09-3.333 1.905 3.333 1.906 3.333.047 1.079.047 1.079-1.333-.825-1.334-.824v4.443l4-1.535v2.583h-4.285l1.619 4 1.77 4.394-7.358-1.406 1.052 9.012h-2.87l-5.928-4.151v2.451l8 10.067v.967h-1.176zm-21.06-10.14-.89-.89v3.556l.89-.888.888-.89zm-6.223-1.778v-1.333h-2.666v2.666h2.666zm18.667-2v-.667h-1.333v1.334h1.333zm-27.33.682-.875-3.985-2.461-1.521v-2.705l4.313.862 1.015 11.333h-1.117zm44.663-.682v-.667h1.334v1.334h-1.334zm1.334-7.333v-1.778l1.777 1.778-1.777 1.777zm-35.695-2.916.528-1.584 3.166-1.056v2.604l-4.222 1.62zm34.36-9.084v-1.334h4v2.667h-4zm-38.666 46v-.667h-1.334v1.333h1.334zm5.333-8v-.667h-1.333v1.333h1.333zm41.333-6.667v-.667H61.65v1.334h1.333z',
  'm55.682 60.319-2.034-3.934V48.58l-4-3.32v4.154l1.416 3.725 1.417 3.726-3.138 1.046 7.638 6.247.735.096zm-19.349.267.018-2.333 1.66-6.667-3.354 3.125-3.986-1.53 3.182 5.947-1.455 3.791h3.917zM22.62 54.114l-.806-.806-3.5 1.401 5.112.21zm12.361-4.017v-.51h-6.824l1.493 2.415 5.331-1.394zm-19.825-.967-1.485-1.79 1.755-1.754H10.18l-3.846-3.333 7.812 8.667h2.494zm4.714-.433-.889-.889v3.556l1.778-1.778zm25.778-1.11v-.668h-1.333v1.334h1.333zm14.667-2.668v-.666h-1.333v1.333h1.333zm-6.667-2.666v-1.556h-4v3.111h4zm6.667-.723v-1.389l-5.662-5.888 1.544 3 1.545 3h-1.584l.824 1.333.824 1.333h2.51zM4.888 34.594l.807-3.659 3.286.651.08-5.858 1.92-1.92v3.445l8-1.6v2.757l2.667-1.648V18.92h2.667v7.843l3.078 1.903-2.182-3.532 5.104 2.13 5.95 1.291 2.825-7.428-1.449-4.207 4.126 5.334-1.503 6h2.717V18.12l-3.155-3.156 1.02-1.02 1.02-1.02 1.877 2.567 1.877 2.567 1.574-1.574-4.52-6.898h2.853l6.666 6.667h3.588l3.2 3.2v-2.874l-4-3.32V10.68l-6-5.131L37.233-.003l-14.919 1.86-5.333 2.715-5.333 4.875L1.237 18.48.658 25.7.08 32.92l3.219 8 .782-2.667zM24.315 16.92v-.667h1.333v1.334h-1.333zm1.333-2.667v-.666h1.334v1.333h-1.334zm9.334-2.666v-.667h1.333v1.333h-1.333zm-27.09 25.75-.7-1.75-.105 2.555-.105 2.556.805-.806.806-.805zm17.337-4.344-.42-1.261-7.16-1.915v3.325l1.111 1.111h6.889zm-9.58-.74-.824-1.333h-4l1.648 2.667h4zm14.889.445-.889-.89-1.778 1.779h3.556zm18.587-3.887-.81-2.11v-2.448h-2.22l.665 6 .222.667h2.952zm12.524.109v-.667h-1.333v1.334h1.333zm0-8v-.667h-1.333v1.334h1.333z',
  'M36.317 59.586v-1.843l-2.383-1.473.383 6.393 2-1.234zm16.889-.222-.889-.89-1.778 1.779h3.556zm0-4-.889-.89v3.556l1.778-1.777zm0-4-.889-.89v3.556l1.778-1.777zM3.665 34.059l-.452-4.86 1.075-2.807 1.075-2.806 1.91 7.333h2.428l-1.624-6.473 1.413-2.43 1.413-2.43.04 3 .041 3h4.175l5.158-2.76v-5.613l-4.199-3.07 7.302-3.89.591 1.76.59 1.76 4.025-5.745 2.891 2.891h2.419l-.686-1.787-.686-1.787 9.753.625 3.384-2.752 5.103 4.618-1.307 3.406 3.933 1.509 1.361-3.548-5.807-5.316L38.2.479 22.318 2.403l-5.941 3.245-7.393 6.631-6.282 5.974-1.867 5.333 1.063 15.333h2.22zm1.986-11.806v-.667h1.333v1.333H5.65zm8-6.667v-.667h1.333v1.334H13.65zm11.333-10 .824-1.333h1.333l-1.648 2.666H24.16zM57.65 36.92v-.667h-1.334v1.334h1.334zm-36.667-3.333.824-1.334h-2.824v2.667h1.176zm28.667-4.667v-.667h-1.334v1.334h1.334zm-13.348-3.983 1.645-1.982-.86-3.429-.86-3.428-9.889.822-.426 2.251-.427 2.252 5.498 5.497h3.673zm4.157-8.416-1.406-2.628-7.123-1.787-2.814 2.814h8.51l3.256 5.212.983-.983zm-16.143-.934v-.667h-1.333v1.333h1.333zm21.333 0v-.667h-1.333v1.333h1.333zm12 .078v-.588l-1.333-.824-1.333-.824v2.824h2.666zm-15.11-4.3-.89-.89-1.777 1.778h3.555z',
  'M36.317 58.919v-1.333h-2.824l1.648 2.666h1.176zm17.333-3.333v-.667h-1.333v1.333h1.333zM4.223 33.253l.094-1H1.65l.094 3.666.093 3.667 1.146-2.667 1.146-2.666zm16.094-.334v-.666h-1.333v1.333h1.333zm-11.518-4-.767-2H6.984v4h2.583zm-3.05-7.333h1.52l-1.535 4h2.894l-1.395-5.333H9.62l-.635-6 4.785.81L22.935 9.4l2.543 1.571 6.718-6.717h7.16l2.96 3.838 3.511-3.915-8.843-3.17-2.667.802H23.324l-8.34 5.072v2.526l-5.38 1.708-7.941 8.472.078 4 .078 4 2.412-6zm10.568-14V6.92h1.333v1.334h-1.333zm7.518-1.333.767-2h4.041l-3.32 4h-2.256zm12.482 16.429v-2.62l-3.487-3.486-7.417 3.032 6.753 7.286 4.15-1.593zm-18.592.445 3.036-2.459-.883-2.3-.883-2.302-6.012.854-.417 4.333-.418 4.333h2.54zm22.592-6.744v-1.202l-8.398-2.928h-.936v2.667h6.51l1.648 2.666h1.176zm12-3.463v-.667h-1.334v1.333h1.334zm-.667-4.667-2.413-2.667-2.92.06 6.666 5.214 1.08.06zM38.539 6.03l-.889-.89v3.556l1.778-1.777z',
  'M36.317 59.586v-.667h-1.333v1.334h1.333zm-33.784-25-.673-1.667v6.667l.673-1.667.673-1.666zm17.784-1.667v-.666h-1.333v1.333h1.333zM7.894 28.003l-.7-1.75-.106 2.555-.105 2.556.806-.806.805-.805zm-3.71-7.254.133 1.164 4-3.32v-5.058l6.197 1.556 3.462-4.172 4.34-.21-3.387-1.363 6.475-5.093h3.446l-3.2 3.2v2.598l6.172-5.798h9.985L40.16 6.919l2.158-.04L45.83 4.65 36.983.952l-2.666.856H23.324l-8.34 5.072v4.04h-4.54L1.65 19.442l.266 6.81 2.135-6.667zm12.8-13.83.824-1.333h1.333l-1.648 2.667H16.16zM7.873 23.363l-.89-.889v3.556l.89-.889.888-.889zm27.997.133.801-2.09-1.356-1.356-1.357-1.357-5.308.892 2.248 6h4.17zm-16.81-2.054 1.504-2.81-2.63-2.63-4.95.94-.422 3.655-.422 3.655h5.417zm19.924-5.856v-.667H37.65v1.333h1.334zm-5.334-2.667v-.667h-1.333v1.333h1.333zm20-2.588v-.588L50.572 7.84l1.902 3.079h1.176zM38.983 7.585V6.92H37.65v1.333h1.333z',
  'm2.561 34.67-.7-1.75-.106 2.556-.105 2.555 1.611-1.61zm5.311-5.972-.888-.89v3.557l1.777-1.778zm28.194-6.13.448-2.323-4.377-1.68-2.841 2.842 1.68 4.377 4.643-.895zm-31.14-2.315h1.746l.651-3.404.651-3.405-6.324 5.94.154 2.769.155 2.767 1.22-4.667zm3.39 3.334v-.667H6.983v1.333h1.333zm9.334-2V16.92l-3.334-.87 4 2.83-4.509.04-1.648 2.667 1.648 2.666h3.843zM18.97 9.04l-1.32-1.32-3.2 3.2h-4.8v2.444l1.666.6 1.667.602 7.307-4.206zm34.68 1.213v-.667h-1.333v1.333h1.333zm-27.111-2.89-.889-.888v3.556l.889-.89.889-.888zM24.172 5.51l3.19-2.655-1.28-1.279-8.27 2.883.728 1.898.729 1.898 1.714-.09zm18.811.745v-.667H41.65V6.92h1.333zM41.36 2.712 39.65 1.628l-10-.04v2.515l13.418-.306z',
  'm2.561 34.67-.7-1.75-.106 2.556-.105 2.555 1.611-1.61zm5.311-5.972-.888-.89v3.557l1.777-1.778zm28.194-6.13.448-2.323-4.377-1.68-2.841 2.842 1.68 4.377 4.643-.895zm-18.417-.981V18.92h-1.115l-4.05 1.554.726 1.89.725 1.89h3.714zM5.94 19.654l.712.712 1.278-6.686-6.233 5.907-.047 2.326 1.79-1.485 1.79-1.485zm11.71-8.87V9.406l-6 1.844-.933.825 1.762 2.851 5.171-2.768zm6.126-5.862L27.65 1.59l-1.874-.004-6.792 3.095v3.572h.918zm19.207 1.331v-.666H41.65V6.92h1.333zm-6-3.333 2.667-1.146-10-.187v2.666l4.667-.187zm4.667.667V2.92h-1.333v1.333h1.333z',
]

// The trace's own greys, in that paint order, and the three reward-stream
// pastels built from the shared grey→pastel table (friendPalettes.js) so
// every archetype on the workbench wears the same colours for the same
// tone. Glow is a mid tone of the hue: a friend's glow IS its body colour
// (design-bible §3).
const GREY_ORDER = [
  '#333',
  '#494949',
  '#606060',
  '#767676',
  '#8c8c8c',
  '#a3a3a3',
  '#b9b9b9',
]
export const FRIEND01_GREYS = greysFor(GREY_ORDER)
export const FRIEND01_PALETTES = palettesFor(GREY_ORDER)

// Where Kimia's traced eye placeholders sat: centres and radii measured
// from the placeholder paths, already shifted into viewBox space.
export const FRIEND01_EYES = [
  // Scaled to 0.55x the traced placeholders (see the note above):
  // this trace's eyes were drawn far larger against its body than any
  // other friend's. Their CENTRES are untouched.
  { cx: 16.2, cy: 21.1, r: 2.5 },
  { cx: 33.2, cy: 21.6, r: 2.5 },
]

const glowId = (prefix) => `${prefix}friend01-glow`

// Defs for the BODY svg: just the aura's blur filter, at the same fraction
// of the canvas both precedents use.
export function Friend01BodyDefs({ prefix = '' }) {
  return (
    <filter id={glowId(prefix)} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="1.1" />
    </filter>
  )
}

// The heavy, static half: the glow aura (the silhouette blurred and filled
// the body colour) → the seven stacked shade layers.
// No animation may ever live in this svg (see storyteller.jsx).
export function Friend01Body({ palette = FRIEND01_GREYS, prefix = '' }) {
  return (
    <g>
      <path
        d={FRIEND01_LAYERS[0]}
        fill={palette.glow}
        opacity="0.8"
        filter={`url(#${glowId(prefix)})`}
      />
      {FRIEND01_LAYERS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={palette.ramp[i] ?? palette.ramp[palette.ramp.length - 1]}
        />
      ))}
    </g>
  )
}

// The light, animated half: the canonical yellow eyes, each in its own
// .friend-eye-blink wrapper (index.css). Render inside an <svg> with this
// friend's viewBox and one <EyeDefs prefix/> in its defs.
export function Friend01Eyes({ prefix = '' }) {
  return (
    <g>
      {FRIEND01_EYES.map((eye, i) => (
        <g key={i} className="friend-eye-blink">
          <Eye cx={eye.cx} cy={eye.cy} r={eye.r} prefix={prefix} />
        </g>
      ))}
    </g>
  )
}
