// The habit list screen (T1.3 — ugly on purpose; the design pass is M5).
// This component owns the app's state and persistence; every rule about
// habits, days and completions is delegated to the game modules, and
// all saving goes through the storage module.

import { useCallback, useEffect, useRef, useState } from 'react'
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
import { cameoWin } from './game/cameos.js'
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
import { friendsFrom, withFriendDrop } from './game/friends.js'
import {
  buyObject,
  livedDayCount,
  marketPool,
  rotationIndex,
  sellObject,
  stallObjects,
  walletBalance,
  walletTrueBalance,
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
import { shouldShowStartup } from './game/startup.js'
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
import Cameo from './ui/Cameo.jsx'
import CharmSymbol from './ui/CharmSymbol.jsx'
import CheckInPanel from './ui/CheckInPanel.jsx'
import DateDisplay from './ui/DateDisplay.jsx'
import DesignPage from './ui/DesignPage.jsx'
import FieldNotes from './ui/FieldNotes.jsx'
import FirstReveal from './ui/FirstReveal.jsx'
import FriendReveal from './ui/FriendReveal.jsx'
import GuestBookPage from './ui/GuestBookPage.jsx'
import HabitForm from './ui/HabitForm.jsx'
import HabitRow from './ui/HabitRow.jsx'
import IconRail from './ui/IconRail.jsx'
import MapPage from './ui/MapPage.jsx'
import MarketPage from './ui/MarketPage.jsx'
import Meters from './ui/Meters.jsx'
import SpreadPopup from './ui/SpreadPopup.jsx'
import StartupFade from './ui/StartupFade.jsx'
import SymbolPicker from './ui/SymbolPicker.jsx'

// A press on a row's drag handle becomes a reorder drag once the pointer
// has travelled this many pixels; anything shorter stays a press and
// reorders nothing (mirrors the abode/bookcase drag threshold).
const REORDER_DRAG_THRESHOLD_PX = 4

function App() {
  const [data, setData] = useState(loadData)
  // The symbol filter is a temporary lens: plain component state, so it
  // resets on every visit (spec §5b).
  const [filter, setFilter] = useState([])
  // What the form area is doing: null (closed), 'new', or a habit id.
  const [editing, setEditing] = useState(null)
  // Which screen is showing: the habit list, one of the world pages
  // behind the meters or the list's links ('map' | 'bookcase' |
  // 'market' | 'abode' | 'guestbook'), or the field notes
  // ('fieldnotes', T2.3). Plain component state — a reload lands back
  // on the list.
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

  // Drag-to-reorder (T5.1c): while a habit row is being dragged, this
  // holds { id, offsetY } — which row is lifted and how far it has moved
  // vertically from where the press began — so the row can follow the
  // pointer. Screen state only; the persisted order changes just once, on
  // release. `listRef` points at the <ul> so a drag can measure the rows
  // and work out which slot the pointer is over.
  const [reorderDrag, setReorderDrag] = useState(null)
  const listRef = useRef(null)

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
  // The daily startup moment (T4.5): due on the first visit of each
  // Habitat day — the day key already carries the 3am cutoff, so a tab
  // left open overnight becomes due the moment `today` flips. It plays
  // whether or not a check-in was owed; the morning's fixed order is
  // check-in pop-up → startup fade → (Sundays) field notes.
  const startupDue = shouldShowStartup(today, data.settings.startupShownOn)
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
  // first visit of each Sunday — once any check-in is answered AND the
  // startup fade has played (T4.5's fixed morning order) — the field
  // notes open by themselves. Settings remember the day it last
  // happened, so later visits that Sunday go straight to the list.
  useEffect(() => {
    if (checkInOpen || startupDue || data.habits.length === 0) return
    if (!shouldOpenFieldNotes(today, data.settings.fieldNotesShownOn)) return
    save({ ...data, settings: { ...data.settings, fieldNotesShownOn: today } })
    setPage('fieldnotes')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInOpen, today, startupDue])

  const pastDaysEditable = editablePastDays(today).some(
    (day) =>
      habitsOn(data.habits, data.completions, day, data.settings.dayCutoffHour)
        .length > 0,
  )

  // The home-screen cameo (T4.6): a friend celebrating today's big win
  // — derived fresh from history like everything else, so undo quietly
  // takes the win (and the visit) back. It visits once per visit: after
  // its linger it expires and stays gone until a reload still finds the
  // win standing. Nothing about it is ever stored.
  const [cameoGone, setCameoGone] = useState(false)
  const expireCameo = useCallback(() => setCameoGone(true), [])
  const cameo = cameoGone
    ? null
    : cameoWin(
        data.habits,
        data.completions,
        data.worldSeed,
        now,
        data.settings.dayCutoffHour,
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
    const arrivedBefore = friendsFrom(before)
    const items = completion.drops.map((drop, index) => {
      // A friend (T4.4): EVERY arrival owes its neon reveal — not just
      // the first of a family (design-notes §5). The category's intro
      // words play only at its first arrival ever; later friends of
      // the same category arrive wordless (narration is momentary).
      if (drop.kind === 'friend') {
        return {
          id: `${completion.id}:${index}`,
          completionId: completion.id,
          habitId: completion.habitId,
          key: 'friend',
          amount: null,
          first: false,
          reveal: true,
          friend: { category: drop.category, individual: drop.individual },
          firstOfCategory: !arrivedBefore.some(
            (friend) => friend.category === drop.category,
          ),
        }
      }
      return {
        id: `${completion.id}:${index}`,
        completionId: completion.id,
        habitId: completion.habitId,
        key: dropKey(drop),
        amount: drop.kind === 'fungi' ? drop.amount : null,
        first: !seen.has(dropKey(drop)),
      }
    })
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
    // completion — settled at tap time, forever. Since T4.4 the roll
    // includes the friendship stream: a friend who is due rides along.
    const completion = withFriendDrop(
      deliverDrops(
        recordCompletion(habit.id, data.settings.dayCutoffHour),
        habit,
        data.completions,
        data.worldSeed,
      ),
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
    const completion = withFriendDrop(
      deliverDrops(
        recordRetroCompletion(habit.id, dayKey, data.settings.dayCutoffHour),
        habit,
        data.completions,
        data.worldSeed,
      ),
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

  // The startup fade has played (T4.5): remember the day so no second
  // visit today replays it — and, the moment it's saved, the Sunday
  // effect above is free to take its turn in the morning's order.
  // The save reads the LATEST data (the fade's timer fires 1.5s after
  // it mounted, and a tap in that window must never be reverted by a
  // stale closure); `today` is deliberately the mount render's — the
  // fade belongs to the Habitat day it played for.
  function handleStartupDone() {
    setData((latest) => {
      const next = {
        ...latest,
        settings: { ...latest.settings, startupShownOn: today },
      }
      saveData(next)
      return next
    })
  }

  // Drop a dragged habit onto the row `toId` sits on now. moveHabit works
  // on the full list (active + archived), so we translate that row to its
  // full-list position — archived habits in between keep their places and
  // don't get in the way. A no-op if it lands back on itself.
  function handleMoveTo(habit, toId) {
    if (!toId || toId === habit.id) return
    const target = data.habits.findIndex((h) => h.id === toId)
    if (target === -1) return
    save({ ...data, habits: moveHabit(data.habits, habit.id, target) })
  }

  // Begin a drag-to-reorder from a row's drag handle (T5.1c). We watch the
  // pointer on the WINDOW so the drag keeps tracking even when it leaves
  // the handle, and decide at release which row it landed on — the last
  // row whose top edge the pointer has passed. The dragged row itself is
  // skipped: it follows the pointer (an inline transform), so its own
  // shifted position must never count, or an upward drag would keep
  // "landing" back on itself. A press that never travels far enough stays
  // a press and reorders nothing. Reordering is off while a symbol filter
  // is on (the list is a partial lens), so the handle is disabled then and
  // this never runs. Desktop-only (T5.1b), so a single primary-button
  // pointer press is all we handle.
  function handleReorderStart(habit, event) {
    if (event.button) return // left / primary only
    event.preventDefault()
    const startY = event.clientY
    let dragging = false
    let targetId = habit.id
    function move(moveEvent) {
      const offsetY = moveEvent.clientY - startY
      if (!dragging && Math.abs(offsetY) < REORDER_DRAG_THRESHOLD_PX) return
      dragging = true
      const rows = listRef.current
        ? [...listRef.current.querySelectorAll('[data-habit-id]')]
        : []
      rows.forEach((row) => {
        const id = row.getAttribute('data-habit-id')
        if (id === habit.id) return // never the dragged row itself
        if (moveEvent.clientY >= row.getBoundingClientRect().top) targetId = id
      })
      setReorderDrag({ id: habit.id, offsetY })
    }
    function up() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setReorderDrag(null)
      if (dragging) handleMoveTo(habit, targetId)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
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

  // The home screen's contents below the meters (T4.5 rearranged them):
  // the symbol filter, the habit list, then THREE discreet icon buttons
  // at the foot of the list — + (add new habit), a larger accent pencil
  // (edit past days) and a graph (view historical data) — above the
  // archived list. Every action is an icon with a hover label
  // (2026-07-20): title + aria-label carry the words, the page carries
  // no action text. The interim "the abode" / "the guest book" links
  // are gone — the rail is now their only door. Kept as one fragment
  // because the check-in pop-up (below) dims this exact content behind
  // itself.
  const listContent = (
    <>
      <section aria-label="filter view" title="filter view">
        <SymbolPicker selected={filter} onToggle={toggleFilter} />
      </section>

      <ul className="habit-list" ref={listRef}>
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
              dragging={reorderDrag?.id === habit.id}
              dragOffsetY={reorderDrag?.id === habit.id ? reorderDrag.offsetY : 0}
              onComplete={() => handleComplete(habit)}
              onUndo={() => handleUndo(habit)}
              onReorderStart={(event) => handleReorderStart(habit, event)}
              onEdit={() => setEditing(habit.id)}
              onArchive={() => replaceHabit(archiveHabit(habit))}
            />
          ),
        )}
      </ul>
      {visible.length === 0 && <p>nothing here yet</p>}

      {editing === 'new' ? (
        <HabitForm onSave={handleCreate} onCancel={() => setEditing(null)} />
      ) : (
        <div className="list-actions">
          <button
            className="icon-button"
            onClick={() => setEditing('new')}
            title="add new habit"
            aria-label="add new habit"
          >
            +
          </button>
          {pastDaysEditable && (
            <button
              className="icon-button icon-button-accent"
              onClick={() => setCheckInOpen(true)}
              title="edit past days"
              aria-label="edit past days"
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
          )}
          <button
            className="icon-button"
            onClick={() => setPage('fieldnotes')}
            title="view historical data"
            aria-label="view historical data"
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
              <path d="M4 4v16h16" />
              <path d="M7 15l4-5 3 3 4-6" />
            </svg>
          </button>
        </div>
      )}

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
                  <CharmSymbol symbol={habit.symbol} className="symbol" />
                  <span>{habit.name}</span>
                  {doneForGood ? (
                    countOn(data.completions, habit.id, today) > 0 ? (
                      <button onClick={() => handleUndoOneTime(habit)}>
                        -1
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
                    <button
                      className="icon-button"
                      onClick={() => replaceHabit(unarchiveHabit(habit))}
                      title="unarchive"
                      aria-label="unarchive"
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
                        <path d="M12 11V3" />
                        <path d="M8.5 6.5L12 3l3.5 3.5" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="icon-button"
                    onClick={() => handleDelete(habit)}
                    title="delete forever"
                    aria-label="delete forever"
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
                      <path d="M5 7h14" />
                      <path d="M9 7V4h6v3" />
                      <path d="M6.5 7l1 13h9l1-13" />
                    </svg>
                  </button>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      <BackupControls onExport={handleExport} onImport={handleImport} />

      {/* TEMPORARY (T5 prep): the door to the design-assets workbench
          (2026-07-21) — an empty shelf until the M5 design pass fills
          it. Not a world page, so no rail icon; the door leaves when
          the design pass lands. */}
      <div className="design-door">
        <button onClick={() => setPage('design')}>design assets</button>
      </div>
    </>
  )

  // The check-in as a pop-up (T4.5, spec §5b): it no longer REPLACES
  // the habit list — the list stays behind, dimmed and inert, so it
  // reads as a temporary view being passed through. Every §4.2 rule is
  // untouched: yesterday must still be answered, the done button is
  // still the only exit (no backdrop dismiss, no home link, no meters —
  // the meters fragment simply isn't rendered here), and the startup
  // fade waits its turn until the answer is saved.
  if (checkInOpen) {
    return (
      <main className="app">
        <h1>HABITAT</h1>
        <div className="behind-checkin" aria-hidden="true" inert>
          {listContent}
        </div>
        <div className="checkin-overlay">
          <CheckInPanel
            habits={data.habits}
            completions={data.completions}
            todayKey={today}
            cutoffHour={data.settings.dayCutoffHour}
            onMark={handleRetroMark}
            onUnmark={handleRetroUndo}
            onDone={handleCheckInDone}
          />
        </div>
      </main>
    )
  }

  // The three meters (T2.2), all computed live from completion history
  // — since T3.2 that includes each completion's stored drops, so the
  // literacy meter and the fungus wallet finally move; since T4.3b the
  // wallet also counts what the owned market objects cost (its bar and
  // hover use the TRUE balance, debt included — T4.5). Below them,
  // the arrival shelf and (topmost of all) any reveal still owed: one
  // at a time, dismissed by its own button. Two kinds owe a reveal —
  // a drop family's FIRST occurrence (T3.2) and EVERY friend (T4.4).
  // The fragment also carries the daily startup fade (T4.5) and the
  // left icon rail: every page but the check-in renders this fragment,
  // so the fade plays over whichever screen the new day opens on, and
  // the rail persists on every screen but the check-in (Kimia's call
  // 2026-07-21) — the check-in's done button stays the only exit there.
  const revealing = arrivals.find(
    (a) => (a.first || a.reveal) && !seenRevealIds.has(a.id),
  )
  const meters = (
    <>
      <IconRail onOpen={setPage} />
      <Meters
        completions={data.completions}
        readingItems={readingItemsFrom(data.completions)}
        fungusTrueBalance={walletTrueBalance(data.completions, data.purchases)}
        onOpen={setPage}
      />
      <ArrivalShelf
        worldSeed={data.worldSeed}
        arrivals={arrivals.map((a) => ({
          ...a,
          awaitingReveal: (a.first || a.reveal) && !seenRevealIds.has(a.id),
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
      {revealing &&
        (revealing.key === 'friend' ? (
          <FriendReveal
            arrival={revealing}
            worldSeed={data.worldSeed}
            firstOfCategory={revealing.firstOfCategory}
            onDismiss={() =>
              setSeenRevealIds((seen) => new Set([...seen, revealing.id]))
            }
          />
        ) : (
          <FirstReveal
            arrival={revealing}
            onDismiss={() =>
              setSeenRevealIds((seen) => new Set([...seen, revealing.id]))
            }
          />
        ))}
      {readingItem && (
        <SpreadPopup item={readingItem} onClose={() => setReadingItem(null)} />
      )}
      {startupDue && <StartupFade onDone={handleStartupDone} />}
    </>
  )

  // The HABITAT header doubles as the home link (Kimia's request
  // 2026-07-16): from the Map, Bookcase or Market it always leads back
  // to the habit list. The check-in pop-up deliberately keeps a plain
  // header — its done button stays the only way out, so yesterday
  // always gets answered.
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
  // ground. Reached from the rail (T4.5). Since T4.4 the page also
  // carries the quiet / party toggle — friends come visiting among the
  // flora, in a formation that is never stored.
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
          friends={friendsFrom(data.completions)}
          worldSeed={data.worldSeed}
          onDecide={handleFloraDecision}
          onMove={handleItemMove}
          onSell={handleSell}
          onBack={() => setPage(null)}
        />
      </main>
    )
  }

  // The Guest Book (T4.4): everyone who has welcomed us so far, all
  // derived from the stored friend drops. Clicking a friend opens
  // their card — art, name, card text (Kimia's re-readable slot), and
  // the signature animation. Reached from the rail's community icon
  // (T4.5).
  if (page === 'guestbook') {
    return (
      <main className="app">
        {header}
        {meters}
        <GuestBookPage
          friends={friendsFrom(data.completions)}
          worldSeed={data.worldSeed}
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

  // TEMPORARY (T5 prep): the design-assets workbench — empty shelves
  // for the image families the M5 design pass will fill. Reached from
  // its door at the foot of the home screen; the rail reaches it too,
  // like every screen but the check-in.
  if (page === 'design') {
    return (
      <main className="app">
        {header}
        {meters}
        <DesignPage onBack={() => setPage(null)} />
      </main>
    )
  }

  // The home screen (T4.5): header and meters up top (the meters
  // fragment carries the left rail, which persists on every screen but
  // the check-in), then the large letterspaced date display and the
  // list content shared with the check-in pop-up's dimmed backdrop.
  // The cameo (T4.6) visits between the date and the list — but never
  // behind the startup fade, which takes the screen first.
  return (
    <main className="app">
      {header}
      {meters}
      <DateDisplay now={now} cutoffHour={data.settings.dayCutoffHour} />
      {!startupDue && cameo && (
        <Cameo win={cameo} worldSeed={data.worldSeed} onExpire={expireCameo} />
      )}
      {listContent}
    </main>
  )
}

export default App
