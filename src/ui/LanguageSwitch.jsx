// The language switch (T6.13) — the one control that changes which
// language Habitat speaks.
//
// It is a plain set of names, one per language, the current one marked.
// Two deliberate details:
//
//   Each language names itself IN ITS OWN SCRIPT — "English" and
//   "فارسی" — and reads the same whichever language is currently on.
//   That is why those two slots in src/content/ui.js are the only ones
//   pre-filled in the Farsi block. Someone who lands in a language they
//   cannot read must still be able to find their way out, and a switch
//   that renamed itself would be a trap.
//
//   The choice is SAVED, not screen state: it rides in settings, inside
//   the storage envelope, so it survives a reload and travels in a
//   backup. Habitat opens in the language you left it in.
//
// PLACEMENT (Kimia's call 2026-10-11): it stands on its own quiet line
// at the very foot of EVERY page — home, the field notes, and each page
// the rail opens — so the language can be changed from anywhere. On home
// and the field notes that line sits under the three backup pebbles.

import { LANGUAGES } from '../content/ui.js'
import { useText } from './language.jsx'

function LanguageSwitch({ onChoose, children }) {
  const { t, language } = useText()

  return (
    <div className="language-switch">
      <div
        className="language-options"
        aria-label={t('language.switch')}
        role="group"
      >
        {LANGUAGES.map((code) => (
          <button
            key={code}
            type="button"
            className={`pebble language-option${
              code === language ? ' language-option-on' : ''
            }`}
            // The pressed state is what says "you are here", so it needs
            // to reach a screen reader too, not just the eye.
            aria-pressed={code === language}
            lang={code}
            onClick={() => onChoose(code)}
          >
            {t(`language.${code}`)}
          </button>
        ))}
      </div>
      {/* The week-shape pebble rides on the same line — on the field
          notes only (2026-10-09; narrowed to that page 2026-10-11). */}
      {children}
    </div>
  )
}

export default LanguageSwitch
