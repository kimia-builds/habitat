import os, json, sys
from paint import *
AI=os.path.join(os.path.dirname(os.path.abspath(__file__)),'paintings','')
# every painting is paintings/flora-<key>-painted.png
def bbox(m):
    ys,xs=np.where(m); return xs.min(),xs.max(),ys.min(),ys.max()
def ai_paint(key, sil, smooth=1.2, minfrac=0.016):
    fn=f'flora-{key}-painted.png'
    L=np.asarray(Image.open(AI+fn).convert('L')).astype(float)/255
    PM=ndi.binary_opening(ndi.gaussian_filter(L,2)>0.10,iterations=3)
    lab,n=ndi.label(PM); PM=lab==(1+np.argmax(ndi.sum(PM,lab,range(1,n+1))))
    px0,px1,py0,py1=bbox(PM)
    pts=[p for r in rings(sil['d']) for p in r]
    x0=min(p[0] for p in pts); x1=max(p[0] for p in pts); y0=min(p[1] for p in pts); y1=max(p[1] for p in pts)
    scale=RES/(y1-y0); m=8
    shape=(int((y1-y0)*scale)+2*m, int((x1-x0)*scale)+2*m); pad=(x0-m/scale,y0-m/scale)
    M,geom=mask_of(sil['d'],pad,scale,shape)
    yy,xx=np.mgrid[0:shape[0],0:shape[1]].astype(float)
    u=(xx/scale+pad[0]-x0)/(x1-x0); v=(yy/scale+pad[1]-y0)/(y1-y0)      # 0..1 across the silhouette's box
    sx=px0+u*(px1-px0); sy=py0+v*(py1-py0)                               # same place in the painting's box
    V=ndi.map_coordinates(L,[sy,sx],order=1,mode='nearest')
    P=ndi.map_coordinates(PM.astype(float),[sy,sx],order=1,mode='nearest')>0.5
    iou=(P&M).sum()/((P|M).sum())
    # where her outline reaches past the painting, carry the nearest painted tone across
    Pin=ndi.binary_erosion(P,iterations=3)
    idx=ndi.distance_transform_edt(~Pin,return_distances=False,return_indices=True)
    V=np.where(Pin,V,V[idx[0],idx[1]])
    V=ndi.gaussian_filter(V,smooth)
    vals=V[M]; layers=[]
    for share in SHARE:
        th=np.quantile(vals,1-share)
        B=(V>th)&M
        f=np.pad(B.astype(float),1); ps=[]
        for c in measure.find_contours(f,0.5):
            if len(c)<6: continue
            p=Polygon([((x-1)/scale+pad[0],(y-1)/scale+pad[1]) for y,x in c]).buffer(0)
            if p.area>0: ps.append(p)
        ps.sort(key=lambda p:-p.area); acc=None
        for p in ps: acc=p if acc is None else acc.symmetric_difference(p)
        minA=(minfrac*(y1-y0))**2*3.14
        keep=[Polygon(q.exterior,[r for r in q.interiors if Polygon(r).area>=minA]) for q in polys(acc) if q.area>=minA] if acc is not None else []
        layers.append(unary_union(keep).simplify(0.0015*(y1-y0)) if keep else Polygon())
    return dict(layers=layers,geom=geom,iou=iou)
if __name__=='__main__':
    sils=silhouettes()
    for key,hue in (('6',150),('1',205)):
        r=ai_paint(key,sils[key])
        preview(key,sils[key],r,hue,f'ai{key}.png',S=5.0)
        print(key,'overlap',round(r['iou'],3),[len(polys(g)) for g in r['layers']],sum(len(path(g)) for g in r['layers']))
