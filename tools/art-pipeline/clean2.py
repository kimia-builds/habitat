from clean import path, polys, largest, nohole, VB, H
import pickle, os, sys, re, colorsys
from shapely.geometry import Point, Polygon
from shapely import affinity
from shapely.ops import unary_union
PATCH={
 '03': affinity.scale(Point(135,193).buffer(1,64), 97, 64),
 '04': Polygon([(215,150),(72,322),(332,322)]).buffer(10, 32),
}
P={'03':dict(seal=4, speck=14, smooth=0.8), '04':dict(seal=5, speck=18, smooth=1.0)}
def clean(num, **kw):
    p=dict(P[num]); p.update(kw)
    raw=pickle.load(open(f'raw{num}.pkl','rb'))
    body=raw['body']
    s=unary_union([body, PATCH[num]])
    s=s.buffer(p['seal']).buffer(-p['seal'])
    s=nohole(largest(s))
    s=s.buffer(-p['smooth']).buffer(2*p['smooth']).buffer(-p['smooth'])
    s=nohole(largest(s)).simplify(0.12)
    out=[]
    for b in raw['bands']:
        b=b.intersection(s)
        b=b.buffer(p['smooth']).buffer(-2*p['smooth']).buffer(p['smooth'])
        keep=[q for q in polys(b) if q.area>=p['speck']]
        keep=[Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>=p['speck']]) for q in keep]
        out.append(unary_union(keep).simplify(0.12) if keep else Polygon())
    return dict(sil=s, bands=out, body=body)
def order_of(num):
    src=open(H+f'friend{num}.jsx').read()
    i=src.index('const GREY_ORDER'); return re.findall(r"'(#[0-9a-fA-F]+)'", src[i:src.index(']',i)])
def tint(g, hue, lift=0.4, sat=0.6):
    l=int(g[1:3],16)/255; l=l+(1-l)*lift
    rr,gg,bb=colorsys.hls_to_rgb(hue/360,l,sat)
    return '#%02x%02x%02x'%(round(rr*255),round(gg*255),round(bb*255))
def svg_of(num, r, hue, extra=''):
    w,h=VB[num]; o=order_of(num)
    s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="#080910"/>'
    s+=f'<path d="{path(r["sil"])}" fill="{tint("#333333",hue)}"/>'+extra
    for b,g in zip(r['bands'],o): s+=f'<path fill-rule="evenodd" d="{path(b)}" fill="{tint(g,hue)}"/>'
    return s+'</svg>'
if __name__=='__main__':
    for num,hue in (('03',350),('04',256)):
        r=clean(num)
        open(f'preview{num}.svg','w').write(svg_of(num,r,hue))
        print(num, round(r['sil'].area), [len(polys(b)) for b in r['bands']])
