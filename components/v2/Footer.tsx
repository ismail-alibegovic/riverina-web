import { LOCALES, href as siteHref, type Lang } from '@/lib/i18n';
import { copyright, UI, illustrationLabel, type SiteData } from '@/lib/content';
import { V2 } from '@/lib/v2/copy';

export default function Footer({ data, lang, nav, langLinks, company }: {
  data: SiteData;
  lang: Lang;
  nav: { href: string; label: string }[];
  langLinks: { lang: Lang; href: string }[];
  company: string;
}) {
  const t = V2[lang];
  const ui = UI[lang];
  const tag = illustrationLabel(data.page, lang);
  return (
    <footer className="kt-foot">
      <div className="kt-wrap kt-foot-top">
        {/* original stacked logo, unchanged */}
        <img className="kt-foot-logo" src="/brand/logo-stacked-light.webp" alt="Riverina Residence" width={400} height={348} loading="lazy" />
        <nav className="kt-foot-col" aria-label={t.menu}>
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="kt-foot-col">
          <span className="kt-label">{t.investor}</span>
          <span>{company}</span>
          <a href={siteHref('developer', lang)}>{ui.moreDeveloper}</a>
          <a href={siteHref('privacy', lang)}>{ui.privacy}</a>
        </div>
        <div className="kt-foot-col">
          <span className="kt-label">{t.language}</span>
          {langLinks.map((l) => <a key={l.lang} href={l.href} hrefLang={l.lang} aria-current={l.lang === lang ? 'true' : undefined}>{LOCALES[l.lang].name}</a>)}
        </div>
      </div>
      <div className="kt-wrap kt-foot-bottom">
        <span>{copyright(company, ui.rights)}</span>
        {tag && <span>{lang === 'bs' ? 'Vizualizacije' : 'Visualisations'}: {tag}</span>}
        <a href={siteHref('home', lang)}>{t.classic}</a>
      </div>
    </footer>
  );
}
