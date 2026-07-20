// The Abode proper (T4.3): OPEN GROUND under sky — a patch of N-Z-D,
// no walls, the same quiet scene whether it holds one gathered flora
// or fifty (Kimia's decisions 2026-07-20). Play, not inventory
// management: everything on the ground is a floating thing — drag it
// anywhere and arrange freely; the arrangement is remembered per item
// (storage v6's abodeLayout, game/abode.js — and composting a find,
// undoing the completion that dropped it, or selling an object back
// quietly takes the item and its place with it).
//
// Two kinds share the ground: gathered flora (T4.3) and the market
// objects Kimia owns (T4.3b). A click HOLDS one (a touch larger, its
// name showing) and reveals its quiet way back to the world — compost
// for a flora, sell for an object, always at exactly the price paid
// (spec §5: no penalty, no spread). A click anywhere else lets it
// settle back. Neither needs a confirmation — nothing is ever lost.
// No found dates anywhere (Kimia's call — the Bookcase/Map rule).
//
// Flora still waiting to be decided (gather / leave it) are NOT on the
// ground: they wait in a small plain list above it — the doorstep.
// They aren't home yet, so they get no place until gathered.
//
// Flora are code-drawn placeholder sprigs in the expedition stream's
// mint until the T5.3 art pass, and stay generic ("a flora find")
// until T6.1 names the species; objects are seeded curiosities
// (ui/ObjectGlyph.jsx), generic ("a curiosity") on the same schedule.
//
// PARTY MODE (T4.4, spec §5b): the quiet / party toggle — a switch
// with an icon on either side — pops the friends we have made up
// AMONG the flora in a randomised formation. The flora and objects
// keep their exact places and stay draggable (party mode only ever
// adds, never disturbs); friends are not draggable, their formation is
// not remembered (a refresh, or re-toggling, re-rolls it), and NOTHING
// about a party is stored. Friends are simply present here — the
// signature animations never play in the Abode (decision 2026-07-20).
// The toggle is greyed out, reading "not yet", until the first friend
// exists.

import { useRef, useState } from 'react'
import { HORIZON } from '../game/abode.js'
import DropGlyph from './DropGlyph.jsx'
import FriendGlyph from './FriendGlyph.jsx'
import ObjectGlyph from './ObjectGlyph.jsx'

// The drawing frame. The ground is constant — it never grows or
// reshapes; crowding is solved by Kimia's own arranging (the bookshelf
// precedent). The horizon sits at the fraction game/abode.js exports,
// so default spots land on the ground below it.
const WIDTH = 240
const HEIGHT = 160
const HORIZON_Y = HEIGHT * HORIZON

// A standing item — flora sprig or curiosity; held, it grows a touch
// to show it's in hand.
const FLORA_SIZE = 20
const HELD_SIZE = 26

// A press becomes a drag once the pointer travels this many pixels;
// anything shorter is a click (hold ↔ settle back).
const DRAG_THRESHOLD_PX = 4

// A visiting friend in party mode: a little larger than a flora.
const PARTY_FRIEND_SIZE = 22

// The randomised formation (spec §5b): friends scattered across the
// ground half of the scene. Deliberately UNseeded — a refresh (or a
// re-toggle) re-rolls it, and nothing about a party is stored.
function rollFormation(friends) {
  return friends.map((friend) => ({
    friend,
    x: 0.06 + Math.random() * 0.88,
    y: 0.5 + Math.random() * 0.44,
  }))
}

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

