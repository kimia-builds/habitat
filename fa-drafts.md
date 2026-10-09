# Farsi drafts — Kimia's review queue (T6.19)

These are Claude's DRAFTS. Nothing here is live. A word only reaches the
app after Kimia approves it, and then Claude copies it into the `fa:` line
of that entry in `src/content/ui.js`. Until then the app keeps showing
English for that slot, which is the safe way to be wrong.

## How to review (on GitHub's website is fine)

Each slot below looks like this:

```
### rail.pages
- **English:** pages
- **Where it shows:** (plain-English note from the copy deck)
- **Draft:** صفحه‌ها
- **Notes:**
```

Fill in Notes by suggesting a change or a direction of change ("less
formal", "shorter", or a Finglish version of the word you want). No
changes means accepted.

## Choices made once, for the whole file (change any of these and I redo the lot)

- **Register:** friendly "you" (تو / ـت), the way you'd talk to a friend, not
  the formal "shoma". e.g. «دیروز چه کردی؟».
- **Word spelling:** standard written Farsi, with the half-space (the little
  gap that keeps a word's two halves apart, like in «صفحه‌ها»).
- **N-Z-D** stays in Latin letters, since it is the world's name and not a
  Farsi word.
- **Numbers and dates** are not in this file; the digits and Jalali dates
  already work.

---

## Waiting for review

Batch 5 is complete: all 54 slots are live (191 slots in all). This is the
last batch of interface words; after it, only the six charm names (screen
reader only) and the story and names remain.

## Batch 6 — 40 slots: backup and start-a-new-game

Choices to look at:

- **Backup** is «پشتیبان» ("support/backup"), the usual word.
- **Habitat** stays in Latin letters inside sentences, like N-Z-D.
- **Total refresh** is «پاک‌سازی کامل» ("complete cleaning").
- **World seed** is «بذر دنیا» ("seed of the world").
- **Field-notes marker** uses your page title, «داده‌های تاریخی».
- **Expedition** is «اکتشاف», **flora** here is plain «گیاه‌ها».

### backup.export
- **English:** export backup
- **Where it shows:** Pebble that saves a backup file.
- **Draft:** ذخیرهٔ پشتیبان
- **Notes:**

### backup.import
- **English:** import backup
- **Where it shows:** Pebble that loads a backup file.
- **Draft:** بارگذاری پشتیبان
- **Notes:**

### backup.file
- **English:** backup file
- **Where it shows:** Screen-reader name of the file chooser behind the import pebble.
- **Draft:** فایل پشتیبان
- **Notes:**

### backup.ageNone
- **English:** no backup yet
- **Where it shows:** Hover on the export pebble when no backup was ever made.
- **Draft:** هنوز پشتیبانی گرفته نشده
- **Notes:**

### backup.ageFuture
- **English:** backed up
- **Where it shows:** Hover on the export pebble when the backup date is in the future (clock oddity).
- **Draft:** پشتیبان گرفته شد
- **Notes:**

### backup.ageToday
- **English:** backed up today
- **Where it shows:** Hover on the export pebble: last backup was today.
- **Draft:** امروز پشتیبان گرفته شد
- **Notes:**

### backup.ageYesterday
- **English:** backed up yesterday
- **Where it shows:** Hover on the export pebble: last backup was yesterday.
- **Draft:** دیروز پشتیبان گرفته شد
- **Notes:**

### backup.ageDays
- **English:** backed up {days} days ago
- **Where it shows:** Hover on the export pebble: last backup was {days} days ago.
- **Draft:** {days} روز پیش پشتیبان گرفته شد
- **Notes:**

### backup.importConfirm
- **English:** importing replaces EVERYTHING currently in habitat with the backup file. continue?
- **Where it shows:** Question before an import replaces everything.
- **Draft:** با بارگذاری این پشتیبان، همهٔ چیزهایی که الان در Habitat هست جایگزین می‌شود. ادامه بدهم؟
- **Notes:**

### backup.importCancelled
- **English:** import cancelled — nothing was changed
- **Where it shows:** Shown after the import question is answered no.
- **Draft:** بارگذاری لغو شد — هیچ چیز تغییر نکرد
- **Notes:**

### backup.imported
- **English:** backup imported
- **Where it shows:** Shown after a backup is imported successfully.
- **Draft:** پشتیبان بارگذاری شد
- **Notes:**

### backup.error.notABackup
- **English:** this file does not look like a habitat backup.
- **Where it shows:** Refusal: the file is not a Habitat backup.
- **Draft:** به نظر نمی‌رسد این فایل یک پشتیبان Habitat باشد.
- **Notes:**

### backup.error.notJson
- **English:** this file is not readable as a habitat backup (not JSON).
- **Where it shows:** Refusal: the file cannot be read at all.
- **Draft:** این فایل را نمی‌شود به‌عنوان پشتیبان Habitat خواند (JSON نیست).
- **Notes:**

### backup.error.wrongVersion
- **English:** this backup uses format version {found}, but this app expects version {expected}.
- **Where it shows:** Refusal: wrong backup version. {found} and {expected} are version numbers.
- **Draft:** این پشتیبان با قالب نسخهٔ {found} است، ولی این برنامه نسخهٔ {expected} را می‌خواهد.
- **Notes:**

### backup.error.noHabits
- **English:** this backup is missing its habit list.
- **Where it shows:** Refusal: the habit list is missing.
- **Draft:** فهرست عادت‌ها در این پشتیبان نیست.
- **Notes:**

### backup.error.badCompletions
- **English:** this backup has a broken completions list.
- **Where it shows:** Refusal: the completions list is broken.
- **Draft:** فهرست انجام‌ها در این پشتیبان خراب است.
- **Notes:**

### backup.error.badSettings
- **English:** this backup has broken settings.
- **Where it shows:** Refusal: the settings are broken.
- **Draft:** تنظیمات این پشتیبان خراب است.
- **Notes:**

### backup.error.badFieldNotes
- **English:** this backup has a broken field-notes marker.
- **Where it shows:** Refusal: the field-notes marker is broken.
- **Draft:** نشانهٔ داده‌های تاریخی در این پشتیبان خراب است.
- **Notes:**

### backup.error.badStartup
- **English:** this backup has a broken startup marker.
- **Where it shows:** Refusal: the startup marker is broken.
- **Draft:** نشانهٔ شروع در این پشتیبان خراب است.
- **Notes:**

### backup.error.badBackupDate
- **English:** this backup has a broken backup-date marker.
- **Where it shows:** Refusal: the backup-date marker is broken.
- **Draft:** نشانهٔ تاریخ پشتیبان در این پشتیبان خراب است.
- **Notes:**

### backup.error.badLanguage
- **English:** this backup names a language habitat does not speak.
- **Where it shows:** Refusal: the file names a language Habitat does not speak.
- **Draft:** این پشتیبان زبانی را نام می‌برد که Habitat بلد نیست.
- **Notes:**

### backup.error.badSky
- **English:** this backup names a sky the abode does not have.
- **Where it shows:** Refusal: the file names a sky the Abode does not have.
- **Draft:** این پشتیبان آسمانی را نام می‌برد که سرپناه ندارد.
- **Notes:**

### backup.error.badWeekShape
- **English:** this backup names a week shape habitat does not have.
- **Where it shows:** Refusal: the file names a week shape Habitat does not have.
- **Draft:** این پشتیبان شکل هفته‌ای را نام می‌برد که Habitat ندارد.
- **Notes:**

### backup.error.badCheckin
- **English:** this backup has a broken check-in marker.
- **Where it shows:** Refusal: the check-in marker is broken.
- **Draft:** نشانهٔ ثبت روزانه در این پشتیبان خراب است.
- **Notes:**

### backup.error.noSeed
- **English:** this backup is missing its world seed.
- **Where it shows:** Refusal: the world seed is missing.
- **Draft:** بذر دنیا در این پشتیبان نیست.
- **Notes:**

### newGame.start
- **English:** start a new game
- **Where it shows:** Pebble that opens the start-a-new-game popup.
- **Draft:** شروع بازی تازه
- **Notes:**

### newGame.which
- **English:** which type of restart?
- **Where it shows:** Heading above the two restart doors.
- **Draft:** کدام نوع شروع دوباره؟
- **Notes:**

### newGame.refresh
- **English:** total refresh
- **Where it shows:** Door that wipes everything and starts again.
- **Draft:** پاک‌سازی کامل
- **Notes:**

### newGame.keep
- **English:** keep habit data
- **Where it shows:** Door that wipes the game but keeps habit data.
- **Draft:** نگه داشتن داده‌های عادت
- **Notes:**

### newGame.notNow
- **English:** not now
- **Where it shows:** Button that closes the popup without doing anything.
- **Draft:** حالا نه
- **Notes:**

### newGame.sure
- **English:** are you sure?
- **Where it shows:** Confirmation question after choosing a restart door.
- **Draft:** مطمئنی؟
- **Notes:**

### newGame.yes
- **English:** yes
- **Where it shows:** Answer: go ahead with the restart.
- **Draft:** بله
- **Notes:**

### newGame.no
- **English:** no, take me back
- **Where it shows:** Answer: step back from the restart.
- **Draft:** نه، برگردم
- **Notes:**

### newGame.backupFirst
- **English:** export a backup first
- **Where it shows:** Button to export a backup before restarting.
- **Draft:** اول پشتیبان بگیر
- **Notes:**

### newGame.refreshWarning
- **English:** everything will be wiped: habits, completions, and game progress. habitat will restart from day one. only a backup file you have already exported can bring any of it back.
- **Where it shows:** Plain warning under the total-refresh door.
- **Draft:** همه‌چیز پاک می‌شود: عادت‌ها، انجام‌ها و پیشرفت بازی. Habitat از روز اول دوباره شروع می‌شود. فقط فایل پشتیبانی که از قبل ذخیره کرده‌ای می‌تواند چیزی از این‌ها را برگرداند.
- **Notes:**

### newGame.keepWarning
- **English:** your gameplay will be wiped: flora, books, friends, fungi and expedition progress. your historical habit data, streaks and graphs will remain.
- **Where it shows:** Plain warning under the keep-habit-data door.
- **Draft:** پیشرفت بازی‌ات پاک می‌شود: گیاه‌ها، کتاب‌ها، دوست‌ها، قارچ‌ها و پیشرفت اکتشاف. داده‌های تاریخی عادت‌ها، زنجیره‌ها و نمودارهایت می‌مانند.
- **Notes:**

### newGame.refreshDone
- **English:** a new habitat has begun — everything starts from here
- **Where it shows:** Afterword shown once a total refresh has happened.
- **Draft:** یک Habitat تازه شروع شد — همه‌چیز از همین‌جا شروع می‌شود
- **Notes:**

### newGame.keepDone
- **English:** a new game has begun — your habits and history are untouched
- **Where it shows:** Afterword shown once a game-only restart has happened.
- **Draft:** یک بازی تازه شروع شد — عادت‌ها و تاریخچه‌ات دست‌نخورده‌اند
- **Notes:**

### newGame.askWipe
- **English:** do you want to wipe all your habit history and play habitat from total scratch?
- **Where it shows:** First question in the start-a-new-game popup.
- **Draft:** می‌خواهی کل تاریخچهٔ عادت‌هایت پاک شود و Habitat را از صفر بازی کنی؟
- **Notes:**

### newGame.askKeep
- **English:** or do you want to keep your habit history and restart the game? (requires you to export a backup)
- **Where it shows:** Second question in the start-a-new-game popup.
- **Draft:** یا می‌خواهی تاریخچهٔ عادت‌هایت بماند و فقط بازی از نو شروع شود؟ (باید اول یک پشتیبان بگیری)
- **Notes:**
