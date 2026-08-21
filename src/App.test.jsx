// UI tests for the T1.3 habit list screen. The game rules themselves
// are tested in src/game/*.test.js — these tests check that the screen
// drives them correctly: what a tap stores, what survives a reload,
// and that destructive paths (delete, import) ask first.

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import {
  ARCHIVE_FAREWELL_MS,
  CAMEO_LINGER_MS,
  CHECKIN_MOVE_HOLD_MS,
  CHECKIN_ROWS_BEFORE_MORE,
  DROP_SETTLE_MS,
  FRIEND_CATEGORIES,
  MAP_REGION_COUNT,
  METER_MOVE_MS,
  STARTUP_FADE_MS,
  STARTUP_HOLD_MS,
  SYMBOL_COUNT,
} from './game/constants.js'
import { floraTargetStep, rollFungi, rollReading } from './game/drops.js'
import { backupAgeLabel } from './game/backup.js'
import { addDays, dayKeyFromTimestamp } from './game/days.js'
import { loadData, loadDefaultView, SCHEMA_VERSION } from './storage/storage.js'
import { LANGUAGES } from './content/ui.js'
import { narrationSlot } from './content/narration.js'
import {
  blankAllNames,
  restoreNames,
  setSpeciesName,
} from './test/nameFixture.js'
import { restoreNarration, setNarrationSlot } from './test/narrationFixture.js'

// The Habitat day these tests are running in, on the default 3am
// cutoff — so backup-age expectations never go stale.
const todayKey = () => dayKeyFromTimestamp(Date.now(), 3)

// The daily startup is two phases now (T5.2e): the planet HOLDS the
// screen, then FADES away. Tests that only want it out of the way call
// this. It must advance the two SEPARATELY — the fade's timer does not
// exist until React has committed the state change the hold's timer
// made, so one combined advance leaves the fade still to run and the
// ceremony still on screen.
function settleStartup() {
  act(() => {
    vi.advanceTimersByTime(STARTUP_HOLD_MS)
  })
  act(() => {
    vi.advanceTimersByTime(STARTUP_FADE_MS)
  })
}

// The reveal dialogs are named by Kimia's words in narration.js —
// never hard-code them here, or editing her file breaks the tests
// (it did, 2026-07-19). Mirror FirstReveal's fallback for blank slots.
const revealTitle = (kind) =>
  narrationSlot(`firstReveals.${kind}.title`) ?? 'a first arrival'

beforeEach(() => {
  localStorage.clear()
  // Pin every test to a fixed mid-week moment (Thursday 16 July 2026,
  // 9am) so results never depend on the real day the suite runs.
  // Discovered the hard way on Sunday 2026-07-19: unpinned tests hit
  // the field-notes Sunday auto-open (T2.3) and failed — only on
  // Sundays. shouldAdvanceTime keeps ordinary timers ticking (the
  // async import tests poll on one); the date still stays Thursday.
  // Tests that need another date or manual timers set their own.
  vi.useFakeTimers({ shouldAdvanceTime: true })
  vi.setSystemTime(new Date(2026, 6, 16, 9))
})

