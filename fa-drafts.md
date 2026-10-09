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

## Batch 3 — 38 slots: habit list, schedules, counts, check-in, navigation, dates

Batches 1 and 2 are live (52 slots). Notes on choices in this batch:

- **Streak** is drafted as «زنجیره» ("chain"), the word most habit apps use.
- **n** in "n days a week" / "n times a day" stays a Latin letter here, because
  the app swaps it for a number box; tell me if you'd rather have another
  placeholder.
- **Plurals:** Farsi keeps a noun singular after a number, so the "one" and
  "other" slots of the day and week counts are the same.
- **Hours:** «صبح» for a.m. and «بعدازظهر» for p.m. (evening hours would
  more naturally say «شب»; say so if you want that handled).
- Weekday names, Jalali month names and the remaining interface words come
  in the next batches.

### habits.filterView
- **English:** filter view
- **Where it shows:** Label of the control that opens the lens choices above the habit list.
- **Draft:** فیلتر نما
- **Notes:**

### habits.addPlaceholder
- **English:** add a habit or task…
- **Where it shows:** Invitation written in the empty tile at the end of the habit list.
- **Draft:** یک عادت یا کار اضافه کن…
- **Notes:**

### habits.archivedTag
- **English:** (archived)
- **Where it shows:** Small tag beside an archived habit's name.
- **Draft:** (بایگانی‌شده)
- **Notes:**

### habits.archivedHeading
- **English:** archived ({n})
- **Where it shows:** Heading of the archived drawer. {n} is how many are archived.
- **Draft:** بایگانی‌شده‌ها ({n})
- **Notes:**

### habits.doneOn
- **English:** done {day}
- **Where it shows:** Line on a finished to-do. {day} is the date it was done.
- **Draft:** انجام‌شده در {day}
- **Notes:**

### habits.scheduleChangeConfirm
- **English:** heads up: this schedule change switches how "{habit}"'s streak is counted, so the current streak ({streak}) starts fresh from today. save anyway?
- **Where it shows:** Question before a schedule edit that restarts the streak. {habit} is the name, {streak} a counted unit above.
- **Draft:** حواست باشد: این تغییر برنامه روش شمارش زنجیرهٔ «{habit}» را عوض می‌کند، برای همین زنجیرهٔ فعلی ({streak}) از امروز از نو شروع می‌شود. باز هم ذخیره شود؟
- **Notes:**

### habits.deleteConfirm
- **English:** delete "{habit}" forever? its whole history goes with it. archiving (already done) keeps the history.
- **Where it shows:** Question before a habit is deleted for good. {habit} is its name.
- **Draft:** «{habit}» برای همیشه حذف شود؟ همهٔ تاریخچه‌اش هم همراهش می‌رود. بایگانی (که قبلاً انجام شده) تاریخچه را نگه می‌دارد.
- **Notes:**

### schedule.daily
- **English:** every day
- **Where it shows:** Schedule choice in the habit form: every day.
- **Draft:** هر روز
- **Notes:**

### schedule.weekdays
- **English:** specific weekdays
- **Where it shows:** Schedule choice in the habit form: pick the days.
- **Draft:** روزهای مشخصی از هفته
- **Notes:**

### schedule.nPerWeek
- **English:** n days a week
- **Where it shows:** Schedule choice in the habit form: a number of days each week.
- **Draft:** n روز در هفته
- **Notes:**

### schedule.nPerDay
- **English:** n times a day
- **Where it shows:** Schedule choice in the habit form: a number of times each day.
- **Draft:** n بار در روز
- **Notes:**

### schedule.whenever
- **English:** whenever
- **Where it shows:** Schedule choice in the habit form: no fixed schedule. Also the tile's summary line.
- **Draft:** هر وقت شد
- **Notes:**

### schedule.oneTime
- **English:** one-time (a to-do)
- **Where it shows:** Schedule choice in the habit form: a one-time to-do.
- **Draft:** یک‌باره (یک کار)
- **Notes:**

### schedule.summary.nPerWeek
- **English:** {n}×/week
- **Where it shows:** Habit tile's summary line for "n days a week". {n} is the number.
- **Draft:** {n}× در هفته
- **Notes:**

### schedule.summary.nPerDay
- **English:** {n}×/day
- **Where it shows:** Habit tile's summary line for "n times a day". {n} is the number.
- **Draft:** {n}× در روز
- **Notes:**

