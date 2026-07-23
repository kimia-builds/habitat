// UI tests for the T5.1b device gate. The rule (spec §3): below 1024px
// the whole app is replaced by one full-screen message; at 1024px and
// wider the app renders unchanged. These tests assert that structure —
// which side of the gate renders, and that the gate faithfully reflects
// the content slot — never the message's actual wording (that copy is
// Kimia's, edited in content/blocked.js, and must never break the suite
// when she rewrites it).

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ViewportGate, { MIN_APP_WIDTH } from './ViewportGate.jsx'
import { BLOCKED, blockedMessage } from '../content/blocked.js'

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

// The message tests set the slot to a controlled fixture and restore
// Kimia's real copy afterwards, so they exercise both branches without
// ever depending on (or asserting) whatever she has actually written.
const realMessage = BLOCKED.message

afterEach(() => {
  cleanup()
  BLOCKED.message = realMessage
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

  it('shows the slot copy on the block screen when the slot has words', () => {
    // A controlled fixture, NOT Kimia's real copy — so this passes
    // whatever she writes. It proves the gate renders the slot's text.
    BLOCKED.message = 'fixture copy for the block screen'
    setViewportWidth(600)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    const paragraph = document.querySelector('.viewport-block-message')
    expect(paragraph).toBeTruthy()
    expect(paragraph.textContent).toBe('fixture copy for the block screen')
  })

  it('shows no message paragraph when the slot is blank', () => {
    // The block screen still renders — just wordless, never invented
    // copy (design-notes §7).
    BLOCKED.message = ''
    setViewportWidth(600)
    render(<ViewportGate>{CHILD}</ViewportGate>)
    expect(document.querySelector('.viewport-block')).toBeTruthy()
    expect(document.querySelector('.viewport-block-message')).toBeNull()
  })
})

describe('blockedMessage (the content slot helper)', () => {
  const realMsg = BLOCKED.message
  afterEach(() => {
    BLOCKED.message = realMsg
  })

  it('returns null for a blank or whitespace-only slot', () => {
    BLOCKED.message = ''
    expect(blockedMessage()).toBeNull()
    BLOCKED.message = '   '
    expect(blockedMessage()).toBeNull()
  })

  it('returns the trimmed text when the slot has copy', () => {
    BLOCKED.message = '  hello there  '
    expect(blockedMessage()).toBe('hello there')
  })
})
