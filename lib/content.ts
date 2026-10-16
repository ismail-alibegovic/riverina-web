// Content model, defaults and data loading for the public site.
import type { Lang } from './i18n';
export type { Lang } from './i18n';
export { UI } from './i18n';
export type L = { bs?: string; en?: string };

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export function tx(v: L | string | undefined | null, lang: Lang): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return (lang === 'en' ? v.en || v.bs : v.bs || v.en) || '';
}

export type Page = {
  seo?: { title?: L; description?: L; image?: string };
  hero?: { eyebrow?: L; title?: L; subtitle?: L; image?: string; cta?: L; cta2?: L };
  about?: { eyebrow?: L; title?: L; text?: L; image?: string; facts?: { value?: L; label?: L }[] };
  highlights?: { title?: L; items?: { title?: L; text?: L; image?: string }[] };
  selector?: { eyebrow?: L; title?: L; text?: L };
  gallery?: { title?: L; images?: { path: string; caption?: L }[] };
  location?: { title?: L; text?: L; address?: L; map_embed?: string; map_link?: string; image?: string; points?: { name?: L; value?: L }[] };
  contact?: { title?: L; text?: L; phone?: string; email?: string; address?: L; hours?: L };
  footer?: { text?: L; company?: string };
};

export type Settings = {
  project_name?: string;
  logo?: string;
  logo_dark?: string;
  show_price?: boolean;
  currency?: string;
  phone?: string;
  enquiry?: boolean;
  list?: boolean;
  colors?: Record<string, string>;
  socials?: { instagram?: string; facebook?: string; linkedin?: string };
};

export type SiteData = { settings: Settings; page: Page; scenes: any; units: any[] };

// Only facts known to be true are used as defaults; everything else stays empty until filled in the CMS.
export const DEFAULT_PAGE: Page = {
  hero: {
    eyebrow: { bs: 'Ilidža · Sarajevo', en: 'Ilidža · Sarajevo' },
    title: { bs: 'Riverina Residence', en: 'Riverina Residence' },
    subtitle: { bs: 'Novi stambeni kompleks na Ilidži.', en: 'A new residential development in Ilidža.' },
    cta: { bs: 'Pogledajte stanove', en: 'View apartments' },
    cta2: { bs: 'Kontakt', en: 'Contact' },
  },
  selector: {
    eyebrow: { bs: 'Interaktivni pregled', en: 'Interactive view' },
    title: { bs: 'Odaberite svoj stan', en: 'Find your apartment' },
    text: { bs: 'Pređite mišem preko zgrade i kliknite na stan za tlocrt, površinu i dostupnost.', en: 'Hover over the building and click an apartment to see its floor plan, size and availability.' },
  },
  contact: { title: { bs: 'Kontakt', en: 'Contact' } },
  footer: { company: 'ALYASIN Group d.o.o.' },
};

const EMPTY: SiteData = { settings: {}, page: {}, scenes: { masterplan: { views: [] }, buildings: [] }, units: [] };

export async function getSiteData(): Promise<SiteData> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { ...EMPTY, page: DEFAULT_PAGE };
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/public_site_data`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: '{}',
      next: { revalidate: 300, tags: ['site'] },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = (await r.json()) as SiteData;
    return { settings: d.settings || {}, page: mergePage(d.page || {}), scenes: d.scenes || EMPTY.scenes, units: d.units || [] };
  } catch (e) {
    console.error('public_site_data failed', e);
    return { ...EMPTY, page: DEFAULT_PAGE };
  }
}

function mergePage(p: Page): Page {
  const out: any = { ...DEFAULT_PAGE };
  for (const k of Object.keys(p) as (keyof Page)[]) out[k] = { ...(DEFAULT_PAGE as any)[k], ...(p as any)[k] };
  return out;
}

/** Convert CMS data into the format public/selector.js expects. */
export function toSelectorData(d: SiteData) {
  const view = (v: any) => ({ ...v, image: mediaUrl(v.image), image_url: undefined });
  const scenes = d.scenes || EMPTY.scenes;
  return {
    project: { name: d.settings.project_name || 'Riverina Residence' },
    settings: {
      show_price: !!d.settings.show_price,
      currency: d.settings.currency || 'KM',
      phone: d.settings.phone || '',
      enquiry: d.settings.enquiry !== false,
      list: d.settings.list !== false,
      hide_lang: true, // the site header has its own language switch
      colors: d.settings.colors || {},
    },
    masterplan: { views: (scenes.masterplan?.views || []).map(view) },
    buildings: (scenes.buildings || []).map((b: any) => ({ ...b, views: (b.views || []).map(view), floors: (b.floors || []).map(view) })),
    units: (d.units || []).map((u: any) => ({ ...u, plan: mediaUrl(u.plan), pdf: mediaUrl(u.pdf) })),
  };
}
