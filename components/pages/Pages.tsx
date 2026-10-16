import { SiteData, tx } from '@/lib/content';
import { href, UI, Lang } from '@/lib/i18n';
import ContactForm from '../ContactForm';
import { Fill, Heading, Paras } from '../home/text';
import SubPage from './SubPage';

type P = { data: SiteData; lang: Lang };
const plain = (s: string) => s.replace(/\*/g, '').replace(/\s*\n\s*/g, ' ').trim();

export function LocationPage({ data, lang }: P) {
  const t = UI[lang];
  const loc = data.page.location || {};
  const points = (loc.points || []).filter((p) => tx(p.name, lang));
  return (
    <SubPage data={data} lang={lang} route="location" title={tx(loc.title, lang) || t.location} image={loc.page_image}>
      <section className="section">
        <div className="wrap loc-grid">
          <div className="loc-text">
            <div data-reveal="up"><Paras className="prose" text={tx(loc.text, lang)} /></div>
            {points.length > 0 && (
              <ul className="points" data-reveal="up">
                {points.map((p, i) => <li key={i}><span>{tx(p.name, lang)}</span><b>{tx(p.value, lang)}</b></li>)}
              </ul>
            )}
            {tx(loc.address, lang) && <p className="loc-address">{tx(loc.address, lang)}</p>}
            {loc.map_link && <a className="link-line" href={loc.map_link} target="_blank" rel="noopener noreferrer">{t.directions}</a>}
          </div>
          <div className="loc-media" data-reveal="clip">
            {loc.map_embed
              ? <iframe src={loc.map_embed} title={t.location} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              : loc.image ? <Fill src={loc.image} alt={plain(tx(loc.title, lang))} sizes="(min-width: 900px) 58vw, 100vw" /> : null}
          </div>
        </div>
      </section>
      <CtaBand data={data} lang={lang} />
    </SubPage>
  );
}

export function DeveloperPage({ data, lang }: P) {
  const t = UI[lang];
  const inv = data.page.investor || {};
  return (
    <SubPage data={data} lang={lang} route="developer" title={tx(inv.title, lang) || t.developer} image={inv.page_image}>
      <section className="section investor">
        <div className="wrap inv-inner">
          {inv.logo && <div className="inv-logo" data-reveal="up"><Fill src={inv.logo} alt={data.page.footer?.company || ''} sizes="240px" /></div>}
          <div data-reveal="up"><Paras className="prose inv-text" text={tx(inv.text, lang)} /></div>
          {inv.link && <a className="link-line" href={inv.link} target="_blank" rel="noopener noreferrer">{t.website}</a>}
        </div>
      </section>
      <CtaBand data={data} lang={lang} />
    </SubPage>
  );
}

export function ContactPage({ data, lang }: P) {
  const t = UI[lang];
  const c = data.page.contact || {};
  const phone = c.phone || data.settings.phone;
  return (
    <SubPage data={data} lang={lang} route="contact" title={tx(c.title, lang) || t.contact} intro={tx(c.text, lang)}>
      <section className="section contact is-page">
        <div className="wrap contact-grid">
          <dl className="contact-list">
            {phone && <><dt>{t.phone}</dt><dd><a href={'tel:' + phone.replace(/[^\d+]/g, '')}>{phone}</a></dd></>}
            {c.email && <><dt>{t.email}</dt><dd><a href={'mailto:' + c.email}>{c.email}</a></dd></>}
            {tx(c.address, lang) && <><dt>{t.address}</dt><dd>{tx(c.address, lang)}</dd></>}
            {tx(c.hours, lang) && <><dt>{t.hours}</dt><dd>{tx(c.hours, lang)}</dd></>}
          </dl>
          <ContactForm lang={lang} />
        </div>
      </section>
    </SubPage>
  );
}

export function PrivacyPage({ data, lang }: P) {
  const t = UI[lang];
  const pr = data.page.privacy || {};
  return (
    <SubPage data={data} lang={lang} route="privacy" title={tx(pr.title, lang) || t.privacy}>
      <section className="section">
        <div className="wrap"><Paras className="prose legal" text={tx(pr.text, lang)} /></div>
      </section>
    </SubPage>
  );
}

/** Closing call to action on inner pages: one label for the apartments intent (the hero button text). */
function CtaBand({ data, lang }: P) {
  const t = UI[lang];
  const label = tx(data.page.hero?.cta, lang) || t.chooseApartment;
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <Heading text={tx(data.page.buildings?.title, lang) || t.apartments} />
        <a className="btn btn-light" href={href('apartments', lang)}>{label}</a>
      </div>
    </section>
  );
}
