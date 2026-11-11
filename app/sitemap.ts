import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/content';
import { alternates, href, LANGS, ROUTE_KEYS, RouteKey, DEFAULT_LANG } from '@/lib/i18n';
import { SHEET_AREAS } from '@/lib/units';
import { explorerPath } from '@/lib/explorer';

const PRIORITY: Partial<Record<RouteKey, number>> = { home: 1, apartments: 0.9, gallery: 0.7, location: 0.7, developer: 0.6, contact: 0.7, privacy: 0.2 };

/** Every public page in every language, each with its hreflang alternates (incl. x-default). */
export default function sitemap(): MetadataRoute.Sitemap {
  // one page per apartment (/stanovi/3-7, /en/apartments/3-7)
  const units = Object.keys(SHEET_AREAS).flatMap((code) => LANGS.map((lang) => ({
    url: SITE_URL + explorerPath(lang, { code }),
    changeFrequency: 'weekly' as const,
    priority: lang === DEFAULT_LANG ? 0.6 : 0.5,
    alternates: { languages: { ...Object.fromEntries(LANGS.map((l) => [l, SITE_URL + explorerPath(l, { code })])), 'x-default': SITE_URL + explorerPath(DEFAULT_LANG, { code }) } },
  })));
  return [...pages(), ...units];
}

function pages(): MetadataRoute.Sitemap {
  return ROUTE_KEYS.flatMap((key) => LANGS.map((lang) => ({
    url: SITE_URL + href(key, lang),
    changeFrequency: key === 'privacy' ? 'yearly' as const : 'weekly' as const,
    priority: (PRIORITY[key] ?? 0.5) * (lang === DEFAULT_LANG ? 1 : 0.9),
    alternates: { languages: alternates(key, SITE_URL) },
  })));
}
