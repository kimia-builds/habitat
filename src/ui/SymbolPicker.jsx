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
    // `--choosing` while at least one charm is on: the stylesheet uses it
    // to fade the ones that are off. With nothing chosen there is no lens,
    // so every charm stays at full presence (2026-08-11).
    <div
      className={`symbol-picker${selected.length > 0 ? ' symbol-picker--choosing' : ''}`}
    >
      {ALL_SYMBOLS.map((symbol) => (
        <button
          key={symbol}
          type="button"
          // `charm-N` for the faint edge (T5.2b); the inline colour is
          // what `currentColor` picks up when the button is pressed.
          className={`symbol-button charm-${symbol}`}
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
