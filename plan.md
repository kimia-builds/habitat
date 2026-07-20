# plan.md — HABITAT build plan

_v1.25 — 2026-07-20 (fourteenth session). **T4.4 built**: the Guest
Book + friendships. Literacy milestones open doors; a category's first
friend arrives 1–5 seeded days later, repeats every 20–50 seeded days
(Kimia's call — categories refill), riding taps like every drop. Every
arrival is a neon reveal with the category's signature animation; the
Guest Book's popup card carries her re-readable card-text slot. Party
mode shipped whole here (T4.5 was to ship the greyed toggle): "not
yet" until the first friend, then friends simply present among the
flora in an unseeded, unstored formation. Kimia's calls today:
repeats allowed, draft category names until T6.1, cameos DEFERRED to
the new **T4.6** — and redecided: they celebrate big wins (a big day,
a record streak, a lived-day milestone) with the animation plus a
short message she'll write. Storage v8 (friend drops). Spec v1.26.
Next task: **T4.5**._

_v1.24 — 2026-07-20 (thirteenth session). **T4.3b built**: the Market
page — the rotating stall. Four curiosities on offer, sliding four
further along the pool every 28 lived days; the pool grows with each
discovered region (3 objects each, priced 6 / 12 / 18 until T6.1);
everything cycles back, provably tested. Kimia's calls today:
duplicates allowed (buying never takes an object off the stall; each
copy is its own instance), selling from the Abode compost-style with
the button reading "sell", the refund announced like a fungus drop,
and generic "a curiosity" objects with seeded code-drawn art. Storage
v7 (purchases). Spec v1.25. Next task: **T4.4**._

_v1.23 — 2026-07-20 (twelfth session, docs only). A UX, copy and design
pass decided with Kimia — no code today. New task **T4.5** (page
renames, the left icon rail, the date display, icon-only actions, -1,
the check-in pop-up, and the inactive party-mode toggle); the startup
animation folded into **T5.2**, the live Guest Book and party mode into
**T4.4**. Kimia's calls: real calendar date with a 3am note rather than
the Habitat day, meters stay clickable alongside the rail, "readers
library" with no apostrophe, "edit past days" kept over "edit past
habits", and the filter hover reads "filter view" — not "by type",
which would have made categories of the six symbols. Two further calls
this session: the word **"cron" is retired** app-wide in favour of
**lived day**, and the friend signature animations are pinned to three
moments (reveal, the Guest Book card, rare home-screen cameos) —
never party mode. Spec v1.24, design-notes v1.7. Next task: **T4.3b**._

_v1.22 — 2026-07-20 (eleventh session). **T4.3 built**: the Abode
proper. Open ground under sky — no walls, a faint horizon, bare with
no prose when empty (the constant-bookshelf precedent) — with every
gathered flora a floating, draggable sprig: arrange them anywhere
(sky included; gravity is not guaranteed here), each place remembered
per find in storage v6 and pruned by compost or undo. A click holds a
flora — a touch larger, named — revealing its quiet compost button.
Kimia's calls today: open ground over a room, the waiting-to-decide
list kept apart above the ground, compost behind the click-to-hold,
and no found dates anywhere on the page. Purchased objects join the
same ground in T4.3b. Next task: **T4.3b**._

_v1.21 — 2026-07-19 (tenth session, copy pass after T4.2). Kimia's
call: the meters are renamed — **steps taken**, **literacy level**,
**wallet balance** — and their under-captions are gone (no step total,
no door count, no "in the wallet"); the field notes' self-description
and the graphs caption came out too. Bar maths untouched; tests
updated. Next task: **T4.3**._

_v1.20 — 2026-07-19 (tenth session). **T4.2 built**: the Bookcase page.
One constant bookshelf — bare shelves, no prose, no count when empty —
with every publication a floating, draggable book: arrange them
anywhere, click one to stand it face-out, and the cover's quiet eye
opens the T3.5 spread. Kimia's calls today: the constant shelf with
free drag arrangement, spine ↔ front with the eye-read button (both
remembered per book, storage v5), code-drawn violet placeholder books
until T5.3, and NO found dates — on the books or on the Map (their
tooltips came out). Undo a dropping completion and the book leaves the
shelf, place and all. Next task: **T4.3**._

_v1.19 — 2026-07-19 (ninth session). **T4.1 built**: the Map page.
The planet shows as a faint outline from day one; its 16 equal
regions (the landing site, a ring of 5, a ring of 10 — discovery
radiating outward) light up as the expedition steps into them, each
a seeded generative shape glowing in its own colour until T5.3's art,
offering only its discovery date until T6.1's names. Kimia's calls
today: 16 equal regions, faint outline, generative placeholder
shapes, landmark plumbing only (tested, invisible until T6.1 picks
the species). 16 blank region narration slots added to her file.
Next task: **T4.2**._

_v1.18 — 2026-07-19 (eighth session). **T3.5 built**: read now / read
later + the spread popup. A held reading arrival offers the choice for
all three types; read now opens the quiet pastel popup, read later
lets the arrival go; the Bookcase stub became an early list (like the
T3.3 Abode) where everything received is re-readable. Kimia's calls
today: the popup's empty-state words are a **narration slot** (hers —
blank shows just the publication and the close button), closing the
popup lets the arrival go, and no placeholder images — every popup
shows the empty state until T6.1 names the publications and spreads
exist (`src/content/spreads.js`, her file, keys image to publication).
Nothing about reading is ever stored. Next task: **T4.1**._

