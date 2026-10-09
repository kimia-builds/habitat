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

## Batch 5 — 54 slots: arrivals, Abode, Map, Market, library, Guest Book

Batch 4 is complete (136 slots live). Notes on choices in this batch:

- **Fungi** are «قارچ» (the ordinary word for mushroom/fungus) and **flora
  finds** are «یافتهٔ گیاهی» ("a plant find"). Say if the world has its own
  Farsi words for these and I'll redo them.
- **Curiosity** (a thing sold at the Market) is «شگفتی» ("wonder").
- **Compost** is the loanword «کمپوست», which is what people say.
- **Sky names:** ember «اخگری» (like a glowing ember), teal «سبزآبی»
  (green-blue), violet «بنفش», ash «خاکستری» (ash-grey).
- **Party mode / quietude** are «حالت جشن» / «آرامش».
- Not in this batch: the six charm names (screen-reader only, they just
  describe the drawings; I'll leave them for last) and the design workbench
  door, which stays English.

### arrivals.region
- **English:** arrivals
- **Where it shows:** Screen-reader name for the shelf of drops waiting to be dealt with.
- **Draft:** رسیده‌ها
- **Notes:**

### arrivals.hold
- **English:** click to hold
- **Where it shows:** Hover label on a drop: click to pick it up.
- **Draft:** برای نگه داشتن کلیک کن
- **Notes:**

### arrivals.gather
- **English:** gather
- **Where it shows:** Button to take a drop into the Abode.
- **Draft:** جمع کردن
- **Notes:**

### arrivals.leave
- **English:** leave it
- **Where it shows:** Button to leave a drop behind.
- **Draft:** رهایش کن
- **Notes:**

### arrivals.readNow
- **English:** read now
- **Where it shows:** Button to open an arrived book and read it now.
- **Draft:** همین حالا بخوان
- **Notes:**

### arrivals.readLater
- **English:** read later
- **Where it shows:** Button to shelve an arrived book for later.
- **Draft:** بعداً بخوان
- **Notes:**

### abode.ground
- **English:** the ground
- **Where it shows:** Screen-reader name for the Abode's ground.
- **Draft:** زمین
- **Notes:**

### abode.waitingToDecide
- **English:** waiting to decide
- **Where it shows:** Caption over items that have arrived but are not yet placed or sent away.
- **Draft:** منتظر تصمیم
- **Notes:**

### abode.floraFind
- **English:** a flora find
- **Where it shows:** Name of a flora drop in the Abode.
- **Draft:** یک یافتهٔ گیاهی
- **Notes:**

### abode.visitingFriend
- **English:** a visiting friend
- **Where it shows:** Name of a friend who is visiting.
- **Draft:** یک دوست مهمان
- **Notes:**

### abode.partyMode
- **English:** party mode
- **Where it shows:** Mood name: party.
- **Draft:** حالت جشن
- **Notes:**

### abode.quietude
- **English:** quietude
- **Where it shows:** Mood name: quiet.
- **Draft:** آرامش
- **Notes:**

### abode.pickMood
- **English:** pick your mood
- **Where it shows:** Prompt above the mood choices.
- **Draft:** حال‌وهوایت را انتخاب کن
- **Notes:**

### abode.notYet
- **English:** not yet
- **Where it shows:** Quiet word on a held item to put it down for now.
- **Draft:** هنوز نه
- **Notes:**

### abode.curiosity
- **English:** a curiosity
- **Where it shows:** Name of a curiosity in the Abode.
- **Draft:** یک شگفتی
- **Notes:**

### abode.sell
- **English:** sell
- **Where it shows:** Quiet word under a held item: sell it.
- **Draft:** فروش
- **Notes:**

### abode.compost
- **English:** compost
- **Where it shows:** Quiet word under a held item: compost it.
- **Draft:** کمپوست
- **Notes:**

### abode.rotate
- **English:** rotate
- **Where it shows:** Quiet word under a held item: turn it.
- **Draft:** چرخاندن
- **Notes:**

### abode.turnSave
- **English:** save
- **Where it shows:** Replaces the held item's words while it is being turned: keep the turn.
- **Draft:** ذخیره
- **Notes:**

### abode.turnCancel
- **English:** cancel
- **Where it shows:** Replaces the held item's words while it is being turned: undo the turn.
- **Draft:** لغو
- **Notes:**

### abode.sky
- **English:** abode sky
- **Where it shows:** Name of the sky control in the Abode.
- **Draft:** آسمان سرپناه
- **Notes:**

### abode.skyLabel
- **English:** abode sky, {palette}
- **Where it shows:** Screen-reader name of one sky swatch. {palette} is that sky's name.
- **Draft:** آسمان سرپناه، {palette}
- **Notes:**

### abode.pickSky
- **English:** pick your sky
- **Where it shows:** Prompt above the four sky swatches.
- **Draft:** آسمانت را انتخاب کن
- **Notes:**

### abode.sky.ember
- **English:** ember
- **Where it shows:** Name of the ember sky. Only what the swatch says; a save stores its key.
- **Draft:** اخگری
- **Notes:**

### abode.sky.teal
- **English:** teal
- **Where it shows:** Name of the teal sky. Only what the swatch says; a save stores its key.
- **Draft:** سبزآبی
- **Notes:**

### abode.sky.violet
- **English:** violet
- **Where it shows:** Name of the violet sky. Only what the swatch says; a save stores its key.
- **Draft:** بنفش
- **Notes:**

### abode.sky.ash
- **English:** ash
- **Where it shows:** Name of the ash sky. Only what the swatch says; a save stores its key.
- **Draft:** خاکستری
- **Notes:**

### map.planet
- **English:** the planet, region by region
- **Where it shows:** Screen-reader name for the planet shown on the Map.
- **Draft:** سیاره، منطقه به منطقه
- **Notes:**

### map.regionsKnown
- **English:** {known} of {total} regions known
- **Where it shows:** Caption under the Map. {known} regions out of {total}.
- **Draft:** {known} منطقه از {total} منطقه شناخته شده
- **Notes:**

### market.stall
- **English:** the stall
- **Where it shows:** Screen-reader name for the stall of curiosities.
- **Draft:** غرفه
- **Notes:**

### market.buy
- **English:** buy
- **Where it shows:** Button to buy a curiosity.
- **Draft:** خرید
- **Notes:**

### market.buyLabel
- **English:** buy a curiosity for {price} fungi
- **Where it shows:** Screen-reader name of the buy button. {price} is the cost in fungi.
- **Draft:** خرید یک شگفتی با {price} قارچ
- **Notes:**

### market.owned
- **English:** ×{n} at home
- **Where it shows:** Tag on a market curiosity you already have. {n} is how many.
- **Draft:** {n}× در خانه
- **Notes:**

### bookcase.shelf
- **English:** the bookshelf
- **Where it shows:** Screen-reader name for the bookshelf.
- **Draft:** قفسهٔ کتاب
- **Notes:**

### bookcase.read
- **English:** read {label}
- **Where it shows:** Screen-reader name of a book you can open. {label} is the book.
- **Draft:** خواندن {label}
- **Notes:**

### bookcase.spread
- **English:** the open double-page spread of {label}
- **Where it shows:** Screen-reader name of the open two-page view. {label} is the book.
- **Draft:** دو صفحهٔ باز {label}
- **Notes:**

### bookcase.close
- **English:** close
- **Where it shows:** Button that closes the reading popup.
- **Draft:** بستن
- **Notes:**

### guestbook.friends
- **English:** friends
- **Where it shows:** Screen-reader name for the list of friends.
- **Draft:** دوست‌ها
- **Notes:**

### guestbook.unnamedFriend
- **English:** friend
- **Where it shows:** Stand-in name for a friend who has no name yet.
- **Draft:** دوست
- **Notes:**

### guestbook.close
- **English:** close
- **Where it shows:** Button that closes a friend's card.
- **Draft:** بستن
- **Notes:**

### reveal.firstArrival
- **English:** a first arrival
- **Where it shows:** Screen-reader name of the popup for the very first arrival.
- **Draft:** اولین رسیده
- **Notes:**

### reveal.friendArrives
- **English:** a friend arrives
- **Where it shows:** Screen-reader name of the popup when a friend arrives.
- **Draft:** یک دوست می‌رسد
- **Notes:**

### reveal.onward
- **English:** onward
- **Where it shows:** Button that dismisses a reveal popup and goes on.
- **Draft:** ادامه
- **Notes:**

### reveal.dropArrival
- **English:** drop arrival
- **Where it shows:** Screen-reader name of the popup for an ordinary drop arriving.
- **Draft:** رسیدن یک چیز
- **Notes:**

### arrival.flora
- **English:** a flora find
- **Where it shows:** Plain name of an arriving flora drop.
- **Draft:** یک یافتهٔ گیاهی
- **Notes:**

### arrival.magazine
- **English:** a magazine
- **Where it shows:** Plain name of an arriving magazine.
- **Draft:** یک مجله
- **Notes:**

### arrival.novel
- **English:** a novel
- **Where it shows:** Plain name of an arriving novel.
- **Draft:** یک رمان
- **Notes:**

### arrival.dictionary
- **English:** a dictionary
- **Where it shows:** Plain name of an arriving dictionary.
- **Draft:** یک فرهنگ لغت
- **Notes:**

### arrival.fungusOne
- **English:** 1 fungus
- **Where it shows:** Plain name of an arrival of exactly one fungus.
- **Draft:** 1 قارچ
- **Notes:**

### arrival.fungi
- **English:** {n} fungi
- **Where it shows:** Plain name of an arrival of several fungi. {n} is how many.
- **Draft:** {n} قارچ
- **Notes:**

### arrival.friend
- **English:** a friend
- **Where it shows:** Plain name of an arriving friend.
- **Draft:** یک دوست
- **Notes:**

### arrival.something
- **English:** something
- **Where it shows:** Name used when the kind of drop is not known.
- **Draft:** چیزی
- **Notes:**

### arrival.and
- **English:** and
- **Where it shows:** The word that joins names in a list ("a novel and 3 fungi").
- **Draft:** و
- **Notes:**

### arrival.note
- **English:** you came across {list}
- **Where it shows:** Quiet note beside the tapped habit. {list} is the arrival names joined by the word above.
- **Draft:** به {list} برخوردی
- **Notes:**
