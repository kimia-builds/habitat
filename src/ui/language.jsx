// The language plumbing: how a keyed slot in src/content/ui.js becomes
// a word on screen (T6.13).
//
// The whole mechanism is three small things:
//
//   LanguageProvider — sits once at the top of the app and holds which
//     language is on. Everything below it can read that without being
//     handed it through a chain of props.
//   useText()        — what a component calls to get its translator.
//   t(key, vars)     — the translator itself: key in, word out.
//
// WHY A HAND-WRITTEN ONE and not a translation library: Habitat has
// about 130 interface words and exactly two languages. A library would
// add a dependency, a configuration file and a vocabulary of its own to
// learn, to replace the forty lines below. Boring and readable wins
// (CLAUDE.md).
//
// THE FALLBACK RULE lives in `t` and is the reason Farsi can be
// translated one slot at a time — see the long note at the top of
// src/content/ui.js.

import { createContext, useContext, useMemo } from 'react'

import { DEFAULT_LANGUAGE, isLanguage, translate } from '../content/ui.js'

// The current language, as a bare string ('en' | 'fa').
//
// It defaults to English rather than to nothing, so that a component
// rendered OUTSIDE the provider — which in practice means a component
// rendered alone in a test — still finds words instead of crashing.
// That is deliberate: it keeps every existing component test working
// without wrapping it in a provider.
const LanguageContext = createContext(DEFAULT_LANGUAGE)

export function LanguageProvider({ language, children }) {
  // An unrecognised language reads as English rather than throwing: a
  // corrupted setting should never be able to take the app down.
  const safe = isLanguage(language) ? language : DEFAULT_LANGUAGE
  return (
    <LanguageContext.Provider value={safe}>{children}</LanguageContext.Provider>
  )
}

// What components call. Returns { t, language }:
//
//   const { t } = useText()
//   …then t('habitForm.save') wherever the word goes.
//
// `language` comes along for the few places that need to know which
// language is on rather than just what a word is — the switch itself,
// and (later) anything that has to lay itself out right-to-left.
//
// The translator is memoised per language so that a component
// re-rendering for its own reasons doesn't hand its children a
// brand-new function every time.
export function useText() {
  const language = useContext(LanguageContext)
  return useMemo(
    () => ({
      language,
      t: (key, vars) => translate(language, key, vars),
    }),
    [language],
  )
}
