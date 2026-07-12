# HABITAT 🪐

**A personal habit tracker where showing up for your habits carries you
through ethical immigration to the alien planet N-Z-D** — getting to know
the land, furnishing a home with found curiosities, learning the local
language, and earning friendships in the community. Habit by habit, we
build a habitat.

**Live:** https://kimia-builds.github.io/habitat

## The idea

After six years on Habitica, I hit its "delight ceiling" — so I'm building
my own reward layer on top of the habit-tracking bones I know work.
Habitat keeps habits, streaks, and progression, and replaces everything
else with something quieter and stranger:

- **Two independent reward streams.** An **expedition meter** (predictable,
  advances with every completion) gradually reveals a map of the planet;
  a **literacy meter** (fed by rare, surprising drops of reading material)
  unlocks friendships with the locals — ten categories of being, from
  wordless Drifters to the rarest friendship of all, the Poets.
- **No punishment mechanics.** Missed habits are neutral data, never damage.
- **No retention hooks.** Rewards are paced flat and patient — designed for
  one loyal daily user over ~5 years, not for onboarding dopamine.
- **A guest, not a coloniser.** We don't conquer, claim, or extract. The
  planet was thriving before we arrived; the privilege is being welcomed in.

The full design is in [spec.md](spec.md), and the build roadmap is in
[plan.md](plan.md).

## How it's built

This is also a learning project in AI-assisted development: designed,
specified, and built in collaboration with Claude, one small tested task
at a time (working agreements in [CLAUDE.md](CLAUDE.md)).

- **Stack:** React + Vite, Vitest for tests, plain CSS, SVG-only visuals.
- **No backend:** all habit data lives privately in the browser
  (localStorage) with export/import backup. Nothing personal is in this repo.
- **CI/CD:** every push runs the test suite and deploys to GitHub Pages.

## Running locally

```bash
npm install
npm run dev    # local dev server
npm test       # test suite
npm run build  # production build
```

## Status

🌱 Early days — currently at M0 (foundations). See [plan.md](plan.md) for
progress.
