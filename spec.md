# spec.md — HABITAT

_v1.3 — 2026-07-12. Spec agreed; ready for planning (plan.md)._

## 1. One-line pitch

**Habitat**: a personal habit tracker where completing habits carries us
through **ethical immigration to the alien planet N-Z-D** — getting to
know the land, furnishing a local home with found curiosities, learning
the local language, and earning friendships within the community. Habit
by habit, we build a habitat.

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
- A schedule the user defines (e.g. every day, Mon/Wed/Fri, 3× per week,
  N× per day for habits repeated within a day, or "whenever" for
  unscheduled ones). For an N-per-day habit each completion counts on
  its own and the day is fulfilled at N — fewer is neutral data, never
  punished. *(N-per-day added 2026-07-12.)*
- **One-time** *(added 2026-07-13)*: a schedule shape that makes the
  habit a non-repeating **to-do**. It looks and behaves exactly like any
  other habit in the habit list, but checking it off **auto-archives**
  it immediately. Undo is possible on the day it was checked off (an
  "undo" button in the archived section un-archives AND un-does it, as
  if the tap never happened); after that day it is frozen as done, like
  all history. In the weekly view, completed one-time habits appear
  under their own heading, **"tasks completed"**, separate from the
  repeating habits.
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
- **Critical correctness requirement:** retroactive marks are recorded
  against the day they were _done_, not the day they were _entered_. If
  Monday morning we mark Sunday's habits, the data says Sunday. Habitica
  gets this wrong; we will not. This rule gets its own automated tests.
- **Day cutoff: 3am by default**, configurable in settings. A habit
  completed at 1am counts for the evening before.

## 5. Rewards: two independent streams

Reward pacing principle (learned from Habitica): **no front-loading, no
retention hooks.** Habitica showers new users with rewards then tapers —
fine for acquisition, fatal for long-term delight. Habitat has one
patient super-user who will show up every day. Rewards are steady, slow,
and never come too early. The earn curve is designed for years, not
weeks.

### The two meters (permanent fixtures)

Both meters sit **permanently at the top of the app** and grow
**infinitely** — practically sized for ~5 years of steady daily play.
Each is clickable, opening its own growing world:

- **Expedition meter** → opens the **Map**: the discovered planet,
  populating region by region over time.
- **Literacy meter** → opens the **Bookcase**: every magazine, novel,
  and dictionary we've ever received, filling shelves over time.

### Stream 1 — Expedition: getting to know the planet

- **Expedition meter:** fully **predictable**. Each completion advances
  it a set amount by difficulty (exact values in plan phase). No
  randomness in the meter itself.
- Meter progress = **planet discovery**: new regions of the planet
  gradually revealed on the Map as we get to know our new home.
- Along the way we **come across objects** as drops. Collecting is
  **optional**, and every object is **returnable to the world** at any
  time (a Habitica lesson: non-returnable gear forced clutter). Returned
  objects re-enter the world and may be encountered again someday —
  nothing is ever truly lost, so there's no pressure to hoard.
- The objects are **whacky, not home-adjacent**: weird curiosities and
  lights, rocks and flora, musical instruments, cushions, things with no
  obvious purpose. Gravity is not guaranteed on this planet.
- Collected objects live in the **Abode** — a dedicated page where we
  arrange them freely, playing with the placement of each object and
  removing (returning) any at will. Our space stays as sparse or as
  full as we like.

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

### How rewards arrive

- Object and reading-material drops **arrive the same way** (one drop
  mechanic); they differ in what happens next — objects are optional to
  collect and returnable, reading material is always kept.
- **Each reward type introduces itself differently the first time it
  occurs** — first object, first magazine, first friend, etc. each get
  their own distinct reveal moment.

The two streams never cross: expedition progress can't buy literacy, and
reading material doesn't advance the map. Two independent rhythms of
reward.

## 5b. App structure (pages)

- **Home screen:** the habit list, with the two meters fixed at top.
  The list is manually re-orderable (the user's chosen order persists)
  and can be filtered to show only habits with chosen symbols — a
  temporary lens that resets on each visit. *(Added 2026-07-12.)*
- **Map** (via expedition meter): the discovered planet so far.
- **Bookcase** (via literacy meter): all reading material collected.
- **Abode:** collected objects, freely arrangeable, removable.
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

- Static single-page web app built with **React + Vite**, tested with
  **Vitest** (decided at T0.1, 2026-07-12).
- No backend. All state in `localStorage`, with a manual "export/import
  data" button as backup insurance.
- Deployed via GitHub Pages from the public repo.

## 9. Testing strategy

- Automated tests for all game logic — habit scheduling, meter maths,
  drop rates, literacy milestones, data export, and **especially
  check-in date attribution** (4.2). These run on every change and act
  as the non-coder's safety net.
- Manual playtesting checklist for UI after each feature.
- CI on GitHub runs tests on every push.

## 10. Decisions log

- 2026-07-12: schedule shapes are daily / specific weekdays / N-per-week /
  N-per-day (N≥2; each completion counts, day fulfilled at N) / whenever.
- 2026-07-13: sixth schedule shape **one-time** — a non-repeating to-do.
  Auto-archives the moment it's checked off; undo (un-archive + un-done)
  available the same day only; no streaks; weekly view lists these under
  a separate "tasks completed" heading.
- 2026-07-12: habit list is manually re-orderable (order persists) and
  filterable by symbols (multi-select; temporary, resets each visit).
- 2026-07-12: backup import replaces all data (no merge) and the app
  warns first if existing data would be overwritten.
- 2026-07-12: habits can be archived (history kept) or permanently
  deleted.
- App name: **Habitat**. Planet name: **N-Z-D**.
- Framing: ethical immigration, not exploration/settlement.
- 10 friend categories on a sliding literacy scale (draft ladder in 5).
- One unified habit type; 6 abstract symbols, no word labels ever (the
  symbol is the tag); difficulty easy/medium/difficult.
- Expedition meter fully predictable; reading drops rare and surprising;
  the two reward streams are independent.
- Objects optional to collect and always returnable — no forced clutter.
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
