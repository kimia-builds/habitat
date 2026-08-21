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
- [x] **T5.2 Visual identity** _(done 2026-08-16 over seven sessions from
      2026-08-10 — design-notes §11b, §11c, §11d, §12f, §13; the palette,
      the tokens file, the §13 layout pass, the rolling planet, the §4–§5
      feel enhancements and the glow scale. Typography (T5.2c) was built,
      rejected and dropped; §3's live-vs-retro shift was dropped unbuilt.
      Full task text and per-slice build notes in history.md)_
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
      workbench for the eyeball pass. The **environment skies**
      (design-bible §11a) also landed in `src/ui/sky.jsx` — the shared
      pure-CSS `NightSky` (white stars, rare unsynchronised twinkle) and
      the static `AbodeSky` in four muted palettes — surfaced on the same
      workbench._
      _Updated 2026-08-16, now that T5.2 has closed: TEX_COLORS and
      SKY_TOKENS are **no longer stand-ins waiting for the tokens file**.
      §11d settled the boundary — the tokens file holds the colours the
      STYLESHEET wears, and artwork keeps its own paints beside the
      drawings they paint — so they stay where they are. The one exception
      went as scheduled: the night sky's three ground colours moved into
      tokens.css when §13c mounted NightSky as the app background
      (2026-08-12), and sky.jsx says so where they used to sit.
      **Still to come:** AbodeSky on the real Abode screen (it is still
      workbench-only), and the actual friend / flora / fungi / object /
      region art that composes from these._
      **Glow, when the art lands (design-bible §7, restated by Kimia
      2026-08-16):** the organic things — flora, fungi, friends — take the
      TOP of the glow scale, equally; publications glow less, curiosities
      may or may not, and the map does not. Today's placeholders do not
      honour that yet, deliberately: T5.2e named the six steps
      (`--glow-faint` … `--glow-max` in tokens.css) but spent none of them
      on art about to be replaced. Which top step "full" means is an
      eyeball call once the real drawings exist — see §7.
      **Character sub-plan (2026-07-25, Kimia's calls: characters
      before the 8 new flora silhouettes land; one canonical eye;
      hand-drawn archetypes with code-derived individuals; pilot one
      friend end-to-end first — workflow rules in design-bible §9c):**
      - [x] **T5.3a The eye** — canonical glowing eye chosen (the orb)
            and recorded in design-bible §9c; reusable `<Eye>` in
            `src/ui/eye.jsx`.
      - [x] **T5.3b Pilot plip** — Kimia thumbnails plip bodies,
            draws the winner clean, Inkscape-traces to SVG; assembly
            (texture + eyes + glow) on the workbench; then the plip
            signature congratulation animation (design-notes §8). The
            first finished friend, proving the whole recipe.
      - [x] **T5.3c The ladder** _(done 2026-08-10 — checkpoint passed
            on Kimia's eyeball test: all ten read as one family. Build
            notes in history.md)_
      - [x] **T5.3d The size canon** _(done 2026-08-17 — `src/ui/friendCanon.js`
            + the pair-ratio test; also fixed which drawing is which
            species. design-bible §9c; build notes in history.md)_
      - [x] **T5.3e Individuals** _(done 2026-08-17 — an individual is a
            COLOUR, the ten-colour palette in `src/ui/friendColours.js` is
            settled, and who wears which is dealt at random per save with no
            sibling repeats. The species-by-species approval shelves are gone
            with it: a random deal has no fixed roster to approve. Also this
            session: the species keys renamed to the world's own names, and
            the workbench cleared to what is still waiting. design-bible §9c;
            build notes in history.md)_
      - [ ] **T5.3f Animations** _(was T5.3e)_ — the 9 remaining
            signature category animations (one per category,
            design-notes §8).
      - [ ] **T5.3g The flora** _(was "the 8 new flora silhouettes";
            parked 2026-07-25, Kimia's call to start characters first;
            restarted 2026-08-19 and re-scoped by her calls that day —
            there are **four** flora silhouettes, not 64, and the 64 flora
            are those four in two sizes wearing six fills. design-bible
            §9a. **The ORDINARY flora closed 2026-08-19** — shapes,
            colours, fills, sizes and the drawing recipe all settled and
            approved, and the flora, flora-fill and hair shelves left the
            workbench together. What remains under this task is the
            landmark class.)_
            - [x] **The four colours** — emerald, leaf, sky and azure,
                  picked by eye off the workbench from twelve candidates
                  (`src/ui/floraColours.js`).
            - [x] **The six fills** — hair textures only, all four modes
                  with curly coat and dense underfur doubled, each worn in
                  one of the four colours (`src/ui/floraFills.js`); the
                  hair generator learned to take a tint to do it, and
                  `denseHairField()` cookie-cuts each shape from the middle
                  of a big dense field so none wears a thin underside.
                  **Approved 2026-08-19** on all four shapes.
            - [x] **The four silhouettes** — flora 1, 2, 3 and 6 of the
                  eight she drew in July, her traces kept verbatim in
                  `src/ui/floraSilhouettes.js` under her own numbering.
                  Unnamed until T6.1.
            - [x] **The two sizes** _(no sizing sheet was needed in the
                  end)_ — **small 0.28, large 0.77** in the one shared
                  scale (`src/ui/floraCanon.js`), so flora and friends are
                  true to each other by construction. Arrived at through
                  two friends and then cut loose from them on her call: a
                  flora holds a PLACE in the whole sizing table, not one
                  friend's height. **Locked 2026-08-19**, and the
                  comparison shelf came down with them.
            - [ ] **The landmark class** — the big flora: the third size
                  class, still unset (2026-08-19, her call to settle the
                  collectibles first), plus what makes the four versions
                  of a landmark species differ (design-bible §9a leaves it
                  open), the Map marker and the keepsake cutting. Kimia
                  opens this in its own session. No screen may type a
                  landmark size in meanwhile.

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
            would send an eleventh plip, for which no name slot
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
- [x] **T6.13 Habitat learns to hold a second language.** _(done
      2026-08-16, unplanned — Kimia's call: she wants to offer Habitat
      to Farsi speakers. This is the PLUMBING ONLY: every interface word
      moved out of the components into one keyed catalogue
      (`src/content/ui.js`, hers like every other content file), a
      language setting saved in the envelope (schema v11), and a switch
      at the foot of the page. A blank Farsi slot falls back to English
      — the one place a blank slot does NOT mean silence — so the
      translation can be filled one word at a time and the app is never
      half-broken. Nothing is translated yet, and nothing about LAYOUT
      or TYPOGRAPHY changed: right-to-left, the Persian typeface, the
      Jalali calendar and the Saturday-start week are all still ahead,
      and the week change in particular is not a language question at
      all — see history.md. Build notes in history.md)_
