# plan.md — HABITAT build plan

*v1.11 — 2026-07-19 (third session, docs only). Added **T3.2b**
(unlimited tap counter for every shape — decisions in spec v1.13). No
code this session. Next task: **T3.2b** or **T3.3**, Kimia's pick.*

## How to use this file

- One task ≈ one 1–2 hour session. Do them in order unless noted.
- Every session ends the same way: **tests pass → commit → deploy →
  tick the checkbox here**. Never leave a session with broken code.
- At the start of each session, tell Claude Code: *"Read CLAUDE.md,
  spec.md and plan.md. We're doing task X.Y. Ask me anything unclear
  before writing code."*
- Tunable game numbers (meter amounts, drop rates, pacing) all live in
  **one file** (`src/game/constants.js`) so we can retune without
  touching logic.

## Working agreements (from Addy Osmani's workflow)

1. Plan first, code second — this file is the plan; keep it updated.
2. Small chunks — never ask for more than one task at a time.
3. Context always — Claude reads CLAUDE.md + spec.md before coding.
4. Human in the loop — Claude explains every change in plain language;
   we don't accept code we don't understand the *behaviour* of.
5. Tests are the safety net — game logic gets tests before/with code;
   the date-attribution rules get the strictest tests in the project.
6. Commit constantly — each task = at least one commit, message says
   what and why. Commits are our save points.
7. If a session goes sideways: stop, `git reset` to the last good
   commit, break the task smaller, try again.

---

## M0 — Foundations (1 session)

- [x] **T0.1 Repo + scaffold + first deploy.** *(done 2026-07-12)*
  Create public GitHub repo `habitat`. Scaffold Vite + React + Vitest +
  ESLint/Prettier. Write CLAUDE.md (project rules for AI sessions) and
  a README (portfolio-facing). Set up GitHub Actions to auto-deploy to
  GitHub Pages on every push.
  *Done when:* a near-empty dark page saying **HABITAT** is live at our
  public URL, and `npm test` runs (even with one dummy test).

## M1 — Walking skeleton (4 sessions) → we start using it daily

- [x] **T1.1 Habit data layer.** *(done 2026-07-12)*
  Habit model (name, description, symbol 1–6, difficulty, schedule) +
  localStorage persistence + JSON export/import.
  *Done when:* tests prove habits survive a page reload and a full
  export→wipe→import round trip.
- [x] **T1.2 Day & schedule engine.** *(done 2026-07-13)* ⚠️ riskiest
  logic in the app
  Day cutoff (3am default, configurable), "which day does this
  completion belong to", schedule types (daily / specific weekdays /
  N-per-week / N-per-day / whenever / one-time), streak counting.
  *Done when:* a thorough test suite passes, including: completion at
  1am → yesterday; completion at 9am → today; cutoff change doesn't
  corrupt history.
