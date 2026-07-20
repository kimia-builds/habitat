// The habit list screen (T1.3 — ugly on purpose; the design pass is M5).
// This component owns the app's state and persistence; every rule about
// habits, days and completions is delegated to the game modules, and
// all saving goes through the storage module.

import { useEffect, useState } from 'react'
import {
  abodeItems,
  placeFlora,
  placeObject,
  pruneAbodeLayout,
} from './game/abode.js'
import {
  deliverDrops,
  dropKey,
  readingItemsFrom,
  seenDropKeys,
} from './game/arrivals.js'
import { editablePastDays, habitsOn, isCheckInDue } from './game/checkin.js'
import { CLOCK_CHECK_MS } from './game/constants.js'
import {
  bookcaseItems,
  faceBook,
  placeBook,
  pruneBookcaseLayout,
} from './game/bookcase.js'
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
  decideFlora,
  floraFinds,
  floraStatus,
  pruneFloraDecisions,
} from './game/flora.js'
import {
  buyObject,
  livedDayCount,
  marketPool,
  rotationIndex,
  sellObject,
  stallObjects,
  walletBalance,
} from './game/market.js'
import { discoveredRegionCount } from './game/map.js'
import { expeditionSteps } from './game/meters.js'
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
import AbodePage from './ui/AbodePage.jsx'
import ArrivalShelf from './ui/ArrivalShelf.jsx'
import { arrivalNote } from './ui/arrivalText.js'
import BackupControls from './ui/BackupControls.jsx'
import BookcasePage from './ui/BookcasePage.jsx'
import CheckInPanel from './ui/CheckInPanel.jsx'
import FieldNotes from './ui/FieldNotes.jsx'
import FirstReveal from './ui/FirstReveal.jsx'
import HabitForm from './ui/HabitForm.jsx'
import HabitRow from './ui/HabitRow.jsx'
import MapPage from './ui/MapPage.jsx'
import MarketPage from './ui/MarketPage.jsx'
import Meters from './ui/Meters.jsx'
import SpreadPopup from './ui/SpreadPopup.jsx'
import SymbolPicker from './ui/SymbolPicker.jsx'

