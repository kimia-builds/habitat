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
  blankAllNames,
  restoreNames,
  setIndividualName,
  setSpeciesName,
} from '../test/nameFixture.js'
import GuestBookPage from './GuestBookPage.jsx'
import { FRIEND_CANON } from './friendCanon.js'

afterEach(cleanup)

// Every friend name here is a FIXTURE, never Kimia's real slot value —
// hers are hers to rewrite, and a test that quoted them would break the
// deploy the moment she did (src/test/nameFixture.js explains).
const plip = 'test species name'
const hamdiBulo = 'another test species name'

beforeEach(() => {
  // Blank EVERY slot first, then set only what this file needs. Without
  // the wipe these tests would read whatever Kimia has written — and an
  // individual name outranks a species name, so her real words would
  // decide the result. That is what broke the deploy on 2026-08-11.
  blankAllNames()
  setSpeciesName('plip', plip)
  setSpeciesName('hamdi-bulo', hamdiBulo)
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
    expect(screen.queryByRole('button', { name: plip })).toBeNull()
  })

  it('shows every friend, named by whatever name its slot holds', () => {
    render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1'), friend(0, 2, 'c2'), friend(9, 1, 'c3')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    expect(screen.getAllByRole('button', { name: plip })).toHaveLength(2)
    expect(screen.getByRole('button', { name: hamdiBulo })).toBeDefined()
  })

  it("prefers a friend's own name over its species name", () => {
    // The T6.1a ladder: individual name first, species name second.
    setIndividualName('plip', 2, 'a named individual')
    render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1'), friend(0, 2, 'c2')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    expect(
      screen.getByRole('button', { name: 'a named individual' }),
    ).toBeDefined()
    expect(screen.getAllByRole('button', { name: plip })).toHaveLength(1)
  })

  it('shows no name at all while the slots are blank, and stays usable', () => {
    // Habitat ships this way until Kimia writes. The art carries the
    // friend; a screen reader still gets a handle on the control.
    setSpeciesName('plip', '')
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
    fireEvent.click(screen.getByRole('button', { name: plip }))
    const card = screen.getByRole('dialog', { name: plip })
    expect(card).toBeDefined()
    // The signature category animation plays on the card's art.
    expect(card.querySelector('.friend-anim-plip')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'close' })).toBeDefined()
    // …and its class name is the only place the animation is declared.
    expect(container.querySelectorAll('.friend-anim-plip')).toHaveLength(1)
  })

  it('shows the card text from its slot — and nothing when the slot is empty', () => {
    const original = NARRATION.friendCards.plip
    try {
      // Whatever the slot holds is what the card shows.
      NARRATION.friendCards.plip = 'a written card text'
      const { unmount } = render(
        <GuestBookPage
          friends={[friend(0, 1)]}
          worldSeed="seed"
          onBack={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: plip }))
      expect(screen.getByText('a written card text')).toBeDefined()
      unmount()

      // Blank, the card still works — art, name and animation, no prose.
      NARRATION.friendCards.plip = ''
      render(
        <GuestBookPage
          friends={[friend(0, 1)]}
          worldSeed="seed"
          onBack={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: plip }))
      const card = screen.getByRole('dialog', { name: plip })
      expect(card.querySelector('.friend-card-text')).toBeNull()
      expect(card.querySelector('.friend-anim-plip')).not.toBeNull()
    } finally {
      NARRATION.friendCards.plip = original
    }
  })

  it('never shows the momentary arrival narration — the card is the only re-readable text', () => {
    const intro = NARRATION.friendIntros.plip
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
      fireEvent.click(screen.getByRole('button', { name: plip }))
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
    fireEvent.click(screen.getByRole('button', { name: plip }))
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: plip })).toBeDefined()
  })

  it('the back button leads home', () => {
    const onBack = vi.fn()
    render(<GuestBookPage friends={[]} worldSeed="seed" onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back to the habits/ }))
    expect(onBack).toHaveBeenCalled()
  })
})

describe('the size canon on the page', () => {
  // Kimia's rule: the ten hold their proportions everywhere and always. The
  // Guest Book is the first screen to draw the real archetypes, so this is
  // where that rule is first checked against a real page rather than against
  // the component alone.
  const widthOf = (art) => parseFloat(art.style.width)

  it('draws the cast at true relative size, list and card alike', () => {
    const { container } = render(
      <GuestBookPage
        friends={[friend(0, 1, 'c1'), friend(9, 1, 'c2')]}
        worldSeed="seed"
        onBack={() => {}}
      />,
    )
    const [plipArt, hamdiBuloArt] = container.querySelectorAll(
      '.guestbook-friend .friend-art',
    )
    const listRatio = widthOf(plipArt) / widthOf(hamdiBuloArt)
    expect(listRatio).toBeCloseTo(
      FRIEND_CANON.plip / FRIEND_CANON['hamdi-bulo'],
      5,
    )

    // The card is a bigger base, not a different scale: a plip opened on the
    // card is larger than in the list, and still the same fraction of its
    // biggest sibling.
    fireEvent.click(screen.getByRole('button', { name: plip }))
    const cardArt = screen
      .getByRole('dialog', { name: plip })
      .querySelector('.friend-art')
    expect(widthOf(cardArt)).toBeGreaterThan(widthOf(plipArt))
    expect(widthOf(cardArt) / widthOf(plipArt)).toBeCloseTo(2.25 / 1.5, 5)
  })
})
