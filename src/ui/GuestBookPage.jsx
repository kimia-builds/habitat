// The Guest Book (T4.4): a record of everyone who has welcomed us —
// we are the guest here, not the owner (spec §5 Stream 2). Visual-first
// like the Map, the Bookcase and the Abode: art and names, no prose,
// no dates, and a bare page while no friend has arrived yet (the
// constant-bookshelf precedent — no empty-state copy).
//
// Clicking a friend opens their CARD: their art, their name, their
// card text, and their signature category animation playing — the one
// moment the animation can be summoned at will (decision 2026-07-20).
// The card text is the standing exception to "narration is momentary":
// a second, re-readable slot per category in Kimia's narration.js
// (friendCards.<key>), blank until she writes it, rendering nothing
// when empty. The arrival narration (friendIntros) is NEVER shown here
// — it played once, at the arrival, and is never re-readable.
//
// Quiet pastel like the spread popup — a card you can open any time is
// an everyday pleasure, not a POP moment.

import { useState } from 'react'
import { FRIEND_CATEGORIES } from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import FriendGlyph from './FriendGlyph.jsx'

function FriendCard({ friend, worldSeed, onClose }) {
  const key = FRIEND_CATEGORIES[friend.category].key
  const name = `a ${FRIEND_CATEGORIES[friend.category].singular}`
  const cardText = narrationSlot(`friendCards.${key}`)
  return (
    <div className="reveal-overlay" role="dialog" aria-label={name}>
      <div className="spread-popup friend-card">
        <FriendGlyph
          category={friend.category}
          individual={friend.individual}
          worldSeed={worldSeed}
          className={`reveal-glyph friend-anim-${key}`}
        />
        <p className="arrival-caption">{name}</p>
        {cardText && <p className="friend-card-text">{cardText}</p>}
        <button className="reveal-button" onClick={onClose}>
          close
        </button>
      </div>
    </div>
  )
}

function GuestBookPage({ friends, worldSeed, onBack }) {
  // The friend whose card is open right now — screen state only; like
  // reading, opening a card is tracked nowhere.
  const [selected, setSelected] = useState(null)
  return (
    <section className="stub-page guestbook">
      <h2>local community</h2>
      <ul className="guestbook-list" aria-label="friends">
        {friends.map((friend) => {
          const name = `a ${FRIEND_CATEGORIES[friend.category].singular}`
          return (
            <li key={friend.completionId}>
              <button
                className="guestbook-friend"
                onClick={() => setSelected(friend)}
                aria-label={name}
              >
                <FriendGlyph
                  category={friend.category}
                  individual={friend.individual}
                  worldSeed={worldSeed}
                />
                <span className="guestbook-name">{name}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {selected && (
        <FriendCard
          friend={selected}
          worldSeed={worldSeed}
          onClose={() => setSelected(null)}
        />
      )}
      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default GuestBookPage
