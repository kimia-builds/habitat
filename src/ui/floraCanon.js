/*
 * floraCanon.js — where the flora stand in the sizing table (T5.3g)
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
 *   • **The two sizes are places in the whole table, not one friend's height
 *     each.** They were worked out from two particular friends — the large
 *     class was a chitu's height, the small class half a zala's — and she
 *     ruled that out once the sizes were settled: a flora should sit where it
 *     sits among everything that grows and walks on N-Z-D, not be tied to two
 *     individuals who might be redrawn. So the numbers below are entries in the
 *     scale in their own right, and the table under them is what they answer to.
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
 *     floraHeight('small', 11.5)             // → 3.22, in whatever unit base was
 *     floraWidth('small', silhouette, 11.5)  // → the width that height makes
 *
 * WHERE THE OBJECTS COME IN. Kimia's reason for wanting this canon is that
 * flora, friends and market objects may all sit in the Abode at once. Two of
 * those three are now in one scale. The objects are not drawn yet (design-bible
 * §10a has no sizes, only "price correlates with size") — when they are, they
 * take their own places in this same table rather than getting a private one.
 * =========================================================================== */

/* ── THE SIZING TABLE, BY HEIGHT ──────────────────────────────────────────────
 * Everything Habitat draws, tallest last, in the one shared scale. The friends'
 * figures are not stored here — they are their canon WIDTHS turned into heights
 * by their own drawings, and friendCanon.js remains the only place they live.
 * This is the picture the two flora numbers were chosen against, written out so
 * a person can see the whole ladder at a glance:
 *
 *     plip           0.147
 *     SMALL FLORA    0.280   ← between the plip and the baluhm
 *     baluhm         0.397
 *     liwi bi jiji   0.427
 *     krupengk       0.438
 *     rassatt        0.547     (wide and low — tall friends are not the big ones)
 *     zala           0.562
 *     woigolp        0.694
 *     meuhy          0.721
 *     LARGE FLORA    0.770   ← between the meuhy and the hamdi bulo
 *     chitu          0.770
 *     hamdi bulo     1.157
 *
 * The comment can go stale; the test cannot. `floraCanon.test.js` rebuilds this
 * ladder from friendCanon.js and the drawings on every run and checks that each
 * flora class still falls between the neighbours named above — so the flora are
 * pinned to their PLACE in the table, which is what Kimia asked for, rather than
 * to any one friend's height.
 * ────────────────────────────────────────────────────────────────────────── */

// THE CANON. Both numbers are heights, as fractions of the chitu's width — the
// same 1 that friendCanon.js counts in.
//
// Two figures, unlike friendCanon.js's six. That file needs six because its
// numbers are RATIOS READ OFF A DRAWING, where a rounding error is a drawing
// being wrong; these two are choices, and a chosen number should look chosen.
// (They began life as 0.280993 and 0.770215, the leftovers of the friend
// arithmetic they were derived from; Kimia rounded them when they stopped being
// derived. The drawn size moved by a third of one percent — no eye can see it.)
export const FLORA_CANON = {
  small: 0.28,
  large: 0.77,
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
