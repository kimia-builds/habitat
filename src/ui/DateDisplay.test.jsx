// The date display (T4.5) in isolation: the exact calendar date line,
// and the honest little note that appears only between midnight and the
// day cutoff — worded from the cutoff setting, so it follows a changed
// setting. All maths is days.js's; these tests pin the wiring.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import DateDisplay from './DateDisplay.jsx'

// Build a timestamp from local-clock parts, like the days.js tests do.
const at = (y, month, d, h, min = 0) =>
  new Date(y, month - 1, d, h, min).getTime()

afterEach(() => {
  cleanup()
})

describe('DateDisplay', () => {
  it('renders the exact date line for a fixed moment', () => {
    render(<DateDisplay now={at(2026, 7, 20, 9)} cutoffHour={3} />)
    expect(screen.getByText('MONDAY 20 JUL 2026')).toBeDefined()
  })

  it('at 1am with a 3am cutoff the note shows, reading "at 3 a.m."', () => {
    render(<DateDisplay now={at(2026, 7, 20, 1)} cutoffHour={3} />)
    expect(
      screen.getByText('your habits will switch to a new day at 3 a.m.'),
    ).toBeDefined()
  })

  it('at 9am the note is absent — date and habit list agree again', () => {
    render(<DateDisplay now={at(2026, 7, 20, 9)} cutoffHour={3} />)
    expect(
      screen.queryByText(/your habits will switch to a new day/),
    ).toBeNull()
  })

  it('the note tracks the cutoff setting: 9am with a 7pm cutoff reads "at 7 p.m."', () => {
    render(<DateDisplay now={at(2026, 7, 20, 9)} cutoffHour={19} />)
    expect(
      screen.getByText('your habits will switch to a new day at 7 p.m.'),
    ).toBeDefined()
  })
})
