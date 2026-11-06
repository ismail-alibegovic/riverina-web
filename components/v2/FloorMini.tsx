import type { FloorShape } from '@/lib/v2/units';

/** Small drawing of the floor with every apartment outlined and this one filled in gold (position on the floor). */
export default function FloorMini({ floor, code, label, className = '' }: { floor: FloorShape | null; code: string; label: string; className?: string }) {
  if (!floor || !floor.shapes.length) return null;
  const { w, h } = floor;
  const pts = (p: [number, number][]) => p.map(([x, y]) => `${(x * w).toFixed(1)},${(y * h).toFixed(1)}`).join(' ');
  return (
    <svg className={'k-floor ' + className} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      {floor.shapes.map((s) => <polygon key={s.unit} points={pts(s.pts)} className={s.unit === code ? 'is-on' : ''} />)}
    </svg>
  );
}
