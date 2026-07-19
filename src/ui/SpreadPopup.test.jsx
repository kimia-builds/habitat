// The spread popup (T3.5) in isolation: the image when a spread
// exists, the graceful empty state when it doesn't, and — the
// human-written rule — not one invented word when the empty-state
// slot is blank. The content files are mocked so these tests hold
// whatever Kimia later puts in them.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SpreadPopup from './SpreadPopup.jsx'

let mockSpreads = {}
vi.mock('../content/spreads.js', () => ({
  spreadFor: (id) => mockSpreads[id] ?? null,
}))

let mockEmptyLine = null
vi.mock('../content/narration.js', () => ({
  narrationSlot: () => mockEmptyLine,
}))

afterEach(() => {
  cleanup()
  mockSpreads = {}
  mockEmptyLine = null
})

describe('SpreadPopup', () => {
  it('shows the double-page spread when the publication has one', () => {
    mockSpreads = { 'pub-1': 'spreads/pub-1.jpg' }
    render(
      <SpreadPopup
        item={{ type: 'novel', publicationId: 'pub-1' }}
        onClose={() => {}}
      />,
    )
    const image = screen.getByRole('img')
    expect(image.getAttribute('src')).toContain('spreads/pub-1.jpg')
  })

  it('a publication without a spread gets the empty state — glyph and close button, no image', () => {
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: null }}
        onClose={() => {}}
      />,
    )
    const popup = screen.getByRole('dialog', { name: 'a magazine' })
    expect(popup.querySelector('img')).toBeNull()
    expect(popup.querySelector('svg')).not.toBeNull()
    // The blank slot renders NOTHING extra: the popup's only words are
    // the publication's name and its close button — never invented copy.
    expect(popup.textContent).toBe('a magazineclose')
  })

  it("shows Kimia's empty-state line once she has written it", () => {
    mockEmptyLine = 'the words are hers'
    render(
      <SpreadPopup
        item={{ type: 'dictionary', publicationId: null }}
        onClose={() => {}}
      />,
    )
    expect(screen.getByText('the words are hers')).toBeDefined()
  })

  it('the close button closes it', () => {
    const onClose = vi.fn()
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: null }}
        onClose={onClose}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
