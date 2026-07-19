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
      title: 'you found an indigenous plant',
      line:
        'after walking around N-Z-D for some time, you got enough steps in ' +
        'to discover the native flora. this land holds life, just like you.'
    },
    magazine: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'what is this? reading material?',
      line:
        'printed pages of local cultural phenomena. interesting stuff. ' +
        'hard to tell what language means on this planet. images help.',
    },
    novel: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'more pages; heavier. a novel?',
      line:
        'N-Z-D is a cultured place; it is you who must raise your ' +
        'literacy level. perhaps this is the reading challenge you need.',
    },
    dictionary: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'you found a dictionary',
      line:
        'finally! a point of reference. a form of translation. a ' +
        'rare treasure that will open doors to deeper frienships.',
    },
    fungi: {
      // PLACEHOLDER — Claude-written; TODO: written by Kimia.
      title: 'you earned a fungible token',
      line:
        'do not eat these: they are very valuable and inedible. ' +
        'buy and sell objects for the same price at the local market.',
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
    region1: 'sahara',
    region2: 'ari',
    region3: 'lerato',
    region4: 'sogol',
    region5: 'kian',
    region6: 'ida',
    region7: 'sufi',
    region8: 'cyrus',
    region9: 'shiva',
    region10: 'oratile',
    region11: 'chaymae',
    region12: 'hamid',
    region13: 'parnian',
    region14: 'marie-simone',
    region15: 'tadiwa',
    region16: 'lily',
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
