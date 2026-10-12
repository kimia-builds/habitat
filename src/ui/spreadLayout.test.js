import { describe, expect, it } from 'vitest'
import {
  LONG_TEXT_CHARS,
  MEDIUM_TEXT_CHARS,
  WORD_CHARS,
  spreadLayout,
} from './spreadLayout.js'

const words = (n) => 'a'.repeat(n)

describe('spreadLayout', () => {
  it('a picture alone is one landscape page — no fold', () => {
    expect(spreadLayout({ picture: '[a plip]', text: null }).fold).toBe('none')
  })

  it('a single word alone is one landscape page, set big', () => {
    expect(spreadLayout({ picture: null, text: 'sahara' })).toEqual({
      fold: 'none',
      size: 'big',
    })
  })

  it('picture plus words folds into two pages', () => {
    expect(spreadLayout({ picture: '[a plip]', text: 'friendship' }).fold).toBe(
      'pages',
    )
  })

  it('a short line is one page set medium; a longer one set small', () => {
    expect(
      spreadLayout({ picture: null, text: words(MEDIUM_TEXT_CHARS) }),
    ).toEqual({ fold: 'none', size: 'mid' })
    expect(
      spreadLayout({ picture: null, text: words(MEDIUM_TEXT_CHARS + 1) }),
    ).toEqual({ fold: 'none', size: 'small' })
    expect(
      spreadLayout({ picture: null, text: words(WORD_CHARS + 1) }).size,
    ).toBe('mid')
  })

  it('words long enough to fill two columns get the fold', () => {
    expect(
      spreadLayout({ picture: null, text: words(LONG_TEXT_CHARS) }).fold,
    ).toBe('none')
    expect(
      spreadLayout({ picture: null, text: words(LONG_TEXT_CHARS + 1) }),
    ).toEqual({ fold: 'columns', size: 'small' })
  })
})
