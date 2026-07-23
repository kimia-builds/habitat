import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ViewportGate from './ui/ViewportGate.jsx'

// The device gate (T5.1b) wraps the whole app: below 1024px it replaces
// App with a single full-screen message; at 1024px and wider App runs
// exactly as before. See ViewportGate.jsx for why it swaps the tree
// rather than hiding it with CSS.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ViewportGate>
      <App />
    </ViewportGate>
  </StrictMode>,
)
