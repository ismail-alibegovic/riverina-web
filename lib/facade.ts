// Interactive floors on the building render (home preview and the first step of /stanovi).
//
// Each floor is a polygon in fractions of the image (0–1), traced on the facade at its corners: the near corner,
// the corner between the short and the long side, and the far end of the long side. When the render is replaced,
// only `image` and the three columns of heights below change; the components do not.
export type FacadeFloor = { level: number; pts: [number, number][] };
export type Facade = { image: string; w: number; h: number; floors: FacadeFloor[]; ground: [number, number][] };

// Corner x positions and, per corner, the height of each floor line: ground floor base, top of the ground floor,
// tops of floors 1–4, top of the set-back fifth floor.
const X = [0.145, 0.285, 0.802];
const Y: number[][] = [
  [0.655, 0.545, 0.462, 0.377, 0.292, 0.207, 0.128],
  [0.652, 0.541, 0.457, 0.372, 0.287, 0.198, 0.112],
  [0.592, 0.531, 0.474, 0.417, 0.36, 0.303, 0.27],
];

const band = (lo: number, hi: number): [number, number][] => [
  [X[0], Y[0][hi]], [X[1], Y[1][hi]], [X[2], Y[2][hi]],
  [X[2], Y[2][lo]], [X[1], Y[1][lo]], [X[0], Y[0][lo]],
];

export const FACADE: Facade = {
  // current facade (360° set, angle 315°), confirmed by the owner 20. 10. 2026
  image: '/riverina/objekat/riverina-1-ugao-vecer.webp',
  w: 1672,
  h: 941,
  ground: band(0, 1),
  floors: [1, 2, 3, 4, 5].map((level) => ({ level, pts: band(level, level + 1) })),
};

/** Bounding box of a polygon, for the zoom from the building into a floor. */
export function bbox(pts: [number, number][]) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

export const toPoints = (pts: [number, number][], w: number, h: number) => pts.map(([x, y]) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`).join(' ');
