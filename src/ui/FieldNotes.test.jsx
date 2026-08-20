// Field-notes UI test. The week maths is covered in
// game/fieldnotes.test.js; here we check the page wires a habit's charm
// in beside its name — including the "tasks completed" list, where
// one-time to-dos land (they get no week-grid row). T5.1 follow-up:
// the charm used to be missing there.

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { changeSchedule, createHabit } from '../game/habits.js'
import { recordCompletion } from '../game/completions.js'
import FieldNotes from './FieldNotes.jsx'

afterEach(cleanup)

const CUTOFF = 3
// days.test.js pins 2026-07-13 as a Monday; we look at "now" mid-week.
const NOW = new Date(2026, 6, 15, 12).getTime()
// Born this same week (Mon 2026-07-13 onward) so the page opens on the
// current, still-unfolding week — where the task was checked off.
const BORN_THIS_WEEK = new Date(2026, 6, 14, 9).getTime()

describe('FieldNotes charms', () => {
  it('shows a completed one-time task with its charm in tasks completed', () => {
    // A one-time to-do tagged with the shield charm (symbol 5), checked
    // off this week — so it appears under "tasks completed".
    const task = createHabit(
      {
        name: 'renew passport',
        symbol: 5,
        difficulty: 'medium',
        schedule: { type: 'oneTime' },
      },
      BORN_THIS_WEEK,
      't1',
    )
    const done = recordCompletion(
      't1',
      CUTOFF,
      new Date(2026, 6, 15, 9).getTime(),
      'c1',
    )

    render(
      <FieldNotes
        habits={[task]}
        completions={[done]}
        cutoffHour={CUTOFF}
        now={NOW}
        onBack={() => {}}
      />,
    )

    const tasks = screen.getByRole('heading', { name: 'tasks completed' })
    const list = tasks.nextElementSibling // the <ul class="tasks-completed">
    expect(
      within(list).getByText('renew passport', { exact: false }),
    ).toBeDefined()
    expect(within(list).getByRole('img', { name: 'shield' })).toBeDefined()
  })
})

describe('browsing back past a schedule change', () => {
  it('keeps drawing the page when the counting unit changed since', () => {
    // The 2026-07-27 black-screen bug, at the page level: daily until
    // Monday the 20th, N-per-week since. Clicking "earlier" used to
    // throw while drawing, which took the whole app down with it.
    let habit = createHabit(
      {
        name: 'walk',
        symbol: 1,
        difficulty: 'medium',
        schedule: { type: 'daily' },
      },
      new Date(2026, 5, 29, 9).getTime(),
      'h1',
    )
    habit = changeSchedule(habit, { type: 'nPerWeek', n: 3 }, '2026-07-20')
    const completions = [
      recordCompletion('h1', CUTOFF, new Date(2026, 6, 6, 9).getTime(), 'c1'),
      recordCompletion('h1', CUTOFF, new Date(2026, 6, 7, 9).getTime(), 'c2'),
    ]

    render(
      <FieldNotes
        habits={[habit]}
        completions={completions}
        cutoffHour={CUTOFF}
        now={new Date(2026, 6, 27, 12).getTime()}
        onBack={() => {}}
      />,
    )

    // Walk back a week at a time, past the change, into the old
    // day-counted weeks: the grid keeps its row every step of the way.
    const earlier = screen.getByRole('button', { name: /earlier/ })
    for (let i = 0; i < 3; i++) {
      fireEvent.click(earlier)
      expect(screen.getByRole('table')).toBeDefined()
      expect(screen.getByRole('rowheader', { name: /walk/ })).toBeDefined()
    }
  })
})

