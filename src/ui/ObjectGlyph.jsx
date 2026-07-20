// The market curiosities (T4.3b): placeholder art until the T5.3 art
// pass, grown from the same trick as the Map's regions — every
// curiosity's shape and glow colour is a pure function of the world
// seed and the object's stable key, never render-time randomness, so
// one curiosity looks the same every time it appears, on the stall and
// in the Abode alike. (The world seed travels in backups, so the look
// survives export/import too.)
//
// Four abstract line-drawn forms — weird over cute (design-notes §9),
// objects with no obvious purpose, exactly as spec §5 Stream 3 orders.
// The hue sits in the planet's everyday pastel register (150°–310°,
// the Map's own range): these things are OF N-Z-D. Neon stays reserved
// for POP moments, as ever.

import { randomUnit } from '../game/drops.js'

// One seeded number 0..1 for a named part of one curiosity's look.
function unit(worldSeed, objectKey, part) {
  return randomUnit(`${worldSeed}|object|${objectKey}|${part}`)
}

// The four forms, keyed by name (the DropGlyph precedent — an object,
// not an array, so no jsx-key wrangling), each drawn in the same 24×24
// frame and wearing currentColor, so the seeded colour arrives as one
// style.
const SHAPES = {
  // A hovering orb with its tilted ring — gravity not guaranteed.
  orb: (
    <>
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        transform="rotate(-18 12 12)"
      />
    </>
  ),
  // A pair of slim shards, leaning apart.
  shards: (
    <>
      <path
        d="M7.5 20.5L9.8 5.5L13 20.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 20.5L16.4 10L19 20.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  // A pod with a seam and a single floating spore.
  pod: (
    <>
      <path
        d="M12 3.5C7.2 3.5 4.8 8.2 4.8 12.7C4.8 17.9 8 20.5 12 20.5C16 20.5 19.2 17.9 19.2 12.7C19.2 8.2 16.8 3.5 12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.5C10.2 8.2 10.2 15.4 12 20.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="14.6" cy="10.5" r="1.1" fill="currentColor" />
    </>
  ),
  // A loose curl, unspooling upward.
  curl: (
    <path
      d="M12 12.2C12 10.6 14 10.4 14.2 12C14.4 14.2 11 14.6 9.4 12.4C7.4 9.6 10.6 5.4 14.4 6.4C18.6 7.6 19.4 13.4 15.8 16.6C13.2 18.9 9 18.3 7.2 15.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  ),
}

const SHAPE_NAMES = Object.keys(SHAPES)

function ObjectGlyph({
  objectKey,
  worldSeed,
  className = 'object-glyph',
  ...rest
}) {
  const shape =
    SHAPES[
      SHAPE_NAMES[
        Math.floor(unit(worldSeed, objectKey, 'shape') * SHAPE_NAMES.length)
      ]
    ]
  const hue = Math.round(150 + unit(worldSeed, objectKey, 'hue') * 160)
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ color: `hsl(${hue} 65% 62%)` }}
      aria-hidden="true"
      {...rest}
    >
      {shape}
    </svg>
  )
}

export default ObjectGlyph
