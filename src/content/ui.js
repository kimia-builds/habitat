// ui.js — every word the INTERFACE says, in one file: the copy deck's
// interface section.
//
// This file holds the FURNITURE (what the buttons, labels and page
// titles say). narration.js holds the STORY. They are written in
// different voices, so they are still separate files for now.
//
// THIS FILE IS KIMIA'S, like every other file in src/content/
// (design-notes §7). Claude Code builds the keyed slots and the
// plumbing; the words are human-written.
//
// ── HOW EACH ENTRY LOOKS ────────────────────────────────────────────
//
//   'market.buy': {
//     note: 'Button to buy a curiosity.',
//     en: 'buy',
//     fa: '',
//   },
//
// One entry per piece of copy. The `note` says in plain English what it
// is and where it shows, so you never have to hunt through the app to
// find a word. Each language sits right beside the others: to add a
// language, add one line (`de: ''`) to every entry. Notes are for
// people; the app never shows them.
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
// machine's guess. English itself must never be blank.
//
// ── HOW TO TRANSLATE ────────────────────────────────────────────────
//
// Find the entry you want and put your words between the quotes of its
// `fa:` line. That's the whole job. Two slots are pre-filled on purpose:
// 'language.en' and 'language.fa' — each language names itself in its
// own script, so the language switch reads the same in either language
// and there is always a way back.
//
// ── ABOUT THE KEYS ('rail.pages', 'meters.steps', …) ────────────────
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

