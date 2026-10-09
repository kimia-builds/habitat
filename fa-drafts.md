# Farsi drafts — Kimia's review queue (T6.19)

These are Claude's DRAFTS. Nothing here is live. A word only reaches the
app after Kimia approves it, and then Claude copies it into the `fa:` line
of that entry in `src/content/ui.js`. Until then the app keeps showing
English for that slot, which is the safe way to be wrong.

## How to review (on GitHub's website is fine)

Each slot below looks like this:

    ### rail.pages
    - **English:** pages
    - **Where it shows:** (plain-English note from the copy deck)
    - **Draft:** صفحه‌ها
    - **Sounds like:** safhe-ha
    - **Meaning back in English:** "pages" (plural)
    - **Verdict:**
    - **Your Finglish:**

Fill in **Verdict** with one of:

- `ok` — use my draft exactly as written.
- `change` — I got it wrong; put your version in **Your Finglish**.
- `later` — not sure yet, leave it blank for now.

**Your Finglish** is for corrections only. Write it however you naturally
would in Latin letters ("khaneh-at", "khuneh at", "khune-ye man" — all fine).
Claude turns it into Farsi script, shows you the script back next to your
Finglish so you can check it, and only then does it go in. If a word could be
read two ways, Claude asks rather than guesses.

You can also leave a note anywhere on a slot's lines — a comment, a worry,
"too formal". Claude reads every line.

## Choices made once, for the whole batch (change any of these and I redo the lot)

- **Register:** friendly "you" (تو / ـت), the way you'd talk to a friend, not the
  formal "shoma". e.g. "your abode" → «خانه‌ات».
