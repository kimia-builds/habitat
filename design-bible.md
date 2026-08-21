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
  different colour from the body. (**Flora** wear one of four colours as of
  2026-08-19 — two greens and two blues, §9a — and glow it. **Fungi**
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
| Curiosities   | **Rock and Fungal only** — never leafy, hairy, or fleshy |
| Terrain / Map | Rock and Ground                                          |

**Surface colour** (revised 2026-07-25, T5.3b): an organic texture is
**tinted to its wearer's body colour**, not a fixed green — a friend's
sponge/hair/etc. takes that friend's own colour (§3, §9c). In code the
tint is a parameter (e.g. `<SpongeFilter light=…/>`); the library's
default green instances are only the workbench swatches. The four HAIR
modes have left that workbench (2026-08-19) — they were there to be judged
as the flora's surface and were — but they remain fully part of the
library, and `denseHairField()` beside them is how a shape is filled with
hair (§9a).

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

**FOUR SPECIES, AND ONLY FOUR (Kimia, 2026-08-19 — this replaces the
first "64 species" reading).** N-Z-D grows **four flora silhouettes**.
The 64 flora are not 64 drawings: they are those four shapes in
different sizes and different fills, and the arithmetic is exact.

- **48 collectible** — **4 silhouettes × 2 sizes × 6 fills = 48.** Each
  species comes in two sizes, and every size wears any of the six fills.
  Placeable in the Abode, gatherable and compostable.
- **16 landmark** — **4 super-sized versions of each of the four
  species.** Giant, too big to carry, **one per Map region, enforced**
  (2026-07-24; mechanics in spec §5): the moment one drops it reveals a
  **permanent marker on the regional Map**; gathering one (optional,
  like all flora) collects a **keepsake** cutting — leaf, branch, or
  fruit — that goes to the Abode, while the tree itself stays on the Map
  regardless. Art per landmark: body + Map marker + one keepsake type.
  _Open (T6.1): what makes the four versions of a landmark species
  differ from one another — fill is the obvious answer but has not been
  decided._

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

**The landmark super-size is still unset** (2026-08-19) — deliberately, as
the third class belongs with the Map work. No screen may type one in
meanwhile. See §9c's canon rule; it governs any family, not only friends.

**The four colours (Kimia, 2026-08-19, T5.3g).** Rich and bioluminescent,
in `src/ui/floraColours.js`: **emerald · leaf · sky · azure**. Note what
that is — **two greens and two blues**. The hues were named on paper as
green, blue, indigo and aqua; shown twelve candidates glowing on the dark
ground she took two of each of the first two and none of the last two.
There is no aqua and no indigo in Habitat's flora. This is also the other
half of the friend/flora boundary: the flora colours are deep and vivid
where the friend pastels are soft (`friendColours.js`).

**A FILL is a texture worn in a colour, and there are six**
(`src/ui/floraFills.js`). Kimia's calls:

- The fills come from the **hair textures only** — never moss, bark,
  pores or sponge. Flora are furred, not crusted.
- **All four hair modes are used, with curly coat and dense underfur
  doubled**: 1 + 2 + 1 + 2 = 6.
- **The hair FORMS the fill, inside the silhouette.** It never fringes
  out past the outline, so whatever draws a flora clips the field to its
  shape. (Hair is scattered by a generator that overruns its box by
  design; the clip is what enforces the rule, and a test holds it.)
- **CUT THE SHAPE OUT OF THE MIDDLE OF A DENSE FIELD (Kimia,
  2026-08-19).** The generator grows every strand upward from a scattered
  root, which leaves any field thin along its BOTTOM edge — a point near
  the bottom is covered only by the few roots beneath it, where a point in
  the middle has everything below it as well. On a square swatch nobody
  minds; cut a flora out of one and the shape wears that thin band across
  its underside, which is what she saw and rejected. So a flora is never
  cut from a field its own size: the field is grown **larger than the
  shape and denser than one pass**, and the shape is cookie-cut from the
  middle of it. `denseHairField()` in `textures.jsx` is the rule made
  code — enough room below for a whole strand's reach, plus repeat passes
  to hold the tuned density over the bigger area — and a test measures the
  bottom of every mode against its middle.
  _(An earlier attempt at the same complaint, shrinking and softening the
  dark ground so it never reached the outline, was built and rejected the
  same day: it thinned the flora instead of filling them.)_
- The pairing puts one green and one blue on each doubled texture, so no
  texture belongs to a single hue and the six split three green / three
  blue.

Hair wears a colour through `hairRamp()` in `textures.jsx`, which rebuilds
the whole five-part strand ramp from one hex — the same one-tone-in,
whole-set-out idea as the friends' `paletteForTone()`.

**Leaves.** A species may have leaves or not. Leaf shape is **consistent
within** a species and can vary **wildly between** species — with only
four species, this is now a property of the four silhouettes rather than
an axis of variation.

**Fruit.** Tiny shrubs may bear none; larger flora may. Each species has
**exactly one** fruit type, in any rounded or blobby form.

**WHICH OF THE 48 A FIND IS, IS DEALT (Kimia, 2026-08-21, T5.3i).** A flora
drop stores nothing but the word `flora`; its shape, size and fill are rolled
from the save's own seed and the find's completion id (`src/ui/floraDeal.js`),
the same trick that deals a friend its colour. Nothing new is written into a
save, the answer never changes for a given find, and flora gathered before the
art existed get their looks too. **Large and small come half and half** (her
call, same day) — a large flora stands 2.75x a small one, so the mix is what a
ground looks like, and even odds is the flattest answer.

**Two finds of the same shape and fill ARE the same flora** and look identical
on purpose: that is what a catalogue of 48 means, rather than 48 templates for
unique plants. `Flora.jsx` grows one hair field per shape-and-fill pair and
reuses it everywhere, which is that fact made into code.

**THE FLORA REACHED THE GAME on 2026-08-21** (T5.3i): the Abode first — the
ground and the doorstep list, with the party's friends going in beside them —
and then the arrival shelf at the top of the habit list and the first-flora
reveal, which took the habit list's held arrival row in with them. `src/ui/Flora.jsx` is the one component every screen showing a flora goes
through, the twin of `Friend.jsx`, and it carries the recipe above verbatim.
**A screen chooses a BASE, not a size**, exactly as §9c requires of the
friends, and the same base serves both families because the two canons speak
one scale: the Abode sizes up from the smallest thing that can stand on it,
which is a plip and not a small flora.

**Axes of variation: size and fill.** That is the whole list (2026-08-19
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

Complexity broadly climbs the ladder. **One signature congratulation
animation per category (10 total);** every individual in a category
reuses its category's animation (design-notes §8).

**The silhouette test** (fungi & flora vs. friends): flora radiate from
a still centre; friends have eyes and move. If a form is ambiguous, the
eyes and the signature motion resolve it.

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

**Purpose.** Never obvious — invites curiosity, not explanation.

**Pool — 64 objects**, revealed gradually: **4 objects enter the
Market's rotation pool with each of the 16 Map regions** (16 × 4 = 64 —
spec §5's pool-grows-with-the-Map rule), so the Market expands over the
years without ever being complete too early.

#### 10b. Publications

**Types.** Magazines · novels · dictionaries.

**Count — 30.** Ten of each type (~10 block colours × 3 types). Type
governs **drop rarity** (spec §5), not count. At three canonical assets
each (below), that is **90 image assets**.

**Form.** Familiar Earth-like book forms read through Habitat's graphic
style — recognisable silhouettes, no overly sharp lines in any view.

**Colour.** A single block colour per publication, anywhere on the
spectrum.

**Light.** Glows **less** than living things (§7).

**Three canonical assets per publication:**

1. **Spine view** — for the Bookcase shelf.
2. **Front cover view** — for reveals and the shelf's face-out state.
3. **Interior double-page spread** — the reading image opened from the
   Bookcase. **Kimia-provided, one per publication, never
   AI-generated** (the standing content rule, CLAUDE.md).

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
- **adds 4 curiosities to the Market pool** when unlocked (§10a).

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
| Flora — silhouettes | 4     | one drawing each; 48 collectibles = 4 × 2 sizes × 6 fills |
| Flora — fills       | 6     | hair texture × colour, no drawing of their own         |
| Flora — landmark    | 16    | 4 super-sized versions of each species; body + Map marker + one keepsake type |
| Fungi               | 1     | single form                                            |
| Friend categories   | 10    | 1 signature animation each                             |
| Friend individuals  | 55    | body each (10 → 1 down the ladder)                     |
| Curiosities         | 64    | body (4 per region × 16)                               |
| Publications        | 30    | spine + cover + interior spread (10 per type)          |
| Sky                 | 1     | Abode sky × 4 palettes (shared night sky is CSS, §11a) |
| Terrain             | 1     | serves 3 screens                                       |
| Map regions         | 16    | region art + 1 landmark marker each                    |
