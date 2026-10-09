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

Batch 3: 32 of 38 slots accepted and live (84 slots in all). The other 6 are
below with your changes in script. Two of them wait on one open question.

### Question: a cozier word for "task"

You don't like «کار» for "task". It is in two slots below and in two live
slots from earlier (`lens.todos` «کارهای یک‌باره» and `habitForm.name`
«... یا کار یک‌باره بنویس»), which I'll redo with whatever you pick. Options:

- **«یک‌باره»** on its own as the noun (a "one-timer"): light and cozy,
  and you already like it. My pick.
- **«وظیفه»** (vazife): "duty/task", a bit formal.
- **«تکلیف»** (taklif): "assignment", feels like homework.
- **«گام»** (gam): "a step", friendly, but also means a step in a habit.
- **«مأموریت»** (ma'muriyyat): "mission", playful but big.

Tell me which in Notes under any slot below.

### habits.addPlaceholder
- **English:** add a habit or task…
- **Where it shows:** Invitation written in the empty tile at the end of the habit list.
- **Draft:** یک عادت خوب یا کار یک‌باره اضافه کن…
- **Notes:**

### habits.deleteConfirm
- **English:** delete "{habit}" forever? its whole history goes with it. archiving (already done) keeps the history.
- **Where it shows:** Question before a habit is deleted for good. {habit} is its name.
- **Draft:** «{habit}» برای همیشه حذف شود؟ همهٔ تاریخچه‌اش هم همراهش می‌رود. بایگانی (که قبلاً برای «{habit}» انجام شده) تاریخچه را نگه می‌دارد.
- **Notes:**

### schedule.oneTime
- **English:** one-time (a to-do)
- **Where it shows:** Schedule choice in the habit form: a one-time to-do.
- **Draft:** یک‌باره
- **Notes:**

### schedule.summary.nPerWeek
- **English:** {n}×/week
- **Where it shows:** Habit tile's summary line for "n days a week". {n} is the number.
- **Draft:** {n} بار در هفته
- **Notes:**

### schedule.summary.nPerDay
- **English:** {n}×/day
- **Where it shows:** Habit tile's summary line for "n times a day". {n} is the number.
- **Draft:** {n} بار در روز
- **Notes:**

### nav.later
- **English:** later
- **Where it shows:** Button to move to a later page of days. The arrow is drawn by the page.
- **Draft:** جدیدتر
- **Notes:**
