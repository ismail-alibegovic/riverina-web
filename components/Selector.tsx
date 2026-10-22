'use client';
import { useEffect, useRef } from 'react';
import { LOCALES, SELECTOR_UI, Lang } from '@/lib/i18n';

declare global {
  interface Window { RiverinaSelector?: { mount: (el: HTMLElement, boot: any) => any } }
}

/**
 * Mounts the interactive viewer (lib/selector/selector.js).
 * `fill` = full-screen mode: the stage takes the rest of the viewport below its toolbar and crops like a cover image.
 */
export type SelectorPic = { src: string; full: string; alt: string };

export default function Selector({ data, lang, fill = false, title, gallery }: { data: any; lang: Lang; fill?: boolean; title?: string; gallery?: SelectorPic[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let inst: any = null;
    let cancelled = false;
    const el = ref.current;
    const boot: any = { data, lang, numberLocale: LOCALES[lang].number, strings: SELECTOR_UI[lang], rest: { lead: '/api/lead' }, gallery };
    if (fill && el) {
      boot.contain = true;
      boot.fillMaster = true;
      boot.title = title;
      // read on every layout pass, so it follows resizes
      Object.defineProperty(boot, 'maxHeight', {
        get() {
          const bar = el.querySelector<HTMLElement>('.rvs-bar')?.offsetHeight || 56;
          const top = el.getBoundingClientRect().top + window.scrollY;
          // the legend strip under the stage stays in view too
          const frame = el.closest('.apt') ? 64 : 0;
          return Math.max(0.5, Math.min(0.96, (window.innerHeight - top - bar - frame) / window.innerHeight));
        },
      });
    }
    import('@/lib/selector/selector.js' as string).then(() => {
      if (cancelled || !el || !window.RiverinaSelector) return;
      inst = window.RiverinaSelector.mount(el, boot);
    });
    return () => { cancelled = true; if (inst && inst.destroy) inst.destroy(); };
  }, [data, lang, fill, title, gallery]);
  return (
    <div ref={ref} className="rvs-root" data-lenis-prevent>
      <UnitList data={data} lang={lang} />
    </div>
  );
}

const LIST_TEXT = {
  bs: { floor: '{n}. sprat', ground: 'Prizemlje', status: { available: 'Slobodno', reserved: 'Rezervisano', sold: 'Prodano', unavailable: 'Nije u prodaji' } as Record<string, string> },
  en: { floor: 'Floor {n}', ground: 'Ground floor', status: { available: 'Available', reserved: 'Reserved', sold: 'Sold', unavailable: 'Not for sale' } as Record<string, string> },
};

/**
 * A plain list of the apartments, rendered on the server. It is what search engines, slow connections and visitors
 * without JavaScript see; the viewer replaces it as soon as it mounts (it clears its root element).
 */
function UnitList({ data, lang }: { data: any; lang: Lang }) {
  const units: any[] = data.units || [];
  if (!units.length) return null;
  const tt = LIST_TEXT[lang];
  const name = (id: string) => (data.buildings || []).find((b: any) => b.id === id)?.name || id;
  const groups = [...new Set(units.map((u) => u.building))];
  return (
    <div className="rvs-ssr">
      {groups.map((bid) => (
        <section key={bid}>
          <h2>{name(bid)}</h2>
          <ul>
            {units.filter((u) => u.building === bid).map((u) => (
              <li key={u.code}>
                <strong>{u.code}</strong>
                {' · '}{Number(u.floor) === 0 ? tt.ground : tt.floor.replace('{n}', String(u.floor))}
                {Number(u.area) > 0 ? ` · ${u.area} m²` : ''}
                {' · '}{tt.status[u.status] || u.status}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