_v1.17 — 2026-07-19 (seventh session). **T3.4 built**: narration
content slots — one keyed file (`src/content/narration.js`) Kimia
edits directly. The five T3.2 reveals read title AND line from slots
(titles too — Kimia's call today); an empty slot renders nothing (the
pop-up keeps its glyph and button — no marker, nothing invented);
sections for friend intros / map regions / literacy eras sit ready,
their slots added when those features are built. Next task: **T3.5**._

_v1.16 — 2026-07-19 (sixth session, docs addition). Added **T3.5**
(read now / read later + the spread popup — drop-choice symmetry with
flora; spec v1.17 + design-notes §5/§7). Next task: **T3.4**._

_v1.15 — 2026-07-19 (sixth session). **T3.3 built**: gather / decline /
compost. A held flora arrival offers gather / leave it; undecided
flora wait on the new early Abode page (linked from the habit list),
where gathered flora can be composted anytime. Kimia's calls today:
undecided flora wait (never auto-left), the early Abode now rather
than mechanics-only, flora stay generic until T6.1. Storage v4
(floraDecisions). Next task: **T3.4**._

_v1.14 — 2026-07-19 (fifth session, docs only). Visual identity
decided from Kimia's charm reference: T5.1 is now the six charms
(crown, cherries, shell, anchor, shield, key — SVGs + colours in
design-notes §11a); T5.2 carries the palette + typography system
(design-notes §11b/§11c). No code this session. Next task: **T3.3**._

_v1.13 — 2026-07-19 (fourth session). **T3.2b built**: every
repeating shape's row is now a counter with an unlimited +1 and a
quiet undo, on the habit list and the check-in alike (N-per-week and
whenever show a plain count — Kimia's call today). Earlier the same
session: merged **design-notes.md** (the feel layer — read alongside
spec.md before design-adjacent tasks), added **T3.4** (narration
content slots); feel enhancements to built surfaces land in **T5.2**.
Next task: **T3.3**._

_v1.11 — 2026-07-19 (third session, docs only). Added **T3.2b**
(unlimited tap counter for every shape — decisions in spec v1.13)._

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

- [x] **T0.1 Repo + scaffold + first deploy.** _(done 2026-07-12)_
      Create public GitHub repo `habitat`. Scaffold Vite + React + Vitest +
      ESLint/Prettier. Write CLAUDE.md (project rules for AI sessions) and
      a README (portfolio-facing). Set up GitHub Actions to auto-deploy to
      GitHub Pages on every push.
      _Done when:_ a near-empty dark page saying **HABITAT** is live at our
      public URL, and `npm test` runs (even with one dummy test).

## M1 — Walking skeleton (4 sessions) → we start using it daily

- [x] **T1.1 Habit data layer.** _(done 2026-07-12)_
      Habit model (name, description, symbol 1–6, difficulty, schedule) +
      localStorage persistence + JSON export/import.
      _Done when:_ tests prove habits survive a page reload and a full
      export→wipe→import round trip.
- [x] **T1.2 Day & schedule engine.** _(done 2026-07-13)_ ⚠️ riskiest
      logic in the app
      Day cutoff (3am default, configurable), "which day does this
      completion belong to", schedule types (daily / specific weekdays /
      N-per-week / N-per-day / whenever / one-time), streak counting.
      _Done when:_ a thorough test suite passes, including: completion at
      1am → yesterday; completion at 9am → today; cutoff change doesn't
      corrupt history.
