# CLAUDE.md — rules for AI coding sessions on Habitat

Session-start reading — kept deliberately light (2026-07-21):

- Always read this file in full (every guardrail lives here), plus the
  current task's entry in plan.md.
- Then read only the spec.md sections the task touches — and the
  design-notes.md sections for any design-adjacent task. Read a whole
  file only when the task genuinely spans it.
- **design-bible.md is the art language + asset catalogue**
  (2026-07-24) — session-start reading only for asset-creation and
  art-direction work (T5.3, T6.1); coding sessions skip it.
- **history.md is the audit trail** (dated decisions log, version
  history, completed-task build notes). It is never session-start
  reading — open it only when you need the story of how a rule came
  to be.

If anything is ambiguous, ask Kimia before coding — never guess and
never invent requirements.

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
- **UI tests assert structure and behaviour, never incidental wording
  (added 2026-07-21):** query by role, aria label, count and state.
  Asserting an exact word is allowed only where a spec decision pins
  that word (the `-1`, "filter view", a page title); free-floating
  prose assertions break the suite on every copy pass — and Kimia's
  content words stay out of tests entirely, as ever.
- Run the full test suite before declaring any task done. A task with
  failing tests is not done.
- Commit after each completed task with a clear message (what + why).
- Update plan.md checkboxes when a task completes.
- **End-of-session doc sync (2026-07-14; simplified 2026-07-21 —
  record each decision ONCE):** before the final commit of every
  session, verify that (a) plan.md checkboxes match what is actually
  built — tick the box, keep the completed task to ONE line, and
  append its full build notes to history.md; and (b) every product
  decision made during the session has one dated entry in history.md's
  decisions log AND is folded into the spec.md / design-notes.md
  section it changes (those files must always describe the present on
  their own). No version-history preambles anywhere. Docs that
  disagree with code are a bug — say so and fix them in the same
  session.
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
- Friendships (T4.4): a literacy milestone only OPENS the door — the
  friend arrives days later as a seeded drop, stored on the completion
  like every drop. Categories refill only until their fixed roster is
  exhausted — 10 Drifters down to 1 Poet, 55 friendships lifetime max
  (2026-07-24); names stay the draft category singulars until T6.1. Every arrival is a
  reveal; the signature animation plays in exactly three moments —
  arrival reveal, Guest Book card, big-win home-screen cameos (T4.6) —
  never party mode. Party mode stores nothing and never disturbs the
  abode layout.
- Framing: ethical immigration to N-Z-D. We are a guest, not a
  coloniser — no conquest/claiming/extraction language anywhere.

## Design guardrails (from design-notes.md — never violate)

- **Soundless.** No audio, anywhere, ever. All feedback is visual.
- **Claude Code never writes the story.** All narration, dialogue,
  friend introductions, and captions are human-written by Kimia.
  Scaffold empty, keyed content slots and ship them blank
  (`TODO: written by Kimia`) — never auto-generate prose. And never
  hard-code her content words in tests: assert structure and
  behaviour, not her prose — she edits `src/content/` directly on
  GitHub, so a test quoting her breaks CI the moment she rewrites.
- **Narration is momentary** — it plays once and is never stored or
  re-readable. The single exception (2026-07-20) is the friend card
  text on the Guest Book popup card: a separate slot from the arrival
  narration, re-readable by design.
- No punishment _feel_ either: encouragement and motivation only.
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
- All visual design values — every colour, glow strength, font size and
  spacing number — live in one **CSS design-tokens file** of named
  custom properties with plain-English comments: the visual twin of
  `constants.js` (T5.2, design-notes §11d). No raw hex codes or magic
  px scattered through component styles. The six charm colours are
  canonical in the tokens file; `src/ui/symbols.js` keeps the hexes its
  JS glow strings need, marked as a mirror — keep the two in sync.
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
