// ErrorBoundary — the app's safety net (added 2026-07-27, after a field
// notes crash left a black screen: browsing back past a schedule change
// threw, and React responded by unmounting the entire app).
//
// React only lets a CLASS component catch a render error — there is no
// hook for it — so this is the one class in a codebase of function
// components. It does exactly two things: swap the broken tree for one
// calm message (Kimia's words, in src/content/mishap.js), and log the
// real error to the browser console so it can still be diagnosed.
//
// It is a net, not a cure: every crash it catches is still a bug to fix.
// Nothing is lost when it shows — habits live in storage, untouched by a
// drawing failure, and a refresh comes back to the habits list.

import { Component } from 'react'
import { mishapMessage } from '../content/mishap.js'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  // React calls this when a child throws while rendering: the returned
  // object becomes the new state, so the next render shows the message.
  static getDerivedStateFromError() {
    return { failed: true }
  }

  // The details, for whoever is looking at the console. Deliberately
  // console-only: the screen stays calm and wordless about specifics.
  componentDidCatch(error, info) {
    console.error('Habitat hit an unexpected error:', error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children

    const message = mishapMessage()
    return (
      <main className="mishap" role="alert">
        {message && <p className="mishap-message">{message}</p>}
      </main>
    )
  }
}

export default ErrorBoundary
