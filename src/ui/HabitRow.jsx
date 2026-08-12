// One habit in the list: its symbol, name, schedule-at-a-glance, the
// tap-to-complete control, and the row buttons (edit, archive).
// Pure display + callbacks — every decision is made in App via the game
// modules.

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
  settling,
  leaving,
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

  // Drag-to-reorder starts anywhere on the tile (2026-08-11 — it used to
  // be the grip only; the grip itself was retired 2026-08-11, Kimia's
  // call, now that the whole tile does its job). A press that lands on
  // one of the row's controls is left alone, so +1, -1, the to-do tick,
  // edit and archive still just tap; everywhere else — the charm, the
  // name, the meta line, the empty space between them — is a grab.
  function handlePointerDown(event) {
    if (reorderDisabled) return
    if (event.target.closest('button, input, a, select, textarea')) return
    onReorderStart(event)
  }

  return (
    <li
      // `charm-N` tells the stylesheet which of the six this row wears,
      // so it can be edged in that charm's own colour (T5.2b, §11b).
      // The class carries the NUMBER only — the colours themselves stay
      // in tokens.css, which is what keeps them a list Kimia can edit.
      className={
        `habit-row charm-${habit.symbol}` +
        (dragging ? ' habit-row--dragging' : '') +
        // Just dropped: still lit, still lifted, gliding into its new
        // slot (2026-08-11). App decides how long this lasts and drives
        // the glide itself; the class is only the look.
        (settling ? ' habit-row--settling' : '') +
        (reorderDisabled ? ' habit-row--fixed' : '') +
        // On its way to the archive: the stylesheet sinks and fades it
        // (2026-08-11). App keeps it on screen for exactly as long as
        // the animation lasts, then drops it.
        (leaving ? ' habit-row--leaving' : '')
      }
      data-habit-id={habit.id}
      // With the grip gone, this is where the "why won't it move?" answer
      // lives: while a symbol filter is on, the list is a partial lens and
      // nothing re-orders, so the tile itself says so on hover. No title
      // at all the rest of the time — a tooltip on every tile would be
      // noise.
      title={
        reorderDisabled ? 'clear the symbol filter to re-order' : undefined
      }
      onPointerDown={handlePointerDown}
      // A dragged tile follows the pointer and sits a touch larger while
      // it travels — picked up rather than pushed along. The stylesheet
      // eases this transform rather than applying it instantly, which is
      // what makes the movement float (2026-08-11).
      style={
        dragging
          ? { transform: `translateY(${dragOffsetY}px) scale(1.02)` }
          : undefined
      }
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
            className="todo-check circle-button"
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
          <button className="circle-button" onClick={onComplete}>
            +1
          </button>
          <button
            className="circle-button"
            onClick={onUndo}
            disabled={todayCount === 0}
          >
            -1
          </button>
        </span>
      )}
      <span className="row-buttons">
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