- [ ] **T6.14 The copy deck — one home for every word Habitat says.**
      _(Kimia's call 2026-08-16, after reviewing T6.13.)_ T6.13 built the
      mechanism but caught only about 55% of the copy, and framed the
      file as a TRANSLATION file rather than what it should be: the one
      place all copy lives, editable in any language including English,
      so nothing has to be hunted for in a component ever again.
      - **Restructure to key-first.** Each piece of copy is ONE entry
        carrying a plain-English `note` (what it is and where it shows)
        and every language beside each other. Adding a language is
        adding a line per entry, not a new block — this is what makes
        further languages cheap.
      - **Absorb the other content files.** `narration.js`, `names.js`,
        `mishap.js` and `blocked.js` fold into the deck, in labelled
        sections. Two blank-rules live side by side and each section
        says which it follows: **interface** blanks fall back to
        English (a blank button is broken); **story and names** blanks
        stay silent (unchanged — never invent prose, never invent a
        name). The rule is per section, stated in the section header.
      - **Complete it — the ~110 slots T6.13 missed**, all four
        categories confirmed by Kimia: arrival & cameo text
        (`arrivalText.js`); weekday and month names and a.m./p.m.;
        backup and import error messages; confirm dialogs and the
        schedule-change warning; charm names; difficulty options; graph
        zoom labels; field-notes navigation; the empty-tile invitation.
      - **Fix the four-way weekday duplication** it exposes: `days.js`,
        `HabitRow`, `HabitForm` and `CheckInPanel` each keep their own
        copy of Mon–Sun today, so changing a weekday name means finding
        four files. One entry in the deck, read by all four.
      - **A test that the deck is COMPLETE**, not just consistent: a
        source scan that fails the suite when a component grows a new
        hardcoded user-facing string, the way `pebbles.test.js` guards
        buttons. Without it the deck drifts back out of date, which is
        the exact problem this task exists to end.
      - The wordmark is NOT in the deck and never will be — HABITAT
        stays in Latin letters in every language (Kimia 2026-08-16), so
        it is a constant with no key to translate.
- [ ] **T6.15 The week gets a shape you choose.** _(Kimia's call
      2026-08-16.)_ Three options — **Mon–Sun, Sun–Sat, Sat–Fri** — as
      its own setting, **independent of language**. A Farsi speaker who
      wants Monday weeks can have them; English with Saturday weeks is
      equally fine.
      **Nothing in the record changes — only the unit of analysis**
      (Kimia's framing). The same marks are re-grouped: a Sunday spike
      moves into a different bar because the bars are drawn differently,
      not because the data moved. No migration, no rewrite, and
      switching back and forth is lossless.
      The code is small — `weekStart()` in `game/days.js` is a single
      function with ~7 call sites (`graphs.js`, `schedule.js`,
      `fieldnotes.js`, `cameos.js`) — but three things ride on it and
      each needs its own test: which days an N-per-week habit's streak
      is judged across, how the field notes slice history, and **which
      past days are still editable**, since the freeze rule is written
      against the week. Switching may therefore freeze or unfreeze a day
      at the boundary; that is the same principle, not an exception.
      **Reword the guardrail first.** CLAUDE.md and spec §4.2 both say
      past days are editable "while their Mon–Sun week is the current
      one". That has to become "their current week shape" before the
      code can honestly contradict it.
      Habit schedules are untouched: "walk on Mon/Wed/Fri" still means
      Mon/Wed/Fri. Only the boundary moves. The weekday PICKER reorders
      to match the chosen shape; the stored ISO numbers do not.
- [ ] **T6.16 Habitat reads right to left.** The layout half of Farsi,
      and the half that has nothing to do with words. `index.css` has 29
      direction-specific rules (`left`, `right`, `margin-left`,
      `text-align`) against 2 direction-neutral ones, plus 9
      `translateX` moves that do not flip on their own; those become
      logical properties. The icon rail is fixed to the window's left
      edge and has to learn which edge is the start.
      **The scenes do NOT mirror.** The Abode ground, the bookcase and
      the map store real x/y positions Kimia arranged by hand; they are
      pictures, not text. Rule, decided once, here: **text direction
      flips, the world does not.**
      Knock-on: `ViewportGate`'s 740px threshold was calculated from the
      English wordmark plus the longest English date, so it becomes
      language-dependent and needs re-deriving per language.
- [ ] **T6.17 Farsi gets its own lettering.** Habitat's look leans on 18
      letterspacing rules (up to 0.5em on the wordmark) and on
      upper/lowercase styling. **Neither survives translation**: Persian
      script is cursive, so letterspacing severs the joins and makes
      text close to unreadable, and Persian has no letter case at all.
      Both switch off for Farsi, which means Farsi Habitat needs its own
      typographic identity rather than a copy of the English one — a
      design slice for Kimia to see and react to, one visible change at
      a time (design-notes §0), never a spec written up front.
      Also Habitat's **first webfont**: `system-ui` does not render
      Persian dependably. Vazirmatn or similar, ~150KB — the first thing
      in Habitat that must download before text looks right, so its
      loading behaviour is part of the task, not an afterthought.
- [ ] **T6.18 The Jalali calendar.** Farsi speakers expect Jalali dates
      — today is 1405, not 2026. **Display only**: day keys stay
      `YYYY-MM-DD` Gregorian and go on driving every streak, so nothing
      in the record changes and no history is touched. Only the date
      line and the field notes' labels render Jalali. Persian digits
      (۰–۹) are the same question and belong here: the date, the meters,
      prices and streak counts.
      Contained enough to ride WITH the language rather than needing its
      own setting — unlike the week, which is why they are separate
      tasks.
- [ ] **T6.19 The translation pass.** Last, on purpose: by here Habitat
      already WORKS in Farsi shape — right to left, right lettering,
      right calendar — so the words land in a finished frame and layout
      surprises have already been found.
      **AI drafts, Kimia reviews, slot by slot** (her call 2026-08-16).
      This is the one place the "Claude Code never writes the copy" rule
      bends, and it bends in a specific way: a machine draft is a
      SUGGESTION in a review queue, never a slot filled in her name. An
      unreviewed slot stays blank, and a blank interface slot shows
      English — so the app is only ever partly translated, never wrongly
      translated. The section blank-rules from T6.14 do the enforcing.
      Story and names go last and get the most human attention: they
      carry the voice, and `narration.js` is the file where a machine
      would do the most damage.
- [x] **T6.20 The cameo tells the truth, and can be asked** _(done
      2026-08-20)_
- [x] **T6.21 A past week's streak stops at that week** _(done
      2026-08-20)_
- [x] **T6.22 The visit shows that it can be pressed** _(done
      2026-08-20)_
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
- [x] **T6.11 The charm lens remembers itself** _(retired unbuilt
      2026-08-20 — absorbed whole into T6.23e, which saves the charm
      lens alongside the order and the mutings. Every persistence
      decision it had already made still stands and moves across with
      it. Original task text in history.md.)_


- [ ] **T6.23 The lenses — ways of looking at the habit list** (Kimia's
      call 2026-08-20; spec §5b "The lenses", design-notes §11f). A long
      list can only be looked at two ways today: all of it, or one charm
      combination that forgets itself the moment you reload. Five lenses
      join the charms — **default · today · prioritise · tasks · un-hide
      all** — plus a **padlock** and an **eye** on every tile. They are
      their own control family, not pebbles (§11e), and they belong to
      the home screen alone. **One sub-task per session, in this
      order** — each one is visible on screen the day it lands, and the
      last one saves what the others make. Kimia eyeballs every look
      before it settles (the T5.2c rule): smallest visible piece first,
      never a finished system.
  - [x] **T6.23a Muting — the eye on every tile.** _(2026-08-21)_
  - [ ] **T6.23b The `today` lens.** Keep what applies today; mute to
        the bottom what could (N-per-week, whenever, one-time tasks —
        including an N-per-week already at its number); hide the rest.
        Pure schedule logic, so it lands in `src/game/` as functions
        over a habit and a day key, tested there. This is the task that
        first makes something HIDDEN, so it also brings the general
        no-dragging-while-anything-is-hidden rule (design-notes §12a)
        and the **un-hide all** lens that escapes it.
  - [ ] **T6.23c The `prioritise` lens.** A stable three-tier sort —
        applies today · applies this week · everything else. _Done
        when:_ a test proves two habits of the same tier keep the order
        they were in, which is the whole point of "stable" and the thing
        Kimia asked for by name.
  - [ ] **T6.23d The `tasks` lens.** The four-press cycle over one-time
        to-dos: top · bottom and muted · hidden · off. "Off" un-hides
        and un-dims where they stand and restores no earlier position —
        the scattered-tasks scenario in the decisions log is the test to
        write.
  - [ ] **T6.23e The default view, the padlock and design mode.** The
        saved arrangement — order + charms + mutings, and only those —
        restored by the **default** lens, by a refresh and by the new
        day. Dragging becomes always-temporary; only design mode writes
        an order down. Design mode: the confirm pop-up, the glowing
        window edge, the pulsing padlock, the stripped screen, the inert
        tiles, mute-instead-of-hide, and the two exits. Absorbs T6.11
        whole, including its persistence tier — the charms and mutings
        live under their own localStorage key OUTSIDE the versioned
        envelope (never in a backup file, never restored by an import,
        cleared by BOTH new-game doors), and a missing or junk value
        reads as "no default", never a crash.
        **Settle with Kimia before building:** the default ORDER cannot
        live there, because the order already lives inside the envelope
        as the habits array and rides along in backups. Proposal — leave
        it exactly where it is, so a restored backup brings your order
        back but not your charm-and-mute defaults, which describe a
        browser rather than a record. Also to settle: a mute pointing at
        a habit that has since been deleted must read as no mute.

## M7 — Two devices (sync) (5–6 sessions)

Planned 2026-08-17. Spec §8 holds the architecture; decisions in
history.md. **Built BEFORE the phone, deliberately** — a phone cannot
create habits, so a phone-first milestone has no data to test with,
while sync is testable on two desktop browsers on one laptop with no
phone involved. Ships **dormant**: nobody is affected until a pairing
code is issued by hand.

- [ ] **T7.1 The merge, as pure functions.** No network, no React —
      `src/sync/` gains the logic and nothing else, testable like
      `src/game/`. The field allowlist (habits, completions, flora
      decisions, purchases, world seed, day cutoff, `checkedInThrough`);
      everything outside it left to the local device, arrangements
      included. Completions union on their unique ids;
      `checkedInThrough` takes the later day. **The merge must be
      idempotent and the test must say so** — merging twice gives what
      merging once gave, or two devices correct each other forever. No
      schema bump: the envelope does not change (see the 2026-08-17
      refinement in history.md).
- [ ] **T7.2 Encryption on the device.** The pairing code doubles as the
      key; Web Crypto, no library. Encrypt before anything leaves,
      decrypt on arrival, so the host only ever holds ciphertext.
      Round-trip tests, plus the ugly cases: wrong code, truncated
      blob, junk — each must fail cleanly and never destroy local data.
- [ ] **T7.3 The host and its endpoint.** **Decide Cloudflare Worker+KV
      vs each user's own Dropbox/Drive here** (left open on purpose —
      spec §8). Read and update-existing ONLY: no public create, so a
      slot exists only because Kimia made one by hand. Rate limit per
      code and per IP, write size cap, per-code daily write cap, and an
      **off switch that works without a deploy** (GitHub Pages takes
      minutes; a burning quota does not wait). Write the one-line
      runbook for issuing a code, since that is the whole approval gate.
