# spec.md — HABITAT

_This file is the current state of the product — read the sections
your task touches. The dated decisions log and the version-by-version
history live in **history.md** (the audit trail): consult it only when
you need to know how a rule came to be._

## 1. One-line pitch

**Habitat**: a personal habit tracker where completing habits carries us
through **ethical immigration to the alien planet N-Z-D** — getting to
know the land, gathering its flora, trading glowing fungi at the local
market for curiosities, learning the local language, and earning
friendships within the community. Habit by habit, we build a habitat.

**Framing note:** we are a newcomer, not a coloniser. We don't conquer,
claim, or extract. We arrive, we learn, we integrate. The planet and its
society were thriving before us; the privilege is being welcomed in.

## 2. Why this exists

Kimia has used habitica.com for 6 years and hit its "delight ceiling."
This project injects new energy into habit gamification, serves as a
learning project for AI-assisted development, and doubles as a public
portfolio piece.

**Design brief:** keep Habitica's bones (habits, streaks, progression),
replace its reward layer entirely. No pets, no pet food, no armour, no
battles.

## 3. Constraints & non-goals

- Single user (Kimia). No accounts, no auth, no multiplayer.
- Web app. Hosted free on GitHub Pages; code public on GitHub.
- Personal habit data stays private in the browser (localStorage) — never
  committed to the repo.
- **No punishment mechanics.** Missed habits cause no damage, decay, or
  loss. They simply appear in weekly data.
- Non-goals for v1: mobile app, sync across devices, social features,
  seasonal events (candidate for v2).
- **Device stance — desktop/laptop only (2026-07-23).** Habitat is
  designed for wide screens; **mobile and tablet are parked
  indefinitely**. Below **1024px** viewport width (phones, and tablets
  held sideways) the whole app is replaced by a single full-screen
  message — Kimia-written copy in a content slot — and at 1024px and
  wider the app runs unchanged. This is a **reversible gate**, not a
  teardown: every existing feature stays built, so a future responsive
  pass simply removes/softens the gate and adds small-screen layouts.
  The desktop-only startup animation (§5) is one moment *inside* this
  block, no longer a special case on its own.

## 4. Core mechanics

### 4.1 Habits (one unified type)

There is exactly **one** task type: the customisable habit. No
dailies/habits/to-dos distinction. Each habit has:

- Name, optional description
- A schedule the user defines. Shapes: **daily**, **specific weekdays**
  (e.g. Mon/Wed/Fri), **N-per-week** (fulfilled by N _distinct_ days
  with at least one completion — three marks on one day advance the
  week by one, not three), **N-per-day** (each completion counts; the
  day is fulfilled at N; extras are recorded and kept), **whenever**
  (unscheduled, no streak — no expectation, no pressure), and
  **one-time** (a to-do: one completion finishes it for good and
  auto-archives it; undoing that mark the same day un-archives it).
  One-time is a _schedule shape_ of the single unified habit type — it
  does not reintroduce Habitica's habit/daily/to-do split.
- **Every repeating shape presents as a counter (2026-07-19, plan
  T3.2b):** the UI control for daily, weekdays, N-per-week, N-per-day
  and whenever is the same running count with an unlimited +1 — never
  a one-tap toggle. Fulfilment and streaks judge exactly as before;
  taps beyond the goal are recorded and kept, and every tap counts
  toward the expedition meter and drops (see decisions log). One-time
  is an empty tick-box (hover: "mark done"); ticking it finishes and
  archives the to-do (2026-07-21). The count
  reads as bare **count/goal** — since T4.5 the trailing "today" is
  gone, the date display above the list having taken that job — and the
  reversing control beside the **+1** reads **-1**.
- **One of exactly 6 symbols** (each paired with its own colour).
  Since 2026-07-19 these are the six **charms** — crown (gold),
  cherries (coral), shell (pink), anchor (lavender), shield (sky),
  key (teal); line-drawn SVGs, full spec in design-notes §11a. The
  symbol **is** the tag — no word labels, no naming, no renaming,
  ever. Meaning lives entirely in the user's head, never explicit
  categories like "diet".
- Difficulty, set at creation: **easy / medium / difficult**. (Amended
  2026-07-15: difficulty does NOT affect the expedition meter — every
  completion advances it the same one step. The field is kept for
  future use, e.g. nudging drop odds in M3.)

### 4.2 Day boundaries & the morning check-in

- Every completion is logged with an accurate timestamp against the day
  it belongs to.
