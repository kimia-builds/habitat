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
import { useText } from './language.jsx'

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

// THE SPOTLIGHT (Kimia's call 2026-08-20). A cameo is momentary: it
// performs, it says its one sentence, and it is gone — so there was no
// way to go back and interrogate a claim it made. Pressing the visit
// now brings you here, and what it opens is a blackout: everything on
// the page goes dark and the record that fell stands alone in it, lit
// the same rose a visiting friend wears. Click anywhere to escape and
// the week is underneath, where it always was.
//
// EVERY record that fell today, not just the one the cameo spoke for:
// only one friend may visit a day, so if two habits both broke a record
// the second would otherwise be unfindable — and there is no catching
// the notice again.
//
// It stores nothing. Leaving the page or reloading loses it, exactly
// like the visit that opened it.
function StreakSpotlight({ streaks, onDismiss }) {
  const { t } = useText()
  const unit = (kind) =>
    kind === 'week' ? t('fieldNotes.unitWeek') : t('fieldNotes.unitDay')
  return (
    <div
      className="streak-spotlight"
      role="button"
      tabIndex={0}
      aria-label={t('fieldNotes.spotlightDismiss')}
      onClick={onDismiss}
      onKeyDown={(event) => {
        if (['Enter', ' ', 'Escape'].includes(event.key)) onDismiss()
      }}
    >
      <p className="streak-spotlight-title">{t('fieldNotes.spotlightTitle')}</p>
      <ul className="streak-spotlight-list">
        {streaks.map((streak) => (
          <li key={streak.habitId}>
            <span className="streak-spotlight-habit">{streak.habitName}</span>
            <span className="streak-spotlight-run">
              {t('fieldNotes.streak', {
                n: streak.n,
                unit: unit(streak.unit),
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
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
  // The record(s) a cameo sent you here to look at, or null for the
  // ordinary visit to this page — see StreakSpotlight.
  spotlight = null,
  onDismissSpotlight = () => {},
}) {
  const { t } = useText()
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
  //
  // …unless a cameo sent you here (2026-08-20), in which case the week
  // that matters is the one the record is standing in — THIS one. The
  // page opened on last week otherwise, so escaping the blackout landed
  // on a row reporting a two-day streak directly under a spotlight that
  // had just announced five.
  const [chosenWeek, setWeek] = useState(
    spotlight !== null || firstWeek === null || firstWeek > lastCompletedWeek
      ? thisWeek
      : lastCompletedWeek,
  )

  // The same row of charms the habit list carries — the SAME element in
  // the same place, too (Kimia, 2026-08-11): it sits above the page's
  // box rather than inside it, so it is centred and sized exactly as it
  // is on the home screen. The charms are the page's lens, not part of
  // its notes, and the outline starts below them.
  const lens = (
    <section
      className="filter-view"
      aria-label={t('habits.filterView')}
      title={t('habits.filterView')}
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
        <section className="field-notes" aria-label={t('page.fieldNotes')}>
          <p>{t('fieldNotes.nothingYet')}</p>
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
      {spotlight !== null && (
        <StreakSpotlight streaks={spotlight} onDismiss={onDismissSpotlight} />
      )}
      {lens}
      <section className="field-notes" aria-label={t('page.fieldNotes')}>
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
              <em className="week-unfolding">
                {t('fieldNotes.stillUnfolding')}
              </em>
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
                    {streak !== null &&
                      t('fieldNotes.streak', {
                        n: streak,
                        unit: t(
                          streakUnit === 'week'
                            ? 'fieldNotes.unitWeek'
                            : 'fieldNotes.unitDay',
                        ),
                      })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t('fieldNotes.noHabitsThatWeek')}</p>
        )}

        {notes.tasksCompleted.length > 0 && (
          <>
            <h3>{t('fieldNotes.tasksCompleted')}</h3>
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
