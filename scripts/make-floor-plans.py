"""Floor plans for the apartment viewer, from the architect's AutoCAD sales sheets.

Every sheet public/riverina/pdf/{floor}-{unit}.pdf has a "POZICIJA STANA U OBJEKTU" block: the whole floor
drawn in vector, with that apartment filled green. Rendering the sheets gives
  - one clean floor plan per floor (green removed, linework recoloured navy on transparent), and
  - each apartment's outline (its green fill with the walls inside it bridged), in 0..1 of the plan image.

The block sits at a different height on each sheet, so every sheet is anchored on the words "POZICIJA" and
"BILJEŠKE" (pdftotext -bbox). The drawing's box is measured once per floor and reused for all its sheets.

Output: public/riverina/floors/floor-{n}.webp and lib/floorPlans.json (read by lib/floorPlans.ts).
Run: python3 scripts/make-floor-plans.py   (needs pdftoppm/pdftotext from poppler-utils, numpy, Pillow)
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image

PDF_DIR = 'public/riverina/pdf'
OUT_IMG = 'public/riverina/floors'
OUT_JSON = 'lib/floorPlans.json'
DPI = 300          # outlines are traced at this resolution
IMG_SCALE = 2      # the floor image is rendered at DPI * IMG_SCALE for a sharp full-screen plan
NAVY = (20, 33, 58)
# Inside of the key-plan frame, in PDF points: x is the same on every sheet, y follows the two anchor words.
FRAME_X = (82, 334)
BELOW_TITLE, ABOVE_NOTES = 8, 16


def anchors(pdf):
    out = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True).stdout
    def word(w, attr):
        m = re.search(r'<word xMin="[\d.]+" yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">' + w, out)
        return float(m[1 if attr == 'yMin' else 2])
    return word('POZICIJA', 'yMax') + BELOW_TITLE, word('BILJE', 'yMin') - ABOVE_NOTES


def render(pdf, tmp, scale=1):
    """The inside of the key-plan frame as an RGB array."""
    top, bottom = anchors(pdf)
    base = os.path.join(tmp, 'p')
    subprocess.run(['pdftoppm', '-q', '-r', str(DPI * scale), '-png', '-singlefile', pdf, base], check=True, stderr=subprocess.DEVNULL)
    im = np.asarray(Image.open(base + '.png').convert('RGB')).astype(np.int16)
    px = DPI * scale / 72
    return im[round(top * px):round(bottom * px), round(FRAME_X[0] * px):round(FRAME_X[1] * px)]


def green_mask(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return (g - r > 6) & (g - b > 18)


def drawing_box(a, pad=10):
    """Bounding box of the floor drawing: the widest cluster of inked columns (drops the north arrow)."""
    ink = (a.mean(axis=2) < 215) | green_mask(a)
    def span(profile, gap):
        runs, start, last = [], None, None
        for i in np.nonzero(profile)[0]:
            if start is None or i - last > gap:
                if start is not None: runs.append((start, last))
                start = i
            last = i
        runs.append((start, last))
        return max(runs, key=lambda r: r[1] - r[0])
    x0, x1 = span(ink.sum(axis=0) > 0, gap=12)
    y0, y1 = span(ink[:, x0:x1 + 1].sum(axis=1) > 0, gap=12)
    h, w = ink.shape
    return int(max(x0 - pad, 0)), int(max(y0 - pad, 0)), int(min(x1 + pad + 1, w)), int(min(y1 + pad + 1, h))


def shift_or(m, r, axis):
    out = m.copy()
    for d in range(1, r + 1):
        out |= np.roll(m, d, axis) | np.roll(m, -d, axis)
    return out


def close(m, r):
    """Morphological closing: bridges the walls drawn over the green fill."""
    d = shift_or(shift_or(m, r, 0), r, 1)
    return ~shift_or(shift_or(~d, r, 0), r, 1)


def outline(mask, cell):
    """Outer boundary of a binary mask as an orthogonal polygon, traced on a grid of `cell` pixels."""
    h, w = mask.shape
    g = mask[: h // cell * cell, : w // cell * cell].reshape(h // cell, cell, w // cell, cell).mean(axis=(1, 3)) > 0.5
    gh, gw = g.shape
    nxt = {}
    for y, x in zip(*np.nonzero(g)):
        # clockwise edges where the neighbour is empty
        if y == 0 or not g[y - 1, x]: nxt[(x, y)] = (x + 1, y)
        if x == gw - 1 or not g[y, x + 1]: nxt[(x + 1, y)] = (x + 1, y + 1)
        if y == gh - 1 or not g[y + 1, x]: nxt[(x + 1, y + 1)] = (x, y + 1)
        if x == 0 or not g[y, x - 1]: nxt[(x, y + 1)] = (x, y)
    loops, used = [], set()
    for start in list(nxt):
        loop, p = [], start
        while p not in used and p in nxt:
            used.add(p); loop.append(p); p = nxt[p]
        if loop: loops.append(loop)
    pts = max(loops, key=len)   # the outer edge; holes and specks are shorter loops
    pts = [p for i, p in enumerate(pts) if not collinear(pts[i - 1], p, pts[(i + 1) % len(pts)])]
    pts = straighten(simplify(pts + [pts[0]], 1.6)[:-1])
    return [(float(x) * cell, float(y) * cell) for x, y in pts]


def straighten(pts):
    """Nearly horizontal / vertical edges become exact (the CMS editor's "Ispravi oblik" does the same)."""
    q = [list(p) for p in pts]
    n = len(q)
    for _ in range(2):
        for i in range(n):
            a, c = q[i], q[(i + 1) % n]
            dx, dy = abs(c[0] - a[0]), abs(c[1] - a[1])
            if dy < dx * 0.27:
                a[1] = c[1] = (a[1] + c[1]) / 2
            elif dx < dy * 0.27:
                a[0] = c[0] = (a[0] + c[0]) / 2
    return [tuple(p) for i, p in enumerate(q) if not collinear(q[i - 1], p, q[(i + 1) % n])]


def collinear(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) == (b[1] - a[1]) * (c[0] - a[0])


def simplify(pts, eps):
    """Douglas-Peucker: removes stair steps left by anti-aliasing."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    n = (dx * dx + dy * dy) ** 0.5
    def dist(p):
        return abs(dy * p[0] - dx * p[1] + x2 * y1 - y2 * x1) / n if n else ((p[0] - x1) ** 2 + (p[1] - y1) ** 2) ** 0.5
    idx = max(range(1, len(pts) - 1), key=lambda i: dist(pts[i]))
    if dist(pts[idx]) <= eps:
        return [pts[0], pts[-1]]
    return simplify(pts[: idx + 1], eps)[:-1] + simplify(pts[idx:], eps)


def plan_image(a):
    """Navy linework on transparent: darkness becomes opacity; the green fill is dropped."""
    lum = a.mean(axis=2)
    lum[shift_or(shift_or(green_mask(a), 2, 0), 2, 1) & (lum > 90)] = 255
    alpha = np.clip((235 - lum) * 255 / 235, 0, 255).astype(np.uint8)
    out = np.zeros(a.shape[:2] + (4,), np.uint8)
    out[..., :3] = NAVY
    out[..., 3] = alpha
    return Image.fromarray(out, 'RGBA')


def main():
    sheets = {}
    for f in os.listdir(PDF_DIR):
        m = re.fullmatch(r'(\d+)-(\d+)\.pdf', f)
        if m:
            sheets.setdefault(int(m[1]), []).append(int(m[2]))
    os.makedirs(OUT_IMG, exist_ok=True)
    floors = []
    with tempfile.TemporaryDirectory() as tmp:
        for level in sorted(sheets):
            units = sorted(sheets[level])
            first = os.path.join(PDF_DIR, f'{level}-{units[0]}.pdf')
            x0, y0, x1, y1 = drawing_box(render(first, tmp), pad=36)
            W, H = x1 - x0, y1 - y0
            k = IMG_SCALE
            plan_image(render(first, tmp, k)[y0 * k:y1 * k, x0 * k:x1 * k]).save(os.path.join(OUT_IMG, f'floor-{level}.webp'), 'WEBP', quality=90, method=6)
            shapes = []
            for unit in units:
                a = render(os.path.join(PDF_DIR, f'{level}-{unit}.pdf'), tmp)[y0:y1, x0:x1]
                pts = outline(close(green_mask(a), 7), 3)
                shapes.append({'unit': f'{level}-{unit}', 'pts': [[round(x / W, 4), round(y / H, 4)] for x, y in pts]})
            floors.append({'level': level, 'image': f'/riverina/floors/floor-{level}.webp', 'w': W * k, 'h': H * k, 'shapes': shapes})
            print(f'floor {level}: {W * k}x{H * k}, {len(shapes)} units, corners {[len(s["pts"]) for s in shapes]}')
    with open(OUT_JSON, 'w') as fh:
        json.dump({'_source': 'scripts/make-floor-plans.py, from public/riverina/pdf (AutoCAD sales sheets)', 'r1': floors}, fh, separators=(',', ':'))
        fh.write('\n')


if __name__ == '__main__':
    sys.exit(main())