- If **yesterday** ended with scheduled habits unresolved, the next
  visit opens with a **check-in**: "mark the habits you completed
  yesterday." The check-in **always refers to the actual calendar
  yesterday**, no matter how long we've been away — and yesterday
  **must be answered**; only older days are optional. Only an
  unresolved yesterday triggers the check-in: older editable days never
  nag (optional means optional), they're simply reachable from it —
  or any time via "edit past days".
- **The backfill window (2026-07-14, replaces the earlier "no data"
  idea):** a past day can be filled in or corrected only while its week
  is still the current one. Every day of the current Mon–Sun week stays
  editable until the week ends; once a week has passed, its days are
  frozen. The one exception is **calendar yesterday, which is always
  editable** — so a Monday-morning check-in can still fill in Sunday,
  and last week's numbers simply update. Days never filled in just
  count as **not done**, which (as always) is neutral data, not a
  punishment. There is no separate "no data" state.
- **Critical correctness requirement:** retroactive marks are recorded
  against the day they were _done_, not the day they were _entered_. If
  Monday morning we mark Sunday's habits, the data says Sunday. Habitica
  gets this wrong; we will not. This rule gets its own automated tests.
- **Definition of a "lived day":** a day counts as lived once it has at
  least one habit marked against it — including marks added
  retroactively via check-in/backfill. Lived days are the clock for the
  market rotation (see Stream 3). (Renamed 2026-07-20; this was called
  a "cron" until then, after Habitica's term. The word is retired
  everywhere — it collided with the scheduling sense of cron and with
  the daily startup, which fires on day rollover, not on this.)
- **Day cutoff: 3am by default**, configurable in settings. A habit
  completed at 1am counts for the evening before.
- **A "visit" includes returning to an already-open tab** (2026-07-15):
  the page re-checks the clock once a minute and the moment the tab
  comes back into view, so a tab left open overnight flips to the new
  day — and owes its check-in — without a refresh, like Habitica.

## 5. Rewards: three independent streams

Reward pacing principle (learned from Habitica): **no front-loading, no
retention hooks.** Habitica showers new users with rewards then tapers —
fine for acquisition, fatal for long-term delight. Habitat has one
patient super-user who will show up every day. Rewards are steady, slow,
and never come too early. The earn curve is designed for years, not
weeks.

### The three meters (permanent fixtures)

All three meters sit **permanently at the top of the app** (amended
2026-07-16: on the habit list and the pages reached from it — the
morning check-in stays meter-free and focused). Each is clickable,
opening its own growing world:

- **Expedition meter** → opens the **Map**: the discovered planet,
  populating region by region over time. Grows infinitely (~5 years
  practical sizing).
- **Literacy meter** → opens the **Bookcase**: every magazine, novel,
  and dictionary we've ever received, filling shelves over time. Grows
  infinitely.
- **Fungus meter** → opens the **Market**. This one is a **wallet**: it
  rises with fungus drops and falls with purchases. The only meter that
  can go down — and only ever by our own choice to spend. (Since T4.5
  it is a bar like the others — clamped 0–40 fungi — with the exact
  balance behind its hover; decisions log 2026-07-21.)

### Stream 1 — Expedition: getting to know the planet

- **Expedition meter:** fully **predictable**. Each completion advances
  it a fixed amount — the same for every habit regardless of difficulty
  (decision 2026-07-15). No randomness in the meter itself.
- Meter progress = **planet discovery**: new regions of the planet
  gradually revealed on the Map as we get to know our new home.
- Along the way we **come across flora** as drops — the plant life of
  N-Z-D, discovered as we get to know the land. Collecting is
  **optional**: flora can be gathered and grown, or left where they
  are. Any gathered flora can be **composted** back to the world at any
  time (a Habitica lesson: non-returnable rewards forced clutter).
  Composted flora re-enter the world and may be encountered again —
  nothing is ever truly lost, so there's no pressure to hoard.
  **Composting yields nothing** (no fungi) — flora are discoveries, not
  money.
- Gathered flora live in the **Abode**, arrangeable like everything
  else there.
- **Landmark flora (2026-07-19, for T4.1/T6.1):** some flora are
  large and tree-like — too big to carry home. These special finds
  are **revealed on the Map** the moment they drop, placed in the
  region the expedition was passing through at that step, and the
  marker is **permanent** — the Map records that we came to know this
  tree, like discovery itself. (The one exception, consistent with
  all drops: undoing the very completion that dropped it takes the
  reveal back.) Landmark flora are still gatherable like any flora —
  but gathering one means collecting a **branch, fruit or leaf** from
  it, never the tree itself: the cutting goes to the Abode and is
  compostable as usual, while the tree stays where it grows, on the
  Map, regardless. This is a rule for the special ones only — small
  flora don't appear on the Map. Which flora count as landmarks is
  decided with the content pools (T6.1).

