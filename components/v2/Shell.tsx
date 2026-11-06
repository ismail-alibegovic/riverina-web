import '@/app/v2.css';
import { sans, serif } from './fonts';
import Header from './Header';
import Footer from './Footer';
import Motion from './Motion';
import { V2, v2Href } from '@/lib/v2/copy';
import { href as siteHref, LANGS, type Lang } from '@/lib/i18n';
import type { SiteData } from '@/lib/content';

// Before first paint: content marked data-k starts hidden only when JavaScript runs and motion is welcome.
// Without JavaScript, or with reduced motion, everything is simply visible.
const ANIM = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('kt-anim')}catch(e){}`;

export type ShellProps = {
  data: SiteData;
  lang: Lang;
  /** 'hero' = transparent header over a full-bleed image; 'light' = navy on cream from the start */
  tone?: 'hero' | 'light';
  /** this page in every language */
  langHref: (l: Lang) => string;
  current?: 'apartments';
  children: React.ReactNode;
};

/** Frame of every page of the redesign: fonts, header, footer and the scroll effects. */
export default function Shell({ data, lang, tone = 'light', langHref, current, children }: ShellProps) {
  const t = V2[lang];
  const home = v2Href('home', lang);
  const nav = [
    { href: home + '#o-projektu', label: t.project },
    { href: v2Href('apartments', lang), label: t.apartments, current: current === 'apartments' },
    { href: home + '#lokacija', label: t.location },
    { href: home + '#galerija', label: t.gallery },
    { href: home + '#kontakt', label: t.contact },
  ];
  const company = data.page.footer?.company || 'ALYASIN Group d.o.o.';
  return (
    <div className={`kt ${sans.variable} ${serif.variable}`} data-tone={tone}>
      <script dangerouslySetInnerHTML={{ __html: ANIM }} />
      <Motion fonts={`${sans.variable} ${serif.variable}`} />
      <Header
        lang={lang}
        tone={tone}
        nav={nav}
        homeHref={home}
        ctaHref={v2Href('apartments', lang)}
        contactHref={home + '#kontakt'}
        langLinks={LANGS.map((l) => ({ lang: l, href: langHref(l) }))}
        phone={data.page.contact?.phone || data.settings.phone || ''}
        email={data.page.contact?.email || ''}
        company={company}
        classicHref={siteHref('home', lang)}
      />
      <main id="main" className="kt-main">{children}</main>
      <Footer data={data} lang={lang} nav={nav} langLinks={LANGS.map((l) => ({ lang: l, href: langHref(l) }))} company={company} />
    </div>
  );
}
