"""Floor plans as vector drawings, and exact apartment outlines, from the architect's AutoCAD sales sheets.

Every sheet public/riverina/pdf/{floor}-{unit}.pdf has a "POZICIJA STANA U OBJEKTU" block: the whole floor in
vector, with that apartment marked by a green fill (an image with a mask). This script
  - copies the floor's linework out of one sheet into public/riverina/floors/floor-{n}.svg, with our own thin
    line weights (the sheets draw walls as heavy round strokes), in navy on transparent;
  - traces each apartment's mask into an outline, placed in the same coordinates as the drawing (every sheet is
    normalised on its own walls, because the block sits at a different height on each sheet).

Output: public/riverina/floors/floor-{n}.svg and lib/floorPlans.json (read by lib/floorPlans.ts).
Run: python3 scripts/make-floor-svg.py   (needs pdftocairo / pdftotext from poppler-utils, numpy, Pillow)
"""
import base64, io, json, os, re, subprocess, sys, tempfile
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image

PDF_DIR = 'public/riverina/pdf'
OUT_DIR = 'public/riverina/floors'
OUT_JSON = 'lib/floorPlans.json'
NS = {'s': 'http://www.w3.org/2000/svg', 'x': 'http://www.w3.org/1999/xlink'}
FRAME_X = (82, 334)
NAVY = '#0b2247'
# line weights in the output drawing (points of the sheet; the plan is ~250 pt wide): walls, partitions, details
WEIGHTS = [(5.5, 0.46), (3.5, 0.3), (1.5, 0.18), (0, 0.1)]
MARGIN = 3.0
SCALE = 6  # output units per sheet point (keeps numbers integer-ish)

NUM = re.compile(r'-?\d*\.?\d+(?:e-?\d+)?')


def anchors(pdf):
    out = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True).stdout
    def word(w, i):
        m = re.search(r'<word xMin="[\d.]+" yMin="([\d.]+)" xMax="[\d.]+" yMax="([\d.]+)">' + w, out)
        return float(m[i])
    return word('POZICIJA', 2) + 6, word('BILJE', 1) - 12


def matrix(t):
    m = re.search(r'matrix\(([^)]*)\)', t or '')
    return [float(v) for v in m[1].replace(',', ' ').split()] if m else [1, 0, 0, 1, 0, 0]


def apply(m, x, y):
    return m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]


def path_points(d, m):
    """Absolute M/L/C/Z paths as written by cairo; returns segments [(cmd, [points in page coords])]."""
    out = []
    for cmd, args in re.findall(r'([MLCZ])([^MLCZ]*)', d):
        nums = [float(v) for v in NUM.findall(args)]
        pts = [apply(m, nums[i], nums[i + 1]) for i in range(0, len(nums) - 1, 2)]
        out.append((cmd, pts))
    return out


def sheet(pdf, tmp):
    svg = os.path.join(tmp, os.path.basename(pdf) + '.svg')
    subprocess.run(['pdftocairo', '-svg', pdf, svg], capture_output=True)
    root = ET.parse(svg).getroot()
    top, bottom = anchors(pdf)
    inside = lambda x, y: FRAME_X[0] + 1 < x < FRAME_X[1] - 1 and top < y < bottom
    paths, green = [], []
    defs = root.find('s:defs', NS)
    for el in root.iter('{%s}path' % NS['s']):
        if defs is not None and el in list(defs.iter()):
            continue
        segs = path_points(el.get('d', ''), matrix(el.get('transform')))
        pts = [p for _, ps in segs for p in ps]
        if not pts or not all(inside(*p) for p in pts):
            continue
        sw = float(el.get('stroke-width') or 0) * abs(matrix(el.get('transform'))[0] or 1)
        rgb = [float(v) for v in re.findall(r'([\d.]+)%', el.get('fill') or '')]
        if len(rgb) == 3 and rgb[1] > rgb[0] + 3 and rgb[1] > rgb[2] + 3:
            # the marked apartment, drawn as a hatch of triangles: keep every closed sub-path
            sub = []
            for cmd, ps in segs:
                if cmd == 'M':
                    sub.append(list(ps))
                elif sub:
                    sub[-1].extend(ps)
            green.extend(t for t in sub if len(t) >= 3)
            continue
        paths.append({'segs': segs, 'stroke': el.get('stroke') not in (None, 'none'), 'fill': el.get('fill') not in (None, 'none'), 'sw': sw, 'pts': pts})
    # the marked apartment: an image drawn through the colour-to-alpha mask
    images = {i.get('id'): i for i in root.iter('{%s}image' % NS['s'])}
    mask = None
    for u in root.iter('{%s}use' % NS['s']):
        if 'color-to-alpha' in (u.get('filter') or ''):
            src = images.get((u.get('{%s}href' % NS['x']) or '')[1:])
            if src is None:
                continue
            m = matrix(u.get('transform'))
            data = src.get('{%s}href' % NS['x']).split(',', 1)[1]
            img = np.asarray(Image.open(io.BytesIO(base64.b64decode(data))).convert('L')) > 127
            x0, y0 = apply(m, 0, 0)
            if inside(x0 + 1, y0 + 1):
                mask = (img, m)
    if mask is None and green:
        mask = ('poly', raster_trace(green))
    return paths, mask