const DECK = {
  // ── The left icon rail ────────────────────────────────────────────────
  'rail.pages': {
    note:
      'Hover label and screen-reader name for the rail icon that opens the ' +
      'habit list.',
    en: 'pages',
    fa: '',
  },
  'rail.addHabit': {
    note:
      'Hover label and screen-reader name for the rail icon that opens a ' +
      'new-habit form.',
    en: 'add new habit',
    fa: '',
  },
  'rail.editPastDays': {
    note:
      'Hover label and screen-reader name for the rail icon that opens the ' +
      'morning check-in for earlier days.',
    en: 'edit past days',
    fa: '',
  },
  'rail.fieldNotes': {
    note:
      'Hover label and screen-reader name for the rail icon that opens the ' +
      'field notes (history).',
    en: 'view historical data',
    fa: '',
  },

  // ── Page titles ───────────────────────────────────────────────────────
  'page.map': {
    note:
      'Title of the Map page. Shows on its rail icon and at the top of the ' +
      'page.',
    en: 'map of N-Z-D',
    fa: '',
  },
  'page.abode': {
    note:
      'Title of the Abode page. Shows on its rail icon and at the top of the ' +
      'page.',
    en: 'your abode',
    fa: '',
  },
  'page.guestbook': {
    note:
      'Title of the Guest Book page. Shows on its rail icon and at the top ' +
      'of the page.',
    en: 'local community',
    fa: '',
  },
  'page.bookcase': {
    note:
      'Title of the library page. Shows on its rail icon and at the top of ' +
      'the page.',
    en: 'readers library',
    fa: '',
  },
  'page.market': {
    note:
      'Title of the Market page. Shows on its rail icon and at the top of ' +
      'the page.',
    en: 'local market',
    fa: '',
  },
  'page.fieldNotes': {
    note:
      'Title of the field notes page. Shows on its rail icon and at the top ' +
      'of the page.',
    en: 'field notes',
    fa: '',
  },

  // ── The three meters ──────────────────────────────────────────────────
  'meters.region': {
    note: 'Screen-reader name for the group of three meters at the top.',
    en: 'meters',
    fa: '',
  },
  'meters.steps': {
    note: 'Name of the steps meter. Hover label and screen-reader name.',
    en: 'steps taken',
    fa: '',
  },
  'meters.stepsBar': {
    note: 'Screen-reader-only name for the moving bar of the steps meter.',
    en: 'steps taken progress',
    fa: '',
  },
  'meters.literacy': {
    note: 'Name of the literacy meter. Hover label and screen-reader name.',
    en: 'literacy level',
    fa: '',
  },
  'meters.literacyBar': {
    note: 'Screen-reader-only name for the moving bar of the literacy meter.',
    en: 'literacy level progress',
    fa: '',
  },
  'meters.wallet': {
    note: 'Name of the wallet meter. Hover label and screen-reader name.',
    en: 'wallet balance',
    fa: '',
  },
  'meters.walletBar': {
    note: 'Screen-reader-only name for the moving bar of the wallet meter.',
    en: 'wallet balance progress',
    fa: '',
  },

  // ── The habit list and its tiles ──────────────────────────────────────
  'habits.filterView': {
    note: 'Label of the control that opens the lens choices above the habit list.',
    en: 'filter view',
    fa: '',
  },
  'habits.markDone': {
    note: "Hover label on a habit tile's tick, to mark it done.",
    en: 'mark done',
    fa: '',
  },
  'habits.mute': {
    note: 'Quiet word on a habit tile that hides it from today.',
    en: 'mute',
    fa: '',
  },
  'habits.unmute': {
    note: 'Quiet word on a muted habit tile that brings it back.',
    en: 'unmute',
    fa: '',
  },
  'habits.edit': {
    note: 'Quiet word on a habit tile that opens it for editing.',
    en: 'edit',
    fa: '',
  },
  'habits.archive': {
    note: 'Quiet word on a habit tile that tucks it into the archive.',
    en: 'archive',
    fa: '',
  },
  'habits.unarchive': {
    note: 'Quiet word on an archived habit that brings it back to the list.',
    en: 'unarchive',
    fa: '',
  },
  'habits.deleteForever': {
    note: 'Quiet word on an archived habit that deletes it for good (asks first).',
    en: 'delete forever',
    fa: '',
  },
  'habits.unhideToReorder': {
    note:
      'Hover explanation of why a tile will not move while anything is ' +
      'hidden by a charm or a lens.',
    en: 'un-hide everything to re-order',
    fa: '',
  },

  // ── The lenses (ways of looking at the habit list) ────────────────────
  'lens.today': {
    note: 'Lens button: show only what is due today.',
    en: 'today',
    fa: '',
  },
  'lens.todos': {
    note: 'Lens button: show only one-time to-dos.',
    en: 'to-dos',
    fa: '',
  },
  'lens.prioritise': {
    note: 'Lens button: show habits in priority order.',
    en: 'prioritise',
    fa: '',
  },
  'lens.unhideAll': {
    note: 'Lens button: clear every hiding lens and charm.',
    en: 'un-hide all',
    fa: '',
  },
  'lens.saveAsDefault': {
    note:
      'Hover label and screen-reader name of the padlock. Never shown as ' +
      'text on screen.',
    en: 'save as default view',
    fa: '',
  },
  'lens.saveAsDefaultConfirm': {
    note: 'Question asked before the padlock overwrites the saved default view.',
    en:
      'are you sure you want to save this as your default view? any previous ' +
      'default view choices will be lost. refresh the page to go back to ' +
      'previous default view.',
    fa: '',
  },

  // ── The habit form ────────────────────────────────────────────────────
  'habitForm.name': {
    note: 'First prompt of the habit form, above the name box.',
    en: 'write a good habit or task:',
    fa: '',
  },
  'habitForm.detail': {
    note: 'Second prompt of the habit form, above the details box.',
    en: 'add any details or specifications:',
    fa: '',
  },
  'habitForm.difficulty': {
    note: 'Third prompt of the habit form, above the difficulty choices.',
    en: 'pick a difficulty per unit:',
    fa: '',
  },
  'habitForm.schedule': {
    note: 'Fourth prompt of the habit form, above the schedule choices.',
    en: 'specify the desired schedule or frequency:',
    fa: '',
  },
  'habitForm.howMany': {
    note: 'Label of the small number box for "n days a week" or "n times a day".',
    en: 'how many',
    fa: '',
  },
  'habitForm.save': {
    note: 'Habit form button that saves the habit.',
    en: 'save',
    fa: '',
  },
  'habitForm.cancel': {
    note: 'Habit form button that closes the form without saving.',
    en: 'cancel',
    fa: '',
  },

  // ── The morning check-in ──────────────────────────────────────────────
  'checkin.region': {
    note: 'Screen-reader name for the morning check-in panel.',
    en: 'check-in',
    fa: '',
  },
  'checkin.prompt': {
    note: 'The question at the top of the morning check-in.',
    en: 'what did you do yesterday?',
    fa: '',
  },
  'checkin.earlierDays': {
    note:
      'Line above the earlier days of this week in the check-in, warning ' +
      'they will soon freeze.',
    en: 'update earlier days of this week before they freeze forever:',
    fa: '',
  },
  'checkin.noHabits': {
    note: 'Shown in the check-in when a day has no habits due.',
    en: 'no habits to show for this day',
    fa: '',
  },
  'checkin.done': {
    note: 'Check-in button that finishes the check-in.',
    en: 'done',
    fa: '',
  },

  // ── The field notes ───────────────────────────────────────────────────
  'fieldNotes.nothingYet': {
    note: 'Shown on the field notes when no days are recorded yet.',
    en: 'nothing recorded yet',
    fa: '',
  },
  'fieldNotes.stillUnfolding': {
    note: 'Label on a week that has not finished.',
    en: 'still unfolding',
    fa: '',
  },
  'fieldNotes.noHabitsThatWeek': {
    note: 'Shown on a week in the field notes in which no habits existed.',
    en: 'No habits existed during this week.',
    fa: '',
  },
  'fieldNotes.tasksCompleted': {
    note: 'Heading of the tasks-completed section of the field notes.',
    en: 'tasks completed',
    fa: '',
  },
  'fieldNotes.graphs': {
    note: 'Heading of the graphs section of the field notes.',
    en: 'graphs',
    fa: '',
  },
  'fieldNotes.habitTooYoung': {
    note: 'Shown instead of a graph for a habit that has too little history.',
    en: 'habit is too young',
    fa: '',
  },
  'fieldNotes.graphLabel': {
    note:
      "Screen-reader name of one habit's graph. {habit} is its name, {zoom} " +
      'the zoom choice.',
    en: '{habit}, completions {zoom}',
    fa: '',
  },
  'cameo.open': {
    note:
      "Screen-reader name of a friend's visit that opens the record it is " +
      'about. Never shown.',
    en: 'see the record this is about',
    fa: '',
  },
  'fieldNotes.streak': {
    note:
      "Streak beside a week's row and in the spotlight. {n} is a number, " +
      '{unit} one of the two unit words below.',
    en: '{n}-{unit} streak',
    fa: '',
  },
  'fieldNotes.unitDay': {
    note: 'The word "day" inside a streak.',
    en: 'day',
    fa: '',
  },
  'fieldNotes.unitWeek': {
    note: 'The word "week" inside a streak.',
    en: 'week',
    fa: '',
  },
  'fieldNotes.spotlightTitle': {
    note:
      "Announcement of the blackout a friend's visit opens when a record " +
      'fell.',
    en: 'a record fell today',
    fa: '',
  },
  'fieldNotes.spotlightDismiss': {
    note: 'Button that closes that blackout and returns to the week.',
    en: 'close and see the week',
    fa: '',
  },

  // ── The arrival shelf ─────────────────────────────────────────────────
  'arrivals.region': {
    note: 'Screen-reader name for the shelf of drops waiting to be dealt with.',
    en: 'arrivals',
    fa: '',
  },
  'arrivals.hold': {
    note: 'Hover label on a drop: click to pick it up.',
    en: 'click to hold',
    fa: '',
  },
  'arrivals.gather': {
    note: 'Button to take a drop into the Abode.',
    en: 'gather',
    fa: '',
  },
  'arrivals.leave': {
    note: 'Button to leave a drop behind.',
    en: 'leave it',
    fa: '',
  },
  'arrivals.readNow': {
    note: 'Button to open an arrived book and read it now.',
    en: 'read now',
    fa: '',
  },
  'arrivals.readLater': {
    note: 'Button to shelve an arrived book for later.',
    en: 'read later',
    fa: '',
  },

  // ── The Abode ─────────────────────────────────────────────────────────
  'abode.ground': {
    note: "Screen-reader name for the Abode's ground.",
    en: 'the ground',
    fa: '',
  },
  'abode.waitingToDecide': {
    note:
      'Caption over items that have arrived but are not yet placed or sent ' +
      'away.',
    en: 'waiting to decide',
    fa: '',
  },
  'abode.floraFind': {
    note: 'Name of a flora drop in the Abode.',
    en: 'a flora find',
    fa: '',
  },
  'abode.visitingFriend': {
    note: 'Name of a friend who is visiting.',
    en: 'a visiting friend',
    fa: '',
  },
  'abode.partyMode': {
    note: 'Mood name: party.',
    en: 'party mode',
    fa: '',
  },
  'abode.quietude': {
    note: 'Mood name: quiet.',
    en: 'quietude',
    fa: '',
  },
  'abode.pickMood': {
    note: 'Prompt above the mood choices.',
    en: 'pick your mood',
    fa: '',
  },
  'abode.notYet': {
    note: 'Quiet word on a held item to put it down for now.',
    en: 'not yet',
    fa: '',
  },
  'abode.curiosity': {
    note: 'Name of a curiosity in the Abode.',
    en: 'a curiosity',
    fa: '',
  },
  'abode.sell': {
    note: 'Quiet word under a held item: sell it.',
    en: 'sell',
    fa: '',
  },
  'abode.compost': {
    note: 'Quiet word under a held item: compost it.',
    en: 'compost',
    fa: '',
  },
  'abode.rotate': {
    note: 'Quiet word under a held item: turn it.',
    en: 'rotate',
    fa: '',
  },
  'abode.turnSave': {
    note:
      "Replaces the held item's words while it is being turned: keep the " +
      'turn.',
    en: 'save',
    fa: '',
  },
  'abode.turnCancel': {
    note:
      "Replaces the held item's words while it is being turned: undo the " +
      'turn.',
    en: 'cancel',
    fa: '',
  },
  'abode.sky': {
    note: 'Name of the sky control in the Abode.',
    en: 'Abode sky',
    fa: '',
  },
  'abode.skyLabel': {
    note: "Screen-reader name of one sky swatch. {palette} is that sky's name.",
    en: 'Abode sky, {palette}',
    fa: '',
  },
  'abode.pickSky': {
    note: 'Prompt above the four sky swatches.',
    en: 'pick your sky',
    fa: '',
  },
  'abode.sky.ember': {
    note:
      'Name of the ember sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'ember',
    fa: '',
  },
  'abode.sky.teal': {
    note:
      'Name of the teal sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'teal',
    fa: '',
  },
  'abode.sky.violet': {
    note:
      'Name of the violet sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'violet',
    fa: '',
  },
  'abode.sky.ash': {
    note: 'Name of the ash sky. Only what the swatch says; a save stores its key.',
    en: 'ash',
    fa: '',
  },

  // ── The Map ───────────────────────────────────────────────────────────
  'map.planet': {
    note: 'Screen-reader name for the planet shown on the Map.',
    en: 'the planet, region by region',
    fa: '',
  },

  // ── The Market ────────────────────────────────────────────────────────
  'market.stall': {
    note: 'Screen-reader name for the stall of curiosities.',
    en: 'the stall',
    fa: '',
  },
  'market.buy': {
    note: 'Button to buy a curiosity.',
    en: 'buy',
    fa: '',
  },
  'market.buyLabel': {
    note: 'Screen-reader name of the buy button. {price} is the cost in fungi.',
    en: 'buy a curiosity for {price} fungi',
    fa: '',
  },

  // ── The library and the reading popup ─────────────────────────────────
  'bookcase.shelf': {
    note: 'Screen-reader name for the bookshelf.',
    en: 'the bookshelf',
    fa: '',
  },
  'bookcase.read': {
    note: 'Screen-reader name of a book you can open. {label} is the book.',
    en: 'read {label}',
    fa: '',
  },
  'bookcase.spread': {
    note: 'Screen-reader name of the open two-page view. {label} is the book.',
    en: 'the open double-page spread of {label}',
    fa: '',
  },
  'bookcase.close': {
    note: 'Button that closes the reading popup.',
    en: 'close',
    fa: '',
  },

  // ── The Guest Book ────────────────────────────────────────────────────
  'guestbook.friends': {
    note: 'Screen-reader name for the list of friends.',
    en: 'friends',
    fa: '',
  },
  'guestbook.unnamedFriend': {
    note: 'Stand-in name for a friend who has no name yet.',
    en: 'friend',
    fa: '',
  },
  'guestbook.close': {
    note: "Button that closes a friend's card.",
    en: 'close',
    fa: '',
  },

  // ── The reveal popups (names only; the words inside are story) ────────
  'reveal.firstArrival': {
    note: 'Screen-reader name of the popup for the very first arrival.',
    en: 'a first arrival',
    fa: '',
  },
  'reveal.friendArrives': {
    note: 'Screen-reader name of the popup when a friend arrives.',
    en: 'a friend arrives',
    fa: '',
  },
  'reveal.onward': {
    note: 'Button that dismisses a reveal popup and goes on.',
    en: 'onward',
    fa: '',
  },
  'reveal.dropArrival': {
    note: 'Screen-reader name of the popup for an ordinary drop arriving.',
    en: 'drop arrival',
    fa: '',
  },

  // ── Backup and restore ────────────────────────────────────────────────
  'backup.export': {
    note: 'Pebble that saves a backup file.',
    en: 'export backup',
    fa: '',
  },
  'backup.import': {
    note: 'Pebble that loads a backup file.',
    en: 'import backup',
    fa: '',
  },
  'backup.file': {
    note: 'Screen-reader name of the file chooser behind the import pebble.',
    en: 'backup file',
    fa: '',
  },
  'backup.ageNone': {
    note: 'Hover on the export pebble when no backup was ever made.',
    en: 'no backup yet',
    fa: '',
  },
  'backup.ageFuture': {
    note:
      'Hover on the export pebble when the backup date is in the future ' +
      '(clock oddity).',
    en: 'backed up',
    fa: '',
  },
  'backup.ageToday': {
    note: 'Hover on the export pebble: last backup was today.',
    en: 'backed up today',
    fa: '',
  },
  'backup.ageYesterday': {
    note: 'Hover on the export pebble: last backup was yesterday.',
    en: 'backed up yesterday',
    fa: '',
  },
  'backup.ageDays': {
    note: 'Hover on the export pebble: last backup was {days} days ago.',
    en: 'backed up {days} days ago',
    fa: '',
  },

  // ── Starting over ─────────────────────────────────────────────────────
  'newGame.start': {
    note: 'Pebble that opens the start-a-new-game popup.',
    en: 'start a new game',
    fa: '',
  },
  'newGame.which': {
    note: 'Heading above the two restart doors.',
    en: 'which type of restart?',
    fa: '',
  },
  'newGame.refresh': {
    note: 'Door that wipes everything and starts again.',
    en: 'total refresh',
    fa: '',
  },
  'newGame.keep': {
    note: 'Door that wipes the game but keeps habit data.',
    en: 'keep habit data',
    fa: '',
  },
  'newGame.notNow': {
    note: 'Button that closes the popup without doing anything.',
    en: 'not now',
    fa: '',
  },
  'newGame.sure': {
    note: 'Confirmation question after choosing a restart door.',
    en: 'are you sure?',
    fa: '',
  },
  'newGame.yes': {
    note: 'Answer: go ahead with the restart.',
    en: 'yes',
    fa: '',
  },
  'newGame.no': {
    note: 'Answer: step back from the restart.',
    en: 'no, take me back',
    fa: '',
  },
  'newGame.backupFirst': {
    note: 'Button to export a backup before restarting.',
    en: 'export a backup first',
    fa: '',
  },
  'newGame.refreshWarning': {
    note: 'Plain warning under the total-refresh door.',
    en:
      'everything will be wiped: habits, completions, and game progress. ' +
      'habitat will restart from day one. only a backup file you have ' +
      'already exported can bring any of it back.',
    fa: '',
  },
  'newGame.keepWarning': {
    note: 'Plain warning under the keep-habit-data door.',
    en:
      'your gameplay will be wiped: flora, books, friends, fungi and ' +
      'expedition progress. your historical habit data, streaks and graphs ' +
      'will remain.',
    fa: '',
  },
  'newGame.refreshDone': {
    note: 'Afterword shown once a total refresh has happened.',
    en: 'a new habitat has begun — everything starts from here',
    fa: '',
  },
  'newGame.keepDone': {
    note: 'Afterword shown once a game-only restart has happened.',
    en: 'a new game has begun — your habits and history are untouched',
    fa: '',
  },

  // ── Words several pages share ─────────────────────────────────────────
  'nav.backToHabits': {
    note:
      'Link back to the habit list. The arrow is drawn by the page, not part ' +
      'of the words.',
    en: 'back to the habits',
    fa: '',
  },
  'nav.earlier': {
    note:
      'Button to move to an earlier page of days. The arrow is drawn by the ' +
      'page.',
    en: 'earlier',
    fa: '',
  },
  'nav.later': {
    note:
      'Button to move to a later page of days. The arrow is drawn by the ' +
      'page.',
    en: 'later',
    fa: '',
  },

  // ── The date line and the clock ───────────────────────────────────────
  'date.line': {
    note:
      'Order of the date line at the top of the home screen. Holes: ' +
      '{weekday} {day} {month} {year}. Move them to suit the grammar.',
    en: '{weekday} {day} {month} {year}',
    fa: '',
  },
  'weekday.mon.long': {
    note: 'Monday, in full, on the date line.',
    en: 'MONDAY',
    fa: '',
  },
  'weekday.tue.long': {
    note: 'Tuesday, in full, on the date line.',
    en: 'TUESDAY',
    fa: '',
  },
  'weekday.wed.long': {
    note: 'Wednesday, in full, on the date line.',
    en: 'WEDNESDAY',
    fa: '',
  },
  'weekday.thu.long': {
    note: 'Thursday, in full, on the date line.',
    en: 'THURSDAY',
    fa: '',
  },
  'weekday.fri.long': {
    note: 'Friday, in full, on the date line.',
    en: 'FRIDAY',
    fa: '',
  },
  'weekday.sat.long': {
    note: 'Saturday, in full, on the date line.',
    en: 'SATURDAY',
    fa: '',
  },
  'weekday.sun.long': {
    note: 'Sunday, in full, on the date line.',
    en: 'SUNDAY',
    fa: '',
  },
  'month.jan': {
    note: 'January, on the date line.',
    en: 'JAN',
    fa: '',
  },
  'month.feb': {
    note: 'February, on the date line.',
    en: 'FEB',
    fa: '',
  },
  'month.mar': {
    note: 'March, on the date line.',
    en: 'MAR',
    fa: '',
  },
  'month.apr': {
    note: 'April, on the date line.',
    en: 'APR',
    fa: '',
  },
  'month.may': {
    note: 'May, on the date line.',
    en: 'MAY',
    fa: '',
  },
  'month.jun': {
    note: 'June, on the date line.',
    en: 'JUN',
    fa: '',
  },
  'month.jul': {
    note: 'July, on the date line.',
    en: 'JUL',
    fa: '',
  },
  'month.aug': {
    note: 'August, on the date line.',
    en: 'AUG',
    fa: '',
  },
  'month.sep': {
    note: 'September, on the date line.',
    en: 'SEP',
    fa: '',
  },
  'month.oct': {
    note: 'October, on the date line.',
    en: 'OCT',
    fa: '',
  },
  'month.nov': {
    note: 'November, on the date line.',
    en: 'NOV',
    fa: '',
  },
  'month.dec': {
    note: 'December, on the date line.',
    en: 'DEC',
    fa: '',
  },
  'date.cutoffNote': {
    note:
      'Note under the date, shown only between midnight and the day cutoff. ' +
      '{time} is one of the two hour forms below.',
    en: 'your habits will switch to a new day at {time}',
    fa: '',
  },
  'time.hourAm': {
    note: 'An hour before noon, e.g. "4 a.m.". {hour} is the number.',
    en: '{hour} a.m.',
    fa: '',
  },
  'time.hourPm': {
    note: 'An hour after noon, e.g. "4 p.m.". {hour} is the number.',
    en: '{hour} p.m.',
    fa: '',
  },

  // ── Weekday names, short and tiny ─────────────────────────────────────
  'weekday.mon.short': {
    note:
      "Monday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'mon',
    fa: '',
  },
  'weekday.tue.short': {
    note:
      "Tuesday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'tue',
    fa: '',
  },
  'weekday.wed.short': {
    note:
      "Wednesday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'wed',
    fa: '',
  },
  'weekday.thu.short': {
    note:
      "Thursday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'thu',
    fa: '',
  },
  'weekday.fri.short': {
    note:
      "Friday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'fri',
    fa: '',
  },
  'weekday.sat.short': {
    note:
      "Saturday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'sat',
    fa: '',
  },
  'weekday.sun.short': {
    note:
      "Sunday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'sun',
    fa: '',
  },
  'weekday.mon.tiny': {
    note: 'Monday, two letters: column head in the field notes.',
    en: 'mo',
    fa: '',
  },
  'weekday.tue.tiny': {
    note: 'Tuesday, two letters: column head in the field notes.',
    en: 'tu',
    fa: '',
  },
  'weekday.wed.tiny': {
    note: 'Wednesday, two letters: column head in the field notes.',
    en: 'we',
    fa: '',
  },
  'weekday.thu.tiny': {
    note: 'Thursday, two letters: column head in the field notes.',
    en: 'th',
    fa: '',
  },
  'weekday.fri.tiny': {
    note: 'Friday, two letters: column head in the field notes.',
    en: 'fr',
    fa: '',
  },
  'weekday.sat.tiny': {
    note: 'Saturday, two letters: column head in the field notes.',
    en: 'sa',
    fa: '',
  },
  'weekday.sun.tiny': {
    note: 'Sunday, two letters: column head in the field notes.',
    en: 'su',
    fa: '',
  },

  // ── Schedules and difficulty ──────────────────────────────────────────
  'schedule.daily': {
    note: 'Schedule choice in the habit form: every day.',
    en: 'every day',
    fa: '',
  },
  'schedule.weekdays': {
    note: 'Schedule choice in the habit form: pick the days.',
    en: 'specific weekdays',
    fa: '',
  },
  'schedule.nPerWeek': {
    note: 'Schedule choice in the habit form: a number of days each week.',
    en: 'n days a week',
    fa: '',
  },
  'schedule.nPerDay': {
    note: 'Schedule choice in the habit form: a number of times each day.',
    en: 'n times a day',
    fa: '',
  },
  'schedule.whenever': {
    note:
      'Schedule choice in the habit form: no fixed schedule. Also the ' +
      "tile's summary line.",
    en: 'whenever',
    fa: '',
  },
  'schedule.oneTime': {
    note: 'Schedule choice in the habit form: a one-time to-do.',
    en: 'one-time (a to-do)',
    fa: '',
  },
  'schedule.summary.nPerWeek': {
    note: 'Habit tile\'s summary line for "n days a week". {n} is the number.',
    en: '{n}×/week',
    fa: '',
  },
  'schedule.summary.nPerDay': {
    note: 'Habit tile\'s summary line for "n times a day". {n} is the number.',
    en: '{n}×/day',
    fa: '',
  },
  'schedule.summary.oneTime': {
    note: "Habit tile's summary line for a one-time to-do.",
    en: 'one-time',
    fa: '',
  },
  'difficulty.easy': {
    note: 'Easiest difficulty choice in the habit form.',
    en: 'easy',
    fa: '',
  },
  'difficulty.medium': {
    note: 'Middle difficulty choice in the habit form.',
    en: 'medium',
    fa: '',
  },
  'difficulty.difficult': {
    note: 'Hardest difficulty choice in the habit form.',
    en: 'difficult',
    fa: '',
  },

  // ── Graph zoom choices ────────────────────────────────────────────────
  'fieldNotes.zoom.day': {
    note: 'Graph zoom choice: one point per day.',
    en: 'day by day',
    fa: '',
  },
  'fieldNotes.zoom.week': {
    note: 'Graph zoom choice: one point per week.',
    en: 'week by week',
    fa: '',
  },
  'fieldNotes.zoom.fourWeek': {
    note: 'Graph zoom choice: one point per four weeks.',
    en: '4 weeks at a time',
    fa: '',
  },

  // ── Small habit-list words ────────────────────────────────────────────
  'habits.addPlaceholder': {
    note: 'Invitation written in the empty tile at the end of the habit list.',
    en: 'add a habit or task…',
    fa: '',
  },
  'habits.archivedTag': {
    note: "Small tag beside an archived habit's name.",
    en: '(archived)',
    fa: '',
  },
  'habits.archivedHeading': {
    note: 'Heading of the archived drawer. {n} is how many are archived.',
    en: 'archived ({n})',
    fa: '',
  },
  'habits.doneOn': {
    note: 'Line on a finished to-do. {day} is the date it was done.',
    en: 'done {day}',
    fa: '',
  },

  // ── Counted units ─────────────────────────────────────────────────────
  'count.day.one': {
    note: 'A count of one day. {n} is the number.',
    en: '{n} day',
    fa: '',
  },
  'count.day.other': {
    note:
      'A count of several days. A language without plurals can fill both the ' +
      'same.',
    en: '{n} days',
    fa: '',
  },
  'count.week.one': {
    note: 'A count of one week.',
    en: '{n} week',
    fa: '',
  },
  'count.week.other': {
    note: 'A count of several weeks.',
    en: '{n} weeks',
    fa: '',
  },

  // ── Confirm questions ─────────────────────────────────────────────────
  'habits.scheduleChangeConfirm': {
    note:
      'Question before a schedule edit that restarts the streak. {habit} is ' +
      'the name, {streak} a counted unit above.',
    en:
      'heads up: this schedule change switches how "{habit}"\'s streak is ' +
      'counted, so the current streak ({streak}) starts fresh from today. ' +
      'save anyway?',
    fa: '',
  },
  'habits.deleteConfirm': {
    note: 'Question before a habit is deleted for good. {habit} is its name.',
    en:
      'delete "{habit}" forever? its whole history goes with it. archiving ' +
      '(already done) keeps the history.',
    fa: '',
  },

  // ── Importing a backup ────────────────────────────────────────────────
  'backup.importConfirm': {
    note: 'Question before an import replaces everything.',
    en:
      'importing replaces EVERYTHING currently in habitat with the backup ' +
      'file. continue?',
    fa: '',
  },
  'backup.importCancelled': {
    note: 'Shown after the import question is answered no.',
    en: 'import cancelled — nothing was changed',
    fa: '',
  },
  'backup.imported': {
    note: 'Shown after a backup is imported successfully.',
    en: 'backup imported',
    fa: '',
  },

  // ── Why an imported backup is refused ─────────────────────────────────
  'backup.error.notABackup': {
    note: 'Refusal: the file is not a Habitat backup.',
    en: 'this file does not look like a habitat backup.',
    fa: '',
  },
  'backup.error.notJson': {
    note: 'Refusal: the file cannot be read at all.',
    en: 'this file is not readable as a habitat backup (not JSON).',
    fa: '',
  },
  'backup.error.wrongVersion': {
    note:
      'Refusal: wrong backup version. {found} and {expected} are version ' +
      'numbers.',
    en:
      'this backup uses format version {found}, but this app expects version ' +
      '{expected}.',
    fa: '',
  },
  'backup.error.noHabits': {
    note: 'Refusal: the habit list is missing.',
    en: 'this backup is missing its habit list.',
    fa: '',
  },
  'backup.error.badCompletions': {
    note: 'Refusal: the completions list is broken.',
    en: 'this backup has a broken completions list.',
    fa: '',
  },
  'backup.error.badSettings': {
    note: 'Refusal: the settings are broken.',
    en: 'this backup has broken settings.',
    fa: '',
  },
  'backup.error.badFieldNotes': {
    note: 'Refusal: the field-notes marker is broken.',
    en: 'this backup has a broken field-notes marker.',
    fa: '',
  },
  'backup.error.badStartup': {
    note: 'Refusal: the startup marker is broken.',
    en: 'this backup has a broken startup marker.',
    fa: '',
  },
  'backup.error.badBackupDate': {
    note: 'Refusal: the backup-date marker is broken.',
    en: 'this backup has a broken backup-date marker.',
    fa: '',
  },
  'backup.error.badLanguage': {
    note: 'Refusal: the file names a language Habitat does not speak.',
    en: 'this backup names a language habitat does not speak.',
    fa: '',
  },
  'backup.error.badSky': {
    note: 'Refusal: the file names a sky the Abode does not have.',
    en: 'this backup names a sky the abode does not have.',
    fa: '',
  },
  'backup.error.badCheckin': {
    note: 'Refusal: the check-in marker is broken.',
    en: 'this backup has a broken check-in marker.',
    fa: '',
  },
  'backup.error.noSeed': {
    note: 'Refusal: the world seed is missing.',
    en: 'this backup is missing its world seed.',
    fa: '',
  },

  // ── The habit form refusals ───────────────────────────────────────────
  'habitForm.errorNoName': {
    note: 'Refusal when saving a habit with no name.',
    en: 'habit needs a name.',
    fa: '',
  },
  'habitForm.errorNoWeekday': {
    note: 'Refusal when a weekdays schedule has no day ticked.',
    en: 'pick at least one day',
    fa: '',
  },

  // ── Small check-in words ──────────────────────────────────────────────
  'checkin.tickDone': {
    note: 'Tick on a check-in tile when the habit is already done.',
    en: 'done',
    fa: '',
  },
  'checkin.showFewer': {
    note: 'Fold button that shortens a long day in the check-in.',
    en: 'show fewer',
    fa: '',
  },
  'checkin.showMore': {
    note: 'Fold button that shows the rest of a long day. {n} is how many more.',
    en: 'show {n} more',
    fa: '',
  },

  // ── Map caption and market tag ────────────────────────────────────────
  'map.regionsKnown': {
    note: 'Caption under the Map. {known} regions out of {total}.',
    en: '{known} of {total} regions known',
    fa: '',
  },
  'market.owned': {
    note: 'Tag on a market curiosity you already have. {n} is how many.',
    en: '×{n} at home',
    fa: '',
  },

  // ── The start-a-new-game questions ────────────────────────────────────
  'newGame.askWipe': {
    note: 'First question in the start-a-new-game popup.',
    en:
      'do you want to wipe all your habit history and play habitat from ' +
      'total scratch?',
    fa: '',
  },
  'newGame.askKeep': {
    note: 'Second question in the start-a-new-game popup.',
    en:
      'or do you want to keep your habit history and restart the game? ' +
      '(requires you to export a backup)',
    fa: '',
  },

  // ── Names for arriving drops ──────────────────────────────────────────
  'arrival.flora': {
    note: 'Plain name of an arriving flora drop.',
    en: 'a flora find',
    fa: '',
  },
  'arrival.magazine': {
    note: 'Plain name of an arriving magazine.',
    en: 'a magazine',
    fa: '',
  },
  'arrival.novel': {
    note: 'Plain name of an arriving novel.',
    en: 'a novel',
    fa: '',
  },
  'arrival.dictionary': {
    note: 'Plain name of an arriving dictionary.',
    en: 'a dictionary',
    fa: '',
  },
  'arrival.fungusOne': {
    note: 'Plain name of an arrival of exactly one fungus.',
    en: '1 fungus',
    fa: '',
  },
  'arrival.fungi': {
    note: 'Plain name of an arrival of several fungi. {n} is how many.',
    en: '{n} fungi',
    fa: '',
  },
  'arrival.friend': {
    note: 'Plain name of an arriving friend.',
    en: 'a friend',
    fa: '',
  },
  'arrival.something': {
    note: 'Name used when the kind of drop is not known.',
    en: 'something',
    fa: '',
  },
  'arrival.and': {
    note: 'The word that joins names in a list ("a novel and 3 fungi").',
    en: 'and',
    fa: '',
  },
  'arrival.note': {
    note:
      'Quiet note beside the tapped habit. {list} is the arrival names ' +
      'joined by the word above.',
    en: 'you came across {list}',
    fa: '',
  },

  // ── The six charm names ───────────────────────────────────────────────
  'charm.1': {
    note:
      'Screen-reader name of the first charm (crown). Describes the drawing, ' +
      'never shown.',
    en: 'crown',
    fa: '',
  },
  'charm.2': {
    note:
      'Screen-reader name of the second charm (cherry). Describes the ' +
      'drawing, never shown.',
    en: 'cherry',
    fa: '',
  },
  'charm.3': {
    note:
      'Screen-reader name of the third charm (shell). Describes the drawing, ' +
      'never shown.',
    en: 'shell',
    fa: '',
  },
  'charm.4': {
    note:
      'Screen-reader name of the fourth charm (anchor). Describes the ' +
      'drawing, never shown.',
    en: 'anchor',
    fa: '',
  },
  'charm.5': {
    note:
      'Screen-reader name of the fifth charm (shield). Describes the ' +
      'drawing, never shown.',
    en: 'shield',
    fa: '',
  },
  'charm.6': {
    note:
      'Screen-reader name of the sixth charm (key). Describes the drawing, ' +
      'never shown.',
    en: 'key',
    fa: '',
  },

  // ── The design workbench door ─────────────────────────────────────────
  'design.door': {
    note:
      'Temporary door to the design workbench at the foot of the home ' +
      'screen. The workbench itself stays English.',
    en: 'design assets',
    fa: '',
  },

  // ── The language switch ───────────────────────────────────────────────
  'language.switch': {
    note: 'Name of the language switch.',
    en: 'language',
    fa: '',
  },
  'language.en': {
    note:
      'The English language names itself. Same in every language, so the way ' +
      'back is always findable.',
    en: 'English',
    fa: 'English',
  },
  'language.fa': {
    note: 'Farsi names itself in its own script. Same in every language.',
    en: 'فارسی',
    fa: 'فارسی',
  },
}

