// Interface strings and routes of the redesigned site (/v2, /en/v2). Project facts come from the CMS (lib/content.ts)
// and the sales brochure (lib/apartmentTypes.ts); these strings are only labels, headings and button texts.
import type { Lang } from '@/lib/i18n';

export const V2_ROUTES = {
  home: { bs: '/v2', en: '/en/v2' },
  apartments: { bs: '/v2/stanovi', en: '/en/v2/apartments' },
} satisfies Record<string, Record<Lang, string>>;

export const v2Href = (key: keyof typeof V2_ROUTES, lang: Lang, hash?: string) => V2_ROUTES[key][lang] + (hash ? '#' + hash : '');
export const v2Unit = (code: string, lang: Lang) => `${V2_ROUTES.apartments[lang]}/${encodeURIComponent(code)}`;

const BS = {
  menu: 'Meni', close: 'Zatvori', project: 'Projekat', apartments: 'Stanovi', location: 'Lokacija', gallery: 'Galerija', contact: 'Kontakt', developer: 'Investitor',
  choose: 'Odaberite stan', explore: 'Istražite stanove', scroll: 'Skrolajte', language: 'Jezik', classic: 'Postojeća stranica',
  heroLocation: 'Lokacija', heroBuilding: 'Riverina 1', heroUnits: '{n} stanova · {a} m²',
  facts: 'Ključne činjenice', worldTitle: 'Svijet\n*Riverine*',
  aboutLabel: 'O projektu',
  archLabel: 'Arhitektura i život', archTitle: 'Arhitektura\n*i život*', archText: 'Riverina 1 i naselje uz rijeku na Ilidži, u vizualizacijama projekta.',
  archCardTitle: 'Lođa ili terasa', archCardText: 'Uz svaki stan: lođa na spratovima 1–4, terasa na petom spratu.',
  bigTitleTop: 'Riverina 1', bigTitle: 'Arhitektura', bigLabel: 'Zgrada',
  unitsBig: 'stana u prvoj zgradi',
  rowsLabel: 'Zgrada', rowsTitle: 'Od ulice\n*do terase*',
  row1: 'Poslovno prizemlje', row1t: 'Prizemlje zgrade Riverina 1 namijenjeno je poslovnim prostorima uz ulicu.',
  row2: 'Pet stambenih etaža', row2t: 'Iznad poslovnog prizemlja je pet stambenih etaža sa {n} stanova od {a} m².',
  row3: 'Lođa ili terasa', row3t: 'Stanovi od prvog do četvrtog sprata imaju lođu, stanovi na petom spratu terasu.',
  aptsLabel: 'Stanovi', aptsTitle: 'Pronađite prostor\nkoji je *vaš*',
  statTypes: 'Tipova stanova', statArea: 'Površine', statBeds: 'Spavaće sobe', statUnits: 'Stanova u prvoj zgradi', statFloors: 'Stambenih etaža',
  statTypesT: 'Od stana s jednom spavaćom sobom do stana s četiri spavaće sobe.', statAreaT: 'Prodajne površine prema skicama arhitekta.', statBedsT: 'Svaki stan ima lođu ili terasu.', statUnitsT: 'Iznad poslovnog prizemlja, na pet etaža.',
  allApts: 'Svi stanovi', selection: 'Izbor stanova',
  galleryLabel: 'Galerija', galleryTitle: 'Vizualizacije\n*projekta*',
  locLabel: 'Lokacija', mapAlt: 'Mapa Ilidže s označenom lokacijom Riverina Residence',
  contactLabel: 'Kontakt', contactTitle: 'Kontakt', contactLead: 'Javite nam se za tlocrte, dostupnost i termin razgovora.', investor: 'Investitor', place: 'Lokacija',
  projSmall: 'O', projBig: 'projektu', projLabel: 'Arhitektura', facLabel: 'Zgrada', facTitle: 'Od ulice do terase',
  fac4: 'Devet tipova stanova', fac4t: 'Stanovi od {a} m², s jednom do četiri spavaće sobe.', typeLabel: 'Život uz rijeku', locLink: 'Više o lokaciji',
  aptsTitle2: 'Pronađite prostor koji je vaš: stan za jednu osobu, par ili porodicu, uz rijeku na Ilidži.',
  tTypes: 'Raznolikost tlocrta', tTypesC: 'tipova stanova', tArea: 'Prostrane površine', tAreaC: 'm² prodajne površine', tBeds: 'Spavaće sobe', tBedsC: 'spavaće sobe', tOut: 'Lođa ili terasa', tOutC: 'stanova s lođom ili terasom', tOutT: 'Lođa na spratovima 1–4, terasa na petom spratu.', tFloors: 'Stambene etaže', tFloorsC: 'etaža iznad poslovnog prizemlja', tFloorsT: 'Pet stambenih etaža iznad poslovnog prizemlja uz ulicu.',
  contactSend: 'Pošaljite upit',
  outLabel: 'Vanjski prostor', outTitle: 'Lođa ili terasa uz svaki stan', outText: 'Stanovi od prvog do četvrtog sprata imaju lođu, a stanovi na petom spratu terasu. Mjesto za jutarnju kafu i miran kraj dana uz pogled na naselje.',
  outLoggia: 'Stanova s lođom', outTerrace: 'Stanova s terasom', outFloors: 'Spratovi s lođama',
  intLabel: 'Unutrašnjost', intTitle: 'Prostor za vaš novi početak', intBeds: 'Spavaće sobe', intBedsT: 'Od stana s jednom spavaćom sobom do stana s četiri spavaće sobe na petom spratu.', intBath: 'Kupatila', intBathT: 'Stanovi tipa {t} imaju dva kupatila.', intLiving: 'm² dnevnog boravka', intLivingT: 'Najveći dnevni boravak s trpezarijom, prema prodajnim skicama arhitekta.',
  // apartments
  catalogue: 'Katalog', onBuilding: 'Odabir na zgradi', onBuildingText: 'Okrenite zgradu, pređite preko fasade i kliknite na stan. Tlocrt, dostupnost i upit za svaki stan.',
  area: 'Površina', from: 'od', to: 'do', bedrooms: 'Spavaće sobe', floor: 'Sprat', availability: 'Dostupnost', onlyAvailable: 'Samo slobodni', all: 'Svi', reset: 'Poništi', apply: 'Primijeni', filters: 'Filteri', results: '{n} stanova',
  sort: 'Sortiranje', sortDefault: 'Po spratu', sortAreaUp: 'Površina: rastuće', sortAreaDown: 'Površina: opadajuće',
  grid: 'Mreža', list: 'Lista', noResults: 'Nema stanova koji odgovaraju filterima.', showMore: 'Prikaži još',
  building: 'Zgrada', floorN: '{n}. sprat', type: 'Tip', no: '№', priceOnRequest: 'Cijena na upit', price: 'Cijena', status: 'Status',
  available: 'Slobodan', reserved: 'Rezervisan', sold: 'Prodan', unavailable: 'Nije u prodaji',
  bed_one: '{n} spavaća soba', bed_few: '{n} spavaće sobe', bed_other: '{n} spavaćih soba',
  open: 'Otvori stan', pdf: 'PDF', pdfLong: 'Preuzmi tlocrt (PDF)', enquire: 'Pošaljite upit', viewOnBuilding: 'Pogledajte na zgradi',
  plan: 'Tlocrt', plan3d: '3D prikaz', onFloor: 'Na spratu', rooms: 'Prostorije', total: 'Ukupno', loggia: 'Lođa', terrace: 'Terasa', outdoor: 'Vanjski prostor',
  similar: 'Slični stanovi', similarText: 'Stanovi s istim brojem spavaćih soba na drugim spratovima.', viewAll: 'Svi stanovi',
  prevUnit: 'Prethodni stan', nextUnit: 'Sljedeći stan', interiorTitle: 'Prostor za vaš\n*novi početak*', interiorText: 'Vizualizacije enterijera prikazuju mogući izgled stana i nisu dio ponude.',
  enquiryTitle: 'Zainteresovani ste\nza *ovaj stan*?', enquiryMsg: 'Zanima me stan {code} (Riverina 1). Molim vas da me kontaktirate.',
  planAlt: 'Tlocrt stana {code}', floorAlt: 'Položaj stana {code} na {n}. spratu', areaNote: 'Površine prema prodajnim skicama arhitekta; lođa se obračunava s 0,75, terasa s 0,25 svoje površine. Dopušteno odstupanje kvadrature ±3 %. Podložno raspoloživosti.',
};

