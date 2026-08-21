# HABITAT 🪐

**A personal habit tracker where showing up for your habits carries you
through your immigration to the alien planet N-Z-D** — getting to know
the land, gathering its flora, trading glowing fungi at the local market
for curiosities, learning the local language, and earning friendships in
the community. Habit by habit, we build a habitat.

**Live:** https://kimia-builds.github.io/habitat
_(a wide screen — see [Device stance](#device-stance) below)_

## The idea

After six years on Habitica, I hit its "delight ceiling" — so I'm building
my own reward layer on top of the habit-tracking bones I know work.
Habitat keeps habits, streaks, and progression, and replaces everything
else with something quieter and stranger:

- **Three independent reward streams.** An **expedition meter** (predictable,
  advances with every completion) gradually reveals a map of the planet,
  with flora discovered along the way; a **literacy meter** (fed by rare,
  surprising drops of reading material) unlocks friendships with the
  locals — ten categories of being, from wordless plips to the rarest
  friendship of all, the hamdi bulos; and a **fungus wallet** of glowing local
  currency, spent (and always fully refundable) at a slowly rotating market.
- **No punishment mechanics.** Missed habits are neutral data, never damage.
- **No retention hooks.** Rewards are paced flat and patient — designed for
  one loyal daily user over ~5 years, not for onboarding dopamine.
- **A guest, not a coloniser.** We don't conquer, claim, or extract. The
  planet was thriving before we arrived; the privilege is being welcomed in.

## The app

A habit list and the three meters sit on the home screen; a morning
check-in asks about yesterday and backfills anything older in the
current week. Six symbol charms tag and filter habits — no words, no
labels. Everything else earned lives on its own page:

- **Field notes** — the weekly view, with per-habit line graphs.
- **Map** — the planet, revealed region by region as the expedition
  meter advances.
- **Bookcase** — everything read, arrangeable on the shelf.
- **Abode** — gathered flora and bought objects, arranged on open ground.
- **Market** — objects for fungi, on a 28-lived-day rotation. Buy and
  return prices are always identical.
- **Guest book** — the friendships earned, each with its own arrival.

## How it's built

This is also a learning project in AI-assisted development: designed,
specified, and built in collaboration with Claude, one small tested task
at a time (working agreements in [CLAUDE.md](CLAUDE.md)).

- **Stack:** React + Vite, Vitest for tests, plain CSS, SVG-only visuals.
- **No backend:** all habit data lives privately in the browser
  (localStorage) behind a single versioned, schema-upgrading storage
  module, with manual JSON export/import as backup. Nothing personal is
  in this repo.
- **CI/CD:** every push runs the test suite and deploys to GitHub Pages.

### Device stance

Habitat is built for **wide screens**, deliberately. Below 740px the
whole app is replaced by a single full-screen message. It is a width
rule rather than a device rule — 740px is simply where the layout gives
way — so a tablet held sideways does render it. It's a reversible gate,
not a teardown: every feature stays built, and a future responsive pass
would remove it.

### The documents

The project is document-led; these are the sources of truth:

| File                               | What it holds                                     |
| ---------------------------------- | ------------------------------------------------- |
| [spec.md](spec.md)                 | The product — mechanics, rules, architecture      |
| [plan.md](plan.md)                 | The build roadmap, task by task                   |
| [design-notes.md](design-notes.md) | Look, feel, motion, layout decisions              |
| [design-bible.md](design-bible.md) | The world-art language and asset catalogue        |
| [history.md](history.md)           | The audit trail — dated decisions and build notes |
| [CLAUDE.md](CLAUDE.md)             | The rules every AI coding session follows         |

## Running locally

```bash
npm install
npm run dev    # local dev server
npm test       # test suite
npm run build  # production build
```

## Status

<!-- current-milestone: M5 -->
<!-- Kept honest by src/test/docs.test.js: the milestone named here must
     be the one holding plan.md's first unticked task, or CI fails. -->

🛠️ **In daily use since 14 July 2026.** The walking skeleton shipped that
day and Habitat became my real habit tracker; everything since has been
built on top of a live, in-use app.

- **M0–M4 — done.** Habits, the day/schedule engine and the morning
  check-in; the three meters and the field notes; the drops engine with
  its reveals; and the full world of N-Z-D — map, bookcase, abode,
  market and guest book.
- **M5 — in progress.** The design pass: the six charm symbols, the
  width gate, drag-to-reorder, the design-tokens file (colour, spacing
  and glow) and the palette it paid for are in, the typography is settled
  as it stands, and the layout pass is done — a header bar across the
  top, page titles standing above their boxes, and a night sky behind
  everything. The daily startup ceremony is in — a planet rolling along
  the bottom of a black screen before the day opens — and drops now
  arrive as glowing blobs pinned to the corner of the window, sparkling
  as they land and dissolving slowly when they go. The meters answer a
  tap too: the bar that moved glows and swells while a ring of light
  opens under your finger. And the rarest wins — a record streak, every
  fiftieth lived day — bring a friend to the habit list with a firework
  around them. The feel pass is finished, and with it the whole visual
  identity: every glow in the app now comes from one named scale of six
  steps rather than fifteen numbers typed one at a time. The friends have
  their palette too — ten chosen colours, dealt to each friend at random
  when a game begins and never repeating within a species, so two
  players' guest books look different. Still to come in M5 is the
  creature, flora and object art itself.
- **M6 — under way alongside M5.** Content pools, pacing tune-ups and
  portfolio polish are still ahead, but a good deal of it has shipped
  out of order, as things came up in daily use. The error-boundary
  safety net is in, and the first half of the backup habit —
  persistent-storage groundwork, and the export button tells you how old
  your last backup is. There are two doors to starting over. The morning
  check-in got quick. Every word the interface says now lives in one
  keyed file, so Habitat can hold a second language. And the habit list
  is learning new ways to be LOOKED at: every tile carries an eye, and
  closing it dims that habit and drifts it down out of your eyeline
  without switching anything off. Two words beside the six charms narrow
  it further — `today` leaves you the day's list, and `prioritise` sorts
  it into what is owed today, what is owed this week, and everything
  else. None of it is written down: a refresh or the 3am day turn brings
  your own order back.

See [plan.md](plan.md) for the task-level truth.
