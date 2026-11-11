'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import type { Building, Unit } from '@/lib/units';
import { FACADE, toPoints, bbox } from '@/lib/facade';
import { EX, fill, m2, statusLabel, unitLabel, explorerPath, floorSummary, floorAvail, parseAt, pathOf as pathFor, type At } from '@/lib/explorer';
import { beds } from '@/lib/explorer';
export type { At } from '@/lib/explorer';
const pathOf = pathFor;
import Plate, { bboxOf } from './Plate';
import UnitView, { UnitCard, type Settings } from './UnitView';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The apartment explorer: building → floor → apartment, plus a filterable list. One client component, so moving
 * between the steps is an animated transition rather than a page load; every step has its own URL (shareable,
 * back button works) and the server renders the same step for that URL.
 */
export default function Explorer({ lang, units, building, settings, initial, tag }: {
  lang: Lang; units: Unit[]; building: Building; settings: Settings; initial: At; tag?: string;
}) {
  const t = EX[lang];
  const codes = useMemo(() => new Set(units.map((u) => u.code)), [units]);
  const byCode = useMemo(() => new Map(units.map((u) => [u.code, u])), [units]);
  const [at, setAt] = useState<At>(initial);
  const [leaving, setLeaving] = useState<{ origin: string } | null>(null);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [hoverUnit, setHoverUnit] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const levels = building.levels;
  const summaries = useMemo(() => levels.map((l) => floorSummary(units, l)), [levels, units]);

  // back / forward
  useEffect(() => {
    const onPop = () => setAt(parseAt(new URL(location.href), codes));
    window.addEventListener('popstate', onPop);
    // old links from the previous viewer (#rvs/r1/3-7) land on the apartment
    if (location.hash.startsWith('#rvs/')) { const a = parseAt(new URL(location.href), codes); if (a.view === 'unit') { history.replaceState(history.state, '', pathOf(lang, a)); setAt(a); } }
    return () => window.removeEventListener('popstate', onPop);
  }, [codes, lang]);

  const go = useCallback((to: At, e?: React.MouseEvent, origin?: string) => {
    if (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // new tab keeps working
      e.preventDefault();
    }
    const commit = () => {
      history.pushState(history.state, '', pathOf(lang, to));
      setAt(to);
      setLeaving(null);
      setHoverUnit(null);
      setHoverFloor(null);
      const top = root.current ? root.current.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84) : 0;
      if (window.scrollY > top + 4) window.scrollTo({ top: Math.max(0, top), behavior: 'instant' as ScrollBehavior });
    };
    if (origin && !reduced()) { setLeaving({ origin }); window.setTimeout(commit, 420); }
    else commit();
  }, [lang]);

  const link = useCallback((to: { floor?: number; code?: string }) => explorerPath(lang, to), [lang]);
  const goTo = useCallback((to: { view: 'building' | 'floor' | 'unit'; floor?: number; code?: string }, e?: React.MouseEvent) => go(to, e), [go]);

  const unit = at.view === 'unit' && at.code ? byCode.get(at.code) : undefined;
  const floor = at.view === 'floor' ? building.floors.find((f) => f.level === at.floor) : undefined;
  const step = at.view === 'building' ? 1 : at.view === 'floor' ? 2 : at.view === 'unit' ? 3 : 0;
  const view = at.view === 'unit' && !unit ? 'building' : at.view === 'floor' && !floor ? 'building' : at.view;

  return (
    <div ref={root} className={'ex is-' + view} data-lenis-prevent={view === 'floor' || view === 'building' ? undefined : undefined}>
      <div className="ex-top">
        <div className="wrap wrap-wide ex-top-in">
          <ol className="ex-steps" aria-label={t.title}>
            {[t.step1, t.step2, t.step3].map((s, k) => {
              const n = k + 1;
              const can = n < step;
              const target: At = n === 1 ? { view: 'building' } : { view: 'floor', floor: unit?.floor ?? at.floor };
              return (
                <li key={s} className={(n === step ? 'is-on' : '') + (n < step ? ' is-done' : '')} aria-current={n === step ? 'step' : undefined}>
                  {can ? <a href={pathOf(lang, target)} onClick={(e) => go(target, e)}><i>{String(n).padStart(2, '0')}</i>{s}</a> : <span><i>{String(n).padStart(2, '0')}</i>{s}</span>}
                </li>
              );
            })}
          </ol>
          <div className="ex-modes" role="group">
            <a href={pathOf(lang, { view: 'building' })} aria-current={view !== 'list' ? 'true' : undefined} onClick={(e) => go({ view: 'building' }, e)}>{t.visual}</a>
            <a href={pathOf(lang, { view: 'list' })} aria-current={view === 'list' ? 'true' : undefined} onClick={(e) => go({ view: 'list' }, e)}>{t.list}</a>
          </div>
        </div>
      </div>

      {view === 'building' && (
        <section className="ex-app ex-enter" aria-labelledby="ex-b-title" key="building">
          <div className={'ex-stage ex-bstage' + (leaving ? ' is-leaving' : '')} style={leaving ? { transformOrigin: leaving.origin } : undefined}>
            <div className="ex-ambient" aria-hidden="true"><Image src={FACADE.image} alt="" fill sizes="40vw" quality={30} /></div>
            <div className="ex-facade" style={{ aspectRatio: `${FACADE.w} / ${FACADE.h}` }}>
              <Image src={FACADE.image} alt="" fill sizes="(min-width: 1100px) 70vw, 100vw" priority quality={84} />
              <svg viewBox={`0 0 ${FACADE.w} ${FACADE.h}`} preserveAspectRatio="none" className={'ex-fsvg' + (hoverFloor != null ? ' has-on' : '')} role="group" aria-label={building.name}>
                {FACADE.floors.filter((z) => levels.includes(z.level)).map((z) => {
                  const s = summaries.find((x) => x.level === z.level)!;
                  const b = bbox(z.pts);
                  const origin = `${(((b.x0 + b.x1) / 2) * 100).toFixed(1)}% ${(((b.y0 + b.y1) / 2) * 100).toFixed(1)}%`;
                  return (
                    <a key={z.level} href={pathOf(lang, { view: 'floor', floor: z.level })} className={'ex-fz' + (hoverFloor === z.level ? ' is-on' : '')}
                      aria-label={`${fill(t.floorN, { n: z.level })}, ${floorAvail(s, lang)}`}
                      onMouseEnter={() => setHoverFloor(z.level)} onMouseLeave={() => setHoverFloor(null)} onFocus={() => setHoverFloor(z.level)} onBlur={() => setHoverFloor(null)}
                      onClick={(e) => go({ view: 'floor', floor: z.level }, e, origin)}>
                      <polygon points={toPoints(z.pts, FACADE.w, FACADE.h)} />
                    </a>
                  );
                })}
              </svg>
              {hoverFloor != null && (() => {
                const z = FACADE.floors.find((x) => x.level === hoverFloor)!;
                const s = summaries.find((x) => x.level === hoverFloor)!;
                const b = bbox(z.pts);
                return (
                  <div className="bp-pin" style={{ left: `${((b.x0 + b.x1) / 2) * 100}%`, top: `${b.y0 * 100}%` }} aria-hidden="true">
                    <b>{fill(t.floorN, { n: hoverFloor })}</b><span>{floorAvail(s, lang)} · {fill(t.areaRange, { a: Math.round(s.min), b: Math.round(s.max) })}</span>
                  </div>
                );
              })()}
              {tag && <span className="ill-tag">{tag}</span>}
            </div>
          </div>
          <div className="ex-panel">
            <p className="label ex-eyebrow">{t.step1}</p>
            <h1 id="ex-b-title" className="ex-title">{building.name.split(' ')[0]} <em>{building.name.split(' ').slice(1).join(' ')}</em></h1>
            <p className="ex-lead">{t.intro}</p>
            <ol className="bp-floors ex-floors">
              {summaries.slice().reverse().map((s) => {
                const z = FACADE.floors.find((x) => x.level === s.level);
                const b = z ? bbox(z.pts) : null;
                const origin = b ? `${(((b.x0 + b.x1) / 2) * 100).toFixed(1)}% ${(((b.y0 + b.y1) / 2) * 100).toFixed(1)}%` : undefined;
                return (
                  <li key={s.level}>
                    <a href={pathOf(lang, { view: 'floor', floor: s.level })} className={'bp-row' + (hoverFloor === s.level ? ' is-on' : '')}
                      onMouseEnter={() => setHoverFloor(s.level)} onMouseLeave={() => setHoverFloor(null)} onFocus={() => setHoverFloor(s.level)} onBlur={() => setHoverFloor(null)}
                      onClick={(e) => go({ view: 'floor', floor: s.level }, e, origin)}>
                      <span className="bp-n">{String(s.level).padStart(2, '0')}</span>
                      <span className="bp-l">{fill(t.floorN, { n: s.level })}<small>{fill(t.areaRange, { a: Math.round(s.min), b: Math.round(s.max) })}</small></span>
                      <span className="bp-a">{floorAvail(s, lang)}</span>
                      <span className="bp-go" aria-hidden="true">→</span>
                    </a>
                  </li>
                );
              })}
              <li><span className="bp-row is-off"><span className="bp-n">00</span><span className="bp-l">{t.ground}<small>{t.groundNote}</small></span><span className="bp-a" /><span className="bp-go" /></span></li>
            </ol>
          </div>
        </section>
      )}

      {view === 'floor' && floor && (
        <FloorView key={'f' + floor.level} lang={lang} floor={floor} units={units} building={building} hover={hoverUnit} setHover={setHoverUnit}
          leaving={leaving} go={go} pathOf={(a) => pathOf(lang, a)} />
      )}

      {view === 'unit' && unit && (
        <div className="ex-enter ex-flow" key={'u' + unit.code}>
          <UnitView unit={unit} units={units} building={building} lang={lang} settings={settings} tag={tag} go={goTo} link={link} />
        </div>
      )}

      {view === 'list' && (
        <ListView key="list" lang={lang} units={units} levels={levels} initialType={at.type} go={go} pathOf={(a) => pathOf(lang, a)} />
      )}
    </div>
  );
}

