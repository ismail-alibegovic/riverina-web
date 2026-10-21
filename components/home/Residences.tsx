'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { TypeCard } from './Types';
import { Stepped } from './Editorial';

type Group = { key: string; label: string; area: string; cards: TypeCard[] };
type Labels = { group: string; area: string; outdoor: string; floor: string; view: string; all: string };

/**
 * Apartments after Elicyon's services composition: a stepped heading with narrow copy, three portrait plates in a
 * stepped row (the middle one lower), one per bedroom group, each with its 3D plan and label. Choosing a plate opens
 * that group's types below: 3D plan, area, outdoor space, floors and live availability (prices only when the CMS
 * shows them), each linking into the apartment finder.
 */
export default function Residences({ cards, heading, text, note, labels, bedsMany, allHref }: { cards: TypeCard[]; heading: string; text: string; note: string; labels: Labels; bedsMany: string; allHref: string }) {
  const groups: Group[] = [1, 2, 3].map((b) => {
    const own = cards.filter((c) => (b === 3 ? c.bedrooms >= 3 : c.bedrooms === b));
    // "46,44 m²" (bs) or "46.44 m²" (en): the last separator is the decimal one
    const areas = own.map((c) => parseFloat(c.area.replace(/[^\d.,]/g, '').replace(/[.,](?=\d{3}(\D|$))/g, '').replace(',', '.'))).filter((n) => n > 0);
    const fmt = (n: number) => String(Math.round(n));
    return { key: String(b), label: b === 3 ? bedsMany : own[0]?.bedLabel || '', area: areas.length ? `${fmt(Math.min(...areas))}–${fmt(Math.max(...areas))} m²` : '', cards: own };
  }).filter((g) => g.cards.length);
  const [open, setOpen] = useState(0);
  const g = groups[open];

  return (
    <section id="tipovi" className="er" aria-labelledby="er-title">
      <div className="er-head">
        <Stepped id="er-title" text={heading} />
        {text && <p className="er-text" data-ed="fade">{text}</p>}
      </div>
      <div className="er-plates" role="tablist" aria-label={labels.group}>
        {groups.map((gr, i) => {
          const sample = gr.cards[0];
          return (
            <button key={gr.key} type="button" role="tab" id={`er-tab-${gr.key}`} aria-selected={open === i} aria-controls="er-panel" className={'er-plate er-plate-' + (i + 1) + (open === i ? ' is-on' : '')} onClick={() => setOpen(i)}>
              <span className="er-plan"><Image src={sample.plan3d || sample.plan} alt="" fill sizes="(min-width: 1024px) 18vw, 30vw" quality={80} /></span>
              <span className="er-label"><b>{gr.label}</b><span>{gr.area}</span></span>
            </button>
          );
        })}
      </div>
      {g && (
        <div id="er-panel" role="tabpanel" aria-labelledby={`er-tab-${g.key}`} className="er-panel" key={g.key}>
          {g.cards.map((c) => (
            <a key={c.id} className={'er-type' + (c.soldOut ? ' is-sold' : '')} href={c.href}>
              <span className="er-tplan"><Image src={c.plan3d || c.plan} alt={c.planAlt} fill sizes="(min-width: 1024px) 22vw, 70vw" quality={78} /></span>
              <span className="er-tname">{c.name}<i>{c.area}</i></span>
              <span className="er-tmeta">{c.bedLabel} · {c.outdoor} · {c.floors}</span>
              {(c.avail || c.price) && <span className="er-tavail">{[c.avail, c.price].filter(Boolean).join(' · ')}</span>}
              <span className="er-tlink"><span>{labels.view}</span></span>
            </a>
          ))}
        </div>
      )}
      <div className="er-foot">
        <a className="er-all" href={allHref}><span>{labels.all}</span></a>
        {note && <p className="er-note">{note}</p>}
      </div>
    </section>
  );
}
