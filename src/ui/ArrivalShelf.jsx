// The arrival shelf (T3.2): arriving drops sit at the top of the page
// for a few seconds before fading away (Kimia's decision 2026-07-19).
// Clicking an object HOLDS it — it stops fading and says what it is;
// clicking again lets it go. Deeper click behaviour (gather / decline /
// compost) arrives with T3.3.
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

function ShelfItem({ arrival, onExpire }) {
  const [held, setHeld] = useState(false)
  const fading = !held && !arrival.awaitingReveal
  return (
    <button
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
      onClick={() => setHeld(!held)}
      title={held ? '' : 'click to hold'}
    >
      <DropGlyph kind={arrival.key} />
      {held && <span className="arrival-caption">{arrivalLabel(arrival)}</span>}
    </button>
  )
}

function ArrivalShelf({ arrivals, onExpire }) {
  if (arrivals.length === 0) return null
  return (
    <section className="arrival-shelf" aria-label="arrivals">
      {arrivals.map((arrival) => (
        <ShelfItem key={arrival.id} arrival={arrival} onExpire={onExpire} />
      ))}
    </section>
  )
}

export default ArrivalShelf
