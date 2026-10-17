import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/content';
import { INDEXABLE } from '@/lib/meta';

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/embed', '/en/embed'] }], sitemap: SITE_URL + '/sitemap.xml', host: SITE_URL };
}
