import { describe, expect, it } from 'vitest'
import { eyeToneFor } from './eye.jsx'
import { FRIEND_COLOURS } from './friendColours.js'

// Kimia, 2026-11-16: yellow eyes get lost on a gold body, so gold friends
// (and only gold friends) wear the eye in pale blue.
describe('which eye a friend wears', () => {
  it('is blue on gold and yellow on every other colour', () => {
    const blue = FRIEND_COLOURS.filter((c) => eyeToneFor(c) === 'blue')
    expect(blue.map((c) => c.name)).toEqual(['gold'])
    expect(eyeToneFor(undefined)).toBe('yellow')
  })
})
