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
  T6.1** — a friend shows its category's draft singular ("a plip")
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
  Built in T5.1b. (v1 non-goals already excluded a mobile _app_; this
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
- 2026-07-23 (Kimia's call during the T5.1c build): **you grab a small
  drag handle, not the whole card.** A six-dot grip sits where the
  ▲▼ arrows were; pressing it and moving is what lifts and reorders the
  row. Chosen over making the whole card draggable because each row
  already holds tap controls (+1, −1, edit, archive) — a handle keeps
  those taps unambiguous and gives an obvious "grab here" cue. The
  handle carries the filter-lock hover ("clear the symbol filter to
  re-order") when a filter is on, and disables then. Desktop-only
  (T5.1b), so a single primary-button pointer press is the only input
  supported (design-notes §12a).
- 2026-07-24 (Kimia's docs, merged this session): **design-bible.md
  created** — a new standing doc holding the art language (Visual DNA,
  Design Genome, visual constraints, shape/surface/material/light
  language) and the full asset taxonomy, merged from Kimia's two
  attached drafts (habitat-visual-design + asset-taxonomy-v2). Asset
  sessions read CLAUDE.md + design-bible.md; coding sessions skip it
  (CLAUDE.md reading rules updated). Chosen over folding into
  design-notes.md so each session type loads only what it needs. The
  drafts' roadmap section was left out — plan.md stays the only
  roadmap; the asset pipeline (dedicated art sessions → temporary
  design-assets page → game source → remove the temp page) is noted in
  the bible's intro. Versus the earlier taxonomy draft, the merged doc
  fixed every asset quantity, deduped repeated glow/texture rules into
  shared preambles, reframed the texture library as the instantiation
  of the surface/material language, consolidated glow intensity into
  one ladder, and added the production count layer.
- 2026-07-24: **all world-asset counts fixed** (design-bible Part II):
  flora 64 species (48 collectible + 16 landmark); fungi exactly 1
  species; friends 55 individuals on a fixed ladder (10 plips → 1
  hamdi bulo); curiosities 64 (4 per Map region × 16); publications 30 (10
  per type; spine + cover + Kimia's interior spread = 90 images); Map
  16 regions; one Abode sky asset in 4 palettes (the shared night sky
  stays the §13c CSS star layer); one terrain asset serving the
  startup planet, Abode ground and Bookcase backdrop. Riding along:
  curiosity price correlates directly with physical size; every friend
  has eyes; publications glow less than living things; living-thing
  glow colour never varies — variation lives in form only.
- 2026-07-24 (Kimia's call): **landmark flora are one per region,
  enforced** — 16 landmark species for 16 Map regions, and the drop
  seeding guarantees each region receives exactly its own landmark
  tree (not just matching counts). Folded into spec §5.
- 2026-07-24 (Kimia's call): **friend rosters are a cap** — amends the
  2026-07-20 "categories refill / repeat friends" rule: a category
  refills only until its fixed roster is exhausted, so 55 friendships
  is the lifetime maximum. Folded into spec §5 and the CLAUDE.md
  friendships guardrail.
- 2026-07-24: **the Abode sky is the one sky exception** — a separate
  sky asset (realistic clouds and nebulae, same composition every
  time) in four interchangeable colour palettes; everywhere else keeps
  the single shared night sky.
- 2026-07-24 (Kimia's call, during the sky merge): **sky colours stay
  JS stand-ins until T5.2**, exactly like `textures.jsx`'s `TEX_COLORS`.
  The `src/ui/sky.jsx` hand-off assumed the CSS design-tokens file
  already existed; it does not (T5.2 is unbuilt), so rather than start
  T5.2 early and leave a half-populated tokens file, `SKY_TOKENS` keeps
  its values in JS with `TODO(T5.2)` markers, to be moved into the
  tokens file in one sweep with the textures when T5.2 lands. Both skies
  are surfaced on the DesignPage workbench first (design-bible §11a step
  d); mounting NightSky as the real app-shell background is T5.2, and
  wiring AbodeSky into the real Abode screen is a later T5.3 step —
  neither done in this merge.
- 2026-07-25 (Kimia's call): **one canonical eye for all friends** — a
  single designed glowing eye shared by every friend; only the number
  and size of eyes vary per individual. Chosen over per-category eye
  styles and free-per-individual eyes for coherence and to keep eyes a
  placeable component rather than 55 redrawings. The eye's actual
  design is picked in the T5.3a workbench session. Folded into
  design-bible §9c.
- 2026-07-25 (Kimia's call): **friend production is hybrid** — Kimia
  hand-draws the 10 category archetypes (raster → Inkscape → SVG, the
  same pipeline as her flora, keeping the world from one hand); code
  assembles texture + eyes + glow and derives the 45 remaining
  individuals from each archetype (size, texture, appendage, eye
  count/size), every variation subject to her approval. Chosen over
  all-hand-drawn (too many drawing hours, hand-drawn eyes would
  undercut the canonical-eye rule) and all-code-drawn (risks the
  engineered feel the bible forbids). Order of work: pilot one plip
  end-to-end first, then all 10 archetypes, then individuals — and
  characters start before the 8 new flora silhouettes land (parked as
  T5.3f). Folded into design-bible §9c and the plan.md T5.3 character
  sub-plan (T5.3a–f).
- 2026-07-25 (Kimia's call, T5.3a): **the canonical friend eye is the
  "orb"** — a plain glowing eyeball with no pupil: bright core → green
  rim, soft green halo, one off-centre catch-light. Chosen from five
  code-drawn candidates (orb · slit · ring · crescent · compound) shown
  on the DesignPage workbench; the orb won as the simplest, most "just
  light" form. Per §3 all candidates glowed the same living-thing green
  and varied only in form — colour/glow were never on the table. Folded
  into design-bible §9c.
  _Build:_ `src/ui/eye.jsx` now holds the single reusable `<Eye cx cy r/>`
  (the orb) plus `<EyeDefs/>` (its two glow gradients: soft halo + lit
  body). The eye scales by radius alone (the §9c rule that only
  number/size vary per friend); `<EyeDefs/>` must sit in the same `<svg>`
  and takes an optional id `prefix` so several eye SVGs on one page never
  share gradient ids. The four rejected candidate components were removed.
  `EYE_TOKENS` colours are JS stand-ins with `TODO(T5.2)` markers, same
  footing as `TEX_COLORS`/`SKY_TOKENS`. The DesignPage workbench now
  shows the chosen eye at small/medium/large (size being the live
  variation); it is the eye the T5.3b bodies get.
- 2026-07-25 (Kimia's call, T5.3b — **reverses the "one green" rules
  of §3/§7/§9c**): **the friend colour language.** Friends no longer all
  glow one canonical green. Instead: **each friend has its own body
  colour and glows that colour**; **eyes are always yellow**, set in a
  **dark ("blackish") socket** rather than a bright halo; and by rule
  **eyes and body are always different colours on every friend**. Chosen
  over the earlier "single green eye, colour never varies between
  friends" (T5.3a) once real colour went on the bodies — a green glow
  can't coexist with coloured bodies, and yellow-in-a-dark-socket makes
  the eyes read as distinct points. Scoped to **friends**; flora/fungi
  keep their green pending their own passes (T5.3f/T6.1). Folded into
  design-bible §3, §7, §8, §9c.
- 2026-07-25 (Kimia's calls, T5.3b): **the pilot plip's recipe** —
  the first friend assembled end-to-end, proving the workflow the other
  nine archetypes follow. Iterated from a first pass (wispy hair / green
  glow / larger eyes) to Kimia's final calls: the plain traced silhouette
  (no hair) wears a **sponge** texture (§8) **tinted its deep-blue body
  colour**, glows that same deep blue, and carries **two tiny yellow
  eyes** (almost dots) as the plip baseline (other individuals vary
  the count/size in T5.3d, never the eye colour). Its **signature
  congratulation animation is a slow "drift-and-bob"** — floats up,
  hangs, settles back, glow swelling with the lift (design-notes §8),
  replacing the T4-era placeholder that drifted sideways. plips are
  the simplest, lowest rung, so the body stays a single quiet surface —
  complexity climbs from here, never via brighter colour or stronger
  glow (§9c). Folded into design-bible §9c and design-notes §8.
  _Build:_ Kimia's hand-drawn winning plip, Inkscape-traced, lives
  verbatim in `src/ui/drifterSilhouette.js` (kept isolated so code never
  edits the trace). `src/ui/plip.jsx` assembles it in four layers
  (deep-blue glow aura → dark-blue body base → the tinted sponge, which
  self-clips to the silhouette via its filter → the two tiny eyes) as
  `<plip prefix/>` + a self-contained `<DrifterDefs/>` (eye gradients,
  glow blur, and the plip's own `<SpongeFilter light=…/>` instance —
  extracted from `textures.jsx` so a friend can tint the sponge to its
  body colour). The shared eye in `src/ui/eye.jsx` was recoloured yellow
  with a dark socket-halo (it is the one shared eye, so this is global).
  Body colours are JS stand-ins with `TODO(T5.2)` markers. The DesignPage
  workbench shows the finished plip resting and mid-greeting; the real
  `friend-drift` keyframe in `index.css` became the drift-and-bob.
  Colours/eye-placement stay free to retune on the workbench — the tests
  pin only the recipe invariants (verbatim trace, two eyes).
- 2026-07-26 (Kimia's calls, workbench maintenance): **the pilot
  plip's body art is rejected and removed** — Kimia judged the
  assembled pilot body not good enough; `plip.jsx`,
  `drifterSilhouette.js` and their tests were deleted and the swatches
  left the DesignPage. The T5.3b **recipe and workflow stand** (they
  produced the woigolp assembly the same week), and the
  **drift-and-bob keyframes stay** in index.css — the in-game plip
  friends still play them via `friend-anim-plip`. A redone plip
  archetype joins the T5.3c ladder pass. Folded into design-bible §9c
  and plan T5.3c. Same session: **the workbench's empty placeholder
  tiles are gone** — the slot grids (charms / friends / map regions)
  and the four empty shelves only pushed real art further down the
  page; assets now appear on the DesignPage as they are made. Folded
  into the DesignPage header comment and its tests.

- 2026-07-27 (bug fix session, T2.3 / T6.5): **an older week shows no
  streak once a habit has changed counting unit.** Reported as a black
  screen: browsing back from the field notes to an earlier week blanked
  the page. Cause — `currentStreak` picks its counting unit (days vs
  weeks) from the habit's schedule TODAY, but the field notes ask it
  "as of" the week on show. For a habit that is N-per-week now and was
  something else then, that made it ask `isWeekFulfilled` of a week
  with no weekly target, which throws by design; with no error boundary
  in the app, React unmounted everything and left the near-black body
  showing. Only that one direction crashed (daily→N-per-week,
  whenever→N-per-week); N-per-week→daily and same-kind changes were
  always fine. Kimia's call: those older weeks show **no streak at
  all** — the existing rule already says switching counting unit
  restarts the streak (2026-07-16), so as of that week the current
  streak had not begun, and blank is what a not-running streak looks
  like everywhere else. (The alternative, resurrecting the day-streak
  that was truly running back then, was declined as more machinery than
  the notes need.) Folded into spec.md §6.
  _Build:_ one guard in `src/game/schedule.js` — `if (today < eraStart)
return 0` right after the era is worked out, so a moment before the
  current counting era simply has no streak, whatever the kind. This
  also makes the week-walk below it safe by construction: every day
  from `eraStart` onward resolves to a week-kind schedule entry.
  Regression tests at both levels (`schedule.test.js` for the engine,
  `fieldnotes.test.js` for the page, which asserts the week still draws
  its marks with a blank streak).
- 2026-07-27 (bug fix session, T6.5): **the app gets a safety net**
  (Kimia's call, made while fixing the above): any screen that fails to
  draw is replaced by one calm full-screen message rather than a black
  nothing. Words are Kimia's, in a content slot
  (`src/content/mishap.js`, mirroring `blocked.js`): something went
  wrong, tell the maker, refresh to get back to habits. Deliberately
  **no in-app way back** — a refresh is the whole recovery, and habits
  are untouched in storage regardless. A net, not a cure: every crash
  it catches is still a bug. Folded into spec.md §3.
  _Build:_ `src/ui/ErrorBoundary.jsx` — the codebase's one class
  component, because React offers no hook for catching render errors.
  It swaps in `.mishap` (styled exactly like the device gate's block
  screen) and logs the real error to the console for diagnosis. Wrapped
  OUTSIDE `ViewportGate` in `main.jsx` so it catches the gate too.
  Tests use a controlled copy fixture, never Kimia's real words, and
  cover both the filled and blank slot.

- 2026-08-06 (docs session): **the README is now a synced doc, enforced
  by a test.** It had sat on "🌱 Early days — in M1" since M1 while the
  app reached M5 — the one document outsiders read, and the one the
  end-of-session doc-sync rule never named. Two fixes, because the rule
  alone had already failed once: CLAUDE.md's sync rule gains clause (c)
  for README.md, and the README's Status section carries a
  `<!-- current-milestone: MX -->` marker that `src/test/docs.test.js`
  compares against the milestone holding plan.md's first unticked task.
  A milestone rollover now fails the suite — deliberately, since a
  failing suite blocks the deploy until the Status prose is rewritten.
  The test reads exactly one fact from each file and is untouchable by
  Kimia's `src/content/` edits, which is the standing constraint on
  anything that can break CI (see the 2026-07-19 and 2026-07-23
  content-coupled test failures above).
  _Also corrected in the same pass:_ the README gained the app's page
  list, the desktop-only device stance (a visitor on a phone otherwise
  meets the block screen with no warning), the documents table, and a
  more accurate description of the storage layer. This is an accuracy
  refresh, **not** T6.3 — screenshots, repo description and the
  demo-friendly first run are still that task's work.

- 2026-08-10 (docs session, T6.4a): **the storage threat, reviewed —
  and the two cheap defences built.** Kimia asked whether five years of
  history in one browser store is a real threat and whether T6.4's
  export nudge was too light a mitigation.
  _Findings:_ **size is a non-issue** — a completion serialises to 156
  bytes, so five years at `TAPS_PER_DAY_ESTIMATE` (3.5/day) is ~6,400
  records ≈ 1 MB against a ~5 MB allowance; even 12 taps/day stays
  inside it. **Eviction is the real threat**: browsers evict a whole
  origin at once, WebKit clears script-writable storage after seven
  days without a visit (so the danger fires exactly during the holidays
  and gaps when the app ISN'T opened), and the data is single-copy and
  not regenerable — losing it loses the map, the friends and the abode,
  since the meters are computed from history. The nudge alone is too
  light for three reasons: it depends on remembering, it can only fire
  when the app is open (blind to its own worst case), and it leaves the
  file on the same laptop. It is kept, as the last line of defence, not
  the first.
  _Rejected:_ **a backend** (Kimia asked whether Habitica's is worth
  copying). Habitica runs Node + Express + MongoDB for multiplayer,
  cross-device sync and a public API — all explicit non-goals in spec
  §3. A server would move the backup problem rather than solve it, and
  add hosting, auth and downtime for one user. Worth stealing from
  Habitica instead: its licence split (code GPL-3.0, art CC BY-NC-SA),
  and the confirmation that schema versioning is the hard part of
  long-lived personal data — which Habitat already does properly.
  _Also decided:_ **no LICENCE file for now** (Kimia's call). Default
  copyright applies, GitHub's ToS still lets people view and fork, and
  a licence can be added later but not easily withdrawn. Revisit at
  T6.3.
  _Build:_ storage schema **v8 → v9** — `settings.lastExportedOn`, a
  day key or null. `exportData(now)` stamps it AFTER building the JSON
  string, so a restored backup reports itself as older than it is; that
  is the safe direction to be wrong in for a number whose job is to
  prompt a fresh export. `requestPersistentStorage()` /
  `isStoragePersisted()` wrap the Storage API with every path guarded
  (`null` = "the browser wouldn't say"), and App asks once, only when
  habits or completions exist. `game/backup.js` turns the marker into
  one plain line; `.backup-age` renders it at 0.55 opacity beside the
  export button. `SCHEMA_VERSION` is now exported so tests assert "the
  chain reaches the current version" instead of a literal that needed
  editing in nine places — this bump broke exactly those nine.
  _Verified in a real browser_ (not just jsdom): the v8→v9 upgrade ran
  on existing data without complaint, export flipped the line from "no
  backup yet" to "backed up today", and a backdated marker read "backed
  up 12 days ago". Chrome **refused** the persistence grant on a fresh
  localhost profile with no engagement history — expected, and exactly
  why the refusal path is silent. On a real profile a bookmark is one
  of the strongest signals toward a grant.

- 2026-08-10 (Kimia's calls, workbench session): **the canonical eye's
  colour is now #ffeeaa on every friend** — a softer, paler yellow
  replacing the first #ffcf1e; the gradient keeps its depth (core and
  rim derived from the new mid: #fffae0 / #d9b44e, eye.jsx). Same
  session: **friend-10.svg lands on the workbench** in the three
  reward-stream pastels, assembled like the woigolp (canonical
  blinking eyes at Kimia's traced placeholders, body-colour glow,
  body/eyes split). Its trace had LOST its darkest layer — the seven
  tonal bands don't overlap, leaving holes through the figure's core —
  so a **reconstructed darkest base** (the sealed outer silhouette,
  computed from all bands with shapely) now sits behind the bands as an
  extra ramp shade. Caveat flagged to Kimia: the seal also closes the
  tendril loops' interiors, which the raster reads as background. The
  idle-blink class was renamed woigolp-eye-blink →
  **friend-eye-blink** (shared by every assembled archetype).

- 2026-08-10 (Kimia's calls, second workbench session of the day):
  **her nine remaining traced archetypes land on the workbench**, each in
  the three reward-stream pastels and assembled to the friend recipe
  (canonical blinking eyes at her placeholders, body-colour glow, the
  body/eyes split). With friend 10 that is the whole cast side by side —
  the T5.3c checkpoint's purpose, though the checkpoint itself stays
  unticked until Kimia says it is met. Four decisions came out of it.
  **(1) The traces are two different animals**, and the file says which:
  friends 01, 02 and 06 are STACKED like the woigolp (a #333 layer
  that is the whole figure, lighter shades on top, nothing lost), while
  03, 04, 05, 07, 08 and 09 are BANDED like friend 10 (non-overlapping
  tonal bands whose darkest layer the tracing lost) and get a
  reconstructed base. Every one was checked on a magenta ground first.
  **(2) The seal is per friend, and much wider than friend 10's.**
  Checked against Kimia's pixel character sheet the first pass still read
  as too gappy — on the sheet these are continuous bodies, not filigree —
  so the seal went to 8x for 03/04/05/07 (+40% to +101% more solid than
  the bands paint), 18x for 08 and 25x for 09. Those two need their own
  numbers because their gaps are not enclosed holes but **bays opening
  outward**, and a seal only closes gaps narrower than itself. The stop
  point is where the outer curls begin welding together: past that the
  filigree goes, which is the real cost of filling harder. Friend 05's
  sealed tendril loops were accepted as they are, the same call friend 10
  got. **(3) Sizes come from the character sheet**, which is now the
  authority on how big each archetype is against the others — not the
  trace canvases, which are export settings. Friend 01 is faithfully tiny
  (1.6rem); friend 10 recomputed to exactly the 11rem it already had.
  Friend 01's eyes came down to 0.55x its placeholders: they were drawn
  at ~7% of its body where every other friend sits near 1%. **(4) The
  woigolp leaves the lineup** — it is not on the character sheet and
  Kimia removed it; `woigolp.jsx` stays only because its header is
  where the body/eyes split is explained. Also this session: the friends'
  colours moved into one shared **grey→pastel table**
  (`src/ui/friendPalettes.js`) — every trace came out of Inkscape in the
  same greys, so retuning a hue is now one edit rather than nine, and
  T5.2's move to design tokens is one file's work. Values are unchanged.
  Noted for later: **friend 01's trace is far coarser** than the rest (a
  64-unit canvas against 174–715), which is why it reads as faceted
  blocks; nothing was lost, and Kimia kept it — its size makes the
  coarseness moot. Folded into design-bible §9c.

- 2026-08-10 (T5.2a, tokens session): **T5.2 is now five slices, and the
  first one is built.** Visual identity was always going to take several
  sessions; plan.md now says so out loud (T5.2a tokens → b palette → c
  typography → d layout → e glow & startup). The tokens file goes first
  because every slice after it becomes an edit to one short list instead
  of a tour of a 1,400-line stylesheet. Three boundaries were decided
  while building it, all folded into design-notes §11d.
  **(1) Colour moved in; glow, type and spacing did not, yet.** §11d asks
  for every colour, glow strength, font size and spacing number. Colour is
  a finished set — 122 literals, 40 distinct, each with a clear job — so
  naming it is pure gain. The others are not: today's four
  near-identical glow radii and the paddings of the ugly-on-purpose
  skeleton are placeholders the §13 layout pass and §11c type scale are
  about to replace. Naming them now would mean naming them twice, so each
  joins the file in the slice that actually decides it.
  **(2) The tokens file holds the colours the STYLESHEET wears; artwork
  keeps its own paints.** This SUPERSEDES the note in the session above
  that friendPalettes.js would move into the tokens file wholesale. The
  friends' 24 pastels, textures.jsx's surface tints and the Abode sky
  palettes are consumed only as JavaScript strings painting SVG — no CSS
  rule reads them, so moving them would buy nothing and cost a second
  hand-kept mirror. They stay beside the drawings, cross-referenced both
  ways. On a schedule, one exception: the night sky's three ground
  colours become real stylesheet colours when §13c mounts it as the app
  background, and move then. The charm colours are the opposite case —
  CSS and JS both need them — which is exactly why §11d's mirror rule
  exists for symbols.js.
  **(3) The tokens file gets a guard test**, on the same reasoning as the
  README's milestone marker: a rule that only lives in a comment has
  already been shown to fail. `src/test/tokens.test.js` fails the suite
  if a raw colour reappears in index.css, if a rule asks for a token that
  is not defined, or if symbols.js drifts from the canonical charm hexes.
  Like docs.test.js it reads files as text and touches nothing in
  `src/content/`, so no edit of Kimia's can break the deploy through it.
  **(4) Prettier no longer touches the documents** (`*.md` added to
  `.prettierignore`). Found the same day, by cause: plan.md's T5.3 and
  T6.4 sub-plans had been folded into run-on paragraphs — nine tick-boxes
  gone — and the culprit was `npm run format`. Prettier's markdown
  formatter reads an indented sub-task list as continuation prose and
  flattens it; adding the blank line that makes it a "real" list only
  moves the damage, because it then re-nests the whole block one level
  deeper on every subsequent run, so the file never settles. CI runs
  tests and oxlint and has never run Prettier, so nothing depended on
  the formatting it was imposing. Code stays formatted; hand-wrapped
  prose is ours. (The nesting itself was repaired first, in its own
  commit.)

- 2026-08-10 (Kimia's calls, after the tokens session): **the ten
  archetypes pass the T5.3c checkpoint** — she is happy with them on the
  eyeball test, so the ladder is done and the cast reads as one family.
  Two rules came with the approval, and both are now plan tasks.
  **(1) The canon is the RATIO, and it holds everywhere and always**
  (new T5.3d, folded into design-bible §9c). Her words: the sizes must
  remain true in relation to each other, "not necessarily in absolute
  values", everywhere and always. So a friend has no fixed size — it has
  a place in one ordered scale, and every screen that draws friends
  picks its own base size and multiplies. Today's canon fails that test
  in three ways: it is absolute rem, it is split between
  `tracedFriends.js` (nine friends) and one CSS rule (friend 10's
  11rem), and its home is a file marked temporary that leaves with the
  workbench — so the cast's proportions would die with the shelf they
  were measured for. The fix is one unitless table in a permanent home,
  every render site deriving from it, and a test, because "always" is a
  promise a comment cannot keep.
  **(2) The beings' names are copy, and copy is human-written** (new
  T6.1a). The ten species names were Claude-drafted on 2026-07-20 and
  put in `src/game/constants.js` deliberately, as game data rather than
  narration. Kimia has reversed that: they are words the player reads,
  so they are hers. The stable keys stay in code (the save file and the
  tests reference them); the WORDS move to `src/content/`, where she
  edits on GitHub. Individual names — 45 — have no home at all yet, since
  a friend is still announced as "a plip"; T6.1a builds keyed, blank
  slots for both and ships them empty, per design-notes §7.
  _Also noted:_ nothing in the repo tells her where her copy lives. The
  content files explain themselves in their own headers, and AGENTS.md
  names the folder, but the README — the doc she is most likely to open
  — says nothing. Worth fixing when T6.3 rewrites it.

- 2026-08-10 (T6.1a, names session): **every species and individual
  name is now Kimia's to write, and the drafts are out of the app.** The
  ten names Claude drafted on 2026-07-20 lived in
  `src/game/constants.js`, classed as game data on the reasoning that a
  category label is a mechanic, not a story. Kimia has reversed that:
  they are words a player reads, so they are copy, and copy is
  human-written. `FRIEND_CATEGORIES` now carries `key` and nothing else.
  **The names live in `src/content/names.js`** — a new file of hers,
  built to the narration.js pattern: 10 species slots, 55 individual
  slots (one per friend the roster can ever send), all blank, plus the
  readers that trim them and return null when empty.
  **The display ladder** (new, and the reason individuals can wait): a
  friend shows its own name if it has one, else its species name, else
  NOTHING — no stand-in, no "a friend". So filling ten species slots
  names every friend in the game, and individual names are a finer pass
  she can do one at a time, for years, with no half-named state ever
  looking broken. Every screen that names a friend — Guest Book list and
  card, arrival reveal, home-screen cameo — asks the one function, so a
  name she writes appears in all of them at once.
  **Two deliberate exceptions to "show nothing".** (1) The Guest Book's
  buttons and card keep an accessible name when the slot is blank — the
  plain functional word "friend", heard by screen readers, never seen,
  exactly the standing the charms' shape names have (T5.1). A control
  with no accessible name is unusable, and that is not a copy question.
  (2) The arrival shelf's sentence ("you came across …") falls back to
  "a friend", because that line must name something and the honest
  generic beats a species name Claude invented — it sits with "a flora
  find" and "a magazine" as functional UI wording, not story.
  **The keys stay as they are, and that is a wrinkle worth knowing.**
  `plip`, `baluhm` … remain in code as permanent internal ids: they
  order the ladder, name the CSS animation classes and key the narration
  slots Kimia has already been filling (`friendIntros.plip`).
  Renaming them would churn her file mid-edit for no gain, so the key
  `plip` may well end up holding a species she calls something else
  entirely. names.js says so at the top.
  _Tests:_ ten tests across five files were asserting the drafted names
  — the exact copy-coupling that has broken CI twice. They now use
  `src/test/nameFixture.js`, a controlled fixture that sets a name,
  restores it after, and asserts behaviour (a name shows; a blank shows
  nothing) rather than words. New `src/content/names.test.js` guards the
  file's SHAPE: one species slot per category, one individual slot per
  roster place, 55 in total, and no display word creeping back into
  `FRIEND_CATEGORIES`. Full suite 998 and oxlint pass; the app boots and
  the Guest Book opens clean in a real browser.
  _Found while doing it, and NOT fixed here:_ **the 55-friendship cap is
  documented everywhere and implemented nowhere.** spec §5, design-bible
  §9c and CLAUDE.md all say a category refills only until its roster is
  exhausted, but `nextFriendDue` computes the next individual as
  "however many have arrived, plus one", with no ceiling — so an
  eleventh plip would arrive years from now, and there is no name
  slot for it. The roster now exists in code as `FRIEND_ROSTER` for the
  name slots to be measured against, which is the groundwork; enforcing
  it is a behaviour change to the friendship stream and wants its own
  task and its own tests. Flagged to Kimia the same day.
- 2026-08-11 (T6.6, Kimia's calls): **starting a new game keeps the
  habit record.** Kimia asked for a way to wipe her game progress in
  the app and go again from nothing, WITHOUT losing her habit data. The
  two are entangled by design — the world is derived from history, not
  stored beside it — so this needed a decision about what "habit data"
  means, and she chose the strongest reading: **habits AND every
  completion survive, and the world genuinely restarts.** Grid,
  streaks, graphs, field notes and the check-in are untouched; the
  planet begins again.
  **Two mechanisms, because the world hangs off history two ways.**
  Drops are stored ON completions, so a new game empties every
  completion's drops list — and that alone resets the literacy meter,
  the fungus wallet, the bookcase, the guest book and every flora find,
  since all of them are derived from drops (the same move the v2→v3
  upgrade made on 2026-07-19). But the expedition meter, region
  discovery and the Market's lived-day rotation COUNT completions
  rather than read them, and emptying drops does nothing to those. So
  each existing completion is stamped `pastGame: true` and the game
  side reads only `gameCompletions()` (`src/game/newgame.js`). The
  world seed is replaced too — drops are a pure function of seed plus
  tap, so keeping it would have made the new game a note-for-note
  replay rather than a new planet.
  **Why a stamp and not "everything recorded after the reset".** A
  timestamp boundary was built first and was wrong twice over. It has
  to decide what happens to a mark made in the same millisecond as the
  reset and gets it wrong whichever way it leans (the App tests caught
  exactly this — a completion survived its own reset). And filtering on
  the DAY instead would have swallowed the next morning's check-in,
  which always asks about yesterday and would therefore always be
  marking days from before the fresh start: a reward that never comes
  is punishment by omission, which spec §3 forbids. A stamp put on the
  exact records being retired has no boundary to land on, and stays
  right through an undo, an import and a second new game later.
  **The guard is a forced backup** (Kimia's choice over a typed
  confirmation): "start a new game" is disabled until a backup has been
  exported IN THIS VISIT — not "today", not "recently", because only a
  file saved just now holds the world about to be discarded. Then it
  still asks, naming exactly what goes and what stays. Quiet register
  throughout: no alarm colour, no tally of what is about to be lost.
  **The cameo needed splitting.** `cameoWin` counted one list for two
  different kinds of win; a lived-day milestone is game progress and
  now reads the played list, while a record streak is a fact about
  Kimia's real life and must see the whole record — otherwise a fresh
  start would hand out a bogus "record" on day one. It takes `played`
  as an optional last argument, defaulting to the full list.
  _Found while doing it, and fixed here:_ `upgradeV7toV8` stamped
  `SCHEMA_VERSION` instead of the literal `8`, so it silently skipped
  every later upgrade step in the chain. Harmless until v9 → v10 gave
  it something to skip; the storage tests failed the moment it did.
  Both it and `upgradeV8toV9` now stamp their own number.
  _Tests:_ new `src/game/newgame.test.js` (24 tests, including the
  frozen-clock case that killed the timestamp design and a second
  start-over) and `src/storage/storage.test.js`'s v9 → v10 block; six
  App tests drive the real button — the guard, the cancel path, the
  wipe, marks counting again afterwards, and a reload. Full suite 1026
  and oxlint pass.

- 2026-08-11 (Kimia's calls, copy pass before T5.2b): **the check-in
  stops introducing itself and just asks the question.** The `<h2>`
  reading "check-in" and the line under it — "Mark what you completed
  yesterday, Mon 2026-08-10." — are replaced by one heading: **"what
  did you do yesterday?"** The button under it is now just **"done"**.
  The word "check-in" survives only as the panel's accessible name,
  which nothing draws on screen.
  **The date is dropped on purpose, and that is the interesting part.**
  Naming the day was the one place the screen confirmed which day a
  mark would land on — spec §2's date attribution made visible. Kimia
  weighed it and chose the plainer question anyway: the check-in only
  ever asks about yesterday, so the sentence carries the fact that the
  date was merely evidencing. The rule itself is untouched; only its
  caption is gone.
  _What this cost the tests, and what replaced it._ Twenty-odd
  assertions in `App.test.jsx` read that wording — `getByText('check-in')`
  and `/yesterday, Wed 2026-07-15/` — exactly the free-floating prose
  CLAUDE.md tells us not to assert. They now query the region by role
  and accessible name. The "is it asking about the right day?" claim
  has no on-screen text left to read, so it is proved two better ways
  instead: where a mark actually lands in storage, and which days
  appear in the OPTIONAL earlier-this-week list — yesterday's absence
  from that list is what identifies it.
- 2026-08-11 (Kimia's call): **the question and the way out are centred;
  everything between them stays left.** `.check-in > h2` and
  `.check-in > button` centre — they address you, so they face you.
  Yesterday's habit rows and the optional earlier-days section are
  lists, and lists read from the left. The child combinator is load-
  bearing: without it the centring would reach the `+1` and `-1`
  buttons inside every row.
- 2026-08-11 (Kimia's call): **the schedule shapes say `n`, not `N`.**
  "n days a week" and "n times a day" in the habit form — Habitat's
  voice is lowercase (design-notes §11c), and a capital in the middle
  of a lowercase list read as a shout. The capital N survives in code
  comments and prose, where it is standing for a mathematical variable,
  not talking to Kimia.
- 2026-08-11 (T5.2b, palette session): **the §11b identity is on, and
  the tokens file paid for itself.** The ground went to `#080910`, the
  neutral borders became dim-white hairlines, panels became a white
  wash, and the six charm colours became the everyday accent. The whole
  change was an edit to `src/tokens.css` plus about a dozen lines of
  index.css — which is exactly the promise T5.2a was built on, now
  tested rather than asserted.
  **The accent rule, decided today because §11b did not say.** "The
  charm colours double as the app's accent palette" leaves open what a
  button or a panel edge does when no charm is attached to it. Kimia's
  answer: **charm colour where there is a charm, neutral dim white
  everywhere else.** So a habit row is edged in its own charm's 0.18
  variant — in the list and in the check-in alike — and so is a
  picker/filter chip, while general chrome stays neutral. The colour
  always means the charm; it never decorates. The alternatives were one
  house accent for all chrome, and a colour per page; both were set
  aside as louder than Habitat's register.
  **How CSS learns which charm a row wears.** The row gets a
  `charm-1`…`charm-6` class alongside its own, and six rules in
  index.css translate that number into `--charm-here` and
  `--charm-here-faint`. Every rule below then says
  `var(--charm-here-faint, var(--border))` without knowing which of the
  six it got — and falls back to the neutral hairline if it got none.
  The class carries the NUMBER only; the colours stay in tokens.css,
  which is what keeps them a list Kimia can scan and edit.
  **The dim text tiers were reversed** — §11b called for body text at
  58% white; Kimia compared it against today's near-white and kept
  today's, because habit names are what she scans fastest each morning.
  Recorded in §11b rather than quietly dropped: the tiers are one line
  away if she changes her mind.
  **Borders are now light, not colour, and that is the reusable
  lesson.** The old borders and panel fill were opaque blue-greys mixed
  against the OLD background, so moving the ground would have meant
  re-mixing every one of them. Their replacements are white at low
  alpha, which sits correctly on any ground. The dragged row is the one
  deliberate exception — it stays opaque, because a translucent row
  would show the rows it is passing over.
  _Two things the tokens test learned._ It failed twice, both times
  correctly pointing at something real. It counted a token name that
  appeared only inside a COMMENT as a genuine use, so a comment
  explaining `var(--charm-here)` failed the suite for describing the
  code accurately — comments are now stripped before anything is
  counted. And it only accepted definitions from tokens.css, which the
  `.charm-N` plumbing legitimately needed to do in index.css; it now
  accepts either file. Neither loosens the guard that matters: index.css
  still may not contain a colour literal at all, so a name defined there
  can only ever pass along a value from the palette.
  _Verified in the browser, not just in tests_ — a palette change is
  invisible to the suite by definition. All six rows resolved to their
  own charm colour, the ground to `rgb(8,9,16)`, the meter panel to the
  3% wash, and habit-name text to the unchanged `#e8e6f0`.
  _Found while looking:_ removing the check-in's dated paragraph earlier
  in the session had left the question butting onto the first row and
  the done button onto the last — that paragraph had been holding them
  apart by accident. Both got explicit margins.
  _Also noted, not fixed:_ the `+1` / `-1`, backup and new-game buttons
  have never been styled, and now that everything around them is quiet
  they are the brightest thing on screen. That is a type-and-control
  job, so it waits for T5.2c/T5.2d. Recorded in §11b.
  _Tests:_ full suite 1026 and oxlint pass.
- 2026-08-11 (Kimia's revision, same session, after seeing T5.2b live):
  **the accent became a fill, not an outline.** Her verdict on the first
  version was that she did not like how the accents looked, and the
  diagnosis is worth keeping: a 1px charm-coloured border reads as an
  OUTLINE — a hard edge drawn around a grey box — rather than as the
  row's identity. Three changes followed.
  **Task tiles are long baguettes.** Rounded (`--radius-tile: 999px`)
  until both ends are half-circles, and filled with their own charm at
  `--charm-fill-strength` (9% to start). The faint 0.18 border stays —
  Kimia's call over dropping it, so the tile keeps its definition.
  Horizontal padding went up to 1.25rem: at that radius the ends curve
  inward and the charm sat in the curve.
  **The fill is mixed, not stored.** `color-mix(in srgb,
  var(--charm-here) var(--charm-fill-strength), transparent)` dilutes
  whichever charm the row wears down to one named strength, so tuning
  the colour is ONE number rather than six new tokens — which matters,
  because Kimia is tuning it by eye. `--charm-fill-strength` and
  `--radius-tile` are the first non-colour values in tokens.css; they
  arrived early for exactly that reason, ahead of the spacing and type
  scales that T5.2d will bring properly.
  **The dragged row needed two background layers.** It must stay opaque
  (it hides the rows it passes over) but must not lose the colour it had
  a moment earlier, so the charm fill sits on top of the opaque lifted
  ground as a second background layer.
  **The charms lost their boxes and moved to the centre.** They are
  drawings and do not need frames. The box had been carrying the on/off
  state, so that moved to presence: `.symbol-picker--choosing` fades
  every unselected charm to 0.3, and the class is absent when nothing is
  selected, so a resting filter shows six charms at full strength rather
  than six dimmed ones. In the habit form, where exactly one is always
  selected, the same rule reads as "this is the one you picked" for
  free.
  _A new browser-pane trap, worth knowing._ The fade LOOKED broken:
  `getComputedStyle` reported opacity 1 on the faded charms even though
  the rule was in the stylesheet and the element matched the selector.
  It was neither. The pane's tab runs hidden, and while CSS keyframe
  ANIMATIONS keep running there (noted 2026-07-26), CSS TRANSITIONS do
  not advance — the value was frozen at its start. Setting
  `transition: none` returned 0.3 instantly. To screenshot a
  transitioned state in the pane, inject `*{transition:none !important}`
  first and remove it after. Do not "fix" a transition that is only
  stalled.
  _Tests:_ full suite 1026 and oxlint pass, unchanged — every one of
  these is a visual property no test asserts, which is why it was all
  verified in the browser.
- 2026-08-11 (Kimia's calls): **two things to revisit became plan tasks
  rather than notes** — T6.7, the storytelling and narration a brand-new
  player meets in their first hour, and T6.8, more graph and data views
  in the field notes. Both are "revisit and decide" tasks: the scope
  gets agreed with Kimia at the start of the session, not now. T6.7 is
  deliberately placed before T6.3, whose "demo-friendly first-run
  experience" is the same ground seen from the portfolio side.
- 2026-08-11 (Kimia's call, after living with T5.1c): **the whole habit
  tile is the grab area for re-ordering, not the grip alone.** Press
  anywhere on a row — charm, name, meta line, empty space — and pull it
  up or down. This reverses the T5.1c reasoning that a dedicated handle
  was needed to keep the row's taps unambiguous: in use, hunting for a
  six-dot target to move a row was the friction, and the taps stay safe
  anyway because a press that lands on a control (+1, -1, the to-do
  tick, edit, archive) is left alone and the 4px travel threshold means
  a stationary press is still just a press. **The grip stays** — now
  purely the visible "this moves" cue, and still the thing that dims
  with its explanation while a symbol filter is on.
  _Tests:_ two added — dragging a row by its NAME re-orders it, and a
  press on +1 that drifts down the list counts the habit without moving
  it. Full suite 1028 and oxlint pass.
- 2026-08-11 (Kimia's calls, second spontaneous pass the same day):
  **the draft tile and the button shapes.** Six decisions, all hers:
  1. **A new draft opens on the filtered charm** when the filter is
     showing exactly one. Filtering to one charm and then adding a habit
     almost always means "another one of these". Two or more charms
     filtered is no longer a hint, so the draft falls back to charm 1;
     editing an existing habit always shows that habit's own charm.
  2. **The charms move to the top of the draft tile and centre** — the
     charm is the first thing she picks, and a centred row of six reads
     as a choice rather than as a field.
  3. **The draft tile's corners are rounded.** NOT the saved tiles' full
     pill: asked directly, she chose the softly-rounded rectangle
     (`--radius-form`, 1.5rem) once it was clear that a 999px radius on
     a tall box curves its whole sides inward and squeezes the fields.
  4. **The form's prompts are sentences, not nouns** — "write a good
     habit or task:", "add any details or specifications:", "pick a
     difficulty per unit:", "specify the desired schedule or
     frequency:". Each sits above its own field (the old side-by-side
     row cannot hold a sentence), and **save and cancel are centred at
     the foot with a wide gap** between them.
  5. **Every named button is an oval; the counters are circles.** The
     list of "named buttons" is hers, drawn deliberately: save, cancel,
     +1, -1, the to-do tick, export/import/start-a-new-game, the field
     notes' earlier/later, "back to the habits" everywhere it appears,
     the market's buy, the check-in's done, and the close on the reading
     and friend cards. Everything else — the icon-only furniture (grip,
     pencil, archive, the foot-of-list trio, the left rail) and the
     charms themselves — keeps its bare, boxless look. +1, -1 and the
     tick are one control in three moods, so they are one diameter and
     one shape; the tick stopped being the browser's square box and
     became a circle that FILLS with its charm when ticked (which
     retired the `--tick` blue).
  6. **A button borrows its outline colour from the tile it sits on:**
     the charm on a saved habit tile, plain white everywhere else
     (`--button-edge`). Open text fields are rounded "like baguettes" —
     the same full pill, which also took in the two dropdowns, since a
     square select beside a pill field would have looked like an
     oversight.
  _Tests:_ one added (a draft opens on the filtered charm when exactly
  one is on, and on charm 1 when two are). The form's fields are now
  found in tests by a stable `name` attribute instead of their visible
  prompt — this copy pass rewrote every prompt, and a test that hunts
  for Kimia's words breaks on every one. Full suite 1029 and oxlint
  pass.

- 2026-08-11 (Kimia's calls, an hour after the shapes landed): **four
  follow-ups.**
  1. **The archived list's `-1` joins the button list** — the undo on a
     to-do ticked off today. It is the same control as the `-1` on a
     tile, so it is now the same circle, and it borrows the charm of the
     habit it belongs to (the archived row carries its `charm-N` class
     for exactly that).
  2. **Softer outlines, across every colour.** The shapes were right and
     the edges too loud. Rather than a second palette of near-whites,
     every button edge — the white ones and all six charm ones — is
     diluted live by ONE number, `--button-edge-strength` (38% to
     start), the same trick as the tile fill. The tick-box's FILL keeps
     full strength: it is a mark, not an edge.
  3. **The graph line's corners are rounded.** Her constraint was
     explicit — keep the precision, only lose the sharp corners — so
     this is not smoothing: no resampling, no averaging, no invented
     readings. At each turn the line stops a few units short, curves
     through using the corner itself as the pull, and carries on; every
     straight run is exactly where it was, and nothing moves further
     from a reading than the corner radius (6 viewBox units, shrinking
     automatically on short segments so a dense day-by-day line simply
     rounds by less). `src/ui/graphPath.js`, tested on its own.
  4. **An archived tile is seen to leave.** It used to blink out of
     existence the instant it was archived — by the archive button or by
     ticking off a to-do — which read as a glitch rather than as
     something happening. Now the tile is left on screen for
     `ARCHIVE_FAREWELL_MS` (420ms), sinking, fading and closing its own
     gap so the tiles below glide up instead of jumping. **The
     archiving itself is not delayed**: the data is written immediately
     and the lingering tile is an inert copy that answers to nothing —
     so no rule, no test and no reload can be caught mid-farewell.
  _Tests:_ seven added — six on the corner geometry (ends stay put,
  straight runs stay straight, a turn is rounded by no more than the
  radius, short segments shrink it, a repeated reading draws no
  nonsense) and one on the farewell (the tile lingers, inert, then
  goes). Four existing archive tests now wait the farewell out through a
  named helper. Full suite 1036 and oxlint pass.

- 2026-08-11 (Kimia's calls, a third pass the same day): **five UI
  changes — the lens goes everywhere, the drag floats, the grip goes.**
  1. **The charm lens narrows the whole screen, not just the live
     list.** The archived drawer now holds only the archived habits
     wearing the chosen charms (and counts only those — the drawer
     simply isn't there when none of them do), and the lens travels to
     the field notes, where the same row of charms sits at the top of
     the page and narrows the week grid, the completed tasks and the
     graphs alike. Still ONE lens, still held on the home screen, still
     cleared by a reload — the field notes just read it and can toggle
     it. The marks travel with their habits when the lens is applied, so
     the graphs and the "how far back can I browse" bound agree with the
     grid rather than reaching back to a habit that is filtered out.
     Narrowing the lens can strand the week being browsed outside what
     is left; rather than yank the state about, the week is held inside
     its bounds as it is drawn.
  2. **The dragged tile floats.** It was welded to the cursor, which
     read as sharp and mechanical; the transform is now transitioned
     (420ms, ease-out), so the tile eases toward wherever the pointer
     has got to, trails a little behind a quick pull and glides into
     place when the hand stops. It also lifts as it travels (scale 1.02,
     the existing shadow, its charm edge lit). Where it LANDS is
     unchanged — the drop still reads the real pointer position, so the
     float is purely how it looks. Reduced-motion keeps the instant
     follow.
  3. **The dragged tile actually covers what it passes over — a real
     bug, not a taste change.** `.habit-row--dragging` was trying to
     stack a see-through charm layer over an opaque one inside a single
     `background:` shorthand. A multi-layer background may only carry a
     colour in its FINAL layer, so the declaration was invalid; because
     it contained `var()`, CSS didn't ignore it and fall back — it
     treated it as unset, wiping the tile's background to nothing. The
     dragged tile had been fully transparent since T5.2b. It is now one
     property: the charm mixed INTO the opaque lifted ground at
     `--charm-fill-strength-lifted` (26%, new token beside the resting
     9%). Same one-number recipe, an opaque result.
  4. **The six-dot grip is retired.** Once the whole tile was the handle
     (earlier the same day) the grip was a cue for something already
     obvious, and it read as clutter at the end of every row. Its one
     remaining job — explaining why nothing drags while a filter is on —
     moved onto the tile itself, which carries that hover and no other.
  5. **The field notes' week header.** "week of" is gone and the dates
     are DD-MM-YY (`03-08-26 – 09-08-26`, new `shortDate` in days.js),
     and "still unfolding" sits on its own line under them. It used to
     run inline, where it lengthened the middle of the nav row enough to
     wrap "later" onto a second line — leaving both buttons stacked on
     the left. The row is now forbidden to wrap, so the two buttons keep
     the two ends.
  _Tests:_ four added — two on `shortDate` (the turn-around, and that it
  still refuses a non-key), one that the lens narrows the archive
  drawer, one that it travels to the field notes and can be changed
  there. The drag tests now grab the tile itself rather than the retired
  grip, and the field-notes test reads the new header. Full suite 1040
  and oxlint pass; the drag, the lens and the header were also checked
  in a real browser against seeded history.

- 2026-08-11 (Kimia's review of the pass above): **three of the five
  landed as asked; two needed more.**
  1. **The field notes are two boxes with the lens outside both.** The
     charms had been dropped inside the page's single outline, where the
     section's `align-items: flex-start` left them small and hard against
     the left edge — nothing like the home screen's centred row. They now
     sit ABOVE the outline as a sibling of it, which is not a styling fix
     but a structural one: as a direct child of the page column they
     inherit the identical layout the home screen gives them (measured
     the same to the pixel — same left, same width, same charm size).
     The outline now begins just above the earlier / later buttons, and
     the graphs have an outline of their OWN: two ways of looking, two
     boxes, with "back to the habits" below both. The graphs box draws
     its own frame from inside `HabitGraphs`, so a page with nothing
     graphable yet shows no empty second frame.
  2. **"still unfolding" is smaller** (0.75rem): it names something
     already obvious, so it is a footnote for whoever missed it.
  3. **The drop needed all three things it was missing.** (a) There was
     no glide — the tile snapped into its slot, because nothing animated
     the gap between where it was let go and where it landed. It is a
     FLIP now: the list re-orders, then the tile is put back visually
     where the hand left it and released, so the existing 420ms easing
     carries it home. (b) The highlight is HELD after the landing for
     `DROP_SETTLE_MS` (1000ms, constants.js) and then fades back over
     600ms rather than being switched off, so the landing can be found
     by eye. (c) **The landing slot now follows the tile, not the
     pointer** — this reverses the note in the entry above, which was
     written when the float was new and the lag looked harmless. It
     isn't: on a quick drag the tile is visibly elsewhere, and dropping
     it where the hand happens to be reads as the app disagreeing with
     its own screen. The rule is now "the row whose middle the tile's
     middle came to rest nearest", with the dragged row's OWN empty slot
     (measured at the press, since nothing around it moves during a
     drag) standing in for it in that comparison. That last part also
     fixes a bug the pointer rule had all along: because it only ever
     asked which OTHER row the pointer had passed, a nudge of a few
     pixels sent the middle row of a list to the top.
  _Tests:_ two added (a nudge inside a tile's own slot moves nothing; a
  dropped tile stays lit where it landed, then settles back). The three
  drag tests share one `layOutRows` helper whose dragged row's box
  TRAVELS with the drag — under the new rule a parked box would be
  describing a tile that never moved. Full suite 1042 and oxlint pass.
  Browser-checked: the two pickers measure identically, the drop lands
  where the tile is, and `getAnimations()` shows the glide running on the
  settling tile. (The glide's motion itself can't be watched in the
  in-Claude pane — hidden tabs freeze CSS transitions, see the note in
  CLAUDE.md.)

- 2026-08-12 (Kimia's bug report): **the glide started from the wrong
  place, and only an upward drop showed it.** She saw a tile dropped
  higher up the list fly from its OLD slot rather than from where she
  had been holding it. One line was to blame, and it was the
  measurement, not the maths: by the time the glide is set up, React has
  already taken the drag's inline transform off the tile — but removing
  a transform from something carrying a 420ms transition does not put it
  back instantly, it starts it travelling back. So measuring the tile
  right then does not give its new slot; it gives roughly where the hand
  was still holding it. Both readings then carried the same offset, it
  cancelled out of the subtraction, and the glide ran between the two
  SLOTS instead of from the hand. Downward drops were wrong in exactly
  the same way — a tile flying from its old slot down to its new one
  merely happens to look like a row sliding into place, which is why
  only the upward case read as a fault. The fix is two lines before the
  measurement: turn transitions off and the transform off outright, so
  the tile is measured at its real resting place.
  _Not unit-tested, deliberately:_ the bug only exists where CSS
  transitions run, and faking one in jsdom would mean hand-writing the
  very assumption under test. Verified in the browser instead, by
  measuring where the glide begins with the fix in and with it out
  (upward drop: 203 held → starts at 202 with the fix, 401 without,
  against an old slot of 402), and re-checked downward. The technique —
  suspend only the DRAG transition so the tile really travels, and read
  the result from a `setTimeout`, since React does not commit inside
  `dispatchEvent` — is now written down in `.claude/skills/verify`,
  along with a correction to that file's re-order line, which still
  described the ▲▼ buttons retired in T5.1c.

- 2026-08-12 (Kimia's calls, second pass the same day): **five UI
  changes — the rail takes the doers in, an empty list invites instead
  of apologising, the home screen's foot becomes three clean buttons,
  and two bits of copy change.** All of it one session's work, tests and
  docs included.

  1. **The party toggle names its parts on hover.** The switch says
     "pick your mood", the stone side "quietude", the gathering side
     "party mode". The switch's ACCESSIBLE name stays "party mode" —
     a switch has to say what it turns on, and on/off is what
     `aria-checked` reports — so for once title and aria-label differ
     on purpose. While no friend exists the whole thing still says
     "not yet" and nothing else: one honest answer beats three labels
     for something that cannot be done. Two implementation notes worth
     keeping: the two glyphs needed SPAN wrappers, because `title` is
     an HTML attribute and an `<svg>` is not obliged to honour it; and
     the "not yet" has to sit on the outer wrapper, because a disabled
     button fires no hover events and would never show a tooltip of
     its own.
  2. **The three doers moved from the foot of the habit list into the
     left rail**, above the five places, in the order they already had:
     + (add a habit) · pencil (edit past days) · graph (field notes).
     They took the rail's look wholesale — 1.5rem glyph, 1.4 stroke,
     dim-white at rest, brighten-and-glow on hover, no press animation
     (the rail never had one) — so the rail now reads as eight icons in
     two groups. The + became a drawn glyph rather than a typed "+" so
     its line weight could match. Hover colours: sky for +, the only
     charm the five places never used; the pencil keeps the gold it
     carried at the foot (2026-07-20's "two pencils, told apart by
     colour" still holds — the small dim one on a habit row is the
     other); teal for the graph. The pencil still appears only when a
     past day is editable. **Because the rail is on every screen but the
     check-in**, the + now carries us home before opening the draft —
     the form is only ever drawn in the habit list.
  3. **An empty habit list holds an invitation, not an apology.** The
     old "nothing here yet" is gone; in its place a tile of the same
     baguette shape reading "add a habit or task…", which opens the
     draft form — the same door as the +. With no lens on it is
     neutral. **In filter view there is one tile per chosen charm**,
     each wearing that charm's fill and edge, and clicking one opens
     the draft already on THAT charm. That last part supersedes nothing
     from 2026-08-11's "one charm filtered is a hint" rule — it sits
     above it: the tile says the charm outright, the single-charm lens
     is still the fallback hint, and two-or-more charms with no tile
     clicked still lands on the form's own default.
  4. **The foot of the home screen is three clean buttons** — export,
     import, start a new game — centred on one line, with no text
     beside any of them. The two explanations that used to sit there as
     small grey text became hover labels: the backup's age (T6.4a) is
     now the export button's title, and "export a backup first" is the
     title on a SPAN around the dimmed new-game button. Nothing was
     dropped; both facts simply moved to where every other explanation
     in Habitat lives.
  5. **Two copy changes.** The check-in's optional section reads
     "update earlier days of this week before they freeze forever:",
     and **dates follow one convention from here on: "mon DD-MM-YY"** —
     lowercase weekday, then the day-first short date the field notes
     already used (`days.js` shortDate). The check-in's day summaries
     were the last place still printing a raw `2026-07-13`.

  Tests: 1042 → 1059, all passing, oxlint clean. The new ones assert
  the rail's full order, the pencil's condition, that the + from a
  world page lands home with a draft, the tile's count and charm in
  every state, the charm a clicked tile opens on, and that the two
  hover explanations are titles rather than text. The backup-age test
  moved from reading a `.backup-age` element to reading the export
  button's title, and the check-in date assertions were rewritten to
  the new convention. Browser-checked: the rail's eight labels in
  order, the foot centred on 640 of a 1280 window, two coloured tiles
  under a two-charm lens, a shield tile opening a shield draft, the
  toggle's layout unchanged by its new span wrappers, and the
  check-in's "mon 10-08-26".

- 2026-08-12 (Kimia's calls, third pass the same day): **the two pages
  become a pair, and starting over becomes a choice of two.**

  1. **The home screen and the field notes point at each other.** The
     field notes already ended with a wide, plain "← back to the
     habits"; the home screen now ends with its twin, **"view
     historical data →"**, in the same shape and the same place (above
     the three footer buttons). Both are wide only because they are
     direct children of the app's column — no new rule, just the
     column's own stretch.
  2. **The three footer buttons appear on the field notes too**, right
     under the back button. Export, import and start-a-new-game are
     the actions you might want _while looking at the record_, and
     making a backup should never need a trip home first. One shared
     fragment in App, rendered on both pages, so they can never drift
     apart.
  3. **Starting over is now TWO doors, asked in a popup** rather than
     one `window.confirm`. Step one asks Kimia's own question — wipe
     the habit history and play again, or keep the history and restart
     the game — and offers **"total refresh"** and **"keep habit
     data"**, plus a "not now" that changes nothing (her two choices
     plus the way out every popup needs). Step two asks **"are you
     sure?"**, names exactly what goes and what stays for the door
     chosen, and answers **"yes"** / **"no, take me back"** — the
     latter returning to the choice rather than closing, so nobody is
     dropped out of a door they were still standing in.
  4. **Total refresh is new behaviour**: not a new game inside the same
     Habitat but a brand-new Habitat — habits, every completion, the
     whole world and every setting gone, exactly as on the first ever
     launch. It needed no new game logic and deliberately got none:
     nothing is carried over, so there is no decision for a pure
     function to make. `clearData()` then `loadData()` — which returns
     the empty, freshly-seeded envelope a first visit gets — is the
     whole of it, with the two-step confirmation as the only guard.
  5. **The backup guard moved inside the popup, and onto the other
     door.** "start a new game" now always opens; it is **"keep habit
     data"** that stays dimmed (hover: "export a backup first") until a
     backup has been exported in this visit. Kimia's call, and it is
     the door she asked to guard: a total refresh is the deliberate
     throw-it-all-away choice, and its own "are you sure?" says so in
     as many words. The disabled-button tooltip still rides on a
     wrapping span — a disabled control fires no hover events.

  A total refresh also clears the charm lens, which the keep-data door
  does not: with no habits left, a screen wearing yesterday's filter
  reads as a fault.

  Tests: 1059 → 1068, all passing, oxlint clean. The old T6.6 tests
  drove `window.confirm`; they were rewritten to drive the popup, and
  joined by new ones for the two-step journey, "not now", "no, take me
  back", a total refresh emptying storage and surviving a reload, and a
  habit created afterwards saving cleanly. The two-pages-point-at-each-
  other block asserts each door's position by DOM sibling rather than
  by pixel width. Browser-checked at 1280: "view historical data →" 608
  px wide against the back button's identical 608, the footer as the
  next sibling of both, and both popup steps opaque and centred (the
  card's `reveal-pop` fade means a screenshot taken mid-animation shows
  the page through it — finish the animation before judging it).

- 2026-08-12 (Kimia's copy pass on the popup, same day): **both steps
  get one shape — a bright, larger question and a dim, smaller
  explanation.** Step one gained the title **"which type of restart?"**
  and its question dropped to the same quiet size the fine print
  already used, with a line break between the two choices it describes.
  The two consequence texts lost their GOES/STAYS ledgers, which read
  like terms and conditions, for her own plainer sentences: a total
  refresh "will be wiped: habits, completions, and game progress",
  a kept-data restart wipes "gameplay … your historical habit data,
  streaks and graphs will remain". No test changed — the suite asserts
  the buttons and the journey, never her prose (CLAUDE.md's standing
  rule), which is exactly why a copy pass like this one costs nothing.
  Browser-checked at 1280: 18.4 px in `--text` for both titles, 14.4 px
  in `--text-quiet` for both explanations.

  Two notes for the next session that drives this popup in the pane:
  reading the DOM in the same JS call as the click that changed it
  returns the PREVIOUS step (React commits after the call — the
  verify skill's standing gotcha), and a screenshot can resize the
  viewport, which remounts the tree past the viewport gate and closes
  the popup. Click, then read in a separate call.

- 2026-08-12 (Kimia, two tweaks on the same popup): **the explanations
  are centred like everything else on the card**, and the two questions
  on step one are separated by a **blank line** rather than a single
  break. The explanation had been left-aligned on the theory that fine
  print reads better ragged-right; on a card this small it just looked
  pasted in. Committed alongside an in-flight T5.2c typography session
  working in the same tree, so only the one CSS line and the one JSX
  line were staged — `git show HEAD:file` into a scratch copy, patch
  the single hunk, `hash-object -w` + `update-index --cacheinfo`. Worth
  remembering: two sessions in one working tree means `git add <file>`
  can quietly commit somebody else's half-finished work.
- 2026-08-12 (Kimia's call, later the same day): **the charm lens will
  be remembered — and gets a persistence tier no other Habitat data
  has.** It becomes plan task T6.11 rather than a note. The lens is to
  survive refreshes and carry across days, but stay a property of the
  browser it was chosen in: its own localStorage key outside the
  versioned envelope, absent from backup files, unaffected by an
  import, and never synced to a phone if syncing ever happens. She
  asked for "the same persist logic as the bookshelf and abode
  arrangements" — but those live INSIDE the envelope
  (`bookcaseLayout`, `abodeLayout`), so they do travel in backups and
  would sync. Told her; she chose the behaviour she had described over
  the mechanism she had named, and left the arrangements alone. Second
  call in the same breath: **both new-game doors clear the lens**,
  which retires the 2026-08-12 exception where only a total refresh
  did (its reasoning — that the keep-habit-data door leaves habits for
  a lens to narrow — loses to one rule being easier to hold). Nothing
  built this session; spec §5b still describes the temporary lens,
  correctly, until T6.11 lands.

- 2026-08-12 (Kimia's call, same day, after seeing T5.2c live):
  **the typography is reverted, and the font Habitat already wore
  becomes its settled typography.** She disliked the whole pass on
  sight — the two bundled typefaces, the uppercase display voice, the
  small wide-spaced section labels with their hairline rules, the
  italic asides, the collapsed size ladder — and asked for the
  pre-session state back. `git revert` on the T5.2c commit (the plan
  task added earlier the same session was kept, on her call), the suite
  back to 1068 green, and the live site back within the minute.
  The important half is the second half: this is **not** a to-build item
  waiting for a better attempt. T5.2c is struck out of plan.md, the
  two-typeface clause is gone from T5.2's own description, and §11c has
  been rewritten from a proposal into a DESCRIPTION of what is on
  screen — the system font stack, lowercase throughout, weight 300 for
  every display moment, letterspacing rather than boldness as the
  device, ad-hoc sizes, quiet-by-colour rather than by italic. Two
  promises made elsewhere had to be retired with it: §11d's "font sizes
  join the tokens file in the slice that decides them" (there is no
  such slice now) and the same clause in CLAUDE.md's tokens rule.
  What this cost, recorded so it is not repeated: a full session
  building a system that had been specified in §11c since 2026-07-19 and
  agreed on paper. The specification was followed faithfully and the
  result was still wrong, because a typographic system reads nothing
  like its own description. **Type is not specify-then-implement work.**
  If it is ever reopened, it is reopened in front of Kimia, one visible
  change at a time.

- 2026-08-12 (Kimia's call): **"button" is retired as a project word;
  the family is called the PEBBLES.** She asked whether what we mean by
  "buttons" is written down anywhere she could point a future session
  at — and it was not: the rule had been living as one bullet inside
  §11b, the PALETTE section, where two later sessions had already
  appended to it. The word itself was the problem. Nearly everything on
  screen is a `<button>` — charms, meters, drops, friend cards, the
  wordmark, every rail icon — so "change all the buttons" could mean any
  of five different things.
  **The definition, now design-notes §11e:** a pebble is a control that
  says what it does, in words or numbers, and does it when pressed.
  Everything else pressable is a drawing (it shows rather than speaks), a
  switch (it holds a state rather than performing an act), or a moment's
  own control (it belongs to a reveal and wears that reveal's colour).
  §11e carries the full roster AND the deliberately-not list with
  reasons, which is the half that stops the family swallowing the app.
  **An audit came with it:** all 53 pressable things in the app were
  classified. Six had slipped the original roster by omission rather
  than by rule — gather / leave it / read now / read later on a held
  drop, and the same pair in the abode's waiting-to-decide list — and
  Kimia brought them in; `.arrival-choice` now only makes them small.
  She left "onward" out (it belongs to the reveal's neon, §5) and party
  mode out (a switch).
  **Naming in the code followed the naming in the docs:** `.pill-button`
  → `.pebble` (the family, and the one selector to change them all) and
  `.circle-button` → `.pebble-counter` (a modifier, always worn
  alongside `.pebble`, never instead of it).
  **And the definition is now enforced, not just recorded:**
  `src/test/pebbles.test.js` reads every component as text and fails the
  suite if a `<button>` appears that is neither a pebble nor on the
  not-a-pebble list — the drift this prevents is otherwise silent
  (someone adds a control, hand-styles it, nothing looks broken, and the
  family has quietly stopped being one). It also checks that the tick-box
  — the one pebble that is not a `<button>` — still wears both classes,
  and that the stylesheet still dresses the family from one place.
  _Tests:_ five added, all in the new guard file. Full suite 1073 and
  oxlint pass.

- 2026-08-12 (T5.2d, layout session — session 49): **one bar, the same
  on every page — and the charm filter is not in it.** §13a named the
  four things the header carries but never said what happens on the
  pages where two of them do not exist. The first build asked and
  followed the safe answer: keep the date and the filter at home, give
  the world pages a shorter bar. Kimia saw it live and went the other
  way. **Her call: the header persists everywhere, identical** — the
  wordmark hard left, the meters centred, the date hard right, on home,
  the five world pages and the field notes alike, so nothing shifts
  underfoot as you move around. **The charm filter comes out of the bar
  altogether**: it is the habit list's lens, not standing furniture, so
  it sits centred directly beneath the bar — which is exactly where the
  field notes had always kept theirs, so the two arrangements became
  one. Folded into spec §5b, the date section, and §13a.

  **"Centrally" was read wrong, and should have been a question.** Told
  the meters should "always persist centrally", this session assumed
  centred on the PAGE and built it: the side columns pinned to an equal
  25rem floor so the middle sat on the centre line, with the fold pushed
  out to 88rem because that pinning needs 1381px to hold. Kimia's
  correction: **she wants them to breathe evenly between the two words
  they are sandwiched between, filling whatever space is there** — "the
  header, however many stories it may be, always tight and snug". So the
  columns are `auto 1fr auto`: the wordmark and the date take exactly
  what their letters need, the meters take the entire remainder, and the
  44rem ceiling is gone so they keep growing on a wide screen. On the
  folded form the meters span the bar's full width rather than sitting
  centred with air either side. The fold comes back to 74rem, where the
  three genuinely stop fitting (1154px).

  **The lesson, which is the point of this entry:** page-centring and
  fill-the-gap are both fair readings of "centrally", they look
  identical on a wide screen, and they diverge exactly where it matters.
  That is a question to ask, not a coin to flip — the same rule that
  produced the good answer on the world-page header two hours earlier.
  Kimia's eye is the acceptance criterion in this pass; an assumption
  spends a whole build to find that out.

  **The width gate drops from 1024px to 740px, and stops being a device
  rule.** Kimia, narrowing her browser: the screen was being cut off
  long before anything actually broke. Her rule for the floor — the app
  should keep rendering for as long as the wordmark and the longest
  possible date still sit on one row. Measured, that pair needs 656px
  (24 + 175 + 28 + 405 + 24, the widest date being
  "WEDNESDAY 30 MAR 2026" — WEDNESDAY is the longest weekday and MAR the
  widest three-letter month). But a second thing gives way first: the
  left icon rail is fixed to the window's edge while the content column
  is centred, so below about 704px the rail starts sitting on the habit
  tiles. **740px** is the first width where both hold, with 18px of
  daylight between rail and tiles, and it is verified on every page.

  **The consequence, chosen deliberately:** 740 sits below a portrait
  tablet's 768px, so a tablet now renders the real app instead of the
  block screen. Kimia was asked and took that trade (the alternative
  offered was 769px, which would have kept the tablet block for the sake
  of 29 pixels). So spec §3's stance changes shape: the gate is a
  **width rule, not a device rule** — 740px is where the layout gives
  way, and whatever device happens to be that wide gets the app. The
  ViewportGate test that asserted "blocks a tablet held sideways" is
  replaced by one asserting a 768px tablet now renders, so the
  consequence stays pinned and deliberate rather than drifting.
  Reaching the full 656px means moving the rail — a design change, not a
  number — and is left unbuilt.

  **Two one-line caps, and neither is a pixel number.** Kimia asked for
  the meters' shrink to be capped so "wallet balance" stops spilling
  onto a second line; `white-space: nowrap` on the label does it by
  making the words their own floor, with nothing to keep in step when
  the words change. Verifying that turned up the same fault in the date
  — at 1160px it broke after "WEDNESDAY" and made the bar two storeys
  tall — so it got the same treatment. Between them those two floors are
  what decide where the bar folds.

  **The breakpoint had to be measured, and the first one was dead
  CSS.** §13a's two-row fold was written for a "narrow viewport", so it
  was first built at 62rem — the reflex mobile number. But `ViewportGate`
  (T5.1b) replaces the whole app below **1024px**, so a query at 992px
  can never fire: the four-abreast row would simply have crushed the
  meters to a 77px sliver on every small laptop and never folded. The
  real number is where the row stops fitting — about 1330px — so the
  fold is at **84rem**, with an 18rem floor under the meters' column so
  nothing collapses in between. Recorded in §13a as the standing note
  for the rest of this pass: below 1024px is dead CSS in this app.

  **The night sky is mounted (§13c), and its ground was re-tuned rather
  than transplanted.** `NightSky` had been sitting in `src/ui/sky.jsx`
  since 2026-07-24, approved on the workbench; this slice only had to
  mount it — once, in `main.jsx`, inside the width gate, on a fixed
  `.sky-layer` at `z-index: -2`, so it neither scrolls nor re-rolls its
  star field as pages change, and the blocked screen keeps its own plain
  ground. Its three ground colours moved into tokens.css as
  `--sky-night-top` / `-mid` / `-bottom`, exactly as §11d had scheduled
  them to when the sky stopped being a swatch.
  **The judgement call, worth recording:** the July stand-ins
  (`#10151f → #05070a`) predate §11b settling the ground at `#080910` on
  2026-08-11, so mounting them unchanged would have repainted the whole
  app bluer up top and darker at the foot. That is a change to a settled
  identity, not the atmosphere §13c asks for, so the gradient was
  re-tuned to sink into `--bg` at the bottom and lift only faintly above
  it. If the bolder July sky turns out to be wanted, it is a three-value
  edit in tokens.css and nothing else.

  **Then two corrections from Kimia, on seeing it live.** First: the sky
  was mounted FIXED to the viewport, and held still while the content
  scrolled over it — which she read immediately as artificial. A sky
  that does not move when everything in front of it does is printed on
  the glass, not a place. So the layer became absolute and
  document-tall (`#root` gained `position: relative` and
  `min-height: 100vh` to give it that height and keep the field
  full-screen on short pages), and the stars now travel with the page.
  Second: **dense reading needs an opaque panel.** `--surface` is a
  white wash, which was fine over bare ground and is not fine over
  stars — the field notes' week grid had a starfield behind its
  numbers. Both field-notes panels now use a new `--surface-solid`,
  deliberately set to the ground colour itself so an opaque panel reads
  as a hole cut in the sky rather than a second surface. The standing
  rule, recorded in §13c: any panel carrying dense reading does the
  same.

  **The spacing scale lands, and T5.2d is finished.** The stylesheet had
  grown twenty-two different spacing numbers — 0.15 through 2.5rem, one
  component at a time — which is not a scale but an accident: gaps
  differing by under a pixel, doing no design work, guaranteeing nothing
  lines up. They became **eight steps on a 4px grid** (`--space-1` …
  `--space-8`), every old value snapped to its nearest, 117 declarations
  now asking by name and no raw rem left in any padding, margin or gap.
  Nothing moved more than 2.4px. This is the slice tokens.css had been
  waiting for since 2026-08-10, when it declined to name the paddings on
  the grounds that "§13 is about to rewrite them" — it did, so they were
  named after being decided rather than before.

  **One consequence, caught by measuring rather than by looking:** the
  bigger gaps cost the header's one-row form 29px, which left the 74rem
  fold with a single pixel of slack — the jammed-before-folding state
  that breakpoint had been chosen to avoid. Moved to 76rem and recorded
  in the CSS as a consequence to re-measure, not a constant.

  What is now in tokens.css: all colour, all spacing. What is not: glow
  (T5.2e decides it), type (never — §11c is settled), and positions,
  which place one thing rather than hold two apart.

  _Build notes:_ `.app-header` is a grid with named areas, a sibling
  ABOVE `<main class="app">` rather than inside it, so the 40rem column
  is untouched. The `meters` fragment in App.jsx no longer carries the
  meters (they moved into the bar) and was renamed `overlays`, which is
  what it always actually held — rail, arrival shelf, reveals, reading
  popup, startup fade. The date moved out of the home column into the
  bar unchanged, and the filter section moved out and back again across
  the two builds, keeping its markup and labels throughout — which is
  why the suite needed no edits at any point: 1073 tests passed before,
  between and after. Verified in a browser at 1024, 1160, 1200, 1230,
  1300, 1440 and 1800px — both bar shapes, the gaps either side of the
  meters measured equal and the bar's edges measured flush at each, and
  a world page checked at each shape.

- 2026-08-13 (T5.2e, Kimia art-directing live — session 50): **the
  §12f rolling planet, decided by eye over four passes.** Built on the
  design workbench first, because the real thing plays once per Habitat
  day and then hides for 24 hours; the workbench box replays it for
  ever, and the whole composition is sized off the box's WIDTH (`cqw`),
  so a small box shows exactly what a full screen gets. Her calls, in
  order: (1) the first pass had "really nice dimensions" but **not
  enough texture** — use the shared library's **weathered rock and
  cratered stone**, and make the movement suggest a sphere, not a
  stripe; (2) **texture up again**, **bring the home-screen twinkle
  back** (reversing her own "no twinkle" of the same morning), and add
  a **super-slow drift of the sky toward the top right**. The answer to
  "suggest a sphere" is that receding ground gets smaller AND slower,
  so the surface is three depth bands at 1×, 1.6× and 2.6× — the
  parallax is what reads as a ball turning. Full drawing notes in
  design-notes §13d.
- 2026-08-13 (T5.2e, same session): **the startup ceremony's shape.**
  The planet holds the screen for 3.2s, then fades over 1.5s and hands
  the day over. A tap ends the hold early and goes straight to the
  fade; **the fade itself is never skippable**, because it is the
  handover to the app rather than a wait before one. While it holds it
  deliberately takes taps — that is how you dismiss it — and stops the
  instant it starts leaving, so a click during the fade lands on the
  app instead of on a ghost. The Sunday rule is `startupCharm()` in
  `game/startup.js`: shell pink every ordinary day, a random pick from
  the other five on Sundays, drawn once on mount so it can never change
  mid-ceremony.
- 2026-08-13 (T5.2e, same session): **"desktop only" is now just "wide
  enough for Habitat".** §12f asked for a `min-width` check so mobile
  AND tablet skip the animation. It gets that for free from
  `ViewportGate`, which does not mount the app at all below
  `MIN_APP_WIDTH` — but that gate dropped to 740px on 2026-08-12 and
  became a width rule rather than a device rule, so a portrait tablet
  that the old 1024px gate would have turned away now sees the
  ceremony. Accepted rather than fought: a separate higher threshold
  just for the startup would reintroduce exactly the device thinking
  the gate deliberately dropped. Folded into §12f. If it ever looks
  wrong on a tablet, it is one number, not a new mechanism.
- 2026-08-13 (T5.2e, feel session — session 51): **drops arrive at the
  top right of the WINDOW, not the top of the page.** §5 was written
  when the meters and the shelf sat together at the top of the habit
  list; since §13a the meters live in the header and the list can run
  well past a screen, so a drop from a habit low down the list arrived
  somewhere Kimia never saw. The shelf is now fixed to the window's top
  right and follows the scroll. It clears the header at both its
  one-storey and two-storey heights, because App measures the real
  header and hands the height down rather than naming a number that
  would drift. Each arrival also wears its NAME from the moment it
  lands — holding is no longer how you learn what something is, only
  how you stop it fading — so an object and its words are unmistakably
  paired when several land at once. Newest sits on top and pushes the
  others down, and the markup is built in that order so a screen reader
  hears what the screen shows. Folded into §5.
- 2026-08-13 (T5.2e, same session): **the by-the-habit note leaves the
  tile.** It was a line INSIDE the tile, so a landing drop made that
  tile taller on the spot and shunted every tile below it — the list
  moving under a finger already reaching for the next habit. It now
  sits absolutely positioned in the margin to the tile's right, out of
  the layout altogether; every row measured identical to the pixel
  before and after a tap. Kimia weighed the alternative of softening
  the growth with a slow animation and it was rejected on the reasoning
  that a tile which jumps has finished moving before your finger
  arrives, while a tile that grows slowly is still travelling while you
  aim at it. Below 70rem there is no margin to put it in and the note
  simply does not show — cheap, because the same words always arrive on
  the shelf, which is pinned to the window and never runs out of room.
  The note is an echo now, not the announcement. Folded into §5.
- 2026-08-13 (T5.2e, same session): **an arrival is a blob, and it is
  opaque.** Kimia asked for the Map's shape language rather than a
  clean card. `border-radius` was tried first and cannot do it: a wide,
  short box rounds into a lozenge whatever the eight percentages say.
  So the outline is drawn — three of them, authored once in a 120×44
  frame and stretched to whatever size an arrival turns out to be,
  chosen by the arrival's own id so two side by side rarely match. No
  geometry is generated at render time, and the stroke is told not to
  stretch with the shape. The fill is `--surface-solid`, the ground
  colour itself: the white-wash surface was fine while the shelf sat in
  the page and wrong the moment it floated over the habit list, where
  the tiles read straight through the words. Edge and glow are
  `currentColor`, so a blob is lit in its own stream's colour exactly
  as a known map region is. Folded into §5.
- 2026-08-13 (T5.2e, same session): **§3's live-vs-retro tonal shift is
  dropped entirely** — Kimia's call, asked directly and answered
  directly. Live taps were to play full neon and retro marks a cooler,
  dimmer "past" tone. It is retired the way T5.2c's typography was:
  struck through where it stood rather than deleted, so nobody proposes
  it again. Nothing was built, so nothing was reverted.
- 2026-08-13 (T5.2e, same session): **where the meter movement plays,
  decided but NOT yet built.** §4's glow-and-thicken was written when
  the meters sat beside the habits; they are up in the header now.
  Kimia's call: the header meter does its glow AND the tapped habit
  gives a small matching spark, so the movement starts where the finger
  is and finishes where the meter lives. And because the check-in
  deliberately carries no header bar, a retro mark has no visible meter
  to move: the movement is held and plays once when the check-in
  closes, exactly as its drops already do. Folded into §4.
- 2026-08-13 (T5.2e, shimmer session — session 52): **the star-shimmer
  lands in both places, and each place gets the gesture its shape can
  hold.** §5 promised "a small, brief star-shimmer" when a drop was one
  thing in one place; it is two now, so Kimia was asked and chose both.
  On the blob the stars pop around its EDGE rather than on the object
  inside it — what sparkles is the arrival. The note has no outline to
  put stars around, so its half is a GLINT: one band of light crossing
  the sentence. Drops landing together cascade a tenth of a second
  apart, newest first, because a check-in closes with everything at once
  and a single flash would read as one event rather than several finds.
  Star colour went to the workbench rather than to a decision: white
  (design-bible §3) beside each stream's own pastel, one token apart.
  Folded into §5.
- 2026-08-13 (T5.2e, same session): **who does NOT shimmer, and when
  that is decided.** A friend and a first-occurrence find owe a reveal
  and the firework is theirs. The gate had to be read ONCE, when the
  arrival lands, rather than every render: `awaitingReveal` turns false
  the moment a reveal is dismissed, so a live gate would have set a
  sparkle off immediately after the firework it was meant to stay out of
  the way of. Folded into §5.

- 2026-08-13 (T5.2e, same session): **"it's giving Las Vegas" — the
  shimmer becomes the night sky.** Kimia's redirect on seeing the first
  build, and the fourth time this project has been right to put a
  design slice in front of her before calling it done. Four changes,
  all hers: mostly DOTS at the sky's own sizes with only a couple of the
  four-pointed sparkles kept as accents; half white and half a mix of
  the six charm colours; SLOWER (a star now takes 1.5s to breathe in and
  out, and the ring swells and settles over ~3s where it used to dazzle
  in one); and WIDER, standing well off the blob for a spacious,
  ethereal feel. The star-colour question this session opened —
  white or each stream's own pastel — was answered by neither, so the
  workbench went back to one row. Approved on this second cut. Folded
  into §5.
- 2026-08-13 (T5.2e, same session): **the sky's white-only rule keeps
  its scope.** Design-bible §3 says stars are white, never coloured; the
  shimmer is now half charm-coloured. Not a reversal: §3 governs the SKY
  — a permanent field behind everything — and the shimmer is a momentary
  event on a lit blob that borrows the sky's dot FORM. The sky itself
  stays white-only. Folded into §5; §3 is untouched on purpose.

- 2026-08-14 (T5.2e, meter-glow session — session 53): **every bar that
  moved lights up, not just steps.** A tap always moves steps; the same
  tap moves literacy or the wallet only when a drop says so, and when it
  does, that bar glows too. Kimia weighed the busyness (a fungi tap now
  shows the blob, its shimmer, the note's glint, the finger's spark and
  two bars at once) and chose honesty: the glow means "this went up".
  Folded into §4.
- 2026-08-14 (T5.2e, same session): **forward only, and both roll-overs
  celebrate.** A `-1` and a purchase each take a bar down and play
  nothing — undo is quiet by design (§2) and spending is a choice, not
  news. An expedition segment completed and a new literacy level both
  get the brighter beat; the wallet has none to give, since its bar
  clamps at the top rather than emptying. Folded into §4.
- 2026-08-14 (T5.2e, same session): **what a movement is measured by.**
  Steps and literacy are watched by their LIFETIME totals and the wallet
  by its BAR — opposite choices for opposite reasons. The first two bars
  empty themselves at their best moment, so a fill reading would call a
  roll-over "going backwards"; the wallet is the one meter whose face
  can sit still while its true number moves (debt below zero, a balance
  past the top), and a glow for a change nobody can see is worse than no
  glow. Folded into §4.
- 2026-08-14 (T5.2e, same session): **the spark is a ring at the control
  you pressed, in the EXPEDITION colour.** §4 asked for "a small
  matching spark" and left it open. Kimia chose the burst at the finger
  over the tile's charm edge or the charm symbol. The colour is the
  steps bar's, not the row's own charm, because the two halves are one
  gesture: what leaves the finger is what arrives at the bar. Folded
  into §4.
- 2026-08-14 (T5.2e, same session): **the check-in moves once for the
  whole session.** Five habits marked across three days land as a single
  beat when done is pressed, not five in succession — the same shape its
  drops already take. Nothing marked holds nothing; marking then
  unmarking leaves nothing to celebrate; and the check-in's own rows do
  not spark, there being no meter on that screen to spark toward.
  Folded into §4.
- 2026-08-14 (Kimia's call, same session): **a drop dissolves over a
  second and a half, and its words go with it.** Two findings behind
  one complaint, and neither was the pacing. First, **an eased fade is
  not a slow fade**: the 1.5s had been there since T3.2, but the ease
  curve spent its first third falling to a fifth of full brightness and
  its last third below the eye's floor. Second, and the real one, **a
  drop must only be ended by its OWN fade** — animation ends travel up
  the page, and the shimmer (2026-08-13) had given every arrival twelve
  star children with 1.5-second lives, so the first star to finish was
  taking the whole drop off the shelf at full brightness before the fade
  began. The by-the-habit note also had no fade at all and now leaves on
  the same clock. Folded into §5.
- 2026-08-14 (working note, same session): **the test environment cannot
  see an animation end, and this is the second timing bug it missed.**
  React never registers `animationend` under jsdom, so neither the star
  bug above nor a bar's settle could be caught by a test — both were
  proven in a real browser instead, in both directions. Anything whose
  correctness depends on an animation ENDING is browser-verified or it
  is unverified. The settle-back now runs on a timer with its duration
  in constants.js, which is testable, rather than on the animation's own
  end, which is not.
- 2026-08-14 (Kimia's calls, session 54): **the check-in is a glance, not
  a page.** Five calls in one go, all pulling the same way — the panel
  had grown into something you scroll. (a) Yesterday's rows **compress**:
  smaller type, almost no vertical padding, a hairline gap instead of a
  full one, and the +1 / -1 / tick pebbles come down with them (the one
  place in Habitat they are not their standard size — at 2rem they were
  taller than the squeezed tile and set the floor on the whole row).
  37px → 29px a row. (b) The **charm lens** joins the check-in, centred
  under the question exactly as it sits on the home screen, so a day can
  be answered one tag at a time. (c) A long yesterday **folds behind a
  `…`** after `CHECKIN_ROWS_BEFORE_MORE` rows — press to see the rest,
  press again to fold back. (d) All of which exists to serve one rule:
  **"update earlier days…" is never far from the question**, and neither
  is the done pebble. Folded into design-notes §12c and §11e.
- 2026-08-14 (Kimia's call, same session): **answering always lands you
  at the top.** Press done and the page jumps to the top of the habit
  list, wherever it was scrolled to when the check-in opened — because
  the meters live in the header bar and the movement they have been
  holding (§4) plays the instant the check-in closes. Landing halfway
  down the page means missing the one moment the whole check-in was
  building toward. Instant, never smooth: a glide would still be
  travelling while the bars moved. Folded into spec §4.2.
- 2026-08-14 (Kimia's call, same session): **a check-in you asked for can
  be clicked away from; one you were owed cannot.** The morning's
  check-in is unchanged — yesterday must be answered and done is still
  the only exit (spec §4.2, design-notes §12c). But one opened by hand
  from the rail's pencil is a **visit**, and a visit can be left: a press
  on the veil around the panel closes it. Marks made are already saved
  either way, and anything they earned still arrives; what a click-away
  does NOT do is record yesterday as answered, or jump to the top —
  nothing was being built toward, so the page stays where it stood.
  Folded into spec §4.2 and design-notes §12c.
- 2026-08-17 (Kimia's call): **a phone companion and two-device sync stop
  being non-goals.** Habitat turned out not to have one user — friends
  and family have been using it — and they asked to mark habits away from
  a laptop. Habits are a several-times-a-day affair, so the laptop-only
  rule was costing real marks. The v1 non-goals list said "mobile app,
  sync across devices"; both are now planned (M7 sync, M8 phone) and
  neither is built. The "single user, no accounts" line went too: no
  accounts were ever needed because a fresh browser is already a fresh
  world, and that remains true — there is still no login and no
  password anywhere. Folded into spec §3.
- 2026-08-17 (Kimia's call): **the phone is limited on purpose, and the
  line is marking versus editing.** "The only mobile experience I can
  accept is a limited one, before it gets too busy." A phone may ADD to
  the record — +1/done, the charm lens, the morning check-in for
  yesterday only — and a laptop alone may REWRITE it: no creating, no
  editing, no archive/unarchive/delete, no archived view, no −1, no
  re-ordering, no field notes or graphs, no past day but yesterday, no
  time-shape settings (the day cutoff, and the week shape when T6.15
  builds it). Two things fall out of one rule rather than a list of
  arbitrary cuts: the phone never shows a control you cannot use, and
  marks from a phone are purely additive, so **no deletion ever has to
  travel between devices** — which is what makes the merge in §8
  tractable. The cost, accepted knowingly: the phone loses the undo
  affordance design-notes §2 treats as load-bearing, so a mistaken tap
  waits for the laptop. Folded into spec §5b and design-notes §14.
- 2026-08-17 (Kimia's call): **the phone gets all of the juice and none
  of the admin.** "Pretty much all the game juice features should exist
  on mobile" — drop arrivals reveal there, the meters move, the cameos
  play, and the Map, Market, Guest Book, Abode and Bookcase are all
  present, arrangeable by touch. The reverse of the usual companion-app
  instinct, and it follows from what a phone is FOR here: the game is
  played on the phone, the record is kept on the laptop. Folded into
  spec §5b and design-notes §14.
- 2026-08-17 (Kimia's call): **two abodes, on purpose — arrangements are
  per-device and never synced.** "The screen size massively affects my
  preferences… the gameplay needs to persist, but they don't have to talk
  to each other across devices." So the Abode and Bookcase layouts are
  device-scoped: a phone arrangement and a laptop arrangement are meant
  to differ and are never reconciled. Refined in the same session after
  checking T6.11: they **stay inside the versioned envelope** so a backup
  file still carries them (T6.11's 2026-08-12 rule stands untouched), and
  it is SYNC that leaves them alone rather than storage that moves them.
  That refinement removes what had looked like a schema bump touching
  every user — **M7 needs no schema change at all.** Folded into spec
  §5b and §8.
- 2026-08-17 (Kimia's call): **sync is an opt-in mirror named by a
  pairing code, and it is encrypted on the device.** Five parts, each
  chosen against a cheaper alternative. Local-first: `localStorage` stays
  the source of truth and nothing ever waits on a network, so sync
  failing is never Habitat failing. Dormant until asked for: a
  laptop-only user makes no network request at all, so most people's data
  is never touched. A long random pairing code instead of an account —
  no email, no password, no reset, and the two devices need to be
  together exactly once, for seconds, ever. Encrypted with that same code
  before it leaves, so Kimia stores ciphertext and cannot read her
  friends' habit data even while hosting it. And unpair deletes the
  remote copy, which is what makes "delete my data" a request that can
  actually be honoured. The price is named and accepted: lose both
  devices and the code and the data is gone, which is what makes T6.4's
  exported-file habit mandatory rather than nice to have. Folded into
  spec §8.
- 2026-08-17 (Kimia's call): **where the synced blob lives is
  deliberately left open until M7 builds.** Two candidates — a Cloudflare
  Worker + KV store Kimia runs (free at this scale, free tier fails
  closed rather than billing, five-second setup for a friend) or each
  user's own Dropbox/Drive (Kimia hosts nothing, but every friend needs
  an account and a sign-in flow). The encryption boundary is what keeps
  the choice cheap to defer: the app hands over an opaque encrypted blob
  either way, so where it goes is a contained decision, not an
  architecture. Folded into spec §8.
- 2026-08-17: **abuse and quota are designed against, and the likelier
  culprit is our own code.** Pairing slots are created BY HAND by Kimia
  and never by the app, so the public endpoint offers read and
  update-existing only — the "generate a thousand slots" route is absent
  rather than merely gated — plus a rate limit per code and per IP, a
  write size cap, and a per-code daily write cap. But a runaway loop in
  Habitat's own sync code would burn more quota in ten minutes than a
  stranger would in a year, so three layers guard it: loops made
  impossible (send only if the bytes changed, idempotent merge, one
  request in flight, no polling timers, one tab syncs), damage capped (a
  client-side hourly budget that trips and stops, backoff with a ceiling,
  debounce and coalesce), and caught early (pure merge tested with a
  call-counting fake, a "run twice, expect zero requests" test, Kimia's
  own two devices as canary, a host-side off switch that needs no
  deploy). **If only three get built: the content-change guard, the
  hourly budget, and the run-it-twice test.** Folded into spec §8.
- 2026-08-17 (Kimia's call, after questioning the first plan): **sync is
  built BEFORE the phone.** The order was going to be the other way
  round, and Kimia found the flaw: a phone cannot create habits, so a
  fresh phone has no data, cannot get any, and a phone-first milestone
  would be a blank screen with nothing to test. Exporting a backup and
  importing it on the phone works as a dev trick and needs no new code,
  but it is a data-loss trap as a shipped feature — mark habits on the
  phone after importing and the next import wipes them. Sync first
  inverts every one of those problems: it is testable with **two desktop
  browsers on one laptop**, no phone involved; it ships dormant so nobody
  is affected while it is built; if the merge turns out to be a nightmare
  that is discovered before a whole phone UI depends on it; and once it
  works, populating a real phone for testing is a QR scan instead of
  shuffling JSON files. Recorded in plan.md M7/M8.
- 2026-08-17 (Kimia's call): **the phone's world pages arrive one at a
  time, judged on a real phone.** The scope in spec §5b is a destination,
  not a task. A vertical habit list is the easy thing to fit on a phone;
  the Map, Abode, Bookcase and Market are wide 2D compositions and are
  where "too busy" will actually bite. So M8 ships the daily core first
  and then adds one spatial page per design slice, art-directed live the
  way §11 and §13 were, and a page that cannot stay calm small does not
  ship. Committing to six spatial redesigns in a document would be the
  spec-then-implement move already rejected. Folded into spec §5b and
  design-notes §14.
- 2026-08-17 (Kimia's call): **the numbered archetypes are the species,
  in exact ladder order** — friend 01 is the plip (which she calls
  *plip*), friend 10 the hamdi bulo, and the eight between follow the literacy
  ladder without a gap. Asked whether size should track the ladder, she
  confirmed the ordering she had already drawn: friend 01 smallest and
  simplest, friend 10 "the top most rare and sophisticated". This is the
  fact that lets the canon be keyed by SPECIES rather than by drawing
  number, which matters because the numbers are workbench-only and leave
  with the shelf. Folded into design-bible §9c.
- 2026-08-17 (Kimia's call): **she would rather not use "plip",
  "baluhm" and the rest — the species have names she invented.** They
  already do, everywhere a player can see: T6.1a moved every name into
  `src/content/names.js` and she has filled all ten species and all 55
  individuals. What remains in the code are permanent internal ids that
  never render, and they have to remain: a stylesheet or a test that
  quoted her words would break the deploy the moment she edited one on
  GitHub (the standing content-coupling rule). The convention that
  settles it, applied in `friendCanon.js`: **code keys stay, and her
  species name goes in the comment beside each one**, so the file reads
  in her language without depending on it. Same session she corrected
  *blip* to **plip**.
- 2026-08-17 (scope call, agreed before building): **T5.3d is the canon
  table and the workbench, not the four real screens.** The plan asks for
  "every place a friend is drawn" to take its size from the canon, but
  the Guest Book, arrival reveal, cameo and Abode still draw the T4.4
  placeholder line-art — there is no archetype there to size, so wiring
  them now would mean either sizing placeholders about to be deleted or
  swallowing the whole art swap into this task. They adopt the canon in
  the task that replaces the placeholders. The same reasoning T5.2e used
  for not spending the glow scale on placeholder art.

- 2026-08-17 (Kimia's call, asked twice): **an individual friend is a
  COLOUR — siblings of a species differ by body colour and nothing else.**
  The workflow note in design-bible §9c had listed four axes (size,
  texture, appendages, eye count/size); asked which of them code should
  actually turn, she picked body colour alone, and confirmed it when the
  consequence was put plainly back to her ("ten plips are one identical
  shape in ten pastels"). Two of the four were already settled or
  impossible: **size** was spoken for by T5.3d, which fixed one size per
  species and holds everywhere; **appendages** cannot be derived by code
  from a traced outline — adding one means drawing a kit of parts, a
  drawing session she declined. Texture and eye count were live options,
  both built and both offered, and she took neither. Her reasoning is the
  species-recognition one: the drawing is the creature you recognise, the
  colour is the one you met. §9c rewritten to match.
- 2026-08-17 (design call): **a species spreads its roster evenly around
  the colour wheel, and colours repeat across species on purpose.** With
  colour carrying the whole job of telling siblings apart, the ten
  plips take 36° each, the nine baluhms 40°, and so on; each species
  starts 18° further round than the one below it, from 40°. Uniqueness
  across all 55 was considered and rejected as fake precision — 55 hues on
  one wheel sit 6.5° apart, which nobody perceives as different, so it
  would trade the spacing that works for a guarantee that reads as a
  coincidence. Species are told apart by SHAPE (different drawings at
  different sizes); colour only ever answers "which one of these".
- 2026-08-17 (found while building): **the friends' 24 hand-written
  pastels are one formula, not 24 choices.** Read in HSL, every value in
  `GREY_TO_PASTEL` is the grey's own lightness at 60% saturation with the
  hue turned — green 151°, violet 256.5°, amber 40° — landing within one
  or two of 255 per channel of what was typed by hand. That is what makes
  the colour-only call affordable: 55 individuals need 55 ramps of eight
  shades, and nobody was going to hand-pick 440 hex values. The hand table
  is KEPT as the source of truth for the three named tints rather than
  regenerated, because its darkest green was deliberately darkened past
  the formula and because regenerating would shift nine archetypes already
  standing on the workbench — a colour change nobody asked for, in a task
  about something else.

- 2026-08-17 (Kimia's call, seeing the first ten plips): **the friend
  palette is CHOSEN, not calculated — and blues and greens are mostly the
  flora's.** The even sweep round the colour wheel was rejected on sight
  for spending four of its ten colours on blues and greens, which belong
  to the plants: friends borrowing those tones blurs the two families the
  silhouette test exists to keep apart. She kept five of the swept colours
  — the gold, teal, violet, magenta and red, numbers 1, 5, 7, 9 and 10 as
  the shelf showed them — and named five pastels for the rest: a baby
  pink, a soft lilac, a pastel peach, a pale grey and a baby blue. Her
  five keep their original slot numbers so that "colour 7" still means
  what it meant when she said it. Only one teal, one baby blue and a
  cool-cast grey survive of the cool half. Folded into design-bible §9c.
- 2026-08-17 (found while building, second pass): **a colour needs a
  LIGHTNESS dial as well as hue and strength, or a pastel is unreachable.**
  The generator varied hue only, then hue and saturation, and a request for
  "baby pink" still came back a dusty rose (#99535e) — because a pastel is
  a LIGHT colour and a friend's lightness belongs to Kimia's shading, whose
  mid tone sits near 55% where a baby pink (about 86%) cannot exist. The
  fix is `lift`: how far toward white the colour is pulled. It moves each
  shade a **fraction of its remaining distance** to white rather than a
  flat amount, which is the load-bearing detail — a flat amount would push
  the top of the ramp past white, clip several shades to one solid tone and
  flatten the modelling Kimia drew into a blob, where a fraction never
  arrives and so keeps every shade distinct and ordered at any lift. The
  five kept colours sit at lift 0 and are untouched.
- 2026-08-17 (judgement call while building, flagged to Kimia): **the two
  pastel values first tried did not deserve their names.** "Pastel peach"
  at 52% saturation rendered a vivid orange near-twinned with the gold, and
  the baby pink a salmon. Both were the assistant's numbers rather than
  Kimia's brief, so they were corrected without asking — the brief said
  peach and pink, and delivering an orange under the label "pastel peach"
  would have been the failure. What WAS taken back to her is the thing her
  brief could not have anticipated: that reaching real pastels needed a
  third dial at all.

- 2026-08-17 (Kimia's call, closing T5.3e): **who wears which colour is
  DEALT, not decided.** "The colours of each friend should pick at random
  from the existing 10 colours, with no colours ever repeating within the
  same species. Therefore different players might get friends of different
  colours." This replaces the fixed per-species runs shipped the same
  morning: the palette stays shared and settled, the deal becomes personal.
  Seeded from the world seed, so it is random across players and fixed
  within a save — a friend never re-rolls its colour on a reload, an undo or
  a backup restore. No sibling can repeat because a species shuffles the ten
  and deals off the top, and no roster exceeds ten. It also ends the
  species-by-species approval loop: there is no fixed roster of colours left
  to show her.
- 2026-08-17 (Kimia's ruling, correcting the previous session): **the size
  canon holds on the workbench too — "everywhere and always" has no
  exception for scaffolding.** The T5.3e colour shelves were built at one
  flat card width per species, on the argument that a colour swatch asks a
  different question than a size chart. Flagging the departure was not the
  same as being allowed it: a page showing the cast at the wrong
  proportions teaches the wrong proportions whatever it claims to be
  asking. If an asset is too small to judge at its canonical share of a
  page, the page's BASE size goes up; the ratios never bend. Folded into
  design-bible §9c as the rule for any future shelf.
- 2026-08-17 (Kimia's ruling): **no word her world does not use belongs
  anywhere in Habitat — not even where only the code reads it.** The ten
  species keys were still Claude's July drafts (drifter, nester, …), kept
  on the argument that an internal id is nobody's reading material. There
  is no such place: she opens these files. Every key was renamed to the
  species' own name on N-Z-D — plip, baluhm, krupengk, zala, liwi-bi-jiji,
  meuhy, rassatt, woigolp, chitu, hamdi-bulo — through the code, the CSS
  animation classes, the tests and the docs. Cheap because saved games
  store a category NUMBER, not a key, which stays true if she ever renames
  a species. The display name in `names.js` is still separate and still
  hers.
- 2026-08-17 (Kimia's call): **the design-assets page is a waiting room,
  not a gallery.** A shelf stands only while a question about that asset is
  open, and comes down once she has answered it — every settled asset left
  standing is another screenful between her and the one she came to look
  at. Folded into spec §5b.
- 2026-08-20 (Kimia, opening the session): **a cameo that cannot be
  interrogated is not a reward, it is a claim.** She had had "15 day
  streak" two days running and could not tell which habit it meant, nor
  whether it was even true. It was not: the narration slots held her
  July DRAFT sentences with the example numbers typed into them, so
  every visit in Habitat's life had announced a 15-day streak whatever
  the streak was. The slots now write `{holes}` the win fills — `{n}`,
  `{unit}`, `{habit}`, `{previous}` — through the same filler the
  interface words use. Folded into design-notes §8 and spec §5.
- 2026-08-20 (Kimia's rule): **a record streak visits on the day the
  record FALLS, then a step at a time.** The second bug behind the same
  complaint, and the worse one: "current run beats every earlier run"
  is true again tomorrow and every day after, so the cameo billed as
  the rarest was the only one firing daily — and it outranks a big day,
  so it was hiding those too. Her rule, given as a worked example: hit
  7 for the first time and the friend comes; at 12 it comes again; break
  it, build a new run, and the next visit is at 13 because 12 is now the
  best to beat. **Every 5 fulfilled days for a day-counted habit, every
  week for an N-per-week one** — and asked where a brand-new habit
  starts, she kept the 5-day floor for daily habits ("no early-days
  bonuses") and removed the floor from week habits entirely, since one
  fulfilled week is already a week of work. Mondays-and-Thursdays
  habits follow the day rule: she had grouped them with weeklies until
  told Habitat counts their streak in fulfilled days. Folded into
  design-notes §8 and spec §5.
- 2026-08-20 (Kimia's call): **pressing the visit opens the record it is
  about.** She rejected a standing "personal best" column in the field
  notes — the answer should belong to the moment, not become another
  number on a page. Instead the cameo is pressable, and what it opens is
  a blackout over the field notes: the page goes dark and the run stands
  alone in it, habit name and length, click anywhere to escape onto the
  week underneath. Her reason for showing EVERY record that fell that
  day rather than only the one the cameo spoke for: the notices are
  momentary and there is no going back to catch a second one. Two
  consequences decided while building and confirmed by the same
  reasoning: the page opens on the week the record actually stands in
  (it opens on last week otherwise, which put a "2-day streak" row
  directly under a spotlight announcing five), and the big-day and
  milestone cameos are not pressable, since they are about the day and
  the notes have no separate view of one. Folded into design-notes §8
  and spec §5 and §6.

- 2026-08-20 (Kimia, testing the same day): **a run of one is not a
  run.** The week floor removed a few hours earlier produced "1-week
  coding practice streak record!" and she called it wrong on sight. Back
  to 2, where it was. The reasoning that removed it — one fulfilled week
  is already a week of work — was sound and still produced a sentence
  that reads as broken, which is the T5.2c lesson again: the paper
  argument is not the thing being judged. Her "every personal best after
  that" rule is untouched; it just cannot start at one.
- 2026-08-20: **a streak told "as of" a past week may not see past it.**
  Found chasing her report and NOT a cameo bug at all — the cameo's
  number was right. `weekNotes` asked `currentStreak` as of late on the
  Monday after a finished week (correct) but handed it the WHOLE
  completions list (not), so the walk began on the week AFTER the one on
  show. Four unbroken weeks browsed back read 2, 3, 4, 4 instead of
  1, 2, 3, 4, and a week genuinely MISSED reported the following week's
  streak instead of a blank. That is what made her broken run look
  intact: three weeks back, every cell said "1-week streak". The walk is
  now given only the completions that existed by the as-of moment.
  Folded into spec §6.

- 2026-08-20 (Kimia, an hour after it shipped): **an invisible control
  is not a control.** She could not find the press at all. It had been
  built as a bare transparent hit area over the whole visit, reasoning
  from her 2026-08-16 rule that a visit shows a friend and a caption and
  nothing else — so its only sign was the cursor changing if you
  happened to pass over it. Her choice of fix kept the rule intact and
  solved it inside it: **the blob BREATHES.** Nothing is added; the rose
  outline it already wears rises and falls, which is §5's own language
  for a thing alive and touchable. The breath waits out the four-second
  signature performance — one movement at a time — which also puts it
  exactly where the visit stops being something to watch. She also chose
  a longer window for a pressable visit, **roughly double**: nine
  seconds is enough to watch a performance, not enough to notice a thing
  is pressable, read it and reach for it. Folded into design-notes §8.

- 2026-08-20: **a click in a test and a click from a finger are not the
  same event, and only one of them matters.** The cameo's press shipped
  completely inert: `.cameo` sets `pointer-events: none` (right, and
  still right — a celebration must not come between a finger and the
  habit underneath), and the press inherited it. No cursor, no click.
  It got through because every check bypassed the property: a component
  test fires its click straight at the element and jsdom implements no
  hit-testing or pointer-events at all, and the live verification called
  `.click()` in JavaScript, which does the same. The control was proved
  to WORK and never proved to be REACHABLE. From now on a new control is
  verified with a real click at real coordinates in the browser pane
  before it ships, and `pebbles.test.js` guards the property by reading
  the stylesheet — the one check that can actually see it. Folded into
  design-notes §8 and CLAUDE.md.

- 2026-08-20: **the lenses — five ways to look at the habit list, and
  one of them remembers** (Kimia's call, after a session of questions).
  The charm filter was the list's only lens and it forgot itself every
  visit, which left a long list either whole and overwhelming or
  narrowed and unrepeatable. Five controls join it as their own family
  (design-notes §11f): **default · today · prioritise · tasks · un-hide
  all**, with a **padlock** beside default and an **eye** on every tile.
  They are deliberately NOT pebbles — §11e's pebble does a thing and
  settles, and these change or hold a view — and they live on the home
  screen only, never the field notes or the check-in: they are about
  arranging a list you are working through, not reading a record.
  Planned as T6.23a–e.

- 2026-08-20: **muting — the eye on every tile.** A habit can be dimmed
  and softly dropped to the bottom of the list on demand, alongside its
  edit and archive icons. **Muting sinks; un-muting moves nothing**
  (Kimia's clarification): the drop is a one-time movement, not a rule
  that muted tiles live at the bottom — so a muted tile can be dragged
  back anywhere afterwards and stays there, still dim. A muted tile is
  fully tappable: +1 still counts. Muting is "out of my eyeline", never
  "disabled". It resets on refresh and at the new day, exactly like the
  charm lens, unless it was saved into a default view.

- 2026-08-20: **the three verbs act on what is already there, then let
  go.** today, prioritise and tasks are not switches holding a view:
  each reaches into the arrangement currently on screen, changes it,
  and surrenders to whatever the user does next (Kimia's framing).
  Pressing today and then prioritise narrows further rather than
  starting over, and a manual drag survives any verb with no opinion
  about it — prioritise never re-jigs two habits of the same tier,
  because a daily and a daily are the same priority. The one memory any
  of them keeps is the tasks control's place in its own four-press
  cycle — to the top · to the bottom and muted · hidden · off — where
  "off" un-hides and un-dims without restoring any earlier position.

- 2026-08-20: **today's tiers, and prioritise's.** Today keeps what
  applies today (daily, N-per-day, a weekday habit whose day this is —
  including one already completed, which is the point of a day view);
  mutes at the bottom what COULD apply today (N-per-week, whenever,
  one-time tasks — and an N-per-week already at its number is muted like
  any other, never hidden: being ahead is not a reason to disappear);
  and hides everything else. Prioritise sorts into exactly three tiers,
  stably: applies today · applies this week (N-per-week) · everything
  else. Whenever, a weekday habit whose day this is not, and one-time
  tasks all share the third tier — a task in Habitat deliberately has no
  deadline, because this is a habit app and not a to-do list (Kimia,
  narrowing an earlier four-tier draft to three).

- 2026-08-20: **the order must always be exactly knowable, so nothing
  re-orders while anything is hidden.** The existing rule (no dragging
  while a charm filter is on, §12a) turns out to be the general one, and
  it binds inside design mode too: dropping a tile into a list with gaps
  in it would force Habitat to GUESS where it belongs in the full order,
  and Habitat never guesses about the record of a deliberate choice.
  Hence **un-hide all**: it un-hides everything and clears the charms,
  and deliberately leaves mutings alone — a muted tile is visible, so it
  never stopped the order being knowable.

- 2026-08-20: **a permanent re-order is a ceremony; every other
  re-order is throwaway.** Dragging is ALWAYS temporary, from the first
  day, and only design mode writes an order down. Kimia chose this over
  the alternative where dragging persists until the first default is
  saved and then stops — a rule that changes under a user is worse than
  one that is strict from the start. So a new player's default view is
  decided FOR them: the order habits were created in, no charms, nothing
  muted, which is exactly what the app does today. Two routes to a new
  permanent order — unlock, redesign, save; or redesign FIRST and then
  unlock and save, since unlocking keeps whatever is already on screen.
  The second route is the point: an arrangement fiddled into shape over
  a long evening is locked in by a quick unlock-then-lock before the day
  ends. Her reason for the strictness: "temporary reorders feel fun to
  do… they should feel throwaway and flexible, without fear of
  commitment."

- 2026-08-20: **design mode is a visible, consequential place.**
  Unlocking asks first — "are you sure you want to re-design your
  default view? any previous default view choices will be lost", her
  words, living in ui.js — answered by **design new default** or
  **cancel**. While it lasts, the window's edges glow in colour and the
  padlock pulses; only the header, the lenses, the charms and the
  baguettes stay on screen, and the rail, the archived drawer, the
  footer buttons, the arrival shelf and any cameo go. **Every tile is
  inert**: +1, -1, the to-do tick, edit and archive all dim, leaving
  only the eye and the drag — a stray tap while arranging would write a
  real completion into the record. Two exits, **save new default view**
  (or shutting the padlock) and **exit design mode without changing**;
  a refresh is a third and cancels the session, since nothing is saved
  until the lock shuts.

- 2026-08-20: **a default view cannot hide anything, so design mode
  mutes instead of hiding.** Hidden is not one of the three things a
  default holds (order, charms, mutings) and cannot be — a saved view
  you cannot find your habits in is a trap. So inside design mode the
  verbs never hide: a habit today would have hidden is MUTED instead,
  and anything already hidden that way when design mode opens comes back
  muted. Kimia's reasoning: there was a reason it was out of view, so
  muted is the happy compromise — visible, but not in your face.
  Charm-hiding is the one exception that stays, because charms ARE
  saved. **The tasks cycle therefore SHORTENS in design mode** (Kimia,
  the same day, shown the rule written out at its edge): mute-instead-of-
  hide would have made its third press look identical to its second, a
  press that appears to do nothing, so the hidden step is skipped
  outright — three presses in design mode (top · bottom and muted · off)
  against four everywhere else.

- 2026-08-21: **a newly muted tile stops just under the LIVE list, not
  at the floor** (Kimia, shown the two arrangements side by side). Mute
  one habit and it sinks below everything still in your eyeline; mute a
  second and it lands ABOVE the first, so the dim ones read newest-first
  and the tile you have only just put aside is the one nearest the
  habits you are still working through. The alternative — every mute to
  the absolute floor, stacking in the order they were muted — buries the
  most recent decision deepest, which is backwards. **Muting still only
  ever SINKS**: a tile already lower than that landing spot (dragged
  down to the floor at some point, or the last live tile with nothing
  but dim ones above it) does not move at all, because closing an eye
  must never lift something up the list.

- 2026-08-21: **the eye leads the three icons on a tile** — eye, then
  the pencil, then the archive box (Kimia's call). It is the gentlest of
  the three and will be the most used, and it leaves archive last, where
  the most final of them belongs. Its hover label is **"mute" / "unmute"**
  — the same word the spec and the design notes use for the behaviour,
  so the screen and the docs say one thing (`habits.mute` /
  `habits.unmute` in src/content/ui.js, hers to rewrite).

- 2026-08-21 (Kimia, asked before building T6.23b): **`today` brings
  what belongs to today back to full brightness.** A habit muted by hand
  that DOES apply today is un-dimmed by the lens rather than left dim
  where it stands. She chose this over the stricter reading of "keeps
  what applies today", where a verb only ever keeps, mutes or hides and
  never un-mutes: today is the day's list, so nothing belonging to the
  day should be sitting in the corner of it. It stays the one thing a
  verb un-does — `today` still never un-HIDES, because a lens narrows
  what is on screen rather than re-deciding the whole list, and
  **un-hide all** is the press that exists for that. Folded into spec
  §5b.

- 2026-08-21: **the drag-lock's hover line is Kimia's words now.** The
  tile's "why won't this move?" message was the last interface sentence
  living in a code file, hard-coded in HabitRow.jsx while every other
  word sat in `src/content/ui.js`. Generalising it — the lock is no
  longer about the charms alone — was the moment to move it, so it is a
  named slot she can rewrite on GitHub like the rest. Her wording:
  "un-hide everything to re-order". An App test that asserted the old
  sentence word-for-word came out with it: it was exactly the
  content-coupled assertion CLAUDE.md forbids, sitting there since
  before the rule existed, and it now checks only THAT a tile explains
  itself.

- 2026-08-21: **a muted tile sinks past hidden ones, not just live
  ones.** Found by a wrong expectation in a test rather than by
  reasoning: a hidden tile is not drawn, so counting it as part of the
  list to sink past cannot change what the sink looks like at the time —
  and it is what leaves the dim tiles at the true bottom once `un-hide
  all` brings everything back, instead of stranding a live habit
  underneath a dim one it never asked to be under.

## T6.23a build notes — the eye on every tile (2026-08-21)

The first of the five lenses, and the first visible piece of T6.23.

**`src/game/lenses.js`** — the arrangement, as pure functions, with the
hidden set still to come in T6.23b. `orderedForScreen(habits,
screenOrder)` puts the list in the order the SCREEN is showing rather
than the order storage holds; a null arrangement hands `habits` straight
back, and any habit the arrangement never heard of (one created a moment
ago) goes to the end, which is where a new habit has always joined.
`sinkOnMute(order, id, muted)` is the landing rule above: remove the
tile, find the lowest id that is not muted, insert just under it — and
if that index is not BELOW where the tile started, return the order
untouched. That last line is the whole of "muting only ever sinks", and
it is the one the two edge cases hit (the last live tile with dim ones
above it; a muted tile dragged to the floor and muted again).

**App** grew two pieces of screen state and nothing else: `muted` (ids)
and `screenOrder` (ids, or null). Neither is saved — a refresh is a
fresh visit, and a `useEffect` on `today` empties both at the 3am day
turn. The list now reads `orderedForScreen(activeHabits(…), screenOrder)`
before the charm filter, so a mute sinks a tile through the temporary
arrangement and never through the stored habits array. Which is exactly
why `handleMoveTo` had to learn to say the same move TWICE — once into
storage (dragging still saves an order until T6.23e) and once into
`screenOrder`: once anything is muted the two orders have parted
company, and writing only the stored one left the dragged tile visibly
where it started.

**The drift** reuses the drop-glide's FLIP rather than growing a second
one. `settling` gained a `kind`: 'drop' keeps the lit, lifted look and
holds it for DROP_SETTLE_MS, 'mute' travels at its own size and drops
its class after MUTE_DRIFT_MS (420, matching `.habit-row--drifting` in
index.css). The tile's top is measured in the click handler, BEFORE the
list re-orders around it — the same trick, for the same reason, as the
dropped tile.

**The look**: `.habit-row--muted` is `opacity: var(--tile-muted)` (0.45,
in tokens.css) and nothing else. No strike-through, no greying of the
controls — muted is "out of my eyeline", never "switched off", so
borrowing any of the language of a disabled thing would be a lie. The
eye itself is two SVG paths — an almond with a pupil, or a lowered lid
with three short lashes. Deliberately **no slash through the closed
one**: a slash is a prohibition, and nothing here is forbidden.

Classified in pebbles.test.js as `icon-button` — a lens by family
(design-notes §11f), but furniture on a tile, so it dresses exactly like
the pencil and the box it sits beside.

**Verified with a real click** (CLAUDE.md's reachability rule, the one
the cameo taught us), in the browser pane on the dev server: the eye
took a real pointer at its own coordinates, "walk the dog" dimmed and
sank; a second mute landed above it; the dim tile took a +1 and showed
✓ 1/1; opening its eye again un-dimmed it exactly where it stood; and a
refresh brought the stored order back with the completion still on the
record.

## T6.23b build notes — the `today` lens (2026-08-21)

The first lens that HIDES, which is why it carries two rules that have
nothing to do with today in particular.

**`todayTier(habit, dayKey)` in schedule.js** — the classification, put
beside `isScheduledOn` rather than in lenses.js because it is a question
about a habit and a day and nothing else: no completions, no screen, no
arrangement. `applies` when the day expects it, `no` for a weekday habit
whose day this is not, `could` for everything left (N-per-week, whenever,
one-time). It reads the schedule IN FORCE on the day, like every other
question in that file, so a future-dated schedule edit cannot make today
lie. An N-per-week already at its number is `could` like any other —
this function cannot even see completions, which is the cleanest possible
statement of "being ahead is not a reason to disappear".

**`todayLens(habits, { muted, hidden }, dayKey)` in lenses.js** — one
pass to sort the tiers, then the sink. Two details worth keeping:

- the could-tier is sunk **bottom-most first**. Each mute lands just
  ABOVE the one muted before it (T6.23a's rule), so muting the group
  top-down would land it upside down at the floor;
- an `applies` habit is deleted from the muted set — Kimia's call above
  — and that happens BEFORE the sink, because un-muting changes who
  counts as live and therefore where the block lands.

Anything already hidden is skipped and stays hidden. The whole function
returns a new arrangement and touches nothing else; a test asserts it
mutates neither the habits nor the arrangement it was handed.

**App** grew one more piece of screen state, `hidden` (ids), wiped by the
day-turn effect alongside `muted` and `screenOrder`. Everything else
hangs off one derived question — `anythingHidden`, true when a charm is
chosen OR a lens has hidden something — which both locks the drag and
shows `un-hide all`. One condition rather than two, because they are the
same condition: the control appears exactly when the order is locked,
which is exactly when it has work to do.

**The lens line** is a three-column grid: a side, the charms, a side. A
plain flex row would have shuffled the charms sideways every time
`un-hide all` appeared or left. The charms' column is `auto` so a squeeze
takes room from the words and never from the drawings. §11f's
narrow-window wrap is deliberately not built — two words cannot crowd six
charms at 740px, the narrowest the app runs at — and belongs with the
task that fills the line.

`lens-word` is classified in pebbles.test.js as a documented
non-pebble: a lens leaves nothing behind, so it wears no frame. The test
caught both new buttons the moment they appeared, which is what it is
for.

**Verified with real clicks** (CLAUDE.md's reachability rule) on the dev
server, at real coordinates: `today` hid a Monday-only habit, kept the
daily and the 2×/day bright at the top and dimmed the 3×/week, whenever
and one-time to the bottom in their existing order; `un-hide all`
appeared beside the charms without moving them, brought the Monday habit
back to its own slot and left the three dim ones dim; and a habit muted
by hand came back to full brightness on the next `today` without
changing place.

## T6.22 build notes — the visit shows that it can be pressed (2026-08-20)

`@keyframes cameo-breathe` on `.cameo-openable .cameo-blob path`,
2600ms ease-in-out with a 4s delay (the slowest `friend-anim-*`'s own
length), pulsing `stroke-opacity` 0.5 → 0.85 and the drop-shadow from
`--glow-lifted` to `--glow-bright`. Hover and focus set `animation:
none` alongside their lifted values, because an animation beats a plain
declaration and the hover state has to be able to win. Stilled under
`prefers-reduced-motion`.

`CAMEO_OPENABLE_LINGER_MS` (18000) joins `CAMEO_LINGER_MS` (9000, kept):
`Cameo` picks between them on the same `openable` flag that decides the
press and the class, so the timer, the CSS fade and the mark can never
disagree about which kind of visit this is.

The lesson worth keeping is in the decisions log above, not here: the
reasoning that produced the invisible press was sound, followed a real
rule of hers, and was written down in three places — and it still
shipped a control nobody could find. Reasoning about a rule is not the
same as looking at what the rule produces.

**A second pass the same day** made the press actually reachable: it had
been inert the whole time under `.cameo`'s `pointer-events: none`, which
is why she could not click it even once the blob was breathing. One
line, plus a stylesheet guard in `pebbles.test.js` (with its own
`REVIVED` list, the same bookkeeping shape as `NOT_PEBBLES`) and a real
mouse click in the browser pane as proof: press the visit, the blackout
opens on "coding practice — 2-week streak", click again, the week
underneath reports the same two weeks.

## T6.21 build notes — a past week's streak stops at that week (2026-08-20)

Two lines in `game/fieldnotes.js`: an `asOfCompletions` list, filtered
to `dayKey <= weekEnd` for a finished week (the current week needs no
trimming — nothing can be marked later than now), handed to
`currentStreak` in place of the full list.

How it was found is worth keeping. Her report was "the cameo said 1 week
and it should be 3", which reads like a cameo bug, and the first two
things I did were both dead ends that were worth doing: a property test
over 900 generated histories — random birth dates, weekly targets,
marking patterns and mid-life schedule edits — proved the cameo's week
walk agrees with `currentStreak` on every one, so the cameo could only
be reporting what the field notes report. The clue that broke it open
was hers: **three consecutive weeks all reading "1-week streak"**, which
is arithmetically impossible for an unbroken run (they would read 3, 2,
1) and pointed straight at the as-of walk rather than at the cameo.

The bug is older than T6.20 — it dates to the 2026-07-27 as-of decision
— and had been quietly overstating every past week's streak since.

## T6.20 build notes — the cameo tells the truth (2026-08-20)

Three changes, in the order the session found them.

**The numbers.** `narrationSlot(path, vars)` now fills `{holes}`, using
`fill` exported from `content/ui.js` rather than a second copy of the
same regex — the two content files are due to merge in T6.14 and a
duplicated filler is exactly the drift that task exists to end. The win
object carries `n` for every win type, plus `unit`, `habitName` and
`previous` for a streak. `cameos.streakRecord` has a sibling
`cameos.streakRecordFirst` for a habit with no old best to name;
`Cameo.jsx` picks between them on `previous > 0`.

**The firing rule.** `isCelebrationPoint(current, record, kind)` in
`game/cameos.js`: the anchor is `max(record + 1, MIN[kind])` and the win
stands when `(current - anchor) % STEP[kind] === 0`. The old best cannot
change while a run is alive — it is by definition the longest run that
ENDED before this one — so the anchor is fixed for the run's whole life
and the pattern never drifts. `CAMEO_STREAK_RECORD_MIN` became
`{ day: 5, week: 1 }` and `CAMEO_STREAK_RECORD_STEP` is new.

**The spotlight.** `streakRecordWin` collects every winning habit
instead of returning the first; the win keeps `streaks` alongside the
first entry's fields, so the message code is unchanged. `Cameo` gains a
bare `.cameo-press` hit area over the whole visit (classified in
`pebbles.test.js` as a non-pebble: it is a drawing and a caption, and
the visit carries no words of its own, so what it does is said in its
aria-label). `App` holds the spotlight, clears it whenever `page`
leaves the field notes, and `FieldNotes` renders `StreakSpotlight` — a
full-bleed `--surface-solid` blackout, the run lit in `--friendship` so
it reads as the same event as the visit that sent you.

**Testing content that is Kimia's.** `src/test/narrationFixture.js` is
the `nameFixture.js` twin: tests set their own sentence and restore it
in `afterEach`, so nothing here depends on what her file says or whether
a slot is blank. Proving the filling WORKS needs a known input, and
reading her real slot to compare against it would have been the same
CI-breaking trap twice over.

**Two hardcoded strings retired in passing**, both on lines this task
already touched: the field notes' `${streak}-${streakUnit} streak` is
now `fieldNotes.streak` in the copy deck with its unit as its own entry,
since a language may not build "5-day" the way English does.

## T5.3g build notes — the four silhouettes and the two sizes (2026-08-19)

**What Kimia asked for.** Her four chosen silhouettes, each in two size
classes: the small one "roughly equivalent to zalas", the large "roughly
equivalent to rassatts", and the canon "should speak to the friends and
the objects, because they might all sit together in the abode at any
given time."

**Two questions had to be settled before any code.** She asked to be
checked with first, and it paid twice over:

1. *What does "size" mean for a flora* — width, height, or the friends'
   "how big does it read" bulk? She chose **height**.
2. *And then the arithmetic refused her pegs.* Height turns the friends'
   canon on its head: it stores WIDTHS, and the rassatt is wide and low,
   so by height it is 2.6% shorter than the zala. Zala-tall and
   rassatt-tall would have been the same size twice. Shown the cast
   ranked by height, she re-pegged the large class to the **chitu**.
   The general lesson is in the decisions log: a friend's rank by width
   says nothing about its rank by height.

**The three new files.**

- `src/ui/floraSilhouettes.js` — flora 1, 2, 3 and 6, her Inkscape traces
  verbatim, one path each. Flora 1 kept the group `transform` Inkscape
  left on it rather than having it folded into the coordinates, because
  folding it in would mean editing her drawing. Keys are HER file
  numbers; the `label` is the word on her own exported file and is a
  handle, not a name (T6.1 names them).
- `src/ui/floraCanon.js` — the permanent twin of `friendCanon.js`, and
  deliberately in the SAME unitless scale, whose 1 is the largest
  friend's width. Two numbers: `small` 0.561986 (the zala's height),
  `large` 0.770215 (the chitu's). The file's loudest comment is the one
  warning that **friendCanon stores widths and floraCanon stores
  heights** — pass both the same base and the families come out true to
  each other, but read either as the other measurement and everything is
  wrong by an aspect ratio.
- `src/ui/floraCanon.test.js` — re-derives both numbers from
  `friendCanon.js` and the zala's and chitu's own drawings on every run,
  so "as tall as a zala" keeps meaning that even if the zala is redrawn.
  It also guards the two classes staying far enough apart to read as two
  (>1.2×) — the exact failure the rassatt peg would have caused, which
  nothing else in the suite would have noticed.

**The workbench shelf** is one SVG drawn entirely in canon units, so it
has no sizes of its own to drift from the canon: every figure asks
`floraHeight`/`floraWidth` with a base of 1. The four silhouettes stand
at both classes with the two ruler friends (drawn as their reconstructed
outer silhouettes, flat and dim), wrapped into rows that share ground
lines — the point being that they are standing on the same floor, as
they would in the Abode. A test asserts every figure's box against the
canon and every figure's foot against a drawn ground.

**Verified in the browser**, not only in jsdom: each small flora renders
at 94.1px tall and so does the zala; each large at 129px and so does the
chitu. No console errors. (Habitat's width gate makes this a desktop-only
page, so no small-screen case exists.)

**Left undone deliberately:** the landmark super-size (her call — it
belongs with the Map work), and the fills are not on the silhouettes
yet. This shelf asks one question only: whether the two sizes sit right.

**One thing this could not answer.** She wanted the canon to speak to the
OBJECTS as well, and the objects do not exist — design-bible §10a has no
sizes, only "price correlates with size". So flora and friends are one
scale today, and both `floraCanon.js` and §9a say the objects join this
same scale when they are drawn rather than starting a third.

## T5.3g build notes (part 5) — the workbench cleared (2026-08-19)

**The fifth and last pass of the day.** With the fills approved, three
shelves came down: the dressed flora, the flora-fill squares and the four
hair swatches. `DesignPage.jsx` went from 380 lines to 157.

**Why the hair went too**, since it is the one that looks like an
overreach: the workbench is a waiting room, and the hair was in it to be
judged as the flora's surface. That question is now answered. The
textures are untouched in the library and every flora is still made of
them; only the shelf left. `TEXTURE_FAMILIES` on the page is now the
three FILTER families, and the page's own test asserts no hair swatch can
reappear — a settled asset creeping back into the waiting room is exactly
what that test is for.

**What came out with them.** `TextureSwatch`'s procedural branch (the hair
was the only procedural texture on the page), the `hairField` and
`denseHairField` imports, every flora import, and four CSS rules. Also the
shared-render trick from part 4: it existed because 41,000 paths a dozen
times over blew the test timeout, and with the flora gone the page renders
in milliseconds again, so the file is back to a render per test — the
project's normal idiom. That test file went from 39 seconds to 1.4.

**The flora's record outlives the page**, which is the point of having
built it this way: `floraSilhouettes.js` (her four traces),
`floraColours.js`, `floraFills.js` and `floraCanon.js` are all permanent,
and `denseHairField()` sits in `textures.jsx` where the task that puts
flora on the real screens will need it. Nothing about the flora lived on
the workbench except the questions.

**What is still waiting there:** the seven filter surfaces, which dress no
real asset yet, and the abode sky, which has still never been put on the
real Abode screen.

## T5.3g build notes (part 4) — a flora is cut from the middle (2026-08-19)

**Kimia diagnosed this one, and the diagnosis was the fix.** She looked
past the flora at the SWATCHES and named what was wrong with them: "a
sort of southern area of lower density of the hair and fur in each of the
swatches". Then she gave the remedy as a picture — grow one big dense
field, and cookie-cut the flora out of the middle of it.

**Why she was right.** `hairField` scatters roots across its box and grows
every strand UPWARD. A point near the bottom of the box is covered only by
the few roots between it and the edge; a point in the middle is covered by
everything below it as well. So every field is thin along its southern
edge — invisible on a square swatch, glaring once a shape is cut from one
and wears the band across its belly.

**`denseHairField()` in `textures.jsx`** is her rule as code, and it lives
beside the generator rather than in the workbench because every future
flora screen needs it:

- it grows the field over a box **taller than asked for** — one whole
  strand-reach of extra room below, so the strands that were missing under
  the belly exist and grow up into it — plus a hairline at the sides and
  top for the 3-unit inset the generator keeps;
- then it **repeats the field** until the density is back to what the mode
  was tuned for, one pass per tuning square of area. Roots are scattered
  uniformly, so passes lay over each other with no seam. (Tiling would
  have been the obvious way and is wrong here: a tile has a thin bottom
  edge too, so vertical tiles would have printed the very band we are
  removing straight across the middle of the shape.)

`hairReach(mode)` is new and exported with it: segments × longest segment
× the mode's length scale, an upper bound on how far a strand travels.

**Measured, not eyeballed** (`textures.test.jsx`, new). Strands crossing
the bottom fifth of the box against strands crossing the middle fifth:

    curled    0.32 → 1.03      wispy     0.32 → 0.99
    coat      0.63 → 0.90      underfur  0.71 → 1.02

The plain field's thinness is written down as a test too — not as a
complaint, but so nobody "fixes" `hairField` itself and silently changes
every texture swatch on the workbench.

**The cost is real:** covering four times the area at the same density
means about four times the strands. The shelf went from 22,400 paths to
41,400. Fine for a workbench page one person opens on purpose; the note
from part 2 stands doubly now — this recipe wants a lighter version before
the game draws a screenful of flora at once.

It also broke the page's own tests, which is worth knowing as a symptom:
`DesignPage.test.jsx` rendered the whole page once per test, and building
41,000 paths a dozen times blew the 5-second timeout. It now renders ONCE
for the file and every test reads that one render — all the assertions are
reads, and the single test that clicks does so on the shared handler. The
file went from 39 seconds to 12.

## T5.3g build notes (part 3) — the table, and the edge rule (2026-08-19)

**Third pass of the same session**, all three items from Kimia's list.

**1. The canon stopped being about two friends.** `floraCanon.js` used to
say "half a zala tall" and "as tall as a chitu"; it now says 0.28 and
0.77, entries in the one shared scale in their own right. The file gained
the thing that makes that meaningful: **the sizing table written out** —
every friend by HEIGHT, with the two flora classes in their slots — so a
person can see the whole ladder without computing anything.

The test carries the weight, and it changed shape completely. It used to
re-derive each class from one friend's drawing; it now **rebuilds the
whole cast's ladder** from `friendCanon.js` plus all ten viewBoxes,
sorts it, and asserts each flora class falls between the NEIGHBOURS it
was placed between (small: plip → baluhm; large: meuhy → hamdi bulo).
That is a weaker assertion in the right way: a tidy-up inside the slot is
free, which is what "not tied to a specific friend" has to mean, while a
size that wandered out of its place still fails. It also checks the
ladder's ORDER survives any base size, and that the two numbers stay
two-decimal — a tail of decimals growing back is the sign someone has
quietly re-pegged a class to something again.

Rounding moved the drawn size by a third of one percent.

**2. Fixed-size hair confirmed** by Kimia — no change.

**3. The edge rule — built, and it was the wrong fix.** Two filter
primitives on the dark ground (`feMorphology` erode, then a blur to
dissolve the pulled-back edge), both radii fractions of the drawing's own
height. It did what it said and Kimia rejected it: pulling the dark back
made the flora read thinner and wispier, because the dark ground was
never what was wrong. Reverted in part 4, which has the real cause.

## T5.3g build notes (part 2) — the sizes locked, the flora dressed (2026-08-19)

**Same session as part 1**, after Kimia looked at the size scene.

**The halving.** `FLORA_CANON.small` went from a whole zala's height to
half of one. The test kept its shape rather than having the new number
pasted in: it grew a `PEG_SHARE` table (`small: 0.5, large: 1`) so the
derivation still reads as "this share of that friend's height", and the
halving got its own named test — it is the one number here that no
arithmetic would have produced, so it should fail loudly if someone
"tidies" it back to a whole zala.

**The shelf turned over in place.** The ruler friends and the small class
went; the four shapes stayed, at large size, now wearing all six fills.
That also removed `DesignPage.jsx`'s only imports of `friend04`/`friend09`
and the whole hand-rolled row-packing layout — the dressed flora are a
plain wrapping list like every other shelf on the page, one row per shape.

**Drawing a dressed flora**, the recipe now proved in the browser:

1. the aura — the silhouette blurred (`feGaussianBlur`) and painted the
   fill's own colour, because a living thing's light IS its body colour
   (§3), which is why it is SVG behind the shape and not a box-shadow
   around a rectangle;
2. a dark ground in the shape, so the hair reads as the fill rather than
   as a texture laid on a colour;
3. the hair field, clipped to the silhouette so no strand fringes out.

**One thing worth knowing for the next flora screen.** The hair modes
were tuned on a 110-unit swatch and their strand LENGTH is absolute in
drawing units, so dropping a field straight into a trace's own canvas
would make the fur a different size on every species (the four canvases
run 95–197 units tall). The fix here: generate the hair in its own space
that is always 110 units tall, then scale it onto the drawing — so a
strand is the same size on screen on all four. Wide shapes get their
field in tiles of roughly one swatch each, with a seed per tile, so the
density is the tuned one instead of thinning out across a wide canvas.

**Verified in the browser:** 24 figures, every one 141.7px tall (the
large class at this shelf's base), each aura carrying its own fill's hex,
every strand inside a clipped group. No console errors. It is heavy — the
shelf paints about 22,400 paths — which is fine for a workbench page that
one person opens deliberately, and worth remembering before this recipe
goes anywhere the game draws many flora at once.

## T5.3e build notes (part 1) — the ten plips (2026-08-17)

- **`src/ui/friendColours.js` is the permanent home**, deliberately the
  twin of `friendCanon.js` and beside it: the canon says how big a friend
  is against the others, this says what colour it is against its siblings,
  and together they are the whole of what code decides about a friend's
  looks. `individualColour(key, individual)` takes the game's own 1-based
  individual number (`src/game/friends.js`), `speciesColours(key)` returns
  a whole roster. It sits in `src/ui/` under the §11d boundary, same as the
  canon and the pastels: artwork values live beside the artwork. (Born as
  `friendHues.js` earlier the same day and renamed within the hour — once
  a colour was a hue AND a strength AND a lift, the old name described a
  third of the file.)
- **`paletteForTone(greys, tone, baseGrey)`** joined `friendPalettes.js` as
  the individuals' path, returning the same SHAPE of palette as the named
  tints' `palettesFor` — so a friend component cannot tell which one it
  was handed and needed no changes at all. friend01.jsx was not touched:
  its exported `FRIEND01_GREYS.ramp` is already the trace's shade list in
  paint order, which is exactly what the generator wants.
- **The shelf shows one species, so it picks its own base size.** A
  plip is the smallest of the cast at 1.6rem on the cast shelf — fine
  for placing it in the scale, far too small to judge ten colours on. The
  plips shelf therefore sets a base of 50rem (a plip ≈ 7rem), which
  the canon expressly allows: the proportions bind within any ONE view,
  and this view holds only plips. The size is still ASKED FOR via
  `friendSize('plip', …)` and never typed in — that is the part of the
  rule that matters, and typing "7rem" would have been the exact failure
  friendCanon.js exists to prevent.
- **Tests.** `friendColours.test.js` holds the load-bearing line — no two
  siblings share a colour — plus the palette being at least as long as the
  largest roster (the assumption that line rests on), every colour being
  worn by somebody, and the lone hamdi bulo's roster-of-one arithmetic. Two of
  its tests pin DESIGN boundaries rather than behaviour, on purpose, so a
  later "let's add a nice sage green" has to argue with something: at most
  two blue-or-green colours, and at least half the palette genuinely pale.
  `friendPalettes.test.js` is new and proves the formula claim above
  against the hand table, naming the darkened green as the one deliberate
  exception rather than loosening the tolerance to hide it; it also holds
  the property that made lift a fraction rather than a flat amount — that
  the ramp's shades stay distinct and ordered even at lift 90. The DesignPage
  test asserts ten swatches, ten distinct body ramps, ONE width shared by
  all ten, and the archetype's two eyes still blinking in their own
  overlay. Verified in the browser as well (the shelf sits at the foot of
  a long page, so the CLAUDE.md trick of hiding the shelves above it was
  needed for the screenshot).
- **The comparison bench, built and then resolved the same day
  (2026-08-17).** Kimia asked to see her five kept colours lifted into the
  pastels' range, so a second plips shelf was built with only that one
  thing changed — the two pastels already below the candidate's 40 were
  deliberately left alone, because a comparison in which more than one
  thing differs is not a comparison. She chose the lifted version ("that's
  fire"), so `FRIEND_COLOURS_LIFTED`, `speciesColoursLifted`, `FAMILY_LIFT`
  and the second shelf are all gone, and the lifted values are simply what
  `FRIEND_COLOURS` says. What survives of it is one test — that every
  swatch on the page owns its SVG ids — which the bench exposed as a real
  risk the moment a second copy of the same drawing appeared: two swatches
  sharing an id have the first silently supply the second's glow filter,
  invisible in a screenshot of one shelf and wrong everywhere else.

## T5.3e build notes (part 2) — the baluhms, and the shelf goes generic (2026-08-17)

- **The second species, and the last one that needed any thinking.** With
  the palette settled, `DrifterIndividual` became `FriendIndividual` and
  the shelf `IndividualsShelf`, both driven by a `tracedFriends.js` entry
  — so a species is added by putting its key in `INDIVIDUALS_DONE` and
  nothing else. The baluhms are nine, and take colours 2–10: the
  per-species offset means they never wear the plips' gold.
- **`tracedFriends.js` entries now carry `greys`** (the trace's own shade
  list, plus the reconstructed `base` on the six banded traces). The three
  named tints never needed it — `palettesFor` had baked them — but the
  individuals generate their palettes from a tone, so they need the greys
  to generate FROM. Passing `greys.base` through covers both kinds of
  trace: the four stacked ones simply pass `undefined`, which is exactly
  what `paletteForTone` wants.
- **These shelves are colour swatches and NOT to the size canon, flagged
  rather than done quietly.** _(OVERRULED the next day — see the
  2026-08-17 decision above: flagging a departure from the canon is not
  permission for it. The shelves have since been removed entirely.)_ Every species is drawn at the same 7rem card
  here, because a shelf true to the proportions would need either a
  chitu too big for the page or a plip too small to judge a colour
  on. The canon is Kimia's "everywhere and always" rule, so the departure
  is written down in the component, in the reply to her, and here: the
  cast shelf above remains where proportions are checked, this shelf asks
  only "does this drawing wear these colours", and nothing on the
  workbench feeds the app. The four real screens still take their sizes
  from `friendCanon.js` in the task that swaps the drawings in.
- **Still open:** the other eight species — meuhy, krupengk, zala,
  liwi bi-jiji, rassatt, woigolp, chitu, hamdi bulo. One line each now.

## T5.3e build notes (part 3) — the deal, the names, and the emptying (2026-08-17)

- **The deal.** `individualColour(key, individual, worldSeed)` and
  `speciesColours(key, worldSeed)` now shuffle rather than count. One
  Fisher-Yates pass over the ten colours, its randomness from the same
  seeded `randomUnit` the drops use, seeded `worldSeed|friend-colour|key|i`
  — the species is in the seed so two species in one game are not
  colour-matched down the ladder, and `i` is in it so each swap gets its
  own throw. Dealing off the top of one shuffled pack is what makes "no two
  siblings" true by construction rather than by luck. The old
  `offsetFor()` runs are gone.
- **The tests moved from "what colour" to "what promise".** Colours are per
  save now, so most of them ask five stand-in worlds rather than the module:
  no sibling clashes in any of them, ten plips wearing all ten colours in
  some order, two saves getting different hands (Kimia's "different players
  might get different colours"), and one save getting the same hand every
  time it is asked (the half that makes a friend recognisable).
- **It reached the GAME, not just the workbench.** `FriendGlyph.jsx` — the
  T4.4 placeholder line-art the Guest Book, reveal, cameo and Abode all
  draw — used to roll its own hue anywhere on the wheel. It now asks
  `individualColour` and paints with `toneAtLightness()`, a new one-shade
  version of `paletteForTone` in `friendPalettes.js` for art that has no
  ramp to re-paint. So the settled palette is live on the real screens
  today, and swapping Kimia's drawings in later changes the shape without
  disturbing the colour.
- **The rename.** Ten species keys, every mention in code, CSS class,
  test and doc. Two of them are two-word names, so their keys are
  hyphenated and quoted — `'liwi-bi-jiji'`, `'hamdi-bulo'` — while the
  display name on the right of `names.js` keeps its space. Two traps worth
  recording: a blanket find-and-replace turns `const poet =` into a syntax
  error, and — far worse — it rewrites KIMIA'S OWN WORDS, because her
  narration legitimately calls the chitus "N-Z-D's finest poets" in plain
  English. Her two content files were done separately, converting only what
  sits OUTSIDE quotes, so keys and comments changed and not one word of
  hers did.
- **The emptying.** `DesignPage.jsx` went from nine families to two. Gone:
  the friend eye, the nine traced archetypes, friend 10, the zala pilot,
  the individuals' colour shelves, the night sky, the rolling planet, the
  drop arrival and the cameo firework — each either already visible in the
  running app or already answered. Left: the texture library and the abode
  sky, the only two that have never been anywhere but here. About 480 lines
  of component and 260 of CSS went with them, and a new test fails the
  suite if a settled family creeps back on.
- **Two superseded pilot drawings were deleted**, `src/ui/signer.jsx` and
  `src/ui/storyteller.jsx` — hand-drawn demos from 2026-07-26, replaced by
  friend 04 and friend 08 in the full traced cast of 2026-08-10.
  `storyteller.jsx` had already been unimported for a week. Recoverable
  from git if either is ever wanted back.
- **`tracedFriends.js` survives with no reader.** It is the only record of
  which numbered drawing is which species, so it waits for the task that
  puts the real drawings on the four screens.

## T5.3d build notes — the size canon (2026-08-17)

- **`src/ui/friendCanon.js` is the permanent home**: ten unitless ratios
  keyed by species, `friendScale(key)`, `friendSize(key, base)`, and
  `FRIEND_CANON_ORDER` for anything walking the cast. It sits in
  `src/ui/` and not `constants.js` on design-notes §11d's boundary —
  these are proportions of DRAWINGS, consumed only by the code that
  paints SVG, the same class of value as `friendPalettes.js` and the
  texture tints. constants.js is for tunable game numbers, and nothing
  here can be retuned without redrawing the character sheet.
- **The anchor is the largest friend at 1** (the chitu, 11.5rem on the
  sheet). Every other ratio is then a fraction of the biggest, and a
  screen's base size reads as "how much room the biggest friend gets
  here" — a more natural thing for a render site to decide than an
  abstract unit. Worth knowing: **the hamdi bulo is fractionally smaller than
  the chitu** despite topping the ladder. That is the sheet, not a bug;
  §9c has always said sophistication climbs through texture, appendages
  and silhouette rather than size.
- **Six figures, not four.** The first pass stored four decimal places
  and the pair test failed: a ratio's error is multiplied by whatever
  base a screen picks, and the tiny plip (0.1391) carried enough
  relative error to throw its ratio against the baluhm off by 0.0007.
  Six figures puts every pair within a thousandth of a percent.
- **The test is about PAIRS, and its tolerance is relative.** Kimia's
  rule is that the ten stand in the sheet's proportions, so the test
  compares every friend against every other friend rather than checking
  ten sizes one at a time — a per-friend test would pass a cast that had
  been scaled wrong *together*, which is exactly the failure the rule
  exists to prevent. The tolerance is a fraction of the value, not a flat
  amount, because a flat margin is generous on the largest friend and
  impossible on the smallest. The test keeps its **own second copy of the
  sheet measurements**: that duplication is the point, since it is what
  catches a future task tuning "just one friend" by hand.
- **Both halves of the old split are gone.** The rem column left
  `tracedFriends.js` (which now maps drawing number → species and picks
  a shelf base of 11.5rem), and friend 10's `width: 11rem` left
  `index.css`, replaced by an inline size from the canon like the other
  nine. Its aspect ratio moved out of CSS at the same time, since it was
  a hand-copy of the artwork's own viewBox.
- **Verified nothing moved**, which was the claim worth checking: with
  the dev server up, every one of the ten cards measures its previous
  width to within half a thousandth of a rem, and friend 10's aspect
  ratio survived the move. Measured by DOM query rather than screenshot —
  the workbench is a long page and CLAUDE.md's browser note applies.
- Not touched: the four screens that draw friends (see the scope call
  above), and `FriendGlyph.jsx`'s placeholder art.

## T6.12 build notes — the quick check-in (2026-08-14)

- `CheckInPanel.jsx` gained two pieces of its own state, both plain
  component state that resets with each sitting: the charm lens
  (`filter`) and whether a folded day is showing in full (`expanded`).
  A check-in is one sitting; the next one starts fresh with everything
  shown. (Whether the lens should REMEMBER itself is T6.11's question,
  for the home screen's lens — deliberately not answered here.)
- `DayRows` no longer works out its own list. It is handed one, which is
  what lets the panel fold yesterday (slice the list) and filter every
  day (`listedOn` = `habitsOn` seen through `filterBySymbols`) without
  the fold and the lens knowing about each other. The lens is a VIEW,
  never a filter on what counts: a habit the lens hides keeps whatever
  was marked on it.
- `CHECKIN_ROWS_BEFORE_MORE = 8` in `constants.js`. At the compressed
  row height, 8 rows leave both the earlier-days offer and the done
  pebble inside one laptop screenful (measured: 557px of panel in an
  860px window, 657px with all 11 rows unfolded).
- The compression is CSS only, all of it scoped under `.check-in` — the
  home list is untouched. Nothing about the rows changes but their
  measurements: same charm fill, same edge, same controls.
- `checkInByChoice` in App tells the two check-ins apart. It is set true
  only by the rail's pencil, and false again by the day-rollover effect
  (a day that turns over while the page is open owes its check-in like a
  fresh visit). The veil's click handler is `undefined` when the
  check-in was owed, so there is no dismiss path to reach at all rather
  than a handler that declines — and the handler that does exist fires
  only when the press landed on the veil itself, never inside the panel.
- `scrollToTop()` is guarded for jsdom, which has no layout and answers
  `window.scrollTo()` with "Not implemented" on the console. `setup.js`
  now stubs it to a quiet no-op that `vi.spyOn` can still watch, which
  is how the two scroll rules are tested in both directions.
- Browser-verified (the fold, the lens, the jump and the click-away all
  need a real layout): rows 37px → 29px, the fold and unfold, the lens
  narrowing to two rows and the `…` correctly vanishing with nothing
  left to hide, done jumping from scrollY 492 to 0 and STAYING there
  through the re-render, and a hand-opened check-in closing on a veil
  press with the page still at 400.

- 2026-08-16 (T5.2e follow-up, Kimia's call): **the check-in's bars
  arrive where they WERE, and then travel.** She looked for the held
  movement on a real morning and saw nothing; the code was firing
  correctly (proved in the browser — the class appeared on `done` and
  settled a beat later), and the fault was the design. Closing the
  check-in does not UPDATE the meters, it CREATES them, that screen
  having no header at all — so the bar painted straight at its new
  length and the one legible half of a movement, the bar crossing the
  distance the week earned, never happened. What was left was a glow, in
  the same instant the whole header appeared and the page jumped to its
  top: the worst moment to show something small. The meters now hold
  their pre-check-in numbers for `CHECKIN_MOVE_HOLD_MS`, then move, and
  the glow fires with the travel rather than ahead of it. Offered
  alongside three cheaper options (delay the glow, borrow the brighter
  roll-over beat, or drop the ceremony and let the drops be the news);
  she chose the travel. Folded into §4.
- 2026-08-16 (working note): **a passing test proved less than it
  looked.** The held movement had a test asserting the class appears on
  `done`, and it passed throughout — because the class DOES appear. No
  test could have caught this, because what was wrong was that the
  moment was invisible, and invisibility is not a property jsdom has an
  opinion about. It took reproducing the real morning flow in a browser
  and reading the bar's width alongside its class. **When a visual
  moment is reported missing, measure what the eye would have had to
  see, not whether the code ran.**
- 2026-08-16 (T5.2e, session 56 — Kimia's call): **the firework leaves
  the reveals for the cameo.** Asked to check the §5 spec before
  building it, she read her own 2026-07-19 decision back and rejected
  its target: first-occurrence reveals and friend arrivals already dim
  the whole screen and put a neon card in the middle of it, so a burst
  of stars around them would have been decoration on top of a takeover.
  The spec sentence ("a burst of confetti-like stars around the drop")
  dates from when a reveal was pictured as happening around a drop on
  the page, which stopped being true when the reveals were built as
  overlays. Her redirect: it belongs to the **home-screen cameo** (§8),
  the one moment that celebrates HER rather than a thing arriving.
  Folded into §5 (as an amendment, since the middle-path decision it
  revises is load-bearing elsewhere), §8 and §10's decision 1.
- 2026-08-16 (same session): **only the two rarest wins get it.** A
  record streak and a 50-lived-day milestone burst; a **big day keeps
  its quiet visit**, because it can happen again next week and §8's own
  argument is that a greeting you can see any time is wallpaper. Chosen
  over "all three" and over "the milestone alone".
- 2026-08-16 (same session): **the burst rings the whole visit**, wears
  the shimmer's night-sky mix (half white, half the six charms), and
  **travels outward** — the one thing the shimmer does not do, and what
  tells a firework from a sparkle at a glance.
- 2026-08-16 (same session): **every arrival shimmers now.** A friend
  and a first find used to be skipped on the grounds that the firework
  was theirs; with the firework gone from the reveals, that would have
  left the biggest arrivals as the only ones landing without a sparkle.
  Their stars are held until the reveal is dismissed — an arrival behind
  a full-screen overlay would otherwise spend its whole shimmer unseen.
- 2026-08-16 (working note, same session): **a translucent tile can hide
  a stacking bug in plain sight.** The cameo and `.habit-row` are both
  `position: relative` at `z-index: auto`, so the tiles paint over every
  star that flies below the visit — and because the tiles are
  see-through, the swallowed stars still glowed faintly and the burst
  read as merely dim. The first attempt to demonstrate the bug FAILED
  for exactly this reason and nearly retired a correct fix. It only
  showed once a tile was forced opaque. **When a paint-order fix looks
  unnecessary, remove the translucency before believing it.**

- 2026-08-16 (same session, second pass — Kimia's calls): **the cameo
  takes the drop's conventions.** Having seen it built, she asked for
  the visit to stop being a bare column in the page flow: the friend
  sits **inside a blob** like an arrival's, the caption sits **directly
  beneath it on its own dark backing**, the whole thing is **pinned to
  the bottom left of the window** (the mirror of the shelf's top right),
  and the **friend's name is dropped** — the friend and the caption,
  nothing else. Reasoning recorded in §8: a cameo and a drop are the
  same kind of event, something arriving over the page, and the old
  layout also pushed the entire habit list down whenever a friend
  turned up.
- 2026-08-16 (same session): **it fits the margin beside the habits,
  until it can't.** The visit takes whatever empty margin the 40rem
  content column leaves and the caption wraps into it — but never below
  a floor, under which it covers the tiles instead. Kimia's call and her
  words: try to fit the blank space, but allow the coverage rather than
  squeeze the words out of legibility. The backing behind the caption is
  what makes covering acceptable at all.
- 2026-08-16 (same session, third pass — Kimia's call): **the caption's
  backing is sprayed, not drawn.** The first cut used a rounded
  rectangle, which cut a hard edge across whatever tile the visit landed
  on — "it comes off looking like black spray paint" was what she wanted
  and the box was not it. Now a radial fade: full strength under the
  words, gone before it reaches anything else, no edge to notice. Two
  things this needed beyond the gradient itself — a **plateau** out to
  45% before the falloff starts, or the ends of the sentence sit on
  almost nothing; and a transparent stop that is **the same colour at
  zero alpha** rather than the `transparent` keyword, which fades
  through a different colour on the way and greys the halo. Folded into
  §8.
- 2026-08-16 (working note, same session): **the name went, so the
  test for it had to invert, not vanish.** The two cameo tests asserting
  a name were rewritten to assert its ABSENCE — and deliberately with a
  name present in the fixture, since a test that only checks "no name
  shows when no name exists" would pass just as happily if the name line
  came back.
- 2026-08-16 (T5.2e, glow-scale session — session 57): **glow becomes a
  scale, not fifteen opinions.** Every glowing thing in Habitat carried
  its own hand-typed radius — 15 distinct values across ~40 rules, in two
  units that behave differently (px never moves with text size, rem
  does). Nobody had chosen that list; each number was typed while
  building the thing in front of it. They are now **six named steps in
  `tokens.css`**, each about half again the last, all in rem, named for
  the job — faint · resting · lifted · bright · pop · max. Every old
  value snapped to its nearest step and nothing moved by more than
  1.6px, so this is a refactor with no visible change. Same shape as the
  spacing pass four days earlier, and the last thing §11d was owed.
  Folded into design-notes §11d.
- 2026-08-16 (same session): **a glow that lights a box is not on the
  ladder.** The reveal/party card's halo is 3rem — several times any
  glyph radius, because it surrounds a whole panel rather than a symbol.
  It gets its own name (`--glow-card`) instead of a seventh step, the
  same carve-out positions get from the spacing scale: a different job,
  so a different name rather than a step nothing else could ever reach.
  Its negative spread stays in the rule, since spread pulls the halo back
  off the edges and describes that shape rather than how far light goes.
- 2026-08-16 (Kimia's call, same session): **the organic things get the
  top of the scale — but not today.** Asked whether to lift the drop
  items to full glow while the scale was being built, Kimia stopped it:
  flora, fungi and friends are the ones that go to the top (**not**
  publications, curiosities or the map), and none of those things is in
  its final form yet — they are placeholder shapes awaiting T5.3's real
  art. Raising a placeholder's light only tunes something about to be
  replaced. Notable: this is **design-bible §7's glow ladder verbatim**,
  written 2026-07-24 and unprompted here — the rule was already law, and
  the placeholders simply never honoured it. §7 now carries the step
  names so spending it in T5.3 is a lookup rather than a fresh argument.
- 2026-08-16 (working note, same session): **which top step "full" means
  is left open on purpose.** `--glow-pop` and `--glow-max` are both
  candidates and the honest answer needs finished art to look at: the
  charms wear pop at rest with room around them, whereas flora and
  publications sit in packed grids where a wide glow on every tile can
  smear into one haze instead of separate glowing things. Recorded as an
  eyeball call for T5.3 rather than guessed on paper now.

- 2026-08-16 (T6.13, Kimia's call — language session): **Habitat is
  built to hold a second language, so it can be offered to Farsi
  speakers.** Every interface word moved out of the components into one
  keyed catalogue, `src/content/ui.js` — Kimia's file, like the rest of
  `src/content/`. The language is a setting inside the storage envelope
  (schema v11), so it survives a reload and rides in backups.
- 2026-08-16 (same session): **a blank slot in `ui.js` falls back to
  English, not to silence** — the one place in `src/content/` where that
  is true. Silence is right for an unwritten story beat; a blank button
  is just a broken control. The fallback is the whole reason a language
  can be filled ONE WORD AT A TIME: fill three slots and three words are
  Farsi, the rest keep working in English. It also means nothing is ever
  machine-translated — an unfilled slot shows a real human's English.
- 2026-08-16 (same session): **each language names itself in its own
  script, in every block** ("English" / "فارسی"), so the switch reads
  the same whichever language is on. Someone who lands in a language
  they cannot read must still be able to find their way back; a switch
  that renamed itself would be a trap. These are the only two Farsi
  slots that ship pre-filled.
- 2026-08-16 (same session): **the switch sits BELOW the three footer
  controls, not on that line** — the three-button row is a decided shape
  (2026-08-12) and `App.test.jsx` pins it at three. Its placement is
  otherwise provisional: Kimia has not yet seen it, and moving it is a
  matter of rendering it elsewhere.
- 2026-08-16 (working note, same session): **the shape of the week is
  NOT a language question, and must not be wired to the language
  switch.** Kimia asked for Farsi to bring a Saturday–Friday week along
  with the Jalali calendar. Those two are different in kind:
  - the CALENDAR is display-only. Day keys stay `YYYY-MM-DD` Gregorian
    and go on driving every streak; only the date line and the field
    notes' labels would render Jalali. Contained, and safe to attach to
    the language.
  - the WEEK is not display. `weekStart()` in `game/days.js` is a single
    function, and moving it moves what the DATA MEANS: which days an
    N-per-week habit's streak is judged over, how the field notes slice
    history, and — because "past days are editable only while their
    Mon–Sun week is the current one" is a product guardrail — which past
    days are still editable and which have frozen. Tying that to the
    language switch would mean toggling to Farsi silently re-judges her
    existing history, and toggling back re-judges it again.
  So: if the Saturday week is wanted, it is **its own setting**, decided
  once, independent of language — and the guardrail in CLAUDE.md and
  spec.md §4.2 has to be reworded off "Mon–Sun" first. Left undecided
  here on purpose; it is Kimia's call, not a detail to guess.
- 2026-08-16 (working note, same session): **what T6.13 deliberately did
  NOT touch.** No layout direction (right-to-left), no typography, no
  calendar, no week. Farsi is cursive, so the 18 letterspacing rules in
  index.css have to switch off for it; Persian has no upper/lowercase,
  so the wordmark and date styling have no Farsi equivalent; and
  `system-ui` does not render Persian dependably, so a real webfont
  (~150KB, Habitat's first) would be needed. Each is a separate slice
  with a visible result Kimia can react to, which is how design work on
  this project goes.

- 2026-08-16 (Kimia's calls, reviewing T6.13 — same session): **five
  decisions that reshape the language work.**
  1. **The wordmark stays Latin in every language.** HABITAT is not a
     slot and never will be — a constant, with no key to translate and
     no way to change it from a content edit. Applied immediately.
  2. **Architect for MORE than two languages.** Farsi is the first
     additional language, not a special case. This is what settles the
     file's shape below.
  3. **It is a COPY deck, not a translation file.** T6.13 framed it as
     "the languages file", which makes it specifically functional
     instead of generically functional. Its real job is to be the one
     place all copy lives and is edited — including English — so that
     wording is never hunted for inside a component again, and so it
     stays current as we change things. Layout is therefore
     **key-first**: one entry per piece of copy, carrying a
     plain-English note and every language beside each other. Adding a
     language is adding a line per entry. Chosen over a block or a file
     per language because those put a word and its translation far
     apart, which defeats the point.
  4. **The deck absorbs the other content files** — narration.js,
     names.js, mishap.js, blocked.js — into labelled sections, with
     **two blank-rules stated per section**: interface falls back to
     English, story and names stay silent.
  5. **The week gets three shapes** — Mon–Sun, Sun–Sat, Sat–Fri — as its
     own setting, independent of language, exactly as the previous
     working note argued it had to be. Kimia's framing, which is the
     one to keep: *the data does not change, only the unit of analysis
     through which it is viewed.* A weekly spike from a Sunday mark
     lands in a different bar after a switch because the bars are drawn
     differently, not because anything was edited.
- 2026-08-16 (audit, same session): **T6.13 caught about 55% of the
  copy.** Kimia spotted the missing cameo text; a full audit found ~110
  more slots against the 130 already keyed. The categories, all four
  confirmed as in scope: arrival and cameo text, weekday and month names
  and a.m./p.m., backup and import error messages, confirm dialogs and
  the schedule-change warning, charm names, difficulty options, graph
  zoom labels, field-notes navigation. The audit also exposed a
  standing bug: **the weekday names exist in four separate copies**
  (days.js, HabitRow, HabitForm, CheckInPanel), so changing "Mon" today
  means finding four files. T6.14 collapses them to one.
- 2026-08-16 (same session): **completeness needs its own test.** A deck
  that is merely consistent will drift back out of date as components
  grow new strings — the exact problem it exists to end. T6.14 adds a
  source scan that fails the suite on a new hardcoded user-facing
  string, the way pebbles.test.js guards buttons.
- 2026-08-16 (Kimia's call, same session): **infrastructure first,
  translation last** (T6.14 → T6.19). Habitat should already WORK in
  Farsi shape — right to left, right lettering, right calendar — before
  any words are translated, so layout surprises are found against a
  finished frame rather than blamed on the copy. Translation itself is
  **AI-drafted with human review, slot by slot**: the one place the
  never-writes-the-copy rule bends, and only this far — a machine draft
  is a suggestion in a review queue, never a slot filled in her name.
  Unreviewed stays blank; blank interface shows English. Habitat can be
  partly translated, never wrongly translated.
- 2026-08-19 (Kimia's calls, T5.3g — **this replaces the "64 flora
  species" reading of 2026-07-24**): **N-Z-D grows four flora
  silhouettes, not sixty-four.** The 64 flora are those four shapes in
  two sizes wearing six fills: **4 × 2 × 6 = 48 collectible**, and the
  **16 landmarks are four super-sized versions of each of the four
  species**. Nothing about the counts changed — 64 flora, 48 gatherable,
  16 on the Map, one per region — only what is DRAWN to reach them, which
  falls from 64 drawings to 4. Variation now lives in size and fill
  alone; the earlier axes (leaf shape, fruit, texture) were written when
  there were 64 shapes to tell apart. Folded into design-bible §9a and
  §12, spec §5 (the landmark paragraph) and plan.md's T5.3g.
- 2026-08-19 (Kimia's call, T5.3g): **the flora wear four colours —
  emerald, leaf, sky, azure** (`src/ui/floraColours.js`), rich and
  bioluminescent. Twelve candidates went up on the workbench as plain
  glowing squares, three per hue. She had named the four hues on paper as
  "green, blue, indigo and aqua"; off the screen she took **two greens
  and two blues** and neither of the other two. **There is no aqua and no
  indigo in Habitat's flora.** The eyeball pass beat the written
  description again — the same lesson as T5.2c, arriving this time as a
  narrowing rather than a rejection. It is also the second half of the
  friend/flora boundary: flora are deep and vivid, friend pastels soft
  (`friendColours.js` reserves blues and greens for exactly this).
- 2026-08-19 (Kimia's calls, T5.3g): **a flora fill is a hair texture
  worn in a colour, and there are six** (`src/ui/floraFills.js`). Hair
  textures ONLY — no moss, bark, pores or sponge; flora are furred, not
  crusted. All four hair modes are used with **curly coat and dense
  underfur doubled** (1+2+1+2 = 6). And **the hair forms the fill inside
  the silhouette** — it never fringes out past the outline, so a drawing
  clips the field to its shape (the generator scatters strands beyond its
  box by design, so the clip is the rule's only enforcement; a test holds
  it). The colour pairing was left to Claude and proposed as: each
  doubled texture takes one green and one blue, so no texture belongs to
  a single hue and the six split three green / three blue.
- 2026-08-19 (working note, T5.3g — **superseded later the same day** by
  the two size classes below; no sheet was needed): **the flora need a
  sizing sheet and do not have one.** Two sizes per species plus a landmark super-size is
  exactly the problem T5.3d solved for the friends — one sheet from
  Kimia, read into unitless ratios that hold everywhere and always. She
  does not have it yet, so no flora size is set anywhere and no screen
  may type one in by hand in the meantime. The §9c canon rule governs any
  family, not only friends.
- 2026-08-19 (working note, T5.3g): **"the 8 new flora silhouettes" is
  retired as a task name.** It referred to eight drawings on Kimia's
  Desktop from July (seven of them traced; flora 5 never was). With four
  species settled, those eight are candidates to choose four from, not a
  set to import — and the silhouette session comes after the fills.
- 2026-08-19 (Kimia's call, T5.3g): **the four silhouettes are flora 1,
  2, 3 and 6** of those eight. Her traces are kept verbatim in
  `src/ui/floraSilhouettes.js`, under HER file numbers rather than
  renumbered 1–4, so the trail back to the drawings on her Desktop never
  breaks. They are not named — that is T6.1, and the names come from her;
  the `label` on each entry is only the word on her own exported file.
- 2026-08-19 (Kimia's calls, T5.3g): **the two collectible size classes
  are set** (`src/ui/floraCanon.js`). A flora's size is its **HEIGHT**,
  not its width or its bulk. **All four species share the two classes** —
  a species is not big or small, a flora is. **Small stands as tall as a
  zala, large as tall as a chitu**, so large reads 37% taller. And the
  numbers live in the **friends' own scale**, whose 1 is the largest
  friend's width, because flora, friends and eventually objects share the
  Abode and must be true to each other rather than each true to their own
  family; when the objects are drawn they join this scale rather than
  starting a third.
- 2026-08-19 (correction, T5.3g): **she first pegged the large class to
  the RASSATT, and the arithmetic said no.** The rassatt is wide and low:
  by height it is 2.6% SHORTER than the zala, so "small = zala-tall,
  large = rassatt-tall" would have produced two classes the same size.
  Shown the whole cast's heights she re-pegged to the chitu. Worth
  remembering as a pattern, not a one-off — the friends' canon numbers are
  WIDTHS, so a friend's rank by width says nothing about its rank by
  height, and any future "as big as an X" call has to be checked in the
  measurement it will actually be used in.
- 2026-08-19 (working note, T5.3g): **no sizing sheet was needed after
  all.** T5.3d had to measure ten drawings off a pixel character sheet;
  the flora needed no such thing, because pegging to two friends makes the
  two numbers a derivation instead of a measurement. `floraCanon.test.js`
  re-derives them from `friendCanon.js` and the two friends' own drawings
  on every run, so if the cast is ever redrawn the suite says so rather
  than the flora drifting quietly.
- 2026-08-19 (Kimia's call, T5.3g — same day, on seeing them drawn):
  **the small class is HALVED and both classes are LOCKED.** Shown the two
  classes standing beside the zala and the chitu she said the small ones
  were too tall and cut them in half, so small is now **half a zala's
  height** (0.280993) and large is unchanged at a whole chitu's (0.770215)
  — a large flora is 2.74× the height of a small one. This is the eyeball
  method paying for itself twice in one day: the arithmetic caught the
  rassatt peg before anything was built, and her eye caught the small
  class after. The derived number was the proposal; her eye was the
  decision.
- 2026-08-19 (Kimia's call, T5.3g): **the size comparison came down and
  the flora got dressed.** With the sizes locked, the ruler friends and
  the small class left the workbench the same session that put them there
  — the waiting-room rule, applied the moment the question closed. What
  stands in their place is the four shapes at their LARGE size wearing all
  six fills (24 of the 48 collectibles), which is the last open question
  of the ordinary flora.
- 2026-08-19 (Kimia's call, T5.3g): **the flora sizes are places in the
  whole sizing table, not one friend's height each.** They were derived
  through two particular friends — large = a chitu's height, small = half
  a zala's — and she cut them loose from that once the sizes were settled:
  a flora should sit where it sits among everything on N-Z-D, not be
  hostage to two individuals who might be redrawn. The numbers were
  rounded to **0.28 and 0.77** in the same breath, since a chosen number
  should look chosen rather than like the residue of a calculation (the
  drawn size moved by a third of one percent). `floraCanon.test.js` now
  rebuilds the whole cast's ladder BY HEIGHT and guards each class's
  PLACE in it — small between the plip and the baluhm, large between the
  meuhy and the hamdi bulo — instead of its tie to any one friend.
- 2026-08-19 (T5.3g, built and REVERTED the same day): **the edge rule —
  the dark ground shrunk and softened so it never reached the outline.**
  Kimia rejected it on sight: it thinned the flora rather than filling
  them, and the dark ground had not been the problem. Superseded by the
  dense-field rule below, which is the same complaint diagnosed properly.
- 2026-08-19 (Kimia's call, T5.3g — **this is the fix, and her own
  diagnosis**): **a flora is cookie-cut from the middle of a big dense
  field of hair.** She named the real cause: every field is thin along its
  SOUTHERN edge, because the generator grows strands upward from scattered
  roots, so a point near the bottom is covered only by the few roots
  beneath it while a point in the middle has everything below it too. Cut
  a shape from a field its own size and it wears that thin band across its
  underside. So the field is grown larger than the shape — enough room
  below for a whole strand's reach — and repeated until the tuned density
  is back over the bigger area, and the shape is cut from the middle.
  `denseHairField()` in `textures.jsx` is the rule; `textures.test.jsx`
  measures the bottom fifth of every mode against its middle fifth, which
  went from 0.32 to about 1.0. The dark ground behind the strands is
  unchanged and was never the problem.
- 2026-08-19 (Kimia's call, T5.3g): **the ORDINARY flora are closed.**
  The six fills were approved on all four shapes and the design of the
  collectible flora is finished: four silhouettes, four colours, six
  fills, two sizes and the drawing recipe. What is left under T5.3g is
  the LANDMARK class, which she opens in its own session.
- 2026-08-19 (Kimia's call, T5.3g): **the flora, flora-fill AND HAIR
  shelves left the workbench together.** The hair went with them by the
  waiting-room rule and not as a casualty: it was on the page to be judged
  as the flora's surface, and it has now been judged as exactly that. The
  textures themselves are untouched in `textures.jsx` and design-bible §8
  — every flora is still made of them — they simply have no question left
  standing over them. What remains on the workbench is the seven filter
  surfaces (which still dress no real asset) and the abode sky (which has
  still never reached the real Abode screen).
- 2026-08-19 (Kimia's call, T5.3g): **fixed-size hair is settled.** The
  strands being the same size on screen on every species — rather than
  scaling with each trace's own canvas — was shown to her and approved as
  it stands.

## T6.13 build notes — one keyed catalogue for every interface word (2026-08-16)

**What changed.** About 130 interface strings — button words, page
titles, hover labels, screen-reader names — moved out of ~20 components
into `src/content/ui.js`, which holds an `en` block and a `fa` block.
Components read them through `useText()`:

    const { t } = useText()
    …then t('habitForm.save') wherever the word goes.

**The three pieces.** `src/content/ui.js` is the catalogue AND the pure
translator (`translate`, `isLanguage`) — pure, because `storage.js` and
`game/backup.js` both need it and neither may import React.
`src/ui/language.jsx` is only the React part: a context provider and the
`useText` hook. `src/ui/LanguageSwitch.jsx` is the control.

**Why App had to split.** `App` is the component that READS the stored
language, so it could not also sit inside the provider that supplies it.
It is now two: `App` owns the saved data and renders
`<LanguageProvider language={…}>`; `AppBody` takes that data as props and
holds everything else. That way every component — `AppBody` included —
gets its words through the same hook, with no special case.

**Why hand-written and not a translation library.** ~130 words, two
languages. A library would add a dependency, a config file and a
vocabulary to learn, to replace about forty lines.

**How we know it works.** 784 tests pass — including the 382 existing
assertions that look controls up BY THEIR ENGLISH NAME, which is what
proves the sweep changed no English output anywhere. New tests cover the
mechanism only, never the words: both blocks carry the same keys, English
has no blanks (it is what blanks fall back to), a blank Farsi slot comes
back in English, an unknown key returns itself so a typo is loud, and
`{holes}` fill wherever the sentence puts them (Farsi word order differs).
`storage.test.js` covers the v10→v11 upgrade, and `App.test.jsx` covers
the switch saving, surviving a reload, and leaving every rail label
worded while Farsi is blank. Verified in the browser too: with one Farsi
slot temporarily filled, that one label rendered Farsi and every other
stayed English — partial translation working exactly as designed.

**What is NOT done.** Nothing is translated. The design workbench
(`DesignPage`) stays English on purpose — it is a working tool, not part
of the game — though the door to it is copy. Error text thrown from
`storage.js` on a bad import file is still English: those messages are
thrown from a pure module with no translator to hand, and wiring them up
is a small separate piece.

## T5.2e (part 7) build notes — the glow scale (2026-08-16)

- **`src/tokens.css`** — a GLOW section beside the spacing scale: six
  steps (`--glow-faint` 0.2rem · `--glow-resting` 0.3 · `--glow-lifted`
  0.4 · `--glow-bright` 0.6 · `--glow-pop` 0.9 · `--glow-max` 1.5) plus
  `--glow-card` 3rem off the ladder. The header's "GLOW is still not
  here" note became a record that it is.
- **`src/index.css`** — 32 declarations repointed at the steps. The
  mapping, so the snapping is auditable: 3px and 0.2rem → faint; 4px,
  5px and 0.35rem → resting; 6px and 0.4rem → lifted; 9px, 10px and
  0.6rem → bright; 14px, 0.8rem and 1rem → pop; 24px → max; 3rem → card.
  The largest move is 1.6px (0.8rem and 1rem, meeting in the middle at
  0.9rem); most are under half a pixel.
- **`src/test/tokens.test.js`** — a fourth check, the glow twin of the
  raw-colour one. It pulls every `drop-shadow(…)`, `box-shadow:` and
  `text-shadow:` out of index.css, strips the `var(--…)` calls that are
  doing their job, and fails on any positive length left over. A
  NEGATIVE one passes — that is a spread, which belongs to a shape, not
  to the scale. Verified against samples that it actually bites (a raw
  `7px`, a raw `0.45rem`) and does not false-positive on the card's
  `-0.5rem`, on `box-shadow: var(--shadow-lifted)`, or on a `transition`
  that merely names box-shadow as a property.
- Nothing else changed: no component, no test besides that one, and no
  pixel that moves more than a hair.

## T5.2e (part 6) build notes — the cameo takes the drop's shape (2026-08-16)

- **`src/ui/blob.jsx`** — the three outlines and `blobFor` lifted out of
  ArrivalShelf.jsx, because the cameo became the second caller. Exported
  as a `<Blob id className>`: the drawing is shared, the placing is not,
  so each caller sizes it with its own class. `blobFor` stayed private —
  nothing outside needed it, and exporting it only earned a fast-refresh
  warning.
- **The blob is picked from the win AND the visitor**, not at random, so
  re-deriving the same win brings back the same shape as well as the
  same friend — the T3.1 no-slot-machine rule, which the seeded friend
  pick already followed.
- **`--veil-caption` joins the veil family** in tokens.css, with
  `--veil-caption-fade` beside it as the zero-alpha end of the spray.
  Not a full-screen wash like the other two: a small backing behind
  floating words that can land anywhere, and darker than the check-in's
  veil because it has only a couple of lines' area to work in.
- **`--cameo-min` rose from 9rem to 11rem** when the backing became a
  spray. The floor now includes the fade, which is padding rather than
  ink — taking that room out of the words instead would wrap a
  three-word sentence onto three lines.
- **The visit wears `--friendship`**, the soft rose an arriving friend
  already wears (`.arrival-friend`), rather than a colour of its own — a
  visiting friend and an arriving one should be lit the same way.
- **`max-width: max(--cameo-min, calc(50vw - 20rem - …))`** is the whole
  of the fit-the-margin rule; no measuring, no JavaScript. Verified in
  the browser at three widths: 1440px (352px of room, comfortably
  clear), 1000px (the floor takes over, still clear), 820px (covers the
  edge of a tile, caption still fully readable on its backing).
- **The entrance flipped** from `translateY(-4px)` to `+6px`: it used to
  drop in from above, which was right while it sat in the page flow and
  wrong the moment it was pinned to the bottom.
- **The workbench puts the visit back in the flow** (`position: static`)
  — two window-pinned cameos would otherwise land on the same spot. The
  same override, for the same reason, that `.shimmer-swatch` already
  makes for the arrival shelf.

## T5.2e (part 5) build notes — the firework finds its moment (2026-08-16)

- **`src/ui/firework.jsx`**, the shimmer's sibling and built on its
  rules: 24 authored stars as percentages of whatever box they are laid
  over, so one table fits a cameo at any size and nothing is measured at
  render time. Twelve white, two per charm, three sparkles among the
  dots. The star table gives each one's RESTING place; a module-load
  pass turns that into a launch offset `TRAVEL_PX` back along the line
  to the centre, which is what makes every star fly outward from the
  middle rather than drift in a direction of its own.
- **Travel is absolute px, not proportional** — same reasoning as star
  sizes: the burst carries the same distance whether the message ran to
  one line or two.
- **`--fly-x` / `--fly-y` have CSS defaults**, and not for tidiness: a
  `calc()` naming a custom property that does not exist is an INVALID
  value, which would have taken the whole transform down and piled every
  star on one spot. Defaulting to no travel means a star that never got
  its offset sits still and fades — duller, never broken. (`tokens.test`
  caught the missing definitions and was right to.)
- **`.cameo` gained `z-index: 1`** — above the resting habit rows, below
  a row being dragged (2, it is under a finger), the shelf (4), the
  check-in (5), the reveals (10) and the startup (20). See the working
  note above for why this nearly went unbuilt.
- **The workbench mounts the REAL `Cameo`**, twice: a `livedDays` win
  beside a `bigDay` one, so the whole decision — which wins burst and
  which stay quiet — is one glance rather than a description. It could
  not have caught the stacking bug, though: no habit list sits under it.
- Tests: `firework.test.jsx` pins the composition and, more usefully,
  the **sign of every launch offset** — a star resting right of centre
  must start to its own left. Getting that backwards would implode the
  burst instead, and no count or colour assertion would notice.
  `Cameo.test.jsx` pins which wins burst. The four ArrivalShelf tests
  that encoded "reveals don't shimmer" were rewritten, not deleted: two
  still assert the hold-until-dismissed timing, which survived.

## T5.2e (part 4) build notes — the bars travel (2026-08-16)

- One lag does all of it. `useShownReading` decides which numbers the
  bars are DRAWING — the live ones normally, the pre-check-in ones for
  one held beat — and everything else already keys off that: the glow,
  because `useMovement` now watches the shown reading rather than the
  data, and the travel, because the fill's `transition: width` has been
  there since T2.2 and only ever needed the number to change late. No
  new animation was written for this.
- The fill transitions rather than jumps because the ELEMENT persists
  across the change: only its width prop moves. That is the same reason
  the bar could never use a keyed remount to replay its glow (part 3).
- The hovers deliberately do not lag — they are the plain truth on
  demand, and nobody is hovering a bar during its ceremony. The bar's
  `aria-valuenow` DOES lag, because it describes what the bar is
  drawing; a progressbar reporting a length it is not showing would be
  the actual lie. One pre-existing T2.2 test asserted the post-check-in
  value immediately and now advances the hold first.
- Measured in the browser, not assumed: meters appear at `steps 0 /
  width 0%`, move to `steps 1 / width 1%` ~950ms later (the pane
  throttles timers in a hidden tab; the constant is 700ms), the glow
  starting in the same 3ms as the travel, settling a second after.

## T5.2e (part 3) build notes — the meter glow, the spark, the arrival's going (2026-08-14)

- `meterMovement(before, after)` in `game/meters.js` is the whole
  decision: three numbers in, `null` / `'step'` / `'rollover'` per bar
  out. Pure, so the rules above are tested without a screen.
  `meterReading()` beside it is what takes those three numbers from a
  history, and is the single place the lifetime-vs-bar choice lives —
  both `Meters` and `App` read a meter through it.
- Replaying a CSS animation is the fiddly bit twice over, and the two
  places solved it differently on purpose. The tap spark and the note
  are **keyed elements**: a fresh key is a fresh element, and a fresh
  element animates (the arrival note's own trick since 2026-08-13). The
  bar cannot use that — remounting it would kill the fill's width
  transition, which is the growth itself — so it keeps its element and
  forces the replay by taking the animation off, reading a layout number
  to make the browser act on that, and putting it back. Without that
  read the two changes collapse into no change and a second tap inside
  one glow goes unanswered.
- The thicken is `scaleY`, never a real height: a height change would
  push the header's contents around on every `+1`. `box-shadow: 0 0 0
  <colour>` is the invisible end of a glow — no blur, no spread, drawn
  exactly behind the bar — because animating from `none` jumps.
- The check-in unmounts the header, so the meters genuinely remount when
  it closes and their "previous reading" would be the post-mark one.
  `App` holds the reading from before the check-in's FIRST mark and
  hands it down as `heldFrom`; the meters take it as their starting
  point at mount. It is spent immediately afterwards — left set, it
  would replay the ceremony on every later trip to the Map, since
  leaving the habit list rebuilds the header.
- One defect introduced and fixed the same session: routing `+1` through
  a handler of our own turned the farewell row — drawn one last time
  with nothing wired up — from a no-op into a crash. It failed CI (all
  tests passing, one unhandled error, non-zero exit) and blocked two
  deploys before it was caught. The local run had said the same thing in
  the exit code, which had been skipped by grepping the output for the
  pass counts. **Read the exit status, not the summary lines.**
- The note's fade duration is handed down as `--arrival-linger` inline
  from `HabitRow`, so `ARRIVAL_LINGER_MS` stays the only copy. A `var()`
  with a fallback is invisible to tokens.test.js's "every name is
  defined" check, which is how `--header-height` already does it.

## T5.2e (part 2) build notes — the star-shimmer (2026-08-13)

- `src/ui/shimmer.jsx` holds the whole drawing: one four-pointed sparkle
  path, and a table of twelve points around a box's perimeter written as
  PERCENTAGES with a px size, a colour and its own offset. Percentages
  are what let one table dress every arrival at every size — the same
  trick the blob outlines use — so nothing is measured and no geometry
  runs at render time. The colours are `var(--charm-…)` / `var(--shimmer-
  star)` references handed to the element inline, so the palette stays
  canonical in tokens.css even though a star is drawn by JavaScript.
- The ring stands about 30px off the blob, which is why the shelf's
  clearance under the header went from `--space-3` to `--space-6`: §5's
  promise that the shelf never covers the header has to cover what an
  arrival throws, not just the arrival. Measured in the browser rather
  than guessed — the ring reaches ~15px past the blob's right edge and
  the shelf sits 24px off the window, so nothing is clipped there.
- The shelf hands each arrival its start delay from its position in the
  list (`index × SHIMMER_STAGGER_MS`), which is the cascade. A drop
  landing alone is always newest, so its delay is 0 and it sparkles at
  once; only a batch staggers.
- The note's glint is CSS: the words are painted by a wide gradient
  instead of by `color` (`background-clip: text`), and sliding that
  gradient across them once carries a bright band over the sentence.
  `-webkit-text-fill-color: transparent` rather than `color:
  transparent` is what hands the painting over, and it matters —
  `currentColor` in the gradient still has to resolve to the note's real
  colour. The whole rule sits inside `@supports`, because a browser that
  cannot clip a background to text would paint a gradient BOX over the
  tile; without support the note simply shows plainly, as it did before.
- Replaying it is `key`: a second drop from the same habit rewrites the
  one sentence, and React would otherwise swap the words inside an
  element whose animation had already finished. Keyed on the sentence,
  new words mean a new element, and a new element glints.
- The workbench shelf renders the REAL `<ArrivalShelf/>` with three
  made-up drops rather than a picture of one — same blobs, same fade,
  clicking one holds it. The only thing the workbench CSS does is undo
  the shelf's pinning, since two shelves fixed to the window's corner
  would sit on top of each other. Replay is a state bump used as a
  `key`, which is all "play it again" has to mean for an animation that
  plays on arrival.
- Verified in the browser pane before pushing, on the workbench and in
  the real app. Two notes for next time: a `.click()` from the console
  does not flush React's state before the next line, so the workbench
  test uses `fireEvent` and the browser checks read the DOM in a second
  call; and freezing an on-arrival animation for a screenshot is best
  done by injecting `animation-delay: -Nms !important; animation-play-
  state: paused !important`, which holds it at frame N for as long as
  the style is in the page — `pause()` on `getAnimations()` cannot catch
  an element that has not mounted yet.

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
**draft category names** ("a plip") until T6.1; two narration
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

- [x] **T6.11 The charm lens remembers itself** _(retired unbuilt
      2026-08-20 — absorbed into T6.23e; original text below.)_
      Written 2026-08-12: today the lens is plain screen state: choose two
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
      draft category names ("a plip") from constants until T6.1.
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
      why the desktop-only startup (§12f) simply _lives inside_ this gate
      rather than needing its own device check — being inside the app, it
      only ever runs on desktop. The gate reads `window.innerWidth`, keeps
      it in state, and re-checks on `resize`, so narrowing/widening a
      window (or turning a tablet sideways) swaps live. The threshold is
      a named `MIN_APP_WIDTH = 1024` next to its only use; the check is
      `width >= MIN_APP_WIDTH` so 1024 renders and 1023 blocks.
      Wired in `main.jsx`: `<ViewportGate><App /></ViewportGate>` under
      StrictMode. The message copy is a Kimia-written content slot
      (`content/blocked.js`, `blockedMessage()` mirrors narrationSlot) —
      while blank the block screen shows nothing rather than invented
      copy (design-notes §7); Kimia filled it the same day. CSS
      `.viewport-block` / `.viewport-block-message` matches the app's
      deep-space near-black, centred and quiet. `ViewportGate.test.jsx`
      asserts which side of the gate renders at 1024 / 1440 / 1023 / 768 /
      600, the live two-way swap on resize, and that the block screen
      reflects the slot (fixture copy shows, blank shows nothing) — set
      via a controlled fixture that is restored after, so the suite never
      depends on Kimia's real words; plus a unit test for `blockedMessage`.
      Structure only, never wording. NOTE: the first cut of that last test
      hard-coded the slot as blank and broke the deploy the moment Kimia
      filled it (same trap as the 2026-07-19 CI break) — fixed the same
      session to be content-independent. Full suite (552) and oxlint pass;
      verified in-browser at 1280 (app) and 600 (block, showing her copy),
      no console errors.

- [x] **T5.1c Habit-card drag-to-reorder** _(done 2026-07-23, spec §4.1,
      design-notes §12a)_
      The home-screen habit list stops reordering by ▲▼ arrows and starts
      reordering by dragging. Each row's button group now holds a small
      six-dot **grip handle** (`.drag-handle`) where the arrows were; you
      press it and drag the row up or down, and the new order persists to
      storage. Order still persists exactly as before — the underlying
      `moveHabit` game function is untouched.
      A dedicated handle, not a whole-draggable card (Kimia's call this
      session — see the decisions log): the row already holds tap controls
      (+1, −1, edit, archive), so a grip keeps those unambiguous and gives
      an obvious grab point.
      The drag follows the abode/bookcase pointer pattern: `HabitRow` is
      still a pure display component — its handle's `onPointerDown` calls
      up to `App.handleReorderStart(habit, event)`, which watches the
      pointer on the WINDOW (so the drag keeps tracking off the handle) and
      resolves on release. During the drag the lifted row follows the
      pointer (an inline `translateY` from `reorderDrag` state) with a soft
      raise (`.habit-row--dragging`), settling the instant it drops. A
      press that never travels past `REORDER_DRAG_THRESHOLD_PX` (4px,
      mirroring the other drags) stays a press and reorders nothing.
      The drop target is read from layout: `App` keeps a `listRef` on the
      `<ul>`; on each move it finds the last row (by `data-habit-id`) whose
      top edge the pointer has passed — **skipping the dragged row itself**
      — and on release `handleMoveTo(habit, toId)` maps that row's id to its
      full-list position, so archived habits interleaved in `data.habits`
      keep their places (the same rassatt trick the old ▲▼ used). No
      change persists until the drop.
      BUG FIX (same session, on Kimia's report): the first cut compared by
      loop index and did NOT skip the dragged row. Because the lifted row
      carries a `translateY` that follows the pointer, an _upward_ drag
      shifted the dragged row's own box up under the pointer; being lower in
      DOM order it then won the "last row the pointer passed" test, so the
      target snapped back to the row itself and the move became a no-op —
      down worked, up did nothing. Fix: skip the dragged row in the scan and
      track the target by habit id, not index. A new UP-drag test models the
      dragged row's shifted box (its mock rect follows the pointer) so the
      regression is caught in jsdom, where there is otherwise no layout.
      Filter-lock carried over: while a symbol filter is on, the list is a
      partial lens, so the handle is `disabled` and its hover switches from
      "drag to re-order" to "clear the symbol filter to re-order"; the
      pointer handler never runs then. Desktop-only per T5.1b, so a single
      primary-button pointer press is the only input — no touch path (the
      handle sets `touch-action: none` regardless).
      Tests: the filter test now asserts the handle is disabled and carries
      the clear-filter hover; a down-drag test and an up-drag test each
      drive a real pointer drag (mocked row rects, dispatched
      pointerdown/move/up) and check the row lands in its new slot AND
      survives a reload, plus a test that a sub-threshold press leaves the
      order untouched. Full suite (554) and oxlint pass; verified in a live
      browser — dragging a row up AND down reordered the list and persisted
      to localStorage both ways, handle renders in place of the arrows, no
      console errors.

- [x] **T5.2a The tokens file — colour** _(done 2026-08-10, design-notes
      §11d)_
      The first slice of the visual identity, and deliberately an
      invisible one: every colour the app wears got a name, and not one
      of them changed value. `src/index.css` had 122 hand-written colour
      literals (40 distinct) scattered through ~1,400 lines; it now has
      none. They live in **`src/tokens.css`** as named custom properties
      with plain-English comments — `--text-quiet`, `--veil-checkin`,
      `--pop-friend` — grouped into charms, surfaces, borders, text
      tiers, washes, the three reward streams, and the neon POP. Rules
      ask for them by name: `color: var(--text-quiet)`.
      The point is the NEXT slice. §11b's identity — the deeper #080910
      ground, dim-white text tiers, charm colours as the everyday accent
      — is now an edit to one short list rather than a hunt through the
      stylesheet, which is exactly the promise §11d made and the reason
      Kimia asked for the file.
      `index.css` reaches the tokens with a plain `@import './tokens.css'`
      on its first line (Vite inlines it at build), so there is one thing
      to know and no build config to explain.
      Naming was semantic, not literal: `--bg`, not `--dark-blue`. Where
      two near-identical values had genuinely different jobs they kept
      separate names (`--surface` #11151f for a panel, `--surface-lifted`
      #12151f for a dragged row) rather than being quietly merged —
      merging them would have been a design change smuggled into a
      rename, and this slice changes nothing on screen.
      _Tests:_ new `src/test/tokens.test.js` (3) guards the arrangement
      itself, since a comment saying "no raw hex here" has no teeth: it
      fails if a colour literal reappears in index.css, if a rule asks
      for a token tokens.css does not define, or if `symbols.js` — the
      declared mirror that needs the charm hexes as JS strings for its
      glow drop-shadows — drifts from the canonical values. It reads both
      files as text, like docs.test.js, and touches nothing in
      `src/content/`, so no edit of Kimia's can break the deploy through
      it. Full suite 986 and oxlint pass (the two pre-existing prettier
      warnings on sky.jsx/textures.jsx are untouched and unrelated).
      _Verified in a real browser_, since "nothing changed" is the whole
      claim and jsdom cannot check it: the tokens all resolve, and every
      computed colour matched its old value exactly — body #0b0e14 on
      #e8e6f0, the meter's #11151f/#2a3040, the four neon reveal
      colours, both veils, the drag lift and its shadow, the workbench
      card, the rail's rgba white. No console errors.
      _Also this session:_ the four JS colour tables got honest headers
      about which of them ever move into the tokens file (decisions log,
      2026-08-10) — `symbols.js` now says it is a mirror and is under
      test; `friendPalettes.js`, `textures.jsx` and sky.jsx's Abode
      palettes say they stay put; sky.jsx's night-sky ground says it
      moves in the §13c slice. Their old "TODO(T5.2)" notes are gone, so
      no future session inherits a promise that was reconsidered.

- [x] **T5.3c The ladder** _(done 2026-08-10, design-bible §9c)_
      All ten category archetypes now stand side by side on the design
      workbench, each in the three reward-stream pastels and assembled to
      the friend recipe — Kimia's traced body, canonical blinking eyes at
      her placeholders, body-colour glow, the body/eyes split. Nine
      arrived in the two workbench sessions of 2026-08-10 (stacked vs
      banded traces, per-friend seals, sizes read off the character
      sheet); friend 10 landed earlier the same day. The build detail is
      in those two decisions-log entries, which is where the reasoning
      lives.
      _Done when:_ the checkpoint the sub-plan set — all ten read as one
      family, complexity visibly climbing — and that is a human judgement,
      not a test. **Kimia passed it on the eyeball test (2026-08-10).**
      The rejected T5.3b pilot plip stays gone; its recipe and its
      drift-and-bob animation stand, and the cast's plip is one of the
      ten traced bodies.
      Two rules came out of the approval rather than the build, and both
      became tasks rather than being folded in here: the size canon must
      hold as a RATIO everywhere (T5.3d) and every species and individual
      name is Kimia's to write (T6.1a). See the decisions log.

- [x] **T6.1a Every name becomes Kimia's to write** _(done 2026-08-10,
      spec §5, design-notes §7)_
      A new file of hers, `src/content/names.js`, built to the
      narration.js pattern: **10 species slots and 55 individual slots**,
      every one blank, each with a plain-English note on where it shows.
      Beside them the three readers — `speciesName`, `individualName` and
      `friendDisplayName` — which trim what she writes and return null
      for a blank slot, so a screen renders nothing rather than an empty
      line.
      `FRIEND_CATEGORIES` in constants.js lost its `label` and `singular`
      and keeps only `key`; the drafted words are gone from the app
      entirely. Five screens changed to ask the new ladder: the Guest
      Book list, its popup card, the arrival reveal, the home-screen
      cameo, and the arrival shelf's sentence. `friendName()` left
      `src/game/friends.js` — what a friend is called was never game
      logic.
      Also added `FRIEND_ROSTER` (10, 9, 8 … 1) so the name file's slot
      count is measured against the spec's roster rather than a number
      typed twice.
      The reasoning behind the display ladder, the two accessible-name
      exceptions and the decision to keep the old words as internal keys
      is in the decisions log — as is the roster-cap defect found while
      building this (T6.1b).
      _Tests:_ 998 pass. Ten existing tests across five files had been
      asserting the drafted names; they now go through
      `src/test/nameFixture.js` — set a name, restore it after, assert
      the behaviour — so Kimia's real file can never decide whether the
      suite is green, and can never block her own deploy. New
      `src/content/names.test.js` (9) guards the file's shape: a species
      slot per category, an individual slot per roster place, 55 in all,
      and no display word creeping back into the game layer. Verified in
      a real browser too: the app boots and the Guest Book opens with no
      console errors.
- [x] **T5.2e (part 1) The §12f rolling planet + the startup ceremony.**
      _(done 2026-08-13)_
      The daily startup stops being a placeholder. T4.5 held the slot
      with a plain black fade; it is now the rolling planet, held for
      3.2s and faded out over 1.5s.

      **Built in front of Kimia, one visible change at a time** — the
      T5.2c lesson applied deliberately. The planet landed on the design
      workbench FIRST, not in the real slot, because the real one plays
      once per Habitat day and then hides for 24 hours. Four passes, each
      pushed to the live site for her eye: dimensions → rock texture and
      sphere-suggesting movement → texture again, twinkle back, sky
      drift → wired into the app. She approved the look before any of
      the ceremony was written.

      **The drawing** (`src/ui/planet.jsx`) is written up in
      design-notes §13d — the enormous sphere, the three depth bands,
      the greyscaled rock, the app's own sky. Everything is sized in
      `cqw` so the workbench box and a full screen show the same
      composition. `PLANET_TOKENS` at the top of the file is the dial
      board.

      **The ceremony** (`src/ui/Startup.jsx`, renamed from
      StartupFade.jsx) is two phases and nothing else: hold, then
      leaving. `startupCharm()` in `game/startup.js` is the Sunday rule
      — shell pink every ordinary day, a random pick from the other five
      on Sundays — drawn once on mount so it cannot change mid-ceremony.
      `--veil-startup` left tokens.css: the startup was a black veil
      only while it was a placeholder, and the planet paints its own sky
      beside its own drawing.

      **Four bugs found and fixed on the way**, all invisible until
      looked at properly:
      - two planets on the workbench rendered the SAME colour — the
        colours were baked into a `<style>` block both instances shared,
        so the second repainted the first. They travel as custom
        properties now.
      - the surface texture was invisible: an `<svg>` is a replaced
        element with an intrinsic ratio from its viewBox, so pinning top
        and bottom alone left it at twice its band's height and slid
        every feature below the visible strip.
      - the rock never blended at all, and lay on top as pale grey. The
        blend was on the two copies, but their parent's opacity and mask
        had already sealed them into their own group, so they were
        blending against nothing. It belongs on the band that holds them.
      - at full strength the rock bleached the planet, then tinted it
        blue-grey: the library lights rock in a pale COOL grey. It is
        greyscaled before it blends, so it can only carve light and shade.

      **Tests:** 1085 pass (was 1076). `game/startup.test.js` covers the
      Sunday rule including the out-of-range draw and the fact that an
      ordinary day ignores the draw entirely; `App.test.jsx` covers the
      two phases, tap-to-skip, that the fade is never skipped, and that
      the ceremony offers nothing to read. Every existing "settle the
      startup" advance became `settleStartup()`, which advances the hold
      and the fade SEPARATELY — one combined advance leaves the fade
      still to run, because its timer does not exist until React has
      committed the state change the hold's timer made. That caught a
      real trap rather than a cosmetic one.

      **Verified in a real browser** at 1280×860: the ceremony covers
      the viewport at z-index 20, wears shell pink on a Thursday, takes
      a tap while holding and stops taking them the instant it leaves,
      runs the fade for exactly STARTUP_FADE_MS, writes
      `startupShownOn` only at the end, and unmounts. The handover was
      screenshotted mid-fade: the app emerges through it with both star
      fields overlapping, which is why it reads as one continuous sky.
      (The hold was temporarily raised to 60s to catch it — browser
      round-trips are slower than a 3.2s ceremony — and put back.)
- [x] **T5.2 Visual identity** _(decided 2026-07-19, done 2026-08-16 —
      seven sessions across 2026-08-10…16; design-notes §11b, §11c, §11d,
      §12f, §13; per-slice build notes above)_
      The task as it stood in plan.md, kept whole here because five weeks
      of decisions are recorded in its wording:

      Decided 2026-07-19 (docs, design-notes §11b): background #080910,
      charm-colour accent palette with faint variants, dim-white text
      tiers. Plus glow effects and animations. (**The two-typeface plan
      left this task on 2026-08-12** — Kimia saw it built and rejected
      it; the build was reverted and the system font became Habitat's
      settled typography, design-notes §11c.) Includes the feel
      enhancements decided 2026-07-19 (design-notes §4–§5): momentary
      glow/thicken on meter advance and roll-over (layered on the built
      bar), star-shimmer on regular drop arrivals, full firework for
      first-occurrence reveals and friend arrivals. (The ~~live-vs-retro
      tonal palette shift~~ **left this task on 2026-08-13** — Kimia's
      call to drop §3 outright rather than build or defer it; nothing
      had been built.)
      Also includes the **daily startup animation** (decided 2026-07-20,
      design-notes §12f) in the slot T4.5 built for it: a black screen
      with a slither of glowing planet across the bottom edge, spinning
      slowly like a satellite image, for a few seconds — then the normal
      screen fades in. The planet glows the **shell charm's pink
      `#E8698C`**, except on **Sundays**, when it rotates randomly
      between the other five charm colours. No text, no numbers, no
      narration slot; a tap skips straight to the fade; identical every
      day regardless of streaks or milestones (design-notes §12f explains
      why this one moment may take the screen when §6 forbids it
      elsewhere). **Desktop/laptop only (2026-07-21):** gated behind a
      min-width check; mobile and tablet skip it and keep the plain fade
      — Habitat's only device-conditional moment.
      **M5 layout & atmosphere pass (Kimia's layout spec, merged
      2026-07-21 — design-notes §13):** a full-width top header (wordmark
      · meters · date · charm filter) via CSS `grid-template-areas`,
      above the unchanged 40rem content column; each secondary page's
      title promoted into a shared `.page-title` region above its box;
      and a full-bleed night-sky background (sparse, rarely-twinkling CSS
      stars) on every device.
      **Design-tokens file (Kimia's call 2026-07-21 — design-notes §11d,
      CLAUDE.md):** every colour, glow, font size and spacing number
      moves into one CSS file of named, commented values — the visual
      twin of `constants.js`; the six charm colours become canonical
      there and `src/ui/symbols.js` mirrors the hexes its JS needs.
      **Sliced 2026-08-10** — one task was always several sessions, so it
      said so. The tokens file went first, because every slice after it
      was an edit to one short list instead of a tour of the stylesheet.

      **The slices, as they finished:**
      - [x] **T5.2a The tokens file — colour** _(2026-08-10)_
      - [x] **T5.2b The §11b palette** _(2026-08-11 — the dim-white text
            tiers were dropped on Kimia's eyeball test, design-notes
            §11b)_
      - [~] ~~**T5.2c Typography**~~ _(dropped 2026-08-12 — built,
            rejected on sight, reverted the same day. Kimia's call: the
            system font Habitat already wore IS its typography, so there
            was nothing left to build. design-notes §11c now describes
            the lettering instead of proposing it.)_
      - [x] **T5.2d Layout & atmosphere (§13)** _(2026-08-12)_ — promoted
            page titles, the top header bar, the night sky as the app
            background, and the spacing scale (22 ad-hoc values → 8 steps
            on a 4px grid). Built one visible slice at a time with
            Kimia's eye between each (the T5.2c lesson), and three of the
            four came back with corrections.
      - [x] **T5.2e Glow, feel & the startup animation** _(2026-08-13…16,
            seven parts)_ — the §12f rolling planet and its ceremony;
            then the §4–§5 feel enhancements in the order agreed
            2026-08-13, smallest visible change first: where an arrival
            appears (§5) → the star-shimmer on drop arrivals → the §4
            meter glow → the firework, which Kimia moved off the reveals
            onto the home-screen cameo's two rarest wins → the glow scale
            into the tokens file, last, once there were real glows to
            name (15 radii → 6 steps).

      **What the whole task taught, in one line each:** build it in front
      of her (T5.2c was specced, built whole and rejected); a scale is
      worth waiting for (spacing and glow were both accidents worth
      naming properly, and naming them early would have named the
      leftovers); and the spec is not sacred — she cut §3 and moved the
      firework after reading her own words back.
