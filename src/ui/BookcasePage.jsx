// The early Bookcase (T3.5): a plain page — like the early Abode from
// T3.3 — listing every piece of reading material ever received, in
// arrival order. Reading is never discarded (spec §5 Stream 2), so
// this list IS the collection; any publication opens its double-page
// spread again, anytime. There is NO read/unread anything — nothing
// stored, nothing marked, nothing nagging. The real shelves arrive in
// T4.2 and reuse the same popup.
//
// Publications are still generic ("a magazine") — names, art and
// spread images arrive with the T6.1 content pools.

import { arrivalLabel } from './arrivalText.js'
import DropGlyph from './DropGlyph.jsx'

function BookcasePage({ items, onRead, onBack }) {
  return (
    <section className="stub-page bookcase">
      <h2>the Bookcase</h2>
      {items.length > 0 ? (
        <ul className="abode-list" aria-label="reading material">
          {items.map((item) => (
            <li key={item.id} className="abode-row arrival-reading">
              <DropGlyph kind={item.type} />
              <span className="abode-name">
                {arrivalLabel({ key: item.type })}{' '}
                <span className="habit-meta">found {item.dayKey}</span>
              </span>
              <button onClick={() => onRead(item)}>read</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Empty shelves, waiting for the first reading material to drop.</p>
      )}
      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default BookcasePage
