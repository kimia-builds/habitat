// Tests for the drops engine (T3.1). The headline act is the 5-year
// simulation at the bottom — plan.md's "done when": sane totals for
// all three drop types, no droughts of months, no floods, and fungus
// income that supports a reasonable purchase rhythm.

import { describe, expect, it } from 'vitest'

import {
  FLORA_WINDOW_STEPS,
  FUNGUS_CLUSTER_WEIGHTS,
  FUNGUS_DROP_CHANCE,
  LITERACY_MILESTONES,
  LITERACY_POINTS,
  READING_DROP_CHANCES,
} from './constants.js'
import { addDays } from './days.js'
import {
  floraAtStep,
  floraTargetStep,
  randomUnit,
  rollDrops,
  rollFungi,
  rollReading,
} from './drops.js'

const SEED = 'test-world'

// A convenient fully-valid tap to base variations on.
function tap(overrides = {}) {
  return {
    worldSeed: SEED,
    habitId: 'habit-1',
    dayKey: '2026-07-19',
    tapIndex: 0,
    difficulty: 'medium',
    stepIndex: 0,
    ...overrides,
  }
}

describe('randomUnit', () => {
  it('always returns the same number for the same string', () => {
    expect(randomUnit('hello')).toBe(randomUnit('hello'))
  })

  it('stays within 0 ≤ r < 1 across many seeds', () => {
    for (let i = 0; i < 10000; i++) {
      const r = randomUnit(`seed-${i}`)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThan(1)
    }
  })

  it('spreads evenly — no half of the range is starved', () => {
    let low = 0
    for (let i = 0; i < 10000; i++) {
      if (randomUnit(`spread-${i}`) < 0.5) low++
    }
    expect(low).toBeGreaterThan(4500)
    expect(low).toBeLessThan(5500)
  })

  it('rejects a missing or empty seed', () => {
    expect(() => randomUnit('')).toThrow()
    expect(() => randomUnit(undefined)).toThrow()
  })
})

describe('flora windows (Stream 1)', () => {
  it('hides each window’s find inside that window', () => {
    for (let w = 0; w < 200; w++) {
      const target = floraTargetStep(w, SEED)
      expect(target).toBeGreaterThanOrEqual(w * FLORA_WINDOW_STEPS)
      expect(target).toBeLessThan((w + 1) * FLORA_WINDOW_STEPS)
    }
  })

  it('yields exactly one find per window — guaranteed, no droughts', () => {
    const windows = 100
    for (let w = 0; w < windows; w++) {
      let finds = 0
      for (
        let s = w * FLORA_WINDOW_STEPS;
        s < (w + 1) * FLORA_WINDOW_STEPS;
        s++
      ) {
        if (floraAtStep(s, SEED)) finds++
      }
      expect(finds).toBe(1)
    }
  })

  it('places finds at varied positions, not a fixed rhythm', () => {
    const offsets = new Set()
    for (let w = 0; w < 50; w++) {
      offsets.add(floraTargetStep(w, SEED) - w * FLORA_WINDOW_STEPS)
    }
    expect(offsets.size).toBeGreaterThan(5)
  })

  it('is deterministic for a seed, different across seeds', () => {
    expect(floraTargetStep(7, SEED)).toBe(floraTargetStep(7, SEED))
    const a = []
    const b = []
    for (let w = 0; w < 20; w++) {
      a.push(floraTargetStep(w, 'world-a'))
      b.push(floraTargetStep(w, 'world-b'))
    }
    expect(a).not.toEqual(b)
  })
})

describe('rollReading (Stream 2)', () => {
  it('returns a valid type or null, deterministically', () => {
    for (let i = 0; i < 500; i++) {
      const result = rollReading(tap({ tapIndex: i }))
      expect([null, 'magazine', 'novel', 'dictionary']).toContain(result)
      expect(rollReading(tap({ tapIndex: i }))).toBe(result)
    }
  })

  it('lands near the tuned rates: magazines > novels > dictionaries', () => {
    const taps = 50000
    const counts = { magazine: 0, novel: 0, dictionary: 0 }
    for (let i = 0; i < taps; i++) {
      const result = rollReading(tap({ tapIndex: i }))
      if (result) counts[result]++
    }
    // Within a generous ±35% of each tuned chance (deterministic
    // given the seed, so these can never flake once green).
    for (const type of ['magazine', 'novel', 'dictionary']) {
      const expected = READING_DROP_CHANCES[type] * taps
      expect(counts[type]).toBeGreaterThan(expected * 0.65)
      expect(counts[type]).toBeLessThan(expected * 1.35)
    }
    expect(counts.magazine).toBeGreaterThan(counts.novel)
    expect(counts.novel).toBeGreaterThan(counts.dictionary)
  })

  it('difficulty only ever upgrades a tap, never downgrades it', () => {
    // Because every difficulty reads the SAME underlying roll and a
    // bigger multiplier only widens the winning thresholds: a tap
    // that drops for easy must also drop for difficult.
    const rank = { dictionary: 3, novel: 2, magazine: 1, null: 0 }
    for (let i = 0; i < 5000; i++) {
      const easy = rollReading(tap({ tapIndex: i, difficulty: 'easy' }))
      const difficult = rollReading(
        tap({ tapIndex: i, difficulty: 'difficult' }),
      )
      expect(rank[String(difficult)]).toBeGreaterThanOrEqual(rank[String(easy)])
    }
  })

  it('rejects an unknown difficulty', () => {
    expect(() => rollReading(tap({ difficulty: 'brutal' }))).toThrow()
  })
})

