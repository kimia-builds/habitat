// The home-screen cameo visit (T4.6). The game rules — which wins fire,
// when, and which friend turns up — live in src/game/cameos.test.js;
// these tests cover the visit itself: it shows the celebrating friend,
// reads its message from Kimia's slot (blank renders nothing), and
// settles back to the calm list by itself after the linger — once per
// visit, nothing stored.

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CAMEO_LINGER_MS } from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import {
  blankAllNames,
  restoreNames,
  setSpeciesName,
} from '../test/nameFixture.js'
import Cameo from './Cameo.jsx'

// A fixture name, never Kimia's real one (src/test/nameFixture.js).
const SIGNER = 'test species name'

// A record-streak win celebrated by the second Signer.
const WIN = {
  type: 'streakRecord',
  habitId: 'h1',
  friend: { category: 3, individual: 2 },
}

beforeEach(() => {
  vi.useFakeTimers()
  // Wipe first — an individual name outranks a species name, and this
  // win is celebrated by signer 2, who now has one (2026-08-11).
  blankAllNames()
  setSpeciesName('signer', SIGNER)
})

afterEach(() => {
  cleanup()
  restoreNames()
  vi.useRealTimers()
})

describe('the cameo visit (T4.6)', () => {
  it('shows the celebrating friend, sitting in a blob', () => {
    render(<Cameo win={WIN} worldSeed="seed" onExpire={() => {}} />)
    const visit = screen.getByRole('status')
    expect(visit.querySelector('.cameo-glyph')).not.toBeNull()
    // The blob is the drop shelf's own shape language, shared through
    // blob.jsx (Kimia's call 2026-08-16) rather than redrawn here.
    expect(visit.querySelector('.cameo-blob path')).not.toBeNull()
  })

  it('never names the friend', () => {
    // Kimia's call 2026-08-16: the friend and the caption, nothing else.
    // A visit is a moment, not a record card — the Guest Book is where
    // names live. Named here even when a name EXISTS, which is the only
    // way this test can fail if the name line ever comes back.
    render(<Cameo win={WIN} worldSeed="seed" onExpire={() => {}} />)
    const visit = screen.getByRole('status')
    expect(visit.querySelector('.cameo-name')).toBeNull()
    expect(visit.textContent).not.toContain(SIGNER)
  })

  it("reads its message from Kimia's slot — blank renders nothing", () => {
    render(<Cameo win={WIN} worldSeed="seed" onExpire={() => {}} />)
    const message = document.querySelector('.cameo-message')
    // Whatever the slot holds is exactly what shows; a blank slot is no
    // element at all (the T3.4 rule). Never assert her words themselves.
    const slot = narrationSlot(`cameos.${WIN.type}`)
    if (slot === null) expect(message).toBeNull()
    else expect(message.textContent).toBe(slot)
  })

  it('settles back by itself after the linger', () => {
    const onExpire = vi.fn()
    render(<Cameo win={WIN} worldSeed="seed" onExpire={onExpire} />)
    expect(onExpire).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(CAMEO_LINGER_MS)
    })
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  // The firework (T5.2e, Kimia's call 2026-08-16). It left the reveals
  // for this moment, and only the two RAREST wins get it — a big day can
  // happen again next week, and a celebration you can see any time is
  // wallpaper (design-notes §8's scarcity rule). These tests are the
  // whole of that decision.
  describe('the firework (§5)', () => {
    const withType = (type) => ({ ...WIN, type })

    it('bursts for a record streak', () => {
      render(
        <Cameo
          win={withType('streakRecord')}
          worldSeed="seed"
          onExpire={() => {}}
        />,
      )
      expect(document.querySelectorAll('.firework')).toHaveLength(1)
    })

    it('bursts for a lived-day milestone', () => {
      render(
        <Cameo
          win={withType('livedDays')}
          worldSeed="seed"
          onExpire={() => {}}
        />,
      )
      expect(document.querySelectorAll('.firework')).toHaveLength(1)
    })

    it('leaves a big day to its quiet visit', () => {
      render(
        <Cameo win={withType('bigDay')} worldSeed="seed" onExpire={() => {}} />,
      )
      expect(document.querySelectorAll('.firework')).toHaveLength(0)
      // The visit itself is untouched — the friend still came.
      expect(screen.getByRole('status').querySelector('svg')).not.toBeNull()
    })

    it('carries no words, so a reader hears the message and nothing else', () => {
      render(
        <Cameo
          win={withType('livedDays')}
          worldSeed="seed"
          onExpire={() => {}}
        />,
      )
      const burst = document.querySelector('.firework')
      expect(burst.getAttribute('aria-hidden')).toBe('true')
      expect(burst.textContent).toBe('')
    })
  })
})
