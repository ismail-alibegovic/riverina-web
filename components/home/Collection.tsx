'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Rich } from './text';

export type CollectionCard = {
  id: string;
  name: string;
  bedrooms: number;
  bedLabel: string;
  area: string;
  outdoor: string;
  floors: string;
  avail: string;
  soldOut: boolean;
  price: string;
  href: string;
  plan: string;
  plan3d: string;
  planAlt: string;
};

/**
 * The nine layouts as a catalogue: each plan on a sand panel, its 3D view on hover, the figures that decide
 * (bedrooms, area, outdoor space, floors) and availability. Filter by bedrooms; the row scrolls with the
 * arrows, a swipe or the keyboard. Every card leads into the explorer list for that layout.
 */
export default function Collection({ title, text, note, cards, labels }: {
  title: string; text: string; note: string; cards: CollectionCard[];
  labels: { all: string; filter: string; prev: string; next: string; view: string; bedroomsShort: string };
}) {
  const [beds, setBeds] = useState<number | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const options = Array.from(new Set(cards.map((c) => c.bedrooms))).sort((a, b) => a - b);
  const shown = cards.filter((c) => beds == null || c.bedrooms === beds);

  const measure = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { track.current?.scrollTo({ left: 0 }); measure(); }, [beds]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const step = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>('.cl-card');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' });
  };

  return (
    <section id="tipovi" className="section cl" aria-labelledby="cl-title">
      <div className="wrap wrap-wide">
        <div className="cl-head">
          <h2 id="cl-title" className="sec-title" data-reveal="up"><Rich text={title.replace(/\n/g, ' ')} /></h2>
          <div className="cl-intro" data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>
            {text && <p>{text}</p>}
            <div className="round-nav">
              <button type="button" className="round" onClick={() => step(-1)} disabled={edge.start} aria-label={labels.prev}><span aria-hidden="true">←</span></button>
              <button type="button" className="round is-dark" onClick={() => step(1)} disabled={edge.end} aria-label={labels.next}><span aria-hidden="true">→</span></button>
            </div>
          </div>
        </div>
        <div className="chips" role="group" aria-label={labels.filter} data-reveal="fade">
          <button type="button" className="chip" aria-pressed={beds == null} onClick={() => setBeds(null)}>{labels.all}</button>
          {options.map((n) => (
            <button type="button" key={n} className="chip" aria-pressed={beds === n} onClick={() => setBeds(n)}>{n} <span className="chip-s">{labels.bedroomsShort}</span></button>
          ))}
        </div>
      </div>
      <ul ref={track} className="cl-track" onScroll={measure} data-lenis-prevent>
        {shown.map((c) => (
          <li key={c.id} className={'cl-card' + (c.soldOut ? ' is-sold' : '')}>
            <a href={c.href} className="cl-link">
              <div className="cl-plan">
                <span className="cl-top"><b>{c.name}</b><span>{c.floors}</span></span>
                <Image src={c.plan} alt={c.planAlt} fill sizes="(min-width: 900px) 30vw, 80vw" className="cl-2d" />
                {c.plan3d && <Image src={c.plan3d} alt="" fill sizes="(min-width: 900px) 30vw, 80vw" className="cl-3d" />}
              </div>
              <div className="cl-body">
                <p className="cl-area">{c.area}</p>
                <p className="cl-meta">{c.bedLabel}<span>·</span>{c.outdoor}</p>
                <p className="cl-foot"><span className={'dot' + (c.soldOut ? ' is-sold' : '')} aria-hidden="true" />{c.avail}{c.price && <span className="cl-price">{c.price}</span>}<span className="cl-go">{labels.view} →</span></p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {note && <p className="wrap wrap-wide cl-note">{note}</p>}
    </section>
  );
}
