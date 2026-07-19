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
import { floraTargetStep, rollFungi, rollReading } from './game/drops.js'

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
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// Drive the real form the way a user would. Options beyond a name are
// optional; the form's defaults (symbol 1, medium, daily) fill the rest.
function createHabitViaUI(name, { symbol, scheduleType, n, days } = {}) {
  fireEvent.click(screen.getByRole('button', { name: '+ new habit' }))
  const form = within(document.querySelector('form.habit-form'))
  fireEvent.change(form.getByLabelText('name'), { target: { value: name } })
  if (symbol) {
    const glyphs = { 1: '●', 2: '■', 3: '▲', 4: '◆', 5: '✚', 6: '✶' }
    fireEvent.click(form.getByRole('button', { name: glyphs[symbol] }))
  }
  if (scheduleType) {
    fireEvent.change(form.getByLabelText('schedule'), {
      target: { value: scheduleType },
    })
  }
  if (n) {
    fireEvent.change(form.getByLabelText('how many'), {
      target: { value: String(n) },
    })
  }
  for (const day of days ?? []) {
    fireEvent.click(form.getByLabelText(day))
  }
  fireEvent.click(form.getByRole('button', { name: 'save' }))
}

// The <li> row a habit is displayed in, found by its name.
function row(name) {
  return within(screen.getByText(name).closest('li'))
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
  it('a daily habit counts up from 0/1, and undo takes a mark back', () => {
    render(<App />)
    createHabitViaUI('meditate')

    // The counter (T3.2b): no toggle — a running count with +1 and undo.
    expect(row('meditate').getByText('0/1 today')).toBeDefined()
    expect(row('meditate').getByRole('button', { name: 'undo' }).disabled).toBe(
      true,
    )

    fireEvent.click(row('meditate').getByRole('button', { name: '+1' }))
    expect(row('meditate').getByText('✓ 1/1 today')).toBeDefined()

    fireEvent.click(row('meditate').getByRole('button', { name: 'undo' }))
    expect(row('meditate').getByText('0/1 today')).toBeDefined()
  })

  it('an N-per-day habit counts up and undoes one at a time', () => {
    render(<App />)
    createHabitViaUI('water', { scheduleType: 'nPerDay', n: 3 })

    expect(row('water').getByText('0/3 today')).toBeDefined()
    fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    expect(row('water').getByText('2/3 today')).toBeDefined()
    fireEvent.click(row('water').getByRole('button', { name: 'undo' }))
    expect(row('water').getByText('1/3 today')).toBeDefined()
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
    expect(row('stretch').getByText('✓ 3/1 today')).toBeDefined()

    // All three marks belong to today (Thu 16 July, the pinned clock),
    // and every tap advanced the expedition meter.
    expect(stored().completions.map((c) => c.dayKey)).toEqual([
      '2026-07-16',
      '2026-07-16',
      '2026-07-16',
    ])
    const meters = within(screen.getByRole('region', { name: 'meters' }))
    expect(meters.getByText('3 steps')).toBeDefined()

    // Undoing one extra keeps the day fulfilled — thresholds unchanged.
    fireEvent.click(row('stretch').getByRole('button', { name: 'undo' }))
    expect(row('stretch').getByText('✓ 2/1 today')).toBeDefined()
  })

  it('whenever and N-per-week show a plain count — no per-day goal', () => {
    render(<App />)
    createHabitViaUI('tidy', { scheduleType: 'whenever' })
    createHabitViaUI('swim', { scheduleType: 'nPerWeek', n: 3 })

    expect(row('tidy').getByText('0 today')).toBeDefined()
    expect(row('swim').getByText('0 today')).toBeDefined()

    fireEvent.click(row('tidy').getByRole('button', { name: '+1' }))
    fireEvent.click(row('swim').getByRole('button', { name: '+1' }))
    fireEvent.click(row('swim').getByRole('button', { name: '+1' }))

    expect(row('tidy').getByText('1 today')).toBeDefined()
    expect(row('swim').getByText('2 today')).toBeDefined()

    // Every one of those taps counted toward the expedition meter.
    const meters = within(screen.getByRole('region', { name: 'meters' }))
    expect(meters.getByText('3 steps')).toBeDefined()
  })

  it('a weekdays habit gets the same counter on its scheduled day', () => {
    // The pinned clock is Thursday, so schedule Thursdays.
    render(<App />)
    createHabitViaUI('gym', { scheduleType: 'weekdays', days: ['Thu'] })
    expect(row('gym').getByText('0/1 today')).toBeDefined()
    fireEvent.click(row('gym').getByRole('button', { name: '+1' }))
    fireEvent.click(row('gym').getByRole('button', { name: '+1' }))
    expect(row('gym').getByText('✓ 2/1 today')).toBeDefined()
  })

  it('a one-time to-do keeps its single-tap control — no counter', () => {
    render(<App />)
    createHabitViaUI('fix tap', { scheduleType: 'oneTime' })
    expect(row('fix tap').getByRole('button', { name: 'mark done' }))
    expect(row('fix tap').queryByRole('button', { name: '+1' })).toBeNull()
    expect(row('fix tap').queryByText(/today/)).toBeNull()
  })
})

