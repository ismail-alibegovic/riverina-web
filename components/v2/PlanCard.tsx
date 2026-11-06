import Image from 'next/image';
import type { Lang } from '@/lib/i18n';
import { V2, fill } from '@/lib/v2/copy';
import type { V2Unit } from '@/lib/v2/units';

/** Apartment card of the catalogue: building and floor on top, the plan, then type, area and number. */
export function PlanCard({ u, lang, i = 0 }: { u: V2Unit; lang: Lang; i?: number }) {
  const t = V2[lang];
  return (
    <a className={'k-plan' + (u.status !== 'available' ? ' is-off' : '')} href={u.href} data-k="up" style={{ '--i': i % 3 } as React.CSSProperties}>
      <span className="k-plan-meta">{u.buildingName}<br />{fill(t.floorN, { n: u.floor })}</span>
      <span className={'k-status is-' + u.status}>{u.statusLabel}</span>
      <span className="k-plan-img">
        {u.plan && <Image src={u.plan} alt={fill(t.planAlt, { code: u.code })} width={624} height={792} sizes="(min-width: 1100px) 26vw, (min-width: 700px) 42vw, 80vw" quality={75} />}
      </span>
      <span className="k-plan-foot">
        <span className="k-plan-title">{u.bedsLabel}, {u.areaLabel}</span>
        <span className="k-plan-sub">
          <span>{u.price || (u.type ? `${t.type} ${u.type}` : '')}</span>
          <span>{t.no} {u.code}</span>
        </span>
      </span>
    </a>
  );
}
