// The friend arrival reveal (T4.4): EVERY friend arrival is a full
// neon POP moment — friends are the top of the reward hierarchy, and
// the full firework register belongs to first-occurrence reveals and
// friend arrivals alike (design-notes §5). This is one of the three
// moments the signature category animation may play (decision
// 2026-07-20: arrival reveal, Guest Book card, rare home-screen
// cameos — never party mode).
//
// The words come from Kimia's narration slots (friendIntros.<category>)
// and play only at the FIRST arrival of each category — narration is
// momentary, so a category's later friends arrive wordless: the art,
// the name and the animation carry the moment. An empty slot renders
// nothing at all (the T3.4 rule). The overlay waits to be dismissed.

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import FriendGlyph from './FriendGlyph.jsx'

function FriendReveal({ arrival, worldSeed, firstOfCategory, onDismiss }) {
  const key = FRIEND_CATEGORIES[arrival.friend.category].key
  const title = firstOfCategory
    ? narrationSlot(`friendIntros.${key}.title`)
    : null
  const line = firstOfCategory
    ? narrationSlot(`friendIntros.${key}.line`)
    : null
  return (
    <div
      className="reveal-overlay"
      role="dialog"
      aria-label={title ?? 'a friend arrives'}
    >
      <div className="reveal reveal-friend">
        <FriendGlyph
          category={arrival.friend.category}
          individual={arrival.friend.individual}
          worldSeed={worldSeed}
          className={`reveal-glyph friend-anim-${key}`}
        />
        <span className="reveal-friend-name">
          a {FRIEND_CATEGORIES[arrival.friend.category].singular}
        </span>
        {title && <h2 className="reveal-title">{title}</h2>}
        {line && <p className="reveal-line">{line}</p>}
        <button className="reveal-button" onClick={onDismiss}>
          onward
        </button>
      </div>
    </div>
  )
}

export default FriendReveal