describe('the symbol filter (a temporary lens)', () => {
  it('shows only chosen symbols and pauses re-ordering', () => {
    render(<App />)
    createHabitViaUI('read', { symbol: 2 })
    createHabitViaUI('stretch', { symbol: 5 })

    const filter = within(screen.getByRole('region', { name: 'filter' }))
    fireEvent.click(filter.getByRole('button', { name: '■' })) // symbol 2
    expect(screen.getByText('read')).toBeDefined()
    expect(screen.queryByText('stretch')).toBeNull()
    // While filtered, the ▲▼ buttons are off (partial view = ambiguous).
    expect(row('read').getByRole('button', { name: '▲' }).disabled).toBe(true)

    fireEvent.click(filter.getByRole('button', { name: '■' })) // toggle off
    expect(screen.getByText('stretch')).toBeDefined()
  })
})

describe('re-ordering', () => {
  it('▼ moves a habit down and the order survives a reload', () => {
    const first = render(<App />)
    createHabitViaUI('one')
    createHabitViaUI('two')
    createHabitViaUI('three')

    fireEvent.click(row('one').getByRole('button', { name: '▼' }))

    const names = () =>
      [...document.querySelectorAll('.habit-name')].map((el) => el.textContent)
    expect(names()).toEqual(['two', 'one', 'three'])

    first.unmount()
    render(<App />)
    expect(names()).toEqual(['two', 'one', 'three'])
  })
})

