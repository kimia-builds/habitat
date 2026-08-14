// The star-shimmer on an arriving drop (T5.2e, design-notes §5).
//
// §5's decision (2026-07-19): a regular drop gains "a small, brief
// star-shimmer on arrival — a light touch over the quiet pastel, not a
// takeover". The full firework stays reserved for first-occurrence
// reveals and friend arrivals, and is a later slice.
//
// Kimia's calls (2026-08-13): the stars pop AROUND THE BLOB'S EDGE, so
// the whole arrival sparkles rather than only the small object inside
// it — and after seeing the first build ("it's giving Las Vegas"), the
// sparkle became NIGHT SKY rather than fairground:
//
//   • mostly DOTS, at the sky's own range of sizes (sky.jsx: specks,
//     mids, the odd gem) — only two four-pointed sparkles survive, as
//     the accents they should have been;
//   • half white, half across the SIX CHARM COLOURS. The sky itself
//     stays white-only (design-bible §3); this is a momentary event on
//     a lit blob, not a star field, and the charms are where Habitat's
//     colour already lives;
//   • SLOWER. Each star takes well over a second to breathe in and out,
//     and they arrive far enough apart that the eye follows one at a
//     time. The first build dazzled;
//   • WIDER. The ring sits well outside the blob, which is what makes
//     it read as spacious and ethereal instead of a fringe on a card.
//
// The positions are AUTHORED, not generated — written as percentages of
// whatever box they are laid over, so one table fits every arrival at
// every size. That is the same reasoning the blob outlines follow
// (authored once in one frame, then stretched): nothing is measured and
// no geometry runs at render time.

// A four-pointed sparkle with concave sides, drawn once in a 24×24
// frame centred on 12,12. Two of these punctuate the ring; everything
// else is a plain dot.
const SPARKLE =
  'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z'

// Half the ring is white and half is charm-coloured, one star per charm
// — "50% white, 50% a mix of the six" (Kimia, 2026-08-13). Named rather
// than spelled out: the charm colours are canonical in tokens.css, and
// a star asks for them there by name like everything else does.
const WHITE = 'var(--shimmer-star)'
const CHARM = (name) => `var(--charm-${name})`

// x/y are percentages of the box the shimmer is laid over and place the
// star's CENTRE; they range well outside 0–100 on purpose, so the ring
// stands off the blob rather than hugging it. `size` is in px, because
// a star is artwork and stays the same size whether its blob came out
// wide or narrow — the range is the night sky's own (sky.jsx), with the
// two sparkles necessarily larger to read as a shape at all. `at` is
// when this star begins, in ms after the shimmer starts.
const STARS = [
  { x: 10, y: -38, size: 3, tone: WHITE, at: 0 },
  { x: 46, y: -64, size: 2.5, tone: CHARM('shell'), at: 110 },
  { x: 78, y: -34, size: 9, tone: WHITE, at: 230, sparkle: true },
  { x: 105, y: 28, size: 3.5, tone: CHARM('crown'), at: 360 },
  { x: 96, y: 120, size: 2, tone: WHITE, at: 480 },
  { x: 66, y: 154, size: 4, tone: CHARM('key'), at: 600 },
  { x: 34, y: 170, size: 2.5, tone: WHITE, at: 730 },
  { x: 6, y: 142, size: 3, tone: CHARM('anchor'), at: 850 },
  { x: -8, y: 66, size: 8, tone: WHITE, at: 980, sparkle: true },
  { x: -3, y: 4, size: 2, tone: CHARM('shield'), at: 1100 },
  { x: 26, y: -80, size: 2.5, tone: WHITE, at: 1220 },
  { x: 112, y: 84, size: 2.5, tone: CHARM('cherry'), at: 1340 },
]

// How far apart two drops landing together start their shimmers
// (Kimia's call 2026-08-13: "one after another, quickly"). A morning
// check-in can close with several arrivals at once, and this is what
// makes them read as several finds rather than one flash.
export const SHIMMER_STAGGER_MS = 140

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
            // Its own colour, which it also glows with (index.css) — so
            // a charm-coloured star carries its own small halo rather
            // than borrowing the arrival's.
            color: star.tone,
            animationDelay: `${delayMs + star.at}ms`,
          }}
        >
          {star.sparkle ? (
            <path d={SPARKLE} />
          ) : (
            <circle cx="12" cy="12" r="12" />
          )}
        </svg>
      ))}
    </span>
  )
}

export default StarShimmer
