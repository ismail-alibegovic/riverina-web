'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import type { Building, Unit } from '@/lib/units';
import { EX, fill, m2, beds, statusLabel, unitLabel, explorerPath, floorSummary, floorAvail, parseAt, pathOf as pathFor, type At } from '@/lib/explorer';
import Plate, { bboxOf } from './Plate';
import BuildingStage from './BuildingStage';
import UnitView, { UnitCard, type Settings } from './UnitView';
export type { At } from '@/lib/explorer';
const pathOf = pathFor;

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The apartment explorer: building → floor → apartment, plus a filterable list. One client component, so moving
 * between the steps is a transition rather than a page load: the building zooms into the chosen floor, the floor
 * into the chosen apartment. Every step has its own URL (shareable, back button works) and the server renders the
 * same step for that URL.
 */
export default function Explorer({ lang, units, building, settings, initial, tag }: {
  lang: Lang; units: Unit[]; building: Building; settings: Settings; initial: At; tag?: string;
}) {
  const t = EX[lang];
  const codes = useMemo(() => new Set(units.map((u) => u.code)), [units]);
  const byCode = useMemo(() => new Map(units.map((u) => [u.code, u])), [units]);
  const [at, setAt] = useState<At>(initial);
  const [leaving, setLeaving] = useState<{ origin: string } | null>(null);
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
      const top = root.current ? root.current.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84) : 0;
      if (window.scrollY > top + 4) window.scrollTo({ top: Math.max(0, top), behavior: 'instant' as ScrollBehavior });
    };
    if (origin && !reduced()) { setLeaving({ origin }); window.setTimeout(commit, 520); }
    else commit();
  }, [lang]);

  const link = useCallback((to: { floor?: number; code?: string }) => explorerPath(lang, to), [lang]);
  const goTo = useCallback((to: { view: 'building' | 'floor' | 'unit'; floor?: number; code?: string }, e?: React.MouseEvent) => go(to, e), [go]);

  const unit = at.view === 'unit' && at.code ? byCode.get(at.code) : undefined;
  const floor = at.view === 'floor' ? building.floors.find((f) => f.level === at.floor) : undefined;
  const view = at.view === 'unit' && !unit ? 'building' : at.view === 'floor' && !floor ? 'building' : at.view === 'building' && !building.facade ? 'list' : at.view;
  const fl = unit?.floor ?? floor?.level;

  // one quiet line of navigation instead of a toolbar: where you are, and the other way to look (building / list)
  const nav = (
    <div className="ex-nav">
      <ol className="ex-crumbs">
        <li><a href={pathOf(lang, { view: 'building' })} onClick={(e) => go({ view: 'building' }, e)} aria-current={view === 'building' ? 'page' : undefined}>{building.name}</a></li>
        {fl != null && view !== 'list' && <li><a href={pathOf(lang, { view: 'floor', floor: fl })} onClick={(e) => go({ view: 'floor', floor: fl }, e)} aria-current={view === 'floor' ? 'page' : undefined}>{fill(t.floorN, { n: fl })}</a></li>}
        {unit && view === 'unit' && <li aria-current="page">{fill(t.apartmentN, { c: unitLabel(unit) })}</li>}
        {view === 'list' && <li aria-current="page">{t.list}</li>}
      </ol>
      <div className="ex-modes">
        {building.facade && <a href={pathOf(lang, { view: 'building' })} aria-current={view !== 'list' ? 'true' : undefined} onClick={(e) => go({ view: 'building' }, e)}>{t.visual}</a>}
        <a href={pathOf(lang, { view: 'list' })} aria-current={view === 'list' ? 'true' : undefined} onClick={(e) => go({ view: 'list' }, e)}>{t.list}</a>
      </div>
    </div>
  );

  return (
    <div ref={root} className={'ex is-' + view}>
      {view === 'building' && building.facade && (
        <section className={'ex-building ex-enter' + (leaving ? ' is-leaving' : '')} aria-labelledby="ex-b-title" key="building" style={leaving ? { '--origin': leaving.origin } as React.CSSProperties : undefined}>
          <BuildingStage lang={lang} facade={building.facade} floors={summaries} plans={building.floors} units={units} tag={tag} priority
            className="is-explorer"
            onPick={(level, e, origin) => go({ view: 'floor', floor: level }, e, origin)}
            top={nav}
            intro={(
              <>
                <p className="label bs-eyebrow">{t.step1}</p>
                <h1 id="ex-b-title" className="bs-title">{building.name.split(' ')[0]} <em>{building.name.split(' ').slice(1).join(' ')}</em></h1>
                <p className="bs-text">{t.intro}</p>
              </>
            )} />
        </section>
      )}

      {view === 'floor' && floor && (
        <FloorView key={'f' + floor.level} lang={lang} floor={floor} units={units} building={building} hover={hoverUnit} setHover={setHoverUnit}
          leaving={leaving} go={go} pathOf={(a) => pathOf(lang, a)} nav={nav} />
      )}

      {view === 'unit' && unit && (
        <div className="ex-enter ex-flow" key={'u' + unit.code}>
          <div className="wrap wrap-wide">{nav}</div>
          <UnitView unit={unit} units={units} building={building} lang={lang} settings={settings} tag={tag} go={goTo} link={link} />
        </div>
      )}

      {view === 'list' && (
        <ListView key="list" lang={lang} units={units} levels={levels} initialType={at.type} go={go} pathOf={(a) => pathOf(lang, a)} nav={nav} />
      )}
    </div>
  );
}

