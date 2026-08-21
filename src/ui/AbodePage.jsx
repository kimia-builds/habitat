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
import { ABODE_SKIES, DEFAULT_ABODE_SKY } from '../game/abode.js'
import Flora, { FloraDefs, floraBox } from './Flora.jsx'
import Friend from './Friend.jsx'
import ObjectGlyph from './ObjectGlyph.jsx'
import { floraBaseWhereSmallestIs } from './floraCanon.js'
import { baseWhereSmallestIs } from './friendCanon.js'
import { useText } from './language.jsx'
import { AbodeSky } from './sky.jsx'
import { CANVAS_HEIGHT, CANVAS_VIEWBOX, CANVAS_WIDTH } from './worldCanvas.js'

// The drawing frame (T5.4, 2026-08-21): the shared world-page canvas,
// a fixed 1000 × 600 pixels that never shrinks to fit a window — see
// worldCanvas.js for why, and index.css for the window that scrolls
// around it. The ground is constant — it never grows or reshapes;
// crowding is solved by Kimia's own arranging (the bookshelf
// precedent). The horizon sits at the fraction game/abode.js exports,
// so default spots land on the ground below it.
//
// One unit here is one pixel, which it was not before: the ground used
// to be a 240-unit drawing stretched to fill the text column.
const WIDTH = CANVAS_WIDTH
const HEIGHT = CANVAS_HEIGHT

// THE OLD SCENE'S SCALE. Before the T5.4 canvas the ground was a
// 240-unit drawing stretched to about 574px, so a unit there was 2.4
// pixels here. The things still wearing placeholder glyphs keep that
// scale, so the visible change stays the GROUND getting bigger rather
// than the whole picture zooming in.
const OLD_SCENE_SCALE = 2.4

// HOW MUCH ROOM THE GROWING AND WALKING THINGS GET HERE (T5.3i,
// 2026-08-21). One base number for the whole scene: every flora and
// every visiting friend is a fraction of it, so the two families stand
// true to each other and to their own kind — floraCanon.js and
// friendCanon.js speak the same scale, which is the entire point of
// having built them that way.
//
// Chosen by Kimia's rule for picking a base: size up from the SMALLEST
// thing, not the biggest. The smallest thing that can stand on this
// ground is a plip, so say how big a plip must be before its drawing
// reads and let everything else follow. 24px is what a plip gets in the
// Guest Book list, judged there and the same size on screen here.
//
// What that makes, for a person reading rather than computing: a small
// flora 48px tall, a large flora 133px, and the largest friend 173px
// wide. The small flora landing on the placeholder sprig's old 48px is
// a coincidence, and a welcome one — the plants that were here yesterday
// are the size they were, and the large ones are the new thing.
const SCENE_BASE = baseWhereSmallestIs(24)

// A held item grows a touch to show it is in hand. This is a SCALE on
// the whole figure, never a second size: the canon says how big a flora
// is, and a momentary touch of juice may not quietly become a different
// answer to that. (26/20 — the proportion the placeholder glyphs grew
// by, kept exactly.)
const HELD_SCALE = 26 / 20

// THE DOORSTEP'S OWN BASE. The little list of finds waiting to be decided is
// not the ground: it holds flora and nothing else, so it sizes from the
// smallest FLORA rather than from the smallest friend. A small flora stands
// 1.6rem — about a line of text — which puts a large one at 4.4rem, and that
// unevenness is the honest answer: a large flora IS 2.75x a small one, and a
// list that squared them into matching thumbnails would teach the opposite.
const DOORSTEP_BASE = floraBaseWhereSmallestIs(1.6)

// A curiosity is still a placeholder glyph, and keeps the placeholder's
// size. It is the one thing on this ground with NO canon to ask: the
// objects are not drawn yet and design-bible §10a gives them no sizes,
// only "price correlates with size". Nothing here invents one — when
// they are drawn they take their places in the same table the flora and
// the friends already share.
const OBJECT_SIZE = 20 * OLD_SCENE_SCALE // 48px

// A press becomes a drag once the pointer travels this many pixels;
// anything shorter is a click (hold ↔ settle back). A real screen
// pixel, unrelated to the scene's units — it measures a finger, not a
// drawing — though since T5.4 the two happen to be the same thing.
const DRAG_THRESHOLD_PX = 4