- [ ] **T7.4 The sync module — the only thing that touches the
      network.** The sibling of CLAUDE.md's one-storage-module rule.
      Local-first: load from `localStorage` and render instantly as
      today, fetch afterwards, never block on the network. Then every
      layer-1 and layer-2 guard from spec §8 — content-change guard
      (send only if the bytes moved), one request in flight, no polling
      timers (open / focus / debounced-save only), one tab syncs via Web
      Locks, hourly request budget that trips and simply stops, backoff
      with a ceiling, debounce and coalesce. **The three that matter
      most if anything gets cut: content-change guard, hourly budget,
      and the "run the cycle twice, expect zero requests" test.**
- [ ] **T7.5 Pairing, unpair, and the quiet line.** The settings row,
      the code entry, the QR the phone will scan (address + code in one,
      stripped from the address bar as it is read). Unpair deletes the
      remote copy. Status line follows the backup-age tone rule — a dim
      fact, no spinner, no alarm colour, no counting of neglect
      (design-notes §14).
- [ ] **T7.6 Canary, then the docs.** Run it on two desktop browsers for
      a fortnight before a second code is ever issued. **README's
      "No backend" line stops being true when this ships** — rewrite the
      Status section and that bullet in the same session (CLAUDE.md's
      doc-sync rule (c)), to something honest: no backend by default,
      optional two-device sync, encrypted before it leaves.

