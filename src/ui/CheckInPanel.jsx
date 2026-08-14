// The morning check-in (T1.4): "what did you do yesterday?",
// plus optional backfill for the other still-editable days of the
// current week. Pure display + callbacks — which days are editable and
// which habits appear come from the game modules; recording happens in
// App. Answering is saving; nothing here punishes — leaving everything
// unmarked is a perfectly fine answer.
//
// The check-in is meant to be QUICK (Kimia's call 2026-08-14): a glance,
// a few taps, gone. So it stays as close to one screenful as it can —
// tight rows in a smaller type, an optional charm lens at the top to
// narrow the list by tag, and a `…` that folds a long list down to its
// first few rows. Everything that folds is folded so that the earlier-
// days offer, and the way out, stay within reach of the question.

import { editablePastDays, habitsOn } from '../game/checkin.js'
import { countOn } from '../game/completions.js'
import { addDays, isoWeekday, shortDate } from '../game/days.js'
import { CHECKIN_ROWS_BEFORE_MORE } from '../game/constants.js'
import { filterBySymbols } from '../game/habits.js'
import { requiredPerDay, scheduleOn } from '../game/schedule.js'
import { useState } from 'react'
import CharmSymbol from './CharmSymbol.jsx'
import SymbolPicker from './SymbolPicker.jsx'

// Kimia's date convention (2026-08-12): "mon DD-MM-YY" — the weekday
// lowercase like the rest of the interface, then the same day-first
// short date the field notes already use (days.js shortDate).
const WEEKDAY_NAMES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const dayLabel = (dayKey) =>
  `${WEEKDAY_NAMES[isoWeekday(dayKey) - 1]} ${shortDate(dayKey)}`

// Which habits a given past day offers, seen through the charm lens.
// The lens is a view, never a filter on what counts: a hidden habit is
// simply not on screen, and anything already marked on it stays marked.
const listedOn = (habits, completions, dayKey, cutoffHour, symbols) =>
  filterBySymbols(habitsOn(habits, completions, dayKey, cutoffHour), symbols)

// The habits of one past day, each with its mark/undo controls —
// a slimmer cousin of HabitRow, acting on that day instead of today.
function DayRows({ listed, completions, dayKey, onMark, onUnmark }) {
  if (listed.length === 0) {
    return <p className="habit-meta">no habits to show for this day</p>
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
                  className="todo-check pebble pebble-counter"
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
                <button
                  className="pebble pebble-counter"
                  onClick={() => onMark(habit, dayKey)}
                >
                  +1
                </button>
                <button
                  className="pebble pebble-counter"
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
  // The charm lens, and whether a long yesterday is showing in full.
  // Both are plain component state: a check-in is one sitting, and the
  // next one starts fresh with everything shown.
  const [filter, setFilter] = useState([])
  const [expanded, setExpanded] = useState(false)

  const toggleFilter = (symbol) =>
    setFilter((chosen) =>
      chosen.includes(symbol)
        ? chosen.filter((s) => s !== symbol)
        : [...chosen, symbol],
    )

  const yesterday = addDays(todayKey, -1)
  const older = editablePastDays(todayKey).filter((day) => day !== yesterday)

  const yesterdayRows = listedOn(
    habits,
    completions,
    yesterday,
    cutoffHour,
    filter,
  )
  // Fold a long list down to its first few rows. The hidden ones are
  // only hidden: nothing about them changes, and one press brings them
  // back. Folding is what keeps the earlier-days offer and the done
  // pebble near the question instead of a scroll away.
  const overflowing = yesterdayRows.length > CHECKIN_ROWS_BEFORE_MORE
  const folded = overflowing && !expanded
  const hidden = folded ? yesterdayRows.length - CHECKIN_ROWS_BEFORE_MORE : 0
  const shown = folded
    ? yesterdayRows.slice(0, CHECKIN_ROWS_BEFORE_MORE)
    : yesterdayRows

  // The question IS the heading (Kimia's call 2026-08-11): the old
  // "check-in" title and its dated "Mark what you completed yesterday,
  // Mon 2026-08-10" line are both gone. The panel keeps "check-in" as
  // its accessible name — screen readers still need to know which
  // region this is, and nothing shows that word on screen.
  return (
    <section className="check-in" aria-label="check-in">
      <h2>what did you do yesterday?</h2>

      {/* The same charm lens the home screen wears, in the same place:
          centred, directly under the heading. Optional — with nothing
          chosen the whole day is listed, exactly as before. */}
      <div className="filter-view">
        <SymbolPicker selected={filter} onToggle={toggleFilter} />
      </div>

      <DayRows
        listed={shown}
        completions={completions}
        dayKey={yesterday}
        onMark={onMark}
        onUnmark={onUnmark}
      />

      {overflowing && (
        <button
          className="pebble pebble-more"
          onClick={() => setExpanded((open) => !open)}
          title={expanded ? 'show fewer' : `show ${hidden} more`}
          aria-label={expanded ? 'show fewer' : `show ${hidden} more`}
          aria-expanded={expanded}
        >
          …
        </button>
      )}

      {older.length > 0 && (
        <>
          <p className="habit-meta">
            update earlier days of this week before they freeze forever:
          </p>
          {older.map((day) => (
            <details key={day}>
              <summary>{dayLabel(day)}</summary>
              <DayRows
                listed={listedOn(habits, completions, day, cutoffHour, filter)}
                completions={completions}
                dayKey={day}
                onMark={onMark}
                onUnmark={onUnmark}
              />
            </details>
          ))}
        </>
      )}

      <button className="pebble" onClick={onDone}>
        done
      </button>
    </section>
  )
}

export default CheckInPanel
