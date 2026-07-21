import { describe, expect, it } from 'vitest'
import { dayKeyFromTimestamp } from './days.js'
import { shouldShowStartup } from './startup.js'

const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

const CUTOFF = 3 // the default 3am day boundary

describe('shouldShowStartup — the daily startup moment (T4.5)', () => {
  it('plays on the very first visit, when it has never played before', () => {
    expect(shouldShowStartup('2026-07-21', null)).toBe(true)
  })

  it('plays when it last played on an earlier day', () => {
    expect(shouldShowStartup('2026-07-21', '2026-07-20')).toBe(true)
  })

  it('stays quiet when it already played today', () => {
    expect(shouldShowStartup('2026-07-21', '2026-07-21')).toBe(false)
  })

  it('plays again the next day', () => {
    expect(shouldShowStartup('2026-07-22', '2026-07-21')).toBe(true)
  })

  it('fires on day rollover — the 3am cutoff decides what “today” is', () => {
    // 1am Tuesday still belongs to Monday, just like 11am Monday did:
    // nothing replays between them. 4am Tuesday is a NEW Habitat day,
    // so the startup plays again.
    const monday11am = dayKeyFromTimestamp(at(2026, 7, 20, 11), CUTOFF)
    const tuesday1am = dayKeyFromTimestamp(at(2026, 7, 21, 1), CUTOFF)
    const tuesday4am = dayKeyFromTimestamp(at(2026, 7, 21, 4), CUTOFF)
    expect(tuesday1am).toBe(monday11am)
    expect(tuesday4am).not.toBe(monday11am)
    expect(shouldShowStartup(tuesday1am, monday11am)).toBe(false)
    expect(shouldShowStartup(tuesday4am, monday11am)).toBe(true)
  })
})