## M8 — Habitat on a phone (7+ sessions, collaborative)

Planned 2026-08-17. Scope in spec §5b, feel in design-notes §14.
Depends on M7. **The width gate is the feature flag** — nothing below
740px renders today, so every task here ships to the live site unseen
and softening the gate is the deliberate last one.

- [ ] **T8.1 The fork.** Below 740px, render a phone shell instead of
      the blocked message; 740px and up unchanged, so a portrait tablet
      still gets the full Habitat. Gate stays in place for real users
      until T8.9 — this task only builds the road.
- [ ] **T8.2 Today, on a phone.** The habit list, +1/done only, and the
      charm lens. No creating, editing, archiving, deleting,
      re-ordering or −1 — and no control for any of them, so nothing is
      hunted for. The easy page: phones are good at vertical lists.
- [ ] **T8.3 The morning check-in, yesterday only.** Must still be
      answered; the optional older days stay on the laptop.
- [ ] **T8.4 The meters and the drop reveals.** The first of the juice,
      and the proof that "all the juice on mobile" can hold — reveals
      are the POP moments and they have never had to work small.
- [ ] **T8.5–T8.8 One spatial page per design slice.** Abode (touch
      arrange, its own per-device layout), Bookcase, Map, Market, Guest
      Book, cameos — in whatever order Kimia wants, art-directed live,
      one visible change at a time. Touch dragging starts most of the
      way there: the existing drag is Pointer Events and
      `touch-action: none` is already set, so the work is finger-sized
      targets and affordances that do not need hover. **A page that
      cannot stay calm on a phone does not ship** — that is the whole
      reason these are slices and not a spec.
- [ ] **T8.9 Soften the gate.** The last task, on purpose. Update spec
      §3's device stance and README's Status in the same session.

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
