// The interface-copy catalogue and its translator (T6.13).
//
// These tests guard the MECHANISM, never the words. Kimia edits both
// blocks of ui.js directly on GitHub, so a test that quoted her copy
// would break the deploy the moment she rewrote a slot — the rule that
// has already broken CI twice (CLAUDE.md). So: nothing below asserts
// what any slot SAYS. They assert the rules — the fallback, the holes,
// the honest failure — using a throwaway catalogue of their own where
// the words are the test's, not hers.

import { describe, expect, it } from 'vitest'

import { DEFAULT_LANGUAGE, isLanguage, LANGUAGES, translate, UI } from './ui.js'

describe('the languages Habitat speaks', () => {
  it('recognises exactly the listed ones', () => {
    for (const code of LANGUAGES) expect(isLanguage(code)).toBe(true)
    expect(isLanguage('de')).toBe(false)
    expect(isLanguage('')).toBe(false)
    expect(isLanguage(null)).toBe(false)
    expect(isLanguage(undefined)).toBe(false)
  })

  it('falls back to a language it actually speaks', () => {
    expect(LANGUAGES).toContain(DEFAULT_LANGUAGE)
  })
})

describe('the catalogue', () => {
  it('gives every language the same set of keys', () => {
    // A key present in one block and missing from the other is a slot
    // Kimia can never fill — the failure this catches is a typo in a
    // key name, which is otherwise invisible until something on screen
    // silently stays English forever.
    const english = Object.keys(UI[DEFAULT_LANGUAGE]).sort()
    for (const code of LANGUAGES) {
      expect(Object.keys(UI[code]).sort()).toEqual(english)
    }
  })

  it('leaves no blank in the fallback language', () => {
    // English is what every blank Farsi slot falls back to, so a blank
    // in English is a hole with nothing underneath it. This asserts
    // that each slot HAS words, never which words.
    for (const [key, text] of Object.entries(UI[DEFAULT_LANGUAGE])) {
      expect(text, `${key} is blank in the fallback language`).not.toBe('')
    }
  })
})

describe('the translator', () => {
  it('uses a filled slot in the chosen language', () => {
    expect(translate('fa', 'language.fa')).toBe(UI.fa['language.fa'])
  })

  it('falls back to English when the chosen slot is blank', () => {
    // The rule the whole one-slot-at-a-time plan rests on. Any key that
    // is blank in Farsi must come back in English rather than empty —
    // whichever keys those happen to be today.
    const blank = Object.keys(UI.fa).filter((key) => UI.fa[key] === '')
    for (const key of blank) {
      expect(translate('fa', key)).toBe(UI.en[key])
      expect(translate('fa', key)).not.toBe('')
    }
  })

  it('falls back to English for a language it does not speak', () => {
    expect(translate('de', 'language.en')).toBe(UI.en['language.en'])
  })

  it('returns the key itself when no block has it', () => {
    // A missing key is a mistake in the CODE, not the content, so it
    // must be loud: the key on screen points straight at the typo,
    // where silence would read as a missing feature.
    expect(translate('en', 'market.byu')).toBe('market.byu')
  })

  it('fills the {holes} with the values it is given', () => {
    const filled = translate('en', 'backup.ageDays', { days: 4 })
    expect(filled).toContain('4')
    expect(filled).not.toContain('{days}')
  })

  it('leaves a hole alone when nothing is given for it', () => {
    // Better a visible {days} — a bug that announces itself — than the
    // word "undefined" sitting in a sentence.
    expect(translate('en', 'backup.ageDays')).toContain('{days}')
  })

  it('fills a hole wherever the sentence puts it', () => {
    // Farsi word order differs, so a translated slot may move its hole
    // to the front or the end. The filling must not care where it is.
    expect(translate('en', 'backup.ageDays', { days: 1 })).toMatch(/1/)
  })
})
