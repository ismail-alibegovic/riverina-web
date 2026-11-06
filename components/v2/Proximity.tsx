'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Rich } from '@/components/home/text';

type Item = { src: string; title: string; sub: string };
type Group = { label: string; icon: 'pin' | 'leaf'; items: Item[] };

/**
 * Reference "Proximity": a bordered panel; left the heading, pill switches, a counter and round arrows; right a strip
 * of square pictures with a title and a small line under each. Riverina shows the location and the neighbourhood
 * in project visualisations; no distances are shown until they are confirmed.
 */
export default function Proximity({ id, title, text, more, groups, labels }: { id: string; title: string; text: string; more?: { href: string; label: string }; groups: Group[]; labels: { prev: string; next: string } }) {
  const [g, setG] = useState(0);
  const [pos, setPos] = useState(1);
  const track = useRef<HTMLDivElement>(null);
  const items = groups[g].items;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    const upd = () => {
      const c = el.children[0] as HTMLElement | undefined;
      setPos(c ? Math.min(items.length, Math.round(el.scrollLeft / (c.offsetWidth + 22)) + 1) : 1);
    };
    upd();
    el.addEventListener('scroll', upd, { passive: true });
    return () => el.removeEventListener('scroll', upd);
  }, [g, items.length]);

  const go = (d: 1 | -1) => {
    const el = track.current;
    const c = el?.children[0] as HTMLElement | undefined;
    if (!el || !c) return;
    el.scrollBy({ left: d * (c.offsetWidth + 22), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const icon = (k: Group['icon']) => k === 'pin'
    ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 1 0-9 0c0 3.8 4.5 8 4.5 8z" /><circle cx="8" cy="6.5" r="1.6" /></svg>
    : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13c0-6 4-9.5 10-10-0.5 6-4 10-10 10zM3 13l5-5" /></svg>;

  return (
    <div className="k-prox">
      <div className="k-prox-side">
        <h2 id={id} className="k-prox-title"><Rich text={title} /></h2>
        <div className="k-prox-pills" role="group" aria-label={title.replace(/\*/g, '')}>
          {groups.map((x, i) => (
            <button key={i} type="button" aria-pressed={g === i} onClick={() => setG(i)}>{icon(x.icon)}{x.label}</button>
          ))}
        </div>
        <p className="k-prox-text">{text}</p>
        <div className="k-prox-nav">
          <span className="k-prox-count" aria-live="polite">{pos}/{items.length}</span>
          <div>
            <button type="button" className="kt-round is-soft" onClick={() => go(-1)} disabled={pos <= 1} aria-label={labels.prev}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 10H4M9 5l-5 5 5 5" /></svg></button>
            <button type="button" className="kt-round is-fill" onClick={() => go(1)} disabled={pos >= items.length} aria-label={labels.next}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg></button>
          </div>
        </div>
      </div>
      <div className="k-prox-main">
        {more && <a className="k-prox-more" href={more.href}>{more.label}</a>}
        <div ref={track} className="k-prox-track" tabIndex={0} role="region" aria-labelledby={id} data-lenis-prevent>
          {items.map((it, i) => (
            <figure key={groups[g].label + i} className="k-prox-card">
              <div className="k-img"><Image src={it.src} alt={it.title} fill sizes="(min-width: 900px) 24vw, 70vw" quality={78} /></div>
              <figcaption><b>{it.title}</b><span>{it.sub}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
