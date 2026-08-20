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
//
// SHAPED LIKE A DROP (Kimia's calls 2026-08-16, second pass). The visit
// used to be a bare column of art, name and message sitting above the
// habit list. It now borrows the drop shelf's conventions, because the
// two are the same kind of event — something arriving over the page:
//
//   • the friend sits INSIDE a blob, the same three outlines the
//     arrivals and the Map's regions wear (blob.jsx);
//   • the words sit directly beneath it, over a dark backing, so they
//     stay readable wherever on the page they happen to land;
//   • it is pinned to the BOTTOM LEFT of the window — the mirror of the
//     shelf's top right, and out of the way of both;
//   • the friend's NAME is gone. The friend and the caption, nothing
//     else: a visit is a moment, not a record card. Who came is
//     something you see, and the Guest Book is where names live.

import { useEffect } from 'react'
import { CAMEO_LINGER_MS, FRIEND_CATEGORIES } from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import Blob from './blob.jsx'
import Firework from './firework.jsx'
import FriendGlyph from './FriendGlyph.jsx'
import { useText } from './language.jsx'

// Which wins earn the firework (design-notes §5, Kimia's call
// 2026-08-16): the two that mark something never done before. A big day
// is left out on purpose — it can happen again next week, and a
// celebration you can see any time is wallpaper (§8's scarcity rule).
const FIREWORK_WINS = new Set(['streakRecord', 'livedDays'])

// Which of Kimia's slots this win speaks through, and the values it may
// fill its {holes} with (2026-08-20). The numbers come from the win
// itself, so the sentence is true of THIS win — before this, the slots
// held her draft sentences with their example numbers typed in, and
// every cameo claimed a 15-day streak whatever the streak really was.
//
// A record streak has two slots because a habit setting its first-ever
// record has no old best to name.
function slotFor(win) {
  if (win.type !== 'streakRecord') {
    return { path: `cameos.${win.type}`, vars: { n: win.n } }
  }
  return {
    path: win.previous > 0 ? 'cameos.streakRecord' : 'cameos.streakRecordFirst',
    vars: {
      n: win.n,
      unit: win.unit,
      habit: win.habitName,
      previous: win.previous,
    },
  }
}

// PRESSABLE, for a record streak (Kimia's call 2026-08-20). The visit
// is momentary and says one short sentence, so a claim it makes used to
// be impossible to check afterwards — "15 day streak" with no way to
// ask which habit. Pressing it now opens the field notes with the
// record(s) spotlit (FieldNotes.jsx).
//
// Only a record streak: the other two wins are about the day itself,
// which the notes have no separate view of, and a control that
// sometimes does nothing is worse than one that isn't there.
const OPENABLE = 'streakRecord'

function Cameo({ win, worldSeed, onExpire, onOpen }) {
  const { t } = useText()
  const key = FRIEND_CATEGORIES[win.friend.category].key
  const slot = slotFor(win)
  const message = narrationSlot(slot.path, slot.vars)
  const openable = win.type === OPENABLE && onOpen !== undefined
  // The visit's whole length is one timer; the CSS fade is driven from
  // the same constant (inline below), so the two never disagree.
  useEffect(() => {
    const timer = setTimeout(onExpire, CAMEO_LINGER_MS)
    return () => clearTimeout(timer)
  }, [onExpire])
  return (
    <div
      className={openable ? 'cameo cameo-openable' : 'cameo'}
      role="status"
      style={{ animationDuration: `${CAMEO_LINGER_MS}ms` }}
    >
      {FIREWORK_WINS.has(win.type) && <Firework />}
      {/* The press covers the friend AND the caption — the whole visit
          is the target, since the whole visit is the thing you want to
          ask about. It carries no words of its own: the visit shows a
          friend and a caption and nothing else (Kimia 2026-08-16), so
          what it is for is said in its label, not on the screen. */}
      {openable && (
        <button
          type="button"
          className="cameo-press"
          aria-label={t('cameo.open')}
          onClick={() => onOpen(win)}
        />
      )}
      {/* The friend in its blob. The blob is picked from the win and the
          visitor rather than at random, so re-deriving the same win
          brings back the same shape as well as the same friend — the
          T3.1 no-slot-machine rule, which the seeded pick already
          follows. */}
      <span className="cameo-figure">
        <Blob
          id={`${win.type}-${win.friend.category}-${win.friend.individual}`}
          className="cameo-blob"
        />
        <FriendGlyph
          category={win.friend.category}
          individual={win.friend.individual}
          worldSeed={worldSeed}
          className={`cameo-glyph friend-anim-${key}`}
        />
      </span>
      {message && <p className="cameo-message">{message}</p>}
    </div>
  )
}

export default Cameo