afterEach(() => {
  cleanup() // unmount this test's App (no vitest globals = no auto-cleanup)
  restoreNarration()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// The form's fields, found by their stable `name` attribute rather than
// their visible prompt (2026-08-11). The prompts are Kimia's copy and she
// rewrites them — "name" became "write a good habit or task:" the day this
// helper was written — so a test that hunts for the words breaks on every
// copy pass. The attribute is the handle; the words are hers.
const field = (which) =>
  document.querySelector(`form.habit-form [name="${which}"]`)

// Drive the real form the way a user would. Options beyond a name are
// optional; the form's defaults (symbol 1, medium, daily) fill the rest.
function createHabitViaUI(name, { symbol, scheduleType, n, days } = {}) {
  fireEvent.click(screen.getByRole('button', { name: 'add new habit' }))
  const form = within(document.querySelector('form.habit-form'))
  fireEvent.change(field('name'), { target: { value: name } })
  if (symbol) {
    // The tags are the six charms (T5.1); each button's accessible name
    // is the charm's shape name (design-notes §11a). Still wordless on
    // screen — this name is screen-reader/test only.
    const charms = {
      1: 'crown',
      2: 'cherry',
      3: 'shell',
      4: 'anchor',
      5: 'shield',
      6: 'key',
    }
    fireEvent.click(form.getByRole('button', { name: charms[symbol] }))
  }
  if (scheduleType) {
    fireEvent.change(field('schedule'), {
      target: { value: scheduleType },
    })
  }
  if (n) {
    fireEvent.change(field('n'), {
      target: { value: String(n) },
    })
  }
  for (const day of days ?? []) {
    fireEvent.click(form.getByLabelText(day))
  }
  fireEvent.click(form.getByRole('button', { name: 'save' }))
}

// An archived tile stays on screen for its farewell — it sinks and fades
// before the list closes up (2026-08-11). It is already archived in the
// data by then, but it is still DRAWN, so a test that looks at the list
// straight after archiving sees both copies. Waiting the farewell out is
// how a test says "after the tile has gone".
const settleFarewell = () =>
  act(() => vi.advanceTimersByTime(ARCHIVE_FAREWELL_MS))

// The <li> row a habit is displayed in, found by its name.
function row(name) {
  return within(screen.getByText(name).closest('li'))
}

// The row's element itself — what a drag grabs now that the grip is gone
// (2026-08-11): pressing the tile anywhere but on a control starts one.
function tile(name) {
  return screen.getByText(name).closest('li')
}

// jsdom has no layout, so a drag test has to hand the rows their boxes:
// a stack of 40px-tall rows at y 0 / 50 / 100 / …. The dragged row's box
// FOLLOWS the drag, because the real one does — since 2026-08-11 the
// landing slot is read off the tile's own drawn position rather than the
// pointer's, so a test that parked the dragged row would be describing a
// tile that never moved. `drag.offset` is the live handle: set it before
// firing the pointer event that should see the tile there.
function layOutRows(draggedName = null, drag = { offset: 0 }) {
  const draggedId = draggedName
    ? tile(draggedName).getAttribute('data-habit-id')
    : null
  const rows = [...document.querySelectorAll('[data-habit-id]')]
  rows.forEach((el, i) => {
    el.getBoundingClientRect = () => {
      const moved = el.getAttribute('data-habit-id') === draggedId
      const top = i * 50 + (moved ? drag.offset : 0)
      return {
        top,
        bottom: top + 40,
        height: 40,
        left: 0,
        right: 100,
        width: 100,
        x: 0,
        y: top,
        toJSON: () => {},
      }
    }
  })
  return drag
}

describe('creating habits', () => {
  it('a created habit appears and survives a full reload', () => {
    const first = render(<App />)
    createHabitViaUI('drink water')
    expect(screen.getByText('drink water')).toBeDefined()

    // "Reload": tear the app down and mount a fresh one — anything it
    // shows now must have come from storage.
    first.unmount()
    render(<App />)
    expect(screen.getByText('drink water')).toBeDefined()
  })

  it('shows the rules’ complaint instead of saving a nameless habit', () => {
    render(<App />)
    createHabitViaUI('')
    expect(screen.getByRole('alert').textContent).toMatch(/needs a name/)
  })

  it('a weekdays habit shows its chosen days', () => {
    render(<App />)
    createHabitViaUI('gym', { scheduleType: 'weekdays', days: ['Mon', 'Wed'] })
    expect(screen.getByText('Mon/Wed · medium')).toBeDefined()
  })
})

describe('completing today (and undoing)', () => {
  it('a daily habit counts up from 0/1, and -1 takes a mark back', () => {
    render(<App />)
    createHabitViaUI('meditate')

    // The counter (T3.2b): no toggle — a running count with +1 and -1.
    expect(row('meditate').getByText('0/1')).toBeDefined()
    expect(row('meditate').getByRole('button', { name: '-1' }).disabled).toBe(
      true,
    )

    fireEvent.click(row('meditate').getByRole('button', { name: '+1' }))
    expect(row('meditate').getByText('✓ 1/1')).toBeDefined()

    fireEvent.click(row('meditate').getByRole('button', { name: '-1' }))
    expect(row('meditate').getByText('0/1')).toBeDefined()
  })

  it('an N-per-day habit counts up and undoes one at a time', () => {
    render(<App />)
    createHabitViaUI('water', { scheduleType: 'nPerDay', n: 3 })

    expect(row('water').getByText('0/3')).toBeDefined()
    fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    expect(row('water').getByText('2/3')).toBeDefined()
    fireEvent.click(row('water').getByRole('button', { name: '-1' }))
    expect(row('water').getByText('1/3')).toBeDefined()
  })
})

describe('every repeating shape is an unlimited counter (T3.2b)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  it('a daily habit counts past its goal; every tap is stored on today', () => {
    render(<App />)
    createHabitViaUI('stretch')

    for (let i = 0; i < 3; i++) {
      fireEvent.click(row('stretch').getByRole('button', { name: '+1' }))
    }
    // Past the goal the day just STAYS fulfilled — extras are shown,
    // recorded and kept, never refused.
    expect(row('stretch').getByText('✓ 3/1')).toBeDefined()

    // All three marks belong to today (Thu 16 July, the pinned clock),
    // and every tap advanced the steps-taken meter.
    expect(stored().completions.map((c) => c.dayKey)).toEqual([
      '2026-07-16',
      '2026-07-16',
      '2026-07-16',
    ])
    const meters = within(screen.getByRole('region', { name: 'meters' }))
    expect(
      meters
        .getByRole('progressbar', { name: 'steps taken progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('3')

    // Undoing one extra keeps the day fulfilled — thresholds unchanged.
    fireEvent.click(row('stretch').getByRole('button', { name: '-1' }))
    expect(row('stretch').getByText('✓ 2/1')).toBeDefined()
  })

  it('whenever and N-per-week show a plain count — no per-day goal', () => {
    render(<App />)
    createHabitViaUI('tidy', { scheduleType: 'whenever' })
    createHabitViaUI('swim', { scheduleType: 'nPerWeek', n: 3 })

    expect(row('tidy').getByText('0')).toBeDefined()
    expect(row('swim').getByText('0')).toBeDefined()

    fireEvent.click(row('tidy').getByRole('button', { name: '+1' }))
    fireEvent.click(row('swim').getByRole('button', { name: '+1' }))
    fireEvent.click(row('swim').getByRole('button', { name: '+1' }))

    expect(row('tidy').getByText('1')).toBeDefined()
    expect(row('swim').getByText('2')).toBeDefined()

    // Every one of those taps counted toward the steps-taken meter.
    const meters = within(screen.getByRole('region', { name: 'meters' }))
    expect(
      meters
        .getByRole('progressbar', { name: 'steps taken progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('3')
  })

  it('a weekdays habit gets the same counter on its scheduled day', () => {
    // The pinned clock is Thursday, so schedule Thursdays.
    render(<App />)
    createHabitViaUI('gym', { scheduleType: 'weekdays', days: ['Thu'] })
    expect(row('gym').getByText('0/1')).toBeDefined()
    fireEvent.click(row('gym').getByRole('button', { name: '+1' }))
    fireEvent.click(row('gym').getByRole('button', { name: '+1' }))
    expect(row('gym').getByText('✓ 2/1')).toBeDefined()
  })

  it('a one-time to-do keeps its single-tap control — no counter', () => {
    render(<App />)
    createHabitViaUI('fix tap', { scheduleType: 'oneTime' })
    expect(row('fix tap').getByRole('checkbox', { name: 'mark done' }))
    expect(row('fix tap').queryByRole('button', { name: '+1' })).toBeNull()
    // No running count, no per-day goal — nothing numbered at all.
    expect(row('fix tap').queryByText(/\d+\/\d+/)).toBeNull()
  })
})

describe('the symbol filter (a temporary lens)', () => {
  it('shows only chosen symbols and pauses re-ordering', () => {
    render(<App />)
    createHabitViaUI('read', { symbol: 2 })
    createHabitViaUI('stretch', { symbol: 5 })

    const filter = within(screen.getByRole('region', { name: 'filter view' }))
    fireEvent.click(filter.getByRole('button', { name: 'cherry' })) // symbol 2
    expect(screen.getByText('read')).toBeDefined()
    expect(screen.queryByText('stretch')).toBeNull()
    // While filtered, re-ordering is off (partial view = ambiguous) and
    // the tile's own hover explains how to switch it back on. (The grip
    // that used to carry this was retired 2026-08-11 — the whole tile is
    // the handle, so the whole tile answers for it.) The words moved into
    // Kimia's ui.js in T6.23b, so this asks THAT there is a hover, never
    // what it says.
    const filteredTile = document.querySelector('.habit-row')
    expect(filteredTile.title).toBeTruthy()
    expect(filteredTile.className).toContain('habit-row--fixed')

    fireEvent.click(filter.getByRole('button', { name: 'cherry' })) // toggle off
    expect(screen.getByText('stretch')).toBeDefined()
  })

  // Kimia's call 2026-08-11: filtering to ONE charm and then adding a
  // habit almost always means "another one of these", so the draft opens
  // already wearing it. Two charms filtered is no longer a hint, so the
  // draft falls back to the form's own default (charm 1).
  it('a new draft opens on the filtered charm when exactly one is on', () => {
    render(<App />)
    const filter = () =>
      within(screen.getByRole('region', { name: 'filter view' }))
    // Exactly one charm is pressed in the draft; report which by the
    // accessible name of the charm drawn on it.
    const draftCharm = () =>
      within(document.querySelector('form.habit-form'))
        .getAllByRole('button', { pressed: true })
        .map((button) => button.querySelector('svg').getAttribute('aria-label'))

    fireEvent.click(filter().getByRole('button', { name: 'shield' })) // 5
    fireEvent.click(screen.getByRole('button', { name: 'add new habit' }))
    expect(draftCharm()).toEqual(['shield'])
    fireEvent.click(
      within(document.querySelector('form.habit-form')).getByRole('button', {
        name: 'cancel',
      }),
    )

    fireEvent.click(filter().getByRole('button', { name: 'key' })) // now two
    fireEvent.click(screen.getByRole('button', { name: 'add new habit' }))
    expect(draftCharm()).toEqual(['crown'])
  })

  // Kimia's call 2026-08-11: the lens is for the whole screen, not just
  // the live list — the archive drawer holds only what the chosen charms
  // wear too.
  it('narrows the archive drawer as well as the list', () => {
    render(<App />)
    createHabitViaUI('read', { symbol: 2 })
    createHabitViaUI('stretch', { symbol: 5 })
    fireEvent.click(row('stretch').getByRole('button', { name: 'archive' }))
    settleFarewell()

    const drawer = () => screen.queryByText(/^archived/)
    expect(drawer()).not.toBeNull() // 'stretch' is in there

    const filter = within(screen.getByRole('region', { name: 'filter view' }))
    fireEvent.click(filter.getByRole('button', { name: 'cherry' })) // symbol 2
    expect(drawer()).toBeNull() // nothing archived wears the cherry

    fireEvent.click(filter.getByRole('button', { name: 'shield' })) // add 5
    expect(
      within(drawer().closest('details')).getByText('stretch'),
    ).toBeDefined()
  })

  // …and it travels to the field notes, where it narrows the week grid
  // (and, further down that page, the graphs), and can still be changed
  // from the same row of charms.
  it('travels to the field notes and narrows what they show', () => {
    render(<App />)
    createHabitViaUI('read', { symbol: 2 })
    createHabitViaUI('stretch', { symbol: 5 })

    const homeFilter = within(
      screen.getByRole('region', { name: 'filter view' }),
    )
    fireEvent.click(homeFilter.getByRole('button', { name: 'cherry' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data' }),
    )

    // The lens came with us: only the cherry habit has a row.
    expect(screen.getByRole('rowheader', { name: /read/ })).toBeDefined()
    expect(screen.queryByRole('rowheader', { name: /stretch/ })).toBeNull()

    // And it is still adjustable here — clearing it brings the other back.
    const notesFilter = within(
      screen.getByRole('region', { name: 'filter view' }),
    )
    fireEvent.click(notesFilter.getByRole('button', { name: 'cherry' }))
    expect(screen.getByRole('rowheader', { name: /stretch/ })).toBeDefined()
  })
})

describe('re-ordering', () => {
  // Dragging moves the tile and writes NOTHING (T6.23e, 2026-08-21).
  // "temporary reorders feel fun to do… they should feel throwaway and
  // flexible, without fear of commitment" (Kimia, 2026-08-20), so a
  // reload lands back on the saved default view — here the order the
  // habits were created in, which is what a new player's default is.
  it('dragging a row lands it in a new slot, and a reload forgets it', () => {
    const first = render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')

    // Rows at 0 / 50 / 100; 'one' is the one being dragged, so its box
    // travels with the drag.
    const drag = layOutRows('one')

    // Grab 'one' and pull it down 100px, which leaves the tile lying over
    // 'three' (its middle at 120, inside three's 100–140 box). It lands
    // last.
    fireEvent.pointerDown(tile('one'), { button: 0, clientX: 0, clientY: 5 })
    drag.offset = 100
    fireEvent.pointerMove(window, { clientX: 0, clientY: 105 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 105 })

    const names = () =>
      [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
    expect(names()).toEqual(['two', 'three', 'one'])

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['one', 'two', 'three'])
  })

  it('dragging a row UP lands it higher — over the row, not under the hand', () => {
    const first = render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')

    // Rows at 0 / 50 / 100, 'three' being dragged upward by 105px — which
    // leaves its tile lying over 'one' (middle at 15, inside one's 0–40
    // box). An upward drag used to keep "landing" back on the row it
    // started from and so never moved at all.
    const drag = layOutRows('three')

    fireEvent.pointerDown(tile('three'), {
      button: 0,
      clientX: 0,
      clientY: 110,
    })
    drag.offset = -105
    fireEvent.pointerMove(window, { clientX: 0, clientY: 5 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 5 })

    const names = () =>
      [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
    expect(names()).toEqual(['three', 'one', 'two'])

    // Temporary, like every other drag (T6.23e).
    first.unmount()
    render(<App />)
    expect(names()).toEqual(['one', 'two', 'three'])
  })

  it('the whole tile is the grab area — dragging the name re-orders', () => {
    render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')

    // Same geometry as above: rows at 0 / 50 / 100, 'one' dragged.
    const drag = layOutRows('one')

    // Grab 'one' by its NAME — not the tile's empty space — and pull it
    // down over 'three'.
    fireEvent.pointerDown(row('one').getByText('one'), {
      button: 0,
      clientX: 0,
      clientY: 5,
    })
    drag.offset = 100
    fireEvent.pointerMove(window, { clientX: 0, clientY: 105 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 105 })

    const names = [...document.querySelectorAll('.habit-name')].map(
      (el) => el.textContent,
    )
    expect(names).toEqual(['two', 'three', 'one'])
  })

  it('a press on a row control is a tap, never a drag', () => {
    render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')

    layOutRows()

    // A press on +1 that drifts down the list must count the habit and
    // leave the order alone — otherwise every tap risks moving a row.
    const plus = row('one').getByRole('button', { name: '+1' })
    fireEvent.pointerDown(plus, { button: 0, clientX: 0, clientY: 5 })
    fireEvent.pointerMove(window, { clientX: 0, clientY: 105 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 105 })
    fireEvent.click(plus)

    const names = [...document.querySelectorAll('.habit-name')].map(
      (el) => el.textContent,
    )
    expect(names).toEqual(['one', 'two'])
    expect(row('one').getByText(/1\/1/)).toBeDefined()
  })

  // The other half of "the drop follows the tile" (2026-08-11): a tile
  // that never leaves its own slot stays where it is. Under the old
  // pointer rule a nudge of a few pixels sent the middle row to the top
  // of the list, because the rule only ever asked which OTHER row the
  // pointer had passed — the row's own seat was not in the running.
  it('a small nudge inside its own slot moves nothing', () => {
    render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')
    const drag = layOutRows('two')

    fireEvent.pointerDown(tile('two'), { button: 0, clientX: 0, clientY: 70 })
    drag.offset = 8
    fireEvent.pointerMove(window, { clientX: 0, clientY: 78 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 78 })

    const names = [...document.querySelectorAll('.habit-name')].map(
      (el) => el.textContent,
    )
    expect(names).toEqual(['one', 'two', 'three'])
  })

  // Kimia's call 2026-08-11: a drop used to be over the instant it
  // happened. The dropped tile now stays lifted and lit where it landed
  // — long enough to see where that was — and only then eases back.
  it('a dropped tile stays lit where it landed, then settles back', () => {
    render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')
    const drag = layOutRows('one')

    fireEvent.pointerDown(tile('one'), { button: 0, clientX: 0, clientY: 5 })
    drag.offset = 100
    fireEvent.pointerMove(window, { clientX: 0, clientY: 105 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 105 })

    // Landed last, and still wearing the lifted look it had in hand.
    expect(tile('one').className).toContain('habit-row--settling')
    expect(tile('one').className).not.toContain('habit-row--dragging')

    // Still lit a moment later; back to its resting self after the hold.
    act(() => vi.advanceTimersByTime(DROP_SETTLE_MS - 50))
    expect(tile('one').className).toContain('habit-row--settling')
    act(() => vi.advanceTimersByTime(100))
    expect(tile('one').className).not.toContain('habit-row--settling')
  })

  it('a press that never travels is not a drag — the order is untouched', () => {
    render(<App />)
    createHabitViaUI('alpha')
    createHabitViaUI('beta')

    fireEvent.pointerDown(tile('alpha'), { button: 0, clientX: 0, clientY: 5 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 6 })

    const names = [...document.querySelectorAll('.habit-name')].map(
      (el) => el.textContent,
    )
    expect(names).toEqual(['alpha', 'beta'])
  })
})

// The `today` lens, and the un-hide that escapes it (T6.23b, spec §5b).
//
// The tests are pinned to Thursday 16 July 2026 (see beforeEach), so a
// Thursday habit applies today and a Monday one does not. The lens words
// come from Kimia's src/content/ui.js, so nothing here quotes them — the
// controls are found by the data-lens name the code gives them.
describe('the today lens (T6.23b)', () => {
  const names = () =>
    [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
  const lens = (name) => document.querySelector(`[data-lens="${name}"]`)
  const isMuted = (name) => tile(name).className.includes('habit-row--muted')
  const eye = (name) =>
    tile(name).querySelector('.row-buttons button:first-child')

  // One of each tier: a daily that applies today, a Thursday one that
  // also does, a whenever that only COULD, and a Monday one that cannot.
  function oneOfEachTier() {
    createHabitViaUI('daily')
    createHabitViaUI('thursdays', { scheduleType: 'weekdays', days: ['Thu'] })
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    createHabitViaUI('mondays', { scheduleType: 'weekdays', days: ['Mon'] })
  }

  it('keeps today, dims what could be today, and hides the rest', () => {
    render(<App />)
    oneOfEachTier()

    fireEvent.click(lens('today'))

    expect(names()).toEqual(['daily', 'thursdays', 'sometime'])
    expect(isMuted('sometime')).toBe(true)
    expect(isMuted('daily')).toBe(false)
  })

  it('brings a habit that applies today back to full brightness', () => {
    // Kimia's call 2026-08-21: today is the day's list, so nothing that
    // belongs to today is left dim.
    render(<App />)
    oneOfEachTier()
    fireEvent.click(eye('daily'))
    expect(isMuted('daily')).toBe(true)

    fireEvent.click(lens('today'))
    expect(isMuted('daily')).toBe(false)
  })

  it('a hidden habit stops the list re-ordering, and says so on the tile', () => {
    // design-notes §12a: a tile dropped into a list with gaps would make
    // Habitat guess where it belongs in the full order.
    render(<App />)
    oneOfEachTier()
    expect(tile('daily').className).not.toContain('habit-row--fixed')

    fireEvent.click(lens('today'))

    expect(tile('daily').className).toContain('habit-row--fixed')
    expect(tile('daily').getAttribute('title')).toBeTruthy()
  })

  it('un-hide all brings them back and unlocks the order', () => {
    render(<App />)
    oneOfEachTier()
    fireEvent.click(lens('today'))

    fireEvent.click(lens('unhide-all'))

    expect(names()).toEqual(['daily', 'thursdays', 'mondays', 'sometime'])
    expect(tile('daily').className).not.toContain('habit-row--fixed')
  })

  it('un-hide all leaves the mutings alone', () => {
    // A muted tile is visible, so it never stopped the order being
    // knowable — there is nothing for the un-hide to undo about it.
    render(<App />)
    oneOfEachTier()
    fireEvent.click(lens('today'))

    fireEvent.click(lens('unhide-all'))

    expect(isMuted('sometime')).toBe(true)
  })

  it('un-hide all shows only when it has work to do', () => {
    render(<App />)
    oneOfEachTier()
    expect(lens('unhide-all')).toBeNull()

    fireEvent.click(lens('today'))
    expect(lens('unhide-all')).not.toBeNull()

    fireEvent.click(lens('unhide-all'))
    expect(lens('unhide-all')).toBeNull()
  })

  it('appears for a charm filter too, and clears it', () => {
    // The charms hide as surely as a lens does, so they lock the order
    // the same way and the same press is the way out (Kimia 2026-08-20).
    render(<App />)
    createHabitViaUI('crowned', { symbol: 1 })
    createHabitViaUI('cherried', { symbol: 2 })

    fireEvent.click(screen.getAllByRole('button', { name: 'crown' })[0])
    expect(names()).toEqual(['crowned'])
    expect(lens('unhide-all')).not.toBeNull()

    fireEvent.click(lens('unhide-all'))
    expect(names()).toEqual(['crowned', 'cherried'])
  })

  it('is never written down — a reload brings the whole list back', () => {
    // Nothing about an arrangement is saved until T6.23e.
    const first = render(<App />)
    oneOfEachTier()
    fireEvent.click(lens('today'))
    expect(names()).toEqual(['daily', 'thursdays', 'sometime'])

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['daily', 'thursdays', 'sometime', 'mondays'])
    expect(isMuted('sometime')).toBe(false)
  })
})

// The `to-dos` lens and its four-press cycle (T6.23d, spec §5b). The
// cycle's POSITION lives in App rather than in the pure function, so
// these are the tests for it: that four presses walk the same control
// through four different screens, and that `un-hide all` sends it back
// to the start. The word itself is Kimia's, so the control is found by
// its data-lens name.
describe('the to-dos lens (T6.23d)', () => {
  const names = () =>
    [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
  const lens = (name) => document.querySelector(`[data-lens="${name}"]`)
  const isMuted = (name) => tile(name).className.includes('habit-row--muted')

  // To-dos scattered through the list, which is how they end up sitting
  // once a few have been added over a few days.
  function scatteredTodos() {
    createHabitViaUI('daily')
    createHabitViaUI('fix tap', { scheduleType: 'oneTime' })
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    createHabitViaUI('call the bank', { scheduleType: 'oneTime' })
  }

  it('walks the to-dos through top, bottom-and-dim, hidden, then back', () => {
    render(<App />)
    scatteredTodos()

    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['fix tap', 'call the bank', 'daily', 'sometime'])
    expect(isMuted('fix tap')).toBe(false)

    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['daily', 'sometime', 'fix tap', 'call the bank'])
    expect(isMuted('fix tap')).toBe(true)
    expect(isMuted('daily')).toBe(false)

    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['daily', 'sometime'])

    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['daily', 'sometime', 'fix tap', 'call the bank'])
    expect(isMuted('fix tap')).toBe(false)
    expect(isMuted('call the bank')).toBe(false)
  })

  it('the last press restores no earlier position', () => {
    // Kimia's rule 2026-08-20: "off" un-hides and un-dims WHERE THEY
    // STAND. The to-dos began scattered between the other habits; a full
    // cycle later they are gathered at the bottom and stay there.
    render(<App />)
    scatteredTodos()
    expect(names()).toEqual(['daily', 'fix tap', 'sometime', 'call the bank'])

    for (let press = 0; press < 4; press++) fireEvent.click(lens('todos'))

    expect(names()).toEqual(['daily', 'sometime', 'fix tap', 'call the bank'])
  })

  it('the hidden press locks the order and brings out un-hide all', () => {
    render(<App />)
    scatteredTodos()
    expect(lens('unhide-all')).toBeNull()

    fireEvent.click(lens('todos'))
    fireEvent.click(lens('todos'))
    fireEvent.click(lens('todos'))

    expect(lens('unhide-all')).not.toBeNull()
  })

  it('un-hide all sends the cycle back to its start', () => {
    // Kimia's call 2026-08-21. Un-hiding is what the third press did, so
    // a control left standing there would spend its next press on "off",
    // which un-hides — a press that appears to do nothing at all.
    render(<App />)
    scatteredTodos()
    fireEvent.click(lens('todos'))
    fireEvent.click(lens('todos'))
    fireEvent.click(lens('todos'))

    fireEvent.click(lens('unhide-all'))
    expect(names()).toEqual(['daily', 'sometime', 'fix tap', 'call the bank'])

    // Back at the start of the cycle: the next press gathers them at the
    // top, rather than quietly spending itself on "off".
    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['fix tap', 'call the bank', 'daily', 'sometime'])
  })

  it('the word is there even with no to-dos, and pressing it changes nothing', () => {
    // Kimia's call 2026-08-21: permanent furniture, unlike `un-hide all`.
    render(<App />)
    createHabitViaUI('daily')
    createHabitViaUI('sometime', { scheduleType: 'whenever' })

    expect(lens('todos')).not.toBeNull()
    fireEvent.click(lens('todos'))
    expect(names()).toEqual(['daily', 'sometime'])
  })
})

// The `prioritise` lens (T6.23c, spec §5b). Pinned to Thursday 16 July
// 2026 like the rest (see beforeEach), so a Thursday habit is owed today
// and a Monday one is not. The word itself is Kimia's, so the control is
// found by its data-lens name rather than quoted.
describe('the prioritise lens (T6.23c)', () => {
  const names = () =>
    [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
  const lens = (name) => document.querySelector(`[data-lens="${name}"]`)
  const isMuted = (name) => tile(name).className.includes('habit-row--muted')
  const eye = (name) =>
    tile(name).querySelector('.row-buttons button:first-child')

  it('sorts into owed today, owed this week, then everything else', () => {
    render(<App />)
    // Created deliberately out of order, so only the sort could produce
    // the arrangement below.
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    createHabitViaUI('thrice', { scheduleType: 'nPerWeek', n: 3 })
    createHabitViaUI('daily')
    createHabitViaUI('mondays', { scheduleType: 'weekdays', days: ['Mon'] })
    createHabitViaUI('thursdays', { scheduleType: 'weekdays', days: ['Thu'] })

    fireEvent.click(lens('prioritise'))

    expect(names()).toEqual([
      'daily',
      'thursdays',
      'thrice',
      'sometime',
      'mondays',
    ])
  })

  it('two habits of the same tier keep the order they were put in', () => {
    // The point of a STABLE sort, and the thing Kimia asked for by name:
    // a daily and a daily are the same priority, so an arrangement made
    // by hand survives the press. 'second' is dragged above 'first'
    // here, and prioritise must have no opinion about the pair.
    render(<App />)
    createHabitViaUI('first')
    createHabitViaUI('second')
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    const drag = layOutRows('second')
    fireEvent.pointerDown(tile('second'), {
      button: 0,
      clientX: 0,
      clientY: 55,
    })
    drag.offset = -50
    fireEvent.pointerMove(window, { clientX: 0, clientY: 5 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 5 })
    expect(names()).toEqual(['second', 'first', 'sometime'])

    fireEvent.click(lens('prioritise'))

    expect(names()).toEqual(['second', 'first', 'sometime'])
  })

  it('a habit finished today sinks to the bottom tier', () => {
    // Kimia's call 2026-08-21: nothing left to do for its period.
    render(<App />)
    createHabitViaUI('done')
    createHabitViaUI('owed')
    fireEvent.click(row('done').getByRole('button', { name: '+1' }))

    fireEvent.click(lens('prioritise'))

    expect(names()).toEqual(['owed', 'done'])
  })

  it('a habit ticked AFTER the press does not slide away under your hand', () => {
    // Kimia's rule 2026-08-21: prioritise sorts by what it knows at the
    // moment it is pressed, and nothing re-sorts until it is pressed
    // again.
    render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    fireEvent.click(lens('prioritise'))

    fireEvent.click(row('one').getByRole('button', { name: '+1' }))
    expect(names()).toEqual(['one', 'two'])

    fireEvent.click(lens('prioritise'))
    expect(names()).toEqual(['two', 'one'])
  })

  it('leaves the dimmings exactly as it found them', () => {
    // "prioritise is an ordering tool: keep any (un)muted tasks the way
    // that they are" (Kimia 2026-08-21) — so a dim tile is sorted like
    // any other and stays dim, and a bright one stays bright.
    render(<App />)
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    createHabitViaUI('daily')
    fireEvent.click(eye('daily'))
    expect(isMuted('daily')).toBe(true)

    fireEvent.click(lens('prioritise'))

    expect(names()).toEqual(['daily', 'sometime'])
    expect(isMuted('daily')).toBe(true)
    expect(isMuted('sometime')).toBe(false)
  })

  it('is never written down — a reload brings the stored order back', () => {
    // Nothing about an arrangement is saved until T6.23e.
    const first = render(<App />)
    createHabitViaUI('sometime', { scheduleType: 'whenever' })
    createHabitViaUI('daily')
    fireEvent.click(lens('prioritise'))
    expect(names()).toEqual(['daily', 'sometime'])

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['sometime', 'daily'])
  })
})

describe('muting — the eye on every tile (T6.23a)', () => {
  // What the list looks like right now, top to bottom.
  const names = () =>
    [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)

  // The eye leads the three icons on a tile (Kimia's call 2026-08-20).
  // Found by position rather than by its label: the label is Kimia's
  // word in src/content/ui.js and she may rewrite it any day.
  const eye = (name) =>
    tile(name).querySelector('.row-buttons button:first-child')

  const isMuted = (name) => tile(name).className.includes('habit-row--muted')

  function threeHabits() {
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')
  }

  it('closing an eye dims the tile and sinks it to the bottom', () => {
    render(<App />)
    threeHabits()

    fireEvent.click(eye('one'))

    expect(names()).toEqual(['two', 'three', 'one'])
    expect(isMuted('one')).toBe(true)
    expect(isMuted('two')).toBe(false)
  })

  it('a second muting lands ABOVE the first — newest nearest the live list', () => {
    render(<App />)
    threeHabits()

    fireEvent.click(eye('one'))
    fireEvent.click(eye('two'))

    expect(names()).toEqual(['three', 'two', 'one'])
  })

  it('opening the eye again moves nothing', () => {
    // The rule that makes muting safe to undo (spec §5b): un-muting is a
    // change of look, never of place. The tile stays at the bottom until
    // something actually moves it.
    render(<App />)
    threeHabits()

    fireEvent.click(eye('one'))
    expect(names()).toEqual(['two', 'three', 'one'])

    fireEvent.click(eye('one'))
    expect(names()).toEqual(['two', 'three', 'one'])
    expect(isMuted('one')).toBe(false)
  })

  it('a muted tile still counts, and can be dragged back up still dim', () => {
    // "Out of my eyeline", never "switched off".
    render(<App />)
    threeHabits()
    fireEvent.click(eye('one'))

    fireEvent.click(within(tile('one')).getByRole('button', { name: '+1' }))
    expect(within(tile('one')).getByText('✓ 1/1')).toBeDefined()

    // Rows at 0 / 50 / 100 with 'one' at the foot; drag it up over 'two'.
    const drag = layOutRows('one')
    fireEvent.pointerDown(tile('one'), { button: 0, clientX: 0, clientY: 110 })
    drag.offset = -105
    fireEvent.pointerMove(window, { clientX: 0, clientY: 5 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 5 })

    expect(names()).toEqual(['one', 'two', 'three'])
    expect(isMuted('one')).toBe(true)
  })

  it('the sink is never written down — a reload brings the order back', () => {
    // Nothing about an arrangement is saved until T6.23e. A refresh is a
    // fresh visit, and a fresh visit is the stored order, unmuted.
    const first = render(<App />)
    threeHabits()
    fireEvent.click(eye('one'))
    expect(names()).toEqual(['two', 'three', 'one'])

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['one', 'two', 'three'])
    expect(isMuted('one')).toBe(false)
  })

  it('the day turn wipes it too, without a reload', () => {
    // 11:30pm, so the page's own minute-tick can carry it past the 3am
    // cutoff while it sits there open.
    vi.setSystemTime(new Date(2026, 6, 16, 23, 30))
    render(<App />)
    threeHabits()
    // Marked done before midnight, so the new day arrives with nothing
    // to ask about: the check-in pop-up lists the habits as well, and a
    // quiet rollover leaves only the list itself on screen to read.
    for (const name of ['one', 'two', 'three']) {
      fireEvent.click(within(tile(name)).getByRole('button', { name: '+1' }))
    }
    fireEvent.click(eye('one'))
    expect(names()).toEqual(['two', 'three', 'one'])

    act(() => {
      vi.advanceTimersByTime(4.5 * 60 * 60 * 1000) // 11:30pm → 4am
    })

    expect(names()).toEqual(['one', 'two', 'three'])
    expect(isMuted('one')).toBe(false)
  })
})

describe('editing', () => {
  it('edit changes the name in place', () => {
    render(<App />)
    createHabitViaUI('jurnal')
    fireEvent.click(row('jurnal').getByRole('button', { name: 'edit' }))
    const form = within(document.querySelector('form.habit-form'))
    fireEvent.change(field('name'), {
      target: { value: 'journal' },
    })
    fireEvent.click(form.getByRole('button', { name: 'save' }))
    expect(screen.getByText('journal')).toBeDefined()
    expect(screen.queryByText('jurnal')).toBeNull()
  })
})

describe('archive, unarchive, delete forever', () => {
  it('archive moves a habit out of daily use and back', () => {
    render(<App />)
    createHabitViaUI('floss', { symbol: 3 })
    fireEvent.click(row('floss').getByRole('button', { name: 'archive' }))
    settleFarewell()

    // Gone from the daily list, present in the archived section — and it
    // keeps its charm there (T5.1 follow-up), not just its name.
    const archived = within(screen.getByText(/^archived/).closest('details'))
    expect(archived.getByText('floss')).toBeDefined()
    expect(archived.getByRole('img', { name: 'shell' })).toBeDefined()

    fireEvent.click(archived.getByRole('button', { name: 'unarchive' }))
    expect(row('floss').getByRole('button', { name: '+1' }))
  })

  // Kimia's call 2026-08-11: a tile used to blink out of existence the
  // instant it was archived. Now it is left on screen, inert, long enough
  // to be seen sinking away.
  it('an archived tile stays for its farewell, then goes', () => {
    render(<App />)
    createHabitViaUI('floss')
    fireEvent.click(row('floss').getByRole('button', { name: 'archive' }))

    // Still drawn, and marked as leaving. It answers to nothing: the
    // archiving already happened, so a tap on the departing copy stores
    // no completion and cannot bring it back.
    const tile = document.querySelector('.habit-row--leaving')
    expect(tile).not.toBeNull()
    expect(within(tile).getByText('floss')).toBeDefined()
    fireEvent.click(within(tile).getByRole('button', { name: '+1' }))
    const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
    expect(stored().completions).toEqual([])
    expect(stored().habits[0].archived).toBe(true)

    // Once the farewell is over the copy is gone, and the only 'floss'
    // left on the page is the archived list's own row.
    settleFarewell()
    expect(document.querySelector('.habit-row--leaving')).toBeNull()
    expect(screen.getByText('floss').closest('li').className).toContain(
      'archived-row',
    )
  })

  it('delete forever asks first, and cancel keeps everything', () => {
    render(<App />)
    createHabitViaUI('typo habit')
    fireEvent.click(row('typo habit').getByRole('button', { name: 'archive' }))
    settleFarewell()

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    fireEvent.click(screen.getByRole('button', { name: 'delete forever' }))
    expect(confirm).toHaveBeenCalledOnce()
    expect(screen.getByText('typo habit')).toBeDefined() // still here

    confirm.mockReturnValue(true)
    fireEvent.click(screen.getByRole('button', { name: 'delete forever' }))
    expect(screen.queryByText('typo habit')).toBeNull() // gone for good
  })
})

describe('one-time habits — to-dos that auto-archive (added 2026-07-13)', () => {
  it('checking one off archives it instantly; undo brings it back open', () => {
    render(<App />)
    createHabitViaUI('renew passport', { scheduleType: 'oneTime' })
    expect(screen.getByText('one-time · medium')).toBeDefined()

    fireEvent.click(
      row('renew passport').getByRole('checkbox', { name: 'mark done' }),
    )
    // Archived the moment it was ticked; the tile itself takes a beat to
    // sink out of the list (2026-08-11).
    settleFarewell()

    // Gone from the daily list, sitting in archived with a -1 button.
    expect(screen.queryByText('one-time · medium')).toBeNull()
    const archived = within(screen.getByText(/^archived/).closest('details'))
    expect(archived.getByText('renew passport')).toBeDefined()

    // Undo: un-archived AND un-done, as if the tap never happened.
    fireEvent.click(archived.getByRole('button', { name: '-1' }))
    expect(row('renew passport').getByRole('checkbox', { name: 'mark done' }))
    expect(screen.queryByText(/^archived/)).toBeNull()
  })

  it('a one-time done on a PAST day is frozen: no undo, no unarchive', () => {
    // Seed storage directly — the UI can't travel back in time.
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'todo-1',
            name: 'assemble shelf',
            description: '',
            symbol: 1,
            difficulty: 'medium',
            schedule: { type: 'oneTime' },
            archived: true,
            createdAt: 1,
          },
        ],
        completions: [
          {
            id: 'c1',
            habitId: 'todo-1',
            recordedAt: 2,
            dayKey: '2026-07-01',
          },
        ],
        settings: { dayCutoffHour: 3 },
      }),
    )
    render(<App />)

    const archived = within(screen.getByText(/^archived/).closest('details'))
    expect(archived.getByText('done 2026-07-01')).toBeDefined()
    expect(archived.queryByRole('button', { name: '-1' })).toBeNull()
    expect(archived.queryByRole('button', { name: 'unarchive' })).toBeNull()
    // Delete forever remains the only way out.
    expect(archived.getByRole('button', { name: 'delete forever' }))
  })

  it('a one-time archived BY HAND (never done) unarchives normally', () => {
    render(<App />)
    createHabitViaUI('call the bank', { scheduleType: 'oneTime' })
    fireEvent.click(
      row('call the bank').getByRole('button', { name: 'archive' }),
    )
    settleFarewell()

    const archived = within(screen.getByText(/^archived/).closest('details'))
    fireEvent.click(archived.getByRole('button', { name: 'unarchive' }))
    expect(row('call the bank').getByRole('checkbox', { name: 'mark done' }))
  })
})

