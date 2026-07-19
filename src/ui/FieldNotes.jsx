// The field notes page (T2.3): the weekly view. Pure display — all
// the week maths lives in game/fieldnotes.js. Browsable week by week:
// opens on the last completed week, reaches back to the first week
// Habitat ever saw, and forward to the current (still unfolding) week.
// Nothing here judges: an empty cell is just an empty cell.

import { useState } from 'react'
import { addDays, dayKeyFromTimestamp, weekStart } from '../game/days.js'
import { earliestWeek, weekNotes } from '../game/fieldnotes.js'
import HabitGraphs from './HabitGraphs.jsx'
import { SYMBOL_COLORS, SYMBOL_GLYPHS } from './symbols.js'

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

function FieldNotes({ habits, completions, cutoffHour, now, onBack }) {
  const today = dayKeyFromTimestamp(now, cutoffHour)
  const thisWeek = weekStart(today)
  const lastCompletedWeek = addDays(thisWeek, -7)
  const firstWeek = earliestWeek(habits, completions, cutoffHour)
  // Default to the last completed week; a Habitat whose whole history
  // is this week starts on the current week instead.
  const [week, setWeek] = useState(
    firstWeek !== null && firstWeek <= lastCompletedWeek
      ? lastCompletedWeek
      : thisWeek,
  )

  if (firstWeek === null) {
    return (
      <section className="field-notes" aria-label="field notes">
        <h2>field notes</h2>
        <p>Nothing recorded yet — notes begin with the first habit.</p>
        <button onClick={onBack}>← back to the habits</button>
      </section>
    )
  }

  const notes = weekNotes(habits, completions, week, now, cutoffHour)

  return (
    <section className="field-notes" aria-label="field notes">
      <h2>field notes</h2>

      <div className="week-nav">
        <button
          onClick={() => setWeek(addDays(week, -7))}
          disabled={week <= firstWeek}
        >
          ‹ earlier
        </button>
        <span>
          week of {notes.weekStartKey} – {notes.weekEnd}
          {notes.isCurrent && (
            <em className="week-unfolding"> · still unfolding</em>
          )}
        </span>
        <button
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
                  <span
                    className="symbol"
                    style={{ color: SYMBOL_COLORS[habit.symbol] }}
                  >
                    {SYMBOL_GLYPHS[habit.symbol]}
                  </span>{' '}
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

      <p className="field-notes-legend">
        ✓ done · was on the calendar, not marked — blank means nothing was asked
        of the day
      </p>

      {notes.tasksCompleted.length > 0 && (
        <>
          <h3>tasks completed</h3>
          <ul className="tasks-completed">
            {notes.tasksCompleted.map(({ habit, dayKey }) => (
              <li key={habit.id}>
                {habit.name} — {dayKey}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* T2.4: whole-life graphs — deliberately below the weekly grid
          and unaffected by which week is on show. */}
      <HabitGraphs
        habits={habits}
        completions={completions}
        now={now}
        cutoffHour={cutoffHour}
      />

      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default FieldNotes
