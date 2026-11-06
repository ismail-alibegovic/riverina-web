import Image from 'next/image';
import { tx, illustrationLabel, type SiteData } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { V2, fill, v2Href } from '@/lib/v2/copy';
import { v2Units, floorOf } from '@/lib/v2/units';
import { Fill } from '@/components/home/text';
import Shell from './Shell';
import FloorMini from './FloorMini';
import PlanViews from './PlanViews';
import LeadForm from './LeadForm';
import Share from './Share';
import { PlanCard } from './PlanCard';
import { Title, Label, Arrow } from './ui';

/** Apartment page of the reference: plan and facts in one card, the room schedule, an interior, similar apartments, enquiry. */
export default function Detail({ data, lang, code }: { data: SiteData; lang: Lang; code: string }) {
  const t = V2[lang];
  const units = v2Units(data, lang);
  const i = units.findIndex((u) => u.code === code);
  const u = units[i];
  const prev = units[(i - 1 + units.length) % units.length];
  const next = units[(i + 1) % units.length];
  const floor = floorOf(data, u.building, u.floor);
  const apts = v2Href('apartments', lang);
  const tag = illustrationLabel(data.page, lang);
  const similar = units.filter((x) => x.code !== u.code && x.beds === u.beds).sort((a, b) => (a.type === u.type ? 0 : 1) - (b.type === u.type ? 0 : 1) || Math.abs(a.floor - u.floor) - Math.abs(b.floor - u.floor)).slice(0, 3);
  const interiors = (data.page.details?.items || []).filter((d) => d.image);
  const interior = interiors[(u.beds + u.floor) % Math.max(1, interiors.length)];
  const total = u.rooms.length ? u.areaLabel : '';
  const floorLabel = fill(t.floorAlt, { code: u.code, n: u.floor });

  return (
    <Shell data={data} lang={lang} tone="light" current="apartments" langHref={(l) => `${v2Href('apartments', l)}/${encodeURIComponent(u.code)}`}>
      <div className="kt-wrap k-crumbs">
        <nav aria-label={lang === 'bs' ? 'Putanja' : 'Breadcrumb'}>
          <a href={apts}>{t.apartments}</a><span aria-hidden="true">/</span><span aria-current="page">{t.no} {u.code}</span>
        </nav>
        <div className="k-pn">
          <a href={prev.href} aria-label={`${t.prevUnit}: ${prev.code}`} className="kt-round"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M17 10H4M9 5l-5 5 5 5" /></svg></a>
          <a href={next.href} aria-label={`${t.nextUnit}: ${next.code}`} className="kt-round is-fill"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" /></svg></a>
        </div>
      </div>

      <section className="kt-wrap k-unit" aria-labelledby="k-unit-title">
        <div className="k-unit-media" data-k="fade">
          <PlanViews
            lang={lang}
            labels={{ plan: t.plan, plan3d: t.plan3d, floor: t.onFloor }}
            plan={u.plan ? { src: u.plan, alt: fill(t.planAlt, { code: u.code }) } : null}
            plan3d={u.plan3d ? { src: u.plan3d, alt: `${t.plan3d}, ${u.code}`, tag } : null}
            floorImg={floor?.image || ''}
            floor={<FloorMini floor={floor} code={u.code} label={floorLabel} className="is-big" />}
          />
          <FloorMini floor={floor} code={u.code} label={floorLabel} className="k-unit-mini" />
          <div className="k-unit-tools">
            {u.pdf && <a className="k-circ is-text" href={u.pdf} target="_blank" rel="noopener" aria-label={t.pdfLong}>PDF</a>}
            <Share url={u.href} title={`${t.no} ${u.code} · ${u.bedsLabel}, ${u.areaLabel}`} label={t.share} copied={t.copied} />
          </div>
        </div>
        <div className="k-unit-info">
          <h1 id="k-unit-title" className="k-unit-title">{u.bedsLabel},<br />{u.areaLabel}</h1>
          <p className="k-unit-type"><b className={'k-st is-' + u.status}>{u.statusLabel}</b>{u.type && <span>{t.type} {u.type}</span>}</p>
          <ul className="k-unit-dl">
            <li>{u.buildingName}</li>
            <li>{fill(t.floorN, { n: u.floor })}</li>
            <li>{t.no} {u.code}</li>
            {u.outdoor && <li>{u.outdoor.label}</li>}
          </ul>
          <p className="k-unit-price">{u.price || t.priceOnRequest}</p>
          <div className="k-unit-cta">
            {u.status !== 'sold' && <a className="kt-pill is-navy" href="#upit">{t.enquire}</a>}
            <a className="kt-pill is-line" href={`${apts}#rvs/${u.building}/${encodeURIComponent(u.code)}`}>{t.viewOnBuilding}</a>
          </div>
        </div>
      </section>

      {u.rooms.length > 0 && (
        <section className="kt-wrap k-rooms kt-sec-s" aria-labelledby="k-rooms-title">
          <Label>{t.rooms}</Label>
          <div>
            <h2 id="k-rooms-title" className="sr-only">{t.rooms}</h2>
            <table className="k-rtable" data-k="up">
              <tbody>
                {u.rooms.map((r, j) => <tr key={j}><th scope="row"><span>{String(j + 1).padStart(2, '0')}</span>{r.name}</th><td>{r.area}</td></tr>)}
              </tbody>
              <tfoot><tr><th scope="row">{t.total}</th><td>{total}</td></tr></tfoot>
            </table>
            <p className="k-note">{t.areaNote}</p>
          </div>
        </section>
      )}

      {interior && (
        <section className="k-interior kt-sec-s" aria-labelledby="k-int-title">
          <div className="kt-wrap k-head k-head-split">
            <Title id="k-int-title" text={t.interiorTitle} />
            <p className="k-head-text" data-k="up">{t.interiorText}</p>
          </div>
          <figure className="kt-wrap k-int-fig" data-k="clip">
            <div className="k-img" data-kt-par="5"><Fill src={interior.image} alt={tx(interior.title, lang)} sizes="(min-width: 1400px) 1320px, 100vw" /></div>
            <figcaption className="k-int-cap"><b>{tx(interior.title, lang)}</b>{tag && <span>{tag}</span>}</figcaption>
          </figure>
        </section>
      )}

      {similar.length > 0 && (
        <section className="kt-wrap k-similar kt-sec-s" aria-labelledby="k-sim-title">
          <div className="k-preview-head">
            <div>
              <h2 id="k-sim-title" className="k-h3">{t.similar}</h2>
              <p className="k-small">{t.similarText}</p>
            </div>
            <a className="kt-pill is-navy" href={apts}>{t.viewAll}<Arrow /></a>
          </div>
          <div className="k-plans">{similar.map((s, j) => <PlanCard key={s.code} u={s} lang={lang} i={j} />)}</div>
        </section>
      )}

      {u.status !== 'sold' && (
        <section id="upit" className="k-enq" aria-labelledby="k-enq-title">
          <div className="kt-wrap k-enq-grid">
            <div>
              <Title id="k-enq-title" text={t.enquiryTitle} />
              <div className="k-enq-unit">
                {u.plan && <Image src={u.plan} alt="" width={624} height={792} sizes="160px" quality={72} />}
                <p><b>{t.no} {u.code}</b><br />{u.bedsLabel}, {u.areaLabel}<br />{fill(t.floorN, { n: u.floor })}</p>
              </div>
            </div>
            <LeadForm lang={lang} unit={u.code} building={u.building} message={fill(t.enquiryMsg, { code: u.code })} />
          </div>
        </section>
      )}
    </Shell>
  );
}

