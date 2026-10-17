import { SiteData, plain } from '@/lib/content';
import { href, Lang, RouteKey } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import SiteChrome from '../site/SiteChrome';
import Footer from '../site/Footer';
import { Fill, Rich } from '../home/text';
import JsonLd from '../JsonLd';

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
          {image && <div className="ph-media"><Fill src={image} sizes="100vw" priority quality={72} /></div>}
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
      <JsonLd data={data} lang={lang} route={route} title={plain(title, lang)} />
    </>
  );
}
