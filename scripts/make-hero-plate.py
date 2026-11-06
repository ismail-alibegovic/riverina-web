"""Hero images of the redesign (/v2) from one frame of the 360° set of Riverina 1.

The renders have almost no sky above the roof, so the KEY TOWERS hero (title over the sky, the building rising
into it) needs a taller canvas. This script:
  1. adds EXT px of sky above the frame: a vertical gradient continued from the render's own sky, blended into the
     original sky (clouds stay where they are; the zenith becomes clear),
  2. cuts the building out along its outline (hand-traced corners, straight edges) into a second, transparent image.
The page stacks: plate → title → building, both images with the same size and object-position, so they line up.

Usage: python3 scripts/make-hero-plate.py path/to/r1-360-135.webp
Output: public/riverina/hero/plate.webp, public/riverina/hero/building.webp
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

SRC = sys.argv[1]
OUT = 'public/riverina/hero'
EXT = 300   # px of sky added on top
BLEND = 170  # px over which the new sky fades into the render's sky

# outline of Riverina 1 in the 135° frame (1672 × 941): roof, terrace railings and walls, closed along the bottom
BUILDING = [
    (283, 941), (283, 236), (287, 229), (312, 211), (312, 143), (548, 36), (1000, 150), (1048, 161),
    (1425, 254), (1425, 287), (1446, 318), (1446, 941),
]

im = Image.open(SRC).convert('RGB')
w, h = im.size
a = np.asarray(im).astype(np.float32)

# --- sky mask: bluish or bright cool pixels connected to the top edge, never inside the building outline
poly = Image.new('L', (w, h), 0)
ImageDraw.Draw(poly).polygon(BUILDING, fill=255)
inside = np.asarray(poly) > 0
r, g, b = a[..., 0], a[..., 1], a[..., 2]
cand = ((b - r > 18) | ((r + g + b > 600) & (b >= r - 3))) & ~inside
cand[int(h * 0.55):] = False
lab, _ = ndimage.label(cand)
top = set(np.unique(lab[0][lab[0] > 0]))
sky = np.isin(lab, list(top))
sky = (ndimage.binary_closing(sky, iterations=2, border_value=1) | sky) & ~inside
skyf = ndimage.gaussian_filter(sky.astype(np.float32), 1.2, mode='nearest')  # 'nearest': no dark rim at the image edge

# --- sky colour per row (median of sky pixels), smoothed, continued upward into a deeper zenith blue
rows = np.full((h, 3), np.nan, np.float32)
for y in range(int(h * 0.5)):
    m = sky[y]
    if m.sum() > 40:
        rows[y] = np.median(a[y][m], axis=0)
valid = ~np.isnan(rows[:, 0])
ys = np.arange(h)[valid][:200]
fit = [np.polyfit(ys, rows[valid][:200, c], 1) for c in range(3)]
top_col = np.array([np.polyval(fit[c], 0) for c in range(3)])
zenith = np.array([34, 92, 178], np.float32)  # deeper blue at the top of the canvas


def sky_at(y):  # y in canvas coordinates (0 = new top)
    if y < EXT:
        t = (y / EXT) ** 0.85
        return zenith * (1 - t) + top_col * t
    return np.array([np.polyval(fit[c], y - EXT) for c in range(3)])


H = h + EXT
plate = np.zeros((H, w, 3), np.float32)
plate[EXT:] = a
rng = np.random.default_rng(7)
for y in range(H):
    col = sky_at(y)
    if y < EXT:
        plate[y] = col
    elif y < EXT + BLEND:
        k = 1 - (y - EXT) / BLEND
        k = k * k * (3 - 2 * k)  # smoothstep
        m = skyf[y - EXT][:, None] * k
        plate[y] = plate[y] * (1 - m) + col * m
plate[:EXT + BLEND] += rng.normal(0, 1.1, (EXT + BLEND, w, 1))  # against banding
plate = np.clip(plate, 0, 255).astype(np.uint8)

import os
os.makedirs(OUT, exist_ok=True)
Image.fromarray(plate).save(f'{OUT}/plate.webp', quality=88, method=6)

# --- building cut-out (same canvas), soft 1 px edge
mask = Image.new('L', (w, H), 0)
ImageDraw.Draw(mask).polygon([(x, y + EXT) for x, y in BUILDING], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.7))
cut = Image.fromarray(plate).convert('RGBA')
cut.putalpha(mask)
bbox = (0, 0, w, H)
cut.save(f'{OUT}/building.webp', quality=90, method=6)
print('plate', w, H, 'roof top at', 36 + EXT, '=', round((36 + EXT) / H, 4), 'of height')