describe('the morning check-in (T1.4)', () => {
  // Frozen clock: Thursday 16 July 2026, 9am. The week runs Mon 13 –
  // Sun 19, so yesterday is Wed 15 and Mon/Tue are optional backfill.
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 16, 9))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  // A daily habit that existed all week, with nothing marked yet.
  function seed(overrides = {}) {
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(), // Mon the 13th
          },
        ],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: null,
        ...overrides,
      }),
    )
  }

  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  it('opens on a missed yesterday; marks land on their true days; done saves', () => {
    seed()
    render(<App />)

    // The check-in pops up over the dimmed, inert list — role queries
    // skip the aria-hidden backdrop, so the foot buttons read as gone.
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'add new habit' })).toBeNull()

    // Yesterday (Wed the 15th) is the unnamed question at the top —
    // since 2026-08-11 the header just asks, and no date is printed.
    // What IS printed is the optional list below it: Monday and
    // Tuesday only. Wednesday's absence from that list is what proves
    // it is the question, and the frozen previous week is not offered
    // at all. Where the marks actually land is asserted further down.
    expect(screen.getByText('mon 13-07-26')).toBeDefined()
    expect(screen.getByText('tue 14-07-26')).toBeDefined()
    expect(screen.queryByText(/15-07-26/)).toBeNull()
    expect(screen.queryByText(/12-07-26/)).toBeNull()

    // Mark yesterday's walk (the first row is yesterday's; the
    // optional days are listed after it)…
    fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])

    // …and backfill Tuesday from the optional section.
    const tuesday = within(screen.getByText('tue 14-07-26').closest('details'))
    fireEvent.click(tuesday.getByRole('button', { name: '+1' }))

    fireEvent.click(screen.getByRole('button', { name: 'done' }))

    // Back on the list, and the data says what really happened: the
    // marks belong to the days they were DONE, entry day nowhere.
    expect(screen.getByRole('button', { name: 'add new habit' })).toBeDefined()
    expect(
      stored()
        .completions.map((c) => c.dayKey)
        .sort(),
    ).toEqual(['2026-07-14', '2026-07-15'])
    expect(stored().checkedInThrough).toBe('2026-07-15')
  })

  it('the check-in counter takes extras too, all onto their true day (T3.2b)', () => {
    seed()
    render(<App />)

    // Yesterday's row is a counter here as well: three +1s, then one
    // -1 — the surviving two marks both belong to Wed the 15th. The
    // dimmed list behind the pop-up prints the same count texts, so
    // scope every query to the check-in itself (text queries don't
    // respect its aria-hidden backdrop).
    const checkIn = within(screen.getByRole('region', { name: 'check-in' }))
    for (let i = 0; i < 3; i++) {
      fireEvent.click(checkIn.getAllByRole('button', { name: '+1' })[0])
    }
    expect(checkIn.getByText('✓ 3/1')).toBeDefined()
    fireEvent.click(checkIn.getAllByRole('button', { name: '-1' })[0])
    fireEvent.click(checkIn.getByRole('button', { name: 'done' }))
    expect(stored().completions.map((c) => c.dayKey)).toEqual([
      '2026-07-15',
      '2026-07-15',
    ])
  })

  it('leaving everything unmarked is a fine answer — saved as answered, nothing recorded', () => {
    seed()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'done' }))
    expect(stored().completions).toEqual([])
    expect(stored().checkedInThrough).toBe('2026-07-15')
    // A reload does not ask again.
    cleanup()
    render(<App />)
    expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()
  })

  // T5.2e, design-notes §4: the check-in keeps a plain header of its own,
  // so a retro mark has no visible meter to move. The movement is held
  // and plays ONCE when the check-in closes — the same beat its drops
  // already take. Which bar was asked to play is all a test can honestly
  // read; the glow itself is CSS.
  describe('the held meter movement (T5.2e, §4)', () => {
    const stepsBar = () =>
      screen.getByRole('progressbar', { name: 'steps taken progress' })

    it('plays once for the whole session when done is pressed', () => {
      seed()
      render(<App />)
      // Two marks across two days — one movement, not two.
      fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
      const tuesday = within(
        screen.getByText('tue 14-07-26').closest('details'),
      )
      fireEvent.click(tuesday.getByRole('button', { name: '+1' }))
      fireEvent.click(screen.getByRole('button', { name: 'done' }))

      // The bars arrive holding where the week stood — two marks made,
      // and the bar still shows none of them — so there is a distance
      // left to travel when the screen has settled (2026-08-16).
      expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
      expect(stepsBar().className).not.toMatch(/meter-bar--/)

      // Then it travels, once, for both marks together.
      act(() => vi.advanceTimersByTime(CHECKIN_MOVE_HOLD_MS))
      expect(stepsBar().getAttribute('aria-valuenow')).toBe('2')
      expect(stepsBar().className).toMatch(/meter-bar--step/)
    })

    it('a check-in with nothing marked moves nothing', () => {
      seed()
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: 'done' }))
      expect(stepsBar().className).not.toMatch(/meter-bar--/)
    })

    it('marking then unmarking leaves nothing to celebrate', () => {
      seed()
      render(<App />)
      fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
      fireEvent.click(screen.getAllByRole('button', { name: '-1' })[0])
      fireEvent.click(screen.getByRole('button', { name: 'done' }))
      expect(stepsBar().className).not.toMatch(/meter-bar--/)
    })

    it('settles back, and does not play again on a later page', () => {
      // The held reading is spent the moment it is handed over. Left
      // lying about, it would replay the check-in's ceremony every time
      // Kimia opened the Map.
      seed()
      render(<App />)
      fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
      fireEvent.click(screen.getByRole('button', { name: 'done' }))
      act(() => vi.advanceTimersByTime(CHECKIN_MOVE_HOLD_MS))
      expect(stepsBar().className).toMatch(/meter-bar--step/)

      // The glow plays out and the bar stops claiming to be moving.
      act(() => vi.advanceTimersByTime(METER_MOVE_MS))
      expect(stepsBar().className).not.toMatch(/meter-bar--/)

      fireEvent.click(screen.getByRole('button', { name: /steps taken/ }))
      fireEvent.click(screen.getByRole('button', { name: 'HABITAT' }))
      expect(stepsBar().className).not.toMatch(/meter-bar--/)
    })
  })

  it('stays quiet when yesterday was already done, but past days remain editable by hand', () => {
    seed({
      completions: [
        { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-15' },
      ],
    })
    render(<App />)

    // No check-in — straight to the list.
    expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()

    // But the week's earlier days can still be opened and edited.
    fireEvent.click(screen.getByRole('button', { name: 'edit past days' }))
    const monday = within(screen.getByText('mon 13-07-26').closest('details'))
    fireEvent.click(monday.getByRole('button', { name: '+1' }))
    fireEvent.click(screen.getByRole('button', { name: 'done' }))
    expect(
      stored()
        .completions.map((c) => c.dayKey)
        .sort(),
    ).toEqual(['2026-07-13', '2026-07-15'])
  })

  // The quick check-in (Kimia's calls 2026-08-14). It is a glance and a
  // few taps: the rows are compressed (CSS, nothing to assert), a charm
  // lens narrows the list, a long day folds behind a `…`, and answering
  // always lands you back at the top of the page so the meters' held
  // movement is on screen when it plays.
  describe('quick and short (2026-08-14)', () => {
    // A week-old habit per charm, so the list is long enough to fold and
    // varied enough to filter. One habit for charm 1, two for charm 2,
    // and enough others to push past CHECKIN_ROWS_BEFORE_MORE.
    function seedMany(count = CHECKIN_ROWS_BEFORE_MORE + 3) {
      localStorage.setItem(
        'habitat-data',
        JSON.stringify({
          schemaVersion: 1,
          habits: Array.from({ length: count }, (_, i) => ({
            id: `h${i}`,
            name: `habit ${i}`,
            description: '',
            // First habit charm 1, next two charm 2, rest spread over
            // the remaining charms.
            symbol: i === 0 ? 1 : i <= 2 ? 2 : (i % 4) + 3,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(),
          })),
          completions: [],
          settings: { dayCutoffHour: 3 },
          checkedInThrough: null,
        }),
      )
    }

    // Yesterday's rows only — the optional earlier days sit inside
    // <details> elements, which these queries deliberately skip.
    const yesterdayRowCount = () => {
      const panel = screen.getByRole('region', { name: 'check-in' })
      return [...panel.querySelectorAll(':scope > ul.habit-list > li')].length
    }

    it('folds a long yesterday behind one control, and unfolds it again', () => {
      seedMany()
      render(<App />)
      expect(yesterdayRowCount()).toBe(CHECKIN_ROWS_BEFORE_MORE)

      // The fold's control says how many it is holding back, and the
      // earlier-days offer is already on screen above it — that is the
      // point of folding at all.
      const more = screen.getByRole('button', { name: /^show 3 more$/ })
      expect(more.getAttribute('aria-expanded')).toBe('false')
      expect(screen.getByText('mon 13-07-26')).toBeDefined()

      fireEvent.click(more)
      expect(yesterdayRowCount()).toBe(CHECKIN_ROWS_BEFORE_MORE + 3)
      expect(more.getAttribute('aria-expanded')).toBe('true')

      // And it folds back up.
      fireEvent.click(more)
      expect(yesterdayRowCount()).toBe(CHECKIN_ROWS_BEFORE_MORE)
    })

    it('a short yesterday is never folded', () => {
      seedMany(CHECKIN_ROWS_BEFORE_MORE)
      render(<App />)
      expect(yesterdayRowCount()).toBe(CHECKIN_ROWS_BEFORE_MORE)
      expect(screen.queryByRole('button', { name: /more$/ })).toBeNull()
    })

    it('the charm lens narrows the check-in without folding what it leaves', () => {
      seedMany()
      render(<App />)
      const panel = screen.getByRole('region', { name: 'check-in' })
      // The check-in's own lens — the dimmed home list behind carries
      // one too, so scope the query to the panel.
      const charms = within(panel).getAllByRole('button', { pressed: false })

      // Charm 2 is worn by exactly two habits: choosing it leaves two
      // rows, and with two rows there is nothing left to fold.
      fireEvent.click(charms[1])
      expect(yesterdayRowCount()).toBe(2)
      expect(screen.queryByRole('button', { name: /more$/ })).toBeNull()

      // Un-choosing gives the whole day back, folded as before.
      fireEvent.click(charms[1])
      expect(yesterdayRowCount()).toBe(CHECKIN_ROWS_BEFORE_MORE)
    })

    it('done lands you back at the top of the page', () => {
      seed()
      const jumped = vi.spyOn(window, 'scrollTo')
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: 'done' }))
      expect(jumped).toHaveBeenCalledWith(0, 0)
      jumped.mockRestore()
    })

    it('a check-in opened by hand can be clicked away from — and does not jump', () => {
      seed({
        completions: [
          { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-15' },
        ],
      })
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: 'edit past days' }))
      const panel = screen.getByRole('region', { name: 'check-in' })

      const jumped = vi.spyOn(window, 'scrollTo')
      // A press on the panel itself changes nothing…
      fireEvent.click(panel)
      expect(screen.queryByRole('region', { name: 'check-in' })).not.toBeNull()

      // …a press on the veil around it closes the visit, leaves the page
      // where it stood, and records no answer.
      fireEvent.click(panel.parentElement)
      expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()
      expect(jumped).not.toHaveBeenCalled()
      expect(stored().checkedInThrough).toBeNull()
      jumped.mockRestore()
    })

    it('the morning check-in cannot be clicked away from', () => {
      seed()
      render(<App />)
      const panel = screen.getByRole('region', { name: 'check-in' })
      fireEvent.click(panel.parentElement)
      expect(screen.queryByRole('region', { name: 'check-in' })).not.toBeNull()
    })
  })
})

