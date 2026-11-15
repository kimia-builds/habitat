"""Step 1 for a friend: read its traced bands out of src/ui/friendNN.jsx and
save them as shapes (rawNN.pkl) for the cleaning scripts. Run once per friend:
    python raw.py 03 04 09
"""
import sys, pickle
from load import load, evenodd
from clean import H
from shapely.ops import unary_union
for num in sys.argv[1:]:
    base, layers = load(H + f'friend{num}.jsx', num)
    bands = [evenodd(d)[0].buffer(0) for d in layers]
    basep = evenodd(base[0])[0].buffer(0)
    pickle.dump(dict(bands=bands, body=unary_union([basep] + bands), base=basep), open(f'raw{num}.pkl', 'wb'))
    print(num, 'saved')
