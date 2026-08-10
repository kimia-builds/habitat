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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const read = (name) => readFileSync(join(process.cwd(), 'src', name), 'utf8')

// #abc / #aabbcc / #aabbccdd, and rgb()/rgba() in any spacing.
const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g

describe('the design tokens (T5.2a)', () => {
  it('index.css names every colour instead of spelling one out', () => {
    const found = read('index.css').match(COLOUR_LITERAL) ?? []
    // A failure lists the offenders, so the fix is obvious: give it a
    // name in tokens.css and use var(--that-name) here.
    expect(found).toEqual([])
  })

  it('tokens.css defines every name index.css asks for', () => {
    const tokens = read('tokens.css')
    const defined = new Set(
      (tokens.match(/^\s*(--[a-z0-9-]+):/gm) ?? []).map((line) =>
        line.trim().replace(':', ''),
      ),
    )
    const used = new Set(
      (read('index.css').match(/var\((--[a-z0-9-]+)\)/g) ?? []).map((call) =>
        call.slice(4, -1),
      ),
    )
    const missing = [...used].filter((name) => !defined.has(name))
    expect(missing).toEqual([])
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
