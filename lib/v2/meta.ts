import type { Metadata } from 'next';
import { mediaUrl, plain, type SiteData } from '@/lib/content';
import { LOCALES, type Lang } from '@/lib/i18n';

/** Metadata of the redesign preview: never indexed while the current site is live, so no duplicate content. */
export function v2Meta(d: SiteData, lang: Lang, title: string, description?: string, image?: string): Metadata {
  const name = d.settings.project_name || 'Riverina Residence';
  const desc = description || plain(d.page.hero?.subtitle, lang);
  const img = mediaUrl(image || d.page.hero?.image || '/riverina/objekat/riverina-1-ugao-vecer.webp');
  return {
    title: title ? `${title} · ${name}` : name,
    description: desc,
    robots: { index: false, follow: false },
    openGraph: { title: title || name, description: desc, images: img ? [{ url: img }] : undefined, locale: LOCALES[lang].og, siteName: name },
  };
}
