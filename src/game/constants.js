// All tunable game numbers live here (CLAUDE.md rule: no magic numbers
// in logic). Pacing maths for meters/drops arrives in M2/M3 — for now
// this holds the fixed shape of the habit model.

// Habit tags are exactly 6 abstract symbols, stored only as a number
// 1..6. No words, no labels, anywhere (spec §4.1). What each symbol
// looks like is decided in T5.1; what it MEANS lives only in Kimia's head.
export const SYMBOL_COUNT = 6

// Difficulty determines how far a completion advances the expedition
// meter (exact amounts arrive in T2.1).
export const DIFFICULTIES = ['easy', 'medium', 'difficult']

// The six schedule shapes from spec §4.1:
//   daily     — every day
//   weekdays  — specific days of the week, e.g. Mon/Wed/Fri
//   nPerWeek  — any N days each week, e.g. 3× per week
//   nPerDay   — N times each day, e.g. drink water 3× a day; each of the
//               N completions counts on its own, and the day is fulfilled
//               at N (fewer is neutral data, never punished)
//   whenever  — unscheduled; done when done
//   oneTime   — a to-do, not a repeating habit (added 2026-07-13): done
//               once, then auto-archived. Undo-able only on the day it
//               was checked off; no streaks; listed under "tasks
//               completed" in the weekly view (T2.3).
export const SCHEDULE_TYPES = [
  'daily',
  'weekdays',
  'nPerWeek',
  'nPerDay',
  'whenever',
  'oneTime',
]

// The Habitat day starts at 3am, not midnight, so a habit finished at
// 1am counts for the evening before (spec §4.2). Configurable in
// Settings (stored in storage's settings). Whole hours only, 0–23;
// 0 means plain midnight-to-midnight days.
export const DEFAULT_DAY_CUTOFF_HOUR = 3

// How often an OPEN page re-checks the clock, so a tab left open
// overnight notices the new Habitat day by itself — no refresh needed
// (Kimia's requirement, 2026-07-15). Once a minute is far more than
// enough for a boundary that moves once a day, and costs nothing.
// (The page also re-checks immediately whenever the tab comes back
// into view, since browsers throttle timers in background tabs.)
export const CLOCK_CHECK_MS = 60 * 1000

// Weekday numbers use the ISO convention: 1 = Monday … 7 = Sunday.
// (Chosen over JavaScript's own 0=Sunday counting because ISO weeks are
// what the schedule engine in T1.2 will reason about.)
export const WEEKDAY_MIN = 1
export const WEEKDAY_MAX = 7

// ───────────────────────── T2.1: the three meters ─────────────────────────

// EXPEDITION METER — fully predictable (spec §5 Stream 1).
//
// Every completion advances it by exactly this many steps, no matter
// the habit's difficulty (Kimia's decision 2026-07-15: 1:1:1 — easy,
// medium and difficult all count the same here; the difficulty field
// stays on habits for later use, e.g. drop odds in M3). Extras beyond
// an N-per-day target count too: every tap is one step.
export const EXPEDITION_STEPS_PER_COMPLETION = 1

// 5-year pacing maths (spec §5: the earn curve is designed for years):
//
//   Kimia's real pace is ~3.5 taps/day (her estimate, 2026-07-15)
//   3.5 taps/day × 365 days ≈ 1,280 steps a year
//   1,280 × 5 years          ≈ 6,400 steps in 5 years
//
// So the Map (T4.1) should spread its regions across roughly 6,400
// steps for the planet to take ~5 years to know. RECALIBRATION
// (Kimia's decision 2026-07-15): revisit TAPS_PER_DAY_ESTIMATE every
// ~6 months against real completion history (plan T6.2). Safe to
// retune: the meter is always computed fresh from history, so changing
// a constant can never corrupt what's already been earned.
export const TAPS_PER_DAY_ESTIMATE = 3.5
export const EXPEDITION_FIVE_YEAR_STEPS = 6400

// The expedition meter's ROLLING BAR (T2.2, Kimia's decision
// 2026-07-16): a full 5-year bar would move ~0.016% per tap —
// invisible. Instead the bar fills over a small segment, rolls over,
// and starts again, with the running total shown beside it.
//
//   100 steps ÷ 3.5 taps/day ≈ 29 days — the bar refills about
//   monthly, so every single tap visibly nudges it (1% each).
//   6,400 five-year steps ÷ 100 = 64 segments, a number the Map
//   (T4.1) can later line its regions up with.
export const EXPEDITION_SEGMENT_STEPS = 100

