// The habit list screen (T1.3 — ugly on purpose; the design pass is M5).
// This component owns the app's state and persistence; every rule about
// habits, days and completions is delegated to the game modules, and
// all saving goes through the storage module.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
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
import {
  ARCHIVE_FAREWELL_MS,
  CLOCK_CHECK_MS,
  DROP_SETTLE_MS,
} from './game/constants.js'
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
import { expeditionSteps, meterReading } from './game/meters.js'
import { gameCompletions, startNewGame } from './game/newgame.js'
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
  clearData,
  exportData,
  hasData,
  importData,
  loadData,
  requestPersistentStorage,
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
import LanguageSwitch from './ui/LanguageSwitch.jsx'
import { WORDMARK } from './content/ui.js'
import { LanguageProvider, useText } from './ui/language.jsx'
import MapPage from './ui/MapPage.jsx'
import MarketPage from './ui/MarketPage.jsx'
import Meters from './ui/Meters.jsx'
import NewGameControl from './ui/NewGameControl.jsx'
import SpreadPopup from './ui/SpreadPopup.jsx'
import Startup from './ui/Startup.jsx'
import SymbolPicker from './ui/SymbolPicker.jsx'

// A press on a row's drag handle becomes a reorder drag once the pointer
// has travelled this many pixels; anything shorter stays a press and
// reorders nothing (mirrors the abode/bookcase drag threshold).
const REORDER_DRAG_THRESHOLD_PX = 4

// Put the page back at its top. Instant, not smooth: the meters play
// their held movement the moment the check-in closes, and a glide would
// still be travelling while it happened. Guarded because the test
// browser (jsdom) has no real scrolling to do.
function scrollToTop() {
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0)
  }
}

