// ui.js — the copy deck: every word Habitat says, in one file.
//
// This is THE copy deck: every word Habitat says lives in this one file.
// It has two halves, with two different blank-rules (see below):
//   1. the INTERFACE (buttons, labels, titles, messages) — the first
//      half, `DECK`;
//   2. STORY AND NAMES (narration, friend cards, map-region words, the
//      names of the beings) — the second half, `STORY_DECK`.
// narration.js, names.js, mishap.js and blocked.js still exist, but only
// as readers: they hold no words, and read them from here.
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
//     fa: 'خرید',
//   },
//
// One entry per piece of copy. The `note` says in plain English what it
// is and where it shows, so you never have to hunt through the app to
// find a word. Each language sits right beside the others: to add a
// language, add one line (`de: ''`) to every entry. Notes are for
// people; the app never shows them.
//
// ── TWO BLANK-RULES, ONE PER HALF ───────────────────────────────────
//
// In the story-and-names half (further down), a blank slot shows
// NOTHING — better silence than invented copy. That rule cannot hold
// in the interface half: a blank button is not restraint, it is a
// broken control.
//
// So for interface copy (including the two safety-screen messages at the
// end of this half), and only here:
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
    fa: 'صفحه‌ها',
  },
  'rail.addHabit': {
    note:
      'Hover label and screen-reader name for the rail icon that opens a ' +
      'new-habit form.',
    en: 'add new habit',
    fa: 'افزودن عادت جدید',
  },
  'rail.editPastDays': {
    note:
      'Hover label and screen-reader name for the rail icon that opens the ' +
      'morning check-in for earlier days.',
    en: 'edit past days',
    fa: 'ویرایش روزهای گذشته',
  },
  'rail.fieldNotes': {
    note:
      'Hover label and screen-reader name for the rail icon that opens the ' +
      'field notes (history).',
    en: 'view historical data',
    fa: 'دیدن داده‌های پیشین',
  },

  // ── Page titles ───────────────────────────────────────────────────────
  'page.map': {
    note:
      'Title of the Map page. Shows on its rail icon and at the top of the ' +
      'page.',
    en: 'map of N-Z-D',
    fa: 'نقشهٔ N-Z-D',
  },
  'page.abode': {
    note:
      'Title of the Abode page. Shows on its rail icon and at the top of the ' +
      'page.',
    en: 'your abode',
    fa: 'سرپناه',
  },
  'page.guestbook': {
    note:
      'Title of the Guest Book page. Shows on its rail icon and at the top ' +
      'of the page.',
    en: 'local community',
    fa: 'جامعهٔ محلی',
  },
  'page.bookcase': {
    note:
      'Title of the library page. Shows on its rail icon and at the top of ' +
      'the page.',
    en: 'readers library',
    fa: 'دارالکتب',
  },
  'page.market': {
    note:
      'Title of the Market page. Shows on its rail icon and at the top of ' +
      'the page.',
    en: 'local market',
    fa: 'بازارچهٔ محلی',
  },
  'page.fieldNotes': {
    note:
      'Title of the field notes page. Shows on its rail icon and at the top ' +
      'of the page.',
    en: 'field notes',
    fa: 'داده‌های تاریخی',
  },

  // ── The three meters ──────────────────────────────────────────────────
  'meters.region': {
    note: 'Screen-reader name for the group of three meters at the top.',
    en: 'meters',
    fa: 'شاخص‌ها',
  },
  'meters.steps': {
    note: 'Name of the steps meter. Hover label and screen-reader name.',
    en: 'steps taken',
    fa: 'قدم‌ها',
  },
  'meters.stepsBar': {
    note: 'Screen-reader-only name for the moving bar of the steps meter.',
    en: 'steps taken progress',
    fa: 'قدم‌های برداشته‌شده',
  },
  'meters.literacy': {
    note: 'Name of the literacy meter. Hover label and screen-reader name.',
    en: 'literacy level',
    fa: 'سواد',
  },
  'meters.literacyBar': {
    note: 'Screen-reader-only name for the moving bar of the literacy meter.',
    en: 'literacy level progress',
    fa: 'سطح سواد',
  },
  'meters.wallet': {
    note: 'Name of the wallet meter. Hover label and screen-reader name.',
    en: 'wallet balance',
    fa: 'موجودی',
  },
  'meters.walletBar': {
    note: 'Screen-reader-only name for the moving bar of the wallet meter.',
    en: 'wallet balance progress',
    fa: 'موجودی مالی',
  },

  // ── The habit list and its tiles ──────────────────────────────────────
  'habits.filterView': {
    note: 'Label of the control that opens the lens choices above the habit list.',
    en: 'filter view',
    fa: 'فیلتر نماها',
  },
  'habits.markDone': {
    note: "Hover label on a habit tile's tick, to mark it done.",
    en: 'mark done',
    fa: 'انجام شد',
  },
  'habits.mute': {
    note: 'Quiet word on a habit tile that hides it from today.',
    en: 'mute',
    fa: 'کم‌رنگ',
  },
  'habits.unmute': {
    note: 'Quiet word on a muted habit tile that brings it back.',
    en: 'unmute',
    fa: 'روشن',
  },
  'habits.edit': {
    note: 'Quiet word on a habit tile that opens it for editing.',
    en: 'edit',
    fa: 'ویرایش',
  },
  'habits.archive': {
    note: 'Quiet word on a habit tile that tucks it into the archive.',
    en: 'archive',
    fa: 'بایگانی',
  },
  'habits.unarchive': {
    note: 'Quiet word on an archived habit that brings it back to the list.',
    en: 'unarchive',
    fa: 'بازگردانی',
  },
  'habits.deleteForever': {
    note: 'Quiet word on an archived habit that deletes it for good (asks first).',
    en: 'delete forever',
    fa: 'حذف برای همیشه',
  },
  'habits.unhideToReorder': {
    note:
      'Hover explanation of why a tile will not move while anything is ' +
      'hidden by a charm or a lens.',
    en: 'un-hide everything to re-order',
    fa: 'برای جابه‌جایی، همه‌چیز را نمایان کن',
  },

  // ── The lenses (ways of looking at the habit list) ────────────────────
  'lens.today': {
    note: 'Lens button: show only what is due today.',
    en: 'today',
    fa: 'امروز',
  },
  'lens.todos': {
    note: 'Lens button: show only one-time to-dos.',
    en: 'to-dos',
    fa: 'یک‌باره‌ها',
  },
  'lens.prioritise': {
    note: 'Lens button: show habits in priority order.',
    en: 'prioritise',
    fa: 'اولویت‌بندی',
  },
  'lens.unhideAll': {
    note: 'Lens button: clear every hiding lens and charm.',
    en: 'un-hide all',
    fa: 'نمایان کردن همه',
  },
  'lens.saveAsDefault': {
    note:
      'Hover label and screen-reader name of the padlock. Never shown as ' +
      'text on screen.',
    en: 'save as default view',
    fa: 'ذخیره به‌عنوان نمای پیش‌فرض',
  },
  'lens.saveAsDefaultConfirm': {
    note: 'Question asked before the padlock overwrites the saved default view.',
    en:
      'are you sure you want to save this as your default view? any previous ' +
      'default view choices will be lost. refresh the page to go back to ' +
      'previous default view.',
    fa: 'مطمئنی که می‌خواهی این را نمای پیش‌فرضت ذخیره کنی؟ انتخاب‌های پیش‌فرض قبلی از بین می‌روند. برای برگشتن به نمای پیش‌فرض قبلی، صفحه را دوباره بارگذاری کن (refresh).',
  },

  // ── The habit form ────────────────────────────────────────────────────
  'habitForm.name': {
    note: 'First prompt of the habit form, above the name box.',
    en: 'write a good habit or task:',
    fa: 'یک عادت خوب یا یک‌باره بنویس:',
  },
  'habitForm.detail': {
    note: 'Second prompt of the habit form, above the details box.',
    en: 'add any details or specifications:',
    fa: 'هر جزئیات یا توضیحی که می‌خواهی اضافه کن:',
  },
  'habitForm.difficulty': {
    note: 'Third prompt of the habit form, above the difficulty choices.',
    en: 'pick a difficulty per unit:',
    fa: 'برای هر واحد یک سطح دشواری انتخاب کن:',
  },
  'habitForm.schedule': {
    note: 'Fourth prompt of the habit form, above the schedule choices.',
    en: 'specify the desired schedule or frequency:',
    fa: 'برنامه یا تناوب دلخواه را مشخص کن:',
  },
  'habitForm.howMany': {
    note: 'Label of the small number box for "n days a week" or "n times a day".',
    en: 'how many',
    fa: 'چندتا',
  },
  'habitForm.save': {
    note: 'Habit form button that saves the habit.',
    en: 'save',
    fa: 'ذخیره',
  },
  'habitForm.cancel': {
    note: 'Habit form button that closes the form without saving.',
    en: 'cancel',
    fa: 'لغو',
  },

  // ── The morning check-in ──────────────────────────────────────────────
  'checkin.region': {
    note: 'Screen-reader name for the morning check-in panel.',
    en: 'check-in',
    fa: 'ثبت روزانه',
  },
  'checkin.prompt': {
    note: 'The question at the top of the morning check-in.',
    en: 'what did you do yesterday?',
    fa: 'دیروز چه کردی؟',
  },
  'checkin.earlierDays': {
    note:
      'Line above the earlier days of this week in the check-in, warning ' +
      'they will soon freeze.',
    en: 'update earlier days of this week before they freeze forever:',
    fa: 'پیش از آنکه برای همیشه قفل شوند، روزهای قبلی این هفته را به‌روز کن:',
  },
  'checkin.noHabits': {
    note: 'Shown in the check-in when a day has no habits due.',
    en: 'no habits to show for this day',
    fa: 'برای این روز عادتی نیست',
  },
  'checkin.done': {
    note: 'Check-in button that finishes the check-in.',
    en: 'done',
    fa: 'تمام',
  },

  // ── The field notes ───────────────────────────────────────────────────
  'fieldNotes.nothingYet': {
    note: 'Shown on the field notes when no days are recorded yet.',
    en: 'nothing recorded yet',
    fa: 'هنوز چیزی ثبت نشده',
  },
  'fieldNotes.stillUnfolding': {
    note: 'Label on a week that has not finished.',
    en: 'still unfolding',
    fa: 'هنوز در جریان است',
  },
  'fieldNotes.noHabitsThatWeek': {
    note: 'Shown on a week in the field notes in which no habits existed.',
    en: 'No habits existed during this week.',
    fa: 'در این هفته هیچ عادتی وجود نداشت.',
  },
  'fieldNotes.tasksCompleted': {
    note: 'Heading of the tasks-completed section of the field notes.',
    en: 'tasks completed',
    fa: 'یک‌باره‌های انجام‌شده',
  },
  'fieldNotes.graphs': {
    note: 'Heading of the graphs section of the field notes.',
    en: 'graphs',
    fa: 'نمودارها',
  },
  'fieldNotes.habitTooYoung': {
    note: 'Shown instead of a graph for a habit that has too little history.',
    en: 'habit is too young',
    fa: 'این عادت هنوز خیلی تازه است',
  },
  'fieldNotes.graphLabel': {
    note:
      "Screen-reader name of one habit's graph. {habit} is its name, {zoom} " +
      'the zoom choice.',
    en: '{habit}, completions {zoom}',
    fa: '{habit}، انجام‌ها: {zoom}',
  },
  'cameo.open': {
    note:
      "Screen-reader name of a friend's visit that opens the record it is " +
      'about. Never shown.',
    en: 'see the record this is about',
    fa: 'دیدن رکوردی که این دیدار دربارهٔ آن است',
  },
  'fieldNotes.streak': {
    note:
      "Streak beside a week's row and in the spotlight. {n} is a number, " +
      '{unit} one of the two unit words below.',
    en: '{n}-{unit} streak',
    fa: 'زنجیرهٔ {n} {unit}',
  },
  'fieldNotes.unitDay': {
    note: 'The word "day" inside a streak.',
    en: 'day',
    fa: 'روز',
  },
  'fieldNotes.unitWeek': {
    note: 'The word "week" inside a streak.',
    en: 'week',
    fa: 'هفته',
  },
  'fieldNotes.spotlightTitle': {
    note:
      "Announcement of the blackout a friend's visit opens when a record " +
      'fell.',
    en: 'a record fell today',
    fa: 'امروز یک رکورد شکسته شد',
  },
  'fieldNotes.spotlightDismiss': {
    note: 'Button that closes that blackout and returns to the week.',
    en: 'close and see the week',
    fa: 'بستن و دیدن هفته',
  },

  // ── The arrival shelf ─────────────────────────────────────────────────
  'arrivals.region': {
    note: 'Screen-reader name for the shelf of drops waiting to be dealt with.',
    en: 'arrivals',
    fa: 'جایزه‌های رسیده',
  },
  'arrivals.hold': {
    note: 'Hover label on a drop: click to pick it up.',
    en: 'click to hold',
    fa: 'برای نگه داشتن کلیک کن',
  },
  'arrivals.gather': {
    note: 'Button to take a drop into the Abode.',
    en: 'gather',
    fa: 'جمع کردن',
  },
  'arrivals.leave': {
    note: 'Button to leave a drop behind.',
    en: 'leave it',
    fa: 'رهایش کن',
  },
  'arrivals.readNow': {
    note: 'Button to open an arrived book and read it now.',
    en: 'read now',
    fa: 'همین حالا بخوان',
  },
  'arrivals.readLater': {
    note: 'Button to shelve an arrived book for later.',
    en: 'read later',
    fa: 'بعداً بخوان',
  },

  // ── The Abode ─────────────────────────────────────────────────────────
  'abode.ground': {
    note: "Screen-reader name for the Abode's ground.",
    en: 'the ground',
    fa: 'زمین',
  },
  'abode.waitingToDecide': {
    note:
      'Caption over items that have arrived but are not yet placed or sent ' +
      'away.',
    en: 'waiting to decide',
    fa: 'منتظر تصمیم',
  },
  'abode.floraFind': {
    note: 'Name of a flora drop in the Abode.',
    en: 'a flora find',
    fa: 'یک یافتهٔ گیاهی',
  },
  'abode.visitingFriend': {
    note: 'Name of a friend who is visiting.',
    en: 'a visiting friend',
    fa: 'یک دوست مهمان',
  },
  'abode.partyMode': {
    note: 'Mood name: party.',
    en: 'party mode',
    fa: 'بزن و بکوب',
  },
  'abode.quietude': {
    note: 'Mood name: quiet.',
    en: 'quietude',
    fa: 'آرامش',
  },
  'abode.pickMood': {
    note: 'Prompt above the mood choices.',
    en: 'pick your mood',
    fa: 'حال‌وهوایت را انتخاب کن',
  },
  'abode.notYet': {
    note: 'Quiet word on a held item to put it down for now.',
    en: 'not yet',
    fa: 'هنوز نه',
  },
  'abode.curiosity': {
    note: 'Name of a curiosity in the Abode.',
    en: 'a curiosity',
    fa: 'یک شگفتی',
  },
  'abode.sell': {
    note: 'Quiet word under a held item: sell it.',
    en: 'sell',
    fa: 'بفروش',
  },
  'abode.compost': {
    note: 'Quiet word under a held item: compost it.',
    en: 'compost',
    fa: 'بازیافت',
  },
  'abode.rotate': {
    note: 'Quiet word under a held item: turn it.',
    en: 'rotate',
    fa: 'چرخاندن',
  },
  'abode.turnSave': {
    note:
      "Replaces the held item's words while it is being turned: keep the " +
      'turn.',
    en: 'save',
    fa: 'ذخیره',
  },
  'abode.turnCancel': {
    note:
      "Replaces the held item's words while it is being turned: undo the " +
      'turn.',
    en: 'cancel',
    fa: 'لغو',
  },
  'abode.sky': {
    note: 'Name of the sky control in the Abode.',
    en: 'abode sky',
    fa: 'آسمان سرپناه',
  },
  'abode.skyLabel': {
    note: "Screen-reader name of one sky swatch. {palette} is that sky's name.",
    en: 'abode sky, {palette}',
    fa: 'آسمان سرپناه، {palette}',
  },
  'abode.pickSky': {
    note: 'Prompt above the four sky swatches.',
    en: 'pick your sky',
    fa: 'آسمانت را انتخاب کن',
  },
  'abode.sky.ember': {
    note:
      'Name of the ember sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'ember',
    fa: 'اخگری',
  },
  'abode.sky.teal': {
    note:
      'Name of the teal sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'teal',
    fa: 'سبزآبی',
  },
  'abode.sky.violet': {
    note:
      'Name of the violet sky. Only what the swatch says; a save stores its ' +
      'key.',
    en: 'violet',
    fa: 'ارغوانی',
  },
  'abode.sky.ash': {
    note: 'Name of the ash sky. Only what the swatch says; a save stores its key.',
    en: 'ash',
    fa: 'مه‌آلود',
  },

  // ── The Map ───────────────────────────────────────────────────────────
  'map.planet': {
    note: 'Screen-reader name for the planet shown on the Map.',
    en: 'the planet, region by region',
    fa: 'سیاره، منطقه به منطقه',
  },

  // ── The Market ────────────────────────────────────────────────────────
  'market.stall': {
    note: 'Screen-reader name for the stall of curiosities.',
    en: 'the stall',
    fa: 'غرفهٔ بازار',
  },
  'market.buy': {
    note: 'Button to buy a curiosity.',
    en: 'buy',
    fa: '',
  },
  'market.buyLabel': {
    note: 'Screen-reader name of the buy button. {price} is the cost in fungi.',
    en: 'buy a curiosity for {price} fungi',
    fa: 'خرید یک شگفتی با {price} قارچ',
  },

  // ── The library and the reading popup ─────────────────────────────────
  'bookcase.shelf': {
    note: 'Screen-reader name for the bookshelf.',
    en: 'the bookshelf',
    fa: 'قفسهٔ کتاب',
  },
  'bookcase.read': {
    note: 'Screen-reader name of a book you can open. {label} is the book.',
    en: 'read {label}',
    fa: 'خواندن {label}',
  },
  'bookcase.spread': {
    note: 'Screen-reader name of the open two-page view. {label} is the book.',
    en: 'the open double-page spread of {label}',
    fa: 'دو صفحهٔ باز {label}',
  },
  'bookcase.close': {
    note: 'Button that closes the reading popup.',
    en: 'close',
    fa: 'بستن',
  },

  // ── The Guest Book ────────────────────────────────────────────────────
  'guestbook.friends': {
    note: 'Screen-reader name for the list of friends.',
    en: 'friends',
    fa: 'دوست‌ها',
  },
  'guestbook.unnamedFriend': {
    note: 'Stand-in name for a friend who has no name yet.',
    en: 'friend',
    fa: 'دوست',
  },
  'guestbook.close': {
    note: "Button that closes a friend's card.",
    en: 'close',
    fa: 'بستن',
  },

  // ── The reveal popups (names only; the words inside are story) ────────
  'reveal.firstArrival': {
    note: 'Screen-reader name of the popup for the very first arrival.',
    en: 'a first arrival',
    fa: 'اولین رسیده',
  },
  'reveal.friendArrives': {
    note: 'Screen-reader name of the popup when a friend arrives.',
    en: 'a friend arrives',
    fa: 'یک دوست حضور دارد',
  },
  'reveal.onward': {
    note: 'Button that dismisses a reveal popup and goes on.',
    en: 'onward',
    fa: 'ادامه',
  },
  'reveal.dropArrival': {
    note: 'Screen-reader name of the popup for an ordinary drop arriving.',
    en: 'drop arrival',
    fa: 'رسیدن یک جایزه',
  },

  // ── Backup and restore ────────────────────────────────────────────────
  'backup.export': {
    note: 'Pebble that saves a backup file.',
    en: 'export backup',
    fa: 'ذخیرهٔ پشتیبان',
  },
  'backup.import': {
    note: 'Pebble that loads a backup file.',
    en: 'import backup',
    fa: 'بارگذاری پشتیبان',
  },
  'backup.file': {
    note: 'Screen-reader name of the file chooser behind the import pebble.',
    en: 'backup file',
    fa: 'فایل پشتیبان',
  },
  'backup.ageNone': {
    note: 'Hover on the export pebble when no backup was ever made.',
    en: 'no backup yet',
    fa: 'هنوز پشتیبانی گرفته نشده',
  },
  'backup.ageFuture': {
    note:
      'Hover on the export pebble when the backup date is in the future ' +
      '(clock oddity).',
    en: 'backed up',
    fa: 'پشتیبان گرفته شد',
  },
  'backup.ageToday': {
    note: 'Hover on the export pebble: last backup was today.',
    en: 'backed up today',
    fa: 'امروز پشتیبان گرفته شد',
  },
  'backup.ageYesterday': {
    note: 'Hover on the export pebble: last backup was yesterday.',
    en: 'backed up yesterday',
    fa: 'دیروز پشتیبان گرفته شد',
  },
  'backup.ageDays': {
    note: 'Hover on the export pebble: last backup was {days} days ago.',
    en: 'backed up {days} days ago',
    fa: '{days} روز پیش پشتیبان گرفته شد',
  },

  // ── Starting over ─────────────────────────────────────────────────────
  'newGame.start': {
    note: 'Pebble that opens the start-a-new-game popup.',
    en: 'start a new game',
    fa: 'شروع بازی تازه',
  },
  'newGame.which': {
    note: 'Heading above the two restart doors.',
    en: 'which type of restart?',
    fa: 'کدام نوع شروع دوباره؟',
  },
  'newGame.refresh': {
    note: 'Door that wipes everything and starts again.',
    en: 'total refresh',
    fa: 'پاک‌سازی کامل',
  },
  'newGame.keep': {
    note: 'Door that wipes the game but keeps habit data.',
    en: 'keep habit data',
    fa: 'نگه داشتن داده‌های عادت',
  },
  'newGame.notNow': {
    note: 'Button that closes the popup without doing anything.',
    en: 'not now',
    fa: 'حالا نه',
  },
  'newGame.sure': {
    note: 'Confirmation question after choosing a restart door.',
    en: 'are you sure?',
    fa: 'مطمئنی؟',
  },
  'newGame.yes': {
    note: 'Answer: go ahead with the restart.',
    en: 'yes',
    fa: 'بله',
  },
  'newGame.no': {
    note: 'Answer: step back from the restart.',
    en: 'no, take me back',
    fa: 'نه، برگردم',
  },
  'newGame.backupFirst': {
    note: 'Button to export a backup before restarting.',
    en: 'export a backup first',
    fa: 'اول پشتیبان بگیر',
  },
  'newGame.refreshWarning': {
    note: 'Plain warning under the total-refresh door.',
    en:
      'everything will be wiped: habits, completions, and game progress. ' +
      'habitat will restart from day one. only a backup file you have ' +
      'already exported can bring any of it back.',
    fa: 'همه‌چیز پاک می‌شود: عادت‌ها، انجام‌ها و پیشرفت بازی. Habitat از روز اول دوباره شروع می‌شود. فقط فایل پشتیبانی که از قبل ذخیره کرده‌ای می‌تواند چیزی از این‌ها را برگرداند.',
  },
  'newGame.keepWarning': {
    note: 'Plain warning under the keep-habit-data door.',
    en:
      'your gameplay will be wiped: flora, books, friends, fungi and ' +
      'expedition progress. your historical habit data, streaks and graphs ' +
      'will remain.',
    fa: 'پیشرفت بازی‌ات پاک می‌شود: گیاه‌ها، کتاب‌ها، دوست‌ها، قارچ‌ها و پیشرفت اکتشاف. داده‌های تاریخی عادت‌ها، زنجیره‌ها و نمودارهایت می‌مانند.',
  },
  'newGame.refreshDone': {
    note: 'Afterword shown once a total refresh has happened.',
    en: 'a new habitat has begun — everything starts from here',
    fa: 'یک Habitat تازه شروع شد — همه‌چیز از همین‌جا شروع می‌شود',
  },
  'newGame.keepDone': {
    note: 'Afterword shown once a game-only restart has happened.',
    en: 'a new game has begun — your habits and history are untouched',
    fa: 'یک بازی تازه شروع شد — عادت‌ها و تاریخچه‌ات دست‌نخورده‌اند',
  },

  // ── Words several pages share ─────────────────────────────────────────
  'nav.backToHabits': {
    note:
      'Link back to the habit list. The arrow is drawn by the page, not part ' +
      'of the words.',
    en: 'back to the habits',
    fa: 'برگشت به عادت‌ها',
  },
  'nav.earlier': {
    note:
      'Button to move to an earlier page of days. The arrow is drawn by the ' +
      'page.',
    en: 'earlier',
    fa: 'قبل‌تر',
  },
  'nav.later': {
    note:
      'Button to move to a later page of days. The arrow is drawn by the ' +
      'page.',
    en: 'later',
    fa: 'جدیدتر',
  },

  // ── The date line and the clock ───────────────────────────────────────
  'date.line': {
    note:
      'Order of the date line at the top of the home screen. Holes: ' +
      '{weekday} {day} {month} {year}. Move them to suit the grammar.',
    en: '{weekday} {day} {month} {year}',
    fa: '{weekday} {day} {month} {year}',
  },
  'weekday.mon.long': {
    note: 'Monday, in full, on the date line.',
    en: 'MONDAY',
    fa: 'دوشنبه',
  },
  'weekday.tue.long': {
    note: 'Tuesday, in full, on the date line.',
    en: 'TUESDAY',
    fa: 'سه‌شنبه',
  },
  'weekday.wed.long': {
    note: 'Wednesday, in full, on the date line.',
    en: 'WEDNESDAY',
    fa: 'چهارشنبه',
  },
  'weekday.thu.long': {
    note: 'Thursday, in full, on the date line.',
    en: 'THURSDAY',
    fa: 'پنجشنبه',
  },
  'weekday.fri.long': {
    note: 'Friday, in full, on the date line.',
    en: 'FRIDAY',
    fa: 'جمعه',
  },
  'weekday.sat.long': {
    note: 'Saturday, in full, on the date line.',
    en: 'SATURDAY',
    fa: 'شنبه',
  },
  'weekday.sun.long': {
    note: 'Sunday, in full, on the date line.',
    en: 'SUNDAY',
    fa: 'یکشنبه',
  },
  'jmonth.farvardin': {
    note:
      'The first month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Farvardin',
    fa: 'فروردین',
  },
  'jmonth.ordibehesht': {
    note:
      'The second month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Ordibehesht',
    fa: 'اردیبهشت',
  },
  'jmonth.khordad': {
    note:
      'The third month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Khordad',
    fa: 'خرداد',
  },
  'jmonth.tir': {
    note:
      'The fourth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Tir',
    fa: 'تیر',
  },
  'jmonth.mordad': {
    note:
      'The fifth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Mordad',
    fa: 'مرداد',
  },
  'jmonth.shahrivar': {
    note:
      'The sixth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Shahrivar',
    fa: 'شهریور',
  },
  'jmonth.mehr': {
    note:
      'The seventh month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Mehr',
    fa: 'مهر',
  },
  'jmonth.aban': {
    note:
      'The eighth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Aban',
    fa: 'آبان',
  },
  'jmonth.azar': {
    note:
      'The ninth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Azar',
    fa: 'آذر',
  },
  'jmonth.dey': {
    note:
      'The tenth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Dey',
    fa: 'دی',
  },
  'jmonth.bahman': {
    note:
      'The eleventh month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Bahman',
    fa: 'بهمن',
  },
  'jmonth.esfand': {
    note:
      'The twelfth month of the Persian (Jalali) calendar, on the date line ' +
      'when Farsi is on. A blank Farsi slot shows the Latin spelling.',
    en: 'Esfand',
    fa: 'اسفند',
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
    fa: 'عادت‌هایت ساعت {time} به روز جدید می‌روند',
  },
  'time.hourAm': {
    note: 'An hour before noon, e.g. "4 a.m.". {hour} is the number.',
    en: '{hour} a.m.',
    fa: '{hour} صبح',
  },
  'time.hourPm': {
    note: 'An hour after noon, e.g. "4 p.m.". {hour} is the number.',
    en: '{hour} p.m.',
    fa: '{hour} بعدازظهر',
  },

  // ── Weekday names, short and tiny ─────────────────────────────────────
  'weekday.mon.short': {
    note:
      "Monday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'mon',
    fa: 'دوشنبه',
  },
  'weekday.tue.short': {
    note:
      "Tuesday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'tue',
    fa: 'سه‌شنبه',
  },
  'weekday.wed.short': {
    note:
      "Wednesday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'wed',
    fa: 'چهارشنبه',
  },
  'weekday.thu.short': {
    note:
      "Thursday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'thu',
    fa: 'پنجشنبه',
  },
  'weekday.fri.short': {
    note:
      "Friday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'fri',
    fa: 'جمعه',
  },
  'weekday.sat.short': {
    note:
      "Saturday, short: habit form weekday boxes, a tile's schedule line " +
      'and check-in day headings.',
    en: 'sat',
    fa: 'شنبه',
  },
  'weekday.sun.short': {
    note:
      "Sunday, short: habit form weekday boxes, a tile's schedule line and " +
      'check-in day headings.',
    en: 'sun',
    fa: 'یکشنبه',
  },
  'weekday.mon.tiny': {
    note: 'Monday, two letters: column head in the field notes.',
    en: 'mo',
    fa: 'د',
  },
  'weekday.tue.tiny': {
    note: 'Tuesday, two letters: column head in the field notes.',
    en: 'tu',
    fa: 'س',
  },
  'weekday.wed.tiny': {
    note: 'Wednesday, two letters: column head in the field notes.',
    en: 'we',
    fa: 'چ',
  },
  'weekday.thu.tiny': {
    note: 'Thursday, two letters: column head in the field notes.',
    en: 'th',
    fa: 'پ',
  },
  'weekday.fri.tiny': {
    note: 'Friday, two letters: column head in the field notes.',
    en: 'fr',
    fa: 'ج',
  },
  'weekday.sat.tiny': {
    note: 'Saturday, two letters: column head in the field notes.',
    en: 'sa',
    fa: 'ش',
  },
  'weekday.sun.tiny': {
    note: 'Sunday, two letters: column head in the field notes.',
    en: 'su',
    fa: 'ی',
  },

  // ── Schedules and difficulty ──────────────────────────────────────────
  'schedule.daily': {
    note: 'Schedule choice in the habit form: every day.',
    en: 'every day',
    fa: 'هر روز',
  },
  'schedule.weekdays': {
    note: 'Schedule choice in the habit form: pick the days.',
    en: 'specific weekdays',
    fa: 'روزهای مشخصی از هفته',
  },
  'schedule.nPerWeek': {
    note: 'Schedule choice in the habit form: a number of days each week.',
    en: 'n days a week',
    fa: 'n روز در هفته',
  },
  'schedule.nPerDay': {
    note: 'Schedule choice in the habit form: a number of times each day.',
    en: 'n times a day',
    fa: 'n بار در روز',
  },
  'schedule.whenever': {
    note:
      'Schedule choice in the habit form: no fixed schedule. Also the ' +
      "tile's summary line.",
    en: 'whenever',
    fa: 'هر وقت شد',
  },
  'schedule.oneTime': {
    note: 'Schedule choice in the habit form: a one-time to-do.',
    en: 'one-time (a to-do)',
    fa: 'یک‌باره',
  },
  'schedule.summary.nPerWeek': {
    note: 'Habit tile\'s summary line for "n days a week". {n} is the number.',
    en: '{n}×/week',
    fa: '{n} بار در هفته',
  },
  'schedule.summary.nPerDay': {
    note: 'Habit tile\'s summary line for "n times a day". {n} is the number.',
    en: '{n}×/day',
    fa: '{n} بار در روز',
  },
  'schedule.summary.oneTime': {
    note: "Habit tile's summary line for a one-time to-do.",
    en: 'one-time',
    fa: 'یک‌باره',
  },
  'difficulty.easy': {
    note: 'Easiest difficulty choice in the habit form.',
    en: 'easy',
    fa: 'آسان',
  },
  'difficulty.medium': {
    note: 'Middle difficulty choice in the habit form.',
    en: 'medium',
    fa: 'متوسط',
  },
  'difficulty.difficult': {
    note: 'Hardest difficulty choice in the habit form.',
    en: 'difficult',
    fa: 'سخت',
  },

  // ── Graph zoom choices ────────────────────────────────────────────────
  'fieldNotes.zoom.day': {
    note: 'Graph zoom choice: one point per day.',
    en: 'day by day',
    fa: 'روز به روز',
  },
  'fieldNotes.zoom.week': {
    note: 'Graph zoom choice: one point per week.',
    en: 'week by week',
    fa: 'هفته به هفته',
  },
  'fieldNotes.zoom.fourWeek': {
    note: 'Graph zoom choice: one point per four weeks.',
    en: '4 weeks at a time',
    fa: 'هر چهار هفته',
  },

  // ── Small habit-list words ────────────────────────────────────────────
  'habits.addPlaceholder': {
    note: 'Invitation written in the empty tile at the end of the habit list.',
    en: 'add a habit or task…',
    fa: 'یک عادت خوب یا یک‌باره اضافه کن…',
  },
  'habits.archivedTag': {
    note: "Small tag beside an archived habit's name.",
    en: '(archived)',
    fa: '(بایگانی‌شده)',
  },
  'habits.archivedHeading': {
    note: 'Heading of the archived drawer. {n} is how many are archived.',
    en: 'archived ({n})',
    fa: 'بایگانی‌شده‌ها ({n})',
  },
  'habits.doneOn': {
    note: 'Line on a finished to-do. {day} is the date it was done.',
    en: 'done {day}',
    fa: 'انجام‌شده در {day}',
  },

  // ── Counted units ─────────────────────────────────────────────────────
  'count.day.one': {
    note: 'A count of one day. {n} is the number.',
    en: '{n} day',
    fa: '{n} روز',
  },
  'count.day.other': {
    note:
      'A count of several days. A language without plurals can fill both the ' +
      'same.',
    en: '{n} days',
    fa: '{n} روز',
  },
  'count.week.one': {
    note: 'A count of one week.',
    en: '{n} week',
    fa: '{n} هفته',
  },
  'count.week.other': {
    note: 'A count of several weeks.',
    en: '{n} weeks',
    fa: '{n} هفته',
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
    fa: 'حواست باشد: این تغییر برنامه روش شمارش زنجیرهٔ «{habit}» را عوض می‌کند، برای همین زنجیرهٔ فعلی ({streak}) از امروز از نو شروع می‌شود. باز هم ذخیره شود؟',
  },
  'habits.deleteConfirm': {
    note: 'Question before a habit is deleted for good. {habit} is its name.',
    en:
      'delete "{habit}" forever? its whole history goes with it. archiving ' +
      '(already done) keeps the history.',
    fa: '«{habit}» برای همیشه حذف شود؟ همهٔ تاریخچه‌اش هم همراهش می‌رود. بایگانی (که قبلاً برای «{habit}» انجام شده) تاریخچه را نگه می‌دارد.',
  },

  // ── Importing a backup ────────────────────────────────────────────────
  'backup.importConfirm': {
    note: 'Question before an import replaces everything.',
    en:
      'importing replaces EVERYTHING currently in habitat with the backup ' +
      'file. continue?',
    fa: 'با بارگذاری این پشتیبان، همهٔ چیزهایی که الان در Habitat هست جایگزین می‌شود. ادامه بدهم؟',
  },
  'backup.importCancelled': {
    note: 'Shown after the import question is answered no.',
    en: 'import cancelled — nothing was changed',
    fa: 'بارگذاری لغو شد — هیچ چیز تغییر نکرد',
  },
  'backup.imported': {
    note: 'Shown after a backup is imported successfully.',
    en: 'backup imported',
    fa: 'پشتیبان بارگذاری شد',
  },

  // ── Why an imported backup is refused ─────────────────────────────────
  'backup.error.notABackup': {
    note: 'Refusal: the file is not a Habitat backup.',
    en: 'this file does not look like a habitat backup.',
    fa: 'به نظر نمی‌رسد این فایل یک پشتیبان Habitat باشد.',
  },
  'backup.error.notJson': {
    note: 'Refusal: the file cannot be read at all.',
    en: 'this file is not readable as a habitat backup (not JSON).',
    fa: 'این فایل را نمی‌شود به‌عنوان پشتیبان Habitat خواند (JSON نیست).',
  },
  'backup.error.wrongVersion': {
    note:
      'Refusal: wrong backup version. {found} and {expected} are version ' +
      'numbers.',
    en:
      'this backup uses format version {found}, but this app expects version ' +
      '{expected}.',
    fa: 'این پشتیبان با قالب نسخهٔ {found} است، ولی این برنامه نسخهٔ {expected} را می‌خواهد.',
  },
  'backup.error.noHabits': {
    note: 'Refusal: the habit list is missing.',
    en: 'this backup is missing its habit list.',
    fa: 'فهرست عادت‌ها در این پشتیبان نیست.',
  },
  'backup.error.badCompletions': {
    note: 'Refusal: the completions list is broken.',
    en: 'this backup has a broken completions list.',
    fa: 'فهرست انجام‌ها در این پشتیبان خراب است.',
  },
  'backup.error.badSettings': {
    note: 'Refusal: the settings are broken.',
    en: 'this backup has broken settings.',
    fa: 'تنظیمات این پشتیبان خراب است.',
  },
  'backup.error.badFieldNotes': {
    note: 'Refusal: the field-notes marker is broken.',
    en: 'this backup has a broken field-notes marker.',
    fa: 'نشانهٔ داده‌های تاریخی در این پشتیبان خراب است.',
  },
  'backup.error.badStartup': {
    note: 'Refusal: the startup marker is broken.',
    en: 'this backup has a broken startup marker.',
    fa: 'نشانهٔ شروع در این پشتیبان خراب است.',
  },
  'backup.error.badBackupDate': {
    note: 'Refusal: the backup-date marker is broken.',
    en: 'this backup has a broken backup-date marker.',
    fa: 'نشانهٔ تاریخ پشتیبان در این پشتیبان خراب است.',
  },
  'backup.error.badLanguage': {
    note: 'Refusal: the file names a language Habitat does not speak.',
    en: 'this backup names a language habitat does not speak.',
    fa: 'این پشتیبان زبانی را نام می‌برد که Habitat بلد نیست.',
  },
  'backup.error.badSky': {
    note: 'Refusal: the file names a sky the Abode does not have.',
    en: 'this backup names a sky the abode does not have.',
    fa: 'این پشتیبان آسمانی را نام می‌برد که سرپناه ندارد.',
  },
  'backup.error.badWeekShape': {
    note: 'Refusal: the file names a week shape Habitat does not have.',
    en: 'this backup names a week shape habitat does not have.',
    fa: 'این پشتیبان شکل هفته‌ای را نام می‌برد که Habitat ندارد.',
  },
  'backup.error.badCheckin': {
    note: 'Refusal: the check-in marker is broken.',
    en: 'this backup has a broken check-in marker.',
    fa: 'نشانهٔ ثبت روزانه در این پشتیبان خراب است.',
  },
  'backup.error.noSeed': {
    note: 'Refusal: the world seed is missing.',
    en: 'this backup is missing its world seed.',
    fa: 'بذر دنیا در این پشتیبان نیست.',
  },

  // ── The habit form refusals ───────────────────────────────────────────
  'habitForm.errorNoName': {
    note: 'Refusal when saving a habit with no name.',
    en: 'habit needs a name.',
    fa: 'عادت باید اسم داشته باشد.',
  },
  'habitForm.errorNoWeekday': {
    note: 'Refusal when a weekdays schedule has no day ticked.',
    en: 'pick at least one day',
    fa: 'دست‌کم یک روز انتخاب کن',
  },

  // ── Small check-in words ──────────────────────────────────────────────
  'checkin.tickDone': {
    note: 'Tick on a check-in tile when the habit is already done.',
    en: 'done',
    fa: 'انجام شده',
  },
  'checkin.showFewer': {
    note: 'Fold button that shortens a long day in the check-in.',
    en: 'show fewer',
    fa: 'کمتر نشان بده',
  },
  'checkin.showMore': {
    note: 'Fold button that shows the rest of a long day. {n} is how many more.',
    en: 'show {n} more',
    fa: '{n} مورد دیگر نشان بده',
  },

  // ── Map caption and market tag ────────────────────────────────────────
  'map.regionsKnown': {
    note: 'Caption under the Map. {known} regions out of {total}.',
    en: '{known} of {total} regions known',
    fa: '{known} منطقه از {total} منطقه شناخته شده',
  },
  'market.owned': {
    note: 'Tag on a market curiosity you already have. {n} is how many.',
    en: '×{n} at home',
    fa: 'در خانه {n}تا داری',
  },

  // ── The start-a-new-game questions ────────────────────────────────────
  'newGame.askWipe': {
    note: 'First question in the start-a-new-game popup.',
    en:
      'do you want to wipe all your habit history and play habitat from ' +
      'total scratch?',
    fa: 'می‌خواهی کل تاریخچهٔ عادت‌هایت پاک شود و Habitat را از صفر بازی کنی؟',
  },
  'newGame.askKeep': {
    note: 'Second question in the start-a-new-game popup.',
    en:
      'or do you want to keep your habit history and restart the game? ' +
      '(requires you to export a backup)',
    fa: 'یا می‌خواهی تاریخچهٔ عادت‌هایت بماند و فقط بازی از نو شروع شود؟ (باید اول یک پشتیبان بگیری)',
  },

  // ── Names for arriving drops ──────────────────────────────────────────
  'arrival.flora': {
    note: 'Plain name of an arriving flora drop.',
    en: 'a flora find',
    fa: 'یک یافتهٔ گیاهی',
  },
  'arrival.magazine': {
    note: 'Plain name of an arriving magazine.',
    en: 'a magazine',
    fa: 'یک مجله',
  },
  'arrival.novel': {
    note: 'Plain name of an arriving novel.',
    en: 'a novel',
    fa: 'یک رمان',
  },
  'arrival.dictionary': {
    note: 'Plain name of an arriving dictionary.',
    en: 'a dictionary',
    fa: 'یک فرهنگ لغت',
  },
  'arrival.fungusOne': {
    note: 'Plain name of an arrival of exactly one fungus.',
    en: '1 fungus',
    fa: '1 قارچ',
  },
  'arrival.fungi': {
    note: 'Plain name of an arrival of several fungi. {n} is how many.',
    en: '{n} fungi',
    fa: '{n} قارچ',
  },
  'arrival.friend': {
    note: 'Plain name of an arriving friend.',
    en: 'a friend',
    fa: 'یک دوست',
  },
  'arrival.something': {
    note: 'Name used when the kind of drop is not known.',
    en: 'something',
    fa: 'چیزی',
  },
  'arrival.and': {
    note: 'The word that joins names in a list ("a novel and 3 fungi").',
    en: 'and',
    fa: 'و',
  },
  'arrival.note': {
    note:
      'Quiet note beside the tapped habit. {list} is the arrival names ' +
      'joined by the word above.',
    en: 'you came across {list}',
    fa: 'به {list} برخوردی',
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
    fa: 'زبان',
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

  // ── The week shape ────────────────────────────────────────────────────
  'weekShape.button': {
    note: 'The pebble beside the language switch that opens the week shapes.',
    en: 'week shape',
    fa: 'شکل هفته',
  },
  'weekShape.title': {
    note: 'The question at the top of the week-shape popup.',
    en: 'which day does your week start on?',
    fa: 'هفتهٔ تو از چه روزی شروع می‌شود؟',
  },
  'weekShape.mon': {
    note: 'Week shape: Monday first, Sunday last.',
    en: 'mon – sun',
    fa: 'دوشنبه – یکشنبه',
  },
  'weekShape.sun': {
    note: 'Week shape: Sunday first, Saturday last.',
    en: 'sun – sat',
    fa: 'یکشنبه – شنبه',
  },
  'weekShape.sat': {
    note: 'Week shape: Saturday first, Friday last.',
    en: 'sat – fri',
    fa: 'شنبه – جمعه',
  },
  'weekShape.close': {
    note: 'Closes the week-shape popup without changing anything.',
    en: 'close',
    fa: 'بستن',
  },

  // ── Safety screens ──────────────────────────────────────────────────────
  'blocked.message': {
    note:
      'The one message shown when Habitat is opened on a ' +
      'screen too narrow for it (phone or tablet).',
    en:
      'N-Z-D is currently only a habitat that can be ' +
      'experienced on a big browser, like a laptop or desktop ' +
      'computer. check back in on the big screen!',
    fa: 'N-Z-D فعلاً زیستگاهی است که فقط روی صفحهٔ بزرگ مرورگر، مثل لپ‌تاپ یا رایانهٔ رومیزی، تجربه می‌شود. روی صفحهٔ بزرگ دوباره سر بزن!',
  },
  'mishap.message': {
    note:
      'The one message shown if something unexpected breaks ' +
      'and a screen cannot draw. Never leave this blank.',
    en:
      'something seems to have gone wrong: please inform the ' +
      'maker. refresh page to get back to habits.',
    fa: 'به نظر می‌رسد مشکلی پیش آمده: لطفاً به سازنده خبر بده. صفحه را دوباره بارگذاری کن (refresh) تا به عادت‌ها برگردی.',
  },
}