- [x] **T1.3 Habit list UI (ugly on purpose).** _(done 2026-07-13)_
      Create, edit, archive habits; tap to complete today; the 6 symbols as
      plain placeholders. Filter the list by symbols (multi-select, resets
      each visit); re-order habits manually (order persists). Import warns
      before overwriting existing data (storage's `hasData()`).
      Dark background, zero styling effort otherwise.
      _Done when:_ we can run our real habits in it for a day.
- [x] **T1.4 Morning check-in.** _(done 2026-07-14)_
      On first visit after a missed scheduled day: "mark what you completed
      yesterday" — always the actual calendar yesterday, and it must be
      answered — plus **optional backfill** for other days in the window
      (spec v1.5): days of the current Mon–Sun week stay editable until the
      week ends, then freeze; yesterday is always editable even across the
      week boundary. Marks recorded against the day they were DONE, not
      entered. Unfilled days simply count as not done (neutral) — no
      separate "no data" state.
      _Done when:_ tests prove Monday-morning marks land on Sunday; backfill
      marks land on their true days; the window is enforced (Sunday can
      still edit Tuesday, Monday cannot edit Saturday) across cutoff edge
      cases, multi-day gaps, and week boundaries.

**Milestone gate:** from here, Kimia uses Habitat daily as her real
tracker. Everything after this is delight, informed by real use.

## M2 — Meters & field notes (4 sessions)

- [x] **T2.1 Meter engine.** _(done 2026-07-15)_
      Expedition meter: fixed advance per completion — same step for every
      difficulty (1:1:1, decision 2026-07-15; supersedes "by difficulty").
      Literacy meter: fed by reading material (engine only, drops come in
      M3). Fungus meter: a wallet — credited by fungus drops, debited by
      purchases, refunded symmetrically on returns (engine only). Growth
      meters sized for ~5 years (constants file).
      _Done when:_ tests verify advance amounts, wallet arithmetic
      (buy/return symmetry, never negative), and 5-year pacing maths is
      documented in the constants file.
- [x] **T2.2 Meters UI.** _(done 2026-07-16)_
      All three meters permanently at top; clickable (Map/Bookcase/Market
      stubs for now). First styling pass: white/pastel/basic text on dark.
      _Done when:_ meters visibly move when we complete habits.
- [x] **T2.3 Field notes (weekly view).** _(done 2026-07-16)_
      Browsable Mon–Sun weeks (default: last completed; current week
      marked "still unfolding"), notable streaks only, one-time to-dos
      under "tasks completed", Sunday first-visit auto-open after the
      check-in. Field-notes tone, not a dashboard — no "patterns"
      (dropped). Under the hood: schedule edits became date-stamped
      history, so streaks judge each day by the schedule in force THEN
      (never retroactive); switching day-counted ↔ week-counted schedules
      restarts the streak, with a warning before saving.
      _Done when:_ last week's real usage data renders correctly.
- [x] **T2.4 Habit line graphs (in the field notes).** _(done 2026-07-18)_
      One collapsible graph per habit: raw completion counts over time,
      neutral data unrelated to the goal. Zoom levels day / week / 4-week,
      each unlocked purely by the habit's age (3 days / 3 weeks / 12
      weeks — never by completions; a flat zero line is fine). No graphs
      for one-time to-dos; archived habits' graphs freeze at the archive
      day. SVG, code-drawn (spec §7). Full rule in spec §10 (2026-07-16).
      _Done when:_ graph tests pass (unlock ages, archive freeze, counts
      per bucket) and real usage data draws sane lines at all three zooms.

## M3 — Drops engine (3 sessions)

- [x] **T3.1 Drop engine.** _(done 2026-07-19)_
      Three drop types: flora finds tied to expedition progress (steady);
      reading material (rarer, surprising: magazines > novels >
      dictionaries); fungi (occasional, currency). Difficulty shifts odds;
      no front-loading — flat pacing for a patient daily user. All rates in
      constants file.
      _Done when:_ simulation test over 5 simulated years shows sane totals
      for all three types (no droughts of months, no floods; fungus income
      supports a reasonable purchase rhythm).
- [x] **T3.2 Drop arrival + first-occurrence reveals.** _(done 2026-07-19)_
      One shared arrival mechanic; distinct first-time reveal per reward
      type (first flora, first magazine, first fungus...). Neon POP
      reserved for these moments.
      _Done when:_ first flora and first magazine reveals feel different
      and special (manual playtest).
      Built: world seed created at first run/upgrade (storage v3); drops
      rolled at tap time and stored on completions (undo takes them back);
      literacy + fungus meters now fed from real drops; arrival shelf +
      quiet by-the-habit notes; five neon first reveals; check-in drops
      deferred to its done button. Playtested in the browser: fungi,
      flora and novel reveals all POP distinctly; identical redo returns
      identical drops.
