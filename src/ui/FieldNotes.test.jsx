// Field-notes UI test. The week maths is covered in
// game/fieldnotes.test.js; here we check the page wires a habit's charm
// in beside its name — including the "tasks completed" list, where
// one-time to-dos land (they get no week-grid row). T5.1 follow-up:
// the charm used to be missing there.

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createHabit } from '../game/habits.js'
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
      { name: 'renew passport', symbol: 5, difficulty: 'medium', schedule: { type: 'oneTime' } },
      BORN_THIS_WEEK,
      't1',
    )
    const done = recordCompletion('t1', CUTOFF, new Date(2026, 6, 15, 9).getTime(), 'c1')

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
    expect(within(list).getByText('renew passport', { exact: false })).toBeDefined()
    expect(within(list).getByRole('img', { name: 'shield' })).toBeDefined()
  })
})
