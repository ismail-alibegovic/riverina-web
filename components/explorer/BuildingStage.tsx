'use client';
import { useId, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import type { Unit } from '@/lib/units';
import type { FloorPlan } from '@/lib/floorPlans';
import { bbox, toPoints, type Facade } from '@/lib/facade';
import { EX, fill, floorAvail, explorerPath, type FloorSummary } from '@/lib/explorer';
import Plate from './Plate';

/**
 * The building as one scene, used twice: as the home section "Istražite zgradu" and as the first step of the
 * apartment explorer, so the visitor recognises the same picture when the explorer opens.
 *
 * The render covers the stage; every residential floor is a zone drawn on it (CMS → Označi stanove → Spratovi na
 * renderu zgrade). Pointing at a floor, on the picture or in the floor index, puts it in a spotlight: the rest of
 * the building dims, the floor lights in gold, and a card shows that floor's plan with its free apartments.
 */
export default function BuildingStage({ lang, facade, floors, plans, units, onPick, intro, top, tag, priority, className = '' }: {
  lang: Lang;
  facade: Facade;
  floors: FloorSummary[];
  plans: FloorPlan[];
  units: Unit[];
  /** explorer: open the floor in place (origin = the zone's centre, for the zoom) */
  onPick?: (level: number, e: React.MouseEvent, origin: string) => void;
  intro: React.ReactNode;
  /** a line across the top of the scene (the explorer's navigation) */
  top?: React.ReactNode;
  tag?: string;
  priority?: boolean;
  className?: string;
}) {
  const t = EX[lang];
  const href = (level: number) => explorerPath(lang, { floor: level });
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);
  const on = hover ?? tapped;
  const byLevel = useMemo(() => new Map(floors.map((f) => [f.level, f])), [floors]);
  const zones = facade.floors.filter((z) => byLevel.has(z.level));
  const zone = on != null ? zones.find((z) => z.level === on) : undefined;
  const sum = on != null ? byLevel.get(on) : undefined;
  const plan = on != null ? plans.find((p) => p.level === on) : undefined;
  const planUnits = useMemo(() => new Map(units.filter((u) => u.floor === on).map((u) => [u.code, u])), [units, on]);
  const range = (f: FloorSummary) => fill(t.areaRange, { a: Math.round(f.min), b: Math.round(f.max) });
  const originOf = (level: number) => {
    const z = zones.find((x) => x.level === level);
    if (!z) return '50% 50%';
    const b = bbox(z.polys);
    return `${(((b.x0 + b.x1) / 2) * 100).toFixed(1)}% ${(((b.y0 + b.y1) / 2) * 100).toFixed(1)}%`;
  };
  const pick = (level: number, e: React.MouseEvent) => {
    // touch: the first tap shows the floor, the second opens it
    if (window.matchMedia('(hover: none)').matches && tapped !== level) { e.preventDefault(); setTapped(level); return; }
    onPick?.(level, e, originOf(level));
  };
  const enter = (level: number | null) => setHover(level);
  const box = zone ? bbox(zone.polys) : null;

  return (
    <div className={'bs ' + className + (on != null ? ' has-on' : '')}>
      <div className="bs-stage">
        <div className="bs-frame" style={{ aspectRatio: `${facade.w} / ${facade.h}` }}>
          <Image src={facade.image} alt="" fill sizes="100vw" priority={priority} quality={80} className="bs-img" />
          <svg className="bs-svg" viewBox={`0 0 ${facade.w} ${facade.h}`} preserveAspectRatio="none">
            <defs>
              <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={facade.w} height={facade.h}>
                <rect width={facade.w} height={facade.h} fill="#fff" />
                {zone?.polys.map((p, k) => <polygon key={k} points={toPoints(p, facade.w, facade.h)} fill="#000" />)}
              </mask>
              <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dcc08a" stopOpacity=".55" />
                <stop offset="1" stopColor="#c4994a" stopOpacity=".3" />
              </linearGradient>
            </defs>
            <rect className="bs-shade" width={facade.w} height={facade.h} mask={`url(#m${id})`} />
            {zones.map((z) => (
              <a key={z.level} href={href(z.level)} className={'bs-zone' + (on === z.level ? ' is-on' : '')}
                aria-label={`${fill(t.floorN, { n: z.level })}, ${floorAvail(byLevel.get(z.level)!, lang)}`}
                onMouseEnter={() => enter(z.level)} onMouseLeave={() => enter(null)} onFocus={() => enter(z.level)} onBlur={() => enter(null)}
                onClick={(e) => pick(z.level, e)}>
                {z.polys.map((p, k) => <polygon key={k} points={toPoints(p, facade.w, facade.h)} style={on === z.level ? { fill: `url(#g${id})` } : undefined} />)}
              </a>
            ))}
          </svg>
          {sum && box && (
            // above the lit floor, or below it for the upper floors (the header would cover the card)
            <div className={'bs-card' + (box.y0 < 0.42 ? ' is-below' : '')} style={{ left: `${(((box.x0 + box.x1) / 2) * 100).toFixed(2)}%`, top: `${((box.y0 < 0.42 ? box.y1 : box.y0) * 100).toFixed(2)}%` }} aria-hidden="true">
              <div className="bs-card-head">
                <b>{fill(t.floorN, { n: sum.level })}</b>
                <span>{floorAvail(sum, lang)}</span>
              </div>
              {plan && <div className="bs-card-plan"><Plate floor={plan} units={planUnits} mini /></div>}
              <div className="bs-card-foot"><span>{range(sum)}</span><span className="bs-card-go">{t.view} →</span></div>
            </div>
          )}
        </div>
        {tag && <span className="ill-tag">{tag}</span>}
      </div>

      <div className="bs-veil" aria-hidden="true" />
      {top && <div className="bs-top wrap wrap-wide">{top}</div>}
      <div className="bs-intro">{intro}</div>

      <nav className="bs-index" aria-label={t.floorsShort}>
        <p className="bs-index-title">{t.floorsShort}</p>
        <ol>
          {floors.slice().reverse().map((f) => (
            <li key={f.level}>
              <a href={href(f.level)} className={'bs-row' + (on === f.level ? ' is-on' : '')}
                onMouseEnter={() => enter(f.level)} onMouseLeave={() => enter(null)} onFocus={() => enter(f.level)} onBlur={() => enter(null)}
                onClick={(e) => pick(f.level, e)}>
                <span className="bs-n">{f.level}</span>
                <span className="bs-l"><b>{fill(t.floorN, { n: f.level })}</b><small>{range(f)}</small></span>
                <span className="bs-a">{floorAvail(f, lang)}</span>
              </a>
            </li>
          ))}
          <li><span className="bs-row is-off"><span className="bs-n">P</span><span className="bs-l"><b>{t.ground}</b><small>{t.groundNote}</small></span><span className="bs-a" /></span></li>
        </ol>
        {tapped != null && <a className="btn btn-gold bs-open" href={href(tapped)} onClick={(e) => onPick?.(tapped, e, originOf(tapped))}>{fill(t.floorN, { n: tapped })} →</a>}
      </nav>
    </div>
  );
}
