// Tests for the reveal pop-up reading its words from the narration
// slots (T3.4). App.test.jsx already proves the reveals appear at the
// right moments; here we pin that the words on screen are exactly the
// slots' — and that an EMPTY slot renders gracefully: the pop-up still
// shows its glyph and button, with simply no text where none exists.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NARRATION } from '../content/narration.js'
import FirstReveal from './FirstReveal.jsx'

afterEach(cleanup)

describe('first-occurrence reveals read from narration slots (T3.4)', () => {
  it('shows each reveal with its slot title and line', () => {
    for (const key of ['flora', 'magazine', 'novel', 'dictionary', 'fungi']) {
      const { unmount } = render(
        <FirstReveal arrival={{ key }} onDismiss={() => {}} />,
      )
      const slots = NARRATION.firstReveals[key]
      expect(screen.getByRole('dialog', { name: slots.title })).toBeDefined()
      expect(screen.getByText(slots.line)).toBeDefined()
      unmount()
    }
  })

  it('renders gracefully when both slots are empty — glyph and button, no text', () => {
    const original = { ...NARRATION.firstReveals.flora }
    NARRATION.firstReveals.flora.title = ''
    NARRATION.firstReveals.flora.line = ''
    try {
      render(<FirstReveal arrival={{ key: 'flora' }} onDismiss={() => {}} />)
      // The pop-up is still there and still usable…
      const dialog = screen.getByRole('dialog', { name: 'a first arrival' })
      expect(dialog.querySelector('.reveal-glyph')).not.toBeNull()
      expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
      // …but nothing stands in for the missing words.
      expect(dialog.querySelector('.reveal-title')).toBeNull()
      expect(dialog.querySelector('.reveal-line')).toBeNull()
    } finally {
      Object.assign(NARRATION.firstReveals.flora, original)
    }
  })

  it('the dismiss button still works with empty slots', () => {
    const original = { ...NARRATION.firstReveals.novel }
    NARRATION.firstReveals.novel.title = ''
    NARRATION.firstReveals.novel.line = ''
    try {
      const onDismiss = vi.fn()
      render(<FirstReveal arrival={{ key: 'novel' }} onDismiss={onDismiss} />)
      fireEvent.click(screen.getByRole('button', { name: 'onward' }))
      expect(onDismiss).toHaveBeenCalled()
    } finally {
      Object.assign(NARRATION.firstReveals.novel, original)
    }
  })
})
