// The star-shimmer on an arriving drop (T5.2e, design-notes §5).
//
// §5's decision (2026-07-19): a regular drop gains "a small, brief
// star-shimmer on arrival — a light touch over the quiet pastel, not a
// takeover". The full firework stays reserved for first-occurrence
// reveals and friend arrivals, and is a later slice.
//
// Kimia's call (2026-08-13): the stars pop AROUND THE BLOB'S EDGE, so
// the whole arrival sparkles as it lands rather than only the small
// object inside it.
//
// The positions are AUTHORED, not generated — nine points written as
// percentages of whatever box they are laid over, so one table fits
// every arrival at every size. That is the same reasoning the blob
// outlines follow (authored once in one frame, then stretched): nothing
// is measured and no geometry runs at render time.
//
// Each star also carries its own small offset, written in the order the
// sparkle travels around the shape — so the shimmer runs round the blob
// instead of flashing all at once.

// A four-pointed sparkle with concave sides, drawn once in a 24×24
// frame centred on 12,12 — the shape a "star" means when it is a glint
// rather than one of the sky's specks.
const SPARKLE =
  'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z'

// x/y are percentages of the box the shimmer is laid over and place the
// star's CENTRE; size is in px, because a star is artwork and stays the
// same size whether its blob came out wide or narrow; `at` is when this
// star pops, in ms after the shimmer starts.
const STARS = [
  { x: 7, y: 26, size: 9, at: 0 },
  { x: 25, y: -6, size: 7, at: 60 },
  { x: 48, y: 2, size: 11, at: 120 },
  { x: 72, y: -4, size: 8, at: 175 },
  { x: 96, y: 34, size: 9, at: 230 },
  { x: 86, y: 90, size: 7, at: 285 },
  { x: 58, y: 101, size: 10, at: 340 },
  { x: 30, y: 97, size: 8, at: 395 },
  { x: 3, y: 74, size: 7, at: 450 },
]

// How far apart two drops landing together start their shimmers
// (Kimia's call 2026-08-13: "one after another, quickly"). A morning
// check-in can close with several arrivals at once; a tenth of a second
// between them reads as several finds rather than one flash.
export const SHIMMER_STAGGER_MS = 90

// `delayMs` holds the whole shimmer back — the shelf uses it to
// cascade several arrivals. Everything else is decoration: it carries
// no words, sits behind nothing pressable, and is hidden from screen
// readers.
function StarShimmer({ delayMs = 0 }) {
  return (
    <span className="shimmer" aria-hidden="true">
      {STARS.map((star) => (
        <svg
          key={`${star.x}-${star.y}`}
          className="shimmer-star"
          viewBox="0 0 24 24"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${delayMs + star.at}ms`,
          }}
        >
          <path d={SPARKLE} />
        </svg>
      ))}
    </span>
  )
}

export default StarShimmer