// LITERACY METER — fed by reading-material drops (spec §5 Stream 2).
//
// Points per piece, by rarity: dictionaries are rare treasures,
// magazines everyday reading. PROVISIONAL values — the real pacing
// depends on drop rates, which are designed (with a 5-year simulation)
// in T3.1; retune these there. The shape is what matters now.
export const READING_TYPES = ['magazine', 'novel', 'dictionary']
export const LITERACY_POINTS = {
  magazine: 1,
  novel: 4,
  dictionary: 12,
}

// The 10 friendship milestones — one per friend category, lowest
// literacy first (Drifters … Poets, spec §5). Reaching a threshold
// opens that door; the friend then arrives later as a drop (T4.4).
// PROVISIONAL thresholds, sketched for ~5 years assuming roughly a
// magazine a week, a novel a month and a few dictionaries a year
// (≈ 150 points/year ≈ 730 over 5 years — so Poets land near year 5).
// T3.1's simulation is the referee; retune there. Gaps widen as they
// climb because later friendships should be the long, patient ones.
export const LITERACY_MILESTONES = [
  10, // Drifters
  30, // Nesters
  65, // Mimics
  115, // Signers
  180, // Sprouts
  260, // Chatters
  355, // Neighbours
  465, // Storytellers
  590, // Scholars
  730, // Poets
]

// ──────────────── T2.4: habit line graphs (field notes) ────────────────

// Each graph's zoom levels unlock purely by the habit's AGE in days —
// never by completions (Kimia's decision 2026-07-16): a 12-week-old
// habit with zero marks still graphs a flat zero line. Age counts
// inclusively — the day a habit is created is day 1 — so day-by-day
// unlocks on the habit's 3rd day on the list, week-by-week after 3
// full weeks, 4-weeks-at-a-time after 12. The idea: a zoom level only
// appears once there's enough life to fill it (3 points minimum).
export const GRAPH_UNLOCK_AGE_DAYS = {
  day: 3, // 3 days   → 3 daily points
  week: 21, // 3 weeks  → 3 weekly points
  fourWeek: 84, // 12 weeks → 3 four-week points
}

// FUNGUS METER — a wallet, not a progress bar (spec §5 Stream 3).
// Fungi are whole mushrooms: every credit, price and refund is a
// positive whole number, and the balance can never go below zero.
// Drop rates live in the T3.1 section below; object prices arrive in
// M4/M6.

// ───────────────────────── T3.1: the drops engine ─────────────────────────

// FLORA (Stream 1) — steady finds tied to expedition progress.
//
// Kimia's decision 2026-07-19: every consecutive window of this many
// expedition steps is guaranteed to contain exactly ONE flora find,
// at a random step inside the window. Steady like the plan asks — a
// drought is impossible (the longest possible wait is just under two
// windows) — yet each find still lands as a small surprise.
//
//   25 steps ÷ 3.5 taps/day ≈ a find a week
//   6,400 five-year steps ÷ 25 ≈ 256 flora in 5 years
export const FLORA_WINDOW_STEPS = 25

// READING MATERIAL (Stream 2) — rarer and surprising: a plain chance
// per tap, nothing guaranteed. Targets follow the sketch in the
// literacy notes above (a magazine about weekly, a novel about
// monthly, a few dictionaries a year), sized so the last friendship
// door (Poets, 730 points) opens just inside 5 years:
//
//   3.5 taps/day × 365 ≈ 1,278 taps/year
//   magazine   0.045/tap → ~57/yr × 1 pt  ≈ 57 pts
//   novel      0.011/tap → ~14/yr × 4 pts ≈ 56 pts
//   dictionary 0.0028/tap → ~3.6/yr × 12 pts ≈ 43 pts
//   total ≈ 157 pts/year → ≈ 785 pts over 5 years (≥ 730 ✓)
//
// The referee for these numbers is the 5-year simulation test in
// drops.test.js; retune here, never in logic.
export const READING_DROP_CHANCES = {
  magazine: 0.045,
  novel: 0.011,
  dictionary: 0.0028,
}

// FUNGI (Stream 3) — occasional currency. A tap has this chance of
// dropping a small CLUSTER of mushrooms (sizes weighted below,
// average 1.5), giving ~0.15 fungi per tap:
//
//   28-lived-day rotation × 3.5 taps/day ≈ 98 taps → ~15 fungi/rotation
//
// Kimia's decision 2026-07-19: income should afford about one
// mid-priced object per rotation — so when M6 prices the Market, a
// mid-priced object should cost ≈ 10–12 fungi.
export const FUNGUS_DROP_CHANCE = 0.1
export const FUNGUS_CLUSTER_WEIGHTS = [
  { amount: 1, weight: 6 },
  { amount: 2, weight: 3 },
  { amount: 3, weight: 1 },
]

