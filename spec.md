# spec.md — HABITAT

*v1.9 — 2026-07-18. T2.4 built: per-habit line graphs in the field
notes. Decided today: the graphs live in their own section below the
week grid, each shows the habit's whole life squeezed to fit, and
opens on the coarsest unlocked zoom.*

## 1. One-line pitch

**Habitat**: a personal habit tracker where completing habits carries us
through **ethical immigration to the alien planet N-Z-D** — getting to
know the land, gathering its flora, trading glowing fungi at the local
market for curiosities, learning the local language, and earning
friendships within the community. Habit by habit, we build a habitat.

**Framing note:** we are a newcomer, not a coloniser. We don't conquer,
claim, or extract. We arrive, we learn, we integrate. The planet and its
society were thriving before us; the privilege is being welcomed in.

## 2. Why this exists

Kimia has used habitica.com for 6 years and hit its "delight ceiling."
This project injects new energy into habit gamification, serves as a
learning project for AI-assisted development, and doubles as a public
portfolio piece.

**Design brief:** keep Habitica's bones (habits, streaks, progression),
replace its reward layer entirely. No pets, no pet food, no armour, no
battles.

## 3. Constraints & non-goals

- Single user (Kimia). No accounts, no auth, no multiplayer.
- Web app. Hosted free on GitHub Pages; code public on GitHub.
- Personal habit data stays private in the browser (localStorage) — never
  committed to the repo.
- **No punishment mechanics.** Missed habits cause no damage, decay, or
  loss. They simply appear in weekly data.
- Non-goals for v1: mobile app, sync across devices, social features,
  seasonal events (candidate for v2).

## 4. Core mechanics

### 4.1 Habits (one unified type)

There is exactly **one** task type: the customisable habit. No
dailies/habits/to-dos distinction. Each habit has:

- Name, optional description
- A schedule the user defines. Shapes: **daily**, **specific weekdays**
  (e.g. Mon/Wed/Fri), **N-per-week** (fulfilled by N *distinct* days
  with at least one completion — three marks on one day advance the
  week by one, not three), **N-per-day** (each completion counts; the
  day is fulfilled at N; extras are recorded and kept), **whenever**
  (unscheduled, no streak — no expectation, no pressure), and
  **one-time** (a to-do: one completion finishes it for good and
  auto-archives it; undoing that mark the same day un-archives it).
  One-time is a *schedule shape* of the single unified habit type — it
  does not reintroduce Habitica's habit/daily/to-do split.
- **One of exactly 6 abstract symbols** (each paired with its own
  colour). The symbol **is** the tag — no word labels, no naming, no
  renaming, ever. Meaning lives entirely in the user's head, never
  explicit categories like "diet".
- Difficulty, set at creation: **easy / medium / difficult**. (Amended
  2026-07-15: difficulty does NOT affect the expedition meter — every
  completion advances it the same one step. The field is kept for
  future use, e.g. nudging drop odds in M3.)

### 4.2 Day boundaries & the morning check-in (cron)

- Every completion is logged with an accurate timestamp against the day
  it belongs to.
- If **yesterday** ended with scheduled habits unresolved, the next
  visit opens with a **check-in**: "mark the habits you completed
  yesterday." The check-in **always refers to the actual calendar
  yesterday**, no matter how long we've been away — and yesterday
  **must be answered**; only older days are optional. Only an
  unresolved yesterday triggers the check-in: older editable days never
  nag (optional means optional), they're simply reachable from it —
  or any time via "edit past days".
- **The backfill window (2026-07-14, replaces the earlier "no data"
  idea):** a past day can be filled in or corrected only while its week
  is still the current one. Every day of the current Mon–Sun week stays
  editable until the week ends; once a week has passed, its days are
  frozen. The one exception is **calendar yesterday, which is always
  editable** — so a Monday-morning check-in can still fill in Sunday,
  and last week's numbers simply update. Days never filled in just
  count as **not done**, which (as always) is neutral data, not a
  punishment. There is no separate "no data" state.
- **Critical correctness requirement:** retroactive marks are recorded
  against the day they were *done*, not the day they were *entered*. If
  Monday morning we mark Sunday's habits, the data says Sunday. Habitica
  gets this wrong; we will not. This rule gets its own automated tests.
- **Definition of a "cron":** a day counts as a cron (an active day)
  once it has at least one habit marked against it — including marks
  added retroactively via check-in/backfill. Crons are the clock for
  the market rotation (see Stream 3).
