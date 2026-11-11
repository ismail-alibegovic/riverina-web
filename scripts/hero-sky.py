# Builds public/riverina/objekat/riverina-1-nebo.webp: the 2560 px upscale of riverina-1-ugao-vecer.webp
# (riverina-1-hero.webp, made with sharp: lanczos3 + light sharpen) with the evening sky extended upwards.
# Run from the repo root: python3 scripts/hero-sky.py
import numpy as np
from PIL import Image, ImageFilter
src = Image.open('public/riverina/objekat/riverina-1-hero.webp').convert('RGB')
W, H = src.size
EXT = 1000
a = np.asarray(src).astype(np.float32)
# sky colour per column from the top rows, smoothed hard horizontally so leaves/roof do not streak upward
row = a[0:6].mean(axis=0)  # (W,3)
img = Image.fromarray(np.clip(np.repeat(row[None], 4, 0), 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(120))
row = np.asarray(img).astype(np.float32)[1]
# global light-sky tone (bright pixels of the right half top) to pull the leaf columns toward sky
sky = a[0:60, W//2:].reshape(-1, 3); sky = sky[sky.sum(1) > 420].mean(0)
zen = np.array([22, 44, 84], np.float32)     # deep evening blue at the top
mid = np.array([92, 132, 184], np.float32)   # mid sky
out = np.zeros((EXT, W, 3), np.float32)
for y in range(EXT):
    t = y / (EXT - 1)                     # 0 top .. 1 joins the image
    base = zen * (1 - t) ** 1.6 + mid * (1 - (1 - t) ** 1.6)
    # in the last 35 %, blend toward the per-column sky (itself pulled 60 % to the global sky tone)
    col = row * 0.4 + sky * 0.6
    k = max(0.0, (t - 0.65) / 0.35) ** 1.5
    out[y] = base * (1 - k) + col * k
ext = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
canvas = Image.new('RGB', (W, H + EXT)); canvas.paste(ext, (0, 0)); canvas.paste(src, (0, EXT))
# soft seam: blend the first 120 px of the photo with the extension colour
c = np.asarray(canvas).astype(np.float32)
seam = 140
for i in range(seam):
    k = (1 - i / seam) ** 2 * 0.85
    c[EXT + i] = c[EXT + i] * (1 - k) + c[EXT - 1] * k
# the foreground leaves at the top left: fade them out over a longer run so they do not end in a straight line
x = np.arange(W) / W
m = np.clip((0.22 - x) / 0.08, 0, 1)[:, None]          # 1 on the left, 0 from 22 % across
long = 520
for i in range(long):
    k = (1 - i / long) ** 1.3 * m
    c[EXT + i] = c[EXT + i] * (1 - k) + c[EXT - 1] * k
# add a little noise so the gradient does not band
rng = np.random.default_rng(1); c[:EXT + long] += rng.normal(0, 1.4, c[:EXT + long].shape)
Image.fromarray(np.clip(c, 0, 255).astype(np.uint8)).save('public/riverina/objekat/riverina-1-nebo.webp', quality=86, method=6)
print(W, H + EXT)
