// ViewportGate — the app-root width gate (T5.1b, spec §3, decided
// 2026-07-23; threshold lowered 2026-08-12). Below a threshold viewport
// width the WHOLE app is replaced by one full-screen message; at that
// width and wider it renders exactly as today.
//
// It is a WIDTH rule, not a device rule (Kimia's call 2026-08-12). It
// began as a desktop-only gate at 1024px, which also happened to keep
// phones and tablets out; at 740px a portrait tablet renders the real
// app. That trade was made knowingly, to stop a desktop window being
// cut off long before the layout gives way.
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

// The threshold, lowered from 1024px to 740px on 2026-08-12 (Kimia's
// call, T5.2d): the window was being cut off long before the layout
// actually gave way. Her rule is that the app should keep rendering for
// as long as the wordmark and the longest possible date still sit on one
// row — that pair needs 656px (24 + 175 + 28 + 405 + 24), the date at its
// widest being "WEDNESDAY 30 MAR 2026".
//
// 740 rather than 656 because a second thing gives way first: the left
// icon rail is fixed at the window's edge while the content column is
// centred, so below about 704px the rail starts sitting on top of the
// habit tiles. 740 keeps 18px of daylight between them. Widening the
// gate further means moving the rail, which is a design change, not a
// number.
//
// Named here, next to its only use, rather than as a magic number in the
// check below.
export const MIN_APP_WIDTH = 740

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
