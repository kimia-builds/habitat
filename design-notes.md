# design-notes.md — HABITAT (UX & feel)

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

---

## 0. How to use this file

This is the **feel layer** on top of spec.md (what the app is) and
plan.md (the order we build it). Read it alongside them before any
design-adjacent task.

**Two hard rules** (also in CLAUDE.md — they cut across every task):

1. **Soundless.** No audio, anywhere, ever. All feedback is visual.
2. **Claude Code never writes the story.** All narration, dialogue,
   friend introductions, and captions are **human-written by Kimia**.
   Claude Code scaffolds *empty, keyed content slots* and ships them
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

## 2. Completion & the undo affordance  **[feel rule · applies to T3.2b, T1.3]**

The reversal logic already exists: undoing a completion reverses the
expedition meter and takes its drops back with it (spec decisions
2026-07-15 / 2026-07-19). **This note is about how undo _feels_.**

**Decision (2026-07-19) — persistent but quiet.** The undo control
stays available for as long as the spec's rules allow (same-day for
one-time to-dos; the T3.2b counter's undo alongside its +1) — quiet by
*design*, not by disappearing. It is small, low-key, visual-only:
never an alarm colour, never a shake. "Gentle correction," not
"error." (This supersedes the v0.2 draft's fading-undo idea, which
conflicted with the spec's same-day undo rules.)

Edge cases keep the same calm treatment: undo after a drop is held;
undo that un-crosses a meter segment or era boundary. Those already
need tests (T3.2b) — the visuals stay gentle through all of them.

---

## 3. Live vs. retroactive completions  **[TO-BUILD · T3.2b / check-in]**

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

## 4. The meters — growth you can see  **[enhancement to built T2.2]**

The meter UI is **already built** (T2.2) and stays as it is: the
expedition meter is a **rolling bar** (one ~100-step segment ≈ a month
at current pace, rolls over to empty, running step total beside it);
literacy shows progress to the next friendship milestone; fungus is a
plain wallet balance.

**Decision (2026-07-19) — momentary glow + thicken on movement.** Each
forward movement plays a **momentary animation**: the bar glows and
grows thicker to show the movement, then **immediately fades back to
its normal view**. A **segment roll-over** is the celebratory "gains"
beat — a brighter pulse of the same treatment — and it too settles
straight back. The resting state of the bar never changes; the
persistent running total remains the accumulating proof of work. This
**layers onto** the built T2.2 bar — no rebuild.

---

## 5. Drops — star-shimmer & firework  **[CHANGE to built T3.2, decided]**

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
*intrinsic* value offer the same held-arrival choice: flora —
**gather / leave it** (T3.3); reading material — **read now / read
later**, where read now opens the publication's double-page spread
and read later simply lets the arrival go (the piece is in the
Bookcase either way, re-readable anytime, tracked nowhere). Fungi
deliberately offer no choice: currency has only *exchange* value —
it banks itself.

---

## 6. Epic unlocks & reveals  **[TO-BUILD · M4]**

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

## 7. Story, narration & speech  **[content human-written; slots: T3.4, M4]**

Story and narration are **written by Kimia, never generated**. Claude
Code builds the *slots and plumbing* only.

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
- **Names stay visible (decision 2026-07-19).** Flora, objects,
  reading material and friends **keep their written names** — in drop
  arrivals (the built click-to-hold shows the name) and on the record
  pages. Records (Guest Book, Map, Bookcase) stay **visual-first**:
  art, names and dates — but no stored prose or captions; the
  narration was the story, seen once. (This resolves the v0.2 draft's
  "no written names" idea, which conflicted with the built T3.2
  naming and plan T6.1.)
- **Speech bubbles** simulate speech for friends **high enough on the
  literacy ladder to have language** (see §8); text is human-written
  and momentary.

---

## 8. The beings — form, gesture & greeting  **[TO-BUILD · M4.4, M5.3]**

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
- **When friends react — arrival + rare cameos.** Mainly at first
  meeting; afterward only rare, surprising cameos on the home screen.
  **Not** on every completion — keeps them special, avoids the
  front-loaded feel.
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
   no stored prose (§7).
4. **Undo** → persistent but quiet — available as long as the spec's
   rules allow, styled gently (§2).
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

---

## 11. Visual identity reference  **[TO-BUILD · T5.1 symbols, T5.2 identity]**

_From Kimia's charm reference (2026-07-19). This section is the
blueprint for T5.1 and T5.2 — everything needed is recorded here; the
original file is personal and stays out of the repo._

### 11a. The six charms (T5.1 — the habit tags)

The six habit symbols are **line-drawn SVG charms**, each with its own
colour. The symbol is still the tag — **no words, ever** — and each
charm glows in its colour (`drop-shadow(0 0 14px colour)`, brightening
to `24px` on hover). Stroke style: `fill="none"`,
`stroke="currentColor"`, `stroke-width="1.4"`, round caps and joins,
on a `24×24` viewBox. Mapping to the existing symbol slots 1–6:

| # | charm | colour | hex | faint (borders/dividers) |
|---|-------|--------|-----|--------------------------|
| 1 | crown | gold | `#F0BB3B` | `rgba(240,187,59,0.18)` |
| 2 | cherries | coral | `#F5805A` | `rgba(245,128,90,0.18)` |
| 3 | shell | pink | `#E8698C` | `rgba(232,105,140,0.18)` |
| 4 | anchor | lavender | `#A98EE0` | `rgba(169,142,224,0.18)` |
| 5 | shield | sky | `#5AB6F3` | `rgba(90,182,243,0.18)` |
| 6 | key | teal | `#4FBFA0` | `rgba(79,191,160,0.18)` |

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

