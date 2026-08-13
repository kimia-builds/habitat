// The daily startup ceremony (T5.2e, design-notes §12f). On the first
// visit of each Habitat day the rolling planet takes the whole screen,
// holds it for a few seconds, then fades out and hands the day over.
// T4.5 held this slot with a plain black fade; the planet replaces it.
//
// THE SHAPE OF THE MOMENT — two phases, and that is all:
//
//   hold    the planet has the screen (STARTUP_HOLD_MS)
//   leaving it fades away, revealing the app beneath (STARTUP_FADE_MS)
//           and then tells App the moment has played, which is when App
//           remembers the day in settings.startupShownOn
//
// A tap during the hold ends it early and goes straight to the fade —
// §12f's "never blocking": the ceremony is offered, never enforced. The
// fade itself is never skipped, because it IS the handover to the app
// rather than a delay before one.
//
// It says nothing and shows nothing to read: no text, no numbers, no
// narration slot, no achievement (§12f — nothing to read means nothing
// to miss). It is identical every day; only the colour changes, and only
// on Sundays.
//
// WHY IT IS SAFE TO LET IT COVER THE SCREEN, TWICE OVER: while it holds,
// it deliberately DOES take taps, because a tap is how you dismiss it.
// The instant it starts leaving it stops taking them, so a click during
// the fade lands on the app underneath rather than on a ghost — and it
// unmounts the moment the fade ends.
//
// DESKTOP ONLY, for free (§12f, §13d): the whole app lives inside
// ViewportGate, which does not mount its children below MIN_APP_WIDTH.
// A screen too narrow for Habitat never renders this component at all,
// so the animation needs no device check of its own.

import { useEffect, useState } from 'react'
import { STARTUP_FADE_MS, STARTUP_HOLD_MS } from '../game/constants.js'
import { startupCharm } from '../game/startup.js'
import { SYMBOL_COLORS } from './symbols.js'
import { RollingPlanet } from './planet.jsx'

function Startup({ todayKey, onDone }) {
  // Drawn once, on mount, and never re-drawn: on a Sunday the colour is a
  // random pick, and a colour that could change mid-ceremony would be a
  // flicker, not a reveal. useState's initialiser runs exactly once.
  const [charm] = useState(() => startupCharm(todayKey))
  const [leaving, setLeaving] = useState(false)

  // Phase one: hold, then start leaving on our own.
  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), STARTUP_HOLD_MS)
    return () => clearTimeout(timer)
    // The ceremony plays once per mount — App unmounts it when it saves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Phase two: whatever ended the hold — the timer above or a tap — the
  // fade runs for exactly as long as the CSS says, then App is told.
  useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(onDone, STARTUP_FADE_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  return (
    <div
      className={`startup${leaving ? ' startup--leaving' : ''}`}
      // The fade's length is handed to the CSS from the same constant the
      // timer above uses, so the two can never drift apart. Set as the
      // duration directly rather than as a custom property: a `var()` the
      // stylesheet asks for but never defines is exactly what
      // tokens.test.js exists to catch, and it would be right to.
      style={{ animationDuration: `${STARTUP_FADE_MS}ms` }}
      onPointerDown={() => setLeaving(true)}
      aria-hidden="true"
    >
      <RollingPlanet color={SYMBOL_COLORS[charm]} />
    </div>
  )
}

export default Startup
