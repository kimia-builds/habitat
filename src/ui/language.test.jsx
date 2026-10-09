// The page-level side of language (T6.16): the page says which language it
// speaks, and the stylesheet never flips the layout.

import { render } from '@testing-library/react'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LanguageProvider } from './language.jsx'

describe('the page language', () => {
  it('follows the chosen language, and an unknown one reads as English', () => {
    const { rerender } = render(<LanguageProvider language="fa" />)
    expect(document.documentElement.lang).toBe('fa')
    rerender(<LanguageProvider language="en" />)
    expect(document.documentElement.lang).toBe('en')
    rerender(<LanguageProvider language="xx" />)
    expect(document.documentElement.lang).toBe('en')
  })
})

describe('right-to-left text without a right-to-left layout', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'index.css'), 'utf8')

  it('lets Farsi words find their own direction when Farsi is on', () => {
    expect(css).toMatch(
      /:root\[lang='fa'\]\s*\*\s*\{[^}]*unicode-bidi:\s*plaintext/,
    )
  })

  it('never flips the page or any box: no direction rules, no fixed left alignment', () => {
    // The one pinned-left place is the words on a habit tile (Kimia,
    // 2026-10-09), so every line of a tile shares one left edge in both
    // languages. Anywhere else a fixed left alignment is still a bug.
    const withoutTileText = css.replace(
      /\.habit-main\s*>\s*\*\s*\{[^}]*\}/,
      '',
    )
    expect(css).not.toMatch(/direction\s*:\s*rtl/)
    expect(withoutTileText).not.toMatch(/text-align\s*:\s*left/)
  })
})

describe('Farsi lettering', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'index.css'), 'utf8')

  it('bundles its font files with the site and asks no outside server for them', () => {
    const urls = [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1])
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) {
      expect(url).toMatch(/^\.\/fonts\/.+\.woff2$/)
      expect(existsSync(join(process.cwd(), 'src', url))).toBe(true)
    }
    expect(css).not.toMatch(/https?:\/\/[^\s)'"]*\.(woff2?|ttf)/)
  })

  it('wears the Farsi typeface only when Farsi is on', () => {
    expect(css).toMatch(
      /:root\[lang='fa'\]\s+body\s*\{[^}]*font-family:\s*'Vazirmatn FD NL'/,
    )
    // The plain rule on <body> stays the system font for English.
    expect(css).not.toMatch(/\nbody\s*\{[^}]*Vazirmatn/)
  })

  it('switches letterspacing and re-casing off for Farsi, sparing the wordmark', () => {
    expect(css).toMatch(
      /:root\[lang='fa'\]\s+\*:not\(h1,\s*h1\s+\*\)\s*\{[^}]*letter-spacing:\s*0[^}]*text-transform:\s*none/,
    )
  })

  it('makes Farsi letters larger than their nominal size, for that font alone', () => {
    const sizes = [...css.matchAll(/size-adjust:\s*(\d+)%/g)].map((m) =>
      Number(m[1]),
    )
    expect(sizes.length).toBeGreaterThan(0)
    for (const size of sizes) expect(size).toBeGreaterThan(100)
  })
})
