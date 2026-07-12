# CLAUDE.md — rules for AI coding sessions on Habitat

Read spec.md and plan.md before writing any code. If anything is
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
- If stuck on the same bug twice, stop and say so rather than thrashing.

## Product guardrails (from spec.md — never violate)

- NO punishment mechanics of any kind. Missed habits only ever become
  neutral data.
- Habit tags are 6 abstract symbols only — no words, no labels, no
  renaming, anywhere in the UI or data model.
- Date attribution is sacred: a completion recorded during morning
  check-in belongs to the day it was DONE, not the day it was entered.
  Day cutoff is 3am by default, configurable.
- Reward pacing is flat and patient — no front-loading, no
  retention-hook mechanics, no early-days bonuses.
- Objects are always optional to collect and always returnable;
  returned objects re-enter the world. Reading material is never
  discarded.
- The two reward streams (expedition, literacy) stay independent.
- Framing: ethical immigration to N-Z-D. We are a guest, not a
  coloniser — no conquest/claiming/extraction language anywhere.

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
