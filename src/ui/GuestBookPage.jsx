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
import { friendDisplayName } from '../content/names.js'
import { narrationSlot } from '../content/narration.js'
import Friend from './Friend.jsx'
import { baseWhereSmallestIs } from './friendCanon.js'
import { useText } from './language.jsx'

// HOW MUCH ROOM THE FRIENDS GET HERE (2026-08-21, Kimia's call). A screen
// picks ONE base — how big the largest friend may be — and the other nine
// follow from friendCanon.js. Her rule for choosing it is to size up from the
// SMALLEST friend: say how big a plip has to be before its drawing reads, and
// let the chitu land wherever the canon puts it. Sizing from the big end
// instead would have kept today's on-screen sizes and left the plip a
// five-pixel speck — and the plip is the friend you meet most often.
//
// In the LIST a plip is 1.5rem, about the height of a line of text, which
// makes the largest friends around 10.8rem — so the book reads as a gallery
// of creatures at true relative size rather than a row of matching icons.
// On the CARD, where you are looking at one friend on purpose, everyone is
// half again as big.
const LIST_BASE_REM = baseWhereSmallestIs(1.5)
const CARD_BASE_REM = baseWhereSmallestIs(2.25)

// A friend with no name yet (T6.1a: blank slots until Kimia writes
// them) shows no name on screen — the art carries it. A screen reader
// still needs a handle on the control, so the accessible name falls
// back to the plain functional word, never to a stand-in species name.
// Same standing as the charms' shape names: heard, never seen.

function FriendCard({ friend, worldSeed, onClose }) {
  const { t } = useText()
  const key = FRIEND_CATEGORIES[friend.category].key
  const name = friendDisplayName(key, friend.individual)
  const cardText = narrationSlot(`friendCards.${key}`)
  return (
    <div
      className="reveal-overlay"
      role="dialog"
      aria-label={name ?? t('guestbook.unnamedFriend')}
    >
      <div className="spread-popup friend-card">
        <Friend
          category={friend.category}
          individual={friend.individual}
          worldSeed={worldSeed}
          base={CARD_BASE_REM}
          idPrefix="guestbook-card-"
          className={`friend-anim-${key}`}
        />
        {name && <p className="arrival-caption">{name}</p>}
        {cardText && <p className="friend-card-text">{cardText}</p>}
        <button className="reveal-button pebble" onClick={onClose}>
          {t('guestbook.close')}
        </button>
      </div>
    </div>
  )
}

function GuestBookPage({ friends, worldSeed, onBack }) {
  const { t } = useText()
  // The friend whose card is open right now — screen state only; like
  // reading, opening a card is tracked nowhere.
  const [selected, setSelected] = useState(null)
  return (
    <section className="stub-page guestbook">
      <h2 className="page-title">{t('page.guestbook')}</h2>
      <div className="page-box">
        <ul className="guestbook-list" aria-label={t('guestbook.friends')}>
          {friends.map((friend) => {
            const key = FRIEND_CATEGORIES[friend.category].key
            const name = friendDisplayName(key, friend.individual)
            return (
              <li key={friend.completionId}>
                <button
                  className="guestbook-friend"
                  onClick={() => setSelected(friend)}
                  aria-label={name ?? t('guestbook.unnamedFriend')}
                >
                  <Friend
                    category={friend.category}
                    individual={friend.individual}
                    worldSeed={worldSeed}
                    base={LIST_BASE_REM}
                    idPrefix="guestbook-list-"
                  />
                  {name && <span className="guestbook-name">{name}</span>}
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
        <button className="pebble" onClick={onBack}>
          ← back to the habits
        </button>
      </div>
    </section>
  )
}

export default GuestBookPage
