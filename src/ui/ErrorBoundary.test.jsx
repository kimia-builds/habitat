// UI tests for the safety net (2026-07-27). The rule: a child that
// throws while drawing is replaced by one calm message instead of the
// black nothing React leaves behind. These tests assert that structure
// and the console logging — never the message's actual wording (that
// copy is Kimia's, edited in content/mishap.js, and must never break the
// suite when she rewrites it).

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary.jsx'
import { MISHAP, mishapMessage } from '../content/mishap.js'

// A child that fails on purpose, and one that behaves.
function Exploding() {
  throw new Error('deliberate test failure')
}
const CALM = <div data-testid="calm-child">the app</div>

const realMessage = MISHAP.message

// React prints the caught error to the console itself, and so does the
// boundary — silenced here so a passing run stays readable.
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  MISHAP.message = realMessage
  vi.restoreAllMocks()
})

describe('ErrorBoundary (the safety net)', () => {
  it('renders its children untouched when nothing goes wrong', () => {
    render(<ErrorBoundary>{CALM}</ErrorBoundary>)
    expect(screen.queryByTestId('calm-child')).toBeTruthy()
    expect(document.querySelector('.mishap')).toBeNull()
  })

  it('replaces a failing child with the message screen', () => {
    MISHAP.message = 'fixture copy for the mishap screen'
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    expect(screen.queryByTestId('calm-child')).toBeNull()
    const screenEl = document.querySelector('.mishap')
    expect(screenEl).toBeTruthy()
    expect(screenEl.getAttribute('role')).toBe('alert')
    expect(document.querySelector('.mishap-message').textContent).toBe(
      'fixture copy for the mishap screen',
    )
  })

  it('still renders the screen when the slot is blank', () => {
    // Wordless rather than invented copy (design-notes §7) — the same
    // rule the device gate follows.
    MISHAP.message = ''
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    expect(document.querySelector('.mishap')).toBeTruthy()
    expect(document.querySelector('.mishap-message')).toBeNull()
  })

  it('logs the real error so the bug can still be diagnosed', () => {
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )
    const logged = console.error.mock.calls.some((args) =>
      args.some((arg) => arg instanceof Error),
    )
    expect(logged).toBe(true)
  })
})

describe('mishapMessage (the content slot helper)', () => {
  it('returns null for a blank or whitespace-only slot', () => {
    MISHAP.message = ''
    expect(mishapMessage()).toBeNull()
    MISHAP.message = '   '
    expect(mishapMessage()).toBeNull()
  })

  it('returns the trimmed text when the slot has copy', () => {
    MISHAP.message = '  hello there  '
    expect(mishapMessage()).toBe('hello there')
  })
})
