import { Lang, SiteData, tx, mediaUrl, UI, sectionList, resolveLink, SectionKey, imgAlt, illustrationLabel } from '@/lib/content';
import { href, LOCALES } from '@/lib/i18n';
import { APARTMENT_TYPES, ROOM_NAMES, unitsOfType } from '@/lib/apartmentTypes';
import PLANS_3D from '@/lib/plans3d.json';
import { siteNav } from '@/lib/nav';
import SiteChrome from './site/SiteChrome';
import Footer from './site/Footer';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import Opening from './home/Opening';
import Prologue from './home/Prologue';
import About from './home/About';
import Categories from './home/Categories';
import Details from './home/Details';
import Types, { type TypeCard } from './home/Types';
import Showcase from './home/Showcase';
import Statement from './home/Statement';
import Vision from './home/Vision';
import World from './home/World';
import { Fill, Heading, Paras } from './home/text';
import JsonLd from './JsonLd';

const FALLBACK_BUILDING = '/riverina/objekat/objekat-3.webp';

export default function Site({ data, lang }: { data: SiteData; lang: Lang }) {
  const { page, settings, units } = data;
  const t = UI[lang];
  const name = settings.project_name || 'Riverina Residence';
  const loc = page.location || {};
  const contact = page.contact || {};
  const gallery = (page.gallery?.images || []).filter((g) => g.path);
  const manifestText = tx(page.manifest?.text, lang);
  const hasLocation = !!(tx(loc.title, lang) || tx(loc.text, lang) || loc.map_embed);
  const buildings: any[] = data.scenes?.buildings || [];
  const order = sectionList(page);
  // One label for the "see apartments" intent everywhere: the hero button text from the CMS.
  const aptLabel = tx(page.hero?.cta, lang) || t.chooseApartment;
  const has = (k: SectionKey) => order.includes(k);

  const nav = siteNav(data, lang);
  const tag = illustrationLabel(page, lang);

  const sections: Record<SectionKey, () => React.ReactNode> = {
    hero: () => <Opening hero={page.hero || {}} lang={lang} name={name} tag={tag} />,

    vision: () => page.vision && tx(page.vision.title, lang) && <Vision vision={page.vision} lang={lang} tag={tag} />,

    world: () => page.world && (page.world.items || []).length > 0 && <World world={page.world} lang={lang} cta={{ href: href('apartments', lang), label: aptLabel }} more={t.learnMore} />,

    manifest: () => manifestText && (
      <Prologue text={manifestText} label={t.manifest} images={(page.manifest?.images || []).filter((m) => m.path).map((m) => ({ src: mediaUrl(m.path), alt: imgAlt(m, lang) }))} />
    ),

    about: () => (tx(page.about?.title, lang) || tx(page.about?.text, lang)) && <About about={page.about || {}} units={units} lang={lang} tag={tag} />,

    showcase: () => {
      const items = (page.showcase?.items || []).filter((it) => it.image).map((it) => ({ src: mediaUrl(it.image), caption: tx(it.caption, lang) }));
      return items.length > 1 && <Showcase title={tx(page.showcase?.title, lang)} text={tx(page.showcase?.text, lang)} items={items} tag={tag} label={tx(page.showcase?.title, lang).replace(/\*/g, '').replace(/\n/g, ' ')} />;
    },

    statement: () => page.statement?.image && tx(page.statement?.title, lang) && <Statement st={page.statement} lang={lang} tag={tag} cta={aptLabel} />,

    categories: () => {
      const items = (page.categories?.items || []).filter((c) => tx(c.title, lang) && c.image);
      return items.length > 0 && (
        <section aria-label={t.categories}>
          <Categories tag={tag} items={items.map((c) => ({ title: tx(c.title, lang), caption: tx(c.caption, lang), src: mediaUrl(c.image), href: resolveLink(c.link, lang), linkLabel: tx(c.link_label, lang) || (c.link === 'apartments' ? aptLabel : t.categories) }))} />
        </section>
      );
    },

    buildings: () => buildings.length > 0 && (
      <section className="section blds">
        <div className="wrap blds-head">
          <Heading text={tx(page.buildings?.title, lang)} />
          {tx(page.buildings?.text, lang) && <p className="lead" data-reveal="up">{tx(page.buildings?.text, lang)}</p>}
        </div>
        <div className={'wrap wrap-wide blds-grid n-' + Math.min(buildings.length, 3)}>
          {buildings.map((b, i) => {
            const own = units.filter((u) => u.building === b.id);
            const free = own.filter((u) => u.status === 'available').length;
            const soon = b.status === 'soon';
            const img = b.views?.[b.default_view || 0]?.image || b.views?.[0]?.image || FALLBACK_BUILDING;
            const status = soon ? t.soon : t.availableCount.replace('{n}', String(free));
            return (
              <article className={'bld' + (soon ? ' is-soon' : '')} key={b.id} data-reveal="up" style={{ '--i': i } as React.CSSProperties}>
                <a href={href('apartments', lang)} className="bld-link">
                  <div className="bld-img" data-reveal="clip"><Fill src={img} alt="" sizes={buildings.length === 1 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 30vw, 100vw'} /></div>
                  <div className="bld-info">
                    <h3>{b.name}</h3>
                    <p className="label bld-status">{status}</p>
                    {!soon && own.length > 0 && <p className="bld-meta">{t.unitsCount.replace('{n}', String(own.length))}</p>}
                    <span className="link-line">{aptLabel}</span>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      </section>
    ),

    types: () => {
      const cards = typeCards(data, lang);
      return (
        <section id="tipovi" className="section types">
          <div className="wrap types-head">
            <Heading text={tx(page.types?.title, lang)} />
            {tx(page.types?.text, lang) && <p className="lead" data-reveal="up">{tx(page.types?.text, lang)}</p>}
          </div>
          <Types cards={cards} labels={{ filter: t.filterBedrooms, all: t.filterAll, rooms: t.rooms, total: t.total, view: t.viewUnit, area: t.area, outdoor: t.outdoor, floor: t.floor }} />
          {tx(page.types?.note, lang) && <p className="wrap types-note">{tx(page.types?.note, lang)}</p>}
        </section>
      );
    },

    details: () => {
      const slides = (page.details?.items || []).filter((d) => d.image).map((d) => ({ src: mediaUrl(d.image), title: tx(d.title, lang), text: tx(d.text, lang) }));
      return slides.length > 0 && (
        <section id="detalji" className="section details">
          <div className="wrap"><Heading text={tx(page.details?.title, lang).replace(/\n/g, ' ')} className="is-center det-title" /></div>
          <Details tag={tag} slides={slides} labels={{ prev: t.prev, next: t.next, region: t.slider }} />
          {tx(page.details?.note, lang) && <p className="wrap det-note">{tx(page.details?.note, lang)}</p>}
        </section>
      );
    },

    gallery: () => gallery.length > 0 && (
      <section id="galerija" className="section gallery">
        <div className="wrap">
          <Heading text={tx(page.gallery?.title, lang) || t.gallery} />
          <Gallery tag={tag} images={gallery.map((g) => ({ src: mediaUrl(g.path), alt: imgAlt(g, lang), caption: tx(g.caption, lang) }))} labels={{ close: t.close, prev: t.prev, next: t.next, image: t.image }} />
        </div>
      </section>
    ),

    location: () => hasLocation && (
      <section id="lokacija" className="section location">
        <div className="wrap loc-grid">
          <div className="loc-text">
            <Heading text={tx(loc.title, lang) || t.location} />
            <div data-reveal="up"><Paras className="prose" text={tx(loc.text, lang)} /></div>
            {(loc.points || []).filter((p) => tx(p.name, lang)).length > 0 && (
              <ul className="points" data-reveal="up">
                {(loc.points || []).filter((p) => tx(p.name, lang)).map((p, i) => (
                  <li key={i}><span>{tx(p.name, lang)}</span><b>{tx(p.value, lang)}</b></li>
                ))}
              </ul>
            )}
            {tx(loc.address, lang) && <p className="loc-address">{tx(loc.address, lang)}</p>}
            <a className="link-line" href={href('location', lang)}>{t.moreLocation}</a>
          </div>
          <div className="loc-media" data-reveal="clip" data-parallax={loc.map_embed ? undefined : 6}>
            {loc.map_embed
              ? <iframe src={loc.map_embed} title={t.location} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              : loc.image ? <Fill src={loc.image} alt={tx(loc.title, lang).replace(/\*/g, '').replace(/\n/g, ' ')} sizes="(min-width: 900px) 58vw, 100vw" /> : null}
          </div>
        </div>
      </section>
    ),

    investor: () => page.investor && (tx(page.investor.title, lang) || page.investor.logo) && (
      <section id="investitor" className="section investor">
        <div className="wrap inv-inner">
          {page.investor.logo && <div className="inv-logo" data-reveal="up"><Fill src={page.investor.logo} alt={page.footer?.company || ''} sizes="240px" /></div>}
          <Heading text={tx(page.investor.title, lang)} className="is-center" />
          <div data-reveal="up"><Paras className="prose inv-text" text={tx(page.investor.text, lang)} /></div>
          <a className="link-line" href={href('developer', lang)}>{t.moreDeveloper}</a>
        </div>
      </section>
    ),

    contact: () => (
      <section id="kontakt" className="section contact">
        <div className="wrap contact-grid">
          <div>
            <Heading text={tx(contact.title, lang) || t.contact} />
            <div data-reveal="up"><Paras className="prose" text={tx(contact.text, lang)} /></div>
            <dl className="contact-list" data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>
              {(contact.phone || settings.phone) && <><dt>{t.phone}</dt><dd><a href={'tel:' + String(contact.phone || settings.phone).replace(/[^\d+]/g, '')}>{contact.phone || settings.phone}</a></dd></>}
              {contact.email && <><dt>{t.email}</dt><dd><a href={'mailto:' + contact.email}>{contact.email}</a></dd></>}
              {tx(contact.address, lang) && <><dt>{t.address}</dt><dd>{tx(contact.address, lang)}</dd></>}
              {tx(contact.hours, lang) && <><dt>{t.hours}</dt><dd>{tx(contact.hours, lang)}</dd></>}
            </dl>
          </div>
          <div data-reveal="up" style={{ '--i': 2 } as React.CSSProperties}><ContactForm lang={lang} /></div>
        </div>
      </section>
    ),
  };

  return (
    <>
      <SiteChrome data={data} lang={lang} nav={nav} contactHref="#kontakt" langHref={(l) => href('home', l)} />
      <main id="main">
        {order.map((k) => <SectionSlot key={k}>{sections[k]()}</SectionSlot>)}
      </main>
      <Footer data={data} lang={lang} nav={nav} form={!has('contact')} />
      <JsonLd data={data} lang={lang} route="home" />
    </>
  );
}

/** Cards for the apartment types section: brochure figures, availability and prices live from the unit table. */
function typeCards({ units, settings }: SiteData, lang: Lang): TypeCard[] {
  const t = UI[lang];
  const loc = LOCALES[lang].number;
  const plural = new Intl.PluralRules(loc);
  const many = (key: 'bedrooms' | 'typeUnits', n: number) => t[`${key}_${plural.select(n)}` as keyof typeof t] || t[`${key}_other`];
  const m2 = (n: number) => n.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²';
  const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
  return APARTMENT_TYPES.map((ty) => {
    const own = unitsOfType(ty, units);
    const free = own.filter((u) => u.status === 'available');
    const prices = settings.show_price ? free.map((u) => Number(u.price)).filter((p) => p > 0) : [];
    const first = free[0] || own[0];
    return {
      id: ty.id,
      name: fill(t.typeName, { t: ty.id }),
      bedrooms: ty.bedrooms,
      bedLabel: fill(many('bedrooms', ty.bedrooms), { n: ty.bedrooms }),
      area: m2(ty.area),
      outdoor: `${t[ty.outdoor.kind]} ${m2(ty.outdoor.area)}`,
      floors: ty.floors[0] === ty.floors[1] ? fill(t.floorOne, { n: ty.floors[0] }) : fill(t.floorRange, { a: ty.floors[0], b: ty.floors[1] }),
      units: fill(many('typeUnits', ty.count), { n: ty.count }),
      avail: own.length ? (free.length ? fill(t.typeFree, { a: free.length, n: own.length }) : t.soldOut) : '',
      soldOut: own.length > 0 && free.length === 0,
      price: prices.length ? fill(t.priceFrom, { p: Math.min(...prices).toLocaleString(loc) + ' ' + (settings.currency || 'KM') }) : '',
      href: first ? `${href('apartments', lang)}#rvs/${first.building}/${encodeURIComponent(first.code)}` : href('apartments', lang),
      plan: `/riverina/types/tip-${ty.id.toLowerCase()}.webp`,
      plan3d: (PLANS_3D as Record<string, string>)[ty.sample] || '',
      planAlt: fill(t.planAlt, { t: ty.id }),
      rooms: ty.rooms.map(([k, a]) => [ROOM_NAMES[k][lang] || ROOM_NAMES[k].bs, m2(a)]),
      total: m2(ty.area),
    };
  });
}

function SectionSlot({ children }: { children: React.ReactNode }) {
  return <>{children || null}</>;
}
