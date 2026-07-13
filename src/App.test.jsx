// UI tests for the T1.3 habit list screen. The game rules themselves
// are tested in src/game/*.test.js — these tests check that the screen
// drives them correctly: what a tap stores, what survives a reload,
// and that destructive paths (delete, import) ask first.

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup() // unmount this test's App (no vitest globals = no auto-cleanup)
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
  it('mark done → done today; tap again → taken back', () => {
    render(<App />)
    createHabitViaUI('meditate')

    fireEvent.click(row('meditate').getByRole('button', { name: 'mark done' }))
    expect(row('meditate').getByRole('button', { name: '✓ done today' }))

    // The undo: tapping the done button removes today's mark.
    fireEvent.click(
      row('meditate').getByRole('button', { name: '✓ done today' }),
    )
    expect(row('meditate').getByRole('button', { name: 'mark done' }))
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
    expect(row('floss').getByRole('button', { name: 'mark done' }))
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
