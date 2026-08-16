# design-notes.md — HABITAT (UX & feel)

_This file is the current feel layer — read the sections your task
touches, alongside spec.md, before any design-adjacent work. Its
version-by-version changelog lives in **history.md**._

---

## 0. How to use this file

This is the **feel layer** on top of spec.md (what the app is) and
plan.md (the order we build it). Read it alongside them before any
design-adjacent task. The world-art language and asset catalogue live
in **design-bible.md** (2026-07-24) — asset-creation sessions read
that; this file stays about the app's feel.

**Two hard rules** (also in CLAUDE.md — they cut across every task):

1. **Soundless.** No audio, anywhere, ever. All feedback is visual.
2. **Claude Code never writes the story.** All narration, dialogue,
   friend introductions, and captions are **human-written by Kimia**.
   Claude Code scaffolds _empty, keyed content slots_ and ships them
   blank (`TODO: written by Kimia`); it must never auto-generate prose.
   This applies retroactively: the five built T3.2 reveals get
   slot-ified (plan T3.4), their current text kept only as a marked
   placeholder until Kimia replaces it. See §7. **Since 2026-07-19
   this covers images too:** the reading-material spreads (plan T3.5)
   are pictures Kimia provides — never AI-generated. Same shape:
   Claude Code builds the keyed slots and the graceful empty state;
   Kimia makes the content.

---

## 1. The north star (the feeling)

Foundational emotions: **encouragement and motivation**. Never anxiety,
panic, or punishment. The reference feeling is **seeing gains after the
gym** — slow, steady, unmistakably earned by our own consistency, and
never taken away. This is the feel-level expression of spec §5's pacing
principle (no front-loading, no retention hooks).

**The juice comes from timing, scale, colour, and light.** The only
techniques we reach for: **glowing**, **pulsating**, **anticipation
through pause**, **tap to reveal**. No sound, no chaos, no
number-go-up spam.

---

## 2. Completion & the undo affordance **[feel rule · applies to T3.2b, T1.3]**

The reversal logic already exists: undoing a completion reverses the
expedition meter and takes its drops back with it (spec decisions
2026-07-15 / 2026-07-19). **This note is about how undo _feels_.**

