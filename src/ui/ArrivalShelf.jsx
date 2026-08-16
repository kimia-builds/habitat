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
import Blob from './blob.jsx'
import DropGlyph from './DropGlyph.jsx'
import FriendGlyph from './FriendGlyph.jsx'
import StarShimmer, { SHIMMER_STAGGER_MS } from './shimmer.jsx'
import { useText } from './language.jsx'

// The blob an arrival sits on (T5.2e, Kimia's call 2026-08-13) now lives
// in blob.jsx — the cameo wears one too since 2026-08-16, and one shape
// language cannot be kept in two tables. What that file explains: three
// outlines drawn once in a 120×44 frame and stretched, the stroke told
// not to stretch with them, and why border-radius cannot do this.

// Which stream's colour an arrival wears.
const STREAM_OF = {
  flora: 'flora',
  magazine: 'reading',
  novel: 'reading',
  dictionary: 'reading',
  fungi: 'fungi',
  friend: 'friend',
}

function ShelfItem({
  arrival,
  worldSeed,
  shimmerDelay,
  onExpire,
  onDecide,
  onRead,
}) {
  const { t } = useText()
  const [held, setHeld] = useState(false)
  // EVERY arrival shimmers (Kimia's call 2026-08-16, T5.2e). It used to
  // be everyday drops only: a friend and a first-occurrence find owed a
  // reveal, and the firework was theirs, so a sparkle would have gone
  // off right behind the moment it was meant to stay out of the way of.
  // The firework has since left the reveals for the cameo (design-notes
  // §5), which would have left the BIGGEST arrivals as the only ones
  // landing on the shelf without a sparkle — so now they all get one.
  //
  // The timing matters and is the whole reason this is a render-time
  // read rather than a stored one: an arrival awaiting a reveal is
  // hidden behind a full-screen overlay, so a shimmer on landing would
  // burn out unseen. Mounting it only once the reveal is gone means the
  // stars play as the arrival comes into view, which is when there is
  // somebody to see them.
  const shimmering = !arrival.awaitingReveal
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
      // ONLY this arrival's own fade ends its life. An animation's end
      // travels up the tree like a click does, and since the shimmer
      // landed (T5.2e, 2026-08-13) this element has twelve star children
      // each finishing a 1.5s pop of its own — so without this check the
      // FIRST star to finish took the whole drop off the shelf at a
      // second and a half, at full brightness, before the fade it was
      // supposed to leave by had even begun. That is what made drops
      // "disappear suddenly" (Kimia, 2026-08-14), and why lengthening
      // the fade changed nothing: nothing ever reached it.
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (fading) onExpire(arrival.id)
      }}
    >
      {/* The blob the arrival sits on. Decoration only — it carries no
          words, so it is hidden from screen readers. */}
      <Blob id={arrival.id} className="arrival-blob" />
      {/* The star-shimmer (T5.2e, §5): stars pop around the blob's edge
          as it lands and are gone in under a second. Laid over the
          whole arrival, so what sparkles is the arrival, not the little
          object inside it (Kimia's call 2026-08-13). */}
      {shimmering && <StarShimmer delayMs={shimmerDelay} />}
      <button
        className="arrival-hold"
        onClick={() => setHeld(!held)}
        title={held ? '' : t('arrivals.hold')}
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
            {t('arrivals.gather')}
          </button>
          <button
            className="pebble arrival-choice"
            onClick={() => onDecide(arrival.completionId, 'left')}
          >
            {t('arrivals.leave')}
          </button>
        </>
      )}
      {reading && (
        <>
          <button
            className="pebble arrival-choice"
            onClick={() => onRead(arrival)}
          >
            {t('arrivals.readNow')}
          </button>
          <button
            className="pebble arrival-choice"
            onClick={() => onExpire(arrival.id)}
          >
            {t('arrivals.readLater')}
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
  const { t } = useText()
  if (arrivals.length === 0) return null
  return (
    <section
      className="arrival-shelf"
      aria-label={t('arrivals.region')}
      // How far down the window the shelf starts. Measured from the
      // real header rather than written as a number here, so the two
      // cannot drift apart when the bar folds or its spacing changes.
      style={{ '--header-height': `${headerHeight}px` }}
    >
      {/* Newest on top, older pushed down (Kimia's call 2026-08-13).
          Reversed here rather than with CSS so the reading order a
          screen reader hears matches the order on screen. */}
      {[...arrivals].reverse().map((arrival, index) => (
        <ShelfItem
          key={arrival.id}
          arrival={arrival}
          worldSeed={worldSeed}
          // Drops that land together shimmer one after another, top
          // down (Kimia's call 2026-08-13). A drop landing on its own
          // is always the newest, so its delay is 0 and it sparkles at
          // once; only a batch — a check-in closing — cascades.
          shimmerDelay={index * SHIMMER_STAGGER_MS}
          onExpire={onExpire}
          onDecide={onDecide}
          onRead={onRead}
        />
      ))}
    </section>
  )
}

export default ArrivalShelf
