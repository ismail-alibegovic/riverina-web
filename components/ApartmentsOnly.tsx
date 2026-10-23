import { Lang, SiteData, UI, tx, toSelectorData, copyright, mediaUrl } from '@/lib/content';
import { href } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import Selector, { SelectorPic } from './Selector';
import SiteChrome from './site/SiteChrome';
import JsonLd from './JsonLd';

/** Interactive apartment finder as its own full-screen page (embed = without site chrome, for an iframe). */
export default function ApartmentsOnly({ data, lang, embed }: { data: SiteData; lang: Lang; embed?: boolean }) {
  const t = UI[lang];
  const p = data.page.selector || {};
  const title = tx(p.title, lang) || t.chooseApartment;
  const sel = toSelectorData(data);
  const has = sel.units.length > 0 || sel.buildings.length > 0;
  // the drawer's gallery: interiors, as optimised thumbnails, opening the full picture
  const gallery: SelectorPic[] = (data.page.details?.items || []).filter((it) => it.image).slice(0, 6).map((it) => {
    const full = mediaUrl(it.image);
    return { src: `/_next/image?url=${encodeURIComponent(full)}&w=640&q=75`, full, alt: tx(it.title, lang) };
  });
  const finder = has ? <Selector data={sel} lang={lang} fill={!embed} title={title} gallery={gallery} /> : <p className="empty-note">{t.noApartments}</p>;

  if (embed) return <div className="only only-embed"><main className="only-main">{finder}</main></div>;

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
        <h1 className="sr-only">{title}</h1>
        <div className="apt-finder">{finder}</div>
      </main>
      <footer className="footer apt-foot">
        <div className="wrap wrap-wide footer-grid">
          <a href={href('home', lang)} className="link-line">{t.backToSite}</a>
          <span />
          <p className="footer-meta">{copyright(data.page.footer?.company || data.settings.project_name || 'Riverina Residence', t.rights)}</p>
        </div>
      </footer>
      <JsonLd data={data} lang={lang} route="apartments" title={title} />
    </div>
  );
}
