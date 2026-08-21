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
import { useText } from './language.jsx'
import { CANVAS_HEIGHT, CANVAS_VIEWBOX, CANVAS_WIDTH } from './worldCanvas.js'

// The drawing frame (T5.4, 2026-08-21): the shared world-page canvas, a
// fixed 1000 x 600 pixels that never shrinks to fit a window — see
// worldCanvas.js. The bookshelf is constant — it never grows or
// reshapes; crowding is solved by Kimia's own arranging, not by the
// shelf. Shelf plank baselines sit at the fractions game/bookcase.js
// exports (1/3, 2/3, 0.99) so default slots land exactly on planks.
//
// One unit here is one pixel, which it was not before: the shelf used
// to be a 240-unit drawing stretched to fill the text column.
const WIDTH = CANVAS_WIDTH
const HEIGHT = CANVAS_HEIGHT
const PLANKS = [HEIGHT / 3, (HEIGHT * 2) / 3, HEIGHT * 0.99]

// EVERY SIZE BELOW IS A STAND-IN and leaves with the T5.3 art pass.
// Until then they keep the ON-SCREEN size they had before the canvas
// grew: the old 240-unit shelf rendered about 574px wide, so a unit
// there was 2.4 pixels here. The same figure the Abode uses, and for
// the same reason — the visible change is the SHELF getting bigger,
// which is the point, rather than the whole picture zooming in and
// holding no more books than before.
//
// NOTE FOR THE NEXT PASS: the shelf grew more in height (3.3x) than
// these did (2.4x), because the canvas is a wider shape than the old
// frame. So a book now stands about half its plank gap rather than
// seven tenths of it. That is a real change in how the shelf reads and
// it is Kimia's call, not one to make quietly here — see history.md.
const OLD_SCENE_SCALE = 2.4

// Placeholder book shapes, per reading type: width and height differ so
// the three rarities read at a glance, colours climb the violet family
// toward the rarest. Real art arrives with T5.3.
const BOOK_SHAPES = {
  magazine: {
    spineWidth: 9 * OLD_SCENE_SCALE,
    height: 42 * OLD_SCENE_SCALE,
    color: '#9d8cc9',
  },
  novel: {
    spineWidth: 12 * OLD_SCENE_SCALE,
    height: 48 * OLD_SCENE_SCALE,
    color: '#c5b8e8',
  },
  dictionary: {
    spineWidth: 16 * OLD_SCENE_SCALE,
    height: 52 * OLD_SCENE_SCALE,
    color: '#e0d7f7',
  },
}

// A front cover is its book's height, a little wider than tall is deep.
// A pure ratio, so the canvas change leaves it alone.
const COVER_RATIO = 0.68

// The rest of the shelf's hand-written measurements, all scaled with the
// books above so the picture is the same one, larger: how far the planks
// stop short of the frame, the drop glyph on a front cover, and the eye
// that opens a publication.
const PLANK_INSET = 4 * OLD_SCENE_SCALE
const BOOK_CORNER = 1.5 * OLD_SCENE_SCALE
const COVER_GLYPH = 14 * OLD_SCENE_SCALE
const COVER_GLYPH_TOP = 5 * OLD_SCENE_SCALE
const EYE_LIFT = 12 * OLD_SCENE_SCALE
const EYE_RADIUS = 7 * OLD_SCENE_SCALE
const EYE_HALF_WIDTH = 3.6 * OLD_SCENE_SCALE
const EYE_CURVE = 3.4 * OLD_SCENE_SCALE
const PUPIL_RADIUS = 1.2 * OLD_SCENE_SCALE

// A press becomes a drag once the pointer travels this many pixels;
// anything shorter is a click (the spine ↔ front toggle).
const DRAG_THRESHOLD_PX = 4

function clampUnit(value) {
  return Math.min(1, Math.max(0, value))
}

function BookcasePage({ items, onMove, onFace, onRead, onBack }) {
  const { t } = useText()
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
      <h2 className="page-title">{t('page.bookcase')}</h2>
      <div className="page-box">
        {/* The same window onto the same fixed canvas the Abode uses
          (T5.4): the shelf is 1000 x 600 whatever the window is, and a
          narrow window scrolls sideways rather than squeezing it. */}
        <div className="world-canvas-window">
          <svg
            ref={svgRef}
            className="bookshelf-svg world-canvas"
            viewBox={CANVAS_VIEWBOX}
            role="group"
            aria-label={t('bookcase.shelf')}
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
                x1={PLANK_INSET}
                y1={y}
                x2={WIDTH - PLANK_INSET}
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
                    rx={BOOK_CORNER}
                  />
                  {item.facing === 'front' && (
                    <>
                      <DropGlyph
                        kind={item.type}
                        className="book-glyph"
                        x={cx - COVER_GLYPH / 2}
                        y={base - shape.height + COVER_GLYPH_TOP}
                        width={COVER_GLYPH}
                        height={COVER_GLYPH}
                      />
                      <g
                        className="book-eye"
                        role="button"
                        tabIndex={0}
                        aria-label={t('bookcase.read', { label })}
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
                        <circle cx={cx} cy={base - EYE_LIFT} r={EYE_RADIUS} />
                        <path
                          d={`M ${cx - EYE_HALF_WIDTH} ${base - EYE_LIFT} Q ${cx} ${base - EYE_LIFT - EYE_CURVE} ${cx + EYE_HALF_WIDTH} ${base - EYE_LIFT} Q ${cx} ${base - EYE_LIFT + EYE_CURVE} ${cx - EYE_HALF_WIDTH} ${base - EYE_LIFT} Z`}
                        />
                        <circle
                          className="book-eye-pupil"
                          cx={cx}
                          cy={base - EYE_LIFT}
                          r={PUPIL_RADIUS}
                        />
                      </g>
                    </>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <button className="pebble" onClick={onBack}>
          ← back to the habits
        </button>
      </div>
    </section>
  )
}

export default BookcasePage
