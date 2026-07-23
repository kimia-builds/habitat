# history.md — HABITAT audit trail

_Split out of spec.md, plan.md and design-notes.md on 2026-07-21 (docs
housekeeping, sixteenth session) so that session-start reading stays
light. This file is the project's memory — how every rule came to be.
It is NEVER session-start reading: open it only when a task needs the
story behind a rule, or to append to it._

How to append (the end-of-session rule, also in CLAUDE.md):

- Each new product decision gets ONE dated entry in the decisions log
  below — and the current rule is folded into the spec.md /
  design-notes.md section it changes. No other copies.
- When a plan.md task completes, its full build notes are appended to
  the bottom section here; the plan keeps a one-line ticked checkbox.

## Decisions log (formerly spec.md §10)

- 2026-07-12: schedule shapes include N-per-day (N≥2; each completion
  counts, day fulfilled at N; extras kept).
- 2026-07-12: habit list manually re-orderable (persists) and
  filterable by symbols (temporary, resets each visit).
- 2026-07-12: backup import replaces all data (no merge); app warns
  first if existing data would be overwritten.
- 2026-07-12: habits can be archived (history kept) or permanently
  deleted.
- 2026-07-13: one-time schedule shape (to-do): completing it archives
  it; same-day undo un-archives it.
- 2026-07-13: N-per-week fulfilled by N distinct fulfilled days, not N
  raw completions.
- 2026-07-13: "whenever" and one-time habits have no streak (null —
  no expectation, no pressure).
- 2026-07-14: third reward stream added (fungi currency + Market);
  expedition drops changed to flora; check-in backfill defined (see
  entries below).
- App name: **Habitat**. Planet name: **N-Z-D**.
- Framing: ethical immigration, not exploration/settlement.
- 10 friend categories on a sliding literacy scale (draft ladder in 5).
- One unified habit type; 6 abstract symbols, no word labels ever (the
  symbol is the tag); difficulty easy/medium/difficult.
- Three reward streams, independent in earning: expedition (flora),
  literacy (reading → friends), fungi (currency → objects).
- Expedition meter fully predictable; reading drops rare and surprising;
  fungi drop occasionally on completions.
- Expedition drops are **flora** (gather/grow or compost); composting
  yields nothing. Objects are **purchased at the Market**, never
  dropped.
- Fungus meter is a wallet (rises with drops, falls with purchases);
  clicking it opens the Market.
- Market: rotating stall, rotation every 28 lived days (not
  calendar days); pool grows with region discovery; everything cycles
  back eventually — nothing is permanently missable.
- Symmetric buy/return prices always — no penalty, no spread.
- Flora and objects optional to collect and always returnable — no
  forced clutter.
- 2026-07-14 (supersedes the "no data" idea from earlier the same day):
  there is no "no data" state — an unfilled day simply counts as not
  done (neutral, as ever). Backfill window: days of the current Mon–Sun
  week stay editable until the week ends, then freeze. Calendar
  yesterday is always editable (Monday can fill in Sunday). The
  check-in about yesterday must be answered; older days are optional.
- 2026-07-14: only an unresolved yesterday triggers the check-in —
  older editable days never nag on their own (optional means optional);
  they are offered inside the open check-in and via "edit past days".
- 2026-07-15: day rollover needs no refresh — an open tab re-checks
  the clock every minute and on returning to the tab, then behaves
  exactly like a fresh visit (new day's list, check-in if owed).
- 2026-07-15 (T2.1, supersedes "difficulty determines meter advance"):
  difficulty does NOT affect the expedition meter — every completion is
  exactly one step (1:1:1). Difficulty stays on habits for future use
  (e.g. drop odds in M3).
- 2026-07-15: undoing a completion reverses the expedition meter by the
  same amount — meters are always computed from completion history,
  never stored as a running number, so the meter exactly equals real
  history at all times.
- 2026-07-15: for N-per-day habits, completions beyond N also advance
  the expedition meter — every tap counts.
- 2026-07-15: pacing constants (e.g. the taps-per-day estimate behind
  the 5-year sizing) get recalibrated roughly every 6 months against
  real historical averages (plan T6.2). Safe because meters are derived
  from history, so retuning never corrupts earned progress.
- 2026-07-16 (T2.2): the expedition meter's bar is a ROLLING bar — a
  full 5-year bar would move invisibly per tap, so the bar fills over
  one segment (100 steps ≈ a month at the current pace, constant in
  constants.js), rolls over to empty, and the running step total shows
  beside it. The literacy bar shows progress from the last friendship
  milestone toward the next; the fungus meter is a plain balance (a
  wallet has no progress bar).
- 2026-07-16 (T2.2): until the real pages arrive in M4, clicking a
  meter opens a simple placeholder page (Map / Bookcase / Market) with
  a back button — the navigation is real, the content is a promise.
- 2026-07-16 (T2.2): meters show on the habit list and the pages
  reached from it, NOT above the morning check-in — answering
  yesterday stays distraction-free.
- 2026-07-16 (T2.2 amendment): the HABITAT header is the home link —
  clicking it from the Map, Bookcase or Market (or any future page)
  returns to the habit list. The one exception is the morning
  check-in, where the header stays a plain title: its done button
  remains the only way out, so yesterday always gets answered.
- 2026-07-16 (T2.3): **streaks judge each day by the schedule in force
  ON that day** — frequency changes are never retroactive. (Mon+Fri
  habit, done Monday; schedule changed Tuesday to Mondays only → the
  coming Friday can't break the streak. Without the edit, it would.
  Equally, a Friday already missed before the edit stays missed.)
  Schedule edits are therefore date-stamped: each habit keeps a
  schedule history. Edits made before 2026-07-16 were never recorded,
  so older days are judged by the current schedule — a one-time
  limitation that fades as new history accumulates.
- 2026-07-16 (T2.3): switching a schedule between the two streak
  counting units — day-counted (daily / weekdays / N-per-day) and
  week-counted (N-per-week) — restarts the streak at the switch; the
  app warns before saving such an edit. An N-per-week target changed
  mid-week judges that week by the n in force at the week's end.
- 2026-07-16 (T2.3): the field notes page — browsable Mon–Sun weeks
  (back to the first week Habitat ever saw, forward to the current
  week, marked "still unfolding"), opening on the last completed week.
  Rows show each habit's 7 days: ✓ / count for marks, a quiet dot for
  a concluded scheduled day left unmarked, blank where nothing was
  asked. "Patterns" dropped from the brief. Streaks appear only when
  notable (≥1) — a broken streak shows nothing, not a zero. One-time
  to-dos have no row; the week they were done lists them under "tasks
  completed". Archived habits keep their recorded weeks (up to the
  archive day); deleting a habit deletes its notes with it.
- 2026-07-16 (T2.3): the field notes open by themselves on the FIRST
  visit of each Sunday, right after any check-in; a link on the habit
  list reaches them any time. The page carries a short description of
  itself and a "back to habits" link.
