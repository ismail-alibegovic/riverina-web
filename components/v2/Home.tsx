import { tx, plain, mediaUrl, imgAlt, illustrationLabel, type SiteData } from '@/lib/content';
import { href as siteHref, type Lang } from '@/lib/i18n';
import { getImageProps } from 'next/image';
import { Fill, Rich } from '@/components/home/text';
import { V2, fill, v2Href } from '@/lib/v2/copy';
import { APARTMENT_TYPES } from '@/lib/apartmentTypes';
import { v2Units, v2Facts } from '@/lib/v2/units';
import Shell from './Shell';
import Carousel from './Carousel';
import TileTrack from './TileTrack';
import Proximity from './Proximity';
import FitTitle from './FitTitle';
import Rows from './Rows';
import GalleryV2 from './GalleryV2';
import LeadForm from './LeadForm';
import { PlanCard } from './PlanCard';
import { Title, Label, Arrow } from './ui';
import JsonLd from '@/components/JsonLd';

const R = '/riverina';

export default function Home({ data, lang }: { data: SiteData; lang: Lang }) {
  const t = V2[lang];
  const p = data.page;
  const units = v2Units(data, lang);
  const f = v2Facts(units);
  const tag = illustrationLabel(p, lang);
  const apts = v2Href('apartments', lang);
  const range = f ? `${f.minArea}–${f.maxArea}` : '';
  const strip = (s: string) => s.replace(/\[\[TBD:[^\]]*\]\]/g, '').trim();

  const heroTitle = tx(p.showcase?.title, lang) || tx(p.vision?.title, lang);
  const heroLines = heroTitle.split('\n').map((l) => l.trim()).filter(Boolean);
  const manifest = tx(p.manifest?.text, lang);
  const aboutText = strip(tx(p.about?.text, lang)).split(/\n\s*\n/)[0] || '';
  const visionText = tx(p.vision?.text, lang);
  const world = (p.world?.items || []).filter((w) => tx(w.title, lang) && w.image);
  const worldLink = (l?: string) => (l === 'gallery' ? '#galerija' : l === 'location' ? '#lokacija' : l === 'developer' ? siteHref('developer', lang) : apts);

  const showcase = (p.showcase?.items || []).filter((s) => s.image).map((s) => ({ src: mediaUrl(s.image), caption: tx(s.caption, lang) }));
  const interiors = (p.details?.items || []).filter((d) => d.image).map((d) => ({ src: mediaUrl(d.image), caption: tx(d.title, lang) }));

  const gallery = [
    ...(p.gallery?.images || []).filter((g) => g.path).map((g) => ({ src: mediaUrl(g.path), alt: imgAlt(g, lang), caption: tx(g.caption, lang) })),
    ...interiors.slice(0, 3).map((i) => ({ src: i.src, alt: i.caption, caption: i.caption })),
    ...showcase.slice(1, 3).map((s) => ({ src: s.src, alt: s.caption, caption: s.caption })),
  ].filter((g, i, all) => all.findIndex((x) => x.src === g.src) === i).slice(0, 9);

  // a spread of plans for the preview: one per type, available first
  const preview = units.filter((u, i, all) => all.findIndex((x) => x.type === u.type) === i).sort((a, b) => a.area - b.area).slice(0, 6);
  const loc = p.location || {};
  const contact = p.contact || {};
  const company = p.footer?.company || 'ALYASIN Group d.o.o.';
  const views = (data.scenes?.buildings?.[0]?.views || []).filter((v: any) => v.image);
  const archImg = views.length ? mediaUrl(views[Math.floor(views.length * 0.875)].image) : `${R}/objekat/riverina-1-ugao-vecer.webp`;
  // hero plates (scripts/make-hero-plate.py): landscape and portrait versions, the portrait one with more sky
  const heroImg = (src: string) => getImageProps({ src, alt: '', fill: true, sizes: 'max(100vw, 135vh)', quality: 80, loading: 'eager', fetchPriority: 'high' }).props;
  const hero = {
    bg: heroImg(`${R}/hero/plate.webp`), bgM: heroImg(`${R}/hero/plate-m.webp`).srcSet,
    fg: heroImg(`${R}/hero/building.webp`), fgM: heroImg(`${R}/hero/building-m.webp`).srcSet,
  };
  // real figures from the sales brochure (lib/apartmentTypes.ts)
  const twoBath = APARTMENT_TYPES.filter((ty) => ty.rooms.filter(([k]) => k === 'bathroom').length >= 2).map((ty) => ty.id);
  const twoBathLabel = twoBath.length > 1 ? `${twoBath[0]}–${twoBath[twoBath.length - 1]}` : twoBath.join('');
  const maxLiving = Math.max(...APARTMENT_TYPES.flatMap((ty) => ty.rooms.filter(([k]) => k === 'living' || k === 'livingDining').map(([, a]) => a))).toLocaleString(lang === 'bs' ? 'bs-BA' : 'en-GB');
  const vision = tx(p.vision?.title, lang).replace(/\*/g, '').split(/\s+/).filter(Boolean);

  return (
    <Shell data={data} lang={lang} tone="hero" langHref={(l) => v2Href('home', l)}>
      {/* ───────── Hero (KEY TOWERS composition: full-bleed render, one-line title in the sky, the building in front of it) ───────── */}
      <section className="k-hero" aria-labelledby="k-hero-title">
        {/* plate = the 135° render of the current facade with the sky extended upward (scripts/make-hero-plate.py) */}
        <picture>
          <source media="(max-aspect-ratio: 1/1)" srcSet={hero.bgM} sizes="108vh" />
          <img {...hero.bg} className="k-hero-bg" alt={plain(p.hero?.subtitle, lang)} />
        </picture>
        <div className="k-hero-in">
          <FitTitle id="k-hero-title" parts={heroLines} />
        </div>
        {/* the same building, cut out, laid over the title so the roof rises in front of the letters */}
        <picture>
          <source media="(max-aspect-ratio: 1/1)" srcSet={hero.fgM} sizes="108vh" />
          <img {...hero.fg} className="k-hero-fg" alt="" aria-hidden="true" />
        </picture>
        <div className="k-hero-card">
          <dl>
            <div><dt>{t.heroLocation}</dt><dd>{tx(p.hero?.eyebrow, lang)}</dd></div>
            {f && <div><dt>{t.heroBuilding}</dt><dd>{fill(t.heroUnits, { n: f.units, a: range })}</dd></div>}
          </dl>
          <a className="k-hero-link" href={apts}><span>{tx(p.hero?.cta, lang) || t.choose}</span><i className="k-hero-arrow" aria-hidden="true"><Arrow /></i></a>
        </div>
        <a className="k-hero-scroll" href="#uvod"><span>{t.scroll}</span><i aria-hidden="true" /></a>
        {tag && <span className="kt-tag">{tag}</span>}
      </section>

      {/* ───────── Everything around the residence (reference: "Everything you need for a comfortable life") ───────── */}
      {world.length > 0 && (
        <section id="uvod" className="k-life" aria-labelledby="k-life-title">
          <div className="kt-wrap k-split">
            <h2 id="k-life-title" className="k-h2" data-k="up"><Rich text={t.worldTitle.replace('\n', ' ')} /></h2>
            {tx(p.world?.text, lang) && <p className="k-split-text" data-k="up">{tx(p.world?.text, lang)}</p>}
          </div>
          <div className="kt-wrap k-life-grid">
            {world.map((w, i) => (
              <a className="k-life-card" href={worldLink(w.link)} key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                <div className="k-img"><Fill src={w.image} alt="" sizes="(min-width: 900px) 31vw, 100vw" /></div>
                <h3>{tx(w.title, lang)}</h3>
                <p>{tx(w.text, lang)}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ───────── About the residence: statement + 2×2 figures, then a wide render ───────── */}
      <section id="o-projektu" className="k-about" aria-labelledby="k-about-title">
        <div className="kt-wrap k-split">
          <h2 id="k-about-title" className="k-h2" data-k="up">{aboutText}</h2>
          <div>
            {tx(p.statement?.text, lang) && <p className="k-split-text" data-k="up">{tx(p.statement?.text, lang)}</p>}
            {f && (
              <div className="k-stats" data-k="up" style={{ '--i': 1 } as React.CSSProperties}>
                <div><b data-kt-count>{f.units}</b><span>{t.statUnits}</span></div>
                <div><b data-kt-count>{f.types}</b><span>{t.statTypes}</span></div>
                <div><b data-kt-count>{f.floors}</b><span>{t.statFloors}</span></div>
                <div><b>{range}<small>m²</small></b><span>{t.statArea}</span></div>
              </div>
            )}
          </div>
        </div>
        <figure className="k-wide" data-k="clip">
          <div className="k-img k-wide-img" data-kt-par="6"><Fill src={`${R}/naselje/3.webp`} alt={showcase[0]?.caption || ''} sizes="100vw" quality={80} /></div>
          {tag && <span className="kt-tag">{tag}</span>}
        </figure>
      </section>

      {/* ───────── Architecture & lifestyle carousel (reference: "Features of the complex") ───────── */}
      {showcase.length > 1 && (
        <section className="k-feat" aria-labelledby="k-feat-title">
          <Carousel
            id="k-feat-title"
            title={t.archTitle.replace('\n', ' ')}
            text={tx(p.showcase?.text, lang) || t.archText}
            labels={{ prev: lang === 'bs' ? 'Prethodno' : 'Previous', next: lang === 'bs' ? 'Sljedeće' : 'Next' }}
            tag={tag}
            items={[
              { kind: 'img', src: showcase[0].src, caption: showcase[0].caption, size: 'm' },
              { kind: 'img', src: showcase[1].src, caption: showcase[1].caption, size: 'l' },
              { kind: 'card', title: t.archCardTitle, text: t.archCardText },
              ...showcase.slice(2).map((s, i) => ({ kind: 'img' as const, src: s.src, caption: s.caption, size: (i % 2 ? 'l' : 'm') as 'm' | 'l' })),
            ]}
          />
        </section>
      )}

      {/* ───────── About THE PROJECT (reference: "About THE PROJECT" over the lobby) ───────── */}
      <section className="k-proj" aria-labelledby="k-proj-title">
        <div className="k-proj-hero">
          <div className="k-img" data-kt-par="5"><Fill src={`${R}/enterijer/enterijer-1.webp`} alt="" sizes="100vw" quality={80} /></div>
          <h2 id="k-proj-title" className="k-proj-title">
            <span className="k-proj-small" data-k="up">{t.projSmall}</span>
            <span className="k-proj-big" data-k="up" style={{ '--i': 1, '--n': t.projBig.length } as React.CSSProperties}>{t.projBig}</span>
          </h2>
          {tag && <span className="kt-tag">{tag}</span>}
        </div>
        <div className="kt-wrap k-proj-intro">
          <p className="k-proj-label" data-k="fade">{t.projLabel}</p>
          <div>
            {manifest && <p className="k-proj-lead" data-k="up"><Rich text={manifest} /></p>}
            {f && (
              <p className="k-proj-num" data-k="up" style={{ '--i': 1 } as React.CSSProperties}>
                <b data-kt-count>{f.units}</b><span>{t.unitsBig}</span>
              </p>
            )}
          </div>
        </div>
        <Rows
          tag={tag}
          rows={[
            { title: plain(p.categories?.items?.[0]?.title, lang) || t.bigTitle, text: visionText, src: archImg },
            { title: plain(p.categories?.items?.[1]?.title, lang) || 'Enterijer', text: tx(p.types?.text, lang), src: `${R}/enterijer/enterijer-6.webp` },
            { title: t.typeLabel, text: tx(p.showcase?.text, lang) || t.archText, src: `${R}/naselje/4.webp` },
          ]}
        />
        <div className="kt-wrap k-fac">
          <p className="k-fac-label" data-k="fade">{t.facLabel}</p>
          <h2 className="k-fac-title" data-k="up">{t.facTitle}</h2>
          <ol className="k-fac-grid">
            {[
              [t.row1, t.row1t],
              [t.row2, f ? fill(t.row2t, { n: f.units, a: range }) : ''],
              [t.row3, t.row3t],
              [t.fac4, f ? fill(t.fac4t, { a: range }) : ''],
            ].map(([h, x], i) => (
              <li key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                <span className="k-fac-n" aria-hidden="true">{i + 1}</span>
                <h3>{h}</h3>
                <p>{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Apartments ───────── */}
      <section className="k-apts kt-sec" aria-labelledby="k-apts-title">
        {f && (
          <TileTrack
            id="k-apts-title"
            label={t.aptsLabel}
            title={t.aptsTitle2}
            text={tx(p.types?.text, lang)}
            labels={{ prev: lang === 'bs' ? 'Prethodno' : 'Previous', next: lang === 'bs' ? 'Sljedeće' : 'Next' }}
            tiles={[
              { label: t.tTypes, value: String(f.types), caption: t.tTypesC, text: t.statTypesT, src: interiors[0]?.src, href: apts },
              { label: t.tArea, value: range, unit: '', caption: t.tAreaC, text: t.statAreaT, src: interiors[3]?.src, href: apts },
              { label: t.tBeds, value: `${f.minBeds}–${f.maxBeds}`, caption: t.tBedsC, text: t.statBedsT, src: interiors[2]?.src, href: apts },
              { label: t.tOut, value: String(f.units), caption: t.tOutC, text: t.tOutT, src: interiors[1]?.src, href: apts },
              { label: t.tFloors, value: String(f.floors), caption: t.tFloorsC, text: t.tFloorsT, src: interiors[4]?.src, href: apts },
            ]}
          />
        )}
        <div className="kt-wrap k-preview">
          <div className="k-preview-head">
            <h3>{t.selection} <sup>({units.length})</sup></h3>
            <a className="kt-pill is-line" href={apts}>{t.allApts}<Arrow /></a>
          </div>
          <div className="k-plans">
            {preview.map((u, i) => <PlanCard key={u.code} u={u} lang={lang} i={i} />)}
          </div>
        </div>
      </section>

      {/* ───────── Typographic composition (reference: "Cozy Evenings Among The Greenery") ───────── */}
      {vision.length >= 2 && (
        <section className="k-type" aria-label={plain(p.vision?.title, lang)}>
          <div className="kt-wrap">
            <p className="k-fac-label" data-k="fade">{t.typeLabel}</p>
            <h2 className="k-type-title">
              <span className="k-type-line is-1" data-k="up"><TypeImg src={`${R}/naselje/4.webp`} w="wide" />{vision[0]}</span>
              <span className="k-type-line is-2" data-k="up" style={{ '--i': 1 } as React.CSSProperties}>{vision[1]}<TypeImg src={`${R}/enterijer/enterijer-4.webp`} w="tall" /></span>
              <span className="k-type-line is-3" data-k="up" style={{ '--i': 2 } as React.CSSProperties}><TypeImg src={`${R}/naselje/16.webp`} w="wide" />{vision.slice(2).join(' ')}</span>
            </h2>
            {visionText && <p className="k-type-text" data-k="up">{visionText}</p>}
          </div>
        </section>
      )}

      {/* ───────── Outdoor space (reference "Parking": three light figure tiles) ───────── */}
      {f && (
        <section className="k-figs" aria-labelledby="k-out-title">
          <div className="kt-wrap k-split k-tt-head">
            <p className="kt-label kt-eyebrow" data-k="fade">{t.outLabel}</p>
            <div>
              <h2 id="k-out-title" className="k-h2" data-k="up">{t.outTitle}</h2>
              <p className="k-split-text" data-k="up">{t.outText}</p>
            </div>
          </div>
          <div className="kt-wrap k-figs-grid">
            {[
              [t.outLoggia, String(units.filter((u) => u.outdoor?.kind === 'loggia').length)],
              [t.outTerrace, String(units.filter((u) => u.outdoor?.kind === 'terrace').length)],
              [t.outFloors, (() => { const fl = units.filter((u) => u.outdoor?.kind === 'loggia').map((u) => u.floor); return fl.length ? `${Math.min(...fl)}–${Math.max(...fl)}` : ''; })()],
            ].map(([l, v], i) => (
              <div className="k-fig" key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                <span>{l}</span>
                <b data-kt-count>{v}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Interiors (reference "Storage space": big picture + three stacked figure rows) ───────── */}
      <section className="k-store" aria-labelledby="k-int-title">
        <p className="k-fac-label kt-wrap" data-k="fade">{t.intLabel}</p>
        <div className="kt-wrap k-store-grid">
          <figure className="k-store-big" data-k="fade">
            <div className="k-img"><Fill src={`${R}/enterijer/enterijer-2.webp`} alt="" sizes="(min-width: 900px) 45vw, 100vw" /></div>
            <h2 id="k-int-title">{t.intTitle}</h2>
          </figure>
          <div className="k-store-list">
            {[
              { v: f ? `${f.minBeds}–${f.maxBeds}` : '', c: t.intBeds, x: t.intBedsT, src: `${R}/enterijer/enterijer-6.webp` },
              { v: '2', c: t.intBath, x: fill(t.intBathT, { t: twoBathLabel }), src: `${R}/enterijer/enterijer-9.webp` },
              { v: maxLiving, c: t.intLiving, x: t.intLivingT, src: `${R}/enterijer/enterijer-5.webp` },
            ].map((r, i) => (
              <div className="k-store-row" key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                <div>
                  <b>{r.v}</b>
                  <span>{r.c}</span>
                  <p>{r.x}</p>
                </div>
                <div className="k-img"><Fill src={r.src} alt="" sizes="(min-width: 900px) 18vw, 40vw" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Gallery ───────── */}
      {gallery.length >= 5 && (
        <section id="galerija" className="k-gal kt-sec" aria-labelledby="k-gal-title">
          <div className="kt-wrap k-head k-head-split">
            <Label>{t.galleryLabel}</Label>
            <Title id="k-gal-title" text={t.galleryTitle} />
          </div>
          <GalleryV2 images={gallery} tag={tag} lang={lang} />
        </section>
      )}

      {/* ───────── Location (reference "Proximity") ───────── */}
      <section id="lokacija" className="k-loc" aria-labelledby="k-loc-title">
        <Proximity
          id="k-loc-title"
          title={(tx(loc.title, lang) || 'Ilidža, Sarajevo').replace(/\*/g, '').replace('\n', ' ')}
          text={strip(tx(loc.text, lang))}
          more={{ href: siteHref('location', lang), label: t.locLink }}
          labels={{ prev: lang === 'bs' ? 'Prethodno' : 'Previous', next: lang === 'bs' ? 'Sljedeće' : 'Next' }}
          groups={[
            { label: t.pLoc, icon: 'pin', items: [
              { src: loc.image ? mediaUrl(loc.image) : `${R}/lokacija/mapa-ilidza.webp`, title: t.pMap, sub: t.pPlace },
              ...[['9', 0], ['7', 1], ['14', 2]].map(([n]) => ({ src: `${R}/naselje/${n}.webp`, title: (showcase.find((x) => x.src.endsWith(`/${n}.webp`))?.caption) || (gallery.find((x) => x.src.endsWith(`/${n}.webp`))?.caption) || t.pPlace, sub: t.pViz })),
            ] },
            { label: t.pArea, icon: 'leaf', items: showcase.map((x) => ({ src: x.src, title: x.caption, sub: t.pViz })) },
          ]}
        />
      </section>

      {/* ───────── Contact ───────── */}
      <section id="kontakt" className="k-contact kt-sec" aria-labelledby="k-contact-title">
        <div className="kt-wrap">
          <h2 id="k-contact-title" className="k-contact-title" data-k="up">{plain(contact.title, lang) || t.contactTitle}</h2>
          <dl className="k-rows" data-k="up">
            {(contact.phone || data.settings.phone) && <Row label={lang === 'bs' ? 'Telefon' : 'Phone'} value={<a href={'tel:' + String(contact.phone || data.settings.phone).replace(/[^\d+]/g, '')}>{contact.phone || data.settings.phone}</a>} />}
            {contact.email && <Row label="E-mail" value={<a href={'mailto:' + contact.email}>{contact.email}</a>} />}
            {tx(contact.address, lang) && <Row label={lang === 'bs' ? 'Adresa' : 'Address'} value={tx(contact.address, lang)} />}
            {tx(contact.hours, lang) && <Row label={lang === 'bs' ? 'Radno vrijeme' : 'Opening hours'} value={tx(contact.hours, lang)} />}
            <Row label={t.place} value={tx(p.hero?.eyebrow, lang) || 'Ilidža, Sarajevo'} />
            <Row label={t.investor} value={company} />
          </dl>
          <figure className="k-cmap" data-k="fade">
            <div className="k-img"><Fill src={`${R}/lokacija/mapa-ilidza-light.webp`} alt={t.mapAlt} sizes="(min-width: 1440px) 1360px, 100vw" quality={80} /></div>
          </figure>
          <div className="k-split k-contact-form">
            <div>
              <h3 className="k-h2" data-k="up">{t.contactSend}</h3>
              <p className="k-split-text" data-k="up">{tx(contact.text, lang) || t.contactLead}</p>
            </div>
            <div data-k="up" style={{ '--i': 1 } as React.CSSProperties}><LeadForm lang={lang} /></div>
          </div>
        </div>
      </section>
      <JsonLd data={data} lang={lang} route="home" />
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="k-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
      <span className="k-star" aria-hidden="true">✳</span>
    </div>
  );
}

function TypeImg({ src, w }: { src: string; w: 'wide' | 'tall' }) {
  return (
    <span className={'k-type-img is-' + w} aria-hidden="true">
      <Fill src={src} alt="" sizes="240px" />
    </span>
  );
}