// The held item's label and its way back to the world, stacked above
// it: how far in from an edge the centred text has to stay to remain
// readable, how far the name sits above the item, and the gap down to
// the compost / sell line. Scaled with everything else above, so the
// words are the same size on screen as they were.
const LABEL_EDGE_INSET = 26 * OLD_SCENE_SCALE
const LABEL_LIFT = 7 * OLD_SCENE_SCALE
const LABEL_CEILING = 8 * OLD_SCENE_SCALE
const LABEL_LINE_GAP = 9 * OLD_SCENE_SCALE

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
  sky = DEFAULT_ABODE_SKY,
  onDecide,
  onMove,
  onSell,
  onChooseSky,
  onBack,
}) {
  const { t } = useText()
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
      <h2 className="page-title">{t('page.abode')}</h2>
      {/* The texture library's definitions, once for the whole page: every
        flora on it — the doorstep's and the ground's — paints its fill
        through them. */}
      <FloraDefs />
      <div className="page-box">
        {/* The quiet / party toggle (T4.4): a switch with an icon either
          side. Greyed — "not yet" — until the first friend exists.
          Every part of it names itself on hover (Kimia's call
          2026-08-12): the switch is "pick your mood", the stone side is
          "quietude", the gathering side is "party mode". Until a friend
          exists the whole thing says "not yet" instead — one honest
          answer beats three labels for something that cannot be done.
          The titles sit on SPANS wrapping the two glyphs, because the
          title attribute is HTML's and an <svg> is not obliged to
          honour it.
          The switch keeps "party mode" as its ACCESSIBLE name while its
          hover label reads "pick your mood": a switch has to say what it
          turns on, and on/off is what aria-checked reports. */}
        <div className="abode-controls">
          <div
            className={`abode-mode${partyAvailable ? '' : ' abode-mode-off'}`}
            // The disabled switch fires no hover events of its own, so the
            // "not yet" it should be saying has to live on this wrapper.
            title={partyAvailable ? undefined : t('abode.notYet')}
          >
            <span
              title={partyAvailable ? t('abode.quietude') : t('abode.notYet')}
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
            </span>
            <button
              className="abode-mode-switch"
              role="switch"
              aria-checked={party}
              aria-label={t('abode.partyMode')}
              title={partyAvailable ? t('abode.pickMood') : t('abode.notYet')}
              disabled={!partyAvailable}
              onClick={handlePartyToggle}
            >
              <span className="abode-mode-knob" />
            </button>
            <span
              title={partyAvailable ? t('abode.partyMode') : t('abode.notYet')}
            >
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
            </span>
          </div>

          {/* THE FOUR SKIES (T5.4, Kimia's call 2026-08-21). Beside the
          quiet / party toggle, so the Abode's two choices sit together.
          Each swatch IS the sky it picks — a small live drawing of it,
          not a coloured square standing for one — because these four
          differ by nebula and cloud as much as by hue, and a flat chip
          could not tell you which is which. The chosen one is a radio
          group's checked option rather than a pressed button: they are
          four answers to one question, exactly what a radio group is,
          and it keeps arrow keys working between them.
          The choice is remembered with the save (storage v12), so the
          sky you arrange under is the sky you come back to. */}
          <div
            className="abode-skies"
            role="radiogroup"
            aria-label={t('abode.pickSky')}
            title={t('abode.pickSky')}
          >
            {ABODE_SKIES.map((palette) => {
              const chosen = palette === sky
              return (
                <button
                  key={palette}
                  type="button"
                  role="radio"
                  aria-checked={chosen}
                  className={`abode-sky-swatch${chosen ? ' chosen' : ''}`}
                  title={t(`abode.sky.${palette}`)}
                  aria-label={t(`abode.sky.${palette}`)}
                  onClick={() => onChooseSky?.(palette)}
                >
                  <AbodeSky palette={palette} />
                </button>
              )
            })}
          </div>
        </div>

        {pending.length > 0 && (
          <>
            <h3>waiting to decide</h3>
            <ul className="abode-list" aria-label={t('abode.waitingToDecide')}>
              {pending.map((find) => (
                <li key={find.completionId} className="abode-row arrival-flora">
                  <Flora
                    completionId={find.completionId}
                    worldSeed={worldSeed}
                    base={DOORSTEP_BASE}
                    unit="rem"
                    idPrefix={`doorstep-${find.completionId}-`}
                  />
                  <span className="abode-name">{t('abode.floraFind')}</span>
                  <button
                    className="pebble arrival-choice"
                    onClick={() => onDecide(find.completionId, 'gathered')}
                  >
                    gather
                  </button>
                  <button
                    className="pebble arrival-choice"
                    onClick={() => onDecide(find.completionId, 'left')}
                  >
                    leave it
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* THE WINDOW ONTO THE GROUND (T5.4). The canvas inside is a
          fixed 1000 x 600 and never shrinks, so on a narrow screen this
          box is the part of it you can see and you scroll sideways to
          reach the rest — Kimia's rule, 2026-08-21. Vertical is left to
          the page's own scroll rather than nested here: two scrollbars
          inside one another is a maze, and the page already scrolls. */}
        <div className="world-canvas-window">
          <div className="abode-scene world-canvas">
            {/* THE SKY (T5.4). Opaque, filling the whole canvas, and the
              only thing behind everything else — the app's own starfield
              never shows through the Abode any more. It is a separate
              layer rather than a shape inside the ground drawing so that
              nothing Kimia arranges has to be drawn around it. */}
            <div className="abode-sky-layer">
              <AbodeSky palette={sky} />
            </div>
            <svg
              ref={svgRef}
              className="abode-ground-svg"
              viewBox={CANVAS_VIEWBOX}
              role="group"
              aria-label={t('abode.ground')}
              onPointerDown={() => setHeldId(null)}
            >
              {/* NO SOIL AND NO HORIZON LINE since T5.4 (Kimia's call,
              2026-08-21). The scene is one opaque nebula sky, edge to
              edge, with everything standing cleanly on top of it. The
              sky is the layer BEHIND this drawing rather than part of
              it, so this SVG holds nothing but the things you put here.
              game/abode.js's HORIZON survives as the fraction default
              spots are laid out against — a new arrival still lands low
              in the scene instead of adrift in the middle of it. */}
              {ordered.map((item) => {
                const isObject = item.kind === 'object'
                const name = isObject
                  ? t('abode.curiosity')
                  : t('abode.floraFind')
                const isHeld = item.id === heldId
                const place = placeOf(item)
                const cx = place.x * WIDTH
                const base = place.y * HEIGHT
                // How much room this one takes. A flora asks the canon (its
                // shape and size class were dealt from the seed); a curiosity
                // is still a placeholder glyph with no canon to ask.
                const box = isObject
                  ? { width: OBJECT_SIZE, height: OBJECT_SIZE }
                  : floraBox(item.id, worldSeed, SCENE_BASE)
                // Held, the whole figure grows a touch about its own foot, so
                // it stays planted where you left it and its canon size is
                // never re-typed as a second number.
                const hold = isHeld
                  ? `translate(${cx} ${base}) scale(${HELD_SCALE}) translate(${-cx} ${-base})`
                  : undefined
                const drawnHeight = box.height * (isHeld ? HELD_SCALE : 1)
                // The held item's name and its quiet way back stack above it,
                // clamped so they stay readable at the scene's edges.
                const textX = Math.min(
                  WIDTH - LABEL_EDGE_INSET,
                  Math.max(LABEL_EDGE_INSET, cx),
                )
                const nameY = Math.max(
                  LABEL_CEILING,
                  base - drawnHeight - LABEL_LIFT,
                )
                // The placeholder curiosity wears its glow as a CSS halo;
                // a real flora's aura is inside its own drawing (§3), so the
                // two take different classes.
                const glyphClass = isHeld
                  ? 'abode-flora-glyph held'
                  : 'abode-flora-glyph'
                const floraClass = isHeld
                  ? 'abode-flora-art held'
                  : 'abode-flora-art'
                return (
                  <g key={item.id} className="abode-flora">
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={name}
                      aria-pressed={isHeld}
                      className="abode-flora-hold"
                      transform={hold}
                      onPointerDown={(event) => handlePointerDown(item, event)}
                      onKeyDown={(event) => handleKeyDown(item, event)}
                    >
                      {isObject ? (
                        <ObjectGlyph
                          objectKey={item.objectKey}
                          worldSeed={worldSeed}
                          className={glyphClass}
                          x={cx - box.width / 2}
                          y={base - box.height}
                          width={box.width}
                          height={box.height}
                        />
                      ) : (
                        <Flora
                          completionId={item.id}
                          worldSeed={worldSeed}
                          base={SCENE_BASE}
                          idPrefix={`${item.id}-`}
                          className={floraClass}
                          x={cx - box.width / 2}
                          y={base - box.height}
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
                          aria-label={
                            isObject ? t('abode.sell') : t('abode.compost')
                          }
                          x={textX}
                          y={nameY + LABEL_LINE_GAP}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => {
                            if (isObject) handleSell(item)
                            else handleCompost(item)
                          }}
                          onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ')
                              return
                            event.preventDefault()
                            if (isObject) handleSell(item)
                            else handleCompost(item)
                          }}
                        >
                          {isObject ? t('abode.sell') : t('abode.compost')}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
            {/* Party mode: the friends, simply present among the flora — not
              draggable, not performing, never stored.
              THEY SIT ON A LAYER ABOVE THE DRAWING rather than inside it
              (T5.3i, 2026-08-21). Friend.jsx is two stacked svgs in an HTML
              wrapper — friend10.jsx's header has the reason, a blink may never
              re-blur the whole body — so a friend cannot be a shape inside
              another svg. The layer covers the same box exactly, so a scene
              fraction means the same thing in both, and it passes every press
              straight through to the flora underneath. */}
            {party && (
              <div className="abode-party-layer">
                {formation.map(({ friend, x, y }) => (
                  <span
                    key={friend.completionId}
                    className="abode-party-friend"
                    role="img"
                    aria-label={t('abode.visitingFriend')}
                    style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  >
                    <Friend
                      category={friend.category}
                      individual={friend.individual}
                      worldSeed={worldSeed}
                      base={SCENE_BASE}
                      unit="px"
                      idPrefix={`party-${friend.completionId}-`}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="pebble" onClick={onBack}>
          ← back to the habits
        </button>
      </div>
    </section>
  )
}

export default AbodePage