function FloorView({ lang, floor, units, building, hover, setHover, leaving, go, pathOf }: {
  lang: Lang; floor: Building['floors'][number]; units: Unit[]; building: Building; hover: string | null; setHover: (c: string | null) => void;
  leaving: { origin: string } | null; go: (to: At, e?: React.MouseEvent, origin?: string) => void; pathOf: (a: At) => string;
}) {
  const t = EX[lang];
  const own = units.filter((u) => u.floor === floor.level && u.building === building.id);
  const map = new Map(own.map((u) => [u.code, u]));
  const s = floorSummary(units, floor.level);
  const statuses = Array.from(new Set(own.map((u) => u.status)));
  const originOf = (code: string) => {
    const sh = floor.shapes.find((x) => x.unit === code);
    if (!sh) return undefined;
    const b = bboxOf(sh.pts);
    return `${(((b.x0 + b.x1) / 2) * 100).toFixed(1)}% ${(((b.y0 + b.y1) / 2) * 100).toFixed(1)}%`;
  };
  const hu = hover ? map.get(hover) : undefined;
  return (
    <section className="ex-app ex-enter" aria-labelledby="ex-f-title">
      <div className={'ex-stage ex-fstage' + (leaving ? ' is-leaving' : '')} style={leaving ? { transformOrigin: leaving.origin } : undefined}>
        <nav className="ex-rail" aria-label={t.floorsShort}>
          {building.levels.slice().reverse().map((l) => (
            <a key={l} href={pathOf({ view: 'floor', floor: l })} aria-current={l === floor.level ? 'true' : undefined} onClick={(e) => go({ view: 'floor', floor: l }, e)}>{l}</a>
          ))}
          <span className="is-off" title={t.ground}>P</span>
        </nav>
        <div className="ex-plate">
          <Plate floor={floor} units={map} hover={hover} onHover={setHover}
            href={(u) => pathOf({ view: 'unit', code: u.code })}
            onPick={(u, e) => go({ view: 'unit', code: u.code }, e, originOf(u.code))}
            ariaLabel={fill(t.floorN, { n: floor.level })}
            unitName={(u) => `${fill(t.apartmentN, { c: unitLabel(u) })}, ${m2(u.area, lang)}, ${statusLabel(u.status, lang)}`} />
          <div className={'ex-tip' + (hu ? ' is-on' : '')} aria-live="polite">
            {hu ? <><b>{fill(t.apartmentN, { c: unitLabel(hu) })}</b><span>{hu.type ? fill(t.typeN, { t: hu.type }) + ' · ' : ''}{m2(hu.area, lang)} · {beds(hu.bedrooms, lang)}</span><span className={'pill st-' + hu.status}>{statusLabel(hu.status, lang)}</span></> : <span className="ex-tip-hint">{t.pickUnit}</span>}
          </div>
          <ul className="ex-legend" aria-hidden="true">
            {statuses.map((st) => <li key={st}><i className={'sw st-' + st} />{statusLabel(st, lang)}</li>)}
            <li className="ex-north">N ↑</li>
          </ul>
        </div>
      </div>
      <div className="ex-panel">
        <a className="ex-back" href={pathOf({ view: 'building' })} onClick={(e) => go({ view: 'building' }, e)}><span aria-hidden="true">←</span> {t.backToBuilding}</a>
        <p className="label ex-eyebrow">{building.name}</p>
        <h1 id="ex-f-title" className="ex-title">{floor.level}. <em>{lang === 'bs' ? 'sprat' : 'floor'}</em></h1>
        <p className="ex-lead">{floorAvail(s, lang)} · {fill(t.areaRange, { a: Math.round(s.min), b: Math.round(s.max) })}</p>
        <ul className="ex-units">
          {own.map((u) => (
            <li key={u.code}>
              <a href={pathOf({ view: 'unit', code: u.code })} className={'ex-u' + (hover === u.code ? ' is-on' : '')}
                onMouseEnter={() => setHover(u.code)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(u.code)} onBlur={() => setHover(null)}
                onClick={(e) => go({ view: 'unit', code: u.code }, e, originOf(u.code))}>
                <span className="ex-u-c">{unitLabel(u)}</span>
                <span className="ex-u-t">{u.type ? fill(t.typeN, { t: u.type }) : ''}<small>{beds(u.bedrooms, lang)}</small></span>
                <span className="ex-u-a">{m2(u.area, lang)}</span>
                <span className={'dot st-' + u.status} title={statusLabel(u.status, lang)} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Sort = 'floor' | 'up' | 'down';

function ListView({ lang, units, levels, initialType, go, pathOf }: {
  lang: Lang; units: Unit[]; levels: number[]; initialType?: string; go: (to: At, e?: React.MouseEvent) => void; pathOf: (a: At) => string;
}) {
  const t = EX[lang];
  const [beds, setBeds] = useState<number | null>(null);
  const [lvl, setLvl] = useState<number | null>(null);
  const [type, setType] = useState<string | null>(initialType || null);
  const [free, setFree] = useState(false);
  const [sort, setSort] = useState<Sort>('floor');
  const bedOpts = Array.from(new Set(units.map((u) => u.bedrooms))).sort((a, b) => a - b);
  const typeOpts = (Array.from(new Set(units.map((u) => u.type).filter(Boolean))) as string[]).sort();
  const known = units.some((u) => u.status !== 'unknown');
  const shown = units
    .filter((u) => (beds == null || u.bedrooms === beds) && (lvl == null || u.floor === lvl) && (!type || u.type === type) && (!free || u.status === 'available'))
    .sort((a, b) => (sort === 'up' ? a.area - b.area : sort === 'down' ? b.area - a.area : a.floor - b.floor || a.no - b.no));
  const reset = () => { setBeds(null); setLvl(null); setType(null); setFree(false); };
  return (
    <section className="ex-list ex-enter ex-flow" aria-labelledby="ex-l-title">
      <div className="wrap wrap-wide">
        <div className="ex-l-head">
          <h1 id="ex-l-title" className="ex-title">{lang === 'bs' ? <>Svi <em>stanovi</em></> : <>All <em>apartments</em></>}<sup>{shown.length}</sup></h1>
          <label className="ex-sort"><span className="label">{t.sort}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="floor">{t.sortFloor}</option><option value="up">{t.sortAreaUp}</option><option value="down">{t.sortAreaDown}</option>
            </select>
          </label>
        </div>
        <div className="ex-filters">
          <div className="ex-fg"><span className="label">{t.bedrooms}</span>
            <div className="chips"><button type="button" className="chip" aria-pressed={beds == null} onClick={() => setBeds(null)}>{t.any}</button>{bedOpts.map((n) => <button type="button" key={n} className="chip" aria-pressed={beds === n} onClick={() => setBeds(n)}>{n}</button>)}</div>
          </div>
          <div className="ex-fg"><span className="label">{t.floor}</span>
            <div className="chips"><button type="button" className="chip" aria-pressed={lvl == null} onClick={() => setLvl(null)}>{t.allFloors}</button>{levels.map((n) => <button type="button" key={n} className="chip" aria-pressed={lvl === n} onClick={() => setLvl(n)}>{n}</button>)}</div>
          </div>
          <div className="ex-fg"><span className="label">{t.type}</span>
            <div className="chips"><button type="button" className="chip" aria-pressed={!type} onClick={() => setType(null)}>{t.any}</button>{typeOpts.map((x) => <button type="button" key={x} className="chip" aria-pressed={type === x} onClick={() => setType(x)}>{x}</button>)}</div>
          </div>
          <div className="ex-fg ex-fg-end">
            {known && <label className="ex-check"><input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} /> {t.onlyFree}</label>}
            <button type="button" className="link-line" onClick={reset}>{t.reset}</button>
          </div>
        </div>
        <p className="ex-count" role="status">{fill(t.results, { n: shown.length })}</p>
        {shown.length ? (
          <ul className="cards ex-cards">
            {shown.map((u) => <li key={u.code}><UnitCard u={u} lang={lang} href={pathOf({ view: 'unit', code: u.code })} onClick={(e) => go({ view: 'unit', code: u.code }, e)} /></li>)}
          </ul>
        ) : <p className="ex-empty">{t.noResults}</p>}
        <p className="uv-note ex-disc">{t.disclaimer}</p>
      </div>
    </section>
  );
}