// The app proper. It takes the saved data as props rather than holding
// it, so that App (below) can read the chosen language OUT of that data
// and put the whole tree inside a LanguageProvider — including this
// component, which therefore gets its own words from the ordinary hook
// like everything else.
function AppBody({ data, setData }) {
  const { t } = useText()
  // The symbol filter is a temporary lens: plain component state, so it
  // resets on every visit (spec §5b).
  const [filter, setFilter] = useState([])
  // What the form area is doing: null (closed), 'new', or a habit id.
  const [editing, setEditing] = useState(null)
  // Which charm a brand-new draft should open on, when something on
  // screen has already implied one (2026-08-12): clicking a coloured
  // "add a habit or task…" tile in filter view means "one of these".
  // null = nothing implied, so the form falls back to its own rule.
  const [draftSymbol, setDraftSymbol] = useState(null)
  // The tile currently sinking into the archive, if any: { habit, index }
  // — a copy of the habit and the slot it held in the visible list. See
  // the farewell note further down.
  const [leaving, setLeaving] = useState(null)
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
  // The meters as they stood before the check-in's FIRST mark (T5.2e,
  // design-notes §4). The check-in keeps a plain header of its own, so a
  // retro mark has no visible meter to move; this holds the movement so
  // it can play once when the check-in closes — the same beat its drops
  // already take. Null means nothing is being held: a check-in where
  // nothing was marked earns nothing, so nothing plays.
  const [heldMeters, setHeldMeters] = useState(null)
  // The publication being read right now (T3.5) — the spread popup is
  // open while this is set. Screen state only, and deliberately so:
  // reading is tracked nowhere (Kimia's decision 2026-07-19), so
  // nothing about it may ever reach storage.
  const [readingItem, setReadingItem] = useState(null)

  // Whether a backup has been exported in THIS visit (T6.6). It is the
  // gate on "start a new game": only a file saved just now is a promise
  // that the world about to be discarded is recoverable. Deliberately
  // not stored — a fresh visit means a fresh export.
  const [exportedThisVisit, setExportedThisVisit] = useState(false)

  // Drag-to-reorder (T5.1c): while a habit row is being dragged, this
  // holds { id, offsetY } — which row is lifted and how far it has moved
  // vertically from where the press began — so the row can follow the
  // pointer. Screen state only; the persisted order changes just once, on
  // release. `listRef` points at the <ul> so a drag can measure the rows
  // and work out which slot the pointer is over.
  const [reorderDrag, setReorderDrag] = useState(null)
  const listRef = useRef(null)

  // The moment AFTER a drop (2026-08-11): { id, fromTop } — which tile
  // was just let go of, and the screen position it was let go at. The
  // list has already re-ordered by the time this is set, so the tile is
  // standing in its new slot; the layout effect below starts it back at
  // `fromTop` and lets it glide from there, and the tile keeps its
  // lifted, charm-lit look for DROP_SETTLE_MS so the landing can be seen.
  const [settling, setSettling] = useState(null)

  // The countdown that ends a tile's farewell (see startFarewell). Held
  // in a ref so a second archive can cancel the first, and so leaving the
  // page never leaves a timer running against an unmounted screen.
  const farewellTimer = useRef(null)
  useEffect(() => () => clearTimeout(farewellTimer.current), [])

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
  // check-in pop-up → startup ceremony → (Sundays) field notes.
  const startupDue = shouldShowStartup(today, data.settings.startupShownOn)
  const active = activeHabits(data.habits)
  const filtered = filterBySymbols(active, filter)
  // The archive answers to the same lens (Kimia's call 2026-08-11):
  // while charms are chosen, the dropdown holds only the archived habits
  // wearing them — and its count says how many that is. With no lens on,
  // it is the whole archive, exactly as before.
  const archived = filterBySymbols(archivedHabits(data.habits), filter)

  // A tile that has just been archived is put back on screen where it
  // was standing, purely so it can be SEEN to leave (Kimia's call
  // 2026-08-11). The archiving itself already happened — this is the
  // farewell, not a delay: `leaving` holds a copy of the habit and the
  // slot it occupied, and ARCHIVE_FAREWELL_MS later it is dropped and
  // the list closes up. Everything about the copy is inert: it takes no
  // taps, and it never drags.
  const visible = [...filtered]
  if (leaving) visible.splice(leaving.index, 0, leaving.habit)

  // The completions THE GAME may count (T6.6): everything except the
  // marks stamped as belonging to a game Kimia has started over from.
  // Before any fresh start that is simply all of them. Two lists, one
  // rule to keep them straight:
  //
  //   data.completions — the habit record. Everything that describes
  //     Kimia's real life reads this: the grid, streaks, graphs, field
  //     notes, the check-in, per-habit history. It is NEVER filtered.
  //   played — the world. Everything that counts taps toward game
  //     progress reads this instead: the meters, the map, the Market's
  //     rotation, the cameo's lived-day milestone, and the priors a new
  //     tap's drops are rolled against.
  //
  // Drop-derived things (bookcase, guest book, flora, wallet) need no
  // filter of their own: a new game empties every old completion's
  // drops, so there is nothing left in them to show.
  const played = gameCompletions(data.completions)

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

  // Was this check-in ASKED FOR, or was it owed? (Kimia's call
  // 2026-08-14.) The owed one is the morning's: yesterday must be
  // answered, so its done pebble stays the only exit. One opened by hand
  // from the rail is a visit — it can be clicked away from, and clicking
  // away leaves the page exactly where it stood. Marks made either way
  // are already saved; the difference is only how you leave.
  const [checkInByChoice, setCheckInByChoice] = useState(false)

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
      // A day that rolls over while the page is open owes its check-in
      // exactly like a fresh visit — so this one is not a visit by choice.
      setCheckInByChoice(false)
      setCheckInOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today])
  // The held movement is spent as soon as it is handed over (§4). By
  // the time this runs, the meters have mounted with it and taken their
  // starting point from it; letting it linger would mean replaying the
  // check-in's ceremony on every later trip to the Map or the Bookcase,
  // since leaving the habit list rebuilds the header.
  useEffect(() => {
    if (!heldMeters || checkInOpen) return
    setHeldMeters(null)
  }, [heldMeters, checkInOpen])
  // The Sunday ritual (T2.3, Kimia's decision 2026-07-16): on the
  // first visit of each Sunday — once any check-in is answered AND the
  // startup ceremony has played (the fixed morning order) — the field
  // notes open by themselves. Settings remember the day it last
  // happened, so later visits that Sunday go straight to the list.
  useEffect(() => {
    if (checkInOpen || startupDue || data.habits.length === 0) return
    if (!shouldOpenFieldNotes(today, data.settings.fieldNotesShownOn)) return
    save({ ...data, settings: { ...data.settings, fieldNotesShownOn: today } })
    setPage('fieldnotes')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInOpen, today, startupDue])
  // Ask the browser to keep our storage (T6.4a). Browsers evict a whole
  // origin at once when the disk gets tight, which for Habitat means
  // every day of history at a stroke; marking storage persistent makes
  // routine eviction skip us.
  //
  // Asked only ONCE, and only when there is something to protect:
  // Firefox answers this with a permission prompt, and a first-time
  // visitor who has recorded nothing should never be asked to keep
  // nothing. Fire-and-forget — the answer changes no behaviour, and
  // every failure path inside is already swallowed, so a browser that
  // refuses (or has never heard of the API) simply carries on.
  const persistenceAsked = useRef(false)
  useEffect(() => {
    if (persistenceAsked.current) return
    if (data.habits.length === 0 && data.completions.length === 0) return
    persistenceAsked.current = true
    requestPersistentStorage()
  }, [data.habits.length, data.completions.length])

  const pastDaysEditable = editablePastDays(today).some(
    (day) =>
      habitsOn(data.habits, data.completions, day, data.settings.dayCutoffHour)
        .length > 0,
  )

  // How tall the header bar currently is (T5.2e). The arrival shelf is
  // pinned to the top right of the WINDOW, and Kimia's rule is that it
  // must never cover the header — so it needs to know where the header
  // ends. The bar is one storey on a wide screen and two on a narrow
  // one, and its height follows the words inside it, so the app measures
  // the real element instead of hard-coding a number that would quietly
  // go wrong. The observer watches for the fold happening as the window
  // is resized; where the browser has no ResizeObserver (our test
  // environment), the one-off measurement still stands.
  const [headerHeight, setHeaderHeight] = useState(0)
  const measureHeader = useCallback((node) => {
    if (!node) return undefined
    setHeaderHeight(node.offsetHeight)
    if (typeof ResizeObserver === 'undefined') return undefined
    const watcher = new ResizeObserver(() => setHeaderHeight(node.offsetHeight))
    watcher.observe(node)
    return () => watcher.disconnect()
  }, [])

  // The home-screen cameo (T4.6): a friend celebrating today's big win
  // — derived fresh from history like everything else, so undo quietly
  // takes the win (and the visit) back. It visits once per visit: after
  // its linger it expires and stays gone until a reload still finds the
  // win standing. Nothing about it is ever stored.
  const [cameoGone, setCameoGone] = useState(false)
  const expireCameo = useCallback(() => setCameoGone(true), [])
  // Pressing the visit takes you to the field notes with the record(s)
  // it was about spotlit (Kimia's call 2026-08-20) — the answer to "a
  // 15-day streak of WHAT?", which a momentary notice could never give.
  // The visit leaves as it hands over: it has been read, and it has no
  // business floating over the page it just opened.
  const [spotlight, setSpotlight] = useState(null)
  const openCameo = useCallback((win) => {
    setSpotlight(win.streaks)
    setCameoGone(true)
    setPage('fieldnotes')
  }, [])
  const dismissSpotlight = useCallback(() => setSpotlight(null), [])
  // …and it belongs to that one visit to that one page. Leaving by any
  // door — back, the rail, the wordmark — puts it out, so coming back to
  // the notes later never reopens a blackout about a moment long gone.
  useEffect(() => {
    if (page !== 'fieldnotes') setSpotlight(null)
  }, [page])
  const cameo = cameoGone
    ? null
    : cameoWin(
        data.habits,
        data.completions,
        data.worldSeed,
        now,
        data.settings.dayCutoffHour,
        played,
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
  // The language choice (T6.13). It is a setting like the day cutoff,
  // so it goes through save() like every other one — no separate store,
  // no special case, and it travels in a backup.
  function chooseLanguage(language) {
    save({ ...data, settings: { ...data.settings, language } })
  }

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
        walletBalance(played, data.purchases),
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

  // Open a fresh draft (2026-08-12). Two doors lead here — the rail's +
  // and the "add a habit or task…" tile — and the tile may bring a charm
  // with it. The rail lives on every screen but the check-in, so this
  // also carries us home: the draft opens in the habit list, which is
  // the only place it is drawn.
  function startNewHabit(symbol = null) {
    setPage(null)
    setDraftSymbol(symbol)
    setEditing('new')
  }

  function closeForm() {
    setEditing(null)
    setDraftSymbol(null)
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
    closeForm()
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

  // Put a just-archived tile back on screen for its farewell (Kimia's
  // call 2026-08-11), in the slot it was standing in. The archiving has
  // already happened in the data — this only decides how long the copy
  // lingers. A second archive during a farewell simply takes over: the
  // first tile has said its goodbye by then.
  function startFarewell(habit) {
    const index = filtered.findIndex((h) => h.id === habit.id)
    setLeaving({ habit, index: index === -1 ? filtered.length : index })
    clearTimeout(farewellTimer.current)
    farewellTimer.current = setTimeout(
      () => setLeaving(null),
      ARCHIVE_FAREWELL_MS,
    )
  }

  function handleComplete(habit) {
    // The tap rolls its drops right here (T3.2) and stores them on the
    // completion — settled at tap time, forever. Since T4.4 the roll
    // includes the friendship stream: a friend who is due rides along.
    const completion = withFriendDrop(
      deliverDrops(
        recordCompletion(habit.id, data.settings.dayCutoffHour),
        habit,
        played,
        data.worldSeed,
      ),
      played,
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
    // A to-do that just finished is on its way to the archive: let it be
    // seen going, the same as one archived by hand.
    if (archivesWhenDone(habit)) startFarewell(habit)
    announceDrops(completion, played, false)
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
    // Where the meters stood before this check-in touched them (§4).
    // Taken at the FIRST mark rather than when the check-in opened, so
    // the reading is only kept when there is something to remember.
    setHeldMeters(
      (held) =>
        held ??
        meterReading(
          played,
          readingItemsFrom(played),
          walletTrueBalance(played, data.purchases),
        ),
    )
    // Retro marks roll drops exactly like live taps (Kimia's decision
    // 2026-07-19) — but their arrivals wait until the check-in's done
    // button, so answering yesterday stays distraction-free.
    const completion = withFriendDrop(
      deliverDrops(
        recordRetroCompletion(habit.id, dayKey, data.settings.dayCutoffHour),
        habit,
        played,
        data.worldSeed,
      ),
      played,
      data.worldSeed,
    )
    const next = { ...data, completions: [...data.completions, completion] }
    if (archivesWhenDone(habit)) {
      next.habits = data.habits.map((h) =>
        h.id === habit.id ? archiveHabit(h) : h,
      )
    }
    save(next)
    announceDrops(completion, played, true)
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
    // Answering ALWAYS lands you at the top of the habit list (Kimia's
    // call 2026-08-14), wherever the page was scrolled to when the
    // check-in opened. The meters are in the header bar, and the held
    // movement they have been saving up (§4) plays the instant this
    // closes — landing halfway down the page would mean missing the one
    // moment the whole check-in was building to.
    scrollToTop()
  }

  // Clicked away from a check-in that was opened by choice: nothing is
  // recorded as ANSWERED (that word belongs to the morning's question
  // alone), but marks already made are already saved, and anything they
  // earned still arrives. The page stays where it was — no jump to the
  // top, because nothing was being built to.
  function handleCheckInDismiss() {
    setCheckInOpen(false)
    setArrivals((list) => [...list, ...pendingArrivals])
    setPendingArrivals([])
  }

  // The startup ceremony has played: remember the day so no second
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

  // Which row a dragged tile has landed on — decided by where the TILE
  // is on screen, not by where the hand is (Kimia's call 2026-08-11).
  // The two used to be the same thing; now that the tile floats after
  // the pointer instead of being welded to it they part company on a
  // quick drag, and dropping a tile somewhere it visibly isn't reads as
  // a bug. `getBoundingClientRect` returns a row's real drawn box —
  // transform and all — so the dragged tile's middle IS what the eye
  // sees, and the landing is simply the row whose middle it has come to
  // rest nearest.
  //
  // Every row is measured where it sits. The dragged one is the
  // exception: it is in mid-air, so the empty SLOT it left behind stands
  // in for it (`slot`, measured at the moment of the press, since the
  // rows around it never move during a drag). Without that, a tile
  // nudged a few pixels inside its own row would have no slot of its own
  // to be nearest to and would jump to a neighbour — which is exactly
  // what the old pointer-based rule did.
  function landingRowFor(tile, slot) {
    const rows = listRef.current
      ? [...listRef.current.querySelectorAll('[data-habit-id]')]
      : []
    const box = tile.getBoundingClientRect()
    const middle = (box.top + box.bottom) / 2
    let landing = null
    let nearest = Infinity
    rows.forEach((row) => {
      const seat = row === tile ? slot : row.getBoundingClientRect()
      const gap = Math.abs((seat.top + seat.bottom) / 2 - middle)
      if (gap < nearest) {
        nearest = gap
        landing = row
      }
    })
    return landing ? landing.getAttribute('data-habit-id') : null
  }

  // Begin a drag-to-reorder from a press on a habit row (T5.1c; the whole
  // tile is the grab area since 2026-08-11 — HabitRow decides which
  // presses count, letting the row's own buttons through). We watch the
  // pointer on the WINDOW so the drag keeps tracking even when it leaves
  // the row, and read the landing slot off the TILE at the moment of
  // release (landingRowFor above). A press that never travels far enough
  // stays a press and reorders nothing. Reordering is off while a symbol
  // filter is on (the list is a partial lens), so no press starts a drag
  // then. Desktop-only (T5.1b), so a single primary-button pointer press
  // is all we handle.
  function handleReorderStart(habit, event) {
    if (event.button) return // left / primary only
    event.preventDefault()
    const startY = event.clientY
    // The row's own element and the slot it is standing in, both taken
    // now, before anything has moved: the element because the drag has
    // to keep measuring it, the slot because it is what the tile will be
    // compared against when it comes back down.
    const tile = event.currentTarget
    const slot = tile.getBoundingClientRect()
    let dragging = false
    function move(moveEvent) {
      const offsetY = moveEvent.clientY - startY
      if (!dragging && Math.abs(offsetY) < REORDER_DRAG_THRESHOLD_PX) return
      dragging = true
      setReorderDrag({ id: habit.id, offsetY })
    }
    function up() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      if (!dragging) {
        setReorderDrag(null)
        return
      }
      // Both readings are taken BEFORE the tile is put down, while it is
      // still drawn where it was let go: which row it came to rest over,
      // and the exact height it was let go at — where its glide begins.
      const landedOn = landingRowFor(tile, slot)
      const fromTop = tile.getBoundingClientRect().top
      setReorderDrag(null)
      handleMoveTo(habit, landedOn)
      setSettling({ id: habit.id, fromTop })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // The glide, once the list has re-ordered around the dropped tile.
  // Straight FLIP: the tile is standing in its new slot, so we put it
  // visually back where the hand left it and immediately let go — the
  // stylesheet's transition carries it the rest of the way. The nudge to
  // the browser between the two is what stops it treating them as one
  // instant jump. Both inline styles are cleared here, so nothing of
  // this survives the animation; the lit look is the CSS class alone,
  // and it lasts until the timer below drops `settling` and lets the
  // colours ease back.
  //
  // The first two lines are the whole reason an upward drop used to
  // start its glide from the tile's OLD slot instead of from the hand
  // (Kimia, 2026-08-12). By the time this runs, React has taken the
  // drag's inline transform off the tile — but taking a transform off
  // something with a 420ms transition on it does not put it back
  // instantly, it starts it travelling back. So measuring the tile right
  // then does not give its new slot: it gives roughly where the hand was
  // still holding it. Both readings then carried the same offset, it
  // cancelled out of the subtraction, and the glide was left running
  // between the two SLOTS — which looks like a slide into place when the
  // tile is heading down the list, and like a jump backwards before
  // flying up when it is heading up. Turning the transform off outright,
  // with transitions suspended, is what makes the measurement the tile's
  // real resting place.
  useLayoutEffect(() => {
    if (!settling) return
    const tile = listRef.current?.querySelector(
      `[data-habit-id="${settling.id}"]`,
    )
    if (tile) {
      tile.style.transition = 'none'
      tile.style.transform = 'none'
      const drift = settling.fromTop - tile.getBoundingClientRect().top
      tile.style.transform = `translateY(${drift}px) scale(1.02)`
      void tile.offsetHeight // let the browser take that in…
      tile.style.transition = ''
      tile.style.transform = '' // …before it eases back to nothing
    }
    const timer = setTimeout(() => setSettling(null), DROP_SETTLE_MS)
    return () => clearTimeout(timer)
  }, [settling])

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
    // exportData stamped today's date into storage; re-read so the
    // backup-age line beside the button says "backed up today" straight
    // away, rather than waiting for the next thing that reloads state.
    setData(loadData())
    setExportedThisVisit(true)
  }

  // Start a new game (T6.6): the world begins again, the habit record
  // survives whole. The confirmation and the "export a backup first"
  // guard both live in NewGameControl; by the time this runs, the
  // decision is made. Everything on screen from the old world goes with
  // it — the announcements and the open reading spread describe a
  // planet that no longer exists.
  function handleStartNewGame() {
    save(startNewGame(data))
    forgetTheOldWorld()
  }

  // A total refresh (2026-08-12, Kimia's second new-game door): not a
  // new game inside the same Habitat but a brand-new Habitat. There is
  // no pure function for it in game/newgame.js because there is no
  // decision to make and nothing to carry over — forgetting the stored
  // envelope entirely is the whole of it, and loadData() then hands
  // back the same empty, freshly-seeded world a first-ever visit gets.
  // The only guard is the two-step confirmation in NewGameControl; by
  // the time this runs, the decision is made.
  function handleTotalRefresh() {
    clearData()
    setData(loadData())
    closeForm()
    // The charm lens goes too — only here. After a total refresh there
    // are no habits left for a lens to narrow, and an empty screen
    // wearing yesterday's filter reads as a fault. The other door keeps
    // every habit, so its lens still means something.
    setFilter([])
    forgetTheOldWorld()
  }

  // Everything on screen from the world just discarded — the
  // announcements, the reveals still owed, the open reading spread —
  // describes a planet that no longer exists, so none of it may outlive
  // a new game of either kind.
  function forgetTheOldWorld() {
    setArrivals([])
    setPendingArrivals([])
    setSeenRevealIds(new Set())
    setReadingItem(null)
    setPage(null)
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
    closeForm()
    // A whole new world state: announcements from the old one are moot.
    setArrivals([])
    setPendingArrivals([])
    return 'backup imported'
  }

  // What an empty list offers instead of nothing (Kimia's call
  // 2026-08-12): a tile that reads "add a habit or task…" and opens the
  // draft form when clicked — the same door as the rail's +. With no
  // lens on, one neutral tile. In filter view, one tile per chosen charm,
  // each wearing that charm's colour — so an empty cherry-and-key screen
  // offers a cherry tile and a key tile, and clicking one opens a draft
  // already on that charm. `null` here means "no charm": the neutral
  // tile.
  const emptyTiles =
    visible.length > 0 ? [] : filter.length > 0 ? filter : [null]

  // The foot of the page (Kimia's call 2026-08-12): three clean buttons
  // on one centred line — export, import, start a new game — and no
  // explanatory text beside any of them. What that text used to say now
  // arrives on hover, the way every other explanation in Habitat does.
  //
  // It is a shared fragment because the same three buttons now stand at
  // the foot of the FIELD NOTES too (2026-08-12): the two pages are a
  // pair, each ending with the door to the other and then the same
  // three actions, so backing up from wherever you are is one trip.
  const footer = (
    <>
      <div className="list-footer">
        <BackupControls
          onExport={handleExport}
          onImport={handleImport}
          lastExportedOn={data.settings.lastExportedOn}
          todayKey={today}
        />

        <NewGameControl
          backedUp={exportedThisVisit}
          onStartNewGame={handleStartNewGame}
          onTotalRefresh={handleTotalRefresh}
        />
      </div>

      {/* Below that line, not on it. The three-button row is a decided
          shape (Kimia's call 2026-08-12) and a test pins it at three, so
          the language switch gets its own quiet line underneath rather
          than becoming a fourth. */}
      <LanguageSwitch onChoose={chooseLanguage} />
    </>
  )

  // The home screen's contents below the header bar (T4.5 rearranged
  // them; 2026-08-12 emptied the foot again): the charm filter centred
  // directly under the bar — the field notes' own arrangement, and
  // Kimia's call for here too — then the habit list, the archive drawer,
  // and the three footer buttons. The + /
  // pencil / graph trio that used to sit under the list has moved into
  // the left rail, above the five page icons — same order, same hover
  // labels, the rail's look. Every action is still an icon with a hover
  // label (2026-07-20): title + aria-label carry the words, the page
  // carries no action text. Kept as one fragment because the check-in
  // pop-up (below) dims this exact content behind itself.
  const listContent = (
    <>
      <section
        className="filter-view"
        aria-label={t('habits.filterView')}
        title={t('habits.filterView')}
      >
        <SymbolPicker selected={filter} onToggle={toggleFilter} />
      </section>

      <ul className="habit-list" ref={listRef}>
        {visible.map((habit) =>
          // The tile saying goodbye: the same row, drawn one last time,
          // with nothing wired up. It cannot be tapped, dragged or
          // edited — it is already archived; this is only its exit.
          habit.id === leaving?.habit.id ? (
            <HabitRow
              key={habit.id}
              habit={habit}
              todayCount={countOn(data.completions, habit.id, today)}
              required={requiredPerDay(habit, today)}
              fulfilled={isDayFulfilled(habit, data.completions, today)}
              leaving
              reorderDisabled
              onReorderStart={() => {}}
            />
          ) : editing === habit.id ? (
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
              settling={settling?.id === habit.id}
              dragOffsetY={
                reorderDrag?.id === habit.id ? reorderDrag.offsetY : 0
              }
              onComplete={() => handleComplete(habit)}
              onUndo={() => handleUndo(habit)}
              onReorderStart={(event) => handleReorderStart(habit, event)}
              onEdit={() => setEditing(habit.id)}
              onArchive={() => {
                startFarewell(habit)
                replaceHabit(archiveHabit(habit))
              }}
            />
          ),
        )}
        {/* An empty list is never blank (2026-08-12) — it holds the
            invitation instead, as a tile of the same shape. It lives
            inside the list so it stands exactly where a first habit
            would; it carries no data-habit-id, so the reorder drag
            never sees it. */}
        {emptyTiles.map((symbol) => (
          <li
            key={symbol ?? 'none'}
            className={`habit-row habit-row--empty${symbol ? ` charm-${symbol}` : ''}`}
          >
            <button
              className="empty-tile"
              onClick={() => startNewHabit(symbol)}
            >
              add a habit or task…
            </button>
          </li>
        ))}
      </ul>

      {editing === 'new' && (
        // A new draft opens on the charm it was started from. Clicking a
        // coloured empty tile says which one outright (2026-08-12);
        // failing that, a lens showing exactly one charm is the hint
        // (Kimia's call 2026-08-11) — with one charm on screen, the habit
        // you are about to write is almost always that charm. Two or more
        // charms and nothing implied, and the form uses its own default.
        <HabitForm
          defaultSymbol={
            draftSymbol ?? (filter.length === 1 ? filter[0] : undefined)
          }
          onSave={handleCreate}
          onCancel={closeForm}
        />
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
                <li
                  key={habit.id}
                  // The charm class hands this row its own colour, so the
                  // `-1` below is edged like the tile it came from.
                  className={`archived-row charm-${habit.symbol}`}
                >
                  <CharmSymbol symbol={habit.symbol} className="symbol" />
                  <span>{habit.name}</span>
                  {doneForGood ? (
                    countOn(data.completions, habit.id, today) > 0 ? (
                      <button
                        className="pebble pebble-counter"
                        onClick={() => handleUndoOneTime(habit)}
                      >
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
                      title={t('habits.unarchive')}
                      aria-label={t('habits.unarchive')}
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
                    title={t('habits.deleteForever')}
                    aria-label={t('habits.deleteForever')}
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

      {/* The door to the field notes, in the same wide, plain shape as
          their "← back to the habits" (Kimia's call 2026-08-12): the two
          are a pair, one at the foot of each page, pointing at each
          other. Being a direct child of the app column is what makes it
          full width — exactly how the back button gets its width. */}
      <button className="pebble" onClick={() => setPage('fieldnotes')}>
        {t('rail.fieldNotes')} →
      </button>

      {footer}

      {/* TEMPORARY (T5 prep): the door to the design-assets workbench
          (2026-07-21) — an empty shelf until the M5 design pass fills
          it. Not a world page, so no rail icon; the door leaves when
          the design pass lands. */}
      <div className="design-door">
        <button className="door-link" onClick={() => setPage('design')}>
          {t('design.door')}
        </button>
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
        <h1>{WORDMARK}</h1>
        <div className="behind-checkin" aria-hidden="true" inert>
          {listContent}
        </div>
        {/* A check-in opened by hand can be clicked away from: a press
            on the veil AROUND the panel (never inside it) closes the
            visit. The morning's owed check-in gets no such handler —
            there, done stays the only way out. */}
        <div
          className="checkin-overlay"
          onClick={
            checkInByChoice
              ? (event) => {
                  if (event.target === event.currentTarget) {
                    handleCheckInDismiss()
                  }
                }
              : undefined
          }
        >
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

  // Everything that floats above whichever page is showing: the left
  // icon rail, the arrival shelf, any reveal still owed (one at a time,
  // dismissed by its own button — a drop family's FIRST occurrence
  // (T3.2) and EVERY friend (T4.4) both owe one), the reading popup and
  // the daily startup ceremony (§12f). Every page but the check-in renders
  // this fragment, so the fade plays over whichever screen the new day
  // opens on and the rail persists everywhere but the check-in (Kimia's
  // call 2026-07-21) — there the done button stays the only exit.
  // The three meters used to lead this fragment; since T5.2d/§13a they
  // live in the header bar instead.
  const revealing = arrivals.find(
    (a) => (a.first || a.reveal) && !seenRevealIds.has(a.id),
  )
  const overlays = (
    <>
      <IconRail
        onOpen={setPage}
        onAddHabit={() => startNewHabit()}
        onEditPastDays={() => {
          setCheckInByChoice(true)
          setCheckInOpen(true)
        }}
        pastDaysEditable={pastDaysEditable}
      />
      <ArrivalShelf
        worldSeed={data.worldSeed}
        headerHeight={headerHeight}
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
      {startupDue && <Startup todayKey={today} onDone={handleStartupDone} />}
    </>
  )

  // The header bar (T5.2d/§13a): a full-width band ABOVE the 40rem
  // content column — wordmark · meters · date · charm filter, left to
  // right on a wide screen, folding to two deliberately-arranged rows on
  // a narrow one (the CSS owns that; grid areas, never a wrap).
  //
  // The bar is IDENTICAL on every page (Kimia's call 2026-08-12): the
  // same wordmark, meters and date in the same three places at home, on
  // the five world pages and in the field notes, so nothing shifts
  // underfoot as you move around. The charm filter is deliberately NOT
  // here — it is the habit list's own lens, and sits centred beneath the
  // bar on the pages that have something to filter (home and the field
  // notes), which is where the field notes already kept theirs.
  //
  // The HABITAT wordmark doubles as the home link (Kimia's request
  // 2026-07-16): from any page it always leads back to the habit list.
  // The check-in pop-up deliberately keeps a plain header of its own —
  // its done button stays the only way out, so yesterday always gets
  // answered.
  const appHeader = (
    <header className="app-header" ref={measureHeader}>
      <h1>
        <button className="home-link" onClick={() => setPage(null)}>
          {WORDMARK}
        </button>
      </h1>
      <Meters
        completions={played}
        readingItems={readingItemsFrom(played)}
        fungusTrueBalance={walletTrueBalance(played, data.purchases)}
        heldFrom={heldMeters}
        onOpen={setPage}
      />
      <DateDisplay now={now} cutoffHour={data.settings.dayCutoffHour} />
    </header>
  )

  // The field notes (T2.3): the weekly view, with the meters still up
  // top — like every page reached from the list (spec §5).
  if (page === 'fieldnotes') {
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <FieldNotes
            habits={data.habits}
            completions={data.completions}
            cutoffHour={data.settings.dayCutoffHour}
            now={now}
            filter={filter}
            onToggleFilter={toggleFilter}
            onBack={() => setPage(null)}
            spotlight={spotlight}
            onDismissSpotlight={dismissSpotlight}
          />
          {/* The same three buttons the home screen ends with (Kimia's
            call 2026-08-12), directly under "back to the habits" — so
            export, import and start-a-new-game are reachable from
            either page without a trip home. */}
          {footer}
        </main>
      </>
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
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <AbodePage
            finds={floraFinds(played, data.floraDecisions)}
            items={abodeItems(
              played,
              data.floraDecisions,
              data.abodeLayout,
              data.purchases,
            )}
            friends={friendsFrom(played)}
            worldSeed={data.worldSeed}
            onDecide={handleFloraDecision}
            onMove={handleItemMove}
            onSell={handleSell}
            onBack={() => setPage(null)}
          />
        </main>
      </>
    )
  }

  // The Guest Book (T4.4): everyone who has welcomed us so far, all
  // derived from the stored friend drops. Clicking a friend opens
  // their card — art, name, card text (Kimia's re-readable slot), and
  // the signature animation. Reached from the rail's community icon
  // (T4.5).
  if (page === 'guestbook') {
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <GuestBookPage
            friends={friendsFrom(played)}
            worldSeed={data.worldSeed}
            onBack={() => setPage(null)}
          />
        </main>
      </>
    )
  }

  // The Bookcase (T4.2): one constant bookshelf, every publication a
  // draggable book with a remembered place and facing. Reading opens
  // the T3.5 spread popup — which renders inside the meters fragment
  // above, so it opens over this page too — and is tracked nowhere.
  if (page === 'bookcase') {
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <BookcasePage
            items={bookcaseItems(played, data.bookcaseLayout)}
            onMove={handleBookMove}
            onFace={handleBookFace}
            onRead={setReadingItem}
            onBack={() => setPage(null)}
          />
        </main>
      </>
    )
  }

  // The Map (T4.1): the planet revealing itself region by region, all
  // derived from completion history and the world seed — undo pulls
  // the frontier back by itself.
  if (page === 'map') {
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <MapPage
            completions={played}
            worldSeed={data.worldSeed}
            onBack={() => setPage(null)}
          />
        </main>
      </>
    )
  }

  // The Market (T4.3b): the rotating stall. Its selection is derived,
  // never stored — lived days (counted from completion history) set the
  // rotation, discovered regions the pool — so the stall always agrees
  // with history, undo and all. Only the purchases list remembers what
  // Kimia owns; the wallet is the same derivation, drops minus owned.
  if (page === 'market') {
    const rotation = rotationIndex(livedDayCount(played))
    const pool = marketPool(discoveredRegionCount(expeditionSteps(played)))
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <MarketPage
            stall={stallObjects(pool, rotation)}
            purchases={data.purchases}
            wallet={walletBalance(played, data.purchases)}
            worldSeed={data.worldSeed}
            onBuy={handleBuy}
            onBack={() => setPage(null)}
          />
        </main>
      </>
    )
  }

  // TEMPORARY (T5 prep): the design-assets workbench — empty shelves
  // for the image families the M5 design pass will fill. Reached from
  // its door at the foot of the home screen; the rail reaches it too,
  // like every screen but the check-in.
  if (page === 'design') {
    return (
      <>
        {appHeader}
        <main className="app">
          {overlays}
          <DesignPage onBack={() => setPage(null)} />
        </main>
      </>
    )
  }

  // The home screen (T4.5): the header bar up top carries wordmark,
  // meters and date (T5.2d/§13a — the date moved up there from this
  // column); the overlays fragment carries the left rail, which persists
  // on every screen but the check-in. Below sits the list content shared
  // with the check-in pop-up's dimmed backdrop, starting with the charm
  // filter. The cameo (T4.6) visits above the list — but never behind
  // the startup ceremony, which takes the screen first.
  return (
    <>
      {appHeader}
      <main className="app">
        {overlays}
        {!startupDue && cameo && (
          <Cameo
            win={cameo}
            worldSeed={data.worldSeed}
            onExpire={expireCameo}
            onOpen={openCameo}
          />
        )}
        {listContent}
      </main>
    </>
  )
}

// The outermost component: it owns the saved data, and wraps everything
// in the language that data says Habitat is speaking. Splitting it from
// AppBody is what lets EVERY component — AppBody included — read the
// language through the same hook, rather than one of them having to be
// special.
function App() {
  const [data, setData] = useState(loadData)
  return (
    <LanguageProvider language={data.settings.language}>
      <AppBody data={data} setData={setData} />
    </LanguageProvider>
  )
}

export default App
