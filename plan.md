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
- [x] **T4.6 Home-screen cameos** _(done 2026-07-21)_

## M5 — Design pass (3–4 sessions, collaborative)

- [x] **T5.1 The 6 charm symbols.** _(done 2026-07-21)_
- [x] **T5.1b Mobile & tablet block.** _(done 2026-07-23)_
- [x] **T5.1c Habit-card drag-to-reorder** _(done 2026-07-23, spec §4.1,
      design-notes §12a — build notes in history.md)_
- [ ] **T5.2 Visual identity** — decided 2026-07-19 (docs, design-notes
      §11b): background #080910, charm-colour accent palette with
      faint variants, dim-white text tiers. Plus glow effects and
      animations. (**The two-typeface plan left this task on
      2026-08-12** — Kimia saw it built and rejected it; the build was
      reverted and the system font became Habitat's settled typography,
      design-notes §11c.) Includes the feel
      enhancements decided 2026-07-19 (design-notes §4–§5): momentary
      glow/thicken on meter advance and roll-over (layered on the built
      bar), star-shimmer on regular drop arrivals, full firework for
      first-occurrence reveals and friend arrivals. (The ~~live-vs-retro
      tonal palette shift~~ **left this task on 2026-08-13** — Kimia's
      call to drop §3 outright rather than build or defer it; nothing
      had been built.)
      Also includes the **daily startup animation** (decided 2026-07-20,
      design-notes §12f) in the slot T4.5 built for it: a black screen with
      a slither of glowing planet across the bottom edge, spinning slowly
      like a satellite image, for a few seconds — then the normal screen
      fades in. The planet glows the **shell charm's pink `#E8698C`**,
      except on **Sundays**, when it rotates randomly between the other
      five charm colours. No text, no numbers, no narration slot; a tap
      skips straight to the fade; identical every day regardless of
      streaks or milestones (design-notes §12f explains why this one moment
      may take the screen when §6 forbids it elsewhere). **Desktop/laptop
      only (2026-07-21):** gated behind a min-width check; mobile and tablet
      skip it and keep the plain fade — Habitat's only device-conditional
      moment.
      **M5 layout & atmosphere pass (Kimia's layout spec, merged
      2026-07-21 — design-notes §13):** a full-width top header (wordmark ·
      meters · date · charm filter) via CSS `grid-template-areas`, above the
      unchanged 40rem content column; each secondary page's title promoted
      into a shared `.page-title` region above its box; and a full-bleed
      night-sky background (sparse, rarely-twinkling CSS stars) on every
      device.
      **Design-tokens file (Kimia's call 2026-07-21 — design-notes §11d,
      CLAUDE.md):** every colour, glow, font size and spacing number moves
      into one CSS file of named, commented values — the visual twin of
      `constants.js`; the six charm colours become canonical there and
      `src/ui/symbols.js` mirrors the hexes its JS needs.
      **Sliced 2026-08-10** — one task was always several sessions, so it
      now says so. The tokens file goes first, because every slice after
      it is an edit to one short list instead of a tour of the stylesheet:
      - [x] **T5.2a The tokens file — colour** _(done 2026-08-10 — build
            notes in history.md)_
      - [x] **T5.2b The §11b palette** _(done 2026-08-11 — build notes in
            history.md; the dim-white text tiers were dropped on Kimia's
            eyeball test, design-notes §11b)_
      - [~] ~~**T5.2c Typography**~~ _(dropped 2026-08-12 — built, rejected
            on sight, reverted the same day. Kimia's call: the system
            font Habitat already wore IS its typography, so there is
            nothing left to build. design-notes §11c now describes the
            lettering instead of proposing it, and the slice is kept
            here, struck through, so nobody proposes it again.)_
      - [x] **T5.2d Layout & atmosphere (§13)** _(done 2026-08-12 —
            build notes in history.md)_ — the header bar, promoted page
            titles, the night sky as the app background, and the spacing
            scale into the tokens file. Built one visible slice at a
            time with Kimia's eye between each (the T5.2c lesson), and
            three of the four came back with corrections:_
            - [x] promoted page titles (§13b) _(2026-08-12)_
            - [x] the top header bar (§13a) _(2026-08-12)_
            - [x] the night-sky background (§13c) _(2026-08-12 — the
                  workbench NightSky mounted as the app background; its
                  ground colours into tokens.css, re-tuned to sink into
                  the settled §11b ground)_
            - [x] the spacing scale into the tokens file _(2026-08-12 —
                  22 ad-hoc values become 8 steps on a 4px grid)_
      - [ ] **T5.2e Glow, feel & the startup animation** — the §4–§5 feel
            enhancements and the §12f rolling planet; the glow scale joins
            the tokens file here, once there is a real one to name.
            - [x] the §12f rolling planet _(2026-08-13 — built in front of
                  Kimia on the design workbench, then wired into the real
                  daily startup: hold, fade, tap-to-skip, Sunday colour.
                  Build notes in history.md)_
            - [ ] the §4–§5 feel enhancements + the glow scale into the
                  tokens file. Built in front of Kimia, smallest visible
                  change first (the T5.2c lesson); she redirected twice
                  on the first step alone. Order agreed 2026-08-13:
                  - [x] where an arrival appears (§5) _(2026-08-13 — the
                        shelf pinned to the window's top right below the
                        header, names always shown, newest on top; the
                        by-the-habit note moved out of its tile so the
                        list stops shifting under a finger; arrivals
                        became opaque drawn blobs in the Map's shape
                        language. Build notes in history.md)_
                  - [x] the star-shimmer on regular drop arrivals — on
                        the arriving blob AND on the note in the task
                        _(done 2026-08-13 — the night sky's dots around
                        the blob, a glint across the note's words, drops
                        landing together cascading; approved on the
                        second cut. Build notes in history.md)_
                  - [x] the §4 meter glow — the header meter glows and
                        thickens, the tapped habit sparks with it, and
                        a check-in's movement plays once on done
                        _(done 2026-08-14 — plus the arrival fade Kimia
                        called for the same day, and the shelf bug that
                        was really behind it. Build notes in history.md)_
                  - [x] the full firework — **moved to the cameo's big
                        wins** _(2026-08-16 — Kimia looked at the §5 spec
                        she wrote on 2026-07-19 and took the firework off
                        the reveals: those already take the whole screen
                        in neon, so a burst there was decoration on a
                        takeover. It celebrates HER instead, on the T4.6
                        home-screen cameo, and only for the two rarest
                        wins. Every arrival now shimmers on the shelf as
                        a result — and on a second pass the same day she
                        reshaped the cameo to match the drops: friend in
                        a blob, caption beneath it on a dark backing,
                        pinned bottom-left, no name. Build notes in
                        history.md)_
                  - [ ] the glow scale into the tokens file, last, once
                        there are real glows to name
