# spec.md — HABITAT

*v1.5 — 2026-07-14. Backfill window replaces the "no data" state: past
days stay editable only while their Mon–Sun week is current (calendar
yesterday always is); unfilled days simply count as not done. Same-day
amendment to v1.4 (third reward stream: fungi + Market; flora drops).*

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
- Difficulty, set at creation: **easy / medium / difficult** — determines
  how far a completion advances the expedition meter.

### 4.2 Day boundaries & the morning check-in (cron)

- Every completion is logged with an accurate timestamp against the day
  it belongs to.
- If a scheduled day/week passes with habits unresolved, the next visit
  opens with a **check-in**: "mark the habits you completed yesterday."
  The check-in **always refers to the actual calendar yesterday**, no
  matter how long we've been away — and yesterday **must be answered**;
  only older days are optional.
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

## 5. Rewards: three independent streams

Reward pacing principle (learned from Habitica): **no front-loading, no
retention hooks.** Habitica showers new users with rewards then tapers —
fine for acquisition, fatal for long-term delight. Habitat has one
patient super-user who will show up every day. Rewards are steady, slow,
and never come too early. The earn curve is designed for years, not
weeks.

### The three meters (permanent fixtures)

All three meters sit **permanently at the top of the app**. Each is
clickable, opening its own growing world:

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
  it a set amount by difficulty (exact values in plan phase). No
  randomness in the meter itself.
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
- **Field notes:** the weekly view.
- **Settings:** day cutoff, data export/import.

## 6. Data & reflection

- Every completion/skip logged locally, timestamped, attributed to the
  correct day (see 4.2).
- A **weekly view** summarises the week: completions, patterns, streaks —
  presented as field notes, not a guilt dashboard. Kept simple in v1.

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
