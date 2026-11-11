'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import type { Building, Unit } from '@/lib/units';
import { isEnquirable } from '@/lib/units';
import { EX, fill, m2, statusLabel, unitLabel, price as fmtPrice } from '@/lib/explorer';
import { beds } from '@/lib/explorer';
import Plate, { Section } from './Plate';
import Enquiry from './Enquiry';

// Interior visualisations shown with an apartment, chosen by size (they illustrate the finish, not this unit).
const MOOD_SMALL = ['/riverina/enterijer/enterijer-1.webp', '/riverina/enterijer/enterijer-7.webp', '/riverina/enterijer/enterijer-6.webp', '/riverina/enterijer/enterijer-9.webp'];
const MOOD_LARGE = ['/riverina/enterijer/enterijer-5.webp', '/riverina/enterijer/enterijer-4.webp', '/riverina/enterijer/enterijer-8.webp', '/riverina/enterijer/enterijer-19.webp'];

export type Settings = { currency: string; showPrice: boolean; phone: string };

export default function UnitView({ unit: u, units, building, lang, settings, tag, go, link }: {
  unit: Unit; units: Unit[]; building: Building; lang: Lang; settings: Settings; tag?: string;
  go: (to: { view: 'building' | 'floor' | 'unit'; floor?: number; code?: string }, e?: React.MouseEvent) => void;
  link: (to: { floor?: number; code?: string }) => string;
}) {
  const t = EX[lang];
  const [mode, setMode] = useState<'2d' | '3d'>(u.plan ? '2d' : '3d');
  const [zoom, setZoom] = useState(false);
  const [ask, setAsk] = useState(false);
  const [copied, setCopied] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  useEffect(() => { setMode(u.plan ? '2d' : '3d'); setAsk(false); }, [u.code, u.plan]);

  const floorUnits = units.filter((x) => x.building === u.building && x.floor === u.floor);
  const i = floorUnits.findIndex((x) => x.code === u.code);
  const prev = floorUnits[(i - 1 + floorUnits.length) % floorUnits.length];
  const next = floorUnits[(i + 1) % floorUnits.length];
  const plan = building.floors.find((f) => f.level === u.floor);
  const map = useMemo(() => new Map(floorUnits.map((x) => [x.code, x])), [floorUnits]);
  const similar = useMemo(() => {
    const others = units.filter((x) => x.code !== u.code);
    const same = others.filter((x) => x.type && x.type === u.type);
    const near = others.filter((x) => x.bedrooms === u.bedrooms && x.type !== u.type);
    const rank = (x: Unit) => (x.status === 'available' ? 0 : x.status === 'unknown' ? 1 : 2) * 100 + Math.abs(x.floor - u.floor);
    return [...same.sort((a, b) => rank(a) - rank(b)), ...near.sort((a, b) => rank(a) - rank(b))]
      .filter((x, k, arr) => arr.findIndex((y) => y.type === x.type && y.floor === x.floor) === k)
      .slice(0, 3);
  }, [units, u]);
  const mood = u.bedrooms >= 2 ? MOOD_LARGE : MOOD_SMALL;
  const floorName = fill(t.floorN, { n: u.floor });
  const p = settings.showPrice && u.status === 'available' ? fmtPrice(u, lang, settings.currency) : '';
  const total = u.rooms.reduce((s, r) => s + r.area, 0);
  const name = (x: Unit) => fill(t.apartmentN, { c: unitLabel(x) });

  const facts: [string, string][] = [
    [t.floor, floorName],
    [t.bedrooms, String(u.bedrooms)],
    u.bathrooms ? [t.bathrooms, String(u.bathrooms)] : null,
    u.outdoor ? [u.outdoor.kind === 'loggia' ? t.loggia : t.terrace, m2(u.outdoor.area, lang)] : null,
    u.orientation ? [t.orientation, u.orientation] : null,
    p ? [t.price, p] : null,
  ].filter(Boolean) as [string, string][];

  // 3D view: the drawing leans a little toward the pointer (fine pointers only)
  const onTilt = (e: React.PointerEvent) => {
    const el = tilt.current;
    if (!el || e.pointerType !== 'mouse' || mode !== '3d') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* no clipboard */ }
  };
  const img = mode === '3d' ? u.plan3d : u.plan;

  return (
    <article className="uv" aria-labelledby="uv-title">
      <div className="wrap wrap-wide">
        <nav className="uv-bar" aria-label={t.apartment}>
          <ol className="crumbs">
            <li><a href={link({})} onClick={(e) => go({ view: 'building' }, e)}>{building.name}</a></li>
            <li><a href={link({ floor: u.floor })} onClick={(e) => go({ view: 'floor', floor: u.floor }, e)}>{floorName}</a></li>
            <li aria-current="page">{name(u)}</li>
          </ol>
          <div className="uv-step">
            <a className="round" href={link({ code: prev.code })} onClick={(e) => go({ view: 'unit', code: prev.code }, e)} aria-label={`${t.prevUnit}: ${name(prev)}`}><span aria-hidden="true">←</span></a>
            <span className="uv-count">{String(i + 1).padStart(2, '0')} / {String(floorUnits.length).padStart(2, '0')}</span>
            <a className="round" href={link({ code: next.code })} onClick={(e) => go({ view: 'unit', code: next.code }, e)} aria-label={`${t.nextUnit}: ${name(next)}`}><span aria-hidden="true">→</span></a>
          </div>
        </nav>

        <div className="uv-grid">
          <div className="uv-main">
            <div className="uv-stage">
              <div className="uv-toggle" role="tablist" aria-label={t.plan2d + ' / ' + t.plan3d}>
                {u.plan && <button type="button" role="tab" aria-selected={mode === '2d'} onClick={() => setMode('2d')}>{t.plan2d}</button>}
                {u.plan3d && <button type="button" role="tab" aria-selected={mode === '3d'} onClick={() => setMode('3d')}>{t.plan3d}</button>}
              </div>
              <button type="button" className="round uv-zoom" onClick={() => setZoom(true)} aria-label={t.enlarge}><span aria-hidden="true">⤢</span></button>
              <div ref={tilt} className={'uv-plan is-' + mode} onPointerMove={onTilt} onPointerLeave={() => { tilt.current?.style.setProperty('--rx', '0deg'); tilt.current?.style.setProperty('--ry', '0deg'); }}>
                {u.plan && <Image key={'2d' + u.code} src={u.plan} alt={`${name(u)}, ${t.plan2d}`} fill sizes="(min-width: 1100px) 60vw, 100vw" className={'uv-img is-2d' + (mode === '2d' ? ' is-on' : '')} priority />}
                {u.plan3d && <Image key={'3d' + u.code} src={u.plan3d} alt={`${name(u)}, ${t.plan3d}`} fill sizes="(min-width: 1100px) 60vw, 100vw" className={'uv-img is-3d' + (mode === '3d' ? ' is-on' : '')} />}
              </div>
              {mode === '3d' && tag && <span className="ill-tag">{tag}</span>}
            </div>

            <div className="uv-key">
              <div className="uv-key-plan">
                <p className="label">{t.keyPlan}</p>
                {plan && <Plate floor={plan} units={map} active={u.code} mini ariaLabel={`${t.keyPlan}: ${floorName}, ${name(u)}`} />}
              </div>
              <div className="uv-key-sec">
                <Section levels={building.levels} current={u.floor} ground="P" label={`${building.name}, ${floorName}`} />
              </div>
            </div>
          </div>

          <aside className="uv-card" aria-label={name(u)}>
            <div className="uv-card-in">
              <p className="uv-type">{u.type ? fill(t.typeN, { t: u.type }) : building.name}<span className={'pill st-' + u.status}>{statusLabel(u.status, lang)}</span></p>
              <h1 id="uv-title" className="uv-title">{t.apartment} <em>{unitLabel(u)}</em></h1>
              <p className="uv-area">{m2(u.area, lang)}</p>
              <dl className="uv-facts">
                {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
              <div className="uv-actions">
                {isEnquirable(u) || u.status === 'reserved'
                  ? <button type="button" className="btn btn-dark uv-ask" onClick={() => setAsk(true)}>{t.enquire}<span className="arr" aria-hidden="true">→</span></button>
                  : <a className="btn btn-dark uv-ask" href={link({ floor: u.floor })} onClick={(e) => go({ view: 'floor', floor: u.floor }, e)}>{t.backToFloor}</a>}
                <div className="uv-links">
                  {u.pdf && <a className="link-line" href={u.pdf} target="_blank" rel="noopener">{t.pdf}</a>}
                  {settings.phone && <a className="link-line" href={'tel:' + settings.phone.replace(/[^\d+]/g, '')}>{t.call}</a>}
                  <button type="button" className="link-line uv-share" onClick={share}>{copied ? t.copied : t.share}</button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {u.rooms.length > 0 && (
          <section className="uv-rooms" aria-labelledby="uv-rooms-title">
            <h2 id="uv-rooms-title" className="uv-h2">{t.roomSchedule.split(' ')[0]} <em>{t.roomSchedule.split(' ').slice(1).join(' ')}</em></h2>
            <div>
              <table className="rooms">
                <tbody>
                  {u.rooms.map((r, k) => (
                    <tr key={k}><th scope="row"><span className="rooms-n">{String(k + 1).padStart(2, '0')}</span>{lang === 'bs' ? r.bs : r.en}</th><td>{m2(r.area, lang)}</td></tr>
                  ))}
                </tbody>
                <tfoot><tr><th scope="row">{t.total}</th><td>{m2(total || u.area, lang)}</td></tr></tfoot>
              </table>
              <p className="uv-note">{t.disclaimer}</p>
            </div>
          </section>
        )}
      </div>

      <section className="uv-mood" aria-labelledby="uv-mood-title">
        <div className="wrap wrap-wide uv-mood-head">
          <h2 id="uv-mood-title" className="uv-h2">{t.gallery}</h2>
          <p className="uv-note">{t.galleryNote}</p>
        </div>
        <ul className="uv-mood-row" data-lenis-prevent>
          {mood.map((src, k) => (
            <li key={src} className={'uv-mood-i n-' + k}><Image src={src} alt="" fill sizes="(min-width: 900px) 34vw, 80vw" /></li>
          ))}
        </ul>
      </section>

      {similar.length > 0 && (
        <section className="wrap wrap-wide uv-similar" aria-labelledby="uv-sim-title">
          <div className="sec-head">
            <h2 id="uv-sim-title" className="uv-h2">{t.similar}</h2>
            <p className="sec-aside">{t.similarText}</p>
          </div>
          <ul className="cards">
            {similar.map((x) => <li key={x.code}><UnitCard u={x} lang={lang} href={link({ code: x.code })} onClick={(e) => go({ view: 'unit', code: x.code }, e)} /></li>)}
          </ul>
        </section>
      )}

      <Enquiry open={ask} onClose={() => setAsk(false)} lang={lang} closeLabel={t.close}
        title={fill(t.enquireTitle, { c: unitLabel(u) })} text={t.enquireText}
        unit={u.code} building={u.building}
        message={fill(t.enquireMsg, { c: unitLabel(u), f: floorName, a: m2(u.area, lang) })}
        summary={<p className="sheet-sum"><span>{u.type ? fill(t.typeN, { t: u.type }) : ''}</span><span>{floorName}</span><span>{m2(u.area, lang)}</span><span>{beds(u.bedrooms, lang)}</span></p>} />

      {zoom && img && (
        <div className="zoom" role="dialog" aria-modal="true" aria-label={name(u)} onClick={() => setZoom(false)} onKeyDown={(e) => e.key === 'Escape' && setZoom(false)}>
          <img src={img} alt={name(u)} />
          <button type="button" className="round zoom-x" autoFocus onClick={() => setZoom(false)} aria-label={t.close}><span aria-hidden="true">✕</span></button>
        </div>
      )}
    </article>
  );
}

/** Apartment card: plan on a sand panel, figures under it. Used in the list and for similar apartments. */
export function UnitCard({ u, lang, href, onClick }: { u: Unit; lang: Lang; href: string; onClick?: (e: React.MouseEvent) => void }) {
  const t = EX[lang];
  return (
    <a className={'uc st-' + u.status} href={href} onClick={onClick}>
      <div className="uc-plan">
        <span className="uc-top"><b>{fill(t.apartmentN, { c: unitLabel(u) })}</b><span>{fill(t.floorN, { n: u.floor })}</span></span>
        {u.plan && <Image src={u.plan} alt="" fill sizes="(min-width: 900px) 26vw, 90vw" />}
      </div>
      <div className="uc-body">
        <p className="uc-area">{m2(u.area, lang)}</p>
        <p className="uc-meta">{u.type && <span>{fill(t.typeN, { t: u.type })}</span>}<span>{beds(u.bedrooms, lang)}</span></p>
        <p className="uc-foot"><span className={'pill st-' + u.status}>{statusLabel(u.status, lang)}</span><span className="uc-go">{t.view} →</span></p>
      </div>
    </a>
  );
}
