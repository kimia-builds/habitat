// narration.js — every word of story Habitat shows, in one file (T3.4).
//
// THIS FILE IS KIMIA'S (design-notes §7): Claude Code builds the keyed
// slots and the plumbing; the words are human-written. To fill a slot,
// put your words between its quotes. A slot left as '' shows nothing
// in the app — no broken text, and never invented copy.
//
// Some slots below still hold Claude-written text from T3.2. Each is
// marked PLACEHOLDER and stays only until Kimia replaces it
// (TODO: written by Kimia).
//
// Narration is momentary (spec decisions 2026-07-19): these lines play
// once, in the moment, and are never stored or re-readable in the app.

export const NARRATION = {
  // ── the five first-occurrence reveals (built in T3.2) ──────────────
  // Each reveal has a title (the big line) and a line (the story
  // beneath it). Both are yours to change — decided 2026-07-19.
  firstReveals: {
    flora: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'your first flora find',
      line:
        'Something growing, right where you passed — the first plant of ' +
        'N-Z-D you have come to know. The land has plenty more to show you.',
    },
    magazine: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'your first magazine',
      line:
        'Printed pages in the local script. You cannot read much yet — ' +
        'but the pictures help, and it goes straight to your bookcase.',
    },
    novel: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'your first novel',
      line:
        'A whole story in the language of N-Z-D. One day you will read ' +
        'it cover to cover. It waits on your bookcase.',
    },
    dictionary: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'your first dictionary',
      line:
        'A rare treasure: the language of N-Z-D, explained in its own ' +
        'words. Your bookcase will never hold anything more precious.',
    },
    fungi: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'your first fungi',
      line:
        'Glowing mushrooms — the currency here. They go straight to ' +
        'your wallet, ready for the market one day.',
    },
  },

  // ── the spread popup (T3.5) ────────────────────────────────────────
  // Shown inside the reading popup when a publication's double-page
  // spread doesn't exist yet (spreads are listed in
  // src/content/spreads.js). Left blank, the popup shows just the
  // publication and its close button — nothing invented.
  spreadPopup: {
    // TODO: written by Kimia.
    emptyState: '',
  },

  // ── future narrated moments ────────────────────────────────────────
  // Sections ready now; actual slots are added when each feature is
  // built and its names/counts exist (Kimia's call, 2026-07-19).

  // friend introductions & welcomes (T4.4) — one slot per friend.
  friendIntros: {},

  // map regions (T4.1) — one slot per region, in discovery order:
  // region1 is the landing site in the middle of the Map, region2–6
  // the ring around it, region7–16 the outer ring. Regions get their
  // NAMES in T6.1; these are the words for each discovery moment,
  // which plays with the ambient swell built in T5.2. All yours.
  // TODO: written by Kimia.
  mapRegions: {
    region1: '',
    region2: '',
    region3: '',
    region4: '',
    region5: '',
    region6: '',
    region7: '',
    region8: '',
    region9: '',
    region10: '',
    region11: '',
    region12: '',
    region13: '',
    region14: '',
    region15: '',
    region16: '',
  },

  // literacy eras — one slot per era.
  literacyEras: {},
}

// Look a slot up by its path, e.g. narrationSlot('firstReveals.flora.title').
// Returns the text, or null when the slot is empty, blank, or doesn't
// exist yet — so callers show nothing rather than inventing copy.
export function narrationSlot(path) {
  let value = NARRATION
  for (const key of path.split('.')) {
    if (value === null || typeof value !== 'object') return null
    value = value[key]
  }
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text === '' ? null : text
}
