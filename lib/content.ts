// Content model, defaults and data loading for the public site.
import { href, pick, LOCALES, UI, ROUTE_KEYS, type Lang, type Localized, type RouteKey } from './i18n';
import { APARTMENT_TYPES, ROOM_NAMES, unitsOfType } from './apartmentTypes';
import { DEFAULT_FLOORS } from './floorPlans';
import PLANS_3D from './plans3d.json';
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

export type Img = { path: string; caption?: L; alt?: L };
/** Alt text of a CMS image: its own alt text, else the caption. */
export const imgAlt = (img: { alt?: L; caption?: L }, lang: Lang) => plain(img.alt, lang) || plain(img.caption, lang);

/** Search and sharing texts for one page; empty fields fall back to the page's own title and text. */
export type Seo = { title?: L; description?: L; image?: string };
export type SectionKey = 'hero' | 'vision' | 'manifest' | 'about' | 'showcase' | 'categories' | 'buildings' | 'types' | 'details' | 'world' | 'gallery' | 'location' | 'investor' | 'statement' | 'contact';
export const SECTION_ORDER: SectionKey[] = ['hero', 'manifest', 'about', 'showcase', 'categories', 'buildings', 'types', 'vision', 'details', 'world', 'gallery', 'location', 'investor', 'statement', 'contact'];
/**
 * Home sections that are off until switched on in the CMS. The home page follows elicyon.com's sequence, one story
 * from the river to the front door: hero → manifest → categories → apartment types ("services") → vision
 * ("leading the vision") → interiors carousel ("objects of desire") → world cards ("insights") → closing statement
 * → footer with the enquiry form. Gallery, location and developer have their own pages. Also in lib/admin/app.js.
 */
export const DEFAULT_HIDDEN: SectionKey[] = ['about', 'showcase', 'buildings', 'gallery', 'location', 'investor', 'contact'];

