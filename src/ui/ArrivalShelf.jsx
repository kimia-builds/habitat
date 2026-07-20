// The arrival shelf (T3.2): arriving drops sit at the top of the page
// for a few seconds before fading away (Kimia's decision 2026-07-19).
// Clicking an object HOLDS it — it stops fading and says what it is;
// clicking again lets it go.
//
// Since T3.3, a held FLORA find also offers its decision: gather (it
// goes home to the Abode) or leave it (it stays where it grows). No
// pressure either way — an arrival that fades undecided simply waits
// on the Abode page (Kimia's decision 2026-07-19).
//
// Since T3.5, held READING MATERIAL offers the symmetric choice: read
// now (the spread popup opens) or read later (the arrival just lets
// go). Unlike flora there is nothing to lose and nothing to store —
// the piece is in the Bookcase either way, re-readable anytime.
// Fungi stay choice-free: currency has only exchange value, so it
// banks itself.
//
// Since T4.4, an arriving FRIEND lingers on the shelf too — always
// choice-free (a friend simply joins the community); their reveal is
// owed first, so like a first-occurrence arrival they never fade until
// it has played.
//
// An arrival that still owes its first-occurrence reveal never fades —
// it waits on the shelf until the reveal has been seen.

import { useState } from 'react'
import { ARRIVAL_LINGER_MS } from '../game/constants.js'
import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'
import FriendGlyph from './FriendGlyph.jsx'

// Which stream's colour an arrival wears.
const STREAM_OF = {
  flora: 'flora',
  magazine: 'reading',
  novel: 'reading',
  dictionary: 'reading',
  fungi: 'fungi',
  friend: 'friend',
}

function ShelfItem({ arrival, worldSeed, onExpire, onDecide, onRead }) {
  const [held, setHeld] = useState(false)
  const fading = !held && !arrival.awaitingReveal
  // The choice belongs to a held, still-undecided flora find only.
  const deciding =
    held && arrival.key === 'flora' && arrival.status === 'pending'
  // Held reading material always offers its choice — nothing is ever
  // decided or stored about reading, so there is no state to check.
  const reading = held && STREAM_OF[arrival.key] === 'reading'
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
        {arrival.key === 'friend' ? (
          <FriendGlyph
            category={arrival.friend.category}
            individual={arrival.friend.individual}
            worldSeed={worldSeed}
            className="drop-glyph"
          />
        ) : (
          <DropGlyph kind={arrival.key} />
        )}
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
      {reading && (
        <>
          <button className="arrival-choice" onClick={() => onRead(arrival)}>
            read now
          </button>
          <button
            className="arrival-choice"
            onClick={() => onExpire(arrival.id)}
          >
            read later
          </button>
        </>
      )}
      {held && arrival.key === 'flora' && arrival.status !== 'pending' && (
        <span className="arrival-caption habit-meta">· {arrival.status}</span>
      )}
    </div>
  )
}

function ArrivalShelf({ arrivals, worldSeed, onExpire, onDecide, onRead }) {
  if (arrivals.length === 0) return null
  return (
    <section className="arrival-shelf" aria-label="arrivals">
      {arrivals.map((arrival) => (
        <ShelfItem
          key={arrival.id}
          arrival={arrival}
          worldSeed={worldSeed}
          onExpire={onExpire}
          onDecide={onDecide}
          onRead={onRead}
        />
      ))}
    </section>
  )
}

export default ArrivalShelf
