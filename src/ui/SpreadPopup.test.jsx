// The spread popup (T3.5, rebuilt T6.24) in isolation: the open book
// when the publication's text slot has anything in it, the graceful
// empty state when it doesn't, and — the human-written rule — not one
// invented word when a slot is blank. The content files are mocked so
// these tests hold whatever Kimia later writes in them.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SpreadPopup from './SpreadPopup.jsx'

let mockTexts = {}
vi.mock('../content/readingTexts.js', () => ({
  readingTextFor: (id) => mockTexts[id] ?? null,
}))

let mockEmptyLine = null
vi.mock('../content/narration.js', () => ({
  narrationSlot: () => mockEmptyLine,
}))

afterEach(() => {
  cleanup()
  mockTexts = {}
  mockEmptyLine = null
})

describe('SpreadPopup', () => {
  it('shows the picture and the text of the book it holds', () => {
    mockTexts = { 'pub-1': { picture: '[a plip]', text: 'friendship' } }
    render(
      <SpreadPopup
        item={{ type: 'novel', publicationId: 'pub-1' }}
        onClose={() => {}}
      />,
    )
    const popup = screen.getByRole('dialog', { name: 'a novel' })
    expect(popup.textContent).toContain('[a plip]')
    expect(popup.textContent).toContain('friendship')
  })

  it('a half-written slot shows just the half it has', () => {
    mockTexts = { 'pub-2': { picture: null, text: 'words only' } }
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: 'pub-2' }}
        onClose={() => {}}
      />,
    )
    const popup = screen.getByRole('dialog', { name: 'a magazine' })
    expect(popup.textContent).toContain('words only')
    expect(popup.textContent).not.toContain('[')
  })

  it('the written pages are English and read left to right, whatever the app language', () => {
    mockTexts = { 'pub-1': { picture: null, text: 'hello' } }
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: 'pub-1' }}
        onClose={() => {}}
      />,
    )
    const book = screen.getByText('hello').closest('[lang]')
    expect(book.getAttribute('lang')).toBe('en')
    expect(book.getAttribute('dir')).toBe('ltr')
  })

  it('a book whose slot is blank gets the empty state — glyph and close button, no pages', () => {
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: 's1-magazine-01' }}
        onClose={() => {}}
      />,
    )
    const popup = screen.getByRole('dialog', { name: 'a magazine' })
    expect(popup.querySelector('.spread-book')).toBeNull()
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

  it('picture plus words get two pages and a fold; words alone get one page', () => {
    mockTexts = {
      both: { picture: '[a plip]', text: 'friendship' },
      alone: { picture: null, text: 'sahara' },
    }
    const { container, rerender } = render(
      <SpreadPopup
        item={{ type: 'novel', publicationId: 'both' }}
        onClose={() => {}}
      />,
    )
    expect(container.querySelector('.spread-fold-pages')).not.toBeNull()
    expect(container.querySelectorAll('.spread-page')).toHaveLength(2)
    rerender(
      <SpreadPopup
        item={{ type: 'novel', publicationId: 'alone' }}
        onClose={() => {}}
      />,
    )
    expect(container.querySelector('.spread-fold-none')).not.toBeNull()
    expect(container.querySelectorAll('.spread-page')).toHaveLength(1)
  })

  it('each kind of publication gets its own size class', () => {
    mockTexts = { x: { picture: null, text: 'hello' } }
    for (const type of ['magazine', 'novel', 'dictionary']) {
      const { container, unmount } = render(
        <SpreadPopup item={{ type, publicationId: 'x' }} onClose={() => {}} />,
      )
      expect(container.querySelector(`.spread-${type}`)).not.toBeNull()
      unmount()
    }
  })

  it('the close pebble sits outside the book card, and adds nothing to the pages', () => {
    mockTexts = { x: { picture: null, text: 'hello' } }
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: 'x' }}
        onClose={() => {}}
      />,
    )
    const button = screen.getByRole('button', { name: 'close' })
    expect(button.closest('.spread-popup')).toBeNull()
    expect(button.closest('.spread-book')).toBeNull()
  })

  it('Escape and a press on the backdrop close it; a press on the book does not', () => {
    mockTexts = { x: { picture: null, text: 'hello' } }
    const onClose = vi.fn()
    render(
      <SpreadPopup
        item={{ type: 'magazine', publicationId: 'x' }}
        onClose={onClose}
      />,
    )
    fireEvent.click(screen.getByText('hello'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(2)
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