/** The building in section, as a lift: one bar per level, the top floor set back, the current one in gold. */
function FloorRail({ lang, building, units, current, go, pathOf }: {
  lang: Lang; building: Building; units: Unit[]; current: number; go: (to: At, e?: React.MouseEvent) => void; pathOf: (a: At) => string;
}) {
  const t = EX[lang];
  const top = Math.max(...building.levels);
  return (
    <nav className="fr" aria-label={t.floorsShort}>
      {building.levels.slice().reverse().map((l) => {
        const s = floorSummary(units, l);
        return (
          <a key={l} href={pathOf({ view: 'floor', floor: l })} className={'fr-bar' + (l === top ? ' is-top' : '')} aria-current={l === current ? 'true' : undefined}
            onClick={(e) => go({ view: 'floor', floor: l }, e)} aria-label={`${fill(t.floorN, { n: l })}, ${floorAvail(s, lang)}`}>
            <span className="fr-n">{l}</span>
            <span className="fr-free" title={floorAvail(s, lang)}>{s.known ? s.free : s.total}</span>
          </a>
        );
      })}
      <span className="fr-bar is-ground" aria-hidden="true"><span className="fr-n">P</span></span>
    </nav>
  );
}

function FloorView({ lang, floor, units, building, hover, setHover, leaving, go, pathOf, nav }: {
  lang: Lang; floor: Building['floors'][number]; units: Unit[]; building: Building; hover: string | null; setHover: (c: string | null) => void;
  leaving: { origin: string } | null; go: (to: At, e?: React.MouseEvent, origin?: string) => void; pathOf: (a: At) => string; nav: React.ReactNode;
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
    <section className="ex-floor ex-enter" aria-labelledby="ex-f-title">
      <div className="wrap wrap-wide">
        {nav}
        <div className="ex-f-head">
          <h1 id="ex-f-title" className="ex-title">{floor.level}. <em>{lang === 'bs' ? 'sprat' : 'floor'}</em></h1>
          <p className="ex-lead">{floorAvail(s, lang)}<span>·</span>{fill(t.areaRange, { a: Math.round(s.min), b: Math.round(s.max) })}</p>
        </div>
        <div className="ex-f-grid">
          <FloorRail lang={lang} building={building} units={units} current={floor.level} go={go} pathOf={pathOf} />
          <div className={'ex-f-stage' + (leaving ? ' is-leaving' : '')} style={leaving ? { '--origin': leaving.origin } as React.CSSProperties : undefined}>
            <div className="ex-plate">
              <Plate floor={floor} units={map} hover={hover} onHover={setHover}
                href={(u) => pathOf({ view: 'unit', code: u.code })}
                onPick={(u, e) => go({ view: 'unit', code: u.code }, e, originOf(u.code))}
                ariaLabel={fill(t.floorN, { n: floor.level })}
                unitName={(u) => `${fill(t.apartmentN, { c: unitLabel(u) })}, ${m2(u.area, lang)}, ${statusLabel(u.status, lang)}`} />
            </div>
            <div className="ex-f-foot">
              <ul className="ex-legend" aria-hidden="true">
                {statuses.map((st) => <li key={st}><i className={'sw st-' + st} />{statusLabel(st, lang)}</li>)}
              </ul>
              <span className="ex-north" aria-hidden="true">N</span>
            </div>
          </div>
          <aside className="ex-f-side">
            <div className={'ex-peek' + (hu ? ' is-on' : '')} aria-live="polite">
              {hu ? (
                <>
                  <div className="ex-peek-img">{(hu.plan3d || hu.plan) && <Image src={hu.plan3d || hu.plan} alt="" fill sizes="320px" />}</div>
                  <div className="ex-peek-body">
                    <p className="ex-peek-t">{fill(t.apartmentN, { c: unitLabel(hu) })}<span className={'pill st-' + hu.status}>{statusLabel(hu.status, lang)}</span></p>
                    <p className="ex-peek-a">{m2(hu.area, lang)}</p>
                    <p className="ex-peek-m">{hu.type ? fill(t.typeN, { t: hu.type }) + ' · ' : ''}{beds(hu.bedrooms, lang)}</p>
                  </div>
                </>
              ) : <p className="ex-peek-hint">{t.pickUnit}</p>}
            </div>
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
          </aside>
        </div>
      </div>
    </section>
  );
}

type Sort = 'floor' | 'up' | 'down';

function ListView({ lang, units, levels, initialType, go, pathOf, nav }: {
  lang: Lang; units: Unit[]; levels: number[]; initialType?: string; go: (to: At, e?: React.MouseEvent) => void; pathOf: (a: At) => string; nav: React.ReactNode;
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
        {nav}
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
