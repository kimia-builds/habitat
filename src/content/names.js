// names.js — what the beings of N-Z-D are called (T6.1a).
//
// THIS FILE IS KIMIA'S (design-notes §7): Claude Code builds the keyed
// slots and the plumbing; every word is human-written. To name
// something, put your words between its quotes. A slot left as '' shows
// nothing in the app rather than inventing a name.
//
// WHY IT EXISTS (Kimia's call, 2026-08-10). The ten species had
// Claude-drafted names ("Drifter", "Nester", …) living in
// src/game/constants.js as game data. They are words a player reads, so
// they are copy, and copy is hers. The drafts are gone from the app; the
// slots below are where the real names go.
//
// ABOUT THE KEYS ON THE LEFT (drifter:, nester:, …). Those are permanent
// internal ids, not names — they are how the code, the CSS animations and
// the narration slots in narration.js find each species, and they never
// appear on screen. They stay as they are even after you rename a
// species: the key `drifter` may well end up holding a species you call
// something else entirely. They are listed low to high on the literacy
// ladder, so `drifter` is the first species you meet and `poet` the last.
//
// HOW A FRIEND GETS ITS NAME ON SCREEN, in order:
//   1. its own individual name below, if you have written one;
//   2. otherwise its species name;
//   3. otherwise nothing at all — just the art.
// So filling the ten species names is enough to name every friend in the
// game; individual names are the finer pass on top, and can come later,
// one at a time.

export const NAMES = {
  // ── the ten species ────────────────────────────────────────────────
  // What ONE of them is called, exactly as it should read on screen —
  // include the article if you want one ("a drifter", "an ember").
  // Shown on the Guest Book list and card, the arrival reveal, the
  // arrival shelf, and the home-screen cameo visits.
  // TODO: written by Kimia.
  species: {
    drifter: 'blip',
    nester: 'baluhm',
    mimic: 'klupengk',
    signer: 'zala',
    sprout: 'liwi bi-jiji',
    chatter: 'meuhy',
    neighbour: 'rassatt',
    storyteller: 'woigolp',
    scholar: 'chitu',
    poet: 'hamdi bulo',
  },

  // ── the individuals ────────────────────────────────────────────────
  // Each species has a FIXED roster (design-bible §9c): 10 drifters down
  // to a single poet, 55 friendships in a lifetime. The number is the
  // order they arrive in — drifter 1 is the first drifter you ever meet.
  // Naming these is optional and endless; an unnamed friend simply wears
  // its species name. TODO: written by Kimia.
  individuals: {
    drifter: {
      1: 'bi',
      2: 'ti',
      3: 'ki',
      4: 'zi',
      5: 'mi',
      6: 'ri',
      7: 'ji',
      8: 'li',
      9: 'wi',
      10: 'di',
    },
    nester: {
      1: 'owa',
      2: 'nor',
      3: 'dulu',
      4: 'feh',
      5: 'swa',
      6: 'rou',
      7: 'loi',
      8: 'momo',
      9: 'sah',
    },
    mimic: {
      1: 'chok',
      2: 'draktam',
      3: 'su-chuch',
      4: 'glongk',
      5: 'ach-tek',
      6: 'papo-palat',
      7: 'serchu',
      8: 'klist',
    },
    signer: {
      1: 'joo',
      2: 'ri-mapa',
      3: 'foyon',
      4: 'ulu-wumu',
      5: 'sidakuza',
      6: 'fente',
      7: 'lujaa',
    },
    sprout: {
      1: 'dugo linowa',
      2: 'sirid umaan',
      3: 'so-lono chapina',
      4: 'indiz aku-tata',
      5: 'fo-kocho panu-baa',
      6: 'rolo mu-nino',
    },
    chatter: {
      1: 'auhya',
      2: 'uwo',
      3: 'yawy',
      4: 'wuyo',
      5: 'nii',
    },
    neighbour: {
      1: 'batta du',
      2: 'sikki chi',
      3: 'zuchi naffi',
      4: 'appatta',
    },
    storyteller: {
      1: 'mogo',
      2: 'unt',
      3: 'rori',
    },
    scholar: {
      1: 'ayalit salong',
      2: 'ayalit sumachi',
    },
    poet: {
      1: 'pikimi bulo',
    },
  },
}

// ─────────────────────────── the plumbing ────────────────────────────
// Both readers return the trimmed words or null when a slot is blank,
// so a screen shows nothing rather than an empty space or a stand-in
// (mirrors narrationSlot in narration.js).

function filled(value) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text === '' ? null : text
}

// What this species is called, or null while its slot is blank.
export function speciesName(key) {
  return filled(NAMES.species?.[key])
}

// What this particular friend is called, or null while its slot is
// blank. `individual` is 1-based, in arrival order.
export function individualName(key, individual) {
  return filled(NAMES.individuals?.[key]?.[individual])
}

// The name to show for one friend: their own if they have one, else
// their species', else nothing. This is the ladder the whole app uses —
// every screen that names a friend calls this, so a name Kimia writes
// appears everywhere at once.
export function friendDisplayName(key, individual) {
  return individualName(key, individual) ?? speciesName(key)
}
