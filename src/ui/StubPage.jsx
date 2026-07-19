// Placeholder pages behind the meters (T2.2): clicking a meter has to
// lead SOMEWHERE so the navigation is real, but the actual Map and
// Market are built in M4. Until then, a quiet promise. (The Bookcase
// got its early real page in T3.5; the Abode got one in T3.3.)

const STUBS = {
  map: {
    title: 'the Map',
    blurb: 'The planet is out there. Charting it comes in a later update.',
  },
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
