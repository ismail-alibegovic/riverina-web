// Strings and small helpers for the apartment explorer (/stanovi) and the home building preview.
import type { Lang } from './i18n';
import type { Status, Unit } from './units';

const BS = {
  title: 'Odaberite stan',
  intro: 'Odaberite sprat na zgradi, zatim stan na tlocrtu sprata.',
  building: 'Zgrada',
  floor: 'Sprat',
  floorN: '{n}. sprat',
  floorsShort: 'Spratovi',
  apartment: 'Stan',
  apartmentN: 'Stan {c}',
  ground: 'Prizemlje',
  groundNote: 'Poslovni prostor',
  visual: 'Zgrada',
  list: 'Lista',
  units: 'stanova',
  unitsN: '{n} stanova',
  freeN: '{n} slobodno',
  freeOfN: '{a} od {n} slobodno',
  onRequest: 'Na upit',
  st_available: 'Slobodan',
  st_reserved: 'Rezervisan',
  st_sold: 'Prodan',
  st_unavailable: 'Nije u prodaji',
  st_unknown: 'Na upit',
  area: 'Površina',
  rooms: 'Sobe',
  bedrooms: 'Spavaće sobe',
  bathrooms: 'Kupatila',
  type: 'Tip',
  typeN: 'Tip {t}',
  orientation: 'Orijentacija',
  outdoor: 'Lođa / terasa',
  loggia: 'Lođa',
  terrace: 'Terasa',
  price: 'Cijena',
  status: 'Status',
  total: 'Ukupno',
  roomSchedule: 'Prostorije i površine',
  plan2d: 'Tlocrt 2D',
  plan3d: '3D prikaz',
  enlarge: 'Uvećaj',
  pdf: 'Tlocrt (PDF)',
  enquire: 'Zatražite informacije',
  enquireTitle: 'Upit za stan {c}',
  enquireText: 'Pošaljite upit i prodajni tim će vam se javiti s cijenom, rokovima i terminom razgovora.',
  enquireMsg: 'Zanima me stan {c} ({f}, {a}). Molim više informacija.',
  call: 'Pozovite prodaju',
  back: 'Nazad',
  backToBuilding: 'Nazad na zgradu',
  backToFloor: 'Nazad na sprat',
  prevUnit: 'Prethodni stan',
  nextUnit: 'Sljedeći stan',
  similar: 'Slični stanovi',
  similarText: 'Isti raspored ili isti broj soba, na drugim spratovima.',
  gallery: 'Atmosfera enterijera',
  galleryNote: 'Vizualizacije su ilustrativne; oprema nije dio ponude.',
  keyPlan: 'Položaj stana',
  filters: 'Filteri',
  allFloors: 'Svi',
  onlyFree: 'Samo slobodni',
  any: 'Svi',
  areaFrom: 'od',
  areaTo: 'do',
  reset: 'Poništi',
  results: '{n} stanova',
  noResults: 'Nema stanova za odabrane filtere.',
  sort: 'Redoslijed',
  sortFloor: 'Po spratu',
  sortAreaUp: 'Površina ↑',
  sortAreaDown: 'Površina ↓',
  view: 'Pogledajte',
  explore: 'Istražite zgradu',
  exploreText: 'Pređite preko zgrade i odaberite sprat. Svaki sprat otvara tlocrt sa svim stanovima i njihovom dostupnošću.',
  open: 'Otvori pregled stanova',
  hoverHint: 'Pređite preko sprata',
  tapHint: 'Dodirnite sprat',
  pickUnit: 'Odaberite stan na tlocrtu',
  areaRange: '{a}–{b} m²',
  disclaimer: 'Površine prema prodajnim skicama arhitekta; dopušteno odstupanje ±3 %. Vizualizacije su ilustrativne.',
  step1: 'Zgrada', step2: 'Sprat', step3: 'Stan',
  share: 'Kopiraj link',
  copied: 'Link kopiran',
  close: 'Zatvori',
};

export type ExplorerStrings = Record<keyof typeof BS, string>;

export const EX: Record<Lang, ExplorerStrings> = {
  bs: BS,
  en: {
    title: 'Find your apartment',
    intro: 'Choose a floor on the building, then an apartment on the floor plan.',
    building: 'Building',
    floor: 'Floor',
    floorN: 'Floor {n}',
    floorsShort: 'Floors',
    apartment: 'Apartment',
    apartmentN: 'Apartment {c}',
    ground: 'Ground floor',
    groundNote: 'Commercial space',
    visual: 'Building',
    list: 'List',
    units: 'apartments',
    unitsN: '{n} apartments',
    freeN: '{n} available',
    freeOfN: '{a} of {n} available',
    onRequest: 'On request',
    st_available: 'Available',
    st_reserved: 'Reserved',
    st_sold: 'Sold',
    st_unavailable: 'Not for sale',
    st_unknown: 'On request',
    area: 'Area',
    rooms: 'Rooms',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    type: 'Type',
    typeN: 'Type {t}',
    orientation: 'Orientation',
    outdoor: 'Loggia / terrace',
    loggia: 'Loggia',
    terrace: 'Terrace',
    price: 'Price',
    status: 'Status',
    total: 'Total',
    roomSchedule: 'Rooms and areas',
    plan2d: '2D plan',
    plan3d: '3D view',
    enlarge: 'Enlarge',
    pdf: 'Floor plan (PDF)',
    enquire: 'Request information',
    enquireTitle: 'Enquiry for apartment {c}',
    enquireText: 'Send an enquiry and the sales team will get back to you with the price, timeline and a meeting.',
    enquireMsg: 'I am interested in apartment {c} ({f}, {a}). Please send me more information.',
    call: 'Call the sales team',
    back: 'Back',
    backToBuilding: 'Back to the building',
    backToFloor: 'Back to the floor',
    prevUnit: 'Previous apartment',
    nextUnit: 'Next apartment',
    similar: 'Similar apartments',
    similarText: 'The same layout or the same number of rooms, on other floors.',
    gallery: 'Interior atmosphere',
    galleryNote: 'Visualisations are for illustration; furniture is not included.',
    keyPlan: 'Position in the building',
    filters: 'Filters',
    allFloors: 'All',
    onlyFree: 'Available only',
    any: 'Any',
    areaFrom: 'from',
    areaTo: 'to',
    reset: 'Reset',
    results: '{n} apartments',
    noResults: 'No apartments match these filters.',
    sort: 'Sort',
    sortFloor: 'By floor',
    sortAreaUp: 'Area ↑',
    sortAreaDown: 'Area ↓',
    view: 'View',
    explore: 'Explore the building',
    exploreText: 'Move across the building and choose a floor. Each floor opens its plan with every apartment and its availability.',
    open: 'Open the apartment finder',
    hoverHint: 'Move over a floor',
    tapHint: 'Tap a floor',
    pickUnit: 'Choose an apartment on the plan',
    areaRange: '{a}–{b} m²',
    disclaimer: "Areas as on the architect's sales plans; permitted variation ±3%. Visualisations are for illustration.",
    step1: 'Building', step2: 'Floor', step3: 'Apartment',
    share: 'Copy link',
    copied: 'Link copied',
    close: 'Close',
  },
};

