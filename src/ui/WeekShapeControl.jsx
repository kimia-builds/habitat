// The week shape (T6.15) — a pebble beside the language switch that
// opens a small popup listing the three shapes a week can take:
// Mon–Sun, Sun–Sat, Sat–Fri. Kimia's call 2026-10-09.
//
// Choosing one saves it at once and closes the popup. It moves only the
// boundary between weeks: no mark is changed, so switching back and forth
// loses nothing. It is independent of language.
//
// It borrows the "start a new game" card exactly (same overlay, same
// panel) because it is the same kind of thing: a card that takes the
// screen, answers one question and leaves.

import { useState } from 'react'
import { WEEK_SHAPES } from '../game/days.js'
import { useText } from './language.jsx'

function WeekShapeControl({ weekShape, onChoose }) {
  const { t } = useText()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="pebble language-option week-shape-open"
        onClick={() => setOpen(true)}
      >
        {t('weekShape.button')}
      </button>

      {open && (
        <div className="reveal-overlay">
          <div
            className="new-game-popup"
            role="dialog"
            aria-modal="true"
            aria-label={t('weekShape.button')}
          >
            <p className="new-game-title">{t('weekShape.title')}</p>
            <div
              className="week-shape-choices"
              role="group"
              aria-label={t('weekShape.button')}
            >
              {WEEK_SHAPES.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  className={`pebble week-shape-option${
                    shape === weekShape ? ' week-shape-option-on' : ''
                  }`}
                  aria-pressed={shape === weekShape}
                  onClick={() => {
                    onChoose(shape)
                    setOpen(false)
                  }}
                >
                  {t(`weekShape.${shape}`)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="pebble new-game-dismiss"
              onClick={() => setOpen(false)}
            >
              {t('weekShape.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default WeekShapeControl