describe('an open page notices the new day by itself (added 2026-07-15)', () => {
  // Same seeded week as above: Mon 13 – Sun 19 July 2026, cutoff 3am.
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  function seed(overrides = {}) {
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(),
          },
        ],
        completions: [
          // Yesterday (Wed 15) was done live, so no check-in at 11:30pm.
          { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-15' },
        ],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: null,
        ...overrides,
      }),
    )
  }

  it('the background tab flips to the new day and owes its check-in when looked at again', () => {
    // 11:30pm Thursday: all quiet, the list is showing.
    vi.setSystemTime(new Date(2026, 6, 16, 23, 30))
    seed()
    render(<App />)
    expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()

    // The tab sits in the background until 4am — past the 3am cutoff,
    // so a new Habitat day (Friday) has begun and Thursday went
    // unmarked. Coming back to the tab re-checks the clock…
    vi.setSystemTime(new Date(2026, 6, 17, 4, 0))
    fireEvent(document, new Event('visibilitychange'))

    // …and the page behaves exactly like a fresh visit: the check-in
    // opens, asking about the real yesterday (Thursday the 16th).
    // Nothing on screen names that day any more (2026-08-11), so the
    // proof the window moved is the OPTIONAL list: it now offers Wed
    // the 15th, which can only mean Thursday has been promoted to the
    // unnamed question at the top.
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
    expect(screen.getByText('wed 15-07-26')).toBeDefined()
    expect(screen.queryByText(/16-07-26/)).toBeNull()
  })

  it('even without focusing, the minute-tick notices the rollover', () => {
    vi.setSystemTime(new Date(2026, 6, 16, 23, 30))
    seed()
    render(<App />)
    expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()

    // Let the page's own clock tick past the 3am boundary (fake timers
    // advance Date.now() and fire the interval together).
    act(() => {
      vi.advanceTimersByTime(4.5 * 60 * 60 * 1000) // 11:30pm → 4am
    })
    // Same proof as above: Wed the 15th has dropped into the optional
    // list, so Thursday is now the question the header asks unnamed.
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
    expect(screen.getByText('wed 15-07-26')).toBeDefined()
    expect(screen.queryByText(/16-07-26/)).toBeNull()
  })

  it('a quiet rollover (nothing missed) just moves the list to the new day', () => {
    // Thursday was ALSO done live: at 4am there is nothing to ask —
    // the list simply resets for Friday, undo button gone.
    vi.setSystemTime(new Date(2026, 6, 16, 23, 30))
    seed({
      completions: [
        { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-15' },
        { id: 'c2', habitId: 'walk', recordedAt: 6, dayKey: '2026-07-16' },
      ],
    })
    render(<App />)
    expect(row('walk').getByText('✓ 1/1')).toBeDefined()

    act(() => {
      vi.advanceTimersByTime(4.5 * 60 * 60 * 1000)
    })
    expect(screen.queryByRole('region', { name: 'check-in' })).toBeNull()
    expect(row('walk').getByText('0/1')).toBeDefined()
  })
})

describe('the three meters (T2.2)', () => {
  // The meters section at the top of the list.
  const meters = () => within(screen.getByRole('region', { name: 'meters' }))
  const stepsBar = () =>
    meters().getByRole('progressbar', { name: 'steps taken progress' })

  it('shows all three meters, empty on a fresh start', () => {
    render(<App />)
    expect(meters().getByText('steps taken')).toBeDefined()
    expect(meters().getByText('literacy level')).toBeDefined()
    expect(meters().getByText('wallet balance')).toBeDefined()
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
    // All three are bars now (T4.5); the exact numbers live behind each
    // meter's hover — the wallet's is its true balance, debt and all.
    expect(
      meters()
        .getByRole('progressbar', { name: 'wallet balance progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('0')
    expect(meters().getByRole('button', { name: /steps taken/ }).title).toBe(
      '0',
    )
    expect(meters().getByRole('button', { name: /literacy level/ }).title).toBe(
      '0',
    )
    expect(meters().getByRole('button', { name: /wallet balance/ }).title).toBe(
      '0',
    )
  })

  it('completing a habit visibly moves the steps-taken meter; undo moves it back', () => {
    render(<App />)
    createHabitViaUI('walk')

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('1')

    // Undo reverses the meter exactly (decision 2026-07-15).
    fireEvent.click(row('walk').getByRole('button', { name: '-1' }))
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
  })

  it('extras beyond an N-per-day target keep moving the meter — every tap counts', () => {
    render(<App />)
    createHabitViaUI('water', { scheduleType: 'nPerDay', n: 2 })
    for (let i = 0; i < 3; i++) {
      fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    }
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('3')
  })

  it('each meter opens its page, and back returns to the list', () => {
    render(<App />)
    createHabitViaUI('walk')

    fireEvent.click(meters().getByRole('button', { name: /steps taken/ }))
    expect(screen.getByText('map of N-Z-D')).toBeDefined()
    expect(screen.queryByText('walk')).toBeNull() // the list waits behind
    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )
    expect(screen.getByText('walk')).toBeDefined()

    fireEvent.click(meters().getByRole('button', { name: /literacy level/ }))
    expect(screen.getByText('readers library')).toBeDefined()
    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )

    fireEvent.click(meters().getByRole('button', { name: /wallet balance/ }))
    expect(screen.getByText('local market')).toBeDefined()
  })

  it('the HABITAT header is a home link from every meter page (added 2026-07-16)', () => {
    render(<App />)
    createHabitViaUI('walk')

    for (const meter of [/steps taken/, /literacy level/, /wallet balance/]) {
      fireEvent.click(meters().getByRole('button', { name: meter }))
      expect(screen.queryByText('walk')).toBeNull() // we left the list
      fireEvent.click(screen.getByRole('button', { name: 'HABITAT' }))
      expect(screen.getByText('walk')).toBeDefined() // and we're home
    }
  })

  it('retroactive check-in marks count toward the meter like live ones', () => {
    // Frozen at Thursday 16 July 2026, 9am; a daily habit missed
    // yesterday, so the check-in opens (no meters there — decision
    // 2026-07-16) and its marks land on their true days.
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 16, 9))
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(),
          },
        ],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: null,
      }),
    )
    render(<App />)

    expect(screen.queryByRole('region', { name: 'meters' })).toBeNull()
    // No header escape hatch either: the check-in's done button stays
    // the only way out, so yesterday always gets answered.
    expect(screen.queryByRole('button', { name: 'HABITAT' })).toBeNull()
    fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'done' }))

    // The bar arrives showing where the week STOOD and then travels
    // (T5.2e/§4, 2026-08-16) — so for one held beat it still reads zero,
    // and what it reports is honestly what it is drawing. The mark
    // counts either way; this only decides when the bar admits it.
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
    act(() => vi.advanceTimersByTime(CHECKIN_MOVE_HOLD_MS))
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('1')
    vi.useRealTimers()
  })
})

// The backup's age (T6.4a). It was a line of text beside the export
// button until 2026-08-12, when the foot of the home screen became three
// clean buttons and it moved onto the button's own hover label.
describe('the backup age (T6.4a)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
  const ageLine = () =>
    screen.getByRole('button', { name: 'export backup' }).title
  // The exact words are pinned and tested in game/backup.test.js; here
  // we only check the wiring, so the label is derived, never quoted.
  const expected = (lastExportedOn) =>
    backupAgeLabel(lastExportedOn, todayKey())

  it('says there is no backup yet, then updates the moment one is taken', () => {
    render(<App />)
    createHabitViaUI('worth keeping')
    expect(stored().settings.lastExportedOn).toBe(null)
    expect(ageLine()).toBe(expected(null))

    // jsdom has no real download; the click is harmless, and what we
    // care about is that the stamp lands and the line re-reads it.
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: 'export backup' }))

    expect(stored().settings.lastExportedOn).toBe(todayKey())
    expect(ageLine()).toBe(expected(todayKey()))
  })

  it('reports the age of a backup taken a while ago', () => {
    render(<App />)
    createHabitViaUI('worth keeping')
    const old = addDays(todayKey(), -9)
    act(() => {
      const data = stored()
      localStorage.setItem(
        'habitat-data',
        JSON.stringify({
          ...data,
          settings: { ...data.settings, lastExportedOn: old },
        }),
      )
    })
    cleanup()
    render(<App />)

    expect(ageLine()).toBe(expected(old))
  })
})

