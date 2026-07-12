# plan.md — HABITAT build plan

_v1.0 — 2026-07-12. Plan agreed. Companion to spec.md v1.3._

## How to use this file

- One task ≈ one 1–2 hour session. Do them in order unless noted.
- Every session ends the same way: **tests pass → commit → deploy →
  tick the checkbox here**. Never leave a session with broken code.
- At the start of each session, tell Claude Code: _"Read CLAUDE.md,
  spec.md and plan.md. We're doing task X.Y. Ask me anything unclear
  before writing code."_
- Tunable game numbers (meter amounts, drop rates, pacing) all live in
  **one file** (`src/game/constants.js`) so we can retune without
  touching logic.

## Working agreements (from Addy Osmani's workflow)

1. Plan first, code second — this file is the plan; keep it updated.
2. Small chunks — never ask for more than one task at a time.
3. Context always — Claude reads CLAUDE.md + spec.md before coding.
4. Human in the loop — Claude explains every change in plain language;
   we don't accept code we don't understand the _behaviour_ of.
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
      _Done when:_ a near-empty dark page saying **HABITAT** is live at our
      public URL, and `npm test` runs (even with one dummy test).

## M1 — Walking skeleton (4 sessions) → we start using it daily

- [x] **T1.1 Habit data layer.** *(done 2026-07-12)*
      Habit model (name, description, symbol 1–6, difficulty, schedule) +
      localStorage persistence + JSON export/import.
      _Done when:_ tests prove habits survive a page reload and a full
      export→wipe→import round trip.
- [ ] **T1.2 Day & schedule engine.** ⚠️ riskiest logic in the app
      Day cutoff (3am default, configurable), "which day does this
      completion belong to", schedule types (daily / specific weekdays /
      N-per-week / whenever), streak counting.
      _Done when:_ a thorough test suite passes, including: completion at
      1am → yesterday; completion at 9am → today; cutoff change doesn't
      corrupt history.
- [ ] **T1.3 Habit list UI (ugly on purpose).**
      Create, edit, archive habits; tap to complete today; the 6 symbols as
      plain placeholders. Filter the list by symbols (multi-select, resets
      each visit); re-order habits manually (order persists). Import warns
      before overwriting existing data (storage's `hasData()`).
      Dark background, zero styling effort otherwise.
      _Done when:_ we can run our real habits in it for a day.
- [ ] **T1.4 Morning check-in.**
      On first visit after a missed scheduled day: "mark what you completed
      yesterday." Marks recorded against the day they were DONE, not
      entered.
      _Done when:_ tests prove Monday-morning marks land on Sunday, across
      cutoff edge cases, multi-day gaps, and week boundaries.

**Milestone gate:** from here, Kimia uses Habitat daily as her real
tracker. Everything after this is delight, informed by real use.

## M2 — Meters & field notes (3 sessions)

- [ ] **T2.1 Meter engine.**
      Expedition meter: fixed advance per completion by difficulty.
      Literacy meter: fed by reading material (engine only, drops come in
      M3). Both infinite-growth, sized for ~5 years (constants file).
      _Done when:_ tests verify advance amounts, and 5-year pacing maths is
      documented in the constants file.
- [ ] **T2.2 Meters UI.**
      Both meters permanently at top; clickable (Map/Bookcase stubs for
      now). First styling pass: white/pastel/basic text on dark.
      _Done when:_ meters visibly move when we complete habits.
- [ ] **T2.3 Field notes (weekly view).**
      Completions, patterns, streaks. Field-notes tone, not a dashboard.
      _Done when:_ last week's real usage data renders correctly.

## M3 — Drops engine (3 sessions)

- [ ] **T3.1 Drop engine.**
      Object finds tied to expedition progress (steady); reading material
      drops (rarer, surprising: magazines > novels > dictionaries);
      difficulty shifts odds; no front-loading — flat pacing for a patient
      daily user. All rates in constants file.
      _Done when:_ simulation test over 5 simulated years shows sane totals
      (e.g. no droughts of months, no floods).
- [ ] **T3.2 Drop arrival + first-occurrence reveals.**
      One shared arrival mechanic; distinct first-time reveal per reward
      type. Neon POP reserved for these moments.
      _Done when:_ first object and first magazine reveals feel different
      and special (manual playtest).
- [ ] **T3.3 Collect / decline / return.**
      Objects optional to collect, returnable anytime, returned objects
      re-enter the pool. Reading material always kept.
      _Done when:_ tests prove returned objects can reappear; nothing is
      ever lost.

## M4 — The world of N-Z-D (4 sessions)

- [ ] **T4.1 Map page** — planet revealed region by region with
      expedition progress. SVG, dark + bioluminescent.
- [ ] **T4.2 Bookcase page** — shelves filling with every magazine,
      novel, dictionary ever received.
- [ ] **T4.3 Abode page** — collected objects placeable by drag,
      movable, removable (returnable). Play, not inventory management.
- [ ] **T4.4 Guest Book + friendships.**
      Literacy milestones open doors; friends arrive as surprise drops in
      the following days (delay logic tested). 10 categories per spec.
      _Done when:_ delay logic tests pass; Guest Book renders friends.

## M5 — Design pass (3–4 sessions, collaborative)

- [ ] **T5.1 The 6 abstract symbols** — designed together, no words.
- [ ] **T5.2 Visual identity** — palette system (white/pastel/basic +
      neon POP), typography, glow effects, animations.
- [ ] **T5.3 Creature & object art** — SVG art for friends (10
      categories), objects, planet regions. Several sessions of creative
      iteration; Kimia art-directs.

## M6 — Hardening & content (ongoing)

- [ ] **T6.1 Content pools** — write/name the actual objects, reading
      material, and friends (collaborative, fun, ongoing).
- [ ] **T6.2 Pacing tune-up** — after ~1 month of real use, revisit all
      constants against real data.
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
