// Tests for the friend arrival reveal (T4.4). Every friend arrival is
// a neon POP moment: art, name, signature animation and the onward
// button always show. The words are Kimia's friendIntros slots and
// play only at the category's FIRST arrival — later friends of the
// same category arrive wordless (narration is momentary). Empty slots
// render nothing, exactly like the T3.4 reveals.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NARRATION } from '../content/narration.js'
import FriendReveal from './FriendReveal.jsx'

afterEach(cleanup)

const arrival = (category = 0, individual = 1) => ({
  key: 'friend',
  friend: { category, individual },
})

function renderReveal(over = {}) {
  return render(
    <FriendReveal
      arrival={arrival()}
      worldSeed="seed"
      firstOfCategory={true}
      onDismiss={() => {}}
      {...over}
    />,
  )
}

describe('the friend arrival reveal', () => {
  it('always shows the art with its signature animation, the name and the button', () => {
    renderReveal()
    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelector('.friend-anim-drifter')).not.toBeNull()
    expect(screen.getByText('a Drifter')).toBeDefined()
    expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
  })

  it('the intro words come from the slot at the category’s first arrival', () => {
    const intro = NARRATION.friendIntros.nester
    const original = { ...intro }
    intro.title = 'a first nester arrives'
    intro.line = 'the words Kimia wrote for this moment'
    try {
      render(
        <FriendReveal
          arrival={arrival(1, 1)}
          worldSeed="seed"
          firstOfCategory={true}
          onDismiss={() => {}}
        />,
      )
      expect(screen.getByText('a first nester arrives')).toBeDefined()
      expect(
        screen.getByText('the words Kimia wrote for this moment'),
      ).toBeDefined()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('a later friend of the same category arrives wordless, slots or no slots', () => {
    const intro = NARRATION.friendIntros.drifter
    const original = { ...intro }
    intro.title = 'only the first drifter hears this'
    intro.line = 'momentary words'
    try {
      render(
        <FriendReveal
          arrival={arrival(0, 2)}
          worldSeed="seed"
          firstOfCategory={false}
          onDismiss={() => {}}
        />,
      )
      expect(screen.queryByText('only the first drifter hears this')).toBeNull()
      expect(screen.queryByText('momentary words')).toBeNull()
      // …but the moment still pops: art, name, animation, button.
      expect(screen.getByText('a Drifter')).toBeDefined()
      expect(
        screen.getByRole('dialog').querySelector('.friend-anim-drifter'),
      ).not.toBeNull()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('renders gracefully with empty slots — nothing invented', () => {
    const intro = NARRATION.friendIntros.mimic
    const original = { ...intro }
    intro.title = ''
    intro.line = ''
    try {
      render(
        <FriendReveal
          arrival={arrival(2, 1)}
          worldSeed="seed"
          firstOfCategory={true}
          onDismiss={() => {}}
        />,
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog.querySelector('.reveal-title')).toBeNull()
      expect(dialog.querySelector('.reveal-line')).toBeNull()
      expect(dialog.querySelector('.friend-anim-mimic')).not.toBeNull()
      expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('dismisses on its button', () => {
    const onDismiss = vi.fn()
    render(
      <FriendReveal
        arrival={arrival()}
        worldSeed="seed"
        firstOfCategory={true}
        onDismiss={onDismiss}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
