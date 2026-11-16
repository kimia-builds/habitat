"""THE LIWI BI-JIJI, cleaned (2026-11-16). Second-grainiest trace after the
hamdi bulo (src/ui/friend05.jsx): about 1,050 flecks. Like the hamdi bulo its
seven tone bands lie side by side, so they are STACKED before cleaning
(see hamdi.py for why). Three repairs:

  1. SPECKS: flecks and pinholes smaller than SPECK go from every layer.
  2. THE CAVITY: the trace has a tall dark bay in the middle of the mound,
     with the three eyes floating in it. Everything open inside CAVITY is
     filled, so the eyes sit on the body (the krupengk's and zala's repair).
     The fill is left in the DARKEST shade, the outline's own, as Kimia
     asked for the hamdi bulo's filled crevices.
  3. ONE SILHOUETTE: a long tendril had come away from the body, and
     others had shed small dashes. A loose piece is joined to the nearest
     point by a strand as thin as the tendrils themselves: a real piece
     (BIG or larger) if it is within REACH, a small dash only if it is
     within NEAR, i.e. a plain break in a tendril. Joining far dashes made
     twig-like forks, so those are left out (the script prints which).

    python liwi.py          # writes liwi_before.png and liwi_after.png
"""
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union, nearest_points
from load import strings, evenodd, polys
from clean import H
from hamdi import despeckle, _paint, GREYS, count

NUM = '05'
VB = (624.71, 326.01)
# The dials, in the drawing's own units (the whole drawing is about 625 x 326).
SPECK = 40
SMOOTH = 0.9
SEAL = 0.5
DUST = 4          # a loose crumb smaller than this is trace dust
BIG = 150         # a loose piece at least this large is a real tendril
REACH = 24        # ...and is joined if it is within this distance
NEAR = 7          # a smaller dash is joined only within this distance
STRAND = 1.3      # half the width of a joining strand
# The bay in the middle of the mound, as a rough arch around it.
CAVITY = Polygon([(262, 62), (292, 40), (322, 48), (350, 90), (368, 135),
                  (366, 186), (345, 200), (318, 192), (292, 203), (270, 194),
                  (256, 184), (255, 130)])
CAVITY_ROUND = 6


def raw():
    src = open(H + f'friend{NUM}.jsx').read()
    base = unary_union([evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_BASE')])
    # the file lists the bands LIGHTEST first; turn them darkest first
    bands = [evenodd(d)[0].buffer(0) for d in strings(src, f'FRIEND{NUM}_LAYERS')][::-1]
    return base, bands


def one_piece(body):
    """Fill the cavity and join the loose pieces. Returns (silhouette, cavity fill)."""
    parts = sorted([p for p in polys(body) if p.area >= DUST], key=lambda p: -p.area)
    main = parts[0]
    # the cavity: everything open inside the arch, its corners rounded
    r = CAVITY_ROUND
    near = unary_union([main, CAVITY]).intersection(CAVITY.buffer(4 * r))
    near = near.buffer(-r).buffer(2 * r).buffer(-r)
    cavity = near.difference(main).intersection(CAVITY.buffer(r))
    main = unary_union([main, cavity]).buffer(0.3).buffer(-0.3)
    main = max(polys(main), key=lambda p: p.area)
    # the loose pieces, nearest first, each joined by a thin strand
    loose = [p for p in parts[1:] if not main.contains(p.centroid)]
    out = []
    while loose:
        loose.sort(key=lambda p: p.distance(main))
        p = loose.pop(0)
        if p.distance(main) > (REACH if p.area >= BIG else NEAR):
            out.append(p)
            continue
        a, b = nearest_points(main, p)
        main = unary_union([main, p, LineString([a, b]).buffer(STRAND)])
        main = max(polys(main), key=lambda q: q.area)
        loose += out      # a piece left out earlier may be in reach now
        out = []
    print('too far to join, so left out:',
          [(round(p.area), [round(v) for v in p.centroid.coords[0]]) for p in out])
    sil = Polygon(main.exterior)
    sil = sil.buffer(-SMOOTH / 2).buffer(SMOOTH).buffer(-SMOOTH / 2)
    sil = Polygon(max(polys(sil), key=lambda p: p.area).exterior).simplify(0.12)
    return sil, cavity


def clean_liwi(speck=SPECK, smooth=SMOOTH):
    base, bands = raw()
    body = unary_union([base] + bands).buffer(SEAL).buffer(-SEAL)
    sil, cavity = one_piece(body)
    layers = []
    for k in range(len(bands)):
        stacked = unary_union(bands[k:]).buffer(SEAL).buffer(-SEAL)   # tone k or lighter
        layers.append(despeckle(stacked.intersection(sil), speck, smooth))
    return dict(sil=sil, layers=layers, shades=[], base=base, bands=bands)


def preview(sil, layers, name, k=2.2, shade=()):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(shade, ('#494949', '#606060')):
        _paint(im, g, c, k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    im.save(name)


if __name__ == '__main__':
    r = clean_liwi()
    preview(r['base'], r['bands'], 'liwi_before.png')
    preview(r['sil'], r['layers'], 'liwi_after.png', shade=r['shades'])
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