- **Day cutoff: 3am by default**, configurable in settings. A habit
  completed at 1am counts for the evening before.
- **A "visit" includes returning to an already-open tab** (2026-07-15):
  the page re-checks the clock once a minute and the moment the tab
  comes back into view, so a tab left open overnight flips to the new
  day — and owes its check-in — without a refresh, like Habitica.

## 5. Rewards: three independent streams

Reward pacing principle (learned from Habitica): **no front-loading, no
retention hooks.** Habitica showers new users with rewards then tapers —
fine for acquisition, fatal for long-term delight. Habitat has one
patient super-user who will show up every day. Rewards are steady, slow,
and never come too early. The earn curve is designed for years, not
weeks.

### The three meters (permanent fixtures)

All three meters sit **permanently at the top of the app** (amended
2026-07-16: on the habit list and the pages reached from it — the
morning check-in stays meter-free and focused). Each is clickable,
opening its own growing world:

- **Expedition meter** → opens the **Map**: the discovered planet,
  populating region by region over time. Grows infinitely (~5 years
  practical sizing).
- **Literacy meter** → opens the **Bookcase**: every magazine, novel,
  and dictionary we've ever received, filling shelves over time. Grows
  infinitely.
- **Fungus meter** → opens the **Market**. This one is a **wallet, not
  a progress bar**: it rises with fungus drops and falls with
  purchases. The only meter that can go down — and only ever by our
  own choice to spend.

### Stream 1 — Expedition: getting to know the planet

- **Expedition meter:** fully **predictable**. Each completion advances
  it a fixed amount — the same for every habit regardless of difficulty
  (decision 2026-07-15). No randomness in the meter itself.
- Meter progress = **planet discovery**: new regions of the planet
  gradually revealed on the Map as we get to know our new home.
- Along the way we **come across flora** as drops — the plant life of
  N-Z-D, discovered as we get to know the land. Collecting is
  **optional**: flora can be gathered and grown, or left where they
  are. Any gathered flora can be **composted** back to the world at any
  time (a Habitica lesson: non-returnable rewards forced clutter).
  Composted flora re-enter the world and may be encountered again —
  nothing is ever truly lost, so there's no pressure to hoard.
  **Composting yields nothing** (no fungi) — flora are discoveries, not
  money.
- Gathered flora live in the **Abode**, arrangeable like everything
  else there.

### Stream 2 — Literacy & society: earning our place

- **Reading material drops** are **less predictable and rarer** than
  object finds — the surprise-reward stream:
  - **Magazines** (common-ish)
  - **Novels** (medium)
  - **Dictionaries** (rare)
- Reading material is **never discarded** — every piece goes straight to
  the Bookcase and fills the **literacy meter**, our growing command of
  the local language.
- Literacy milestones unlock **friendships**, which also arrive **as
  drops** — the top of the reward hierarchy. A milestone **opens the
  door**: it makes that friend category possible, and the friend then
  arrives as a surprise drop sometime in the following days —
  anticipation first, surprise second.
- N-Z-D has **10 categories of friend** on a sliding scale of required
  literacy — the way Earth has animals, child humans, and adult humans,
  N-Z-D has a whole ecology of beings reachable at different depths of
  language. Draft ladder (names and details to be iterated; lowest
  literacy first):
  1. **Drifters** — ambient beings; no language, just presence
  2. **Nesters** — small critters that respond to routine and warmth
  3. **Mimics** — creatures that echo our sounds and gestures back
  4. **Signers** — beings who converse in light and gesture patterns
  5. **Sprouts** — young locals; first spoken words
  6. **Chatters** — everyday conversation, small talk, jokes
  7. **Neighbours** — real relationships; we get invited in
  8. **Storytellers** — share N-Z-D's folklore and history
  9. **Scholars** — the local professors; deep, technical language
  10. **Poets** — language at its most subtle; the rarest friendship
- Friendships live in the **Guest Book** — a page like the Abode, a
  record of everyone who has welcomed us. (We are the guest here, not
  the owner.)
- The emotional endgame: consistency → literacy → community.

### Stream 3 — Fungi & the Market: taking part in the local economy

- **Glowing local fungi** drop occasionally on habit completions — same
  drop mechanic as flora and reading material; difficulty nudges the
  odds. Fungi operate as **currency on N-Z-D**.
