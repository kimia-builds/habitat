// The Bookcase (T4.2): ONE CONSTANT BOOKSHELF — the same frame and
// planks whether it holds one publication or a hundred, bare shelves
// with no prose and no count when empty (Kimia's decisions 2026-07-19).
// Publications are floating objects: drag them anywhere on the shelf
// and arrange them freely; the arrangement is remembered (storage v5,
// game/bookcase.js — and an undo of the dropping completion quietly
// takes the book and its place with it).
//
// Each book stands two ways, remembered per book:
//   spine  — the everyday way, slim, shelved
//   front  — clicked to stand face-out; the cover carries a quiet
//            eye button that opens the T3.5 spread popup for reading,
//            and a click anywhere else on the cover turns it back
// Reading itself is tracked NOWHERE (spec 2026-07-19): the popup opens
// and closes, and not a byte of it is stored.
//
// The books are code-drawn placeholders until the T5.3 art pass — slim
// magazine, middling novel, thick dictionary, in the literacy stream's
// violet family — and publications stay generic ("a novel") until T6.1
// names them. No found dates anywhere (Kimia's call, this session).

import { useRef, useState } from 'react'
import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'

// The drawing frame. The bookshelf is constant — it never grows or
// reshapes; crowding is solved by Kimia's own arranging, not by the
// shelf. Shelf plank baselines sit at the fractions game/bookcase.js
// exports (1/3, 2/3, 0.99) so default slots land exactly on planks.
const WIDTH = 240
const HEIGHT = 180
const PLANKS = [HEIGHT / 3, (HEIGHT * 2) / 3, HEIGHT * 0.99]

// Placeholder book shapes, per reading type: width and height differ so
// the three rarities read at a glance, colours climb the violet family
// toward the rarest. Real art arrives with T5.3.
const BOOK_SHAPES = {
  magazine: { spineWidth: 9, height: 42, color: '#9d8cc9' },
  novel: { spineWidth: 12, height: 48, color: '#c5b8e8' },
  dictionary: { spineWidth: 16, height: 52, color: '#e0d7f7' },
}

// A front cover is its book's height, a little wider than tall is deep.
const COVER_RATIO = 0.68

// A press becomes a drag once the pointer travels this many pixels;
// anything shorter is a click (the spine ↔ front toggle).
const DRAG_THRESHOLD_PX = 4

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

function BookcasePage({ items, onMove, onFace, onRead, onBack }) {
  const svgRef = useRef(null)
  // The book currently being dragged, at its live position — plain
  // component state; the place is committed to storage on pointer-up.
  const [drag, setDrag] = useState(null)

  // Where the pointer sits in shelf-interior fractions, or null when
  // the frame can't be measured (jsdom in tests) — clicks must still
  // work there, so only the drag uses this.
  function pointToFraction(event) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return null
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
  }

  // One press on one book: watch the pointer on the WINDOW (so a drag
  // can leave the book and still track), decide at release whether it
  // was a drag or a click. Closures, not effects — no stale state, and
  // the side effects fire exactly once, at pointer-up.
  function handlePointerDown(item, event) {
    if (event.button) return // left / primary only
    const press = {
      id: item.id,
      facing: item.facing,
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
        onFace(press.id, press.facing === 'spine' ? 'front' : 'spine')
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up, { once: true })
  }

  function handleKeyDown(item, event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onFace(item.id, item.facing === 'spine' ? 'front' : 'spine')
  }

  // Where a book stands right now: its live drag position while
  // dragged, its resolved place otherwise.
  function placeOf(item) {
    return drag && drag.id === item.id ? drag : item
  }

  // Render order is the only z-index: spines first, face-out covers
  // after them, the dragged book on top of everything. Nothing about
  // order is ever stored.
  const idle = items.filter((item) => !drag || item.id !== drag.id)
  const spines = idle.filter((item) => item.facing === 'spine')
  const fronts = idle.filter((item) => item.facing === 'front')
  const dragged = drag ? items.find((item) => item.id === drag.id) : null
  const ordered = [...spines, ...fronts, ...(dragged ? [dragged] : [])]

  return (
    <section className="bookcase-page">
      <h2>the Bookcase</h2>
      <svg
        ref={svgRef}
        className="bookshelf-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="group"
        aria-label="the bookshelf"
      >
        {/* The constant bookshelf: one frame, three planks. */}
        <rect
          className="bookshelf-frame"
          x="4"
          y="4"
          width={WIDTH - 8}
          height={HEIGHT * 0.99 - 4}
          rx="3"
        />
        {PLANKS.map((y) => (
          <line
            key={y}
            className="bookshelf-plank"
            x1="4"
            y1={y}
            x2={WIDTH - 4}
            y2={y}
          />
        ))}
        {ordered.map((item) => {
          const shape = BOOK_SHAPES[item.type]
          const label = arrivalLabel({ key: item.type })
          const place = placeOf(item)
          const cx = place.x * WIDTH
          const base = place.y * HEIGHT
          const width =
            item.facing === 'front'
              ? shape.height * COVER_RATIO
              : shape.spineWidth
          return (
            <g
              key={item.id}
              className={`book book-${item.type}`}
              style={{ color: shape.color }}
              role="button"
              tabIndex={0}
              aria-label={label}
              onPointerDown={(event) => handlePointerDown(item, event)}
              onKeyDown={(event) => handleKeyDown(item, event)}
            >
              <rect
                className="book-body"
                x={cx - width / 2}
                y={base - shape.height}
                width={width}
                height={shape.height}
                rx="1.5"
              />
              {item.facing === 'front' && (
                <>
                  <DropGlyph
                    kind={item.type}
                    className="book-glyph"
                    x={cx - 7}
                    y={base - shape.height + 5}
                    width={14}
                    height={14}
                  />
                  <g
                    className="book-eye"
                    role="button"
                    tabIndex={0}
                    aria-label={`read ${label}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation()
                      onRead(item)
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      event.stopPropagation()
                      onRead(item)
                    }}
                  >
                    <circle cx={cx} cy={base - 12} r="7" />
                    <path
                      d={`M ${cx - 3.6} ${base - 12} Q ${cx} ${base - 15.4} ${cx + 3.6} ${base - 12} Q ${cx} ${base - 8.6} ${cx - 3.6} ${base - 12} Z`}
                    />
                    <circle
                      className="book-eye-pupil"
                      cx={cx}
                      cy={base - 12}
                      r="1.2"
                    />
                  </g>
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

export default BookcasePage