// THE STREAK SPOTLIGHT (Kimia's call 2026-08-20). A cameo is momentary,
// so a claim it made — "15-day streak" — used to be unaskable
// afterwards. Pressing the visit opens the notes with the record(s) it
// was about blacked out around, and a click escapes.
describe('the streak spotlight', () => {
  const habit = createHabit(
    {
      name: 'morning pages',
      symbol: 1,
      difficulty: 'medium',
      schedule: { type: 'daily' },
    },
    BORN_THIS_WEEK,
    'h1',
  )

  const show = (spotlight, onDismiss = () => {}) =>
    render(
      <FieldNotes
        habits={[habit]}
        completions={[]}
        cutoffHour={CUTOFF}
        now={NOW}
        onBack={() => {}}
        spotlight={spotlight}
        onDismissSpotlight={onDismiss}
      />,
    )

  it('is not there on an ordinary visit to the page', () => {
    show(null)
    expect(document.querySelector('.streak-spotlight')).toBeNull()
  })

  it('names the habit the streak was for, and how long it is', () => {
    show([{ habitId: 'h1', habitName: 'morning pages', n: 23, unit: 'day' }])
    const spotlight = document.querySelector('.streak-spotlight')
    expect(spotlight).not.toBeNull()
    expect(spotlight.textContent).toContain('morning pages')
    expect(spotlight.textContent).toContain('23')
  })

  it('says which unit a week-counted streak is counted in', () => {
    show([{ habitId: 'h1', habitName: 'swim', n: 4, unit: 'week' }])
    const run = document.querySelector('.streak-spotlight-run').textContent
    expect(run).toContain('4')
    // The two units must read differently, whatever the words are — a
    // "4 streak" that could mean either is the bug this fixes.
    cleanup()
    show([{ habitId: 'h1', habitName: 'swim', n: 4, unit: 'day' }])
    expect(
      document.querySelector('.streak-spotlight-run').textContent,
    ).not.toBe(run)
  })

  // Only one friend may visit a day, so a second record that fell the
  // same day would otherwise be unfindable — and there is no catching
  // the notice again.
  it('shows every record that fell that day at once', () => {
    show([
      { habitId: 'h1', habitName: 'morning pages', n: 23, unit: 'day' },
      { habitId: 'h2', habitName: 'swim', n: 4, unit: 'week' },
    ])
    const items = document.querySelectorAll('.streak-spotlight-list li')
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toContain('morning pages')
    expect(items[1].textContent).toContain('swim')
  })

  it('escapes on a click, and on the escape key', () => {
    const onDismiss = vi.fn()
    show(
      [{ habitId: 'h1', habitName: 'morning pages', n: 23, unit: 'day' }],
      onDismiss,
    )
    const spotlight = document.querySelector('.streak-spotlight')
    fireEvent.click(spotlight)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(spotlight, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledTimes(2)
  })

  it('leaves the week itself readable underneath', () => {
    show([{ habitId: 'h1', habitName: 'morning pages', n: 23, unit: 'day' }])
    // The blackout covers the page, it does not replace it: escaping
    // must land on the notes, not on an empty screen.
    expect(screen.getByRole('table')).toBeDefined()
  })
})

// The week under the blackout must be the week the record is standing
// in (2026-08-20). The page opens on LAST week by default, so escaping
// a spotlight announcing five days used to land on a row reporting two.
describe('the week a cameo lands you on', () => {
  const habit = createHabit(
    {
      name: 'morning pages',
      symbol: 1,
      difficulty: 'medium',
      schedule: { type: 'daily' },
    },
    new Date(2026, 5, 29, 9).getTime(), // weeks of history before this one
    'h1',
  )
  const completions = [
    recordCompletion('h1', CUTOFF, new Date(2026, 6, 7, 9).getTime(), 'c1'),
    recordCompletion('h1', CUTOFF, new Date(2026, 6, 14, 9).getTime(), 'c2'),
  ]

  const show = (spotlight) =>
    render(
      <FieldNotes
        habits={[habit]}
        completions={completions}
        cutoffHour={CUTOFF}
        now={NOW}
        onBack={() => {}}
        spotlight={spotlight}
      />,
    )

  // The week heading names its own days, so the two cases are told
  // apart by which week's date is on show — never by exact wording.
  const heading = () => document.querySelector('.week-nav').textContent

  it('opens on the last completed week on an ordinary visit', () => {
    show(null)
    expect(heading()).toContain('06-07')
  })

  it('opens on the week the record is in when a cameo sent you', () => {
    show([{ habitId: 'h1', habitName: 'morning pages', n: 5, unit: 'day' }])
    expect(heading()).toContain('13-07')
  })
})
