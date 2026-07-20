# CLAUDE.md — rules for AI coding sessions on Habitat

Read spec.md and plan.md before writing any code — and design-notes.md
(the feel layer) before any design-adjacent task. If anything is
ambiguous, ask Kimia before coding — never guess and never invent
requirements.

## Who you're working with

Kimia is a non-coder. Therefore:

- Explain every change in plain language: what it does, why, and how
  we'll know it works. No unexplained jargon.
- Never produce code whose behaviour you can't explain simply.
- When something fails, explain what went wrong before fixing it.
- Prefer boring, readable solutions over clever ones.

## Process rules (non-negotiable)

- Work on exactly ONE task from plan.md at a time. Do not start the
  next task, and do not "improve" things outside the current task.
- Game logic gets automated tests written with (or before) the code.
- Run the full test suite before declaring any task done. A task with
  failing tests is not done.
- Commit after each completed task with a clear message (what + why).
- Update plan.md checkboxes when a task completes.
- **End-of-session doc sync (added 2026-07-14 after checkbox drift):**
  before the final commit of every session, verify that (a) plan.md
  checkboxes match what is actually built, and (b) every product
  decision made during the session is recorded in spec.md's decisions
  log with a date. Docs that disagree with code are a bug — say so and
  fix them in the same session.
- If stuck on the same bug twice, stop and say so rather than thrashing.

## Product guardrails (from spec.md — never violate)

- NO punishment mechanics of any kind. Missed habits only ever become
  neutral data.
- Habit tags are 6 symbols only (the six charms, design-notes §11a) —
  no words, no labels, no renaming, anywhere in the UI or data model.
- Date attribution is sacred: a completion recorded during morning
  check-in belongs to the day it was DONE, not the day it was entered.
  Day cutoff is 3am by default, configurable. Check-in always asks
  about calendar yesterday and must be answered; older days are
  optional. Past days are editable only while their Mon–Sun week is
  the current one (calendar yesterday always is, even on a Monday);
  once a week ends, its days freeze. Unfilled days simply count as
  not done — neutral data, no "no data" state, no punishment.
- Reward pacing is flat and patient — no front-loading, no
  retention-hook mechanics, no early-days bonuses.
- Three reward streams, independent in earning: expedition → flora;
  literacy (reading) → friendships; fungi → currency. No conversions
  between streams (composting flora yields NO fungi). The single
  allowed link: region discovery expands the Market's rotation pool.
- Flora are optional to gather and always compostable; composted flora
  re-enter the world. Reading material is never discarded. Fungi go
  straight to the wallet.
- Objects are PURCHASED at the Market, never dropped. Buy and return
  prices are always identical — no penalty, no spread, ever. The
  fungus meter is a wallet: it may only decrease via a purchase the
  user chose.
- Market rotation runs on lived days (days with ≥1 habit marked,
  including retroactive marks) — never calendar days. 28 lived days per
  rotation. (The word "cron" is retired as of 2026-07-20 — do not
  reintroduce it anywhere, in docs, code or UI.)
  Every object eventually cycles back — nothing is permanently
  missable, no FOMO mechanics.
- Framing: ethical immigration to N-Z-D. We are a guest, not a
  coloniser — no conquest/claiming/extraction language anywhere.

## Design guardrails (from design-notes.md — never violate)

- **Soundless.** No audio, anywhere, ever. All feedback is visual.
- **Claude Code never writes the story.** All narration, dialogue,
  friend introductions, and captions are human-written by Kimia.
  Scaffold empty, keyed content slots and ship them blank
  (`TODO: written by Kimia`) — never auto-generate prose.
- No punishment *feel* either: encouragement and motivation only.
  Juice comes from timing, scale, colour, and light — glow, pulse,
  anticipation pause, tap-to-reveal, nothing else. Movement
  animations are momentary and settle back to a calm resting state.
- Weird > cute. Undo is persistent where the spec allows it but
  always quiet — never an alarm colour or a shake.

## Technical conventions

- Stack: React + Vite + Vitest. Plain CSS (or CSS modules) — no CSS
  frameworks.
- All tunable game numbers live in `src/game/constants.js` with
  comments explaining the pacing maths. No magic numbers in logic.
- Game logic lives in `src/game/` as pure functions (no React, no
  localStorage access) so it's easy to test. React components stay
  thin.
- All persistence goes through one storage module — components never
  touch localStorage directly.
- All visuals are SVG/code-drawn. Dark backgrounds; white/pastel/basic
  colours for content; bright neon reserved for POP moments (drops,
  reveals, milestones).
- Personal habit data must never end up committed to the repo.

## Definition of done (every task)

1. Code written and explained in plain language
2. Tests pass (`npm test`)
3. Committed with a clear message
4. Deployed (push triggers GitHub Pages)
5. plan.md checkbox ticked
