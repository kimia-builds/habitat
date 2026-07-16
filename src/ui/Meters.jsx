// The three meters, at the top of the habit list (T2.2). Spec §5 wants
// them "permanently at the top of the app"; Kimia's decision 2026-07-16
// keeps the morning check-in screen focused, so they live on the list
// (and everything reached from it), not above the check-in.
//
// Each meter is a button: expedition opens the Map, literacy the
// Bookcase, fungus the Market — placeholder pages until M4. All maths
// comes from the meter engine (T2.1); this component only draws.

import {
  expeditionSegment,
  expeditionSteps,
  literacyPoints,
  literacySegment,
  milestonesReached,
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
  const doors = milestonesReached(points)
  const literacy = literacySegment(points)

  return (
    <section className="meters" aria-label="meters">
      {/* Expedition: a rolling bar (decision 2026-07-16) — fills over
          ~a month of taps, rolls over, starts again — plus the running
          total, so every single tap visibly moves something. */}
      <button className="meter meter-expedition" onClick={() => onOpen('map')}>
        <span className="meter-name">expedition</span>
        <Bar
          label="expedition progress"
          into={expedition.into}
          size={expedition.size}
          className="meter-bar-expedition"
        />
        <span className="meter-value">
          {steps} {steps === 1 ? 'step' : 'steps'}
        </span>
      </button>

      {/* Literacy: progress toward the next friendship door, and how
          many of the 10 doors are open. Sits at zero until reading
          material starts dropping in M3. */}
      <button
        className="meter meter-literacy"
        onClick={() => onOpen('bookcase')}
      >
        <span className="meter-name">literacy</span>
        <Bar
          label="literacy progress"
          into={literacy.into}
          size={literacy.size}
          className="meter-bar-literacy"
        />
        <span className="meter-value">{doors}/10 doors</span>
      </button>

      {/* Fungus: a wallet, not a progress bar (spec §5 Stream 3) — so
          no bar, just the balance. Empty until fungi drop in M3. */}
      <button className="meter meter-fungus" onClick={() => onOpen('market')}>
        <span className="meter-name">fungi</span>
        <span className="meter-wallet">{fungusBalance}</span>
        <span className="meter-value">in the wallet</span>
      </button>
    </section>
  )
}

export default Meters
