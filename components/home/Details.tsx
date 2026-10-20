'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type Slide = { src: string; title: string; text: string };

/**
 * Centre-focus carousel (Elicyon "Objects of desire"): a row of pictures of alternating heights; the one in the
 * centre is framed in a coloured mat, its title and text below. Click a neighbour, swipe, drag or use the arrows.
 */
export default function Details({ slides, labels, tag }: { slides: Slide[]; labels: { prev: string; next: string; region: string }; tag?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(Math.min(2, slides.length - 1));
  const [x, setX] = useState(0);
  const go = (i: number) => setActive(Math.max(0, Math.min(slides.length - 1, i)));

  // centre the active slide: every slot has the same width, so its centre is known without measuring it
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const place = () => {
      const w = el.querySelector<HTMLElement>('.obj-item')?.offsetWidth || 0;
      setX(el.clientWidth / 2 - (active * w + w / 2));
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  // swipe / drag: one slide per gesture
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let x0 = 0, y0 = 0, down = false;
    const onDown = (e: PointerEvent) => { down = true; x0 = e.clientX; y0 = e.clientY; };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - y0)) { setActive((a) => Math.max(0, Math.min(slides.length - 1, a + (dx < 0 ? 1 : -1)))); el.dataset.dragged = '1'; setTimeout(() => delete el.dataset.dragged, 0); }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => { el.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp); };
  }, [slides.length]);

  const cur = slides[active];
  return (
    <div className="obj" role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div ref={stage} className="obj-stage" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(active + 1); if (e.key === 'ArrowLeft') go(active - 1); }}>
        <ul className="obj-track" style={{ transform: `translate3d(${x}px, 0, 0)` }}>
          {slides.map((s, i) => (
            <li className={'obj-item' + (i === active ? ' is-on' : '')} key={s.src + i}>
              <button type="button" className="obj-frame" onClick={(e) => { if (!stage.current?.dataset.dragged) go(i); (e.currentTarget as HTMLElement).blur(); }} aria-label={`${s.title} (${i + 1} / ${slides.length})`} aria-current={i === active || undefined} tabIndex={i === active ? 0 : -1}>
                <span className="obj-img"><Image src={s.src} alt="" fill sizes="(min-width: 900px) 26vw, 70vw" quality={80} draggable={false} /></span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="obj-nav is-prev" onClick={() => go(active - 1)} disabled={active === 0} aria-label={labels.prev}><span aria-hidden="true">‹</span></button>
        <button type="button" className="obj-nav is-next" onClick={() => go(active + 1)} disabled={active === slides.length - 1} aria-label={labels.next}><span aria-hidden="true">›</span></button>
      </div>
      <div className="obj-info" aria-live="polite">
        <p className="obj-count" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</p>
        <p className="label obj-title" key={'t' + active}>{cur?.title}</p>
        {cur?.text && <p className="obj-text" key={'x' + active}>{cur.text}</p>}
        {tag && <p className="obj-tag">{tag}</p>}
      </div>
    </div>
  );
}
