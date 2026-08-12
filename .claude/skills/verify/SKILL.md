---
name: verify
description: How to run and verify Habitat end-to-end in a browser.
---

# Verifying Habitat

## Launch

- Dev server: `npm run dev` in the repo root → http://localhost:5173
  (Vite, React). In Claude Code, use the Browser pane's preview_start
  with a launch.json entry named `habitat-dev` (already set up in
  `.claude/launch.json` here and in the home folder for sessions that
  start in `~`).
- Production check: `npm run build` then `npm run preview`.

## Drive

All state is in localStorage under the key `habitat-data` — reload the
page to prove persistence; clear site data to reset to first-run.

Flows worth driving after UI changes:

- create a habit (each schedule type has different form fields)
- tap to complete; tap again = undo; N-per-day shows count/N with +1/undo
- symbol filter row at top (multi-select, resets on reload). It is the
  whole screen's lens since 2026-08-11: it narrows the archived drawer
  too, and travels to the field notes
- re-order by dragging a tile anywhere but its buttons (there is no grip
  — retired 2026-08-11; disabled while filtered), order survives reload
- archive → collapsed "archived (n)" section → unarchive / delete forever
- import backup must warn (window.confirm) when data exists

## Gotchas

- The Browser pane's read_page sometimes returns "(empty page)"
  right after a navigation — take a screenshot and click by
  coordinates instead (coordinate space = the screenshot's own pixels).
- window.confirm guards delete-forever and import-over-data; native
  dialogs are hard to drive in the pane — those paths are covered by
  src/App.test.jsx instead.
- **The pane runs its tab hidden, so CSS transitions never advance** —
  a transitioned element reports the value it started from, which makes
  correct code look broken and hides bugs that only appear mid-flight.
  To drive a drag honestly, inject
  `.habit-row--dragging { transition: none !important }` first: the tile
  then really travels with the pointer, while the settle transition
  stays on. Keyframe animations DO run while hidden; pause and seek one
  to look at a frame.
- **React does not commit inside `dispatchEvent`.** After firing a
  synthetic `pointerup`, anything read in the same statement is still
  pre-drop state — order, classes and boxes alike. Read from a
  `setTimeout(…, 0)` instead (a microtask is too early: React's own
  flush is queued as one). This has produced two wrong readings; both
  times the code was fine.
