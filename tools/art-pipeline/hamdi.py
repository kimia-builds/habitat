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

ONE SILHOUETTE (Kimia, 2026-11-16: "remove the gaps. i don't want loose
pieces. i want one coherent silhouette"). The trace had about forty pieces
floating loose, most of them the little legs under the body. They are
joined on:

  3. The gaps AROUND THE LOOSE PIECES are filled: wherever a loose piece
     sits within 2 x CLOSE of the body (or of another piece), the space
     between them becomes body. Gaps elsewhere are left alone, so the open
     loops of the tendrils stay open.
  4. The broken LEGS at the bottom right are closed along their length
     (LEGS, LEG_CLOSE), so they are solid like the three on the left that
     she called correct. Thin necks were tried for the far flecks and she
     had them removed: the flecks off the right-hand side (RIGHT_FLECKS)
     and the few crumbs still loose after joining are left out.
  5. The filled gaps take the body's own darkest tone, not the outline's.

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
SPECK = 160
SMOOTH = 1.6
DUST = 4                     # a loose crumb smaller than this is trace dust
CLOSE = 10                   # gaps up to twice this, beside a loose piece, are filled
BIGHOLE = 3000               # a hole larger than this would be a filled-in loop
# Areas of the drawing, in its own units (x0, y0, x1, y1).
from shapely.geometry import box as _box
RIGHT_FLECKS = _box(600, 150, 690, 420)   # loose flecks here are left out
LEGS = _box(205, 560, 690, 832)           # the broken legs, bottom right
LEG_CLOSE = (22, 8)                       # fill gaps this far (up, across)
# Two crevices that rose too high between the bottom legs (Kimia, 2026-11-16).
# Everything open inside each box is filled, down to the box's bottom edge
# (about where the gaps between the other legs end), its corners rounded by
# CREVICE_ROUND. It is left in the DARKEST shade: the outline's own, with no
# body tone painted over it.
CREVICES = [_box(305, 585, 378, 706), _box(448, 625, 522, 706)]
CREVICE_ROUND = 7
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


def tall_close(g, up, across):
    """Fill gaps up to 2 x `up` tall but only 2 x `across` wide: joins a broken
    leg along its length without webbing it to the leg beside it."""
    f = up / across
    g = affinity.scale(g, xfact=f, yfact=1, origin=(0, 0))
    g = g.buffer(up).buffer(-up)
    return affinity.scale(g, xfact=1 / f, yfact=1, origin=(0, 0))


def one_piece(body):
    """Join the loose pieces to the body. Returns (silhouette, filled gaps)."""
    from shapely.geometry import box
    parts = sorted([p for p in polys(body) if p.area >= DUST], key=lambda p: -p.area)
    # the flecks off the right-hand side go (Kimia, 2026-11-16), so that side
    # keeps its own rounded inward curves
    parts = [parts[0]] + [p for p in parts[1:] if not RIGHT_FLECKS.contains(p.centroid)]
    body = unary_union(parts)
    loose = unary_union(parts[1:]).buffer(0.5)
    gaps = body.buffer(CLOSE).buffer(-CLOSE).difference(body)
    fill = [g for g in polys(gaps) if g.intersects(loose)]
    # the broken legs at the bottom right are closed along their length,
    # so they read as solid legs like the three on the left
    legs = tall_close(body.intersection(LEGS.buffer(30)), *LEG_CLOSE).intersection(LEGS)
    sil = unary_union([body, legs] + fill).buffer(0.3).buffer(-0.3)
    ps = sorted(polys(sil), key=lambda p: -p.area)
    main = ps[0]
    print('still loose, so left out:', [(round(p.area), [round(v) for v in p.centroid.coords[0]]) for p in ps[1:]])
    # a hole closed in among the legs is simply filled; one anywhere else
    # would be a tendril loop filled in by mistake
    big = [r for r in main.interiors if Polygon(r).area >= BIGHOLE and not LEGS.contains(Polygon(r))]
    print('holes filled among the legs:', [round(Polygon(r).area) for r in main.interiors if Polygon(r).area >= 200])
    assert not big, 'joining the pieces closed a loop: lower CLOSE'
    sil = Polygon(main.exterior)
    deep = []
    for b in CREVICES:
        near = unary_union([sil, b]).intersection(b.buffer(4 * CREVICE_ROUND))
        near = near.buffer(-CREVICE_ROUND).buffer(2 * CREVICE_ROUND).buffer(-CREVICE_ROUND)
        deep.append(near.difference(sil).intersection(b.buffer(CREVICE_ROUND)))
    deep = unary_union(deep)
    sil = unary_union([sil, deep]).buffer(0.3).buffer(-0.3)
    sil = Polygon(max(polys(sil), key=lambda p: p.area).exterior)
    sil = sil.buffer(-SMOOTH / 2).buffer(SMOOTH).buffer(-SMOOTH / 2)
    sil = Polygon(max(polys(sil), key=lambda p: p.area).exterior).simplify(0.15)
    return sil, sil.difference(body.buffer(0.3)).difference(deep.buffer(3))


def shades(filled, sil):
    """One soft band over the filled gaps: the body's own darkest tone, tucked
    a little way under the traced layers so no dark seam shows around it."""
    g = filled.buffer(2.5).intersection(sil.buffer(-1.5))
    return [unary_union([q for q in polys(g) if q.area >= 30]).simplify(0.15)]


def clean_hamdi(speck=SPECK, smooth=SMOOTH):
    base, bands = raw()
    body = unary_union([base] + bands).buffer(SEAL).buffer(-SEAL)
    sil, filled = one_piece(body)
    layers = []
    for k in range(len(bands)):
        stacked = unary_union(bands[k:]).buffer(SEAL).buffer(-SEAL)   # tone k or lighter
        layers.append(despeckle(stacked.intersection(sil), speck, smooth))
    return dict(sil=sil, layers=layers, shades=shades(filled, sil), base=base, bands=bands)


def _paint(im, g, col, k):
    from PIL import Image, ImageDraw
    for p in polys(g):
        m = Image.new('L', im.size, 0)
        d = ImageDraw.Draw(m)
        d.polygon([(x * k, y * k) for x, y in p.exterior.coords], fill=255)
        for r in p.interiors:
            d.polygon([(x * k, y * k) for x, y in r.coords], fill=0)
        im.paste(col, (0, 0), m)


def preview(sil, layers, name, k=1.6, shade=()):
    from PIL import Image
    im = Image.new('RGB', (int(VB[0] * k), int(VB[1] * k)), '#080910')
    _paint(im, sil, '#333333', k)
    for g, c in zip(shade, ('#494949', '#606060')):
        _paint(im, g, c, k)
    for g, c in zip(layers, GREYS):
        _paint(im, g, c, k)
    im.save(name)


def count(layers):
    return sum(len(polys(g)) + sum(len(p.interiors) for p in polys(g)) for g in layers)


if __name__ == '__main__':
    r = clean_hamdi()
    preview(r['base'], r['bands'], 'hamdi_before.png')
    preview(r['sil'], r['layers'], 'hamdi_after.png', shade=r['shades'])
    print('pieces and holes: before', count(r['bands']), 'after', count(r['layers']))
    print('outline parts: before', len(polys(r['base'])), 'after', len(polys(r['sil'])))