- 2026-07-16 (designed in T2.3, built in T2.4): per-habit **line
  graphs** in the field notes — one collapsible graph per habit showing
  its raw completion counts over time ("frequency, unrelated to the
  goal" — streaks measure goal fulfilment; graphs are neutral data).
  X-axis zoom levels: day-by-day, week-by-week, 4-weeks-by-4-weeks.
  Each level unlocks purely by the habit's AGE — 3 days / 3 weeks /
  12 weeks of existing on the list — never by completions (a
  12-week-old habit with zero marks still graphs a flat zero line).
  One-time to-dos get no graph. An archived habit keeps its graph,
  frozen at the archive day.
- 2026-07-18 (T2.4): the graphs live in their OWN section at the foot
  of the field notes, below the week grid — every eligible habit as a
  collapsed row, unaffected by which week is on show (a graph is
  whole-life, not weekly). Archived habits appear too, marked; one-time
  to-dos don't.
- 2026-07-18 (T2.4): a graph's x-axis is the habit's ENTIRE life,
  squeezed to fit — nothing hidden, no scrolling; zooming out is the
  remedy when day-by-day gets crowded. It opens on the coarsest
  unlocked zoom (the whole shape at a glance; zoom in from there).
- 2026-07-18 (T2.4, filling in the spec's gaps): graph week buckets
  are the app's usual Mon–Sun weeks, and 4-week buckets count in
  groups of four from the habit's first week. Age counts inclusively —
  the creation day is day 1, so day-by-day unlocks on the habit's 3rd
  day; a younger habit's row shows a quiet "still settling in" line
  instead of a graph. Archiving freezes the age clock along with the
  graph.
- 2026-07-19 (T3.1): **flora finds are window-guaranteed** — every
  consecutive window of 25 expedition steps (≈ a week at the current
  pace) contains exactly one flora find, at a seeded random step
  inside the window. Steady as the plan asks (a drought is
  impossible; the longest wait is just under two windows) yet each
  find still lands as a surprise. Reading material and fungi stay
  plain per-tap chances — rare and surprising, nothing guaranteed.
- 2026-07-19 (T3.1): **difficulty nudges the chance-based drops** —
  reading material and fungi (easy ×0.9, medium ×1.0, difficult
  ×1.2; the future use difficulty was kept for on 2026-07-15). Flora
  are window-guaranteed, so difficulty doesn't apply to them. The
  nudge is modest by design: difficulty flavours luck, it never
  becomes a strategy.
- 2026-07-19 (T3.1): **fungus income targets ~1 mid-priced object per
  rotation** — ~0.15 fungi per tap ≈ 15 fungi per 28-lived-day rotation,
  so when M6 prices the Market, a mid-priced object should cost
  ≈ 10–12 fungi. Fungi arrive as small clusters of 1–3 (average 1.5);
  difficulty affects whether a cluster drops, never its size.
- 2026-07-19 (T3.1): **drops are seeded, never shuffled** — every
  roll is a pure function of a stored world seed plus the tap's
  stable facts (habit, day, tap-of-day, expedition step). Undoing a
  completion takes its drops back with it (fungi leave the wallet,
  reading leaves the bookcase); redoing the identical tap returns the
  identical drops — tap–untap–tap can never be a slot machine. The
  world seed is created once at first run (wired up in T3.2).
- 2026-07-19: **landmark flora** (Kimia's rule, for the Map in T4.1) —
  large tree-like flora are revealed on the Map once they drop,
  associated with the map region their expedition step falls in, and
  the marker is permanent (only undoing the dropping completion
  removes it). Gathering a landmark means taking a branch/fruit/leaf —
  a cutting for the Abode, compostable as usual — never the whole
  tree, which stays on the Map regardless. Applies only to the
  special large flora, not all flora; which species are landmarks is
  chosen in T6.1.
- 2026-07-19 (T3.2): **drops start fresh from the update** — the week
  of completions recorded before the drops engine went live produces
  NO retroactive drops (the storage upgrade marks them as having
  delivered nothing). No opening burst; closest to the no-front-loading
  rule. The world seed is created once, at first run or upgrade, and
  travels with backups so an import restores the same luck.
- 2026-07-19 (T3.2): **every completion stores its drops**, rolled at
  tap time. Undo removes the completion and its drops leave with it
  (wallet, bookcase and "firsts" all revert); no other tap's stored
  luck ever reshuffles. Whether a drop is a FIRST is derived from
  stored history — undo the only flora ever found and the next one
  counts as a first again, reveal and all.
- 2026-07-19 (T3.2): **how a drop arrives** — a quiet pastel note
  beside the habit that was tapped ("you came across …"), while the
  drop object itself (drawn, SVG) sits at the top of the page for a
  few seconds before fading away. Clicking the object HOLDS it and
  names it; clicking again lets it go. Richer click behaviour
  (gather / decline) arrives with T3.3.
- 2026-07-19 (T3.2): **check-in marks earn drops too** (undo/redo
  consistency demands it), but their arrivals wait for the check-in's
  done button — answering yesterday stays distraction-free. Everything
  earned arrives together, back on the list.
- 2026-07-19 (T3.2): **five first-occurrence reveals** — first flora,
  first magazine, first novel, first dictionary, first fungi. Each is
  its own full-screen neon POP moment (mint / violet / amber by
  stream), dismissed only by its own button; regular arrivals stay
  pastel and quiet.
- 2026-07-19 (third session, for plan T3.2b): **every repeating shape
  presents like N-per-day** — the habit row (and the check-in /
  backfill screens) shows a running count with an unlimited +1 and an
  undo, for daily, weekdays, N-per-week, N-per-day and whenever alike.
  Goals and streaks are judged exactly as before (daily fulfilled at
  1; N-per-week by distinct days); extras are simply recorded and
  kept. One-time keeps its single-tap control — the first tap
  finishes and archives it, as ever.
- 2026-07-19 (third session, for plan T3.2b): **every tap counts, for
  every shape** — generalises the 2026-07-15 N-per-day rule: taps
  beyond a day's goal advance the expedition meter and roll drops for
  all repeating shapes. Trust-based by design (one honest user; no
  interest in tap-farming).
- 2026-07-19 (fourth session, design-notes merge): **the feel layer
  lives in design-notes.md** — north star (encouragement, gym-gains
  calm), juice = timing/scale/colour/light only, weird > cute,
  soundless (no audio anywhere, ever), human-written story (Claude
  Code scaffolds empty keyed content slots, never writes narration).
- 2026-07-19 (fourth session): **drop arrival gets a star layer** —
  regular drops add a small, brief star-shimmer over the built quiet
  pastel arrival; the full firework (a burst of confetti-like stars
  that slowly fade) is reserved for the five first-occurrence reveals
  and friend arrivals. The middle path: quiet pacing kept, drops still
  feel special.
- 2026-07-19 (fourth session): **meters glow and thicken momentarily
  on movement** — each advance plays a momentary glow/thicken
  animation on the built T2.2 rolling bar, then fades straight back
  to the normal view; segment roll-over is the same treatment with a
  brighter celebratory pulse. The resting bar never changes; this is
  a layer on the built bar, not a rebuild.
- 2026-07-19 (fourth session): **names stay visible; narration is
  momentary** — flora, objects, reading material and friends keep
  their written names (drop click-to-hold naming and T6.1 unchanged).
  Narration/story text plays once, in the moment, and is never stored
  or re-readable; record pages (Guest Book, Map, Bookcase) are
  visual-first — art + names + dates, no stored prose or captions.
- 2026-07-19 (fourth session): **undo is persistent but quiet** —
  available as long as the rules allow (same-day for one-time; the
  T3.2b counter's undo), styled small and low-key, never an alarm
  colour or a shake. (Supersedes the fading-undo idea from the design
  draft.)
- 2026-07-19 (fourth session): **no reduced-motion / calm mode in
  v1** — single user; revisit only if the motion ever feels like too
  much.
- 2026-07-19 (fourth session): **narration content is slot-based and
  human-written, retroactively** — a keyed content file holds one slot
  per narrated moment; slots ship blank (`TODO: written by Kimia`) and
  the app renders gracefully when empty. The five built T3.2 reveals
  get converted to slots (plan T3.4); their current text remains only
  as a marked placeholder until Kimia replaces it.
- 2026-07-19 (fourth session, T3.2b built): **the counter's goal
  display** — daily/weekdays/N-per-day show "count/goal today" with a
  quiet ✓ once fulfilled; **N-per-week and whenever show a plain
  count with no per-day goal** (they carry no per-day expectation;
  the week target already sits in the row's small print). The same
  counter appears on the check-in/backfill rows. One-time keeps its
  single-tap control.
- 2026-07-19 (sixth session, for plan T3.5): **read now / read later**
  — a held reading arrival offers the same kind of quiet choice a
  flora find does, for symmetry between the drops that have intrinsic
  value. Fungi are excluded on purpose: currency has only exchange
  value, so there is nothing to savour — the wallet stays choice-free.
  Unlike flora there is nothing to decline or lose: reading material
  is always kept (spec §5 Stream 2), so the choice is purely of the
  moment — read now opens the spread; read later simply lets the
  arrival go, the publication safe in the Bookcase.
- 2026-07-19 (sixth session, for plan T3.5): **reading opens a
  double-page spread** — a popup showing a spread of the publication
  itself, as an image Kimia provides (photograph/scan/collage — never
  AI-generated; the human-made rule extends from words to images).
  One spread per publication, keyed to the T6.1 content pools; the
  popup renders a graceful empty state for publications whose spread
  doesn't exist yet. Spreads live in the public repo, so only images
  Kimia has the right to publish go in.
- 2026-07-19 (sixth session, for plan T3.5): **re-readable anytime,
  tracked nowhere** — any publication ever received can be opened
  again from the Bookcase (the spread is the publication, not
  narration — the momentary-narration rule does not apply). There is
  NO read/unread state: nothing stored, nothing marked, nothing
  nagging. Read now / read later is felt, not remembered.
- 2026-07-19 (sixth session, T3.3): **undecided flora wait** — a flora
  find has four states: pending (just arrived), gathered, left (back
  in the world) or composted (was gathered, returned to the world).
  A held arrival offers gather / leave it; an arrival that fades
  undecided is NOT lost or left — it waits, pending, on the Abode page
  with no deadline and no nagging, until Kimia decides. (Her call
  today, over the fades-means-left alternative.) Left and composted
  are final. Reading material and fungi stay decision-free: always
  kept, always banked.
- 2026-07-19 (sixth session, T3.3): **the early Abode page** — a
  simple page like the meter stubs, reached from a link on the habit
  list beside the field notes, listing flora waiting to decide
  (gather / leave it) and gathered flora (a quiet compost button,
  usable anytime — no confirmation, because nothing is ever lost).
  The freely arrangeable Abode proper still arrives in T4.3.
- 2026-07-19 (sixth session, T3.3): **flora stay generic until T6.1**
  — every find is "a flora find" plus the day it dropped; species,
  names, art and landmark status arrive with the content pools.
  Decisions are stored per find (keyed by the completion that dropped
  it) in storage v4; undoing a completion removes its find and its
  decision together. Composting yields nothing — the wallet has no
  code path from flora — and the drops engine never sees decisions,
  so finds keep arriving on the steady window schedule: composted
  flora can always be encountered again.
- 2026-07-19 (eighth session, T3.5): **the spread popup's empty-state
  words are a narration slot** — `spreadPopup.emptyState` in Kimia's
  narration.js, consistent with "every word on the reveal screen is
  hers". Left blank, the popup shows only the publication's glyph, its
  generic name and a close button — nothing invented. Spread images
  are keyed one-per-publication in `src/content/spreads.js` (also
  Kimia's file; images go in `public/spreads/`); until T6.1 names the
  publications no key exists, so every popup shows the empty state —
  no placeholder images (the flora-stay-generic precedent).
- 2026-07-19 (eighth session, T3.5): **closing the spread popup lets
  the arrival go** — reading was the moment; the piece is safe in the
  Bookcase, re-readable anytime. Read later (or letting the arrival
  fade) means the same thing: nothing is at stake, and nothing about
  reading is ever written to storage. The early Bookcase list (like
  the T3.3 Abode) shows everything received, in arrival order, each
  with its read button; the real shelves (T4.2) reuse the same popup.
- 2026-07-19 (tenth session, copy pass after T4.2): **the meters are
  renamed and fall silent** — "expedition" → **steps taken**,
  "literacy" → **literacy level**, "fungi" → **wallet balance**, and
  the captions underneath are gone: no running step total, no n/10
  doors count, no "in the wallet" (supersedes that part of the T2.2
  decision from 2026-07-16). The wallet keeps its number — the number
  IS the balance. Bar maths, colours and pages are untouched.
- 2026-07-19 (tenth session, copy pass after T4.2): **the field notes
  lose their self-description and the graphs their caption** — "The
  field notes are Habitat's memory of the weeks…" and "Each line is
  simply how often…" came out (supersedes "the page carries a short
  description of itself" from 2026-07-16, T2.3). The pages speak
  visually; the back-to-habits link stays.
- 2026-07-20 (eleventh session, T4.3): **the Abode is open ground
  under sky** — no walls, no room: a patch of N-Z-D with a faint
  horizon, the sky above, the ground below (Kimia's call, over a room
  interior or bare space). The scene is constant like the bookshelf —
  the same ground for one flora or fifty, bare with no prose or count
  when empty; crowding is solved by arranging, never by the ground
  growing. Placement is deliberately free, sky included — gravity is
  not guaranteed on this planet (§5), so a flora hangs wherever it's
  left.
- 2026-07-20 (eleventh session, T4.3): **gathered flora are freely
  draggable, remembered per find** — storage v6's `abodeLayout` maps
  each find (keyed by its dropping completion, like floraDecisions) to
  scene fractions; an entry is written only once a flora is moved, and
  un-moved flora stand in deterministic default spots along the ground
  lines, stepping forward when an earlier find leaves. Composting a
  find — or undoing its completion — prunes its stored place with it,
  exactly like the bookcase layout. Purchased objects join the same
  map in T4.3b.
- 2026-07-20 (eleventh session, T4.3): **compost hides behind a quiet
  hold** — a click holds a flora (a touch larger, its name showing)
  and reveals its small compost button; a click anywhere else lets it
  settle back (the Bookcase's click-then-eye precedent, over
  hover-buttons or drag-to-a-spot). Composting still needs no
  confirmation — nothing is ever lost — and still yields nothing.
- 2026-07-20 (eleventh session, T4.3): **flora waiting to decide stay
  apart, and no found dates on the Abode** — undecided finds keep a
  small plain list above the ground (they aren't home yet; a place
  comes with gathering), and the found-date captions came off the
  Abode entirely, waiting list included (extending Kimia's 2026-07-19
  no-found-dates rule from the Bookcase and Map). The T3.3 page's
  "nothing here yet" and composting caption came out with them — the
  ground speaks visually, like the shelves.
- 2026-07-20 (thirteenth session, T4.3b): **the stall's shape** — 4
  curiosities on offer; each discovered region adds 3 to the pool;
  placeholder prices 6 / 12 / 18 fungi, one per tier per region, until
  T6.1 prices the real objects (all Kimia's calls). The mid tier keeps
  the 2026-07-19 pacing target: ~1 mid-priced object per rotation on
  ~15 fungi of income.
- 2026-07-20 (thirteenth session, T4.3b): **rotation is derived, never
  stored** — lived days are counted from completion history (gap days
  don't advance the clock; backfilled days count; undo turns it back),
  and the stall slides 4 objects further along the pool each rotation,
  wrapping. Every object cycles back within ⌈pool ÷ 4⌉ rotations —
  provably nothing permanently missable, tested.
- 2026-07-20 (thirteenth session, T4.3b): **duplicates are allowed**
  (Kimia's call) — buying never takes an object off the stall; each
  purchase is its own instance with its own id, its own remembered
  place in the Abode, and its own quiet sell button. The stall says
  "×n at home" when copies are owned. This sharpens the older
  "returned objects re-enter the world" line: an owned object is
  always findable again — it's right there on the stall.
- 2026-07-20 (thirteenth session, T4.3b): **selling happens in the
  Abode, compost-style, and the button reads "sell"** (Kimia's word —
  it names this spec's symmetric "return"). Full refund of the price
  paid, no confirmation (nothing is ever lost), and the refund is
  announced with the same arrival feedback a fungus drop shows.
- 2026-07-20 (thirteenth session, T4.3b): **objects are generic "a
  curiosity" with seeded code-drawn art** until T6.1 names them and
  T5.3 art-directs (the flora-stay-generic precedent): one of four
  abstract forms and a pastel hue, both pure functions of the world
  seed and the object's stable key, so a curiosity looks the same
  wherever it appears.
- 2026-07-20 (thirteenth session, T4.3b): **the wallet shows nothing
  below zero, but the debt stays real under the hood** (Kimia's
  correction the same day) — undoing a completion whose fungi were
  already spent leaves the true balance negative; the meter rests at
  empty (a negative number would read as debt — punishment feel) and
  owned objects are never taken away, but later income and later
  refunds settle the debt first, quietly. A sale always adds exactly
  the price to the true balance; while debt is being settled the
  display may climb by less. Buying still refuses to overdraw.
  Storage v7 carries the purchases list (id, object key, frozen price,
  buy moment) through backups.
- 2026-07-20 (twelfth session, docs only, T4.5): **the pages are
  renamed** — "the Map" → **map of N-Z-D**, "the Bookcase" → **readers
  library** (no apostrophe, Kimia's call — a compound noun, not a
  possessive), "the Market" → **local market**, "the Abode" → **your
  abode**, and the Guest Book → **local community**. The articles go;
  each title now says whose place it is. The internal names (Map,
  Bookcase, Market, Abode, Guest Book) stay as they are in the code and
  these docs — this is a copy change, not a rename of the concepts.
- 2026-07-20 (twelfth session, docs only, T4.5): **a left icon rail of
  five pages** — map · abode · community · library · market, descending
  down the left edge of the home screen, away from the habit list, each
  revealing its name on hover. Kimia's order groups the two lived-in
  places (abode, community) under the planet, with the two collections
  below. **The meters stay clickable too** (her call, over making the
  rail the only route): meter and rail are two doors to the same three
  pages, and the rail is the only door to the abode and the community.
- 2026-07-20 (twelfth session, docs only, T4.5): **the home screen goes
  icon-only** — every action becomes an icon with a hover label, no
  action words on the page: the habit row's _edit_ → a pencil (hover
  "edit") and _archive_ → an archive box (hover "archive"); an archived
  habit's _delete_ → a trash icon (hover "delete forever"); and the
  three list-level actions sit as **three discreet buttons together at
  the foot of the habit list, above the archived list** — **+** (hover
  "add new habit"), a pencil (hover "edit past days") and a graph
  (hover "view historical data"). The symbol filter's hover reads
  **"filter view"** — deliberately _not_ "filter habits by type": the
  six symbols are never categories (§4.1), and the hover must not imply
  they are. "View" is also the truer word: the filter is a temporary
  lens that resets each visit, not a property of the habits.
- 2026-07-20 (twelfth session, docs only, T4.5): **undo becomes "-1"**
  on the habit rows and in the check-in — the mirror of the +1 beside
  it, and a plainer read of what it does. Its behaviour and its quiet
  styling (design-notes §2) are untouched.
- 2026-07-20 (twelfth session, docs only, T4.5): **the habit counts
  lose the word "today"** — "2/1 today" becomes simply **2/1**. The
  large date display above the list now says which day it is, so every
  row repeating it was noise (supersedes the "count today" wording from
  T3.2b, 2026-07-19).
- 2026-07-20 (twelfth session, docs only, T4.5): **a large letterspaced
  date display** sits beneath the meters and above the symbol filter —
  `M O N D A Y   2 0   J U L   2 0 2 6`. It shows the **real calendar
  date**, not the Habitat day (Kimia's call). Because the two disagree
  between midnight and the 3am cutoff, a quiet line appears **only in
  that window**: "your habits will switch to a new day at 3 a.m.",
  tracking the configured cutoff. This is the one place in the app that
  states the cutoff rule out loud — the honest fix for the one moment
  the date and the list below it would otherwise contradict each other.
- 2026-07-20 (twelfth session, docs only, T4.5): **the done-yesterday
  check-in becomes a pop-up over the habit list**, not a page that
  replaces it — the list stays visible behind so it reads as a
  temporary view being passed through. Every §4.2 rule is untouched:
  yesterday must still be answered, the done button is still the only
  exit, and the meters still stay off it.
- 2026-07-20 (twelfth session, docs only, T4.5 / T4.4): **the Abode
  gets a quiet / party mode toggle** — a switch with an icon either
  side. Party mode pops the friends we have made up **among** the flora
  in a randomised formation; the flora and objects keep their exact
  arrangement and stay draggable (party mode only ever adds, never
  disturbs). Friends are not draggable and their placement is not
  remembered — a **refresh** re-rolls the formation, and nothing about
  a party is stored. The toggle **ships greyed out and inactive in
  T4.5** and comes alive in T4.4 once a friend exists (the Market-stub
  precedent: the control is real before its contents are).
- 2026-07-20 (twelfth session, docs only, T4.5 / T5.2): **a daily
  startup animation** — on the **first visit of each Habitat day**
  (after the 3am cutoff, whether or not a check-in was owed), a black
  screen shows a slither of slowly spinning, glowing planet across the
  bottom edge, like a satellite image; a few seconds, then the normal
  screen **fades in**. It sits **after** the done-yesterday pop-up and
  **before** the Sunday field notes. It fires on **day rollover** — the
  3am cutoff — never on a _lived day_ (a day with ≥1 habit marked),
  which is only knowable in hindsight and so could never gate a startup
  screen. The plumbing lands in T4.5, the animation itself in T5.2.
  Colours in design-notes §12.
- 2026-07-20 (twelfth session, docs only): **the word "cron" is
  retired** — a day with ≥1 habit marked is now a **lived day**, and
  the Market rotates every **28 lived days**. The term came from
  Habitica and carried two clashing meanings by this session: the
  scheduling sense, and the new daily startup, which fires on day
  rollover rather than on activity. Not to be reintroduced anywhere,
  in docs, code or UI. (Two stale code comments were corrected in the
  same pass; no identifier ever used the word.)
- 2026-07-20 (twelfth session, docs only, T4.4): **the friend signature
  animation plays in exactly three moments** — the arrival reveal, the
  **Guest Book popup card**, and rare unannounced home-screen cameos —
  and **never in the Abode's party mode**, where friends are simply
  present. Scarcity is the mechanic: a greeting summonable at will
  stops reading as a greeting (design-notes §8, §12e).
- 2026-07-20 (twelfth session, docs only, T4.4): **friends get a second
  content slot — the card text** — shown on the Guest Book popup card
  and re-readable any time. This is a deliberate, single exception to
  "narration is momentary and never re-readable" (design-notes §7), and
  it does not weaken that rule: the **arrival narration stays
  momentary and is never replayed**. Two slots, two jobs — the
  narration is the night we met them, the card text is who they are.
  Both are Kimia's, both ship blank, and an empty card text renders
  nothing (art, name and animation carry the card alone).
- 2026-07-20 (twelfth session, docs only, T4.5): **the symbol filter's
  hover reads "filter view"** (revised from "filter habits" the same
  day) — the filter is a temporary lens that resets each visit, not a
  property of the habits, and "view" says so without going near the
  categories the six symbols must never become (§4.1).
- 2026-07-20 (twelfth session, docs only, T4.5): **the two pencils are
  told apart by size and colour** — the habit row's edit pencil small,
  inline and dim; the foot-of-list "edit past days" pencil larger and
  accent-coloured as a page-level action. Kimia's call, to be watched
  in real use; if it doesn't hold, the foot pencil gains a clock or
  calendar mark — never a word (design-notes §12a).
- 2026-07-19 (tenth session, T4.2): **the Bookcase is one constant
  bookshelf** — the same frame and planks whether it holds one
  publication or a hundred (the faint-planet precedent: bare shelves
  when empty, no prose, no count). Publications are **floating,
  draggable books**, arranged anywhere on the shelf; new arrivals fill
  deterministic default slots (top plank first) until Kimia moves them.
  Crowding is solved by her arranging, never by the shelf growing.
- 2026-07-19 (tenth session, T4.2): **spine ↔ front, remembered per
  book** — a click stands a book face-out; the cover's quiet **eye
  button** opens the T3.5 spread for reading, and a click anywhere
  else on the cover turns it back. Place AND facing are stored per
  publication (storage v5's `bookcaseLayout`, keyed by the dropping
  completion — an entry is written only once a book is moved or
  turned, and undo of that completion prunes the book's place with
  it, exactly like flora decisions). Reading itself is still tracked
  nowhere. Books are code-drawn placeholders (slim magazine, middling
  novel, thick dictionary, the literacy violet family) until T5.3;
  publications stay generic until T6.1.
- 2026-07-19 (tenth session, T4.2): **no found dates — on books or on
  the Map.** Kimia's call: the found-date captions came off the
  Bookcase, and the Map's "known since …" tooltips (regions and
  landmark markers) came out with them. A known region simply glows.
  (Discovery days stay computed in game/map.js — T5.2's
  discovery-moment narration needs them; they're just never shown.)
- 2026-07-19 (ninth session, T4.1): **the planet has 16 equal
  regions** — 400 expedition steps each (= 4 bar-segments ≈ 4 months
  at the current pace): a new region roughly three times a year,
  steady for the whole ~5 years (flat pacing, as ever). Laid out as
  the landing site in the middle, a ring of 5 around it and a ring of
  10 outside, so discovery radiates outward from where we first
  arrived. Steps beyond the 16th region stay in the 16th — the
  planet's ~5-year practical sizing; T6.2's recalibration revisits
  the numbers if the real pace outgrows them.
- 2026-07-19 (ninth session, T4.1): **the undiscovered planet is a
  faint outline** — the whole silhouette is hinted at from day one
  (the scale of the journey, barely there), and regions light up
  inside it the moment the expedition steps into them. Discovery is
  derived from completion history exactly like the meters — a
  completion's expedition step IS its position in the history — so an
  undo across a border quietly un-discovers a region by itself, and
  nothing is stored that could go stale.
- 2026-07-19 (ninth session, T4.1): **region shapes are seeded
  generative placeholders** — every wobble, border and bioluminescent
  colour is a pure function of the world seed (one stable shape per
  world, carried in backups) until the T5.3 art pass replaces the
  shapes and T6.1 names the regions. Until then a known region offers
  only its discovery date — no names, nothing invented (the
  flora-stay-generic precedent).
- 2026-07-19 (ninth session, T4.1): **landmark flora are plumbing
  only** — every flora find knows the region its step fell in, and
  the Map can draw permanent markers (a marker exists exactly as long
  as the completion that dropped its find, so only that undo removes
  it) — but no marker renders until T6.1 decides which species are
  landmarks. The 16 region narration slots now exist in narration.js
  (blank, Kimia's); their discovery-moment playback arrives with
  T5.2's ambient swell.
- 2026-07-19 (seventh session, T3.4): **narration lives in one keyed
  content file** — `src/content/narration.js` holds every narrated
  moment's words; the five T3.2 reveal texts moved there as marked
  Claude-written placeholders until Kimia replaces them. **Reveal
  titles are slots too** — every word on the reveal screen is
  Kimia's. **An empty slot renders nothing**: the reveal keeps its
  glyph and button — no marker, no invented copy. Future narrated
  moments (friend intros, map regions, literacy eras) have labelled
  sections in the file now; their slots are added when the features
  are built and their names/counts exist.
- 2026-07-19 (fifth session, docs only): **the six symbols are the
  six charms** — crown/gold, cherries/coral, shell/pink,
  anchor/lavender, shield/sky, key/teal, mapped to symbol slots 1–6;
  line-drawn glowing SVGs (paths + hexes recorded in design-notes
  §11a). A deliberate exemption from "weird > cute": the charms are
  personal talismans, not inhabitants of N-Z-D. The no-words rule is
  untouched. Built in T5.1.
- 2026-07-19 (fifth session, docs only): **typography & palette** —
  Cormorant Garamond (display) + DM Sans (body), bundled with the
  app; UPPERCASE + wide letterspacing for display and section labels,
  lowercase everywhere else; background `#080910`; charm colours as
  the accent palette. Full spec in design-notes §11b/§11c. Built in
  T5.2.
- 2026-07-20 (fourteenth session, T4.4): **how a friendship begins** —
  a literacy milestone only OPENS the door; the category's first friend
  arrives 1–5 seeded Habitat days later, riding the first tap on/after
  that day, stored on the completion like every drop (one friend per
  tap, earliest-due first; a retro tap meets only friends its own day
  had already reached). Seeded per category + individual, so undo takes
  the friend back and the next tap re-derives the identical one. Doors
  are derived from history — undoing the reading that crossed a
  milestone quietly closes the door again (pending friends wait;
  arrived ones stay: their stored drops are settled history).
- 2026-07-20 (fourteenth session, T4.4): **repeat friends are allowed**
  (Kimia's call, over one-friend-per-category) — a category keeps
  refilling: each next friend of the same category waits a seeded
  20–50 days after the previous one ACTUALLY arrived (never from its
  due day — no bunching, however long the app sat closed). Roughly one
  friend per category per month or two; the T6.2 recalibration retunes
  the gap if the community ever feels crowded.
- 2026-07-20 (fourteenth session, T4.4): **draft category names until
  T6.1** — a friend shows its category's draft singular ("a Drifter")
  on the arrival, the Guest Book and the card (the "a flora find" /
  "a curiosity" precedent, one rung up: categories are named,
  individuals aren't). The names live in constants.js as game data —
  never in Kimia's narration file, never hard-coded in tests.
- 2026-07-20 (fourteenth session, T4.4): **two narration slots per
  category** — `friendIntros.<key>` (title + line) plays ONCE, at the
  category's first arrival ever; later friends of the same category
  arrive wordless (narration is momentary). `friendCards.<key>` is the
  standing re-readable exception (2026-07-20), shown on the Guest Book
  popup card. Both ship blank; an empty slot renders nothing.
- 2026-07-20 (fourteenth session, T4.4): **every friend arrival is a
  neon reveal** — the full POP register (design-notes §5; its firework
  layer lands in T5.2) with the signature category animation playing —
  one of the animation's three allowed moments. The arrival is
  choice-free: a friend simply joins the community, like fungi bank
  themselves.
- 2026-07-20 (fourteenth session, T4.4): **the Guest Book page** —
  visual-first: art and names, bare with no prose while no friend has
  arrived (the constant-bookshelf precedent). Clicking a friend opens
  the quiet popup card: art, name, card text, the signature animation
  playing — the one moment the animation can be summoned at will.
  Until T4.5's rail exists the page is reached from a "the guest book"
  link on the habit list, and it shows its internal name until T4.5's
  renames land.
- 2026-07-20 (fourteenth session, T4.4): **party mode built whole
  here** — T4.4 lands before T4.5 (which was to ship the greyed
  toggle), so the quiet / party toggle ships complete: greyed "not
  yet" with zero friends, alive the moment the first friend exists.
  Friends pop up among the flora in a randomised UNSEEDED formation
  (a refresh or a re-toggle re-rolls it), not draggable, not
  remembered, nothing stored, no signature animation — simply present.
  The flora arrangement is untouched and stays draggable; the abode
  layout never hears about a party.
- 2026-07-20 (fourteenth session, T4.4): **cameos redecided — they
  celebrate big wins** (Kimia's redecision, amending the twelfth
  session's "rare, unannounced, unpredictable"): a friend turns up on
  the habit list to celebrate — a day with many completions, a new
  record streak, a lived-day milestone — performs its category
  animation once, with a short message alongside (her draft examples:
  "12 steps in one day!", "15-day streak record!", "50 lived days!").
  The messages are Kimia's slots, shipped blank like all her words.
  Built as the new task T4.6, not in T4.4.
- 2026-07-20 (fourteenth session, T4.4): **storage v8** — drops can now
  include friends ({ kind: 'friend', category, individual }); the bump
  only gates the new kind, so an older app never loads a backup it
  can't validate. No fields move.
- 2026-07-21 (fifteenth session, T4.5 built): **the pass lands** — the
  five page renames are live (map of N-Z-D, readers library, local
  market, your abode, local community); the left icon rail (map · abode
  · community · library · market) is the only door to the abode and the
  community, with the meters staying clickable; the date display shows
  the real calendar date with the 3am note only between midnight and
  the cutoff; every home-screen action is an icon with a hover label
  (title + aria-label); the check-in is a pop-up over the dimmed,
  inert list with every §4.2 rule untouched; and the startup plumbing
  holds its slot with a plain fade — settings gains `startupShownOn`
  (no schema bump, the fieldNotesShownOn precedent), the morning order
  check-in → startup → Sunday field notes enforced by gating.
- 2026-07-21 (fifteenth session, Kimia's PR + calls): **all three
  meters are bars, with the exact numbers behind hover** — the wallet
  is no longer the odd one out. The wallet bar clamps 0–40 fungi (full
  bar ≈ 2.7 rotations of saving at ~15 fungi per rotation); its hover
  shows the TRUE balance as a plain number, **negative while debt is
  being settled** — the face still never shows debt (the 2026-07-20
  rule stands), the hover is simply honest on demand, Kimia's call over
  the punishment-feel worry. The literacy hover reads 0–100, ten per
  friendship level (10 = level 1 unlocked; the bar refreshes at each
  level, as it already did). The steps hover is the lifetime total.
  This supersedes "a wallet has no progress bar" (2026-07-16) and "the
  number IS the balance" (2026-07-19): the wallet's always-visible
  number moved behind the hover.
- 2026-07-21 (fifteenth session, Kimia's calls): **unarchive is an icon
  too** (a box with an up arrow, mirroring archive's down arrow — the
  one extension to §12a's six enumerated icons), and **every
  mark-reversing control reads `-1`**, including the archived one-time
  to-do's undo — beside a `+1` or not.
- 2026-07-21 (fifteenth session): **the rail's hover labels are the
  pages' full display titles** ("map of N-Z-D", "your abode", "local
  community", "readers library", "local market") — the label names the
  destination, not the rail's short word for it.
- 2026-07-21 (sixteenth session, T4.6 built): **the cameo thresholds** —
  a big day is **8 completions** against one Habitat day; a record
  streak must beat the habit's own all-time record AND be at least **5
  days** strong (**2 weeks** for week-counted habits) so young streaks
  can't fire cameos daily (never a learnable schedule); a lived-day
  milestone is **every 50 lived days**, firing on the crossing day
  itself. The celebrating friend is **a seeded surprise pick** from the
  friends who have arrived — stable for the win, undo-safe. At most one
  cameo per day (milestone > record > big day, rarest first); it visits
  once per visit, performs its animation once, and settles back to the
  calm list — nothing stored. (All Kimia's calls, answering T4.6's open
  "decide with her" thresholds.)
- 2026-07-21 (sixteenth session, Kimia's call): **the left rail persists
  on every screen but the check-in** — the world pages are always one
  tap away. The check-in keeps its rule: the done button stays the only
  exit, so no rail there.
- 2026-07-21 (sixteenth session, Kimia's call): **a temporary
  design-assets page** prepares for T5 — one empty shelf per image-asset
  family (charms, friends, map regions, flora, fungi, market objects,
  reading spreads), reached from a door at the foot of the home screen.
  Scaffolding: it leaves or becomes deliberate when the design pass
  lands.
- 2026-07-21 (seventeenth session, T5.1 built, Kimia's call): **the
  charms' accessible name is their shape name** — a wordless drawing
  still needs a name for screen readers and the test suite (the old
  glyphs gave one implicitly: `●` reads as "black circle"). Each charm
  SVG carries `role="img"` + `aria-label` of its shape (crown, cherry,
  shell, anchor, shield, key — singular "cherry", her wording),
  screen-reader/test only and never shown on screen. She weighed this
  against a meaning-free "symbol 1…6" and chose the shape names; naming
  the picture, not the habit's meaning, keeps the no-labels rule intact.
- 2026-07-21 (eighteenth session, Kimia's call): **a design-tokens CSS
  file — the visual twin of `constants.js`.** Every colour, glow
  strength, font size and spacing number moves into one CSS file of
  named custom properties, each with a plain-English comment, so
  retuning the look is one readable edit in a place a non-coder can
  scan — the same discipline `constants.js` gives the game numbers, no
  raw hex codes or magic px scattered through component styles. The six
  charm colours in `src/ui/symbols.js` (§11a) become **canonical in the
  tokens file**; symbols.js keeps the hex values its JS glow strings
  need, marked "mirror of the tokens file — keep in sync." One source
  on paper, no runtime indirection. Built as part of T5.2 (design-notes
  §11d).
- 2026-07-21 (eighteenth session, Kimia's layout spec merged): **the M5
  layout & atmosphere pass** — three net-new structural pieces folded
  into T5.2 (design-notes §13). (1) A full-width top **header**
  (wordmark · meters · date · charm filter) replacing the stacked
  `.app` header, built with CSS `grid-template-areas` so the narrow
  layout regroups deliberately rather than wrapping in source order;
  the habit list keeps its 40rem width, unchanged. (2) Each secondary
  page's title is **promoted out of its content box** into a shared
  `.page-title` region above it, echoing the date display's quiet
  letterspaced treatment. (3) A full-bleed **night-sky background**
  behind all content on every device — a handful of CSS stars twinkling
  rarely (~once/30s) on randomised long timings, no JS.
- 2026-07-21 (eighteenth session, Kimia's layout spec — narrows the
  2026-07-20 startup rule): **the daily startup "rolling planet" is
  desktop/laptop only.** It reads as full-window and epic, but is gated
  behind a `min-width` check; mobile and tablet **skip it entirely**
  (not shrunk) and fall back to the plain black fade — Kimia's real use
  is laptop-only, so the asset is built for the one screen that will see
  it rather than made responsive down to a phone. Everything else about
  §12f stands (short, wordless, skippable, identical every day, plays
  every Habitat day it runs).
- A lived day = a day with ≥1 habit marked (including retroactive
  marks). Called a "cron" until 2026-07-20.
- Reward pacing: slow, steady, designed for a patient daily user; no
  front-loaded hooks.
- Retroactive check-in marks attributed to the actual day of completion.
- No punishment mechanics anywhere.
- Weekly view: simple — completions, patterns, streaks only.
- SVG-only visuals; dark base; white/pastel/basic colours for content,
  neon reserved for POP moments.
- Meters permanent at top, infinite growth (~5 years practical sizing);
  meter clicks open Map and Bookcase.
- Objects arranged/removed in the Abode page; friends in the Guest Book.
- Each reward type gets a distinct first-occurrence reveal.
- GitHub Pages hosting; localStorage data; export/import backup.
- Day cutoff 3am by default, configurable.
- Friendships space is the **Guest Book**.
- Returned objects re-enter the world and can be found again.
- 2026-07-21 (Kimia, copy + control tweaks, outside the plan): **an
  undone one-time to-do is an empty tick-box, not a "mark done"
  button** — ticking it finishes and archives it (hover reads "mark
  done"). Same change in the check-in's past-day rows: empty box when
  unmarked, ticked box (hover "done") when marked, un-ticking un-marks.
  A checkbox reads as a to-do more plainly than a button. Also
  **removed two explanatory copy lines** as visual clutter: the field
  notes legend ("✓ done · was on the calendar, not marked — blank
  means nothing was asked of the day") and the check-in's yesterday
  line ("Anything left unmarked simply counts as not done — neutral
  data, nothing lost"). The underlying principle is unchanged — unmarked
  is still just neutral not-done data — it simply no longer needs saying
  on screen.
- 2026-07-22 (Kimia, field-notes + meter copy tweaks, outside the
  plan): **the "field notes" page title is removed entirely** — the
  page stands without a heading (its section keeps the "field notes"
  aria-label as an invisible landmark). The **"tasks completed" and
  "graphs" sections now sit centred** while the rest of the page stays
  left-aligned. The young-habit graph line is shortened from "A graph
  begins once a habit is 3 days old — this one is still settling in."
  to just **"habit is too young"**. And the three top **meter hovers
  are trimmed to the bare number** — "steps taken"/"of 100" suffixes
  dropped, matching the wallet, which was already number-only.
- 2026-07-23 (Kimia's call, planning session): **Habitat is
  desktop/laptop only — mobile and tablet are parked indefinitely.**
  Below **1024px** viewport width (phones and tablets, including tablets
  held sideways) the whole app is replaced by a single full-screen
  message; at 1024px and wider the app renders unchanged. This is a
  reversible gate, not a teardown: all app code stays intact, so a
  future responsive pass just removes/softens the gate and adds the
  small-screen layouts — nothing built now is thrown away. The block's
  wording is **Kimia-written copy** in a content slot (shipped blank,
  `TODO`), never auto-generated. Supersedes the old "the startup
  animation is Habitat's only device-conditional moment" line — the
  whole-app block is now the primary device split, and the desktop-only
  startup animation (§12f) simply lives inside the desktop side of it.
  Built in T5.1b. (v1 non-goals already excluded a mobile *app*; this
  makes the stance explicit and visible to the user.)
- 2026-07-23 (Kimia's call, planning session): **habit-list reordering
  moves from the ▲▼ arrow buttons to drag-and-drop.** The arrows are
  **replaced**, not supplemented — dragging a habit card up or down
  becomes the one way to reorder, and order still persists. The arrows'
  **filter-lock behaviour carries over unchanged**: while a symbol
  filter is active the list is a temporary lens over a hidden full
  order, so reordering (now dragging) is disabled, with the same
  hover explanation to clear the filter first. Built in T5.1c, right
  after the device block.

## spec.md version history (formerly its preamble)

_v1.27 — 2026-07-21 (fifteenth session). T4.5 built: the UX, copy and
navigation pass — the five page renames are live, the left icon rail
runs down the home screen's edge, the large letterspaced date display
sits beneath the meters, every home-screen action is an icon with a
hover label, undo reads **-1** everywhere, the check-in is a pop-up
over the dimmed list, and the startup plumbing holds its slot with a
plain fade (the animation itself is T5.2). Plus Kimia's PR and calls
today: **all three meters are bars** with the exact numbers behind
hover — the wallet bar clamps 0–40 and its hover tells the plain
truth (a negative number while debt settles); the literacy hover
reads 0–100, ten per level; the steps hover is the lifetime total.
All in the decisions log._

_v1.26 — 2026-07-20 (fourteenth session). T4.4 built: the Guest Book +
friendships. Decided with Kimia: a literacy milestone only OPENS the
door — the category's first friend arrives 1–5 seeded days later;
**repeats are allowed** (her call), each category refilling every
20–50 seeded days after the previous arrival; friends show their
**draft category names** ("a Drifter") until T6.1; two narration
slots per category (the momentary intro, played at the first arrival
only, and the re-readable card text on the Guest Book popup card);
**party mode built whole here**, since T4.4 lands before T4.5 — greyed
"not yet" until the first friend, then an unseeded, unstored,
unperformed formation among the flora. Storage v8. And cameos are
**redecided**: they celebrate big wins (a big day, a record streak, a
lived-day milestone) with the animation plus a short message — built
as the new task T4.6. All in the decisions log._

_v1.25 — 2026-07-20 (thirteenth session). T4.3b built: the Market
page — the rotating stall, at last. Decided with Kimia: the stall
shows **4 curiosities**, each discovered region adds **3** to the pool
(prices **6 / 12 / 18** fungi, one per tier per region, until T6.1
prices the real objects); **duplicates are allowed** — buying never
takes an object off the stall; **selling happens in the Abode**,
compost-style, the button reading **"sell"**, the refund announced
with the same arrival feedback as a fungus drop; and objects are
generic **"a curiosity"** with seeded code-drawn art until T6.1/T5.3.
Storage v7 carries the purchases list. All in the decisions log._

_v1.24 — 2026-07-20 (twelfth session, docs only). A UX, copy and design
pass decided with Kimia — built as the new plan task **T4.5**, with the
animation folded into T5.2 and the live half of the Guest Book into
T4.4. Page titles renamed (**map of N-Z-D**, **readers library**,
**local market**, **your abode**, **local community**); the home screen
gains a **left icon rail** of five pages, a **large date display**, an
**icon-only** treatment for every habit and list-level action, and
**-1** in place of undo; the done-yesterday check-in becomes a
**pop-up over** the habit list; a **daily startup animation** (a
spinning slither of glowing planet) plays on the first visit of each
Habitat day; and the Abode gains a **quiet / party mode** toggle,
inactive until friends exist. Two further calls the same session: the
word **"cron" is retired** in favour of **lived day**, and the friend
signature animations are pinned to **three moments** (arrival reveal,
Guest Book card, rare home-screen cameos) — never party mode — with a
new re-readable **card text** slot per friend. All in the decisions
log._

_v1.23 — 2026-07-20 (eleventh session). T4.3 built: the Abode proper.
Decided with Kimia: the Abode is **open ground under sky** (no walls
— a patch of N-Z-D, constant like the bookshelf, bare with no prose
when empty); gathered flora are **freely draggable** anywhere on the
scene, each place remembered per find (storage v6); flora **waiting
to decide stay in a quiet list apart** (the doorstep — they aren't
home yet); **compost hides behind a click-to-hold** (the held flora
shows its name and a quiet compost button, Bookcase-style); and **no
found dates** on the Abode (the Bookcase/Map rule extends). All in
the decisions log._

_v1.22 — 2026-07-19 (tenth session, copy pass after T4.2). Kimia's
call: the meters are renamed — **steps taken**, **literacy level**,
**wallet balance** — and the captions underneath are gone (no running
step total, no n/10 doors, no "in the wallet"); the field notes'
self-description and the graphs caption came out too. Bar maths
untouched. All in the decisions log._

_v1.21 — 2026-07-19 (tenth session). T4.2 built: the Bookcase page.
Decided with Kimia: ONE **constant bookshelf** (bare shelves, no prose,
no count when empty) with publications as **floating draggable books**,
arranged anywhere; each book stands **spine or face-out** (the cover's
quiet eye opens the T3.5 spread), place AND facing **remembered per
book** (storage v5); and **no found dates** — on the books or on the
Map (its tooltips came out). All in the decisions log._

_v1.20 — 2026-07-19 (ninth session). T4.1 built: the Map page.
Decided with Kimia: the planet has **16 equal regions** (400 steps
each ≈ 4 months — a new region roughly three times a year, steady for
~5 years); the undiscovered planet shows as a **faint outline** from
day one, regions lighting up inside it; region shapes are **seeded
generative placeholders** until T5.3's art pass (names arrive with
T6.1); landmark flora are **plumbing only** until T6.1 picks the
species. All in the decisions log._

_v1.19 — 2026-07-19 (eighth session). T3.5 built: read now / read
later + the spread popup, plus the early Bookcase list. Decided with
Kimia: the popup's **empty-state words are a narration slot** (hers;
blank shows just the publication and its close button — nothing
invented); **closing the popup lets the arrival go**; **no placeholder
spreads** — the empty state shows everywhere until T6.1 names the
publications (the flora precedent). Spread images are keyed in
`src/content/spreads.js` (Kimia's file). All in the decisions log._

_v1.18 — 2026-07-19 (seventh session). T3.4 built: narration content
slots in one keyed file (`src/content/narration.js`). Decided with
Kimia: reveal **titles are slots too** (every word on the reveal
screen is hers); an **empty slot renders nothing** — the pop-up keeps
its glyph and button, no marker, nothing invented; future narrated
moments (friend intros, map regions, literacy eras) get labelled
**sections now, slots later**, added when those features are built.
All in the decisions log._

_v1.17 — 2026-07-19 (sixth session, docs addition after T3.3).
Decided with Kimia: reading material gets the same held-arrival
choice symmetry — **read now / read later** — mirroring gather /
leave it (fungi stay choice-free: currency has only exchange value).
Reading opens a popup with a **double-page spread of the
publication** — images Kimia provides (never AI-generated), one per
publication named in T6.1. Re-readable anytime from the Bookcase; NO
read/unread tracking anywhere. New plan task **T3.5**. All in the
decisions log._

_v1.16 — 2026-07-19 (sixth session). T3.3 built: gather / decline /
compost. Decided with Kimia: undecided flora WAIT (a held arrival
offers gather / leave it; one that fades undecided waits on the Abode
page — no deadline, never a nag); an early, plain Abode page (reached
from a link on the habit list) holds the waiting and gathered flora,
compostable anytime; flora stay generic ("a flora find") until T6.1
names the species. Storage v4 adds the flora decisions map. All in the
decisions log._

_v1.15 — 2026-07-19 (fifth session, docs only). Visual identity
decided from Kimia's charm reference: the six habit symbols are now
six line-drawn SVG charms (crown, cherries, shell, anchor, shield,
key), each with its own colour; plus the app-wide palette and
typography system (Cormorant Garamond display + DM Sans body,
uppercase display / lowercase body). Full blueprint in design-notes
§11; built in T5.1/T5.2._

_v1.14 — 2026-07-19 (fourth session, docs only). Merged the design
interrogation into **design-notes.md** (the feel layer — read it
alongside this file for any design-adjacent task). Decided with Kimia:
star-shimmer/firework placement, momentary meter glow, names stay
visible + narration momentary, undo persistent-but-quiet, no calm
mode in v1, built reveal text to be slot-ified (new plan T3.4). All in
the decisions log._

_v1.13 — 2026-07-19 (third session, docs only). Decided: every
repeating schedule shape presents as an N-per-day-style counter with
unlimited +1 taps; every tap counts toward the meter and drops for
every shape; one-time keeps its single-tap control. Built as plan
T3.2b (a future session — no code today)._

_v1.12 — 2026-07-19 (second session). T3.2 built: drop arrival +
first-occurrence reveals. Decided today: drops START FRESH from this
update (old history rolls nothing retroactively); every completion
stores its drops at tap time; arrivals are a quiet note by the tapped
habit plus the drop object itself at the top of the page — clickable,
lingering a few seconds; check-in marks earn drops whose arrivals
wait for the done button; FIVE first-occurrence reveals (flora,
magazine, novel, dictionary, fungi), each its own neon POP._

## plan.md session notes (formerly its preamble)

_v1.26 — 2026-07-21 (fifteenth session). **T4.5 built**: the UX, copy
and navigation pass. The five pages show their new titles; the left
icon rail (map · abode · community · library · market) descends the
home screen's edge, the only door to the abode and the community; the
large letterspaced date display shows the real calendar date, with the
quiet cutoff note only between midnight and 3am; every home-screen
action is an icon with a hover label; undo reads **-1** everywhere;
the check-in is a pop-up over the dimmed, inert list; and the daily
startup holds its slot with a plain fade (the animation lands in
T5.2), the morning order check-in → startup → Sunday field notes now
enforced. Kimia's PR + calls today: **all three meters are bars** with
the numbers behind hover — the wallet bar clamps 0–40 and its hover
shows the true balance, a plain negative number while debt settles;
literacy's hover reads 0–100, ten per level; steps' hover is the
lifetime total. Two more calls: unarchive is an icon too, and every
mark-reversing control reads -1. Spec v1.27, design-notes v1.9.
Next task: **T4.6**._

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

## design-notes.md version history (formerly its preamble)

_v1.9 — 2026-07-21 (fifteenth session, T4.5 built). §12 is now real —
rail, date display, icon-only actions, the check-in pop-up and the
startup's plain-fade slot are all live. §4 changes shape: Kimia's call
today makes **all three meters bars**, the exact numbers moving behind
each meter's hover — the wallet's hover tells the plain truth even in
debt. Spec v1.27, plan v1.26._

_v1.8 — 2026-07-20 (fourteenth session, T4.4 built). Friendships are
real: §8 gains the repeat-friends rule (categories refill) and the
cameo redecision — big-win celebrations with a short message, built in
the new plan task T4.6 — and §12e's party mode is live, the toggle
shipped whole with T4.4 since it landed before T4.5. Spec v1.26,
plan v1.25._

_v1.7 — 2026-07-20 (twelfth session, docs only). The UX/copy/design
pass: §12 is new — the home screen's quiet furniture (the left rail,
the date display, icon-only actions), the check-in as a pop-up, and
the daily startup animation, which is this file's first **interruptive**
moment and therefore the one needing the most care. §2 gains undo's new
face: **-1**. Spec v1.24, plan v1.23._

_v1.6 — 2026-07-20 (eleventh session, T4.3 built). The Abode joins
the record pages: open ground under sky, visual-first per §7 — flora,
their arrangement, no prose, no dates. Undo/compost keep §2's quiet
treatment (a small underlined word, never an alarm), and the held
flora is §1's tap-to-reveal in miniature. Spec v1.23, plan v1.22._

_v1.5 — 2026-07-19 (ninth session, T4.1 built). The Map is the first
record page under §7's visual-first rule: shapes (seeded placeholders
until T5.3), discovery dates, no stored prose — and no names until
T6.1. The §6 ambient swell for new regions is NOT built yet — it
arrives with T5.2, along with the playback of the 16 (blank) region
narration slots added to narration.js. Spec v1.20, plan v1.19._

_v1.4 — 2026-07-19 (eighth session, T3.5 built). The drop-choice
symmetry in §5 is now real: held reading arrivals offer read now /
read later, and the spread popup is quiet pastel (an everyday
pleasure, not a POP). Its empty-state words are a narration slot —
the human-written rule holds down to this one line. Spec v1.19,
plan v1.18._

_v1.3 — 2026-07-19 (seventh session, T3.4 built). The authoring model
in §7 is now real: `src/content/narration.js` holds the keyed slots,
the five built reveals read from it (titles included — Kimia's call),
and an empty slot renders nothing at all — the pop-up keeps its glyph
and button, no marker. Spec v1.18, plan v1.17._

_v1.2 — 2026-07-19 (sixth session, after T3.3). The human-made rule
now covers images too: reading-material spreads are pictures Kimia
provides, never AI-generated (§7). Drop-choice symmetry decided —
read now / read later mirrors gather / leave it (§5); fungi stay
choice-free (currency). Spec v1.17, plan T3.5._

_v1.1 — 2026-07-19 (fifth session, docs only). Added §11: the visual
identity reference — the six charm symbols + colours and the
typography system, from Kimia's design reference. Companion to
**spec.md v1.15** and **plan.md v1.14**._

_v1.0 — 2026-07-19 (fourth session, docs only). Resolved every open
item from the v0.2 draft — decisions taken with Kimia on 2026-07-19
and recorded in spec.md's decisions log._

## Completed plan tasks — full build notes (formerly in plan.md)

- [x] **T0.1 Repo + scaffold + first deploy.** _(done 2026-07-12)_
      Create public GitHub repo `habitat`. Scaffold Vite + React + Vitest +
      ESLint/Prettier. Write CLAUDE.md (project rules for AI sessions) and
      a README (portfolio-facing). Set up GitHub Actions to auto-deploy to
      GitHub Pages on every push.
      _Done when:_ a near-empty dark page saying **HABITAT** is live at our
      public URL, and `npm test` runs (even with one dummy test).
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
- [x] **T4.5 UX, copy & navigation pass** _(done 2026-07-21; decided
      2026-07-20, twelfth session — spec v1.24 §5b, design-notes §12)_
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
  7. **Meters all bars, hover to reveal data** - literacy and wallet to mirror steps taken, with hover showing the exact levels and numbers. Wallet hover should show debt, and the bar should grow to its maximum size at 40 fungi, with its minimum size at 0 or below. Literacy bar should refresh at each new level of literacy, and the data should reveal a number from minimum 0 to maximum 100, where 10 would be level 1 unlocked, bar refreshed.
  8. **The Abode's quiet / party mode toggle** — _already shipped live
     with T4.4_ (the fourteenth session landed before this one): the
     switch with an icon either side, greyed "not yet" with zero
     friends and party mode working with the first. Nothing left to do
     here beyond the pass's styling of it.
  9. **Startup plumbing** — detect the first visit of each Habitat day
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
     Built: the five titles live on their pages; `ui/IconRail.jsx` (the
     five icons' hover labels are the pages' full display titles — the
     rail is the only door to abode and community, the meters stay
     clickable); `ui/DateDisplay.jsx` + days.js helpers (the note's
     wording is built from the cutoff setting, so it tracks it); the
     home screen icon-only — row pencil/archive, foot + · pencil ·
     graph, archived-row trash and unarchive (box with an up arrow —
     Kimia's call, the one extension to §12a's six), the filter's
     "filter view"; `-1` on every mark-reversing control and bare
     `count/goal`; the check-in a pop-up over the dimmed, inert list
     (aria-hidden + inert — role queries see only the panel); all
     three meters bars (`game/meters.js`'s `walletBar` clamped to
     `WALLET_BAR_MAX` 40 and `literacyLevelNumber` 0–100, ten per
     level), numbers behind hover — the wallet's hover is the TRUE
     balance, plain negative in debt; the startup plumbing —
     `game/startup.js`, settings' `startupShownOn` (no schema bump),
     `ui/StartupFade.jsx`'s plain non-blocking fade, and the Sunday
     auto-open gated check-in → startup → field notes. Tests prove the
     once-per-day detection across the cutoff, the Sunday sequence,
     the note's window and wording, the bars' clamps and hovers, and
     every icon's exposed label.
- [x] **T4.6 Home-screen cameos** _(done 2026-07-21, sixteenth session —
      spec §5, design-notes §8)_
      The third and last moment the signature animation plays: a friend
      turns up on the habit list for a BIG WIN, performs its category
      animation once, and the moment settles back to the calm list.
      Three win types, thresholds decided with Kimia this session and
      living in constants: a big day (8 completions), a record streak
      (beats the habit's own record, floor 5 days / 2 weeks so it's
      never a learnable schedule), a lived-day milestone (every 50,
      the crossing day only). Only when a friend exists; the visitor is
      a seeded surprise pick, stable for the win; at most one cameo a
      day, rarest first (milestone > record > big day); the message is
      Kimia's slot (`cameos.*` in narration.js), blank rendering
      nothing. No persistence, no nagging: derived fresh from history,
      so undo quietly takes the win back; it visits once per visit and
      leaves by itself after CAMEO_LINGER_MS.
      _Done when:_ trigger tests prove each win type fires its cameo
      once (and only when a friend exists), the messages read from
      slots with blank rendering nothing, and the moment settles back
      to the calm list.
      Built: `game/cameos.js` — the three win detectors as pure
      derivations (the lived-day exact-crossing rule: count on a
      multiple of 50 AND today lived; the record maths walking the
      current counting era, refereed against schedule.js's currentStreak
      in the tests; schedule.js's currentKindStart exported for it);
      `ui/Cameo.jsx` — a quiet pastel visit between the date and the
      list, the signature animation run a single iteration, the whole
      visit's length fed inline from CAMEO_LINGER_MS so CSS and timer
      never disagree; never behind the startup fade, never during the
      check-in. Same session (Kimia's calls, both logged above): the
      left rail moved into the shared fragment so it persists on every
      screen but the check-in, and the temporary design-assets page
      (empty shelves per family, counts from constants) waits for T5.
      Trigger, priority, undo-safety, equivalence, slot and visit tests
      all pass.
- [x] **T5.1 The 6 charm symbols** _(done 2026-07-21, seventeenth session
      — spec §4.1, design-notes §11a)_
      Swapped the placeholder glyphs (● ■ ▲ ◆ ✚ ✶) for the six
      line-drawn charms — crown (gold), cherry (coral), shell (pink),
      anchor (lavender), shield (sky), key (teal) — everywhere a habit
      symbol shows: the list rows, the check-in rows, the field-notes
      table, the graph headings, the form/filter symbol buttons, and
      (Kimia's follow-ups the same session) the main-page archived list
      and the field-notes "tasks completed" list — the two places, both
      hit by one-time to-dos, where the charm previously vanished. Still
      wordless on screen, as ever. The charm SVGs use the exact
      §11a paths, colours and stroke (fill none, currentColor, width
      1.4, round caps/joins, 24×24) and glow in their own colour
      (drop-shadow 14px at rest, 24px on hover). Each carries a
      screen-reader-only `role="img"` + shape-name `aria-label` (Kimia's
      call, logged above) so buttons stay named for tests and assistive
      tech without putting any word on screen.
      Built: `ui/CharmSymbol.jsx` — one shared component draws all six
      from a number 1..6; `ui/symbols.js` slimmed to the charm colours +
      shape names (the old SYMBOL_GLYPHS map is gone). The display
      consumers (HabitRow, CheckInPanel, FieldNotes, HabitGraphs,
      SymbolPicker, App.jsx's archived list, and FieldNotes' "tasks
      completed" list — the last two had no symbol at all before) now
      render `<CharmSymbol>` in place of a coloured glyph span; `.charm`
      CSS carries the size/glow/hover. App.test's
      symbol-button queries moved from glyph chars to charm names, and a
      new `CharmSymbol.test.jsx` pins the six names, colours and the
      role="img" drawing. Full suite (542) and oxlint pass.

- [x] **T5.1b Mobile & tablet block** _(done 2026-07-23, spec §3,
      design-notes §12f)_
      The app-root device gate: Habitat is desktop/laptop only, so below
      1024px viewport width (phones, and tablets held sideways) the whole
      app is replaced by one full-screen message; at 1024px and wider it
      renders exactly as before. A reversible gate — it wraps the app and
      changes nothing inside it, so a future responsive pass just
      removes/softens it.
      Built as a JS gate (`ui/ViewportGate.jsx`) that swaps the React
      tree, not a CSS media query that hides it: below the threshold the
      App never mounts, so nothing inside it runs on a blocked screen —
      no timers, and in particular no daily startup animation. That is
      why the desktop-only startup (§12f) simply *lives inside* this gate
      rather than needing its own device check — being inside the app, it
      only ever runs on desktop. The gate reads `window.innerWidth`, keeps
      it in state, and re-checks on `resize`, so narrowing/widening a
      window (or turning a tablet sideways) swaps live. The threshold is
      a named `MIN_APP_WIDTH = 1024` next to its only use; the check is
      `width >= MIN_APP_WIDTH` so 1024 renders and 1023 blocks.
      Wired in `main.jsx`: `<ViewportGate><App /></ViewportGate>` under
      StrictMode. The message copy is a blank Kimia-written content slot
      (`content/blocked.js`, `blockedMessage()` mirrors narrationSlot) —
      while blank the block screen shows nothing rather than invented
      copy (design-notes §7); **Kimia still needs to write it.** CSS
      `.viewport-block` / `.viewport-block-message` matches the app's
      deep-space near-black, centred and quiet. New `ViewportGate.test.jsx`
      (6 tests) asserts which side of the gate renders at 1024 / 1440 /
      1023 / 768 / 600, the live two-way swap on resize, and that no copy
      shows while the slot is blank — structure only, never wording. Full
      suite (549) and oxlint pass; verified in-browser at 1280 (app) and
      800 (block), no console errors.
