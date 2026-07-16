// The habit list screen (T1.3 — ugly on purpose; the design pass is M5).
// This component owns the app's state and persistence; every rule about
// habits, days and completions is delegated to the game modules, and
// all saving goes through the storage module.

import { useEffect, useState } from 'react'
import { editablePastDays, habitsOn, isCheckInDue } from './game/checkin.js'
import { CLOCK_CHECK_MS } from './game/constants.js'
import {
  countFor,
  countOn,
  recordCompletion,
  recordRetroCompletion,
  removeCompletionsFor,
  removeLatestOn,
} from './game/completions.js'
import { addDays, dayKeyFromTimestamp } from './game/days.js'
import { shouldOpenFieldNotes } from './game/fieldnotes.js'
import {
  activeHabits,
  addHabit,
  archiveHabit,
  archivedHabits,
  changeSchedule,
  createHabit,
  filterBySymbols,
  moveHabit,
  removeHabit,
  sameSchedule,
  unarchiveHabit,
  updateHabit,
} from './game/habits.js'
import {
  archivesWhenDone,
  currentStreak,
  isDayFulfilled,
  requiredPerDay,
  streakKind,
} from './game/schedule.js'
import {
  exportData,
  hasData,
  importData,
  loadData,
  saveData,
} from './storage/storage.js'
import BackupControls from './ui/BackupControls.jsx'
import CheckInPanel from './ui/CheckInPanel.jsx'
import FieldNotes from './ui/FieldNotes.jsx'
import HabitForm from './ui/HabitForm.jsx'
import HabitRow from './ui/HabitRow.jsx'
import Meters from './ui/Meters.jsx'
import StubPage from './ui/StubPage.jsx'
import SymbolPicker from './ui/SymbolPicker.jsx'

