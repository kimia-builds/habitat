"""THE WOIGOLP, cleaned (2026-11-16). Third-grainiest trace (src/ui/friend08.jsx:
about 840 flecks, 190 pinholes). Its seven tone bands lie side by side, so they
are STACKED before cleaning (see hamdi.py for why). Cleaned by what the hamdi
bulo and the liwi bi-jiji settled with Kimia:

  1. SPECKS: flecks and pinholes smaller than SPECK go from every layer.
  2. THE UNDERSIDE: the trace has deep bays bitten up into the belly, and
     its feet float loose below them. Everything open inside UNDERSIDE is
     filled, in the DARKEST shade (the outline's own), so the feet stand on
     the body and the silhouette is ONE piece.
  3. A loose piece of at least BIG that the fill does not reach is joined by
     a thin strand if it is within REACH. Smaller flecks are left out (the
     script prints which), as on the other two.

    python woigolp.py       # writes woigolp_before.png and woigolp_after.png
"""
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union, nearest_points
from load import strings, evenodd, polys
from clean import H
from hamdi import despeckle, _paint, GREYS, count

NUM = '08'
VB = (577.03, 505.85)
# The dials, in the drawing's own units (the whole drawing is about 577 x 506).
SPECK = 80
SMOOTH = 1.2
SEAL = 0.5
BIG = 150         # a loose piece at least this large is a real foot
REACH = 16        # ...and is joined by a strand if it is within this distance
STRAND = 2.2      # half the width of a joining strand
# The bays under the belly, as a rough shape around them, feet at its bottom.
UNDERSIDE = Polygon([(205, 392), (222, 356), (262, 350), (300, 372), (350, 372),
                     (400, 378), (440, 392), (470, 410), (478, 440), (468, 468),
                     (445, 462), (415, 450), (385, 458), (350, 448), (310, 452),
                     (268, 460), (232, 450), (210, 432)])
UNDERSIDE_ROUND = 6


def raw():
    src = open(H + f'friend{NUM}.jsx').read()
    base = unary_union([evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_BASE')])
    # the file lists the bands LIGHTEST first; turn them darkest first
    bands = [evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_LAYERS')][::-1]
    return base, bands


def one_piece(body):
    """Fill the underside and join the feet. Returns the silhouette."""
    parts = sorted(polys(body), key=lambda p: -p.area)
    r = UNDERSIDE_ROUND
    near = unary_union([body, UNDERSIDE]).intersection(UNDERSIDE.buffer(4 * r))
    near = near.buffer(-r).buffer(2 * r).buffer(-r)
    fill = near.difference(body).intersection(UNDERSIDE.buffer(r))
    whole = unary_union([body, fill]).buffer(0.3).buffer(-0.3)
    ps = sorted(polys(whole), key=lambda p: -p.area)
    main, out = ps[0], []
    for p in sorted(ps[1:], key=lambda p: p.distance(ps[0])):
        if p.area < BIG or p.distance(main) > REACH:
            out.append(p)
            continue
        a, b = nearest_points(main, p)
        main = unary_union([main, p, LineString([a, b]).buffer(STRAND)])
        main = max(polys(main), key=lambda q: q.area)
    print('left out:', [(round(p.area), [round(v) for v in p.centroid.coords[0]]) for p in out])
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
    return dict(sil=sil, layers=layers, base=base, bands=bands)


def preview(sil, layers, name, k=2.0):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    im.save(name)


if __name__ == '__main__':
    r = clean_woigolp()
    preview(r['base'], r['bands'], 'woigolp_before.png')
    preview(r['sil'], r['layers'], 'woigolp_after.png')
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
