// Tests for the meters' T4.5 shape (Kimia's calls 2026-07-21): all
// three meters are bars now — the wallet included — and the exact
// numbers moved behind each meter's hover. The wallet's face never
// shows debt (its bar clamps at empty), but its hover says the plain
// truth, negative and all. The maths itself (segments, the level
// number, the wallet clamp) is pinned in game/meters.test.js; here we
// only prove the component draws what the maths hands over.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { EXPEDITION_SEGMENT_STEPS } from '../game/constants.js'
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

  it('the steps hover carries the lifetime total — just the number', () => {
    renderMeters({ completions: [{}, {}] })
    expect(screen.getByRole('button', { name: /steps taken/ }).title).toBe('2')
  })

  it('the literacy hover reads the bare level number', () => {
    // Five novels are worth 20 literacy points (4 each) — a level of
    // exactly 15 (hand-verified against game/meters.js).
    const readingItems = Array.from({ length: 5 }, () => ({ type: 'novel' }))
    renderMeters({ readingItems })
    expect(screen.getByRole('button', { name: /literacy level/ }).title).toBe(
      '15',
    )
  })
})

// T5.2e/§4: a forward movement plays a momentary glow-and-thicken on
// the bar that moved. The animation itself is CSS; what a test can
// honestly check is which bar was ASKED to play, and which was not.
describe('the movement glow (T5.2e, §4)', () => {
  const bar = (name) => screen.getByRole('progressbar', { name })
  const steps = 'steps taken progress'
  const money = 'wallet balance progress'
  const reading = 'literacy level progress'

  it('opening Habitat plays nothing — the bars arrive at rest', () => {
    renderMeters({ completions: [{}, {}], fungusTrueBalance: 6 })
    expect(bar(steps).className).not.toMatch(/meter-bar--/)
    expect(bar(money).className).not.toMatch(/meter-bar--/)
  })

  it('a tap moves the steps bar, and leaves the others resting', () => {
    const { rerender } = renderMeters({ completions: [{}] })
    rerender(
      <Meters
        completions={[{}, {}]}
        readingItems={[]}
        fungusTrueBalance={0}
        onOpen={vi.fn()}
      />,
    )
    expect(bar(steps).className).toMatch(/meter-bar--step/)
    expect(bar(money).className).not.toMatch(/meter-bar--/)
    expect(bar(reading).className).not.toMatch(/meter-bar--/)
  })

  it('every bar that moved lights up together', () => {
    const { rerender } = renderMeters({ completions: [{}] })
    rerender(
      <Meters
        completions={[{}, {}]}
        readingItems={[{ type: 'magazine' }]}
        fungusTrueBalance={3}
        onOpen={vi.fn()}
      />,
    )
    expect(bar(steps).className).toMatch(/meter-bar--step/)
    expect(bar(reading).className).toMatch(/meter-bar--step/)
    expect(bar(money).className).toMatch(/meter-bar--step/)
  })

  it('an undo plays nothing — the movement is forward only', () => {
    const { rerender } = renderMeters({ completions: [{}, {}] })
    rerender(
      <Meters
        completions={[{}]}
        readingItems={[]}
        fungusTrueBalance={0}
        onOpen={vi.fn()}
      />,
    )
    expect(bar(steps).className).not.toMatch(/meter-bar--/)
  })

  it('a purchase plays nothing — the wallet only celebrates going up', () => {
    const { rerender } = renderMeters({ fungusTrueBalance: 12 })
    rerender(
      <Meters
        completions={[]}
        readingItems={[]}
        fungusTrueBalance={5}
        onOpen={vi.fn()}
      />,
    )
    expect(bar(money).className).not.toMatch(/meter-bar--/)
  })

  it('a full segment rolls over with the brighter beat', () => {
    // One short of a segment, then the step that completes it.
    const history = (n) => Array.from({ length: n }, () => ({}))
    const { rerender } = renderMeters({
      completions: history(EXPEDITION_SEGMENT_STEPS - 1),
    })
    rerender(
      <Meters
        completions={history(EXPEDITION_SEGMENT_STEPS)}
        readingItems={[]}
        fungusTrueBalance={0}
        onOpen={vi.fn()}
      />,
    )
    expect(bar(steps).className).toMatch(/meter-bar--rollover/)
  })
})
