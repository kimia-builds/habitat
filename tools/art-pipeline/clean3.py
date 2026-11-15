import clean2, math, os
from clean2 import *
from shapely.geometry import Polygon
def wobbly(pts, amp, wave, r):
    # walk the outline, pushing points in and out on a slow wave, then round
    poly=Polygon(pts); L=poly.exterior.length; n=int(L/3); out=[]
    for i in range(n):
        d=i/n*L; p=poly.exterior.interpolate(d); q=poly.exterior.interpolate((d+0.5)%L)
        nx,ny=-(q.y-p.y),(q.x-p.x); m=math.hypot(nx,ny) or 1
        a=amp*(math.sin(d/wave)+0.6*math.sin(d/wave*2.3+1.7))
        out.append((p.x+nx/m*a,p.y+ny/m*a))
    return Polygon(out).buffer(-r).buffer(2*r).buffer(-r)
clean2.PATCH['04']=wobbly([(215,146),(70,318),(334,318)], 3.2, 17, 12)
def shade(r, steps):
    return [(r['sil'].buffer(-d).buffer(-3).buffer(3), g) for d,g in steps]
if __name__=='__main__':
    for num,hue,steps in (('03',350,[(9,'#494949'),(20,'#606060')]),('04',256,[(9,'#494949'),(20,'#606060')])):
        r=clean2.clean(num)
        extra=''.join(f'<path d="{path(g)}" fill="{tint(c,hue)}"/>' for g,c in shade(r,steps))
        open(f'preview{num}.svg','w').write(svg_of(num,r,hue,extra))
