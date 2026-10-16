import { Lang, SiteData, UI, tx, toSelectorData } from '@/lib/content';
import { href } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import Selector from './Selector';
import SiteChrome from './site/SiteChrome';

/** Interactive apartment finder as its own full-screen page (embed = without site chrome, for an iframe). */
export default function ApartmentsOnly({ data, lang, embed }: { data: SiteData; lang: Lang; embed?: boolean }) {
  const t = UI[lang];
  const sel = toSelectorData(data);
  const has = sel.units.length > 0 || sel.buildings.length > 0;
  const finder = has ? <Selector data={sel} lang={lang} fill={!embed} /> : <p className="empty-note">{t.noApartments}</p>;

  if (embed) return <div className="only only-embed"><main className="only-main">{finder}</main></div>;

  const p = data.page.selector || {};
  const title = tx(p.title, lang) || t.chooseApartment;
  return (
    <div className="apt">
      <SiteChrome
        data={data}
        lang={lang}
        nav={siteNav(data, lang, 'apartments')}
        contactHref={href('home', lang, 'kontakt')}
        langHref={(l) => href('apartments', l)}
      />
      <main id="main" className="apt-main">
        <div className="wrap wrap-wide apt-head">
          <h1 className="apt-title">{title}</h1>
          {tx(p.text, lang) && <p className="apt-text">{tx(p.text, lang)}</p>}
        </div>
        <div className="apt-finder">{finder}</div>
      </main>
      <footer className="footer apt-foot">
        <div className="wrap wrap-wide footer-grid">
          <a href={href('home', lang)} className="link-line">{t.backToSite}</a>
          <span />
          <p className="footer-meta">© {new Date().getFullYear()} {data.page.footer?.company || data.settings.project_name || 'Riverina Residence'}. {t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
