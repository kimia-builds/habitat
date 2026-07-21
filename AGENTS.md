# AGENTS.md — guide for AI coding agents working on Habitat

This file tells you what Habitat is, how it is built, and the rules you
must follow. The project's own sources of truth are the markdown files
in the repo root. Session-start reading is kept deliberately light
(2026-07-21):

- **CLAUDE.md** — the working agreements for AI coding sessions
  (process rules, product/design guardrails, technical conventions).
  Always read in full — every guardrail lives here.
- **plan.md** — the build roadmap: milestones M0–M6, one task per
  session, checkboxes ticked as tasks complete. Read the current
  task's entry.
- **spec.md** — the full product specification. Read only the sections
  the current task touches.
- **design-notes.md** — the "feel layer" (UX, motion, visual identity).
  Read the relevant sections before any design-adjacent task.
- **history.md** — the audit trail (dated decisions log, version
  history, completed-task build notes). Never session-start reading —
  open it only when you need the story of how a rule came to be.

If anything is ambiguous, ask the user before coding — never guess and
never invent requirements.

## Project overview

**Habitat** is a personal habit tracker where completing habits carries
the user through an ethical immigration to the alien planet N-Z-D —
revealing a map, gathering flora, trading glowing fungi at a rotating
market, learning the local language, and earning friendships. It keeps
habits, streaks and progression, with three independent reward streams
(expedition → flora, reading → friendships, fungi → currency) and no
punishment mechanics of any kind.

Key facts:

- **Single user, no backend.** The app is a private tool for one person
  (Kimia, a non-coder). All data lives in the browser's localStorage
  with export/import backup. Nothing personal is committed to the repo.
- **Static site**, deployed to GitHub Pages:
  https://kimia-builds.github.io/habitat
- This is also a learning project in AI-assisted development: the user
  is a non-coder, so **explain every change in plain language** — what
  it does, why, and how we'll know it works. Prefer boring, readable
  solutions over clever ones.

## Tech stack

- **React 19 + Vite 8** (ES modules, `"type": "module"`), plain CSS —
  no CSS frameworks, no router, no state library.
- **Vitest 4 + jsdom + Testing Library** for tests.
- **oxlint** for linting, **Prettier** for formatting.
- All visuals are SVG/code-drawn. No audio anywhere, ever.
- Node 24 in CI; locally Node 25+ works (see the localStorage note
  under Testing below).

## Repository layout

