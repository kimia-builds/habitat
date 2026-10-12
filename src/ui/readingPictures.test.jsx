// The reading pictures (T5.3o): every picture Kimia's texts ask for has a
// drawing, and the drawings are the family she approved — charm colours
// only, one pen. Reads the real texts file, so a new picture description
// added there without a drawing fails here.

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { READING_TEXTS } from '../content/readingTexts.js'
import { SYMBOL_COLORS } from './symbols.js'
import ReadingPicture, {
  pictureName,
  readingPictureFor,
} from './readingPictures.jsx'

afterEach(cleanup)

const described = Object.values(READING_TEXTS)
  .map((slot) => slot.picture)
  .filter(Boolean)

describe('readingPictures', () => {
  it('every picture the texts describe has a drawing', () => {
    expect(described.length).toBeGreaterThan(0)
    for (const description of described) {
      expect(readingPictureFor(description), description).not.toBeNull()
    }
  })

  it('reads a description without its bracket, capital or full stop', () => {
    expect(pictureName('[A gubl and its bauble yields.]')).toBe(
      'a gubl and its bauble yields',
    )
  })

  it('a description with no drawing gives null', () => {
    expect(readingPictureFor('[a thing not drawn]')).toBeNull()
    expect(readingPictureFor(null)).toBeNull()
  })

  it('wears only the six charm colours', () => {
    const six = new Set(Object.values(SYMBOL_COLORS))
    for (const description of described) {
      expect(six.has(readingPictureFor(description).colour), description).toBe(
        true,
      )
    }
  })

  it('draws a named image that is never filled', () => {
    const description = '[three plips]'
    const { getByRole } = render(
      <ReadingPicture
        description={description}
        drawing={readingPictureFor(description)}
      />,
    )
    const svg = getByRole('img', { name: 'three plips' })
    expect(svg.getAttribute('fill')).toBe('none')
  })
})
