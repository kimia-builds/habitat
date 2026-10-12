// The reading pool's content file (T6.24): the structure is guarded,
// the words are not — Kimia edits them directly on GitHub.

import { describe, expect, it } from 'vitest'
import { allPublicationIds } from '../game/reading.js'
import { READING_TEXTS, readingTextFor } from './readingTexts.js'

describe('READING_TEXTS', () => {
  it('has exactly one slot for every text in the pool, and no strays', () => {
    expect(Object.keys(READING_TEXTS).sort()).toEqual(
      allPublicationIds().sort(),
    )
  })

  it('every slot is { picture, text } of strings', () => {
    for (const slot of Object.values(READING_TEXTS)) {
      expect(typeof slot.picture).toBe('string')
      expect(typeof slot.text).toBe('string')
    }
  })

  it('every picture, where there is one, is a square-bracket stand-in', () => {
    for (const { picture } of Object.values(READING_TEXTS)) {
      if (picture.trim() !== '') expect(picture.trim()).toMatch(/^\[.*\]$/)
    }
  })
})

describe('readingTextFor', () => {
  const table = {
    a: { picture: '[a plip]', text: 'friendship' },
    b: { picture: '  ', text: 'words only' },
    c: { picture: '[a plip]', text: '' },
    d: { picture: '', text: '   ' },
  }

  it('returns picture and text, trimmed', () => {
    expect(readingTextFor('a', table)).toEqual({
      picture: '[a plip]',
      text: 'friendship',
    })
  })

  it('a missing half is null, not an empty string', () => {
    expect(readingTextFor('b', table)).toEqual({
      picture: null,
      text: 'words only',
    })
    expect(readingTextFor('c', table)).toEqual({
      picture: '[a plip]',
      text: null,
    })
  })

  it('a blank slot, an unknown id or no id is null — nothing invented', () => {
    expect(readingTextFor('d', table)).toBe(null)
    expect(readingTextFor('zzz', table)).toBe(null)
    expect(readingTextFor(null, table)).toBe(null)
  })
})
