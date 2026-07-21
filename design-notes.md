# design-notes.md — HABITAT (UX & feel)

_This file is the current feel layer — read the sections your task
touches, alongside spec.md, before any design-adjacent work. Its
version-by-version changelog lives in **history.md**._

---

## 0. How to use this file

This is the **feel layer** on top of spec.md (what the app is) and
plan.md (the order we build it). Read it alongside them before any
design-adjacent task.

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

## 3. Live vs. retroactive completions **[TO-BUILD · T3.2b / check-in]**

Keep the satisfaction of checking off retroactively, but make
**same-day taps more satisfying**.

**Decision — tonal palette shift, same shape.** Live and retro play
the **same animation shape** in different light: **live = full neon
POP** (the peak moment); **retro = a cooler, dimmer "past" tone** (a
memory being logged). Consistent with the built check-in, where retro
marks earn drops but their **arrivals wait for the done button** (spec
T3.2) — the past-tone treatment rides on top of that.

Correctness reminder (spec §4.2): retro marks attribute to the day
they were _done_. Tone is cosmetic; the date logic stays strict.

---

## 4. The meters — growth you can see **[enhancement to built T2.2; amended 2026-07-21]**

The meter UI is **already built** (T2.2). Since T4.5 (Kimia's call
2026-07-21) **all three are bars**: the expedition meter is the
**rolling bar** as ever (one ~100-step segment ≈ a month at current
pace, rolls over to empty — labelled simply **steps taken**); literacy
fills toward the next friendship level and refreshes at each one
(**literacy level**); the wallet is a bar too now, clamped 0–40 fungi
(**wallet balance**). The exact numbers moved behind each meter's
**hover**: steps shows the lifetime total, literacy a 0–100 scale (ten
per level), the wallet the true balance — **a plain negative number
while debt is being settled**. Kimia weighed the punishment-feel worry
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

---

## 5. Drops — star-shimmer & firework **[CHANGE to built T3.2, decided]**

Drop arrival as built (T3.2): a regular drop shows a **quiet pastel
note** beside the tapped habit ("you came across …") plus the **SVG
drop object at the top of the page**, lingering a few seconds before
fading (click to hold; the drop's name shows). The **five
first-occurrence reveals** (first flora / magazine / novel /
dictionary / fungi) are **full-screen neon POP**.

**Decision (2026-07-19) — the middle path.** Regular drops gain a
**small, brief star-shimmer** on arrival (a light touch over the
quiet pastel, not a takeover). The **full firework** — a burst of
confetti-like stars around the drop that slowly fade — is **reserved
for first-occurrence reveals and friend arrivals**. This honours both
the quiet, patient pacing and "drops should feel special."

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
should feel strange, not familiar-things-in-costume.

- **Form & gesture — semi-abstract.** Suggested anatomy;
  congratulation gestures **read as** a wave / jump / dance but
  stylised and strange, never cute. Emotion through motion and light
  within an abstract body.
- **One signature animation per category (10).** Each of the 10 friend
  categories (Drifters … Poets) has one signature congratulation
  animation; individuals within a category reuse it. Bounds the art
  scope.
- **Where the signature animation is allowed to play (decided
  2026-07-20).** Exactly three moments, and nowhere else:
  1. **The arrival reveal** — the friend-drop moment, with its full
     firework (§5). The first time you meet them.
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
   drops; full firework reserved for firsts and friends (§5).
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
   lowercase body, fonts bundled with the app (§11c).

## 10a. Decisions resolved (2026-07-20, twelfth session, with Kimia)

9. **The home screen goes icon-only** → every action an icon with a
   hover label; the two pencils told apart by size and colour;
   "filter view" as the filter's hover (§12a).
10. **The date display** → real calendar date, large and letterspaced,
    with a quiet 3am note only in the window where it disagrees with
    the Habitat day (§12b).
11. **The check-in becomes a pop-up** over a dimmed habit list — quiet
    framing, unchanged mechanic (§12c).
12. **The left rail** → five icons, map · abode · community · library ·
    market; meters stay clickable alongside it (§12d).
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

### 11b. Palette & surfaces (T5.2)

- **Background:** `#080910` (deepens the current near-black; still
  dark-only per spec §7).
- **The six charm colours** double as the app's accent palette;
  their `0.18`-alpha faint variants are the border/divider tint.
- **Dim text tiers** (on the dark ground): primary body
  `rgba(255,255,255,0.58)`, quiet secondary `rgba(255,255,255,0.38)`,
  hairline borders `rgba(255,255,255,0.10)`.
- Soft ambient depth: a faint radial `rgba(255,255,255,0.025)` wash
  behind framed content; organic blob-radius borders welcome on
  feature frames.
- Neon POP moments keep their own brighter voice (spec §7) — the
  charm palette is the everyday register, not the exclamation mark.

### 11c. Typography (T5.2)

Two families, **bundled with the app** (no external font loading —
self-contained, works offline):

- **Cormorant Garamond** (serif) — display only: weights 600/700 +
  italic 400.
- **DM Sans** (sans) — everything else: weights 300/400/500 +
  italic 300.

Case & spacing convention:

- **Display names/titles:** Cormorant Garamond 700, UPPERCASE,
  wide letterspacing (~4px at 21px size), in the accent colour.
- **Section labels:** DM Sans 500, UPPERCASE, very wide letterspacing
  (~6px at 11px size), accent colour at ~0.85 opacity, thin
  faint-colour rules above and below.
- **Body text:** DM Sans 300/400, lowercase, generous line-height
  (~2), dim white.
- **Quiet secondary lines:** DM Sans 300 italic, lowercase, the
  dimmest tier.
- Habitat's existing all-lowercase voice (habit rows, buttons,
  captions) already matches — lowercase stays the default; uppercase
  is reserved for display and section labels.