**Decision (2026-07-19) — persistent but quiet.** The undo control
stays available for as long as the spec's rules allow (same-day for
one-time to-dos; the T3.2b counter's undo alongside its +1) — quiet by
_design_, not by disappearing. It is small, low-key, visual-only:
never an alarm colour, never a shake. "Gentle correction," not
"error." (This supersedes the v0.2 draft's fading-undo idea, which
conflicted with the spec's same-day undo rules.)

Edge cases keep the same calm treatment: undo after a drop is held;
undo that un-crosses a meter segment or era boundary. Those already
need tests (T3.2b) — the visuals stay gentle through all of them.

**Its face, from T4.5 (2026-07-20): `-1`.** The word "undo" becomes the
mirror of the `+1` it sits beside. This is the quiet rule getting
quieter — "undo" is the language of mistakes and error dialogs, `-1` is
just arithmetic. Nothing about the behaviour changes; the control is
still persistent, still small, still never an alarm colour. It should
read as the same weight as the `+1`, not lighter — taking a step back
is as ordinary as taking one forward.

---

## 3. Live vs. retroactive completions **[DROPPED — Kimia's call 2026-08-13]**

~~Keep the satisfaction of checking off retroactively, but make
**same-day taps more satisfying**.~~

~~**Decision — tonal palette shift, same shape.** Live and retro play
the **same animation shape** in different light: **live = full neon
POP** (the peak moment); **retro = a cooler, dimmer "past" tone** (a
memory being logged).~~

**Dropped entirely (2026-08-13), and kept here struck through so nobody
proposes it again** — the same treatment §11c's typography plan got.
Asked directly, Kimia's answer was to retire it rather than build it or
defer it. Nothing had been built, so nothing was reverted.

What survives is not cosmetic and still stands: retro marks earn drops,
but their **arrivals wait for the done button** (spec T3.2), and retro
marks attribute to the day they were _done_ (spec §4.2). The date logic
was never the part in question.

---

## 4. The meters — growth you can see **[BUILT — T5.2e, 2026-08-14]**

The meter UI is **already built** (T2.2). Since T4.5 (Kimia's call
2026-07-21) **all three are bars**: the expedition meter is the
**rolling bar** as ever (one ~100-step segment ≈ a month at current
pace, rolls over to empty — labelled simply **steps taken**); literacy
fills toward the next friendship level and refreshes at each one
(**literacy level**); the wallet is a bar too now, clamped 0–40 fungi
(**wallet balance**). The exact numbers moved behind each meter's
**hover**, and since 2026-07-22 the hover is the **bare number only** —
no label words: steps shows the lifetime total, literacy the 0–100 level
number (ten per level), the wallet the true balance — **a plain negative
number while debt is being settled**. Kimia weighed the punishment-feel worry
(the face never showing debt is her 2026-07-20 rule and stands) and
chose honesty on demand: the face stays calm, the hover is a question
asked, so it may answer plainly.

**Decision (2026-07-19) — momentary glow + thicken on movement.** Each
forward movement plays a **momentary animation**: the bar glows and
grows thicker to show the movement, then **immediately fades back to
its normal view**. A **segment roll-over** is the celebratory "gains"
beat — a brighter pulse of the same treatment — and it too settles
straight back. The resting state of the bar never changes; the
persistent running total remains the accumulating proof of work. This
**layers onto** the built T2.2 bar — no rebuild.

**Which bars light up (Kimia's call 2026-08-14): every bar that
moved.** A tap always moves steps; that same tap moves literacy or the
wallet only when a drop says so, and when it does, that bar glows too.
The thicken is painted rather than real — the bar scales instead of
growing — so a movement never pushes the header's contents around.

**Forward only.** A `-1` and a purchase both take a bar down, and
neither plays anything: undo is quiet by design (§2), and spending is a
choice the user made rather than news. **Both roll-overs celebrate** —
an expedition segment completed and a new literacy level — while the
wallet has none to give, since its bar clamps at the top instead of
emptying and starting again.

The bars are watched by their **lifetime totals**, never by their own
fill: steps and literacy both empty themselves at their best moment,
and a fill reading would call that going backwards. The wallet is the
opposite case and is watched by its **bar**, because it is the one
meter whose face can sit still while its true number moves (hidden debt
below zero, a balance past the top) — a glow for a change nobody can
see would be worse than no glow.

**Where it plays, now that the meters have moved (Kimia's call
2026-08-13).** This was written while the
meters sat at the top of the habit list, an inch from the habit being
tapped. Since §13a they live in the **header bar**, on every page,
which is a long way from a habit near the foot of the list. So the
movement plays in **both places**: the header meter does its glow and
thicken, and the **tapped habit gives a small matching spark** — the
movement starts where the finger is and finishes where the meter lives.
Neither half is the whole gesture.

**The spark, as built (Kimia's call 2026-08-14):** a ring of light
opening out of the control that was pressed — the `+1` pebble, or a
to-do's tick — and gone in half a second. It wears the **expedition
colour** rather than the row's own charm, because the two halves are
meant to read as one gesture: what leaves the finger is what arrives at
the bar. Only completing sparks; `-1` stays quiet like everything else
that goes backwards.

**And the check-in has no header bar** (§13a: it opts out, keeping its
own plain wordmark, so its done button stays the only way out). A retro
mark therefore has no visible meter to move. The movement is **held and
plays once when the check-in closes**, which is exactly what that
screen's drops already do (spec T3.2) — one arrival of everything the
session earned, rather than a ceremony against a bar nobody can see.
**One movement for the whole session** (Kimia's call 2026-08-14), not
one per mark: five habits marked across three days land as a single
beat. Nothing marked holds nothing, and marking then unmarking leaves
nothing to celebrate. The check-in's own rows do **not** spark — there
is no meter on that screen for a spark to travel to.

**And the bars must arrive where they WERE (Kimia's call 2026-08-16,
after looking for this on a real morning and seeing nothing).** Closing
the check-in does not update the meters, it **creates** them — that
screen has no header at all — and a bar born at its new length has no
distance left to cross. The most legible half of a movement simply
never happened: all that was left was a glow, playing in the same
instant the whole header appeared, which is the one moment nothing
small can be seen. So the meters now come up showing the pre-check-in
numbers, hold for a beat while the screen settles, and only then
travel — the glow firing with the movement rather than before it. The
distance is honest, so it is small for a small check-in; the glow is
what draws the eye to it, and the travel is what makes it mean
something. For that held beat the bars report what they are drawing
rather than what the data says — the mark is already recorded either
way, and a bar should never claim to be somewhere it is not.

---

## 5. Drops — star-shimmer & firework **[BUILT — T5.2e, 2026-08-13/14/16]**

Drop arrival as built (T3.2): a regular drop shows a **quiet pastel
note** beside the tapped habit ("you came across …") plus the **SVG
drop object**, lingering a few seconds before fading (click to hold).
The **five first-occurrence reveals** (first flora / magazine / novel /
dictionary / fungi) are **full-screen neon POP**.

### Where an arrival appears **[BUILT — T5.2e, 2026-08-13]**

Written for a screen where the meters and the shelf sat together above
a short habit list. Neither is true now — §13a moved the meters into
the header, and a real list runs well past one screen — so a drop from
a habit low down arrived somewhere it was never seen. Kimia's calls:

- **The shelf is pinned to the top right of the WINDOW**, not the top
  of the page, and follows the scroll. It **never covers the header**:
  the app measures the real header bar and the shelf clears it at both
  its one-storey (wide) and two-storey (narrow) heights, so there is no
  number to keep in step by hand. Below it, the shelf is free to float
  over the habit list and the charm filter.
- **Every arrival wears its name from the moment it lands** — "a flora
  find", "3 fungi". Holding is no longer how you learn what something
  is; it is only how you stop it fading and reach its choices. With
  several drops on screen, each object and its words are one blob and
  cannot be mismatched.
- **Newest on top**, pushing earlier arrivals down; the markup is built
  in that order so a screen reader hears the order the screen shows.
- **An arrival is a blob, not a card** — the shape language the Map's
  regions already speak: an uneven drawn outline with a lit edge and a
  little glow, in its own stream's colour. Three outlines, authored
  once and stretched to whatever size an arrival turns out to be,
  chosen by the arrival's id. `border-radius` cannot do this and was
  tried: a wide, short box rounds into a clean lozenge whatever the
  eight percentages say.
- **The blob is opaque** — filled with the ground colour itself, so it
  reads as a hole cut in the sky rather than a second surface. The
  white-wash surface was fine while the shelf sat inside the page, and
  wrong the moment it began floating over the tiles, which read
  straight through the words on a narrow window.
- **The by-the-habit note sits OUTSIDE its tile**, in the margin to its
  right, out of the layout altogether. It used to be a line inside the
  tile, so a landing drop made that tile taller and shunted every tile
  below it — the list moving under a finger already reaching for the
  next habit. Softening that growth with a slow animation was weighed
  and rejected: a tile that jumps has finished moving before your
  finger arrives, while a tile that grows slowly is still travelling
  while you aim at it. **Where the window is too narrow to have a
  margin, the note simply does not show** — it is an echo now, not the
  announcement, and the same words always arrive on the shelf, which is
  pinned to the window and never runs out of room.

**Decision (2026-07-19) — the middle path.** Regular drops gain a
**small, brief star-shimmer** on arrival (a light touch over the
quiet pastel, not a takeover). The **full firework** — a burst of
confetti-like stars that slowly fade — is the larger register, kept
for a rarer moment. This honours both the quiet, patient pacing and
"drops should feel special."

**Amended 2026-08-16 — the firework leaves the drops entirely.** The
2026-07-19 decision reserved it for first-occurrence reveals and friend
arrivals, and was written when a reveal was pictured as something
happening around a drop on the page. It is not: a reveal dims the whole
screen and puts a neon card in the middle of it, which already shouts
louder than any burst of stars could. A firework there would have been
decoration on top of a takeover.

Kimia's call, on re-reading her own spec: the firework belongs to the
one moment that celebrates **her** rather than a thing arriving — the
**home-screen cameo** (§8, T4.6), where a friend turns up to mark a big
win. Not every win: only a **record streak** and a **50-lived-day
milestone**, the two that mark something never done before. A big day
can happen again next week and keeps its quiet visit, because a
celebration you can see any time is wallpaper — §8's scarcity rule,
applied to the cameo's own three doors. How the burst looks is in §8.

**And so every arrival shimmers now.** The shimmer used to skip a
friend and a first-occurrence find on the grounds that the firework was
theirs; with the firework gone from the reveals, that rule would have
left the BIGGEST arrivals as the only ones landing without a sparkle.
They shimmer — but their stars are held back until the reveal is
dismissed, because an arrival sitting behind a full-screen overlay
would otherwise burn its whole sparkle where nobody can see it. The
stars play as it comes into view, which is when there is somebody to
watch them.

### The shimmer, as built **[BUILT — T5.2e, 2026-08-13]**

Written for a screen where a drop was one thing in one place. It is two
now — the blob on the shelf and the note out in the margin — so Kimia
was asked where the sparkle belongs and answered **both places**. Her
calls, and what they mean:

- **On the blob: stars around its EDGE**, not on the little object
  inside it. What sparkles is the arrival, so a find reads as one thing
  arriving rather than an object with an effect on it. Twelve points
  authored once as percentages of whatever box they are laid over — the
  same reasoning the blob outlines follow, and the reason nothing is
  measured per arrival.
- **The stars are the NIGHT SKY's, not a fairground's** (Kimia on
  seeing the first build: "it's giving Las Vegas"). Mostly **dots** at
  the sky's own range of sizes, with **two** four-pointed sparkles left
  as accents; **half white, half across the six charm colours**, each
  glowing its own colour rather than the arrival's; **slow** — a star
  takes a second and a half to breathe in and out, and the ring swells
  and settles over about three seconds rather than flashing; and set
  **wide**, standing well off the blob, which is what makes it read as
  spacious and ethereal instead of a fringe on a card. The clearance
  under the header grew with it: the promise that the shelf never
  covers the header has to hold for what an arrival throws as well as
  for the arrival itself.
- **On the note: the WORDS themselves shimmer.** A line of text has no
  outline to put stars around, so its half of the gesture is a **glint**
  — one band of light travelling across the sentence as it appears, then
  gone. A second drop from the same habit rewrites that one sentence
  rather than adding a line, and the rewritten sentence glints again.
- **Several at once cascade** — each blob a tenth of a second behind the
  one above it, newest first. A morning check-in closes with everything
  the session earned arriving together, and a single flash would read as
  one event rather than several finds.
- **Every arrival shimmers, but not always at once** (revised
  2026-08-16 — see the amendment above). This bullet used to read "a
  friend and a first-occurrence find owe a reveal, and the firework is
  theirs, so neither sparkles"; the firework has since left the reveals
  for the cameo. What survives of the old rule is the timing: an
  arrival still owing a reveal is hidden behind a full-screen overlay,
  so its stars wait until the reveal is dismissed and it comes into
  view.
- **Colour, and the sky's white-only rule.** Design-bible §3 keeps
  Habitat's stars white; that rule governs the SKY, and the shimmer
  borrows its dots rather than replacing them — a momentary event on a
  lit blob, where the charms are already where Habitat's colour lives.
  So the sky stays white-only and the shimmer is half and half. The
  white half asks for `--shimmer-star`, the other half for the six
  `--charm-…` tokens by name.
- **Both halves are decoration**, and a reader who has asked for less
  movement gets neither. The drop still lands, still wears its name,
  still fades on its own clock: that fade is how an arrival leaves, not
  an ornament.

### How an arrival leaves **[BUILT — T5.2e, 2026-08-14]**

An arrival holds for about four and a half seconds and then **dissolves
over a second and a half** (Kimia's call 2026-08-14), evenly, so the
whole going is watched rather than guessed at. The **note in the margin
dissolves on the same clock**: it used to hold at full strength and
then simply stop existing, which beside a dissolving blob read as a
glitch. Holding a drop stops the blob's fade but not the note's — the
held object keeps its own name, so nothing becomes unreadable.

Two things this pass found, and neither was the pacing:

- **An eased fade is not a slow fade.** The 1.5 seconds had been there
  all along, but on an ease curve it spent its first third falling to a
  fifth of full brightness and its last third drifting about below the
  eye's floor — a half-second snuff with a long invisible tail. Spent
  evenly, the same 1.5 seconds reads as the slow dissolve it was always
  meant to be.
- **A drop must only be ended by its OWN fade.** An animation's end
  travels up the page like a click does, and the shimmer gave every
  arrival twelve star children with 1.5-second lives of their own. The
  first star to finish was taking the whole drop off the shelf at a
  second and a half, at full brightness, so nothing ever reached the
  fade at all. Worth remembering as a shape, not just a fix: **an
  element that ends its own life on an animation has to ask which
  animation ended.**

Anticipation-first stays true at the top of the hierarchy: **friends
arrive as delayed surprise drops** days after a literacy milestone
opens the door (spec §5, T4.4).

**Drop-choice symmetry (2026-07-19, plan T3.5).** The two drops with
_intrinsic_ value offer the same held-arrival choice: flora —
**gather / leave it** (T3.3); reading material — **read now / read
later**, where read now opens the publication's double-page spread
and read later simply lets the arrival go (the piece is in the
Bookcase either way, re-readable anytime, tracked nowhere). Fungi
deliberately offer no choice: currency has only _exchange_ value —
it banks itself.

---

## 6. Epic unlocks & reveals **[TO-BUILD · M4]**

New **era of literacy** or new **map neighbourhood** should feel
**epic — but ambient, never interruptive**.

**Decision — grand in place, no takeover.** No full-screen modal, no
forced cinematic. The **Map / meter swells dramatically in place**
(glow, scale, light) and **we choose when to go explore**. Epic by
scale and light, not by seizing the screen. New characters get an
**anticipation pause + tap to reveal** (already the friend-drop
pattern). (First-occurrence reveals keep their full-screen POP — they
are personal firsts, not world unlocks.)

---

## 7. Story, narration & speech **[content human-written; slots: T3.4, M4]**

Story and narration are **written by Kimia, never generated**. Claude
Code builds the _slots and plumbing_ only.

- **Authoring model.** A **keyed content file** with an empty slot per
  narrated moment (each first-occurrence reveal, each friend
  intro/welcome, each map region, each literacy era). Slots ship blank
  / `TODO: written by Kimia`; the app renders gracefully when empty
  and never invents copy. **Built in T3.4 (2026-07-19):** the file is
  `src/content/narration.js`; the five T3.2 reveals read from it —
  titles too — their Claude-written text kept only as a marked
  placeholder until Kimia replaces it, and an empty slot shows
  nothing at all.
- **Narration is momentary.** Narration plays **once**, in the moment,
  and is **not stored or re-readable**. Precious, unrepeatable.
- **Card text is the one standing exception (2026-07-20).** Each friend
  has a **second, separate slot**: a short **card text** shown on their
  Guest Book popup card, re-readable any time. This does **not** soften
  the rule above — the arrival narration stays momentary and is never
  replayed. They are two different pieces of writing doing two
  different jobs: the narration is _the night you met them_, seen once;
  the card text is _who they are_, standing. Both are Kimia's, both
  ship blank, and an empty card text renders nothing at all (the T3.4
  precedent — glyph, name and animation carry the card alone).
- **Names stay visible (decision 2026-07-19).** Flora, objects,
  reading material and friends **keep their written names** — in drop
  arrivals (the built click-to-hold shows the name) and on the record
  pages. Records (Guest Book, Map, Bookcase) stay **visual-first**:
  art, names and dates — but no stored prose or captions; the
  narration was the story, seen once. (This resolves the v0.2 draft's
  "no written names" idea, which conflicted with the built T3.2
  naming and plan T6.1.) The friend **card text** is the single
  exception, and it sits _behind a click_ on the Guest Book card — the
  page itself still reads as art and names.
- **Speech bubbles** simulate speech for friends **high enough on the
  literacy ladder to have language** (see §8); text is human-written
  and momentary.

---

## 8. The beings — form, gesture & greeting **[TO-BUILD · M4.4, M5.3]**

The world **leans weird and abstract, not cutesy**. (One deliberate
exemption, decided 2026-07-19: the six habit-tag **charms** (§11) are
recognisable objects — they are personal talismans, not inhabitants
of N-Z-D. The world itself stays weird.) Flora, fungi,
trees, and literacy are **conceptual building blocks only** — output
should feel strange, not familiar-things-in-costume. (Forms, textures
and the fixed friend roster — 10 categories, 55 individuals — live in
design-bible.md §9c.)

- **Form & gesture — semi-abstract.** Suggested anatomy;
  congratulation gestures **read as** a wave / jump / dance but
  stylised and strange, never cute. Emotion through motion and light
  within an abstract body.
- **One signature animation per category (10).** Each of the 10 friend
  categories (Drifters … Poets) has one signature congratulation
  animation; individuals within a category reuse it. Bounds the art
  scope. (First built, T5.3b 2026-07-25: the **Drifter's is a slow
  "drift-and-bob"** — floats up, hangs, settles back, its glow swelling
  with the lift; `friend-drift` in index.css.)
- **Where the signature animation is allowed to play (decided
  2026-07-20).** Exactly three moments, and nowhere else:
  1. **The arrival reveal** — the friend-drop moment. The first time you
     meet them. (This used to say "with its full firework (§5)"; the
     firework moved to the cameo below on 2026-08-16 — the reveal's
     full-screen neon was always the moment, and the burst on top of it
     was decoration.)
  2. **The Guest Book card** — clicking a character on the _local
     community_ page opens a popup card (their art, their name, their
     card text) and the animation runs. This is the one moment you can
     summon at will.
  3. **Home-screen cameos that celebrate big wins** — a friend turns
     up on the habit list to celebrate: a day with many completions, a
     new record streak, a lived-day milestone. It performs once, with a
     short message alongside (Kimia's slots, shipped blank; her draft
     examples: "12 steps in one day!", "15-day streak record!", "50
     lived days!"). Encouragement, never a scoreboard. **The thresholds
     (Kimia's calls 2026-07-21, in constants):** a big day is 8
     completions; a record streak must beat the habit's own record and
     be at least 5 days (2 weeks for week-counted) strong — never a
     learnable schedule; a milestone is every 50 lived days, the
     crossing day only. The visitor is a seeded surprise pick; at most
     one cameo a day, rarest first; once per visit, nothing stored.
     _(Amended 2026-07-20, fourteenth session — Kimia's redecision,
     over the twelfth session's "rare and unpredictable". Built in
     T4.6, 2026-07-21.)_
     **The firework lives here (2026-08-16, T5.2e — moved from §5's
     reveals).** The two RAREST wins bring it: a **record streak** and a
     **50-lived-day milestone**. A big day keeps the plain visit — it
     can happen again next week, and scarcity is this section's whole
     argument. How it looks, on Kimia's calls the same day:
     - it rings the **whole visit** — the friend and the caption
       together — not just the art. The friend came to congratulate you;
       the celebration is of the moment, not of them;
     - the **same night-sky stars as the shimmer**: half white, half
       across the six charm colours, each glowing its own colour. The
       two are one family and this is the larger member — which is also
       what keeps the 2026-08-13 "it's giving Las Vegas" correction from
       being quietly undone at the bigger size;
     - the stars **travel outward from the middle and fade as they go**.
       This is the one thing the shimmer does not do — a shimmer
       breathes in place, a firework goes off — and it is what tells the
       two apart at a glance. Momentary like everything else (§9): it
       plays once as the visit opens, then the friend simply rests.
     The visit sits **above the habit list** in the stacking order for
     this reason: the lower stars fly past the bottom of the visit and
     over the tiles, and a translucent tile painting over them made the
     burst look merely dim rather than wrong.

     **And the visit is shaped like a drop (Kimia's calls 2026-08-16,
     second pass).** It had been a bare column of art, name and message
     sitting in the page flow above the habit list — which pushed the
     whole list down the moment a friend arrived, and looked like
     nothing else in Habitat. It now borrows the drop shelf's
     conventions, because the two are the same kind of event: something
     arriving over the page.
     - **The friend sits inside a blob** — the same three outlines the
       arrivals and the Map's regions wear, opaque, lit at the edge in
       the friendship rose an arriving friend already wears. The
       outlines moved to their own file when the second caller appeared;
       one shape language cannot live in two tables.
     - **The caption sits directly beneath it, on its own dark
       backing.** Not a card around the whole visit — the words' own
       backing, because the words are the part that has to survive
       landing on a habit tile, a charm or the bare night sky. The
       backing is **sprayed, not drawn** (Kimia on seeing the first
       cut): a rounded rectangle cut a hard edge across whatever tile
       it landed on and read as a black sticker stuck over the list. It
       is a radial fade instead — full strength under the words, gone
       before it reaches anything else, with no edge to notice. The
       padding around the words IS that fade, which is why the visit
       measures wider than the ink you can see.
     - **Pinned to the bottom left of the window**, the mirror of the
       shelf's top right, so the app's two floating moments never meet.
     - **The friend's name is gone.** The friend and the caption,
       nothing else. A visit is a moment, not a record card; who came is
       something you see, and the Guest Book is where names live.
     - **It fits the margin beside the habits, until it can't.** The
       content column is 40rem and centred, so the visit takes whatever
       empty margin is left of it and the caption wraps to fit — but
       never below the width at which a short sentence stops being
       readable. Under that it simply covers the tiles, which is the
       call: losing the words is worse than briefly sitting over a
       habit, and the visit is gone in nine seconds either way. Nothing
       in it is pressable, so it never comes between a finger and the
       habit underneath.
     - It **rises into frame** rather than dropping into it — a thing
       arriving from below the edge it sits on reads as coming to join
       you. Dropping from above was right only while it sat in the flow.
     **Party mode on the Abode is deliberately excluded** (§12e): friends
     gather there but do not perform. Scarcity is what makes the gesture
     land — a greeting you can see any time you like is wallpaper.
- **Wordless greetings — visual-only until literate.** Low-literacy
  beings (Drifters, Nesters, Mimics) communicate **visually only**
  (glyphs, light, motion). **Written speech bubbles are earned** —
  they unlock only for higher-literacy friends, mirroring the ladder.

---

## 9. Cross-cutting principles

- **Soundless.** Visual feedback only, everywhere.
- **No punishment feel.** Encouragement and motivation only;
  gym-gains calm.
- **Juice = timing, scale, colour, light** — glow, pulse, pause,
  tap-to-reveal, nothing else. All movement animations are momentary:
  play, then settle back to the calm resting state.
- **Weird > cute.**
- **Human writes the words; Claude Code builds the slots.**
- **Reversibility is quiet.** Undo is persistent where the spec allows
  it, but always gentle and silent — never an alarm.

---

## 10. Decisions resolved (2026-07-19, with Kimia)

1. **Firework** → the middle path: brief star-shimmer on regular
   drops; the full firework kept for a rarer moment (§5). _(Amended
   2026-08-16: that rarer moment is no longer "firsts and friends" —
   their reveals already take the screen in neon. The firework moved to
   the home-screen cameo's two rarest wins, and every arrival now
   shimmers. See §5's amendment and §8.)_
2. **Meter** → momentary glow + thicken layered onto the built T2.2
   rolling bar, fading straight back to normal; no rebuild (§4).
3. **Names & narration** → names stay visible everywhere; narration
   is momentary; records are visual-first with art + names + dates,
   no stored prose (§7). _(Amended 2026-07-20: the friend **card
   text** on the Guest Book popup card is a standing, re-readable
   exception — a separate slot from the arrival narration, which is
   still never replayed. See §7.)_
4. **Undo** → persistent but quiet — available as long as the spec's
   rules allow, styled gently (§2). _(Amended 2026-07-20: its label is
   now `-1`, the mirror of `+1`. Behaviour unchanged.)_
5. **Reduced-motion / calm mode** → skipped for v1; revisit only if
   the motion ever feels like too much.
6. **Built reveal text** → to be slot-ified (plan T3.4); the
   human-written rule applies retroactively.
7. **The six charms** (fifth session) → the habit tags are the six
   charm shapes in their reference colours (§11a) — a deliberate
   exemption from "weird > cute"; still no words anywhere.
8. **Typography** (fifth session) → the full reference type system:
   Cormorant Garamond display + DM Sans body, uppercase display /
   lowercase body, fonts bundled with the app (§11c). _(Retired
   2026-08-12: built, rejected on sight, reverted. The system font
   Habitat already wore is the settled typography — §11c describes it
   now rather than proposing anything.)_

## 10a. Decisions resolved (2026-07-20, twelfth session, with Kimia)

9. **The home screen goes icon-only** → every action an icon with a
   hover label; the two pencils told apart by size and colour;
   "filter view" as the filter's hover (§12a).
10. **The date display** → real calendar date, large and letterspaced,
    with a quiet 3am note only in the window where it disagrees with
    the Habitat day (§12b).
11. **The check-in becomes a pop-up** over a dimmed habit list — quiet
    framing, unchanged mechanic (§12c).
12. **The left rail** → eight icons in two groups since 2026-08-12: the
    three doers (+ · pencil · graph) above the five places (map · abode
    · community · library · market); meters stay clickable alongside it
    (§12d).
13. **Party mode** → friends present but **not performing**; your flora
    arrangement never disturbed; greyed out until a friend exists
    (§12e).
14. **The daily startup animation** → the one moment allowed to take
    the whole screen, on four conditions: short, wordless, skippable,
    and identical every day (§12f).
15. **The friend signature animation plays in three moments only** →
    arrival reveal, Guest Book card, rare home-screen cameos. Never
    party mode. Scarcity is the mechanic (§8). _(Amended 2026-07-20,
    fourteenth session: the cameo is now a big-win celebration with a
    short message — see §8 and the new §10b.)_
16. **Friend card text** → a second, re-readable slot per friend,
    distinct from the momentary arrival narration (§7).

## 10b. Decisions resolved (2026-07-20, fourteenth session, with Kimia)

17. **Repeat friends** → a category refills: each next friend waits a
    seeded 20–50 days after the previous arrival. Individuals within a
    category genuinely share the one signature animation now (§8).
18. **Cameos celebrate big wins** → a big day, a record streak, a
    lived-day milestone; the signature animation plus a short message
    from Kimia's slots. Built in T4.6 (§8). Party mode still excluded.
19. **Party mode shipped whole with T4.4** — toggle, greyed state and
    all, since T4.4 landed before T4.5 (§12e).

## 10c. Decisions resolved (2026-07-21, fifteenth session, with Kimia)

20. **All three meters are bars, numbers behind hover** (her PR +
    calls) — the wallet bar clamps 0–40, its hover shows the true
    balance as a plain number, negative in debt; literacy's hover is
    0–100, ten per level; steps' hover is the lifetime total (§4).
21. **Unarchive is an icon too, and every reversal reads `-1`** — a box
    with an up arrow mirrors archive's down arrow (the one extension to
    §12a's six icons); the archived one-time to-do's undo is `-1` like
    every other, beside a `+1` or not.

---

## 11. Visual identity reference **[§11a BUILT (T5.1, 2026-07-21) · T5.2 identity TO-BUILD]**

_From Kimia's charm reference (2026-07-19). This section is the
blueprint for T5.1 and T5.2 — everything needed is recorded here; the
original file is personal and stays out of the repo._

### 11a. The six charms (T5.1 — the habit tags)

The six habit symbols are **line-drawn SVG charms**, each with its own
colour. The symbol is still the tag — **no words, ever** — and each
charm glows in its colour (`drop-shadow(0 0 14px colour)`, brightening
to `24px` on hover). Stroke style: `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.4"`, round caps and joins,
on a `24×24` viewBox. One shared component draws all six
(`src/ui/CharmSymbol.jsx`); the six colours live in `src/ui/symbols.js`.
Mapping to the existing symbol slots 1–6:

**Accessible name (Kimia's decision, T5.1 2026-07-21).** A wordless
drawing still needs a name for screen readers and the test suite — the
old glyphs supplied one implicitly (`●` reads as "black circle"). Each
charm SVG carries `role="img"` + an `aria-label` of its **shape name**
(crown, cherry, shell, anchor, shield, key — singular "cherry", her
wording). This describes the picture, never the habit's meaning, so it
does not breach the no-labels rule; it is screen-reader/test only and
never shown on screen. (Kimia weighed this against a meaning-free
"symbol 1…6"; she chose the shape names.)

| #   | charm    | colour   | hex       | faint (borders/dividers) |
| --- | -------- | -------- | --------- | ------------------------ |
| 1   | crown    | gold     | `#F0BB3B` | `rgba(240,187,59,0.18)`  |
| 2   | cherries | coral    | `#F5805A` | `rgba(245,128,90,0.18)`  |
| 3   | shell    | pink     | `#E8698C` | `rgba(232,105,140,0.18)` |
| 4   | anchor   | lavender | `#A98EE0` | `rgba(169,142,224,0.18)` |
| 5   | shield   | sky      | `#5AB6F3` | `rgba(90,182,243,0.18)`  |
| 6   | key      | teal     | `#4FBFA0` | `rgba(79,191,160,0.18)`  |

The exact paths (drop into the shared SVG attributes above):

- **crown** — `<path d="M2 19h20l-3.5-9-4.5 5L12 5l-2 10-4.5-5L2 19z"/>
<line x1="2" y1="22" x2="22" y2="22"/>

<circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none"/>
<circle cx="4.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>
<circle cx="19.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>`
- **cherries** — `<circle cx="7.5" cy="17" r="3.5"/>
<circle cx="16.5" cy="17" r="3.5"/>
<path d="M7.5 13.5C7.5 10 10 7.5 12 6.5"/>
<path d="M16.5 13.5C16.5 10 14 7.5 12 6.5"/>
<path d="M12 6.5L13.5 3"/>`
- **shell** — `<path d="M12 21C7.6 21 4 17.4 4 13C4 9.5 6.2 6.5 9.4
5.2C10.9 4.6 12.5 4.5 14 4.9C17.2 5.8 19 8.8 18 11.8C17.2 14 15
15.2 12.8 14.8C11.2 14.5 10 13 10.2 11.4C10.4 10 11.8 9 13.2 9.4"/>
<path d="M12 21C14 18 13 15 12 13"/>
<path d="M4 13C6 14 8 13.5 10 12.5"/>`
- **anchor** — `<circle cx="12" cy="5" r="2.5"/>
<line x1="12" y1="7.5" x2="12" y2="21"/>
<line x1="5" y1="12" x2="9.5" y2="12"/>
<line x1="14.5" y1="12" x2="19" y2="12"/>
<path d="M5 19C5 19 7.5 22 12 22C16.5 22 19 19 19 19"/>`
- **shield** — `<path d="M12 2L4 6V12C4 16.8 7.6 21.2 12 22C16.4 21.2
20 16.8 20 12V6L12 2Z"/>
<path d="M9 12L11 14L15 10"/>`
- **key** — `<circle cx="7.5" cy="9.5" r="4.5"/>
<line x1="12" y1="9.5" x2="22" y2="9.5"/>
<line x1="20" y1="9.5" x2="20" y2="13"/>
<line x1="17" y1="9.5" x2="17" y2="12"/>
<circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/>`

### 11b. Palette & surfaces **[BUILT — T5.2b, 2026-08-11]**

- **Background:** `#080910` (deepens the current near-black; still
  dark-only per spec §7).
- **The six charm colours** double as the app's accent palette;
  their `0.18`-alpha faint variants are the border/divider tint.
  **The accent rule (Kimia's call 2026-08-11): a charm colour where
  there is a charm, neutral dim white everywhere else.** General chrome
  with no charm attached stays neutral. This is what stops six accent
  colours becoming a fruit salad — the colour always MEANS the charm,
  never decorates.
- **The task tiles are long baguettes of their own charm (Kimia's
  revision, 2026-08-11, after seeing the first version).** Border alone
  was too thin a statement — the accent read as an outline rather than
  an identity. Each row is now FILLED with its charm at
  `--charm-fill-strength` (9% to start; one number, mixed live from
  whichever charm the row wears, so there is a single value to tune
  rather than six), keeps its 0.18 edge, and is rounded to
  `--radius-tile` until both ends are half-circles. Horizontal padding
  is larger than vertical, because at that radius the ends curve inward
  and the charm would otherwise sit in the curve. The check-in's rows
  are the same rows and get the same treatment.
- **The pebbles wear this accent rule too (2026-08-11).** The controls
  that speak in words or numbers — save, cancel, `+1`, `-1`, buy, done,
  back to the habits and their kin — are ovals and circles outlined in
  the charm of the tile beneath them, or plain white where there is no
  charm, every edge diluted by one dial. **They are named, defined and
  rostered in §11e**; that is the section to read before changing any of
  them, and the only place the rule is written down.
- **The draft tile is a softly-rounded box, not a pill (same call).**
  It shares the tiles' family — `--radius-form`, corners rounded off
  generously — but stays a box, because a 999px radius on something
  tall curves its whole sides inward and squeezes the fields. Inside
  it: the charms first and centred (the charm is the first choice, and
  a centred row of six reads as a choice rather than a field), then
  each prompt sitting ABOVE its own field, because the prompts are
  sentences now and a sentence cannot share a line with the field it
  introduces. Save and cancel are centred at the foot with a wide gap
  between them.
- **A tile is seen leaving for the archive (Kimia's call
  2026-08-11).** It used to blink out of existence the instant it was
  archived — by the archive button, or by ticking off a to-do — which
  read as a glitch rather than as something happening. It now sinks,
  fades and closes its own gap over `ARCHIVE_FAREWELL_MS` so the tiles
  below glide up rather than jump. Momentary and settling, per §5; no
  alarm colour, nothing to dismiss, and the reduced-motion setting gets
  the same pause with a plain fade instead of the travel. The archiving
  itself is NOT delayed — the data is written at once and the tile left
  on screen is an inert copy, so the farewell can never be something a
  rule or a reload has to wait for.
- **The charms themselves wear no box (same revision).** They are
  drawings, and a drawing does not need a frame; the filter row is
  centred under the date. The box used to carry the on/off state, so
  that moved to presence: while any charm is chosen the others recede
  to 0.3 opacity, and with nothing chosen there is no lens at all, so
  every charm sits at full strength. Nothing is drawn on the screen to
  say "selected" — the rest simply step back.
- **Hairline borders** are dim white — `rgba(255,255,255,0.10)` for
  the everyday edge, fainter at `0.06`, waking to `0.22` under a
  pointer. White at low alpha reads correctly on any ground, so these
  do not have to be re-mixed when the background moves.
- **Panels are a white wash** (`rgba(255,255,255,0.03)`), not a colour
  of their own — a raised surface is the same ground with a little
  light on it. The one exception is the row being dragged, which stays
  opaque so it hides the rows it passes over. A resting tile mixes its
  charm with _nothing_ (that is what makes it see-through); the dragged
  tile mixes a stronger dose of the same charm into the opaque lifted
  ground instead (`--charm-fill-strength-lifted`), so it comes out
  solid. Trying to stack the two as layers of one `background:`
  shorthand is invalid CSS and silently leaves the tile with no
  background at all — the bug Kimia reported on 2026-08-11 as "the tile
  doesn't cover what it moves over".
- **Text brightness: unchanged, deliberately (Kimia's call
  2026-08-11).** This section originally specified dim text tiers —
  body at `rgba(255,255,255,0.58)`, quiet secondary at `0.38`. Kimia
  compared them against today's near-white and kept today's:
  habit names are what she scans fastest each morning, and dimmer text
  is slower to scan. The moodier tiers are not lost, only not chosen —
  they are one line in `src/tokens.css` if she ever wants them.
- Soft ambient depth: a faint radial `rgba(255,255,255,0.025)` wash
  behind the content column (built as `.app::before`; §13c's night sky
  will sit in it). Organic blob-radius borders remain welcome on
  feature frames — there are none yet; §13 builds the first.
- Neon POP moments keep their own brighter voice (spec §7) — the
  charm palette is the everyday register, not the exclamation mark.
- **Still wearing browser defaults, and now conspicuous:** the `+1` /
  `-1`, backup and new-game buttons have never been styled, and with
  everything around them quietened they are the brightest thing on the
  screen. They are not part of the palette question — they need a type
  and control pass, which is T5.2c/T5.2d.

### 11c. Typography **[SETTLED — Kimia's call 2026-08-12: what is on screen IS the typography]**

**Habitat is set in the reader's own system font, and that is the
final answer.** This section used to be a plan for two bundled
typefaces — Cormorant Garamond for display, DM Sans for everything
else, with an uppercase-and-widely-spaced convention over the top. That
was built on 2026-08-12 and Kimia rejected all of it on sight; the
build was reverted the same day and the plan retired with it. What
follows is not an aspiration, it is a description of the app.

- **One family: the system font stack** —
  `system-ui, -apple-system, 'Segoe UI', sans-serif`, set on `body` and
  inherited everywhere. Nothing is downloaded, which was the one thing
  the two-typeface plan and this have in common: Habitat looks the same
  offline and no outside server learns when it is opened.
- **Lowercase throughout.** Not a rule that needed enforcing — the
  words are simply written lowercase, and no stylesheet rule uppercases
  anything. The one uppercase thing on screen is the **HABITAT**
  wordmark, which is uppercase in the text itself.
- **Light weights carry the display moments.** The wordmark, the page
  titles, the section headings and the big date are all weight 300 —
  they are made distinct by SIZE and by LETTERSPACING, never by
  boldness. Habitat has no bold text.
- **Letterspacing is the display device.** The wordmark opens widest
  (0.5em), the date next (0.35em), page titles and section headings sit
  at 0.2em, the meters' names and a friend's name barely open at all
  (0.15em / 0.08em). Everything else is set normally.
- **Sizes are ad-hoc and staying that way.** Roughly 0.7–0.9rem for the
  small print, the browser's own sizes for headings, 1.1–1.5rem for the
  reveal titles, the date and the wordmark. There is no ladder and no
  named scale; see §11d for why type stays out of the tokens file.
- **Quiet lines are quiet by COLOUR, not by style.** The cutoff note,
  "still unfolding", a young graph's note and the map's caption are
  upright and dim. Nothing in Habitat is italic.
- **Prose breathes at 1.5–1.6**, controls and rows at the browser's
  own line spacing.

**If typography is ever revisited, revisit it in front of Kimia.** The
lesson of 2026-08-12 is that a typographic system reads completely
differently in a specification than it does on the screen: everything
built that day followed this section as it was then written, and she
disliked all of it. Type is not a thing to be specified and then
implemented in one go.

### 11d. Design tokens — the visual twin of constants.js (T5.2) **[COLOUR BUILT — T5.2a, 2026-08-10; SPENT — T5.2b, 2026-08-11; SPACING BUILT — T5.2d, 2026-08-12]**

Everything §11b and §11c name — every colour, every glow strength,
every font size, every spacing number — lives in **one CSS file of
named values with plain-English comments**, exactly as
`src/game/constants.js` holds the tunable game numbers. The look
becomes retunable the way the pacing already is: one readable edit in a
short, legible list, not a hunt through ~1,400 lines of stylesheet, and
nothing a non-coder can't follow.

- **Named, commented, single-file.** Each token is a CSS custom
  property (`--bg`, `--text-primary`, `--glow-soft`, `--space-4`,
  …) with a comment saying in plain English what it is and where it
  came from (e.g. "the shell charm's pink — also the daily startup
  planet"). No raw hex codes or magic px scattered through the rules.

- **The spacing scale — eight steps, one grid (T5.2d, 2026-08-12).**
  The stylesheet had grown **twenty-two** different spacing numbers, one
  component at a time: 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55,
  0.6, 0.7, 0.75, 0.8, 0.9, 1, 1.2, 1.25, 1.4, 1.5, 1.75, 2, 2.5rem.
  That is not a scale, it is an accident — differences under a pixel
  that do no design work and guarantee nothing lines up with anything
  else. They are now **eight steps on a 4px grid** (`--space-1` …
  `--space-8`: 0.25 / 0.5 / 0.75 / 1 / 1.25 / 1.5 / 2 / 2.5rem), with
  every old value snapped to its nearest step. Nothing moved by more
  than 2.4px, and things meant to match now do. The rule going forward:
  reach for the nearest step and stop — a layout that seems to need a
  value between two steps almost always wants a different step, and a
  ninth value is how the last twenty-two began.

  **Positions are not spacing** and stay raw: the icon rail's `left`, an
  inset, a fixed offset. Those place one thing on the screen; the scale
  is for holding two things apart.
- **The charm colours are canonical here (Kimia's call 2026-07-21).**
  The six colours in §11a currently live in `src/ui/symbols.js` because
  the glow drop-shadows are built in JavaScript. The tokens file becomes
  their documented home; symbols.js keeps the hex values its JS needs,
  marked "mirror of the tokens file — keep in sync." One source on
  paper, no runtime indirection to explain.
- **Why a separate file, not `:root` buried in the stylesheet.** So the
  palette reads as a palette — a list Kimia can scan and change — rather
  than being scattered inline through hundreds of rules.

**The file is `src/tokens.css`, and colour moved in first (T5.2a,
2026-08-10).** Every colour index.css wore — 122 hand-written hex and
rgba values, 40 distinct — is now a named token, values unchanged, so
nothing on screen moved; the §11b identity above lands next as an edit to that one
list. `src/test/tokens.test.js` fails the suite if a raw colour is
pasted back into index.css, if a rule asks for a token that does not
exist, or if symbols.js drifts from the canonical charm colours.

**Spending it (T5.2b, 2026-08-11) proved the point.** The whole §11b
identity — a new ground, new borders, new panel treatment, the charm
accent — was an edit to that one list plus about a dozen lines of
index.css. Two things the file learned in the process:

- **A name may be defined in index.css, so long as it holds no colour
  of its own.** The accent rule needs a row to hand its own charm down
  to the rules below it, which the six `.charm-1`…`.charm-6` classes do
  by setting `--charm-here` / `--charm-here-faint` to the matching
  tokens. That is plumbing, not palette — the VALUES are still
  tokens.css's, and the raw-colour ban makes it impossible to smuggle a
  colour in this way. tokens.test.js now accepts definitions from
  either file, and strips comments before counting anything: prose
  describing a token was being read as a use of it.
- **Prefer a token that survives the ground moving.** The old borders
  and panel were opaque blue-greys mixed against the old background, so
  changing the background would have meant re-mixing all of them. Their
  §11b replacements are white at low alpha, which sits correctly on any
  ground. When a token can be written as light rather than as a colour,
  write it as light.

**Two boundaries settled while building it (2026-08-10):**

- **Glow strengths, font sizes and spacing are not in the file yet, and
  that is deliberate.** Today's values are leftovers of the
  ugly-on-purpose skeleton — four near-identical glow radii, paddings
  the §13 layout pass will rewrite. They join the file in the slices
  that actually decide them, rather than being named now and renamed
  later. _(Amended 2026-08-12: **font sizes are now never joining.**
  Type was settled as-is that day — §11c — so there is no slice left to
  decide it, and naming the sizes it already has would be filing
  leftovers rather than building a scale. Glow and spacing still
  arrive with T5.2e and T5.2d.)_
- **The tokens file holds the colours the _stylesheet_ wears; artwork
  keeps its own paints.** `friendPalettes.js` (the friends' 24 pastels),
  `textures.jsx` (surface tints fed to SVG filters) and the Abode sky
  palettes are consumed only as JavaScript strings — no CSS rule reads
  them — so they stay beside the drawings they paint, cross-referenced
  in both directions. The one exception on a schedule: the night sky's
  three ground colours become stylesheet colours when §13c mounts it as
  the app background, and move into the tokens file in that slice. The
  charm colours are the reverse case and the reason the mirror rule
  exists: CSS _and_ JS both need them, so they are canonical here and
  duplicated in symbols.js under test.

---

### 11e. The pebbles — Habitat's word-bearing controls **[BUILT — 2026-08-11/12]**

**The word "button" is useless here, and naming this set is the whole
point of this section (Kimia's call 2026-08-12).** Almost everything on
screen is technically a button: the charms, the meters, a drop on the
shelf, a friend's card, the HABITAT wordmark, every icon in the rail.
So "change all the buttons" could mean any of five different things.
**The pebbles** are one of them, and the one that gets changed as a
family.

**The definition.** A pebble is a control that **says what it does, in
words or in numbers**, and does it when pressed. Everything else you can
press is a **drawing** (it shows rather than speaks), a **switch** (it
holds a state rather than performing an act), or **a moment's own
control** (it belongs to a reveal and wears that reveal's colour).

**The shape.** Two, and only two: an **oval** for the ordinary pebble,
and a **circle** for the counter trio. Never a rectangle, never a
square corner. Outlined, transparent, no fill — with one exception, the
to-do tick, which fills with its charm to say done, because that fill is
a mark rather than an edge.

**One size, with one exception (2026-08-14).** The counter trio is one
diameter everywhere it appears — except inside the check-in, where the
rows are deliberately compressed (§12c). At their standard 2rem the
counters were TALLER than the squeezed tile around them and set the
floor on the whole row, so the squeeze did nothing until they came down
too. Same circle, same shape, same family, one size smaller: a
compressed row asks for a compressed pebble. This is the only scoped
size in the family, and it stays that way unless a section here says
otherwise.

**The colour rule** is §11b's accent rule applied to controls: a pebble
sitting on a saved habit tile borrows **that tile's charm**; everywhere
else it is **plain white** (`--button-edge`). Every pebble's outline —
white and all six charms alike — is diluted by the single dial
`--button-edge-strength` (38%), so softening or firming the whole family
is one number in `src/tokens.css`.

**The roster** (2026-08-12 — every pebble in the app):

| Where | Pebbles |
| --- | --- |
| Habit tile, check-in row, archived row | `+1`, `-1`, the to-do tick (the counter trio — one diameter, one shape, three moods) |
| The draft tile | save, cancel |
| Foot of the home screen | export backup, import backup, start a new game, view historical data |
| The new-game pop-up | total refresh, keep habit data, not now, yes, no take me back |
| A held drop, and the abode's waiting-to-decide list | gather, leave it, read now, read later |
| Field notes | ‹ earlier, later › |
| Market | buy |
| Check-in | done, `…` (the fold — 2026-08-14) |
| Reading spread, friend card | close |
| Every secondary page | ← back to the habits |

**Deliberately NOT pebbles**, and why — this half of the list matters as
much as the other, because it is what stops the family swallowing the
app:

- **Drawings you press.** The six charms, the icon-only furniture (edit,
  archive, unarchive, delete forever), the left rail, the three meters, a
  drop on the arrival shelf, a friend's card in the Guest Book, the
  HABITAT wordmark, the tile-shaped "add a habit or task…" invitation.
  They show instead of speaking, and §12a's rule already covers them: an
  icon with a hover label, never a box.
- **Switches.** The graph zooms (day / week / 4 weeks) and party mode
  hold a state; a pebble does a thing and settles. They keep their own
  pressed-state look.
- **The reveal's own control.** "Onward", dismissing a first-occurrence
  reveal or a friend arrival, belongs to the one moment Habitat is
  allowed to shout (§5) and wears the reveal's neon, not the everyday
  chrome's white.
- **The workbench door** ("design assets") is kept fainter than anything
  it stands beside, and leaves when the design pass lands.

**In the code.** `.pebble` is the family — the one selector to reach for
when they all change — and `.pebble-counter` is the circle modifier,
always worn alongside `.pebble`, never instead of it. Both live in
`src/index.css` under a header pointing back here.
**`src/test/pebbles.test.js` keeps this section honest:** it reads every
component as text and fails the suite if a `<button>` appears that is
neither a pebble nor on the not-a-pebble list, so a new control cannot
quietly join the app unclassified. The fix when it fails is a one-line
decision — make it a pebble, or name it in the list with its reason.

---

## 12. The home screen & the daily startup **[BUILT — T4.5; the startup ceremony T5.2e, 2026-08-13]**

_Decided with Kimia 2026-07-20 (twelfth session). Spec §5b carries the
rules; this section carries the feel._

### 12a. Icons over words

Every action on the home screen becomes an **icon with a hover label**:
edit (pencil), archive (box), delete forever (trash), add new habit
(**+**), edit past days (pencil), view historical data (graph). The
label appears on hover and nowhere else.

The rule outgrew the icons on 2026-08-12: **anything that needs
explaining explains itself on hover**, icon or not. The two grey lines
at the foot of the home screen — how old the backup is, and why the
new-game path is dimmed (a title that moved into the popup with its
guard later the same day) — became the titles of the buttons they
described,
and the Abode's quiet/party toggle gained a label for each of its three
parts (§12e). Two implementation notes, both learned the hard way: a
`title` on a **disabled** button never appears, because a disabled
control fires no hover events — put it on a wrapper; and `title` is an
HTML attribute, so an `<svg>` needs a wrapper too.

The reason is the same one behind the six wordless symbols: **the page
should look like a place, not a form**. Words are instructions; icons
are furniture. A screen you visit every morning for five years should
get quieter over time, not keep explaining itself.

Two cautions this creates, both real:

- **The two pencils.** A habit row's pencil edits _that habit_; the
  rail's pencil edits _past days_. Same glyph, two meanings — so they
  are separated by **size and colour** (Kimia's call, 2026-07-20), not
  by position alone: the row pencil is small, inline and in the dim
  text tier; the other is larger and carries the gold that marks a
  page-level action. Since 2026-08-12 they are also in different
  furniture entirely — one on a tile, one in the rail — which does most
  of the work by itself. Watch this one in real use anyway; if size,
  colour and place don't do the job, the rail pencil gains a
  distinguishing mark (a small clock or calendar), not a word.
- **Delete forever.** The only destructive control in Habitat. Its
  hover says "delete forever" in full — never just "delete" — and its
  confirmation stays (spec §5b). Being wordless on the surface is fine;
  being _vague at the moment of pressing_ is not. The trash icon is the
  one icon allowed to look slightly colder than its neighbours.

The three doers (+ · pencil · graph) sat **together at the foot of the
list** until 2026-08-12, when they moved into the left rail (§12d). The
principle survived the move: discreet, evenly weighted, none of them
shouting. "Add new habit" is not a call to action; it is one of eight
equal doors now instead of one of three.

What replaced them at the foot is nothing at all — and where the list
itself is empty, an **invitation tile** (Kimia's call 2026-08-12): a
tile of the same baguette shape reading "add a habit or task…", which
opens the draft form. It is the answer to the same question the icons
answer, in the one place a beginner is actually looking. Neutral with
no lens on; in filter view, one tile per chosen charm, each in that
charm's colour, and clicking one starts the draft already on it — the
colour is not decoration, it is the answer being carried forward. The
old "nothing here yet" is gone: an empty screen should hold a door, not
a status report.

The **foot of the home screen** is now three clean buttons on one
centred line — export · import · start a new game — and no text beside
any of them. The explanation that used to live there (how old the backup
is) became a hover label, which is where every other explanation in
Habitat lives. Nothing was dropped; the line just stopped talking. The
second one, why the new-game button was dimmed, moved further still: the
guard itself moved inside the new-game popup, onto its "keep habit data"
choice (spec §8).

Above that line sits **"view historical data →"**, the twin of the field
notes' "← back to the habits" (Kimia's call 2026-08-12): same wide plain
shape, same place at the foot of the page, pointing back at each other.
Width is not a style here — both are simply direct children of the app's
column, which stretches them. And the three footer buttons now end the
**field notes** too, under the back button: export, import and
start-a-new-game are what you reach for while looking at the record, and
a backup should never need a trip home first.

**Starting over asks in a popup** (2026-08-12), not a browser confirm
box: which kind of fresh start, then "are you sure?". It borrows the
reading spread's card exactly — same dark panel, soft edge, gentle pop —
because it is the same kind of thing: a card that takes the screen,
answers a question and leaves. No alarm colour, no shake, no red; the
words carry the weight. "not now" is quieter than the two real choices,
so the eye lands on them first.

Both of its steps are built to one shape (Kimia's call, the same day):
**a bright, larger question at the top and a dim, smaller explanation
under it** — "which type of restart?" then "are you sure?". The question
is what you answer; the explanation is fine print you read once. Because
the two steps look identical, the second reads as the same card asking
again rather than a new one arriving. Everything on the card is
**centred**, explanation included (Kimia, same day): a card this small
holds a question, not a document, and a left-ragged block inside it read
as a paste-in. The explanations themselves say plainly what will be
wiped and what will remain, in Kimia's words — never a GOES/STAYS
ledger, which read like terms and conditions. Where one of them asks two
things, a **blank line** separates them, so they read as two questions
rather than one long one.

**Reordering is a drag of the whole tile** (T5.1c, 2026-07-23; the grip
alone until 2026-08-11), not a pair of ▲▼ arrows. Press anywhere on a
row — the charm, the name, the meta line, the space between them — and
pull it up or down; the new order persists. The row's tap controls (+1,
−1, the to-do tick, edit, archive) are the exception: a press that lands
on one of them is a tap and never starts a drag, so nothing a finger
does on a button can move a row. That, plus the small travel threshold
(a press that doesn't move reorders nothing), is what keeps taps
unambiguous — T5.1c thought a dedicated handle was needed for it, but
hunting for a six-dot target turned out to be the real friction.
**The six-dot grip is gone (Kimia, 2026-08-11)**: once the whole tile
was the handle it was a cue for something already obvious, and it read
as clutter on the right of every row. The row buttons are now the pencil
and the archive box, nothing else. While a symbol filter is on the list
is only a partial lens, so the whole row **stops dragging** — the tile
itself carries the hover "clear the symbol filter to re-order" (the
filter-lock rule the old arrows had), and no tile carries a hover at any
other time. Desktop-only (T5.1b), so a plain pointer press is the only
input supported — no touch path.

**The lifted tile floats (Kimia, 2026-08-11).** A dragged tile used to
be welded to the cursor, which read as sharp and mechanical. Now it is
**slow and floaty**: the tile eases toward wherever the pointer has got
to rather than arriving there instantly, so it drifts after the hand,
trails a little behind a quick pull, and glides into place whenever the
hand stops. It lifts while it travels — a touch larger, a deeper shadow
under it, its charm edge lit — so it reads as picked up and held above
the list rather than shoved along inside it.

**The drop follows the tile, not the hand**, and it is not over the
moment it happens. Both are Kimia's calls the same day, and both come
from the same principle: once the tile lags behind the pointer, the tile
is what the eye believes, so it is what everything else must agree with.
So the landing slot is the row the TILE has come to rest nearest — its
own empty slot included, which is what lets a small nudge stay put — and
on release the tile **glides** from where it was let go into that slot
rather than snapping there. It keeps its lifted, lit look for a beat
after landing (`DROP_SETTLE_MS`) so the eye can find where it went, then
eases back down to its resting colour rather than switching off.
Reduced-motion keeps the instant follow and the instant landing; the
highlight still holds and still fades, because that is information
rather than movement.

### 12b. The date display

`M O N D A Y   2 0   J U L   2 0 2 6`, large, beneath the meters and
above the charms.

This is the **one uppercase, letterspaced display moment on the home
screen** — and the uppercase is in the words themselves
(`calendarDateLine` spells the weekday and month out in capitals), not
a stylesheet rule. Weight 300, tracked at 0.35em. The spacing is the
point:
it should read as _engraved_, an inscription over the day, closer to a
title card than a clock. It is not information the user needs — they
know what day it is. It is **ceremony**: the day is a thing worth
naming.

Because it is ceremony, it must not be busy. No seconds, no time, no
weather, no counters. It never animates on its own; it simply is.

**The 3am note.** Between midnight and the cutoff, a quiet line sits
beneath it: _"your habits will switch to a new day at 3 a.m."_ — the
dimmest text tier, lowercase, upright and small (§11c: Habitat's quiet
lines are quiet by COLOUR, never by italic). This is the app being
**honest at the one moment it would
otherwise contradict itself**, and it is deliberately phrased as a
statement of fact, not a warning. Nothing is expiring. Nothing is
owed. Outside that window it does not exist.

### 12c. The check-in as a pop-up

Layering the done-yesterday check-in **over** the habit list rather
than replacing it does one job: it tells you, without a word, that
**this is temporary and you are already home**. A full-page takeover
implies you have been sent somewhere. A pop-up with your own habits
softly visible behind it implies you are standing in your own room
answering one question.

The list behind should be **dimmed and inert**, never blurred into
mush — you should be able to recognise it as yours. The pop-up itself
keeps §11b's framed treatment: the faint radial wash, a hairline
border, generous internal space.

This does not soften the rule (spec §4.2): yesterday must still be
answered, and the done button is still the only way out. Quiet
framing, firm mechanic — the same combination as undo.

**Except when you asked for it (Kimia's call 2026-08-14).** A check-in
opened by hand from the rail's pencil is not owed — it is a visit, and
the pop-up's own logic says so: you are standing in your own room, and
you may simply step back into it. A press on the veil around the panel
closes the visit. The morning's owed check-in has no such press to
find: there is no dismiss handler on the veil at all, rather than one
that refuses.

#### The check-in is a glance (Kimia's calls 2026-08-14)

The panel had grown into something you scroll, and a check-in you
scroll is a check-in you put off. Everything below serves one rule:
**the offer to update earlier days, and the way out, are never far from
the question.**

- **Compressed rows.** The same baguettes as the habit list (§11b),
  squeezed: smaller type, almost no vertical padding, a hairline gap
  between them instead of a full one. Only measurements change — the
  charm fill, the edge and every control are the list's own. The
  counter pebbles come down with them; see §11e for why they had to.
- **The charm lens at the top**, centred under the question, the same
  row of charms in the same place as on the home screen. Answering "the
  reading ones" first is one tap away. It is a VIEW, never a filter on
  what counts: what a hidden habit already carries stays carried.
- **A long day folds behind a `…`.** Past a set number of rows
  (`CHECKIN_ROWS_BEFORE_MORE`) the rest are held back; one press shows
  them, another folds them again. Quiet, not instructive — an offer to
  see more, not a demand to.
- **Done lands you at the top of the page** (spec §4.2), because the
  held meter movement (§4) plays the instant the panel closes, and it
  plays in the header bar. A jump, not a glide: a glide would still be
  travelling while the bars moved.

### 12d. The left rail

Eight icons descending the left edge, each revealing its name on hover,
set **away from the habit list** so the list keeps the eye. Two groups,
in this order (Kimia's call 2026-08-12):

- **the three doers** — **+** (add a habit) · **pencil** (edit past
  days) · **graph** (field notes). They were a row at the foot of the
  habit list until 2026-08-12 and moved here whole, order intact.
- **the five places** — **map · abode · community · library · market**.

The rail **persists on every screen but the check-in** (Kimia's call
2026-07-21) — the world pages stay one tap away from anywhere; the
check-in keeps its done button as the only exit. Which is also why the
+ carries us **home** before opening the draft: the form is only ever
drawn in the habit list, so pressing + from the Market has to be a
journey, not a no-op.

They are a **rail, not a navbar**: no background, no dividers, no
active-state highlight competing with the content. Think of marks in
the margin of a page. Faint at rest; each brightens to its own charm
colour on hover (the §11a glow, `14px` → `24px`), which is also how the
name arrives. **One look for all eight** — same glyph size, same stroke
weight, same rest colour, same glow, and no press animation on any of
them; the doers earn their place by joining the rail's language, not by
keeping the one they had at the foot of the list. Their hover colours:
sky for the **+** (the one charm the five places never used), the
pencil's own gold (see the two-pencils note in §12a), teal for the
graph.

The meters at the top remain clickable (Kimia's call), so Map,
Bookcase and Market each have two doors. That redundancy is fine and
deliberate — the meters are _how much_, the rail is _where_. Two
different questions arriving at the same room.

### 12e. Quiet mode / party mode

A toggle on the Abode, an icon on either side. The feel divide:

- **Quiet mode** is the Abode as built — your things, your
  arrangement, still and yours. The default, and the resting state of
  the page.
- **Party mode** is the one place in Habitat where **you are not in
  control of the composition**, and that is the whole pleasure of it.
  Friends pop up among the flora in a random formation you did not
  arrange and cannot fix. Refresh, and they stand somewhere else. It is
  a **visit**, not a room you decorate — you cannot pose your guests.

Your flora and objects are **never disturbed** (spec §5b): the
arrangement you built is the stage, and party mode only adds people to
it.

**Every part of the toggle names itself on hover** (Kimia's call
2026-08-12), like every other control in Habitat: the switch says
"pick your mood", the stone side "quietude", the gathering side "party
mode". Its ACCESSIBLE name stays "party mode" — a switch has to say
what it turns on — so this is the one place title and aria-label
deliberately differ. While no friend exists the whole thing says
**"not yet"** and nothing else: one honest answer beats three labels
for something that cannot be done.

**Friends do not perform here (decided 2026-07-20).** The §8 signature
category animations stay reserved for their three moments — the
arrival reveal, the Guest Book card, and the home-screen cameos
(big-win celebrations, §8). In
party mode friends are simply **present**: standing, gathered, in a
formation you did not choose. The pleasure is _that they came_, not
what they do. A gesture available on demand, fifty times an evening,
stops being a greeting and becomes decor — and the abode is the one
place you could summon them at will, which is exactly why it must not
spend them. Idle presence only; any life they show here should be far
below the signature register.

Greyed out until a friend exists. A dead control is honest here: it
says _this place will have people in it one day_, which is exactly the
promise the literacy stream is making. It should read as **not yet**,
never as **broken** — dimmed, not crossed out, and its hover says so.
_(Built 2026-07-20 in T4.4: the toggle shipped whole — greyed state
and live party mode alike — because T4.4 landed before T4.5.)_

### 12f. The daily startup animation **[BUILT — T5.2e, 2026-08-13]**

The first visit of each Habitat day: a **complete black background**
with a **slither of globe along the bottom edge**, stretching the full
width of the screen, **spinning slowly and glowing** — a satellite
image of a planet turning. The planet need not be detailed. A few
seconds only, then the normal screen **fades in**.

**Colour.** The planet glows in the **shell charm's pink `#E8698C`** —
the third charm, and the one that already reads as _place_. On
**Sundays** it instead rotates randomly between the other five charm
colours (gold, coral, lavender, sky, teal): the field-notes day gets a
different light, and you never quite know which.

**Why this is allowed to interrupt.** §6 says epic moments are ambient
and never seize the screen — and this one seizes the whole screen. The
exemption is that it is not a _reward_: it interrupts nothing, because
nothing is happening yet. It is the app **opening its eyes**, before
the day starts. The rules it must obey to keep that license:

- **Short.** A few seconds. Anything long enough to want to skip is too
  long. If it ever feels like a wait, it has failed.
- **No content.** No text, no numbers, no narration slot, no
  achievement. Nothing to read means nothing to miss.
- **Never blocking.** A tap during it should go straight to the fade —
  the ceremony is offered, never enforced.
- **Same every day.** No escalation, no streak-length variation, no
  milestone versions. The moment its intensity depends on performance
  it becomes a scoreboard, and Habitat does not have those.

It plays every Habitat day whether or not a check-in was owed — its
job is marking the turn of the day, not reacting to behaviour. Order:
check-in pop-up → startup → Sunday field notes. Coming _after_ the
check-in is deliberate: yesterday gets closed, then the new day
begins.

**Desktop/laptop only (Kimia, 2026-07-21).** The animation never plays
on a screen too narrow for Habitat: it is **skipped entirely — not
shrunk**. It needs no check of its own to manage that. The whole app
lives inside `ViewportGate`, which does not mount its children below
`MIN_APP_WIDTH`, so a screen that cannot have Habitat cannot have the
ceremony either. Kimia's real use is laptop-only, and this one asset is
built epic for the screen that will see it rather than stretched
responsive down to a phone.

**What "desktop only" now means in practice (2026-08-13).** The gate
dropped from 1024px to 740px on 2026-08-12, and it became a WIDTH rule
rather than a device rule (§13a). So the honest statement is: the
ceremony plays wherever Habitat plays. A phone still never sees it; a
portrait tablet at 740px+ now would, where the 1024px gate would have
turned it away. That is a consequence of the width rule, accepted here
rather than fought — a separate, higher threshold just for the startup
would reintroduce the device thinking the gate deliberately dropped.
If a tablet opening on the planet ever looks wrong, the fix is one
number, not a new mechanism.

**How long it lasts (T5.2e, 2026-08-13).** Two numbers, both in
`constants.js`: the planet HOLDS the screen for `STARTUP_HOLD_MS`
(3.2s), then FADES over `STARTUP_FADE_MS` (1.5s) and hands the day
over. A tap ends the hold early and goes straight to the fade; the fade
itself is never skipped, because it is the handover rather than a wait
before one. While it holds it deliberately DOES take taps — that is how
you dismiss it — and the instant it starts leaving it stops, so a click
during the fade lands on the app underneath instead of on a ghost.

Soundless, as ever.

---

## 13. Layout & atmosphere — the M5 layout pass **[§13a, §13b, §13c BUILT (T5.2d, 2026-08-12) · §13d BUILT (T5.2e, 2026-08-13)]**

_Kimia's M5 layout spec, merged 2026-07-21. Net-new structural pieces
for this design pass; they sit on top of the home screen §12 already
describes and change nothing about the habit list itself (spec §5b's
"explicitly unchanged")._

### 13a. The top header bar **[BUILT — T5.2d, 2026-08-12]**

The wordmark, the three meters, the date display and the symbol filter
used to stack inside the same 40rem `.app` column. Three of them now sit
in a **dedicated full-width header** (`.app-header`) above that column;
the charm filter stayed behind (see below).

- **Wide viewport:** one row — wordmark hard left, date hard right, the
  meters **filling everything between them**.
- **Narrow viewport:** folds to **two deliberately-arranged rows** —
  the wordmark and the date hold the top row, the meters drop to a
  second line and span the bar's full width there — never a
  document-order wrap that clumps.
- **How:** CSS Grid with named `grid-template-areas` — one area map for
  the wide breakpoint, a second for the narrow one, swapped by a single
  media query. Flex-wrap was considered and **rejected**: it wraps in
  strict source order with no control over grouping, which is exactly
  the "clumped / cut up" look we're avoiding.
- The `.app` **40rem max-width stays untouched below the header** — the
  habit list and cards keep their current width.

The wordmark keeps its standing job as the **home link back to the
habit list** (spec §5b).

**The bar is the same on every page (Kimia's call 2026-08-12).** Home,
the five world pages, the field notes: the same three things in the
same three places, so nothing shifts underfoot as you move around. The
first build made the world pages carry a shorter bar (wordmark +
meters, no date); she asked for one bar everywhere instead. Only the
check-in opts out, keeping its own plain wordmark and no bar at all —
its done button stays the only way out.

**The charm filter is NOT in the bar (same call).** It is the habit
list's own lens, not standing furniture, so it sits **centred directly
beneath the bar** on the pages that have something to filter — which is
exactly where the field notes had always kept theirs. One arrangement,
now used in both places.

**The meters fill the gap; they are not centred on the page (Kimia's
call 2026-08-12).** The two word-shaped things take exactly the width
their letters need, and the meters take the whole remainder — no
ceiling, so on a wide screen they simply grow. The bar is snug at every
width, and however many storeys it ends up being there is no slack in
any of them: on the folded form the meters span the full width of the
bar rather than sitting centred with air either side.

This was got wrong once, worth recording so it is not re-proposed.
Centring the meters on the PAGE (pinning the side columns to an equal
floor) looks tidy in the abstract but leaves a pool of empty space
beside the wordmark, because the date is more than twice its width. It
also pushes the fold out past most laptop windows, since the pinning
needs 1381px to hold. Kimia's breathing is the meters' breathing — the
gap growing and shrinking around them is the opposite of the ask.

**Two things are kept to one line, and between them they set the fold.**
The meters' labels (`white-space: nowrap` on `.meter-name`) — "wallet
balance" used to spill onto a second line as the window narrowed, and
Kimia asked for the shrink to be capped there. And the date itself,
which otherwise breaks after "WEDNESDAY" and makes the whole bar two
storeys tall. Neither cap is a pixel number to keep in step with the
words: the words set their own floors, and those floors are what decide
where the bar can no longer hold three abreast.

**The breakpoint is 74rem, and it is measured.** Three abreast need
1154px at their tightest — wordmark 174 + meters 477 (their labels, one
line each) + date 399, plus gaps and padding — so the fold sits just
above that at 1184px, rather than at the point where the row already
looks jammed. Note that "narrow" here **never means a phone**:
`ViewportGate` replaces the whole app below `MIN_APP_WIDTH` — 740px
since 2026-08-12 (T5.1b) — so this query only ever governs the
740px–74rem window. A breakpoint under that would be dead CSS — worth
remembering for §13c and anything else
this pass adds.

### 13b. Page titles, promoted out of their boxes **[BUILT — T5.2d, 2026-08-12]**

Every secondary page (Map, Bookcase, Abode, Market, Guest Book) used to
render its title _inside_ its bordered content box, so the title read
as furniture squeezed into the frame. Each title now stands **above the
box**, in the quiet, letterspaced, centred treatment the date display
already uses at home (§11c's display register, §12b's ceremony) — the
same 1.3rem / 0.35em / weight-300 / `--text-title` register, so the two
speak in one voice.

One shared class (`.page-title`), reused across all of them rather than
each page hand-rolling its own heading — so they read as one system and
a copy change touches one place. The page names themselves stay pinned
by spec §5b (map of N-Z-D, readers library, local market, your abode,
local community).

**How it is built:** the page's own class (`.stub-page`, `.map-page`,
`.bookcase-page`) is now just the outer column; the border, radius and
padding it used to carry moved onto an inner `.page-box` wrapper, and
the title is the column's first child, outside that frame. The
`<section>` still contains both, so anything scoped to the page — tests
included — keeps working. Padding stays per-page (2rem 1rem for the
stub pages, 1rem for Map and Bookcase) as an override on `.page-box`.

### 13c. The night-sky background **[BUILT — T5.2d, 2026-08-12]**

`body` used to be a flat near-black. There is now a **full-bleed sky
layer behind all content, on every screen the app renders on** (unlike
the startup animation §12f, which is wide-screen-only).

- Mostly still, with an **occasional, unsynchronised twinkle** — never a
  visible pulse rippling across the field.
- **How:** small star elements, each with its own randomised long
  `animation-duration` / `animation-delay`, so individually each blinks
  rarely and the aggregate reads as sparse and organic rather than a
  pattern. Pure CSS — no JS, no canvas. As built: 265 stars in three
  sizes, of which the 7 largest twinkle, on an 8–14s cycle each with a
  negative delay so they start out of step. `prefers-reduced-motion`
  stops the twinkle entirely.
- It is **atmosphere, never the POP** (spec §7): faint and low-contrast,
  it must never compete with a drop, a reveal, or the meters.
- **Dense reading gets an opaque panel over it** (Kimia's call
  2026-08-12). `--surface` is a white wash, so the stars come through it
  — fine behind a habit row, not fine behind the field notes' week grid,
  where small type sat on a starfield. The field notes' two panels use
  `--surface-solid` instead, which is the ground colour itself, so an
  opaque panel reads as a quiet hole cut in the sky rather than as a
  second, competing surface. Any future panel carrying dense reading
  should do the same.

**It was already built — this slice only mounted it.** `NightSky` has
lived in `src/ui/sky.jsx` since 2026-07-24 (design-bible §11a), shown on
the workbench for the eyeball pass. T5.2d mounts it **once**, in
`main.jsx`, inside the width gate, on a full-bleed `.sky-layer` at
`z-index: -2` — so it does not re-roll its star field as pages change,
and leaves the blocked screen its own plain ground. The §11b ambient
wash sits between sky and content at `-1`, which is what "the wash is
what the stars sit in" always meant.

**The sky scrolls with the page (Kimia's call 2026-08-12).** It was
first mounted fixed to the viewport, and that was wrong in a way only
motion shows: the content slid over a sky that never moved, so the stars
read as printed on the glass rather than as a place the app sits in. The
layer is therefore **absolute and as tall as the whole document** —
`#root` carries `position: relative` and `min-height: 100vh` to give it
that height and to keep the field full-screen on short pages — and the
stars, positioned in percentages, spread across the entire scroll rather
than one screen of it.

**Its three ground colours moved into tokens.css with it** (per §11d's
schedule: artwork paints stay beside their drawings, but a colour the
stylesheet wears becomes a token the moment it is worn) — as
`--sky-night-top` / `-mid` / `-bottom`.

**And they were re-tuned on the way, deliberately.** The workbench
stand-ins (`#10151f → #05070a`) were painted in July, before §11b
settled the ground at `#080910` on 2026-08-11. Mounting them unchanged
would have repainted the whole app — bluer and lighter up top, darker at
the foot — which is a change to the settled identity, not the addition
of atmosphere §13c asks for. So the gradient now **sinks to `--bg` at
the bottom** and lifts only faintly above it. If the bolder July sky is
wanted after all, it is a three-value edit in tokens.css and nothing
else — which is the tokens file doing its job.

### 13d. The startup "rolling planet" **[BUILT — T5.2e, 2026-08-13]**

The full "rolling planet" startup animation was built in this pass (its
slot was scaffolded in T4.5 as a plain fade). The colour, timing, the
four standing rules and what "desktop only" now means all live in §12f;
this note records how the planet is actually drawn, because none of
that is a design decision anyone would guess from the picture.

It is `src/ui/planet.jsx`, plain CSS and the shared texture library —
no images. Four ideas hold it up:

- **The sphere is enormous.** A circle three times wider than the
  screen, sunk almost entirely below the bottom edge so only its crown
  shows. Being that big is what makes the curve gentle enough to read
  as a planet rather than a bubble.
- **The surface is banded by DISTANCE, not laid on flat.** Ground
  receding toward a horizon gets smaller AND slower, so there are three
  depth bands between the limb and the viewer — cratered stone at the
  limb and up close, weathered rock between (design-bible §8) — each
  drifting at its own pace. The near ground runs 2.6× the horizon's
  speed, and that disagreement is what the eye reads as a ball turning
  rather than a belt scrolling. Every band is drawn twice and slid by
  exactly one copy, so each loop is seamless.
- **The rock is drained of its own colour before it blends.** The
  library lights its rock in a pale COOL grey, which bleaches a charm
  colour it is laid over. Greyscaled first, it can only carve light and
  shade. Anything else that puts library rock over a charm colour will
  hit this.
- **The sky is the app's own.** Four dark colours (indigo, teal, plum,
  umber) wash faintly across a near-black ground, and the star layer is
  `NightSky` unchanged — same asset, same seed, same rare twinkle. The
  whole layer creeps toward the top right and back, one crossing every
  90 seconds, so the scene is never quite still. The app then fades in
  over that same sky, which is what makes the handover invisible.

Every number worth an opinion is a named dial in `PLANET_TOKENS` at the
top of the file. Sizes are in `cqw` — percentages of the container's own
WIDTH — so the composition is identical in a small workbench box and on
a full screen, and never reshapes when a window gets taller.

Kimia art-directed it live over 2026-08-13, one visible change at a
time; the workbench swatch on the design page is where she looked, and
it stays there until the workbench itself goes.
