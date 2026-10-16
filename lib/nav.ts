import { SiteData, tx, sectionList } from './content';
import { href, UI, Lang } from './i18n';

/** Main navigation, shared by every public page. Home sections only appear once they have content. */
export function siteNav(data: SiteData, lang: Lang, current?: 'apartments'): { href: string; label: string; current?: boolean }[] {
  const t = UI[lang];
  const p = data.page;
  const on = sectionList(p);
  const loc = p.location || {};
  const items = [
    on.includes('about') && (tx(p.about?.title, lang) || tx(p.about?.text, lang)) && { href: href('home', lang, 'projekat'), label: t.project },
    { href: href('apartments', lang), label: t.apartments, current: current === 'apartments' },
    on.includes('details') && (p.details?.items || []).length > 0 && { href: href('home', lang, 'detalji'), label: t.gallery },
    on.includes('location') && (tx(loc.title, lang) || tx(loc.text, lang) || loc.map_embed) && { href: href('home', lang, 'lokacija'), label: t.location },
    { href: href('home', lang, 'kontakt'), label: t.contact },
  ];
  return items.filter(Boolean) as { href: string; label: string; current?: boolean }[];
}