export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

/**
 * Numbers formatted the same on the server and in the browser (Node's ICU data for bs-BA can differ from the
 * browser's, which breaks hydration): bs 1.250,50 / en 1,250.50.
 */
export function num(n: number, lang: Lang, digits = 0) {
  const [i, d] = Math.abs(n).toFixed(digits).split('.');
  const [th, dec] = lang === 'en' ? [',', '.'] : ['.', ','];
  return (n < 0 ? '-' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, th) + (d ? dec + d : '');
}

export function m2(n: number, lang: Lang, digits = 2) {
  return num(n, lang, digits) + ' m²';
}

/** "1 spavaća soba", "3 spavaće sobe", "5 spavaćih soba" / "1 bedroom", "2 bedrooms". */
export function beds(n: number, lang: Lang) {
  if (lang === 'en') return `${n} ${n === 1 ? 'bedroom' : 'bedrooms'}`;
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? 'spavaća soba' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'spavaće sobe' : 'spavaćih soba'}`;
}

export const statusLabel = (s: Status, lang: Lang) => EX[lang][`st_${s}` as keyof ExplorerStrings];

/** Unit code as shown to visitors: 3-7 → 3.7 */
export const unitLabel = (u: Pick<Unit, 'code'>) => u.code.replace('-', '.');

/** Path of the explorer, a floor in it, or an apartment page. */
export function explorerPath(lang: Lang, at?: { floor?: number; code?: string }) {
  const base = lang === 'bs' ? '/stanovi' : `/${lang}/apartments`;
  if (at?.code) return `${base}/${at.code}`;
  if (at?.floor) return `${base}?${lang === 'bs' ? 'sprat' : 'floor'}=${at.floor}`;
  return base;
}

export type FloorSummary = { level: number; total: number; free: number; known: boolean; min: number; max: number };

export function floorSummary(units: Unit[], level: number): FloorSummary {
  const own = units.filter((u) => u.floor === level);
  const areas = own.map((u) => u.area);
  return {
    level,
    total: own.length,
    free: own.filter((u) => u.status === 'available').length,
    known: own.some((u) => u.status !== 'unknown'),
    min: areas.length ? Math.min(...areas) : 0,
    max: areas.length ? Math.max(...areas) : 0,
  };
}

/** "12 available" when the database gives statuses, otherwise "14 apartments". */
export function floorAvail(s: FloorSummary, lang: Lang) {
  const t = EX[lang];
  return s.known ? fill(t.freeOfN, { a: s.free, n: s.total }) : fill(t.unitsN, { n: s.total });
}

export function price(u: Unit, lang: Lang, currency: string) {
  return u.price ? num(u.price, lang) + ' ' + currency : '';
}

export type View = 'building' | 'floor' | 'unit' | 'list';
export type At = { view: View; floor?: number; code?: string; type?: string };

/** Reads the explorer position from a URL: /stanovi, ?sprat=3, ?prikaz=lista, ?tip=C, /stanovi/3-7, old #rvs/r1/3-7. */
export function parseAt(url: URL, codes: Set<string>): At {
  const seg = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');
  if (codes.has(seg)) return { view: 'unit', code: seg };
  const hash = url.hash.match(/^#rvs\/[^/]+\/(.+)$/);
  if (hash && codes.has(decodeURIComponent(hash[1]))) return { view: 'unit', code: decodeURIComponent(hash[1]) };
  const q = url.searchParams;
  const type = (q.get('tip') || q.get('type') || '').toUpperCase();
  if (type) return { view: 'list', type };
  if (['lista', 'list'].includes(q.get('prikaz') || q.get('view') || '')) return { view: 'list' };
  const f = Number(q.get('sprat') || q.get('floor'));
  if (f > 0) return { view: 'floor', floor: f };
  return { view: 'building' };
}

export function pathOf(lang: Lang, at: At) {
  if (at.view === 'unit' && at.code) return explorerPath(lang, { code: at.code });
  if (at.view === 'floor' && at.floor) return explorerPath(lang, { floor: at.floor });
  if (at.view === 'list') return explorerPath(lang) + (at.type ? `?${lang === 'bs' ? 'tip' : 'type'}=${at.type}` : `?${lang === 'bs' ? 'prikaz=lista' : 'view=list'}`);
  return explorerPath(lang);
}

