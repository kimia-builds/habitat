// One habit in the list: its symbol, name, schedule-at-a-glance, the
// tap-to-complete control, and the row buttons (move, edit, archive).
// Pure display + callbacks — every decision is made in App via the
// game modules.

import { SYMBOL_COLORS, SYMBOL_GLYPHS } from './symbols.js'

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function scheduleSummary(schedule) {
  switch (schedule.type) {
    case 'daily':
      return 'every day'
    case 'weekdays':
      return schedule.days.map((d) => WEEKDAY_NAMES[d - 1]).join('/')
    case 'nPerWeek':
      return `${schedule.n}×/week`
    case 'nPerDay':
      return `${schedule.n}×/day`
    case 'oneTime':
      return 'one-time'
    default:
      return 'whenever'
  }
}

function HabitRow({
  habit,
  todayCount,
  required,
  fulfilled,
  reorderDisabled,
  onComplete,
  onUndo,
  onMoveUp,
  onMoveDown,
  onEdit,
  onArchive,
}) {
  const countsWithin = habit.schedule.type === 'nPerDay'

  return (
    <li className="habit-row">
      <span className="symbol" style={{ color: SYMBOL_COLORS[habit.symbol] }}>
        {SYMBOL_GLYPHS[habit.symbol]}
      </span>
      <span className="habit-main">
        <span className="habit-name">{habit.name}</span>
        {habit.description && (
          <span className="habit-description">{habit.description}</span>
        )}
        <span className="habit-meta">
          {scheduleSummary(habit.schedule)} · {habit.difficulty}
        </span>
      </span>
      {countsWithin ? (
        <span className="completion-controls">
          <span>
            {todayCount}/{required} today
          </span>
          <button onClick={onComplete}>+1</button>
          <button onClick={onUndo} disabled={todayCount === 0}>
            undo
          </button>
        </span>
      ) : (
        <span className="completion-controls">
          {fulfilled ? (
            <button onClick={onUndo}>✓ done today</button>
          ) : (
            <button onClick={onComplete}>mark done</button>
          )}
        </span>
      )}
      <span className="row-buttons">
        <button
          onClick={onMoveUp}
          disabled={reorderDisabled}
          title={reorderDisabled ? 'clear the symbol filter to re-order' : ''}
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={reorderDisabled}
          title={reorderDisabled ? 'clear the symbol filter to re-order' : ''}
        >
          ▼
        </button>
        <button onClick={onEdit}>edit</button>
        <button onClick={onArchive}>archive</button>
      </span>
    </li>
  )
}

export default HabitRow
