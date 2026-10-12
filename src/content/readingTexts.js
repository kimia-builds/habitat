// readingTexts.js — what is written inside every piece of reading
// material (T6.24). THIS FILE IS KIMIA'S, like names.js and
// narration.js: Claude Code builds the slots and never writes the words.
// The texts below are copied from reading-texts.md, exactly as she
// wrote them.
//
// There are 126 slots: for each of the six reading stages, 1 dictionary,
// 4 novels and 16 magazines (spec §5 Stream 2). A slot's id is
// s<stage>-<type>-<number>, so  's3-magazine-07'  is the seventh
// magazine of stage 3. Stage names are internal and never shown.
//
// Each slot has two parts:
//   picture — a square-bracket description of the picture that goes
//             with the text, like  '[a plip]'. For now the spread shows
//             the bracket as a stand-in; the real drawings come later
//             and will replace the bracket one by one. Leave '' for no
//             picture.
//   text    — the words (English; under 100 words; no day words — N-Z-D
//             has no days). Leave '' while unwritten.
//
// A slot with neither shows a quiet empty spread, never invented words.
// Farsi versions of these texts are the lowest-priority translation and
// will get their own field when they are done.

export const READING_TEXTS = {
  // ── Stage 1 — Illiterate — pictures only ────────────────────────────────
  // dictionaries
  's1-dictionary-01': { picture: '[A gubl and its bauble yields.]', text: '' },
  // novels
  's1-novel-01': { picture: '[Three plips.]', text: '' },
  's1-novel-02': { picture: '[One baluhm.]', text: '' },
  's1-novel-03': { picture: '[A luminous crystal.]', text: '' },
  's1-novel-04': { picture: '[A ghust of wind around tall cliffs.]', text: '' },
  // magazines
  's1-magazine-01': { picture: '[charm 1]', text: '' },
  's1-magazine-02': { picture: '[charm 2]', text: '' },
  's1-magazine-03': { picture: '[charm 3]', text: '' },
  's1-magazine-04': { picture: '[charm 4]', text: '' },
  's1-magazine-05': { picture: '[charm 5]', text: '' },
  's1-magazine-06': { picture: '[charm 6]', text: '' },
  's1-magazine-07': { picture: '[rail symbol 1]', text: '' },
  's1-magazine-08': { picture: '[rail symbol 2]', text: '' },
  's1-magazine-09': { picture: '[rail symbol 3]', text: '' },
  's1-magazine-10': { picture: '[rail symbol 4]', text: '' },
  's1-magazine-11': { picture: '[rail symbol 5]', text: '' },
  's1-magazine-12': { picture: '[rail symbol 6]', text: '' },
  's1-magazine-13': { picture: '[rail symbol 7]', text: '' },
  's1-magazine-14': { picture: '[rail symbol 8]', text: '' },
  's1-magazine-15': { picture: '[one star]', text: '' },
  's1-magazine-16': { picture: '[one unif]', text: '' },

  // ── Stage 2 — Collecting words ──────────────────────────────────────────
  // dictionaries
  's2-dictionary-01': {
    picture: "[the pataya's seasonal blossoms]",
    text: 'season',
  },
  // novels
  's2-novel-01': { picture: '[a unif]', text: 'struggle' },
  's2-novel-02': { picture: '[a plip]', text: 'friendship' },
  's2-novel-03': { picture: '[a bubbling mud-pool]', text: 'bliss' },
  's2-novel-04': { picture: '[a toom]', text: 'home' },
  // magazines
  's2-magazine-01': { picture: '', text: 'hello' },
  's2-magazine-02': { picture: '', text: 'N-Z-D' },
  's2-magazine-03': { picture: '', text: 'sale' },
  's2-magazine-04': { picture: '', text: 'baluhm' },
  's2-magazine-05': { picture: '', text: 'school' },
  's2-magazine-06': { picture: '', text: 'plip' },
  's2-magazine-07': { picture: '', text: 'ti' },
  's2-magazine-08': { picture: '', text: 'chok' },
  's2-magazine-09': { picture: '', text: 'nor' },
  's2-magazine-10': { picture: '', text: 'sahara' },
  's2-magazine-11': { picture: '', text: 'abode' },
  's2-magazine-12': { picture: '', text: 'edibles' },
  's2-magazine-13': { picture: '', text: 'simeen' },
  's2-magazine-14': { picture: '', text: 'fruit' },
  's2-magazine-15': { picture: '', text: 'wind' },
  's2-magazine-16': { picture: '', text: 'sky' },

  // ── Stage 3 — Somewhat verbal ───────────────────────────────────────────
  // dictionaries
  's3-dictionary-01': {
    picture: '',
    text: 'lucky duripila tendrils found in parnian',
  },
  // novels
  's3-novel-01': { picture: '', text: 'togetherness in dry weather' },
  's3-novel-02': { picture: '', text: 'seasonal stars in solitude' },
  's3-novel-03': { picture: '', text: "climbing ida's mountains alone" },
  's3-novel-04': { picture: '', text: 'the ostracised plip' },
  // magazines
  's3-magazine-01': { picture: '', text: 'baluhm finds new stranger' },
  's3-magazine-02': { picture: '', text: 'too many plips' },
  's3-magazine-03': { picture: '', text: 'sandstorm in sahara' },
  's3-magazine-04': { picture: '', text: 'sad school closures' },
  's3-magazine-05': { picture: '', text: 'comet sighting' },
  's3-magazine-06': { picture: '', text: 'new information; thanks choks' },
  's3-magazine-07': { picture: '', text: 'missing dictionaries?' },
  's3-magazine-08': { picture: '', text: 'high edible yield' },
  's3-magazine-09': { picture: '', text: 'extra pleasant wind pattern' },
  's3-magazine-10': { picture: '', text: 'hamid travel guide' },
  's3-magazine-11': { picture: '', text: 'pop star academy' },
  's3-magazine-12': { picture: '', text: 'trendy alien symbols' },
  's3-magazine-13': { picture: '', text: 'fragrant spawn from sahara' },
  's3-magazine-14': { picture: '', text: 'new river rides in sogol' },
  's3-magazine-15': { picture: '', text: 'new novel published' },
  's3-magazine-16': { picture: '', text: 'take a flora quiz' },

  // ── Stage 4 — Grammar sorted ────────────────────────────────────────────
  // dictionaries
  's4-dictionary-01': {
    picture: '',
    text: 'sky canopies contain seasonal warmth and focus our view on the glowing life of the planet. when the old flora disintegrate into space, many of the younger flora die with it, opening the sky to our colder, more contemplative seasons with a clear view of the skies.',
  },
  // novels
  's4-novel-01': { picture: '', text: '' },
  's4-novel-02': { picture: '', text: '' },
  's4-novel-03': { picture: '', text: '' },
  's4-novel-04': { picture: '', text: '' },
  // magazines
  's4-magazine-01': {
    picture: '',
    text: 'a liwi bi-jiji school got hit by a meteor. luckily no one got injured.',
  },
  's4-magazine-02': {
    picture: '',
    text: 'market goods selling fast! purchase quickly before seller travels on to sufi',
  },
  's4-magazine-03': {
    picture: '',
    text: "auditions for next season's storytellings showcase by the mud pots soon!",
  },
  's4-magazine-04': {
    picture: '',
    text: 'forensic scientists of the krupengk population found the dictionary thief',
  },
  's4-magazine-05': {
    picture: '',
    text: 'slower wind rivers are causing major delays among the floating population',
  },
  's4-magazine-06': {
    picture: '',
    text: 'geologists warn of extra hot volcanoes in kian this tectonic cycle',
  },
  's4-magazine-07': {
    picture: '',
    text: "don't miss the woigolps' famous special storytelling extravaganza!",
  },
  's4-magazine-08': {
    picture: '',
    text: 'communal grief and celebration of hamdi bulo passing to the universe',
  },
  's4-magazine-09': {
    picture: '',
    text: 'fungus forest discovery leads to crazy inflation; chitus intervene',
  },
  's4-magazine-10': {
    picture: '',
    text: 'tourism in ari is at an all time high - tourists say they adore the scent!',
  },
  's4-magazine-11': {
    picture: '',
    text: 'studies show long-term baluhm companionship improves spiritual health',
  },
  's4-magazine-12': {
    picture: '',
    text: 'a zecht was found in sahara - how did it survive there?',
  },
  's4-magazine-13': {
    picture: '',
    text: 'recent contact made with alien planet 5-A-M. low hostility; low trust.',
  },
  's4-magazine-14': {
    picture: '',
    text: "friendship tips and tricks for first timers: don't rush!",
  },
  's4-magazine-15': {
    picture: '',
    text: 'amazing new seed yields available in kian',
  },
  's4-magazine-16': {
    picture: '',
    text: 'a novel writer has been accused of plagiarism but denies claims.',
  },

  // ── Stage 5 — Higher education ──────────────────────────────────────────
  // dictionaries
  's5-dictionary-01': { picture: '', text: '' },
  // novels
  's5-novel-01': { picture: '', text: '' },
  's5-novel-02': { picture: '', text: '' },
  's5-novel-03': { picture: '', text: '' },
  's5-novel-04': { picture: '', text: '' },
  // magazines
  's5-magazine-01': { picture: '', text: '' },
  's5-magazine-02': { picture: '', text: '' },
  's5-magazine-03': { picture: '', text: '' },
  's5-magazine-04': { picture: '', text: '' },
  's5-magazine-05': { picture: '', text: '' },
  's5-magazine-06': { picture: '', text: '' },
  's5-magazine-07': { picture: '', text: '' },
  's5-magazine-08': { picture: '', text: '' },
  's5-magazine-09': { picture: '', text: '' },
  's5-magazine-10': { picture: '', text: '' },
  's5-magazine-11': { picture: '', text: '' },
  's5-magazine-12': { picture: '', text: '' },
  's5-magazine-13': { picture: '', text: '' },
  's5-magazine-14': { picture: '', text: '' },
  's5-magazine-15': { picture: '', text: '' },
  's5-magazine-16': { picture: '', text: '' },

  // ── Stage 6 — Subtlety elite ────────────────────────────────────────────
  // dictionaries
  's6-dictionary-01': { picture: '', text: '' },
  // novels
  's6-novel-01': { picture: '', text: '' },
  's6-novel-02': { picture: '', text: '' },
  's6-novel-03': { picture: '', text: '' },
  's6-novel-04': { picture: '', text: '' },
  // magazines
  's6-magazine-01': { picture: '', text: '' },
  's6-magazine-02': { picture: '', text: '' },
  's6-magazine-03': { picture: '', text: '' },
  's6-magazine-04': { picture: '', text: '' },
  's6-magazine-05': { picture: '', text: '' },
  's6-magazine-06': { picture: '', text: '' },
  's6-magazine-07': { picture: '', text: '' },
  's6-magazine-08': { picture: '', text: '' },
  's6-magazine-09': { picture: '', text: '' },
  's6-magazine-10': { picture: '', text: '' },
  's6-magazine-11': { picture: '', text: '' },
  's6-magazine-12': { picture: '', text: '' },
  's6-magazine-13': { picture: '', text: '' },
  's6-magazine-14': { picture: '', text: '' },
  's6-magazine-15': { picture: '', text: '' },
  's6-magazine-16': { picture: '', text: '' },
}

// What is written in one publication, or null while its slot is blank
// (or the id is not one of ours) — so a screen shows a quiet empty
// spread instead of a stand-in. Mirrors narrationSlot in narration.js.
export function readingTextFor(publicationId, table = READING_TEXTS) {
  const slot = table[publicationId]
  if (typeof slot !== 'object' || slot === null) return null
  const picture = typeof slot.picture === 'string' ? slot.picture.trim() : ''
  const text = typeof slot.text === 'string' ? slot.text.trim() : ''
  if (picture === '' && text === '') return null
  return { picture: picture || null, text: text || null }
}
