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
import BookFigure from './BookFigure.jsx'
import DropGlyph from './DropGlyph.jsx'
import Flora from './Flora.jsx'
import { floraBaseWhereSmallestIs } from './floraCanon.js'
import { useText } from './language.jsx'

// HOW BIG THE FIRST FLORA IS (T5.3i, 2026-08-21). This screen shows one drop
// and nothing beside it, and only flora among the living things reach it — the
// friends have their own reveal — so it sizes from the smallest FLORA rather
// than the smallest friend. 4rem is what the placeholder sprig stood at here,
// so a small flora arrives exactly as big as the drawing it replaces, and a
// large one arrives 2.75x that, as it must.
const REVEAL_BASE_REM = floraBaseWhereSmallestIs(4)

// HOW BIG THE FIRST BOOK IS (2026-10-11): the real T5.3n cover, in the
// shade it will wear on the Bookcase, at the size Kimia approved off the
// option sheet — a magazine about 4rem tall, the others a little taller.
const REVEAL_BOOK_REM_PER_UNIT = 0.6 / 16

const STREAMS = {
  flora: 'flora',
  magazine: 'reading',
  novel: 'reading',
  dictionary: 'reading',
  fungi: 'fungi',
}

function FirstReveal({ arrival, worldSeed, onDismiss }) {
  const { t } = useText()
  const title = narrationSlot(`firstReveals.${arrival.key}.title`)
  const line = narrationSlot(`firstReveals.${arrival.key}.line`)
  return (
    <div
      className="reveal-overlay"
      role="dialog"
      aria-label={title ?? t('reveal.firstArrival')}
    >
      <div className={`reveal reveal-${STREAMS[arrival.key]}`}>
        {arrival.key === 'flora' ? (
          <Flora
            completionId={arrival.completionId}
            worldSeed={worldSeed}
            base={REVEAL_BASE_REM}
            unit="rem"
            idPrefix="first-reveal-"
            className="reveal-flora-art"
          />
        ) : STREAMS[arrival.key] === 'reading' ? (
          <BookFigure
            type={arrival.key}
            id={arrival.id}
            remPerUnit={REVEAL_BOOK_REM_PER_UNIT}
            className="reveal-book-art"
          />
        ) : (
          <DropGlyph kind={arrival.key} className="reveal-glyph" />
        )}
        {title && <h2 className="reveal-title">{title}</h2>}
        {line && <p className="reveal-line">{line}</p>}
        <button className="reveal-button" onClick={onDismiss}>
          {t('reveal.onward')}
        </button>
      </div>
    </div>
  )
}

export default FirstReveal
