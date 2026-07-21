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

import {
  expeditionSegment,
  expeditionSteps,
  literacyLevelNumber,
  literacyPoints,
  literacySegment,
  walletBar,
} from '../game/meters.js'

// One bar. The width is the fraction of the current stretch covered;
// the aria values let tests (and screen readers) read the real numbers.
function Bar({ label, into, size, className }) {
  return (
    <div
      className={`meter-bar ${className}`}
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

function Meters({ completions, readingItems, fungusTrueBalance, onOpen }) {
  const steps = expeditionSteps(completions)
  const expedition = expeditionSegment(steps)
  const points = literacyPoints(readingItems)
  const literacy = literacySegment(points)
  const wallet = walletBar(fungusTrueBalance)

  return (
    <section className="meters" aria-label="meters">
      {/* Steps taken: a rolling bar (decision 2026-07-16) — fills over
          ~a month of taps, rolls over, starts again. The bar IS the
          whole story now: the lifetime total lives behind the hover
          (2026-07-21). */}
      <button
        className="meter meter-expedition"
        title={`${steps} steps taken`}
        onClick={() => onOpen('map')}
      >
        <span className="meter-name">steps taken</span>
        <Bar
          label="steps taken progress"
          into={expedition.into}
          size={expedition.size}
          className="meter-bar-expedition"
        />
      </button>

      {/* Literacy level: progress toward the next friendship door. The
          doors themselves are not counted out loud (2026-07-19); they
          open in the Guest Book's time (T4.4). The level as a number
          out of 100 lives behind the hover (2026-07-21). */}
      <button
        className="meter meter-literacy"
        title={`${Math.round(literacyLevelNumber(points))} of 100`}
        onClick={() => onOpen('bookcase')}
      >
        <span className="meter-name">literacy level</span>
        <Bar
          label="literacy level progress"
          into={literacy.into}
          size={literacy.size}
          className="meter-bar-literacy"
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
        />
      </button>
    </section>
  )
}

export default Meters