// Text conventions in the CMS: a new line starts a new heading line; *word* marks the contrasting word.
export type Page = {
  /** home page fields at the top level (kept for older saves), other pages under pages.<route> */
  seo?: Seo & { pages?: Partial<Record<Exclude<RouteKey, 'home'>, Seo>> };
  sections?: { order?: SectionKey[]; hidden?: SectionKey[] };
  /** words: the three stepped hero words, one per line (the opening); title stays the page's main name */
  hero?: { eyebrow?: L; title?: L; words?: L; subtitle?: L; image?: string; cta?: L; cta2?: L };
  manifest?: { text?: L; images?: Img[] };
  about?: { eyebrow?: L; title?: L; text?: L; image?: string; image2?: string; facts?: { value?: L; label?: L }[]; auto_facts?: boolean };
  categories?: { items?: { title?: L; caption?: L; image?: string; link?: string; link_label?: L }[] };
  /** full-screen dimmed render with a centred heading, a portrait image and a short text (after the hero) */
  vision?: { title?: L; text?: L; image?: string; image2?: string };
  /** three cards leading to the inner pages */
  world?: { title?: L; text?: L; items?: { label?: L; title?: L; text?: L; image?: string; link?: string; link_label?: L }[] };
  buildings?: { title?: L; text?: L };
  /** horizontal strip of wide renders with captions */
  showcase?: { title?: L; text?: L; items?: { image?: string; caption?: L }[] };
  /** full-screen render with a closing statement before the enquiry form */
  statement?: { eyebrow?: L; title?: L; text?: L; image?: string; cta?: L; cta2?: L };
  /** apartment types (lib/apartmentTypes.ts); figures come from the brochure and the unit table, texts from the CMS */
  types?: { title?: L; text?: L; note?: L };
  details?: { title?: L; note?: L; items?: { image?: string; title?: L; text?: L }[] };
  highlights?: { title?: L; items?: { title?: L; text?: L; image?: string }[] };
  selector?: { eyebrow?: L; title?: L; text?: L };
  /** gallery page (/galerija): page_image is its hero, the river strip (showcase) and these images follow */
  gallery?: { title?: L; text?: L; images?: Img[]; page_image?: string };
  location?: { title?: L; text?: L; address?: L; map_embed?: string; map_link?: string; image?: string; page_image?: string; points?: { name?: L; value?: L }[] };
  investor?: { title?: L; text?: L; logo?: string; link?: string; page_image?: string };
  privacy?: { title?: L; text?: L };
  contact?: { title?: L; text?: L; phone?: string; email?: string; address?: L; hours?: L };
  footer?: { text?: L; company?: string };
  /** small label on AI renders („Ilustracija / idejni prikaz"); show: false hides it everywhere */
  illustration?: { show?: boolean; text?: L };
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
    // approved by the owner 21. 10. 2026, from the brochure line "Moderno življenje uz rijeku"
    words: { bs: 'Moderno\nŽivljenje\nUz rijeku', en: 'Modern\nLiving\nBy the river' },
    subtitle: { bs: 'Novi stambeni kompleks na Ilidži.', en: 'A new residential development in Ilidža.' },
    // current facade (360° set, angle 315°), confirmed by the owner 20. 10. 2026
    image: `${R}/objekat/riverina-1-ugao-vecer.webp`,
    cta: { bs: 'Odaberite stan', en: 'Find your apartment' },
  },
  manifest: {
    text: {
      // One line per row; {words} dissolve as the statement recomposes on scroll, *words* are set in capitals.
      bs: 'Riverina {je novi stambeni kompleks}\nna *Ilidži*, uz rijeku.\n{Prva zgrada nudi} *63 stana*,\nod 46 do 111 m²,\n{iznad poslovnog prizemlja,}\nza miran život\nu *Sarajevu*.',
      en: 'Riverina {is a new residential development}\nin *Ilidža*, by the river.\n{The first building offers} *63 apartments*,\nfrom 46 to 111 m²,\n{above a commercial ground floor,}\nfor a calm life\nin *Sarajevo*.',
    },
    images: [
      // current facade details (360° set) and interiors; see _phase-a/phase-a-audit.md
      { path: `${R}/editorial/st-facade.webp`, caption: { bs: 'Fasada, detalj, vizualizacija', en: 'Facade detail, visualisation' } },
      { path: `${R}/editorial/st-dining.webp`, caption: { bs: 'Trpezarija uz prozor, vizualizacija', en: 'Dining by the window, visualisation' } },
      { path: `${R}/editorial/st-bath.webp`, caption: { bs: 'Kupatilo, vizualizacija', en: 'Bathroom, visualisation' } },
      { path: `${R}/editorial/st-ground.webp`, caption: { bs: 'Poslovno prizemlje, vizualizacija', en: 'Commercial ground floor, visualisation' } },
      { path: `${R}/editorial/st-bedroom.webp`, caption: { bs: 'Spavaća soba, vizualizacija', en: 'Bedroom, visualisation' } },
    ],
  },
  about: {
    title: { bs: 'O\n*projektu*', en: 'About\n*the project*' },
    text: {
      bs: 'Riverina Residence nastaje na Ilidži, u Sarajevu. Prva zgrada, Riverina 1, ima poslovno prizemlje i pet stambenih etaža.\n\n[[TBD: broj zgrada u kompleksu, faze i rok useljenja]]',
      en: 'Riverina Residence is being built in Ilidža, Sarajevo. The first building, Riverina 1, has a commercial ground floor and five residential floors.\n\n[[TBD: number of buildings, phases and completion date]]',
    },
    image: `${R}/objekat/objekat-6.webp`,
    image2: `${R}/enterijer/enterijer-3.webp`,
    auto_facts: true,
  },
  // Phrases from the sales brochure: "Moderno življenje uz rijeku", "Prostor za vaš novi početak".
  showcase: {
    title: { bs: 'Život\n*uz rijeku*', en: 'Living\n*by the river*' },
    text: { bs: 'Riverina 1 i naselje uz rijeku na Ilidži, u vizualizacijama projekta.', en: 'Riverina 1 and the neighbourhood by the river in Ilidža, in the project visualisations.' },
    items: [
      { image: `${R}/naselje/2.webp`, caption: { bs: 'Naselje uz rijeku', en: 'The neighbourhood by the river' } },
      { image: `${R}/naselje/12.webp`, caption: { bs: 'Ulice naselja', en: 'Neighbourhood streets' } },
      { image: `${R}/naselje/16.webp`, caption: { bs: 'Zelenilo između zgrada', en: 'Greenery between the buildings' } },
      { image: `${R}/naselje/11.webp`, caption: { bs: 'Poslovno prizemlje uz ulicu', en: 'Shops along the street' } },
      { image: `${R}/naselje/14.webp`, caption: { bs: 'Riverina 1 odozgo', en: 'Riverina 1 from above' } },
      { image: `${R}/naselje/9.webp`, caption: { bs: 'Pogled iz zraka', en: 'Aerial view' } },
    ],
  },
  statement: {
    eyebrow: { bs: 'Riverina Residence', en: 'Riverina Residence' },
    title: { bs: 'Prostor za vaš\n*novi početak*', en: 'A space for your\n*new beginning*' },
    text: { bs: 'Stanovi od 46 do 111 m², s jednom do četiri spavaće sobe. Prodaja je u toku.', en: 'Apartments from 46 to 111 m², with one to four bedrooms. Sales are now open.' },
    image: `${R}/naselje/3.webp`,
    cta2: { bs: 'Pošaljite upit', en: 'Send an enquiry' },
  },
  categories: {
    items: [
      { title: { bs: 'Arhitektura', en: 'Architecture' }, caption: { bs: 'Riverina 1', en: 'Riverina 1' }, image: `${R}/objekat/objekat-1.webp`, link: 'apartments' },
      { title: { bs: 'Enterijer', en: 'Interiors' }, caption: { bs: 'Stanovi od\n46 do 111 m²', en: 'Apartments from\n46 to 111 m²' }, image: `${R}/enterijer/enterijer-2.webp`, link: 'gallery', link_label: { bs: 'Pogledajte galeriju', en: 'View the gallery' } },
      { title: { bs: 'Lokacija', en: 'Location' }, caption: { bs: 'Ilidža,\nSarajevo', en: 'Ilidža,\nSarajevo' }, image: `${R}/naselje/5.webp`, link: 'location', link_label: { bs: 'Pogledajte lokaciju', en: 'View the location' } },
    ],
  },
  // "Moderno življenje uz rijeku" is a phrase from the sales brochure.
  vision: {
    title: { bs: 'Moderno življenje\n*uz rijeku*', en: 'Modern living\n*by the river*' },
    text: {
      bs: 'Riverina Residence nastaje na Ilidži, u Sarajevu. Prva zgrada, Riverina 1, ima poslovno prizemlje i pet stambenih etaža, s lođom ili terasom uz svaki stan.',
      en: 'Riverina Residence is being built in Ilidža, Sarajevo. The first building, Riverina 1, has a commercial ground floor and five residential floors, with a loggia or a terrace for every apartment.',
    },
    image: `${R}/naselje/2.webp`,
    image2: `${R}/enterijer/enterijer-3.webp`,
  },
  world: {
    title: { bs: 'Svijet\n*Riverine*', en: 'The world\n*of Riverina*' },
    text: { bs: 'Zgrada i naselje u vizualizacijama, lokacija na Ilidži i investitor projekta.', en: 'The building and the neighbourhood in visualisations, the location in Ilidža and the developer.' },
    items: [
      { label: { bs: 'Vizualizacije', en: 'Visualisations' }, title: { bs: 'Galerija', en: 'Gallery' }, text: { bs: 'Riverina 1, naselje uz rijeku i enterijeri stanova.', en: 'Riverina 1, the neighbourhood by the river and the apartment interiors.' }, image: `${R}/objekat/objekat-4.webp`, link: 'gallery' },
      { label: { bs: 'Ilidža, Sarajevo', en: 'Ilidža, Sarajevo' }, title: { bs: 'Lokacija', en: 'Location' }, text: { bs: 'Riverina Residence se nalazi na Ilidži, u Sarajevu.', en: 'Riverina Residence is located in Ilidža, Sarajevo.' }, image: `${R}/naselje/9.webp`, link: 'location' },
      { label: { bs: 'ALYASIN Group', en: 'ALYASIN Group' }, title: { bs: 'Investitor', en: 'Developer' }, text: { bs: 'Investitor projekta Riverina Residence.', en: 'The developer of Riverina Residence.' }, image: `${R}/objekat/objekat-5.webp`, link: 'developer' },
    ],
  },
  buildings: {
    title: { bs: 'Zgrade\n*i stanovi*', en: 'Buildings\n*and apartments*' },
    text: { bs: 'Odaberite zgradu, sprat i stan u interaktivnom pregledu.', en: 'Choose a building, floor and apartment in the interactive view.' },
  },
  types: {
    title: { bs: 'Kolekcija\n*stanova*', en: 'Apartment\n*collection*' },
    text: {
      bs: 'Devet tipova stanova od 46 do 111 m², s jednom do četiri spavaće sobe. Svaki stan ima lođu ili terasu.',
      en: 'Nine apartment types from 46 to 111 m², with one to four bedrooms. Every apartment has a loggia or a terrace.',
    },
    note: {
      bs: 'Površine prema prodajnim skicama arhitekta; lođa se obračunava s 0,75, terasa s 0,25 svoje površine. Dopušteno odstupanje kvadrature ±3 %. Podložno raspoloživosti.',
      en: "Areas as on the architect's sales plans; loggias count at 0.75 and terraces at 0.25 of their size. Permitted area variation ±3%. Subject to availability.",
    },
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
  gallery: {
    title: { bs: 'Galerija', en: 'Gallery' },
    page_image: `${R}/naselje/3.webp`,
    images: [
      { path: `${R}/objekat/objekat-4.webp`, caption: { bs: 'Riverina 1', en: 'Riverina 1' } },
      { path: `${R}/naselje/15.webp`, caption: { bs: 'Zgrada s ulice', en: 'The building from the street' } },
      { path: `${R}/objekat/objekat-5.webp`, caption: { bs: 'Ugao zgrade', en: 'Corner of the building' } },
      { path: `${R}/naselje/10.webp`, caption: { bs: 'Zgrade naselja', en: 'Buildings of the neighbourhood' } },
      { path: `${R}/naselje/13.webp`, caption: { bs: 'Ulaz u naselje', en: 'Entering the neighbourhood' } },
      { path: `${R}/naselje/7.webp`, caption: { bs: 'Naselje odozgo', en: 'The neighbourhood from above' } },
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
  illustration: { show: true, text: { bs: 'Ilustracija / idejni prikaz', en: 'Illustration / concept view' } },
};

/** Text of the render label, or '' when it is switched off in the CMS. */
export const illustrationLabel = (p: Page, lang: Lang) => (p.illustration?.show === false ? '' : plain(p.illustration?.text, lang));

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
  if (ROUTE_KEYS.includes(link as RouteKey)) return href(link as RouteKey, lang);
  return link;
}

/** Saved order plus sections it does not know yet (added later), each placed right after its default predecessor. */
export function withMissing<K extends string>(saved: K[], defaults: K[]): K[] {
  const out = [...saved];
  defaults.forEach((k, i) => {
    if (out.includes(k)) return;
    const prev = defaults.slice(0, i).reverse().find((x) => out.includes(x));
    out.splice(prev ? out.indexOf(prev) + 1 : 0, 0, k);
  });
  return out;
}

/** Visible sections in the order chosen in the CMS. The hero always comes first. */
export function sectionList(p: Page): SectionKey[] {
  const rest: SectionKey[] = SECTION_ORDER.filter((k) => k !== 'hero');
  const order = (p.sections?.order || []).filter((k) => rest.includes(k));
  const all: SectionKey[] = ['hero', ...withMissing(order, rest)];
  const hidden = new Set(p.sections?.hidden || DEFAULT_HIDDEN);
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

/** A CMS gallery with fewer images than this is topped up with the project renders from DEFAULT_PAGE. */
export const GALLERY_MIN = 6;

function mergePage(p: Page): Page {
  const out: any = { ...DEFAULT_PAGE };
  for (const k of Object.keys(p) as (keyof Page)[]) out[k] = { ...(DEFAULT_PAGE as any)[k], ...(p as any)[k] };
  const own = (p.gallery?.images || []).filter((g) => g.path);
  if (own.length < GALLERY_MIN) out.gallery = { ...out.gallery, images: [...own, ...(DEFAULT_PAGE.gallery?.images || []).filter((g) => !own.some((o) => o.path === g.path))] };
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
    // floor plans from the CMS; without them, the ones generated from the architect's sheets
    buildings: (scenes.buildings || []).map((b: any) => ({ ...b, views: (b.views || []).map(view), floors: (b.floors?.length ? b.floors : DEFAULT_FLOORS[b.id] || []).map(view) })),
    units: (d.units || []).map((u: any) => withTypeData({ ...u, plan: mediaUrl(u.plan), pdf: mediaUrl(u.pdf) })),
  };
}

/**
 * Extra data for the apartment viewer: the clean plan cut from the architect's sheet (while the CMS plan is that
 * sheet), the 3D plan when there is one, and type letter, outdoor space and rooms from the sales brochure
 * (lib/apartmentTypes.ts) for units whose CMS fields are empty.
 */
function withTypeData(u: any) {
  const code = String(u.code);
  const extra = {
    plan_view: u.plan === `/riverina/plans/${code}.webp` ? `/riverina/units/${code}.webp` : '',
    plan3d: u.building === 'r1' ? (PLANS_3D as Record<string, string>)[code] || '' : '',
  };
  const t = APARTMENT_TYPES.find((ty) => unitsOfType(ty, [u]).length);
  if (!t) return { ...u, ...extra };
  return {
    ...u,
    ...extra,
    type_label: u.type_label || `Tip ${t.id}`,
    type_label_en: u.type_label_en || `Type ${t.id}`,
    type_id: t.id,
    outdoor: { kind: t.outdoor.kind, area: t.outdoor.area },
    rooms: u.rooms?.length ? u.rooms : t.rooms.map(([k, a]) => ({ n: ROOM_NAMES[k].bs, n_en: ROOM_NAMES[k].en, a })),
  };
}
