import type { Metadata } from 'next';
import { SiteData, tx, mediaUrl, L } from '@/lib/content';
import { href, LANGS, LOCALES, Lang, RouteKey } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import SiteChrome from '../site/SiteChrome';
import Footer from '../site/Footer';
import { Fill, Rich } from '../home/text';

/** Shared frame for inner pages: chrome, a page hero (image or plain navy), content, footer. */
export default function SubPage({ data, lang, route, title, image, intro, children }: {
  data: SiteData;
  lang: Lang;
  route: Exclude<RouteKey, 'home' | 'apartments'> | 'privacy';
  title: string;
  image?: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const current = route === 'privacy' ? undefined : route;
  const nav = siteNav(data, lang, current);
  const lines = (title || '').split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <>
      <SiteChrome data={data} lang={lang} nav={nav} contactHref={href('contact', lang)} langHref={(l) => href(route, l)} />
      <main id="main">
        <section className={'ph' + (image ? ' has-image' : '')}>
          {image && <div className="ph-media"><Fill src={image} sizes="100vw" priority /></div>}
          {image && <div className="hero-shade" aria-hidden="true" />}
          <div className="wrap wrap-wide ph-inner">
            <h1 className="ph-title">
              {lines.map((l, i) => <span className="hero-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>)}
            </h1>
            {intro && <p className="ph-intro">{intro}</p>}
          </div>
        </section>
        {children}
      </main>
      <Footer data={data} lang={lang} nav={nav} />
    </>
  );
}

/** Metadata for an inner page: localized title, description, canonical and hreflang alternates. */
export function subMeta(data: SiteData, lang: Lang, route: RouteKey, title: L | string | undefined, description?: L | string, image?: string): Metadata {
  const name = data.settings.project_name || 'Riverina Residence';
  const t = (typeof title === 'string' ? title : tx(title, lang)).replace(/\*/g, '').replace(/\s*\n\s*/g, ' ').trim();
  const desc = (typeof description === 'string' ? description : tx(description, lang)).replace(/\[\[TBD:[^\]]*\]\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 158) || undefined;
  const img = mediaUrl(image);
  return {
    title: t ? `${t} · ${name}` : name,
    description: desc,
    alternates: { canonical: href(route, lang), languages: { ...Object.fromEntries(LANGS.map((l) => [l, href(route, l)])), 'x-default': href(route, 'bs') } },
    openGraph: { title: t || name, description: desc, images: img ? [img] : undefined, locale: LOCALES[lang].og, type: 'website' },
  };
}
