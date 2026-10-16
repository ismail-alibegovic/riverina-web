import { Lang, SiteData, tx, mediaUrl, UI, sectionList, resolveLink, SectionKey } from '@/lib/content';
import { href } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import SiteChrome from './site/SiteChrome';
import Gallery from './Gallery';
import ContactForm from './ContactForm';
import Hero from './home/Hero';
import Manifest from './home/Manifest';
import About from './home/About';
import Categories from './home/Categories';
import Details from './home/Details';
import { Fill, Heading, Paras } from './home/text';

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

  const sections: Record<SectionKey, () => React.ReactNode> = {
    hero: () => <Hero hero={page.hero || {}} lang={lang} name={name} />,

    manifest: () => manifestText && (
      <Manifest text={manifestText} label={t.manifest} images={(page.manifest?.images || []).filter((m) => m.path).map((m) => ({ src: mediaUrl(m.path), alt: tx(m.caption, lang) }))} />
    ),

    about: () => (tx(page.about?.title, lang) || tx(page.about?.text, lang)) && <About about={page.about || {}} units={units} lang={lang} />,

    categories: () => {
      const items = (page.categories?.items || []).filter((c) => tx(c.title, lang) && c.image);
      return items.length > 0 && (
        <section aria-label={t.categories}>
          <Categories items={items.map((c) => ({ title: tx(c.title, lang), src: mediaUrl(c.image), href: resolveLink(c.link, lang), linkLabel: tx(c.link_label, lang) || (c.link === 'apartments' ? aptLabel : t.categories) }))} />
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
                  <div className="bld-img"><Fill src={img} alt="" sizes={buildings.length === 1 ? '(min-width: 900px) 60vw, 100vw' : '(min-width: 900px) 30vw, 100vw'} /></div>
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

    details: () => {
      const slides = (page.details?.items || []).filter((d) => d.image).map((d) => ({ src: mediaUrl(d.image), title: tx(d.title, lang), text: tx(d.text, lang) }));
      return slides.length > 0 && (
        <section id="detalji" className="section details">
          <div className="wrap"><Heading text={tx(page.details?.title, lang)} /></div>
          <Details slides={slides} labels={{ prev: t.prev, next: t.next, region: t.slider }} />
          {tx(page.details?.note, lang) && <p className="wrap det-note">{tx(page.details?.note, lang)}</p>}
        </section>
      );
    },

    gallery: () => gallery.length > 0 && (
      <section id="galerija" className="section gallery">
        <div className="wrap">
          <Heading text={tx(page.gallery?.title, lang) || t.gallery} />
          <Gallery images={gallery.map((g) => ({ src: mediaUrl(g.path), caption: tx(g.caption, lang) }))} closeLabel={t.close} />
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
            {loc.map_link && <a className="link-line" href={loc.map_link} target="_blank" rel="noopener noreferrer">{t.directions}</a>}
          </div>
          <div className="loc-media" data-reveal="clip">
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
          {page.investor.link && <a className="link-line" href={page.investor.link} target="_blank" rel="noopener noreferrer">{t.website}</a>}
        </div>
      </section>
    ),

    contact: () => (
      <section id="kontakt" className="section contact">
        <div className="wrap contact-grid">
          <div>
            <Heading text={tx(contact.title, lang) || t.contact} />
            <Paras className="prose" text={tx(contact.text, lang)} />
            <dl className="contact-list">
              {(contact.phone || settings.phone) && <><dt>{t.phone}</dt><dd><a href={'tel:' + String(contact.phone || settings.phone).replace(/[^\d+]/g, '')}>{contact.phone || settings.phone}</a></dd></>}
              {contact.email && <><dt>{t.email}</dt><dd><a href={'mailto:' + contact.email}>{contact.email}</a></dd></>}
              {tx(contact.address, lang) && <><dt>{t.address}</dt><dd>{tx(contact.address, lang)}</dd></>}
              {tx(contact.hours, lang) && <><dt>{t.hours}</dt><dd>{tx(contact.hours, lang)}</dd></>}
            </dl>
          </div>
          <ContactForm lang={lang} />
        </div>
      </section>
    ),
  };

  const year = new Date().getFullYear();
  return (
    <>
      <SiteChrome data={data} lang={lang} nav={nav} contactHref="#kontakt" langHref={(l) => href('home', l)} />
      <main id="main">
        {order.map((k) => <SectionSlot key={k}>{sections[k]()}</SectionSlot>)}
      </main>
      <footer className="footer">
        <div className="wrap wrap-wide footer-grid">
          <a href={href('home', lang)} className="brand" aria-label={name}><img src={mediaUrl(settings.logo) || '/brand/wordmark-light.png'} alt="" width={700} height={157} /></a>
          <nav aria-label={t.mainNav} className="footer-nav">
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <div className="footer-meta">
            {tx(page.footer?.text, lang) && <p>{tx(page.footer?.text, lang)}</p>}
            <p>© {year} {page.footer?.company || name}. {t.rights}</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function SectionSlot({ children }: { children: React.ReactNode }) {
  return <>{children || null}</>;
}
