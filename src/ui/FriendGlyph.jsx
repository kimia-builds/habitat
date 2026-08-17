// The friends of N-Z-D (T4.4): placeholder art until the T5.3 art
// pass, grown from the same trick as the curiosities and the Map's
// regions — one abstract line-drawn form per friend CATEGORY. Weird over
// cute (design-notes §8): suggested anatomy, never a face.
//
// ITS COLOUR IS NO LONGER THE PLACEHOLDER'S OWN (2026-08-17). The form
// here is still a stand-in for Kimia's real drawing, but the colour it
// wears is the settled one: one of the ten friend colours, dealt to this
// individual by this save's shuffle (friendColours.js). So a friend looks
// the same everywhere — the reveal, the Guest Book, the party — no two
// individuals of a species share a colour, and swapping the real drawing
// in later changes the shape without disturbing the palette.
//
// The signature category ANIMATION is not here — it lives in index.css
// (one keyframes class per category, friend-anim-<key>), applied by
// the two moments allowed to play it: the arrival reveal and the Guest
// Book card (decision 2026-07-20; party mode never plays it).

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { individualColour } from './friendColours.js'
import { toneAtLightness } from './friendPalettes.js'

// How light the line-art stands before its colour's own lift pales it
// further. The friend colours are built against Kimia's shading, whose mid
// tone sits near 55% — a line drawing on a dark page needs to be brighter
// than a mid tone to read at all, so it is drawn near the top of the ramp.
const GLYPH_LIGHTNESS = 62

// The ten forms, one per category, each drawn in the same 24×24 frame
// and wearing currentColor (the ObjectGlyph precedent — an object keyed
// by the category key, so no index wrangling).
const FORMS = {
  // plips — a loose wisp, passing through.
  plip: (
    <>
      <path
        d="M3 14C6 11 8 16 11 13C14 10 16 15 21 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="8" r="1.2" fill="currentColor" />
    </>
  ),
  // baluhms — a small curled hollow with someone inside.
  baluhm: (
    <>
      <path
        d="M12 20C7 20 4 16.5 4 12.5C4 8 7.5 4.5 12 4.5C16.5 4.5 20 8 20 12.5C20 15 18 17 15.5 17C13.5 17 12 15.5 12 13.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="11.5" r="1.6" fill="currentColor" />
    </>
  ),
  // krupengks — one shape and its echo, a beat behind.
  krupengk: (
    <>
      <path
        d="M8 5C5.5 8 5.5 16 8 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 7C11.5 9.5 11.5 14.5 14 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M19.5 9.5C18 11 18 13 19.5 14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </>
  ),
  // zalas — a being of light-signals: rays around a core.
  zala: (
    <>
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 4V7M12 17V20M4 12H7M17 12H20M6.3 6.3L8.4 8.4M15.6 15.6L17.7 17.7M17.7 6.3L15.6 8.4M8.4 15.6L6.3 17.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </>
  ),
  // liwi bi-jijis — a young one, all upward reach.
  'liwi-bi-jiji': (
    <>
      <path
        d="M12 21V13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 13C8.5 13 6 10.5 6 7C9.5 7 12 9.5 12 13Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 11C12 7.5 14.5 5 18 5C18 8.5 15.5 11 12 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </>
  ),
  // meuhys — the small talk, tumbling.
  meuhy: (
    <>
      <path
        d="M4 8L7 10.5L10 7.5L13 10L16 7.5L20 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14L9 16.5L12 13.5L15 16L18 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <circle cx="12" cy="19.5" r="1.1" fill="currentColor" opacity="0.8" />
    </>
  ),
  // rassatts — two rings, overlapping: invited in.
  rassatt: (
    <>
      <circle
        cx="9"
        cy="12"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="15"
        cy="12"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </>
  ),
  // woigolps — a slow spiral, a tale unrolling.
  woigolp: (
    <path
      d="M12 12C12 11 13 10.5 13.5 11.2C14.2 12.2 13 13.8 11.3 13.4C9.2 12.9 8.6 10.2 10.4 8.6C12.6 6.6 16.4 7.6 17.4 10.4C18.6 13.8 15.8 17.6 11.9 17.4C7.6 17.2 4.9 13 6.7 9.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  ),
  // chitus — the deep angle: a held, deliberate tilt.
  chitu: (
    <>
      <path
        d="M12 4L20 18H4L12 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="1.4" fill="currentColor" />
    </>
  ),
  // hamdi bulos — a single tall flame of a line, a spark above it.
  'hamdi-bulo': (
    <>
      <path
        d="M12 21C9 16.5 14 13.5 11.5 9C10.8 7.6 11 5.5 12.5 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="15.5" cy="7.5" r="1.1" fill="currentColor" />
    </>
  ),
}

function FriendGlyph({
  category,
  individual = 1,
  worldSeed,
  className = 'friend-glyph',
  ...rest
}) {
  const key = FRIEND_CATEGORIES[category]?.key
  // The colour is one of the ten friend colours (friendColours.js), dealt
  // to this individual by this save's own shuffle — random from player to
  // player, fixed within a game, and never twice within a species (Kimia,
  // 2026-08-17). It replaces the free-roaming hue this placeholder used to
  // roll for itself, so the line-art already wears the settled palette that
  // the real drawings will wear when they land.
  const colour = individualColour(key, individual, worldSeed)
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ color: toneAtLightness(colour, GLYPH_LIGHTNESS) }}
      aria-hidden="true"
      {...rest}
    >
      {FORMS[key]}
    </svg>
  )
}

export default FriendGlyph
