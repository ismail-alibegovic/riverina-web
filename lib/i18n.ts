// Languages, routes and interface strings for the public site.
// Adding a language (e.g. tr, ar) = one entry in LOCALES, one block in UI and a route group in app/.
export type Lang = 'bs' | 'en';

export const LOCALES: Record<Lang, { label: string; name: string; dir: 'ltr' | 'rtl'; prefix: string; og: string }> = {
  bs: { label: 'BS', name: 'Bosanski', dir: 'ltr', prefix: '', og: 'bs_BA' },
  en: { label: 'EN', name: 'English', dir: 'ltr', prefix: '/en', og: 'en_GB' },
};
export const LANGS = Object.keys(LOCALES) as Lang[];

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

export const UI = {
  bs: { project: 'Projekat', apartments: 'Stanovi', gallery: 'Galerija', location: 'Lokacija', contact: 'Kontakt', home: 'Početna', menu: 'Meni', close: 'Zatvori', skip: 'Preskoči na sadržaj', language: 'Jezik', mainNav: 'Glavna navigacija', directions: 'Otvori u Google Maps', phone: 'Telefon', email: 'E-mail', address: 'Adresa', hours: 'Radno vrijeme', send: 'Pošalji poruku', sending: 'Šaljem…', name: 'Ime i prezime', message: 'Poruka', consent: 'Saglasan/na sam da me kontaktirate u vezi s ovim upitom.', ok: 'Hvala. Poruka je poslana i javit ćemo vam se uskoro.', err: 'Poruka nije poslana. Pokušajte ponovo ili nas pozovite.', required: 'Unesite ime i e-mail ili telefon te potvrdite saglasnost.', rights: 'Sva prava zadržana.', noApartments: 'Pregled stanova uskoro.', available: 'slobodnih stanova', chooseApartment: 'Odaberite stan', backToSite: 'Nazad na sajt', soon: 'Uskoro dostupno', availableCount: '{n} slobodnih stanova', unitsCount: '{n} stanova', prev: 'Prethodna slika', next: 'Sljedeća slika', slider: 'Enterijer, slike', manifest: 'Riverina ukratko', website: 'Web stranica investitora', categories: 'Istražite', developer: 'Investitor', privacy: 'Politika privatnosti', moreLocation: 'Više o lokaciji', moreDeveloper: 'Više o investitoru', notFound: 'Stranica nije pronađena', notFoundText: 'Adresa ne postoji ili je stranica premještena.', toHome: 'Na početnu', consentLink: 'Pročitajte politiku privatnosti.' },
  en: { project: 'Project', apartments: 'Apartments', gallery: 'Gallery', location: 'Location', contact: 'Contact', home: 'Home', menu: 'Menu', close: 'Close', skip: 'Skip to content', language: 'Language', mainNav: 'Main navigation', directions: 'Open in Google Maps', phone: 'Phone', email: 'E-mail', address: 'Address', hours: 'Opening hours', send: 'Send message', sending: 'Sending…', name: 'Full name', message: 'Message', consent: 'I agree to be contacted about this enquiry.', ok: 'Thank you. Your message has been sent and we will be in touch shortly.', err: 'The message could not be sent. Please try again or call us.', required: 'Enter your name and an e-mail or phone, and tick the consent box.', rights: 'All rights reserved.', noApartments: 'Apartment overview coming soon.', available: 'apartments available', chooseApartment: 'Find your apartment', backToSite: 'Back to site', soon: 'Coming soon', availableCount: '{n} apartments available', unitsCount: '{n} apartments', prev: 'Previous image', next: 'Next image', slider: 'Interiors, images', manifest: 'Riverina in brief', website: 'Developer website', categories: 'Explore', developer: 'Developer', privacy: 'Privacy policy', moreLocation: 'More about the location', moreDeveloper: 'More about the developer', notFound: 'Page not found', notFoundText: 'The address does not exist or the page has moved.', toHome: 'Back to home', consentLink: 'Read the privacy policy.' },
} satisfies Record<Lang, Record<string, string>>;