- Fungi fill the **fungus meter** — a wallet balance, spent at the
  **Market**.
- The Market sells the **objects and curiosities**: weird trinkets and
  lights, musical instruments, cushions, things with no obvious
  purpose. Gravity is not guaranteed on this planet. Objects are
  **purchased, never dropped**.
- **The rotating stall:** the Market shows a small selection at a time,
  rotating every **4 weeks of crons** — 28 *active days*, not calendar
  days. Days with no habits marked don't advance the rotation clock.
- **The stall's pool grows with the Map:** newly discovered regions add
  their goods to the rotation pool, so the Market gets *more*
  surprising over the years, never less. (Deliberate soft link:
  expedition shapes what's *on offer*; it never earns fungi.)
- **Nothing is ever missable:** every object eventually cycles back
  into rotation. No limited-forever items, no FOMO.
- **Symmetric prices, always:** buying an object costs its price;
  returning it to the world refunds exactly that price. No penalty, no
  spread, ever. Purchased objects live in the Abode alongside flora.

### How rewards arrive

- Flora, reading-material, and fungus drops **arrive the same way**
  (one drop mechanic); they differ in what happens next — flora are
  optional to gather and compostable, reading material is always kept,
  fungi go straight to the wallet.
- **Each reward type introduces itself differently the first time it
  occurs** — first flora, first magazine, first fungus, first friend,
  etc. each get their own distinct reveal moment.

The three streams stay independent in their **earning**: completions
feed each separately, and no stream's rewards can be converted into
another's (composting flora yields no fungi; fungi can't buy literacy
or map progress). The one deliberate link is on the *spending* side:
region discovery expands what the Market can offer.

## 5b. App structure (pages)

- The **HABITAT header** on every page is the home link back to the
  habit list (2026-07-16) — except during the morning check-in, whose
  done button stays the only exit.
- **Home screen:** the habit list, with the three meters fixed at top.
  The list is manually re-orderable (order persists) and filterable by
  symbols (multi-select; a temporary lens that resets each visit).
  Habits can be archived (history kept) or permanently deleted (with
  confirmation).
- **Map** (via expedition meter): the discovered planet so far.
- **Bookcase** (via literacy meter): all reading material collected.
- **Market** (via fungus meter): the rotating stall; buy and return
  objects.
- **Abode:** gathered flora and purchased objects, freely arrangeable,
  removable (compost / return).
- **Guest Book:** friends made so far.
- **Field notes:** the weekly view (T2.3) — browsable Mon–Sun weeks,
  opening on the last completed one; reached from a link on the habit
  list, and opens by itself on the first visit of each Sunday (after
  any check-in). Has a short description of itself and a "back to
  habits" link.
- **Settings:** day cutoff, data export/import.

## 6. Data & reflection

- Every completion/skip logged locally, timestamped, attributed to the
  correct day (see 4.2).
- A **weekly view** summarises the week: completions and streaks —
  presented as field notes, not a guilt dashboard. Kept simple in v1.
  ("Patterns" were dropped from the brief — Kimia, 2026-07-16; the
  grid speaks for itself.) Per-habit line graphs live at the foot of
  the field notes (built in T2.4).

## 7. Look & feel

- **Dark mode only.** Deep-space blacks and near-blacks as the base.
- Text and elements in a **mix of white, pastels, and basic colours** —
  with **bright, bold neons reserved as the POP** (drops, reveals,
  milestones, key accents). Neon is the exclamation mark, not the body
  text.
- Atmospheric and moody — contemplative, not cute. The planet feels
  bioluminescent.
- All visuals **SVG / code-drawn**: crisp, glowing, animatable, fully
  vibe-codeable, ideal for neon-on-dark.

## 8. Architecture (v1)

- Static single-page web app: HTML/CSS/JavaScript (framework decided in
  plan phase — likely React or plain JS, whichever keeps us simplest).
- No backend. All state in `localStorage`, with a manual "export/import
  data" button as backup insurance.
- Deployed via GitHub Pages from the public repo.

## 9. Testing strategy

- Automated tests for all game logic — habit scheduling, meter maths,
  drop rates, literacy milestones, wallet arithmetic (buy/return
  symmetry), cron counting and market rotation, data export, and
  **especially check-in date attribution and backfill** (4.2). These
  run on every change and act as the non-coder's safety net.
- Manual playtesting checklist for UI after each feature.
- CI on GitHub runs tests on every push.

