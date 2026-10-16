import { Lang, SiteData, tx, mediaUrl, UI, toSelectorData } from '@/lib/content';
import SiteChrome from './site/SiteChrome';
import { href } from '@/lib/i18n';
import Selector from './Selector';
import Gallery from './Gallery';
import ContactForm from './ContactForm';

function Paras({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p.split('\n').map((line, j) => (j ? [<br key={j} />, line] : line))}</p>
      ))}
    </div>
  );
}

function RiverLines() {
  // decorative contour lines for the hero when no image is uploaded yet
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 120 + i * 70;
    return `M-50 ${y} C 300 ${y - 90 + i * 6}, 600 ${y + 110 - i * 8}, 900 ${y - 20} S 1400 ${y - 120 + i * 9}, 1700 ${y + 30}`;
  });
  return (
    <svg className="hero-lines" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {lines.map((d, i) => <path key={i} d={d} fill="none" strokeWidth={i === 4 ? 1.6 : 0.8} />)}
    </svg>
  );
}

export default function Site({ data, lang }: { data: SiteData; lang: Lang }) {
  const { page, settings } = data;
  const t = UI[lang];
  const base = lang === 'en' ? '/en' : '/';
  const hero = page.hero || {};
  const about = page.about || {};
  const highlights = (page.highlights?.items || []).filter((x) => tx(x.title, lang));
  const facts = (about.facts || []).filter((f) => tx(f.value, lang));
  const gallery = (page.gallery?.images || []).filter((g) => g.path);
  const loc = page.location || {};
  const contact = page.contact || {};
  const hasAbout = !!(tx(about.title, lang) || tx(about.text, lang));
  const hasLocation = !!(tx(loc.title, lang) || tx(loc.text, lang) || loc.map_embed);
  const selectorData = toSelectorData(data);
  const hasSelector = selectorData.units.length > 0 || selectorData.buildings.length > 0;
  const nav = [
    hasAbout && { href: href('home', lang, 'projekat'), label: t.project },
    { href: href('apartments', lang), label: t.apartments },
    gallery.length > 0 && { href: href('home', lang, 'galerija'), label: t.gallery },
    hasLocation && { href: href('home', lang, 'lokacija'), label: t.location },
    { href: href('home', lang, 'kontakt'), label: t.contact },
  ].filter(Boolean) as { href: string; label: string }[];
  const name = settings.project_name || 'Riverina Residence';
  const year = new Date().getFullYear();

  return (
    <>
      <SiteChrome data={data} lang={lang} nav={nav} contactHref="#kontakt" langHref={(l) => href('home', l)} />
      <main id="main">
        <section className={'hero' + (hero.image ? ' has-image' : '')}>
          {hero.image ? <img className="hero-img" src={mediaUrl(hero.image)} alt="" fetchPriority="high" /> : <RiverLines />}
          <div className="hero-shade" />
          <div className="wrap hero-inner">
            {tx(hero.eyebrow, lang) && <p className="eyebrow">{tx(hero.eyebrow, lang)}</p>}
            <h1>{tx(hero.title, lang) || name}</h1>
            {tx(hero.subtitle, lang) && <p className="hero-sub">{tx(hero.subtitle, lang)}</p>}
            <div className="hero-ctas">
              <a className="btn btn-gold" href={href('apartments', lang)}>{tx(hero.cta, lang) || t.apartments}</a>
              <a className="btn btn-line" href="#kontakt">{tx(hero.cta2, lang) || t.contact}</a>
            </div>
          </div>
        </section>

        {hasAbout && (
          <section id="projekat" className="section about">
            <div className="wrap about-grid">
              <div>
                {tx(about.eyebrow, lang) && <p className="eyebrow">{tx(about.eyebrow, lang)}</p>}
                <h2>{tx(about.title, lang)}</h2>
              </div>
              <Paras className="prose" text={tx(about.text, lang)} />
            </div>
            {facts.length > 0 && (
              <div className="wrap facts">
                {facts.map((f, i) => (
                  <div className="fact" key={i}><span className="fact-v">{tx(f.value, lang)}</span><span className="fact-l">{tx(f.label, lang)}</span></div>
                ))}
              </div>
            )}
            {about.image && <div className="wrap"><img className="about-img" src={mediaUrl(about.image)} alt="" loading="lazy" /></div>}
          </section>
        )}

        {highlights.length > 0 && (
          <section className="section highlights">
            <div className="wrap">
              {tx(page.highlights?.title, lang) && <h2>{tx(page.highlights?.title, lang)}</h2>}
              <div className="hl-grid">
                {highlights.map((h, i) => (
                  <article className="hl" key={i}>
                    {h.image && <img src={mediaUrl(h.image)} alt="" loading="lazy" />}
                    <h3>{tx(h.title, lang)}</h3>
                    <Paras text={tx(h.text, lang)} />
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="stanovi" className="section apartments">
          <div className="wrap section-head">
            <div>
              {tx(page.selector?.eyebrow, lang) && <p className="eyebrow">{tx(page.selector?.eyebrow, lang)}</p>}
              <h2>{tx(page.selector?.title, lang)}</h2>
            </div>
            {tx(page.selector?.text, lang) && <p className="lead">{tx(page.selector?.text, lang)}</p>}
          </div>
          <div className="wrap wrap-wide">
            {hasSelector ? <Selector data={selectorData} lang={lang} /> : <p className="empty-note">{t.noApartments}</p>}
          </div>
        </section>

        {gallery.length > 0 && (
          <section id="galerija" className="section gallery">
            <div className="wrap">
              <h2>{tx(page.gallery?.title, lang) || t.gallery}</h2>
              <Gallery images={gallery.map((g) => ({ src: mediaUrl(g.path), caption: tx(g.caption, lang) }))} closeLabel={t.close} />
            </div>
          </section>
        )}

        {hasLocation && (
          <section id="lokacija" className="section location">
            <div className="wrap loc-grid">
              <div className="loc-text">
                <h2>{tx(loc.title, lang) || t.location}</h2>
                <Paras className="prose" text={tx(loc.text, lang)} />
                {(loc.points || []).filter((p) => tx(p.name, lang)).length > 0 && (
                  <ul className="points">
                    {(loc.points || []).filter((p) => tx(p.name, lang)).map((p, i) => (
                      <li key={i}><span>{tx(p.name, lang)}</span><i aria-hidden="true" /><b>{tx(p.value, lang)}</b></li>
                    ))}
                  </ul>
                )}
                {tx(loc.address, lang) && <p className="loc-address">{tx(loc.address, lang)}</p>}
                {loc.map_link && <a className="btn btn-dark" href={loc.map_link} target="_blank" rel="noopener noreferrer">{t.directions}</a>}
              </div>
              <div className="loc-media">
                {loc.map_embed ? (
                  <iframe src={loc.map_embed} title={t.location} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                ) : loc.image ? <img src={mediaUrl(loc.image)} alt="" loading="lazy" /> : null}
              </div>
            </div>
          </section>
        )}

        <section id="kontakt" className="section contact">
          <div className="wrap contact-grid">
            <div>
              <h2>{tx(contact.title, lang) || t.contact}</h2>
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
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <a href={base} className="brand" aria-label={name}><img src={mediaUrl(settings.logo) || '/brand/wordmark-light.png'} alt="" width={700} height={157} /></a>
          {tx(page.footer?.text, lang) && <p>{tx(page.footer?.text, lang)}</p>}
          <p className="copy">© {year} {page.footer?.company || name}. {t.rights}</p>
        </div>
      </footer>
    </>
  );
}
