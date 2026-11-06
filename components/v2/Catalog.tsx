'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import { V2, fill } from '@/lib/v2/copy';
import type { V2Unit, FloorShape } from '@/lib/v2/units';
import FloorMini from './FloorMini';
import { PlanCard } from './PlanCard';
import Share from './Share';

type Sort = 'floor' | 'area-up' | 'area-down';
type View = 'grid' | 'list';
const PAGE = 12;

/**
 * The apartment catalogue of the reference: area range with two handles, bedroom and floor pills, availability,
 * sort, grid and list views. Filters live in the URL query, so a filtered list can be shared or bookmarked.
 */
export default function Catalog({ units, lang, floors }: { units: V2Unit[]; lang: Lang; floors: Record<string, FloorShape | null> }) {
  const t = V2[lang];
  const bounds = useMemo(() => {
    const a = units.map((u) => u.area);
    return { min: Math.floor(Math.min(...a)), max: Math.ceil(Math.max(...a)) };
  }, [units]);
  const bedOpts = useMemo(() => Array.from(new Set(units.map((u) => u.beds))).sort(), [units]);
  const floorOpts = useMemo(() => Array.from(new Set(units.map((u) => u.floor))).sort((a, b) => a - b), [units]);

  const [min, setMin] = useState(bounds.min);
  const [max, setMax] = useState(bounds.max);
  const [beds, setBeds] = useState<number[]>([]);
  const [fl, setFl] = useState<number[]>([]);
  const [avail, setAvail] = useState(false);
  const [sort, setSort] = useState<Sort>('floor');
  const [view, setView] = useState<View>('grid');
  const [limit, setLimit] = useState(PAGE);
  const [panel, setPanel] = useState(false);
  const [ready, setReady] = useState(false);

  // read the query once
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const n = (k: string) => (q.get(k) ? Number(q.get(k)) : NaN);
    const list = (k: string) => (q.get(k) || '').split(',').filter(Boolean).map(Number).filter((x) => !Number.isNaN(x));
    if (!Number.isNaN(n('min'))) setMin(Math.max(bounds.min, n('min')));
    if (!Number.isNaN(n('max'))) setMax(Math.min(bounds.max, n('max')));
    setBeds(list('beds'));
    setFl(list('floor'));
    setAvail(q.get('free') === '1');
    if (['area-up', 'area-down'].includes(q.get('sort') || '')) setSort(q.get('sort') as Sort);
    let v = q.get('view');
    if (!v) try { v = localStorage.getItem('kt-view'); } catch { /* storage unavailable */ }
    if (v === 'list' || v === 'grid') setView(v);
    setReady(true);
  }, [bounds.min, bounds.max]);

  // write the query
  useEffect(() => {
    if (!ready) return;
    const q = new URLSearchParams(location.search);
    const set = (k: string, v: string) => (v ? q.set(k, v) : q.delete(k));
    set('min', min > bounds.min ? String(min) : '');
    set('max', max < bounds.max ? String(max) : '');
    set('beds', beds.join(','));
    set('floor', fl.join(','));
    set('free', avail ? '1' : '');
    set('sort', sort === 'floor' ? '' : sort);
    set('view', view === 'grid' ? '' : view);
    const s = q.toString();
    history.replaceState(history.state, '', location.pathname + (s ? '?' + s : '') + location.hash);
    try { localStorage.setItem('kt-view', view); } catch { /* storage unavailable */ }
  }, [ready, min, max, beds, fl, avail, sort, view, bounds.min, bounds.max]);

  const list = useMemo(() => {
    const out = units.filter((u) => u.area >= min - 0.005 && u.area <= max + 0.005 && (!beds.length || beds.includes(u.beds)) && (!fl.length || fl.includes(u.floor)) && (!avail || u.status === 'available'));
    if (sort === 'area-up') out.sort((a, b) => a.area - b.area);
    if (sort === 'area-down') out.sort((a, b) => b.area - a.area);
    return out;
  }, [units, min, max, beds, fl, avail, sort]);

  useEffect(() => setLimit(PAGE), [min, max, beds, fl, avail, sort]);

  const toggle = (arr: number[], v: number, set: (x: number[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const active = (min > bounds.min ? 1 : 0) + (max < bounds.max ? 1 : 0) + beds.length + fl.length + (avail ? 1 : 0);
  const reset = () => { setMin(bounds.min); setMax(bounds.max); setBeds([]); setFl([]); setAvail(false); };
  const pct = (v: number) => ((v - bounds.min) / (bounds.max - bounds.min)) * 100;

  return (
    <div className="k-cat">
      <button type="button" className="k-filter-toggle" aria-expanded={panel} aria-controls="k-filters" onClick={() => setPanel(!panel)}>
        <span>{t.filters}{active > 0 && <b>{active}</b>}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" /></svg>
      </button>

      <div id="k-filters" className={'k-filters' + (panel ? ' is-open' : '')}>
        <fieldset className="k-fg k-fg-area">
          <legend>{t.area}, m²</legend>
          <div className="k-range-in">
            <label><span>{t.from}</span><input type="number" inputMode="numeric" min={bounds.min} max={max} value={min} onChange={(e) => setMin(Math.min(Number(e.target.value) || bounds.min, max))} /></label>
            <label><span>{t.to}</span><input type="number" inputMode="numeric" min={min} max={bounds.max} value={max} onChange={(e) => setMax(Math.max(Number(e.target.value) || bounds.max, min))} /></label>
          </div>
          <div className="k-range" style={{ '--a': pct(min) + '%', '--b': pct(max) + '%' } as React.CSSProperties}>
            <input type="range" min={bounds.min} max={bounds.max} step={1} value={min} aria-label={`${t.area} ${t.from}`} onChange={(e) => setMin(Math.min(Number(e.target.value), max - 1))} />
            <input type="range" min={bounds.min} max={bounds.max} step={1} value={max} aria-label={`${t.area} ${t.to}`} onChange={(e) => setMax(Math.max(Number(e.target.value), min + 1))} />
          </div>
        </fieldset>
        <fieldset className="k-fg">
          <legend>{t.bedrooms}</legend>
          <div className="k-dots">
            {bedOpts.map((b) => <button type="button" key={b} aria-pressed={beds.includes(b)} onClick={() => toggle(beds, b, setBeds)}>{b}</button>)}
          </div>
        </fieldset>
        <fieldset className="k-fg">
          <legend>{t.floor}</legend>
          <div className="k-dots">
            {floorOpts.map((f) => <button type="button" key={f} aria-pressed={fl.includes(f)} onClick={() => toggle(fl, f, setFl)}>{f}</button>)}
          </div>
        </fieldset>
        <fieldset className="k-fg k-fg-end">
          <legend>{t.availability}</legend>
          <button type="button" className="k-switch" aria-pressed={avail} onClick={() => setAvail(!avail)}><i aria-hidden="true" />{t.onlyAvailable}</button>
        </fieldset>
        <div className="k-filter-actions">
          <button type="button" className="kt-pill is-line" onClick={reset} disabled={!active}>{t.reset}</button>
          <button type="button" className="kt-pill is-navy k-apply" onClick={() => setPanel(false)}>{t.apply} ({list.length})</button>
        </div>
      </div>

      <div className="k-cat-bar">
        <label className="k-sort">
          <span className="sr-only">{t.sort}</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="floor">{t.sortDefault}</option>
            <option value="area-up">{t.sortAreaUp}</option>
            <option value="area-down">{t.sortAreaDown}</option>
          </select>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5" /></svg>
        </label>
        <p className="k-results" role="status">{fill(t.results, { n: list.length })}{active > 0 && <button type="button" onClick={reset}>{t.reset}</button>}</p>
        <div className="k-views" role="group" aria-label={`${t.grid} / ${t.list}`}>
          <button type="button" aria-pressed={view === 'grid'} aria-label={t.grid} onClick={() => setView('grid')}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z" /></svg>
          </button>
          <button type="button" aria-pressed={view === 'list'} aria-label={t.list} onClick={() => setView('list')}>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" /></svg>
          </button>
        </div>
      </div>

      {list.length === 0 && <p className="k-empty">{t.noResults} <button type="button" className="kt-link" onClick={reset}>{t.reset}</button></p>}

      {view === 'grid' ? (
        <div className="k-plans">
          {list.slice(0, limit).map((u, i) => <PlanCard key={u.code} u={u} lang={lang} i={i} />)}
        </div>
      ) : (
        <ul className="k-list">
          {list.slice(0, limit).map((u) => (
            <li key={u.code} className={'k-li' + (u.status !== 'available' ? ' is-off' : '')} data-k="fade">
              <a href={u.href} className="k-li-head">
                <span className="k-li-title">{u.bedsLabel}, {u.areaLabel}</span>
                <span>{u.buildingName}</span>
                <span>{fill(t.floorN, { n: u.floor })}</span>
                <span>{t.no} {u.code}</span>
                <b className={'k-st is-' + u.status}>{u.price || u.statusLabel}</b>
              </a>
              <div className="k-li-body">
                <a href={u.href} className="k-li-plan" tabIndex={-1}>
                  {u.plan && <Image src={u.plan} alt={fill(t.planAlt, { code: u.code })} width={624} height={792} sizes="(min-width: 900px) 40vw, 90vw" quality={75} />}
                </a>
                <FloorMini floor={floors[`${u.building}:${u.floor}`]} code={u.code} label={fill(t.floorAlt, { code: u.code, n: u.floor })} className="k-li-floor" />
                <div className="k-li-tools">
                  {u.pdf && <a className="k-circ is-text" href={u.pdf} target="_blank" rel="noopener" aria-label={`${t.pdfLong}, ${u.code}`}>PDF</a>}
                  <Share url={u.href} title={`${t.no} ${u.code}`} label={t.share} copied={t.copied} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {list.length > limit && (
        <div className="k-more"><button type="button" className="kt-pill is-line" onClick={() => setLimit(limit + PAGE)}>{t.showMore} ({list.length - limit})</button></div>
      )}
    </div>
  );
}
