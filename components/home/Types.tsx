'use client';
import { useState } from 'react';
import Image from 'next/image';

export type TypeCard = {
  id: string;
  name: string;
  bedrooms: number;
  bedLabel: string;
  area: string;
  outdoor: string;
  floors: string;
  units: string;
  /** "Slobodno: 5 od 8"; empty when the unit table is not available */
  avail: string;
  soldOut: boolean;
  price: string;
  href: string;
  /** resolved image URL */
  plan: string;
  /** 3D plan of the type's sample apartment; shown first, the 2D plan appears on hover */
  plan3d: string;
  planAlt: string;
  rooms: [string, string][];
  total: string;
};

type Labels = { filter: string; all: string; rooms: string; total: string; view: string; area: string; outdoor: string; floor: string };

/** Apartment types of the first building with a bedroom filter; room lists open in place. */
export default function Types({ cards, labels }: { cards: TypeCard[]; labels: Labels }) {
  const [beds, setBeds] = useState<number | null>(null);
  // one filter button per bedroom count, labelled like the cards ("2 spavaće sobe")
  const options = [...new Map(cards.map((c) => [c.bedrooms, c.bedLabel] as const)).entries()].sort((a, b) => a[0] - b[0]);
  return (
    <>
      {options.length > 1 && (
        <div className="wrap types-filter" role="group" aria-label={labels.filter} data-reveal="up">
          <button type="button" aria-pressed={beds === null} onClick={() => setBeds(null)}>{labels.all}</button>
          {options.map(([n, label]) => (
            <button type="button" key={n} aria-pressed={beds === n} onClick={() => setBeds(beds === n ? null : n)}>{label}</button>
          ))}
        </div>
      )}
      <ul className="wrap types-grid" aria-live="polite">
        {cards.map((c, i) => (
          <li key={c.id} className={'type' + (c.soldOut ? ' is-sold' : '')} hidden={beds !== null && c.bedrooms !== beds} data-reveal="up" style={{ '--i': i % 3 } as React.CSSProperties}>
            <article aria-labelledby={'type-' + c.id}>
              <div className={'type-plan' + (c.plan3d ? ' has-3d' : '')}>
                {c.plan3d && <Image className="is-3d" src={c.plan3d} alt={c.planAlt} fill sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw" quality={80} />}
                <Image className="is-2d" src={c.plan} alt={c.plan3d ? '' : c.planAlt} fill sizes="(min-width: 1100px) 400px, (min-width: 700px) 45vw, 90vw" quality={80} />
              </div>
              <header className="type-head">
                <h3 id={'type-' + c.id}>{c.name}</h3>
                <p className="type-area">{c.area}</p>
              </header>
              <dl className="type-meta">
                <div><dt className="sr-only">{labels.filter}</dt><dd>{c.bedLabel}</dd></div>
                <div><dt className="sr-only">{labels.outdoor}</dt><dd>{c.outdoor}</dd></div>
                <div><dt className="sr-only">{labels.floor}</dt><dd>{c.floors}</dd></div>
              </dl>
              <p className="label type-status">{c.avail || c.units}{c.price && <span className="type-price"> · {c.price}</span>}</p>
              <details className="type-rooms">
                <summary>{labels.rooms}</summary>
                <table>
                  <tbody>
                    {c.rooms.map(([name, a], j) => <tr key={j}><th scope="row">{name}</th><td>{a}</td></tr>)}
                  </tbody>
                  <tfoot><tr><th scope="row">{labels.total}</th><td>{c.total}</td></tr></tfoot>
                </table>
              </details>
              <a className="link-line" href={c.href} aria-describedby={'type-' + c.id}>{labels.view}</a>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
