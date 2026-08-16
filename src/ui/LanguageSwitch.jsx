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
// PLACEMENT IS PROVISIONAL. It sits at the foot of the page beside the
// backup pebbles because that is the only settings-ish corner Habitat
// has. Kimia has not yet seen it there, and the foot of the list is a
// line she deliberately set at three controls (2026-08-12) — so this is
// a first placement to react to, not a decided one. Moving it is a
// matter of rendering it somewhere else; nothing else here changes.

import { LANGUAGES } from '../content/ui.js'
import { useText } from './language.jsx'

function LanguageSwitch({ onChoose }) {
  const { t, language } = useText()

  return (
    <div
      className="language-switch"
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
  )
}

export default LanguageSwitch
