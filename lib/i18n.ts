// Languages, routes and interface strings for the public site.
// Adding a language (e.g. tr, ar):
//   1. add it to Lang and LOCALES (ar: dir 'rtl'; <html dir> follows automatically),
//   2. add its paths to ROUTES and its strings to UI (TypeScript reports every missing key),
//   3. copy the thin page files of app/(en) into app/(tr) and pass lang="tr".
// CMS texts are stored per language ({ bs, en, tr, ... }); a missing translation falls back via LOCALES[lang].fallback.
export type Lang = 'bs' | 'en';

export type Locale = {
  label: string;
  name: string;
  dir: 'ltr' | 'rtl';
  /** URL prefix; '' = no prefix (the default language) */
  prefix: string;
  /** BCP 47 tag for <html lang> and hreflang */
  hreflang: string;
  /** Open Graph locale */
  og: string;
  /** Intl locale for numbers and dates */
  number: string;
  /** language used when a text is missing in this one */
  fallback?: Lang;
};

export const DEFAULT_LANG: Lang = 'bs';
export const LOCALES: Record<Lang, Locale> = {
  bs: { label: 'BS', name: 'Bosanski', dir: 'ltr', prefix: '', hreflang: 'bs', og: 'bs_BA', number: 'bs-BA' },
  en: { label: 'EN', name: 'English', dir: 'ltr', prefix: '/en', hreflang: 'en', og: 'en_GB', number: 'en-GB', fallback: 'bs' },
};
export const LANGS = Object.keys(LOCALES) as Lang[];
export const isLang = (v: unknown): v is Lang => typeof v === 'string' && v in LOCALES;

/** A CMS text in several languages. */
export type Localized = Partial<Record<Lang, string>>;

/** Picks the text for a language: the language itself, then its fallback chain, then any language that has text. */
export function pick(v: Localized | string | undefined | null, lang: Lang): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  for (let l: Lang | undefined = lang, n = 0; l && n < 4; l = LOCALES[l].fallback, n++) if (v[l]) return v[l]!;
  return v[DEFAULT_LANG] || Object.values(v).find(Boolean) || '';
}

// Route keys → path per language. Pages that do not exist yet are left out of navigation.
const ROUTES = {
  home: { bs: '/', en: '/en' },
  apartments: { bs: '/stanovi', en: '/en/apartments' },
  location: { bs: '/lokacija', en: '/en/location' },
  developer: { bs: '/o-investitoru', en: '/en/developer' },
  contact: { bs: '/kontakt', en: '/en/contact' },
  privacy: { bs: '/privatnost', en: '/en/privacy' },
} satisfies Record<string, Record<Lang, string>>;
export type RouteKey = keyof typeof ROUTES;
export const ROUTE_KEYS = Object.keys(ROUTES) as RouteKey[];

