// The morning check-in (T1.4): "what did you do yesterday?",
// plus optional backfill for the other still-editable days of the
// current week. Pure display + callbacks — which days are editable and
// which habits appear come from the game modules; recording happens in
// App. Answering is saving: the only way out is the done button, which
// tells App to remember the check-in happened. Nothing here punishes —
// leaving everything unmarked is a perfectly fine answer.

import { editablePastDays, habitsOn } from '../game/checkin.js'
import { countOn } from '../game/completions.js'
import { addDays, isoWeekday } from '../game/days.js'
import { requiredPerDay, scheduleOn } from '../game/schedule.js'
import CharmSymbol from './CharmSymbol.jsx'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const dayLabel = (dayKey) =>
  `${WEEKDAY_NAMES[isoWeekday(dayKey) - 1]} ${dayKey}`

// The habits of one past day, each with its mark/undo controls —
// a slimmer cousin of HabitRow, acting on that day instead of today.
function DayRows({
  habits,
  completions,
  dayKey,
  cutoffHour,
  onMark,
  onUnmark,
}) {
  const listed = habitsOn(habits, completions, dayKey, cutoffHour)
  if (listed.length === 0) {
    return <p className="habit-meta">no habits existed yet on this day</p>
  }
  return (
    <ul className="habit-list">
      {listed.map((habit) => {
        // A past day answers to the schedule it was living under (T2.3),
        // not to whatever the habit's schedule is today.
        const count = countOn(completions, habit.id, dayKey)
        const required = requiredPerDay(habit, dayKey)
        // The same counter as the habit list (T3.2b): every repeating
        // shape gets an unlimited +1 and a -1 here too, so extras
        // can be backfilled onto their true day. Only one-time to-dos
        // keep a single-tap control.
        const scheduleThen = scheduleOn(habit, dayKey)
        const oneTime = scheduleThen.type === 'oneTime'
        const hasDayGoal = ['daily', 'weekdays', 'nPerDay'].includes(
          scheduleThen.type,
        )
        return (
          // Same charm edging as the main list (T5.2b) — the check-in's
          // rows are the same rows, so they wear the same colour.
          <li key={habit.id} className={`habit-row charm-${habit.symbol}`}>
            <CharmSymbol symbol={habit.symbol} className="symbol" />
            <span className="habit-main">
              <span className="habit-name">{habit.name}</span>
            </span>
            {oneTime ? (
              <span className="completion-controls">
                {/* An empty checkbox until done; ticking marks it, un-ticking
                    un-marks it. Hover reads "mark done" while still open. */}
                <input
                  type="checkbox"
                  className="todo-check"
                  checked={count > 0}
                  onChange={() =>
                    count > 0 ? onUnmark(habit, dayKey) : onMark(habit, dayKey)
                  }
                  title={count > 0 ? 'done' : 'mark done'}
                  aria-label={count > 0 ? 'done' : 'mark done'}
                />
              </span>
            ) : (
              <span className="completion-controls">
                <span>
                  {hasDayGoal && count >= required ? '✓ ' : ''}
                  {hasDayGoal ? `${count}/${required}` : count}
                </span>
                <button onClick={() => onMark(habit, dayKey)}>+1</button>
                <button
                  onClick={() => onUnmark(habit, dayKey)}
                  disabled={count === 0}
                >
                  -1
                </button>
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

  // The question IS the heading (Kimia's call 2026-08-11): the old
  // "check-in" title and its dated "Mark what you completed yesterday,
  // Mon 2026-08-10" line are both gone. The panel keeps "check-in" as
  // its accessible name — screen readers still need to know which
  // region this is, and nothing shows that word on screen.
  return (
    <section className="check-in" aria-label="check-in">
      <h2>what did you do yesterday?</h2>
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
      <button onClick={onDone}>done</button>
    </section>
  )
}

export default CheckInPanel
