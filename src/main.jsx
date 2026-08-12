import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import ViewportGate from './ui/ViewportGate.jsx'

// Two wrappers, outermost first:
//
//   ErrorBoundary (2026-07-27) — the safety net. If any screen ever
//   fails to draw, one calm message replaces it instead of the black
//   nothing React leaves behind. Outside the gate so it catches the
//   gate too.
//
//   ViewportGate (T5.1b) — the width gate: below MIN_APP_WIDTH (740px
//   since 2026-08-12) it replaces App with a single full-screen
//   message; at that width and wider App runs
//   exactly as before. See ViewportGate.jsx for why it swaps the tree
//   rather than hiding it with CSS.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ViewportGate>
        <App />
      </ViewportGate>
    </ErrorBoundary>
  </StrictMode>,
)
