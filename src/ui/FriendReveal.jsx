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
//
// THE REAL DRAWING LANDED HERE 2026-08-29 (T5.3h) — the T4.4 placeholder
// line-art is gone from this moment and it goes through Friend.jsx like
// every other screen that shows a friend. Two calls of Kimia's, both made
// before it was built:
//
//   HOW BIG — the same size as the Guest Book card. A friend is the size it
//   is wherever you meet it, so this screen chooses its base from the small
//   end exactly as that card does (baseWhereSmallestIs, friendCanon.js) and
//   the other nine follow from the character sheet. Sizing from the big end
//   instead would leave the plip — the friend you meet most — a speck.
//
//   THE GLOW — the drawing's own, and nothing else. The placeholder wore a
//   neon rose halo painted on in CSS (`.reveal-glyph`); the real art carries
//   its aura inside itself, in the friend's own colour (design-bible §3, §7),
//   so that halo would only tint the friend's light rose at the edges. The
//   overlay CARD keeps its neon rose — that is the moment's colour, not the
//   friend's.

import { FRIEND_CATEGORIES } from '../game/constants.js'
import { friendDisplayName } from '../content/names.js'
import { narrationSlot } from '../content/narration.js'
import Friend from './Friend.jsx'
import { baseWhereSmallestIs } from './friendCanon.js'
import { useText } from './language.jsx'

// How big the LARGEST friend stands here — set by saying how big the SMALLEST
// must be for its drawing to read. 2.25rem for a plip is the Guest Book card's
// own figure, repeated deliberately rather than shared: each screen states its
// own base (friendCanon.js), and these two agree because Kimia asked them to,
// not because one is wired to the other.
const REVEAL_BASE_REM = baseWhereSmallestIs(2.25)

function FriendReveal({ arrival, worldSeed, firstOfCategory, onDismiss }) {
  const { t } = useText()
  const key = FRIEND_CATEGORIES[arrival.friend.category].key
  // Null until Kimia names the species (T6.1a) — the reveal then carries
  // the art, her narration and the button, and no name line.
  const name = friendDisplayName(key, arrival.friend.individual)
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
      aria-label={title ?? t('reveal.friendArrives')}
    >
      <div className="reveal reveal-friend">
        <Friend
          category={arrival.friend.category}
          individual={arrival.friend.individual}
          worldSeed={worldSeed}
          base={REVEAL_BASE_REM}
          idPrefix="reveal-"
          className={`friend-anim-${key}`}
        />
        {name && <span className="reveal-friend-name">{name}</span>}
        {title && <h2 className="reveal-title">{title}</h2>}
        {line && <p className="reveal-line">{line}</p>}
        <button className="reveal-button" onClick={onDismiss}>
          {t('reveal.onward')}
        </button>
      </div>
    </div>
  )
}

export default FriendReveal
