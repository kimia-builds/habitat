// The Market (T4.3b): the rotating stall — spec §5 Stream 3.
//
// A SMALL SELECTION at a time, rotating every 28 lived days; the stall
// and rotation arrive as props, already derived from completion history
// (game/market.js), so this page only draws. Objects are PURCHASED,
// never dropped; buying and selling are always the same price, so the
// quiet buy button is the whole shop — no haggling, no penalty, no
// spread. Duplicates are allowed (Kimia's call 2026-07-20), so an
// object she already owns simply says so, and the wallet decides what
// can be bought: a price she can't reach just dims its button — no
// alarm, no debt, no punishment feel.
//
// Until the first region is known the pool is empty and the page shows
// a bare stall — no prose, no count (the bookshelf precedent). The
// rotation itself is never explained on the page: nothing here is
// missable, so there is nothing to countdown to (no FOMO, spec §5).

import DropGlyph from './DropGlyph.jsx'
import ObjectGlyph from './ObjectGlyph.jsx'
import { useText } from './language.jsx'

function MarketPage({ stall, purchases, wallet, worldSeed, onBuy, onBack }) {
  const { t } = useText()
  // How many copies of each offered object Kimia already owns — said
  // quietly, since buying another is allowed.
  const ownedCounts = new Map()
  for (const purchase of purchases) {
    ownedCounts.set(
      purchase.objectKey,
      (ownedCounts.get(purchase.objectKey) ?? 0) + 1,
    )
  }

  return (
    <section className="stub-page market">
      <h2 className="page-title">{t('page.market')}</h2>
      <div className="page-box">
        {/* The shared world-page canvas (T5.4): the stall stands in the
          same 1000 x 600 frame the Abode, the Library and the Map hold,
          so the four gameplay pages are one size and nothing resizes
          under you as you move between them. A bare stall is a bare
          frame — no prose, no apology (Kimia's rule for these pages). */}
        <div className="world-canvas-window">
          <div className="market-scene world-canvas">
            {stall.length > 0 && (
              <ul className="market-stall" aria-label={t('market.stall')}>
                {stall.map((object) => {
                  const owned = ownedCounts.get(object.key) ?? 0
                  const affordable = wallet >= object.price
                  return (
                    <li key={object.key} className="market-item">
                      <ObjectGlyph
                        objectKey={object.key}
                        worldSeed={worldSeed}
                        className="market-glyph"
                      />
                      <span className="market-price">
                        <DropGlyph
                          kind="fungi"
                          className="market-price-glyph"
                        />
                        {object.price}
                      </span>
                      {owned > 0 && (
                        <span className="market-owned">×{owned} at home</span>
                      )}
                      <button
                        className="market-buy pebble"
                        aria-label={t('market.buyLabel', {
                          price: object.price,
                        })}
                        disabled={!affordable}
                        onClick={() => onBuy(object)}
                      >
                        {t('market.buy')}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <button className="pebble" onClick={onBack}>
          ← back to the habits
        </button>
      </div>
    </section>
  )
}

export default MarketPage
