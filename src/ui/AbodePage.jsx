// The early Abode (T3.3): a plain page — like the Map/Bookcase/Market
// stubs — where flora live once found. Two quiet shelves:
//
//   waiting to decide — finds not yet gathered or left (Kimia's
//     decision 2026-07-19: an undecided flora waits here, with no
//     deadline and no nagging, until she chooses)
//   gathered — flora taken home, each compostable ANYTIME; composting
//     returns it to the world and yields nothing
//
// Flora are still generic ("a flora find") — real species, names and
// art arrive with T6.1/T5.3, and the freely arrangeable Abode proper
// with T4.3. Purchased objects join this page in M4 too.

import DropGlyph from './DropGlyph.jsx'

function FloraRow({ find, children }) {
  return (
    <li className="abode-row arrival-flora">
      <DropGlyph kind="flora" />
      <span className="abode-name">
        a flora find <span className="habit-meta">found {find.dayKey}</span>
      </span>
      {children}
    </li>
  )
}

function AbodePage({ finds, onDecide, onBack }) {
  const pending = finds.filter((f) => f.status === 'pending')
  const gathered = finds.filter((f) => f.status === 'gathered')
  return (
    <section className="stub-page abode">
      <h2>the Abode</h2>

      {pending.length > 0 && (
        <>
          <h3>waiting to decide</h3>
          <ul className="abode-list" aria-label="waiting to decide">
            {pending.map((find) => (
              <FloraRow key={find.completionId} find={find}>
                <button onClick={() => onDecide(find.completionId, 'gathered')}>
                  gather
                </button>
                <button onClick={() => onDecide(find.completionId, 'left')}>
                  leave it
                </button>
              </FloraRow>
            ))}
          </ul>
        </>
      )}

      <h3>gathered</h3>
      {gathered.length > 0 ? (
        <ul className="abode-list" aria-label="gathered flora">
          {gathered.map((find) => (
            <FloraRow key={find.completionId} find={find}>
              <button onClick={() => onDecide(find.completionId, 'composted')}>
                compost
              </button>
            </FloraRow>
          ))}
        </ul>
      ) : (
        <p>nothing here yet</p>
      )}
      <p className="habit-meta">
        composted flora return to the world — nothing is ever lost
      </p>

      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default AbodePage