// The deck, read the way the rest of the app has always read it: one
// block per language, key → words. Derived, never edited by hand.
// (Languages are listed in LANGUAGES below; each entry carries one line
// per language.)
function readLanguage(code) {
  return Object.fromEntries(
    Object.entries(DECK).map(([key, entry]) => [key, entry[code]]),
  )
}
const en = readLanguage('en')
const fa = readLanguage('fa')

// The app's own name, in the top bar and on the home link. Kimia's call
// (2026-08-16): it stays in LATIN LETTERS in every language, always. So
// it is deliberately NOT a slot — there is no key to translate, and no
// way to change it by accident from a content edit. A constant, not
// copy.
export const WORDMARK = 'HABITAT'

export const UI = { en, fa }

// The languages Habitat speaks, in the order the switch offers them.
// 'en' first because it is the fallback: the one block that must never
// have a blank in it.
export const LANGUAGES = ['en', 'fa']
export const DEFAULT_LANGUAGE = 'en'

// The seven weekdays in ISO order (Monday = 1, matching the numbers a
// habit's schedule stores) and the twelve months, as the key fragments
// the weekday.* and month.* slots are named with. ONE list here, read
// by every page — before T6.14 four files each kept their own copy of
// Mon–Sun, so changing a weekday name meant finding all four.
export const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

// Is this a language Habitat actually speaks?
export function isLanguage(value) {
  return LANGUAGES.includes(value)
}

// Fill the {holes} in a slot: fill('read {label}', { label: 'a novel' })
// becomes 'read a novel'. A hole with no matching value is left exactly
// as it is rather than becoming the word "undefined" — a visible {label}
// on screen is a bug that announces itself, which is the kinder failure.
//
// Exported because narration.js needs the identical filling for Kimia's
// story slots (the cameo messages, 2026-08-20) and two copies of one
// regular expression is exactly the drift T6.14 exists to end.
export function fill(text, vars) {
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
