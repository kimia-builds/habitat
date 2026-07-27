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
//   ViewportGate (T5.1b) — the device gate: below 1024px it replaces
//   App with a single full-screen message; at 1024px and wider App runs
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
