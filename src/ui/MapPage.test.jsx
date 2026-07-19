// Tests for the Map page (T4.1). The region/discovery/landmark maths
// is pinned in game/map.test.js; here we prove the page draws what
// that maths says — the faint outline always, known regions only as
// far as the expedition has stepped, and no landmark markers at all
// until T6.1 decides which species are landmarks.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MAP_REGION_COUNT, MAP_REGION_STEPS } from '../game/constants.js'
import MapPage from './MapPage.jsx'

afterEach(cleanup)

const SEED = 'test-world-seed'

function completions(n, dayKey = '2026-07-19', drops = []) {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    habitId: 'h1',
    recordedAt: 0,
    dayKey,
    drops,
  }))
}

describe('the Map page (T4.1)', () => {
  it('with no history: the faint outline, no regions, honest caption', () => {
    const { container } = render(
      <MapPage completions={[]} worldSeed={SEED} onBack={() => {}} />,
    )
    expect(container.querySelector('.map-silhouette')).not.toBeNull()
    expect(container.querySelectorAll('.map-region')).toHaveLength(0)
    expect(
      screen.getByText(`0 of ${MAP_REGION_COUNT} regions known`),
    ).toBeDefined()
  })

  it('draws exactly as many regions as the expedition has stepped into', () => {
    // One step over the first border: two regions known.
    const { container } = render(
      <MapPage
        completions={completions(MAP_REGION_STEPS + 1)}
        worldSeed={SEED}
        onBack={() => {}}
      />,
    )
    expect(container.querySelectorAll('.map-region')).toHaveLength(2)
    // Still just one frontier — the newest region.
    expect(container.querySelectorAll('.map-region-frontier')).toHaveLength(1)
    expect(
      screen.getByText(`2 of ${MAP_REGION_COUNT} regions known`),
    ).toBeDefined()
  })

  it('each known region offers its discovery date — dates, no names (T6.1)', () => {
    const { container } = render(
      <MapPage
        completions={completions(1, '2026-07-14')}
        worldSeed={SEED}
        onBack={() => {}}
      />,
    )
    const region = container.querySelector('.map-region')
    expect(region.querySelector('title').textContent).toBe(
      'known since 2026-07-14',
    )
  })

  it('shows NO landmark markers while the landmark set ships empty', () => {
    const flora = [{ kind: 'flora' }]
    const { container } = render(
      <MapPage
        completions={completions(30, '2026-07-19', flora)}
        worldSeed={SEED}
        onBack={() => {}}
      />,
    )
    expect(container.querySelectorAll('.map-landmark')).toHaveLength(0)
  })

  it('the plumbing draws a marker once a species is a landmark (for T6.1)', () => {
    const flora = [{ kind: 'flora', species: 'great-tree' }]
    const { container } = render(
      <MapPage
        completions={completions(3, '2026-07-19', flora)}
        worldSeed={SEED}
        onBack={() => {}}
        landmarkSpecies={new Set(['great-tree'])}
      />,
    )
    expect(container.querySelectorAll('.map-landmark')).toHaveLength(3)
  })

  it('the back button leads home', () => {
    const onBack = vi.fn()
    render(<MapPage completions={[]} worldSeed={SEED} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: '← back to the habits' }))
    expect(onBack).toHaveBeenCalled()
  })
})
