import { SiteData, mediaUrl, plain } from '@/lib/content';
import { href, LOCALES, Lang, RouteKey } from '@/lib/i18n';
import { absolute, DEFAULT_OG } from '@/lib/meta';
import { APARTMENT_TYPES, unitsOfType } from '@/lib/apartmentTypes';

/**
 * Structured data (schema.org) for search engines. Only facts the site already shows:
 * names from the CMS, location „Ilidža, Sarajevo", apartment counts live from the database, apartment types from the
 * sales brochure (lib/apartmentTypes.ts). No prices, no dates.
 */
export default function JsonLd({ data, lang, route, title }: { data: SiteData; lang: Lang; route: RouteKey; title?: string }) {
  const name = data.settings.project_name || 'Riverina Residence';
  const home = absolute(href('home', lang));
  const org = data.page.footer?.company;
  const graph: Record<string, unknown>[] = [];

  if (org) {
    graph.push({
      '@type': 'Organization',
      '@id': home + '#organization',
      name: org,
      ...(data.page.investor?.link ? { url: data.page.investor.link } : {}),
      ...(data.page.investor?.logo ? { logo: absolute(mediaUrl(data.page.investor.logo)) } : {}),
    });
  }
  graph.push({ '@type': 'WebSite', '@id': home + '#website', url: home, name, inLanguage: LOCALES[lang].hreflang, ...(org ? { publisher: { '@id': home + '#organization' } } : {}) });

  if (route === 'home' || route === 'apartments') {
    const units = data.units || [];
    graph.push({
      '@type': 'ApartmentComplex',
      '@id': home + '#residence',
      name,
      url: absolute(href('home', lang)),
      description: plain(data.page.seo?.description, lang) || plain(data.page.hero?.subtitle, lang) || undefined,
      image: absolute(mediaUrl(data.page.seo?.image || data.page.hero?.image) || DEFAULT_OG),
      address: { '@type': 'PostalAddress', addressLocality: 'Ilidža', addressRegion: 'Sarajevo', addressCountry: 'BA' },
      ...(units.length ? { numberOfAccommodationUnits: units.length, numberOfAvailableAccommodationUnits: units.filter((u) => u.status === 'available').length } : {}),
      ...(org ? { brand: { '@id': home + '#organization' } } : {}),
      accommodationFloorPlan: APARTMENT_TYPES.map((ty) => {
        const own = unitsOfType(ty, units);
        return {
          '@type': 'FloorPlan',
          name: (lang === 'bs' ? 'Tip ' : 'Type ') + ty.id,
          numberOfBedrooms: ty.bedrooms,
          floorSize: { '@type': 'QuantitativeValue', value: ty.area, unitCode: 'MTK' },
          numberOfAccommodationUnits: own.length || ty.count,
          ...(own.length ? { numberOfAvailableAccommodationUnits: own.filter((u) => u.status === 'available').length } : {}),
          layoutImage: absolute(`/riverina/types/tip-${ty.id.toLowerCase()}.webp`),
        };
      }),
    });
  }

  if (route !== 'home' && title) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name, item: home },
        { '@type': 'ListItem', position: 2, name: title, item: absolute(href(route, lang)) },
      ],
    });
  }

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
