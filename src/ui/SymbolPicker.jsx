// A row of the 6 symbol glyphs as toggle buttons. Used two ways:
//   - in the habit form (exactly one selected — the habit's tag)
//   - as the list filter (any number selected; empty = show everything)
// aria-pressed carries the on/off state for tests and screen readers.

import { SYMBOL_COUNT } from '../game/constants.js'
import CharmSymbol from './CharmSymbol.jsx'
import { SYMBOL_COLORS } from './symbols.js'

const ALL_SYMBOLS = Array.from({ length: SYMBOL_COUNT }, (_, i) => i + 1)

function SymbolPicker({ selected, onToggle }) {
  return (
    <div className="symbol-picker">
      {ALL_SYMBOLS.map((symbol) => (
        <button
          key={symbol}
          type="button"
          className="symbol-button"
          style={{ color: SYMBOL_COLORS[symbol] }}
          aria-pressed={selected.includes(symbol)}
          onClick={() => onToggle(symbol)}
        >
          <CharmSymbol symbol={symbol} />
        </button>
      ))}
    </div>
  )
}

export default SymbolPicker