// ───────────────────────── T4.1: the Map ─────────────────────────

// The planet has 16 equal regions (Kimia's decision 2026-07-19), each
// spanning an equal slice of the 5-year expedition:
//
//   6,400 five-year steps ÷ 16 regions = 400 steps per region
//   400 steps ÷ 3.5 taps/day ≈ 4 months — a new region roughly three
//   times a year, steady for 5 years (flat pacing, spec §5: no
//   front-loading, no droughts).
//   400 steps = 4 bar-segments of 100, so regions line up exactly
//   with the rolling bar the meter already shows.
//
// Steps beyond the 16th region stay in the 16th — the planet's ~5-year
// practical sizing (spec §5). The T6.2 recalibration is where the
// numbers get revisited when real pace drifts from the estimate.
export const MAP_REGION_COUNT = 16
export const MAP_REGION_STEPS = EXPEDITION_FIVE_YEAR_STEPS / MAP_REGION_COUNT

// Which flora species are LANDMARKS — the large tree-like finds that
// appear permanently on the Map in the region where they dropped
// (spec §5 Stream 1, decision 2026-07-19). Flora have no species at
// all until the T6.1 content pools name them, so this set ships empty
// and the Map shows no landmark markers yet — the mechanics beneath
// (game/map.js) are built and tested, waiting for T6.1 to fill it.
export const LANDMARK_FLORA = new Set([])

// ───────────────────────── T3.2: drop arrival ─────────────────────────

// How long an arriving drop sits at the top of the page before fading
// away (Kimia's decision 2026-07-19: the object lingers a few seconds,
// clickable; clicking holds it). First-occurrence reveals never fade —
// they wait to be dismissed.
export const ARRIVAL_LINGER_MS = 6000

// DIFFICULTY nudges the odds of the CHANCE-BASED drops — reading and
// fungi (Kimia's decision 2026-07-19 — this is the future use that
// difficulty was kept for on 2026-07-15). Flora finds are
// window-guaranteed, so
// difficulty doesn't apply there. The nudge is deliberately modest:
// difficulty should flavour luck, never become a strategy.
export const DIFFICULTY_DROP_MULTIPLIER = {
  easy: 0.9,
  medium: 1.0,
  difficult: 1.2,
}

// ───────────────────────── T4.3b: the Market ─────────────────────────

// The stall rotates on LIVED DAYS — days with at least one habit
// marked, including retroactive check-in/backfill marks (spec §4.2's
// definition) — never on calendar days. Counted straight from
// completion history, so gap days don't advance the clock and undo
// quietly turns it back. 28 lived days per rotation (spec §5 Stream 3:
// 4 weeks of showing up) ≈ 112 calendar days at Kimia's daily pace —
// the stall feels unhurried, like everything else here.
export const MARKET_ROTATION_LIVED_DAYS = 28

// The stall's size and the pool behind it (both Kimia's calls
// 2026-07-20). Every discovered Map region adds its curiosities to the
// pool (spec §5 Stream 3: the one deliberate link between streams), so
// the stall grows more surprising over the years, never less:
//
//   3 objects × 16 regions = 48 curiosities across the ~5-year planet
//   a stall of 4 slides 4 further along the pool each rotation,
//   wrapping — every object is back on offer within ⌈pool/4⌉
//   rotations, so nothing is ever permanently missable (spec §5).
//
// Until the second region is discovered the pool holds only 3, so the
// stall simply shows 3 — the stall never shows more than the pool.
export const MARKET_STALL_SIZE = 4
export const MARKET_OBJECTS_PER_REGION = 3

// Placeholder price tiers until T6.1 prices the real objects (Kimia's
// call 2026-07-20). Each region offers one object per tier. Sized
// against the fungus income worked out at T3.1 (~15 fungi per
// 28-lived-day rotation at Kimia's pace):
//
//   12 — the mid object: about one per rotation, the pacing target
//        from 2026-07-19 ("~1 mid-priced object per rotation")
//   18 — the dear one: asks for saving across a rotation or two
//    6 — the small one: always within easy reach
//
// Buy and sell prices are ALWAYS identical (spec §5: no penalty, no
// spread) — these numbers are both.
export const MARKET_PRICE_TIERS = [6, 12, 18]