describe('rollFungi (Stream 3)', () => {
  it('returns 0 or a cluster of 1–3, deterministically', () => {
    const allowed = [0, ...FUNGUS_CLUSTER_WEIGHTS.map((e) => e.amount)]
    for (let i = 0; i < 2000; i++) {
      const amount = rollFungi(tap({ tapIndex: i }))
      expect(allowed).toContain(amount)
      expect(rollFungi(tap({ tapIndex: i }))).toBe(amount)
    }
  })

  it('drops at roughly the tuned rate with an average cluster of ~1.5', () => {
    const taps = 50000
    let dropCount = 0
    let total = 0
    for (let i = 0; i < taps; i++) {
      const amount = rollFungi(tap({ tapIndex: i }))
      if (amount > 0) {
        dropCount++
        total += amount
      }
    }
    const expectedDrops = taps * FUNGUS_DROP_CHANCE
    expect(dropCount).toBeGreaterThan(expectedDrops * 0.8)
    expect(dropCount).toBeLessThan(expectedDrops * 1.2)
    const averageCluster = total / dropCount
    expect(averageCluster).toBeGreaterThan(1.35)
    expect(averageCluster).toBeLessThan(1.65)
  })

  it('a tap that drops for easy also drops (the same amount) for difficult', () => {
    for (let i = 0; i < 5000; i++) {
      const easy = rollFungi(tap({ tapIndex: i, difficulty: 'easy' }))
      const difficult = rollFungi(tap({ tapIndex: i, difficulty: 'difficult' }))
      if (easy > 0) expect(difficult).toBe(easy)
    }
  })
})

describe('rollDrops — the whole tap', () => {
  it('bundles the three streams into drop records', () => {
    // Scan taps until each kind has appeared at least once.
    const seen = new Set()
    for (let i = 0; i < 500 && seen.size < 3; i++) {
      for (const drop of rollDrops(tap({ tapIndex: i, stepIndex: i }))) {
        seen.add(drop.kind)
        if (drop.kind === 'reading') {
          expect(['magazine', 'novel', 'dictionary']).toContain(
            drop.readingType,
          )
        }
        if (drop.kind === 'fungi') {
          expect(drop.amount).toBeGreaterThan(0)
        }
      }
    }
    expect(seen).toEqual(new Set(['flora', 'reading', 'fungi']))
  })

  it('undo then redo of the identical tap returns the identical drops', () => {
    // The no-slot-machine rule (decision 2026-07-19): drops are a
    // pure function of the tap's stable facts, so re-recording the
    // same tap after an undo replays exactly the same outcome.
    const facts = tap({ tapIndex: 2, stepIndex: 57 })
    expect(rollDrops(facts)).toEqual(rollDrops(facts))
  })

  it('validates its inputs loudly', () => {
    expect(() => rollDrops(tap({ worldSeed: '' }))).toThrow()
    expect(() => rollDrops(tap({ habitId: '' }))).toThrow()
    expect(() => rollDrops(tap({ dayKey: 'not-a-day' }))).toThrow()
    expect(() => rollDrops(tap({ tapIndex: -1 }))).toThrow()
    expect(() => rollDrops(tap({ stepIndex: 1.5 }))).toThrow()
  })
})

// ── The referee: five simulated years ───────────────────────────────
//
// Kimia's real pace, ~3.5 taps/day (alternating 4-tap and 3-tap
// days), run for 5 years on one medium habit. The seed makes the
// whole run deterministic: once these bounds are green they can
// never flake.