describe('backup import (plan T1.3: warn before overwriting)', () => {
  const backupOf = (habits = []) =>
    new File(
      [
        JSON.stringify({
          schemaVersion: 1,
          habits,
          completions: [],
          settings: { dayCutoffHour: 3 },
        }),
      ],
      'habitat-backup.json',
      { type: 'application/json' },
    )

  it('warns when data exists; cancelling changes nothing', async () => {
    render(<App />)
    createHabitViaUI('precious data')

    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    fireEvent.change(screen.getByLabelText('backup file'), {
      target: { files: [backupOf()] },
    })

    expect(await screen.findByText(/nothing was changed/)).toBeDefined()
    expect(confirm).toHaveBeenCalledOnce()
    expect(screen.getByText('precious data')).toBeDefined()
  })

  it('accepting the warning replaces everything with the backup', async () => {
    render(<App />)
    createHabitViaUI('old life')

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const imported = {
      id: 'imported-1',
      name: 'new life',
      description: '',
      symbol: 4,
      difficulty: 'easy',
      schedule: { type: 'daily' },
      archived: false,
      createdAt: 1,
    }
    fireEvent.change(screen.getByLabelText('backup file'), {
      target: { files: [backupOf([imported])] },
    })

    expect(await screen.findByText('backup imported')).toBeDefined()
    expect(screen.getByText('new life')).toBeDefined()
    expect(screen.queryByText('old life')).toBeNull()
  })

  it('a broken file is refused and data survives', async () => {
    render(<App />)
    createHabitViaUI('survivor')
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const junk = new File(['not json at all'], 'junk.json')
    fireEvent.change(screen.getByLabelText('backup file'), {
      target: { files: [junk] },
    })

    expect(await screen.findByText(/not readable/)).toBeDefined()
    expect(screen.getByText('survivor')).toBeDefined()
  })
})

describe('field notes (T2.3)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  // Seed a v1-style record directly — these tests need habits that
  // existed on specific past days, which the UI alone can't create.
  // (v1 on purpose: loadData's upgrade fills in the T2.3 fields.)
  function seed(overrides = {}) {
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 6, 9).getTime(), // Mon Jul 6th
          },
        ],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: null,
        ...overrides,
      }),
    )
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  it('the habit list links to the field notes and back', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 9)) // Wednesday the 15th
    seed({
      checkedInThrough: '2026-07-14', // yesterday answered, no check-in
      completions: [
        { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-08' },
      ],
    })
    render(<App />)

    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data' }),
    )
    // Opens on the last completed week, where Wednesday the 8th shows ✓.
    // The week is headed DD-MM-YY, no "week of" (Kimia, 2026-08-11).
    expect(screen.getByText(/06-07-26 – 12-07-26/)).toBeDefined()
    expect(screen.getByText('✓')).toBeDefined()

    // Browsing: forward to the current (still unfolding) week, no further.
    fireEvent.click(screen.getByRole('button', { name: 'later ›' }))
    expect(screen.getByText(/13-07-26/)).toBeDefined()
    expect(screen.getByText(/still unfolding/)).toBeDefined()
    expect(screen.getByRole('button', { name: 'later ›' })).toHaveProperty(
      'disabled',
      true,
    )

    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )
    expect(screen.getByRole('button', { name: 'add new habit' })).toBeDefined()
  })

  it('opens by itself on the first visit of a Sunday — and only the first', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 19, 12)) // Sunday the 19th, noon
    seed({ checkedInThrough: '2026-07-18' }) // Saturday answered

    const first = render(<App />)
    // The startup fade plays first — the field notes wait behind it
    // (T4.5's morning order: check-in → startup → field notes).
    expect(document.querySelector('.startup')).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'field notes' })).toBeNull()

    // Once the fade has lifted, the field notes take their turn.
    settleStartup()
    expect(screen.getByRole('region', { name: 'field notes' })).toBeDefined()
    expect(stored().settings.startupShownOn).toBe('2026-07-19')
    expect(stored().settings.fieldNotesShownOn).toBe('2026-07-19')

    // A second visit the same Sunday goes straight to the list.
    first.unmount()
    render(<App />)
    expect(screen.queryByRole('region', { name: 'field notes' })).toBeNull()
    expect(document.querySelector('.startup')).toBeNull()
  })

  it('the Sunday opening waits its turn behind the check-in AND the startup', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 19, 12)) // Sunday the 19th
    seed() // Saturday unanswered → the check-in must come first

    render(<App />)
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
    expect(screen.queryByRole('region', { name: 'field notes' })).toBeNull()
    // No fade while the check-in is up — it waits its turn too.
    expect(document.querySelector('.startup')).toBeNull()

    // The check-in answered, the startup fade takes the next turn —
    // and the field notes still wait.
    fireEvent.click(screen.getByRole('button', { name: 'done' }))
    expect(document.querySelector('.startup')).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'field notes' })).toBeNull()

    // Only once the fade has played do the field notes open — the full
    // morning order was check-in → startup → field notes.
    settleStartup()
    expect(screen.getByRole('region', { name: 'field notes' })).toBeDefined()
    expect(stored().settings.startupShownOn).toBe('2026-07-19')
  })

  it('warns before a schedule edit that switches the streak kind', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 9)) // Wednesday the 15th
    seed({ checkedInThrough: '2026-07-14' })
    render(<App />)

    // Build a streak of 1 day, then try daily → N-per-week.
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    fireEvent.click(row('walk').getByRole('button', { name: 'edit' }))
    const form = () => within(document.querySelector('form.habit-form'))
    fireEvent.change(field('schedule'), {
      target: { value: 'nPerWeek' },
    })
    fireEvent.change(field('n'), {
      target: { value: '3' },
    })
    fireEvent.click(form().getByRole('button', { name: 'save' }))

    // Declined: nothing saved, the form still open.
    expect(confirm).toHaveBeenCalledOnce()
    expect(document.querySelector('form.habit-form')).not.toBeNull()
    expect(stored().habits[0].schedule.type).toBe('daily')

    // Accepted: saved, and the change is date-stamped in the history.
    confirm.mockReturnValue(true)
    fireEvent.click(form().getByRole('button', { name: 'save' }))
    expect(stored().habits[0].schedule).toEqual({ type: 'nPerWeek', n: 3 })
    expect(stored().habits[0].scheduleHistory).toHaveLength(2)
    expect(stored().habits[0].scheduleHistory[1].fromDay).toBe('2026-07-15')
  })
})

// Drops are a pure function of the world seed, so the drop tests pick
// their luck: brute-force a seed where the very FIRST tap (habit
// 'walk', expedition step 0, first tap of the given day) delivers
// exactly the one drop the test wants and nothing else.
function findSeed(dayKey, want) {
  for (let i = 0; i < 10000; i++) {
    const seed = `seed-${i}`
    const facts = {
      worldSeed: seed,
      habitId: 'walk',
      dayKey,
      tapIndex: 0,
      difficulty: 'easy',
    }
    const flora = floraTargetStep(0, seed) === 0
    const reading = rollReading(facts) // null or a reading type
    const fungi = rollFungi(facts) > 0
    if (want === 'flora' && flora && reading === null && !fungi) return seed
    if (want === 'fungi' && fungi && !flora && reading === null) return seed
    // Reading: ask for the exact type ('magazine' | 'novel' |
    // 'dictionary') and nothing else alongside it.
    if (want === reading && !flora && !fungi) return seed
  }
  throw new Error(`no seed found that drops only ${want} on ${dayKey}`)
}

// A ready-made v3 world: one daily habit since Mon the 13th, the
// chosen seed, and (unless overridden) yesterday already answered so
// the list shows straight away. The clock is Thursday 16 July, 9am.
// (v3 on purpose: loadData's upgrade adds the T3.3 flora decisions.)
function seedWorld(worldSeed, overrides = {}) {
  localStorage.setItem(
    'habitat-data',
    JSON.stringify({
      schemaVersion: 3,
      habits: [
        {
          id: 'walk',
          name: 'walk',
          description: '',
          symbol: 1,
          difficulty: 'easy',
          schedule: { type: 'daily' },
          scheduleHistory: [
            { schedule: { type: 'daily' }, fromDay: '2026-07-13' },
          ],
          archived: false,
          archivedAt: null,
          createdAt: new Date(2026, 6, 13, 9).getTime(),
        },
      ],
      completions: [],
      settings: { dayCutoffHour: 3, fieldNotesShownOn: null },
      checkedInThrough: '2026-07-15',
      worldSeed,
      ...overrides,
    }),
  )
}

describe('drop arrival + first-occurrence reveals (T3.2)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  it('the first flora POPs, sits on the shelf, notes itself by the habit — and undo takes it all back', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))

    // The drop was rolled at tap time and STORED on the completion.
    expect(stored().completions[0].drops).toEqual([{ kind: 'flora' }])

    // A first: the neon reveal is up, and only its button dismisses it.
    expect(
      screen.getByRole('dialog', { name: revealTitle('flora') }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    // Behind it: the object on the arrival shelf (clicking holds it
    // and names it) and the quiet note by the habit that was tapped.
    const shelf = within(screen.getByRole('region', { name: 'arrivals' }))
    expect(screen.getByText('you came across a flora find')).toBeDefined()
    fireEvent.click(shelf.getByRole('button'))
    expect(shelf.getByText('a flora find')).toBeDefined()

    // Undo: the completion goes, and its drop — stored and on-screen —
    // goes with it.
    fireEvent.click(row('walk').getByRole('button', { name: '-1' }))
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()
    expect(screen.queryByText('you came across a flora find')).toBeNull()
    expect(stored().completions).toEqual([])
  })

  it('fungi go straight to the wallet, and undo takes them back out', () => {
    seedWorld(findSeed('2026-07-16', 'fungi'))
    render(<App />)
    // The wallet number lives behind the meter's hover now (T4.5) —
    // the title carries the true balance, debt and all.
    const wallet = () => document.querySelector('.meter-fungus').title
    expect(wallet()).toBe('0')

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(
      screen.getByRole('dialog', { name: revealTitle('fungi') }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))

    const [drop] = stored().completions[0].drops
    expect(drop.kind).toBe('fungi')
    expect(wallet()).toBe(String(drop.amount))

    fireEvent.click(row('walk').getByRole('button', { name: '-1' }))
    expect(wallet()).toBe('0')
  })

  it('check-in marks earn drops too, but their arrivals wait for the done button', () => {
    // Yesterday (Wed the 15th) unanswered → the check-in opens; its
    // retro mark on the 15th is expedition step 0 and rolls flora.
    seedWorld(findSeed('2026-07-15', 'flora'), { checkedInThrough: null })
    render(<App />)
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()

    fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
    // Distraction-free while answering: no reveal, no shelf.
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'done' }))
    // Now everything arrives together — the reveal first, the shelf
    // and the quiet note behind it.
    expect(
      screen.getByRole('dialog', { name: revealTitle('flora') }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
    expect(screen.getByRole('region', { name: 'arrivals' })).toBeDefined()
    expect(screen.getByText('you came across a flora find')).toBeDefined()
  })
})

describe('read now / read later + the spread popup (T3.5)', () => {
  // The whole raw stored record, byte for byte: reading must NEVER
  // write anything (Kimia's decision 2026-07-19 — no read/unread
  // state exists), so before/after snapshots have to be identical.
  const rawStored = () => localStorage.getItem('habitat-data')
  const shelf = () => within(screen.getByRole('region', { name: 'arrivals' }))

  // Tap once (the seed makes it drop exactly one item of `kind`) and
  // clear the first-occurrence reveal, leaving it on the shelf.
  function dropOne(kind) {
    seedWorld(findSeed('2026-07-16', kind))
    render(<App />)
    // Settle the startup fade before anything else: these tests assert
    // the stored bytes stay unchanged, and the fade saves when its
    // timer fires.
    settleStartup()
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
  }

  it('a held arrival offers read now / read later — for all three reading types', () => {
    for (const kind of ['magazine', 'novel', 'dictionary']) {
      dropOne(kind)
      fireEvent.click(shelf().getByRole('button')) // hold it
      expect(shelf().getByRole('button', { name: 'read now' })).toBeDefined()
      expect(shelf().getByRole('button', { name: 'read later' })).toBeDefined()
      cleanup()
      localStorage.clear()
    }
  })

  it('fungi stay choice-free — a held fungus offers nothing', () => {
    dropOne('fungi')
    fireEvent.click(shelf().getByRole('button'))
    expect(shelf().queryByRole('button', { name: /read/ })).toBeNull()
    expect(shelf().queryByRole('button', { name: 'gather' })).toBeNull()
  })

  it('read later just lets the arrival go — and stores not a byte', () => {
    dropOne('magazine')
    const before = rawStored()
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'read later' }))
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()
    expect(rawStored()).toBe(before)
  })

  it('read now opens the spread popup; closing it lets the arrival go; nothing stored', () => {
    dropOne('magazine')
    const before = rawStored()
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'read now' }))

    // The popup is up. No publication has a spread yet (T6.1 names
    // them), so the empty state shows: no image, no invented words.
    const popup = screen.getByRole('dialog', { name: 'a magazine' })
    expect(popup.querySelector('img')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()
    expect(rawStored()).toBe(before)
  })

  it('the Bookcase shelves what was received — arranged, faced, re-readable anytime', () => {
    dropOne('magazine')
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'read later' }))

    // The literacy meter leads to the constant bookshelf…
    fireEvent.click(
      within(screen.getByRole('region', { name: 'meters' })).getByRole(
        'button',
        { name: /literacy/ },
      ),
    )
    const shelfPage = screen.getByRole('group', { name: 'the bookshelf' })
    const book = within(shelfPage).getByRole('button', { name: 'a magazine' })

    // …where a click turns the book face-out — and that is REMEMBERED
    // per book (storage v5): position frozen in, facing kept.
    fireEvent.pointerDown(book, { clientX: 10, clientY: 10 })
    fireEvent.pointerUp(window, { clientX: 10, clientY: 10 })
    const layout = JSON.parse(
      localStorage.getItem('habitat-data'),
    ).bookcaseLayout
    expect(Object.values(layout)).toEqual([
      { x: expect.any(Number), y: expect.any(Number), facing: 'front' },
    ])

    // The face-out cover's quiet eye re-opens the spread popup — and
    // reading stores nothing, ever (no read/unread state exists).
    const beforeRead = rawStored()
    fireEvent.click(
      within(shelfPage).getByRole('button', { name: 'read a magazine' }),
    )
    expect(screen.getByRole('dialog', { name: 'a magazine' })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(rawStored()).toBe(beforeRead)
  })
})

