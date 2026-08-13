import { describe, expect, it } from 'vitest'
import { dayKeyFromTimestamp } from './days.js'
import {
  STARTUP_CHARM,
  SUNDAY_CHARMS,
  shouldShowStartup,
  startupCharm,
} from './startup.js'

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

// The Sunday colour rule (T5.2e, design-notes §12f). 2026-08-16 is a
// Sunday; the days around it are not.
describe('startupCharm — what colour the planet glows (§12f)', () => {
  const SUNDAY = '2026-08-16'

  it('glows the shell charm every ordinary day', () => {
    for (const day of ['2026-08-13', '2026-08-14', '2026-08-15', '2026-08-17'])
      expect(startupCharm(day)).toBe(STARTUP_CHARM)
  })

  it('never glows the shell charm on a Sunday', () => {
    // Whatever the draw, Sunday is always one of the OTHER five — the
    // point of the rule is that Sunday looks different.
    for (const roll of [0, 0.2, 0.4, 0.6, 0.8, 0.999])
      expect(startupCharm(SUNDAY, () => roll)).not.toBe(STARTUP_CHARM)
  })

  it('can reach all five of the other charms on a Sunday', () => {
    const drawn = SUNDAY_CHARMS.map((_, i) =>
      startupCharm(SUNDAY, () => i / SUNDAY_CHARMS.length),
    )
    expect(drawn).toEqual(SUNDAY_CHARMS)
  })

  it('stays in range even if the draw comes back as 1', () => {
    // Math.random() never returns 1, but an injected pick could, and an
    // off-the-end index would hand the planet no colour at all.
    expect(SUNDAY_CHARMS).toContain(startupCharm(SUNDAY, () => 1))
  })

  it('ignores the draw entirely on an ordinary day', () => {
    // The randomness is Sunday's alone. On every other day the planet is
    // shell pink no matter what comes up, so nothing — a lucky roll least
    // of all — can make one morning look more special than another
    // (§12f: the moment its look answered to anything, it would be a
    // scoreboard).
    for (const roll of [0, 0.5, 0.999])
      expect(startupCharm('2026-08-13', () => roll)).toBe(STARTUP_CHARM)
  })
})
