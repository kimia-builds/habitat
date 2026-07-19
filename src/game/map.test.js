// Tests for the Map logic (T4.1): which region a step falls in, how
// many regions a history has discovered, when each was discovered,
// and the landmark-flora plumbing — all derived from completion
// history, so undo reverses everything by itself.

import { describe, expect, it } from 'vitest'
import { MAP_REGION_COUNT, MAP_REGION_STEPS } from './constants.js'
import {
  discoveredRegionCount,
  landmarkMarkers,
  regionDiscoveries,
  regionForStep,
} from './map.js'

// A minimal believable completion for these tests — the Map only ever
// reads dayKey, id and drops.
function completion(id, dayKey, drops = []) {
  return { id, habitId: 'h1', recordedAt: 0, dayKey, drops }
}

// A history of n plain completions, all on one day.
function history(n, dayKey = '2026-07-19') {
  return Array.from({ length: n }, (_, i) => completion(`c${i}`, dayKey))
}

describe('regionForStep (T4.1)', () => {
  it('the first region spans exactly the first MAP_REGION_STEPS steps', () => {
    expect(regionForStep(0)).toBe(0)
    expect(regionForStep(MAP_REGION_STEPS - 1)).toBe(0)
    expect(regionForStep(MAP_REGION_STEPS)).toBe(1)
  })

  it('the last region starts where the second-to-last ends', () => {
    const lastStart = (MAP_REGION_COUNT - 1) * MAP_REGION_STEPS
    expect(regionForStep(lastStart - 1)).toBe(MAP_REGION_COUNT - 2)
    expect(regionForStep(lastStart)).toBe(MAP_REGION_COUNT - 1)
  })

  it('steps beyond the 5-year sizing stay in the last region', () => {
    const beyond = MAP_REGION_COUNT * MAP_REGION_STEPS
    expect(regionForStep(beyond)).toBe(MAP_REGION_COUNT - 1)
    expect(regionForStep(beyond + 123456)).toBe(MAP_REGION_COUNT - 1)
  })

  it('refuses a step that is not a whole number ≥ 0', () => {
    expect(() => regionForStep(-1)).toThrow()
    expect(() => regionForStep(1.5)).toThrow()
    expect(() => regionForStep('7')).toThrow()
  })
})

describe('discoveredRegionCount (T4.1)', () => {
  it('zero steps — the planet is entirely unknown', () => {
    expect(discoveredRegionCount(0)).toBe(0)
  })

  it('the very first step discovers the first region', () => {
    expect(discoveredRegionCount(1)).toBe(1)
  })

  it('a region is discovered by stepping INTO it, not by filling the one before', () => {
    // All of region 0's steps taken → still only region 0 known…
    expect(discoveredRegionCount(MAP_REGION_STEPS)).toBe(1)
    // …and the next step is the one that crosses the border.
    expect(discoveredRegionCount(MAP_REGION_STEPS + 1)).toBe(2)
  })

  it('the whole planet is known at (and beyond) the 5-year sizing', () => {
    const fiveYears = MAP_REGION_COUNT * MAP_REGION_STEPS
    expect(discoveredRegionCount(fiveYears)).toBe(MAP_REGION_COUNT)
    expect(discoveredRegionCount(fiveYears * 3)).toBe(MAP_REGION_COUNT)
  })
})

describe('regionDiscoveries (T4.1)', () => {
  it('records the day each region was first stepped into', () => {
    // Fill region 0, then one step into region 1 on a later day.
    const completions = [
      ...history(MAP_REGION_STEPS, '2026-07-01'),
      completion('crosser', '2026-07-15'),
    ]
    expect(regionDiscoveries(completions)).toEqual([
      { region: 0, dayKey: '2026-07-01' },
      { region: 1, dayKey: '2026-07-15' },
    ])
  })

  it('an empty history has discovered nothing', () => {
    expect(regionDiscoveries([])).toEqual([])
  })

  it('undoing back across a border un-discovers the region', () => {
    const completions = [
      ...history(MAP_REGION_STEPS),
      completion('crosser', '2026-07-19'),
    ]
    expect(regionDiscoveries(completions)).toHaveLength(2)
    // The undo of the crossing completion (history is simply shorter):
    expect(regionDiscoveries(completions.slice(0, -1))).toHaveLength(1)
  })
})

describe('landmarkMarkers — plumbing for T6.1 (T4.1)', () => {
  const landmarks = new Set(['great-tree'])

  it('shows no markers with the shipped (empty) landmark set — flora have no species until T6.1', () => {
    const completions = [
      completion('c0', '2026-07-19', [{ kind: 'flora' }]),
    ]
    expect(landmarkMarkers(completions)).toEqual([])
  })

  it('a landmark find is placed in the region its step fell in', () => {
    const completions = [
      ...history(MAP_REGION_STEPS + 4),
      completion('find', '2026-07-19', [
        { kind: 'flora', species: 'great-tree' },
      ]),
    ]
    expect(landmarkMarkers(completions, landmarks)).toEqual([
      {
        completionId: 'find',
        species: 'great-tree',
        dayKey: '2026-07-19',
        stepIndex: MAP_REGION_STEPS + 4,
        region: 1,
      },
    ])
  })

  it('non-landmark species and other drop kinds place no marker', () => {
    const completions = [
      completion('c0', '2026-07-19', [
        { kind: 'flora', species: 'small-moss' },
        { kind: 'fungi', amount: 2 },
      ]),
    ]
    expect(landmarkMarkers(completions, landmarks)).toEqual([])
  })

  it('undoing the dropping completion removes the marker — nothing else does', () => {
    const find = completion('find', '2026-07-19', [
      { kind: 'flora', species: 'great-tree' },
    ])
    const completions = [...history(10), find]
    expect(landmarkMarkers(completions, landmarks)).toHaveLength(1)
    // Undo the find's completion → the marker is gone with it.
    const undone = completions.filter((c) => c.id !== 'find')
    expect(landmarkMarkers(undone, landmarks)).toHaveLength(0)
    // Undo some OTHER completion → the marker stays (its region may
    // shift with the derived step, exactly as the meter shifts).
    const otherUndone = completions.filter((c) => c.id !== 'c3')
    expect(landmarkMarkers(otherUndone, landmarks)).toHaveLength(1)
  })
})
