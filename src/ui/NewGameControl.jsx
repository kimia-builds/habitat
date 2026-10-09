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
import { useText } from './language.jsx'

function NewGameControl({ backedUp, onStartNewGame, onTotalRefresh }) {
  const { t } = useText()
  // Where in the door we are: null (closed), 'choose' (which way?), or
  // 'refresh' / 'keep' (are you sure?).
  const [step, setStep] = useState(null)
  const [message, setMessage] = useState('')

  function confirmed(choice) {
    setStep(null)
    if (choice === 'refresh') onTotalRefresh()
    else onStartNewGame()
    setMessage(t(`newGame.${choice}Done`))
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
        {t('newGame.start')}
      </button>
      {message && <p role="status">{message}</p>}

      {step !== null && (
        <div className="reveal-overlay">
          <div
            className="new-game-popup"
            role="dialog"
            aria-modal="true"
            aria-label={t('newGame.start')}
          >
            {step === 'choose' ? (
              <>
                <p className="new-game-title">{t('newGame.which')}</p>
                <p className="new-game-detail">
                  {t('newGame.askWipe')}
                  {/* Two breaks, not one (Kimia, 2026-08-12): a blank
                      line between the two choices, so they read as two
                      questions rather than one long one. */}
                  <br />
                  <br />
                  {t('newGame.askKeep')}
                </p>
                <div className="new-game-choices">
                  <button className="pebble" onClick={() => setStep('refresh')}>
                    {t('newGame.refresh')}
                  </button>
                  <span title={backedUp ? undefined : t('newGame.backupFirst')}>
                    <button
                      className="pebble"
                      onClick={() => setStep('keep')}
                      disabled={!backedUp}
                    >
                      {t('newGame.keep')}
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
                  {t('newGame.notNow')}
                </button>
              </>
            ) : (
              <>
                <p className="new-game-title">{t('newGame.sure')}</p>
                <p className="new-game-detail">{t(`newGame.${step}Warning`)}</p>
                <div className="new-game-choices">
                  <button className="pebble" onClick={() => confirmed(step)}>
                    {t('newGame.yes')}
                  </button>
                  <button className="pebble" onClick={() => setStep('choose')}>
                    {t('newGame.no')}
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
