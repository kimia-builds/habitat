from load import *
import os, json, sys
from shapely.geometry import box
H=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','src','ui','')
VB={'03':(264.44,277.81),'04':(390.96,366.19)}
# per-friend dials
P={'03':dict(close=16, open=20, seal=1.2, speck=14, smooth=0.7),
   '04':dict(close=22, open=24, seal=1.5, speck=18, smooth=0.9)}

def largest(g): return max(polys(g), key=lambda p:p.area)
def nohole(p): return Polygon(p.exterior)
def path(g, nd=1):
    out=[]
    for p in polys(g):
        for ring in [p.exterior]+list(p.interiors):
            c=list(ring.coords)[:-1]
            if len(c)<3: continue
            out.append('M'+'L'.join(f'{round(x,nd)} {round(y,nd)}' for x,y in c)+'Z')
    return ''.join(out)

def clean(num):
    p=P[num]
    base, layers = load(H+f'friend{num}.jsx', num)
    bands=[evenodd(d)[0] for d in layers]
    bands=[b if b.is_valid else b.buffer(0) for b in bands]
    body=unary_union([evenodd(base[0])[0].buffer(0)]+bands)
    # the BULK: close the bays, then open away the spikes -> a soft solid core
    closed=body.buffer(p['close']).buffer(-p['close'])
    closed=unary_union([nohole(q) for q in polys(closed)])
    core=closed.buffer(-p['open']).buffer(p['open'])
    core=nohole(largest(core))
    sil=unary_union([body.buffer(p['seal']).buffer(-p['seal']), core])
    sil=nohole(largest(sil))           # one piece, no holes, no loose crumbs
    sil=sil.buffer(-p['smooth']).buffer(2*p['smooth']).buffer(-p['smooth'])
    sil=nohole(largest(sil)).simplify(0.15)
    out=[]
    for b in bands:
        b=b.intersection(sil)
        b=b.buffer(p['smooth']).buffer(-2*p['smooth']).buffer(p['smooth'])  # close pinholes, shave whiskers
        keep=[q for q in polys(b) if q.area>=p['speck']]
        # holes smaller than a speck are grain too
        keep=[Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>=p['speck']]) for q in keep]
        out.append(unary_union(keep).simplify(0.15) if keep else Polygon())
    return dict(sil=sil, bands=out, core=core, body=body)
