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
        'to discover the native flora. this land holds life, just like you.',
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
        'rare treasure that will open doors to deeper friendships.',
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
    emptyState: 'something will be here soon. check in later.',
  },

  // ── future narrated moments ────────────────────────────────────────
  // Sections ready now; actual slots are added when each feature is
  // built and its names/counts exist (Kimia's call, 2026-07-19).

  // friend introductions (T4.4) — one slot per CATEGORY, played once:
  // at the FIRST arrival of that category's first friend (later friends
  // of the same category arrive wordless — narration is momentary).
  // Like the first reveals, each has a title (the big line) and a line
  // (the story beneath it). Both are yours — every word on that screen
  // is Kimia's; left blank, the reveal shows just the friend, its name
  // and its button. TODO: written by Kimia.
  friendIntros: {
    plip: {
      title: 'a plip!',
      line: 'plips are a wordless creature on N-Z-D. they are friendly, and love having company.',
    },
    baluhm: {
      title: 'a baluhm!',
      line: 'curious and kind, baluhms gravitate towards strangers, communicating mostly through gesture.',
    },
    klupengk: {
      title: 'a krupengk!',
      line: 'the observant krupengk loves to gather information, saving it all for analysis later.',
    },
    zala: {
      title: 'a zala!',
      line: 'although zalas can be stand-offish, you may see them often because they move too slow to escape small talk.',
    },
    'liwi-bi-jiji': {
      title: 'a liwi bi-jiji!',
      line: 'the fastest creatures on N-Z-D. known for their sense of humour. fans of scavenging competitions and chit chat.',
    },
    meuhy: {
      title: 'a meuhy!',
      line: 'meuhys are N-Z-D"s most loyal creatures. it takes them long to trust, but when they do, it"s forever. lucky you!',
    },
    rassatt: {
      title: 'a rassatt!',
      line: 'rassatts are rarely found in this layer of the atmosphere, but they are friendly and talkative. they enjoy teasing and roasting.',
    },
    woigolp: {
      title: 'a woigolp!',
      line: 'moody and temperamental, woigolps rarely emerge from their quarters, but when they do it"s to fight or to eat. friendship with them is unusual.',
    },
    chitu: {
      title: 'a chitu!',
      line: 'shy chitus are N-Z-D"s finest poets. they are deeply fond of their local culture and language. their introversion keeps them mostly hidden and out of sight. ',
    },
    'hamdi-bulo': {
      title: 'a hamdi bulo!',
      line: 'wow! you befriended N-Z-D"s one and only hamdi bulo. these long-living creatures are wise like oracles and have seen more than anyone else on the planet. there is no higher or more honourable friendship here on N-Z-D. congratulations! this suggests your level of literacy has reached an unbelievable standard, for a non-native. all those novels and dictionaries that you read earned you this. well done. ',
    },
  },

  // friend card texts (T4.4) — one slot per category, shown on the
  // Guest Book popup card. This is the ONE standing exception to
  // "narration is momentary" (decision 2026-07-20): the card text is
  // re-readable any time — who they are, not the night you met them.
  // Left blank, the card shows just the art, the name and the
  // animation. TODO: written by Kimia.
  friendCards: {
    plip: 'plips are a wordless creature on N-Z-D. they love company.',
    baluhm:
      'curious baluhms gravitate towards strangers, communicating mostly through gesture.',
    klupengk:
      'the observant krupengk loves to gather information, saving it all for analysis later.',
    zala: 'zalas can be stand-offish, but you may see them often because they move slowly.',
    'liwi-bi-jiji':
      'the fastest creatures on N-Z-D are liwi bi-jijis, fans of scavenging competitions and chit chat.',
    meuhy:
      'meuhys are N-Z-D"s most loyal creatures. it takes them long to trust, but when they do, it"s forever.',
    rassatt:
      'rassatts live in a different layer of the atmosphere. they are friendly and talkative. they enjoy teasing and roasting.',
    woigolp:
      'woigolps rarely emerge from their quarters, but when they do it"s to fight or to eat. they are moody and aggressive.',
    chitu:
      'shy, interovered chitus are N-Z-D"s finest poets. they are deeply fond of their local culture and language, and masters of art.',
    'hamdi-bulo':
      'N-Z-D currently hosts only one hamdi bulo. these long-living creatures are wise like oracles and have seen more than anyone else on the planet.',
  },

  // cameo messages (T4.6) — one slot per win type, shown while a
  // friend visits the habit list to celebrate. Momentary like all
  // narration: it plays with the visit and is never stored. The win's
  // number is yours to bake into the words if you want it (your drafts:
  // "12 steps in one day!", "15-day streak record!", "50 lived days!").
  // Left blank, the visit shows just the friend and its performance.
  // TODO: written by Kimia.
  cameos: {
    bigDay: '12 steps in one day!',
    streakRecord: '15-day streak record!',
    livedDays: '50 lived days!',
  },

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
