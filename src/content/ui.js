// ui.js — every word the INTERFACE says, in one file.
//
// The companion to narration.js. That file holds the STORY (what N-Z-D
// tells you); this one holds the FURNITURE (what the buttons, labels and
// page titles say). They were split because they are written in
// different voices and, from here on, translated on different clocks.
//
// THIS FILE IS KIMIA'S, like every other file in src/content/
// (design-notes §7). Claude Code builds the keyed slots and the
// plumbing; the words are human-written.
//
// ── THE ONE RULE THAT DIFFERS FROM THE OTHER CONTENT FILES ──────────
//
// Everywhere else in src/content/, a blank slot shows NOTHING — better
// silence than invented copy. That rule cannot hold here: a blank
// button is not restraint, it is a broken control.
//
// So for interface copy, and only here:
//
//     a blank Farsi slot falls back to the English word.
//
// This is what makes the Farsi version translatable ONE SLOT AT A TIME.
// Fill three words and three words are Farsi; the rest of the app keeps
// working in English until you get to it. Habitat is never half-broken,
// only ever partly translated. Nothing is ever auto-translated — an
// empty slot shows English, which is a real human's words, not a
// machine's guess.
//
// ── HOW TO TRANSLATE ────────────────────────────────────────────────
//
// Find the key you want in the `fa` block at the bottom and put your
// words between its quotes. That's the whole job.
//
// ── ABOUT THE KEYS ON THE LEFT ('rail.pages', 'meters.steps', …) ────
//
// Those are permanent internal ids, not words. They never appear on
// screen and they never change when the words do. They are grouped by
// where they show up: `rail.` is the left icon column, `meters.` the
// three bars, `page.` the page titles, and so on.
//
// ── {curly braces} ──────────────────────────────────────────────────
//
// A few slots contain something like {label} or {price}. That is a hole
// the app fills in as it runs — {price} becomes the actual number of
// fungi. Keep the hole, with its braces, somewhere in your sentence; you
// may move it anywhere the grammar wants it, which matters in Farsi,
// where word order differs.

