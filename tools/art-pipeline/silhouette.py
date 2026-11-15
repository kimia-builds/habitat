"""Make the white-on-black silhouette picture to give the image generator.
    python silhouette.py 6 n01 n02      (flora keys from the two silhouette files)
Writes silhouettes/flora-<key>-silhouette.png
"""
import sys
import numpy as np
from PIL import Image
from load import rings
from paint import silhouettes, mask_of
sils = silhouettes()
for key in sys.argv[1:]:
    sil = sils[key]
    pts = [p for r in rings(sil['d']) for p in r]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    W, H = (1536, 1024) if (x1 - x0) > 1.25 * (y1 - y0) else (1024, 1024)
    scale = min(W * 0.8 / (x1 - x0), H * 0.8 / (y1 - y0))
    pad = (x0 - (W / scale - (x1 - x0)) / 2, y0 - (H / scale - (y1 - y0)) / 2)
    M, _ = mask_of(sil['d'], pad, scale, (H, W))
    Image.fromarray((M * 255).astype('uint8')).save(f'silhouettes/flora-{key}-silhouette.png')
    print(key, 'saved')
