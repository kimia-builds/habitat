// The habit list screen (T1.3 — ugly on purpose; the design pass is M5).
// This component owns the app's state and persistence; every rule about
// habits, days and completions is delegated to the game modules, and
// all saving goes through the storage module.

import { useState } from 'react'
import {
  countFor,
  countOn,
  recordCompletion,
  removeCompletionsFor,
  removeLatestOn,
} from './game/completions.js'
import { dayKeyFromTimestamp } from './game/days.js'
import {
  activeHabits,
  addHabit,
  archiveHabit,
  archivedHabits,
  createHabit,
  filterBySymbols,
  moveHabit,
  removeHabit,
  unarchiveHabit,
  updateHabit,
} from './game/habits.js'
import {
  archivesWhenDone,
  isDayFulfilled,
  requiredPerDay,
} from './game/schedule.js'
import {
  exportData,
  hasData,
  importData,
  loadData,
  saveData,
} from './storage/storage.js'
import BackupControls from './ui/BackupControls.jsx'
import HabitForm from './ui/HabitForm.jsx'
import HabitRow from './ui/HabitRow.jsx'
import SymbolPicker from './ui/SymbolPicker.jsx'

function App() {
  const [data, setData] = useState(loadData)
  // The symbol filter is a temporary lens: plain component state, so it
  // resets on every visit (spec §5b).
  const [filter, setFilter] = useState([])
  // What the form area is doing: null (closed), 'new', or a habit id.
  const [editing, setEditing] = useState(null)

  const today = dayKeyFromTimestamp(Date.now(), data.settings.dayCutoffHour)
  const active = activeHabits(data.habits)
  const visible = filterBySymbols(active, filter)
  const archived = archivedHabits(data.habits)

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

  function handleEdit(habit, fields) {
    const updated = updateHabit(habit, fields)
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

  return (
    <main className="app">
      <h1>HABITAT</h1>

      <section aria-label="filter">
        <SymbolPicker selected={filter} onToggle={toggleFilter} />
      </section>

      {editing === 'new' ? (
        <HabitForm onSave={handleCreate} onCancel={() => setEditing(null)} />
      ) : (
        <button onClick={() => setEditing('new')}>+ new habit</button>
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
              required={requiredPerDay(habit)}
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