function AbodePage({
  finds,
  items,
  friends = [],
  worldSeed,
  onDecide,
  onMove,
  onSell,
  onBack,
}) {
  const svgRef = useRef(null)
  // The item currently being dragged, at its live position — plain
  // component state; the place is committed to storage on pointer-up.
  const [drag, setDrag] = useState(null)
  // The item currently held (clicked): its name and its quiet way back
  // (compost / sell) show while this is set. Screen state only.
  const [heldId, setHeldId] = useState(null)
  // Party mode (T4.4): off is the quiet Abode as ever. The formation
  // is re-rolled each time the mode is switched on — never stored.
  const [party, setParty] = useState(false)
  const [formation, setFormation] = useState([])

  const pending = finds.filter((find) => find.status === 'pending')

  // Where the pointer sits in scene fractions, or null when the frame
  // can't be measured (jsdom in tests) — clicks must still work there,
  // so only the drag uses this.
  function pointToFraction(event) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return null
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
  }

  // One press on one item: watch the pointer on the WINDOW (so a drag
  // can leave the item and still track), decide at release whether it
  // was a drag or a click. The bookcase's exact pattern.
  function handlePointerDown(item, event) {
    if (event.button) return // left / primary only
    // The scene's own press handler lets a held item go — a press on
    // an item must not double as that "anywhere else" click.
    event.stopPropagation()
    const press = {
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      x: item.x,
      y: item.y,
      dragging: false,
    }
    function move(moveEvent) {
      const distance = Math.hypot(
        moveEvent.clientX - press.startX,
        moveEvent.clientY - press.startY,
      )
      if (!press.dragging && distance < DRAG_THRESHOLD_PX) return
      const point = pointToFraction(moveEvent)
      press.dragging = true
      if (point) {
        press.x = point.x
        press.y = point.y
      }
      setDrag({ id: press.id, x: press.x, y: press.y })
    }
    function up() {
      window.removeEventListener('pointermove', move)
      setDrag(null)
      if (press.dragging) {
        onMove(press.id, { x: clampUnit(press.x), y: clampUnit(press.y) })
      } else {
        setHeldId((held) => (held === press.id ? null : press.id))
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
  }

  function handleKeyDown(item, event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    setHeldId((held) => (held === item.id ? null : item.id))
  }

  function handleCompost(item) {
    setHeldId(null)
    onDecide(item.id, 'composted')
  }

  function handleSell(item) {
    setHeldId(null)
    onSell(item.id)
  }

  // The quiet / party toggle (spec §5b): greyed out — "not yet", never
  // "broken" — until at least one friend exists. Switching on rolls a
  // fresh formation; switching off lets everyone go home.
  const partyAvailable = friends.length > 0
  function handlePartyToggle() {
    if (!partyAvailable) return
    setParty(!party)
    setFormation(party ? [] : rollFormation(friends))
  }

  // Where an item stands right now: its live drag position while
  // dragged, its resolved place otherwise.
  function placeOf(item) {
    return drag && drag.id === item.id ? drag : item
  }

  // Render order is the only z-index: the held item above the rest,
  // the dragged one on top of everything. Nothing about order stored.
  const idle = items.filter(
    (item) => (!drag || item.id !== drag.id) && item.id !== heldId,
  )
  const held = items.find(
    (item) => item.id === heldId && (!drag || item.id !== drag.id),
  )
  const dragged = drag ? items.find((item) => item.id === drag.id) : null
  const ordered = [
    ...idle,
    ...(held ? [held] : []),
    ...(dragged ? [dragged] : []),
  ]

  return (
    <section className="stub-page abode">
      <h2>the Abode</h2>

      {/* The quiet / party toggle (T4.4): a switch with an icon either
          side. Greyed — "not yet" — until the first friend exists. */}
      <div
        className={`abode-mode${partyAvailable ? '' : ' abode-mode-off'}`}
        title={partyAvailable ? undefined : 'not yet'}
      >
        <svg
          className={`abode-mode-icon${party ? '' : ' active'}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* quiet: a single resting stone */}
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <button
          className="abode-mode-switch"
          role="switch"
          aria-checked={party}
          aria-label="party mode"
          disabled={!partyAvailable}
          onClick={handlePartyToggle}
        >
          <span className="abode-mode-knob" />
        </button>
        <svg
          className={`abode-mode-icon${party ? ' active' : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* party: a little gathering */}
          <circle
            cx="7"
            cy="14"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="16.5"
            cy="8.5"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="17"
            cy="16.5"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {pending.length > 0 && (
        <>
          <h3>waiting to decide</h3>
          <ul className="abode-list" aria-label="waiting to decide">
            {pending.map((find) => (
              <li key={find.completionId} className="abode-row arrival-flora">
                <DropGlyph kind="flora" />
                <span className="abode-name">a flora find</span>
                <button onClick={() => onDecide(find.completionId, 'gathered')}>
                  gather
                </button>
                <button onClick={() => onDecide(find.completionId, 'left')}>
                  leave it
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <svg
        ref={svgRef}
        className="abode-ground-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="group"
        aria-label="the ground"
        onPointerDown={() => setHeldId(null)}
      >
        {/* The constant scene: sky above, ground below the horizon. */}
        <rect
          className="abode-soil"
          x="0"
          y={HORIZON_Y}
          width={WIDTH}
          height={HEIGHT - HORIZON_Y}
        />
        <line
          className="abode-horizon"
          x1="0"
          y1={HORIZON_Y}
          x2={WIDTH}
          y2={HORIZON_Y}
        />
        {ordered.map((item) => {
          const isObject = item.kind === 'object'
          const name = isObject ? 'a curiosity' : 'a flora find'
          const isHeld = item.id === heldId
          const size = isHeld ? HELD_SIZE : FLORA_SIZE
          const place = placeOf(item)
          const cx = place.x * WIDTH
          const base = place.y * HEIGHT
          // The held item's name and its quiet way back stack above it,
          // clamped so they stay readable at the scene's edges.
          const textX = Math.min(WIDTH - 26, Math.max(26, cx))
          const nameY = Math.max(8, base - size - 7)
          const glyphClass = isHeld
            ? 'abode-flora-glyph held'
            : 'abode-flora-glyph'
          return (
            <g key={item.id} className="abode-flora">
              <g
                role="button"
                tabIndex={0}
                aria-label={name}
                aria-pressed={isHeld}
                className="abode-flora-hold"
                onPointerDown={(event) => handlePointerDown(item, event)}
                onKeyDown={(event) => handleKeyDown(item, event)}
              >
                {isObject ? (
                  <ObjectGlyph
                    objectKey={item.objectKey}
                    worldSeed={worldSeed}
                    className={glyphClass}
                    x={cx - size / 2}
                    y={base - size}
                    width={size}
                    height={size}
                  />
                ) : (
                  <DropGlyph
                    kind="flora"
                    className={glyphClass}
                    x={cx - size / 2}
                    y={base - size}
                    width={size}
                    height={size}
                  />
                )}
              </g>
              {isHeld && (
                <>
                  <text className="abode-flora-name" x={textX} y={nameY}>
                    {name}
                  </text>
                  <text
                    className="abode-compost"
                    role="button"
                    tabIndex={0}
                    aria-label={isObject ? 'sell' : 'compost'}
                    x={textX}
                    y={nameY + 9}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => {
                      if (isObject) handleSell(item)
                      else handleCompost(item)
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      if (isObject) handleSell(item)
                      else handleCompost(item)
                    }}
                  >
                    {isObject ? 'sell' : 'compost'}
                  </text>
                </>
              )}
            </g>
          )
        })}
        {/* Party mode: the friends, simply present among the flora —
            not draggable, not performing, never stored. */}
        {party &&
          formation.map(({ friend, x, y }) => {
            const cx = x * WIDTH
            const base = y * HEIGHT
            return (
              <g
                key={friend.completionId}
                className="abode-party-friend"
                role="img"
                aria-label="a visiting friend"
              >
                <FriendGlyph
                  category={friend.category}
                  individual={friend.individual}
                  worldSeed={worldSeed}
                  x={cx - PARTY_FRIEND_SIZE / 2}
                  y={base - PARTY_FRIEND_SIZE}
                  width={PARTY_FRIEND_SIZE}
                  height={PARTY_FRIEND_SIZE}
                />
              </g>
            )
          })}
      </svg>

      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default AbodePage
