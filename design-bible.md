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
  the organism, never an effect applied on top, and its **colour never
  varies** between species or individuals. Only intensity conventions
  differ (§7).
- **Darkness is the default; nothing casts a shadow.**
- **Palette by class:** organic life stays in the restrained palette;
  curiosities use the broadest palette; publications take one block
  colour each. Glow colour is never a source of variation for living
  things.
- **Variation lives in form** — size, silhouette, texture, appendage —
  never in tricks, effects, or brighter light.
- **Function follows mystery.**

### 4. Shape language

Rounded · blob-like · soft silhouettes · few straight lines.

### 5. Surface language

Organic · hairy · porous · rough · mossy · fungal · cratered · squishy.

### 6. Material language

Mushroom · rock · leaf · moss · gravel · hair.

### 7. Light language

- Living things emit light.
- Darkness is the default.
- No shadows.
- Artificial objects may glow, but don't have to.

**Glow intensity ladder** (the one place living-thing light differs):
flora = fungi = friends (equal, full). Publications glow **less** than
living things. Curiosities **may** glow or not.

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

| Family | Draws from |
| --- | --- |
| Flora | Plant-like, Fungal, Hair (any organic) |
| Fungi | Fungal (primary), Plant-like |
| Friends | Any organic — Plant-like, Fungal, Hair |
| Curiosities | **Rock and Fungal only** — never leafy, hairy, or fleshy |
| Terrain / Map | Rock and Ground |

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

**Leaves.** A species may have leaves or not. Leaf shape is **consistent
within** a species and can vary **wildly between** species.

**Fruit.** Tiny shrubs may bear none; larger flora may. Each species has
**exactly one** fruit type, in any rounded or blobby form.

**Axes of variation:** overall size · leaf shape · presence/absence of
fruit · surface texture. **Not** varied: glow colour, growth habit,
body plan.

**Collection — 64 species**, ground-cover to giant centrepieces:

- **48 collectible** — placeable in the Abode, gatherable and
  compostable.
- **16 landmark** — giant, too big to carry, **one per Map region,
  enforced** (2026-07-24; mechanics in spec §5): the moment one drops
  it reveals a **permanent marker on the regional Map**; gathering one
  (optional, like all flora) collects a **keepsake** cutting — leaf,
  branch, or fruit — that goes to the Abode, while the tree itself
  stays on the Map regardless. Art per landmark: body + Map marker +
  one keepsake type. Which species are landmarks is fixed with the
  content pools (T6.1).

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

**Complexity scales with size.** Larger friends are more visually
complex, but complexity comes from **layered texture, appendages, and
silhouette** — never brighter colour or stronger glow.

**Inspirations.** May loosely evoke Earth animals — arachnids,
crustaceans, hedgehogs, slugs — but must never read as a direct
analogue. Weird, not familiar-in-costume.

**Ten categories** on the literacy ladder (spec §5), each with a
**fixed roster of individuals** — population inversely tied to
literacy, from 10 Drifters down to a single Poet:

| Category (low → high literacy) | Individuals |
| --- | --- |
| Drifters | 10 |
| Nesters | 9 |
| Mimics | 8 |
| Signers | 7 |
| Sprouts | 6 |
| Chatters | 5 |
| Neighbours | 4 |
| Storytellers | 3 |
| Scholars | 2 |
| Poets | 1 |
| **Total** | **55** |

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

| Family | Count | Assets per unit |
| --- | --- | --- |
| Flora — collectible | 48 | body (+ optional leaves, one fruit type) |
| Flora — landmark | 16 | body + Map marker + one keepsake type |
| Fungi | 1 | single form |
| Friend categories | 10 | 1 signature animation each |
| Friend individuals | 55 | body each (10 → 1 down the ladder) |
| Curiosities | 64 | body (4 per region × 16) |
| Publications | 30 | spine + cover + interior spread (10 per type) |
| Sky | 1 | Abode sky × 4 palettes (shared night sky is CSS, §11a) |
| Terrain | 1 | serves 3 screens |
| Map regions | 16 | region art + 1 landmark marker each |