describe('editing', () => {
  it('edit changes the name in place', () => {
    render(<App />)
    createHabitViaUI('jurnal')
    fireEvent.click(row('jurnal').getByRole('button', { name: 'edit' }))
    const form = within(document.querySelector('form.habit-form'))
    fireEvent.change(form.getByLabelText('name'), {
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
    createHabitViaUI('floss')
    fireEvent.click(row('floss').getByRole('button', { name: 'archive' }))

    // Gone from the daily list, present in the archived section.
    const archived = within(screen.getByText(/^archived/).closest('details'))
    expect(archived.getByText('floss')).toBeDefined()

    fireEvent.click(archived.getByRole('button', { name: 'unarchive' }))
    expect(row('floss').getByRole('button', { name: '+1' }))
  })

  it('delete forever asks first, and cancel keeps everything', () => {
    render(<App />)
    createHabitViaUI('typo habit')
    fireEvent.click(row('typo habit').getByRole('button', { name: 'archive' }))

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
      row('renew passport').getByRole('button', { name: 'mark done' }),
    )

    // Gone from the daily list, sitting in archived with an undo button.
    expect(screen.queryByText('one-time · medium')).toBeNull()
    const archived = within(screen.getByText(/^archived/).closest('details'))
    expect(archived.getByText('renew passport')).toBeDefined()

    // Undo: un-archived AND un-done, as if the tap never happened.
    fireEvent.click(archived.getByRole('button', { name: 'undo' }))
    expect(row('renew passport').getByRole('button', { name: 'mark done' }))
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
    expect(archived.queryByRole('button', { name: 'undo' })).toBeNull()
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

    const archived = within(screen.getByText(/^archived/).closest('details'))
    fireEvent.click(archived.getByRole('button', { name: 'unarchive' }))
    expect(row('call the bank').getByRole('button', { name: 'mark done' }))
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

    // The check-in IS the screen — the list is waiting behind it.
    expect(screen.getByText('check-in')).toBeDefined()
    expect(screen.queryByRole('button', { name: '+ new habit' })).toBeNull()

    // Yesterday (Wed the 15th) is the question; the frozen previous
    // week is not offered at all.
    expect(screen.getByText(/yesterday, Wed 2026-07-15/)).toBeDefined()
    expect(screen.queryByText(/2026-07-12/)).toBeNull()

    // Mark yesterday's walk (the first row is yesterday's; the
    // optional days are listed after it)…
    fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])

    // …and backfill Tuesday from the optional section.
    const tuesday = within(
      screen.getByText('Tue 2026-07-14').closest('details'),
    )
    fireEvent.click(tuesday.getByRole('button', { name: '+1' }))

    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )

    // Back on the list, and the data says what really happened: the
    // marks belong to the days they were DONE, entry day nowhere.
    expect(screen.getByRole('button', { name: '+ new habit' })).toBeDefined()
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
    // undo — the surviving two marks both belong to Wed the 15th.
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
    }
    expect(screen.getByText('✓ 3/1')).toBeDefined()
    fireEvent.click(screen.getAllByRole('button', { name: 'undo' })[0])
    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )
    expect(stored().completions.map((c) => c.dayKey)).toEqual([
      '2026-07-15',
      '2026-07-15',
    ])
  })

  it('leaving everything unmarked is a fine answer — saved as answered, nothing recorded', () => {
    seed()
    render(<App />)
    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )
    expect(stored().completions).toEqual([])
    expect(stored().checkedInThrough).toBe('2026-07-15')
    // A reload does not ask again.
    cleanup()
    render(<App />)
    expect(screen.queryByText('check-in')).toBeNull()
  })

  it('stays quiet when yesterday was already done, but past days remain editable by hand', () => {
    seed({
      completions: [
        { id: 'c1', habitId: 'walk', recordedAt: 5, dayKey: '2026-07-15' },
      ],
    })
    render(<App />)

    // No check-in — straight to the list.
    expect(screen.queryByText('check-in')).toBeNull()

    // But the week's earlier days can still be opened and edited.
    fireEvent.click(screen.getByRole('button', { name: 'edit past days' }))
    const monday = within(screen.getByText('Mon 2026-07-13').closest('details'))
    fireEvent.click(monday.getByRole('button', { name: '+1' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )
    expect(
      stored()
        .completions.map((c) => c.dayKey)
        .sort(),
    ).toEqual(['2026-07-13', '2026-07-15'])
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
    expect(screen.queryByText('check-in')).toBeNull()

    // The tab sits in the background until 4am — past the 3am cutoff,
    // so a new Habitat day (Friday) has begun and Thursday went
    // unmarked. Coming back to the tab re-checks the clock…
    vi.setSystemTime(new Date(2026, 6, 17, 4, 0))
    fireEvent(document, new Event('visibilitychange'))

    // …and the page behaves exactly like a fresh visit: the check-in
    // opens, asking about the real yesterday (Thursday the 16th).
    expect(screen.getByText('check-in')).toBeDefined()
    expect(screen.getByText(/yesterday, Thu 2026-07-16/)).toBeDefined()
  })

  it('even without focusing, the minute-tick notices the rollover', () => {
    vi.setSystemTime(new Date(2026, 6, 16, 23, 30))
    seed()
    render(<App />)
    expect(screen.queryByText('check-in')).toBeNull()

    // Let the page's own clock tick past the 3am boundary (fake timers
    // advance Date.now() and fire the interval together).
    act(() => {
      vi.advanceTimersByTime(4.5 * 60 * 60 * 1000) // 11:30pm → 4am
    })
    expect(screen.getByText('check-in')).toBeDefined()
    expect(screen.getByText(/yesterday, Thu 2026-07-16/)).toBeDefined()
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
    expect(row('walk').getByText('✓ 1/1 today')).toBeDefined()

    act(() => {
      vi.advanceTimersByTime(4.5 * 60 * 60 * 1000)
    })
    expect(screen.queryByText('check-in')).toBeNull()
    expect(row('walk').getByText('0/1 today')).toBeDefined()
  })
})

