"""The chitu (friend 09): its outline rebuilt from Kimia's character sheet.

The trace had two faults she named (2026-11-16): round "craters" bitten out
of the underside, and tendrils that had come apart and did not flow. So:

  - the BODY is her trace with the thin, broken tendrils shaved off and the
    craters filled by the underbelly the character sheet shows there;
  - every TENDRIL is redrawn as one smooth tapering curve through points
    read off the character sheet (SHEET coordinates below are pixels of
    'friend-09.png', her crop of the sheet), and each ends in a BULB.

Nothing is removed: every loose piece of the trace lies along one of these
tendrils. The two eye bulbs sit exactly on the eye centres in friend09.jsx.
"""
import pickle, re, colorsys
from shapely.geometry import Polygon, Point
from shapely.ops import unary_union
from load import polys
from clean import largest, nohole, H
from PIL import Image, ImageDraw

OX, OY = 67.557, 991.255                 # FRIEND09_OFFSET: the trace's shifted space
EYES = [(502.4, 440.2), (703.5, 389.6)]  # FRIEND09_EYES, in viewBox space
P = dict(strip=5.5, smooth=3.0, speck=30, bulb=8.5, eye_bulb=10.5)


def sheet(x, y):
    """A pixel of the character-sheet crop -> the drawing's viewBox space."""
    return ((x - 63) * 1.3363, (y - 72) * 1.3205)


# Each tendril: (points root -> tip on the sheet, widths along it as (how far along 0..1, width),
# what sits on the tip, whether its stem shows in front of the body as it does on the sheet).
# The root starts a little inside the body so the join is never a pinch.
TENDRILS = dict(
    top_left=([(190, 196), (181, 172), (169, 149), (153, 135), (144, 117), (144, 101), (154.3, 88.7)], [(0, 8), (1, 5)], 'bulb', False),
    top_left_branch=([(169, 149), (186, 153), (206, 160)], [(0, 4.5), (1, 5)], None, False),
    top_right=([(408, 160), (422, 157), (435, 153), (443, 140), (445.4, 122.7)], [(0, 9), (1, 6)], 'bulb', False),
    right=([(484, 246), (500, 248), (520, 257), (536, 277), (543, 300), (547, 322), (554, 347), (570, 360), (589, 367)], [(0, 9), (0.3, 6), (1, 5)], 'eye', False),
    lower_right=([(462, 338), (480, 354), (500, 371), (521, 371), (534, 387), (543, 403), (554, 409), (565, 405), (573, 404)], [(0, 18), (0.45, 9), (1, 5.5)], 'bulb', False),
    ring=([(385, 386), (403, 393), (421, 401), (439, 405), (460, 417), (479, 433), (490, 453), (495, 473)], [(0, 3), (0.4, 6.5), (1, 5)], 'bulb', True),
    centre=([(350, 331), (358, 351), (351, 372), (336, 386), (326, 400), (320, 415), (311, 430), (294, 437), (275, 444),
             (253, 455), (227, 463), (200, 464), (173, 460), (150, 452), (133, 448), (117, 452), (104, 461), (98, 472), (98, 482)],
            [(0, 9), (0.12, 14), (0.2, 20), (0.3, 18), (0.38, 10), (0.6, 7), (1, 5)], 'bulb', True),
    left=([(205, 362), (190, 378), (172, 392), (147, 394), (121, 387), (104, 372), (93, 350), (83, 331), (70, 325)], [(0, 18), (0.35, 12), (1, 6)], 'bulb', False),
    drip=([(268, 380), (270, 396), (268, 411)], [(0, 6), (1, 4.5)], 'bulb', False),
    left_drip=([(163, 322), (165, 336), (165, 349)], [(0, 6), (1, 4.5)], 'bulb', False),
)
# swellings partway along a tendril, as on the sheet (sheet x, y, radius)
NODES = [(169, 149, 6.5), (275, 444, 8.5), (522, 372, 6)]
# the underbelly the sheet shows where the trace had craters: a soft closed
# curve through these points (viewBox space), gently lobed like the ruffles
BELLY = [(200, 340), (222, 398), (243, 407), (276, 415), (311, 407), (345, 419), (376, 426), (410, 421),
         (441, 433), (473, 427), (502, 444), (529, 426), (546, 395), (560, 355), (520, 280), (420, 260), (300, 300)]


def spline(pts, step=0.6):
    """A smooth curve through the points (centripetal-free Catmull-Rom), densely sampled."""
    p = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(p) - 2):
        (x0, y0), (x1, y1), (x2, y2), (x3, y3) = p[i - 1], p[i], p[i + 1], p[i + 2]
        n = max(2, int(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 / step))
        for k in range(n):
            t = k / n
            f = lambda a, b, c, d: 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t ** 3)
            out.append((f(x0, x1, x2, x3), f(y0, y1, y2, y3)))
    out.append(p[-2])
    return out


