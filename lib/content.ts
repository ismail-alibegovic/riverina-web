// Content model, defaults and data loading for the public site.
import { href, pick, LOCALES, UI, type Lang, type Localized, type RouteKey } from './i18n';
export type { Lang } from './i18n';
export { UI } from './i18n';
export type L = Localized;

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export const tx = pick;

/** "© 2026 Company d.o.o. All rights reserved." without a double full stop after abbreviations. */
export const copyright = (company: string, rights: string) => `© ${new Date().getFullYear()} ${company}${company.endsWith('.') ? '' : '.'} ${rights}`;

/** CMS text without markup, for metadata, alt texts and labels: no *emphasis*, no line breaks, no [[TBD]] notes. */
export function plain(v: L | string | undefined | null, lang: Lang): string {
  return pick(v, lang).replace(/\[\[TBD:[^\]]*\]\]/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

type Img = { path: string; caption?: L; alt?: L };
/** Alt text of a CMS image: its own alt text, else the caption. */
export const imgAlt = (img: { alt?: L; caption?: L }, lang: Lang) => plain(img.alt, lang) || plain(img.caption, lang);

/** Search and sharing texts for one page; empty fields fall back to the page's own title and text. */
export type Seo = { title?: L; description?: L; image?: string };
export type SectionKey = 'hero' | 'manifest' | 'about' | 'categories' | 'buildings' | 'details' | 'gallery' | 'location' | 'investor' | 'contact';
export const SECTION_ORDER: SectionKey[] = ['hero', 'manifest', 'about', 'categories', 'buildings', 'details', 'gallery', 'location', 'investor', 'contact'];

// Text conventions in the CMS: a new line starts a new heading line; *word* marks the contrasting word.
export type Page = {
  /** home page fields at the top level (kept for older saves), other pages under pages.<route> */
  seo?: Seo & { pages?: Partial<Record<Exclude<RouteKey, 'home'>, Seo>> };
  sections?: { order?: SectionKey[]; hidden?: SectionKey[] };
  hero?: { eyebrow?: L; title?: L; subtitle?: L; image?: string; cta?: L; cta2?: L };
  manifest?: { text?: L; images?: Img[] };
  about?: { eyebrow?: L; title?: L; text?: L; image?: string; facts?: { value?: L; label?: L }[]; auto_facts?: boolean };
  categories?: { items?: { title?: L; image?: string; link?: string; link_label?: L }[] };
  buildings?: { title?: L; text?: L };
  details?: { title?: L; note?: L; items?: { image?: string; title?: L; text?: L }[] };
  highlights?: { title?: L; items?: { title?: L; text?: L; image?: string }[] };
  selector?: { eyebrow?: L; title?: L; text?: L };
  gallery?: { title?: L; images?: Img[] };
  location?: { title?: L; text?: L; address?: L; map_embed?: string; map_link?: string; image?: string; page_image?: string; points?: { name?: L; value?: L }[] };
  investor?: { title?: L; text?: L; logo?: string; link?: string; page_image?: string };
  privacy?: { title?: L; text?: L };
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

const R = '/riverina';
// Only facts confirmed by the project documents are used (63 apartments in Riverina 1, 46,44 to 110,92 m2,
// commercial ground floor plus five residential floors). Missing facts are marked [[TBD: ...]], see docs/content-todo.md.
export const DEFAULT_PAGE: Page = {
  hero: {
    eyebrow: { bs: 'Ilidža, Sarajevo', en: 'Ilidža, Sarajevo' },
    title: { bs: 'Riverina\n*residence*', en: 'Riverina\n*residence*' },
    subtitle: { bs: 'Novi stambeni kompleks na Ilidži.', en: 'A new residential development in Ilidža.' },
    image: `${R}/objekat/objekat-8.webp`,
    cta: { bs: 'Odaberite stan', en: 'Find your apartment' },
  },
  manifest: {
    text: {
      bs: 'Riverina je *novi* stambeni kompleks na *Ilidži*. Prva zgrada nudi *63 stana* od 46 do 111 m², iznad poslovnog prizemlja, zamišljenih za *miran* život u *Sarajevu*.',
      en: 'Riverina is a *new* residential development in *Ilidža*. The first building offers *63 apartments* from 46 to 111 m², above a commercial ground floor, designed for a *calm* life in *Sarajevo*.',
    },
    images: [
      { path: `${R}/enterijer/enterijer-9.webp`, caption: { bs: 'Kupatilo, vizualizacija', en: 'Bathroom, visualisation' } },
      { path: `${R}/objekat/objekat-7.webp`, caption: { bs: 'Ulaz u zgradu, vizualizacija', en: 'Building entrance, visualisation' } },
      { path: `${R}/enterijer/enterijer-6.webp`, caption: { bs: 'Spavaća soba, vizualizacija', en: 'Bedroom, visualisation' } },
      { path: `${R}/objekat/objekat-2.webp`, caption: { bs: 'Poslovno prizemlje, vizualizacija', en: 'Commercial ground floor, visualisation' } },
      { path: `${R}/enterijer/enterijer-19.webp`, caption: { bs: 'Kupatilo s tušem, vizualizacija', en: 'Shower room, visualisation' } },
    ],
  },
  about: {
    title: { bs: 'O\n*projektu*', en: 'About\n*the project*' },
    text: {
      bs: 'Riverina Residence nastaje na Ilidži, u Sarajevu. Prva zgrada, Riverina 1, ima poslovno prizemlje i pet stambenih etaža.\n\n[[TBD: broj zgrada u kompleksu, faze i rok useljenja]]',
      en: 'Riverina Residence is being built in Ilidža, Sarajevo. The first building, Riverina 1, has a commercial ground floor and five residential floors.\n\n[[TBD: number of buildings, phases and completion date]]',
    },
    image: `${R}/objekat/objekat-6.webp`,
    auto_facts: true,
  },
  categories: {
    items: [
      { title: { bs: 'Zgrade', en: 'Buildings' }, image: `${R}/objekat/objekat-1.webp`, link: 'apartments' },
      { title: { bs: 'Enterijer', en: 'Interiors' }, image: `${R}/enterijer/enterijer-4.webp`, link: '#detalji', link_label: { bs: 'Pogledajte', en: 'View' } },
      { title: { bs: 'Lokacija', en: 'Location' }, image: `${R}/naselje/3.webp`, link: '#lokacija', link_label: { bs: 'Pogledajte', en: 'View' } },
    ],
  },
  buildings: {
    title: { bs: 'Zgrade\n*i stanovi*', en: 'Buildings\n*and apartments*' },
    text: { bs: 'Odaberite zgradu, sprat i stan u interaktivnom pregledu.', en: 'Choose a building, floor and apartment in the interactive view.' },
  },
  details: {
    title: { bs: 'Enterijer\n*i detalji*', en: 'Interiors\n*and details*' },
    note: { bs: 'Vizualizacije su ilustrativne.', en: 'Visualisations are for illustration only.' },
    items: [
      { image: `${R}/enterijer/enterijer-1.webp`, title: { bs: 'Dnevni boravak', en: 'Living room' } },
      { image: `${R}/enterijer/enterijer-4.webp`, title: { bs: 'Trpezarija', en: 'Dining' } },
      { image: `${R}/enterijer/enterijer-7.webp`, title: { bs: 'Kuhinja', en: 'Kitchen' } },
      { image: `${R}/enterijer/enterijer-6.webp`, title: { bs: 'Spavaća soba', en: 'Bedroom' } },
      { image: `${R}/enterijer/enterijer-9.webp`, title: { bs: 'Kupatilo', en: 'Bathroom' } },
      { image: `${R}/enterijer/enterijer-5.webp`, title: { bs: 'Boravak', en: 'Lounge' } },
    ],
  },
  location: {
    title: { bs: 'Ilidža,\n*Sarajevo*', en: 'Ilidža,\n*Sarajevo*' },
    text: {
      bs: 'Riverina Residence se nalazi na Ilidži, u Sarajevu.\n\n[[TBD: tačna adresa i udaljenosti do centra, aerodroma i javnog prevoza]]',
      en: 'Riverina Residence is located in Ilidža, Sarajevo.\n\n[[TBD: exact address and distances to the centre, airport and public transport]]',
    },
    image: `${R}/lokacija/mapa-ilidza.webp`,
    page_image: `${R}/naselje/3.webp`,
  },
  investor: {
    title: { bs: 'Investitor\n*ALYASIN Group*', en: 'Developer\n*ALYASIN Group*' },
    text: { bs: '[[TBD: tekst o investitoru]]', en: '[[TBD: about the developer]]' },
    logo: `${R}/investitor/alyasin-logo.webp`,
    page_image: `${R}/objekat/objekat-5.webp`,
  },
  privacy: {
    title: { bs: 'Politika\n*privatnosti*', en: 'Privacy\n*policy*' },
    text: {
      bs: 'Ova stranica opisuje kako postupamo s podacima koje pošaljete putem kontakt forme i forme za upit o stanu.\n\nKada pošaljete upit, spremamo ime i prezime, e-mail, telefon, poruku, stan na koji se upit odnosi, jezik i adresu stranice s koje je upit poslan. Podatke koristimo samo da bismo odgovorili na vaš upit.\n\nSajt trenutno ne koristi kolačiće za analitiku ni oglašavanje.\n\n[[TBD: naziv i adresa odgovornog lica, rok čuvanja podataka, prava korisnika i kontakt za zahtjeve u vezi s podacima. Tekst treba pregledati pravnik.]]',
      en: 'This page explains how we handle the information you send through the contact form and the apartment enquiry form.\n\nWhen you send an enquiry, we store your name, e-mail, phone, message, the apartment it refers to, the language and the address of the page it was sent from. We use this information only to reply to your enquiry.\n\nThe site currently uses no cookies for analytics or advertising.\n\n[[TBD: name and address of the data controller, retention period, user rights and a contact for data requests. To be reviewed by a lawyer.]]',
    },
  },
  selector: {
    eyebrow: { bs: 'Interaktivni pregled', en: 'Interactive view' },
    title: { bs: 'Odaberite svoj stan', en: 'Find your apartment' },
    text: { bs: 'Pređite mišem preko zgrade i kliknite na stan za tlocrt, površinu i dostupnost.', en: 'Hover over the building and click an apartment to see its floor plan, size and availability.' },
  },
  contact: {
    title: { bs: 'Pošaljite\n*upit*', en: 'Send an\n*enquiry*' },
    text: { bs: 'Javite nam se za tlocrte, dostupnost i termin razgovora.', en: 'Get in touch for floor plans, availability and a meeting.' },
  },
  footer: { company: 'ALYASIN Group d.o.o.' },
};

/** Key figures derived live from the apartments table (first building with apartments). */
export function unitFacts(units: any[], lang: Lang): { value: string; label: string }[] {
  if (!units.length) return [];
  const b = units[0].building;
  const list = units.filter((u) => u.building === b);
  const areas = list.map((u) => Number(u.area)).filter((n) => n > 0);
  const types = new Set(areas.map((a) => a.toFixed(2))).size;
  const floors = new Set(list.map((u) => u.floor).filter((f) => f > 0)).size;
  const fmt = (n: number) => Math.round(n).toLocaleString(LOCALES[lang].number);
  const t = UI[lang];
  const L = { units: t.factUnits, types: t.factTypes, area: t.factArea, floors: t.factFloors };
  const out = [{ value: String(list.length), label: L.units }];
  if (types > 1) out.push({ value: String(types), label: L.types });
  if (areas.length) out.push({ value: `${fmt(Math.min(...areas))}-${fmt(Math.max(...areas))}`, label: L.area });
  if (floors) out.push({ value: String(floors), label: L.floors });
  return out;
}

/** Resolves a CMS link: a route key ("apartments"), a home anchor ("#lokacija") or a full URL. */
export function resolveLink(link: string | undefined, lang: Lang): string {
  if (!link) return '';
  if (link.startsWith('#')) return (LOCALES[lang].prefix || '/') + link;
  if (link === 'apartments' || link === 'home') return href(link, lang);
  return link;
}

/** Visible sections in the order chosen in the CMS. The hero always comes first. */
export function sectionList(p: Page): SectionKey[] {
  const rest: SectionKey[] = SECTION_ORDER.filter((k) => k !== 'hero');
  const order = (p.sections?.order || []).filter((k) => rest.includes(k));
  const all: SectionKey[] = ['hero', ...order, ...rest.filter((k) => !order.includes(k))];
  const hidden = new Set(p.sections?.hidden || []);
  return all.filter((k) => k === 'hero' || !hidden.has(k));
}

const EMPTY: SiteData = { settings: {}, page: {}, scenes: { masterplan: { views: [] }, buildings: [] }, units: [] };

export async function getSiteData(): Promise<SiteData> {
  // Local testing without network access to Supabase: SITE_DATA_FILE=path/to/public_site_data.json (never set on Vercel).
  if (process.env.SITE_DATA_FILE) {
    const { readFile } = await import('node:fs/promises');
    const d = JSON.parse(await readFile(process.env.SITE_DATA_FILE, 'utf8')) as SiteData;
    return { settings: d.settings || {}, page: mergePage(d.page || {}), scenes: d.scenes || EMPTY.scenes, units: d.units || [] };
  }
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