describe('the three meters (T2.2)', () => {
  // The meters section at the top of the list.
  const meters = () => within(screen.getByRole('region', { name: 'meters' }))
  const expeditionBar = () =>
    meters().getByRole('progressbar', { name: 'expedition progress' })

  it('shows all three meters, empty on a fresh start', () => {
    render(<App />)
    expect(meters().getByText('0 steps')).toBeDefined()
    expect(meters().getByText('0/10 doors')).toBeDefined()
    expect(meters().getByText('in the wallet')).toBeDefined()
    expect(expeditionBar().getAttribute('aria-valuenow')).toBe('0')
  })

  it('completing a habit visibly moves the expedition meter; undo moves it back', () => {
    render(<App />)
    createHabitViaUI('walk')

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(meters().getByText('1 step')).toBeDefined()
    expect(expeditionBar().getAttribute('aria-valuenow')).toBe('1')

    // Undo reverses the meter exactly (decision 2026-07-15).
    fireEvent.click(row('walk').getByRole('button', { name: 'undo' }))
    expect(meters().getByText('0 steps')).toBeDefined()
    expect(expeditionBar().getAttribute('aria-valuenow')).toBe('0')
  })

  it('extras beyond an N-per-day target keep moving the meter — every tap counts', () => {
    render(<App />)
    createHabitViaUI('water', { scheduleType: 'nPerDay', n: 2 })
    for (let i = 0; i < 3; i++) {
      fireEvent.click(row('water').getByRole('button', { name: '+1' }))
    }
    expect(meters().getByText('3 steps')).toBeDefined()
  })

  it('each meter opens its placeholder page, and back returns to the list', () => {
    render(<App />)
    createHabitViaUI('walk')

    fireEvent.click(meters().getByRole('button', { name: /expedition/ }))
    expect(screen.getByText('the Map')).toBeDefined()
    expect(screen.queryByText('walk')).toBeNull() // the list waits behind
    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )
    expect(screen.getByText('walk')).toBeDefined()

    fireEvent.click(meters().getByRole('button', { name: /literacy/ }))
    expect(screen.getByText('the Bookcase')).toBeDefined()
    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )

    fireEvent.click(meters().getByRole('button', { name: /fungi/ }))
    expect(screen.getByText('the Market')).toBeDefined()
  })

  it('the HABITAT header is a home link from every meter page (added 2026-07-16)', () => {
    render(<App />)
    createHabitViaUI('walk')

    for (const meter of [/expedition/, /literacy/, /fungi/]) {
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
    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )

    expect(meters().getByText('1 step')).toBeDefined()
    vi.useRealTimers()
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

    fireEvent.click(screen.getByRole('button', { name: 'field notes' }))
    // Opens on the last completed week, where Wednesday the 8th shows ✓.
    expect(screen.getByText(/week of 2026-07-06 – 2026-07-12/)).toBeDefined()
    expect(screen.getByText('✓')).toBeDefined()

    // Browsing: forward to the current (still unfolding) week, no further.
    fireEvent.click(screen.getByRole('button', { name: 'later ›' }))
    expect(screen.getByText(/week of 2026-07-13/)).toBeDefined()
    expect(screen.getByText(/still unfolding/)).toBeDefined()
    expect(screen.getByRole('button', { name: 'later ›' })).toHaveProperty(
      'disabled',
      true,
    )

    fireEvent.click(
      screen.getByRole('button', { name: '← back to the habits' }),
    )
    expect(screen.getByRole('button', { name: '+ new habit' })).toBeDefined()
  })

  it('opens by itself on the first visit of a Sunday — and only the first', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 19, 12)) // Sunday the 19th, noon
    seed({ checkedInThrough: '2026-07-18' }) // Saturday answered

    const first = render(<App />)
    expect(screen.getByRole('heading', { name: 'field notes' })).toBeDefined()
    expect(stored().settings.fieldNotesShownOn).toBe('2026-07-19')

    // A second visit the same Sunday goes straight to the list.
    first.unmount()
    render(<App />)
    expect(screen.queryByRole('heading', { name: 'field notes' })).toBeNull()
  })

  it('the Sunday opening waits its turn behind the check-in', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 19, 12)) // Sunday the 19th
    seed() // Saturday unanswered → the check-in must come first

    render(<App />)
    expect(screen.getByText('check-in')).toBeDefined()
    expect(screen.queryByRole('heading', { name: 'field notes' })).toBeNull()

    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )
    expect(screen.getByRole('heading', { name: 'field notes' })).toBeDefined()
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
    fireEvent.change(form().getByLabelText('schedule'), {
      target: { value: 'nPerWeek' },
    })
    fireEvent.change(form().getByLabelText('how many'), {
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
      screen.getByRole('dialog', { name: 'your first flora find' }),
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
    fireEvent.click(row('walk').getByRole('button', { name: 'undo' }))
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()
    expect(screen.queryByText('you came across a flora find')).toBeNull()
    expect(stored().completions).toEqual([])
  })

  it('fungi go straight to the wallet, and undo takes them back out', () => {
    seedWorld(findSeed('2026-07-16', 'fungi'))
    render(<App />)
    const wallet = () => document.querySelector('.meter-wallet').textContent
    expect(wallet()).toBe('0')

    fireEvent.click(row('walk').getByRole('button', { name: '+1' }))
    expect(
      screen.getByRole('dialog', { name: 'your first fungi' }),
    ).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'onward' }))

    const [drop] = stored().completions[0].drops
    expect(drop.kind).toBe('fungi')
    expect(wallet()).toBe(String(drop.amount))

    fireEvent.click(row('walk').getByRole('button', { name: 'undo' }))
    expect(wallet()).toBe('0')
  })

  it('check-in marks earn drops too, but their arrivals wait for the done button', () => {
    // Yesterday (Wed the 15th) unanswered → the check-in opens; its
    // retro mark on the 15th is expedition step 0 and rolls flora.
    seedWorld(findSeed('2026-07-15', 'flora'), { checkedInThrough: null })
    render(<App />)
    expect(screen.getByText('check-in')).toBeDefined()

    fireEvent.click(screen.getAllByRole('button', { name: '+1' })[0])
    // Distraction-free while answering: no reveal, no shelf.
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.queryByRole('region', { name: 'arrivals' })).toBeNull()

    fireEvent.click(
      screen.getByRole('button', { name: 'done — save check-in' }),
    )
    // Now everything arrives together — the reveal first, the shelf
    // and the quiet note behind it.
    expect(
      screen.getByRole('dialog', { name: 'your first flora find' }),
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

  it('the Bookcase lists what was received and re-opens the popup, anytime', () => {
    dropOne('magazine')
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'read later' }))
    const before = rawStored()

    // The literacy meter leads to the early Bookcase list…
    fireEvent.click(
      within(screen.getByRole('region', { name: 'meters' })).getByRole(
        'button',
        { name: /literacy/ },
      ),
    )
    const list = within(screen.getByRole('list', { name: 'reading material' }))
    expect(list.getByText('a magazine')).toBeDefined()
    expect(list.getByText('found 2026-07-16')).toBeDefined()

    // …where any publication is re-readable — with still nothing
    // stored about it, ever (no read/unread state exists).
    fireEvent.click(list.getByRole('button', { name: 'read' }))
    expect(screen.getByRole('dialog', { name: 'a magazine' })).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    expect(rawStored()).toBe(before)
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
  const abode = () => within(screen.getByText('the Abode').closest('section'))

  it('a held flora offers gather / leave it; gathering shelves it in the Abode', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()

    // Hold the arrival: alongside its name, the two quiet choices.
    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    expect(decisions()).toEqual(['gathered'])

    // The Abode lists it under gathered, dated with the day it dropped.
    fireEvent.click(screen.getByRole('button', { name: 'the abode' }))
    const gathered = within(
      screen.getByRole('list', { name: 'gathered flora' }),
    )
    expect(gathered.getByText('a flora find')).toBeDefined()
    expect(gathered.getByText('found 2026-07-16')).toBeDefined()
  })

  it('an undecided flora simply waits on the Abode page — and can be left from there', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()

    // No decision made. The find waits, quietly, on the Abode page.
    fireEvent.click(screen.getByRole('button', { name: 'the abode' }))
    const waiting = within(
      screen.getByRole('list', { name: 'waiting to decide' }),
    )
    expect(waiting.getByText('a flora find')).toBeDefined()

    // Leave it: back in the world — off the page, out of the Abode.
    fireEvent.click(waiting.getByRole('button', { name: 'leave it' }))
    expect(screen.queryByRole('list', { name: 'waiting to decide' })).toBeNull()
    expect(abode().getByText('nothing here yet')).toBeDefined()
    expect(decisions()).toEqual(['left'])
  })

  it('composting empties the shelf spot and credits NOTHING — the wallet never moves', () => {
    seedWorld(findSeed('2026-07-16', 'flora'))
    render(<App />)
    dropOneFlora()
    const wallet = () => document.querySelector('.meter-wallet').textContent
    expect(wallet()).toBe('0')

    fireEvent.click(shelf().getByRole('button'))
    fireEvent.click(shelf().getByRole('button', { name: 'gather' }))
    fireEvent.click(screen.getByRole('button', { name: 'the abode' }))
    fireEvent.click(abode().getByRole('button', { name: 'compost' }))

    // Gone from the Abode, recorded as composted — and no fungi from
    // it, ever (spec §5: composting yields nothing).
    expect(abode().getByText('nothing here yet')).toBeDefined()
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
    // map holds no ghosts, and the Abode is empty again.
    fireEvent.click(row('walk').getByRole('button', { name: 'undo' }))
    expect(stored().floraDecisions).toEqual({})
    fireEvent.click(screen.getByRole('button', { name: 'the abode' }))
    expect(abode().getByText('nothing here yet')).toBeDefined()
  })
})