- **Word spelling:** standard written Farsi, with the half-space (the little
  gap that keeps a word's two halves apart, like in «صفحه‌ها»).
- **N-Z-D** stays in Latin letters, since it is the world's name and not a
  Farsi word.
- **Numbers and dates** are not in this file; the digits and Jalali dates
  already work.

---

## Batch 1 — the first things you see (27 slots)

The rail, the page titles, the three meters, the language switch and the
words on a habit tile. This is also the batch where you tune the Farsi size
(`size-adjust` in `src/index.css`, currently 112%) once real words are on
screen.

### The left icon rail

### rail.pages
- **English:** pages
- **Where it shows:** hover label and screen-reader name for the rail icon that opens the habit list
- **Draft:** صفحه‌ها
- **Sounds like:** safhe-ha
- **Meaning back in English:** "pages" (plural)
- **Verdict:**
- **Your Finglish:**

### rail.addHabit
- **English:** add new habit
- **Where it shows:** hover label for the rail icon that opens a new-habit form
- **Draft:** افزودن عادت جدید
- **Sounds like:** afzudan-e adat-e jadid
- **Meaning back in English:** "adding a new habit"
- **Verdict:**
- **Your Finglish:**

### rail.editPastDays
- **English:** edit past days
- **Where it shows:** hover label for the rail icon that opens the morning check-in for earlier days
- **Draft:** ویرایش روزهای گذشته
- **Sounds like:** virayesh-e ruz-ha-ye gozashte
- **Meaning back in English:** "editing past days"
- **Verdict:**
- **Your Finglish:**

### rail.fieldNotes
- **English:** view historical data
- **Where it shows:** hover label for the rail icon that opens the field notes (history)
- **Draft:** دیدن داده‌های پیشین
- **Sounds like:** didan-e dade-ha-ye pishin
- **Meaning back in English:** "seeing earlier data"
- **Verdict:**
- **Your Finglish:**

### Page titles

### page.map
- **English:** map of N-Z-D
- **Where it shows:** title of the Map page, on its rail icon and at the top of the page
- **Draft:** نقشهٔ N-Z-D
- **Sounds like:** naghshe-ye N-Z-D
- **Meaning back in English:** "the map of N-Z-D"
- **Verdict:**
- **Your Finglish:**

### page.abode
- **English:** your abode
- **Where it shows:** title of the Abode page
- **Draft:** خانه‌ات
- **Sounds like:** khane-at
- **Meaning back in English:** "your home" (warm and short; «سرپناه» sarpanah = "shelter" is the alternative if "home" feels too ordinary for "abode")
- **Verdict:**
- **Your Finglish:**

### page.guestbook
- **English:** local community
- **Where it shows:** title of the Guest Book page
- **Draft:** جامعهٔ محلی
- **Sounds like:** jame'e-ye mahalli
- **Meaning back in English:** "the local community"
- **Verdict:**
- **Your Finglish:**

### page.bookcase
- **English:** readers library
- **Where it shows:** title of the library page
- **Draft:** کتابخانهٔ خوانندگان
- **Sounds like:** ketabkhane-ye khandegan
- **Meaning back in English:** "the readers' library"
- **Verdict:**
- **Your Finglish:**

### page.market
- **English:** local market
- **Where it shows:** title of the Market page
- **Draft:** بازار محلی
- **Sounds like:** bazar-e mahalli
- **Meaning back in English:** "the local market"
- **Verdict:**
- **Your Finglish:**

### page.fieldNotes
- **English:** field notes
- **Where it shows:** title of the field notes page
- **Draft:** یادداشت‌های میدانی
- **Sounds like:** yaddasht-ha-ye meydani
- **Meaning back in English:** "field notes" (notes taken out in the field)
- **Verdict:**
- **Your Finglish:**

### The three meters

### meters.region
- **English:** meters
- **Where it shows:** screen-reader name for the group of three meters at the top (not shown on screen)
- **Draft:** شاخص‌ها
- **Sounds like:** shakhes-ha
- **Meaning back in English:** "indicators / gauges"
- **Verdict:**
- **Your Finglish:**

### meters.steps
- **English:** steps taken
- **Where it shows:** name of the steps meter, hover label
- **Draft:** قدم‌های برداشته‌شده
- **Sounds like:** ghadam-ha-ye bardashte-shode
- **Meaning back in English:** "steps that have been taken"
- **Verdict:**
- **Your Finglish:**

### meters.stepsBar
- **English:** steps taken progress
- **Where it shows:** screen-reader-only name for the moving bar of the steps meter
- **Draft:** پیشرفت قدم‌های برداشته‌شده
- **Sounds like:** pishraft-e ghadam-ha-ye bardashte-shode
- **Meaning back in English:** "progress of the steps taken"
- **Verdict:**
- **Your Finglish:**

### meters.literacy
- **English:** literacy level
- **Where it shows:** name of the literacy meter, hover label
- **Draft:** سطح سواد
- **Sounds like:** sath-e savad
- **Meaning back in English:** "literacy level"
- **Verdict:**
- **Your Finglish:**

### meters.literacyBar
- **English:** literacy level progress
- **Where it shows:** screen-reader-only name for the moving bar of the literacy meter
- **Draft:** پیشرفت سطح سواد
- **Sounds like:** pishraft-e sath-e savad
- **Meaning back in English:** "progress of the literacy level"
- **Verdict:**
- **Your Finglish:**

### meters.wallet
- **English:** wallet balance
- **Where it shows:** name of the wallet meter, hover label
- **Draft:** موجودی کیف پول
- **Sounds like:** mojudi-ye kif-e pul
- **Meaning back in English:** "what's in the wallet"
- **Verdict:**
- **Your Finglish:**

### meters.walletBar
- **English:** wallet balance progress
- **Where it shows:** screen-reader-only name for the moving bar of the wallet meter
- **Draft:** پیشرفت موجودی کیف پول
- **Sounds like:** pishraft-e mojudi-ye kif-e pul
- **Meaning back in English:** "progress of the wallet balance"
- **Verdict:**
- **Your Finglish:**

### The language switch

### language.switch
- **English:** language
- **Where it shows:** name of the language switch
- **Draft:** زبان
- **Sounds like:** zaban
- **Meaning back in English:** "language"
- **Verdict:**
- **Your Finglish:**

### Words on a habit tile

### habits.markDone
- **English:** mark done
- **Where it shows:** hover label on a habit tile's tick
- **Draft:** انجام شد
- **Sounds like:** anjam shod
- **Meaning back in English:** "it's done" (a statement, the way a tick reads, rather than a command)
- **Verdict:**
- **Your Finglish:**

### habits.mute
- **English:** mute
- **Where it shows:** quiet word on a habit tile that hides it from today
- **Draft:** خاموش
- **Sounds like:** khamush
- **Meaning back in English:** "switch off / quiet"
- **Verdict:**
- **Your Finglish:**

### habits.unmute
- **English:** unmute
- **Where it shows:** quiet word on a muted habit tile that brings it back
- **Draft:** روشن
- **Sounds like:** roshan
- **Meaning back in English:** "switch on" (the natural opposite of «خاموش»)
- **Verdict:**
- **Your Finglish:**

### habits.edit
- **English:** edit
- **Where it shows:** quiet word on a habit tile that opens it for editing
- **Draft:** ویرایش
- **Sounds like:** virayesh
- **Meaning back in English:** "edit"
- **Verdict:**
- **Your Finglish:**

### habits.archive
- **English:** archive
- **Where it shows:** quiet word on a habit tile that tucks it into the archive
- **Draft:** بایگانی
- **Sounds like:** bayegani
- **Meaning back in English:** "archive"
- **Verdict:**
- **Your Finglish:**

### habits.unarchive
- **English:** unarchive
- **Where it shows:** quiet word on an archived habit that brings it back to the list
- **Draft:** بازگردانی
- **Sounds like:** bazgardani
- **Meaning back in English:** "restore / bring back"
- **Verdict:**
- **Your Finglish:**

### habits.deleteForever
- **English:** delete forever
- **Where it shows:** quiet word on an archived habit that deletes it for good (asks first)
- **Draft:** حذف برای همیشه
- **Sounds like:** hazf baraye hamishe
- **Meaning back in English:** "delete for ever"
- **Verdict:**
- **Your Finglish:**

### habits.unhideToReorder
- **English:** un-hide everything to re-order
- **Where it shows:** hover explanation of why a tile will not move while anything is hidden
- **Draft:** برای جابه‌جایی، همه‌چیز را نمایان کن
- **Sounds like:** baraye jabejayi, hame-chiz ra namayan kon
- **Meaning back in English:** "to move things around, show everything"
- **Verdict:**
- **Your Finglish:**
