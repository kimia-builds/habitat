// The create/edit habit form. It only COLLECTS fields; all the rules
// live in game/habits.js — onSave runs the real validation and this
// form just shows any complaint it throws.

import { useState } from 'react'
import { DIFFICULTIES } from '../game/constants.js'
import SymbolPicker from './SymbolPicker.jsx'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SCHEDULE_LABELS = {
  daily: 'every day',
  weekdays: 'specific weekdays',
  nPerWeek: 'N days a week',
  nPerDay: 'N times a day',
  whenever: 'whenever',
  oneTime: 'one-time (a to-do)',
}

// Turn the form's raw fields into the schedule object the engine expects.
function buildSchedule(type, weekdayFlags, n) {
  if (type === 'weekdays') {
    const days = weekdayFlags.flatMap((on, i) => (on ? [i + 1] : []))
    return { type, days }
  }
  if (type === 'nPerWeek' || type === 'nPerDay') {
    return { type, n: Number(n) }
  }
  return { type }
}

function HabitForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [symbol, setSymbol] = useState(initial?.symbol ?? 1)
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? 'medium')
  const [scheduleType, setScheduleType] = useState(
    initial?.schedule.type ?? 'daily',
  )
  const [weekdayFlags, setWeekdayFlags] = useState(() =>
    WEEKDAY_NAMES.map(
      (_, i) => initial?.schedule.days?.includes(i + 1) ?? false,
    ),
  )
  const [n, setN] = useState(initial?.schedule.n ?? 2)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    try {
      onSave({
        name,
        description,
        symbol,
        difficulty,
        schedule: buildSchedule(scheduleType, weekdayFlags, n),
      })
    } catch (problem) {
      setError(problem.message)
    }
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <label>
        name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </label>
      <label>
        description
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <SymbolPicker selected={[symbol]} onToggle={setSymbol} />
      <label>
        difficulty
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label>
        schedule
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value)}
        >
          {Object.entries(SCHEDULE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {scheduleType === 'weekdays' && (
        <div className="weekday-boxes">
          {WEEKDAY_NAMES.map((day, i) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={weekdayFlags[i]}
                onChange={(e) =>
                  setWeekdayFlags(
                    weekdayFlags.map((on, j) =>
                      j === i ? e.target.checked : on,
                    ),
                  )
                }
              />
              {day}
            </label>
          ))}
        </div>
      )}
      {(scheduleType === 'nPerWeek' || scheduleType === 'nPerDay') && (
        <label>
          how many
          <input
            type="number"
            min={scheduleType === 'nPerDay' ? 2 : 1}
            max={scheduleType === 'nPerWeek' ? 7 : undefined}
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
        </label>
      )}
      {error && <p role="alert">{error}</p>}
      <div>
        <button type="submit">save</button>
        <button type="button" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  )
}

export default HabitForm
