import { SiteData, tx, copyright, illustrationLabel } from '@/lib/content';
import { href, UI, Lang } from '@/lib/i18n';
import ContactForm from '../ContactForm';
import { Rich } from '../home/text';

/**
 * Elicyon-style footer on a soft river-blue field, kept to one band: a stepped invitation, the enquiry form beside it,
 * the menu and the contact details, then a thin legal line. The contact page already has the form (form={false}).
 */
export default function Footer({ data, lang, nav, form = true }: { data: SiteData; lang: Lang; nav: { href: string; label: string }[]; form?: boolean }) {
  const t = UI[lang];
  const { page, settings } = data;
  const name = settings.project_name || 'Riverina Residence';
  const c = page.contact || {};
  const phone = c.phone || settings.phone;
  const tag = illustrationLabel(page, lang);
  return (
    <footer className="footer" id={form ? 'kontakt' : undefined}>
      <div className="wrap wrap-wide footer-grid">
        <div className="footer-join">
          <h2 className="footer-title" data-reveal="up">{t.footerTitle.split('\n').map((l, i) => <span key={i}><Rich text={l} /></span>)}</h2>
          {form && <p className="footer-lead">{tx(c.text, lang) || t.footerText}</p>}
        </div>
        {form && <div className="footer-form"><ContactForm lang={lang} /></div>}
        <nav aria-label={t.mainNav} className="footer-nav">
          <a href={href('home', lang)}>{t.home}</a>
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="footer-contact">
          {phone && <a href={'tel:' + String(phone).replace(/[^\d+]/g, '')}>{phone}</a>}
          {c.email && <a href={'mailto:' + c.email}>{c.email}</a>}
          {tx(c.address, lang) && <p>{tx(c.address, lang)}</p>}
          {tx(c.hours, lang) && <p>{tx(c.hours, lang)}</p>}
        </div>
      </div>
      <div className="wrap wrap-wide footer-legal">
        <a href={href('privacy', lang)}>{t.privacy}</a>
        {tag && <span>{tag}</span>}
        <span>{copyright(page.footer?.company || name, t.rights)}</span>
      </div>
    </footer>
  );
}
