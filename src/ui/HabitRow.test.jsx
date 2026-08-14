// The two momentary things a habit row plays (T5.2e): the note's glint
// when a drop lands beside it (§5), and the spark under the finger when
// a tap moves a meter (§4).
//
// The by-the-habit note's glint (design-notes §5).
//
// The glint itself is CSS — one band of light crossing the words as
// they appear. What lives in the component, and can silently break, is
// the REPLAY: a second drop from the same habit rewrites the one
// sentence rather than adding a line, and words swapped inside an
// element whose animation has already finished would arrive in silence.
// Keying the note on its sentence is what makes new words a new
// element, and a new element glints — so that is what is asserted here,
// never the sentence itself (those words are generated, and the shape
// of them is arrivalText.js's business, not this file's).

import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import HabitRow from './HabitRow.jsx'

afterEach(cleanup)

const habit = {
  id: 'h1',
  name: 'a habit',
  symbol: 1,
  schedule: { type: 'daily', perDay: 1 },
}

const row = (arrivalNote) => (
  <ul>
    <HabitRow
      habit={habit}
      arrivalNote={arrivalNote}
      todayCount={0}
      required={1}
      fulfilled={false}
      onComplete={vi.fn()}
      onUndo={vi.fn()}
      onReorderStart={vi.fn()}
      onEdit={vi.fn()}
      onArchive={vi.fn()}
    />
  </ul>
)

describe('the by-the-habit note (§5)', () => {
  it('shows nothing while the habit has no arrivals on the shelf', () => {
    const { container } = render(row(null))
    expect(container.querySelectorAll('.arrival-note')).toHaveLength(0)
  })

  it('starts a fresh note when a second drop rewrites the sentence', () => {
    const { container, rerender } = render(row('you came across a'))
    const first = container.querySelector('.arrival-note')
    rerender(row('you came across a and b'))
    const second = container.querySelector('.arrival-note')
    // A different element, not the same one with its words swapped —
    // which is the whole point: only a fresh element plays the glint.
    expect(second).not.toBe(first)
  })

  it('leaves the note alone when the sentence has not changed', () => {
    // The list re-renders constantly (a drag, a filter, a tap on a
    // neighbour). None of that is an arrival, and none of it should set
    // the glint off again.
    const { container, rerender } = render(row('you came across a'))
    const first = container.querySelector('.arrival-note')
    rerender(row('you came across a'))
    expect(container.querySelector('.arrival-note')).toBe(first)
  })
})

// The tap spark (T5.2e, design-notes §4).
//
// The ring itself is CSS. What lives in the component is WHEN it plays:
// on the control that completes, never on -1, and again on every tap —
// which is a fresh element each time, for the same reason the note above
// is keyed.
describe('the tap spark (§4)', () => {
  const controls = (container) => ({
    plus: [...container.querySelectorAll('button')].find(
      (b) => b.textContent === '+1',
    ),
    minus: [...container.querySelectorAll('button')].find(
      (b) => b.textContent === '-1',
    ),
    spark: () => container.querySelector('.tap-spark'),
  })

  it('rests with no spark until something is tapped', () => {
    const { container } = render(row(null))
    expect(controls(container).spark()).toBeNull()
  })

  it('sparks on the control that completes', () => {
    const { container } = render(row(null))
    const { plus, spark } = controls(container)
    fireEvent.click(plus)
    expect(spark()).not.toBeNull()
    // And it sits on that control, not loose in the row.
    expect(spark().closest('.tap-target').contains(plus)).toBe(true)
  })

  it('plays again on every tap — a fresh element each time', () => {
    const { container } = render(row(null))
    const { plus, spark } = controls(container)
    fireEvent.click(plus)
    const first = spark()
    fireEvent.click(plus)
    expect(spark()).not.toBe(first)
  })

  it('stays quiet on -1 — going back is not a movement', () => {
    const { container } = render(
      <ul>
        <HabitRow
          habit={habit}
          arrivalNote={null}
          todayCount={2}
          required={1}
          fulfilled={true}
          onComplete={vi.fn()}
          onUndo={vi.fn()}
          onReorderStart={vi.fn()}
          onEdit={vi.fn()}
          onArchive={vi.fn()}
        />
      </ul>,
    )
    fireEvent.click(controls(container).minus)
    expect(controls(container).spark()).toBeNull()
  })

  it('still tells App a habit was completed', () => {
    const onComplete = vi.fn()
    const { container } = render(
      <ul>
        <HabitRow
          habit={habit}
          arrivalNote={null}
          todayCount={0}
          required={1}
          fulfilled={false}
          onComplete={onComplete}
          onUndo={vi.fn()}
          onReorderStart={vi.fn()}
          onEdit={vi.fn()}
          onArchive={vi.fn()}
        />
      </ul>,
    )
    fireEvent.click(controls(container).plus)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('sparks when a one-time to-do is ticked off', () => {
    const todo = { ...habit, schedule: { type: 'oneTime' } }
    const { container } = render(
      <ul>
        <HabitRow
          habit={todo}
          arrivalNote={null}
          todayCount={0}
          required={1}
          fulfilled={false}
          onComplete={vi.fn()}
          onUndo={vi.fn()}
          onReorderStart={vi.fn()}
          onEdit={vi.fn()}
          onArchive={vi.fn()}
        />
      </ul>,
    )
    fireEvent.click(container.querySelector('.todo-check'))
    expect(container.querySelector('.tap-spark')).not.toBeNull()
  })
})