- [x] **T1.3 Habit list UI (ugly on purpose).** *(done 2026-07-13)*
  Create, edit, archive habits; tap to complete today; the 6 symbols as
  plain placeholders. Filter the list by symbols (multi-select, resets
  each visit); re-order habits manually (order persists). Import warns
  before overwriting existing data (storage's `hasData()`).
  Dark background, zero styling effort otherwise.
  *Done when:* we can run our real habits in it for a day.
- [x] **T1.4 Morning check-in.** *(done 2026-07-14)*
  On first visit after a missed scheduled day: "mark what you completed
  yesterday" — always the actual calendar yesterday, and it must be
  answered — plus **optional backfill** for other days in the window
  (spec v1.5): days of the current Mon–Sun week stay editable until the
  week ends, then freeze; yesterday is always editable even across the
  week boundary. Marks recorded against the day they were DONE, not
  entered. Unfilled days simply count as not done (neutral) — no
  separate "no data" state.
  *Done when:* tests prove Monday-morning marks land on Sunday; backfill
  marks land on their true days; the window is enforced (Sunday can
  still edit Tuesday, Monday cannot edit Saturday) across cutoff edge
  cases, multi-day gaps, and week boundaries.

**Milestone gate:** from here, Kimia uses Habitat daily as her real
tracker. Everything after this is delight, informed by real use.

## M2 — Meters & field notes (4 sessions)

- [x] **T2.1 Meter engine.** *(done 2026-07-15)*
  Expedition meter: fixed advance per completion — same step for every
  difficulty (1:1:1, decision 2026-07-15; supersedes "by difficulty").
  Literacy meter: fed by reading material (engine only, drops come in
  M3). Fungus meter: a wallet — credited by fungus drops, debited by
  purchases, refunded symmetrically on returns (engine only). Growth
  meters sized for ~5 years (constants file).
  *Done when:* tests verify advance amounts, wallet arithmetic
  (buy/return symmetry, never negative), and 5-year pacing maths is
  documented in the constants file.
- [x] **T2.2 Meters UI.** *(done 2026-07-16)*
  All three meters permanently at top; clickable (Map/Bookcase/Market
  stubs for now). First styling pass: white/pastel/basic text on dark.
  *Done when:* meters visibly move when we complete habits.
- [x] **T2.3 Field notes (weekly view).** *(done 2026-07-16)*
  Browsable Mon–Sun weeks (default: last completed; current week
  marked "still unfolding"), notable streaks only, one-time to-dos
  under "tasks completed", Sunday first-visit auto-open after the
  check-in. Field-notes tone, not a dashboard — no "patterns"
  (dropped). Under the hood: schedule edits became date-stamped
  history, so streaks judge each day by the schedule in force THEN
  (never retroactive); switching day-counted ↔ week-counted schedules
  restarts the streak, with a warning before saving.
  *Done when:* last week's real usage data renders correctly.
- [x] **T2.4 Habit line graphs (in the field notes).** *(done 2026-07-18)*
  One collapsible graph per habit: raw completion counts over time,
  neutral data unrelated to the goal. Zoom levels day / week / 4-week,
  each unlocked purely by the habit's age (3 days / 3 weeks / 12
  weeks — never by completions; a flat zero line is fine). No graphs
  for one-time to-dos; archived habits' graphs freeze at the archive
  day. SVG, code-drawn (spec §7). Full rule in spec §10 (2026-07-16).
  *Done when:* graph tests pass (unlock ages, archive freeze, counts
  per bucket) and real usage data draws sane lines at all three zooms.

## M3 — Drops engine (3 sessions)

- [x] **T3.1 Drop engine.** *(done 2026-07-19)*
  Three drop types: flora finds tied to expedition progress (steady);
  reading material (rarer, surprising: magazines > novels >
  dictionaries); fungi (occasional, currency). Difficulty shifts odds;
  no front-loading — flat pacing for a patient daily user. All rates in
  constants file.
  *Done when:* simulation test over 5 simulated years shows sane totals
  for all three types (no droughts of months, no floods; fungus income
  supports a reasonable purchase rhythm).
- [x] **T3.2 Drop arrival + first-occurrence reveals.** *(done 2026-07-19)*
  One shared arrival mechanic; distinct first-time reveal per reward
  type (first flora, first magazine, first fungus...). Neon POP
  reserved for these moments.
  *Done when:* first flora and first magazine reveals feel different
  and special (manual playtest).
  Built: world seed created at first run/upgrade (storage v3); drops
  rolled at tap time and stored on completions (undo takes them back);
  literacy + fungus meters now fed from real drops; arrival shelf +
  quiet by-the-habit notes; five neon first reveals; check-in drops
  deferred to its done button. Playtested in the browser: fungi,
  flora and novel reveals all POP distinctly; identical redo returns
  identical drops.
