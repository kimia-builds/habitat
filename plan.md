# plan.md — HABITAT build plan

_This file is the roadmap — find the current task (the first unticked
checkbox) and read its entry. Session-by-session notes and the full
build notes of completed tasks live in **history.md** (the audit
trail), not here._

## How to use this file

- One task ≈ one 1–2 hour session. Do them in order unless noted.
- Every session ends the same way: **tests pass → commit → deploy →
  tick the checkbox here**. Never leave a session with broken code.
- At the start of each session, tell Claude Code: _"Read CLAUDE.md and
  plan.md's task X.Y, plus the spec.md / design-notes.md sections it
  touches. Ask me anything unclear before writing code."_
- Tunable game numbers (meter amounts, drop rates, pacing) all live in
  **one file** (`src/game/constants.js`) so we can retune without
  touching logic.

## Working agreements (from Addy Osmani's workflow)

1. Plan first, code second — this file is the plan; keep it updated.
2. Small chunks — never ask for more than one task at a time.
3. Context always — Claude reads CLAUDE.md + the current task + the
   spec sections that task touches before coding (the guardrails all
   live in CLAUDE.md, which is always read in full).
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

- [x] **T0.1 Repo + scaffold + first deploy.** _(done 2026-07-12)_

## M1 — Walking skeleton (4 sessions) → we start using it daily

- [x] **T1.1 Habit data layer.** _(done 2026-07-12)_
- [x] **T1.2 Day & schedule engine.** _(done 2026-07-13)_ ⚠️ riskiest logic in the app
- [x] **T1.3 Habit list UI (ugly on purpose).** _(done 2026-07-13)_
- [x] **T1.4 Morning check-in.** _(done 2026-07-14)_

**Milestone gate:** from here, Kimia uses Habitat daily as her real
tracker. Everything after this is delight, informed by real use.

## M2 — Meters & field notes (4 sessions)

- [x] **T2.1 Meter engine.** _(done 2026-07-15)_
- [x] **T2.2 Meters UI.** _(done 2026-07-16)_
- [x] **T2.3 Field notes (weekly view).** _(done 2026-07-16)_
- [x] **T2.4 Habit line graphs (in the field notes).** _(done 2026-07-18)_

## M3 — Drops engine (3 sessions)

- [x] **T3.1 Drop engine.** _(done 2026-07-19)_
- [x] **T3.2 Drop arrival + first-occurrence reveals.** _(done 2026-07-19)_
- [x] **T3.2b Unlimited tap counter for every shape.** _(done 2026-07-19)_
- [x] **T3.3 Gather / decline / compost.** _(done 2026-07-19)_
- [x] **T3.4 Narration content slots.** _(done 2026-07-19)_
- [x] **T3.5 Read now / read later + the spread popup.** _(done 2026-07-19)_

## M4 — The world of N-Z-D (5 sessions)

- [x] **T4.1 Map page** _(done 2026-07-19)_
- [x] **T4.2 Bookcase page** _(done 2026-07-19)_
- [x] **T4.3 Abode page** _(done 2026-07-20)_
- [x] **T4.3b Market page** _(done 2026-07-20)_
- [x] **T4.4 Guest Book + friendships.** _(done 2026-07-20)_
- [x] **T4.5 UX, copy & navigation pass** _(done 2026-07-21)_
- [ ] **T4.6 Home-screen cameos** _(redecided 2026-07-20, fourteenth
      session — spec §5, design-notes §8)_
      The third moment the signature animation may play, now a
      celebration rather than a random visit (Kimia's redecision,
      amending the twelfth session's "rare and unpredictable"): a
      friend turns up on the habit list for a BIG WIN — a day with
      many completions, a new record streak, a lived-day milestone —
      performs its category animation once, with a short message
      alongside (her draft examples: "12 steps in one day!", "15-day
      streak record!", "50 lived days!"). Only when a friend exists;
      never on a learnable schedule; encouragement, never a
      scoreboard. The messages are Kimia's slots, shipped blank like
      all her words; the exact win thresholds are decided with her in
      this task and live in constants.
      _Done when:_ trigger tests prove each win type fires its cameo
      once (and only when a friend exists), the messages read from
      slots with blank rendering nothing, and the moment settles back
      to the calm list — no persistence, no nagging.

## M5 — Design pass (3–4 sessions, collaborative)

- [ ] **T5.1 The 6 charm symbols** — designed 2026-07-19 (docs): the
      crown, cherries, shell, anchor, shield and key, each in its colour,
      glowing. SVG paths + hexes recorded in design-notes §11a; this task
      swaps the placeholder glyphs (● ■ ▲ ◆ ✚ ✶) for the charms
      everywhere a symbol shows. No words, as ever.
- [ ] **T5.2 Visual identity** — decided 2026-07-19 (docs, design-notes
      §11b/§11c): background #080910, charm-colour accent palette with
      faint variants, dim-white text tiers; Cormorant Garamond display +
      DM Sans body (bundled, no external loading), UPPERCASE display /
      lowercase body. Plus glow effects and animations. Includes the feel
      enhancements decided 2026-07-19 (design-notes §4–§5): momentary
      glow/thicken on meter advance and roll-over (layered on the built
      bar), star-shimmer on regular drop arrivals, full firework for
      first-occurrence reveals and friend arrivals, live-vs-retro tonal
      palette shift.
      Also includes the **daily startup animation** (decided 2026-07-20,
      design-notes §12f) in the slot T4.5 built for it: a black screen with
      a slither of glowing planet across the bottom edge, spinning slowly
      like a satellite image, for a few seconds — then the normal screen
      fades in. The planet glows the **shell charm's pink `#E8698C`**,
      except on **Sundays**, when it rotates randomly between the other
      five charm colours. No text, no numbers, no narration slot; a tap
      skips straight to the fade; identical every day regardless of
      streaks or milestones (design-notes §12f explains why this one moment
      may take the screen when §6 forbids it elsewhere).
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
- history.md (2026-07-21) keeps the audit trail — decisions log,
  version history, completed-task build notes — out of session-start
  reading; each decision is recorded once, not four times.
- If a session stalls twice on the same bug: stop, commit what works,
  bring it to a fresh session with fresh context.
