# tools/art-pipeline — how friends and flora get their look

These scripts turn Kimia's drawings into the layered artwork the app
paints. They are run by hand in an art session, never by the app, the
tests or the build. The rules they serve are in **design-bible.md §9d**;
read that first.

They are plain working scripts, written quickly in the session of
2026-11-15. Tidy them when it helps, but check the output still matches
(see "Checking nothing moved" below).

## Setting up (once per machine)

    cd tools/art-pipeline
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt

`venv/` is ignored by git. Everything below is run from this folder with
`./venv/bin/python`.

## A flora: painted interior

1. **Silhouette picture.** `silhouettes/flora-<key>-silhouette.png` is
   the white-on-black shape to hand to the image generator. All sixteen
   are already made. To remake one: `python silhouette.py <key>`.
   Keys are those of `src/ui/floraSilhouettes.js` (`1 2 3 6`) and
   `src/ui/newFloraSilhouettes.js` (`n01` … `n12`).
2. **Kimia paints it.** In ChatGPT she attaches that silhouette and her
   character sheet, and pastes `prompt.txt`. The result is saved as
   `paintings/flora-<key>-painted.png`. Any image size is fine.
3. **Slice it.** `python export_flora.py` rebuilds
   `src/ui/paintedFlora.js` from every painting in `paintings/`. It
   prints each one's overlap with the real silhouette. Two paintings so
   far scored 0.96 and 0.90 and both look right; a much lower score
   means the generator changed the shape and the painting should be
   redone.

`ai.py` does the fitting and slicing. `paint.py` holds the shared
helpers, and also the code-painted experiment Kimia judged and passed
over (kept for reference; nothing uses its `paint()`).

## A friend: cleaning a trace

1. `python raw.py 03 04 09` reads those friends' traced bands out of
   `src/ui/friendNN.jsx` into `rawNN.pkl` (ignored by git).
2. `python export.py` rebuilds `src/ui/cleanedFriends.js`.

What "cleaning" means, and Kimia's rules for it:

- **Specks go.** Loose flecks and pinholes below a small area are
  removed from every band (`speck` in the scripts).
- **Holes in the body are filled**, with a soft patch of the right
  overall shape: an oval for the krupengk, a wobbled rounded triangle
  for the zala (`PATCH` in `clean2.py`, `clean3.py`). The filled area
  gets two generated shade bands so it is not flat.
- **Broken limbs are redrawn from the character sheet, never removed**
  (`chitu.py`). The chitu's tendrils had come apart in tracing, so each
  is redrawn as one smooth tapering curve through points read off the
  sheet, ending in a bulb; the round bites in its underside are filled
  by the underbelly the sheet shows. To move a tendril, edit its points
  in `TENDRILS`, run `python chitu.py` and look at `chitu_fixed.png`.

- **Side-by-side bands are stacked first** (`hamdi.py`). The hamdi
  bulo's seven bands do not overlap, so deleting a fleck would leave a
  dark hole. Each layer is rebuilt as "this tone or lighter", then
  cleaned of specks like the others. Its loose pieces are then joined
  into one silhouette: gaps beside a loose piece are filled (`CLOSE`),
  the broken legs at the bottom right are closed along their length
  (`LEGS`, `LEG_CLOSE`), two crevices between them are filled in the
  darkest shade (`CREVICES`), and the flecks off its right side are
  left out (`RIGHT_FLECKS`). The dials are at the top of the script; `python hamdi.py` writes
  `hamdi_before.png` and `hamdi_after.png` to compare.

Each friend needs its own look and its own dials: which of the three
problems it has is decided by eye, on the workbench, with Kimia. Seven
friends are still to do (plan.md T5.3p).

## Checking nothing moved

After changing a script, rerun the exports and `git diff --stat src/ui`.
With the paintings and traces unchanged, `cleanedFriends.js` and
`paintedFlora.js` must come out byte-for-byte the same.
