// UI tests for the T5.1b device gate. The rule (spec §3): below 1024px
// the whole app is replaced by one full-screen message; at 1024px and
// wider the app renders unchanged. These tests assert that structure —
// which side of the gate renders — never the message's wording (that
// copy is Kimia's, and blank for now).

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ViewportGate, { MIN_APP_WIDTH } from './ViewportGate.jsx'
import { blockedMessage } from '../content/blocked.js'

// Force the viewport width jsdom reports, then fire the resize event the
// gate listens for — the same signal a real browser sends on a window
// resize or a tablet turning on its side.
function setViewportWidth(width) {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  })
  act(() => {
    window.dispatchEvent(new Event('resize'))
  })
}

afterEach(() => {
  cleanup()
  setViewportWidth(1024) // restore jsdom's default for the next test
})

// A stand-in for <App /> — the gate only cares whether children mount.
const CHILD = <div data-testid="app-child">the app</div>

describe('ViewportGate (T5.1b device gate)', () => {
  it('renders the app at exactly the 1024px threshold', () => {
    setViewportWidth(MIN_APP_WIDTH)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(screen.queryByTestId('app-child')).toBeTruthy()
    expect(document.querySelector('.viewport-block')).toBeNull()
  })

  it('renders the app on a wide desktop', () => {
    setViewportWidth(1440)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(screen.queryByTestId('app-child')).toBeTruthy()
    expect(document.querySelector('.viewport-block')).toBeNull()
  })

  it('blocks just below the threshold, hiding the app entirely', () => {
    setViewportWidth(MIN_APP_WIDTH - 1)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(screen.queryByTestId('app-child')).toBeNull()
    expect(document.querySelector('.viewport-block')).toBeTruthy()
  })

  it('blocks a tablet held sideways (768px)', () => {
    setViewportWidth(768)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(screen.queryByTestId('app-child')).toBeNull()
    expect(document.querySelector('.viewport-block')).toBeTruthy()
  })

  it('swaps live when the window crosses the threshold both ways', () => {
    setViewportWidth(1440)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(screen.queryByTestId('app-child')).toBeTruthy()

    setViewportWidth(800) // shrink below the gate
    expect(screen.queryByTestId('app-child')).toBeNull()
    expect(document.querySelector('.viewport-block')).toBeTruthy()

    setViewportWidth(1200) // widen back above it
    expect(screen.queryByTestId('app-child')).toBeTruthy()
    expect(document.querySelector('.viewport-block')).toBeNull()
  })

  it('shows no invented copy while the content slot is blank', () => {
    // The message is Kimia's to write (design-notes §7); until she fills
    // the slot, blockedMessage() is null and the block screen is wordless.
    expect(blockedMessage()).toBeNull()
    setViewportWidth(600)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(document.querySelector('.viewport-block')).toBeTruthy()
    expect(document.querySelector('.viewport-block-message')).toBeNull()
  })
})
