"""Light version of the brand map of Ilidža for the v2 contact section (reference: light map under the contacts).
Recolours public/riverina/lokacija/mapa-ilidza.webp (gold lines on navy) to navy lines on cream by luminance.
Usage: python3 scripts/make-light-map.py  → public/riverina/lokacija/mapa-ilidza-light.webp"""
import numpy as np
from PIL import Image
src = 'public/riverina/lokacija/mapa-ilidza.webp'
a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
lum = a @ np.array([.299, .587, .114], np.float32)
bg = np.median(lum)
t = np.clip((lum - bg) / (np.percentile(lum, 99.7) - bg), 0, 1) ** .8  # 0 = background, 1 = brightest line
cream = np.array([242, 234, 224], np.float32)
ink = np.array([5, 24, 54], np.float32)
out = cream * (1 - t[..., None] * .85) + ink * (t[..., None] * .85)
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save('public/riverina/lokacija/mapa-ilidza-light.webp', quality=86, method=6)
print('ok', a.shape)
