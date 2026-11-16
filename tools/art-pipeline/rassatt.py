"""THE RASSATT, cleaned (2026-11-16). Fourth-grainiest trace (src/ui/friend07.jsx:
about 720 flecks, 100 pinholes). Its seven tone bands lie side by side, so they
are STACKED before cleaning (see hamdi.py for why). NOTE its bands are not
listed light-to-dark in the file, so each is matched to its grey first.

The rassatt is a FAN: blades spreading up and out from a point at the bottom.
The trace kept the blades but lost most of the lower fan: wide dark gaps run
up between the blades, the strands that should meet at the point are loose
crumbs, and two of its five eyes float among them. Cleaned by what the hamdi
bulo settled with Kimia (specks out, gaps filled in the darkest shade, one
coherent silhouette):

  1. SPECKS: flecks and pinholes smaller than SPECK go from every layer.
  2. THE FAN IS CLOSED: everything open inside FAN (a smooth outline from the
     two outer blades down to the point) is filled, in the DARKEST shade, the
     outline's own. The loose strands inside it become part of the body and
     all five eyes sit on it.
  3. Anything still loose outside the fan is left out (the script prints it).

    python rassatt.py       # writes rassatt_before.png and rassatt_after.png
"""
import re
from shapely.geometry import Polygon
from shapely.ops import unary_union
from load import strings, evenodd, polys
from clean import H
from hamdi import despeckle, _paint, GREYS, count

NUM = '07'
VB = (578.84, 368.0)
# The dials, in the drawing's own units (the whole drawing is about 579 x 368).
SPECK = 60
SMOOTH = 1.0
SEAL = 0.5
# The lower fan: a smooth closed curve through these points. It starts at the
# point at the bottom, runs up the left edge to the left blade, crosses well
# inside the body, and comes back down the right edge. Only the two edges and
# the point shape the outline; the crossing just has to stay inside the body.
FAN = [(257, 366), (236, 344), (204, 312), (160, 286), (112, 266), (70, 240), (38, 212),
       (90, 140), (270, 95), (450, 135),
       (538, 196), (502, 236), (474, 270), (452, 296), (404, 318), (344, 344), (290, 360)]


def raw():
    src = open(H + f'friend{NUM}.jsx').read()
    i = src.index('const GREY_ORDER')
    order = re.findall(r"'(#[0-9a-fA-F]+)'", src[i:src.index(']', i)])
    base = unary_union([evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_BASE')])
    by_grey = {g: evenodd(d)[0].buffer(0) for g, d in zip(order, strings(src, f'FRIEND{NUM}_LAYERS'))}
    return base, [by_grey[g] for g in GREYS]      # darkest first


def one_piece(body):
    """Close the fan. Returns the silhouette."""
    from chitu import spline
    fan = Polygon(spline(FAN + FAN[:1], step=2)).buffer(0)
    whole = unary_union([body, fan]).buffer(0.3).buffer(-0.3)
    ps = sorted(polys(whole), key=lambda p: -p.area)
    print('left out:', [(round(p.area), [round(v) for v in p.centroid.coords[0]]) for p in ps[1:]])
    sil = Polygon(ps[0].exterior)
    sil = sil.buffer(-SMOOTH / 2).buffer(SMOOTH).buffer(-SMOOTH / 2)
    return Polygon(max(polys(sil), key=lambda p: p.area).exterior).simplify(0.15)


def clean_rassatt(speck=SPECK, smooth=SMOOTH):
    base, bands = raw()
    body = unary_union([base] + bands).buffer(SEAL).buffer(-SEAL)
    sil = one_piece(body)
    layers = []
    for k in range(len(bands)):
        stacked = unary_union(bands[k:]).buffer(SEAL).buffer(-SEAL)   # tone k or lighter
        layers.append(despeckle(stacked.intersection(sil), speck, smooth))
    return dict(sil=sil, layers=layers, base=base, bands=bands)


def preview(sil, layers, name, k=2.2):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    im.save(name)


if __name__ == '__main__':
    r = clean_rassatt()
    preview(r['base'], r['bands'], 'rassatt_before.png')
    preview(r['sil'], r['layers'], 'rassatt_after.png')
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
