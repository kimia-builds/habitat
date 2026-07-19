# spec.md — HABITAT

*v1.21 — 2026-07-19 (tenth session). T4.2 built: the Bookcase page.
Decided with Kimia: ONE **constant bookshelf** (bare shelves, no prose,
no count when empty) with publications as **floating draggable books**,
arranged anywhere; each book stands **spine or face-out** (the cover's
quiet eye opens the T3.5 spread), place AND facing **remembered per
book** (storage v5); and **no found dates** — on the books or on the
Map (its tooltips came out). All in the decisions log.*

*v1.20 — 2026-07-19 (ninth session). T4.1 built: the Map page.
Decided with Kimia: the planet has **16 equal regions** (400 steps
each ≈ 4 months — a new region roughly three times a year, steady for
~5 years); the undiscovered planet shows as a **faint outline** from
day one, regions lighting up inside it; region shapes are **seeded
generative placeholders** until T5.3's art pass (names arrive with
T6.1); landmark flora are **plumbing only** until T6.1 picks the
species. All in the decisions log.*

*v1.19 — 2026-07-19 (eighth session). T3.5 built: read now / read
later + the spread popup, plus the early Bookcase list. Decided with
Kimia: the popup's **empty-state words are a narration slot** (hers;
blank shows just the publication and its close button — nothing
invented); **closing the popup lets the arrival go**; **no placeholder
spreads** — the empty state shows everywhere until T6.1 names the
publications (the flora precedent). Spread images are keyed in
`src/content/spreads.js` (Kimia's file). All in the decisions log.*

*v1.18 — 2026-07-19 (seventh session). T3.4 built: narration content
slots in one keyed file (`src/content/narration.js`). Decided with
Kimia: reveal **titles are slots too** (every word on the reveal
screen is hers); an **empty slot renders nothing** — the pop-up keeps
its glyph and button, no marker, nothing invented; future narrated
moments (friend intros, map regions, literacy eras) get labelled
**sections now, slots later**, added when those features are built.
All in the decisions log.*

*v1.17 — 2026-07-19 (sixth session, docs addition after T3.3).
Decided with Kimia: reading material gets the same held-arrival
choice symmetry — **read now / read later** — mirroring gather /
leave it (fungi stay choice-free: currency has only exchange value).
Reading opens a popup with a **double-page spread of the
publication** — images Kimia provides (never AI-generated), one per
publication named in T6.1. Re-readable anytime from the Bookcase; NO
read/unread tracking anywhere. New plan task **T3.5**. All in the
decisions log.*

*v1.16 — 2026-07-19 (sixth session). T3.3 built: gather / decline /
compost. Decided with Kimia: undecided flora WAIT (a held arrival
offers gather / leave it; one that fades undecided waits on the Abode
page — no deadline, never a nag); an early, plain Abode page (reached
from a link on the habit list) holds the waiting and gathered flora,
compostable anytime; flora stay generic ("a flora find") until T6.1
names the species. Storage v4 adds the flora decisions map. All in the
decisions log.*

*v1.15 — 2026-07-19 (fifth session, docs only). Visual identity
decided from Kimia's charm reference: the six habit symbols are now
six line-drawn SVG charms (crown, cherries, shell, anchor, shield,
key), each with its own colour; plus the app-wide palette and
typography system (Cormorant Garamond display + DM Sans body,
uppercase display / lowercase body). Full blueprint in design-notes
§11; built in T5.1/T5.2.*

*v1.14 — 2026-07-19 (fourth session, docs only). Merged the design
interrogation into **design-notes.md** (the feel layer — read it
alongside this file for any design-adjacent task). Decided with Kimia:
star-shimmer/firework placement, momentary meter glow, names stay
visible + narration momentary, undo persistent-but-quiet, no calm
mode in v1, built reveal text to be slot-ified (new plan T3.4). All in
the decisions log.*

*v1.13 — 2026-07-19 (third session, docs only). Decided: every
repeating schedule shape presents as an N-per-day-style counter with
unlimited +1 taps; every tap counts toward the meter and drops for
every shape; one-time keeps its single-tap control. Built as plan
T3.2b (a future session — no code today).*

*v1.12 — 2026-07-19 (second session). T3.2 built: drop arrival +
first-occurrence reveals. Decided today: drops START FRESH from this
update (old history rolls nothing retroactively); every completion
stores its drops at tap time; arrivals are a quiet note by the tapped
habit plus the drop object itself at the top of the page — clickable,
lingering a few seconds; check-in marks earn drops whose arrivals
wait for the done button; FIVE first-occurrence reveals (flora,
magazine, novel, dictionary, fungi), each its own neon POP.*

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
- **Every repeating shape presents as a counter (2026-07-19, plan
  T3.2b):** the UI control for daily, weekdays, N-per-week, N-per-day
  and whenever is the same running count with an unlimited +1 — never
  a one-tap toggle. Fulfilment and streaks judge exactly as before;
  taps beyond the goal are recorded and kept, and every tap counts
  toward the expedition meter and drops (see decisions log). One-time
  keeps its single-tap control (the first tap finishes it).
- **One of exactly 6 symbols** (each paired with its own colour).
  Since 2026-07-19 these are the six **charms** — crown (gold),
  cherries (coral), shell (pink), anchor (lavender), shield (sky),
  key (teal); line-drawn SVGs, full spec in design-notes §11a. The
  symbol **is** the tag — no word labels, no naming, no renaming,
  ever. Meaning lives entirely in the user's head, never explicit
  categories like "diet".
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
- **Landmark flora (2026-07-19, for T4.1/T6.1):** some flora are
  large and tree-like — too big to carry home. These special finds
  are **revealed on the Map** the moment they drop, placed in the
  region the expedition was passing through at that step, and the
  marker is **permanent** — the Map records that we came to know this
  tree, like discovery itself. (The one exception, consistent with
  all drops: undoing the very completion that dropped it takes the
  reveal back.) Landmark flora are still gatherable like any flora —
  but gathering one means collecting a **branch, fruit or leaf** from
  it, never the tree itself: the cutting goes to the Abode and is
  compostable as usual, while the tree stays where it grows, on the
  Map, regardless. This is a rule for the special ones only — small
  flora don't appear on the Map. Which flora count as landmarks is
  decided with the content pools (T6.1).

### Stream 2 — Literacy & society: earning our place

- **Reading material drops** are **less predictable and rarer** than
  object finds — the surprise-reward stream:
  - **Magazines** (common-ish)
  - **Novels** (medium)
  - **Dictionaries** (rare)
- Reading material is **never discarded** — every piece goes straight to
  the Bookcase and fills the **literacy meter**, our growing command of
  the local language.
- Each publication can be **read** (2026-07-19, plan T3.5): a popup
  opens a double-page spread of it — an image Kimia provides, one per
  publication (T6.1), never AI-generated. A held arrival offers **read
  now / read later**; either way the piece is in the Bookcase, and any
  publication is re-readable from there anytime. No read/unread
  tracking exists anywhere.
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
- **Bookcase** (via literacy meter): one **constant bookshelf** (T4.2)
  holding every publication ever received — floating, draggable books,
  each spine or face-out, the arrangement remembered; any publication's
  eye opens its double-page spread for (re-)reading (T3.5). Bare
  shelves when empty — no prose, no count, no dates.
- **Market** (via fungus meter): the rotating stall; buy and return
  objects.
- **Abode:** gathered flora and purchased objects, freely arrangeable,
  removable (compost / return). An early, plain version exists since
  T3.3 — reached from a link on the habit list — holding the flora
  waiting to be decided and the gathered ones; the arrangeable page
  arrives in T4.3.
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
- **Visual identity (2026-07-19, design-notes §11):** background
  `#080910`; the six charm colours as the accent palette with
  0.18-alpha faint variants for borders; dim-white text tiers.
  Typography: **Cormorant Garamond** (display, UPPERCASE, wide
  letterspacing) + **DM Sans** (body, lowercase), both bundled with
  the app — no external font loading. Lowercase stays Habitat's
  default voice; uppercase is reserved for display and section
  labels.

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
- 2026-07-19 (T3.1): **flora finds are window-guaranteed** — every
  consecutive window of 25 expedition steps (≈ a week at the current
  pace) contains exactly one flora find, at a seeded random step
  inside the window. Steady as the plan asks (a drought is
  impossible; the longest wait is just under two windows) yet each
  find still lands as a surprise. Reading material and fungi stay
  plain per-tap chances — rare and surprising, nothing guaranteed.
- 2026-07-19 (T3.1): **difficulty nudges the chance-based drops** —
  reading material and fungi (easy ×0.9, medium ×1.0, difficult
  ×1.2; the future use difficulty was kept for on 2026-07-15). Flora
  are window-guaranteed, so difficulty doesn't apply to them. The
  nudge is modest by design: difficulty flavours luck, it never
  becomes a strategy.
- 2026-07-19 (T3.1): **fungus income targets ~1 mid-priced object per
  rotation** — ~0.15 fungi per tap ≈ 15 fungi per 28-cron rotation,
  so when M6 prices the Market, a mid-priced object should cost
  ≈ 10–12 fungi. Fungi arrive as small clusters of 1–3 (average 1.5);
  difficulty affects whether a cluster drops, never its size.
- 2026-07-19 (T3.1): **drops are seeded, never shuffled** — every
  roll is a pure function of a stored world seed plus the tap's
  stable facts (habit, day, tap-of-day, expedition step). Undoing a
  completion takes its drops back with it (fungi leave the wallet,
  reading leaves the bookcase); redoing the identical tap returns the
  identical drops — tap–untap–tap can never be a slot machine. The
  world seed is created once at first run (wired up in T3.2).
- 2026-07-19: **landmark flora** (Kimia's rule, for the Map in T4.1) —
  large tree-like flora are revealed on the Map once they drop,
  associated with the map region their expedition step falls in, and
  the marker is permanent (only undoing the dropping completion
  removes it). Gathering a landmark means taking a branch/fruit/leaf —
  a cutting for the Abode, compostable as usual — never the whole
  tree, which stays on the Map regardless. Applies only to the
  special large flora, not all flora; which species are landmarks is
  chosen in T6.1.
- 2026-07-19 (T3.2): **drops start fresh from the update** — the week
  of completions recorded before the drops engine went live produces
  NO retroactive drops (the storage upgrade marks them as having
  delivered nothing). No opening burst; closest to the no-front-loading
  rule. The world seed is created once, at first run or upgrade, and
  travels with backups so an import restores the same luck.
- 2026-07-19 (T3.2): **every completion stores its drops**, rolled at
  tap time. Undo removes the completion and its drops leave with it
  (wallet, bookcase and "firsts" all revert); no other tap's stored
  luck ever reshuffles. Whether a drop is a FIRST is derived from
  stored history — undo the only flora ever found and the next one
  counts as a first again, reveal and all.
- 2026-07-19 (T3.2): **how a drop arrives** — a quiet pastel note
  beside the habit that was tapped ("you came across …"), while the
  drop object itself (drawn, SVG) sits at the top of the page for a
  few seconds before fading away. Clicking the object HOLDS it and
  names it; clicking again lets it go. Richer click behaviour
  (gather / decline) arrives with T3.3.
- 2026-07-19 (T3.2): **check-in marks earn drops too** (undo/redo
  consistency demands it), but their arrivals wait for the check-in's
  done button — answering yesterday stays distraction-free. Everything
  earned arrives together, back on the list.
- 2026-07-19 (T3.2): **five first-occurrence reveals** — first flora,
  first magazine, first novel, first dictionary, first fungi. Each is
  its own full-screen neon POP moment (mint / violet / amber by
  stream), dismissed only by its own button; regular arrivals stay
  pastel and quiet.
- 2026-07-19 (third session, for plan T3.2b): **every repeating shape
  presents like N-per-day** — the habit row (and the check-in /
  backfill screens) shows a running count with an unlimited +1 and an
  undo, for daily, weekdays, N-per-week, N-per-day and whenever alike.
  Goals and streaks are judged exactly as before (daily fulfilled at
  1; N-per-week by distinct days); extras are simply recorded and
  kept. One-time keeps its single-tap control — the first tap
  finishes and archives it, as ever.
- 2026-07-19 (third session, for plan T3.2b): **every tap counts, for
  every shape** — generalises the 2026-07-15 N-per-day rule: taps
  beyond a day's goal advance the expedition meter and roll drops for
  all repeating shapes. Trust-based by design (one honest user; no
  interest in tap-farming).
- 2026-07-19 (fourth session, design-notes merge): **the feel layer
  lives in design-notes.md** — north star (encouragement, gym-gains
  calm), juice = timing/scale/colour/light only, weird > cute,
  soundless (no audio anywhere, ever), human-written story (Claude
  Code scaffolds empty keyed content slots, never writes narration).
- 2026-07-19 (fourth session): **drop arrival gets a star layer** —
  regular drops add a small, brief star-shimmer over the built quiet
  pastel arrival; the full firework (a burst of confetti-like stars
  that slowly fade) is reserved for the five first-occurrence reveals
  and friend arrivals. The middle path: quiet pacing kept, drops still
  feel special.
- 2026-07-19 (fourth session): **meters glow and thicken momentarily
  on movement** — each advance plays a momentary glow/thicken
  animation on the built T2.2 rolling bar, then fades straight back
  to the normal view; segment roll-over is the same treatment with a
  brighter celebratory pulse. The resting bar never changes; this is
  a layer on the built bar, not a rebuild.
- 2026-07-19 (fourth session): **names stay visible; narration is
  momentary** — flora, objects, reading material and friends keep
  their written names (drop click-to-hold naming and T6.1 unchanged).
  Narration/story text plays once, in the moment, and is never stored
  or re-readable; record pages (Guest Book, Map, Bookcase) are
  visual-first — art + names + dates, no stored prose or captions.
- 2026-07-19 (fourth session): **undo is persistent but quiet** —
  available as long as the rules allow (same-day for one-time; the
  T3.2b counter's undo), styled small and low-key, never an alarm
  colour or a shake. (Supersedes the fading-undo idea from the design
  draft.)
- 2026-07-19 (fourth session): **no reduced-motion / calm mode in
  v1** — single user; revisit only if the motion ever feels like too
  much.
- 2026-07-19 (fourth session): **narration content is slot-based and
  human-written, retroactively** — a keyed content file holds one slot
  per narrated moment; slots ship blank (`TODO: written by Kimia`) and
  the app renders gracefully when empty. The five built T3.2 reveals
  get converted to slots (plan T3.4); their current text remains only
  as a marked placeholder until Kimia replaces it.
- 2026-07-19 (fourth session, T3.2b built): **the counter's goal
  display** — daily/weekdays/N-per-day show "count/goal today" with a
  quiet ✓ once fulfilled; **N-per-week and whenever show a plain
  count with no per-day goal** (they carry no per-day expectation;
  the week target already sits in the row's small print). The same
  counter appears on the check-in/backfill rows. One-time keeps its
  single-tap control.
- 2026-07-19 (sixth session, for plan T3.5): **read now / read later**
  — a held reading arrival offers the same kind of quiet choice a
  flora find does, for symmetry between the drops that have intrinsic
  value. Fungi are excluded on purpose: currency has only exchange
  value, so there is nothing to savour — the wallet stays choice-free.
  Unlike flora there is nothing to decline or lose: reading material
  is always kept (spec §5 Stream 2), so the choice is purely of the
  moment — read now opens the spread; read later simply lets the
  arrival go, the publication safe in the Bookcase.
- 2026-07-19 (sixth session, for plan T3.5): **reading opens a
  double-page spread** — a popup showing a spread of the publication
  itself, as an image Kimia provides (photograph/scan/collage — never
  AI-generated; the human-made rule extends from words to images).
  One spread per publication, keyed to the T6.1 content pools; the
  popup renders a graceful empty state for publications whose spread
  doesn't exist yet. Spreads live in the public repo, so only images
  Kimia has the right to publish go in.
- 2026-07-19 (sixth session, for plan T3.5): **re-readable anytime,
  tracked nowhere** — any publication ever received can be opened
  again from the Bookcase (the spread is the publication, not
  narration — the momentary-narration rule does not apply). There is
  NO read/unread state: nothing stored, nothing marked, nothing
  nagging. Read now / read later is felt, not remembered.
- 2026-07-19 (sixth session, T3.3): **undecided flora wait** — a flora
  find has four states: pending (just arrived), gathered, left (back
  in the world) or composted (was gathered, returned to the world).
  A held arrival offers gather / leave it; an arrival that fades
  undecided is NOT lost or left — it waits, pending, on the Abode page
  with no deadline and no nagging, until Kimia decides. (Her call
  today, over the fades-means-left alternative.) Left and composted
  are final. Reading material and fungi stay decision-free: always
  kept, always banked.
- 2026-07-19 (sixth session, T3.3): **the early Abode page** — a
  simple page like the meter stubs, reached from a link on the habit
  list beside the field notes, listing flora waiting to decide
  (gather / leave it) and gathered flora (a quiet compost button,
  usable anytime — no confirmation, because nothing is ever lost).
  The freely arrangeable Abode proper still arrives in T4.3.
- 2026-07-19 (sixth session, T3.3): **flora stay generic until T6.1**
  — every find is "a flora find" plus the day it dropped; species,
  names, art and landmark status arrive with the content pools.
  Decisions are stored per find (keyed by the completion that dropped
  it) in storage v4; undoing a completion removes its find and its
  decision together. Composting yields nothing — the wallet has no
  code path from flora — and the drops engine never sees decisions,
  so finds keep arriving on the steady window schedule: composted
  flora can always be encountered again.
- 2026-07-19 (eighth session, T3.5): **the spread popup's empty-state
  words are a narration slot** — `spreadPopup.emptyState` in Kimia's
  narration.js, consistent with "every word on the reveal screen is
  hers". Left blank, the popup shows only the publication's glyph, its
  generic name and a close button — nothing invented. Spread images
  are keyed one-per-publication in `src/content/spreads.js` (also
  Kimia's file; images go in `public/spreads/`); until T6.1 names the
  publications no key exists, so every popup shows the empty state —
  no placeholder images (the flora-stay-generic precedent).
- 2026-07-19 (eighth session, T3.5): **closing the spread popup lets
  the arrival go** — reading was the moment; the piece is safe in the
  Bookcase, re-readable anytime. Read later (or letting the arrival
  fade) means the same thing: nothing is at stake, and nothing about
  reading is ever written to storage. The early Bookcase list (like
  the T3.3 Abode) shows everything received, in arrival order, each
  with its read button; the real shelves (T4.2) reuse the same popup.
- 2026-07-19 (tenth session, T4.2): **the Bookcase is one constant
  bookshelf** — the same frame and planks whether it holds one
  publication or a hundred (the faint-planet precedent: bare shelves
  when empty, no prose, no count). Publications are **floating,
  draggable books**, arranged anywhere on the shelf; new arrivals fill
  deterministic default slots (top plank first) until Kimia moves them.
  Crowding is solved by her arranging, never by the shelf growing.
- 2026-07-19 (tenth session, T4.2): **spine ↔ front, remembered per
  book** — a click stands a book face-out; the cover's quiet **eye
  button** opens the T3.5 spread for reading, and a click anywhere
  else on the cover turns it back. Place AND facing are stored per
  publication (storage v5's `bookcaseLayout`, keyed by the dropping
  completion — an entry is written only once a book is moved or
  turned, and undo of that completion prunes the book's place with
  it, exactly like flora decisions). Reading itself is still tracked
  nowhere. Books are code-drawn placeholders (slim magazine, middling
  novel, thick dictionary, the literacy violet family) until T5.3;
  publications stay generic until T6.1.
- 2026-07-19 (tenth session, T4.2): **no found dates — on books or on
  the Map.** Kimia's call: the found-date captions came off the
  Bookcase, and the Map's "known since …" tooltips (regions and
  landmark markers) came out with them. A known region simply glows.
  (Discovery days stay computed in game/map.js — T5.2's
  discovery-moment narration needs them; they're just never shown.)
- 2026-07-19 (ninth session, T4.1): **the planet has 16 equal
  regions** — 400 expedition steps each (= 4 bar-segments ≈ 4 months
  at the current pace): a new region roughly three times a year,
  steady for the whole ~5 years (flat pacing, as ever). Laid out as
  the landing site in the middle, a ring of 5 around it and a ring of
  10 outside, so discovery radiates outward from where we first
  arrived. Steps beyond the 16th region stay in the 16th — the
  planet's ~5-year practical sizing; T6.2's recalibration revisits
  the numbers if the real pace outgrows them.
- 2026-07-19 (ninth session, T4.1): **the undiscovered planet is a
  faint outline** — the whole silhouette is hinted at from day one
  (the scale of the journey, barely there), and regions light up
  inside it the moment the expedition steps into them. Discovery is
  derived from completion history exactly like the meters — a
  completion's expedition step IS its position in the history — so an
  undo across a border quietly un-discovers a region by itself, and
  nothing is stored that could go stale.
- 2026-07-19 (ninth session, T4.1): **region shapes are seeded
  generative placeholders** — every wobble, border and bioluminescent
  colour is a pure function of the world seed (one stable shape per
  world, carried in backups) until the T5.3 art pass replaces the
  shapes and T6.1 names the regions. Until then a known region offers
  only its discovery date — no names, nothing invented (the
  flora-stay-generic precedent).
- 2026-07-19 (ninth session, T4.1): **landmark flora are plumbing
  only** — every flora find knows the region its step fell in, and
  the Map can draw permanent markers (a marker exists exactly as long
  as the completion that dropped its find, so only that undo removes
  it) — but no marker renders until T6.1 decides which species are
  landmarks. The 16 region narration slots now exist in narration.js
  (blank, Kimia's); their discovery-moment playback arrives with
  T5.2's ambient swell.
- 2026-07-19 (seventh session, T3.4): **narration lives in one keyed
  content file** — `src/content/narration.js` holds every narrated
  moment's words; the five T3.2 reveal texts moved there as marked
  Claude-written placeholders until Kimia replaces them. **Reveal
  titles are slots too** — every word on the reveal screen is
  Kimia's. **An empty slot renders nothing**: the reveal keeps its
  glyph and button — no marker, no invented copy. Future narrated
  moments (friend intros, map regions, literacy eras) have labelled
  sections in the file now; their slots are added when the features
  are built and their names/counts exist.
- 2026-07-19 (fifth session, docs only): **the six symbols are the
  six charms** — crown/gold, cherries/coral, shell/pink,
  anchor/lavender, shield/sky, key/teal, mapped to symbol slots 1–6;
  line-drawn glowing SVGs (paths + hexes recorded in design-notes
  §11a). A deliberate exemption from "weird > cute": the charms are
  personal talismans, not inhabitants of N-Z-D. The no-words rule is
  untouched. Built in T5.1.
- 2026-07-19 (fifth session, docs only): **typography & palette** —
  Cormorant Garamond (display) + DM Sans (body), bundled with the
  app; UPPERCASE + wide letterspacing for display and section labels,
  lowercase everywhere else; background `#080910`; charm colours as
  the accent palette. Full spec in design-notes §11b/§11c. Built in
  T5.2.
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
