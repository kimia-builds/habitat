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
  'habits.mute': 'mute',
  'habits.unmute': 'unmute',
  'habits.edit': 'edit',
  'habits.archive': 'archive',
  'habits.unarchive': 'unarchive',
  'habits.deleteForever': 'delete forever',
  // Why a tile won't move. Nothing re-orders while anything is hidden —
  // by a charm or by a lens — because a list with gaps in it would make
  // Habitat guess where a dropped tile belongs (design-notes §12a).
  'habits.unhideToReorder': 'un-hide everything to re-order',

  // The lenses — the ways of LOOKING at the habit list (design-notes
  // §11f). These say their names on screen, in lower case like the rest
  // of Habitat's furniture.
  'lens.today': 'today',
  'lens.todos': 'to-dos',
  'lens.prioritise': 'prioritise',
  'lens.unhideAll': 'un-hide all',
  // The padlock: the one control on this line that is not a lens — it
  // acts on the world and settles (design-notes §11e/§11f). Wordless,
  // so this is its hover label and its screen-reader name, never text
  // on screen.
  'lens.saveAsDefault': 'save as default view',
  // Asked before the default view is overwritten. Kimia's words
  // throughout (2026-08-21).
  'lens.saveAsDefaultConfirm':
    'are you sure you want to save this as your default view? any ' +
    'previous default view choices will be lost. refresh the page to ' +
    'go back to previous default view.',

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
  // What pressing a friend's visit is for. Never shown — the visit is a
  // friend and a caption and nothing else — so these are the words a
  // screen reader says (2026-08-20).
  'cameo.open': 'see the record this is about',
  // The streak reported beside a week's row, and the same words blown
  // up in the spotlight a cameo sends you to (2026-08-20). The unit is
  // its own entry because a language may not build "5-day" the way
  // English does.
  'fieldNotes.streak': '{n}-{unit} streak',
  'fieldNotes.unitDay': 'day',
  'fieldNotes.unitWeek': 'week',
  // The blackout the cameo opens: what it announces, and how to leave.
  'fieldNotes.spotlightTitle': 'a record fell today',
  'fieldNotes.spotlightDismiss': 'close and see the week',

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
  // The third quiet word under a held item (T5.5), and the two that
  // replace the held item's words while it is being turned.
  'abode.rotate': 'rotate',
  'abode.turnSave': 'save',
  'abode.turnCancel': 'cancel',
  'abode.sky': 'Abode sky',
  'abode.skyLabel': 'Abode sky, {palette}',
  // The four skies the Abode can wear (T5.4). These four words are
  // Claude's from July, when the skies were drawn for the workbench —
  // rename them freely, they are only what the swatch SAYS. A save
  // stores the sky's key, never its word, so nothing breaks.
  'abode.pickSky': 'pick your sky',
  'abode.sky.ember': 'ember',
  'abode.sky.teal': 'teal',
  'abode.sky.violet': 'violet',
  'abode.sky.ash': 'ash',

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

  // Words several pages share. The arrows (← ‹ ›) are NOT part of
  // the words: each page draws its own arrow so it keeps its side, whichever
  // way the words read (T6.16).
  'nav.backToHabits': 'back to the habits',
  'nav.earlier': 'earlier',
  'nav.later': 'later',

  // The date line at the top of the home screen is built from these
  // (T6.14). The weekday and month are written the way they show — capitals
  // and all — and `date.line` sets their ORDER, so a language that puts
  // the month before the day only has to move the holes.
  'date.line': '{weekday} {day} {month} {year}',
  'weekday.mon.long': 'MONDAY',
  'weekday.tue.long': 'TUESDAY',
  'weekday.wed.long': 'WEDNESDAY',
  'weekday.thu.long': 'THURSDAY',
  'weekday.fri.long': 'FRIDAY',
  'weekday.sat.long': 'SATURDAY',
  'weekday.sun.long': 'SUNDAY',
  'month.jan': 'JAN',
  'month.feb': 'FEB',
  'month.mar': 'MAR',
  'month.apr': 'APR',
  'month.may': 'MAY',
  'month.jun': 'JUN',
  'month.jul': 'JUL',
  'month.aug': 'AUG',
  'month.sep': 'SEP',
  'month.oct': 'OCT',
  'month.nov': 'NOV',
  'month.dec': 'DEC',

  // The note under the date, shown only between midnight and the day
  // cutoff, and the hour inside it. {time} is one of the two hour slots below.
  'date.cutoffNote': 'your habits will switch to a new day at {time}',
  'time.hourAm': '{hour} a.m.',
  'time.hourPm': '{hour} p.m.',

  // Weekday names, short. These appear in the habit form's weekday
  // boxes, in a habit tile's schedule ("Mon/Wed/Fri") and, lower-cased by the
  // page, in the morning check-in's day headings.
  'weekday.mon.short': 'Mon',
  'weekday.tue.short': 'Tue',
  'weekday.wed.short': 'Wed',
  'weekday.thu.short': 'Thu',
  'weekday.fri.short': 'Fri',
  'weekday.sat.short': 'Sat',
  'weekday.sun.short': 'Sun',

  // Weekday names, two letters — the column heads of the field notes.
  'weekday.mon.tiny': 'Mo',
  'weekday.tue.tiny': 'Tu',
  'weekday.wed.tiny': 'We',
  'weekday.thu.tiny': 'Th',
  'weekday.fri.tiny': 'Fr',
  'weekday.sat.tiny': 'Sa',
  'weekday.sun.tiny': 'Su',

  // How a habit's schedule is picked in the habit form.
  'schedule.daily': 'every day',
  'schedule.weekdays': 'specific weekdays',
  'schedule.nPerWeek': 'n days a week',
  'schedule.nPerDay': 'n times a day',
  'schedule.whenever': 'whenever',
  'schedule.oneTime': 'one-time (a to-do)',

  // The same schedules as a habit tile's quiet summary line. "every day"
  // and "whenever" reuse the two slots above.
  'schedule.summary.nPerWeek': '{n}×/week',
  'schedule.summary.nPerDay': '{n}×/day',
  'schedule.summary.oneTime': 'one-time',

  // The three difficulty options in the habit form.
  'difficulty.easy': 'easy',
  'difficulty.medium': 'medium',
  'difficulty.difficult': 'difficult',

  // The graph's zoom choices (design-notes §12c).
  'fieldNotes.zoom.day': 'day by day',
  'fieldNotes.zoom.week': 'week by week',
  'fieldNotes.zoom.fourWeek': '4 weeks at a time',

  // Small habit-list words: the empty tile's invitation, the archived
  // tag, the archived drawer's heading, and the line on a finished to-do.
  // {n} is how many archived habits there are; {day} is the date it was done.
  'habits.addPlaceholder': 'add a habit or task…',
  'habits.archivedTag': '(archived)',
  'habits.archivedHeading': 'archived ({n})',
  'habits.doneOn': 'done {day}',

  // Counted units, for the sentence below. English needs a singular
  // and a plural; a language that does not can fill both the same.
  'count.day.one': '{n} day',
  'count.day.other': '{n} days',
  'count.week.one': '{n} week',
  'count.week.other': '{n} weeks',

  // The question asked before an edit changes how a streak is counted.
  // {habit} is the habit's name and {streak} is one of the counted units above.
  'habits.scheduleChangeConfirm':
    'Heads up: this schedule change switches how "{habit}"\'s streak ' +
    'is counted, so the current streak ({streak}) starts fresh from ' +
    'today. Save anyway?',

  // The question asked before a habit is deleted for good.
  'habits.deleteConfirm':
    'Delete "{habit}" forever? Its whole history goes with it. ' +
    'Archiving (already done) keeps the history.',

  // Importing a backup: the question, and the two outcomes.
  'backup.importConfirm':
    'Importing replaces EVERYTHING currently in Habitat with the ' +
    'backup file. Continue?',
  'backup.importCancelled': 'import cancelled — nothing was changed',
  'backup.imported': 'backup imported',

  // Why an imported file was refused. Each reads aloud under the import
  // pebble when a backup is not usable. {found} and {expected} are version
  // numbers.
  'backup.error.notABackup': 'This file does not look like a Habitat backup.',
  'backup.error.notJson':
    'This file is not readable as a Habitat backup (not JSON).',
  'backup.error.wrongVersion':
    'This backup uses format version {found}, but this app expects ' +
    'version {expected}.',
  'backup.error.noHabits': 'This backup is missing its habit list.',
  'backup.error.badCompletions': 'This backup has a broken completions list.',
  'backup.error.badSettings': 'This backup has broken settings.',
  'backup.error.badFieldNotes': 'This backup has a broken field-notes marker.',
  'backup.error.badStartup': 'This backup has a broken startup marker.',
  'backup.error.badBackupDate': 'This backup has a broken backup-date marker.',
  'backup.error.badLanguage':
    'This backup names a language Habitat does not speak.',
  'backup.error.badSky': 'This backup names a sky the Abode does not have.',
  'backup.error.badCheckin': 'This backup has a broken check-in marker.',
  'backup.error.noSeed': 'This backup is missing its world seed.',

  // The habit form's two refusals: no name, and a weekdays schedule with
  // no day ticked.
  'habitForm.errorNoName': 'Habit needs a name.',
  'habitForm.errorNoWeekday':
    'A weekdays schedule needs a non-empty list of days (1=Mon … ' + '7=Sun).',

  // The morning check-in's small words: the tile's tick when a habit is
  // already done, and the fold that shows fewer or more of a long day.
  'checkin.tickDone': 'done',
  'checkin.showFewer': 'show fewer',
  'checkin.showMore': 'show {n} more',

  // The Map's caption and the Market's "how many you own" tag.
  'map.regionsKnown': '{known} of {total} regions known',
  'market.owned': '×{n} at home',

  // The two questions at the top of the start-a-new-game popup, before
  // the two doors.
  'newGame.askWipe':
    'do you want to wipe all your habit history and play habitat ' +
    'from total scratch?',
  'newGame.askKeep':
    'or do you want to keep your habit history and restart the ' +
    'game? (requires you to export a backup)',

  // Plain names for arriving drops (T3.2), used on the arrival shelf and
  // in the quiet note beside the habit that was tapped. {list} is the names
  // joined by the word in `arrival.and`.
  'arrival.flora': 'a flora find',
  'arrival.magazine': 'a magazine',
  'arrival.novel': 'a novel',
  'arrival.dictionary': 'a dictionary',
  'arrival.fungusOne': '1 fungus',
  'arrival.fungi': '{n} fungi',
  'arrival.friend': 'a friend',
  'arrival.something': 'something',
  'arrival.and': 'and',
  'arrival.note': 'you came across {list}',

  // The six charms' names, for screen readers only — never on screen
  // (spec §4.1: no words on the charm). They describe the DRAWING, not the
  // habit's meaning. 1 is the first charm in the picker.
  'charm.1': 'crown',
  'charm.2': 'cherry',
  'charm.3': 'shell',
  'charm.4': 'anchor',
  'charm.5': 'shield',
  'charm.6': 'key',

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
  'habits.mute': '',
  'habits.unmute': '',
  'habits.edit': '',
  'habits.archive': '',
  'habits.unarchive': '',
  'habits.deleteForever': '',
  'habits.unhideToReorder': '',

  'lens.today': '',
  'lens.todos': '',
  'lens.prioritise': '',
  'lens.unhideAll': '',
  'lens.saveAsDefault': '',
  'lens.saveAsDefaultConfirm': '',

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
  'cameo.open': '',
  'fieldNotes.streak': '',
  'fieldNotes.unitDay': '',
  'fieldNotes.unitWeek': '',
  'fieldNotes.spotlightTitle': '',
  'fieldNotes.spotlightDismiss': '',

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
  'abode.rotate': '',
  'abode.turnSave': '',
  'abode.turnCancel': '',
  'abode.sky': '',
  'abode.skyLabel': '',
  'abode.pickSky': '',
  'abode.sky.ember': '',
  'abode.sky.teal': '',
  'abode.sky.violet': '',
  'abode.sky.ash': '',

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

  'nav.backToHabits': '',
  'nav.earlier': '',
  'nav.later': '',

  'date.line': '',
  'weekday.mon.long': '',
  'weekday.tue.long': '',
  'weekday.wed.long': '',
  'weekday.thu.long': '',
  'weekday.fri.long': '',
  'weekday.sat.long': '',
  'weekday.sun.long': '',
  'month.jan': '',
  'month.feb': '',
  'month.mar': '',
  'month.apr': '',
  'month.may': '',
  'month.jun': '',
  'month.jul': '',
  'month.aug': '',
  'month.sep': '',
  'month.oct': '',
  'month.nov': '',
  'month.dec': '',

  'date.cutoffNote': '',
  'time.hourAm': '',
  'time.hourPm': '',

  'weekday.mon.short': '',
  'weekday.tue.short': '',
  'weekday.wed.short': '',
  'weekday.thu.short': '',
  'weekday.fri.short': '',
  'weekday.sat.short': '',
  'weekday.sun.short': '',

  'weekday.mon.tiny': '',
  'weekday.tue.tiny': '',
  'weekday.wed.tiny': '',
  'weekday.thu.tiny': '',
  'weekday.fri.tiny': '',
  'weekday.sat.tiny': '',
  'weekday.sun.tiny': '',

  'schedule.daily': '',
  'schedule.weekdays': '',
  'schedule.nPerWeek': '',
  'schedule.nPerDay': '',
  'schedule.whenever': '',
  'schedule.oneTime': '',

  'schedule.summary.nPerWeek': '',
  'schedule.summary.nPerDay': '',
  'schedule.summary.oneTime': '',

  'difficulty.easy': '',
  'difficulty.medium': '',
  'difficulty.difficult': '',

  'fieldNotes.zoom.day': '',
  'fieldNotes.zoom.week': '',
  'fieldNotes.zoom.fourWeek': '',

  'habits.addPlaceholder': '',
  'habits.archivedTag': '',
  'habits.archivedHeading': '',
  'habits.doneOn': '',

  'count.day.one': '',
  'count.day.other': '',
  'count.week.one': '',
  'count.week.other': '',

  'habits.scheduleChangeConfirm': '',

  'habits.deleteConfirm': '',

  'backup.importConfirm': '',
  'backup.importCancelled': '',
  'backup.imported': '',

  'backup.error.notABackup': '',
  'backup.error.notJson': '',
  'backup.error.wrongVersion': '',
  'backup.error.noHabits': '',
  'backup.error.badCompletions': '',
  'backup.error.badSettings': '',
  'backup.error.badFieldNotes': '',
  'backup.error.badStartup': '',
  'backup.error.badBackupDate': '',
  'backup.error.badLanguage': '',
  'backup.error.badSky': '',
  'backup.error.badCheckin': '',
  'backup.error.noSeed': '',

  'habitForm.errorNoName': '',
  'habitForm.errorNoWeekday': '',

  'checkin.tickDone': '',
  'checkin.showFewer': '',
  'checkin.showMore': '',

  'map.regionsKnown': '',
  'market.owned': '',

  'newGame.askWipe': '',
  'newGame.askKeep': '',

  'arrival.flora': '',
  'arrival.magazine': '',
  'arrival.novel': '',
  'arrival.dictionary': '',
  'arrival.fungusOne': '',
  'arrival.fungi': '',
  'arrival.friend': '',
  'arrival.something': '',
  'arrival.and': '',
  'arrival.note': '',

  'charm.1': '',
  'charm.2': '',
  'charm.3': '',
  'charm.4': '',
  'charm.5': '',
  'charm.6': '',

  // Pre-filled on purpose — see the note above this block.
  'language.switch': '',
  'language.en': 'English',
  'language.fa': 'فارسی',
}

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