### schedule.summary.oneTime
- **English:** one-time
- **Where it shows:** Habit tile's summary line for a one-time to-do.
- **Draft:** یک‌باره
- **Notes:**

### difficulty.easy
- **English:** easy
- **Where it shows:** Easiest difficulty choice in the habit form.
- **Draft:** آسان
- **Notes:**

### difficulty.medium
- **English:** medium
- **Where it shows:** Middle difficulty choice in the habit form.
- **Draft:** متوسط
- **Notes:**

### difficulty.difficult
- **English:** difficult
- **Where it shows:** Hardest difficulty choice in the habit form.
- **Draft:** سخت
- **Notes:**

### count.day.one
- **English:** {n} day
- **Where it shows:** A count of one day. {n} is the number.
- **Draft:** {n} روز
- **Notes:**

### count.day.other
- **English:** {n} days
- **Where it shows:** A count of several days. A language without plurals can fill both the same.
- **Draft:** {n} روز
- **Notes:**

### count.week.one
- **English:** {n} week
- **Where it shows:** A count of one week.
- **Draft:** {n} هفته
- **Notes:**

### count.week.other
- **English:** {n} weeks
- **Where it shows:** A count of several weeks.
- **Draft:** {n} هفته
- **Notes:**

### habitForm.errorNoName
- **English:** habit needs a name.
- **Where it shows:** Refusal when saving a habit with no name.
- **Draft:** عادت باید اسم داشته باشد.
- **Notes:**

### habitForm.errorNoWeekday
- **English:** pick at least one day
- **Where it shows:** Refusal when a weekdays schedule has no day ticked.
- **Draft:** دست‌کم یک روز انتخاب کن
- **Notes:**

### checkin.tickDone
- **English:** done
- **Where it shows:** Tick on a check-in tile when the habit is already done.
- **Draft:** انجام شده
- **Notes:**

### checkin.showFewer
- **English:** show fewer
- **Where it shows:** Fold button that shortens a long day in the check-in.
- **Draft:** کمتر نشان بده
- **Notes:**

### checkin.showMore
- **English:** show {n} more
- **Where it shows:** Fold button that shows the rest of a long day. {n} is how many more.
- **Draft:** {n} مورد دیگر نشان بده
- **Notes:**

### nav.backToHabits
- **English:** back to the habits
- **Where it shows:** Link back to the habit list. The arrow is drawn by the page, not part of the words.
- **Draft:** برگشت به عادت‌ها
- **Notes:**

### nav.earlier
- **English:** earlier
- **Where it shows:** Button to move to an earlier page of days. The arrow is drawn by the page.
- **Draft:** قبل‌تر
- **Notes:**

### nav.later
- **English:** later
- **Where it shows:** Button to move to a later page of days. The arrow is drawn by the page.
- **Draft:** بعدتر
- **Notes:**

### date.line
- **English:** {weekday} {day} {month} {year}
- **Where it shows:** Order of the date line at the top of the home screen. Holes: {weekday} {day} {month} {year}. Move them to suit the grammar.
- **Draft:** {weekday} {day} {month} {year}
- **Notes:**

### date.cutoffNote
- **English:** your habits will switch to a new day at {time}
- **Where it shows:** Note under the date, shown only between midnight and the day cutoff. {time} is one of the two hour forms below.
- **Draft:** عادت‌هایت ساعت {time} به روز جدید می‌روند
- **Notes:**

### time.hourAm
- **English:** {hour} a.m.
- **Where it shows:** An hour before noon, e.g. "4 a.m.". {hour} is the number.
- **Draft:** {hour} صبح
- **Notes:**

### time.hourPm
- **English:** {hour} p.m.
- **Where it shows:** An hour after noon, e.g. "4 p.m.". {hour} is the number.
- **Draft:** {hour} بعدازظهر
- **Notes:**

### fieldNotes.zoom.day
- **English:** day by day
- **Where it shows:** Graph zoom choice: one point per day.
- **Draft:** روز به روز
- **Notes:**

### fieldNotes.zoom.week
- **English:** week by week
- **Where it shows:** Graph zoom choice: one point per week.
- **Draft:** هفته به هفته
- **Notes:**

### fieldNotes.zoom.fourWeek
- **English:** 4 weeks at a time
- **Where it shows:** Graph zoom choice: one point per four weeks.
- **Draft:** هر چهار هفته
- **Notes:**
