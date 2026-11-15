import re, os, sys, json, colorsys, zlib
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage import measure
from shapely.geometry import Polygon
from shapely.ops import unary_union
from load import rings, polys
from clean import path
from clean import H
RES=640   # px of working height
GREYS=['#494949','#606060','#767676','#8c8c8c','#a3a3a3','#b9b9b9','#d0d0d0']
# the share of the body at least this light — the same on every species
SHARE=[0.82,0.56,0.34,0.17,0.075,0.028,0.008]

def silhouettes():
    out={}
    for f in ('floraSilhouettes.js','newFloraSilhouettes.js'):
        s=open(H+f).read()
        for m in re.finditer(r"key: '([^']+)'.*?viewBox: \{ w: ([\d.]+), h: ([\d.]+) \}.*?d: '([^']+)'", s, re.S):
            out[m.group(1)]=dict(w=float(m.group(2)),h=float(m.group(3)),d=m.group(4))
    return out

def mask_of(d, pad, scale, shape):
    img=Image.new('L',(shape[1],shape[0]),0); dr=ImageDraw.Draw(img)
    rs=[Polygon(r).buffer(0) for r in rings(d)]
    rs=[p for p in rs if p.area>0]; rs.sort(key=lambda p:-p.area)
    acc=None
    for p in rs: acc=p if acc is None else acc.symmetric_difference(p)
    for p in polys(acc):
        dr.polygon([((x-pad[0])*scale,(y-pad[1])*scale) for x,y in p.exterior.coords],fill=255)
        for r in p.interiors: dr.polygon([((x-pad[0])*scale,(y-pad[1])*scale) for x,y in r.coords],fill=0)
    return np.array(img)>127, acc

def noise(shape, sigma, rng, stretch=(1,1)):
    n=ndi.gaussian_filter(rng.standard_normal(shape),(sigma*stretch[0],sigma*stretch[1]))
    return (n-n.mean())/(n.std()+1e-9)

def paint(key, sil, seed=None, rough=1.0, veins=0.0):
    geom_bounds=None
    rs=[pt for r in rings(sil['d']) for pt in r]
    xs=[p[0] for p in rs]; ys=[p[1] for p in rs]
    x0,y0,x1,y1=min(xs),min(ys),max(xs),max(ys)
    scale=RES/(y1-y0); m=8
    shape=(int((y1-y0)*scale)+2*m, int((x1-x0)*scale)+2*m)
    pad=(x0-m/scale, y0-m/scale)
    M,geom=mask_of(sil['d'],pad,scale,shape)
    rng=np.random.default_rng(seed if seed is not None else zlib.crc32(key.encode()))
    D=ndi.distance_transform_edt(M)
    thick=np.clip(D/(0.11*RES),0,1)                 # lighter where the body is thick
    thick=ndi.gaussian_filter(thick,2)
    # the DISTURBANCE: lumps, blotches and streaks at three sizes
    lumps=noise(shape,0.085*RES,rng)
    blotch=noise(shape,0.032*RES,rng)
    streak=noise(shape,0.012*RES,rng,stretch=(2.6,0.8))
    # warp: let the blotches drag the thickness field sideways so bands stop following the edge
    wy=noise(shape,0.05*RES,rng)*0.03*RES*rough; wx=noise(shape,0.05*RES,rng)*0.03*RES*rough
    yy,xx=np.mgrid[0:shape[0],0:shape[1]]
    thickW=ndi.map_coordinates(thick,[yy+wy,xx+wx],order=1,mode='nearest')
    V=thickW*(0.62+0.30*rough*lumps)+rough*(0.16*blotch+0.07*streak)
    if veins:
        # VEINS: thin wandering ridges, like the folds in the friends' skin
        a=noise(shape,0.03*RES,rng); b=noise(shape,0.017*RES,rng)
        ridge=np.clip(1-np.abs(a)*2.2,0,1)**2*0.7+np.clip(1-np.abs(b)*2.4,0,1)**2*0.5
        V=V+veins*0.22*(ridge-ridge.mean())*np.clip(D/(0.03*RES),0,1)
    V=ndi.gaussian_filter(V,1.3)
    # the very edge always stays dark
    V=V-0.5*np.clip(1-D/(0.012*RES),0,1)
    vals=V[M]
    layers=[]
    for share in SHARE:
        th=np.quantile(vals,1-share)
        B=(V>th)&M
        B=ndi.binary_opening(B,iterations=2)
        f=np.pad(B.astype(float),1)
        ps=[]
        for c in measure.find_contours(f,0.5):
            if len(c)<8: continue
            p=Polygon([((x-1)/scale+pad[0],(y-1)/scale+pad[1]) for y,x in c]).buffer(0)
            if p.area>0: ps.append(p)
        ps.sort(key=lambda p:-p.area); acc=None
        for p in ps: acc=p if acc is None else acc.symmetric_difference(p)
        if acc is None: layers.append(Polygon()); continue
        minA=(0.022*(y1-y0))**2*3.14
        keep=[Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>=minA]) for q in polys(acc) if q.area>=minA]
        g=unary_union(keep).simplify(0.0018*(y1-y0)) if keep else Polygon()
        layers.append(g)
    return dict(layers=layers, geom=geom, V=V, M=M)

def tint(g,hue,sat=0.55,lift=0.4):
    l=int(g[1:3],16)/255; l=l+(1-l)*lift
    r,gg,b=colorsys.hls_to_rgb(hue/360,l,sat); return (round(r*255),round(gg*255),round(b*255))

def preview(key, sil, res, hue, fn, S=3.0):
    w,h=sil['w'],sil['h']
    img=Image.new('RGB',(int(w*S)+40,int(h*S)+40),(8,9,16)); dr=ImageDraw.Draw(img)
    def P(c): return [(x*S+20,y*S+20) for x,y in c]
    def fill(g,col,bg):
        for p in polys(g):
            dr.polygon(P(p.exterior.coords),fill=col)
            for r in p.interiors: dr.polygon(P(r.coords),fill=bg)
    fill(res['geom'],tint('#333333',hue),(8,9,16))
    prev=tint('#333333',hue)
    for g,grey in zip(res['layers'],GREYS):
        fill(g,tint(grey,hue),prev); prev=tint(grey,hue)
    img.save(fn)

if __name__=='__main__':
    sils=silhouettes(); print(len(sils), list(sils)[:6])
    rough=float(os.environ.get('ROUGH',1.0))
    veins=float(os.environ.get('VEINS',0.0))
    for key,hue in (('6',150),('1',205)):
        r=paint(key,sils[key],rough=rough,veins=veins)
        preview(key,sils[key],r,hue,f'p{key}.png')
        print(key,[len(polys(g)) for g in r['layers']], sum(len(path(g)) for g in r['layers']))
