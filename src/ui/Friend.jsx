// A FRIEND, DRAWN FOR REAL (2026-08-21) — the one component every screen
// that shows a friend goes through, and the end of the T4.4 placeholder
// line-art for the screens that have adopted it.
//
// It puts together the three things the code knows about a friend, each of
// which was settled on its own and lives in its own file:
//
//   the DRAWING   — Kimia's traced archetype for this species
//                   (tracedFriends.js → friendNN.jsx)
//   the SIZE      — its place in the one scale the cast shares
//                   (friendCanon.js), never a number typed in by hand
//   the COLOUR    — the pastel this individual was dealt in this save
//                   (friendColours.js), painted onto the trace's own greys
//                   (friendPalettes.js)
//
// A SCREEN CHOOSES A BASE, NOT A SIZE. `base` is how much room the LARGEST
// friend gets here; this component multiplies by the canon, so within any one
// screen the ten stand in exactly the character sheet's proportions and a tiny
// friend can never out-size a large one. That is Kimia's "everywhere and
// always" rule, made impossible to break by accident — there is no way to ask
// this component for a friend at a size of your own choosing.
//
// TWO STACKED SVGS, ALWAYS. The heavy static body is painted once; the
// blinking eyes ride in a featherweight overlay above it, sharing the same
// viewBox so they land where Kimia drew them. friend10.jsx's header explains
// why they may never share one svg (a blink would re-blur the whole aura on
// every frame). The wrapper carries the width and the drawing's own shape, so
// an animation class on it moves body and eyes together.
//
// THE GLOW IS THE DRAWING'S OWN. A friend's aura is its silhouette, blurred
// and filled in its body colour, inside the artwork itself (design-bible §3,
// §7) — not a CSS halo like the placeholder wore. What step of the glow scale
// "full" means for the real art is still an eyeball call (§7).

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { friendSize } from './friendCanon.js'
import { individualColour } from './friendColours.js'
import { paletteForTone } from './friendPalettes.js'
import { friendArt } from './tracedFriends.js'

/**
 * `category`   which species, as the game counts them (friend.category)
 * `individual` which one of that species, 1-based, in arrival order
 * `worldSeed`  this save's seed — it decides the colour this friend was dealt
 * `base`       how much room the LARGEST friend gets on this screen
 * `unit`       the unit `base` is in. 'rem' for a screen laid out in text
 *              sizes, which is most of them; 'px' for a screen whose scale is
 *              fixed pixels — the Abode's canvas is 1000 x 600 of them, and a
 *              friend standing among flora measured in those must be measured
 *              in the same thing or a text-zoom would silently break the one
 *              scale the two families share.
 * `idPrefix`   what makes this drawing's internal svg ids its own. Two friends
 *              on one page sharing an id would have one silently borrow the
 *              other's glow filter, so every caller passes something that says
 *              where on the page this one is.
 * `className`  extra classes for the wrapper — the signature category
 *              animation arrives this way in the moments allowed to play it.
 */
function Friend({
  category,
  individual = 1,
  worldSeed,
  base,
  unit = 'rem',
  idPrefix = '',
  className = '',
}) {
  const key = FRIEND_CATEGORIES[category]?.key
  const art = friendArt(key)
  // Every one of the ten has a drawing (tracedFriends.test.js proves it), so this
  // only ever means a bad category was passed. Nothing is drawn rather than
  // something wrong being drawn.
  if (!art) return null

  const { Body, BodyDefs, Eyes, EyeDefs, viewBox, greys } = art
  const colour = individualColour(key, individual, worldSeed)
  // The trace's own greys re-painted in this individual's colour. `greys.base`
  // is the reconstructed darkest shade the banded traces carry and the stacked
  // ones do not — passing undefined for those is exactly right.
  const palette = paletteForTone(greys.ramp, colour, greys.base)
  const prefix = `${idPrefix}${key}-${individual}-`
  const box = `0 0 ${viewBox.w} ${viewBox.h}`

  return (
    <span
      className={`friend-art ${className}`.trim()}
      style={{
        width: `${friendSize(key, base)}${unit}`,
        aspectRatio: `${viewBox.w} / ${viewBox.h}`,
      }}
      aria-hidden="true"
    >
      <svg className="friend-art-layer" viewBox={box}>
        <defs>
          <BodyDefs prefix={prefix} />
        </defs>
        <Body palette={palette} prefix={prefix} />
      </svg>
      <svg className="friend-art-layer" viewBox={box}>
        <defs>
          <EyeDefs prefix={prefix} />
        </defs>
        <Eyes prefix={prefix} />
      </svg>
    </span>
  )
}

export default Friend
