'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/lib/i18n';

type Pic = { src: string; alt: string; tag?: string };

/** Plan / 3D plan / position on the floor, switched with small pills; the plan zooms in where it is clicked. */
export default function PlanViews({ plan, plan3d, floor, floorImg, labels }: { lang: Lang; plan: Pic | null; plan3d: Pic | null; floor: React.ReactNode; floorImg: string; labels: { plan: string; plan3d: string; floor: string } }) {
  const tabs = [plan && 'plan', plan3d && '3d', floor && 'floor'].filter(Boolean) as ('plan' | '3d' | 'floor')[];
  const [tab, setTab] = useState(tabs[0]);
  const [zoom, setZoom] = useState<string | null>(null);
  const name = { plan: labels.plan, '3d': labels.plan3d, floor: labels.floor };
  const toggleZoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (zoom) { setZoom(null); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setZoom(`${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  return (
    <div className="k-pv">
      {tabs.length > 1 && (
        <div className="k-pv-tabs" role="group">
          {tabs.map((k) => <button key={k} type="button" aria-pressed={tab === k} onClick={() => { setTab(k); setZoom(null); }}>{name[k]}</button>)}
        </div>
      )}
      <div className="k-pv-stage">
        {tab === 'plan' && plan && (
          <button type="button" className={'k-pv-zoom' + (zoom ? ' is-zoom' : '')} onClick={toggleZoom} aria-label={plan.alt} style={zoom ? { '--o': zoom } as React.CSSProperties : undefined}>
            <Image src={plan.src} alt={plan.alt} width={1024} height={1024} sizes="(min-width: 1000px) 55vw, 92vw" quality={80} priority />
          </button>
        )}
        {tab === '3d' && plan3d && (
          <div className="k-pv-3d">
            <Image src={plan3d.src} alt={plan3d.alt} width={1024} height={1536} sizes="(min-width: 1000px) 40vw, 92vw" quality={80} />
            {plan3d.tag && <span className="kt-tag">{plan3d.tag}</span>}
          </div>
        )}
        {tab === 'floor' && <div className="k-pv-floor" style={floorImg ? { '--fl': `url(${floorImg})` } as React.CSSProperties : undefined}>{floor}</div>}
      </div>
    </div>
  );
}
