// The first-occurrence reveals (T3.2): each of the five drop families
// introduces itself the first time it ever arrives (spec §5 "How
// rewards arrive"). This is where the neon POP lives (spec §7) — the
// one place bright colour is allowed to shout. The overlay waits to be
// dismissed; nothing fades on its own.
//
// Since T3.4 the words come from the keyed narration slots
// (src/content/narration.js, human-written per design-notes §7); an
// empty slot simply renders nothing. Only the stream colour mapping
// lives here — presentation, not story.

import { narrationSlot } from '../content/narration.js'
import DropGlyph from './DropGlyph.jsx'

const STREAMS = {
  flora: 'flora',
  magazine: 'reading',
  novel: 'reading',
  dictionary: 'reading',
  fungi: 'fungi',
}

function FirstReveal({ arrival, onDismiss }) {
  const title = narrationSlot(`firstReveals.${arrival.key}.title`)
  const line = narrationSlot(`firstReveals.${arrival.key}.line`)
  return (
    <div
      className="reveal-overlay"
      role="dialog"
      aria-label={title ?? 'a first arrival'}
    >
      <div className={`reveal reveal-${STREAMS[arrival.key]}`}>
        <DropGlyph kind={arrival.key} className="reveal-glyph" />
        {title && <h2 className="reveal-title">{title}</h2>}
        {line && <p className="reveal-line">{line}</p>}
        <button className="reveal-button" onClick={onDismiss}>
          onward
        </button>
      </div>
    </div>
  )
}

export default FirstReveal
