'use client';
import { useEffect, useRef } from 'react';

/**
 * The developer's logo, built up in three bands of the same picture once it scrolls into view: the buildings and the
 * swoosh rise from their base, the name wipes in from the left, then GROUP and d.o.o. open outwards from the centre
 * with their rules. Reduced motion: shown at once (elicyon.css .ei-logo).
 */
export default function InvestorLogo({ src, alt }: { src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={root} className="ei-logo" role="img" aria-label={alt}>
      {['mark', 'name', 'sub'].map((band) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={band} className={`ei-band ei-band-${band}`} src={src} alt="" width={900} height={965} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}
