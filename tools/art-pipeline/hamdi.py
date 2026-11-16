"""THE HAMDI BULO, de-speckled (2026-11-16).

Its trace (src/ui/friend10.jsx) is the speckliest of the ten: about 1,770
flecks and 2,800 pinholes. Unlike the krupengk and the zala, its seven tone
bands do NOT overlap: each covers only its own region, side by side. So a
fleck cannot simply be deleted (that would leave a dark hole down to the
base). Instead:

  1. STACK the bands. Layer k becomes "everything at least as light as tone
     k", so each lighter layer sits on top of the darker one beneath it.
  2. In every stacked layer, drop loose flecks and fill pinholes smaller
     than SPECK, and smooth the edge very slightly. A dropped fleck now
     shows the tone under it; a filled pinhole takes the tone around it.

The outline is her trace's own: the sealed base from friend10.jsx. Only
dust smaller than SPECK is dropped from it. Loose LIMBS are all kept, and
nothing is reattached yet (that is a separate repair, to be judged by eye).

    python hamdi.py          # writes hamdi_before.png and hamdi_after.png
"""
import re
from shapely import affinity
from shapely.geometry import Polygon
from shapely.ops import unary_union
from load import strings, evenodd, polys
from clean import H

NUM = '10'
OFFSET = (-63.71, -95.608)   # FRIEND10_OFFSET: trace space -> viewBox space
VB = (687.651, 832.012)
# The dials. SPECK is an area in the drawing's own units (the whole drawing
# is about 688 x 832): anything smaller is grain. SMOOTH rounds the edges.
SPECK = 60
SMOOTH = 1.0
SEAL = 0.6                   # closes the hairline gaps between adjacent bands
# Darkest first: the paint order of the stacked layers.
GREYS = ['#494949', '#606060', '#767676', '#8c8c8c', '#a3a3a3', '#b9b9b9', '#d0d0d0']


def _shift(g):
    return affinity.translate(g, *OFFSET)


def raw():
    src = open(H + f'friend{NUM}.jsx').read()
    base = _shift(unary_union([evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_BASE')]))
    # the file lists the bands LIGHTEST first; turn them darkest first
    bands = [_shift(evenodd(d)[0].buffer(0)) for d in strings(src, f'FRIEND{NUM}_LAYERS')][::-1]
    return base, bands


def despeckle(g, speck=SPECK, smooth=SMOOTH):
    """Drop flecks and fill pinholes below `speck`; round the edge a little."""
    g = g.buffer(smooth).buffer(-2 * smooth).buffer(smooth)
    keep = [q for q in polys(g) if q.area >= speck]
    keep = [Polygon(q.exterior, [r for r in q.interiors if Polygon(r).area >= speck]) for q in keep]
    return unary_union(keep).simplify(0.15) if keep else Polygon()


def clean_hamdi(speck=SPECK, smooth=SMOOTH):
    base, bands = raw()
    body = unary_union([base] + bands)
    sil = body.buffer(SEAL).buffer(-SEAL)
    sil = unary_union([Polygon(q.exterior, [r for r in q.interiors if Polygon(r).area >= speck])
                       for q in polys(sil) if q.area >= speck]).simplify(0.15)
    layers = []
    for k in range(len(bands)):
        stacked = unary_union(bands[k:]).buffer(SEAL).buffer(-SEAL)   # tone k or lighter
        layers.append(despeckle(stacked.intersection(sil), speck, smooth))
    return dict(sil=sil, layers=layers, base=base, bands=bands)


def _paint(im, g, col, k):
    from PIL import Image, ImageDraw
    for p in polys(g):
        m = Image.new('L', im.size, 0)
        d = ImageDraw.Draw(m)
        d.polygon([(x * k, y * k) for x, y in p.exterior.coords], fill=255)
        for r in p.interiors:
            d.polygon([(x * k, y * k) for x, y in r.coords], fill=0)
        im.paste(col, (0, 0), m)


def preview(sil, layers, name, k=1.6):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    im.save(name)


def count(layers):
    return sum(len(polys(g)) + sum(len(p.interiors) for p in polys(g)) for g in layers)


if __name__ == '__main__':
    r = clean_hamdi()
    preview(r['base'], r['bands'], 'hamdi_before.png')
    preview(r['sil'], r['layers'], 'hamdi_after.png')
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