function simulateFiveYears() {
  const days = 5 * 365
  const worldSeed = 'nzd-simulation'
  const tally = {
    taps: 0,
    flora: 0,
    floraGapDaysMax: 0,
    reading: { magazine: 0, novel: 0, dictionary: 0 },
    readingGapDaysMax: 0,
    fungiTotal: 0,
    fungiPerRotation: [],
  }
  let stepIndex = 0
  let daysSinceFlora = 0
  let daysSinceReading = 0
  for (let d = 0; d < days; d++) {
    const dayKey = addDays('2026-01-01', d)
    const rotation = Math.floor(d / 28)
    const tapsToday = d % 2 === 0 ? 4 : 3
    let floraToday = false
    let readingToday = false
    for (let t = 0; t < tapsToday; t++) {
      const drops = rollDrops({
        worldSeed,
        habitId: 'sim-habit',
        dayKey,
        tapIndex: t,
        difficulty: 'medium',
        stepIndex,
      })
      for (const drop of drops) {
        if (drop.kind === 'flora') {
          tally.flora++
          floraToday = true
        }
        if (drop.kind === 'reading') {
          tally.reading[drop.readingType]++
          readingToday = true
        }
        if (drop.kind === 'fungi') {
          tally.fungiTotal += drop.amount
          tally.fungiPerRotation[rotation] =
            (tally.fungiPerRotation[rotation] ?? 0) + drop.amount
        }
      }
      stepIndex++
      tally.taps++
    }
    daysSinceFlora = floraToday ? 0 : daysSinceFlora + 1
    daysSinceReading = readingToday ? 0 : daysSinceReading + 1
    tally.floraGapDaysMax = Math.max(tally.floraGapDaysMax, daysSinceFlora)
    tally.readingGapDaysMax = Math.max(
      tally.readingGapDaysMax,
      daysSinceReading,
    )
  }
  // Drop the final partial rotation — its income is naturally small.
  if (days % 28 !== 0) tally.fungiPerRotation.pop()
  return tally
}

describe('five simulated years at ~3.5 taps/day (plan T3.1 “done when”)', () => {
  const tally = simulateFiveYears()

  it('runs at the intended pace', () => {
    // 1,825 days alternating 4 and 3 taps: 913 × 4 + 912 × 3.
    expect(tally.taps).toBe(913 * 4 + 912 * 3)
  })

  it('flora arrive steadily — about one a week, never a drought', () => {
    // One guaranteed find per 25-step window.
    expect(
      Math.abs(tally.flora - tally.taps / FLORA_WINDOW_STEPS),
    ).toBeLessThanOrEqual(1)
    // Longest possible wait is just under two windows ≈ 2 weeks.
    expect(tally.floraGapDaysMax).toBeLessThanOrEqual(15)
  })

  it('reading material stays rare but never vanishes for months', () => {
    const years = 5
    // Magazines about weekly, novels about monthly, a few
    // dictionaries a year (the pacing sketch in constants.js).
    expect(tally.reading.magazine / years).toBeGreaterThan(40)
    expect(tally.reading.magazine / years).toBeLessThan(75)
    expect(tally.reading.novel / years).toBeGreaterThan(9)
    expect(tally.reading.novel / years).toBeLessThan(20)
    expect(tally.reading.dictionary).toBeGreaterThanOrEqual(10)
    expect(tally.reading.dictionary).toBeLessThanOrEqual(28)
    // No reading drought longer than ~2 months.
    expect(tally.readingGapDaysMax).toBeLessThanOrEqual(60)
  })

  it('literacy reaches the last friendship door inside 5 years, without flooding', () => {
    const points =
      tally.reading.magazine * LITERACY_POINTS.magazine +
      tally.reading.novel * LITERACY_POINTS.novel +
      tally.reading.dictionary * LITERACY_POINTS.dictionary
    const poets = LITERACY_MILESTONES[LITERACY_MILESTONES.length - 1]
    expect(points).toBeGreaterThanOrEqual(poets)
    // ...but not by miles — the ladder should take years, not months.
    expect(points).toBeLessThan(poets * 1.35)
  })

  it('fungus income supports about one mid-priced object per rotation', () => {
    const rotations = tally.fungiPerRotation.length
    const average = tally.fungiTotal / rotations
    // ~15 fungi per 28-lived-day rotation ⇒ a mid-priced object at 10–12
    // is comfortably affordable once per rotation (decision 2026-07-19).
    expect(average).toBeGreaterThan(11)
    expect(average).toBeLessThan(19)
    // And no single rotation is a famine or a flood.
    for (const income of tally.fungiPerRotation) {
      expect(income ?? 0).toBeGreaterThanOrEqual(5)
      expect(income ?? 0).toBeLessThanOrEqual(30)
    }
  })
})
