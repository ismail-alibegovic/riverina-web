import type { Metadata } from 'next';
import { SiteData, L, plain, mediaUrl, SITE_URL } from './content';
import { alternates, href, LOCALES, Lang, RouteKey } from './i18n';

/** Only the production deployment is indexed; Vercel previews are noindex (and disallowed in robots.txt). */
export const INDEXABLE = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

/** Shared sharing image when neither the CMS SEO block nor the page has one (scripts/make-brand-assets.mjs). */
export const DEFAULT_OG = '/og/riverina.jpg';

/**
 * Metadata for every public page, in one place.
 * Order of preference: CMS „Google i dijeljenje linka" for this page → the page's own title/text/image → defaults.
 */
export function buildMetadata(data: SiteData, lang: Lang, route: RouteKey, page: { title?: L | string; text?: L | string; image?: string } = {}): Metadata {
  const name = data.settings.project_name || 'Riverina Residence';
  const seo = (route === 'home' ? data.page.seo : data.page.seo?.pages?.[route]) || {};
  // SEO texts count only in their own language; an empty EN field falls back to the EN page title, not to the BS SEO title.
  const only = (v: L | undefined) => plain(v?.[lang], lang);
  const own = only(seo.title);
  const pageTitle = plain(page.title, lang);
  // Home: "<project> · <subtitle>" unless the CMS has its own; other pages: "<page> · <project>".
  const title = own || (!pageTitle ? name : route === 'home' ? `${name} · ${pageTitle.replace(/[.\s]+$/, '')}` : `${pageTitle} · ${name}`);
  // A page whose text is still [[TBD]] borrows the site-wide description.
  const description = clip(only(seo.description) || plain(page.text, lang) || only(data.page.seo?.description) || plain(data.page.hero?.subtitle, lang)) || undefined;
  const image = mediaUrl(seo.image || page.image) || DEFAULT_OG;
  const url = href(route, lang);
  return {
    title: { absolute: title },
    robots: INDEXABLE ? undefined : { index: false, follow: false },
    description,
    alternates: { canonical: url, languages: alternates(route) },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      url,
      locale: LOCALES[lang].og,
      alternateLocale: Object.values(LOCALES).filter((l) => l !== LOCALES[lang]).map((l) => l.og),
      images: [{ url: image, ...(image === DEFAULT_OG ? { width: 1200, height: 630 } : {}), alt: name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

/** Search snippets are cut at a word boundary around 158 characters. */
function clip(s: string, max = 158): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ') > 100 ? cut.lastIndexOf(' ') : cut.length).replace(/[,.;:\s]+$/, '') + '…';
}

export const absolute = (path: string) => (/^https?:/.test(path) ? path : SITE_URL + path);
