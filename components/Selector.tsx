'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window { RiverinaSelector?: { mount: (el: HTMLElement, boot: any) => any } }
}

export default function Selector({ data, lang }: { data: any; lang: 'bs' | 'en' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let inst: any = null;
    let cancelled = false;
    import('@/lib/selector/selector.js' as string).then(() => {
      if (cancelled || !ref.current || !window.RiverinaSelector) return;
      inst = window.RiverinaSelector.mount(ref.current, { data, lang, rest: { lead: '/api/lead' } });
    });
    return () => { cancelled = true; if (inst && inst.destroy) inst.destroy(); };
  }, [data, lang]);
  return <div ref={ref} className="rvs-root" />;
}
