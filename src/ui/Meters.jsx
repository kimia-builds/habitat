// The three meters, at the top of the habit list (T2.2). Spec §5 wants
// them "permanently at the top of the app"; Kimia's decision 2026-07-16
// keeps the morning check-in screen focused, so they live on the list
// (and everything reached from it), not above the check-in.
//
// Each meter is a button opening its page: steps taken → the Map,
// literacy level → the Bookcase, wallet balance → the Market. Kimia's
// copy pass (2026-07-19): those are the names, and the meters say
// nothing else — no running totals, door counts or captions underneath.
// All maths comes from the meter engine (T2.1); this component only
// draws.

import {
  expeditionSegment,
  expeditionSteps,
  literacyPoints,
  literacySegment,
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

function Meters({ completions, readingItems, fungusBalance, onOpen }) {
  const steps = expeditionSteps(completions)
  const expedition = expeditionSegment(steps)
  const points = literacyPoints(readingItems)
  const literacy = literacySegment(points)

  return (
    <section className="meters" aria-label="meters">
      {/* Steps taken: a rolling bar (decision 2026-07-16) — fills over
          ~a month of taps, rolls over, starts again. The bar IS the
          whole story now: no running total underneath (2026-07-19). */}
      <button className="meter meter-expedition" onClick={() => onOpen('map')}>
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
          open in the Guest Book's time (T4.4). */}
      <button
        className="meter meter-literacy"
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

      {/* Wallet balance: a wallet, not a progress bar (spec §5 Stream 3)
          — so no bar, just the number itself. */}
      <button className="meter meter-fungus" onClick={() => onOpen('market')}>
        <span className="meter-name">wallet balance</span>
        <span className="meter-wallet">{fungusBalance}</span>
      </button>
    </section>
  )
}

export default Meters
