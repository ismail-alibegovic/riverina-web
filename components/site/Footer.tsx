import { SiteData, tx, mediaUrl, copyright } from '@/lib/content';
import { href, UI, Lang } from '@/lib/i18n';

export default function Footer({ data, lang, nav }: { data: SiteData; lang: Lang; nav: { href: string; label: string }[] }) {
  const t = UI[lang];
  const { page, settings } = data;
  const name = settings.project_name || 'Riverina Residence';
  return (
    <footer className="footer">
      <div className="wrap wrap-wide footer-grid">
        <a href={href('home', lang)} className="brand" aria-label={name}><img src={mediaUrl(settings.logo) || '/brand/wordmark-light.webp'} alt="" width={480} height={108} /></a>
        <nav aria-label={t.mainNav} className="footer-nav">
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="footer-meta">
          {tx(page.footer?.text, lang) && <p>{tx(page.footer?.text, lang)}</p>}
          <p>{copyright(page.footer?.company || name, t.rights)}</p>
          <p><a href={href('privacy', lang)}>{t.privacy}</a></p>
        </div>
      </div>
    </footer>
  );
}
