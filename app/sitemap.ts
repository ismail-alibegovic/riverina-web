import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/content';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL + '/', changeFrequency: 'weekly', priority: 1, alternates: { languages: { en: SITE_URL + '/en' } } },
    { url: SITE_URL + '/en', changeFrequency: 'weekly', priority: 0.8 },
    { url: SITE_URL + '/stanovi', changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: SITE_URL + '/en/stanovi' } } },
    { url: SITE_URL + '/en/stanovi', changeFrequency: 'weekly', priority: 0.7 },
  ];
}