describe('gather / decline / compost (T3.3)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
  const decisions = () => Object.values(stored().floraDecisions)

  // Tap once (the seeded first tap drops exactly one flora) and clear
  // the first-occurrence reveal, leaving the find on the shelf.
  function dropOneFlora() {
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
  }

  const shelf = () => within(screen.getByRole('region', { name: 'arrivals' }))
  const abode = () => within(screen.getByText('your abode').closest('section'))

  it('a held flora offers gather / leave it; gathering stands it on the Abode ground', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()

    // Hold the arrival: alongside its name, the two quiet choices.
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    expect(decisions()).toEqual(['gathered'])

    // The Abode stands it on the open ground (T4.3) — and shows no
    // found date (Kimia's call 2026-07-20, the Bookcase/Map rule).
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
    expect(abode().getByRole('button', { name: 'a flora find' })).toBeDefined()
    expect(abode().queryByText(/found 2026/)).toBeNull()
  })

  it('an undecided flora simply waits on the Abode page — and can be left from there', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()

    // No decision made. The find waits, quietly, on the Abode page.
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
    const waiting = within(
      screen.getByRole('list', { name: 'waiting to decide' }),
    )
    expect(waiting.getByText('a flora find')).toBeDefined()

    // Leave it: back in the world — off the page, out of the Abode.
    // The ground stays bare, with no prose about it.
    fireEvent.click(waiting.getByRole('button', { name: 'leave it' }))
    expect(screen.queryByRole('list', { name: 'waiting to decide' })).toBeNull()
    expect(abode().queryByRole('button', { name: 'a flora find' })).toBeNull()
    expect(decisions()).toEqual(['left'])
  })

  it('composting empties the shelf spot and credits NOTHING — the wallet never moves', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()
    const wallet = () => document.querySelector('.meter-fungus').title
    expect(wallet()).toBe('0')

    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
    // On the ground (T4.3), compost hides behind the quiet hold: click
    // the flora to hold it, then its compost button.
    fireEvent.pointerDown(abode().getByRole('button', { name: 'a flora find' }))
    fireEvent.pointerUp(window)
    fireEvent.click(abode().getByRole('button', { name: 'compost' }))

    // Gone from the Abode, recorded as composted — and no fungi from
    // it, ever (spec §5: composting yields nothing).
    expect(abode().queryByRole('button', { name: 'a flora find' })).toBeNull()
    expect(decisions()).toEqual(['composted'])
    expect(wallet()).toBe('0')
  })

  it('undoing the completion takes the find AND its decision away', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()

    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    expect(decisions()).toEqual(['gathered'])

    // Undo: the completion goes, and with it the find — the decision
    // map holds no ghosts, and the Abode's ground is bare again.
    fireEvent.click(row('walk').getByRole('button', { name: '-1' }))
    expect(stored().floraDecisions).toEqual({})
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
    expect(abode().queryByRole('button', { name: 'a flora find' })).toBeNull()
  })
})

describe('the Abode ground (T4.3)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
  const shelf = () => within(screen.getByRole('region', { name: 'arrivals' }))
  const abode = () => within(screen.getByText('your abode').closest('section'))

  // Tap once (the seeded first tap drops exactly one flora), clear the
  // reveal, gather the find, and open the Abode.
  function gatherOneFlora() {
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
  }

  it('a dragged flora keeps its place — remembered in storage, per find', () => {
    // jsdom can't measure SVG; give the scene a frame so the drag has
    // somewhere to land.
    const restore = SVGSVGElement.prototype.getBoundingClientRect
    SVGSVGElement.prototype.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 240,
      height: 160,
      right: 240,
      bottom: 160,
      x: 0,
      y: 0,
      toJSON: () => {},
    })
    try {
      seedWorld(findSeed('2026-07-16', 'flora'))
      render(<App />)
      gatherOneFlora()

      expect(stored().abodeLayout).toEqual({})
      const flora = abode().getByRole('button', { name: 'a flora find' })
      fireEvent.pointerDown(flora, { clientX: 20, clientY: 20 })
      fireEvent.pointerMove(window, { clientX: 60, clientY: 120 })
      fireEvent.pointerUp(window, { clientX: 60, clientY: 120 })

      // A quarter across, three quarters down — stored as fractions,
      // keyed by the completion whose tap dropped the find.
      const places = Object.values(stored().abodeLayout)
      expect(places).toEqual([{ x: 0.25, y: 0.75 }])

      // Undo the tap: the find goes, and its stored place with it.
      fireEvent.click(screen.getByRole('button', { name: 'HABITAT' }))
      fireEvent.click(row('walk').getByRole('button', { name: '-1' }))
      expect(stored().abodeLayout).toEqual({})
    } finally {
      SVGSVGElement.prototype.getBoundingClientRect = restore
    }
  })

  it('composting takes the stored place with it — the map holds no ghosts', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    gatherOneFlora()

    // Hold the flora and compost it (no drag: the place was never
    // stored, and composting must leave none behind either way).
    fireEvent.pointerDown(abode().getByRole('button', { name: 'a flora find' }))
    fireEvent.pointerUp(window)
    fireEvent.click(abode().getByRole('button', { name: 'compost' }))
    expect(stored().abodeLayout).toEqual({})
    expect(abode().queryByRole('button', { name: 'a flora find' })).toBeNull()
  })
})

describe('the Market (T4.3b)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
  const meters = () => within(screen.getByRole('region', { name: 'meters' }))
  const abode = () => within(screen.getByText('your abode').closest('section'))
  const wallet = () => document.querySelector('.meter-fungus').title

  // A world with 14 fungi in the wallet: five marks across three lived
  // days (Mon–Wed), so one Map region is known and the first stall
  // offers that region's three curiosities (6, 12 and 18 fungi).
  // Yesterday is already answered (seedWorld), so the list shows.
  function seedMarketWorld() {
    seedWorld('market-seed', {
      completions: [
        {
          id: 'c1',
          habitId: 'walk',
          recordedAt: 1000,
          dayKey: '2026-07-13',
          drops: [{ kind: 'fungi', amount: 3 }],
        },
        {
          id: 'c2',
          habitId: 'walk',
          recordedAt: 2000,
          dayKey: '2026-07-14',
          drops: [{ kind: 'fungi', amount: 3 }],
        },
        {
          id: 'c3',
          habitId: 'walk',
          recordedAt: 3000,
          dayKey: '2026-07-15',
          drops: [{ kind: 'fungi', amount: 3 }],
        },
        {
          id: 'c4',
          habitId: 'walk',
          recordedAt: 4000,
          dayKey: '2026-07-15',
          drops: [{ kind: 'fungi', amount: 3 }],
        },
        {
          id: 'c5',
          habitId: 'walk',
          recordedAt: 5000,
          dayKey: '2026-07-15',
          drops: [{ kind: 'fungi', amount: 2 }],
        },
      ],
    })
  }

  it('buy → the object lives in the abode; sell → full refund, announced like a fungus drop', () => {
    seedMarketWorld()
    render(<App />)
    expect(wallet()).toBe('14')

    // The stall opens from the wallet meter, three curiosities on offer.
    fireEvent.click(meters().getByRole('button', { name: /wallet balance/ }))
    expect(screen.getByRole('heading', { name: 'local market' })).toBeDefined()
    fireEvent.click(
      screen.getByRole('button', { name: 'buy a curiosity for 12 fungi' }),
    )
    expect(wallet()).toBe('2') // the wallet falls by exactly the price
    expect(screen.getByText('×1 at home')).toBeDefined()
    expect(stored().purchases).toHaveLength(1)
    expect(stored().schemaVersion).toBe(SCHEMA_VERSION)

    // Home and into the abode: the curiosity stands on the ground.
    fireEvent.click(screen.getByRole('button', { name: 'HABITAT' }))
    fireEvent.click(screen.getByRole('button', { name: 'your abode' }))
    fireEvent.pointerDown(abode().getByRole('button', { name: 'a curiosity' }))
    fireEvent.pointerUp(window)
    fireEvent.click(abode().getByRole('button', { name: 'sell' }))

    // Refunded in full — a round trip is always fungus-neutral — and
    // the refund arrives with the same feedback a fungus drop shows.
    expect(wallet()).toBe('14')
    expect(stored().purchases).toEqual([])
    expect(stored().abodeLayout).toEqual({})
    expect(abode().queryByRole('button', { name: 'a curiosity' })).toBeNull()
    const arrivals = screen.getByRole('region', { name: 'arrivals' })
    expect(
      within(arrivals).getByRole('button', { name: /click to hold|12 fungi/ }),
    ).toBeDefined()
  })

  it('what the wallet cannot reach cannot be bought', () => {
    seedMarketWorld() // 14 fungi
    render(<App />)
    fireEvent.click(meters().getByRole('button', { name: /wallet balance/ }))
    expect(
      screen.getByRole('button', { name: 'buy a curiosity for 18 fungi' })
        .disabled,
    ).toBe(true)
    fireEvent.click(
      screen.getByRole('button', { name: 'buy a curiosity for 6 fungi' }),
    )
    expect(wallet()).toBe('8')
    expect(stored().purchases).toHaveLength(1)
  })

  it('a fresh world shows a bare stall — no prose, nothing to buy', () => {
    seedWorld('market-seed') // no completions at all: no lived days, no regions
    render(<App />)
    fireEvent.click(meters().getByRole('button', { name: /wallet balance/ }))
    expect(screen.getByRole('heading', { name: 'local market' })).toBeDefined()
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.queryByRole('button', { name: /buy/ })).toBeNull()
  })
})

// Friendships (T4.4): the end-to-end wiring — a due friend rides the
// next tap, the neon friend reveal plays, and the Guest Book fills.
// The delay maths itself lives in game/friends.test.js.
describe('friendships (T4.4)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  // A FIXTURE species name — Kimia's real slots stay out of the suite
  // (src/test/nameFixture.js explains why).
  const DRIFTER_NAME = 'test species name'
  beforeEach(() => {
    // Wipe every slot first: the arriving friend is plip 1, who has
    // an individual name in Kimia's file, and an individual name
    // outranks a species one (2026-08-11).
    blankAllNames()
    setSpeciesName('plip', DRIFTER_NAME)
  })
  afterEach(restoreNames)

  // The friend reveal's dialog name is Kimia's slot when she writes it
  // — never hard-code her words (the 2026-07-19 lesson). Mirror
  // FriendReveal's fallback for blank slots.
  const friendRevealName = () =>
    narrationSlot('friendIntros.plip.title') ?? 'a friend arrives'

  // A seed where the test's tap delivers NO ordinary drop (no flora at
  // its expedition step, no reading, no fungi) — so the friend rides
  // alone and the assertions stay simple.
  function findQuietSeed(dayKey, stepIndex) {
    for (let i = 0; i < 10000; i++) {
      const seed = `friend-seed-${i}`
      const facts = {
        worldSeed: seed,
        habitId: 'walk',
        dayKey,
        tapIndex: 0,
        difficulty: 'easy',
      }
      const flora = floraTargetStep(0, seed) === stepIndex
      if (!flora && rollReading(facts) === null && rollFungi(facts) === 0) {
        return seed
      }
    }
    throw new Error('no quiet seed found')
  }

  it('a due friend rides the next tap: stored, revealed, and in the Guest Book', () => {
    // Ten magazines, one a day from the 1st: the first door (10
    // points) opened on the 10th. The first friend is due 1–5 seeded
    // days later — certainly by the 15th — so today's tap (the 16th)
    // carries them, whatever the seed's exact wait turns out to be.
    const seed = findQuietSeed('2026-07-16', 10)
    seedWorld(seed, {
      completions: Array.from({ length: 10 }, (_, i) => ({
        id: `m${i}`,
        habitId: 'walk',
        recordedAt: 1000 + i,
        dayKey: `2026-07-${String(i + 1).padStart(2, '0')}`,
        drops: [{ kind: 'reading', readingType: 'magazine' }],
      })),
    })
    render(<App />)

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))

    // Rolled at tap time and STORED on the completion, like every drop.
    expect(stored().completions.at(-1).drops).toEqual([
      { kind: 'friend', category: 0, individual: 1 },
    ])

    // Every friend arrival is a neon reveal — dismissed by its button.
    expect(
      screen.getByRole('dialog', { name: friendRevealName() }),
    ).toBeDefined()
    expect(screen.getAllByText(DRIFTER_NAME).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    // The Guest Book holds them, named from Kimia's slot.
    fireEvent.click(screen.getByRole('button', { name: 'local community' }))
    expect(
      screen.getByRole('heading', { name: 'local community' }),
    ).toBeDefined()
    // Scoped to the friends list: since T5.2e the arrival on the shelf
    // wears the friend's name too, so the page-wide query would find
    // both of them.
    const friends = within(screen.getByRole('list', { name: 'friends' }))
    fireEvent.click(friends.getByRole('button', { name: DRIFTER_NAME }))
    expect(screen.getByRole('dialog', { name: DRIFTER_NAME })).toBeDefined()
  })
})

// The daily startup (T4.5): on the first visit of each Habitat day a
// fade plays over whatever the day opens on — after any owed check-in,
// before the Sunday field notes. Manual timers here: the fade's
// STARTUP_FADE_MS moves only when a test says so.
describe('the daily startup (T4.5)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 16, 9)) // Thursday 16 July, 9am
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  // The fade says nothing and has no role — only its class marks it.
  const fade = () => document.querySelector('.startup')
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))

  // A quiet world: one daily habit since Monday, yesterday's check-in
  // already answered — the list shows straight away.
  function seed(overrides = {}) {
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(), // Mon the 13th
          },
        ],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: '2026-07-15',
        ...overrides,
      }),
    )
  }

  it('plays on the first visit of a Habitat day, then remembers it played', () => {
    seed()
    render(<App />)
    expect(fade()).not.toBeNull()

    settleStartup()
    expect(fade()).toBeNull()
    expect(stored().settings.startupShownOn).toBe('2026-07-16')
  })

  it('does not play twice on the same Habitat day', () => {
    seed()
    const first = render(<App />)
    settleStartup()
    first.unmount()

    render(<App />)
    expect(fade()).toBeNull()
  })

  it('plays again the next Habitat day', () => {
    // A live mark on Thursday keeps Friday's visit check-in-free, so
    // the fade is the only thing the new day opens with.
    seed({
      completions: [
        { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-16' },
      ],
    })
    const first = render(<App />)
    settleStartup()
    first.unmount()

    vi.setSystemTime(new Date(2026, 6, 17, 9)) // Friday the 17th
    render(<App />)
    expect(fade()).not.toBeNull()
  })

  it('waits for the check-in when one is owed', () => {
    seed({ checkedInThrough: null }) // yesterday unanswered
    render(<App />)
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
    expect(fade()).toBeNull() // no fade while the check-in is up

    fireEvent.click(screen.getByRole('button', { name: 'done' }))
    expect(fade()).not.toBeNull()
  })

  it('belongs to the Habitat day, not the calendar day (the 3am cutoff)', () => {
    seed()
    // 1am Thursday on the clock is still Wednesday in Habitat.
    vi.setSystemTime(new Date(2026, 6, 16, 1))
    const first = render(<App />)
    expect(fade()).not.toBeNull()
    settleStartup()
    expect(stored().settings.startupShownOn).toBe('2026-07-15')
    first.unmount()

    // 4am the same calendar day: Thursday has begun — the fade plays
    // again, for the new Habitat day.
    vi.setSystemTime(new Date(2026, 6, 16, 4))
    render(<App />)
    expect(fade()).not.toBeNull()
  })

  // The ceremony's own two phases (T5.2e, §12f). `.startup--leaving` is
  // the fade; its absence means the planet still has the screen.
  const leaving = () => document.querySelector('.startup--leaving')

  it('holds the screen, then fades, then hands the day over', () => {
    seed()
    render(<App />)
    expect(leaving()).toBeNull() // holding

    act(() => {
      vi.advanceTimersByTime(STARTUP_HOLD_MS)
    })
    expect(leaving()).not.toBeNull() // fading
    expect(stored().settings.startupShownOn).toBeUndefined() // not yet

    act(() => {
      vi.advanceTimersByTime(STARTUP_FADE_MS)
    })
    expect(fade()).toBeNull()
    expect(stored().settings.startupShownOn).toBe('2026-07-16')
  })

  it('a tap goes straight to the fade, and never skips it', () => {
    // §12f: "a tap during it should go straight to the fade" — the
    // ceremony is offered, never enforced. The FADE is not skippable,
    // because it is the handover to the app rather than a wait before one.
    seed()
    render(<App />)
    fireEvent.pointerDown(fade())
    expect(leaving()).not.toBeNull()
    expect(stored().settings.startupShownOn).toBeUndefined()

    act(() => {
      vi.advanceTimersByTime(STARTUP_FADE_MS)
    })
    expect(fade()).toBeNull()
    expect(stored().settings.startupShownOn).toBe('2026-07-16')
  })

  it('a second tap during the fade changes nothing', () => {
    // Once it is leaving it must stay leaving on the same clock. (The
    // stylesheet also stops it catching taps at all — `pointer-events:
    // none` on .startup--leaving — but jsdom loads no CSS, so that half
    // is verified in a real browser, not here.)
    seed()
    render(<App />)
    fireEvent.pointerDown(fade())
    act(() => {
      vi.advanceTimersByTime(STARTUP_FADE_MS / 2)
    })
    fireEvent.pointerDown(fade())
    act(() => {
      vi.advanceTimersByTime(STARTUP_FADE_MS / 2)
    })
    // The second tap did not restart the fade: the moment still ends on
    // the first tap's schedule.
    expect(fade()).toBeNull()
  })

  it('says nothing and offers nothing to read', () => {
    // §12f: no text, no numbers, no narration slot, no achievement —
    // nothing to read means nothing to miss.
    seed()
    render(<App />)
    // The planet carries its own <style> block, which is text in the DOM
    // but not text on the screen — drop those, and nothing should be left.
    const onScreen = fade().cloneNode(true)
    onScreen.querySelectorAll('style').forEach((tag) => tag.remove())
    expect(onScreen.textContent.trim()).toBe('')
    expect(fade().getAttribute('aria-hidden')).toBe('true')
  })
})

