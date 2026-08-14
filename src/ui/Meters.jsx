// The three meters, at the top of the habit list (T2.2). Spec §5 wants
// them "permanently at the top of the app"; Kimia's decision 2026-07-16
// keeps the morning check-in screen focused, so they live on the list
// (and everything reached from it), not above the check-in.
//
// Each meter is a button opening its page: steps taken → the Map,
// literacy level → the Bookcase, wallet balance → the Market. Kimia's
// copy pass (2026-07-19): those are the names, and the meters say
// nothing else — no running totals, door counts or captions underneath.
//
// Since 2026-07-21 all three meters are bars (T4.5, Kimia's call — the
// bars mirror each other; the wallet bar fills toward 40 fungi and
// clamps), and the exact numbers live behind each meter's hover. The
// wallet's face still never shows debt — a negative number on the bar
// would read as punishment — so the bar is fed by walletBar, which
// clamps the TRUE balance (game/market.js's walletTrueBalance, negative
// while an undo's debt is being settled) into 0..40. The hover says it
// plainly instead: the number itself, negative and all (Kimia's
// explicit call 2026-07-21).
// All maths comes from the meter engine (T2.1); this component only
// draws.

// Since T5.2e (2026-08-14, design-notes §4) each forward movement also
// plays a momentary glow-and-thicken on the bar that moved, settling
// straight back — the resting state never changes. The maths of "did
// this move, and was it a roll-over?" is meterMovement's, in the game
// module; everything here is the drawing.

import { useEffect, useRef, useState } from 'react'

import { METER_MOVE_MS, METER_ROLLOVER_MS } from '../game/constants.js'
import {
  expeditionSegment,
  expeditionSteps,
  literacyLevelNumber,
  literacyPoints,
  literacySegment,
  meterMovement,
  meterReading,
  walletBar,
} from '../game/meters.js'

// One bar. The width is the fraction of the current stretch covered;
// the aria values let tests (and screen readers) read the real numbers.
// `beat` is null at rest, or 'step' / 'rollover' while a movement plays;
// `playId` counts the movements, and only exists so the same beat twice
// in a row can be told apart.
function Bar({ label, into, size, className, beat, playId }) {
  const bar = useRef(null)

  // Playing it AGAIN is the one fiddly bit. A CSS animation restarts
  // when its NAME changes — not when a counter does — so tapping +1
  // twice inside one glow would simply be ignored, and a habit tapped
  // in a hurry is exactly when the bar should keep answering. Taking
  // the animation off, making the browser act on that, and putting it
  // back is the standard way to force a replay. Reading a layout number
  // is what "making the browser act on it" means: without that line the
  // two changes collapse into no change at all.
  useEffect(() => {
    if (!beat || !bar.current) return
    const element = bar.current
    element.style.animation = 'none'
    void element.offsetHeight
    element.style.animation = ''
  }, [playId, beat])

  return (
    <div
      ref={bar}
      className={`meter-bar ${className}` + (beat ? ` meter-bar--${beat}` : '')}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuenow={into}
      aria-valuemax={size}
    >
      <div
        className="meter-bar-fill"
        style={{ width: `${(into / size) * 100}%` }}
      />
    </div>
  )
}

// Watch the three numbers and say what each bar should play.
//
// The previous reading normally starts as the FIRST one seen, so opening
// Habitat never plays a movement — arriving to three bars pulsing at
// nothing would be a ceremony for work done days ago.
//
// `heldFrom` is the one exception, and it is the check-in's (§4). That
// screen keeps a plain header of its own, so there is no meter on it to
// move; App holds the reading from before the check-in's first mark and
// hands it over as the starting point the moment the check-in closes.
// The whole session then moves once, together — exactly what that
// screen's drops already do.
function useMovement(reading, heldFrom) {
  const previous = useRef(heldFrom ?? reading)
  const [play, setPlay] = useState({
    id: 0,
    expedition: null,
    literacy: null,
    wallet: null,
  })
  const { steps, points, wallet } = reading

  useEffect(() => {
    const moved = meterMovement(previous.current, { steps, points, wallet })
    previous.current = { steps, points, wallet }
    if (!moved.expedition && !moved.literacy && !moved.wallet) return
    setPlay((last) => ({ id: last.id + 1, ...moved }))
  }, [steps, points, wallet])

  // Settling back is the point of the whole gesture (§4), so the bars
  // stop claiming to be moving when they have stopped. They all start
  // together, so one timer for the longest of them settles the lot;
  // nothing depends on the exact moment, and a bar left wearing the word
  // "moving" for the rest of the session would be a small lie told to
  // anything reading the page.
  const beats = [play.expedition, play.literacy, play.wallet]
  useEffect(() => {
    if (!beats.some(Boolean)) return
    const settleAfter = beats.includes('rollover')
      ? METER_ROLLOVER_MS
      : METER_MOVE_MS
    const timer = setTimeout(
      () =>
        setPlay((last) => ({
          ...last,
          expedition: null,
          literacy: null,
          wallet: null,
        })),
      settleAfter,
    )
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play.id])

  return play
}

function Meters({
  completions,
  readingItems,
  fungusTrueBalance,
  heldFrom,
  onOpen,
}) {
  const steps = expeditionSteps(completions)
  const expedition = expeditionSegment(steps)
  const points = literacyPoints(readingItems)
  const literacy = literacySegment(points)
  const wallet = walletBar(fungusTrueBalance)

  // Which numbers a movement is measured by is the game module's call
  // (meterReading), not this component's.
  const play = useMovement(
    meterReading(completions, readingItems, fungusTrueBalance),
    heldFrom,
  )

  return (
    <section className="meters" aria-label="meters">
      {/* Steps taken: a rolling bar (decision 2026-07-16) — fills over
          ~a month of taps, rolls over, starts again. The bar IS the
          whole story now: the lifetime total lives behind the hover
          (2026-07-21). */}
      <button
        className="meter meter-expedition"
        title={String(steps)}
        onClick={() => onOpen('map')}
      >
        <span className="meter-name">steps taken</span>
        <Bar
          label="steps taken progress"
          into={expedition.into}
          size={expedition.size}
          className="meter-bar-expedition"
          beat={play.expedition}
          playId={play.id}
        />
      </button>

      {/* Literacy level: progress toward the next friendship door. The
          doors themselves are not counted out loud (2026-07-19); they
          open in the Guest Book's time (T4.4). The bare level number
          lives behind the hover (2026-07-21; trimmed to just the
          number 2026-07-22). */}
      <button
        className="meter meter-literacy"
        title={String(Math.round(literacyLevelNumber(points)))}
        onClick={() => onOpen('bookcase')}
      >
        <span className="meter-name">literacy level</span>
        <Bar
          label="literacy level progress"
          into={literacy.into}
          size={literacy.size}
          className="meter-bar-literacy"
          beat={play.literacy}
          playId={play.id}
        />
      </button>

      {/* Wallet balance: a bar like its sisters since 2026-07-21,
          filling toward 40 fungi and clamping. Its face never shows
          debt — a negative number on the bar would read as punishment —
          but the hover tells the plain truth, negative and all. */}
      <button
        className="meter meter-fungus"
        title={String(fungusTrueBalance)}
        onClick={() => onOpen('market')}
      >
        <span className="meter-name">wallet balance</span>
        <Bar
          label="wallet balance progress"
          into={wallet.into}
          size={wallet.size}
          className="meter-bar-fungus"
          beat={play.wallet}
          playId={play.id}
        />
      </button>
    </section>
  )
}

export default Meters
