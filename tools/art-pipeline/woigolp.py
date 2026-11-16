"""THE WOIGOLP, cleaned (2026-11-16). Third-grainiest trace (src/ui/friend08.jsx:
about 840 flecks, 190 pinholes). Its seven tone bands lie side by side, so they
are STACKED before cleaning (see hamdi.py for why). Cleaned by what the hamdi
bulo and the liwi bi-jiji settled with Kimia:

  1. SPECKS: flecks and pinholes smaller than SPECK go from every layer.
  2. NO LEGS (Kimia, 2026-11-16: it "resembles the look and feel of a
     four-legged animal ... remove the legs portion of the creature, create
     an un-legged bottom half by removing the feet"). A first pass had
     filled the bays under its belly and stood its loose feet on the body;
     seeing that, she had the legs and feet taken off altogether. So the
     bottom of the body is now one smooth rounded line (BOTTOM): everything
     below it is cut away, and everything above it, down to the line, is
     body, filled in the DARKEST shade (the outline's own).
  3. THREE EYES: her two, and a third to their right (EYES).

    python woigolp.py       # writes woigolp_before.png and woigolp_after.png
"""
from shapely.geometry import Polygon
from shapely.ops import unary_union
from load import strings, evenodd, polys
from clean import H
from hamdi import despeckle, _paint, GREYS, count

NUM = '08'
VB = (577.03, 505.85)
# The dials, in the drawing's own units (the whole drawing is about 577 x 506).
SPECK = 80
SMOOTH = 1.2
SEAL = 0.5
# The new bottom edge of the body, left to right: a smooth curve through
# these points. Raise or lower the middle ones to make the belly flatter or
# rounder; the end points sit where the body's sides were before the legs.
BOTTOM = [(84, 338), (90, 380), (116, 418), (165, 444), (235, 457), (315, 461),
          (395, 456), (460, 438), (506, 408), (530, 372), (538, 338)]
# The eyes: her two, then the third she asked for, to their right (same size,
# same spacing, on the same line).
EYES = [dict(cx=153.2, cy=249.6, r=4.8), dict(cx=198.1, cy=250.8, r=4.8), dict(cx=243.0, cy=252.0, r=4.8)]


def raw():
    src = open(H + f'friend{NUM}.jsx').read()
    base = unary_union([evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_BASE')])
    # the file lists the bands LIGHTEST first; turn them darkest first
    bands = [evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_LAYERS')][::-1]
    return base, bands


def one_piece(body):
    """The body with a smooth un-legged bottom. Returns the silhouette."""
    from chitu import spline
    curve = spline(BOTTOM, step=2)
    (x0, y0), (x1, y1) = curve[0], curve[-1]
    # everything under the curve (and out to the sides, below where it starts) goes
    below = Polygon([(-50, y0)] + curve + [(VB[0] + 50, y1), (VB[0] + 50, VB[1] + 50), (-50, VB[1] + 50)])
    # everything from the curve up into the middle of the body is body
    belly = Polygon(curve + [(x1 - 14, y1 - 12), ((x0 + x1) / 2, y0 - 30), (x0 + 12, y0 - 12)])
    whole = unary_union([body, belly]).difference(below)
    main = max(polys(whole), key=lambda p: p.area)
    sil = Polygon(main.exterior)
    sil = sil.buffer(-SMOOTH / 2).buffer(SMOOTH).buffer(-SMOOTH / 2)
    return Polygon(max(polys(sil), key=lambda p: p.area).exterior).simplify(0.15)


def clean_woigolp(speck=SPECK, smooth=SMOOTH):
    base, bands = raw()
    body = unary_union([base] + bands).buffer(SEAL).buffer(-SEAL)
    sil = one_piece(body)
    layers = []
    for k in range(len(bands)):
        stacked = unary_union(bands[k:]).buffer(SEAL).buffer(-SEAL)   # tone k or lighter
        layers.append(despeckle(stacked.intersection(sil), speck, smooth))
    return dict(sil=sil, layers=layers, base=base, bands=bands, eyes=EYES)


def preview(sil, layers, name, k=2.0, eyes=()):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    from shapely.geometry import Point
    for e in eyes:                               # the eyes, roughly as the app draws them
        _paint(im, Point(e['cx'], e['cy']).buffer(e['r'] * 0.7), '#f4f0d8', k)
    im.save(name)


if __name__ == '__main__':
    r = clean_woigolp()
    preview(r['base'], r['bands'], 'woigolp_before.png')
    preview(r['sil'], r['layers'], 'woigolp_after.png', eyes=r['eyes'])
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
