// Placeholder pages behind the meters (T2.2): clicking a meter has to
// lead SOMEWHERE so the navigation is real. Only the Market still
// waits (T4.3b) — the Map got its real page in T4.1, the Bookcase its
// constant bookshelf in T4.2, the Abode an early one in T3.3.

const STUBS = {
  market: {
    title: 'the Market',
    blurb: 'The stall is not set up yet. The locals ask for patience.',
  },
}

function StubPage({ page, onBack }) {
  const stub = STUBS[page]
  return (
    <section className="stub-page">
      <h2>{stub.title}</h2>
      <p>{stub.blurb}</p>
      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default StubPage
