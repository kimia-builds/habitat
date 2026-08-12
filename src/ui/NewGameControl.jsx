// "start a new game" (T6.6) — the door to starting over. Since
// 2026-08-12 (Kimia's call) there are TWO ways through it, so the door
// asks which one before it does anything:
//
//   TOTAL REFRESH  — everything goes. Habits, every completion ever
//                    logged, the whole world, every setting. Habitat
//                    begins exactly as it did on its first ever day.
//   KEEP HABIT DATA — the world begins again and the habit record
//                    survives whole (game/newgame.js): old marks keep
//                    their days and simply stop counting for the game.
//
// Two guards, both Kimia's calls:
//
//   - "keep habit data" cannot be pressed until a backup has been
//     exported IN THIS visit. Not "today", not "recently": the point of
//     the guard is that the file on disk holds the world about to be
//     discarded, and only an export made just now can promise that.
//     Until then that one button is dimmed and says plainly why, on
//     hover. The title sits on a SPAN around the button rather than on
//     the button itself, because browsers fire no hover events on a
//     disabled control and a tooltip there would never appear — which
//     is precisely when this explanation is needed.
//     "total refresh" carries no such guard (Kimia, 2026-08-12): it is
//     the deliberate throw-it-all-away door, and its own "are you sure?"
//     says so in as many words.
//   - whichever is chosen, a second step asks "are you sure?" and names
//     exactly what goes and exactly what stays, so nothing about the
//     outcome is a surprise. "no, take me back" returns to the choice
//     rather than closing — nobody is dropped out of the door they were
//     still standing in.
//
// Quiet by design (design-notes): no alarm colour, no shake, no
// tallying of what is about to be lost. It states the facts and waits.

import { useState } from 'react'

// What each door actually does, in plain words. Shown on the "are you
// sure?" step — the moment where being surprised would be worst.
const CONSEQUENCE = {
  refresh:
    'everything will be wiped: habits, completions, and game progress. ' +
    'habitat will restart from day one. only a backup file you have ' +
    'already exported can bring any of it back.',
  keep:
    'your gameplay will be wiped: flora, books, friends, fungi and ' +
    'expedition progress. your historical habit data, streaks and graphs ' +
    'will remain.',
}

const DONE_MESSAGE = {
  refresh: 'a new habitat has begun — everything starts from here',
  keep: 'a new game has begun — your habits and history are untouched',
}

function NewGameControl({ backedUp, onStartNewGame, onTotalRefresh }) {
  // Where in the door we are: null (closed), 'choose' (which way?), or
  // 'refresh' / 'keep' (are you sure?).
  const [step, setStep] = useState(null)
  const [message, setMessage] = useState('')

  function confirmed(choice) {
    setStep(null)
    if (choice === 'refresh') onTotalRefresh()
    else onStartNewGame()
    setMessage(DONE_MESSAGE[choice])
  }

  return (
    <div className="new-game-control">
      <button
        className="pebble"
        onClick={() => {
          setMessage('')
          setStep('choose')
        }}
      >
        start a new game
      </button>
      {message && <p role="status">{message}</p>}

      {step !== null && (
        <div className="reveal-overlay">
          <div
            className="new-game-popup"
            role="dialog"
            aria-modal="true"
            aria-label="start a new game"
          >
            {step === 'choose' ? (
              <>
                <p className="new-game-title">which type of restart?</p>
                <p className="new-game-detail">
                  do you want to wipe all your habit history and play habitat
                  from total scratch?
                  {/* Two breaks, not one (Kimia, 2026-08-12): a blank
                      line between the two choices, so they read as two
                      questions rather than one long one. */}
                  <br />
                  <br />
                  or do you want to keep your habit history and restart the
                  game? (requires you to export a backup)
                </p>
                <div className="new-game-choices">
                  <button
                    className="pebble"
                    onClick={() => setStep('refresh')}
                  >
                    total refresh
                  </button>
                  <span title={backedUp ? undefined : 'export a backup first'}>
                    <button
                      className="pebble"
                      onClick={() => setStep('keep')}
                      disabled={!backedUp}
                    >
                      keep habit data
                    </button>
                  </span>
                </div>
                {/* A way out that changes nothing. Kimia asked for the two
                    choices; this is the third door every popup needs, so
                    opening the question is never a commitment. */}
                <button
                  className="pebble new-game-dismiss"
                  onClick={() => setStep(null)}
                >
                  not now
                </button>
              </>
            ) : (
              <>
                <p className="new-game-title">are you sure?</p>
                <p className="new-game-detail">{CONSEQUENCE[step]}</p>
                <div className="new-game-choices">
                  <button
                    className="pebble"
                    onClick={() => confirmed(step)}
                  >
                    yes
                  </button>
                  <button
                    className="pebble"
                    onClick={() => setStep('choose')}
                  >
                    no, take me back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewGameControl
