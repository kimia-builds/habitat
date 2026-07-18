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
// No pacing constants here yet — drop rates arrive in T3.1 and
// object prices in M4/M6.