### Stream 2 — Literacy & society: earning our place

- **Reading material drops** are **less predictable and rarer** than
  object finds — the surprise-reward stream:
  - **Magazines** (common-ish)
  - **Novels** (medium)
  - **Dictionaries** (rare)
- Reading material is **never discarded** — every piece goes straight to
  the Bookcase and fills the **literacy meter**, our growing command of
  the local language.
- Each publication can be **read** (2026-07-19, plan T3.5): a popup
  opens a double-page spread of it — an image Kimia provides, one per
  publication (T6.1), never AI-generated. A held arrival offers **read
  now / read later**; either way the piece is in the Bookcase, and any
  publication is re-readable from there anytime. No read/unread
  tracking exists anywhere.
- Literacy milestones unlock **friendships**, which also arrive **as
  drops** — the top of the reward hierarchy. A milestone **opens the
  door**: it makes that friend category possible, and the friend then
  arrives as a surprise drop sometime in the following days —
  anticipation first, surprise second.
- N-Z-D has **10 categories of friend** on a sliding scale of required
  literacy — the way Earth has animals, child humans, and adult humans,
  N-Z-D has a whole ecology of beings reachable at different depths of
  language. Draft ladder (names and details to be iterated; lowest
  literacy first):
  1. **Drifters** — ambient beings; no language, just presence
  2. **Nesters** — small critters that respond to routine and warmth
  3. **Mimics** — creatures that echo our sounds and gestures back
  4. **Signers** — beings who converse in light and gesture patterns
  5. **Sprouts** — young locals; first spoken words
  6. **Chatters** — everyday conversation, small talk, jokes
  7. **Neighbours** — real relationships; we get invited in
  8. **Storytellers** — share N-Z-D's folklore and history
  9. **Scholars** — the local professors; deep, technical language
  10. **Poets** — language at its most subtle; the rarest friendship
- Friendships live in the **Guest Book** — a page like the Abode, a
  record of everyone who has welcomed us. (We are the guest here, not
  the owner.) Titled **local community**. Clicking a character opens a
  **popup card** (2026-07-20): their art, their name, their **card
  text**, and their signature category animation playing. The card text
  is a _second_ narration slot per friend, separate from the momentary
  arrival narration and re-readable any time — who they are, not the
  night you met them. Blank until Kimia writes it, and an empty slot
  renders nothing (the T3.4 rule).
- The emotional endgame: consistency → literacy → community.

### Stream 3 — Fungi & the Market: taking part in the local economy

- **Glowing local fungi** drop occasionally on habit completions — same
  drop mechanic as flora and reading material; difficulty nudges the
  odds. Fungi operate as **currency on N-Z-D**.
- Fungi fill the **fungus meter** — a wallet balance, spent at the
  **Market**.
- The Market sells the **objects and curiosities**: weird trinkets and
  lights, musical instruments, cushions, things with no obvious
  purpose. Gravity is not guaranteed on this planet. Objects are
  **purchased, never dropped**.
- **The rotating stall:** the Market shows a small selection at a time,
  rotating every **4 weeks of lived days** — 28 _lived days_, not
  calendar days. Days with no habits marked don't advance the rotation
  clock.
- **The stall's pool grows with the Map:** newly discovered regions add
  their goods to the rotation pool, so the Market gets _more_
  surprising over the years, never less. (Deliberate soft link:
  expedition shapes what's _on offer_; it never earns fungi.)
- **Nothing is ever missable:** every object eventually cycles back
  into rotation. No limited-forever items, no FOMO.
- **Symmetric prices, always:** buying an object costs its price;
  returning it to the world refunds exactly that price. No penalty, no
  spread, ever. Purchased objects live in the Abode alongside flora.

### How rewards arrive

- Flora, reading-material, and fungus drops **arrive the same way**
  (one drop mechanic); they differ in what happens next — flora are
  optional to gather and compostable, reading material is always kept,
  fungi go straight to the wallet.
- **Each reward type introduces itself differently the first time it
  occurs** — first flora, first magazine, first fungus, first friend,
  etc. each get their own distinct reveal moment.

The three streams stay independent in their **earning**: completions
feed each separately, and no stream's rewards can be converted into
another's (composting flora yields no fungi; fungi can't buy literacy
or map progress). The one deliberate link is on the _spending_ side:
region discovery expands what the Market can offer.

## 5b. App structure (pages)

