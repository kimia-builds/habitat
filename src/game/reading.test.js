import { describe, expect, it } from 'vitest'
import { deliverDrops, readingItemsFrom } from './arrivals.js'
import { READING_POOL_PER_STAGE } from './constants.js'
import {
  allPublicationIds,
  legacyPublicationId,
  parsePublicationId,
  pickPublication,
  publicationId,
  readingStageFor,
} from './reading.js'

describe('readingStageFor', () => {
  it('starts at stage 1 and climbs at 30 / 115 / 260 / 465 / 590', () => {
    expect(readingStageFor(0)).toBe(1)
    expect(readingStageFor(29)).toBe(1)
    expect(readingStageFor(30)).toBe(2)
    expect(readingStageFor(114)).toBe(2)
    expect(readingStageFor(115)).toBe(3)
    expect(readingStageFor(260)).toBe(4)
    expect(readingStageFor(465)).toBe(5)
    expect(readingStageFor(590)).toBe(6)
    expect(readingStageFor(5000)).toBe(6)
  })

  it('refuses nonsense points', () => {
    expect(() => readingStageFor(-1)).toThrow()
    expect(() => readingStageFor(NaN)).toThrow()
  })
})

describe('the pool', () => {
  it('holds 126 texts: 6 dictionaries, 24 novels, 96 magazines', () => {
    const ids = allPublicationIds()
    expect(ids).toHaveLength(126)
    expect(new Set(ids).size).toBe(126)
    const count = (type) => ids.filter((id) => id.includes(`-${type}-`)).length
    expect(count('dictionary')).toBe(6)
    expect(count('novel')).toBe(24)
    expect(count('magazine')).toBe(96)
  })

  it('ids parse back to their parts, and strangers do not parse', () => {
    expect(parsePublicationId(publicationId(3, 'magazine', 7))).toEqual({
      stage: 3,
      type: 'magazine',
      number: 7,
    })
    expect(parsePublicationId('s3-magazine-17')).toBe(null)
    expect(parsePublicationId('s7-novel-01')).toBe(null)
    expect(parsePublicationId('s1-comic-01')).toBe(null)
    expect(parsePublicationId(null)).toBe(null)
  })
})

describe('pickPublication', () => {
  it('is seeded: the same seed always gives the same text', () => {
    expect(pickPublication('novel', 4, 'seed-a')).toBe(
      pickPublication('novel', 4, 'seed-a'),
    )
  })

  it('never reaches above the current stage — and at stage 1 only stage 1', () => {
    for (let i = 0; i < 400; i++) {
      for (const stage of [1, 3, 6]) {
        const picked = parsePublicationId(
          pickPublication('magazine', stage, `s${i}`),
        )
        expect(picked.stage).toBeLessThanOrEqual(stage)
        expect(picked.type).toBe('magazine')
        expect(picked.number).toBeLessThanOrEqual(
          READING_POOL_PER_STAGE.magazine,
        )
      }
    }
  })

  it('at a high stage, earlier stages keep recurring AND the newest appears', () => {
    const stages = new Set()
    for (let i = 0; i < 600; i++) {
      stages.add(parsePublicationId(pickPublication('novel', 4, `s${i}`)).stage)
    }
    expect([...stages].sort()).toEqual([1, 2, 3, 4])
  })

  it('a legacy book gets a stable stage-1 text', () => {
    const id = legacyPublicationId('c1:0', 'dictionary')
    expect(id).toBe('s1-dictionary-01')
    expect(legacyPublicationId('c1:0', 'magazine')).toBe(
      legacyPublicationId('c1:0', 'magazine'),
    )
    expect(
      parsePublicationId(legacyPublicationId('x:1', 'magazine')).stage,
    ).toBe(1)
  })
})

describe('a book remembers its text', () => {
  const habit = { difficulty: 'medium' }
  // Find a tap day that drops a magazine, then check what the book holds.
  function firstReadingCompletion(existing, worldSeed) {
    for (let d = 1; d <= 28; d++) {
      for (let tap = 0; tap < 40; tap++) {
        const completion = {
          id: `c-${d}-${tap}`,
          habitId: `h${tap}`,
          dayKey: `2026-02-${String(d).padStart(2, '0')}`,
        }
        const out = deliverDrops(completion, habit, existing, worldSeed)
        if (out.drops.some((x) => x.kind === 'reading')) return out
      }
    }
    throw new Error('no reading drop found in the search window')
  }

  it('the drop stores a valid publicationId of its own type', () => {
    const out = firstReadingCompletion([], 'seed-1')
    const drop = out.drops.find((x) => x.kind === 'reading')
    expect(parsePublicationId(drop.publicationId).type).toBe(drop.readingType)
    // Nothing read yet, so stage 1 only.
    expect(parsePublicationId(drop.publicationId).stage).toBe(1)
  })

  it('same tap, same book — undo and redo cannot reroll it', () => {
    const a = firstReadingCompletion([], 'seed-2')
    const b = firstReadingCompletion([], 'seed-2')
    expect(a).toEqual(b)
  })

  it('readingItemsFrom hands the stored text through', () => {
    const out = firstReadingCompletion([], 'seed-3')
    const [item] = readingItemsFrom([out])
    expect(item.publicationId).toBe(
      out.drops.find((x) => x.kind === 'reading').publicationId,
    )
  })

  it('an old book with no stored text gets a stage-1 text, not null', () => {
    const [item] = readingItemsFrom([
      {
        id: 'old',
        dayKey: '2026-01-01',
        drops: [{ kind: 'reading', readingType: 'novel' }],
      },
    ])
    expect(parsePublicationId(item.publicationId)).toMatchObject({
      stage: 1,
      type: 'novel',
    })
  })
})