function App() {
  const [data, setData] = useState(loadData)
  // The symbol filter is a temporary lens: plain component state, so it
  // resets on every visit (spec §5b).
  const [filter, setFilter] = useState([])
  // What the form area is doing: null (closed), 'new', or a habit id.
  const [editing, setEditing] = useState(null)
  // Which screen is showing (T2.2): the habit list, one of the
  // placeholder pages behind the meters ('map' | 'bookcase' | 'market'),
  // or the field notes ('fieldnotes', T2.3).
  // Plain component state — a reload lands back on the list.
  const [page, setPage] = useState(null)

  // The page's own clock (Kimia's requirement 2026-07-15): a tab left
  // open must notice the new Habitat day by itself, like a fresh visit —
  // no refresh needed. Re-checked once a minute, and immediately when
  // the tab comes back into view (background tabs get throttled timers,
  // so "the moment you look again" is the check that matters).
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const refresh = () => setNow(Date.now())
    const timer = setInterval(refresh, CLOCK_CHECK_MS)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const today = dayKeyFromTimestamp(now, data.settings.dayCutoffHour)
  const active = activeHabits(data.habits)
  const visible = filterBySymbols(active, filter)
  const archived = archivedHabits(data.habits)

  // The check-in (T1.4). Decided once, on load: if yesterday (or an
  // older still-editable day) was missed and never answered, the app
  // opens with the check-in, and only its done button — which saves
  // the answer — leads back to the list. It can also be opened by hand
  // any time to edit the week's earlier days. Kept open by state, not
  // recomputed, so marking a habit doesn't yank the panel away
  // mid-answer.
  const [checkInOpen, setCheckInOpen] = useState(() =>
    isCheckInDue(
      data.habits,
      data.completions,
      data.checkedInThrough,
      today,
      data.settings.dayCutoffHour,
    ),
  )

  // When the day rolls over while the page is open, ask again — exactly
  // as if this were a fresh visit. Keyed on the day, not the data, so
  // marking habits mid-answer can never re-trigger or close the panel;
  // this only ever opens it.
  useEffect(() => {
    if (
      isCheckInDue(
        data.habits,
        data.completions,
        data.checkedInThrough,
        today,
        data.settings.dayCutoffHour,
      )
    ) {
      setCheckInOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])
  // The Sunday ritual (T2.3, Kimia's decision 2026-07-16): on the
  // first visit of each Sunday — once any check-in is answered — the
  // field notes open by themselves. Settings remember the day it last
  // happened, so later visits that Sunday go straight to the list.
  useEffect(() => {
    if (checkInOpen || data.habits.length === 0) return
    if (!shouldOpenFieldNotes(today, data.settings.fieldNotesShownOn)) return
    save({ ...data, settings: { ...data.settings, fieldNotesShownOn: today } })
    setPage('fieldnotes')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInOpen, today])

  const pastDaysEditable = editablePastDays(today).some(
    (day) =>
      habitsOn(data.habits, data.completions, day, data.settings.dayCutoffHour)
        .length > 0,
  )

  // Every change goes through here: validate-and-persist, then render.
  function save(next) {
    saveData(next)
    setData(next)
  }

  function toggleFilter(symbol) {
    setFilter(
      filter.includes(symbol)
        ? filter.filter((s) => s !== symbol)
        : [...filter, symbol],
    )
  }

  function handleCreate(fields) {
    save({ ...data, habits: addHabit(data.habits, createHabit(fields)) })
    setEditing(null)
  }

  // Saving an edit (reworked in T2.3): schedule changes go through
  // changeSchedule so they're date-stamped and never rewrite the past.
  // Switching between day-counted and week-counted schedules restarts
  // the streak — the user is warned before that saves (Kimia's
  // decision 2026-07-16).
  function handleEdit(habit, fields) {
    const { schedule, ...rest } = fields
    let updated = updateHabit(habit, rest)
    if (!sameSchedule(habit.schedule, schedule)) {
      const oldKind = streakKind(habit.schedule.type)
      if (oldKind !== null && oldKind !== streakKind(schedule.type)) {
        const streak = currentStreak(
          habit,
          data.completions,
          now,
          data.settings.dayCutoffHour,
        )
        if (streak >= 1) {
          const plural = streak === 1 ? oldKind : `${oldKind}s`
          const sure = window.confirm(
            `Heads up: this schedule change switches how "${habit.name}"'s ` +
              `streak is counted, so the current streak (${streak} ${plural}) ` +
              'starts fresh from today. Save anyway?',
          )
          if (!sure) return // nothing saved; the form stays open
        }
      }
      updated = changeSchedule(updated, schedule, today)
    }
    save({
      ...data,
      habits: data.habits.map((h) => (h.id === habit.id ? updated : h)),
    })
    setEditing(null)
  }

  function replaceHabit(updated) {
    save({
      ...data,
      habits: data.habits.map((h) => (h.id === updated.id ? updated : h)),
    })
  }

  function handleComplete(habit) {
    const completion = recordCompletion(habit.id, data.settings.dayCutoffHour)
    const next = { ...data, completions: [...data.completions, completion] }
    // A one-time to-do is finished for good: archive it in the same save.
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? archiveHabit(h) : h,
      )
    }
    save(next)
  }

  // Undo an accidentally checked-off one-time to-do (today only): the
  // mark is removed AND the task comes back out of the archive, open
  // again — as if the tap never happened.
  function handleUndoOneTime(habit) {
    save({
      ...data,
      habits: data.habits.map((h) =>
        h.id === habit.id ? unarchiveHabit(h) : h,
      ),
      completions: removeLatestOn(data.completions, habit.id, today),
    })
  }

  function handleUndo(habit) {
    save({
      ...data,
      completions: removeLatestOn(data.completions, habit.id, today),
    })
  }

  // A check-in mark: recorded against the day it was DONE (the game
  // module refuses days outside the backfill window). A one-time to-do
  // marked here is finished for good, exactly as if tapped live.
  function handleRetroMark(habit, dayKey) {
    const completion = recordRetroCompletion(
      habit.id,
      dayKey,
      data.settings.dayCutoffHour,
    )
    const next = { ...data, completions: [...data.completions, completion] }
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? archiveHabit(h) : h,
      )
    }
    save(next)
  }

  function handleRetroUndo(habit, dayKey) {
    const next = {
      ...data,
      completions: removeLatestOn(data.completions, habit.id, dayKey),
    }
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? unarchiveHabit(h) : h,
      )
    }
    save(next)
  }

  // The done button: remember that yesterday's check-in was answered —
  // whatever was left unmarked is now, neutrally, "not done".
  function handleCheckInDone() {
    save({ ...data, checkedInThrough: addDays(today, -1) })
    setCheckInOpen(false)
  }

  // Move one step up (-1) or down (+1) past the neighbouring VISIBLE
  // habit. moveHabit works on the full list, so the target position is
  // the neighbour's position there — archived habits in between don't
  // get in the way. Disabled while a filter is on (moving within a
  // partial view would be ambiguous).
  function handleMove(habit, direction) {
    const at = visible.findIndex((h) => h.id === habit.id)
    const neighbour = visible[at + direction]
    if (!neighbour) return // already at the edge
    const target = data.habits.findIndex((h) => h.id === neighbour.id)
    save({ ...data, habits: moveHabit(data.habits, habit.id, target) })
  }

  function handleDelete(habit) {
    const sure = window.confirm(
      `Delete "${habit.name}" forever? Its whole history goes with it. ` +
        'Archiving (already done) keeps the history.',
    )
    if (!sure) return
    save({
      ...data,
      habits: removeHabit(data.habits, habit.id),
      completions: removeCompletionsFor(data.completions, habit.id),
    })
  }

  function handleExport() {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `habitat-backup-${today}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(text) {
    if (hasData()) {
      const sure = window.confirm(
        'Importing replaces EVERYTHING currently in Habitat with the ' +
          'backup file. Continue?',
      )
      if (!sure) return 'import cancelled — nothing was changed'
    }
    setData(importData(text))
    setEditing(null)
    return 'backup imported'
  }

  // While the check-in is open it IS the app: the list waits behind it,
  // and the done button (which saves the answer) is the only way back.
  // No meters here (Kimia's decision 2026-07-16) — the check-in stays
  // focused on answering yesterday.
  if (checkInOpen) {
    return (
      <main className="app">
        <h1>HABITAT</h1>
        <CheckInPanel
          habits={data.habits}
          completions={data.completions}
          todayKey={today}
          cutoffHour={data.settings.dayCutoffHour}
          onMark={handleRetroMark}
          onUnmark={handleRetroUndo}
          onDone={handleCheckInDone}
        />
      </main>
    )
  }

  // The three meters (T2.2). Expedition is computed live from the
  // completion history; literacy and the fungus wallet have no data
  // sources until drops arrive in M3, so they read as empty for now.
  const meters = (
    <Meters
      completions={data.completions}
      readingItems={[]}
      fungusBalance={0}
      onOpen={setPage}
    />
  )

  // The HABITAT header doubles as the home link (Kimia's request
  // 2026-07-16): from the Map, Bookcase or Market it always leads back
  // to the habit list. The check-in screen above deliberately keeps a
  // plain header — its done button stays the only way out, so
  // yesterday always gets answered.
  const header = (
    <h1>
      <button className="home-link" onClick={() => setPage(null)}>
        HABITAT
      </button>
    </h1>
  )

  // The field notes (T2.3): the weekly view, with the meters still up
  // top — like every page reached from the list (spec §5).
  if (page === 'fieldnotes') {
    return (
      <main className="app">
        {header}
        {meters}
        <FieldNotes
          habits={data.habits}
          completions={data.completions}
          cutoffHour={data.settings.dayCutoffHour}
          now={now}
          onBack={() => setPage(null)}
        />
      </main>
    )
  }

  // A meter was clicked: its placeholder page (Map/Bookcase/Market
  // arrive for real in M4), with the meters still up top.
  if (page !== null) {
    return (
      <main className="app">
        {header}
        {meters}
        <StubPage page={page} onBack={() => setPage(null)} />
      </main>
    )
  }

  return (
    <main className="app">
      {header}
      {meters}

      <section aria-label="filter">
        <SymbolPicker selected={filter} onToggle={toggleFilter} />
      </section>

      {editing === 'new' ? (
        <HabitForm onSave={handleCreate} onCancel={() => setEditing(null)} />
      ) : (
        <>
          <button onClick={() => setEditing('new')}>+ new habit</button>
          {pastDaysEditable && (
            <button onClick={() => setCheckInOpen(true)}>edit past days</button>
          )}
          <button onClick={() => setPage('fieldnotes')}>field notes</button>
        </>
      )}

      <ul className="habit-list">
        {visible.map((habit) =>
          editing === habit.id ? (
            <li key={habit.id}>
              <HabitForm
                initial={habit}
                onSave={(fields) => handleEdit(habit, fields)}
                onCancel={() => setEditing(null)}
              />
            </li>
          ) : (
            <HabitRow
              key={habit.id}
              habit={habit}
              todayCount={countOn(data.completions, habit.id, today)}
              required={requiredPerDay(habit, today)}
              fulfilled={isDayFulfilled(habit, data.completions, today)}
              reorderDisabled={filter.length > 0}
              onComplete={() => handleComplete(habit)}
              onUndo={() => handleUndo(habit)}
              onMoveUp={() => handleMove(habit, -1)}
              onMoveDown={() => handleMove(habit, +1)}
              onEdit={() => setEditing(habit.id)}
              onArchive={() => replaceHabit(archiveHabit(habit))}
            />
          ),
        )}
      </ul>
      {visible.length === 0 && <p>nothing here yet</p>}

      {archived.length > 0 && (
        <details className="archived">
          <summary>archived ({archived.length})</summary>
          <ul>
            {archived.map((habit) => {
              // A one-time to-do that landed here BY being checked off:
              // undo-able today, otherwise it just reads as done. A
              // one-time habit archived by hand (no mark) unarchives
              // normally, like any other habit.
              const doneForGood =
                archivesWhenDone(habit) &&
                countFor(data.completions, habit.id) > 0
              return (
                <li key={habit.id} className="archived-row">
                  <span>{habit.name}</span>
                  {doneForGood ? (
                    countOn(data.completions, habit.id, today) > 0 ? (
                      <button onClick={() => handleUndoOneTime(habit)}>
                        undo
                      </button>
                    ) : (
                      <span className="habit-meta">
                        done{' '}
                        {
                          data.completions.find((c) => c.habitId === habit.id)
                            .dayKey
                        }
                      </span>
                    )
                  ) : (
                    <button onClick={() => replaceHabit(unarchiveHabit(habit))}>
                      unarchive
                    </button>
                  )}
                  <button onClick={() => handleDelete(habit)}>
                    delete forever
                  </button>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      <BackupControls onExport={handleExport} onImport={handleImport} />
    </main>
  )
}

export default App