## 10. Decisions log

- 2026-07-12: schedule shapes include N-per-day (N≥2; each completion
  counts, day fulfilled at N; extras kept).
- 2026-07-12: habit list manually re-orderable (persists) and
  filterable by symbols (temporary, resets each visit).
- 2026-07-12: backup import replaces all data (no merge); app warns
  first if existing data would be overwritten.
- 2026-07-12: habits can be archived (history kept) or permanently
  deleted.
- 2026-07-13: one-time schedule shape (to-do): completing it archives
  it; same-day undo un-archives it.
- 2026-07-13: N-per-week fulfilled by N distinct fulfilled days, not N
  raw completions.
- 2026-07-13: "whenever" and one-time habits have no streak (null —
  no expectation, no pressure).
- 2026-07-14: third reward stream added (fungi currency + Market);
  expedition drops changed to flora; check-in backfill defined (see
  entries below).
- App name: **Habitat**. Planet name: **N-Z-D**.
- Framing: ethical immigration, not exploration/settlement.
- 10 friend categories on a sliding literacy scale (draft ladder in 5).
- One unified habit type; 6 abstract symbols, no word labels ever (the
  symbol is the tag); difficulty easy/medium/difficult.
- Three reward streams, independent in earning: expedition (flora),
  literacy (reading → friends), fungi (currency → objects).
- Expedition meter fully predictable; reading drops rare and surprising;
  fungi drop occasionally on completions.
- Expedition drops are **flora** (gather/grow or compost); composting
  yields nothing. Objects are **purchased at the Market**, never
  dropped.
- Fungus meter is a wallet (rises with drops, falls with purchases);
  clicking it opens the Market.
- Market: rotating stall, rotation every 28 crons (active days, not
  calendar days); pool grows with region discovery; everything cycles
  back eventually — nothing is permanently missable.
- Symmetric buy/return prices always — no penalty, no spread.
- Flora and objects optional to collect and always returnable — no
  forced clutter.
- 2026-07-14 (supersedes the "no data" idea from earlier the same day):
  there is no "no data" state — an unfilled day simply counts as not
  done (neutral, as ever). Backfill window: days of the current Mon–Sun
  week stay editable until the week ends, then freeze. Calendar
  yesterday is always editable (Monday can fill in Sunday). The
  check-in about yesterday must be answered; older days are optional.
- 2026-07-14: only an unresolved yesterday triggers the check-in —
  older editable days never nag on their own (optional means optional);
  they are offered inside the open check-in and via "edit past days".
- 2026-07-15: day rollover needs no refresh — an open tab re-checks
  the clock every minute and on returning to the tab, then behaves
  exactly like a fresh visit (new day's list, check-in if owed).
- 2026-07-15 (T2.1, supersedes "difficulty determines meter advance"):
  difficulty does NOT affect the expedition meter — every completion is
  exactly one step (1:1:1). Difficulty stays on habits for future use
  (e.g. drop odds in M3).
- 2026-07-15: undoing a completion reverses the expedition meter by the
  same amount — meters are always computed from completion history,
  never stored as a running number, so the meter exactly equals real
  history at all times.
- 2026-07-15: for N-per-day habits, completions beyond N also advance
  the expedition meter — every tap counts.
- 2026-07-15: pacing constants (e.g. the taps-per-day estimate behind
  the 5-year sizing) get recalibrated roughly every 6 months against
  real historical averages (plan T6.2). Safe because meters are derived
  from history, so retuning never corrupts earned progress.
- 2026-07-16 (T2.2): the expedition meter's bar is a ROLLING bar — a
  full 5-year bar would move invisibly per tap, so the bar fills over
  one segment (100 steps ≈ a month at the current pace, constant in
  constants.js), rolls over to empty, and the running step total shows
  beside it. The literacy bar shows progress from the last friendship
  milestone toward the next; the fungus meter is a plain balance (a
  wallet has no progress bar).
- 2026-07-16 (T2.2): until the real pages arrive in M4, clicking a
  meter opens a simple placeholder page (Map / Bookcase / Market) with
  a back button — the navigation is real, the content is a promise.
- 2026-07-16 (T2.2): meters show on the habit list and the pages
  reached from it, NOT above the morning check-in — answering
  yesterday stays distraction-free.
- 2026-07-16 (T2.2 amendment): the HABITAT header is the home link —
  clicking it from the Map, Bookcase or Market (or any future page)
  returns to the habit list. The one exception is the morning
  check-in, where the header stays a plain title: its done button
  remains the only way out, so yesterday always gets answered.
- 2026-07-16 (T2.3): **streaks judge each day by the schedule in force
  ON that day** — frequency changes are never retroactive. (Mon+Fri
  habit, done Monday; schedule changed Tuesday to Mondays only → the
  coming Friday can't break the streak. Without the edit, it would.
  Equally, a Friday already missed before the edit stays missed.)
  Schedule edits are therefore date-stamped: each habit keeps a
  schedule history. Edits made before 2026-07-16 were never recorded,
  so older days are judged by the current schedule — a one-time
  limitation that fades as new history accumulates.
- 2026-07-16 (T2.3): switching a schedule between the two streak
  counting units — day-counted (daily / weekdays / N-per-day) and
  week-counted (N-per-week) — restarts the streak at the switch; the
  app warns before saving such an edit. An N-per-week target changed
  mid-week judges that week by the n in force at the week's end.
- 2026-07-16 (T2.3): the field notes page — browsable Mon–Sun weeks
  (back to the first week Habitat ever saw, forward to the current
  week, marked "still unfolding"), opening on the last completed week.
  Rows show each habit's 7 days: ✓ / count for marks, a quiet dot for
  a concluded scheduled day left unmarked, blank where nothing was
  asked. "Patterns" dropped from the brief. Streaks appear only when
  notable (≥1) — a broken streak shows nothing, not a zero. One-time
  to-dos have no row; the week they were done lists them under "tasks
  completed". Archived habits keep their recorded weeks (up to the
  archive day); deleting a habit deletes its notes with it.