- [x] **T3.2b Unlimited tap counter for every shape.** _(done
      2026-07-19; decided same day — see spec §4.1 + decisions log)_
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
      _Done when:_ tests prove extra taps are stored on the right day for
      every shape, meters and drops count every tap, and fulfilment
      thresholds are unchanged; a real day's use feels right.
- [x] **T3.3 Gather / decline / compost.** _(done 2026-07-19)_
      Flora optional to gather, compostable anytime, composted flora
      re-enter the pool (composting yields nothing). Reading material
      always kept; fungi always banked.
      _Done when:_ tests prove composted flora can reappear and yield no
      fungi; nothing is ever lost.
      Built: flora decisions module (pending / gathered / left /
      composted, derived from history like the meters — undo removes a
      find and its decision together); gather / leave it on the held
      arrival; undecided flora wait on the new early Abode page (linked
      from the habit list) with gathered flora and their quiet compost
      buttons; storage v4 carries the decisions map through backups.
      Tests cover the two guarantees: composting credits nothing, and
      finds keep arriving whatever was decided.
- [x] **T3.4 Narration content slots.** _(done 2026-07-19; decided
      2026-07-19, spec v1.14 + design-notes §7)_
      A keyed content file with one empty slot per narrated moment
      (first-occurrence reveals, friend intros, map regions, literacy
      eras). Slots ship blank (`TODO: written by Kimia`); the app renders
      gracefully when a slot is empty and never invents copy. Convert the
      five built T3.2 reveals to slots — their current text stays only as
      a marked placeholder until Kimia writes the real words. Narration is
      momentary: shown once, never stored or re-readable.
      _Done when:_ tests prove empty slots render gracefully; the five
      reveals read from slots; Kimia can fill a slot by editing one file.
      Built: `src/content/narration.js` — the keyed content file with the
      lookup helper; reveal titles are slots too (every word on that
      screen is Kimia's); an empty slot renders nothing (glyph + button
      stay, no marker); labelled sections wait for friend intros, map
      regions and literacy eras. Verified in the browser: the first-fungi
      reveal pops reading its words from the file.
- [x] **T3.5 Read now / read later + the spread popup.** _(done
      2026-07-19; decided 2026-07-19, sixth session — spec v1.17,
      design-notes §5/§7)_
      Drop-choice symmetry: a held reading arrival offers **read now /
      read later**, mirroring flora's gather / leave it (fungi stay
      choice-free — currency has only exchange value). Read now opens a
      popup: a **double-page spread of the publication**, an image Kimia
      provides (photo/scan/collage — never AI-generated, and only images
      she may publish in the public repo), keyed one-per-publication to
      the T6.1 pools with a graceful empty state until a spread exists.
      Read later just lets the arrival go — the piece is in the Bookcase
      regardless, and any publication is re-readable from there anytime
      (an early simple list on the Bookcase stub, like the Abode got in
      T3.3; the real shelves in T4.2 reuse the same popup). NO read/unread
      tracking anywhere — nothing stored, nothing nagging.
      _Done when:_ the choice shows for all three reading types; the popup
      shows a slotted image or the empty state; publications open from the
      Bookcase; tests cover slot lookup, empty state, and that no reading
      decision is ever written to storage.
      Built: `src/content/spreads.js` (Kimia's file — keys each T6.1
      publication to an image in `public/spreads/`); the quiet pastel
      popup with its empty state (glyph + name + close; the empty-state
      words are a narration slot, blank until Kimia writes them); read
      now / read later on held reading arrivals (closing the popup lets
      the arrival go); the early Bookcase list. Tests prove the choice
      for all three types, the empty state inventing nothing, and that
      reading stores not a byte. Verified in the browser.

## M4 — The world of N-Z-D (5 sessions)

