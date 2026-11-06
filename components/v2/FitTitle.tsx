'use client';
import { useLayoutEffect, useRef } from 'react';
import { Rich } from '@/components/home/text';

/**
 * Monumental title set edge to edge, like the KEY TOWERS wordmark heading: one line on wide screens, one line per
 * part on phones, always exactly as wide as its column. CSS gives a close first size; this fine-tunes it.
 */
export default function FitTitle({ id, parts }: { id: string; parts: string[] }) {
  const h = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = h.current;
    const inner = el?.querySelector<HTMLElement>('.k-fit');
    if (!el || !inner) return;
    const fit = () => {
      el.style.fontSize = '100px';
      const w = inner.getBoundingClientRect().width;
      const W = el.clientWidth;
      if (w > 0) el.style.fontSize = `${Math.floor((100 * W) / w * 100) / 100}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return (
    <h1 id={id} ref={h} className="k-hero-title">
      <span className="k-fit">
        {parts.map((p, i) => (
          <span key={i} className={'k-fit-part' + (p.startsWith('*') ? ' is-serif' : '')} style={{ '--i': i } as React.CSSProperties}>
            <span><Rich text={p} /></span>
          </span>
        ))}
      </span>
    </h1>
  );
}
