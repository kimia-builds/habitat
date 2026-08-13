// The arrival shelf (T3.2): arriving drops sit at the top of the page
// for a few seconds before fading away (Kimia's decision 2026-07-19).
// Clicking an object HOLDS it — it stops fading; clicking again lets it
// go.
//
// Since T5.2e (Kimia's call 2026-08-13) the shelf is pinned to the
// TOP RIGHT OF THE WINDOW rather than sitting at the top of the page:
// tap a habit low down a long list and the drop still arrives where you
// are looking, not somewhere above the fold. It never covers the header
// — App measures the header and passes its height down as headerHeight,
// so the shelf starts just below it whatever the window's width (the
// header is one storey wide, two storeys narrow). Each object now also
// wears its NAME at all times, so an object and its words arrive
// together and it is clear which name belongs to which object; newest
// sits on top, pushing earlier arrivals down.
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

// The blob an arrival sits on (T5.2e, Kimia's call 2026-08-13). A drop
// is not a clean rectangular card — it is a blob, the shape language
// the Map's regions already speak: a soft, uneven outline with a lit
// edge and a little glow.
//
// Each outline is drawn ONCE in a 120×44 frame and then stretched to
// whatever size the card turns out to be, so nothing has to be measured
// per card and no geometry runs at render time. Two consequences worth
// knowing: the stroke is told not to stretch with the shape
// (vector-effect), or it would come out thick on one axis and thin on
// the other; and the outlines deliberately bulge a few units outside
// the frame, which is what stops a blob from looking like a box with
// rounded corners.
//
// Border-radius was tried first and cannot do this: a wide, short box
// rounds into a clean lozenge whatever the eight percentages say.
const BLOBS = [
  'M122.5,22.0C123.3,25.7 114.6,30.7 107.1,33.8C99.6,36.9 88.1,39.2 77.3,40.4C66.5,41.5 54.1,41.4 42.6,40.5C31.1,39.6 14.5,38.0 8.5,34.9C2.5,31.8 5.7,26.1 6.5,22.0C7.3,17.9 7.4,13.6 13.3,10.3C19.1,7.0 30.6,3.6 41.5,2.3C52.3,1.0 68.3,0.9 78.4,2.4C88.6,4.0 95.0,8.1 102.3,11.4C109.7,14.7 121.7,18.3 122.5,22.0Z',
  'M124.4,22.0C123.3,25.7 108.3,28.9 100.6,32.2C93.0,35.5 88.4,40.0 78.5,41.6C68.6,43.3 51.9,43.4 41.1,42.1C30.2,40.7 18.8,37.0 13.4,33.7C7.9,30.3 9.5,26.2 8.4,22.0C7.3,17.8 1.1,11.7 6.8,8.7C12.5,5.6 31.0,4.4 42.6,3.6C54.3,2.8 66.2,2.9 76.9,4.0C87.7,5.1 99.3,7.2 107.2,10.2C115.1,13.2 125.5,18.3 124.4,22.0Z',
  'M113.3,22.0C112.5,26.0 111.7,30.1 106.0,33.5C100.4,37.0 90.0,41.4 79.4,42.6C68.8,43.8 52.9,42.2 42.5,40.6C32.0,39.0 24.4,35.9 16.8,32.8C9.3,29.7 -2.0,25.8 -2.7,22.0C-3.5,18.2 4.5,12.9 12.2,10.0C19.9,7.1 32.5,5.8 43.5,4.5C54.6,3.3 67.1,1.8 78.3,2.6C89.5,3.4 104.8,6.1 110.7,9.3C116.5,12.5 114.0,18.0 113.3,22.0Z',
]

// Which of the three an arrival wears — from its own id, so it is the
// same blob every render, and two arrivals side by side rarely match.
function blobFor(id) {
  let sum = 0
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i)
  return BLOBS[sum % BLOBS.length]
}

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
      {/* The blob the arrival sits on. Decoration only — it carries no
          words, so it is hidden from screen readers. */}
      <svg
        className="arrival-blob"
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={blobFor(arrival.id)} vectorEffect="non-scaling-stroke" />
      </svg>
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
        {/* The name is no longer something you have to hold the object
            to hear (T5.2e): it arrives with the object and stays as
            long as it does. Inside the same pressable group, so the
            two read as one thing. */}
        <span className="arrival-caption">{arrivalLabel(arrival)}</span>
      </button>
      {deciding && (
        <>
          <button
            className="pebble arrival-choice"
            onClick={() => onDecide(arrival.completionId, 'gathered')}
          >
            gather
          </button>
          <button
            className="pebble arrival-choice"
            onClick={() => onDecide(arrival.completionId, 'left')}
          >
            leave it
          </button>
        </>
      )}
      {reading && (
        <>
          <button
            className="pebble arrival-choice"
            onClick={() => onRead(arrival)}
          >
            read now
          </button>
          <button
            className="pebble arrival-choice"
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

function ArrivalShelf({
  arrivals,
  worldSeed,
  headerHeight,
  onExpire,
  onDecide,
  onRead,
}) {
  if (arrivals.length === 0) return null
  return (
    <section
      className="arrival-shelf"
      aria-label="arrivals"
      // How far down the window the shelf starts. Measured from the
      // real header rather than written as a number here, so the two
      // cannot drift apart when the bar folds or its spacing changes.
      style={{ '--header-height': `${headerHeight}px` }}
    >
      {/* Newest on top, older pushed down (Kimia's call 2026-08-13).
          Reversed here rather than with CSS so the reading order a
          screen reader hears matches the order on screen. */}
      {[...arrivals].reverse().map((arrival) => (
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