- [x] **T4.1 Map page** _(done 2026-07-19)_ — planet revealed region
      by region with expedition progress. SVG, dark + bioluminescent.
      Includes **landmark flora** (spec 2026-07-19): large tree-like flora
      appear permanently on the Map when they drop, in the region their
      expedition step falls in (gathering takes a cutting, never the
      tree — see spec §5 Stream 1).
      Built: 16 equal regions of 400 steps (constants + pacing maths);
      `game/map.js` — region maths, discovery days and landmark markers,
      all derived from completion history so undo reverses everything by
      itself; the Map page with the always-faint planet silhouette and
      seeded generative region shapes (`ui/mapLayout.js`, placeholders
      until T5.3), known regions glowing with the frontier brightest,
      discovery dates as quiet tooltips; landmark plumbing tested but
      invisible until T6.1 picks the species; 16 blank `mapRegions`
      narration slots (their discovery moment plays with T5.2's swell).
- [x] **T4.2 Bookcase page** _(done 2026-07-19)_ — shelves filling with
      every magazine, novel, dictionary ever received; every publication
      opens its double-page spread via the T3.5 popup (re-readable anytime,
      no read/unread tracking).
      Built: ONE CONSTANT BOOKSHELF (Kimia's decision) — bare shelves, no
      prose, no count when empty; publications as floating draggable books
      arranged anywhere, each standing spine or face-out with a quiet eye
      read button, place AND facing remembered per book (storage v5,
      `game/bookcase.js` + `bookcaseLayout`, pruned on undo like flora
      decisions); code-drawn violet placeholder books (slim magazine,
      middling novel, thick dictionary) until T5.3, generic until T6.1;
      un-arranged books fill default slots top-shelf-first; found dates
      removed from the Bookcase AND the Map's tooltips. Tests cover the
      layout maths, storage upgrade, click/drag/eye flows, and that
      reading still stores nothing.
- [x] **T4.3 Abode page** _(done 2026-07-20)_ — gathered flora and
      purchased objects placeable by drag, movable, removable (compost /
      return). Play, not inventory management.
      Built: open ground under sky (`game/abode.js` + storage v6's
      `abodeLayout`, the bookcase pattern: fractions of the scene, keyed
      by the dropping completion, entries only for moved flora, pruned on
      compost/undo/import); drag anywhere, click to hold — the held flora
      grows a touch, shows its name and a quiet compost button; the
      waiting-to-decide list stays apart above the ground; no found
      dates, no empty-state prose. Purchased objects join in T4.3b.
- [x] **T4.3b Market page** _(done 2026-07-20)_ — the rotating stall. Small selection,
      rotates every 28 lived days (a lived day = a day with ≥1 habit marked,
      including retroactive marks — derivable from completion history, so
      nothing earlier needs rebuilding; never calendar days); pool grows
      as Map regions are discovered; everything eventually cycles back.
      Buy (meter down by price) and return (meter up by exactly the same
      price).
      _Done when:_ rotation tests pass (gap days don't advance the clock;
      backfilled days count; no item permanently missable) and buy/return
      round-trips are always fungus-neutral.
      Built: `game/market.js` — lived-day counting, the rotation clock,
      the region-fed pool and the sliding stall window (4 on offer, 3 per
      region, ⌈pool/4⌉ rotations to see everything again — all tested);
      buy/sell with the price frozen at buy time, the wallet always
      derived (drops − owned): it shows nothing below zero, but debt from
      undoing spent fungi stays real under the hood, settled first by
      later income and refunds (Kimia's correction, same day). Storage v7's
      `purchases` list. The Market page: seeded curiosity art
      (`ui/ObjectGlyph.jsx`, four forms × a pastel hue from the seed),
      quiet prices, dimmed buy when the wallet can't reach, "×n at home"
      for owned copies (duplicates allowed — Kimia's call). Owned objects
      share the Abode's ground and its drag/hold patterns: hold reveals
      the quiet **sell** button (her word), the refund arriving like a
      fungus drop. The stub page is gone — the Market was the last one.
- [x] **T4.4 Guest Book + friendships.** _(done 2026-07-20)_
      Literacy milestones open doors; friends arrive as surprise drops in
      the following days (delay logic tested). 10 categories per spec.
      Titled **local community**, reached from the rail's community icon
      (its T4.5 stub becomes the real page here). Clicking a character
      opens a **popup card**: art, name, **card text**, and the signature
      category animation playing. The card text is a **second narration
      slot per friend** (`src/content/narration.js`) — separate from the
      momentary arrival narration, re-readable any time, blank until Kimia
      writes it, rendering nothing when empty (spec §5, design-notes §7).
      The signature animation plays in **three moments only** — arrival
      reveal, this card, and rare home-screen cameos (design-notes §8).
      Also activates the Abode's **party mode** (T4.5 ships the toggle
      greyed out): friends pop up among the flora in a randomised
      formation, not draggable, not remembered, re-rolled by a refresh —
      the flora arrangement untouched and still draggable, and **friends do
      not perform their animation here** (spec §5b, design-notes §12e).
      _Done when:_ delay logic tests pass; the Guest Book renders friends
      and their cards; an empty card text renders nothing while art, name
      and animation still show; the arrival narration is never re-readable
      anywhere; party mode ungreys the moment the first friend exists,
      re-rolls its formation on refresh, runs no signature animation,
      stores nothing, and leaves the abode layout byte-identical.
      Built: `game/friends.js` — doors derived from reading history,
      the first friend due 1–5 seeded days after the door opens,
      repeats every 20–50 seeded days after the previous arrival
      (repeats allowed — Kimia's call), one friend per tap,
      earliest-due first, stored on the completion like every drop;
      draft category names ("a Drifter") from constants until T6.1.
      Every arrival a neon FriendReveal (intro words from the new
      `friendIntros` slots, played at the category's FIRST arrival
      only); the Guest Book page (bare until a friend exists) with its
      quiet popup card (`friendCards` slots, blank renders nothing);
      the party toggle shipped whole — T4.4 landed before T4.5 —
      greyed "not yet" with zero friends, then an unseeded re-rollable
      formation, never stored, never performing. Storage v8 gates the
      friend drop kind. Delay logic, undo re-derivation, card,
      empty-slot and party tests all pass.
- [ ] **T4.5 UX, copy & navigation pass** _(decided 2026-07-20, twelfth
      session — spec v1.24 §5b, design-notes §12)_
      A pass over surfaces already built (T1.3, T2.2, T4.1–T4.3), plus the
      plumbing for two things that come alive later. No game logic changes
      anywhere — meters, drops, dates and schedules are untouched.
  1. **Page renames** (copy only; internal names unchanged): the Map →
     **map of N-Z-D**, the Bookcase → **readers library** (no
     apostrophe), the Market → **local market**, the Abode → **your
     abode**, the Guest Book → **local community**.
  2. **The left icon rail** — five icons descending the left edge of
     the home screen, away from the habit list: **map · abode ·
     community · library · market**, each revealing its name on hover.
     Community leads to the Guest Book (real since T4.4). The meters
     stay clickable as well.
  3. **The date display** — large and letterspaced
     (`M O N D A Y   2 0   J U L   2 0 2 6`) beneath the meters, above
     the charms. **Real calendar date.** Between midnight and the
     configured cutoff only, a quiet line beneath: "your habits will
     switch to a new day at 3 a.m."
  4. **Icon-only actions, hover to reveal** — habit row: pencil
     ("edit"), archive box ("archive"); archived habit: trash ("delete
     forever"); the charm filter's hover reads **"filter view"** (not
     "by type" — the symbols are never categories, spec §4.1). Three
     discreet buttons at the foot of the habit list, above the archived
     list: **+** ("add new habit"), pencil ("edit past days"), graph
     ("view historical data").
  5. **Undo becomes `-1`** on habit rows and in the check-in; the
     counts drop the word "today" (`2/1 today` → `2/1`).
  6. **The check-in becomes a pop-up** layered over a dimmed habit
     list, rather than a page that replaces it. Its §4.2 rules are
     untouched — yesterday must be answered, the done button is the
     only exit, no meters.
  7. **The Abode's quiet / party mode toggle** — _already shipped live
     with T4.4_ (the fourteenth session landed before this one): the
     switch with an icon either side, greyed "not yet" with zero
     friends and party mode working with the first. Nothing left to do
     here beyond the pass's styling of it.
  8. **Startup plumbing** — detect the first visit of each Habitat day
     (after the 3am cutoff, regardless of whether a check-in was owed)
     and sequence it correctly: check-in pop-up → startup → Sunday
     field notes. The animation itself is T5.2; T4.5 can hold the slot
     with a plain fade.
     _Done when:_ tests prove the day-first-visit detection fires once per
     Habitat day across cutoff and timezone edge cases (and independently
     of whether a check-in was owed), the sequence order holds on a Sunday
     with a check-in owed, the 3am note appears only between midnight and
     the cutoff and tracks a changed cutoff setting, every icon exposes
     its hover label to assistive tech, and party mode stays inert with
     zero friends. A real day's use feels calmer, not more cryptic.
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
- If a session stalls twice on the same bug: stop, commit what works,
  bring it to a fresh session with fresh context.
