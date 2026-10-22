'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { TypeCard } from './Types';
import { Stepped } from './Editorial';
import Slider from '../Slider';

type Labels = { group: string; all: string; view: string; filterAll: string; prev: string; next: string };

/**
 * The apartment collection: a stepped heading with short copy beside it, the bedroom tabs, then the apartment types
 * on the site's one slider, three across inside the centred page grid. Each card shows the type's 3D plan on ivory
 * paper with its live availability, the name and area in the display serif and the facts over hairlines, and opens
 * that type in the apartment finder. The link to every apartment and the area note close the section.
 */
export default function Residences({ cards, heading, text, note, labels, bedsMany, allHref }: { cards: TypeCard[]; heading: string; text: string; note: string; labels: Labels; bedsMany: string; allHref: string }) {
  const groups = useMemo(() => [
    { key: 'all', label: labels.filterAll, test: () => true },
    ...[1, 2, 3].map((b) => {
      const own = cards.filter((c) => (b === 3 ? c.bedrooms >= 3 : c.bedrooms === b));
      return { key: String(b), label: b === 3 ? bedsMany : own[0]?.bedLabel || '', test: (c: TypeCard) => (b === 3 ? c.bedrooms >= 3 : c.bedrooms === b), n: own.length };
    }).filter((g) => g.n),
  ], [cards, bedsMany, labels.filterAll]);
  const [group, setGroup] = useState('all');
  const shown = cards.filter((groups.find((g) => g.key === group) || groups[0]).test);

  return (
    <section id="tipovi" className="er" aria-labelledby="er-title">
      <div className="er-in">
        <div className="er-head">
          <Stepped id="er-title" text={heading} />
          {text && <p className="er-text" data-ed="fade">{text}</p>}
        </div>

        <div className="er-filter" role="group" aria-label={labels.group}>
          {groups.map((g) => (
            <button key={g.key} type="button" className={'er-chip' + (group === g.key ? ' is-on' : '')} aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>{g.label}</button>
          ))}
        </div>

        <Slider resetKey={group} labels={{ prev: labels.prev, next: labels.next }}>
          {shown.map((c) => (
            <a key={c.id} className={'er-card' + (c.soldOut ? ' is-sold' : '')} href={c.href}>
              <span className="er-cplan">
                <Image src={c.plan3d || c.plan} alt={c.planAlt} fill sizes="(min-width: 1100px) 30vw, (min-width: 640px) 46vw, 86vw" quality={80} />
                {c.avail && <span className="er-status">{c.avail}</span>}
              </span>
              <span className="er-cbody">
                <span className="er-cname"><b>{c.name}</b><i>{c.area}</i></span>
                <span className="er-specs">
                  <span>{c.bedLabel}</span>
                  <span>{c.outdoor}</span>
                  <span>{c.floors}</span>
                  <span>{c.units}</span>
                </span>
                {c.price && <span className="er-price">{c.price}</span>}
                <span className="er-go">{labels.view}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
              </span>
            </a>
          ))}
        </Slider>

        <div className="er-foot">
          <a className="er-all" href={allHref}><span>{labels.all}</span></a>
          {note && <p className="er-note">{note}</p>}
        </div>
      </div>
    </section>
  );
}
