'use client';
import { useEffect } from 'react';
import { prepareCount } from '@/components/site/scrollFx';

/**
 * Scroll effects of the redesign, all skipped under prefers-reduced-motion:
 *  [data-k]           enters once when it reaches the viewport ("up", "fade", "clip", "lines"), stagger via --i
 *  [data-kt-par="n"]  the image inside drifts n % against the scroll (desktop only)
 *  [data-kt-count]    numbers count up once
 * Also puts the font variables on <body>, so the apartment viewer's panels (rendered into <body>) use the same type.
 */
export default function Motion({ fonts }: { fonts: string }) {
  useEffect(() => {
    const cls = fonts.split(' ').filter(Boolean);
    document.body.classList.add('kt-body', ...cls);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offs: (() => void)[] = [() => document.body.classList.remove('kt-body', ...cls)];

    const observe = (els: Element[], onIn: (el: HTMLElement) => void, margin = '0px 0px -8% 0px') => {
      if (!els.length) return;
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        onIn(e.target as HTMLElement);
      }), { rootMargin: margin, threshold: 0.01 });
      els.forEach((el) => io.observe(el));
      offs.push(() => io.disconnect());
    };

    const scan = () => {
      const fresh = Array.from(document.querySelectorAll<HTMLElement>('.kt [data-k]:not(.is-in)'));
      if (reduced) { fresh.forEach((el) => el.classList.add('is-in')); return; }
      observe(fresh, (el) => el.classList.add('is-in'));
    };
    scan();
    // catalogue cards are rendered on the client: reveal them as they appear
    const mo = new MutationObserver(() => scan());
    const main = document.getElementById('main');
    if (main) { mo.observe(main, { childList: true, subtree: true }); offs.push(() => mo.disconnect()); }

    if (!reduced) {
      observe(Array.from(document.querySelectorAll('.kt [data-kt-count]')), (el) => prepareCount(el)(), '0px 0px -15% 0px');

      if (window.matchMedia('(min-width: 900px)').matches) {
        const items = Array.from(document.querySelectorAll<HTMLElement>('.kt [data-kt-par]')).map((el) => ({ el, img: el.querySelector<HTMLElement>('img'), k: Number(el.dataset.ktPar) || 8 }));
        let raf = 0;
        const tick = () => {
          raf = 0;
          const vh = window.innerHeight;
          for (const it of items) {
            if (!it.img) continue;
            const r = it.el.getBoundingClientRect();
            if (r.bottom < -100 || r.top > vh + 100) continue;
            const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 … 1 across the viewport
            it.img.style.transform = `translate3d(0, ${(-p * it.k).toFixed(2)}%, 0) scale(${1 + it.k / 45})`;
          }
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
        tick();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        offs.push(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); });
      }
    }
    return () => offs.forEach((f) => f());
  }, [fonts]);
  return null;
}
