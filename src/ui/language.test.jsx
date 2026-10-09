// The page-level side of language (T6.16): the page says which language it
// speaks, and the stylesheet never flips the layout.

import { render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
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
    expect(css).not.toMatch(/direction\s*:\s*rtl/)
    expect(css).not.toMatch(/text-align\s*:\s*left/)
  })
})
