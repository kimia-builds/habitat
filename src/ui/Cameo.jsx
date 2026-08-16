// The home-screen cameo (T4.6): a friend turns up on the habit list to
// celebrate a BIG WIN — a big day, a record streak, a lived-day
// milestone — performs its signature category animation ONCE, and the
// moment settles back to the calm list. This is the third and last
// moment the signature animation may play (design-notes §8, decision
// 2026-07-20: arrival reveal, Guest Book card, home-screen cameos —
// never party mode).
//
// Calm, not neon: this is an encouragement visit, not a first
// occurrence — so it borrows the quiet pastel register of the Guest
// Book card rather than the reveal overlay, and it never blocks the
// list. The message is Kimia's slot (cameos.<win type> in
// narration.js); a blank slot renders nothing, the T3.4 rule. The win
// itself is derived fresh every render (game/cameos.js) and the visit
// stores nothing — undo the win and the cameo simply doesn't fire;
// after CAMEO_LINGER_MS it leaves by itself, once per visit.
//
// The one loud exception (Kimia's call 2026-08-16, T5.2e): the two
// rarest wins bring the full firework with them. See FIREWORK_WINS.

import { useEffect } from 'react'
import { CAMEO_LINGER_MS, FRIEND_CATEGORIES } from '../game/constants.js'
import { friendDisplayName } from '../content/names.js'
import { narrationSlot } from '../content/narration.js'
import Firework from './firework.jsx'
import FriendGlyph from './FriendGlyph.jsx'

// Which wins earn the firework (design-notes §5, Kimia's call
// 2026-08-16): the two that mark something never done before. A big day
// is left out on purpose — it can happen again next week, and a
// celebration you can see any time is wallpaper (§8's scarcity rule).
const FIREWORK_WINS = new Set(['streakRecord', 'livedDays'])

function Cameo({ win, worldSeed, onExpire }) {
  const key = FRIEND_CATEGORIES[win.friend.category].key
  // Null until Kimia names the species (T6.1a): the visit then shows the
  // friend and its message with no name line, rather than a stand-in.
  const name = friendDisplayName(key, win.friend.individual)
  const message = narrationSlot(`cameos.${win.type}`)
  // The visit's whole length is one timer; the CSS fade is driven from
  // the same constant (inline below), so the two never disagree.
  useEffect(() => {
    const timer = setTimeout(onExpire, CAMEO_LINGER_MS)
    return () => clearTimeout(timer)
  }, [onExpire])
  return (
    <div
      className="cameo"
      role="status"
      style={{ animationDuration: `${CAMEO_LINGER_MS}ms` }}
    >
      {FIREWORK_WINS.has(win.type) && <Firework />}
      <FriendGlyph
        category={win.friend.category}
        individual={win.friend.individual}
        worldSeed={worldSeed}
        className={`cameo-glyph friend-anim-${key}`}
      />
      {name && <span className="cameo-name">{name}</span>}
      {message && <p className="cameo-message">{message}</p>}
    </div>
  )
}

export default Cameo
