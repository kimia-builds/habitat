// TEMPORARY (T5 prep, Kimia's call 2026-07-21) — the design-assets
// workbench: one shelf per image-asset family the M5 design pass will
// fill — the six charms (T5.1), the friend, flora, fungi, market-object
// and region art (T5.3), and the reading spreads (T3.5, images Kimia
// provides). Everything ships empty for now: a place to hang each
// asset as it's designed, and one page to eyeball the whole set
// together. This page and its door at the foot of the home screen are
// scaffolding — they leave (or become something deliberate) when the
// design pass lands.
//
// The fixed-size families take their counts from constants, so the
// page grows right if those ever move; the open-ended families (flora,
// fungi, objects, spreads — sized by the T6.1 content pools) get one
// empty shelf each.

import {
  FRIEND_CATEGORIES,
  MAP_REGION_COUNT,
  SYMBOL_COUNT,
} from '../game/constants.js'

const FAMILIES = [
  { key: 'charms', slots: SYMBOL_COUNT }, // T5.1 — the six habit tags
  { key: 'friends', slots: FRIEND_CATEGORIES.length }, // T5.3
  { key: 'map regions', slots: MAP_REGION_COUNT }, // T5.3
  { key: 'flora', slots: 0 }, // open-ended — one empty shelf
  { key: 'fungi', slots: 0 },
  { key: 'market objects', slots: 0 },
  { key: 'reading spreads', slots: 0 },
]

function DesignPage({ onBack }) {
  return (
    <section className="stub-page design-page">
      <h2>design assets</h2>
      {FAMILIES.map((family) => (
        <section
          key={family.key}
          className="design-family"
          aria-label={family.key}
        >
          <h3>{family.key}</h3>
          {family.slots > 0 ? (
            <ul className="design-slots">
              {Array.from({ length: family.slots }, (_, index) => (
                <li key={index} className="design-slot" />
              ))}
            </ul>
          ) : (
            <div className="design-shelf" />
          )}
        </section>
      ))}
      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default DesignPage