- 2026-07-16 (T2.3): the field notes open by themselves on the FIRST
  visit of each Sunday, right after any check-in; a link on the habit
  list reaches them any time. The page carries a short description of
  itself and a "back to habits" link.
- 2026-07-16 (designed in T2.3, built in T2.4): per-habit **line
  graphs** in the field notes — one collapsible graph per habit showing
  its raw completion counts over time ("frequency, unrelated to the
  goal" — streaks measure goal fulfilment; graphs are neutral data).
  X-axis zoom levels: day-by-day, week-by-week, 4-weeks-by-4-weeks.
  Each level unlocks purely by the habit's AGE — 3 days / 3 weeks /
  12 weeks of existing on the list — never by completions (a
  12-week-old habit with zero marks still graphs a flat zero line).
  One-time to-dos get no graph. An archived habit keeps its graph,
  frozen at the archive day.
- 2026-07-18 (T2.4): the graphs live in their OWN section at the foot
  of the field notes, below the week grid — every eligible habit as a
  collapsed row, unaffected by which week is on show (a graph is
  whole-life, not weekly). Archived habits appear too, marked; one-time
  to-dos don't.
- 2026-07-18 (T2.4): a graph's x-axis is the habit's ENTIRE life,
  squeezed to fit — nothing hidden, no scrolling; zooming out is the
  remedy when day-by-day gets crowded. It opens on the coarsest
  unlocked zoom (the whole shape at a glance; zoom in from there).
- 2026-07-18 (T2.4, filling in the spec's gaps): graph week buckets
  are the app's usual Mon–Sun weeks, and 4-week buckets count in
  groups of four from the habit's first week. Age counts inclusively —
  the creation day is day 1, so day-by-day unlocks on the habit's 3rd
  day; a younger habit's row shows a quiet "still settling in" line
  instead of a graph. Archiving freezes the age clock along with the
  graph.
- A cron = a day with ≥1 habit marked (including retroactive marks).
- Reward pacing: slow, steady, designed for a patient daily user; no
  front-loaded hooks.
- Retroactive check-in marks attributed to the actual day of completion.
- No punishment mechanics anywhere.
- Weekly view: simple — completions, patterns, streaks only.
- SVG-only visuals; dark base; white/pastel/basic colours for content,
  neon reserved for POP moments.
- Meters permanent at top, infinite growth (~5 years practical sizing);
  meter clicks open Map and Bookcase.
- Objects arranged/removed in the Abode page; friends in the Guest Book.
- Each reward type gets a distinct first-occurrence reveal.
- GitHub Pages hosting; localStorage data; export/import backup.
- Day cutoff 3am by default, configurable.
- Friendships space is the **Guest Book**.
- Returned objects re-enter the world and can be found again.
