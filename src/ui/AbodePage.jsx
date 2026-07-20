// The Abode proper (T4.3): OPEN GROUND under sky — a patch of N-Z-D,
// no walls, the same quiet scene whether it holds one gathered flora
// or fifty (Kimia's decisions 2026-07-20). Play, not inventory
// management: gathered flora are floating objects — drag them anywhere
// and arrange them freely; the arrangement is remembered (storage v6,
// game/abode.js — and composting a find, or undoing the completion
// that dropped it, quietly takes the flora and its place with it).
//
// A click HOLDS a flora (a touch larger, its name showing) and reveals
// its quiet compost button; a click anywhere else lets it settle back.
// Composting needs no confirmation — nothing is ever lost. No found
// dates anywhere (Kimia's call, this session — the Bookcase/Map rule).
//
// Flora still waiting to be decided (gather / leave it) are NOT on the
// ground: they wait in a small plain list above it — the doorstep.
// They aren't home yet, so they get no place until gathered.
//
// Flora are code-drawn placeholder sprigs in the expedition stream's
// mint until the T5.3 art pass, and stay generic ("a flora find")
// until T6.1 names the species. Purchased objects join the ground in
// T4.3b, once the Market exists.

import { useRef, useState } from 'react'
import { HORIZON } from '../game/abode.js'
import DropGlyph from './DropGlyph.jsx'

// The drawing frame. The ground is constant — it never grows or
// reshapes; crowding is solved by Kimia's own arranging (the bookshelf
// precedent). The horizon sits at the fraction game/abode.js exports,
// so default spots land on the ground below it.
const WIDTH = 240
const HEIGHT = 160
const HORIZON_Y = HEIGHT * HORIZON

// A standing flora sprig; held, it grows a touch to show it's in hand.
const FLORA_SIZE = 20
const HELD_SIZE = 26

// A press becomes a drag once the pointer travels this many pixels;
// anything shorter is a click (hold ↔ settle back).
const DRAG_THRESHOLD_PX = 4

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

function AbodePage({ finds, items, onDecide, onMove, onBack }) {
  const svgRef = useRef(null)
  // The flora currently being dragged, at its live position — plain
  // component state; the place is committed to storage on pointer-up.
  const [drag, setDrag] = useState(null)
  // The flora currently held (clicked): its name and compost button
  // show while this is set. Screen state only — nothing stored.
  const [heldId, setHeldId] = useState(null)

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

  // One press on one flora: watch the pointer on the WINDOW (so a drag
  // can leave the flora and still track), decide at release whether it
  // was a drag or a click. The bookcase's exact pattern.
  function handlePointerDown(item, event) {
    if (event.button) return // left / primary only
    // The scene's own press handler lets a held flora go — a press on
    // a flora must not double as that "anywhere else" click.
    event.stopPropagation()
    const press = {
      id: item.completionId,
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
    setHeldId((held) => (held === item.completionId ? null : item.completionId))
  }

  function handleCompost(item) {
    setHeldId(null)
    onDecide(item.completionId, 'composted')
  }

  // Where a flora stands right now: its live drag position while
  // dragged, its resolved place otherwise.
  function placeOf(item) {
    return drag && drag.id === item.completionId ? drag : item
  }

  // Render order is the only z-index: the held flora above the rest,
  // the dragged one on top of everything. Nothing about order stored.
  const idle = items.filter(
    (item) =>
      (!drag || item.completionId !== drag.id) &&
      item.completionId !== heldId,
  )
  const held = items.find(
    (item) => item.completionId === heldId && (!drag || item.completionId !== drag.id),
  )
  const dragged = drag
    ? items.find((item) => item.completionId === drag.id)
    : null
  const ordered = [
    ...idle,
    ...(held ? [held] : []),
    ...(dragged ? [dragged] : []),
  ]

  return (
    <section className="stub-page abode">
      <h2>the Abode</h2>

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
          const isHeld = item.completionId === heldId
          const size = isHeld ? HELD_SIZE : FLORA_SIZE
          const place = placeOf(item)
          const cx = place.x * WIDTH
          const base = place.y * HEIGHT
          // The held flora's name and compost button stack above it,
          // clamped so they stay readable at the scene's edges.
          const textX = Math.min(WIDTH - 26, Math.max(26, cx))
          const nameY = Math.max(8, base - size - 7)
          return (
            <g key={item.completionId} className="abode-flora">
              <g
                role="button"
                tabIndex={0}
                aria-label="a flora find"
                aria-pressed={isHeld}
                className="abode-flora-hold"
                onPointerDown={(event) => handlePointerDown(item, event)}
                onKeyDown={(event) => handleKeyDown(item, event)}
              >
                <DropGlyph
                  kind="flora"
                  className={
                    isHeld ? 'abode-flora-glyph held' : 'abode-flora-glyph'
                  }
                  x={cx - size / 2}
                  y={base - size}
                  width={size}
                  height={size}
                />
              </g>
              {isHeld && (
                <>
                  <text className="abode-flora-name" x={textX} y={nameY}>
                    a flora find
                  </text>
                  <text
                    className="abode-compost"
                    role="button"
                    tabIndex={0}
                    aria-label="compost"
                    x={textX}
                    y={nameY + 9}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => handleCompost(item)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      handleCompost(item)
                    }}
                  >
                    compost
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default AbodePage
