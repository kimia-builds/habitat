// Tests for the meters' T4.5 shape (Kimia's calls 2026-07-21): all
// three meters are bars now — the wallet included — and the exact
// numbers moved behind each meter's hover. The wallet's face never
// shows debt (its bar clamps at empty), but its hover says the plain
// truth, negative and all. The maths itself (segments, the level
// number, the wallet clamp) is pinned in game/meters.test.js; here we
// only prove the component draws what the maths hands over.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Meters from './Meters.jsx'

afterEach(cleanup)

// expeditionSteps only counts the completions' length, so bare objects
// are a fine fake history (game/meters.test.js fakes the same way).
function renderMeters({
  completions = [],
  readingItems = [],
  fungusTrueBalance = 0,
} = {}) {
  return render(
    <Meters
      completions={completions}
      readingItems={readingItems}
      fungusTrueBalance={fungusTrueBalance}
      onOpen={vi.fn()}
    />,
  )
}

describe('the three bars (T4.5)', () => {
  it('all three meters are bars — the wallet included', () => {
    renderMeters()
    expect(screen.getAllByRole('progressbar')).toHaveLength(3)
    expect(
      screen.getByRole('progressbar', { name: 'wallet balance progress' }),
    ).toBeDefined()
  })

  it('the wallet bar fills toward 40 fungi and clamps there', () => {
    renderMeters({ fungusTrueBalance: 99 })
    expect(
      screen
        .getByRole('progressbar', { name: 'wallet balance progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('40')
  })

  it("the wallet's face never shows debt — the bar clamps at empty", () => {
    renderMeters({ fungusTrueBalance: -8 })
    expect(
      screen
        .getByRole('progressbar', { name: 'wallet balance progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('0')
  })
})

describe('the numbers behind the hover', () => {
  it('the wallet hover tells the plain truth — the number itself', () => {
    const { unmount } = renderMeters({ fungusTrueBalance: 23 })
    expect(screen.getByRole('button', { name: /wallet balance/ }).title).toBe(
      '23',
    )
    unmount()

    // In debt, the hover says so plainly (Kimia's explicit call).
    renderMeters({ fungusTrueBalance: -8 })
    expect(screen.getByRole('button', { name: /wallet balance/ }).title).toBe(
      '-8',
    )
  })

  it('the steps hover carries the lifetime total', () => {
    renderMeters({ completions: [{}, {}] })
    expect(screen.getByRole('button', { name: /steps taken/ }).title).toBe(
      '2 steps taken',
    )
  })

  it('the literacy hover reads the level out of 100', () => {
    // Five novels are worth 20 literacy points (4 each) — a level of
    // exactly 15 (hand-verified against game/meters.js).
    const readingItems = Array.from({ length: 5 }, () => ({ type: 'novel' }))
    renderMeters({ readingItems })
    expect(screen.getByRole('button', { name: /literacy level/ }).title).toBe(
      '15 of 100',
    )
  })
})
