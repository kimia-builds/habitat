// The morning check-in (T1.4): "mark what you completed yesterday",
// plus optional backfill for the other still-editable days of the
// current week. Pure display + callbacks — which days are editable and
// which habits appear come from the game modules; recording happens in
// App. Answering is saving: the only way out is the done button, which
// tells App to remember the check-in happened. Nothing here punishes —
// leaving everything unmarked is a perfectly fine answer.

import { editablePastDays, habitsOn } from '../game/checkin.js'
import { countOn } from '../game/completions.js'
import { addDays, isoWeekday } from '../game/days.js'
import { requiredPerDay } from '../game/schedule.js'
import { SYMBOL_COLORS, SYMBOL_GLYPHS } from './symbols.js'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dayLabel = (dayKey) =>
  `${WEEKDAY_NAMES[isoWeekday(dayKey) - 1]} ${dayKey}`

// The habits of one past day, each with its mark/undo controls —
// a slimmer cousin of HabitRow, acting on that day instead of today.
function DayRows({ habits, completions, dayKey, cutoffHour, onMark, onUnmark }) {
  const listed = habitsOn(habits, completions, dayKey, cutoffHour)
  if (listed.length === 0) {
    return <p className="habit-meta">no habits existed yet on this day</p>
  }
  return (
    <ul className="habit-list">
      {listed.map((habit) => {
        const count = countOn(completions, habit.id, dayKey)
        const required = requiredPerDay(habit)
        return (
          <li key={habit.id} className="habit-row">
            <span
              className="symbol"
              style={{ color: SYMBOL_COLORS[habit.symbol] }}
            >
              {SYMBOL_GLYPHS[habit.symbol]}
            </span>
            <span className="habit-main">
              <span className="habit-name">{habit.name}</span>
            </span>
            {habit.schedule.type === 'nPerDay' ? (
              <span className="completion-controls">
                <span>
                  {count}/{required}
                </span>
                <button onClick={() => onMark(habit, dayKey)}>+1</button>
                <button
                  onClick={() => onUnmark(habit, dayKey)}
                  disabled={count === 0}
                >
                  undo
                </button>
              </span>
            ) : (
              <span className="completion-controls">
                {count > 0 ? (
                  <button onClick={() => onUnmark(habit, dayKey)}>
                    ✓ done
                  </button>
                ) : (
                  <button onClick={() => onMark(habit, dayKey)}>
                    mark done
                  </button>
                )}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function CheckInPanel({
  habits,
  completions,
  todayKey,
  cutoffHour,
  onMark,
  onUnmark,
  onDone,
}) {
  const yesterday = addDays(todayKey, -1)
  const older = editablePastDays(todayKey).filter((day) => day !== yesterday)
  const rowProps = { habits, completions, cutoffHour, onMark, onUnmark }

  return (
    <section className="check-in" aria-label="check-in">
      <h2>check-in</h2>
      <p>
        Mark what you completed <strong>yesterday, {dayLabel(yesterday)}</strong>.
        Anything left unmarked simply counts as not done — neutral data,
        nothing lost.
      </p>
      <DayRows {...rowProps} dayKey={yesterday} />
      {older.length > 0 && (
        <>
          <p className="habit-meta">
            Earlier this week — optional, editable until the week ends:
          </p>
          {older.map((day) => (
            <details key={day}>
              <summary>{dayLabel(day)}</summary>
              <DayRows {...rowProps} dayKey={day} />
            </details>
          ))}
        </>
      )}
      <button onClick={onDone}>done — save check-in</button>
    </section>
  )
}

export default CheckInPanel
