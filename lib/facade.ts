// Interactive floors on the building render (home preview and the first step of /stanovi).
//
// Source of truth: the CMS ("3 · Označi stanove" → zgrada → "Spratovi na renderu zgrade"), where every floor is
// drawn and corrected point by point on the render. Until a building has its own, the default below is used:
// floors traced on the current render at three corners (near corner, side corner, far end of the long side).
// Self-contained (no imports) so scripts/units.test.ts can load it directly.
export type Pt = [number, number];
export type FacadeFloor = { level: number; polys: Pt[][] };
export type Facade = { image: string; w: number; h: number; floors: FacadeFloor[] };

const X = [0.145, 0.285, 0.802];
// per corner: ground floor base, top of the ground floor, tops of floors 1–4, top of the set-back fifth floor
const Y: number[][] = [
  [0.655, 0.545, 0.462, 0.377, 0.292, 0.207, 0.128],
  [0.652, 0.541, 0.457, 0.372, 0.287, 0.198, 0.112],
  [0.592, 0.531, 0.474, 0.417, 0.36, 0.303, 0.27],
];

const band = (lo: number, hi: number): Pt[] => [
  [X[0], Y[0][hi]], [X[1], Y[1][hi]], [X[2], Y[2][hi]],
  [X[2], Y[2][lo]], [X[1], Y[1][lo]], [X[0], Y[0][lo]],
];

export const FACADE: Facade = {
  // current facade (360° set, angle 315°), confirmed by the owner 20. 10. 2026
  image: '/riverina/objekat/riverina-1-ugao-vecer.webp',
  w: 1672,
  h: 941,
  floors: [1, 2, 3, 4, 5].map((level) => ({ level, polys: [band(level, level + 1)] })),
};

/** CMS format of the same data: building.facade = { image, w, h, shapes: [{ floor: '3', polys }] }. */
export type CmsFacade = { image?: string; w?: number; h?: number; shapes?: { floor: string | number; polys?: Pt[][] }[] };

export function fromCms(f: CmsFacade | undefined, image: (p: string) => string): Facade | null {
  const floors = (f?.shapes || [])
    .map((s) => ({ level: Number(s.floor), polys: (s.polys || []).filter((p) => p && p.length >= 3) }))
    .filter((s) => s.level > 0 && s.polys.length);
  if (!f?.image || !floors.length) return null;
  return { image: image(f.image), w: f.w || 1600, h: f.h || 900, floors: floors.sort((a, b) => a.level - b.level) };
}

export const toCms = (f: Facade): CmsFacade => ({ image: f.image, w: f.w, h: f.h, shapes: f.floors.map((z) => ({ floor: String(z.level), polys: z.polys.map((p) => p.map((q) => [q[0], q[1]] as Pt)) })) });

/** Bounding box of a floor (all its outlines). */
export function bbox(polys: Pt[][]) {
  const xs = polys.flat().map((p) => p[0]), ys = polys.flat().map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

export const toPoints = (pts: Pt[], w: number, h: number) => pts.map(([x, y]) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`).join(' ');
