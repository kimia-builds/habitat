import re, sys, json
from svgpathtools import parse_path, Line
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
from shapely.validation import make_valid

def strings(src, name):
    i = src.index('export const ' + name)
    j = src.index('\n\n', i)
    return re.findall(r"'([mM][^']+)'", src[i:j])

def rings(d):
    out = []
    for sub in parse_path(d).continuous_subpaths():
        pts = []
        for seg in sub:
            if isinstance(seg, Line):
                pts.append(seg.start)
            else:
                n = 6
                pts += [seg.point(t / n) for t in range(n)]
        if len(pts) >= 3:
            out.append([(p.real, p.imag) for p in pts])
    return out

def polys(geom):
    if geom.is_empty: return []
    if geom.geom_type == 'Polygon': return [geom]
    if geom.geom_type in ('MultiPolygon', 'GeometryCollection'):
        return [p for g in geom.geoms for p in polys(g)]
    return []

def evenodd(d):
    ps = []
    for r in rings(d):
        p = Polygon(r)
        if not p.is_valid: p = p.buffer(0)
        if p.area > 0: ps.append(p)
    ps.sort(key=lambda p: -p.area)
    # even-odd: big shapes first, XOR in the rest
    acc = None
    big = [p for p in ps if p.area > 2.0]
    small = [p for p in ps if p.area <= 2.0]
    for p in big:
        acc = p if acc is None else acc.symmetric_difference(p)
    return acc if acc is not None else Polygon(), len(ps), len(small)

def load(path, num):
    src = open(path).read()
    base = strings(src, f'FRIEND{num}_BASE')
    layers = strings(src, f'FRIEND{num}_LAYERS')
    return base, layers
