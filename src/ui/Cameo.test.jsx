// The home-screen cameo visit (T4.6). The game rules — which wins fire,
// when, and which friend turns up — live in src/game/cameos.test.js;
// these tests cover the visit itself: it shows the celebrating friend,
// reads its message from Kimia's slot (blank renders nothing), and
// settles back to the calm list by itself after the linger — once per
// visit, nothing stored.

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CAMEO_LINGER_MS, FRIEND_CATEGORIES } from '../game/constants.js'
import { narrationSlot } from '../content/narration.js'
import Cameo from './Cameo.jsx'

// A record-streak win celebrated by the second Signer.
const WIN = {
  type: 'streakRecord',
  habitId: 'h1',
  friend: { category: 3, individual: 2 },
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('the cameo visit (T4.6)', () => {
  it('shows the celebrating friend, named by its category singular', () => {
    render(<Cameo win={WIN} worldSeed="seed" onExpire={() => {}} />)
    const visit = screen.getByRole('status')
    expect(visit.querySelector('svg')).not.toBeNull()
    expect(visit.textContent).toContain(FRIEND_CATEGORIES[3].singular)
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
})
