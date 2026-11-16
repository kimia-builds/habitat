import clean2, clean3, json, os
from clean2 import *
from clean3 import shade
from shapely.ops import unary_union
out={}
for num,key in (('03','krupengk'),('04','zala')):
    r=clean2.clean(num)
    out[key]=dict(silhouette=path(r['sil']), shades=[path(g) for g,_ in shade(r,[(9,0),(20,0)])], layers=[path(b) for b in r['bands']])
    print(key, {k:(len(v) if isinstance(v,str) else [len(x) for x in v]) for k,v in out[key].items()})
# THE CHITU (2026-11-16): its outline is rebuilt from the character sheet
# (chitu.py): craters filled by the underbelly, every tendril redrawn as one
# smooth curve ending in a bulb. Already in its drawing's own viewBox space.
import chitu
r=chitu.clean_chitu()
bands,_=chitu.toned(r)
# Its tendrils are shorter now, so it also carries the `box` it fills: the
# shelf crops to that, at the same scale, so no empty margin is left round it.
def box_of(sil, pad=16):
    x0,y0,x1,y1=sil.bounds
    return [round(x0-pad,1), round(y0-pad,1), round(x1-x0+2*pad,1), round(y1-y0+2*pad,1)]
out['chitu']=dict(silhouette=path(r['sil']), shades=[path(g) for g,_ in chitu.shades(r)], layers=[path(b) for b in bands], eyes=r['eyes'], box=box_of(r['sil']))
print('chitu bounds', [round(v,1) for v in r['sil'].bounds])
# THE HAMDI BULO (2026-11-16, hamdi.py): specks removed and its loose legs
# joined on, so it is ONE silhouette. Its bands sat side by side, so they are
# STACKED here, darkest first, and it carries the greys its layers are painted in.
import hamdi
r=hamdi.clean_hamdi()
out['hamdi-bulo']=dict(silhouette=path(r['sil']), shades=[path(g) for g in r['shades']], layers=[path(b) for b in r['layers']], greys=hamdi.GREYS)
print('hamdi-bulo', [len(path(b)) for b in r['layers']])
# THE LIWI BI-JIJI (2026-11-16, liwi.py): specks removed, the cavity round its
# eyes filled, its loose tendril joined on. Stacked like the hamdi bulo.
import liwi
r=liwi.clean_liwi()
out['liwi-bi-jiji']=dict(silhouette=path(r['sil']), shades=[], layers=[path(b) for b in r['layers']], greys=liwi.GREYS, box=box_of(r['sil']))
print('liwi-bi-jiji', [len(path(b)) for b in r['layers']])
# THE WOIGOLP (2026-11-16, woigolp.py): specks removed, its legs and feet
# taken off for one smooth rounded bottom, a third eye. Stacked like the hamdi bulo.
import woigolp
r=woigolp.clean_woigolp()
out['woigolp']=dict(silhouette=path(r['sil']), shades=[], layers=[path(b) for b in r['layers']], greys=woigolp.GREYS, eyes=r['eyes'], box=box_of(r['sil']))
print('woigolp', [len(path(b)) for b in r['layers']])
# THE RASSATT (2026-11-16, rassatt.py): specks removed and its lower fan
# closed, so it is one fan with all five eyes on it. Stacked like the hamdi bulo.
import rassatt
r=rassatt.clean_rassatt()
out['rassatt']=dict(silhouette=path(r['sil']), shades=[], layers=[path(b) for b in r['layers']], greys=rassatt.GREYS)
print('rassatt', [len(path(b)) for b in r['layers']])
head='''/*
 * cleanedFriends.js — seven friends cleaned: krupengk, zala, chitu, hamdi bulo, liwi bi-jiji, woigolp, rassatt
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
 * THE CHITU is the third (redone 2026-11-16). Its trace had round "craters"
 * bitten out of the underside and tendrils that had come apart. Its outline
 * is rebuilt from Kimia's character sheet: the craters are filled by the
 * underbelly the sheet shows there, and every tendril is redrawn as one
 * smooth tapering curve along the path it takes on the sheet, each ending in
 * a bulb. Nothing is removed.
 * Its tones darken toward the outline, like the other two, and it carries
 * no light stripe where a tendril crosses the body: only a faint vein.
 * It also carries its own `eyes`: two, on the light underbelly in the
 * bottom-right quadrant of its body (2026-11-16; nine used to ride the
 * tendril tips). Its tendrils are shortened and evened out the same day.
 *
 * A drawing whose tendrils were shortened carries a `box` [x, y, w, h]: the
 * part of the original canvas it still fills, for the shelf to crop to.
 *
 * THE HAMDI BULO is the fourth (2026-11-16). Its trace was the grainiest of
 * the ten. Its seven bands lay side by side, so they are stacked here (each
 * layer is "this tone or lighter", darkest first) and every fleck and
 * pinhole below a small area is gone. It carries its own `greys`: the tone
 * each of its layers is painted in. Its outline is ONE piece: the little
 * legs that floated loose are joined on (the gaps beside them filled, and
 * the broken legs at the bottom right closed along their length), a few
 * flecks off its right-hand side are left out, and its open tendril loops
 * stay open. Its one `shades` band gives the filled gaps the body's darkest tone.
 *
 * THE LIWI BI-JIJI is the fifth (2026-11-16), stacked the same way and
 * carrying its own `greys`. Its specks are gone; the tall dark cavity in
 * the middle of its mound, where its three eyes floated, is filled in the
 * darkest shade; the long tendril that had come away is joined back on;
 * its tendrils are pulled in shorter and more even.
 * A few small dashes too far from the body to join are left out.
 *
 * THE WOIGOLP is the sixth (2026-11-16), stacked the same way and carrying
 * its own `greys`. Its specks are gone. It has NO LEGS: Kimia found it read
 * as a four-legged animal, so its legs and feet are cut away and its bottom
 * is one smooth rounded line, the belly above it filled in the darkest
 * shade. It carries three `eyes`: her two and a third to their right.
 *
 * THE RASSATT is the seventh (2026-11-16), stacked the same way and
 * carrying its own `greys`. Its specks are gone. It is a fan, and the trace
 * had lost most of the lower fan: the gaps between its blades and the loose
 * strands below them are filled in the darkest shade, down to the point at
 * the bottom, so it is one silhouette and all five eyes sit on the body.
 *
 * MADE BY tools/art-pipeline (raw.py, then export.py). Do not edit by hand.
 * =========================================================================== */

export const CLEANED_FRIENDS = '''
open(H+'cleanedFriends.js','w').write(head+json.dumps(out,indent=1).replace('"',"'")+'\n')
