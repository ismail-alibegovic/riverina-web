import Header, { NavItem } from './Header';
import SmoothScroll from './SmoothScroll';
import { SiteData, mediaUrl } from '@/lib/content';
import { LANGS, Lang } from '@/lib/i18n';

const SOCIAL_LABELS: Record<string, string> = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' };

/** Everything around the page content: intro curtain, smooth scroll, header and full-screen menu. */
export default function SiteChrome({ data, lang, nav, contactHref, langHref, tone = 'light' }: {
  data: SiteData;
  lang: Lang;
  nav: NavItem[];
  contactHref: string;
  /** path of this page in each language */
  langHref: (l: Lang) => string;
  tone?: 'light' | 'dark';
}) {
  const s = data.settings;
  const name = s.project_name || 'Riverina Residence';
  const socials = Object.entries(s.socials || {}).filter(([, v]) => v).map(([k, v]) => ({ label: SOCIAL_LABELS[k] || k, href: String(v) }));
  return (
    <>
      <div className="intro" aria-hidden="true"><img src="/brand/logo-stacked-light.png" alt="" width={520} height={452} /></div>
      <SmoothScroll />
      <Header
        lang={lang}
        name={name}
        homeHref={lang === 'bs' ? '/' : '/' + lang}
        nav={nav}
        contactHref={contactHref}
        langLinks={LANGS.map((l) => ({ lang: l, href: langHref(l) }))}
        tone={tone}
        logoOnDark={mediaUrl(s.logo) || '/brand/wordmark-light.png'}
        logoOnLight={mediaUrl(s.logo_dark) || '/brand/wordmark.png'}
        phone={data.page.contact?.phone || s.phone}
        email={data.page.contact?.email}
        socials={socials}
        company={data.page.footer?.company}
      />
    </>
  );
}
