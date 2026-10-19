"""Traces the RIVERINA lettering of the official logo (Drive: Riverina-logo/Riverina-logo.png) into vector paths,
one path per letter, for the full-width wordmark in the footer (public/brand/wordmark-full.svg, navy).

  pip install vtracer pillow
  python3 scripts/make-wordmark.py assets-src/logo/Riverina-logo.png
"""
import re, sys, tempfile, os
from PIL import Image
import vtracer

src = sys.argv[1] if len(sys.argv) > 1 else 'assets-src/logo/Riverina-logo.png'
SCALE = 4
im = Image.open(src).convert('L')
# the lettering band of the 1536 x 1024 logo, under the R mark and above RESIDENCE
band = im.crop((225, 750, 1315, 920))
band = band.resize((band.width * SCALE, band.height * SCALE), Image.LANCZOS).point(lambda v: 0 if v < 140 else 255).convert('RGB')
tmp = tempfile.mkdtemp()
png, svg = os.path.join(tmp, 'w.png'), os.path.join(tmp, 'w.svg')
band.save(png)
vtracer.convert_image_to_svg_py(png, svg, colormode='binary', filter_speckle=8, corner_threshold=60, length_threshold=4.0, splice_threshold=45, path_precision=1, mode='spline')
text = open(svg).read()
letters = []
for d, tx, ty in re.findall(r'<path d="([^"]+)"[^>]*transform="translate\(([\d.]+),([\d.]+)\)"', text):
    tx, ty = float(tx), float(ty)
    xs = [float(v) for v in re.findall(r'(-?[\d.]+) (-?[\d.]+)', d) for v in [v[0]]]
    ys = [float(v[1]) for v in re.findall(r'(-?[\d.]+) (-?[\d.]+)', d)]
    letters.append({'x': tx + min(xs), 'x2': tx + max(xs), 'y': ty + min(ys), 'y2': ty + max(ys), 'd': d, 't': [round(tx, 1), round(ty, 1)]})
letters.sort(key=lambda l: l['x'])
x0, x1 = min(l['x'] for l in letters), max(l['x2'] for l in letters)
y0, y1 = min(l['y'] for l in letters), max(l['y2'] for l in letters)
vb = f'{x0:.0f} {y0:.0f} {x1 - x0:.0f} {y1 - y0:.0f}'
paths = ''.join(f'<path transform="translate({l["t"][0]} {l["t"][1]})" d="{l["d"]}"/>' for l in letters)
open('public/brand/wordmark-full.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="#14213a" fill-rule="evenodd">{paths}</svg>')
print(len(letters), 'letters', vb)
