import { tx, plain, mediaUrl, imgAlt, illustrationLabel, type SiteData } from '@/lib/content';
import { href as siteHref, type Lang } from '@/lib/i18n';
import { Fill, Rich } from '@/components/home/text';
import { V2, fill, v2Href } from '@/lib/v2/copy';
import { v2Units, v2Facts } from '@/lib/v2/units';
import Shell from './Shell';
import Carousel from './Carousel';
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
  const archImg = views.length ? views[Math.floor(views.length * 0.875)].image : `${R}/objekat/riverina-1-ugao-vecer.webp`;
  // hero: current facade from the 360° set (135°: lawn in front, open sky, no traffic); CMS hero image as fallback
  const heroView = views.find((v: any) => v.id === 'a135') || views[Math.round(views.length * 0.375)];
  const heroImg = heroView?.image || p.hero?.image || `${R}/objekat/riverina-1-ugao-vecer.webp`;
  const vision = tx(p.vision?.title, lang).replace(/\*/g, '').split(/\s+/).filter(Boolean);

  return (
    <Shell data={data} lang={lang} tone="light" langHref={(l) => v2Href('home', l)}>
      {/* ───────── Hero ───────── */}
      <section className="k-hero" aria-labelledby="k-hero-title">
        <div className="kt-wrap k-hero-top">
          <FitTitle id="k-hero-title" parts={heroLines} />
          <div className="k-hero-bar">
            <p className="k-hero-sub">{tx(p.hero?.subtitle, lang)}</p>
            <dl className="k-hero-facts">
              <div><dt>{t.heroLocation}</dt><dd>{tx(p.hero?.eyebrow, lang)}</dd></div>
              {f && <div><dt>{t.heroBuilding}</dt><dd>{fill(t.heroUnits, { n: f.units, a: range })}</dd></div>}
            </dl>
            <div className="k-hero-cta">
              <a className="kt-pill is-navy" href={apts}>{tx(p.hero?.cta, lang) || t.choose}<Arrow /></a>
              <a className="kt-round k-hero-down" href="#uvod" aria-label={t.scroll}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v13M5 11l5 5 5-5" /></svg></a>
            </div>
          </div>
        </div>
        <figure className="k-hero-pic">
          <div className="k-img" data-kt-par="3"><Fill src={heroImg} alt={plain(p.hero?.subtitle, lang)} sizes="100vw" priority quality={82} /></div>
          {tag && <span className="kt-tag">{tag}</span>}
        </figure>
      </section>

      {/* ───────── Intro statement ───────── */}
      <section id="uvod" className="k-intro kt-sec">
        <div className="kt-wrap">
          {manifest && <p className="k-statement" data-k="up"><Rich text={manifest} /></p>}
          {f && (
            <ul className="k-specs" data-k="up" style={{ '--i': 1 } as React.CSSProperties} aria-label={t.facts}>
              <li><span>{t.statUnits}</span><b>{f.units}</b></li>
              <li><span>{t.statTypes}</span><b>{f.types}</b></li>
              <li><span>{t.statArea}</span><b>{range} m²</b></li>
              <li><span>{t.statFloors}</span><b>{f.floors}</b></li>
            </ul>
          )}
        </div>
        {world.length > 0 && (
          <div className="kt-wrap k-world">
            <div className="k-head">
              <Title text={t.worldTitle} />
              {tx(p.world?.text, lang) && <p className="k-head-text" data-k="up">{tx(p.world?.text, lang)}</p>}
            </div>
            <div className="k-world-grid">
              {world.map((w, i) => (
                <a className="k-world-card" href={worldLink(w.link)} key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                  <div className="k-img k-world-img"><Fill src={w.image} alt="" sizes="(min-width: 900px) 31vw, 100vw" /></div>
                  <h3>{tx(w.title, lang)}</h3>
                  <p>{tx(w.text, lang)}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ───────── About the residence ───────── */}
      <section id="o-projektu" className="k-about" aria-labelledby="k-about-title">
        <div className="kt-wrap k-about-grid">
          <div className="k-about-l">
            <Label>{t.aboutLabel}</Label>
            <h2 id="k-about-title" className="k-about-title" data-k="up">{aboutText}</h2>
          </div>
          <div className="k-about-r">
            {tx(p.types?.text, lang) && <p className="k-small" data-k="up">{tx(p.types?.text, lang)}</p>}
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
          <div className="k-img k-wide-img" data-kt-par="7"><Fill src={`${R}/naselje/3.webp`} alt={showcase[0]?.caption || ''} sizes="100vw" quality={80} /></div>
          {tag && <span className="kt-tag">{tag}</span>}
        </figure>
      </section>

      {/* ───────── Architecture & lifestyle carousel ───────── */}
      {showcase.length > 1 && (
        <section className="k-feat kt-sec" aria-labelledby="k-feat-title">
          <Carousel
            id="k-feat-title"
            title={t.archTitle}
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

      {/* ───────── About THE ARCHITECTURE (dark) ───────── */}
      <section className="k-arch" aria-labelledby="k-arch-title">
        <div className="k-arch-hero">
          <div className="k-img" data-kt-par="6"><Fill src={archImg} alt="" sizes="100vw" /></div>
          <div className="k-arch-shade" aria-hidden="true" />
          <h2 id="k-arch-title" className="k-arch-title kt-wrap">
            <span className="k-arch-top" data-k="up">{t.bigTitleTop}</span>
            <span className="k-arch-big" data-k="up" style={{ '--i': 1 } as React.CSSProperties}>{t.bigTitle}</span>
          </h2>
          {tag && <span className="kt-tag">{tag}</span>}
        </div>
        <div className="kt-wrap k-arch-intro">
          <Label>{t.bigLabel}</Label>
          <div>
            <p className="k-arch-lead" data-k="up">{visionText}</p>
            {f && (
              <p className="k-arch-num" data-k="up" style={{ '--i': 1 } as React.CSSProperties}>
                <b data-kt-count>{f.units}</b><span>{t.unitsBig}</span>
              </p>
            )}
          </div>
        </div>
        <Rows
          tag={tag}
          rows={[
            { title: t.row1, text: t.row1t, src: `${R}/objekat/objekat-2.webp` },
            { title: t.row2, text: f ? fill(t.row2t, { n: f.units, a: range }) : '', src: `${R}/naselje/15.webp` },
            { title: t.row3, text: t.row3t, src: `${R}/objekat/objekat-6.webp` },
          ]}
        />
      </section>

      {/* ───────── Typographic composition ───────── */}
      {vision.length >= 2 && (
        <section className="k-type kt-sec" aria-label={plain(p.vision?.title, lang)}>
          <div className="kt-wrap">
            <Label center>{t.archLabel}</Label>
            <h2 className="k-type-title">
              <span className="k-type-line" data-k="up">{vision[0]}<TypeImg src={`${R}/naselje/2.webp`} w="wide" /></span>
              <span className="k-type-line is-in2" data-k="up" style={{ '--i': 1 } as React.CSSProperties}><TypeImg src={`${R}/enterijer/enterijer-3.webp`} w="tall" />{vision[1]}</span>
              <span className="k-type-line is-serif" data-k="up" style={{ '--i': 2 } as React.CSSProperties}>{vision.slice(2).join(' ')}<TypeImg src={`${R}/naselje/16.webp`} w="wide" /></span>
            </h2>
            {tx(p.statement?.text, lang) && <p className="k-type-text" data-k="up">{tx(p.statement?.text, lang)}</p>}
          </div>
        </section>
      )}

      {/* ───────── Apartments ───────── */}
      <section className="k-apts kt-sec" aria-labelledby="k-apts-title">
        <div className="kt-wrap k-head k-head-split">
          <Label>{t.aptsLabel}</Label>
          <div>
            <Title id="k-apts-title" text={t.aptsTitle} />
          </div>
        </div>
        {f && (
          <div className="kt-wrap k-tiles">
            {[
              { label: t.statTypes, value: String(f.types), text: t.statTypesT, src: interiors[0]?.src },
              { label: t.statArea, value: `${range}`, unit: 'm²', text: t.statAreaT, src: interiors[3]?.src },
              { label: t.statBeds, value: `${f.minBeds}–${f.maxBeds}`, text: t.statBedsT, src: interiors[2]?.src },
            ].map((s, i) => (
              <a className="k-tile" href={apts} key={i} data-k="up" style={{ '--i': i } as React.CSSProperties}>
                <div className="k-tile-top">
                  <span className="k-tile-label">{s.label}</span>
                  <b>{s.value}{s.unit && <small>{s.unit}</small>}</b>
                  <p>{s.text}</p>
                </div>
                {s.src && <div className="k-img k-tile-img"><Fill src={s.src} alt="" sizes="(min-width: 900px) 31vw, 100vw" /></div>}
              </a>
            ))}
          </div>
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

      {/* ───────── Location ───────── */}
      <section id="lokacija" className="k-loc" aria-labelledby="k-loc-title">
        <div className="kt-wrap k-loc-head">
          <Label light>{t.locLabel}</Label>
          <div>
            <Title id="k-loc-title" text={tx(loc.title, lang) || 'Ilidža,\n*Sarajevo*'} />
            <p className="k-small" data-k="up">{strip(tx(loc.text, lang))}</p>
            {tx(loc.address, lang) && <p className="k-loc-address">{tx(loc.address, lang)}</p>}
            {loc.map_link && <a className="kt-link" href={loc.map_link} target="_blank" rel="noopener noreferrer">{lang === 'bs' ? 'Otvori u Google Maps' : 'Open in Google Maps'}</a>}
          </div>
        </div>
        <figure className="k-map" data-k="fade">
          <div className="k-map-img"><Fill src={loc.image || `${R}/lokacija/mapa-ilidza.webp`} alt={t.mapAlt} sizes="100vw" quality={80} /></div>
          {/* soft pulse over the pin printed on the map (Ilidža) */}
          {!loc.image && <span className="k-map-pulse" aria-hidden="true" />}
        </figure>
      </section>

      {/* ───────── Contact ───────── */}
      <section id="kontakt" className="k-contact kt-sec" aria-labelledby="k-contact-title">
        <div className="kt-wrap">
          <h2 id="k-contact-title" className="k-contact-title" data-k="up">{plain(contact.title, lang) || t.contactTitle}</h2>
          <div className="k-contact-grid">
            <div>
              <p className="k-small" data-k="up">{tx(contact.text, lang) || t.contactLead}</p>
              <dl className="k-rows" data-k="up">
                {(contact.phone || data.settings.phone) && <Row label={V2[lang].contact} value={<a href={'tel:' + String(contact.phone || data.settings.phone).replace(/[^\d+]/g, '')}>{contact.phone || data.settings.phone}</a>} />}
                {contact.email && <Row label="E-mail" value={<a href={'mailto:' + contact.email}>{contact.email}</a>} />}
                {tx(contact.address, lang) && <Row label={lang === 'bs' ? 'Adresa' : 'Address'} value={tx(contact.address, lang)} />}
                {tx(contact.hours, lang) && <Row label={lang === 'bs' ? 'Radno vrijeme' : 'Opening hours'} value={tx(contact.hours, lang)} />}
                <Row label={t.place} value={tx(p.hero?.eyebrow, lang) || 'Ilidža, Sarajevo'} />
                <Row label={t.investor} value={company} />
              </dl>
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

