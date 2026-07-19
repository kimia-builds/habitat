// The reading popup (T3.5): a double-page spread of the publication —
// a picture Kimia provides (never AI-generated, design-notes §7),
// keyed per publication in src/content/spreads.js. Until a spread
// exists, a quiet empty state: the publication itself and, if Kimia
// has written it, her empty-state line from the narration slots.
//
// Quiet pastel, not neon — re-reading is an everyday pleasure, not a
// POP moment. And reading is tracked NOWHERE (spec decisions
// 2026-07-19): opening or closing this popup stores nothing, ever.

import { narrationSlot } from '../content/narration.js'
import { spreadFor } from '../content/spreads.js'
import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'

function SpreadPopup({ item, onClose }) {
  const label = arrivalLabel({ key: item.type })
  const image = spreadFor(item.publicationId)
  const emptyLine = narrationSlot('spreadPopup.emptyState')
  return (
    <div className="reveal-overlay" role="dialog" aria-label={label}>
      <div className="spread-popup arrival-reading">
        {image ? (
          <img
            className="spread-image"
            src={import.meta.env.BASE_URL + image}
            alt={`the open double-page spread of ${label}`}
          />
        ) : (
          <>
            <DropGlyph kind={item.type} className="reveal-glyph" />
            <p className="arrival-caption">{label}</p>
            {emptyLine && <p className="spread-empty-line">{emptyLine}</p>}
          </>
        )}
        <button className="reveal-button" onClick={onClose}>
          close
        </button>
      </div>
    </div>
  )
}

export default SpreadPopup
