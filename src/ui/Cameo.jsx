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
//
// THE REAL DRAWING LANDED HERE 2026-08-29 (T5.3h, the last slice) — the
// T4.4 placeholder line-art is gone from Habitat entirely, and the visit
// goes through Friend.jsx like every other screen that shows a friend.
// Kimia's call, asked before it was built:
//
//   HOW BIG — a plip at 1.5rem, the same figure the arrival shelf and the
//   Guest Book LIST already stand their friends at. A visit is a glance,
//   not a card, so it takes the small figure rather than the Guest Book
//   card's 2.25rem. The other nine follow from the character sheet, which
//   puts the chitu at 10.78rem: the visit is now as big as its visitor,
//   where the placeholder drew all ten at one flat 2.75rem square.
//
//   WHAT THAT MEANS FOR THE ROOM (said to Kimia before she chose). The
//   visit lives in the margin beside the habit column, and that margin
//   runs out below a window of about 1088px, where .cameo falls back to
//   its --cameo-min floor. A chitu or a hamdi bulo turning up on a window
//   that narrow overhangs the habit tiles by around 3rem. That is a LOOK,
//   not a block: .cameo catches no clicks, so a habit underneath stays
//   reachable, and Kimia's 2026-08-16 ruling on this same box already
//   said a visit briefly sitting over a tile beats shrinking what it came
//   to say.
//
//   THE GLOW is the drawing's own, as everywhere else — a friend's aura
//   lives inside the artwork (design-bible §3, §7). The BLOB keeps its
//   rose: that is the moment's colour, not the friend's, exactly as the
//   arrival reveal's card kept its own.

import { useEffect } from 'react'
import {
  CAMEO_LINGER_MS,
  CAMEO_OPENABLE_LINGER_MS,
  FRIEND_CATEGORIES,
} from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import Blob from './blob.jsx'
import Firework from './firework.jsx'
import Friend from './Friend.jsx'
import { baseWhereSmallestIs } from './friendCanon.js'
import { useText } from './language.jsx'

// How big the LARGEST friend stands here — stated, as every screen states
// it, by saying how big the SMALLEST must be and letting friendCanon.js
// deal out the rest (Kimia's rule 2026-08-21). 1.5rem for a plip is the
// arrival shelf's and the Guest Book list's own figure, repeated
// deliberately rather than shared: each screen names its own base, and
// these three agree because a friend is the size it is wherever you meet
// it, not because one is wired to the others.
const CAMEO_BASE_REM = baseWhereSmallestIs(1.5)

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
  const linger = openable ? CAMEO_OPENABLE_LINGER_MS : CAMEO_LINGER_MS
  // The visit's whole length is one timer; the CSS fade is driven from
  // the same number (inline below), so the two never disagree — and a
  // pressable visit gets the longer of the two (2026-08-20).
  useEffect(() => {
    const timer = setTimeout(onExpire, linger)
    return () => clearTimeout(timer)
  }, [onExpire, linger])
  return (
    <div
      className={openable ? 'cameo cameo-openable' : 'cameo'}
      role="status"
      style={{ animationDuration: `${linger}ms` }}
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
        <Friend
          category={win.friend.category}
          individual={win.friend.individual}
          worldSeed={worldSeed}
          base={CAMEO_BASE_REM}
          idPrefix="cameo-"
          className={`friend-anim-${key}`}
        />
      </span>
      {message && <p className="cameo-message">{message}</p>}
    </div>
  )
}

export default Cameo
