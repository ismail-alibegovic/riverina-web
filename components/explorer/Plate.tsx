'use client';
import type { FloorPlan } from '@/lib/floorPlans';
import type { Unit } from '@/lib/units';

export const pts = (p: [number, number][], w: number, h: number) => p.map(([x, y]) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`).join(' ');

/** Label point of an outline: the centre of its bounding box, nudged to the area centroid for L shapes. */
export function centre(p: [number, number][]): [number, number] {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length];
    const f = x0 * y1 - x1 * y0;
    a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
  }
  if (Math.abs(a) < 1e-9) return p[0];
  return [cx / (3 * a), cy / (3 * a)];
}

export function bboxOf(p: [number, number][]) {
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

/**
 * A floor plate: the architect's floor drawing with one outline per apartment, filled by status.
 * Interactive in the explorer (links, hover, labels); as a key plan it is a small drawing with one apartment marked.
 */
export default function Plate({ floor, units, href, hover, active, onHover, onPick, labels = true, mini = false, ariaLabel, unitName }: {
  floor: FloorPlan;
  units: Map<string, Unit>;
  href?: (u: Unit) => string;
  hover?: string | null;
  active?: string | null;
  onHover?: (code: string | null) => void;
  onPick?: (u: Unit, e: React.MouseEvent) => void;
  labels?: boolean;
  mini?: boolean;
  ariaLabel?: string;
  unitName?: (u: Unit) => string;
}) {
  const { w, h } = floor;
  return (
    <div className={'pl' + (mini ? ' is-mini' : '')} style={{ aspectRatio: `${w} / ${h}` }}>
      {!mini && <img className="pl-img" src={floor.image} alt="" width={w} height={h} draggable={false} />}
      <svg className="pl-svg" viewBox={`0 0 ${w} ${h}`} role={mini ? 'img' : 'group'} aria-label={ariaLabel}>
        <defs>
          <pattern id="pl-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" className="pl-hatch-line" />
          </pattern>
        </defs>
        {floor.shapes.map((s) => {
          const u = units.get(s.unit);
          if (!u) return <polygon key={s.unit} className="pl-u is-none" points={pts(s.pts, w, h)} />;
          const cls = 'pl-u st-' + u.status + (hover === u.code ? ' is-hover' : '') + (active === u.code ? ' is-active' : '');
          const poly = <polygon points={pts(s.pts, w, h)} />;
          if (mini || !href) return <g key={s.unit} className={cls}>{poly}{u.status === 'reserved' && <polygon className="pl-hatch" points={pts(s.pts, w, h)} />}</g>;
          return (
            <a key={s.unit} href={href(u)} className={cls} aria-label={unitName ? unitName(u) : u.code}
              onMouseEnter={() => onHover?.(u.code)} onMouseLeave={() => onHover?.(null)} onFocus={() => onHover?.(u.code)} onBlur={() => onHover?.(null)}
              onClick={(e) => onPick?.(u, e)}>
              {poly}
              {u.status === 'reserved' && <polygon className="pl-hatch" points={pts(s.pts, w, h)} />}
            </a>
          );
        })}
      </svg>
      {labels && !mini && (
        <div className="pl-labels" aria-hidden="true">
          {floor.shapes.map((s) => {
            const u = units.get(s.unit);
            if (!u) return null;
            const [x, y] = centre(s.pts);
            return (
              <span key={s.unit} className={'pl-lab st-' + u.status + (hover === u.code ? ' is-hover' : '')} style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
                <b>{u.code.replace('-', '.')}</b>
                <span>{Math.round(u.area)} m²</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Building section diagram for the key plan: one bar per level, the current one marked. */
export function Section({ levels, current, ground, label }: { levels: number[]; current: number; ground: string; label: string }) {
  const top = Math.max(...levels);
  const rows = Array.from({ length: top + 1 }, (_, i) => top - i);
  return (
    <svg className="sec-dia" viewBox={`0 0 120 ${rows.length * 18 + 8}`} role="img" aria-label={label}>
      {rows.map((l, i) => {
        const setback = l === top && top > 1 ? 10 : 0;
        return (
          <g key={l} className={(l === current ? 'is-on' : '') + (l === 0 ? ' is-ground' : '')}>
            <rect x={22 + setback} y={4 + i * 18} width={94 - setback * 2} height={14} rx={1.5} />
            <text x={8} y={4 + i * 18 + 10.5} textAnchor="middle">{l === 0 ? ground : l}</text>
          </g>
        );
      })}
    </svg>
  );
}