// ═══════════════════════════════════════════════════════════════════════
// STORY AND NAMES — the second half of the deck.
//
// BLANK-RULE FOR THIS HALF: a blank slot stays SILENT. The app shows
// nothing there — never invented prose, never an invented name, and no
// fallback to English. (The interface half above does the opposite: a
// blank falls back to English, because a blank button is broken.) Story
// and names are Kimia's own words in every language, so a language that
// has not been written yet is quiet rather than guessed at.
//
// Same entry shape as above: a plain-English note, then each language.
// The keys are permanent internal ids: story.* entries are narration,
// name.* entries are what the beings of N-Z-D are called. In
// name.species.* and name.individuals.* the id after the dot is the
// species' internal id (never shown), and the English line is what a
// player reads. A friend wears its own name if it has one, else its
// species name, else nothing.
//
// Narration is momentary — it plays once and is never stored — except
// the friend cards, which are re-readable on the Guest Book. Some lines
// here are still Claude-written placeholders from T3.2 and stay only
// until Kimia replaces them.
// ═══════════════════════════════════════════════════════════════════════

const STORY_DECK = {
  // ── First discoveries ───────────────────────────────────────────────────
  'story.firstReveals.flora.title': {
    note:
      'The big line on the screen that appears the first time ' +
      'you find a native plant.',
    en: 'you found an indigenous plant',
    fa: '',
  },
  'story.firstReveals.flora.line': {
    note:
      'The story line beneath the big line, on the same ' +
      'first-time screen for a native plant.',
    en:
      'after walking around N-Z-D for some time, you got ' +
      'enough steps in to discover the native flora. this land ' +
      'holds life, just like you.',
    fa: '',
  },
  'story.firstReveals.magazine.title': {
    note:
      'The big line on the screen that appears the first time ' +
      'you find a magazine.',
    en: 'what is this? reading material?',
    fa: '',
  },
  'story.firstReveals.magazine.line': {
    note:
      'The story line beneath the big line, on the same ' +
      'first-time screen for a magazine.',
    en:
      'printed pages of local cultural phenomena. interesting ' +
      'stuff. hard to tell what language means on this planet. ' +
      'images help.',
    fa: '',
  },
  'story.firstReveals.novel.title': {
    note:
      'The big line on the screen that appears the first time ' +
      'you find a novel.',
    en: 'more pages; heavier. a novel?',
    fa: '',
  },
  'story.firstReveals.novel.line': {
    note:
      'The story line beneath the big line, on the same ' +
      'first-time screen for a novel.',
    en:
      'N-Z-D is a cultured place; it is you who must raise ' +
      'your literacy level. perhaps this is the reading ' +
      'challenge you need.',
    fa: '',
  },
  'story.firstReveals.dictionary.title': {
    note:
      'The big line on the screen that appears the first time ' +
      'you find a dictionary.',
    en: 'you found a dictionary',
    fa: '',
  },
  'story.firstReveals.dictionary.line': {
    note:
      'The story line beneath the big line, on the same ' +
      'first-time screen for a dictionary.',
    en:
      'finally! a point of reference. a form of translation. a ' +
      'rare treasure that will open doors to deeper ' +
      'friendships.',
    fa: '',
  },
  'story.firstReveals.fungi.title': {
    note:
      'The big line on the screen that appears the first time ' +
      'you find fungi (the fungible tokens).',
    en: 'you earned a fungible token',
    fa: '',
  },
  'story.firstReveals.fungi.line': {
    note:
      'The story line beneath the big line, on the same ' +
      'first-time screen for fungi (the fungible tokens).',
    en:
      'do not eat these: they are very valuable and inedible. ' +
      'buy and sell objects for the same price at the local ' +
      'market.',
    fa: '',
  },

  // ── The reading popup ───────────────────────────────────────────────────
  'story.spreadPopup.emptyState': {
    note:
      'Shown inside the reading popup when a publication has ' +
      'no double-page spread written yet.',
    en: 'something will be here soon. check in later.',
    fa: '',
  },

  // ── Friend introductions ────────────────────────────────────────────────
  'story.friendIntros.plip.title': {
    note:
      'The big line when you meet your first plip (played ' +
      'once, on that first arrival).',
    en: 'a plip!',
    fa: '',
  },
  'story.friendIntros.plip.line': {
    note:
      'The story line beneath it for the plip. Later plips ' +
      'arrive wordless.',
    en:
      'plips are a wordless creature on N-Z-D. they are ' +
      'friendly, and love having company.',
    fa: '',
  },
  'story.friendIntros.baluhm.title': {
    note:
      'The big line when you meet your first baluhm (played ' +
      'once, on that first arrival).',
    en: 'a baluhm!',
    fa: '',
  },
  'story.friendIntros.baluhm.line': {
    note:
      'The story line beneath it for the baluhm. Later baluhms ' +
      'arrive wordless.',
    en:
      'curious and kind, baluhms gravitate towards strangers, ' +
      'communicating mostly through gesture.',
    fa: '',
  },
  'story.friendIntros.krupengk.title': {
    note:
      'The big line when you meet your first krupengk (played ' +
      'once, on that first arrival).',
    en: 'a krupengk!',
    fa: '',
  },
  'story.friendIntros.krupengk.line': {
    note:
      'The story line beneath it for the krupengk. Later ' +
      'krupengks arrive wordless.',
    en:
      'the observant krupengk loves to gather information, ' +
      'saving it all for analysis later.',
    fa: '',
  },
  'story.friendIntros.zala.title': {
    note:
      'The big line when you meet your first zala (played ' +
      'once, on that first arrival).',
    en: 'a zala!',
    fa: '',
  },
  'story.friendIntros.zala.line': {
    note:
      'The story line beneath it for the zala. Later zalas ' +
      'arrive wordless.',
    en:
      'although zalas can be stand-offish, you may see them ' +
      'often because they move too slow to escape small talk.',
    fa: '',
  },
  'story.friendIntros.liwi-bi-jiji.title': {
    note:
      'The big line when you meet your first liwi bi-jiji ' +
      '(played once, on that first arrival).',
    en: 'a liwi bi-jiji!',
    fa: '',
  },
  'story.friendIntros.liwi-bi-jiji.line': {
    note:
      'The story line beneath it for the liwi bi-jiji. Later ' +
      'liwi bi-jijis arrive wordless.',
    en:
      'the fastest creatures on N-Z-D. known for their sense ' +
      'of humour. fans of scavenging competitions and chit ' +
      'chat.',
    fa: '',
  },
  'story.friendIntros.meuhy.title': {
    note:
      'The big line when you meet your first meuhy (played ' +
      'once, on that first arrival).',
    en: 'a meuhy!',
    fa: '',
  },
  'story.friendIntros.meuhy.line': {
    note:
      'The story line beneath it for the meuhy. Later meuhys ' +
      'arrive wordless.',
    en:
      'meuhys are N-Z-D"s most loyal creatures. it takes them ' +
      'long to trust, but when they do, it"s forever. lucky ' +
      'you!',
    fa: '',
  },
  'story.friendIntros.rassatt.title': {
    note:
      'The big line when you meet your first rassatt (played ' +
      'once, on that first arrival).',
    en: 'a rassatt!',
    fa: '',
  },
  'story.friendIntros.rassatt.line': {
    note:
      'The story line beneath it for the rassatt. Later ' +
      'rassatts arrive wordless.',
    en:
      'rassatts are rarely found in this layer of the ' +
      'atmosphere, but they are friendly and talkative. they ' +
      'enjoy teasing and roasting.',
    fa: '',
  },
  'story.friendIntros.woigolp.title': {
    note:
      'The big line when you meet your first woigolp (played ' +
      'once, on that first arrival).',
    en: 'a woigolp!',
    fa: '',
  },
  'story.friendIntros.woigolp.line': {
    note:
      'The story line beneath it for the woigolp. Later ' +
      'woigolps arrive wordless.',
    en:
      'moody and temperamental, woigolps rarely emerge from ' +
      'their quarters, but when they do it"s to fight or to ' +
      'eat. friendship with them is unusual.',
    fa: '',
  },
  'story.friendIntros.chitu.title': {
    note:
      'The big line when you meet your first chitu (played ' +
      'once, on that first arrival).',
    en: 'a chitu!',
    fa: '',
  },
  'story.friendIntros.chitu.line': {
    note:
      'The story line beneath it for the chitu. Later chitus ' +
      'arrive wordless.',
    en:
      'shy chitus are N-Z-D"s finest poets. they are deeply ' +
      'fond of their local culture and language. their ' +
      'introversion keeps them mostly hidden and out of sight. ',
    fa: '',
  },
  'story.friendIntros.hamdi-bulo.title': {
    note:
      'The big line when you meet your first hamdi bulo ' +
      '(played once, on that first arrival).',
    en: 'a hamdi bulo!',
    fa: '',
  },
  'story.friendIntros.hamdi-bulo.line': {
    note:
      'The story line beneath it for the hamdi bulo. Later ' +
      'hamdi bulos arrive wordless.',
    en:
      'wow! you befriended N-Z-D"s one and only hamdi bulo. ' +
      'these long-living creatures are wise like oracles and ' +
      'have seen more than anyone else on the planet. there is ' +
      'no higher or more honourable friendship here on N-Z-D. ' +
      'congratulations! this suggests your level of literacy ' +
      'has reached an unbelievable standard, for a non-native. ' +
      'all those novels and dictionaries that you read earned ' +
      'you this. well done. ',
    fa: '',
  },

  // ── Friend cards ────────────────────────────────────────────────────────
  'story.friendCards.plip': {
    note:
      "The text on a plip's Guest Book card — who they are. " +
      'Re-readable any time.',
    en: 'plips are a wordless creature on N-Z-D. they love ' + 'company.',
    fa: '',
  },
  'story.friendCards.baluhm': {
    note:
      "The text on a baluhm's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'curious baluhms gravitate towards strangers, ' +
      'communicating mostly through gesture.',
    fa: '',
  },
  'story.friendCards.krupengk': {
    note:
      "The text on a krupengk's Guest Book card — who they " +
      'are. Re-readable any time.',
    en:
      'the observant krupengk loves to gather information, ' +
      'saving it all for analysis later.',
    fa: '',
  },
  'story.friendCards.zala': {
    note:
      "The text on a zala's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'zalas can be stand-offish, but you may see them often ' +
      'because they move slowly.',
    fa: '',
  },
  'story.friendCards.liwi-bi-jiji': {
    note:
      "The text on a liwi bi-jiji's Guest Book card — who they " +
      'are. Re-readable any time.',
    en:
      'the fastest creatures on N-Z-D are liwi bi-jijis, fans ' +
      'of scavenging competitions and chit chat.',
    fa: '',
  },
  'story.friendCards.meuhy': {
    note:
      "The text on a meuhy's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'meuhys are N-Z-D"s most loyal creatures. it takes them ' +
      'long to trust, but when they do, it"s forever.',
    fa: '',
  },
  'story.friendCards.rassatt': {
    note:
      "The text on a rassatt's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'rassatts live in a different layer of the atmosphere. ' +
      'they are friendly and talkative. they enjoy teasing and ' +
      'roasting.',
    fa: '',
  },
  'story.friendCards.woigolp': {
    note:
      "The text on a woigolp's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'woigolps rarely emerge from their quarters, but when ' +
      'they do it"s to fight or to eat. they are moody and ' +
      'aggressive.',
    fa: '',
  },
  'story.friendCards.chitu': {
    note:
      "The text on a chitu's Guest Book card — who they are. " +
      'Re-readable any time.',
    en:
      'shy, interovered chitus are N-Z-D"s finest poets. they ' +
      'are deeply fond of their local culture and language, ' +
      'and masters of art.',
    fa: '',
  },
  'story.friendCards.hamdi-bulo': {
    note:
      "The text on a hamdi bulo's Guest Book card — who they " +
      'are. Re-readable any time.',
    en:
      'N-Z-D currently hosts only one hamdi bulo. these ' +
      'long-living creatures are wise like oracles and have ' +
      'seen more than anyone else on the planet.',
    fa: '',
  },

  // ── Cameo messages ──────────────────────────────────────────────────────
  'story.cameos.bigDay': {
    note:
      'What a visiting friend says on the habit list after a ' +
      'big day of steps. Holes are filled in from the win ' +
      'itself.',
    en: '{n} steps in one day!',
    fa: '',
  },
  'story.cameos.streakRecordFirst': {
    note:
      'What a visiting friend says on the habit list after the ' +
      'first streak record a habit ever sets. Holes are filled ' +
      'in from the win itself.',
    en: '{n}-{unit} {habit} streak record!',
    fa: '',
  },
  'story.cameos.streakRecord': {
    note:
      'What a visiting friend says on the habit list after a ' +
      'habit beating its own earlier streak record. Holes are ' +
      'filled in from the win itself.',
    en: '{n}-{unit} {habit} streak record! your old best was ' + '{previous}.',
    fa: '',
  },
  'story.cameos.livedDays': {
    note:
      'What a visiting friend says on the habit list after ' +
      'crossing a lived-day milestone. Holes are filled in ' +
      'from the win itself.',
    en: '{n} lived days!',
    fa: '',
  },

  // ── Map regions ─────────────────────────────────────────────────────────
  'story.mapRegions.region1': {
    note:
      'The word shown when map region 1 is discovered (the ' +
      'landing site in the middle of the map).',
    en: 'sahara',
    fa: '',
  },
  'story.mapRegions.region2': {
    note:
      'The word shown when map region 2 is discovered (in the ' +
      'ring around the landing site).',
    en: 'ari',
    fa: '',
  },
  'story.mapRegions.region3': {
    note:
      'The word shown when map region 3 is discovered (in the ' +
      'ring around the landing site).',
    en: 'lerato',
    fa: '',
  },
  'story.mapRegions.region4': {
    note:
      'The word shown when map region 4 is discovered (in the ' +
      'ring around the landing site).',
    en: 'sogol',
    fa: '',
  },
  'story.mapRegions.region5': {
    note:
      'The word shown when map region 5 is discovered (in the ' +
      'ring around the landing site).',
    en: 'kian',
    fa: '',
  },
  'story.mapRegions.region6': {
    note:
      'The word shown when map region 6 is discovered (in the ' +
      'ring around the landing site).',
    en: 'ida',
    fa: '',
  },
  'story.mapRegions.region7': {
    note:
      'The word shown when map region 7 is discovered (in the ' +
      'outer ring).',
    en: 'sufi',
    fa: '',
  },
  'story.mapRegions.region8': {
    note:
      'The word shown when map region 8 is discovered (in the ' +
      'outer ring).',
    en: 'cyrus',
    fa: '',
  },
  'story.mapRegions.region9': {
    note:
      'The word shown when map region 9 is discovered (in the ' +
      'outer ring).',
    en: 'shiva',
    fa: '',
  },
  'story.mapRegions.region10': {
    note:
      'The word shown when map region 10 is discovered (in the ' +
      'outer ring).',
    en: 'oratile',
    fa: '',
  },
  'story.mapRegions.region11': {
    note:
      'The word shown when map region 11 is discovered (in the ' +
      'outer ring).',
    en: 'chaymae',
    fa: '',
  },
  'story.mapRegions.region12': {
    note:
      'The word shown when map region 12 is discovered (in the ' +
      'outer ring).',
    en: 'hamid',
    fa: '',
  },
  'story.mapRegions.region13': {
    note:
      'The word shown when map region 13 is discovered (in the ' +
      'outer ring).',
    en: 'parnian',
    fa: '',
  },
  'story.mapRegions.region14': {
    note:
      'The word shown when map region 14 is discovered (in the ' +
      'outer ring).',
    en: 'marie-simone',
    fa: '',
  },
  'story.mapRegions.region15': {
    note:
      'The word shown when map region 15 is discovered (in the ' +
      'outer ring).',
    en: 'tadiwa',
    fa: '',
  },
  'story.mapRegions.region16': {
    note:
      'The word shown when map region 16 is discovered (in the ' +
      'outer ring).',
    en: 'lily',
    fa: '',
  },

  // ── The ten species ─────────────────────────────────────────────────────
  'name.species.plip': {
    note:
      'What one plip is called on screen: Guest Book, arrival, ' +
      'shelf and cameo visits.',
    en: 'plip',
    fa: '',
  },
  'name.species.baluhm': {
    note:
      'What one baluhm is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'baluhm',
    fa: '',
  },
  'name.species.krupengk': {
    note:
      'What one krupengk is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'krupengk',
    fa: '',
  },
  'name.species.zala': {
    note:
      'What one zala is called on screen: Guest Book, arrival, ' +
      'shelf and cameo visits.',
    en: 'zala',
    fa: '',
  },
  'name.species.liwi-bi-jiji': {
    note:
      'What one liwi bi-jiji is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'liwi bi-jiji',
    fa: '',
  },
  'name.species.meuhy': {
    note:
      'What one meuhy is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'meuhy',
    fa: '',
  },
  'name.species.rassatt': {
    note:
      'What one rassatt is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'rassatt',
    fa: '',
  },
  'name.species.woigolp': {
    note:
      'What one woigolp is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'woigolp',
    fa: '',
  },
  'name.species.chitu': {
    note:
      'What one chitu is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'chitu',
    fa: '',
  },
  'name.species.hamdi-bulo': {
    note:
      'What one hamdi bulo is called on screen: Guest Book, ' +
      'arrival, shelf and cameo visits.',
    en: 'hamdi bulo',
    fa: '',
  },

  // ── The individuals ─────────────────────────────────────────────────────
  'name.individuals.plip.1': {
    note: 'The personal name of plip number 1, in the order they ' + 'arrive.',
    en: 'bi',
    fa: '',
  },
  'name.individuals.plip.2': {
    note: 'The personal name of plip number 2, in the order they ' + 'arrive.',
    en: 'ti',
    fa: '',
  },
  'name.individuals.plip.3': {
    note: 'The personal name of plip number 3, in the order they ' + 'arrive.',
    en: 'ki',
    fa: '',
  },
  'name.individuals.plip.4': {
    note: 'The personal name of plip number 4, in the order they ' + 'arrive.',
    en: 'zi',
    fa: '',
  },
  'name.individuals.plip.5': {
    note: 'The personal name of plip number 5, in the order they ' + 'arrive.',
    en: 'mi',
    fa: '',
  },
  'name.individuals.plip.6': {
    note: 'The personal name of plip number 6, in the order they ' + 'arrive.',
    en: 'ri',
    fa: '',
  },
  'name.individuals.plip.7': {
    note: 'The personal name of plip number 7, in the order they ' + 'arrive.',
    en: 'ji',
    fa: '',
  },
  'name.individuals.plip.8': {
    note: 'The personal name of plip number 8, in the order they ' + 'arrive.',
    en: 'li',
    fa: '',
  },
  'name.individuals.plip.9': {
    note: 'The personal name of plip number 9, in the order they ' + 'arrive.',
    en: 'wi',
    fa: '',
  },
  'name.individuals.plip.10': {
    note: 'The personal name of plip number 10, in the order they ' + 'arrive.',
    en: 'di',
    fa: '',
  },
  'name.individuals.baluhm.1': {
    note:
      'The personal name of baluhm number 1, in the order they ' + 'arrive.',
    en: 'owa',
    fa: '',
  },
  'name.individuals.baluhm.2': {
    note:
      'The personal name of baluhm number 2, in the order they ' + 'arrive.',
    en: 'nor',
    fa: '',
  },
  'name.individuals.baluhm.3': {
    note:
      'The personal name of baluhm number 3, in the order they ' + 'arrive.',
    en: 'dulu',
    fa: '',
  },
  'name.individuals.baluhm.4': {
    note:
      'The personal name of baluhm number 4, in the order they ' + 'arrive.',
    en: 'feh',
    fa: '',
  },
  'name.individuals.baluhm.5': {
    note:
      'The personal name of baluhm number 5, in the order they ' + 'arrive.',
    en: 'swa',
    fa: '',
  },
  'name.individuals.baluhm.6': {
    note:
      'The personal name of baluhm number 6, in the order they ' + 'arrive.',
    en: 'rou',
    fa: '',
  },
  'name.individuals.baluhm.7': {
    note:
      'The personal name of baluhm number 7, in the order they ' + 'arrive.',
    en: 'loi',
    fa: '',
  },
  'name.individuals.baluhm.8': {
    note:
      'The personal name of baluhm number 8, in the order they ' + 'arrive.',
    en: 'momo',
    fa: '',
  },
  'name.individuals.baluhm.9': {
    note:
      'The personal name of baluhm number 9, in the order they ' + 'arrive.',
    en: 'sah',
    fa: '',
  },
  'name.individuals.krupengk.1': {
    note:
      'The personal name of krupengk number 1, in the order ' + 'they arrive.',
    en: 'chok',
    fa: '',
  },
  'name.individuals.krupengk.2': {
    note:
      'The personal name of krupengk number 2, in the order ' + 'they arrive.',
    en: 'draktam',
    fa: '',
  },
  'name.individuals.krupengk.3': {
    note:
      'The personal name of krupengk number 3, in the order ' + 'they arrive.',
    en: 'su-chuch',
    fa: '',
  },
  'name.individuals.krupengk.4': {
    note:
      'The personal name of krupengk number 4, in the order ' + 'they arrive.',
    en: 'glongk',
    fa: '',
  },
  'name.individuals.krupengk.5': {
    note:
      'The personal name of krupengk number 5, in the order ' + 'they arrive.',
    en: 'ach-tek',
    fa: '',
  },
  'name.individuals.krupengk.6': {
    note:
      'The personal name of krupengk number 6, in the order ' + 'they arrive.',
    en: 'papo-palat',
    fa: '',
  },
  'name.individuals.krupengk.7': {
    note:
      'The personal name of krupengk number 7, in the order ' + 'they arrive.',
    en: 'serchu',
    fa: '',
  },
  'name.individuals.krupengk.8': {
    note:
      'The personal name of krupengk number 8, in the order ' + 'they arrive.',
    en: 'klist',
    fa: '',
  },
  'name.individuals.zala.1': {
    note: 'The personal name of zala number 1, in the order they ' + 'arrive.',
    en: 'joo',
    fa: '',
  },
  'name.individuals.zala.2': {
    note: 'The personal name of zala number 2, in the order they ' + 'arrive.',
    en: 'ri-mapa',
    fa: '',
  },
  'name.individuals.zala.3': {
    note: 'The personal name of zala number 3, in the order they ' + 'arrive.',
    en: 'foyon',
    fa: '',
  },
  'name.individuals.zala.4': {
    note: 'The personal name of zala number 4, in the order they ' + 'arrive.',
    en: 'ulu-wumu',
    fa: '',
  },
  'name.individuals.zala.5': {
    note: 'The personal name of zala number 5, in the order they ' + 'arrive.',
    en: 'sidakuza',
    fa: '',
  },
  'name.individuals.zala.6': {
    note: 'The personal name of zala number 6, in the order they ' + 'arrive.',
    en: 'fente',
    fa: '',
  },
  'name.individuals.zala.7': {
    note: 'The personal name of zala number 7, in the order they ' + 'arrive.',
    en: 'lujaa',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.1': {
    note:
      'The personal name of liwi bi-jiji number 1, in the ' +
      'order they arrive.',
    en: 'dugo linowa',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.2': {
    note:
      'The personal name of liwi bi-jiji number 2, in the ' +
      'order they arrive.',
    en: 'sirid umaan',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.3': {
    note:
      'The personal name of liwi bi-jiji number 3, in the ' +
      'order they arrive.',
    en: 'so-lono chapina',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.4': {
    note:
      'The personal name of liwi bi-jiji number 4, in the ' +
      'order they arrive.',
    en: 'indiz aku-tata',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.5': {
    note:
      'The personal name of liwi bi-jiji number 5, in the ' +
      'order they arrive.',
    en: 'fo-kocho panu-baa',
    fa: '',
  },
  'name.individuals.liwi-bi-jiji.6': {
    note:
      'The personal name of liwi bi-jiji number 6, in the ' +
      'order they arrive.',
    en: 'rolo mu-nino',
    fa: '',
  },
  'name.individuals.meuhy.1': {
    note: 'The personal name of meuhy number 1, in the order they ' + 'arrive.',
    en: 'auhya',
    fa: '',
  },
  'name.individuals.meuhy.2': {
    note: 'The personal name of meuhy number 2, in the order they ' + 'arrive.',
    en: 'uwo',
    fa: '',
  },
  'name.individuals.meuhy.3': {
    note: 'The personal name of meuhy number 3, in the order they ' + 'arrive.',
    en: 'yawy',
    fa: '',
  },
  'name.individuals.meuhy.4': {
    note: 'The personal name of meuhy number 4, in the order they ' + 'arrive.',
    en: 'wuyo',
    fa: '',
  },
  'name.individuals.meuhy.5': {
    note: 'The personal name of meuhy number 5, in the order they ' + 'arrive.',
    en: 'nii',
    fa: '',
  },
  'name.individuals.rassatt.1': {
    note:
      'The personal name of rassatt number 1, in the order ' + 'they arrive.',
    en: 'batta du',
    fa: '',
  },
  'name.individuals.rassatt.2': {
    note:
      'The personal name of rassatt number 2, in the order ' + 'they arrive.',
    en: 'sikki chi',
    fa: '',
  },
  'name.individuals.rassatt.3': {
    note:
      'The personal name of rassatt number 3, in the order ' + 'they arrive.',
    en: 'zuchi naffi',
    fa: '',
  },
  'name.individuals.rassatt.4': {
    note:
      'The personal name of rassatt number 4, in the order ' + 'they arrive.',
    en: 'appatta',
    fa: '',
  },
  'name.individuals.woigolp.1': {
    note:
      'The personal name of woigolp number 1, in the order ' + 'they arrive.',
    en: 'mogo',
    fa: '',
  },
  'name.individuals.woigolp.2': {
    note:
      'The personal name of woigolp number 2, in the order ' + 'they arrive.',
    en: 'unt',
    fa: '',
  },
  'name.individuals.woigolp.3': {
    note:
      'The personal name of woigolp number 3, in the order ' + 'they arrive.',
    en: 'rori',
    fa: '',
  },
  'name.individuals.chitu.1': {
    note: 'The personal name of chitu number 1, in the order they ' + 'arrive.',
    en: 'ayalit salong',
    fa: '',
  },
  'name.individuals.chitu.2': {
    note: 'The personal name of chitu number 2, in the order they ' + 'arrive.',
    en: 'ayalit sumachi',
    fa: '',
  },
  'name.individuals.hamdi-bulo.1': {
    note:
      'The personal name of hamdi bulo number 1, in the order ' +
      'they arrive.',
    en: 'pikimi bulo',
    fa: '',
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

// The story-and-names half of the deck, nested the way the readers walk
// it: nest('story', 'en') turns the flat key
// 'story.firstReveals.flora.title' into
// { firstReveals: { flora: { title: '…' } } }. narration.js and names.js
// build their tables from this — those files hold no words any more.
// Only the language asked for is read, and there is NO fallback: a blank
// stays blank, and the readers show nothing for it (the half's rule).
export function nest(prefix, code) {
  const tree = {}
  for (const [key, entry] of Object.entries(STORY_DECK)) {
    if (!key.startsWith(prefix + '.')) continue
    const path = key.slice(prefix.length + 1).split('.')
    let node = tree
    for (const step of path.slice(0, -1)) node = node[step] ??= {}
    node[path[path.length - 1]] = entry[code]
  }
  return tree
}

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

// The twelve months of the Persian (Jalali) calendar, as the key
// fragments the jmonth.* slots are named with (T6.18).
export const JALALI_MONTH_KEYS = [
  'farvardin',
  'ordibehesht',
  'khordad',
  'tir',
  'mordad',
  'shahrivar',
  'mehr',
  'aban',
  'azar',
  'dey',
  'bahman',
  'esfand',
]

// Which calendar each language shows dates in. Display only: day keys
// stay Gregorian and drive every streak whatever is chosen here.
export const LANGUAGE_CALENDAR = { en: 'gregorian', fa: 'jalali' }

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
