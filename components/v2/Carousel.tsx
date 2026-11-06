'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Title } from './ui';

type Item = { kind: 'img'; src: string; caption: string; size: 'm' | 'l' } | { kind: 'card'; title: string; text: string };

/**
 * "Features of the complex": a strip of renders in two heights with one solid navy card, moved with round arrow
 * buttons, by drag/swipe (native scroll with snap) or the keyboard. No library.
 */
export default function Carousel({ id, title, text, items, labels, tag }: { id: string; title: string; text: string; items: Item[]; labels: { prev: string; next: string }; tag?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<{ start: boolean; end: boolean }>({ start: true, end: false });
  const [pos, setPos] = useState(1);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
      const cards = Array.from(el.children) as HTMLElement[];
      const at = cards.findIndex((c) => c.offsetLeft + c.offsetWidth / 2 > el.scrollLeft);
      setPos(Math.max(1, at + 1));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth * 0.8;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="kt-wrap k-head k-feat-head">
        <Title id={id} text={title} />
        <p className="k-head-text" data-k="up">{text}</p>
        <div className="k-arrows">
          <button type="button" className="kt-round" onClick={() => go(-1)} disabled={edge.start} aria-label={labels.prev}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 10H4M9 5l-5 5 5 5" /></svg></button>
          <span className="k-count" aria-hidden="true">{String(pos).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <button type="button" className="kt-round is-fill" onClick={() => go(1)} disabled={edge.end} aria-label={labels.next}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg></button>
        </div>
      </div>
      <div ref={track} className="k-track" tabIndex={0} role="region" aria-labelledby={id} data-lenis-prevent>
        {items.map((it, i) => it.kind === 'card' ? (
          <div className="k-slide is-card" key={i}>
            <svg className="k-rings" viewBox="0 0 200 200" aria-hidden="true">{[40, 64, 88, 112, 136].map((r) => <circle key={r} cx="200" cy="0" r={r} />)}</svg>
            <div><h3>{it.title}</h3><p>{it.text}</p></div>
          </div>
        ) : (
          <figure className={'k-slide is-' + it.size} key={i}>
            <div className="k-img"><Image src={it.src} alt={it.caption} fill sizes="(min-width: 900px) 34vw, 82vw" quality={78} /></div>
            <figcaption><span>{it.caption}</span>{tag && it.size === 'l' && <small>{tag}</small>}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
