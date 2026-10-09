import { describe, expect, it } from 'vitest'
import { KEEPSAKE_COLOURS } from './keepsakeColours.js'
import { FLORA_COLOURS } from './floraColours.js'

describe('the keepsake colours', () => {
  it('are four, all distinct', () => {
    expect(KEEPSAKE_COLOURS).toHaveLength(4)
    expect(new Set(KEEPSAKE_COLOURS.map((c) => c.hex)).size).toBe(4)
  })

  it('never share a colour with the ordinary flora', () => {
    const flora = new Set(FLORA_COLOURS.map((c) => c.hex))
    for (const { hex } of KEEPSAKE_COLOURS) expect(flora.has(hex)).toBe(false)
  })
})
