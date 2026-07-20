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
- symbol filter row at top (multi-select, resets on reload)
- ▲▼ re-order (disabled while filtered), order survives reload
- archive → collapsed "archived (n)" section → unarchive / delete forever
- import backup must warn (window.confirm) when data exists

## Gotchas

- The Browser pane's read_page sometimes returns "(empty page)"
  right after a navigation — take a screenshot and click by
  coordinates instead (coordinate space = the screenshot's own pixels).
- window.confirm guards delete-forever and import-over-data; native
  dialogs are hard to drive in the pane — those paths are covered by
  src/App.test.jsx instead.
