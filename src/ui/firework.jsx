// The full firework (T5.2e, design-notes §5) — the big sibling of the
// star-shimmer.
//
// §5's decision (2026-07-19) reserved it for first-occurrence reveals
// and friend arrivals. **Kimia moved it on 2026-08-16**: those reveals
// already take the whole screen and shout in neon, so a firework there
// was decoration on top of a takeover. The firework belongs instead to
// the moment that celebrates HER rather than a thing arriving — the
// home-screen cameo (T4.6, design-notes §8), where a friend turns up to
// mark a big win. And not every win: only a **record streak** and a
// **50-lived-day milestone**, the two that mark something never done
// before. A big day can happen again next week and keeps its quiet
// visit — scarcity is what makes these gestures land (§8).
//
// Her calls on how it looks (2026-08-16):
//
//   • it rings the WHOLE VISIT — the friend, their name and the message
//     together — not just the art;
//   • the same night-sky stars as the shimmer: half white, half across
//     the six charm colours, each glowing its own colour. The two are
//     one family, and this is the larger member;
//   • the stars TRAVEL OUTWARD and fade as they go. This is the one
//     thing the shimmer does not do — a shimmer breathes in place, a
//     firework goes off — and it is what makes the two tell apart.
//
// Like the shimmer, the positions are AUTHORED as percentages of
// whatever box they are laid over, so one table fits a cameo at any
// size and nothing is measured at render time.

// The same four-pointed sparkle the shimmer punctuates its ring with,
// drawn in a 24×24 frame centred on 12,12.
const SPARKLE =
  'M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z'

const WHITE = 'var(--shimmer-star)'
const CHARM = (name) => `var(--charm-${name})`

// How far a star flies, in px. Absolute rather than proportional for
// the same reason star sizes are (shimmer.jsx): a star is artwork, and
// the burst should carry the same distance whether the message under it
// ran to one line or two.
const TRAVEL_PX = 30

// x/y are percentages of the box the firework is laid over and give
// each star's RESTING place — where it has arrived by the time it fades
// out. They range well outside 0–100 so the burst clears the visit
// rather than sitting on it. `size` is px. `at` is when this star
// launches, in ms after the firework starts.
//
// Twenty-four stars: twelve white, twelve charm-coloured (two per
// charm), and three sparkles among them as accents — the shimmer's
// proportions, at twice the count.
const STARS = [
  { x: 50, y: -46, size: 3, tone: WHITE, at: 0 },
  { x: 22, y: -34, size: 2.5, tone: CHARM('shell'), at: 40 },
  { x: 76, y: -32, size: 9, tone: WHITE, at: 60, sparkle: true },
  { x: 2, y: -8, size: 3.5, tone: CHARM('crown'), at: 100 },
  { x: 98, y: -6, size: 2, tone: WHITE, at: 120 },
  { x: -18, y: 22, size: 4, tone: CHARM('key'), at: 150 },
  { x: 118, y: 24, size: 2.5, tone: WHITE, at: 170 },
  { x: -26, y: 54, size: 3, tone: CHARM('anchor'), at: 200 },
  { x: 126, y: 52, size: 8, tone: WHITE, at: 220, sparkle: true },
  { x: -20, y: 86, size: 2, tone: CHARM('shield'), at: 260 },
  { x: 120, y: 84, size: 2.5, tone: WHITE, at: 280 },
  { x: 4, y: 112, size: 2.5, tone: CHARM('cherry'), at: 310 },
  { x: 96, y: 114, size: 3, tone: WHITE, at: 330 },
  { x: 28, y: 134, size: 3.5, tone: CHARM('shell'), at: 360 },
  { x: 72, y: 136, size: 2, tone: WHITE, at: 380 },
  { x: 50, y: 148, size: 7, tone: CHARM('crown'), at: 410, sparkle: true },
  { x: 12, y: 62, size: 2.5, tone: WHITE, at: 440 },
  { x: 88, y: 60, size: 3, tone: CHARM('key'), at: 460 },
  { x: 36, y: -20, size: 2, tone: WHITE, at: 490 },
  { x: 64, y: -18, size: 2.5, tone: CHARM('anchor'), at: 510 },
  { x: 8, y: 34, size: 3, tone: WHITE, at: 540 },
  { x: 92, y: 36, size: 2, tone: CHARM('shield'), at: 560 },
  { x: 40, y: 124, size: 2.5, tone: WHITE, at: 590 },
  { x: 60, y: 126, size: 3.5, tone: CHARM('cherry'), at: 610 },
]

// Where a star STARTS: TRAVEL_PX back along the line to the centre of
// the box, so every star flies straight outwards from the middle of the
// visit. Worked out once when this module loads, from the authored
// table — no DOM is measured and nothing runs per render.
function launchOffset({ x, y }) {
  const dx = x - 50
  const dy = y - 50
  const distance = Math.hypot(dx, dy) || 1
  return {
    fx: `${(-TRAVEL_PX * dx) / distance}px`,
    fy: `${(-TRAVEL_PX * dy) / distance}px`,
  }
}

const LAUNCHED = STARS.map((star) => ({ ...star, ...launchOffset(star) }))

// The whole burst is decoration: it carries no words, sits behind
// nothing pressable, and is hidden from screen readers. The cameo's
// message is what a reader hears, exactly as before.
function Firework() {
  return (
    <span className="firework" aria-hidden="true">
      {LAUNCHED.map((star) => (
        <svg
          key={`${star.x}-${star.y}`}
          className="firework-star"
          viewBox="0 0 24 24"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            color: star.tone,
            animationDelay: `${star.at}ms`,
            '--fly-x': star.fx,
            '--fly-y': star.fy,
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

export default Firework