def width_at(profile, t):
    for (t0, w0), (t1, w1) in zip(profile, profile[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0); u = u * u * (3 - 2 * u)      # ease, so the width never changes abruptly
            return w0 + (w1 - w0) * u
    return profile[-1][1]


def tendril(pts, profile):
    """One flowing limb: a smooth curve whose width swells and tapers gently."""
    c = spline([sheet(*q) for q in pts])
    n = len(c) - 1
    return unary_union([Point(q).buffer(width_at(profile, i / n) / 2, 12) for i, q in enumerate(c)])


def limbs(p=P):
    """-> (every limb with its bulbs, the bulbs alone, the limbs whose stems show in front of the body)."""
    lines, bulbs, front = [], [], []
    for name, (pts, profile, tip, over) in TENDRILS.items():
        t = tendril(pts, profile); lines.append(t)
        if over: front.append(t)
        if tip == 'bulb':
            bulbs.append(Point(sheet(*pts[-1])).buffer(p['bulb'], 24))
    bulbs += [Point(e).buffer(p['eye_bulb'], 24) for e in EYES]          # the two eye bulbs, exactly on the eyes
    bulbs += [Point(sheet(x, y)).buffer(r, 24) for x, y, r in NODES]
    bulbs = unary_union(bulbs)
    # a soft neck where each bulb meets its stem, instead of a hard corner
    both = unary_union(lines + [bulbs])
    both = both.buffer(2).buffer(-4).buffer(2).union(both)
    return both, bulbs, unary_union(front)


def move(g):
    from shapely import affinity
    return affinity.translate(g, -OX, -OY)


def clean_chitu(p=P):
    raw = pickle.load(open('raw09.pkl', 'rb'))
    body = move(largest(raw['body']))
    core = largest(body.buffer(-p['strip']).buffer(p['strip']))          # the trace without its thin, broken tendrils
    belly = Polygon(spline(BELLY + BELLY[:1]))
    core = nohole(largest(unary_union([core, belly])))
    core = core.buffer(p['smooth']).buffer(-2 * p['smooth']).buffer(p['smooth'])   # round off nicks and whiskers
    core = nohole(largest(core))
    lim, bulbs, front = limbs(p)
    s = unary_union([core, lim])
    s = s.buffer(2).buffer(-2)                                           # soften the crotch where a limb leaves the body
    s = nohole(largest(s)).simplify(0.15)
    stems = lim.difference(core.buffer(-2)).union(front).buffer(-1.2).difference(bulbs)
    cores = bulbs.buffer(-2.0)
    painted = unary_union([stems, cores]).buffer(1)
    out = []
    for b in raw['bands']:
        b = move(b).intersection(core).difference(painted)                 # her bands paint the body; limbs are painted on top
        b = b.buffer(1.2).buffer(-2.4).buffer(1.2)
        keep = [q for q in polys(b) if q.area >= p['speck']]
        keep = [Polygon(q.exterior, [r for r in q.interiors if Polygon(r).area >= p['speck']]) for q in keep]
        out.append(unary_union(keep).simplify(0.2) if keep else Polygon())
    # shaved-off limbs the new ones do not cover would be a removal: report any
    lost = body.difference(s.buffer(4))
    return dict(sil=s, bands=out, stems=stems, bulbs=cores, lost=round(lost.area))


def order_of(num):
    src = open(H + f'friend{num}.jsx').read()
    i = src.index('const GREY_ORDER')
    return re.findall(r"'(#[0-9a-fA-F]+)'", src[i:src.index(']', i)])


def toned(r):
    """Her seven bands, with the limbs' stems in a middle tone and the bulbs in the lightest."""
    order = order_of('09'); bands = list(r['bands'])
    k = order.index('#8c8c8c'); bands[k] = unary_union([bands[k], r['stems']])
    k = order.index('#d0d0d0'); bands[k] = unary_union([bands[k], r['bulbs']])
    return bands, order


def shades(r):
    return [(r['sil'].buffer(-d).buffer(-4).buffer(4), g) for d, g in ((14, '#494949'), (30, '#606060'))]


def tint(g, hue=40, sat=0.6, lift=0.4):
    l = int(g[1:3], 16) / 255; l = l + (1 - l) * lift
    rr, gg, b = colorsys.hls_to_rgb(hue / 360, l, sat); return (round(rr * 255), round(gg * 255), round(b * 255))


def preview(r, fn, S=2.0, pad=12):
    W, Hh = 714.93, 550.65
    img = Image.new('RGB', (int((W + 2 * pad) * S), int((Hh + 2 * pad) * S)), (8, 9, 16)); dr = ImageDraw.Draw(img)
    xy = lambda ring: [((x + pad) * S, (y + pad) * S) for x, y in ring.coords]
    def fill(g, col):
        for q in polys(g): dr.polygon(xy(q.exterior), fill=col)
    fill(r['sil'], tint('#333333'))
    for g, c in shades(r): fill(g, tint(c))
    bands, order = toned(r)
    for b, g in zip(bands, order): fill(b, tint(g))
    img.save(fn)


if __name__ == '__main__':
    r = clean_chitu(); print('bounds', [round(v, 1) for v in r['sil'].bounds], 'trace area left uncovered:', r['lost'])
    preview(r, 'chitu_fixed.png')
