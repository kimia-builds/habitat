import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import { NightSky } from './ui/sky.jsx'
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
//
// Inside the gate, the night sky (T5.2d/§13c) is mounted once, here, as
// the app's background: a fixed full-bleed layer behind every screen, so
// it never re-renders or re-rolls its star field as pages change, and so
// the blocked screen keeps its own plain ground. It sits inside the gate
// rather than outside it because it is part of the app, not part of the
// page — nothing should be drawing stars on a screen the app never
// mounted on.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ViewportGate>
        <>
          <div className="sky-layer" aria-hidden="true">
            <NightSky />
          </div>
          <App />
        </>
      </ViewportGate>
    </ErrorBoundary>
  </StrictMode>,
)
