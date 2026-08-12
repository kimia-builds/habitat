// The design tokens are only useful if they stay the ONE place colour
// lives (T5.2a, design-notes §11d). The whole promise — "change the look
// by editing one short list" — quietly breaks the first time a raw hex is
// pasted back into a rule, and nothing on screen would look wrong, so
// nobody would notice. This test notices.
//
// It reads the two CSS files as text; it never renders anything, and it
// knows nothing about Kimia's content, so it cannot break the deploy on
// one of her edits (the standing rule for anything that can fail CI).

// Paths resolve from the project root (where `npm test` runs), not from
// this file — the same reason docs.test.js does it: tests run in a jsdom
// sandbox where `import.meta.url` is an http:// address node:fs can't read.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

// Comments are stripped before anything is counted (2026-08-11, T5.2b).
// These checks are about what the stylesheet DOES, and a comment does
// nothing — it draws no border and paints no pixel. Left in, prose became
// evidence: a comment explaining `var(--charm-here)` was read as a real
// use and failed the suite for describing the code correctly. Stripping
// also lets a comment quote the hex it replaced, which is often the most
// useful thing a token comment can say.
const read = (name) =>
  readFileSync(join(process.cwd(), 'src', name), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )

// #abc / #aabbcc / #aabbccdd, and rgb()/rgba() in any spacing.
const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g

// `--name:` at the start of a line — a declaration, in any file.
const definitionsIn = (css) =>
  (css.match(/^\s*(--[a-z0-9-]+):/gm) ?? []).map((line) =>
    line.trim().replace(':', ''),
  )

describe('the design tokens (T5.2a)', () => {
  it('index.css names every colour instead of spelling one out', () => {
    const found = read('index.css').match(COLOUR_LITERAL) ?? []
    // A failure lists the offenders, so the fix is obvious: give it a
    // name in tokens.css and use var(--that-name) here.
    expect(found).toEqual([])
  })

  it('every name index.css asks for is a name something defines', () => {
    // Definitions come from BOTH files (2026-08-11, T5.2b). tokens.css is
    // the palette — the list of actual colours, and the only place a value
    // is spelled out. But index.css may also define a custom property, so
    // long as it holds no colour of its own: T5.2b's `.charm-1 …
    // .charm-6` rules hand a row's own charm to the rules below under one
    // name, and the VALUES they pass along are still `var(--charm-crown)`
    // and friends from tokens.css. That indirection can't smuggle a colour
    // past the palette, because the check above forbids index.css from
    // containing one at all.
    const defined = new Set([
      ...definitionsIn(read('tokens.css')),
      ...definitionsIn(read('index.css')),
    ])
    const used = new Set(
      (read('index.css').match(/var\((--[a-z0-9-]+)\)/g) ?? []).map((call) =>
        call.slice(4, -1),
      ),
    )
    const missing = [...used].filter((name) => !defined.has(name))
    expect(missing).toEqual([])
  })

  it('index.css names every type size instead of spelling one out', () => {
    // The same promise as the colour check above, now for type (T5.2c): the
    // ladder of sizes in tokens.css is only a ladder while every rule
    // stands on one of its steps. The skeleton had nine sizes within a
    // hair of each other because each rule picked its own; this is what
    // stops them growing back.
    const found = (read('index.css').match(/font-size:\s*([^;]+);/g) ?? [])
      .map((line) =>
        line
          .replace(/font-size:\s*/, '')
          .replace(';', '')
          .trim(),
      )
      .filter((value) => !value.startsWith('var('))
    expect(found).toEqual([])
  })

  it('index.css asks for a font by name, never by family', () => {
    // Which typefaces Habitat is written in is a design decision, so it
    // lives in the design list — not halfway down a stylesheet. `font:
    // inherit`, which a button uses to refuse the browser's own font, is
    // not a family and is left alone.
    const found = (read('index.css').match(/font-family:\s*([^;]+);/g) ?? [])
      .map((line) =>
        line
          .replace(/font-family:\s*/, '')
          .replace(';', '')
          .trim(),
      )
      .filter((value) => !value.startsWith('var(') && value !== 'inherit')
    expect(found).toEqual([])
  })

  it('bundles the fonts with the app instead of fetching them', () => {
    // design-notes §11c: no external font loading — Habitat must look the
    // same offline, and no outside server should learn when it is opened.
    // A stray @import url(...) or an https: source in fonts.css would undo
    // that silently, since it would look perfectly fine online.
    const fonts = read('fonts.css')
    expect(fonts).not.toMatch(/https?:/)
    expect(fonts.match(/@font-face/g) ?? []).toHaveLength(4)
    for (const file of [
      './fonts/cormorant-garamond-latin-normal.woff2',
      './fonts/cormorant-garamond-latin-italic.woff2',
      './fonts/dm-sans-latin-normal.woff2',
      './fonts/dm-sans-latin-italic.woff2',
    ]) {
      expect(fonts, `fonts.css carries ${file}`).toContain(file)
      expect(
        existsSync(join(process.cwd(), 'src', file.replace('./', ''))),
        `${file} is in the repo`,
      ).toBe(true)
    }
  })

  it('keeps symbols.js in step with the canonical charm colours', () => {
    // symbols.js is a declared MIRROR: it needs the six hexes as JS
    // strings to build its glow drop-shadows (design-notes §11d chose
    // that over reading CSS at runtime). A mirror nobody checks drifts.
    const tokens = read('tokens.css')
    const symbols = read('ui/symbols.js')
    const charms = ['crown', 'cherry', 'shell', 'anchor', 'shield', 'key']

    for (const charm of charms) {
      const token = tokens.match(
        new RegExp(`--charm-${charm}:\\s*(#[0-9a-f]{6});`),
      )
      expect(token, `tokens.css defines --charm-${charm}`).not.toBeNull()
      expect(
        symbols.toLowerCase(),
        `symbols.js carries the ${charm} colour ${token[1]}`,
      ).toContain(token[1])
    }
  })
})
