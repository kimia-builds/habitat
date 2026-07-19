// The arrival shelf (T3.2): arriving drops sit at the top of the page
// for a few seconds before fading away (Kimia's decision 2026-07-19).
// Clicking an object HOLDS it — it stops fading and says what it is;
// clicking again lets it go.
//
// Since T3.3, a held FLORA find also offers its decision: gather (it
// goes home to the Abode) or leave it (it stays where it grows). No
// pressure either way — an arrival that fades undecided simply waits
// on the Abode page (Kimia's decision 2026-07-19). Reading material and
// fungi keep arriving decision-free: always kept, always banked.
//
// An arrival that still owes its first-occurrence reveal never fades —
// it waits on the shelf until the reveal has been seen.

import { useState } from 'react'
import { ARRIVAL_LINGER_MS } from '../game/constants.js'
import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'

// Which stream's colour an arrival wears.
const STREAM_OF = {
  flora: 'flora',
  magazine: 'reading',
  novel: 'reading',
  dictionary: 'reading',
  fungi: 'fungi',
}

function ShelfItem({ arrival, onExpire, onDecide }) {
  const [held, setHeld] = useState(false)
  const fading = !held && !arrival.awaitingReveal
  // The choice belongs to a held, still-undecided flora find only.
  const deciding =
    held && arrival.key === 'flora' && arrival.status === 'pending'
  return (
    <div
      className={`arrival arrival-${STREAM_OF[arrival.key]}`}
      // The whole linger-then-fade lives in one CSS animation, so the
      // browser owns the clock; when it ends, the arrival is let go.
      // Holding (or an unseen reveal) removes the animation — opacity
      // snaps back to 1 and no timer runs.
      style={
        fading
          ? { animation: `arrival-fade ${ARRIVAL_LINGER_MS}ms ease forwards` }
          : undefined
      }
      onAnimationEnd={() => fading && onExpire(arrival.id)}
    >
      <button
        className="arrival-hold"
        onClick={() => setHeld(!held)}
        title={held ? '' : 'click to hold'}
      >
        <DropGlyph kind={arrival.key} />
        {held && (
          <span className="arrival-caption">{arrivalLabel(arrival)}</span>
        )}
      </button>
      {deciding && (
        <>
          <button
            className="arrival-choice"
            onClick={() => onDecide(arrival.completionId, 'gathered')}
          >
            gather
          </button>
          <button
            className="arrival-choice"
            onClick={() => onDecide(arrival.completionId, 'left')}
          >
            leave it
          </button>
        </>
      )}
      {held && arrival.key === 'flora' && arrival.status !== 'pending' && (
        <span className="arrival-caption habit-meta">· {arrival.status}</span>
      )}
    </div>
  )
}

function ArrivalShelf({ arrivals, onExpire, onDecide }) {
  if (arrivals.length === 0) return null
  return (
    <section className="arrival-shelf" aria-label="arrivals">
      {arrivals.map((arrival) => (
        <ShelfItem
          key={arrival.id}
          arrival={arrival}
          onExpire={onExpire}
          onDecide={onDecide}
        />
      ))}
    </section>
  )
}

export default ArrivalShelf
