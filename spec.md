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

- **Who uses it (revised 2026-08-17).** Built for Kimia, and friends
  and family use it too — each in their own browser, which is why
  accounts were never needed: a fresh browser is a fresh world, and the
  browser itself is what keeps one person's record apart from another's.
  Still **no login, no passwords, no multiplayer.** The optional
  two-device sync (§8) is named by a **pairing code, not an identity** —
  it never learns who anyone is.
- Web app. Hosted free on GitHub Pages; code public on GitHub.
- Personal habit data stays private in the browser (localStorage) — never
  committed to the repo.
- **No punishment mechanics.** Missed habits cause no damage, decay, or
  loss. They simply appear in weekly data.
- Non-goals for v1: social features, seasonal events (candidate for v2).
  **A phone companion and cross-device sync left this list on
  2026-08-17** (Kimia's call): friends and family who use Habitat asked
  to mark habits away from a laptop, and habits are a
  several-times-a-day affair, so the laptop-only rule was costing real
  marks. Both are planned, neither is built — **M7 is sync, M8 is the
  phone**, in that order and for a reason (see plan.md). The phone is
  deliberately a LIMITED companion, not a second full Habitat: scope in
  §5b, feel in design-notes §14.
- **Device stance — wide screens, by width (2026-07-23; threshold
  lowered 2026-08-12).** Habitat is designed for wide screens and
  **small-screen layouts are parked indefinitely**. Below **740px**
  viewport width the whole app is replaced by a single full-screen
  message — Kimia-written copy in a content slot — and at 740px and
  wider the app runs unchanged. The gate is a **width rule, not a device
  rule** (Kimia's call 2026-08-12): it began at 1024px, which also kept
  phones and tablets out, but that was cutting a desktop window off long
  before the layout gave way. At 740px a portrait tablet renders the
  real app; that trade was made knowingly. The floor is where the layout
  actually breaks — the wordmark and the widest possible date need 656px
  side by side, and the left icon rail begins overlapping the habit
  tiles at about 704px, so 740 is the first width at which both still
  hold. This is a **reversible gate**, not a teardown: every existing
  feature stays built, so a future responsive pass simply
  removes/softens the gate and adds small-screen layouts. The
  desktop-only startup animation (§5) is one moment _inside_ this block,
  no longer a special case on its own.
  **What the gate becomes (2026-08-17).** M8 replaces the blocked
  message below 740px with the phone companion (§5b), so the gate stops
  being a wall and becomes a **fork**: below 740px the phone shell, at
  740px and above the app unchanged. Note what that means for tablets —
  a portrait tablet is already on the wide side of the line, so it gets
  the full Habitat, not the phone. Until M8 lands the gate is also the
  **feature flag** that hides the work: nothing below 740px renders
  today, so a half-built phone shell can ship to the live site session
  after session without any user seeing it, and softening the gate is
  the deliberate last task.
- **Safety net (2026-07-27).** If any screen ever fails to draw, one
  calm full-screen message replaces it — Kimia-written copy in a
  content slot — instead of the blank black page React otherwise
  leaves behind. It says something went wrong, asks that the maker be
  told, and points at a refresh; there is no in-app way back, by
  design. Nothing is lost when it shows: habits live in storage, which
  a drawing failure never touches. It is a net, not a cure — every
  crash it catches is still a bug to fix.

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
- **Owed vs asked for (Kimia's call 2026-08-14).** The two ways into the
  check-in leave by different doors. The one you are **owed** — the
  morning's, or a day rolling over while the page is open — keeps every
  rule above: yesterday must be answered, and **done is the only exit**.
  One you **asked for**, from the rail's "edit past days", is a visit,
  and a visit can be left: a press outside the panel closes it. Marks
  are saved as they are made either way, so nothing is lost by leaving;
  what a click-away does not do is record yesterday as answered.
- **Done lands you at the top (Kimia's call 2026-08-14).** Pressing done
  returns you to the top of the habit list however far down the page you
  were when the check-in opened, because the meters sit in the header
  bar and the movement they held through the check-in (design-notes §4)
  plays the moment it closes — the answer's whole payoff is up there.
  Clicking away from a check-in you asked for does **not** jump: nothing
  was held, so the page stays where it stood.
- **The backfill window (2026-07-14, replaces the earlier "no data"
  idea):** a past day can be filled in or corrected only while its week
  is still the current one. Every day of the current week stays
  editable until the week ends; once a week has passed, its days are
  frozen. **The week's shape is a setting (2026-08-16, T6.15)** — Mon–Sun,
  Sun–Sat or Sat–Fri, the user's choice and independent of language —
  so which days are frozen moves with it. Changing the shape re-groups
  the same marks and rewrites none of them: the unit of analysis moves,
  the record does not. A Sunday spike lands in a different bar because
  the bars are drawn differently, not because anything was edited. The one exception is **calendar yesterday, which is always
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
  populating region by region over time — **16 regions at full
  discovery** (design-bible §11c), sized for ~5 years. The meter
  itself grows infinitely.
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
  flora don't appear on the Map. There are **16 landmarks — one
  per Map region, enforced (2026-07-24)**: the drop seeding guarantees
  each region receives exactly its own landmark tree, placed as the
  expedition passes through it. The 16 are **four super-sized versions of
  each of N-Z-D's four flora species** (2026-08-19, design-bible §9a) —
  "landmark" is a size and a role, not a separate species. What tells the
  four versions of one species apart is decided with the content pools
  (T6.1).

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
  language. The ladder below is a WORKING DESCRIPTION, not the names:
  the ten species names are Kimia's to write (T6.1a, 2026-08-10), and
  they live in `src/content/names.js` alongside a slot for each of the
  55 individuals. What "plips", "baluhms" … name here is the RUNG —
  each species' place on the literacy ladder and what it is like — and
  those same words survive in code as permanent internal ids that are
  never shown on screen. A species with a blank name slot simply shows
  no name in the app; nothing invents one. Lowest literacy first:
  1. **plips** — ambient beings; no language, just presence
  2. **baluhms** — small critters that respond to routine and warmth
  3. **krupengks** — creatures that echo our sounds and gestures back
  4. **zalas** — beings who converse in light and gesture patterns
  5. **liwi bi-jijis** — young locals; first spoken words
  6. **meuhys** — everyday conversation, small talk, jokes
  7. **rassatts** — real relationships; we get invited in
  8. **woigolps** — share N-Z-D's folklore and history
  9. **chitus** — the local professors; deep, technical language
  10. **hamdi bulos** — language at its most subtle; the rarest friendship
- Each category has a **fixed roster of individuals** — 10 plips
  down to a single hamdi bulo, **55 in all** (design-bible §9c). A category
  refills — the next friend arriving a seeded 20–50 days after the
  previous — **only until its roster is exhausted**; 55 friendships is
  the lifetime maximum (2026-07-24, amending the 2026-07-20
  repeat-friends rule). The roster now exists in code as
  `FRIEND_ROSTER`, and `src/content/names.js` carries exactly one name
  slot per individual — but **the cap itself is not yet enforced**
  (found 2026-08-10): `nextFriendDue` keeps sending a category's next
  individual for ever. See the decisions log; it is a defect against
  this rule, not a change to it.
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
  done button stays the only exit. Since the M5 layout pass (T5.2d,
  built 2026-08-12) every page carries the same **full-width header
  region** above the 40rem content column: wordmark left, date right,
  and the meters filling everything between them — identical everywhere
  so nothing shifts as you move between pages (Kimia's call
  2026-08-12). The **charm filter is
  not part of it** — it is the habit list's own lens, and sits centred
  beneath the header on the pages that have something to filter (the
  home screen and the field notes). Every secondary page renders its
  title in a shared **page-header region above its box** rather than
  inside it — layout in design-notes §13.
- **Home screen:** the habit list, with the three meters and the **date
  display** (below) fixed in the full-width header (design-notes §13a).
  The list is manually re-orderable by dragging a habit's tile anywhere
  but its buttons (order persists; disabled while a symbol filter is on
  — design-notes §12a) and filterable by symbols (multi-select; a temporary lens that
  resets each visit). **While the lens shows exactly one charm, a new
  habit's draft opens already wearing it** (2026-08-11) — filtering to
  one charm and then adding a habit almost always means "another one of
  these"; two or more filtered is no longer a hint, so the draft falls
  back to the first charm. **The lens narrows the whole screen, not just
  the live list (2026-08-11):** the archived drawer holds only the
  archived habits wearing the chosen charms (and counts only those), and
  the lens travels to the field notes, where the same row of charms sits
  at the top of the page and narrows the week grid, the completed tasks
  and the graphs alike. It stays a temporary lens — one filter, held on
  the home screen, cleared by a reload wherever you are.
  (**The lenses**, below, rewrite this paragraph when T6.23 lands —
  planned 2026-08-20, not built.)
  Habits can be archived (history kept) or permanently
  deleted (with confirmation). Every action on the home screen is an
  **icon with a hover label** (T4.5) — no action words on the page. On
  a big-win day a **cameo** visits (T4.6): a friend celebrating — a big
  day (8 completions), a record streak, a lived-day milestone (every 50,
  the crossing day only). It performs its animation once beside Kimia's
  message slot, then settles back to the calm list — once per visit,
  nothing stored (design-notes §8). The message's numbers come from the
  win, never from a fixed sentence, and a record streak visits on the
  day the record falls and then every 5 fulfilled days (every week for
  an N-per-week habit) — not daily, which is what "beats its own
  record" means on its own. **Pressing a streak cameo** opens the field
  notes on that week with every record that fell today spotlit in a
  blackout, click to escape: the way to ask what a momentary notice
  meant (all three, Kimia's calls 2026-08-20).
- **The left rail (T4.5):** icon buttons down the left edge, each
  revealing its name on hover, in two groups (2026-08-12):
  - **the three doers**, on top — **+ (add a habit) · pencil (edit past
    days) · graph (field notes)**. They sat in a row at the foot of the
    habit list until 2026-08-12 and moved here whole: same order, same
    hover labels, same conditions (the pencil appears only when a past
    day is editable). Because the rail is on every screen, the + carries
    us home before opening the draft — the form is only ever drawn in
    the habit list.
  - **the five places**, below — **map · abode · community · library ·
    market**, the five world pages. The three meters stay clickable as
    well — meter and rail are two ways to the same page.

  Since 2026-07-21 the rail **persists on every screen but the
  check-in** (Kimia's call) — the check-in's done button stays the only
  exit there.
- **An empty habit list invites (2026-08-12):** where the list would be
  blank it holds a tile of the same shape reading **"add a habit or
  task…"**, which opens the draft form — the same door as the rail's +.
  Neutral with no lens on. **In filter view, one tile per chosen charm**,
  each wearing that charm's colour; clicking one opens the draft already
  on that charm. (The 2026-08-11 rule still applies underneath: with no
  tile clicked, a lens showing exactly one charm is the hint, and two or
  more falls back to the form's own default.)
- **The foot of the home screen (2026-08-12):** three clean buttons on
  one centred line — **export backup · import backup · start a new
  game** — with no text beside any of them. The explanations they used to
  carry are hover labels (the backup's age on export; "export a backup
  first" on the dimmed new-game button).
- **Dates read "mon DD-MM-YY" (2026-08-12):** lowercase weekday, then
  the day-first short date. One convention everywhere a dated day is
  named — the field notes' week range and the check-in's day summaries
  alike. (The home screen's own large date display is the exception it
  always was: it spells the calendar date out in full.)
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
- **Field notes:** the weekly view (T2.3) — browsable weeks in the
  chosen week shape (§4.2),
  opening on the last completed one; reached from the graph icon at the
  foot of the habit list, and opens by itself on the first visit of each
  Sunday (after any check-in _and_ after the startup animation). Has a
  "back to habits" link. It carries the **charm lens** (above): the same
  row of charms, in the same place and at the same size as the home
  screen's, sits **above the page's outline** — a lens over the notes,
  not part of them — narrowing the grid and the graphs, and adjustable
  without going back. Below it the page is **two outlined sections**
  (2026-08-11): the week being browsed, then the graphs, with the back
  button below both — and, under it, the **same three footer buttons the
  home screen ends with** (export · import · start a new game,
  2026-08-12), so backing up is possible from either page. The home
  screen's own door here is its twin: a wide **"view historical data →"**
  in the same shape, just above those three buttons. The week is headed
  by its dates alone in
  **DD-MM-YY** — `03-08-26 – 09-08-26`, no "week of" — with a small,
  quiet "still unfolding" on its own line underneath when the week on
  show is the current one, so the earlier / later buttons keep the two
  ends of the row.
- **Settings:** day cutoff, data export/import, and **start a new game**
  (§8) — the one door that wipes the world.
- **Design assets (TEMPORARY, T5 prep — 2026-07-21):** a workbench page
  where a new image asset is shown for Kimia to judge before it dresses
  a real screen. Reached from a door at the foot of the home screen; it
  leaves or becomes deliberate when the design pass lands.
  **It is a waiting room, not a gallery (Kimia, 2026-08-17):** a shelf
  stands only while a question about that asset is still open, and comes
  down once she has answered it — every settled asset left on the page is
  another screenful between her and the one she came to look at. As of
  2026-08-19 what waits there is the seven FILTER surfaces of the texture
  library and the abode sky — the hair textures left with the flora they
  were being judged for, once the ordinary flora design closed.

### The lenses (M6 · T6.23 — planned 2026-08-20, not built)

Kimia's call 2026-08-20, after a long list made the two existing ways of
looking at it — all of it, or one charm combination that forgets itself —
both unusable. **A lens is a way of LOOKING at the habit list.** The
charm filter is the first one; five more join it, and one of them
remembers. They belong to the home screen alone: the field notes and the
check-in keep the charm lens they already carry and gain nothing else,
because these are about arranging a list you are working through, not
reading a record. Their look and their family rules are design-notes
§11f; they are deliberately not pebbles (§11e).

**The arrangement on screen** is three things at once: an **order**, a
set of **muted** tiles (dimmed, still fully tappable), and a set of
**hidden** ones. It starts each visit as the saved default view and is
otherwise temporary — a refresh or the 3am day turn brings the default
back, exactly as the charm lens has always reset.

**The eye (muting).** A third icon beside edit and archive on every
tile. Closed eye = muted: the tile dims and drifts softly to the bottom
of the list. Open eye = visible. **Muting sinks; un-muting moves
nothing** — the drift is a one-time movement, not a rule that muted
tiles live at the bottom, so a muted tile can be dragged back up
afterwards and stays where it is put, still dim. Muted is "out of my
eyeline", never "disabled": +1 still counts.

**The three verbs — today · prioritise · tasks.** None of them holds a
view. Each reaches into whatever is on screen, changes it, and lets go,
so they stack in any order and never start over:

- **today** keeps what applies today (daily, N-per-day, a weekday habit
  whose day this is — including one already completed); mutes to the
  bottom what could apply today (N-per-week, whenever, one-time tasks —
  an N-per-week already at its number is muted like any other, never
  hidden); and hides everything else.
- **prioritise** re-orders into three tiers, **stably**: applies today ·
  applies this week (N-per-week) · everything else — whenever, a weekday
  habit whose day this is not, and one-time tasks, which have no
  deadline by design (§4.1). Two habits of the same tier keep the order
  they were in: a daily and a daily are the same priority, so a manual
  arrangement of them survives.
- **tasks** cycles the one-time to-dos through four presses: to the top ·
  to the bottom and muted · hidden · off. "Off" un-hides and un-dims
  where they stand; it restores no earlier position. Inside design mode the cycle is
  **three** presses — top · bottom and muted · off — because nothing
  hides in there (below), and a hidden step that merely muted again
  would be a press that appeared to do nothing.

**un-hide all** un-hides everything and clears the charms, and leaves
mutings alone. It is the way back to a re-orderable list, and it shows
only when it has work to do.

**Nothing re-orders while anything is hidden** — the general form of the
existing no-dragging-under-a-charm-filter rule (design-notes §12a),
binding inside design mode too. A tile dropped into a list with gaps in
it would make Habitat guess where it belongs in the full order, and the
deliberate order must be exactly knowable at all times. Muted tiles never
block dragging: they are visible.

**default, and the padlock.** The **default view** is a saved
arrangement — **order + charms + mutings**, and only those three.
Pressing **default** restores it at any time; a refresh and the new day
restore it by themselves. A new player has one from the start, decided
for them: the order habits were created in, no charms, nothing muted.

**Dragging is always temporary.** Only design mode ever writes an order
down, from the first day — a permanent re-order is a ceremony, and every
other re-order is throwaway and free of consequence. (A newly created
habit still joins the default order at its end, as it always has; adding
a habit is not a ceremony.)

**Design mode** is entered through the padlock (hover: "lock default
view" / "unlock default view"). Unlocking asks first — Kimia's sentence,
in `src/content/ui.js` — answered by **design new default** or
**cancel**. While it lasts:

- the window's edges glow in colour and the padlock pulses;
- only the header, the lenses, the charms and the baguettes remain — the
  left rail, the archived drawer, the footer buttons, the arrival shelf
  and any cameo are gone;
- **every tile is inert**: +1, -1, the tick, edit and archive dim,
  leaving the eye and the drag. A stray tap while arranging must never
  write a completion into the record;
- **nothing hides — it mutes.** A default view cannot hold hidden
  habits, so the verbs mute instead, and anything hidden that way on
  entry comes back muted: there was a reason it was out of view, and
  muted is visible without being in your face. Charm-hiding is the
  exception, because charms are saved. The tasks cycle loses its
  hidden step here rather than muting twice (above).

Two exits: **save new default view** (or shutting the padlock) and
**exit design mode without changing**. A refresh is a third — nothing is
saved until the lock shuts, so it cancels the session. Unlocking keeps
whatever is already on screen, which makes unlock-then-lock the quick
way to keep an arrangement fiddled into shape over an evening.


### The date display (T4.5)

At the right-hand end of the header bar (design-notes §13a), on every
page, the date shows **large and letterspaced**:
`M O N D A Y   2 0   J U L   2 0 2 6`. It holds that corner at every
width — when the bar folds to two rows it stays up top beside the
wordmark, and it is kept to one line always (§13a).

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
on **wide screens only**: anywhere narrower it is skipped entirely and
the screen plain-fades in instead. (Since 2026-07-23 the whole app sits
behind the width gate — see §3 device stance — so this animation simply
lives on the wide side of that block; the plain fade is the resting
behaviour just below the line, which has been 740px since 2026-08-12.)
Full visual treatment in design-notes §12f.

### The phone (M8 — planned 2026-08-17, not built)

Below 740px Habitat becomes a **deliberately limited companion**, not a
second full app. Kimia's constraint, in her words: "the only mobile
experience I can accept is a limited one, before it gets too busy." It
is not a separate app or a separate codebase — the same URL, a different
shell inside the width fork (§3), sharing every pure function in
`src/game/`.

**The phone requires a laptop.** It cannot create a habit, so it can
never be someone's only Habitat: a phone-only browser would be an empty
screen with nothing to do. Setting up is a laptop act, and the phone is
where the days get marked.

**What the phone can do:**

- see today's habits and mark them — **+1 / done only**
- filter today's view by charm (the same lens as the home screen)
- the **morning check-in, yesterday only**
- the game, near enough in full: the meters, drop arrivals and their
  reveals, the Abode, the Bookcase, the Map, the Market, the Guest Book
  and the cameos — **all the juice** (Kimia's call: "pretty much all the
  game juice features should exist on mobile")
- **arrange** the Abode and the Bookcase by touch — its own arrangement,
  see below

**What the phone cannot do — every one of these is an EDIT, and edits
live on the laptop:**

- create a habit, or edit one (name, symbol, difficulty, schedule,
  description)
- archive, unarchive or delete a habit
- see the archived-habits view
- reverse a mark (**no −1**)
- re-order the habit list
- see the field notes, including the graphs
- edit any past day other than yesterday's check-in
- change any time-shape setting — the day cutoff, and the week shape
  when T6.15 builds it

The line is **marking versus editing**, not "some of the app versus the
rest". A phone adds to the record; only a laptop can rewrite it. That is
also what makes sync easy: marks from a phone are purely additive, so no
deletion ever has to travel between devices (§8).

**Two arrangements, on purpose.** The Abode and Bookcase layouts are
**per-device and never synced** — screen size massively changes what
arrangement you want, so a phone abode and a laptop abode are meant to
differ and are never reconciled. The gameplay persists across devices;
the arrangements do not talk to each other. They still live inside the
versioned envelope, so a backup file keeps them (the 2026-08-12 rule in
plan.md T6.11 stands); it is sync, not storage, that leaves them alone.

**The world pages arrive one at a time.** The list above is the
destination, not one task. A vertical habit list is the easy thing to
fit on a phone; the Map, Abode, Bookcase and Market are wide 2D layouts
and are the hard ones. So M8 ships the daily core first and then adds
one spatial page per design slice, each judged on a real phone, the way
every other design task has been done (Kimia's call 2026-08-17 —
committing to six spatial redesigns on paper is the spec-then-implement
trap). If a page cannot stay calm on a small screen it does not ship,
and nothing is lost by finding that out late.

## 6. Data & reflection

- Every completion/skip logged locally, timestamped, attributed to the
  correct day (see 4.2).
- A **weekly view** summarises the week: completions and streaks —
  presented as field notes, not a guilt dashboard. Kept simple in v1.
  ("Patterns" were dropped from the brief — Kimia, 2026-07-16; the
  grid speaks for itself.) Per-habit line graphs live at the foot of
  the field notes (built in T2.4). Their line has **rounded corners,
  never smoothing** (Kimia's call 2026-08-11): the readings and the
  straight runs between them stay exactly where the data puts them, and
  only the last few pixels either side of a change of direction are
  curved. Nothing on a graph may ever be resampled, averaged or
  invented — a graph here is raw frequency, and it stays honest.
- **Streaks in an older week (2026-07-27).** Each week's streak is told
  as of that week's end. Switching a habit between a day-counted and a
  week-counted schedule restarts its streak at the switch (§4.2), so
  weeks BEFORE such a switch fall outside the streak now running: they
  simply show no streak, the same blank a broken streak shows. The
  grid, the marks and the graphs are unaffected. **A week's streak is
  told on the evidence that existed by then (2026-08-20):** the walk
  sees only what had been marked by that week's end, never what came
  after. Without that, a finished week borrowed the following week's run
  — four unbroken weeks read 2, 3, 4, 4 instead of 1, 2, 3, 4, and a week
  genuinely missed reported a streak instead of the blank it earned,
  which made a broken run look intact all the way back.
- **The streak spotlight (2026-08-20).** Arriving here from a cameo
  opens the page on the week the record stands in — not the last
  completed week it opens on otherwise — and blacks the page out around
  the run: the habit's name and its length, and every other record that
  fell the same day. Click anywhere to escape onto the week underneath.
  It stores nothing and leaving the page puts it out, exactly like the
  visit that opened it (design-notes §8).

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
  Typography: **the reader's own system font, settled as-is
  (2026-08-12)** — a two-typeface plan was built that day and rejected
  on sight, so the lettering Habitat already had became the final
  answer (design-notes §11c). Lowercase is Habitat's voice throughout;
  size and letterspacing, never boldness, mark a display moment.
  Every colour, glow strength and spacing number
  lives in one **CSS design-tokens file** of named, commented values —
  the visual twin of `constants.js` (T5.2, design-notes §11d).
- **The world-art language and full asset catalogue** (every family's
  form rules and fixed counts) live in **design-bible.md**
  (2026-07-24) — the reference for asset-creation sessions.

## 8. Architecture (v1)

- Static single-page web app: HTML/CSS/JavaScript (framework decided in
  plan phase — likely React or plain JS, whichever keeps us simplest).
- No backend. All state in `localStorage`, with a manual "export/import
  data" button as backup insurance.
- **Durability (2026-08-10).** Browsers may evict a site's storage, and
  they evict a whole origin at once — which here would mean every day of
  history, silently and with no error. Size is not the risk: five years
  at the planned pace is about 1 MB, well inside the ~5 MB localStorage
  allowance. Eviction is. Two defences, neither a backend:
  - on first run **with data present**, the app asks the browser to mark
    its storage persistent (`navigator.storage.persist()`). Chrome and
    Edge decide silently from their own engagement heuristics — a
    bookmark or frequent visits make a grant far likelier — and Firefox
    asks. A refusal changes nothing and is never surfaced. It is asked
    only when there is something to protect, so a first-time visitor is
    never prompted to keep nothing.
  - the export button carries the **backup's age** ("backed up 12 days
    ago") as its hover label — a line of text beside it until
    2026-08-12, when the foot of the home screen became three clean
    buttons. Persistence is a request, not a guarantee, and it does
    nothing against WebKit's rule that clears script-writable storage
    after seven days without a visit — so an exported file kept
    elsewhere remains the only real safety net, and its age is the only
    thing that says whether it still counts. It states a fact and
    stops there: no colour change, no urgency, no counting of neglect
    (§ no punishment mechanics applies to chores too).
- **Languages (2026-08-16; T6.13 built the mechanism, T6.14–T6.19
  complete it).** Habitat is built to speak **more than two** languages:
  Farsi is the first additional one, not a special case.
  - **One copy deck.** Every word Habitat says — interface, story,
    names, blocked and mishap messages — lives in ONE keyed file, which
    is Kimia's. It is a copy file first and a translation file second:
    the place English copy is edited too, so no wording is ever hunted
    for inside a component.
  - **Key-first layout.** Each entry carries a plain-English `note`
    saying what it is and where it shows, then every language beside
    each other. **Adding a language is adding a line per entry** — this
    shape is the one that makes further languages cheap, and it is why
    it was chosen over a block or a file per language.
  - **Two blank-rules, one per section, stated in the section header.**
    **Interface** blanks fall back to English — a blank button is a
    broken control, not restraint, and this fallback is what lets a
    language be filled one word at a time without the app ever being
    half-broken. **Story and names** blanks stay silent, exactly as
    before: never invented prose, never an invented name.
  - English is the fallback and so is the one language that must never
    contain a blank; tests enforce that, that every language carries the
    same keys, and — from T6.14 — that no component holds a hardcoded
    user-facing string, so the deck cannot drift out of date.
  - Each language names itself **in its own script** in every entry, so
    the switch reads the same whichever language is on and there is
    always a way back out of one you cannot read.
  - The chosen language is a **setting inside the storage envelope**
    (schema v11): it survives a reload and travels in a backup.
  - **The wordmark is not copy.** HABITAT stays in Latin letters in
    every language (Kimia 2026-08-16) — a constant, with no key to
    translate and no way to change it from a content edit.
  - **What rides with the language and what does not.** Direction,
    lettering and the calendar ride with it (T6.16–T6.18). **The shape
    of the week does not** — see §4.2. That split is deliberate: the
    first three change how things are DRAWN, the week changes what the
    data MEANS.
  - **Translation is AI-drafted and human-reviewed** (T6.19, Kimia's
    call). A machine draft is a suggestion in a review queue, never a
    slot filled in her name; an unreviewed slot stays blank, and a blank
    interface slot shows English. So Habitat can be partly translated,
    but never wrongly translated.
- **Starting a new game (2026-08-11; two doors since 2026-08-12).**
  "start a new game" opens a popup that asks WHICH kind of fresh start,
  then asks "are you sure?" and names exactly what goes and what stays
  for the door chosen. "no, take me back" returns to the choice; "not
  now" closes and changes nothing. The two doors:
  - **total refresh** — a brand-new Habitat. Habits, every completion,
    the whole world and every setting go; it starts exactly as it did on
    its very first day. Only an exported backup can bring any of it
    back, and it carries no forced-backup guard: it is the deliberate
    throw-it-all-away choice and its confirmation says so.
  - **keep habit data** — the world begins again and the habit record
    survives whole (described in full below). This is the door the
    forced backup guards.
- **Keeping the habit record while the world restarts (2026-08-11).**
  The world can be wiped and begun
  again, and doing so **keeps the whole habit record**: every habit and
  every completion survives, so the grid, the streaks, the graphs, the
  field notes and the check-in are untouched. What goes is the planet —
  every flora, book, friend and fungus, everything bought at the Market,
  the abode and bookcase arrangements, the expedition trail, and the
  world seed itself (a kept seed would make the new game a replay, not a
  new planet). Mechanically it is two moves, because the world hangs off
  history in two ways: drops are stored on completions, so they are
  emptied; and the meters that COUNT completions read only the marks not
  stamped as belonging to a past game. The stamp is on the record, never
  a date — the morning check-in always asks about yesterday, so days
  before the fresh start go on being marked inside it, and those marks
  must earn their steps.
  The one guard is a **forced backup**: since 2026-08-12 it sits on the
  **"keep habit data"** choice inside the popup, which stays disabled
  until a backup has been exported in that visit. So the discarded world
  is always recoverable by importing the file. While it is disabled it
  says why — **"export a backup first"**, as a hover label.
- **Two devices (M7 — planned 2026-08-17, not built).** One person's
  laptop and one phone or tablet showing the same record. Two devices is
  the whole design target; nothing here tries to be a general sync
  system. The shape, decided before any code:
  - **Local-first, always.** `localStorage` stays the source of truth on
    every device and nothing ever waits on the network: a device loads
    from its own store and renders instantly, exactly as today, and the
    fetch happens afterwards in the background. So **sync failing is
    never Habitat failing** — offline, bad signal, or the host being
    down all degrade to "Habitat works normally, syncs later". Sync is a
    **mirror, not a replacement.**
  - **Opt-in, and dormant until asked for.** A laptop-only user makes no
    network request to anything Kimia runs — not a failed one, not an
    empty one, none. The feature is one quiet settings row, and until
    someone uses it their pairing slot does not exist.
  - **A pairing code, not an account.** A long random string, generated
    by Kimia by hand (below), entered on the laptop once; the laptop
    then shows a QR the phone scans, which carries both the address and
    the code. **The two devices need to be together once, for seconds,
    ever** — after that they talk through the host, not to each other.
    No email, no password, no reset. The app strips the code out of the
    address bar as it reads it.
  - **Encrypted on the device.** The pairing code doubles as the
    encryption key: the envelope is encrypted before it leaves and
    decrypted on arrival, so the host stores ciphertext and **Kimia
    cannot read her friends' habit data even though she is hosting it**
    — nor can anyone who breaches the host. The price is real and
    decides other things: lose both devices and the code and the data is
    unrecoverable, which is what makes the exported-file habit (T6.4)
    mandatory rather than nice to have.
  - **Unpair** deletes the remote copy and returns that person to
    local-only. This is what makes "delete my data" a request that can
    actually be honoured.
  - **What syncs, and what stays put.** Sync merges an **allowlist of
    fields** — habits, completions, flora decisions, purchases, the world
    seed, the day cutoff, `checkedInThrough` — and leaves everything else
    to whatever the local device says: the Abode and Bookcase
    arrangements (§5b), `startupShownOn`, `fieldNotesShownOn`,
    `lastExportedOn`. So **the envelope does not change and there is no
    schema bump**: device-scoped-ness is a rule sync obeys, not a new
    storage tier, and a backup file goes on carrying everything as it
    always has. The pairing code itself is device-scoped state and lives
    under its own `localStorage` key outside the envelope, following the
    precedent T6.11 sets for the charm lens.
  - **Merging.** Completions carry unique ids and a frozen `dayKey`, so
    two devices' marks are a union; the phone cannot delete anything
    (§5b), so no deletion ever has to travel; `checkedInThrough` only
    moves forward, so the later day wins. The merge must be
    **idempotent** — merging the same data twice gives what merging it
    once gave — or two devices will correct each other forever.
  - **Where it lives: deliberately undecided until M7 builds** (Kimia's
    call 2026-08-17). Two candidates, and the encryption boundary is what
    keeps them swappable: a **Cloudflare Worker + KV** store Kimia runs
    (cheapest, free tier fails closed rather than billing, five-second
    setup for a friend), or **each user's own cloud** — Dropbox or
    Drive — where Kimia hosts nothing at all but every friend needs an
    account and a sign-in flow.
  - **No public create.** Whichever host: the public endpoint supports
    read and update-existing only. A slot exists **only because Kimia
    made it by hand** and sent the code — so the "someone generates a
    thousand slots" abuse route is not gated, it is absent. Plus a rate
    limit per code and per IP, a write size cap, and a per-code daily
    write cap on the host.
  - **Guarding against Habitat's own bugs.** The realistic way this
    burns quota is not an attacker but a runaway loop in our own sync
    code. Three layers: (1) make loops impossible — send only if the
    bytes actually changed, an idempotent merge, one request in flight,
    no polling timers (open / focus / debounced-save only), one tab syncs
    via Web Locks; (2) cap the damage from bugs nobody foresaw — a
    client-side hourly request budget that trips and simply stops
    syncing, exponential backoff with a ceiling, debounce and coalesce
    (five taps are one upload), the per-code daily cap; (3) catch it
    early — keep the merge a pure function tested with a call-counting
    fake, a "run the cycle twice, expect zero requests" regression test,
    Kimia's own two devices as the canary before a second code is ever
    issued, and a host-side off switch that works without a deploy
    (GitHub Pages takes minutes; a burning quota does not wait). **If
    only three get built, build the content-change guard, the hourly
    budget, and the run-it-twice test.**
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
