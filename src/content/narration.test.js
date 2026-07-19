// Tests for the narration content slots (T3.4). The words themselves
// are Kimia's and never asserted here — these tests pin the STRUCTURE:
// the five built reveals have slots, and empty or missing slots come
// back as null so the app shows nothing instead of inventing copy.

import { describe, expect, it } from 'vitest'
import { NARRATION, narrationSlot } from './narration.js'

describe('narration slots (T3.4)', () => {
  it('every built first-occurrence reveal has a title and a line slot', () => {
    for (const key of ['flora', 'magazine', 'novel', 'dictionary', 'fungi']) {
      expect(typeof NARRATION.firstReveals[key].title).toBe('string')
      expect(typeof NARRATION.firstReveals[key].line).toBe('string')
    }
  })

  it('looks a slot up by path', () => {
    expect(narrationSlot('firstReveals.flora.title')).toBe(
      NARRATION.firstReveals.flora.title,
    )
  })

  it('an empty or blank slot is null — nothing to show, nothing invented', () => {
    expect(narrationSlot('literacyEras.dawn')).toBeNull() // doesn't exist yet
    expect(narrationSlot('firstReveals.flora')).toBeNull() // an object, not text
    expect(narrationSlot('firstReveals.comet.title')).toBeNull() // no such reveal
    expect(narrationSlot('friendIntros.drifter.welcome.extra')).toBeNull() // path past a leaf
  })

  it('whitespace-only text counts as empty', () => {
    const original = NARRATION.firstReveals.flora.line
    NARRATION.firstReveals.flora.line = '   \n  '
    try {
      expect(narrationSlot('firstReveals.flora.line')).toBeNull()
    } finally {
      NARRATION.firstReveals.flora.line = original
    }
  })
})
