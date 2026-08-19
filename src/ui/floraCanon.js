/*
 * floraCanon.js — how big a flora is against everything else (T5.3g)
 * =============================================================================
 * PERMANENT, and the twin of friendCanon.js. That file settled the friends'
 * proportions; this one settles the flora's, and — this is the whole point —
 * it does it in THE SAME SCALE, so a flora and a friend standing in the Abode
 * together are true to each other and not merely each true to their own family.
 *
 * KIMIA'S CALLS (2026-08-19):
 *   • There are exactly TWO size classes, and all four silhouettes share them.
 *     A species is not big or small; a flora is. (The landmark super-size is a
 *     third class and is deliberately not set here yet — it belongs with the
 *     Map work. Nothing may invent one in the meantime.)
 *   • A flora's size is its HEIGHT. Not its width, not its bulk: how tall it
 *     stands next to you is what "size" means for a plant.
 *   • The large class stands as tall as a CHITU, the biggest friend.
 *   • The small class stands HALF as tall as a ZALA. It was pegged to the whole
 *     zala first; seeing the two classes drawn she called the small one too
 *     tall and halved it, which is the eyeball test doing its job — the derived
 *     number was the proposal, her eye was the decision. A large flora is now
 *     2.74× the height of a small one.
 *
 * WHY THE CHITU AND NOT THE RASSATT, which she first named. The rassatt is wide
 * and low: measured by height it is 2.6% SHORTER than the zala, so pegging the
 * two classes to those two friends would have produced two classes the same
 * size. Shown the cast's heights she re-pegged the large class to the chitu,
 * which is genuinely taller. The large flora reads 37% taller than the small.
 *
 * ═══ HEIGHTS HERE, WIDTHS IN friendCanon.js — READ THIS BEFORE USING EITHER ═══
 * Both files speak the same unitless scale, whose 1 is the chitu's WIDTH. What
 * differs is which measurement each family's number IS:
 *
 *     friendSize('zala', base)   → a friend's WIDTH   (its drawing sets the height)
 *     floraHeight('small', base) → a flora's HEIGHT   (its drawing sets the width)
 *
 * Neither family is stretched: each drawing keeps its own proportions, and only
 * one of its two measurements is dictated. Pass the SAME `base` to both and the
 * two families come out true to each other, because both numbers are fractions
 * of the same thing.
 *
 * HOW TO USE IT. Never type a flora size in by hand. A screen decides ONE base
 * — how much room the largest friend gets there — and asks:
 *
 *     floraHeight('small', 11.5)             // → 6.46, in whatever unit base was
 *     floraWidth('small', silhouette, 11.5)  // → the width that height makes
 *
 * WHERE THE OBJECTS COME IN. Kimia's reason for wanting this canon is that
 * flora, friends and market objects may all sit in the Abode at once. Two of
 * those three are now in one scale. The objects are not drawn yet (design-bible
 * §10a has no sizes, only "price correlates with size") — when they are, they
 * join THIS scale, measured against the same chitu, rather than getting a third
 * private one.
 * =========================================================================== */

// THE CANON. Both numbers are heights, as fractions of the chitu's width — the
// same 1 that friendCanon.js counts in.
//
// They are not free-standing choices; they are two friends' heights, worked out
// from the character sheet:
//
//   small = the zala's height  ÷ 2 = 0.6 × (366.19 ÷ 390.96) ÷ 2 = 0.280993
//   large = the chitu's height     = 1   × (550.65 ÷ 714.93)     = 0.770215
//
// (canon width × the drawing's own height ÷ its own width, and then Kimia's
// halving on the small one). They are written
// out as plain numbers rather than computed here so that this file stays a
// short statement of fact, and `floraCanon.test.js` re-derives them from
// friendCanon.js and the two drawings every time the suite runs — so if the
// cast is ever redrawn, the suite says so instead of the flora drifting quietly.
//
// Six figures for the same reason friendCanon.js gives: these are ratios, and a
// rounding error is multiplied by whatever base a screen picks.
export const FLORA_CANON = {
  small: 0.280993, // half as tall as a zala
  large: 0.770215, // as tall as a chitu, the biggest friend
}

// The two classes in order, for anything that walks them both.
export const FLORA_SIZE_CLASSES = ['small', 'large']

// Where this size class stands in the scale. An unknown class means a bug
// elsewhere; answer with the large one, because a flora drawn too big is a far
// better failure than one drawn at zero and invisible.
export function floraScale(sizeClass) {
  const scale = FLORA_CANON[sizeClass]
  return typeof scale === 'number' ? scale : FLORA_CANON.large
}

// How TALL a flora of this class is where the largest friend is `base` wide.
// The unit rides along with `base` — rem in, rem out.
export function floraHeight(sizeClass, base) {
  return floraScale(sizeClass) * base
}

// …and how wide that makes THIS silhouette, from its own proportions. Two
// species of the same class are the same height and different widths, which is
// exactly what Kimia asked for: the tendril sprawls, the cactal does not.
export function floraWidth(sizeClass, silhouette, base) {
  const { w, h } = silhouette.viewBox
  return floraHeight(sizeClass, base) * (w / h)
}
