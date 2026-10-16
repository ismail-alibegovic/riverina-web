'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window { RiverinaSelector?: { mount: (el: HTMLElement, boot: any) => any } }
}

/**
 * Mounts the interactive viewer (lib/selector/selector.js).
 * `fill` = full-screen mode: the stage takes the rest of the viewport below its toolbar and crops like a cover image.
 */
export default function Selector({ data, lang, fill = false }: { data: any; lang: 'bs' | 'en'; fill?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let inst: any = null;
    let cancelled = false;
    const el = ref.current;
    const boot: any = { data, lang, rest: { lead: '/api/lead' } };
    if (fill && el) {
      boot.maxCrop = 0.4;
      // read on every layout pass, so it follows resizes
      Object.defineProperty(boot, 'maxHeight', {
        get() {
          const bar = el.querySelector<HTMLElement>('.rvs-bar')?.offsetHeight || 56;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return Math.max(0.5, Math.min(0.96, (window.innerHeight - top - bar) / window.innerHeight));
        },
      });
    }
    import('@/lib/selector/selector.js' as string).then(() => {
      if (cancelled || !el || !window.RiverinaSelector) return;
      inst = window.RiverinaSelector.mount(el, boot);
    });
    return () => { cancelled = true; if (inst && inst.destroy) inst.destroy(); };
  }, [data, lang, fill]);
  return <div ref={ref} className="rvs-root" data-lenis-prevent />;
}