// The T4.5 home screen speaks in icons: every action is an icon button
// whose aria-label (mirrored by its hover title) carries the words.
// This test is the contract for those names — changing one should be a
// deliberate copy decision, never an accident.
describe('the icon-only home screen (T4.5)', () => {
  it('names every action: the rail, the rows, the foot, the archived list', () => {
    localStorage.setItem(
      'habitat-data',
      JSON.stringify({
        schemaVersion: 1,
        habits: [
          {
            id: 'walk',
            name: 'walk',
            description: '',
            symbol: 1,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: false,
            createdAt: new Date(2026, 6, 13, 9).getTime(), // Mon the 13th
          },
          {
            id: 'old',
            name: 'old friend',
            description: '',
            symbol: 2,
            difficulty: 'easy',
            schedule: { type: 'daily' },
            archived: true,
            createdAt: new Date(2026, 6, 13, 9).getTime(),
          },
        ],
        completions: [],
        settings: { dayCutoffHour: 3 },
        checkedInThrough: '2026-07-15', // yesterday answered — no check-in
      }),
    )
    render(<App />)
    settleStartup()

    // The left rail: the five world pages' other door.
    const rail = within(screen.getByRole('navigation', { name: 'pages' }))
    expect(rail.getByRole('button', { name: 'map of N-Z-D' })).toBeDefined()
    expect(rail.getByRole('button', { name: 'your abode' })).toBeDefined()
    expect(rail.getByRole('button', { name: 'local community' })).toBeDefined()
    expect(rail.getByRole('button', { name: 'readers library' })).toBeDefined()
    expect(rail.getByRole('button', { name: 'local market' })).toBeDefined()

    // The habit row and the foot of the list.
    expect(screen.getByRole('button', { name: 'edit' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'archive' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'add new habit' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'edit past days' })).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'view historical data' }),
    ).toBeDefined()

    // The archived list and the symbol filter.
    expect(screen.getByRole('button', { name: 'unarchive' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'delete forever' })).toBeDefined()
    expect(screen.getByRole('region', { name: 'filter view' })).toBeDefined()
  })
})

// Three changes from 2026-07-21: the rail persists on every screen but
// the check-in (Kimia's call), the TEMPORARY design-assets page waits
// for T5, and the home-screen cameo (T4.6) celebrates big wins.
describe('the persistent rail, the design page and the cameo (2026-07-21)', () => {
  it('the rail stays on every page it opens', () => {
    seedWorld('rail-seed')
    render(<App />)
    settleStartup()
    const rail = () => screen.getByRole('navigation', { name: 'pages' })
    fireEvent.click(
      within(rail()).getByRole('button', { name: 'map of N-Z-D' }),
    )
    expect(screen.getByRole('heading', { name: 'map of N-Z-D' })).toBeDefined()
    expect(rail()).toBeDefined()
    fireEvent.click(within(rail()).getByRole('button', { name: 'your abode' }))
    expect(screen.getByRole('heading', { name: 'your abode' })).toBeDefined()
    expect(rail()).toBeDefined()
    // …and home again, never having left.
    fireEvent.click(screen.getByRole('button', { name: 'HABITAT' }))
    expect(rail()).toBeDefined()
  })

  it('yields only to the check-in — its done button stays the only exit', () => {
    // Yesterday unanswered: the check-in opens over the list…
    seedWorld('rail-seed', { checkedInThrough: '2026-07-13' })
    render(<App />)
    expect(screen.queryByRole('navigation', { name: 'pages' })).toBeNull()
  })

  it('the design page shows its waiting shelves, reachable and leavable', () => {
    seedWorld('design-seed')
    render(<App />)
    settleStartup()
    fireEvent.click(screen.getByRole('button', { name: 'design assets' }))
    // The page is a waiting room (2026-08-17): a shelf stands only while
    // its asset still has a question open, so what it holds is the
    // texture library and the abode sky. DesignPage.test.jsx guards the
    // rest of the emptying; this only proves the door still works.
    for (const name of ['textures — plant-like', 'abode sky']) {
      expect(screen.getByRole('region', { name })).toBeDefined()
    }
    // The rail reaches this page too, and its back button leads home.
    expect(screen.getByRole('navigation', { name: 'pages' })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: /back to the habits/ }))
    expect(screen.getByRole('button', { name: 'add new habit' })).toBeDefined()
  })

  it('a big day brings a friend cameo to the list — once, then it settles away', () => {
    // Today is Thursday 2026-07-16: eight completions against it is a
    // big day (the threshold in constants), and a plip arrived the
    // day before, so there is a friend to celebrate.
    seedWorld('cameo-seed', {
      completions: [
        {
          id: 'f1',
          habitId: 'walk',
          recordedAt: 1,
          dayKey: '2026-07-14',
          drops: [{ kind: 'friend', category: 0, individual: 1 }],
        },
        ...Array.from({ length: 8 }, (_, i) => ({
          id: `t${i}`,
          habitId: 'walk',
          recordedAt: 10 + i,
          dayKey: '2026-07-16',
          drops: [],
        })),
      ],
    })
    setNarrationSlot('cameos.bigDay', 'fixture: {n}')
    render(<App />)
    settleStartup()

    const cameo = screen.getByRole('status')
    expect(cameo.querySelector('svg')).not.toBeNull()
    // The message is Kimia's slot, set above through the fixture so this
    // never depends on what her file actually says — and its {n} is
    // filled with the win's own number, eight (2026-08-20).
    expect(cameo.querySelector('.cameo-message').textContent).toBe('fixture: 8')

    // Once per visit: after the linger it leaves by itself.
    act(() => {
      vi.advanceTimersByTime(CAMEO_LINGER_MS)
    })
    expect(screen.queryByRole('status')).toBeNull()
  })

  // Pressing the visit is the way back to what it meant (Kimia's call
  // 2026-08-20). The whole path in one test: a record falls, a friend
  // comes to say so, and pressing what it says lands on the field notes
  // with that record — named — blacked out around it.
  it('pressing a streak cameo opens the field notes with the record spotlit', () => {
    const habit = {
      id: 'walk',
      name: 'walk',
      description: '',
      symbol: 1,
      difficulty: 'easy',
      schedule: { type: 'daily' },
      scheduleHistory: [{ schedule: { type: 'daily' }, fromDay: '2026-07-12' }],
      archived: false,
      archivedAt: null,
      createdAt: new Date(2026, 6, 12, 9).getTime(),
    }
    // Five consecutive fulfilled days ending today — the floor, and the
    // habit's first-ever record, so the run is at its anchor.
    const days = [
      '2026-07-12',
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
    ]
    seedWorld('cameo-seed', {
      habits: [habit],
      completions: days.map((dayKey, i) => ({
        id: `d${i}`,
        habitId: 'walk',
        recordedAt: i + 1,
        dayKey,
        drops: i === 0 ? [{ kind: 'friend', category: 0, individual: 1 }] : [],
      })),
    })
    render(<App />)
    settleStartup()

    fireEvent.click(within(screen.getByRole('status')).getByRole('button'))

    // We are on the field notes, and the blackout names the habit the
    // streak was for — the question a momentary notice could not answer.
    expect(screen.getByRole('region', { name: 'field notes' })).toBeDefined()
    const spotlight = document.querySelector('.streak-spotlight')
    expect(spotlight.textContent).toContain('walk')
    expect(spotlight.textContent).toContain('5')

    // The visit does not follow you here, and a click escapes onto the
    // week itself.
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(spotlight)
    expect(document.querySelector('.streak-spotlight')).toBeNull()
    expect(screen.getByRole('table')).toBeDefined()
  })

  it('no win, no cameo — the plain day stays calm', () => {
    seedWorld('cameo-seed', {
      completions: [
        {
          id: 'f1',
          habitId: 'walk',
          recordedAt: 1,
          dayKey: '2026-07-14',
          drops: [{ kind: 'friend', category: 0, individual: 1 }],
        },
      ],
    })
    render(<App />)
    settleStartup()
    expect(screen.queryByRole('status')).toBeNull()
  })
})

// Starting over (T6.6) — since 2026-08-12 the button opens a popup that
// asks WHICH kind of fresh start, then asks "are you sure?". Two doors:
// "total refresh" empties Habitat completely, "keep habit data" wipes
// only the world. The words below are pinned by Kimia's spec decision,
// so the tests may name them.
describe('start a new game (T6.6)', () => {
  const stored = () => JSON.parse(localStorage.getItem('habitat-data'))
  const meters = () => within(screen.getByRole('region', { name: 'meters' }))
  const stepsBar = () =>
    meters().getByRole('progressbar', { name: 'steps taken progress' })
  const newGameButton = () =>
    screen.getByRole('button', { name: 'start a new game' })
  const dialog = () =>
    screen.queryByRole('dialog', { name: 'start a new game' })
  const press = (name) => fireEvent.click(screen.getByRole('button', { name }))

  // jsdom has no real download, so the export click needs these stubs;
  // what matters is that it flips the guard, not that a file lands.
  function exportBackup() {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: 'export backup' }))
  }

  // The whole journey through the door, both steps.
  function startNewGame(choice) {
    fireEvent.click(newGameButton())
    press(choice)
    press('yes')
  }

  it('opens a popup offering both kinds of fresh start', () => {
    render(<App />)
    createHabitViaUI('walk')
    expect(dialog()).toBeNull()

    fireEvent.click(newGameButton())
    const asked = within(dialog())
    expect(asked.getByRole('button', { name: 'total refresh' })).toBeDefined()
    expect(asked.getByRole('button', { name: 'keep habit data' })).toBeDefined()
  })

  it('"keep habit data" waits for a backup exported in this visit', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(newGameButton())
    const keep = () => screen.getByRole('button', { name: 'keep habit data' })
    expect(keep().disabled).toBe(true)
    // A disabled button fires no hover events, so the explanation sits
    // on the span around it.
    expect(keep().parentElement.title).toBe('export a backup first')
    // The other door carries no such guard.
    expect(screen.getByRole('button', { name: 'total refresh' }).disabled).toBe(
      false,
    )

    press('not now')
    exportBackup()
    fireEvent.click(newGameButton())
    expect(keep().disabled).toBe(false)
    expect(keep().parentElement.title).toBe('')
  })

  it('a fresh visit disables it again — an old export is no promise', () => {
    render(<App />)
    createHabitViaUI('walk')
    exportBackup()
    fireEvent.click(newGameButton())
    expect(
      screen.getByRole('button', { name: 'keep habit data' }).disabled,
    ).toBe(false)

    cleanup()
    render(<App />)
    fireEvent.click(newGameButton())
    expect(
      screen.getByRole('button', { name: 'keep habit data' }).disabled,
    ).toBe(true)
  })

  it('"not now" closes the popup and changes nothing', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    const before = stored()

    fireEvent.click(newGameButton())
    press('not now')

    expect(dialog()).toBeNull()
    expect(stored()).toEqual(before)
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('1')
  })

  it('"no, take me back" returns to the choice and changes nothing', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    const before = stored()

    fireEvent.click(newGameButton())
    press('total refresh')
    press('no, take me back')

    // Back on the first step, still inside the popup.
    expect(
      within(dialog()).getByRole('button', { name: 'total refresh' }),
    ).toBeDefined()
    expect(stored()).toEqual(before)
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('1')
  })

  it('keeping habit data wipes the world but keeps every habit and mark', () => {
    render(<App />)
    createHabitViaUI('walk')
    for (let i = 0; i < 3; i++) {
      fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    }
    exportBackup()
    const before = stored()
    expect(before.completions).toHaveLength(3)
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('3')

    startNewGame('keep habit data')

    const after = stored()
    // The habit record survives whole, mark for mark and day for day.
    expect(after.habits).toEqual(before.habits)
    expect(after.completions).toHaveLength(3)
    expect(after.completions.map((c) => c.dayKey)).toEqual(
      before.completions.map((c) => c.dayKey),
    )
    // The world does not: no drops, nothing owned, a new seed, and the
    // counted meter back at zero on screen.
    expect(after.completions.every((c) => c.drops.length === 0)).toBe(true)
    expect(after.purchases).toEqual([])
    expect(after.floraDecisions).toEqual({})
    expect(after.worldSeed).not.toBe(before.worldSeed)
    expect(after.completions.every((c) => c.pastGame === true)).toBe(true)
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
  })

  it('the habit list is still there, and marks made after it count again', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    exportBackup()
    startNewGame('keep habit data')

    expect(screen.getByText('walk')).toBeDefined()
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('1')
    expect(stored().completions).toHaveLength(2)
  })

  it('survives a reload — the new game is remembered, not just on screen', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    exportBackup()
    startNewGame('keep habit data')

    cleanup()
    render(<App />)
    expect(screen.getByText('walk')).toBeDefined()
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
  })

  // The second door (Kimia's call 2026-08-12): a total refresh leaves
  // nothing behind at all — habits included — so Habitat starts exactly
  // as it did on its very first day.
  it('a total refresh empties Habitat completely', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(stored().habits).toHaveLength(1)

    startNewGame('total refresh')

    // Nothing stored, nothing on screen, no history to count.
    expect(localStorage.getItem('habitat-data')).toBeNull()
    expect(screen.queryByText('walk')).toBeNull()
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')

    // And it stays gone across a reload.
    cleanup()
    render(<App />)
    expect(screen.queryByText('walk')).toBeNull()
    expect(stepsBar().getAttribute('aria-valuenow')).toBe('0')
  })

  it('a total refresh needs no export first', () => {
    render(<App />)
    createHabitViaUI('walk')
    startNewGame('total refresh')
    expect(screen.queryByText('walk')).toBeNull()
  })

  it('a habit made after a total refresh saves cleanly', () => {
    render(<App />)
    createHabitViaUI('walk')
    startNewGame('total refresh')

    createHabitViaUI('swim')
    const after = stored()
    expect(after.habits.map((h) => h.name)).toEqual(['swim'])
    expect(after.completions).toEqual([])
  })
})

// The home screen and the field notes are a pair (Kimia's call
// 2026-08-12): each ends with the wide door to the other, and then with
// the same three buttons.
describe('the two pages point at each other (2026-08-12)', () => {
  const footerNames = () =>
    [...document.querySelector('.list-footer').querySelectorAll('button')].map(
      (button) => button.textContent,
    )

  it('the home screen has a wide door to the field notes', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data →' }),
    )
    expect(screen.getByRole('region', { name: 'field notes' })).toBeDefined()
  })

  it('that door sits directly above the three footer buttons', () => {
    render(<App />)
    createHabitViaUI('walk')
    const door = screen.getByRole('button', { name: 'view historical data →' })
    expect(door.nextElementSibling.className).toBe('list-footer')
  })

  it('the field notes carry the same three buttons under the back button', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data →' }),
    )

    const back = screen.getByRole('button', { name: '← back to the habits' })
    expect(back.nextElementSibling.className).toBe('list-footer')
    expect(footerNames()).toEqual([
      'export backup',
      'import backup',
      'start a new game',
    ])
  })

  it('the back button returns to the habits', () => {
    render(<App />)
    createHabitViaUI('walk')
    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data →' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )
    expect(screen.getByText('walk')).toBeDefined()
  })
})