export function href(key: RouteKey, lang: Lang, hash?: string): string {
  const p = ROUTES[key][lang];
  return hash ? `${p === '/' ? '' : p}#${hash}`.replace(/^#/, '/#') : p;
}

/** hreflang alternates for a route: every language plus x-default (the default language). */
export function alternates(key: RouteKey, base = ''): Record<string, string> {
  return { ...Object.fromEntries(LANGS.map((l) => [LOCALES[l].hreflang, base + href(key, l)])), 'x-default': base + href(key, DEFAULT_LANG) };
}

const BS = { project: 'Projekat', apartments: 'Stanovi', gallery: 'Galerija', location: 'Lokacija', contact: 'Kontakt', home: 'Početna', menu: 'Meni', close: 'Zatvori', skip: 'Preskoči na sadržaj', language: 'Jezik', mainNav: 'Glavna navigacija', directions: 'Otvori u Google Maps', phone: 'Telefon', email: 'E-mail', address: 'Adresa', hours: 'Radno vrijeme', send: 'Pošalji poruku', sending: 'Šaljem…', name: 'Ime i prezime', message: 'Poruka', consent: 'Saglasan/na sam da me kontaktirate u vezi s ovim upitom.', ok: 'Hvala. Poruka je poslana i javit ćemo vam se uskoro.', err: 'Poruka nije poslana. Pokušajte ponovo ili nas pozovite.', required: 'Unesite ime i e-mail ili telefon te potvrdite saglasnost.', rights: 'Sva prava zadržana.', noApartments: 'Pregled stanova uskoro.', available: 'slobodnih stanova', chooseApartment: 'Odaberite stan', backToSite: 'Nazad na sajt', soon: 'Uskoro dostupno', availableCount: '{n} slobodnih stanova', unitsCount: '{n} stanova', prev: 'Prethodna slika', next: 'Sljedeća slika', slider: 'Enterijer, slike', manifest: 'Riverina ukratko', website: 'Web stranica investitora', categories: 'Istražite', developer: 'Investitor', privacy: 'Politika privatnosti', moreLocation: 'Više o lokaciji', moreDeveloper: 'Više o investitoru', notFound: 'Stranica nije pronađena', notFoundText: 'Adresa ne postoji ili je stranica premještena.', toHome: 'Na početnu', consentLink: 'Pročitajte politiku privatnosti.', image: 'Slika {n}', errName: 'Unesite ime i prezime.', errContact: 'Unesite e-mail ili telefon.', errEmail: 'E-mail adresa nije ispravna.', errConsent: 'Potvrdite saglasnost.', errRate: 'Poslali ste više upita u kratkom roku. Pokušajte ponovo za nekoliko minuta.', factUnits: 'stana u prvoj zgradi', factTypes: 'tipova stanova', factArea: 'm² veličine stanova', factFloors: 'stambenih etaža', typeName: 'Tip {t}', bedrooms_one: '{n} spavaća soba', bedrooms_few: '{n} spavaće sobe', bedrooms_other: '{n} spavaćih soba', loggia: 'Lođa', terrace: 'Terasa', floorRange: '{a}.–{b}. sprat', floorOne: '{n}. sprat', typeUnits_one: '{n} stan ovog tipa', typeUnits_few: '{n} stana ovog tipa', typeUnits_other: '{n} stanova ovog tipa', typeFree: 'Slobodno: {a} od {n}', soldOut: 'Prodano', rooms: 'Prostorije', total: 'Ukupno', viewUnit: 'Pogledajte stan', planAlt: 'Tlocrt stana, tip {t}', filterBedrooms: 'Broj spavaćih soba', filterAll: 'Svi', priceFrom: 'od {p}', area: 'Površina', outdoor: 'Vanjski prostor', floor: 'Sprat' };

export type UIStrings = Record<keyof typeof BS, string>;

export const UI: Record<Lang, UIStrings> = {
  bs: BS,
  en: { project: 'Project', apartments: 'Apartments', gallery: 'Gallery', location: 'Location', contact: 'Contact', home: 'Home', menu: 'Menu', close: 'Close', skip: 'Skip to content', language: 'Language', mainNav: 'Main navigation', directions: 'Open in Google Maps', phone: 'Phone', email: 'E-mail', address: 'Address', hours: 'Opening hours', send: 'Send message', sending: 'Sending…', name: 'Full name', message: 'Message', consent: 'I agree to be contacted about this enquiry.', ok: 'Thank you. Your message has been sent and we will be in touch shortly.', err: 'The message could not be sent. Please try again or call us.', required: 'Enter your name and an e-mail or phone, and tick the consent box.', rights: 'All rights reserved.', noApartments: 'Apartment overview coming soon.', available: 'apartments available', chooseApartment: 'Find your apartment', backToSite: 'Back to site', soon: 'Coming soon', availableCount: '{n} apartments available', unitsCount: '{n} apartments', prev: 'Previous image', next: 'Next image', slider: 'Interiors, images', manifest: 'Riverina in brief', website: 'Developer website', categories: 'Explore', developer: 'Developer', privacy: 'Privacy policy', moreLocation: 'More about the location', moreDeveloper: 'More about the developer', notFound: 'Page not found', notFoundText: 'The address does not exist or the page has moved.', toHome: 'Back to home', consentLink: 'Read the privacy policy.', image: 'Image {n}', errName: 'Enter your full name.', errContact: 'Enter an e-mail or phone number.', errEmail: 'The e-mail address is not valid.', errConsent: 'Please tick the consent box.', errRate: 'You have sent several enquiries in a short time. Please try again in a few minutes.', factUnits: 'apartments in the first building', factTypes: 'apartment types', factArea: 'm² apartment sizes', factFloors: 'residential floors', typeName: 'Type {t}', bedrooms_one: '{n} bedroom', bedrooms_few: '{n} bedrooms', bedrooms_other: '{n} bedrooms', loggia: 'Loggia', terrace: 'Terrace', floorRange: 'Floors {a}–{b}', floorOne: 'Floor {n}', typeUnits_one: '{n} apartment of this type', typeUnits_few: '{n} apartments of this type', typeUnits_other: '{n} apartments of this type', typeFree: 'Available: {a} of {n}', soldOut: 'Sold out', rooms: 'Rooms', total: 'Total', viewUnit: 'View apartment', planAlt: 'Floor plan, type {t}', filterBedrooms: 'Number of bedrooms', filterAll: 'All', priceFrom: 'from {p}', area: 'Area', outdoor: 'Outdoor space', floor: 'Floor' },
};

/**
 * Extra strings for the apartment viewer (lib/selector/selector.js has BS and EN built in).
 * A new language adds its block here, with the keys of the I18N table in selector.js.
 */
export const SELECTOR_UI: Partial<Record<Lang, Record<string, string>>> = {};
