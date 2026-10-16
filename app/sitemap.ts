import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL + '/', changeFrequency: 'weekly', priority: 1, alternates: { languages: { en: SITE_URL + '/en' } } },
    { url: SITE_URL + '/en', changeFrequency: 'weekly', priority: 0.8 },
  ];
}