---

## 12. The home screen & the daily startup **[TO-BUILD · T4.5, T5.2]**

_Decided with Kimia 2026-07-20 (twelfth session). Spec §5b carries the
rules; this section carries the feel._

### 12a. Icons over words

Every action on the home screen becomes an **icon with a hover label**:
edit (pencil), archive (box), delete forever (trash), add new habit
(**+**), edit past days (pencil), view historical data (graph). The
label appears on hover and nowhere else.

The reason is the same one behind the six wordless symbols: **the page
should look like a place, not a form**. Words are instructions; icons
are furniture. A screen you visit every morning for five years should
get quieter over time, not keep explaining itself.

Two cautions this creates, both real:

- **The two pencils.** A habit row's pencil edits _that habit_; the
  pencil at the foot of the list edits _past days_. Same glyph, two
  meanings — so they are separated by **size and colour** (Kimia's
  call, 2026-07-20), not by position alone: the row pencil is small,
  inline and in the dim text tier; the foot pencil is larger, sits in
  the three-button group, and carries an accent colour that marks it as
  a page-level action. Watch this one in real use — if size and colour
  don't do the job, the foot pencil gains a distinguishing mark (a
  small clock or calendar), not a word.
- **Delete forever.** The only destructive control in Habitat. Its
  hover says "delete forever" in full — never just "delete" — and its
  confirmation stays (spec §5b). Being wordless on the surface is fine;
  being _vague at the moment of pressing_ is not. The trash icon is the
  one icon allowed to look slightly colder than its neighbours.

The three foot-of-list buttons sit **together, below the habits and
above the archived list** — discreet, evenly weighted, none of them
shouting. "Add new habit" is not a call to action here; it's one of
three equal doors.

### 12b. The date display

`M O N D A Y   2 0   J U L   2 0 2 6`, large, beneath the meters and
above the charms.

This is the **one uppercase, letterspaced display moment on the home
screen** — §11c's display register (Cormorant Garamond 700, uppercase,
wide tracking) used where it earns its keep. The spacing is the point:
it should read as _engraved_, an inscription over the day, closer to a
title card than a clock. It is not information the user needs — they
know what day it is. It is **ceremony**: the day is a thing worth
naming.

Because it is ceremony, it must not be busy. No seconds, no time, no
weather, no counters. It never animates on its own; it simply is.

**The 3am note.** Between midnight and the cutoff, a quiet line sits
beneath it: _"your habits will switch to a new day at 3 a.m."_ — the
dimmest text tier, lowercase, DM Sans 300 italic (§11c's quiet
secondary). This is the app being **honest at the one moment it would
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

### 12d. The left rail

Five icons descending the left edge — **map · abode · community ·
library · market** — each revealing its name on hover, set **away from
the habit list** so the list keeps the eye. The rail **persists on
every screen but the check-in** (Kimia's call 2026-07-21) — the world
pages stay one tap away from anywhere; the check-in keeps its done
button as the only exit.

They are a **rail, not a navbar**: no background, no dividers, no
active-state highlight competing with the content. Think of marks in
the margin of a page. Faint at rest; each brightens to its own charm
colour on hover (the §11a glow, `14px` → `24px`), which is also how the
name arrives.

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

### 12f. The daily startup animation

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

Soundless, as ever.
