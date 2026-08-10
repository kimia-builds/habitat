// Tests for the Guest Book (T4.4): the page is visual-first — art and
// names, bare with no prose while no friend has arrived. Clicking a
// friend opens the popup card: art, name, card text (Kimia's
// re-readable slot — blank renders nothing, exactly like the reveal
// slots) and the signature animation. The momentary arrival narration
// (friendIntros) never shows here — it played once, at the arrival.

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NARRATION } from '../content/narration.js'
import {
  restoreNames,
  setIndividualName,
  setSpeciesName,
} from '../test/nameFixture.js'
import GuestBookPage from './GuestBookPage.jsx'

afterEach(cleanup)

// Every friend name here is a FIXTURE, never Kimia's real slot value —
// hers are hers to rewrite, and a test that quoted them would break the
// deploy the moment she did (src/test/nameFixture.js explains).
const DRIFTER = 'test species name'
const POET = 'another test species name'

beforeEach(() => {
  setSpeciesName('drifter', DRIFTER)
  setSpeciesName('poet', POET)
})
afterEach(restoreNames)

// One arrived friend, as game/friends.js's friendsFrom reports it.
const friend = (category, individual, completionId = 'c1') => ({
  completionId,
  category,
  individual,
  dayKey: '2026-07-20',
})

describe('the Guest Book page', () => {
  it('is bare when no friend has arrived — no prose, no count', () => {
    const { container } = render(
      <GuestBookPage friends={[]} worldSeed="seed" onBack={() => {}} />,
    )
    expect(
      screen.getByRole('heading', { name: 'local community' }),
    ).toBeDefined()
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: DRIFTER })).toBeNull()
  })

  it('shows every friend, named by whatever name its slot holds', () => {
    render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1'), friend(0, 2, 'c2'), friend(9, 1, 'c3')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    expect(screen.getAllByRole('button', { name: DRIFTER })).toHaveLength(2)
    expect(screen.getByRole('button', { name: POET })).toBeDefined()
  })

  it('prefers a friend\'s own name over its species name', () => {
    // The T6.1a ladder: individual name first, species name second.
    setIndividualName('drifter', 2, 'a named individual')
    render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1'), friend(0, 2, 'c2')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'a named individual' })).toBeDefined()
    expect(screen.getAllByRole('button', { name: DRIFTER })).toHaveLength(1)
  })

  it('shows no name at all while the slots are blank, and stays usable', () => {
    // Habitat ships this way until Kimia writes. The art carries the
    // friend; a screen reader still gets a handle on the control.
    setSpeciesName('drifter', '')
    const { container } = render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    expect(container.querySelector('.guestbook-name')).toBeNull()
    expect(screen.getByRole('button', { name: 'friend' })).toBeDefined()
  })
})

describe('the popup card', () => {
  it('opens on a click with art, name and the signature animation playing', () => {
    const { container } = render(
      <GuestBookPage
        friends={[friend(0, 1)]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: DRIFTER }))
    const card = screen.getByRole('dialog', { name: DRIFTER })
    expect(card).toBeDefined()
    // The signature category animation plays on the card's art.
    expect(card.querySelector('.friend-anim-drifter')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'close' })).toBeDefined()
    // …and its class name is the only place the animation is declared.
    expect(container.querySelectorAll('.friend-anim-drifter')).toHaveLength(1)
  })

  it('shows the card text from its slot — and nothing when the slot is empty', () => {
    const original = NARRATION.friendCards.drifter
    try {
      // Whatever the slot holds is what the card shows.
      NARRATION.friendCards.drifter = 'a written card text'
      const { unmount } = render(
        <GuestBookPage
          friends={[friend(0, 1)]}
          worldSeed="seed"
          onBack={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: DRIFTER }))
      expect(screen.getByText('a written card text')).toBeDefined()
      unmount()

      // Blank, the card still works — art, name and animation, no prose.
      NARRATION.friendCards.drifter = ''
      render(
        <GuestBookPage
          friends={[friend(0, 1)]}
          worldSeed="seed"
          onBack={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: DRIFTER }))
      const card = screen.getByRole('dialog', { name: DRIFTER })
      expect(card.querySelector('.friend-card-text')).toBeNull()
      expect(card.querySelector('.friend-anim-drifter')).not.toBeNull()
    } finally {
      NARRATION.friendCards.drifter = original
    }
  })

  it('never shows the momentary arrival narration — the card is the only re-readable text', () => {
    const intro = NARRATION.friendIntros.drifter
    const original = { ...intro }
    intro.title = 'the night we met (momentary)'
    intro.line = 'played once, never re-readable'
    try {
      render(
        <GuestBookPage
          friends={[friend(0, 1)]}
          worldSeed="seed"
          onBack={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: DRIFTER }))
      expect(screen.queryByText('the night we met (momentary)')).toBeNull()
      expect(screen.queryByText('played once, never re-readable')).toBeNull()
    } finally {
      Object.assign(intro, original)
    }
  })

  it('closes on its button, back to the book', () => {
    render(
      <GuestBookPage
        friends={[friend(0, 1)]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: DRIFTER }))
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: DRIFTER })).toBeDefined()
  })

  it('the back button leads home', () => {
    const onBack = vi.fn()
    render(<GuestBookPage friends={[]} worldSeed="seed" onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back to the habits/ }))
    expect(onBack).toHaveBeenCalled()
  })
})
