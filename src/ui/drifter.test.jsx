// Tests for the pilot Drifter assembly (T5.3b). The Drifter is art, so these
// prove only the RECIPE that design-bible §9c pins down — the invariants that
// must survive future tuning — never how it looks:
//   • the hand-drawn trace is used VERBATIM (the assembly layers on it, never
//     edits it);
//   • the Drifter wears exactly TWO canonical eyes (Kimia's call, the baseline
//     other Drifters vary from).
// Eye placement, colours, hair density and glow are all free to change on the
// workbench without touching this file.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Drifter, DrifterDefs, DRIFTER_VIEWBOX } from './drifter.jsx'
import { DRIFTER_SILHOUETTE } from './drifterSilhouette.js'

afterEach(cleanup)

// The Drifter is self-contained: <DrifterDefs/> emits everything it paints with
// (eye gradients, glow blur, its own tinted sponge), all in the same SVG.
function renderDrifter() {
  return render(
    <svg viewBox={`0 0 ${DRIFTER_VIEWBOX.w} ${DRIFTER_VIEWBOX.h}`}>
      <defs>
        <DrifterDefs />
      </defs>
      <Drifter />
    </svg>,
  )
}

describe('pilot Drifter assembly', () => {
  it('draws the hand-drawn silhouette verbatim', () => {
    const { container } = renderDrifter()
    // The exact traced outline appears (glow + body layers both paint it), and
    // it is the untouched trace from the silhouette module.
    const traced = [...container.querySelectorAll('path')].filter(
      (p) => p.getAttribute('d') === DRIFTER_SILHOUETTE.d,
    )
    expect(traced.length).toBeGreaterThan(0)
  })

  it('wears exactly two canonical eyes', () => {
    const { container } = renderDrifter()
    // Every canonical eye paints its lit body from the shared #eye-core
    // gradient, so one such circle == one eye. Two is the Drifter baseline.
    const eyes = [...container.querySelectorAll('circle')].filter((c) =>
      (c.getAttribute('fill') || '').includes('eye-core'),
    )
    expect(eyes).toHaveLength(2)
  })
})
