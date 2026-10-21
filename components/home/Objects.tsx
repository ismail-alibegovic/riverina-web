'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Stepped } from './Editorial';

export type Slide = { src: string; title: string; text: string };

/**
 * Interiors after Elicyon's "Objects of desire": a centred heading over a row of pictures; the picture in the middle is
 * larger and matted in gold, its title and line below. Arrows, the keyboard (← →) and a horizontal swipe move the row;
 * it wraps around. Under reduced motion the row moves without easing.
 */
export default function Objects({ title, slides, note, labels, tag }: { title: string; slides: Slide[]; note?: string; labels: { prev: string; next: string; region: string }; tag?: string }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  // centre the active slide (measured, so any slide sizes work)
  const centre = useCallback(() => {
    const t = track.current, v = view.current;
    if (!t || !v) return;
    const s = t.children[i] as HTMLElement | undefined;
    if (!s) return;
    t.style.transform = `translate3d(${v.clientWidth / 2 - (s.offsetLeft + s.offsetWidth / 2)}px, 0, 0)`;
  }, [i]);
  useLayoutEffect(() => { centre(); }, [centre]);
  useEffect(() => {
    const t = track.current;
    // the active slide grows over the transition; re-centre as it does, then once more at the end
    const ro = new ResizeObserver(() => centre());
    if (t) Array.from(t.children).forEach((c) => ro.observe(c));
    window.addEventListener('resize', centre);
    return () => { ro.disconnect(); window.removeEventListener('resize', centre); };
  }, [centre]);

  // horizontal swipe / drag
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    let x0: number | null = null, y0 = 0;
    const down = (e: PointerEvent) => { x0 = e.clientX; y0 = e.clientY; };
    const up = (e: PointerEvent) => {
      if (x0 == null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    };
    v.addEventListener('pointerdown', down); v.addEventListener('pointerup', up); v.addEventListener('pointercancel', () => (x0 = null));
    return () => { v.removeEventListener('pointerdown', down); v.removeEventListener('pointerup', up); };
  }, [go]);

  if (!n) return null;
  const s = slides[i];
  return (
    <section id="detalji" className="eo" aria-labelledby="eo-title" aria-roledescription="carousel">
      <Stepped id="eo-title" text={title} className="eo-heading" />
      <div ref={view} className="eo-view" role="group" aria-label={labels.region} tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}>
        <div ref={track} className="eo-track">
          {slides.map((sl, k) => (
            <button key={sl.src} type="button" className={'eo-slide' + (k === i ? ' is-on' : '')} aria-label={sl.title} aria-current={k === i ? 'true' : undefined} tabIndex={-1} onClick={() => setI(k)}>
              <span className="eo-pic"><Image src={sl.src} alt="" fill sizes="(min-width: 1024px) 24vw, 60vw" quality={80} /></span>
            </button>
          ))}
        </div>
      </div>
      <div className="eo-caption" aria-live="polite">
        <p className="eo-title">{s.title}</p>
        {s.text && <p className="eo-text">{s.text}</p>}
      </div>
      <div className="eo-nav">
        <button type="button" onClick={() => go(-1)} aria-label={labels.prev}><span aria-hidden="true">←</span></button>
        <span className="eo-count" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        <button type="button" onClick={() => go(1)} aria-label={labels.next}><span aria-hidden="true">→</span></button>
      </div>
      {(note || tag) && <p className="eo-note">{[tag, note].filter(Boolean).join(' · ')}</p>}
    </section>
  );
}
