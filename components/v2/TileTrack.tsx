'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type Tile = { label: string; value: string; unit?: string; caption: string; text: string; src?: string; href: string };

/**
 * Reference "Find the perfect living space": label left; heading, short text and round arrows right; below a strip
 * of tall cards, each a solid block with a big figure over an interior render. Native scroll with snap, no library.
 */
export default function TileTrack({ id, label, title, text, tiles, labels }: { id: string; label: string; title: string; text: string; tiles: Tile[]; labels: { prev: string; next: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const upd = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > el.scrollWidth - el.clientWidth - 4 });
    upd();
    el.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    return () => { el.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); };
  }, []);
  const go = (d: 1 | -1) => {
    const el = track.current;
    const c = el?.children[0] as HTMLElement | undefined;
    if (!el || !c) return;
    el.scrollBy({ left: d * (c.offsetWidth + 16), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <>
      <div className="kt-wrap k-split k-tt-head">
        <p className="kt-label kt-eyebrow" data-k="fade">{label}</p>
        <div>
          <h2 id={id} className="k-h2" data-k="up">{title}</h2>
          <p className="k-split-text" data-k="up">{text}</p>
          <div className="k-tt-arrows">
            <button type="button" className="kt-round is-soft" onClick={() => go(-1)} disabled={edge.start} aria-label={labels.prev}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 10H4M9 5l-5 5 5 5" /></svg></button>
            <button type="button" className="kt-round is-fill" onClick={() => go(1)} disabled={edge.end} aria-label={labels.next}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg></button>
          </div>
        </div>
      </div>
      <div ref={track} className="k-tt" role="region" aria-labelledby={id} tabIndex={0} data-lenis-prevent>
        {tiles.map((t, i) => (
          <a className="k-tt-card" href={t.href} key={i}>
            <div className="k-tt-top">
              <span className="k-tt-label">{t.label}</span>
              <b>{t.value}{t.unit && <sup>{t.unit}</sup>}</b>
              <span className="k-tt-cap">{t.caption}</span>
              <p>{t.text}</p>
            </div>
            {t.src && <div className="k-img k-tt-img"><Image src={t.src} alt="" fill sizes="(min-width: 900px) 42vw, 86vw" quality={78} /></div>}
          </a>
        ))}
      </div>
    </>
  );
}
