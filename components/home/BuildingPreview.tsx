'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import { FACADE, toPoints, bbox } from '@/lib/facade';
import { EX, fill, explorerPath, floorAvail, type FloorSummary } from '@/lib/explorer';
import { Rich } from './text';

/**
 * Home: the building as a way in. The render carries one zone per floor; pointing at a floor (or its row in the
 * list) lights it and tells how many apartments it has and in what sizes. Choosing it opens the explorer on that
 * floor, so the visitor continues exactly where the preview left off.
 */
export default function BuildingPreview({ lang, title, text, floors, buildingName, tag }: { lang: Lang; title: string; text: string; floors: FloorSummary[]; buildingName: string; tag?: string }) {
  const t = EX[lang];
  const [on, setOn] = useState<number | null>(null);
  const [locked, setLocked] = useState<number | null>(null);
  const cur = on ?? locked;
  const byLevel = new Map(floors.map((f) => [f.level, f]));
  const zones = FACADE.floors.filter((z) => byLevel.has(z.level));
  const active = cur != null ? byLevel.get(cur) : null;
  const zone = cur != null ? zones.find((z) => z.level === cur) : null;
  const pin = zone ? bbox(zone.pts) : null;
  const range = (f: FloorSummary) => fill(t.areaRange, { a: Math.round(f.min), b: Math.round(f.max) });

  // touch: the first tap shows the floor, the second opens it
  const onZone = (level: number, e: React.MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches && locked !== level) { e.preventDefault(); setLocked(level); }
  };

  return (
    <section id="zgrada" className="bp" aria-labelledby="bp-title">
      <div className="wrap wrap-wide bp-grid">
        <div className="bp-stage" data-reveal="clip">
          <div className="bp-frame" style={{ aspectRatio: `${FACADE.w} / ${FACADE.h}` }}>
            <Image src={FACADE.image} alt="" fill sizes="(min-width: 1000px) 64vw, 100vw" quality={82} className="bp-img" />
            <svg className={'bp-svg' + (cur != null ? ' has-on' : '')} viewBox={`0 0 ${FACADE.w} ${FACADE.h}`} preserveAspectRatio="none" role="group" aria-label={buildingName}>
              <polygon className="bp-ground" points={toPoints(FACADE.ground, FACADE.w, FACADE.h)} />
              {zones.map((z) => {
                const f = byLevel.get(z.level)!;
                return (
                  <a key={z.level} href={explorerPath(lang, { floor: z.level })} className={'bp-zone' + (cur === z.level ? ' is-on' : '')}
                    aria-label={`${fill(t.floorN, { n: z.level })}, ${floorAvail(f, lang)}`}
                    onMouseEnter={() => setOn(z.level)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(z.level)} onBlur={() => setOn(null)}
                    onClick={(e) => onZone(z.level, e)}>
                    <polygon points={toPoints(z.pts, FACADE.w, FACADE.h)} />
                  </a>
                );
              })}
            </svg>
            {active && pin && (
              <div className="bp-pin" style={{ left: `${(((pin.x0 + pin.x1) / 2) * 100).toFixed(2)}%`, top: `${(pin.y0 * 100).toFixed(2)}%` }} aria-hidden="true">
                <b>{fill(t.floorN, { n: active.level })}</b>
                <span>{floorAvail(active, lang)}</span>
              </div>
            )}
            <span className="bp-hint label" aria-hidden="true"><i />{t.hoverHint}</span>
            {tag && <span className="ill-tag">{tag}</span>}
          </div>
        </div>

        <div className="bp-side">
          <p className="label bp-eyebrow" data-reveal="fade">{buildingName}</p>
          <h2 id="bp-title" className="bp-title" data-reveal="up"><Rich text={title} /></h2>
          <p className="bp-text" data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>{text}</p>
          <ol className="bp-floors" data-reveal="up" style={{ '--i': 2 } as React.CSSProperties}>
            {floors.slice().reverse().map((f) => (
              <li key={f.level}>
                <a href={explorerPath(lang, { floor: f.level })} className={'bp-row' + (cur === f.level ? ' is-on' : '')}
                  onMouseEnter={() => setOn(f.level)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(f.level)} onBlur={() => setOn(null)}>
                  <span className="bp-n">{String(f.level).padStart(2, '0')}</span>
                  <span className="bp-l">{fill(t.floorN, { n: f.level })}<small>{range(f)}</small></span>
                  <span className="bp-a">{floorAvail(f, lang)}</span>
                  <span className="bp-go" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
            <li>
              <span className="bp-row is-off">
                <span className="bp-n">00</span>
                <span className="bp-l">{t.ground}<small>{t.groundNote}</small></span>
                <span className="bp-a" />
                <span className="bp-go" />
              </span>
            </li>
          </ol>
          <a className="btn btn-dark bp-cta" href={explorerPath(lang)} data-magnetic>{t.open}<span className="arr" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
