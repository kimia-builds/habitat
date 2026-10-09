# design-bible.md — HABITAT (art language & asset catalogue)

_The standing reference for making Habitat's world art. **Part I is the
language** — how anything on N-Z-D looks and feels. **Part II is the
catalogue** — every asset family, its rules and its exact counts. Read
this file for asset-creation and art-direction sessions (T5.3, T6.1);
coding sessions skip it. Dated decisions and version history live in
**history.md**, as ever._

**How assets ship:** art is made in dedicated asset sessions (separate
from coding sessions), lands first on the temporary **design assets**
workbench page (spec §5b), and only then moves into the game source —
after which the workbench page is removed.

**What binds every asset from the other docs:** spec §7's look & feel
(dark only; all visuals SVG / code-drawn; bright neon reserved for POP
moments) and design-notes §8 (weird > cute, semi-abstract beings).

**Out of scope (already designed):** the six charms, left-rail icons,
action icons, quiet/party toggle, date display, startup animation, and
all other UI chrome (design-notes §11–§12). This file is only the
**depicted world**.

---

## Part I — the language

### 1. Visual DNA

The fundamental ideas that make Habitat feel like Habitat:

- Ritual over productivity.
- Mystery over explanation.
- Discovery over reward.
- Place over interface.
- Encouragement over achievement.
- Scarcity over abundance.
- Organic over engineered.
- Strange over cute.
- Respect over ownership.
- Quiet over loud.

### 2. Design Genome

**Core feeling:** ritual · mysterious · alive.

**We always…**

- Reveal instead of explain.
- Glow instead of flash.
- Reward with discovery.
- Reveal a real place.
- Let the local ecology feel ancient and quietly wise.
- Relax into the unexplainable.
- Treat every inhabitant with respect, regardless of size or importance.
- Earn friendship rather than expect it.
- Fill the world with varied organic textures.
- Let light originate from living things and natural materials.
- Keep the world wrapped in darkness.
- Make bioluminescence feel normal.

**We never…**

- Create urgency.
- Punish.
- Use loud UI.
- Show human faces or obvious anthropomorphism.
- Make corny jokes or visual gags.
- Drift into cute or cartoonish.
- Use white backgrounds.
- Suggest external light sources or cast shadows from them.
- Use clean cartoon outlines.
- Make the world feel hand-sketched or illustrated (except charms,
  icons and the map).

**Recurring motifs:** omnipresent darkness · twinkling stars · fungi ·
bioluminescence · blobbish lifeforms.

### 3. Visual constraints

Stated once so no asset family has to repeat them:

- **Silhouette first, texture second, colour last.** A thing must be
  recognisable in black-on-black outline before any surface or hue
  reads.