// ── ENGLISH ─────────────────────────────────────────────────────────
// The written-and-settled words Habitat has worn until now. These are
// also the fallback for any Farsi slot left blank, so this block should
// never contain a blank.
const en = {
  // The app's own name, in the top bar. A wordmark, not really a word —
  // it is likely to stay HABITAT in every language, but it lives here so
  // that staying is a choice rather than an accident.
  'app.wordmark': 'HABITAT',

  // The left icon rail (design-notes §12d). Each of these is a hover
  // label AND the screen-reader name for that icon.
  'rail.pages': 'pages',
  'rail.addHabit': 'add new habit',
  'rail.editPastDays': 'edit past days',
  'rail.fieldNotes': 'view historical data',

  // Page titles. Each appears twice — on the rail icon that opens the
  // page, and at the top of the page itself — so translating it once
  // moves both.
  'page.map': 'map of N-Z-D',
  'page.abode': 'your abode',
  'page.guestbook': 'local community',
  'page.bookcase': 'readers library',
  'page.market': 'local market',
  'page.fieldNotes': 'field notes',

  // The three meters. The `.bar` slots are screen-reader-only: they name
  // the moving bar itself, where the plain slot names the meter.
  'meters.region': 'meters',
  'meters.steps': 'steps taken',
  'meters.stepsBar': 'steps taken progress',
  'meters.literacy': 'literacy level',
  'meters.literacyBar': 'literacy level progress',
  'meters.wallet': 'wallet balance',
  'meters.walletBar': 'wallet balance progress',

  // The habit list and its tiles.
  'habits.filterView': 'filter view',
  'habits.markDone': 'mark done',
  'habits.edit': 'edit',
  'habits.archive': 'archive',
  'habits.unarchive': 'unarchive',
  'habits.deleteForever': 'delete forever',

  // The habit form — the four prompts, then the two pebbles.
  'habitForm.name': 'write a good habit or task:',
  'habitForm.detail': 'add any details or specifications:',
  'habitForm.difficulty': 'pick a difficulty per unit:',
  'habitForm.schedule': 'specify the desired schedule or frequency:',
  'habitForm.howMany': 'how many',
  'habitForm.save': 'save',
  'habitForm.cancel': 'cancel',

  // The morning check-in.
  'checkin.region': 'check-in',
  'checkin.prompt': 'what did you do yesterday?',
  'checkin.earlierDays':
    'update earlier days of this week before they freeze forever:',
  'checkin.noHabits': 'no habits to show for this day',
  'checkin.done': 'done',

  // The field notes.
  'fieldNotes.nothingYet': 'nothing recorded yet',
  'fieldNotes.stillUnfolding': 'still unfolding',
  'fieldNotes.noHabitsThatWeek': 'No habits existed during this week.',
  'fieldNotes.tasksCompleted': 'tasks completed',
  'fieldNotes.graphs': 'graphs',
  'fieldNotes.habitTooYoung': 'habit is too young',
  'fieldNotes.graphLabel': '{habit}, completions {zoom}',

  // The arrival shelf — the drops waiting to be dealt with.
  'arrivals.region': 'arrivals',
  'arrivals.hold': 'click to hold',
  'arrivals.gather': 'gather',
  'arrivals.leave': 'leave it',
  'arrivals.readNow': 'read now',
  'arrivals.readLater': 'read later',

  // The Abode.
  'abode.ground': 'the ground',
  'abode.waitingToDecide': 'waiting to decide',
  'abode.floraFind': 'a flora find',
  'abode.visitingFriend': 'a visiting friend',
  'abode.partyMode': 'party mode',
  'abode.quietude': 'quietude',
  'abode.pickMood': 'pick your mood',
  'abode.notYet': 'not yet',
  'abode.curiosity': 'a curiosity',
  'abode.sell': 'sell',
  'abode.compost': 'compost',
  'abode.sky': 'Abode sky',
  'abode.skyLabel': 'Abode sky, {palette}',

  // The Map.
  'map.planet': 'the planet, region by region',

  // The Market.
  'market.stall': 'the stall',
  'market.buy': 'buy',
  'market.buyLabel': 'buy a curiosity for {price} fungi',

  // The library and the reading popup.
  'bookcase.shelf': 'the bookshelf',
  'bookcase.read': 'read {label}',
  'bookcase.spread': 'the open double-page spread of {label}',
  'bookcase.close': 'close',

  // The Guest Book.
  'guestbook.friends': 'friends',
  'guestbook.unnamedFriend': 'friend',
  'guestbook.close': 'close',

  // The reveals — the screen-reader names for the popups themselves.
  // The words INSIDE them are story, and live in narration.js.
  'reveal.firstArrival': 'a first arrival',
  'reveal.friendArrives': 'a friend arrives',
  'reveal.onward': 'onward',
  'reveal.dropArrival': 'drop arrival',

  // Backup and restore, at the foot of the habit list and the field
  // notes. The `.age` slots are the hover on the export pebble — how
  // stale the safety copy is.
  'backup.export': 'export backup',
  'backup.import': 'import backup',
  'backup.file': 'backup file',
  'backup.ageNone': 'no backup yet',
  'backup.ageFuture': 'backed up',
  'backup.ageToday': 'backed up today',
  'backup.ageYesterday': 'backed up yesterday',
  'backup.ageDays': 'backed up {days} days ago',

  // Starting over. Two doors, each with its plain warning and its
  // afterword.
  'newGame.start': 'start a new game',
  'newGame.which': 'which type of restart?',
  'newGame.refresh': 'total refresh',
  'newGame.keep': 'keep habit data',
  'newGame.notNow': 'not now',
  'newGame.sure': 'are you sure?',
  'newGame.yes': 'yes',
  'newGame.no': 'no, take me back',
  'newGame.backupFirst': 'export a backup first',
  'newGame.refreshWarning':
    'everything will be wiped: habits, completions, and game progress. ' +
    'habitat will restart from day one. only a backup file you have ' +
    'already exported can bring any of it back.',
  'newGame.keepWarning':
    'your gameplay will be wiped: flora, books, friends, fungi and ' +
    'expedition progress. your historical habit data, streaks and graphs ' +
    'will remain.',
  'newGame.refreshDone':
    'a new habitat has begun — everything starts from here',
  'newGame.keepDone':
    'a new game has begun — your habits and history are untouched',

  // The temporary door to the design workbench at the foot of the home
  // screen. The workbench BEHIND it is a working tool, not part of the
  // game, and stays in English — but its door is on a page a player
  // sees, so the door itself is copy.
  'design.door': 'design assets',

  // The language switch itself. Deliberately NOT translated in the fa
  // block below: each language names itself in its own script, so the
  // control reads the same whichever language is on, and you can always
  // find your way back.
  'language.switch': 'language',
  'language.en': 'English',
  'language.fa': 'فارسی',
}