- The **HABITAT header** on every page is the home link back to the
  habit list (2026-07-16) — except during the morning check-in, whose
  done button stays the only exit. Since the M5 layout pass (T5.2,
  2026-07-21) the home screen carries a **full-width header region**
  (wordmark · meters · date · charm filter) above the 40rem content
  column, and every secondary page renders its title in a shared
  **page-header region above its box** rather than inside it — layout
  in design-notes §13.
- **Home screen:** the habit list, with the three meters and the **date
  display** (below) fixed in the full-width header (design-notes §13a).
  The list is manually re-orderable by dragging a habit's grip handle
  (order persists; disabled while a symbol filter is on — design-notes
  §12a) and filterable by symbols (multi-select; a temporary lens that
  resets each visit). Habits can be archived (history kept) or permanently
  deleted (with confirmation). Every action on the home screen is an
  **icon with a hover label** (T4.5) — no action words on the page. On
  a big-win day a **cameo** visits between the date and the list
  (T4.6): a friend celebrating — a big day (8 completions), a record
  streak (own record beaten, 5 days / 2 weeks minimum), a lived-day
  milestone (every 50, the crossing day only). It performs its
  animation once beside Kimia's message slot, then settles back to the
  calm list — once per visit, nothing stored (design-notes §8).
- **The left rail (T4.5):** five icon buttons down the left edge in
  descending order **map · abode · community · library · market**, each
  revealing its name on hover. These are the five world pages. The
  three meters stay clickable as well — meter and rail are two ways to
  the same page. Since 2026-07-21 the rail **persists on every screen
  but the check-in** (Kimia's call) — the check-in's done button stays
  the only exit there.
- **Map** (via expedition meter or the rail): the discovered planet so
  far. Titled **map of N-Z-D**.
- **Bookcase** (via literacy meter or the rail's _library_): one
  **constant bookshelf** (T4.2) holding every publication ever received
  — floating, draggable books, each spine or face-out, the arrangement
  remembered; any publication's eye opens its double-page spread for
  (re-)reading (T3.5). Bare shelves when empty — no prose, no count, no
  dates. Titled **readers library**.
- **Market** (via fungus meter or the rail): the rotating stall; buy and
  return objects. Titled **local market**.
- **Abode** (via the rail): open ground under sky (T4.3) — gathered
  flora and (since T4.3b) purchased objects freely draggable anywhere
  on the scene, each place remembered; a click holds an item, showing
  its name and its quiet way back to the world — compost for a flora,
  sell for an object. Flora waiting to be decided
  (gather / leave it) sit in a plain list above the ground. Bare ground
  when empty — no prose, no dates. Titled **your abode**. Carries the
  **quiet / party mode toggle** (below).
- **Guest Book** (via the rail's _community_): friends made so far.
  Titled **local community**.
- **Field notes:** the weekly view (T2.3) — browsable Mon–Sun weeks,
  opening on the last completed one; reached from the graph icon at the
  foot of the habit list, and opens by itself on the first visit of each
  Sunday (after any check-in _and_ after the startup animation). Has a
  "back to habits" link.
- **Settings:** day cutoff, data export/import.
- **Design assets (TEMPORARY, T5 prep — 2026-07-21):** a workbench page
  holding one empty shelf per image-asset family the M5 design pass
  will fill (charms, friends, map regions, flora, fungi, market
  objects, reading spreads). Reached from a door at the foot of the
  home screen; it leaves or becomes deliberate when the design pass
  lands.

### The date display (T4.5)

In the home-screen header (design-notes §13a), between the meters and
the charm filter, the home screen shows today's date **large and
letterspaced**: `M O N D A Y   2 0   J U L   2 0 2 6`. (On a narrow
viewport the header folds to two rows and the date regroups with the
wordmark — §13a.)

It shows the **real calendar date**, not the Habitat day. Between
midnight and 2:59am the two disagree — the habit list beneath is still
yesterday's — so during that window only, a quiet line sits under the
date: _"your habits will switch to a new day at 3 a.m."_ (The wording
moves with the configured cutoff.) Outside that window there is no
note. The date is display only; nothing is clickable.

### The check-in as a pop-up (T4.5)

The done-yesterday check-in becomes a **pop-up layered over the habit
list** rather than a page that replaces it. The habit list stays
visible behind it, so it reads as a temporary view you are passing
through. Its rules are untouched (§4.2): yesterday must still be
answered, its done button is still the only exit, and the meters still
do not show above it.

### Quiet mode / party mode (built live in T4.4)

The Abode carries a **toggle switch with an icon on either side** —
quiet mode and party mode.

- **Quiet mode** is the Abode as built: flora and objects on the open
  ground, draggable, arrangement remembered.
- **Party mode** adds the friends we have made, popping up **among**
  the flora in a **randomised formation**. The arrangement of flora and
  objects is untouched and stays draggable — party mode only ever adds.
  Friends themselves are **not** draggable and their positions are not
  remembered: a **refresh** re-rolls the formation. Nothing about a
  party is stored.
- Party mode is **greyed out and inactive until at least one friend has
  been found**. (Decided as "ship visible-but-dead in T4.5, alive in
  T4.4" — but T4.4 landed first, so the toggle shipped whole in T4.4:
  greyed with zero friends, alive with the first.)

### The daily startup (T4.5 plumbing, T5.2 animation)

On the **first visit of each Habitat day** (after the 3am cutoff), a
short animated startup graphic plays: a black screen with a slither of
slowly spinning, glowing planet across the bottom edge. It lasts only a
few seconds, then the normal screen **fades in**.

The order of the daily sequence is fixed:

1. the **done-yesterday** check-in pop-up (if one is owed),
2. the **startup animation**,
3. the **field notes** (Sundays only).

It plays every Habitat day, whether or not a check-in was owed. It runs
on **desktop/laptop only**: on mobile and tablet it is skipped entirely
and the screen plain-fades in instead. (Since 2026-07-23 the whole app
is desktop/laptop only — see §3 device stance — so this animation
simply lives on the desktop side of that block; the plain fade is the
resting behaviour just below the 1024px line.) Full visual treatment in
design-notes §12f.

## 6. Data & reflection

- Every completion/skip logged locally, timestamped, attributed to the
  correct day (see 4.2).
- A **weekly view** summarises the week: completions and streaks —
  presented as field notes, not a guilt dashboard. Kept simple in v1.
  ("Patterns" were dropped from the brief — Kimia, 2026-07-16; the
  grid speaks for itself.) Per-habit line graphs live at the foot of
  the field notes (built in T2.4).

## 7. Look & feel

- **Dark mode only.** Deep-space blacks and near-blacks as the base.
- Text and elements in a **mix of white, pastels, and basic colours** —
  with **bright, bold neons reserved as the POP** (drops, reveals,
  milestones, key accents). Neon is the exclamation mark, not the body
  text.
- Atmospheric and moody — contemplative, not cute. The planet feels
  bioluminescent. Behind all content sits a full-bleed **night-sky
  background** on every device — sparse CSS stars that twinkle rarely
  and unsynchronised, atmosphere that never competes with the POP
  (T5.2, design-notes §13c).
- All visuals **SVG / code-drawn**: crisp, glowing, animatable, fully
  vibe-codeable, ideal for neon-on-dark.
- **Visual identity (2026-07-19, design-notes §11):** background
  `#080910`; the six charm colours as the accent palette with
  0.18-alpha faint variants for borders; dim-white text tiers.
  Typography: **Cormorant Garamond** (display, UPPERCASE, wide
  letterspacing) + **DM Sans** (body, lowercase), both bundled with
  the app — no external font loading. Lowercase stays Habitat's
  default voice; uppercase is reserved for display and section
  labels. Every colour, glow strength, font size and spacing number
  lives in one **CSS design-tokens file** of named, commented values —
  the visual twin of `constants.js` (T5.2, design-notes §11d).

## 8. Architecture (v1)

- Static single-page web app: HTML/CSS/JavaScript (framework decided in
  plan phase — likely React or plain JS, whichever keeps us simplest).
- No backend. All state in `localStorage`, with a manual "export/import
  data" button as backup insurance.
- Deployed via GitHub Pages from the public repo.

## 9. Testing strategy

- Automated tests for all game logic — habit scheduling, meter maths,
  drop rates, literacy milestones, wallet arithmetic (buy/return
  symmetry), lived-day counting and market rotation, data export, and
  **especially check-in date attribution and backfill** (4.2). These
  run on every change and act as the non-coder's safety net.
- Manual playtesting checklist for UI after each feature.
- UI tests assert structure and behaviour (roles, aria labels, counts,
  state) — never incidental wording, and never Kimia's content words.
  Exact-word assertions are reserved for words a spec decision pins
  (2026-07-21; keeps copy passes from breaking the suite).
- CI on GitHub runs tests on every push.

## 10. Decisions log

Moved to **history.md** (2026-07-21, docs housekeeping). Every dated
decision entry lives there now. When a new decision is made: add one
dated entry to history.md's log AND fold the current rule into the
section of this file it changes — this file must always describe the
present, on its own.
