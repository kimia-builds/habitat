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

## Batch 1 — your corrections, in Farsi script, to confirm

15 of batch 1's 26 slots were accepted as drafted and are now live. The other
11 are below with your changes turned into script. Where you asked me to
find a word, there is an **Also possible** line with other options. No
changes means accepted.

### page.abode
- **English:** your abode
- **Where it shows:** title of the Abode page
- **Draft:** سرپناه
- **Notes:**

### page.bookcase
- **English:** readers library
- **Where it shows:** title of the library page
- **Draft:** گنجینهٔ خواندنی‌ها
- **Also possible:** دارالکتب (old and grand, "house of books"), تالار کتاب‌ها ("hall of books")
- **Notes:**

### page.market
- **English:** local market
- **Where it shows:** title of the Market page
- **Draft:** بازارچهٔ محلی
- **Notes:**

### page.fieldNotes
- **English:** field notes
- **Where it shows:** title of the field notes page
- **Draft:** داده‌های تاریخی
- **Also possible:** پیشینه ("background / past record")
- **Notes:**

### meters.steps
- **English:** steps taken
- **Where it shows:** name of the steps meter, hover label
- **Draft:** قدم‌ها
- **Also possible:** گام‌ها (a slightly more formal "steps")
- **Notes:**

### meters.stepsBar
- **English:** steps taken progress
- **Where it shows:** screen-reader-only name for the moving bar of the steps meter
- **Draft:** قدم‌های برداشته‌شده
- **Notes:**

### meters.literacy
- **English:** literacy level
- **Where it shows:** name of the literacy meter, hover label
- **Draft:** سواد
- **Notes:**

### meters.literacyBar
- **English:** literacy level progress
- **Where it shows:** screen-reader-only name for the moving bar of the literacy meter
- **Draft:** سطح سواد
- **Notes:**

### meters.wallet
- **English:** wallet balance
- **Where it shows:** name of the wallet meter, hover label
- **Draft:** موجودی
- **Notes:**

### meters.walletBar
- **English:** wallet balance progress
- **Where it shows:** screen-reader-only name for the moving bar of the wallet meter
- **Draft:** موجودی مالی
- **Question:** you wrote "mojudi-e mal". I read it as "mojudi-ye mali" (financial balance). Did you mean that, or something else?
- **Notes:**

### habits.mute
- **English:** mute
- **Where it shows:** quiet word on a habit tile that hides it from today
- **Draft:** کم‌رنگ
- **Notes:**

---

## Batch 2 — the rest of the habit screen (26 slots)

The lens buttons, the habit form, the morning check-in, the week-shape popup
and the two safety messages.

### The lenses

### lens.today
- **English:** today
- **Where it shows:** lens button: show only what is due today
- **Draft:** امروز
- **Notes:**

### lens.todos
- **English:** to-dos
- **Where it shows:** lens button: show only one-time to-dos
- **Draft:** کارهای یک‌باره
- **Notes:**

### lens.prioritise
- **English:** prioritise
- **Where it shows:** lens button: show habits in priority order
- **Draft:** اولویت‌بندی
- **Notes:**

### lens.unhideAll
- **English:** un-hide all
- **Where it shows:** lens button: clear every hiding lens and charm
- **Draft:** نمایان کردن همه
- **Notes:**

### lens.saveAsDefault
- **English:** save as default view
- **Where it shows:** hover label and screen-reader name of the padlock (never shown as text)
- **Draft:** ذخیره به‌عنوان نمای پیش‌فرض
- **Notes:**

### lens.saveAsDefaultConfirm
- **English:** are you sure you want to save this as your default view? any previous default view choices will be lost. refresh the page to go back to previous default view.
- **Where it shows:** question asked before the padlock overwrites the saved default view
- **Draft:** مطمئنی که می‌خواهی این را نمای پیش‌فرضت ذخیره کنی؟ انتخاب‌های پیش‌فرض قبلی از بین می‌روند. برای برگشتن به نمای پیش‌فرض قبلی، صفحه را دوباره بارگذاری کن.
- **Notes:**

### The habit form

### habitForm.name
- **English:** write a good habit or task:
- **Where it shows:** first prompt of the habit form, above the name box
- **Draft:** یک عادت یا کار خوب بنویس:
- **Notes:**