```
index.html            entry page; loads /src/main.jsx
vite.config.js        one file configures both Vite and Vitest;
                      base is '/habitat/' (site lives in a subfolder)
src/main.jsx          React root (StrictMode)
src/App.jsx           the habit-list screen; owns all app state and
                      delegates every rule to the game modules
src/index.css         global styles
src/game/             ALL game logic — pure functions, no React, no
                      localStorage. One module per concern, each with a
                      colocated .test.js:
  constants.js          every tunable game number, with comments
                        explaining the pacing maths (NO magic numbers
                        anywhere else)
  days.js               "Habitat day" maths — days start at the cutoff
                        hour (3am default), named by 'YYYY-MM-DD' day keys
  schedule.js           which days a habit is due, fulfilment, streaks
  habits.js             the habit model (6 schedule types, symbol 1–6,
                        scheduleHistory so edits are never retroactive)
  completions.js        "I did this" records; each stores its drops
  checkin.js            morning check-in: which past days are editable
  meters.js             the three meters, always computed fresh from
                        history, never stored as running numbers
  drops.js              seeded drops engine (flora / reading / fungi) —
                        every roll is a pure function of the world seed
  arrivals.js           drop arrival + first-occurrence reveal logic
  flora.js              flora decisions (pending / gathered / left /
                        composted), derived from history like the meters
  map.js                region discovery + landmark markers, derived
                        from completion history (undo reverses itself)
  bookcase.js           the Bookcase layout — where each publication
                        sits on the constant bookshelf and which way it
                        faces (default slots, clamping, pruning)
  abode.js              the Abode layout — where each gathered flora
                        and owned market object sits on the open
                        ground (same pattern as bookcase.js: fractions
                        of the scene, entries only for moved items,
                        pruned on compost/sell/undo)
  market.js             the Market (T4.3b) — lived-day counting and
                        the 28-lived-day rotation clock, the pool that
                        grows with discovered regions, buy/sell with
                        the price frozen at buy time; the wallet,
                        always derived (drops − owned — the display
                        never below zero, debt settled under the hood)
  friends.js            friendships (T4.4) — literacy milestones open
                        doors; the first friend of a category is due
                        1–5 seeded days later, repeats every 20–50
                        seeded days after the previous arrival; one
                        friend per tap, stored on the completion like
                        every drop
  graphs.js             per-habit line graphs (zoom unlocks by habit age)
  fieldnotes.js         the weekly view ("field notes")
  startup.js            the daily startup's once-per-Habitat-day rule
                        (T4.5) and the morning order it enforces:
                        check-in → startup → Sunday field notes
  cameos.js             home-screen cameos (T4.6) — the three big-win
                        triggers (big day / record streak / lived-day
                        milestone), derived from history, and the
                        seeded surprise pick of the celebrating friend
src/content/          KIMIA'S FILES — she edits these directly on
                      GitHub's web UI. Never auto-generate their prose
                      or images, and never hard-code their words in
                      tests:
  narration.js          the keyed narration slots (first-occurrence
                        reveals, friend intros + re-readable friend
                        card texts, map regions, literacy eras);
                        blank slots render nothing at all
  spreads.js            maps each publication to its double-page spread
                        image in public/spreads/
src/storage/storage.js  the ONE module that touches localStorage.
                      Everything lives under the single key
                      'habitat-data' in a versioned envelope
                      (schemaVersion 8) with upgrade path for old backups
src/ui/               React components, kept thin (HabitRow, HabitForm,
                      CheckInPanel, Meters, FieldNotes, HabitGraphs,
                      ArrivalShelf, DropGlyph, ObjectGlyph, FirstReveal,
                      SpreadPopup, AbodePage, BookcasePage, MapPage,
                      MarketPage, GuestBookPage, FriendGlyph,
                      FriendReveal, Cameo, IconRail, DateDisplay,
                      StartupFade, mapLayout.js, BackupControls,
                      SymbolPicker, symbols.js, arrivalText.js)
src/ui/DesignPage.jsx   TEMPORARY (T5 prep, 2026-07-21): the
                      design-assets workbench — one empty shelf per
                      image family, reached from a door at the foot of
                      the home screen; leaves when the design pass lands
src/test/setup.js     test-environment repair (see Testing below)
public/favicon.svg    the only static asset
```

## Build and test commands

```bash
npm install       # install dependencies (npm ci in CI)
npm run dev       # dev server → http://localhost:5173
npm test          # full test suite (vitest run) — must pass before
                  # any task is declared done
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # oxlint
npm run format    # prettier --write .
```

