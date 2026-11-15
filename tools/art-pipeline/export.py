import clean2, clean3, json, os
from clean2 import *
from clean3 import shade
from shapely.ops import unary_union
out={}
for num,key in (('03','krupengk'),('04','zala')):
    r=clean2.clean(num)
    out[key]=dict(silhouette=path(r['sil']), shades=[path(g) for g,_ in shade(r,[(9,0),(20,0)])], layers=[path(b) for b in r['bands']])
    print(key, {k:(len(v) if isinstance(v,str) else [len(x) for x in v]) for k,v in out[key].items()})
# THE CHITU (2026-11-15): nothing is filled in; its loose tendrils are joined
# back on with thin curved bridges (chitu.py). Its trace sits in a shifted
# space (FRIEND09_OFFSET), which is folded in here so all three entries are in
# their drawing's own viewBox space.
import chitu
from shapely import affinity
r=chitu.clean_chitu()
mv=lambda g: affinity.translate(g,-chitu.OX,-chitu.OY)
order=chitu.order_of('09'); bands=list(r['bands'])
k=order.index('#8c8c8c')            # the bridges take a middle tone, like the tendrils they join
bands[k]=unary_union([bands[k], r['bridges'].buffer(-1.2)])
out['chitu']=dict(silhouette=path(mv(r['sil'])), shades=[path(mv(g)) for g,_ in chitu.shades(r)], layers=[path(mv(b)) for b in bands])
print('chitu', r['log'])
head='''/*
 * cleanedFriends.js — the krupengk, the zala and the chitu, cleaned (2026-11-15)
 * =============================================================================
 * CANDIDATES ON THE WORKBENCH, not yet in the game. Kimia found these two
 * traces too grainy, with "gaping holes under the eyes, filled with weird
 * specs". The originals (friend03.jsx, friend04.jsx) are untouched; the game
 * still draws those until she has judged these.
 *
 * What was done to her traces, by a script run outside the repo:
 *   - `silhouette`: the body closed into ONE piece with no holes. The bays
 *     under the eyes are filled with a soft patch (an oval for the krupengk,
 *     a wobbled rounded triangle for the zala), cracks are sealed and every
 *     loose crumb is dropped.
 *   - `layers`: her seven traced bands, in the same paint order as the
 *     original file, with every speck and pinhole below a small area removed
 *     and the edges very slightly smoothed.
 *   - `shades`: two generated bands, each the silhouette shrunk inward, that
 *     sit UNDER her bands so the filled-in areas are shaded rather than flat.
 *     They take the two darkest ramp greys, #494949 then #606060.
 *
 * THE CHITU is the third (same day). Its trouble was different: its tendrils,
 * including the two that carry its eyes, had come away from the body in
 * tracing. Nothing is filled in on it. Each loose piece is joined back to the
 * nearest part of the body by a thin curved bridge, every bridge bending the
 * same way round so the whole reads as a whirl; then specks are removed as
 * for the other two. Kimia's instruction: reattach the dismembered parts,
 * never remove them.
 *
 * MADE BY tools/art-pipeline (raw.py, then export.py). Do not edit by hand.
 * =========================================================================== */

export const CLEANED_FRIENDS = '''
open(H+'cleanedFriends.js','w').write(head+json.dumps(out,indent=1).replace('"',"'")+'\n')