- [ ] **T3.2b Unlimited tap counter for every shape.** *(decided
  2026-07-19; see spec §4.1 + decisions log)*
  Every repeating shape's row presents the way N-per-day already does:
  a running "count today" with an unlimited **+1** and an undo — no
  more one-tap toggle. Daily/weekdays show the goal as 1 (e.g. "2/1
  today" once past it); whenever shows a plain count with no goal.
  Fulfilment and streak rules are untouched (daily still fulfilled at
  1; N-per-week still counts distinct days); extras are recorded and
  kept, and **every tap advances the expedition meter and rolls
  drops** (generalising the 2026-07-15 N-per-day rule). One-time
  to-dos keep their single-tap archive behaviour. The check-in /
  backfill screens get the same counter for past days.
  *Done when:* tests prove extra taps are stored on the right day for
  every shape, meters and drops count every tap, and fulfilment
  thresholds are unchanged; a real day's use feels right.
- [ ] **T3.3 Gather / decline / compost.**
  Flora optional to gather, compostable anytime, composted flora
  re-enter the pool (composting yields nothing). Reading material
  always kept; fungi always banked.
  *Done when:* tests prove composted flora can reappear and yield no
  fungi; nothing is ever lost.

## M4 — The world of N-Z-D (5 sessions)

- [ ] **T4.1 Map page** — planet revealed region by region with
  expedition progress. SVG, dark + bioluminescent. Includes
  **landmark flora** (spec 2026-07-19): large tree-like flora appear
  permanently on the Map when they drop, in the region their
  expedition step falls in (gathering takes a cutting, never the
  tree — see spec §5 Stream 1).
- [ ] **T4.2 Bookcase page** — shelves filling with every magazine,
  novel, dictionary ever received.
- [ ] **T4.3 Abode page** — gathered flora and purchased objects
  placeable by drag, movable, removable (compost / return). Play, not
  inventory management.
- [ ] **T4.3b Market page** — the rotating stall. Small selection,
  rotates every 28 crons (a cron = a day with ≥1 habit marked,
  including retroactive marks — derivable from completion history, so
  nothing earlier needs rebuilding; never calendar days); pool grows
  as Map regions are discovered; everything eventually cycles back.
  Buy (meter down by price) and return (meter up by exactly the same
  price).
  *Done when:* rotation tests pass (gap days don't advance the clock;
  backfilled days count; no item permanently missable) and buy/return
  round-trips are always fungus-neutral.
- [ ] **T4.4 Guest Book + friendships.**
  Literacy milestones open doors; friends arrive as surprise drops in
  the following days (delay logic tested). 10 categories per spec.
  *Done when:* delay logic tests pass; Guest Book renders friends.

## M5 — Design pass (3–4 sessions, collaborative)

- [ ] **T5.1 The 6 abstract symbols** — designed together, no words.
- [ ] **T5.2 Visual identity** — palette system (white/pastel/basic +
  neon POP), typography, glow effects, animations.
- [ ] **T5.3 Creature, flora & object art** — SVG art for friends (10
  categories), flora, fungi, market objects, planet regions. Several
  sessions of creative iteration; Kimia art-directs.

## M6 — Hardening & content (ongoing)

- [ ] **T6.1 Content pools** — write/name the actual flora, market
  objects (with prices), reading material, and friends; assign objects
  to regions (collaborative, fun, ongoing). Decide here which flora
  are **landmarks** (the large tree-like ones that appear on the Map,
  spec 2026-07-19).
- [ ] **T6.2 Pacing tune-up (recurring)** — after ~1 month of real use,
  then roughly **every 6 months** (Kimia's decision 2026-07-15): revisit
  all pacing constants against real historical averages (starting with
  the taps-per-day estimate behind the 5-year sizing). Safe by design —
  meters are computed from history, so retuning never corrupts earned
  progress.
- [ ] **T6.3 Portfolio polish** — README with screenshots, repo
  description, demo-friendly first-run experience.
- [ ] **T6.4 Backup habit** — periodic "export your data" nudge.

---

## Credit-efficiency notes

- The skeleton-first order means real usage validates design before we
  spend credits on delight features.
- Constants-in-one-file means retuning costs one tiny edit, not a
  session.
- Strict tests on T1.2/T1.4 (dates) prevent the most expensive class of
  debugging conversation.
- If a session stalls twice on the same bug: stop, commit what works,
  bring it to a fresh session with fresh context.
