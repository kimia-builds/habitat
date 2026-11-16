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
out['chitu']=dict(silhouette=path(r['sil']), shades=[path(g) for g,_ in chitu.shades(r)], layers=[path(b) for b in bands])
print('chitu bounds', [round(v,1) for v in r['sil'].bounds])
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
 * THE CHITU is the third (redone 2026-11-16). Its trace had round "craters"
 * bitten out of the underside and tendrils that had come apart. Its outline
 * is rebuilt from Kimia's character sheet: the craters are filled by the
 * underbelly the sheet shows there, and every tendril is redrawn as one
 * smooth tapering curve along the path it takes on the sheet, each ending in
 * a bulb. The two eye bulbs sit exactly on its eyes. Nothing is removed.
 * Its tones darken toward the outline, like the other two, and it carries
 * no light stripe where a tendril crosses the body: only a faint vein.
 *
 * MADE BY tools/art-pipeline (raw.py, then export.py). Do not edit by hand.
 * =========================================================================== */

export const CLEANED_FRIENDS = '''
open(H+'cleanedFriends.js','w').write(head+json.dumps(out,indent=1).replace('"',"'")+'\n')
