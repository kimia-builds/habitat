// The by-the-habit note's glint (T5.2e, design-notes §5).
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

import { cleanup, render } from '@testing-library/react'
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