## CI/CD and deployment

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`
2. `npm test` — a failing test stops the deploy (safety net)
3. `npm run build`
4. publishes `dist/` to GitHub Pages

So "deployed" = pushed to `main`. The `base: '/habitat/'` setting in
`vite.config.js` is required because the site is served from a
subfolder — do not change it.

## Code style guidelines

- Prettier config: **no semicolons, single quotes** (`.prettierrc`).
  Run `npm run format` before committing.
- oxlint (`.oxlintrc.json`): `react/rules-of-hooks` is an error.
- **No magic numbers in logic.** Every tunable game number lives in
  `src/game/constants.js` with a comment explaining the pacing maths.
  Retune constants there, never in logic.
- `src/game/` modules are **pure functions** — no React, no
  localStorage — so every rule is directly testable. React components
  stay thin and delegate.
- **All persistence goes through `src/storage/storage.js`.** Components
  never touch localStorage directly.
- Comments are part of the house style: modules open with a header
  comment explaining the rules, and decisions are cited with their date
  (e.g. "Kimia's decision 2026-07-16"). Match that voice — plain
  language, explain the _why_.
- All visuals are SVG/code-drawn. Dark backgrounds; white/pastel
  content; bright neon reserved for POP moments only.

## Testing instructions

- Tests are colocated with the code (`*.test.js` / `*.test.jsx`) and
  run in jsdom via `npm test`.
- **Game logic gets automated tests written with (or before) the
  code.** The date-attribution rules (day cutoff, check-in editability,
  week freezing) get the strictest tests in the project.
- **UI tests assert structure and behaviour, never incidental wording
  (2026-07-21):** query by role, aria label, count and state. An exact
  word may be asserted only where a spec decision pins that word (the
  `-1`, "filter view", a page title) — free-floating prose assertions
  break the suite on every copy pass.
- `src/test/setup.js` repairs the test sandbox: Node 25+ ships a broken
  experimental `localStorage` that shadows jsdom's, so the setup swaps
  in an in-memory implementation. Keep it in the test setup files.
- `src/game/drops.test.js` contains a 5-year simulation test that
  "referees" the pacing constants in `constants.js` — if you retune
  rates, that test is the judge.
- Some flows (native `window.confirm` dialogs) are covered by
  `src/App.test.jsx` rather than manual browser checks.
- End-to-end browser verification steps (dev-server launch, flows to
  drive, tooling gotchas) live in `.claude/skills/verify/SKILL.md`.
- **Definition of done for every task:** code written and explained in
  plain language → `npm test` passes → committed with a clear message
  (what + why) → pushed (deploys via CI) → plan.md checkbox ticked.

## Development workflow

- Work on exactly **ONE task from plan.md at a time**. Do not start the
  next task and do not "improve" things outside the current task.
- Commit after each completed task with a clear message.
- **End-of-session doc sync (record each decision ONCE, 2026-07-21):**
  before the final commit of a session, verify that (a) plan.md
  checkboxes match what is actually built — tick the box, keep the
  completed task to ONE line, and append its full build notes to
  history.md; and (b) every product decision made during the session
  has one dated entry in history.md's decisions log AND is folded into
  the spec.md / design-notes.md section it changes (those files must
  always describe the present on their own). No version-history
  preambles anywhere. Docs that disagree with code are a bug — fix them
  in the same session.
- If stuck on the same bug twice, stop and say so rather than thrashing.

## Naming and copy (current as of 2026-07-21)

The T4.5 UX pass is **built** (2026-07-21): the pages on screen show
their new titles, and the rail, icon-only actions and `-1` below all
exist in the UI. The **internal** names in code and docs (Map,
Bookcase, Market, Abode, Guest Book) are unchanged — only the
displayed titles moved:

| page       | displayed title                     | reached by                |
| ---------- | ----------------------------------- | ------------------------- |
| Map        | **map of N-Z-D**                    | expedition meter, or rail |
| Abode      | **your abode**                      | rail only                 |
| Guest Book | **local community**                 | rail only                 |
| Bookcase   | **readers library** (no apostrophe) | literacy meter, or rail   |
| Market     | **local market**                    | fungus meter, or rail     |

Other copy rules:

- The **left icon rail** (T4.5, built 2026-07-21) runs down the left
  edge in this descending order: **map · abode · community · library ·
  market**, each revealing its name on hover — the full display title,
  not the rail's short word. It **persists on every screen but the
  check-in** (Kimia's call 2026-07-21) — the check-in's done button
  stays the only exit. The three meters stay clickable too.
- The home screen is **icon-only with hover labels** (T4.5, built
  2026-07-21) — no action words. Every mark-reversing control reads
  **`-1`** (mirroring `+1`); habit counts are bare `count/goal` with
  no trailing "today"; the symbol filter's hover reads **"filter
  view"** (never "by type" — the six symbols are not categories).
  Unarchive is an icon too (a box with an up arrow — Kimia's call
  2026-07-21, the one extension to the six enumerated icons).
- The Abode's quiet way back for an owned market object reads
  **"sell"** (T4.3b, built 2026-07-20 — Kimia's word for the spec's
  symmetric "return"); for a gathered flora it stays "compost".
- Habitat's voice is **all-lowercase** by default; uppercase is
  reserved for display titles and section labels.

## Product guardrails (never violate — full list in CLAUDE.md)

- **No punishment mechanics or punishment feel.** Missed habits are
  neutral data; no "no data" state, no alarm colours, no shakes.
- **Habit tags are 6 symbols only** (the six charms) — no words,
  labels, or renaming anywhere in UI or data model.
- **Date attribution is sacred:** a completion belongs to the day it
  was DONE, not the day it was entered. Day cutoff is 3am (whole hours
  0–23, configurable). Check-in always asks about calendar yesterday,
  which must be answered; older days are optional. Past days are
  editable only while their Mon–Sun week is current (calendar
  yesterday always is, even on a Monday); a finished week freezes.
  Unfilled days simply count as not done — neutral data.
- **Reward pacing is flat and patient** — no front-loading, retention
  hooks, or early-days bonuses. Designed for one loyal daily user over
  ~5 years.
- **Three independent reward streams** with no conversions between
  them; the only link is region discovery expanding the Market's
  rotation pool.
- **Flora are optional to gather and always compostable;** composted
  flora re-enter the world. Reading material is never discarded. Fungi
  go straight to the wallet.
- **Market:** objects are purchased, never dropped; buy and return
  prices are always identical; the fungus wallet only decreases via a
  purchase the user chose; rotation runs on **lived days** (days with
  ≥1 habit marked), 28 lived days per rotation; nothing is permanently
  missable. The wallet is a bar (T4.5) clamped 0–40 whose face never
  shows debt — but its hover reveals the true balance as a plain
  number, negative while debt settles (Kimia's call 2026-07-21).
- **Friendships (T4.4):** a literacy milestone only opens the door;
  the friend arrives days later as a seeded drop, stored on the
  completion like every drop. Categories refill (repeats allowed);
  names stay the draft category singulars until T6.1. Every arrival is
  a reveal; the signature animation plays in its **three moments
  only** — arrival reveal, Guest Book card, big-win home-screen
  cameos (T4.6) — never party mode. Party mode stores nothing and
  never disturbs the abode layout.
- **The word "cron" is retired** (2026-07-20). What it named is a
  **lived day**. Do not reintroduce it in docs, code, comments or UI —
  it collided with the scheduling sense of the word and with the daily
  startup animation, which fires on day rollover (3am), not on
  activity.
- **Soundless.** No audio, anywhere, ever. All feedback is visual.
- **AI never writes the story.** All narration, dialogue, friend
  introductions and captions are human-written. Scaffold empty, keyed
  content slots and ship them blank (`TODO: written by Kimia`) — never
  auto-generate prose. This covers images too: the reading-material
  spreads are pictures Kimia provides, never AI-generated.
- **Narration is momentary** — it plays once and is never stored or
  re-readable. The single exception is the friend **card text** on the
  Guest Book popup card (2026-07-20), which is a separate slot from the
  arrival narration and is re-readable by design.
- **Never hard-code Kimia's content words in tests.** She edits
  `src/content/` directly on GitHub, so the local clone can be behind
  origin; a test asserting her exact prose breaks CI the moment she
  rewrites a line. Assert structure and behaviour, not her words.
- **Framing:** ethical immigration — we are a guest, not a coloniser.
  No conquest/claiming/extraction language anywhere.

## Security and privacy considerations

- There is no backend and no telemetry; all habit data stays in the
  browser's localStorage (key `habitat-data`), with export/import as
  the backup mechanism.
- **Personal habit data must never be committed to the repo** — the
  repository is public on GitHub.
- Destructive actions (delete-forever, import over existing data) are
  guarded by `window.confirm`.
- Data is stored in a versioned envelope; when changing the shape of
  stored data, bump `SCHEMA_VERSION` in `src/storage/storage.js` and
  extend its upgrade path so old backups keep loading.