### habitForm.detail
- **English:** add any details or specifications:
- **Where it shows:** second prompt of the habit form, above the details box
- **Draft:** هر جزئیات یا توضیحی که می‌خواهی اضافه کن:
- **Notes:**

### habitForm.difficulty
- **English:** pick a difficulty per unit:
- **Where it shows:** third prompt of the habit form, above the difficulty choices
- **Draft:** برای هر واحد یک سطح دشواری انتخاب کن:
- **Notes:**

### habitForm.schedule
- **English:** specify the desired schedule or frequency:
- **Where it shows:** fourth prompt of the habit form, above the schedule choices
- **Draft:** برنامه یا تناوب دلخواه را مشخص کن:
- **Notes:**

### habitForm.howMany
- **English:** how many
- **Where it shows:** label of the small number box for "n days a week" or "n times a day"
- **Draft:** چندتا
- **Notes:**

### habitForm.save
- **English:** save
- **Where it shows:** habit form button that saves the habit
- **Draft:** ذخیره
- **Notes:**

### habitForm.cancel
- **English:** cancel
- **Where it shows:** habit form button that closes the form without saving
- **Draft:** لغو
- **Notes:**

### The morning check-in

### checkin.region
- **English:** check-in
- **Where it shows:** screen-reader name for the morning check-in panel
- **Draft:** ثبت روزانه
- **Notes:**

### checkin.prompt
- **English:** what did you do yesterday?
- **Where it shows:** the question at the top of the morning check-in
- **Draft:** دیروز چه کردی؟
- **Notes:**

### checkin.earlierDays
- **English:** update earlier days of this week before they freeze forever:
- **Where it shows:** line above the earlier days of this week in the check-in, warning they will soon freeze
- **Draft:** پیش از آنکه برای همیشه قفل شوند، روزهای قبلی این هفته را به‌روز کن:
- **Notes:**

### checkin.noHabits
- **English:** no habits to show for this day
- **Where it shows:** shown in the check-in when a day has no habits due
- **Draft:** برای این روز عادتی نیست
- **Notes:**

### checkin.done
- **English:** done
- **Where it shows:** check-in button that finishes the check-in
- **Draft:** تمام
- **Notes:**

### The week shape

### weekShape.button
- **English:** week shape
- **Where it shows:** the pebble beside the language switch that opens the week shapes
- **Draft:** شکل هفته
- **Notes:**

### weekShape.title
- **English:** which day does your week start on?
- **Where it shows:** the question at the top of the week-shape popup
- **Draft:** هفتهٔ تو از چه روزی شروع می‌شود؟
- **Notes:**

### weekShape.mon
- **English:** mon – sun
- **Where it shows:** week shape: Monday first, Sunday last
- **Draft:** دوشنبه – یکشنبه
- **Notes:**

### weekShape.sun
- **English:** sun – sat
- **Where it shows:** week shape: Sunday first, Saturday last
- **Draft:** یکشنبه – شنبه
- **Notes:**

### weekShape.sat
- **English:** sat – fri
- **Where it shows:** week shape: Saturday first, Friday last
- **Draft:** شنبه – جمعه
- **Notes:**

### weekShape.close
- **English:** close
- **Where it shows:** closes the week-shape popup without changing anything
- **Draft:** بستن
- **Notes:**

### The safety screens

### blocked.message
- **English:** N-Z-D is currently only a habitat that can be experienced on a big browser, like a laptop or desktop computer. check back in on the big screen!
- **Where it shows:** the one message shown when Habitat is opened on a screen too narrow for it (phone or tablet)
- **Draft:** N-Z-D فعلاً زیستگاهی است که فقط روی صفحهٔ بزرگ مرورگر، مثل لپ‌تاپ یا رایانهٔ رومیزی، تجربه می‌شود. روی صفحهٔ بزرگ دوباره سر بزن!
- **Notes:**

### mishap.message
- **English:** something seems to have gone wrong: please inform the maker. refresh page to get back to habits.
- **Where it shows:** the one message shown if something unexpected breaks and a screen cannot draw
- **Draft:** به نظر می‌رسد مشکلی پیش آمده: لطفاً به سازنده خبر بده. صفحه را دوباره بارگذاری کن تا به عادت‌ها برگردی.
- **Notes:**