def walls_box(paths):
    """Box of the building: the heavy wall strokes (the compass rose and frame stay out)."""
    pts = [p for q in paths if q['stroke'] and q['sw'] >= 0.7 for p in q['pts']]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def trace(mask):
    """Outline of a rectilinear mask: boundary edges joined into loops, collinear points removed; largest loop."""
    a = np.pad(mask, 1)
    h, w = a.shape
    edges = {}
    ys, xs = np.nonzero(a)
    for y, x in zip(ys, xs):
        if not a[y - 1, x]: edges[(x, y)] = (x + 1, y)
        if not a[y, x + 1]: edges[(x + 1, y)] = (x + 1, y + 1)
        if not a[y + 1, x]: edges[(x + 1, y + 1)] = (x, y + 1)
        if not a[y, x - 1]: edges[(x, y + 1)] = (x, y)
    loops = []
    while edges:
        start, cur = next(iter(edges.items()))
        loop = [start]
        del edges[start]
        while cur != start and cur in edges:
            loop.append(cur)
            cur = edges.pop(cur)
        loops.append(loop)
    loop = max(loops, key=lambda l: abs(area(l)))
    out = []
    for i, p in enumerate(loop):
        a0, c0 = loop[i - 1], loop[(i + 1) % len(loop)]
        if (a0[0] == p[0] == c0[0]) or (a0[1] == p[1] == c0[1]):
            continue
        out.append(p)
    return [(x - 1, y - 1) for x, y in out]


def raster_trace(polys, k=8):
    """Union of filled polygons (page points) as one outline: drawn into a bitmap at k px/pt, then traced."""
    from PIL import ImageDraw
    xs = [p[0] for t in polys for p in t]; ys = [p[1] for t in polys for p in t]
    ox, oy = min(xs) - 1, min(ys) - 1
    im = Image.new('L', (int((max(xs) - ox + 2) * k), int((max(ys) - oy + 2) * k)), 0)
    dr = ImageDraw.Draw(im)
    for t in polys:
        dr.polygon([((x - ox) * k, (y - oy) * k) for x, y in t], fill=255, outline=255)
    loop = drop_jogs(trace(np.asarray(im) > 127), 4)
    return [(x / k + ox, y / k + oy) for x, y in loop]


def area(l):
    return sum(l[i - 1][0] * l[i][1] - l[i][0] * l[i - 1][1] for i in range(len(l))) / 2


def drop_jogs(pts, tol):
    """Removes steps smaller than tol (anti-aliasing stairs on the mask edge)."""
    changed = True
    while changed and len(pts) > 4:
        changed = False
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            if abs(a[0] - b[0]) + abs(a[1] - b[1]) < tol:
                c, d = pts[i - 1], pts[(i + 2) % len(pts)]
                # move the short edge onto the longer neighbour line
                if a[0] == b[0]:
                    y = c[1] if abs(c[0] - a[0]) > abs(d[0] - b[0]) else d[1]
                    pts[i - 1] = (c[0], y); pts[(i + 2) % len(pts)] = (d[0], y)
                else:
                    x = c[0] if abs(c[1] - a[1]) > abs(d[1] - b[1]) else d[0]
                    pts[i - 1] = (x, c[1]); pts[(i + 2) % len(pts)] = (x, d[1])
                for k in sorted([i, (i + 1) % len(pts)], reverse=True):
                    pts.pop(k)
                changed = True
                break
    return pts


