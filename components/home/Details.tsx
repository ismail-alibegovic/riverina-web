'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type Slide = { src: string; title: string; text: string };

/** Horizontal slider with a focused centre slide. Native scroll-snap: swipe, trackpad, keyboard and buttons. */
export default function Details({ slides, labels, tag }: { slides: Slide[]; labels: { prev: string; next: string; region: string }; tag?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, { root: el, threshold: 0.6 });
    el.querySelectorAll('.det-slide').forEach((s) => io.observe(s));

    // Mouse drag to scroll (touch and trackpads scroll natively).
    let down = false, startX = 0, startLeft = 0, moved = false;
    const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft; el.classList.add('is-dragging'); };
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = startLeft - dx; };
    const onUp = () => { if (!down) return; down = false; el.classList.remove('is-dragging'); };
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => { io.disconnect(); el.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); el.removeEventListener('click', onClick, true); };
  }, [slides.length]);

  const go = (i: number) => {
    const el = track.current;
    const s = el?.querySelectorAll<HTMLElement>('.det-slide')[Math.max(0, Math.min(slides.length - 1, i))];
    if (!el || !s) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: s.offsetLeft - (el.clientWidth - s.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="det">
      <div className="det-nav">
        <button type="button" className="det-btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label={labels.prev}><span aria-hidden="true">←</span></button>
        <span className="sr-only" aria-live="polite">{slides[active]?.title}</span>
        <button type="button" className="det-btn" onClick={() => go(active + 1)} disabled={active === slides.length - 1} aria-label={labels.next}><span aria-hidden="true">→</span></button>
      </div>
      <div ref={track} className="det-track" tabIndex={0} role="region" aria-roledescription="carousel" aria-label={labels.region}>
        {slides.map((s, i) => (
          <figure className={'det-slide' + (i === active ? ' is-active' : '')} data-i={i} key={s.src + i} aria-label={`${i + 1} / ${slides.length}`}>
            <div className="det-img"><Image src={s.src} alt={s.title} fill sizes="(min-width: 900px) 58vw, 84vw" quality={80} draggable={false} />{tag && <span className="ill-tag">{tag}</span>}</div>
            <figcaption>
              <span className="label">{s.title}</span>
              {s.text && <p>{s.text}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