function App() {
  const [data, setData] = useState(loadData)
  // The symbol filter is a temporary lens: plain component state, so it
  // resets on every visit (spec §5b).
  const [filter, setFilter] = useState([])
  // What the form area is doing: null (closed), 'new', or a habit id.
  const [editing, setEditing] = useState(null)
  // Which screen is showing: the habit list, one of the world pages
  // behind the meters or the list's links ('map' | 'bookcase' |
  // 'market' | 'abode'), or the field notes ('fieldnotes', T2.3).
  // Plain component state — a reload lands back on the list.
  const [page, setPage] = useState(null)

  // Drop arrivals on screen (T3.2) — transient by nature, so plain
  // component state: the DROPS themselves are stored on completions;
  // these are only the announcements currently showing.
  //   arrivals        — on the shelf right now (each fades on its own)
  //   pendingArrivals — earned during an open check-in, held back until
  //                     its done button (Kimia's decision 2026-07-19:
  //                     the check-in stays distraction-free)
  //   seenRevealIds   — first-occurrence reveals already dismissed this
  //                     visit, so one reveal shows at a time, once
  const [arrivals, setArrivals] = useState([])
  const [pendingArrivals, setPendingArrivals] = useState([])
  const [seenRevealIds, setSeenRevealIds] = useState(() => new Set())
  // The publication being read right now (T3.5) — the spread popup is
  // open while this is set. Screen state only, and deliberately so:
  // reading is tracked nowhere (Kimia's decision 2026-07-19), so
  // nothing about it may ever reach storage.
  const [readingItem, setReadingItem] = useState(null)

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
  // Announcements are pruned to completions that still exist, so ANY
  // undo — live, retro, one-time — takes its on-screen arrivals away
  // with it, exactly as it takes the stored drops. Flora decisions are
  // pruned the same way (T3.3): undo a completion and its find — plus
  // whatever was decided about it — is gone, as if it never dropped.
  // And the bookcase layout is pruned likewise (T4.2): the undone
  // completion's publication leaves the shelf, place and all. The
  // abode layout follows the same rule (T4.3), with two more ways out:
  // a composted flora or a sold-back object (T4.3b) leaves the ground,
  // place and all.
  function save(next) {
    const floraDecisions = pruneFloraDecisions(
      next.floraDecisions,
      next.completions,
    )
    next = {
      ...next,
      floraDecisions,
      bookcaseLayout: pruneBookcaseLayout(
        next.bookcaseLayout,
        next.completions,
      ),
      abodeLayout: pruneAbodeLayout(
        next.abodeLayout,
        next.completions,
        floraDecisions,
        next.purchases,
      ),
    }
    saveData(next)
    setData(next)
    const alive = new Set(next.completions.map((c) => c.id))
    // Sale arrivals (T4.3b) belong to no completion — they answer to
    // their own short linger, not to this pruning.
    const prune = (list) =>
      list.filter((a) => a.sale || alive.has(a.completionId))
    setArrivals(prune)
    setPendingArrivals(prune)
  }

  // Turn one just-saved completion's drops into on-screen arrivals.
  // `before` is the completions list WITHOUT this completion: a drop
  // family absent from it is a first, and owes its neon reveal.
  // Deferred arrivals (check-in marks) wait for the done button.
  function announceDrops(completion, before, deferred) {
    if (completion.drops.length === 0) return
    const seen = seenDropKeys(before)
    const items = completion.drops.map((drop, index) => ({
      id: `${completion.id}:${index}`,
      completionId: completion.id,
      habitId: completion.habitId,
      key: dropKey(drop),
      amount: drop.kind === 'fungi' ? drop.amount : null,
      first: !seen.has(dropKey(drop)),
    }))
    const append = (list) => [...list, ...items]
    if (deferred) setPendingArrivals(append)
    else setArrivals(append)
  }

  // One decision about one flora find (T3.3): gather, leave, or (from
  // the Abode) compost. The game module enforces what may follow what.
  function handleFloraDecision(completionId, decision) {
    save({
      ...data,
      floraDecisions: decideFlora(
        data.floraDecisions,
        data.completions,
        completionId,
        decision,
      ),
    })
  }

  // The Abode arrangement (T4.3): something on the ground dragged to
  // its place, remembered per item (storage v6); the game module clamps
  // the place into the scene and refuses items that aren't there. Since
  // T4.3b the ground holds two id families — a flora's completion id or
  // an object's purchase id — so the kind is told by who owns the id.
  function handleItemMove(itemId, point) {
    const isObject = data.purchases.some((p) => p.id === itemId)
    save({
      ...data,
      abodeLayout: isObject
        ? placeObject(data.abodeLayout, data.purchases, itemId, point)
        : placeFlora(
            data.abodeLayout,
            data.completions,
            data.floraDecisions,
            itemId,
            point,
          ),
    })
  }

  // Buying at the stall (T4.3b): a new owned instance with its price
  // frozen at buy time — duplicates allowed (Kimia's call 2026-07-20).
  // The wallet is derived, so it falls by the price on its own; the
  // game module refuses to overdraw (the buy button is already dimmed
  // then, so this is the backstop, never the message).
  function handleBuy(object) {
    save({
      ...data,
      purchases: buyObject(
        data.purchases,
        object,
        walletBalance(data.completions, data.purchases),
      ),
    })
  }

  // Selling an owned object back to the world (T4.3b): it leaves the
  // ground and the wallet rises by exactly its frozen price — a round
  // trip is always fungus-neutral. The refund is announced with the
  // same arrival feedback a fungus drop shows (Kimia's call
  // 2026-07-20): a fungi arrival that lingers and fades. It belongs to
  // no completion, so it carries the sale marker past save()'s pruning.
  function handleSell(purchaseId) {
    const sold = data.purchases.find((p) => p.id === purchaseId)
    if (!sold) return
    save({ ...data, purchases: sellObject(data.purchases, purchaseId) })
    setArrivals((list) => [
      ...list,
      {
        id: `sale:${purchaseId}`,
        completionId: null,
        habitId: null,
        key: 'fungi',
        amount: sold.price,
        first: false,
        sale: true,
      },
    ])
  }

  // The Bookcase arrangement (T4.2): a book dragged to its place, or
  // turned spine ↔ front. Both are remembered per publication (storage
  // v5); the game module clamps the place into the shelf and refuses
  // books that aren't there.
  function handleBookMove(publicationId, point) {
    save({
      ...data,
      bookcaseLayout: placeBook(
        data.bookcaseLayout,
        data.completions,
        publicationId,
        point,
      ),
    })
  }

  function handleBookFace(publicationId, facing) {
    save({
      ...data,
      bookcaseLayout: faceBook(
        data.bookcaseLayout,
        data.completions,
        publicationId,
        facing,
      ),
    })
  }

  // Read now on a held arrival (T3.5): the spread popup opens and the
  // arrival is let go — the overlay covers the shelf, so by the time
  // the popup closes the arrival is quietly gone (Kimia's call
  // 2026-07-19). The piece is in the Bookcase regardless.
  // (publicationId stays null until T6.1 names the publications, so
  // the popup shows its empty state for now.)
  function handleReadNow(arrival) {
    setArrivals((list) => list.filter((a) => a.id !== arrival.id))
    setReadingItem({ type: arrival.key, publicationId: null })
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
    // The tap rolls its drops right here (T3.2) and stores them on the
    // completion — settled at tap time, forever.
    const completion = deliverDrops(
      recordCompletion(habit.id, data.settings.dayCutoffHour),
      habit,
      data.completions,
      data.worldSeed,
    )
    const next = { ...data, completions: [...data.completions, completion] }
    // A one-time to-do is finished for good: archive it in the same save.
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? archiveHabit(h) : h,
      )
    }
    save(next)
    announceDrops(completion, data.completions, false)
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
    // Retro marks roll drops exactly like live taps (Kimia's decision
    // 2026-07-19) — but their arrivals wait until the check-in's done
    // button, so answering yesterday stays distraction-free.
    const completion = deliverDrops(
      recordRetroCompletion(habit.id, dayKey, data.settings.dayCutoffHour),
      habit,
      data.completions,
      data.worldSeed,
    )
    const next = { ...data, completions: [...data.completions, completion] }
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? archiveHabit(h) : h,
      )
    }
    save(next)
    announceDrops(completion, data.completions, true)
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
    // Anything the check-in marks earned arrives now, together.
    setArrivals((list) => [...list, ...pendingArrivals])
    setPendingArrivals([])
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
    // A whole new world state: announcements from the old one are moot.
    setArrivals([])
    setPendingArrivals([])
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

  // The three meters (T2.2), all computed live from completion history
  // — since T3.2 that includes each completion's stored drops, so the
  // literacy meter and the fungus wallet finally move; since T4.3b the
  // wallet also counts what the owned market objects cost. Below them,
  // the arrival shelf and (topmost of all) any first-occurrence reveal
  // still owed: one at a time, dismissed by its own button.
  const revealing = arrivals.find((a) => a.first && !seenRevealIds.has(a.id))
  const meters = (
    <>
      <Meters
        completions={data.completions}
        readingItems={readingItemsFrom(data.completions)}
        fungusBalance={walletBalance(data.completions, data.purchases)}
        onOpen={setPage}
      />
      <ArrivalShelf
        arrivals={arrivals.map((a) => ({
          ...a,
          awaitingReveal: a.first && !seenRevealIds.has(a.id),
          // A flora arrival knows its decision state, so the shelf can
          // offer gather / leave it exactly while it's still pending.
          status:
            a.key === 'flora'
              ? floraStatus(data.floraDecisions, a.completionId)
              : null,
        }))}
        onExpire={(id) =>
          setArrivals((list) => list.filter((a) => a.id !== id))
        }
        onDecide={handleFloraDecision}
        onRead={handleReadNow}
      />
      {revealing && (
        <FirstReveal
          arrival={revealing}
          onDismiss={() =>
            setSeenRevealIds((seen) => new Set([...seen, revealing.id]))
          }
        />
      )}
      {readingItem && (
        <SpreadPopup item={readingItem} onClose={() => setReadingItem(null)} />
      )}
    </>
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

  // The Abode (T4.3): open ground under sky, gathered flora and (since
  // T4.3b) owned market objects draggable anywhere on it, their places
  // remembered; each compostable or sellable from its quiet held state.
  // Flora still waiting to be decided keep their plain list above the
  // ground. Reached from its link on the habit list.
  if (page === 'abode') {
    return (
      <main className="app">
        {header}
        {meters}
        <AbodePage
          finds={floraFinds(data.completions, data.floraDecisions)}
          items={abodeItems(
            data.completions,
            data.floraDecisions,
            data.abodeLayout,
            data.purchases,
          )}
          worldSeed={data.worldSeed}
          onDecide={handleFloraDecision}
          onMove={handleItemMove}
          onSell={handleSell}
          onBack={() => setPage(null)}
        />
      </main>
    )
  }

  // The Bookcase (T4.2): one constant bookshelf, every publication a
  // draggable book with a remembered place and facing. Reading opens
  // the T3.5 spread popup — which renders inside the meters fragment
  // above, so it opens over this page too — and is tracked nowhere.
  if (page === 'bookcase') {
    return (
      <main className="app">
        {header}
        {meters}
        <BookcasePage
          items={bookcaseItems(data.completions, data.bookcaseLayout)}
          onMove={handleBookMove}
          onFace={handleBookFace}
          onRead={setReadingItem}
          onBack={() => setPage(null)}
        />
      </main>
    )
  }

  // The Map (T4.1): the planet revealing itself region by region, all
  // derived from completion history and the world seed — undo pulls
  // the frontier back by itself.
  if (page === 'map') {
    return (
      <main className="app">
        {header}
        {meters}
        <MapPage
          completions={data.completions}
          worldSeed={data.worldSeed}
          onBack={() => setPage(null)}
        />
      </main>
    )
  }

  // The Market (T4.3b): the rotating stall. Its selection is derived,
  // never stored — lived days (counted from completion history) set the
  // rotation, discovered regions the pool — so the stall always agrees
  // with history, undo and all. Only the purchases list remembers what
  // Kimia owns; the wallet is the same derivation, drops minus owned.
  if (page === 'market') {
    const rotation = rotationIndex(livedDayCount(data.completions))
    const pool = marketPool(
      discoveredRegionCount(expeditionSteps(data.completions)),
    )
    return (
      <main className="app">
        {header}
        {meters}
        <MarketPage
          stall={stallObjects(pool, rotation)}
          purchases={data.purchases}
          wallet={walletBalance(data.completions, data.purchases)}
          worldSeed={data.worldSeed}
          onBuy={handleBuy}
          onBack={() => setPage(null)}
        />
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
          <button onClick={() => setPage('abode')}>the abode</button>
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
              arrivalNote={arrivalNote(
                arrivals.filter((a) => a.habitId === habit.id),
              )}
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
