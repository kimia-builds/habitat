// ViewportGate — the app-root device gate (T5.1b, spec §3, decided
// 2026-07-23). Habitat is desktop/laptop only: below a threshold
// viewport width the WHOLE app is replaced by one full-screen message;
// at that width and wider it renders exactly as today.
//
// Why a JS gate that swaps the tree, not a CSS media query that hides
// it: below the threshold `children` (the App) never mounts, so nothing
// inside it runs on a blocked screen — no timers, and in particular no
// daily startup animation. That is why the design says the desktop-only
// startup (§12f) simply "lives inside" this gate rather than needing its
// own device check: being inside the app, it only ever runs on desktop.
//
// This is a REVERSIBLE gate: it wraps the app and changes nothing
// within it, so a future responsive pass just removes/softens the gate
// and adds small-screen layouts — nothing built today is lost.

import { useEffect, useState } from 'react'
import { blockedMessage } from '../content/blocked.js'

// The exact threshold from the decision: the gate opens AT 1024px, so
// phones and sideways tablets (narrower) are blocked and 1024-and-wider
// render. Named here, next to its only use, rather than as a magic
// number in the check below.
export const MIN_APP_WIDTH = 1024

// Current viewport width, guarded so the module is safe to import in a
// non-browser environment (it just reports "wide enough" there).
function viewportWidth() {
  return typeof window === 'undefined' ? MIN_APP_WIDTH : window.innerWidth
}

function ViewportGate({ children }) {
  const [width, setWidth] = useState(viewportWidth)

  // Re-check on every resize so the swap is live: narrowing a desktop
  // window under the threshold shows the block, widening it back shows
  // the app again (this also covers a tablet turned on its side). The
  // one immediate read guards against the width changing between the
  // first render and this effect running.
  useEffect(() => {
    const onResize = () => setWidth(viewportWidth())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (width >= MIN_APP_WIDTH) return children

  // Too narrow: the app is not mounted at all. One message, its words a
  // Kimia-written content slot; while the slot is blank the screen stays
  // calm and wordless rather than showing invented copy (design-notes
  // §7). Same deep-space near-black as the rest of Habitat.
  const message = blockedMessage()
  return (
    <main className="viewport-block">
      {message && <p className="viewport-block-message">{message}</p>}
    </main>
  )
}

export default ViewportGate