// The rail took the three doers in (Kimia's call 2026-08-12): + , the
// pencil and the graph left the foot of the habit list and joined the
// left rail above the five world pages, keeping their order, their hover
// labels and their conditions.
describe('the rail carries the doers too (2026-08-12)', () => {
  const railNames = () =>
    [
      ...screen
        .getByRole('navigation', { name: 'pages' })
        .querySelectorAll('button'),
    ].map((button) => button.getAttribute('aria-label'))

  it('lists the three doers first, in the order they had at the foot', () => {
    seedWorld('rail-doers')
    render(<App />)
    settleStartup()
    expect(railNames()).toEqual([
      'add new habit',
      'edit past days',
      'view historical data',
      'map of N-Z-D',
      'your abode',
      'local community',
      'readers library',
      'local market',
    ])
  })

  it('leaves the pencil out while no past day is editable', () => {
    render(<App />)
    createHabitViaUI('walk') // created today: no past day it existed on
    expect(railNames()).not.toContain('edit past days')
    expect(railNames()).toContain('add new habit')
  })

  it('nothing is left in a row at the foot of the list', () => {
    seedWorld('rail-doers')
    render(<App />)
    settleStartup()
    expect(document.querySelector('.list-actions')).toBeNull()
  })

  it('+ from a world page carries us home with a draft open', () => {
    seedWorld('rail-doers')
    render(<App />)
    settleStartup()
    const rail = () => within(screen.getByRole('navigation', { name: 'pages' }))
    fireEvent.click(rail().getByRole('button', { name: 'local market' }))
    expect(screen.getByRole('heading', { name: 'local market' })).toBeDefined()

    fireEvent.click(rail().getByRole('button', { name: 'add new habit' }))
    // Home, with the form standing where the market page was.
    expect(screen.queryByRole('heading', { name: 'local market' })).toBeNull()
    expect(document.querySelector('form.habit-form')).not.toBeNull()
  })

  it('the graph icon still opens the field notes', () => {
    seedWorld('rail-doers')
    render(<App />)
    settleStartup()
    fireEvent.click(
      screen.getByRole('button', { name: 'view historical data' }),
    )
    expect(screen.getByRole('region', { name: 'filter view' })).toBeDefined()
    expect(screen.getByRole('button', { name: /back to the habits/ }))
  })

  it('the pencil still opens the past-days check-in', () => {
    seedWorld('rail-doers')
    render(<App />)
    settleStartup()
    fireEvent.click(screen.getByRole('button', { name: 'edit past days' }))
    expect(screen.getByRole('region', { name: 'check-in' })).toBeDefined()
  })
})

// The invitation tile (Kimia's call 2026-08-12): an empty habit list
// holds a tile reading "add a habit or task…" rather than nothing, and
// clicking it is the same door as the rail's +.
describe('the empty-list invitation tile (2026-08-12)', () => {
  const tiles = () => screen.getAllByRole('button', { name: /add a habit/ })
  const charmOf = (button) => button.closest('li').className
  const filterView = () =>
    within(screen.getByRole('region', { name: 'filter view' }))
  // The charm the open draft is standing on, by the shape drawn on the
  // one pressed button in its picker (the charm names are §11a's, and
  // screen-reader/test only — nothing on screen says them).
  const draftCharm = () =>
    within(document.querySelector('form.habit-form'))
      .getAllByRole('button', { pressed: true })
      .map((button) => button.querySelector('svg').getAttribute('aria-label'))

  it('offers one neutral tile when there is nothing at all', () => {
    render(<App />)
    expect(tiles()).toHaveLength(1)
    // Neutral means no charm class on the row it sits in.
    expect(charmOf(tiles()[0])).not.toMatch(/charm-\d/)
  })

  it('clicking it opens the same draft form the + opens', () => {
    render(<App />)
    fireEvent.click(tiles()[0])
    expect(document.querySelector('form.habit-form')).not.toBeNull()
  })

  it('goes away as soon as a habit exists, and comes back when none do', () => {
    render(<App />)
    createHabitViaUI('walk')
    expect(screen.queryByRole('button', { name: /add a habit/ })).toBeNull()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fireEvent.click(row('walk').getByRole('button', { name: 'archive' }))
    settleFarewell()
    // Archived, so the live list is empty again — the invitation returns.
    expect(tiles()).toHaveLength(1)
  })

  it('wears one tile per chosen charm while a lens is on', () => {
    render(<App />)
    createHabitViaUI('walk', { symbol: 1 }) // crown
    // Two charms neither of which any habit wears: the list is empty.
    fireEvent.click(filterView().getByRole('button', { name: 'cherry' })) // 2
    fireEvent.click(filterView().getByRole('button', { name: 'key' })) // 6

    expect(tiles()).toHaveLength(2)
    expect(tiles().map(charmOf).join(' ')).toMatch(/charm-2/)
    expect(tiles().map(charmOf).join(' ')).toMatch(/charm-6/)
  })

  it('opens the draft on the charm of the tile that was clicked', () => {
    render(<App />)
    createHabitViaUI('walk', { symbol: 1 })
    fireEvent.click(filterView().getByRole('button', { name: 'cherry' })) // 2
    fireEvent.click(filterView().getByRole('button', { name: 'key' })) // 6

    // Two charms on, so the lens itself is no hint — the TILE is.
    const keyTile = tiles().find((t) => charmOf(t).includes('charm-6'))
    fireEvent.click(keyTile)
    expect(draftCharm()).toEqual(['key'])
  })

  it('a neutral tile leaves the form on its own default', () => {
    render(<App />)
    fireEvent.click(tiles()[0])
    expect(draftCharm()).toEqual(['crown']) // charm 1, the form's default
  })
})

// The foot of the home screen is three clean buttons (Kimia's call
// 2026-08-12): the two explanations that used to sit beside them as
// small grey text are hover labels now.
describe('the home screen foot (2026-08-12)', () => {
  // The backup guard moved INSIDE the popup on 2026-08-12: "start a new
  // game" always opens, and it is the "keep habit data" choice that
  // waits for an export (tested in the T6.6 block above).
  it('the foot itself explains nothing in text', () => {
    render(<App />)
    createHabitViaUI('walk')
    expect(screen.queryByText('export a backup first')).toBeNull()
    expect(
      screen.getByRole('button', { name: 'start a new game' }).disabled,
    ).toBe(false)
  })

  it('tells the age of the backup on hover, not in text', () => {
    render(<App />)
    createHabitViaUI('walk')
    const button = screen.getByRole('button', { name: 'export backup' })
    expect(button.title).toBe(backupAgeLabel(null, todayKey()))
    expect(screen.queryByText(button.title)).toBeNull()
  })

  it('keeps the three buttons on one line of their own', () => {
    render(<App />)
    createHabitViaUI('walk')
    const foot = document.querySelector('.list-footer')
    const named = [...foot.querySelectorAll('button')].map((b) => b.textContent)
    expect(named).toEqual([
      'export backup',
      'import backup',
      'start a new game',
    ])
  })
})

describe('the language switch (T6.13)', () => {
  // These tests never assert a WORD. They assert that the choice is
  // recorded, that it survives, and that a blank slot still shows
  // something — the mechanism, not the copy.

  const switchTo = (code) => {
    const group = document.querySelector('.language-switch')
    const option = [...group.querySelectorAll('button')].find(
      (b) => b.lang === code,
    )
    fireEvent.click(option)
    return option
  }

  it('offers one option per language, with the current one marked', () => {
    render(<App />)
    createHabitViaUI('walk')
    const options = [...document.querySelectorAll('.language-switch button')]
    expect(options).toHaveLength(LANGUAGES.length)
    const pressed = options.filter(
      (b) => b.getAttribute('aria-pressed') === 'true',
    )
    expect(pressed).toHaveLength(1)
    expect(pressed[0].lang).toBe('en')
  })

  it('records the choice in settings, where a backup will carry it', () => {
    render(<App />)
    createHabitViaUI('walk')
    switchTo('fa')
    expect(loadData().settings.language).toBe('fa')
  })

  it('opens in the language it was left in', () => {
    render(<App />)
    createHabitViaUI('walk')
    switchTo('fa')
    cleanup()
    render(<App />)
    const pressed = document.querySelector(
      '.language-switch button[aria-pressed="true"]',
    )
    expect(pressed.lang).toBe('fa')
  })

  it('names each language in its own script, whichever one is on', () => {
    // The way back. Someone who lands in a language they cannot read
    // must still recognise their own — so neither name is translated,
    // and both read the same either way.
    render(<App />)
    createHabitViaUI('walk')
    const before = [
      ...document.querySelectorAll('.language-switch button'),
    ].map((b) => b.textContent)
    switchTo('fa')
    const after = [...document.querySelectorAll('.language-switch button')].map(
      (b) => b.textContent,
    )
    expect(after).toEqual(before)
  })

  it('keeps every control worded while the Farsi slots are blank', () => {
    // The fallback, seen from the outside: switching to a language whose
    // slots are empty must leave the app fully usable, not silent. The
    // rail is the check because it is on every screen.
    render(<App />)
    createHabitViaUI('walk')
    switchTo('fa')
    const rail = document.querySelector('.icon-rail')
    for (const icon of rail.querySelectorAll('button')) {
      expect(icon.getAttribute('aria-label')).toBeTruthy()
    }
  })
})

// The DEFAULT VIEW (T6.23e, spec §5b) — the arrangement Habitat opens
// on, and the one press that writes it down.
//
// Design mode was retired on 2026-08-21 in favour of this: one word,
// `save as default`, and a confirm. What survived the simplification is
// the reason it existed — dragging never commits, so a re-order stays
// "throwaway and flexible, without fear of commitment" (Kimia).
//
// The controls are found by their data-lens name, never by Kimia's
// words, and the confirm is stubbed rather than read.
describe('the default view (T6.23e)', () => {
  const names = () =>
    [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
  const lens = (name) => document.querySelector(`[data-lens="${name}"]`)
  const isMuted = (name) => tile(name).className.includes('habit-row--muted')
  const eye = (name) =>
    tile(name).querySelector('.row-buttons button:first-child')
  const charms = () =>
    within(screen.getByRole('region', { name: 'filter view' }))

  // Drag 'one' (top of three 40px rows at y 0/50/100) down onto 'three'.
  function dragOneToTheBottom() {
    const drag = layOutRows('one')
    fireEvent.pointerDown(tile('one'), { button: 0, clientX: 0, clientY: 5 })
    drag.offset = 100
    fireEvent.pointerMove(window, { clientX: 0, clientY: 105 })
    fireEvent.pointerUp(window, { clientX: 0, clientY: 105 })
  }

  function three() {
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')
  }

  it('saves the order, the charms and the mutings, and reopens on them', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const first = render(<App />)
    createHabitViaUI('one', { symbol: 2 })
    createHabitViaUI('two', { symbol: 2 })
    createHabitViaUI('three', { symbol: 2 })

    dragOneToTheBottom()
    fireEvent.click(eye('two'))
    fireEvent.click(charms().getByRole('button', { name: 'cherry' })) // 2
    fireEvent.click(lens('save-as-default'))

    first.unmount()
    render(<App />)
    // 'one' was dragged to the foot, then muting 'two' sank it below the
    // last tile still in the eyeline — which is 'one' (T6.23a).
    expect(names()).toEqual(['three', 'one', 'two'])
    expect(isMuted('two')).toBe(true)
    expect(
      charms()
        .getByRole('button', { name: 'cherry' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  it('asks before it overwrites, and saves nothing when told no', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const first = render(<App />)
    three()

    dragOneToTheBottom()
    expect(names()).toEqual(['two', 'three', 'one'])
    fireEvent.click(lens('save-as-default'))
    expect(confirm).toHaveBeenCalled()

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['one', 'two', 'three'])
  })

  // `default` is the press back at any time; a refresh does the same
  // thing by itself, which is the test above.
  it('puts the saved view back at any time', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    three()

    fireEvent.click(eye('two'))
    fireEvent.click(lens('save-as-default'))
    const saved = names()

    // Fiddle with all three parts of the arrangement…
    dragOneToTheBottom()
    fireEvent.click(eye('two')) // un-mute
    fireEvent.click(lens('today')) // hides the whenever-nots, mutes others
    expect(names()).not.toEqual(saved)

    fireEvent.click(lens('default'))
    expect(names()).toEqual(saved)
    expect(isMuted('two')).toBe(true)
    expect(isMuted('one')).toBe(false)
  })

  // A new player's default view is decided for them: the order the
  // habits were created in, no charms, nothing muted. So `default`
  // works before anything has ever been saved.
  it('reads a never-saved default as the plain, unarranged list', () => {
    render(<App />)
    three()
    dragOneToTheBottom()
    fireEvent.click(eye('two'))

    fireEvent.click(lens('default'))
    expect(names()).toEqual(['one', 'two', 'three'])
    expect(isMuted('two')).toBe(false)
  })

  // A saved view you cannot find your habits in is a trap (Kimia's
  // reasoning 2026-08-20), so hidden is not one of the three things a
  // default holds — anything hidden when you save comes back MUTED,
  // both on screen straight away and on the next visit.
  it('saves anything hidden as muted instead, and unhides on the spot', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const first = render(<App />)
    createHabitViaUI('daily')
    createHabitViaUI('mondays', { scheduleType: 'weekdays', days: ['Mon'] })

    fireEvent.click(lens('today')) // Thursday: 'mondays' is hidden
    expect(names()).toEqual(['daily'])

    fireEvent.click(lens('save-as-default'))
    expect(names()).toEqual(['daily', 'mondays'])
    expect(isMuted('mondays')).toBe(true)

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['daily', 'mondays'])
    expect(isMuted('mondays')).toBe(true)
  })

  // Kimia's call 2026-08-21: a mute is a note about a tile, so with the
  // tile deleted the note means nothing.
  it('reads a mute pointing at a deleted habit as no mute', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const first = render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')

    fireEvent.click(eye('one'))
    fireEvent.click(lens('save-as-default'))

    fireEvent.click(row('one').getByRole('button', { name: 'archive' }))
    settleFarewell()
    const drawer = screen.getByText(/^archived/).closest('details')
    fireEvent.click(
      within(drawer).getByRole('button', { name: 'delete forever' }),
    )

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['two'])
    expect(isMuted('two')).toBe(false)
  })

  // The tier decided 2026-08-12 for the charm lens and inherited whole:
  // the default view describes a BROWSER, so both new-game doors clear
  // it — the older exception, where only a total refresh did, is gone.
  it('is cleared by the keep-habit-data new-game door too', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<App />)
    createHabitViaUI('one', { symbol: 2 })
    createHabitViaUI('two', { symbol: 2 })

    fireEvent.click(eye('one'))
    fireEvent.click(charms().getByRole('button', { name: 'cherry' }))
    fireEvent.click(lens('save-as-default'))

    // The door, driven the way its own tests do: "keep habit data" waits
    // for a backup exported in this visit, then asks "are you sure?".
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const press = (name) =>
      fireEvent.click(screen.getByRole('button', { name }))
    press('export backup')
    press('start a new game')
    press('keep habit data')
    press('yes')

    expect(loadDefaultView()).toEqual({ charms: [], muted: [] })
    expect(isMuted('one')).toBe(false)
    expect(
      charms()
        .getByRole('button', { name: 'cherry' })
        .getAttribute('aria-pressed'),
    ).toBe('false')
  })
})
