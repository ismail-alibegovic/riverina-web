'use client';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import BuildingView from './BuildingView';

/**
 * Catalogue / building switch. The interactive viewer mounts on first use (it loads 360° images), and opens directly
 * when the address carries one of its links (#rvs/r1/1-1, e.g. "View on the building" on an apartment page).
 */
export default function Tabs({ labels, catalogue, sel, lang, title, intro, head }: {
  head: React.ReactNode;
  labels: [string, string];
  catalogue: React.ReactNode;
  sel: any;
  lang: Lang;
  title: string;
  intro: string;
}) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const check = () => { if (location.hash.startsWith('#rvs/')) { setTab(1); setMounted(true); } };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);
  const pick = (i: 0 | 1) => {
    setTab(i);
    if (i === 1) setMounted(true);
    else if (location.hash.startsWith('#rvs/')) history.replaceState(history.state, '', location.pathname + location.search);
  };
  const keys = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = tab ? 0 : 1; pick(n); document.getElementById('k-tab-' + n)?.focus(); }
  };
  return (
    <>
      <div className="kt-wrap k-apage-head">
        {head}
        <div className="k-tabs" role="tablist" aria-label={labels.join(' / ')} onKeyDown={keys}>
          {labels.map((l, i) => (
            <button key={i} id={'k-tab-' + i} type="button" role="tab" aria-selected={tab === i} aria-controls={'k-panel-' + i} tabIndex={tab === i ? 0 : -1} onClick={() => pick(i as 0 | 1)}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div id="k-panel-0" role="tabpanel" aria-labelledby="k-tab-0" hidden={tab !== 0} className="kt-wrap">{catalogue}</div>
      <div id="k-panel-1" role="tabpanel" aria-labelledby="k-tab-1" hidden={tab !== 1} className="k-bpanel">
        <div className="kt-wrap"><p className="k-bintro">{intro}</p></div>
        {mounted && <BuildingView data={sel} lang={lang} title={title} />}
      </div>
    </>
  );
}
