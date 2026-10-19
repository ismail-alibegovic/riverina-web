import { SiteData, tx, sectionList } from './content';
import { href, UI, Lang } from './i18n';

/** Main navigation, shared by every public page. Home sections only appear once they have content. */
export function siteNav(data: SiteData, lang: Lang, current?: 'apartments' | 'gallery' | 'location' | 'developer' | 'contact'): { href: string; label: string; current?: boolean }[] {
  const t = UI[lang];
  const p = data.page;
  const on = sectionList(p);
  const loc = p.location || {};
  const items = [
    on.includes('vision') && tx(p.vision?.title, lang) ? { href: href('home', lang, 'projekat'), label: t.project }
      : on.includes('about') && (tx(p.about?.title, lang) || tx(p.about?.text, lang)) && { href: href('home', lang, 'projekat'), label: t.project },
    { href: href('apartments', lang), label: t.apartments, current: current === 'apartments' },
    { href: href('gallery', lang), label: t.gallery, current: current === 'gallery' },
    (tx(loc.title, lang) || tx(loc.text, lang) || loc.map_embed) && { href: href('location', lang), label: t.location, current: current === 'location' },
    (tx(p.investor?.title, lang) || p.investor?.logo) && { href: href('developer', lang), label: t.developer, current: current === 'developer' },
    { href: href('contact', lang), label: t.contact, current: current === 'contact' },
  ];
  return items.filter(Boolean) as { href: string; label: string; current?: boolean }[];
}
