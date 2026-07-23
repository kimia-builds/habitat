// One habit in the list: its symbol, name, schedule-at-a-glance, the
// tap-to-complete control, and the row buttons (drag handle, edit,
// archive). Pure display + callbacks — every decision is made in App
// via the game modules.

import CharmSymbol from './CharmSymbol.jsx'

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
  arrivalNote,
  todayCount,
  required,
  fulfilled,
  reorderDisabled,
  dragging,
  dragOffsetY,
  onComplete,
  onUndo,
  onReorderStart,
  onEdit,
  onArchive,
}) {
  // Every repeating shape presents as a counter with an unlimited +1
  // and a quiet, always-available -1 (T3.2b — spec §4.1; the word
  // "undo" became "-1" in T4.5, 2026-07-20). Only one-time to-dos keep
  // the single-tap control: the first tap finishes and archives them.
  const oneTime = habit.schedule.type === 'oneTime'
  // Shapes with a per-day goal show "count/goal today"; N-per-week and
  // whenever have no per-day expectation, so they show a plain count
  // (Kimia's decision 2026-07-19 — the week target already sits in the
  // small print).
  const hasDayGoal = ['daily', 'weekdays', 'nPerDay'].includes(
    habit.schedule.type,
  )

  return (
    <li
      className={`habit-row${dragging ? ' habit-row--dragging' : ''}`}
      data-habit-id={habit.id}
      style={dragging ? { transform: `translateY(${dragOffsetY}px)` } : undefined}
    >
      <CharmSymbol symbol={habit.symbol} className="symbol" />
      <span className="habit-main">
        <span className="habit-name">{habit.name}</span>
        {habit.description && (
          <span className="habit-description">{habit.description}</span>
        )}
        <span className="habit-meta">
          {scheduleSummary(habit.schedule)} · {habit.difficulty}
        </span>
        {/* The quiet by-the-habit note (T3.2): while this habit's
            drops are still on the arrival shelf, a soft line here
            says what the tap turned up. No neon — that's reserved
            for the first-occurrence reveals. */}
        {arrivalNote && <span className="arrival-note">{arrivalNote}</span>}
      </span>
      {oneTime ? (
        <span className="completion-controls">
          {/* One-time to-dos are an empty checkbox until done; ticking it
              finishes and archives them. Hover reads "mark done". */}
          <input
            type="checkbox"
            className="todo-check"
            checked={false}
            onChange={onComplete}
            title="mark done"
            aria-label="mark done"
          />
        </span>
      ) : (
        <span className="completion-controls">
          <span>
            {fulfilled && hasDayGoal ? '✓ ' : ''}
            {hasDayGoal ? `${todayCount}/${required}` : todayCount}
          </span>
          <button onClick={onComplete}>+1</button>
          <button onClick={onUndo} disabled={todayCount === 0}>
            -1
          </button>
        </span>
      )}
      <span className="row-buttons">
        {/* Drag-to-reorder (T5.1c, 2026-07-23): grab this handle and drag
            the row up or down; the new order persists. It replaces the old
            ▲▼ arrows. Desktop-only (T5.1b), so a pointer press is the only
            input we support. While a symbol filter is on the list is a
            partial lens, so reordering is disabled and the hover explains
            why. */}
        <button
          className="icon-button drag-handle"
          onPointerDown={reorderDisabled ? undefined : onReorderStart}
          disabled={reorderDisabled}
          title={
            reorderDisabled
              ? 'clear the symbol filter to re-order'
              : 'drag to re-order'
          }
          aria-label="re-order"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="9" cy="6" r="1.4" />
            <circle cx="15" cy="6" r="1.4" />
            <circle cx="9" cy="12" r="1.4" />
            <circle cx="15" cy="12" r="1.4" />
            <circle cx="9" cy="18" r="1.4" />
            <circle cx="15" cy="18" r="1.4" />
          </svg>
        </button>
        {/* T4.5's icon-only actions (decision 2026-07-20): every action is
            an icon with a hover label — title + aria-label carry the words. */}
        <button
          className="icon-button"
          onClick={onEdit}
          title="edit"
          aria-label="edit"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 20l1-4L16.5 4.5a2.12 2.12 0 0 1 3 3L8 19l-4 1z" />
          </svg>
        </button>
        <button
          className="icon-button"
          onClick={onArchive}
          title="archive"
          aria-label="archive"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 14h16v7H4z" />
            <path d="M12 3v8" />
            <path d="M8.5 7.5L12 11l3.5-3.5" />
          </svg>
        </button>
      </span>
    </li>
  )
}

export default HabitRow
