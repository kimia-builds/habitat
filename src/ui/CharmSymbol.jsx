// The six charms (design-notes §11a) — line-drawn SVGs that are the
// habit tags. One component draws all six; callers pass the symbol
// number 1..6. Shared shell attributes match §11a exactly: fill="none",
// stroke="currentColor", stroke-width 1.4, round caps/joins, 24×24.
// The charm carries its own colour and a screen-reader name (the shape,
// not the habit's meaning). Filled dots use fill="currentColor".

import { SYMBOL_COLORS } from './symbols.js'
import { useText } from './language.jsx'

// Each charm's inner shapes (paths from §11a). currentColor everywhere,
// so the whole charm takes the one colour set on the <svg>.
export const CHARM_SHAPES = {
  1: (
    <>
      <path d="M2 19h20l-3.5-9-4.5 5L12 5l-2 10-4.5-5L2 19z" />
      <line x1="2" y1="22" x2="22" y2="22" />
      <circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="10" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  2: (
    <>
      <circle cx="7.5" cy="17" r="3.5" />
      <circle cx="16.5" cy="17" r="3.5" />
      <path d="M7.5 13.5C7.5 10 10 7.5 12 6.5" />
      <path d="M16.5 13.5C16.5 10 14 7.5 12 6.5" />
      <path d="M12 6.5L13.5 3" />
    </>
  ),
  3: (
    <>
      <path d="M12 21C7.6 21 4 17.4 4 13C4 9.5 6.2 6.5 9.4 5.2C10.9 4.6 12.5 4.5 14 4.9C17.2 5.8 19 8.8 18 11.8C17.2 14 15 15.2 12.8 14.8C11.2 14.5 10 13 10.2 11.4C10.4 10 11.8 9 13.2 9.4" />
      <path d="M12 21C14 18 13 15 12 13" />
      <path d="M4 13C6 14 8 13.5 10 12.5" />
    </>
  ),
  4: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <line x1="12" y1="7.5" x2="12" y2="21" />
      <line x1="5" y1="12" x2="9.5" y2="12" />
      <line x1="14.5" y1="12" x2="19" y2="12" />
      <path d="M5 19C5 19 7.5 22 12 22C16.5 22 19 19 19 19" />
    </>
  ),
  5: (
    <>
      <path d="M12 2L4 6V12C4 16.8 7.6 21.2 12 22C16.4 21.2 20 16.8 20 12V6L12 2Z" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="4" y1="9" x2="20" y2="9" />
    </>
  ),
  6: (
    <>
      <circle cx="7.5" cy="9.5" r="4.5" />
      <line x1="12" y1="9.5" x2="22" y2="9.5" />
      <line x1="20" y1="9.5" x2="20" y2="13" />
      <line x1="17" y1="9.5" x2="17" y2="12" />
      <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
}

// The market ANCHOR is drawn a little differently from the habit-view charm
// (Kimia): its crossbar is one unbroken line through the shaft, and a shorter
// second bar sits directly below it. Every other charm object uses CHARM_SHAPES.
export const OBJECT_SHAPE_OVERRIDES = {
  4: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <line x1="12" y1="7.5" x2="12" y2="21" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <path d="M5 19C5 19 7.5 22 12 22C16.5 22 19 19 19 19" />
    </>
  ),
}

function CharmSymbol({ symbol, className }) {
  const { t } = useText()
  return (
    <svg
      className={className ? `charm ${className}` : 'charm'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={t(`charm.${symbol}`)}
      style={{ color: SYMBOL_COLORS[symbol] }}
    >
      {CHARM_SHAPES[symbol]}
    </svg>
  )
}

export default CharmSymbol
