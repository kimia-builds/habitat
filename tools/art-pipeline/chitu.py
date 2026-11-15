import pickle, os, re, math, colorsys
from shapely.geometry import Polygon, LineString, Point
from shapely.ops import unary_union, nearest_points
from shapely import affinity
from load import polys
from clean import path, largest, nohole, H
from PIL import Image, ImageDraw
OX,OY=67.557,991.255
P=dict(seal=1.5, speck=30, smooth=1.2, width=5.0, bend=0.18)

def bridge(a, b, width, bend, flip):
    """A soft curved tendril from the nearest point of a to the nearest point of b."""
    pa,pb=nearest_points(a,b)
    dx,dy=pb.x-pa.x,pb.y-pa.y; L=math.hypot(dx,dy) or 1
    # push both ends a little INTO the shapes so the join is not a pinch
    ax,ay=pa.x-dx/L*width, pa.y-dy/L*width; bx,by=pb.x+dx/L*width, pb.y+dy/L*width
    mx,my=(ax+bx)/2+(-dy/L)*L*bend*flip,(ay+by)/2+(dx/L)*L*bend*flip
    pts=[((1-t)**2*ax+2*(1-t)*t*mx+t*t*bx,(1-t)**2*ay+2*(1-t)*t*my+t*t*by) for t in [i/24 for i in range(25)]]
    return LineString(pts).buffer(width/2), L

def reattach(raw, p=P):
    body=raw['body']
    ps=sorted(polys(body),key=lambda q:-q.area)
    whole=ps[0]; loose=ps[1:]; bridges=[]; log=[]
    # always join the loose piece that is nearest to what is already whole
    while loose:
        i=min(range(len(loose)),key=lambda k:loose[k].distance(whole))
        piece=loose.pop(i)
        c=piece.centroid; w=whole.centroid
        flip=1 if (c.x-w.x)*(c.y-w.y)>0 else -1      # bend the same way round the body: a whirl
        br,L=bridge(piece,whole,p['width'],p['bend'],flip)
        bridges.append(br); log.append((round(piece.area),round(L)))
        whole=unary_union([whole,piece,br])
    return whole, unary_union(bridges), log

def clean_chitu(p=P):
    raw=pickle.load(open('raw09.pkl','rb'))
    whole,bridges,log=reattach(raw,p)
    s=whole.buffer(p['seal']).buffer(-p['seal'])
    s=nohole(largest(s))
    # smooth the fat body only; thin tendrils would be shaved off by it, so
    # everything that was joined goes back on afterwards, untouched
    s=s.buffer(-p['smooth']).buffer(2*p['smooth']).buffer(-p['smooth'])
    s=nohole(largest(unary_union([s,whole,bridges]))).simplify(0.2)
    out=[]
    for b in raw['bands']:
        b=b.intersection(s)
        b=b.buffer(p['smooth']).buffer(-2*p['smooth']).buffer(p['smooth'])
        keep=[q for q in polys(b) if q.area>=p['speck']]
        keep=[Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>=p['speck']]) for q in keep]
        out.append(unary_union(keep).simplify(0.2) if keep else Polygon())
    return dict(sil=s,bands=out,bridges=bridges,log=log)

def order_of(num):
    src=open(H+f'friend{num}.jsx').read()
    i=src.index('const GREY_ORDER'); return re.findall(r"'(#[0-9a-fA-F]+)'", src[i:src.index(']',i)])
def tint(g,hue=40,sat=0.6,lift=0.4):
    l=int(g[1:3],16)/255; l=l+(1-l)*lift
    r,gg,b=colorsys.hls_to_rgb(hue/360,l,sat); return (round(r*255),round(gg*255),round(b*255))
def shades(r):
    return [(r['sil'].buffer(-d).buffer(-4).buffer(4),g) for d,g in ((14,'#494949'),(30,'#606060'))]
def preview(r, fn, S=2.0):
    W,Hh=714.93,550.65
    img=Image.new('RGB',(int(W*S),int(Hh*S)),(8,9,16)); dr=ImageDraw.Draw(img)
    def fill(g,col,bg=None):
        for q in polys(g):
            dr.polygon([((x-OX)*S,(y-OY)*S) for x,y in q.exterior.coords],fill=col)
            if bg:
                for ring in q.interiors: dr.polygon([((x-OX)*S,(y-OY)*S) for x,y in ring.coords],fill=bg)
    fill(r['sil'],tint('#333333'))
    for g,c in shades(r): fill(g,tint(c))
    fill(r['bridges'].buffer(-1.2),tint('#8c8c8c'))
    o=order_of('09')
    # bands do not overlap, so paint order is free; holes show what is beneath, so skip them
    for b,g in zip(r['bands'],o):
        for q in polys(b):
            dr.polygon([((x-OX)*S,(y-OY)*S) for x,y in q.exterior.coords],fill=tint(g))
    img.save(fn)
if __name__=='__main__':
    r=clean_chitu(); print(r['log']); preview(r,'chitu_fixed.png')