export type V2Strings = Record<keyof typeof BS, string>;

const EN: V2Strings = {
  menu: 'Menu', close: 'Close', project: 'Project', apartments: 'Apartments', location: 'Location', gallery: 'Gallery', contact: 'Contact', developer: 'Developer',
  choose: 'Find your apartment', explore: 'Explore the apartments', scroll: 'Scroll', language: 'Language', classic: 'Current website',
  heroLocation: 'Location', heroBuilding: 'Riverina 1', heroUnits: '{n} apartments · {a} m²',
  facts: 'Key facts', worldTitle: 'The world\n*of Riverina*',
  aboutLabel: 'About the project',
  archLabel: 'Architecture & lifestyle', archTitle: 'Architecture\n*and living*', archText: 'Riverina 1 and the neighbourhood by the river in Ilidža, in the project visualisations.',
  archCardTitle: 'Loggia or terrace', archCardText: 'With every apartment: a loggia on floors 1–4, a terrace on the fifth floor.',
  bigTitleTop: 'Riverina 1', bigTitle: 'Architecture', bigLabel: 'Building',
  unitsBig: 'apartments in the first building',
  rowsLabel: 'Building', rowsTitle: 'From the street\n*to the terrace*',
  row1: 'Commercial ground floor', row1t: 'The ground floor of Riverina 1 is designed for shops and offices along the street.',
  row2: 'Five residential floors', row2t: 'Above the commercial ground floor are five residential floors with {n} apartments from {a} m².',
  row3: 'Loggia or terrace', row3t: 'Apartments on floors one to four have a loggia, apartments on the fifth floor a terrace.',
  aptsLabel: 'Apartments', aptsTitle: 'Find the space\nthat is *yours*',
  statTypes: 'Apartment types', statArea: 'Sizes', statBeds: 'Bedrooms', statUnits: 'Apartments in the first building', statFloors: 'Residential floors',
  statTypesT: 'From one-bedroom apartments to apartments with four bedrooms.', statAreaT: "Saleable areas as on the architect's plans.", statBedsT: 'Every apartment has a loggia or a terrace.', statUnitsT: 'Above the commercial ground floor, on five floors.',
  allApts: 'All apartments', selection: 'A selection of apartments',
  galleryLabel: 'Gallery', galleryTitle: 'Project\n*visualisations*',
  locLabel: 'Location', mapAlt: 'Map of Ilidža with the location of Riverina Residence',
  contactLabel: 'Contact', contactTitle: 'Contact', contactLead: 'Get in touch for floor plans, availability and a meeting.', investor: 'Developer', place: 'Location',
  projSmall: 'About', projBig: 'the project', projLabel: 'Architecture', facLabel: 'Building', facTitle: 'From the street to the terrace',
  fac4: 'Nine apartment types', fac4t: 'Apartments from {a} m², with one to four bedrooms.', typeLabel: 'Living by the river', locLink: 'More about the location',
  aptsTitle2: 'Find the space that is yours: an apartment for one, a couple or a family, by the river in Ilidža.',
  tTypes: 'Variety of layouts', tTypesC: 'apartment types', tArea: 'Spacious sizes', tAreaC: 'm² saleable area', tBeds: 'Bedrooms', tBedsC: 'bedrooms', tOut: 'Loggia or terrace', tOutC: 'apartments with a loggia or terrace', tOutT: 'A loggia on floors 1–4, a terrace on the fifth floor.', tFloors: 'Residential floors', tFloorsC: 'floors above the commercial ground floor', tFloorsT: 'Five residential floors above shops along the street.',
  contactSend: 'Send an enquiry',
  outLabel: 'Outdoor space', outTitle: 'A loggia or a terrace with every apartment', outText: 'Apartments on floors one to four have a loggia, apartments on the fifth floor a terrace. A place for the morning coffee and a quiet end of the day overlooking the neighbourhood.',
  outLoggia: 'Apartments with a loggia', outTerrace: 'Apartments with a terrace', outFloors: 'Floors with loggias',
  intLabel: 'Interiors', intTitle: 'A space for your new beginning', intBeds: 'Bedrooms', intBedsT: 'From one-bedroom apartments to four bedrooms on the fifth floor.', intBath: 'Bathrooms', intBathT: 'Type {t} apartments have two bathrooms.', intLiving: 'm² living room', intLivingT: "The largest living and dining room, as on the architect's sales plans.",
  catalogue: 'Catalogue', onBuilding: 'Select on the building', onBuildingText: 'Turn the building, hover over the facade and click an apartment. Floor plan, availability and an enquiry for every apartment.',
  area: 'Area', from: 'from', to: 'to', bedrooms: 'Bedrooms', floor: 'Floor', availability: 'Availability', onlyAvailable: 'Available only', all: 'All', reset: 'Reset', apply: 'Apply', filters: 'Filters', results: '{n} apartments',
  sort: 'Sort', sortDefault: 'By floor', sortAreaUp: 'Area: ascending', sortAreaDown: 'Area: descending',
  grid: 'Grid', list: 'List', noResults: 'No apartments match your filters.', showMore: 'Show more',
  building: 'Building', floorN: 'Floor {n}', type: 'Type', no: '№', priceOnRequest: 'Price on request', price: 'Price', status: 'Status',
  available: 'Available', reserved: 'Reserved', sold: 'Sold', unavailable: 'Not for sale',
  bed_one: '{n} bedroom', bed_few: '{n} bedrooms', bed_other: '{n} bedrooms',
  open: 'Open apartment', pdf: 'PDF', pdfLong: 'Download floor plan (PDF)', enquire: 'Send an enquiry', viewOnBuilding: 'View on the building',
  plan: 'Floor plan', plan3d: '3D view', onFloor: 'On the floor', rooms: 'Rooms', total: 'Total', loggia: 'Loggia', terrace: 'Terrace', outdoor: 'Outdoor space',
  similar: 'Similar apartments', similarText: 'Apartments with the same number of bedrooms on other floors.', viewAll: 'All apartments',
  prevUnit: 'Previous apartment', nextUnit: 'Next apartment', interiorTitle: 'A space for your\n*new beginning*', interiorText: 'Interior visualisations show a possible look of the apartment and are not part of the offer.',
  enquiryTitle: 'Interested in\n*this apartment*?', enquiryMsg: 'I am interested in apartment {code} (Riverina 1). Please contact me.',
  planAlt: 'Floor plan of apartment {code}', floorAlt: 'Position of apartment {code} on floor {n}', areaNote: "Areas as on the architect's sales plans; loggias count at 0.75 and terraces at 0.25 of their size. Permitted area variation ±3%. Subject to availability.",
};

export const V2: Record<Lang, V2Strings> = { bs: BS, en: EN };

export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
