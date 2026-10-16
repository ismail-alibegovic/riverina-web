import type { Metadata } from 'next';
import { getSiteData, tx, mediaUrl, Lang } from './content';

export async function pageMetadata(lang: Lang): Promise<Metadata> {
  const d = await getSiteData();
  const name = d.settings.project_name || 'Riverina Residence';
  const title = tx(d.page.seo?.title, lang) || name;
  const description = tx(d.page.seo?.description, lang) || tx(d.page.hero?.subtitle, lang) || undefined;
  const image = mediaUrl(d.page.seo?.image || d.page.hero?.image);
  return {
    title,
    description,
    alternates: { canonical: lang === 'en' ? '/en' : '/', languages: { bs: '/', en: '/en' } },
    openGraph: { title, description, images: image ? [image] : undefined, locale: lang === 'en' ? 'en_GB' : 'bs_BA', type: 'website' },
  };
}
