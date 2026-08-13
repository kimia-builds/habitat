// The field notes page (T2.3): the weekly view. Pure display — all
// the week maths lives in game/fieldnotes.js. Browsable week by week:
// opens on the last completed week, reaches back to the first week
// Habitat ever saw, and forward to the current (still unfolding) week.
// Nothing here judges: an empty cell is just an empty cell.
//
// The charm lens comes with you (Kimia's call 2026-08-11): the same
// filter the habit list wears is carried onto this page, still
// adjustable from the same row of charms, and it narrows BOTH the week
// grid and the graphs below it. It is still the temporary lens spec §5b
// describes — App holds it, so a reload clears it everywhere at once.

import { useState } from 'react'
import {
  addDays,
  dayKeyFromTimestamp,
  shortDate,
  weekStart,
} from '../game/days.js'
import { earliestWeek, weekNotes } from '../game/fieldnotes.js'
import { filterBySymbols } from '../game/habits.js'
import HabitGraphs from './HabitGraphs.jsx'
import CharmSymbol from './CharmSymbol.jsx'
import SymbolPicker from './SymbolPicker.jsx'

const DAY_HEADINGS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// What one day cell shows. Quiet on purpose:
//   ✓ (or the count)  — done that day
//   ·                 — was on the calendar, ended without a mark
//   (blank)           — nothing was scheduled, or the day is outside
//                       the habit's life / still to come
function cellText(day) {
  if (day.outside) return ''
  if (day.count > 0) {
    if (day.countsWithin) return `${day.count}/${day.required}`
    return day.count > 1 ? `✓${day.count}` : '✓'
  }
  return day.expected ? '·' : ''
}

function FieldNotes({
  habits,
  completions,
  cutoffHour,
  now,
  // No lens unless one is handed down — App always hands one down; the
  // empty list means "show everything", exactly as it does on the list.
  filter = [],
  onToggleFilter = () => {},
  onBack,
}) {
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const thisWeek = weekStart(today)
  const lastCompletedWeek = addDays(thisWeek, -7)
  // The lens, applied once at the top: everything below — how far back
  // the browsing reaches, the grid, the completed tasks, the graphs —
  // reads these narrowed lists and nothing else. The marks travel with
  // their habits so a lens can never leave a completion behind with no
  // habit to belong to.
  const shownHabits = filterBySymbols(habits, filter)
  const shownIds = new Set(shownHabits.map((h) => h.id))
  const shownCompletions = completions.filter((c) => shownIds.has(c.habitId))
  const firstWeek = earliestWeek(shownHabits, shownCompletions, cutoffHour)
  // Default to the last completed week; a Habitat whose whole history
  // is this week starts on the current week instead.
  const [chosenWeek, setWeek] = useState(
    firstWeek !== null && firstWeek <= lastCompletedWeek
      ? lastCompletedWeek
      : thisWeek,
  )

  // The same row of charms the habit list carries — the SAME element in
  // the same place, too (Kimia, 2026-08-11): it sits above the page's
  // box rather than inside it, so it is centred and sized exactly as it
  // is on the home screen. The charms are the page's lens, not part of
  // its notes, and the outline starts below them.
  const lens = (
    <section
      className="filter-view"
      aria-label="filter view"
      title="filter view"
    >
      <SymbolPicker selected={filter} onToggle={onToggleFilter} />
    </section>
  )

  const back = (
    <button className="pebble" onClick={onBack}>
      ← back to the habits
    </button>
  )

  if (firstWeek === null) {
    return (
      <>
        {lens}
        <section className="field-notes" aria-label="field notes">
          <p>nothing recorded yet</p>
        </section>
        {back}
      </>
    )
  }

  // Narrowing the lens can leave the week being browsed outside what is
  // left to browse (the charms on show may have a shorter history than
  // the ones just switched off). Rather than yank the state about, the
  // week is simply held inside its bounds while it is drawn.
  const week =
    chosenWeek < firstWeek
      ? firstWeek
      : chosenWeek > thisWeek
        ? thisWeek
        : chosenWeek

  const notes = weekNotes(shownHabits, shownCompletions, week, now, cutoffHour)

  return (
    <>
      {lens}
      <section className="field-notes" aria-label="field notes">
        <div className="week-nav">
          <button
            className="pebble"
            onClick={() => setWeek(addDays(week, -7))}
            disabled={week <= firstWeek}
          >
            ‹ earlier
          </button>
          {/* The week range, and — on its own line under it — the note that
            this week is not finished yet (Kimia, 2026-08-11). It used to
            sit inline, where it lengthened the middle of the row enough
            to push "later" onto a second line and out of its corner. */}
          <span className="week-range">
            {shortDate(notes.weekStartKey)} – {shortDate(notes.weekEnd)}
            {notes.isCurrent && (
              <em className="week-unfolding">still unfolding</em>
            )}
          </span>
          <button
            className="pebble"
            onClick={() => setWeek(addDays(week, +7))}
            disabled={week >= thisWeek}
          >
            later ›
          </button>
        </div>

        {notes.rows.length > 0 ? (
          <table className="week-grid">
            <thead>
              <tr>
                <th></th>
                {DAY_HEADINGS.map((d) => (
                  <th key={d}>{d}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notes.rows.map(({ habit, days, streak, streakUnit }) => (
                <tr key={habit.id}>
                  <th scope="row">
                    <CharmSymbol symbol={habit.symbol} className="symbol" />{' '}
                    {habit.name}
                    {habit.archived && (
                      <span className="habit-meta"> (archived)</span>
                    )}
                  </th>
                  {days.map((day) => (
                    <td key={day.dayKey}>{cellText(day)}</td>
                  ))}
                  <td className="streak-cell">
                    {streak !== null && `${streak}-${streakUnit} streak`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No habits existed during this week.</p>
        )}

        {notes.tasksCompleted.length > 0 && (
          <>
            <h3>tasks completed</h3>
            <ul className="tasks-completed">
              {notes.tasksCompleted.map(({ habit, dayKey }) => (
                <li key={habit.id}>
                  <CharmSymbol symbol={habit.symbol} className="symbol" />{' '}
                  {habit.name} — {dayKey}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* T2.4: whole-life graphs — deliberately below the weekly grid
          and unaffected by which week is on show. They do answer to the
          charm lens, though (2026-08-11): the whole page shows one set
          of habits at a time.
          Their own outlined section since 2026-08-11 (Kimia's call): the
          week and the graphs are two different ways of looking, so they
          are two boxes rather than one long one. HabitGraphs draws its
          own outline, which means a page with nothing graphable yet
          simply has no second box — never an empty frame. */}
      <HabitGraphs
        habits={shownHabits}
        completions={shownCompletions}
        now={now}
        cutoffHour={cutoffHour}
      />

      {back}
    </>
  )
}

export default FieldNotes