- [ ] **T5.3 Creature, flora & object art** — SVG art for friends (10
      categories), flora, fungi, market objects, planet regions. Several
      sessions of creative iteration; Kimia art-directs. Language and
      fixed counts in **design-bible.md** (2026-07-24); assets land on
      the temporary design-assets page first, then move into the game
      source before that page is removed (spec §5b).
      _In progress (2026-07-24): the shared **texture library**
      (design-bible §8) landed in `src/ui/textures.jsx` — seven filter
      surfaces (moss · bark · pores · sponge glow green; pumice ·
      weathered · cratered non-glowing per §3/§7) and four procedural
      hair modes — and renders as live swatches on the DesignPage
      workbench for the eyeball pass. TEX_COLORS are stand-ins until the
      T5.2 design-tokens file exists. The **environment skies**
      (design-bible §11a) also landed in `src/ui/sky.jsx` — the shared
      pure-CSS `NightSky` (white stars, rare unsynchronised twinkle) and
      the static `AbodeSky` in four muted palettes — surfaced on the same
      workbench; SKY_TOKENS are stand-ins on the same T5.2 footing.
      Mounting NightSky as the app background (T5.2) and AbodeSky on the
      real Abode screen are still to come. Still to come too: the actual
      friend / flora / fungi / object / region art that composes from
      these._
      **Character sub-plan (2026-07-25, Kimia's calls: characters
      before the 8 new flora silhouettes land; one canonical eye;
      hand-drawn archetypes with code-derived individuals; pilot one
      friend end-to-end first — workflow rules in design-bible §9c):**
      - [x] **T5.3a The eye** — canonical glowing eye chosen (the orb)
            and recorded in design-bible §9c; reusable `<Eye>` in
            `src/ui/eye.jsx`.
      - [x] **T5.3b Pilot Drifter** — Kimia thumbnails Drifter bodies,
            draws the winner clean, Inkscape-traces to SVG; assembly
            (texture + eyes + glow) on the workbench; then the Drifter
            signature congratulation animation (design-notes §8). The
            first finished friend, proving the whole recipe.
      - [x] **T5.3c The ladder** _(done 2026-08-10 — checkpoint passed
            on Kimia's eyeball test: all ten read as one family. Build
            notes in history.md)_
      - [ ] **T5.3d The size canon** (new 2026-08-10, Kimia's rule:
            "their canon sizes must remain true in relation to each
            other — not necessarily in absolute values — everywhere and
            always") — the ten archetypes' relative scales become ONE
            unitless table in a permanent home, and every place a friend
            is drawn takes its size from it against that place's own
            base size. Today the canon is absolute rem, split across a
            temporary workbench file and one CSS rule, and describes the
            shelf rather than the cast. Comes before T5.3e because the
            individuals vary size against their archetype.
      - [ ] **T5.3e Individuals** _(was T5.3d before the 2026-08-10
            insert)_ — per category, derive the remaining individuals in
            code from the archetype (size, texture, appendage, eye
            count/size); Kimia approves each. 45 across all categories.
      - [ ] **T5.3f Animations** _(was T5.3e)_ — the 9 remaining
            signature category animations (one per category,
            design-notes §8).
      - [ ] **T5.3g The 8 new flora silhouettes** _(was T5.3f;_ parked
            2026-07-25, Kimia's call to start characters first) — land
            them on the workbench with textures + glow, then continue the
            flora collection toward the 64-species count.

## M6 — Hardening & content (ongoing)

- [ ] **T6.1 Content pools** — write/name the actual flora, market
      objects (with prices), reading material, and friends; assign objects
      to regions (collaborative, fun, ongoing). Decide here which flora
      are **landmarks** (the large tree-like ones that appear on the Map,
      spec 2026-07-19).

      - [x] **T6.1a Every name becomes Kimia's to write** _(done
            2026-08-10 — `src/content/names.js` holds 10 species slots
            and 55 individual slots, all blank; build notes in
            history.md)_
      - [ ] **T6.1b Enforce the 55-friendship roster cap** (found
            2026-08-10 while building T6.1a) — spec §5, design-bible §9c
            and CLAUDE.md all say a category refills only until its
            roster is exhausted, but `nextFriendDue` has no ceiling: it
            would send an eleventh drifter, for which no name slot
            exists. `FRIEND_ROSTER` is now in constants.js; this makes
            the code obey it, with tests for an exhausted category and
            for every roster exhausted at once.
- [ ] **T6.2 Pacing tune-up (recurring)** — after ~1 month of real use,
      then roughly **every 6 months** (Kimia's decision 2026-07-15): revisit
      all pacing constants against real historical averages (starting with
      the taps-per-day estimate behind the 5-year sizing). Safe by design —
      meters are computed from history, so retuning never corrupts earned
      progress.
- [ ] **T6.3 Portfolio polish** — README with screenshots, repo
      description, demo-friendly first-run experience.
- [ ] **T6.4 Backup habit** — keeping five years of history alive in a
      browser store that browsers are allowed to evict (threat reviewed
      2026-08-10; the size worry turned out to be unfounded — ~1 MB at
      five years — while the eviction one is real).
      - [x] **T6.4a Durability groundwork** _(done 2026-08-10 — build
            notes in history.md)_
      - [ ] **T6.4b The nudge** — the periodic "export your data"
            prompt, now that the backup-age line gives it something to
            read. Quiet, and never a scold.
      - [ ] **T6.4c Automatic export to a file** (candidate, Kimia's
            call) — File System Access API: pick a backup file once,
            rewrite it on every launch. Points at an iCloud/Dropbox
            folder and backup stops being a chore. Chromium-only, so
            T6.4b stays the fallback everywhere else.
- [x] **T6.5 Safety net (error boundary).** _(done 2026-07-27, unplanned
      — added while fixing the field notes crash)_
- [x] **T6.6 Start a new game.** _(done 2026-08-11, unplanned — Kimia
      asked for a way to wipe the world and go again while keeping every
      habit and every completion; build notes in history.md)_
- [x] **T6.9 UI pass — the rail takes the doers, an empty list
      invites.** _(done 2026-08-12, unplanned — Kimia's five calls in
      one go: hover labels on the party toggle, the + / pencil / graph
      trio moved into the left rail, the "add a habit or task…" tile
      for an empty list, three clean buttons at the foot of the home
      screen, and the check-in's copy + the "mon DD-MM-YY" date
      convention; build notes in history.md)_
- [x] **T6.10 The two pages pair up, and starting over becomes a
      choice.** _(done 2026-08-12, unplanned — Kimia's calls: "view
      historical data →" at the foot of the home screen as the twin of
      the field notes' back button, the three footer buttons mirrored
      onto the field notes, and "start a new game" replaced by a
      two-step popup offering total refresh or keep habit data; build
      notes in history.md)_
- [x] **T6.12 The check-in gets quick.** _(done 2026-08-14, unplanned —
      Kimia's calls: yesterday's rows compressed so as many as possible
      fit without scrolling, the charm lens added at the top of the
      panel, a `…` that folds a long day and unfolds it again, done
      always landing you at the top of the page so the held meter
      movement is on screen when it plays, and a check-in you opened
      yourself becoming click-away-able — the morning's owed one still
      exits only through done; build notes in history.md)_
- [ ] **T6.7 The first hour — storytelling & narration for a new
      player** (Kimia's call 2026-08-11) — revisit what arriving on
      N-Z-D actually feels like for someone who has never opened
      Habitat. Today the story slots (T3.4, design-notes §7) fire from
      the first drop onward, but nothing frames WHERE you are, WHY you
      are a guest, or what the meters are for; a brand-new world is
      also an empty one, so the quietest days are the first ones. Look
      at the whole arc — the first launch, the first check-in, the
      first drop, the first friend — and decide where narration
      belongs and where silence is better. Kimia writes every word
      (CLAUDE.md's standing rule); this task builds the slots and the
      moments they play in. Overlaps T6.3's "demo-friendly first-run
      experience" — do this one first and let T6.3 inherit it. Also
      the natural home for whatever T6.6's new-game path should say.
- [ ] **T6.8 Field notes — more graphs and data views** (Kimia's call
      2026-08-11) — the weekly view (T2.3) and the per-habit line
      graphs (T2.4) are the whole of it today. Add more ways to look
      at the record: longer spans than one week, comparisons between
      habits, per-difficulty cuts, and whatever the shapes suggest once
      they are drawn. (The **per-charm cut already landed** later the
      same day — the home screen's charm lens now travels to the field
      notes and narrows the grid and the graphs; spec §5b. So this task
      starts from there, not from scratch.) Scope the actual list with
      Kimia before building — this is a "revisit and decide", not a
      fixed spec. Reads history only; the no-punishment rule binds
      here as hard as anywhere (a sparse month is neutral data, never
      a red patch).
- [ ] **T6.11 The charm lens remembers itself** (Kimia's call
      2026-08-12) — today the lens is plain screen state: choose two
      charms, reload, and the whole list is back (spec §5b calls it "a
      temporary lens that resets each visit"). It should instead
      survive a refresh and carry across days, so the charms Kimia
      lives in are the ones Habitat opens on.
      **Its persistence tier is its own, and narrower than everything
      else Habitat keeps:** the lens describes THIS browser, not the
      record. So it lives under its own localStorage key, OUTSIDE the
      versioned envelope — never written into a backup file, never
      restored by an import, and never carried to another device if
      Habitat ever reaches a phone. Kimia asked for "the same as the
      bookshelf and abode arrangements"; those sit INSIDE the envelope
      and so do ride along in backups, which means this task
      deliberately does not copy them (decision logged 2026-08-12).
      **Both new-game doors clear it** — total refresh and keep-habit-
      data alike — replacing today's documented exception, where only
      a total refresh does.
      Still exactly one storage module: `src/storage/` gains the
      second key and components go on touching localStorage never
      (CLAUDE.md). A missing or junk value must read as "no lens",
      never as a crash — nothing here is worth losing a launch over.
      Two knock-ons to settle with Kimia before building, because both
      now happen on days she never touched the filter: dragging a
      habit to re-order is disabled while a lens is on (design-notes
      §12a), so Habitat can open in a state where tiles will not move;
      and a lens showing exactly one charm makes a new habit's draft
      open already wearing it (spec §5b). Both are correct as built —
      the question is only whether either wants softening. Fold the
      new rule into spec §5b when it lands.

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
