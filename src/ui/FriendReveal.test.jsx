// Tests for the friend arrival reveal (T4.4). Every friend arrival is
// a neon POP moment: art, name, signature animation and the onward
// button always show. The words are Kimia's friendIntros slots and
// play only at the category's FIRST arrival — later friends of the
// same category arrive wordless (narration is momentary). Empty slots
// render nothing, exactly like the T3.4 reveals.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NARRATION } from '../content/narration.js'
import {
  blankAllNames,
  restoreNames,
  setSpeciesName,
} from '../test/nameFixture.js'
import FriendReveal from './FriendReveal.jsx'

afterEach(cleanup)

// A fixture name, never Kimia's real one (src/test/nameFixture.js).
const plip = 'test species name'
beforeEach(() => {
  // Wipe first: an individual name outranks a species name, so without
  // this the test would read Kimia's real words (2026-08-11).
  blankAllNames()
  setSpeciesName('plip', plip)
})
afterEach(restoreNames)

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
    expect(dialog.querySelector('.friend-anim-plip')).not.toBeNull()
    expect(screen.getByText(plip)).toBeDefined()
    expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
  })

  it('shows no name line while the species slot is blank', () => {
    // Ships this way until Kimia writes: art, her narration, the button.
    setSpeciesName('plip', '')
    renderReveal()
    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelector('.reveal-friend-name')).toBeNull()
    expect(dialog.querySelector('.friend-anim-plip')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'onward' })).toBeDefined()
  })

  it('the intro words come from the slot at the category’s first arrival', () => {
    const intro = NARRATION.friendIntros.baluhm
    const original = { ...intro }
    intro.title = 'a first baluhm arrives'
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
      expect(screen.getByText('a first baluhm arrives')).toBeDefined()
      expect(
        screen.getByText('the words Kimia wrote for this moment'),
      ).toBeDefined()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('a later friend of the same category arrives wordless, slots or no slots', () => {
    const intro = NARRATION.friendIntros.plip
    const original = { ...intro }
    intro.title = 'only the first plip hears this'
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
      expect(screen.queryByText('only the first plip hears this')).toBeNull()
      expect(screen.queryByText('momentary words')).toBeNull()
      // …but the moment still pops: art, name, animation, button.
      expect(screen.getByText(plip)).toBeDefined()
      expect(
        screen.getByRole('dialog').querySelector('.friend-anim-plip'),
      ).not.toBeNull()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('renders gracefully with empty slots — nothing invented', () => {
    const intro = NARRATION.friendIntros.klupengk
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
      expect(dialog.querySelector('.friend-anim-klupengk')).not.toBeNull()
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