- **Every living thing glows equally, always.** Glow is intrinsic to
  the organism, never an effect applied on top; only intensity
  conventions differ (§7). Its **colour is the thing's own body colour**
  (revised 2026-07-25, T5.3b — reverses the earlier "one green, never
  varies"): **friends** each carry their own body colour and glow it
  (the pilot plip is deep blue, §9c); friend **eyes are the one fixed
  exception** — always yellow in a dark socket, and by rule always a
  different colour from the body. (**Flora** wear one of **six** colours as of
  2026-10-08 — green to blue, no fixed split, §9a (it was four from
  2026-08-19) — and glow it. **Fungi**
  colour is still the earlier green pending its own pass, T6.1.)
- **Darkness is the default; nothing casts a shadow.**
- **Palette by class:** organic life stays in the restrained palette;
  curiosities use the broadest palette; publications take one block
  colour each.
- **Variation lives in form** — size, silhouette, texture, appendage —
  and now, for friends, in **body colour** (§9c); never in tricks,
  effects, or brighter light.
- **Function follows mystery.**

### 4. Shape language

Rounded · blob-like · soft silhouettes · few straight lines.

### 5. Surface language

Organic · hairy · porous · rough · mossy · fungal · cratered · squishy.

### 6. Material language

Mushroom · rock · leaf · moss · gravel · hair.

### 7. Light language

- Living things emit light — in their own body colour (friends; §3, §9c).
- Friend **eyes are the exception**: a fixed yellow, set in a **dark
  socket** rather than a bright bloom, so the yellow reads against the
  body (the dark halo is the eye's own socket, not a cast shadow).
- Darkness is the default.
- No shadows.
- Artificial objects may glow, but don't have to.

**Glow intensity ladder** (the one place living-thing light differs):
flora = fungi = friends (equal, full). Publications glow **less** than
living things. Curiosities **may** glow or not.

**The ladder's rungs are named as of T5.2e (2026-08-16).** "How far the
light spreads" is now a six-step scale in `src/tokens.css` —
`--glow-faint · --glow-resting · --glow-lifted · --glow-bright ·
--glow-pop · --glow-max` — so this ladder can be spent in names rather
than in numbers somebody has to re-guess per drawing:

- **Organic things — flora, fungi, friends — take the TOP of the scale**
  (Kimia restated it 2026-08-16). They are the ladder's "full", together
  and equally, and nothing else in Habitat reaches it.
- **Publications and curiosities do not**, nor does the map. They sit
  lower on the scale — a publication below the organics, a curiosity
  wherever its object wants, or nowhere.
- **FLORA GLOW AT THE SELECTED LEVEL, ALWAYS (Kimia, 2026-10-08).** She
  watched a flora brighten when clicked in the Abode and decided that
  brightness is simply how a flora looks: **`--glow-lifted` at all times,
  in every place a flora is drawn**, not only when selected. Selecting
  still magnifies it; it no longer changes the glow. This is the flora's
  settled rung, so the "which top step" eyeball call below is closed for
  flora. She considered `--glow-max` and chose the selected level.
  **Friends rest at the same level** (her call, the same day): the body
  layer takes `--glow-lifted` in its own glow colour, on top of the aura
  in the drawing. Fungi are not covered by it.
- **Today's glows do NOT yet honour this, and that is expected.** Every
  organic thing on screen is a placeholder shape, not its finished
  drawing, so flora currently glows at `--glow-faint` and a friend at
  `--glow-resting` — the numbers each placeholder happened to be built
  with. The ladder gets spent when the real art lands in T5.3, not
  before: raising a placeholder's light only tunes something that is
  about to be replaced.
- **Which top step "full" means — `--glow-pop` or `--glow-max` — is an
  eyeball call on the finished art**, not a decision to make on paper.
  It depends on how big the drawings end up and how densely they sit:
  the charms wear `--glow-pop` at rest with room around them, whereas
  flora and publications sit in packed grids, where a wide glow on every
  tile can smear into one haze instead of reading as separate glowing
  things.

---

## Part II — the asset taxonomy

Catalogues the **world art assets** — the living things, objects, and
environments the app draws. Every asset obeys Part I; each family below
notes only its **deviations** and additions.

### 8. Texture library

The named, drawable textures that instantiate the Surface and Material
language (§5–§6). This is the shared surface vocabulary; the table
says which families may draw from which group.

**Plant-like** — moss · lichen · leaf veins · bark · mycelium
**Fungal** — mushroom caps · mushroom gills · pores · sponge
**Hair** — dense fur · sparse hair · soft fibres
**Rock** — basalt · pumice · cratered stone · layered sediment · jagged
mineral · weathered rock
**Ground** — gravel · cracked earth

**Who may use what:**

| Family        | Draws from                                               |
| ------------- | -------------------------------------------------------- |
| Flora         | Plant-like, Fungal, Hair (any organic)                   |
| Fungi         | Fungal (primary), Plant-like                             |
| Friends       | Any organic — Plant-like, Fungal, Hair                   |
| Curiosities   | **Any texture that suits the object** (see the note below) |
| Terrain / Map | Rock and Ground                                          |

**The curiosities' row was opened up on 2026-09-01** (T5.3j, Kimia's
call). It used to read "Rock and Fungal only — never leafy, hairy, or
fleshy", and it blocked her first real object: dark brown columns
wearing the bark surface, which is filed above under Plant-like. Her
ruling:

> "bark is just the internal name we've given a visual texture that fits
> this particular curiosity. we can amend. my rules about what things can
> or should look like should not necessarily correspond to the names
> you've given textures that you presented me with on the design shelf."

The names in this table describe what each filter LOOKS like — they were
Claude's captions for the seven surfaces when they were first put on the
workbench, and Kimia judged the pictures, not the words. So a name never
decides who may wear a surface. What survives of the old row is its
INTENT, which is §10a's and still stands: objects read as **less blobbish
than living things — the line between made and grown** — and it is the
object's form and finish that carry that, not a texture's label.

**A texture can be worn either way up** (2026-09-01, T5.3j). The pore
surface paints its pores as raised blobs and leaves the gaps between them
transparent, which is a fine SWATCH and an impossible OBJECT — a disc made
only of pores would have see-through holes in it. Asked how the pores
should read on a solid disc, Kimia chose darker SUNKEN PITS, so the same
pore field is used inverted (`SunkenPoresFilter`): the threshold that
stands a pore up is mirrored about its own crossing point, and every
hollow on the discs is exactly a pore the swatch raises. It is one
texture, worn the other way up — the same kind of parameter as the bark's
`turn`, not an eighth surface. Both share one set of grain numbers in code
so they can never drift apart.

**Surface colour** (revised 2026-07-25, T5.3b): an organic texture is
**tinted to its wearer's body colour**, not a fixed green — a friend's
sponge/hair/etc. takes that friend's own colour (§3, §9c). In code the
tint is a parameter (e.g. `<SpongeFilter light=…/>`); the library's
default green instances are only the workbench swatches. The four HAIR
modes have left that workbench (2026-08-19) — they were there to be judged
as the flora's surface and were — but they remain fully part of the
library. They no longer dress anything: the flora gave up their fur for a
plain fill on 2026-10-08 (§9a).

### 9. Living assets

Shared across all three living families (stated once, not repeated
below): equal intrinsic glow, rich organic texture, soft blob-leaning
silhouette, no shadow. Each family adds only what makes it itself.

#### 9a. Flora

**Form.** No stems or trunks. Reads like a floating lily pad, sunflower
head, or seaweed, not an Earth plant. Growth radiates from a central
floating body; branches emerge from the centre, never a trunk-or-root
hierarchy. Low gravity allows sprawling, unsupported forms. (This holds
at every size — a "tree-like" landmark is tree-like in **scale**, not
in body plan.)

**SIXTEEN SPECIES, ONE PER MAP REGION (Kimia — this replaces the
earlier "four species" reading, which itself replaced "64
species").** N-Z-D grows **sixteen flora silhouettes**: the four chosen
in T5.3g plus **twelve new ones** (T5.3l — drawn and held in
`src/ui/newFloraSilhouettes.js`, not yet dealt). Each Map region has **one
distinct native flora**. Colours are plain fills and textures are gone, so
**silhouette is the only thing that tells one species from another** —
which is why the count is 16 and not 4. The flora are those shapes in
different sizes and colours, and the arithmetic is exact.

- **192 collectible** — **16 silhouettes × 2 sizes × 6 colours = 192.**
  Every species comes in two sizes, and every size wears any of the six
  colours. Placeable in the Abode, gatherable and compostable.
- **16 landmark ("mother tree")** — **each species' one super-sized
  tree.** Giant, too big to carry, **one per Map region, enforced**
  (mechanics in spec §5): its discovery shows a **permanent marker on the
  Map**; gathering one (optional, like all flora) collects a **keepsake**
  that goes to the Abode, while the tree itself stays on the Map
  regardless. **Landmark size: 300px tall on the Abode's ground (a plip is
  24px there) — 1.74 in the shared scale, `LANDMARK_SCALE` in
  `floraCanon.js` (Kimia, 2026-10-09).** Its look is the ordinary
  flora's, unchanged: size is its only distinguishing factor, in the
  discovery dialogue and on the Map alike (the Map picture is a symbol,
  not true to size).
- **16 keepsake** — **one variety per region**: a tendril, fruit, leaf,
  branch, blossom or the like, from that region's mother tree. A keepsake
  is its OWN drop, extra to the region's flora finds. It is a real new
  Abode collectible, so these are 16 more drawings.
  **What a keepsake looks like (Kimia, 2026-10-09):** in most cases a
  **variation on a section of its flora's silhouette**. It wears **one of
  four colours in the reds, pinks and oranges**, dealt at random, and
  follows the **same laws of fill, border and glow strength as an ordinary
  flora** (a plain opaque fill with an outline, glowing at the lifted
  level — §9a's recipe). The four colours are not chosen yet.
  **Its copy (written by Kimia).** The first time one is found, the line
  is "[flora species name] has yielded …", then thereafter "you found a
  tendril" / "you found a peace branch". Her sixteen, complete as of
  2026-10-09 but NOT yet bound to a species or region: nutritious
  edibles · fresh berries · colourful leaves · seasonal blossoms · a
  peace branch · a tendril · reproductive baubles · juicy treats ·
  tropical mist · barbed decoratives · magical seeds · an organic ribbon
  · fragrant spawn · scented biomes · protective thorns · fruit.

**A region's flora arrives in five steps, in this order:** (1) a picture
or symbol of it on the newly discovered region of the Map; (2) a
new-flora reveal dialogue; (3) its shape begins to drop, in the existing
two sizes and six colours; (4) about **midway through the region**, a
discovery dialogue for its mother tree; (5) its keepsake begins to drop.
Known shapes and keepsakes keep dropping for the rest of the game, but
**the local flora is always the most common in its own region.**

**THE FOUR SILHOUETTES ARE CHOSEN (Kimia, 2026-08-19, T5.3g).** They are
flora **1, 2, 3 and 6** of the eight she drew and traced in July — her
own numbering is kept, so the trail back to the drawings never breaks.
Each is a single Inkscape path, held verbatim in
`src/ui/floraSilhouettes.js`. They are not NAMED yet; that is T6.1, and
the names come from her.

**Size is a canon, not a per-drawing choice, and it is SET for the two
collectible classes** (Kimia, 2026-08-19, `src/ui/floraCanon.js`):

- **A flora's size is its HEIGHT** — not its width and not its bulk. How
  tall it stands next to you is what size means for a plant.
- **All four species share the two classes.** A species is not big or
  small; a flora is. The shapes differ, the sizes do not.
- **The two sizes are PLACES IN THE WHOLE SIZING TABLE, not one friend's
  height each** (her call, 2026-08-19). They were arrived at through two
  particular friends — the large class a chitu's height, the small class
  half a zala's — and she ruled that framing out once the sizes were
  settled: a flora sits where it sits among everything that grows and
  walks on N-Z-D, and must not be hostage to two individuals who may be
  redrawn. **Small 0.28, large 0.77**, in the one shared scale; a large
  flora is 2.75× the height of a small one. Both locked.
- Where that puts them, on the whole cast ordered by height: **the small
  class falls between the plip and the baluhm; the large class between
  the meuhy and the hamdi bulo** (a hair under the chitu). Those places
  are what `floraCanon.test.js` guards, rebuilding the ladder from
  `friendCanon.js` and the drawings on every run.
- Two asides worth keeping, both from getting it wrong first: the rassatt
  was her original peg for the large class, and measured by HEIGHT it is
  2.6% shorter than the zala (it is wide and low), which would have made
  two classes the same size — the friends' canon stores WIDTHS, so rank by
  width says nothing about rank by height. And the small class was a whole
  zala until she saw it drawn and halved it.
- **The numbers live in the FRIENDS' scale**, not a private flora one:
  both files count in the same unitless units, whose 1 is the largest
  friend's width. That is the whole point — flora, friends and one day
  objects share the Abode, so they must be true to each other and not
  merely each true to their own family. When the objects are drawn they
  join this same scale rather than starting a third.
- Note which measurement each family's number IS: a friend's canon number
  is its WIDTH (its drawing gives the height), a flora's is its HEIGHT
  (its drawing gives the width). Neither is ever stretched.

**The landmark super-size is SET** (Kimia, 2026-10-09): 300px tall at
Abode scale, `LANDMARK_SCALE` in `floraCanon.js`, deliberately outside
`FLORA_CANON` so a find can never be dealt one. See §9c's canon rule.

**The six colours (Kimia, 2026-08-19, T5.3g; REPLACED 2026-10-08, T5.3k).**
Bioluminescent: neon, electric, luminous. Chosen by eye off the design
workbench, in `src/ui/floraColours.js` once built. **Since 2026-10-08 the
flora wear these six, and none of the four colours before them survive**
(emerald, leaf, sky and azure were judged too tame — "none of them have
enough pop"):

| hex | what it is |
|---|---|
| `#00ff00` | pure electric green |
| `#50f7d0` | mint-aquamarine |
| `#00ffff` | pure cyan |
| `#73c0f7` | pale ice blue |
| `#0ab9ee` | bright sky blue |
| `#0080ff` | electric cobalt |

The six are **not yet named** (Kimia names things; the old four were
named by her picks). They run from green to blue with no fixed split —
**two greens-ish, four blues-ish; she explicitly dropped the "three and
three" target.** The count is set by the arithmetic: with textures gone a
colour IS the whole fill, and 4 shapes × 2 sizes × 6 colours keeps the
collectible total at 48. The colours are rich and vivid where the friend
pastels are soft (`friendColours.js`), which is also the other half of the
friend/flora boundary. They came from four rounds on the workbench (a
sweep of the range, finer cobalt / turquoise / aquamarine steps, and
eleven hexes of her own), narrowed to a shortlist of eleven and then to
these six.

**ALL SIX COLOURS ARE EQUALLY COMMON (Kimia, 2026-10-08)** — as the four
shapes are. A find's colour is rolled evenly from the six, so every
colour turns up one time in six. Because the deal is made from the save's
seed, **every flora already gathered is re-dealt: some change colour.**
Shapes and sizes do not move (they are separate rolls). Accepted.

**A FLORA IS A PLAIN FILL, NOT A TEXTURE (Kimia, 2026-10-08, T5.3k).**
The hair textures are retired from the flora. This reverses the
2026-08-19 "a fill is a texture worn in a colour" rule and everything
built on it: hair modes, the dense hair field cut from the middle, one fur
at one size (all in history.md for the story). A flora is now drawn like a
**frontier region on the Map**: a light fill and a stronger outline, both
in the flora's own colour (about 16% fill and 85% outline), with one
change she made on the spot — **the fill is OPAQUE.** Where a region on
the Map lets the sky show through, a flora must not: **no star of the
nebula behind may show through a flora's body.** The body is therefore the
flora's near-black ground with the colour laid over it at about 16%,
never a see-through tint. The outline's on-screen thickness is the same
on every shape and both sizes (the four traces are different sizes, so
the stroke is scaled to the drawing). The textures themselves stay in the
library (§8) and on the workbench; only the flora stop wearing them.

**Leaves.** A species may have leaves or not. Leaf shape is **consistent
within** a species and can vary **wildly between** species — with only
four species, this is now a property of the four silhouettes rather than
an axis of variation.

**Fruit.** Tiny shrubs may bear none; larger flora may. Each species has
**exactly one** fruit type, in any rounded or blobby form.

**THE SHAPE IS STORED ON THE DROP; SIZE AND COLOUR ARE DEALT (Kimia).** A
flora drop records its **shape** (one of the 16, chosen from the shapes of
the regions discovered so far, weighted toward the local one); its size and
colour are still rolled from the save's own seed and the find's completion
id (`src/ui/floraDeal.js`), the same trick that deals a friend its colour.
Storing the shape means a find keeps its species even if an earlier tap is
undone at a region boundary. (Until T5.3l is built the code still deals
all three.) **Large and small come half and half** (her
call, same day) — a large flora stands 2.75x a small one, so the mix is what a
ground looks like, and even odds is the flattest answer.

**Two finds of the same shape, size and colour ARE the same flora** and look
identical on purpose: that is what a catalogue of 48 means, rather than 48
templates for unique plants.

**THE FLORA REACHED THE GAME on 2026-08-21** (T5.3i): the Abode first — the
ground and the doorstep list, with the party's friends going in beside them —
and then the arrival shelf at the top of the habit list and the first-flora
reveal, which took the habit list's held arrival row in with them. `src/ui/Flora.jsx` is the one component every screen showing a flora goes
through, the twin of `Friend.jsx`, and it carries the recipe above verbatim.
**A screen chooses a BASE, not a size**, exactly as §9c requires of the
friends, and the same base serves both families because the two canons speak
one scale: the Abode sizes up from the smallest thing that can stand on it,
which is a plip and not a small flora.

**Axes of variation: size and colour.** That is the whole list (2026-08-19
— it replaces the earlier "overall size · leaf shape · presence/absence
of fruit · surface texture", which was written when there were 64 shapes
to tell apart). **Not** varied: growth habit, body plan — and glow
colour only in the sense that a flora always glows its own body colour
and never a light applied on top (§3).

#### 9b. Fungi

- **Exactly one species.**
- Small, mushroom-like silhouette.
- Full organic texture; glow at living-thing intensity.
- (Functions as the Market currency, but visually it is this single
  form.)

#### 9c. Friends

**Shared traits.** Every friend has **eyes** (number varies). Mostly
blobbish silhouettes. **No human faces, no obvious anthropomorphism.**
Recognisable as a **silhouette first, texture second** — always.

**The canonical eye (2026-07-25).** One designed eye is shared by every
friend in the app; only the **number and size** of eyes vary per
individual. The eye is built once as a reusable component and placed on
each body — never redrawn per friend.

Its design (Kimia's pick from five candidates, T5.3a): the **orb** — a
plain glowing eyeball, **no pupil**, with a single small off-centre
catch-light so it reads as wet/alive.

**The eye is always yellow (revised 2026-07-25, T5.3b — reverses the
first "one green eye" call).** A pale-warm core fades through yellow to
an amber rim, set in a **dark ("blackish") socket** — a darkening halo,
not a bright bloom — so the yellow dot pops off the body. This is a
standing rule: **eyes are yellow on every friend, and by rule always a
different colour from the body** (bodies carry their own per-friend
colour, §3). Only size and number vary; the colour and the dark socket
never do. Lives as the reusable `<Eye cx cy r/>` in `src/ui/eye.jsx`
(its two gradients in `<EyeDefs/>`). The four rejected candidates (slit,
ring, crescent, compound) were exploration only.

**Production workflow (2026-07-25).** The 10 **category archetypes are
hand-drawn by Kimia** (raster drawing → Inkscape trace → SVG), keeping
friends visibly from the same hand as the flora; texture, eyes and
glow are then assembled in code on the workbench. The remaining
**individuals are derived in code from their category's archetype**,
with every variation approved or rejected by Kimia.

**An individual is a COLOUR (Kimia, 2026-08-17, T5.3e — this replaces the
first list of four axes).** Two friends of a species differ by **body
colour and nothing else**: not size, not texture, not appendages, not eye
count. Ten plips are one drawing in ten pastels. The reasoning is that
the species is the creature you recognise and the colour is the one you
met — vary the silhouette too and a species stops reading as a species.
(Size was already spoken for: T5.3d fixed one size per species and that
holds everywhere. Appendages were dropped as an axis because code cannot
invent a limb on a traced outline — it would take a drawn kit of parts,
and Kimia declined the trade.)

**The ten friend colours (Kimia, 2026-08-17 — chosen, not calculated).**
The palette is a named list of ten, in `src/ui/friendColours.js`:

| # | colour | # | colour |
| - | ------ | - | ------ |
| 1 | gold _(kept)_ | 6 | pale grey |
| 2 | soft lilac | 7 | violet _(kept)_ |
| 3 | pastel peach | 8 | baby blue |
| 4 | baby pink | 9 | magenta _(kept)_ |
| 5 | teal _(kept)_ | 10 | red _(kept)_ |

The first attempt spread a species **evenly around the colour wheel**, and
Kimia rejected it for two reasons that are now standing rules:

- **Blues and greens are mostly the FLORA's.** An even sweep must pass
  through every hue, so it spent four of its ten there. Friends borrowing
  those tones blurs the two families the silhouette test exists to keep
  apart. What survives is one teal, one baby blue, and a pale grey with a
  cool cast.
- **Pastels are a colour the sweep could not reach at all**, because it
  varied only hue. See below.

She kept five of the swept colours (1, 5, 7, 9, 10 as the shelf numbered
them) and named the five pastels that replaced the rest. **Her five keep
their original slot numbers**, so "colour 7" still means what it meant
when she said it.

**Colours repeat across species, necessarily:** ten colours, 55
friendships. Two friends of different species sharing a pastel are not
confusable — they are different drawings at different sizes, and shape is
what says which species. The rule that must never break is that no two
**siblings** share one, and since no roster exceeds ten, none ever do.

**Who wears which is DEALT, not decided (Kimia, 2026-08-17 — replaces the
fixed runs this palette shipped with the same morning).** Her rule: the
colours of each friend pick at random from the ten, never repeating within
a species, "therefore different players might get friends of different
colours". The palette is shared and settled; the deal is personal. Your
first plip is a colour that is yours, and another player's first plip is
very likely another one.

Two properties hold it together, both in `src/ui/friendColours.js`:

- **Random across players, fixed within a save.** The deal is seeded from
  the world seed, like every other surprise in Habitat, so it survives a
  reload, an undo and a backup restore. A friend never re-rolls its
  colour once you have met it.
- **No sibling repeats, by construction rather than by luck.** A species
  shuffles the whole palette and deals off the top, so its individuals are
  the first N of a permutation. No roster exceeds ten, so the deal can
  never run out.

**A friend's colour is a hue, a strength, and a LIFT.** Lift is how far
the colour is pulled toward white, and it had to be added (2026-08-17)
the moment real pastels were tried: a pastel is a **light** colour, and a
friend's lightness belongs to Kimia's shading, whose mid tone sits near
55%. A baby pink lives near 86%, so hue and saturation alone returned a
dusty rose — right arithmetic, wrong colour. Lift moves each shade a
**fraction of its remaining distance to white** rather than a flat amount,
which is what keeps it safe: a flat amount would push the top of the ramp
past white, clipping several shades to the same solid tone and flattening
the modelling; a fraction never arrives, so every shade stays distinct and
in order at any lift.

**Everybody is lifted (Kimia, 2026-08-17, choosing between two benches).**
Her five kept colours first stood at lift 0, which left the palette
reading as two weights — five vivid friends beside five pale ones. Shown
both versions side by side, she took the one where **all ten are lifted**,
so the cast reads as one family; the five keep their hues and strengths
untouched. The band is **35–45 and deliberately not uniform**, set per
colour by eye, because a soft lilac and a pastel peach need different
pushes to look like they belong together.

**Where a body colour comes from.** The 24 hand-written pastels in
`src/ui/friendPalettes.js` turned out (T5.3e) to be a single formula
rather than 24 choices: **keep the grey's own lightness, set saturation to
60%, turn the hue.** So a whole ramp can be generated from one tone —
`paletteForTone()` — which is what makes 55 individual palettes possible
without hand-picking 440 hex values, and lift is the third dial it grew.
The hand table stays the source of truth for the three named tints (its
darkest green was deliberately darkened past the formula). The palette
itself lives permanently in **`src/ui/friendColours.js`**, the colour twin
of `friendCanon.js`, guarded by `friendColours.test.js` — which holds both
the line that no two siblings share a colour and the boundary keeping
blues and greens with the flora.

**Pilot: the plip (T5.3b, 2026-07-25; body art rejected
2026-07-26).** The plip was assembled end-to-end first and proved
the recipe every archetype now follows — traced silhouette + tinted §8
texture + the canonical eyes + body-colour glow. The recipe stands, but
Kimia rejected the pilot's body art itself and it was removed from the
app (no plip source files remain); a redone plip joins the T5.3c
ladder pass. Its signature animation, the drift-and-bob (design-notes
§8), was kept and still serves the category.

**Importing a traced archetype (2026-08-10).** Kimia's drawings arrive
as Inkscape traces, and they come in two shapes. A **stacked** trace
paints its darkest shade as the whole figure and layers lighter shades
on top; a **banded** trace paints non-overlapping tonal bands and has
usually **lost its darkest layer** in tracing, leaving holes through the
body. Which one a trace is decides how it is assembled, so every import
starts with the same test: **render it on a magenta ground.** Magenta
showing through the interior means the darkest layer is gone.

A lost layer is **reconstructed**, not redrawn: sample every band, union
them, seal the cracks, keep the exterior rings (this is the step that
fills the holes), drop the crumbs. The result sits behind the bands as
an extra darkest shade and is also the shape the glow aura blurs. Two
things about the seal, learned across nine imports:

- **Its width is per drawing, not a constant.** A seal only closes gaps
  narrower than itself, so a figure whose gaps are enclosed holes seals
  easily, while one whose gaps are **bays opening out to the background**
  needs a far wider seal before the body reads whole.
- **The stop point is where fringe detail welds together.** Filling
  harder always costs filigree eventually; that trade is Kimia's call,
  not the script's. Sealing also closes enclosed background pockets
  (tendril-loop interiors) — flag conspicuous ones rather than deciding.

Layers are kept **verbatim in the source's paint order**, which is not
always light-to-dark; the colour ramps are listed in that same order so
each shade lands on the tone it was drawn in. All the traces share one
grey ramp, so one **grey→pastel table** serves every friend
(`src/ui/friendPalettes.js`).

**Size is set by the character sheet (2026-08-10)** — Kimia's pixel
sheet of the whole cast at their canonical scales, not by the traces'
own canvases, which are only export settings. An archetype's size is
read from the sheet as one figure (the square root of its width × height
there) and applied as a card width through the artwork's own
proportions, so a drawing only ever changes scale, never shape.

**The canon is the RATIO, and it holds everywhere and always (Kimia's
rule, 2026-08-10).** A friend does not have a size; it has a place in one
ordered scale. Absolute values are free to differ — a Guest Book card, an
arrival reveal and a home-screen cameo may each pick whatever base size
suits them — but within any one of them the ten must stand in exactly the
sheet's proportions, forever. A tiny friend never out-sizes a large one
anywhere in the app. Practically: one unitless table of relative scales
in a permanent home, every render site multiplying its own base by that
number, and a test holding the ratios to the sheet. Never a per-screen
size typed in by hand — that is how a cast loses its scale one screen at
a time.

**Built in T5.3d (2026-08-17): the canon lives in `src/ui/friendCanon.js`**
— ten unitless ratios keyed by species, `friendSize(key, base)` to ask for
one, and `friendCanon.test.js` holding every PAIR of friends to the sheet's
proportions (a ratio test, because the rule is about ratios; a per-friend
size test would pass on a cast that had been scaled wrong together). It sits
in `src/ui/` rather than `constants.js` under §11d's boundary — these are
proportions of drawings, consumed only by the code that paints SVG, like the
friend pastels and the texture tints. **The anchor is the largest friend at
1**, so every other number is a fraction of the biggest and a screen's base
size means "how much room the biggest friend gets here". Note the hamdi bulo, top
of the literacy ladder, is fractionally SMALLER than the chitu: on this
ladder sophistication climbs through texture, appendages and silhouette
(below), never through size, and the character sheet is the authority on size.

**Which drawing is which species (Kimia, 2026-08-17):** the ten numbered
archetypes run straight down the literacy ladder — friend 01 is the first
species you meet, the smallest and simplest, and friend 10 the rarest and
most sophisticated. The numbers are workbench-only; the species key is the
durable identity and outlives the shelf.

**How a screen picks its base (Kimia, 2026-08-21, T5.3h).** Size up from the
SMALLEST friend, never down from the biggest: say how big a plip has to be
before its drawing reads, and let the biggest land wherever the canon puts
it. A plip is a seventh of a chitu, so choosing from the big end keeps a
screen's present size and leaves the plip a five-pixel speck — and the plip
is the friend met most often. `friendCanon.js` does the arithmetic
(`baseWhereSmallestIs`) so no screen has to.

**Which screens draw the real archetypes.** The Guest Book does, list and
card, since 2026-08-21 — every friend there is Kimia's drawing at its
canonical size in its dealt colour, assembled by `src/ui/Friend.jsx`, which
takes a base and refuses to take a size. The arrival reveal, the cameo, the
Abode's party and the habit list's arrival row still draw the T4.4
placeholder line-art; they follow one at a time, and the last two wait for
the real flora, since a friend standing beside a placeholder plant would
show the shared friend/flora scale wrongly. (Their COLOUR has been the
settled one since 2026-08-17 on every screen — the placeholder line-art
wears the dealt friend colour too, so only the shape is still standing in.)

**THE CANON HOLDS ON THE WORKBENCH TOO (Kimia, 2026-08-17).** "Everywhere
and always" has no exception for scaffolding. The T5.3e colour shelves were
built at one flat card width for every species, on the argument that a
colour swatch is asking a different question than a size chart and that a
plip drawn a sixth the height of a chitu is too small to judge a pastel on.
Kimia rejected the reasoning outright: a page that shows the cast at the
wrong proportions teaches the wrong proportions, whatever it says it is
asking. If an asset is too small to judge at its canonical share of the
page, the base size for that page goes UP — the ratios never bend. This is
the rule that governs any future shelf, not a note about one that has since
been removed.

**Complexity scales with size.** Larger friends are more visually
complex, but complexity comes from **layered texture, appendages, and
silhouette** — never brighter colour or stronger glow.

**Inspirations.** May loosely evoke Earth animals — arachnids,
crustaceans, hedgehogs, slugs — but must never read as a direct
analogue. Weird, not familiar-in-costume.

**Ten categories** on the literacy ladder (spec §5), each with a
**fixed roster of individuals** — population inversely tied to
literacy, from 10 plips down to a single hamdi bulo:

| Category (low → high literacy) | Individuals |
| ------------------------------ | ----------- |
| plips                       | 10          |
| baluhms                        | 9           |
| krupengks                         | 8           |
| zalas                        | 7           |
| liwi bi-jijis                        | 6           |
| meuhys                       | 5           |
| rassatts                     | 4           |
| woigolps                   | 3           |
| chitus                       | 2           |
| hamdi bulos                          | 1           |
| **Total**                      | **55**      |

The roster is a **cap** (2026-07-24): a category refills only until its
roster is exhausted — 55 friendships is the lifetime maximum (spec §5).

Complexity broadly climbs the ladder. **One shared congratulation
animation for every friend — the plip's drift-and-bob** (Kimia,
2026-10-09; it replaces the plan for ten signature animations,
design-notes §8).

**The silhouette test** (fungi & flora vs. friends): flora radiate from
a still centre; friends have eyes and move. If a form is ambiguous, the
eyes and the bob resolve it.

### 10. Object assets

Objects are less blobbish than living things — the line between made
and grown.

#### 10a. Curiosities

**Origin.** Grown, engineered, or between — never clearly manufactured.
Makers and purpose stay unknown.

**Materials.** Rock and Fungal textures only (§8); avoid leafy, hairy,
fleshy surfaces.

**Form.** Irregular and asymmetrical. May carry spikes, limbs, wheels,
loops, holes, or other protrusions. Intentional-feeling but never
explainable.

**Colour.** The broadest palette in the app; each object may own its
own distinct colours. (Bright neon still stays reserved for POP
moments — spec §7.)

**Light.** May glow or not (no obligation).

**Scale & price.** Wide size range; **price correlates directly with
physical size.**

**Sizes are canon, and they live in `src/ui/objectCanon.js`** (T5.3j,
2026-09-01) — the third file in the one sizing scale, beside
`friendCanon.js` and `floraCanon.js`, exactly as `floraCanon.js`
promised. Kimia gives an object's size in pixels read off the Abode and
it is converted once into a ratio of the same 1 (a chitu's width) the
other two families count in, so an object, a plant and a visitor
standing on one ground are true to each other by construction. Nothing
types an object size in by hand; a screen picks one base and every
family answers to it. The first six sizes she set are two columns
(0.058 × 0.348 and 0.232 × 1.739), two oval discs (1.159 × 0.870 and
2.319 × 1.739 — one shape at two sizes), and a smoke and a stone at
1.449 square. **Five of those six are larger than anything alive on
N-Z-D**, which is this line's "wide size range" arriving for real.

**Surface detail is one size across an object family** (Kimia,
2026-09-01: "as with plants, make the texture size of the columns
match"). A bark furrow is as wide on the small column as on the large
one, and a pore is one pore on both discs; the small object simply wears
fewer of them. This is the flora's old fur rule (retired 2026-10-08, §9a) applied to the objects, and it is
won by drawing every object in a frame equal to its own Abode-pixel
size, so one screen scales them all by the same factor.

**Outlines are hand-drawn, never dead straight** (Kimia, 2026-09-01).
Read carefully, because it sits next to a NEVER in §2: she means
**organic wobble, not sketchiness** — an edge that is irregular and
slightly uneven, with nothing ruler-straight or machine-perfect about
it, but no visible pencil stroke and no sketched look. The shapes are
built in `src/ui/handDrawn.js`, which pushes points off the perfect
outline and then runs a spline through them, so what is drawn is always
a curve. §2's ban on a hand-sketched world is intact; §4's "few straight
lines" is what this serves. **Corners curve** rather than meeting sharp.

**The four families drawn** (T5.3j, 2026-09-01 and 2026-09-02): the
columns are dark brown and wear the bark surface turned 90° so its grain
falls vertical; the discs are **bright tangerine** (her pick of three
oranges) and wear the pores as sunken pits (§8); the three stones are
three different lumps at one size, in the texture library's own cool grey
(asked whether she wanted a colour of their own, she kept it); and the
smoke is baby pink and see-through. **None of them glows** — this line's
"may glow or not" has been answered "not" every time it has been asked,
because a made thing that lights itself reads as alive.

**One object has no outline at all, and it is the exception that proves
§4** (Kimia, 2026-09-02). Asked what the smoke's edge should do she chose
"a soft cloudy puff": no drawn edge anywhere, fading out into nothing at
its rim. A wobbled blob is still what decides where the puff is — where it
bulges and where it draws in — but the drawing is then blurred away to
nothing and thinned unevenly, so no line is ever visible. It is also the
only thing in the app allowed to spill past its own footprint; every
texture in §8 is clipped to the shape wearing it, and clipping the smoke
would give it the crisp edge it is defined by not having.

**Its surface is not a texture but an amount of itself** (Kimia,
2026-09-02): "just vary the level of transparency across the smoke like
how real smoke would be". Shown a first version she called it too busy —
"it should feel a bit more like a blob of SPRAY PAINT… the centre fill
just needs to be simplified" — and the fix was not to weaken the noise
(which would have cost the torn rim she liked) but to fill it in towards
the middle, so the unevenness now shows only where the puff is already
fading. Offered a flat centre and one that slopes gently away, **she
chose the flat centre**: a spray-paint blob is even in the middle.

**A family can be one shape at several sizes OR several shapes at one
size.** The discs are the first (both 4:3, so the large is the small
enlarged); the three stones are the second (one size, three sets of
lobes). The stones are therefore three objects sharing a single entry in
`objectCanon.js`, which keeps that file exactly what it claims to be: the
sizes Kimia gave, once each, in her own numbers.

**Purpose.** Never obvious — invites curiosity, not explanation.

**Pool — 48 objects**, revealed gradually: **3 objects enter the
Market's rotation pool with each of the 16 Map regions** (16 × 3 = 48 —
one at each price tier; corrected from 64 on 2026-10-09, when Kimia
confirmed the code's 3 per region over this section's old 4 —
spec §5's pool-grows-with-the-Map rule), so the Market expands over the
years without ever being complete too early.

#### 10b. Publications

**Types.** Magazines · novels · dictionaries.

**Count — 30 covers.** Ten of each type (~10 block colours × 3 types).
Type governs **drop rarity** (spec §5), not count. The cover count is
**independent of the reading pool** (Kimia 2026-10-08): the texts inside
are a separate pool of 126 (spec §5 Stream 2), not one per cover. The
cover count is open to revisit at the cover-design phase.

**Form.** Familiar Earth-like book forms read through Habitat's graphic
style — recognisable silhouettes, no overly sharp lines in any view.

**Colour.** A single block colour per publication, anywhere on the
spectrum.

**Light.** Glows **less** than living things (§7).

**Two canonical assets per publication:**

1. **Spine view** — for the Bookcase shelf.
2. **Front cover view** — for reveals and the shelf's face-out state.

**The reading pages are a separate pool, not a cover asset** (Kimia
2026-10-08): 126 texts, each with its pictures where its stage has them.
Early-stage pictures look like children's drawings — simplified
versions of in-game objects, evenly simplified, a stylistic choice only.
All of it is Kimia-made, never AI-generated (the standing content rule,
CLAUDE.md). The cover is not canonically tied to the text inside.

### 11. Environment assets

#### 11a. Sky

**Shared night sky** (default, everywhere): near-black; very subtle
brightness variation; **white stars only**, from tiny specks to
occasional bright gems; twinkling rare and unsynchronised. A realistic,
beautiful night sky that never competes with the POP. This is the
**pure-CSS star layer** of the M5 layout pass (design-notes §13c) — one
shared treatment across the whole app, not a separate image asset.

**Abode exception (2026-07-24):** the Abode gets a **separate** sky
asset — realistic clouds and nebulae, same composition every time, in
**four interchangeable colour palettes.**

#### 11b. Terrain

Rocky · cratered · gravelly — drawn from the Rock and Ground textures
(§8). Feels halfway between a dry gravel plain and the Moon's surface.
One asset, used in three places: the startup planet, the Abode ground,
and the Bookcase backdrop. (The startup planet keeps its §12f
charm-colour glow — the terrain gives it surface, not colour.)

#### 11c. Map

The discovered planet, revealed **region by region** as the expedition
grows (sized for ~5 years). **16 regions** total at full discovery —
one per landmark flora (§9a). Each region:

- carries **one permanent landmark-flora marker** — exactly one,
  enforced (§9a, spec §5);
- **adds 3 curiosities to the Market pool** when unlocked (§10a).

Region boundaries and reveal order are set with the content work
(T6.1). The map is one of the Genome's three illustrated exemptions
(§2) — it may read hand-drawn.

### 12. Production count layer

A checklist view for the M5 design pass. Every quantity is fixed;
boundaries and content-pool assignments (which flora are landmarks,
region order) are detailed with T6.1.

**The flora line changed on 2026-08-19** and is worth reading twice: the
64 flora are **four drawings**, not sixty-four. Counting drawings rather
than flora is what makes the family buildable at all — see §9a.

| Family              | Count | Assets per unit                                        |
| ------------------- | ----- | ------------------------------------------------------ |
| Flora — silhouettes | 16    | 4 drawn, 12 new; one drawing each; 192 collectibles = 16 × 2 sizes × 6 colours |
| Flora — colours     | 6     | green to blue, no fixed split; a plain fill, no drawing or texture of their own |
| Flora — landmark    | 16    | each species' one mother tree, super-sized; body + Map marker |
| Flora — keepsake    | 16    | one variety per region; its own drop, extra to the flora finds |
| Fungi               | 1     | single form                                            |
| Friend categories   | 10    | one shared drift-and-bob, no per-category animation    |
| Friend individuals  | 55    | body each (10 → 1 down the ladder)                     |
| Curiosities         | 48    | body (3 per region × 16)                               |
| Publications        | 30    | spine + cover (10 per type); reading pages are a separate pool of 126 texts |
| Sky                 | 1     | Abode sky × 4 palettes (shared night sky is CSS, §11a) |
| Terrain             | 1     | serves 3 screens                                       |
| Map regions         | 16    | region art + 1 landmark marker each                    |