// ── FARSI ───────────────────────────────────────────────────────────
// TODO: written by Kimia.
//
// Every slot starts blank, and a blank slot shows the English word
// above. So this file is safe to fill a little at a time, in any order,
// and the app never breaks halfway.
//
// Two slots are deliberately pre-filled: 'language.en' and
// 'language.fa'. Each language names itself in its own script in BOTH
// blocks, so the switch reads identically either way and there is always
// a way back.
const fa = {
  'app.wordmark': '',

  'rail.pages': '',
  'rail.addHabit': '',
  'rail.editPastDays': '',
  'rail.fieldNotes': '',

  'page.map': '',
  'page.abode': '',
  'page.guestbook': '',
  'page.bookcase': '',
  'page.market': '',
  'page.fieldNotes': '',

  'meters.region': '',
  'meters.steps': '',
  'meters.stepsBar': '',
  'meters.literacy': '',
  'meters.literacyBar': '',
  'meters.wallet': '',
  'meters.walletBar': '',

  'habits.filterView': '',
  'habits.markDone': '',
  'habits.edit': '',
  'habits.archive': '',
  'habits.unarchive': '',
  'habits.deleteForever': '',

  'habitForm.name': '',
  'habitForm.detail': '',
  'habitForm.difficulty': '',
  'habitForm.schedule': '',
  'habitForm.howMany': '',
  'habitForm.save': '',
  'habitForm.cancel': '',

  'checkin.region': '',
  'checkin.prompt': '',
  'checkin.earlierDays': '',
  'checkin.noHabits': '',
  'checkin.done': '',

  'fieldNotes.nothingYet': '',
  'fieldNotes.stillUnfolding': '',
  'fieldNotes.noHabitsThatWeek': '',
  'fieldNotes.tasksCompleted': '',
  'fieldNotes.graphs': '',
  'fieldNotes.habitTooYoung': '',
  'fieldNotes.graphLabel': '',

  'arrivals.region': '',
  'arrivals.hold': '',
  'arrivals.gather': '',
  'arrivals.leave': '',
  'arrivals.readNow': '',
  'arrivals.readLater': '',

  'abode.ground': '',
  'abode.waitingToDecide': '',
  'abode.floraFind': '',
  'abode.visitingFriend': '',
  'abode.partyMode': '',
  'abode.quietude': '',
  'abode.pickMood': '',
  'abode.notYet': '',
  'abode.curiosity': '',
  'abode.sell': '',
  'abode.compost': '',
  'abode.sky': '',
  'abode.skyLabel': '',

  'map.planet': '',

  'market.stall': '',
  'market.buy': '',
  'market.buyLabel': '',

  'bookcase.shelf': '',
  'bookcase.read': '',
  'bookcase.spread': '',
  'bookcase.close': '',

  'guestbook.friends': '',
  'guestbook.unnamedFriend': '',
  'guestbook.close': '',

  'reveal.firstArrival': '',
  'reveal.friendArrives': '',
  'reveal.onward': '',
  'reveal.dropArrival': '',

  'backup.export': '',
  'backup.import': '',
  'backup.file': '',
  'backup.ageNone': '',
  'backup.ageFuture': '',
  'backup.ageToday': '',
  'backup.ageYesterday': '',
  'backup.ageDays': '',

  'newGame.start': '',
  'newGame.which': '',
  'newGame.refresh': '',
  'newGame.keep': '',
  'newGame.notNow': '',
  'newGame.sure': '',
  'newGame.yes': '',
  'newGame.no': '',
  'newGame.backupFirst': '',
  'newGame.refreshWarning': '',
  'newGame.keepWarning': '',
  'newGame.refreshDone': '',
  'newGame.keepDone': '',

  'design.door': '',

  // Pre-filled on purpose — see the note above this block.
  'language.switch': '',
  'language.en': 'English',
  'language.fa': 'فارسی',
}

export const UI = { en, fa }

// The languages Habitat speaks, in the order the switch offers them.
// 'en' first because it is the fallback: the one block that must never
// have a blank in it.
export const LANGUAGES = ['en', 'fa']
export const DEFAULT_LANGUAGE = 'en'

// Is this a language Habitat actually speaks?
export function isLanguage(value) {
  return LANGUAGES.includes(value)
}

// Fill the {holes} in a slot: fill('read {label}', { label: 'a novel' })
// becomes 'read a novel'. A hole with no matching value is left exactly
// as it is rather than becoming the word "undefined" — a visible {label}
// on screen is a bug that announces itself, which is the kinder failure.
function fill(text, vars) {
  if (!vars) return text
  return text.replace(/\{(\w+)\}/g, (whole, name) =>
    name in vars ? String(vars[name]) : whole,
  )
}

// THE TRANSLATOR. Look the key up in the chosen language; if that slot
// is blank — or missing, or the language is one we don't speak — fall
// back to English, the block guaranteed to be complete. This is the
// fallback rule described at the top of this file, and it is the whole
// reason Farsi can be filled in one slot at a time.
//
// A key that exists in NEITHER block is a mistake in the code, not in
// the content, so it returns the key itself: 'market.byu' appearing on
// screen points straight at the typo, where silence would just look like
// a missing feature.
//
// It lives HERE, beside the catalogue it reads, rather than in the React
// plumbing: the storage module and the backup label both need it, and
// neither may import React.
export function translate(language, key, vars) {
  const chosen = UI[language]?.[key]
  const english = UI[DEFAULT_LANGUAGE][key]
  const text = chosen || english
  if (text === undefined) return key
  return fill(text, vars)
}
