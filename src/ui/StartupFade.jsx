// The daily startup moment (T4.5 plumbing; the real animation is T5.2,
// design-notes §12f). On the first visit of each Habitat day the screen
// fades in from black — T4.5 holds the slot with this plain fade: a
// black veil that lifts over STARTUP_FADE_MS, then tells App the moment
// has played (App remembers the day in settings.startupShownOn).
//
// The veil deliberately never intercepts a tap (`pointer-events: none`
// in the CSS): §12f's "never blocking" rule holds even for the
// placeholder. Tap-to-skip arrives with the real animation, which is
// also when this becomes pretty — a slither of glowing planet, spinning
// slowly. Until then it says nothing, shows nothing, stores nothing of
// its own.

import { useEffect } from 'react'
import { STARTUP_FADE_MS } from '../game/constants.js'

function StartupFade({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, STARTUP_FADE_MS)
    return () => clearTimeout(timer)
    // The fade plays once per mount — App unmounts it when it saves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="startup-fade" aria-hidden="true" />
}

export default StartupFade
