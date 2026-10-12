// The reading popup (T3.5, rebuilt in T6.24): an open book showing the
// text it holds, with its picture.
//
// What is on the pages comes from src/content/readingTexts.js (Kimia's
// file): each book remembers which text of the 126-text pool it holds
// (item.publicationId), so re-reading always shows the same pages.
// Pictures are square-bracket descriptions for now — the real drawings
// replace them one by one. A slot she has not written yet gets the quiet
// empty state: the publication itself and her "something will be here
// soon" line from the narration slots. Nothing is ever invented.
//
// Look (Kimia 2026-10-12): one fixed size per kind of publication, all in
// the Gaegu handwriting, laid out by spreadLayout.js. The close pebble
// sits BELOW the book, outside its card, so nothing is added to the pages
// themselves; Escape and a press on the dimmed backdrop close it too.
//
// Quiet pastel, not neon — re-reading is an everyday pleasure, not a
// POP moment. And reading is tracked NOWHERE (spec decisions
// 2026-07-19): opening or closing this popup stores nothing, ever.
//
// The words are English whatever language the app is in (spec §5: the
// local texts are never presented as a translation), so the pages are
// marked lang="en" and always read left to right.

import { useEffect } from 'react'
import { narrationSlot } from '../content/narration.js'
import { readingTextFor } from '../content/readingTexts.js'
import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'
import { useText } from './language.jsx'
import { spreadLayout } from './spreadLayout.js'

function SpreadPopup({ item, onClose }) {
  const { t } = useText()
  const label = arrivalLabel({ key: item.type }, t)
  const pages = readingTextFor(item.publicationId)
  const emptyLine = narrationSlot('spreadPopup.emptyState')
  const layout = pages ? spreadLayout(pages) : null

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const picture = pages?.picture && (
    <p className="spread-picture">{pages.picture}</p>
  )
  const words = pages?.text && (
    <p className={`spread-text spread-text-${layout.size}`}>{pages.text}</p>
  )

  return (
    <div
      className="reveal-overlay"
      role="dialog"
      aria-label={label}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="spread-stage arrival-reading">
        <div className="spread-popup">
          {pages ? (
            <div
              className={`spread-book spread-${item.type} spread-fold-${layout.fold}`}
              lang="en"
              dir="ltr"
            >
              {layout.fold === 'pages' ? (
                <>
                  <div className="spread-page">{picture}</div>
                  <div className="spread-page">{words}</div>
                </>
              ) : (
                <div className="spread-page">
                  {picture}
                  {words}
                </div>
              )}
            </div>
          ) : (
            <>
              <DropGlyph kind={item.type} className="reveal-glyph" />
              <p className="arrival-caption">{label}</p>
              {emptyLine && <p className="spread-empty-line">{emptyLine}</p>}
            </>
          )}
        </div>
        <button className="reveal-button pebble" onClick={onClose}>
          {t('bookcase.close')}
        </button>
      </div>
    </div>
  )
}

export default SpreadPopup