def weight(sw):
    return next(v for t, v in WEIGHTS if sw >= t)


def fmt(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def main():
    files = sorted(f[:-4] for f in os.listdir(PDF_DIR) if re.fullmatch(r'\d+-\d+\.pdf', f))
    by_floor = {}
    for code in files:
        by_floor.setdefault(int(code.split('-')[0]), []).append(code)
    floors = []
    with tempfile.TemporaryDirectory() as tmp:
        for level in sorted(by_floor):
            codes = sorted(by_floor[level], key=lambda c: int(c.split('-')[1]))
            # apartment outlines first (page points normalised onto the first sheet's walls): terraces can reach
            # beyond the walls, so the drawing's box is the walls plus every outline
            ref_paths, _ = sheet(os.path.join(PDF_DIR, codes[0] + '.pdf'), tmp)
            x0, y0, x1, y1 = walls_box(ref_paths)
            outlines = {}
            for code in codes:
                paths, mask = sheet(os.path.join(PDF_DIR, code + '.pdf'), tmp)
                if mask is None:
                    print('no mark on', code, file=sys.stderr); continue
                sx0, sy0, sx1, sy1 = walls_box(paths)
                if isinstance(mask[0], str):
                    page = mask[1]
                else:
                    img, m = mask
                    page = [apply(m, px, py) for px, py in drop_jogs(trace(img), 3)]
                outlines[code] = [((x - sx0) / (sx1 - sx0) * (x1 - x0) + x0, (y - sy0) / (sy1 - sy0) * (y1 - y0) + y0) for x, y in page]
            allp = [p for o in outlines.values() for p in o]
            bx0 = min([x0] + [p[0] for p in allp]) - MARGIN
            by0 = min([y0] + [p[1] for p in allp]) - MARGIN
            bx1 = max([x1] + [p[0] for p in allp]) + MARGIN
            by1 = max([y1] + [p[1] for p in allp]) + MARGIN
            W, H = (bx1 - bx0) * SCALE, (by1 - by0) * SCALE
            keep = [q for q in ref_paths if all(bx0 - 1 < p[0] < bx1 + 1 and by0 - 1 < p[1] < by1 + 1 for p in q['pts'])]
            body = []
            for q in keep:
                d = ''.join(cmd + ' '.join(fmt((p[0] - bx0) * SCALE) + ' ' + fmt((p[1] - by0) * SCALE) for p in pts) for cmd, pts in q['segs'])
                if q['stroke']:
                    body.append(f'<path d="{d}" stroke-width="{fmt(weight(q["sw"]) * SCALE)}"/>')
                elif q['fill']:
                    body.append(f'<path d="{d}" fill="{NAVY}" fill-opacity=".85" stroke="none"/>')
            svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(W)} {fmt(H)}" width="{fmt(W)}" height="{fmt(H)}">'
                   f'<g fill="none" stroke="{NAVY}" stroke-linecap="round" stroke-linejoin="round">' + ''.join(body) + '</g></svg>')
            os.makedirs(OUT_DIR, exist_ok=True)
            with open(os.path.join(OUT_DIR, f'floor-{level}.svg'), 'w') as fh:
                fh.write(svg)
            shapes = [{'unit': c, 'pts': [[round((x - bx0) / (bx1 - bx0), 4), round((y - by0) / (by1 - by0), 4)] for x, y in o]} for c, o in outlines.items()]
            floors.append({'level': level, 'image': f'/riverina/floors/floor-{level}.svg', 'w': round(W), 'h': round(H), 'shapes': shapes})
            print(f'floor {level}: {len(keep)} lines, {len(shapes)} apartments, {os.path.getsize(os.path.join(OUT_DIR, f"floor-{level}.svg")) // 1024} KB')
    with open(OUT_JSON, 'w') as fh:
        json.dump({'_source': 'scripts/make-floor-svg.py, from public/riverina/pdf (AutoCAD sales sheets)', 'r1': floors}, fh, separators=(',', ':'))


if __name__ == '__main__':
    main()
