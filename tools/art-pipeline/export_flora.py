"""Make src/ui/paintedFlora.js: every flora that has a painting in paintings/,
fitted to its silhouette, sliced into the seven tones and cleaned (ai.py).
    python export_flora.py
"""
import json, os, glob, re
from clean import path, H
from paint import silhouettes
from ai import ai_paint, AI

sils = silhouettes()
keys = sorted(re.match(r'flora-(.+)-painted\.png', os.path.basename(f)).group(1) for f in glob.glob(AI + 'flora-*-painted.png'))
out = {}
for k in keys:
    r = ai_paint(k, sils[k])
    out[k] = [path(g) for g in r['layers']]
    print(k, 'overlap with the silhouette', round(r['iou'], 3))

head = """/*
 * paintedFlora.js — the flora's painted interiors (2026-11-15)
 * =============================================================================
 * HOW A FLORA GETS ITS SHADING (design-bible §9d). The friends look organic
 * because each began as a soft grey painting that tracing sliced into tones.
 * A flora is made the same way, in three steps:
 *
 *   1. Kimia's silhouette is given to an image generator as a white shape on
 *      black, with her character sheet as the style to copy, and it paints
 *      ONLY the inside, in greyscale (tools/art-pipeline/prompt.txt).
 *   2. A script stretches that painting to fit her exact outline — the
 *      generator always redraws the edge a little; where her outline reaches
 *      past the painting the nearest painted tone is carried across.
 *   3. The script slices it into seven tones, giving every species the SAME
 *      share of each tone, and drops any piece too small to read.
 *
 * So the edge is hers, the tones and colours are the code's, and only the
 * interior is the generator's. Each entry is a species' seven layers,
 * darkest first, each lying on top of the one before; PaintedFlora.jsx paints
 * them in the friends' greys #494949 … #d0d0d0 over a silhouette in #333333.
 *
 * Keyed like floraSilhouettes.js / newFloraSilhouettes.js. Only the species
 * painted so far are here.
 *
 * MADE BY tools/art-pipeline/export_flora.py. Do not edit by hand.
 * =========================================================================== */

export const PAINTED_FLORA = """
open(H + 'paintedFlora.js', 'w').write(head + json.dumps(out, indent=1).replace('"', "'") + '\n')
