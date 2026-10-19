// Apartment types of Riverina 1, as published in the sales brochure (Google Drive: Riverina-Objekat-1 /
// Riverina-Objekat-1-BS.pdf and Riverina-Building-1-EN.pdf, 6. 10. 2026) and the architect's AutoCAD sheets.
// Areas are sales areas in m² as on the sheets (loggia counted × 0.75, terrace × 0.25); rooms add up to the total. The live unit table matches each type by its area.
// Self-contained (no '@/' imports) so the check in scripts/apartment-types.test.ts can load it directly.

export type RoomKey =
  | 'entrance' | 'hallway' | 'passage' | 'storage' | 'utility' | 'wc' | 'bathroom' | 'kitchen' | 'kitchenDining'
  | 'living' | 'livingDining' | 'bedroom' | 'primary' | 'child' | 'loggia' | 'terrace';

export const ROOM_NAMES: Record<RoomKey, { bs: string; en: string }> = {
  entrance: { bs: 'Ulaz', en: 'Entrance' },
  hallway: { bs: 'Hodnik', en: 'Hallway' },
  passage: { bs: 'Degažman', en: 'Passage' },
  storage: { bs: 'Ostava', en: 'Storage' },
  utility: { bs: 'Ekonomat', en: 'Utility room' },
  wc: { bs: 'WC', en: 'WC' },
  bathroom: { bs: 'Kupatilo', en: 'Bathroom' },
  kitchen: { bs: 'Kuhinja', en: 'Kitchen' },
  kitchenDining: { bs: 'Kuhinja i trpezarija', en: 'Kitchen and dining room' },
  living: { bs: 'Dnevni boravak', en: 'Living room' },
  livingDining: { bs: 'Dnevni boravak i trpezarija', en: 'Living and dining room' },
  bedroom: { bs: 'Spavaća soba', en: 'Bedroom' },
  primary: { bs: 'Master soba', en: 'Primary bedroom' },
  child: { bs: 'Dječija soba', en: "Child's bedroom" },
  loggia: { bs: 'Lođa', en: 'Loggia' },
  terrace: { bs: 'Terasa', en: 'Terrace' },
};

export type ApartmentType = {
  /** type letter from the brochure */
  id: string;
  building: string;
  area: number;
  bedrooms: number;
  outdoor: { kind: 'loggia' | 'terrace'; area: number };
  floors: [number, number];
  /** number of apartments of this type in the brochure */
  count: number;
  /** unit whose AutoCAD sheet is used for the plan thumbnail (public/riverina/types/tip-x.webp) */
  sample: string;
  rooms: [RoomKey, number][];
};

const T = (id: string, area: number, bedrooms: number, outdoor: ApartmentType['outdoor'], floors: [number, number], count: number, sample: string, rooms: [RoomKey, number][]): ApartmentType =>
  ({ id, building: 'r1', area, bedrooms, outdoor, floors, count, sample, rooms });

export const APARTMENT_TYPES: ApartmentType[] = [
  T('A', 46.44, 1, { kind: 'loggia', area: 3.31 }, [1, 4], 8, '1-6', [
    ['entrance', 1.1], ['hallway', 3.9], ['storage', 1.66], ['bathroom', 3.79], ['kitchen', 3.32], ['livingDining', 16], ['bedroom', 13.36], ['loggia', 3.31]]),
  T('B', 49.55, 1, { kind: 'loggia', area: 3.31 }, [1, 4], 28, '1-10', [
    ['entrance', 1.3], ['hallway', 3.25], ['storage', 1.89], ['bathroom', 5.12], ['kitchen', 4.56], ['livingDining', 17.16], ['bedroom', 12.96], ['loggia', 3.31]]),
  T('C', 66.15, 2, { kind: 'loggia', area: 2.4 }, [1, 4], 16, '1-1', [
    ['entrance', 2.54], ['hallway', 3.51], ['passage', 2.53], ['utility', 1.38], ['wc', 1.5], ['bathroom', 3.3], ['kitchenDining', 6.74], ['living', 21.06], ['bedroom', 11.74], ['bedroom', 9.45], ['loggia', 2.4]]),
  T('D', 73.93, 2, { kind: 'loggia', area: 7.26 }, [1, 4], 4, '1-5', [
    ['entrance', 2.08], ['hallway', 5.46], ['wc', 1.95], ['utility', 2.08], ['bathroom', 4.35], ['kitchen', 5.28], ['livingDining', 23.43], ['bedroom', 11.02], ['bedroom', 11.02], ['loggia', 7.26]]),
  T('E', 86.37, 3, { kind: 'terrace', area: 4.03 }, [5, 5], 2, '5-3', [
    ['entrance', 2.08], ['hallway', 7.15], ['bathroom', 4.49], ['bathroom', 4.49], ['kitchen', 4.42], ['livingDining', 21.07], ['primary', 16.8], ['bedroom', 12.6], ['child', 9.24], ['terrace', 4.03]]),
  T('F', 88.36, 3, { kind: 'terrace', area: 4.03 }, [5, 5], 1, '5-4', [
    ['entrance', 2.08], ['hallway', 7.15], ['wc', 2.25], ['bathroom', 4.49], ['bathroom', 4.49], ['kitchen', 4.96], ['livingDining', 21.28], ['primary', 16.8], ['bedroom', 12.6], ['child', 8.23], ['terrace', 4.03]]),
  T('G', 96.64, 3, { kind: 'terrace', area: 7.18 }, [5, 5], 2, '5-6', [
    ['entrance', 2.08], ['hallway', 4.69], ['passage', 3.77], ['wc', 2.39], ['bathroom', 4.49], ['bathroom', 3.9], ['kitchen', 4.5], ['livingDining', 24.74], ['primary', 11.18], ['bedroom', 12.6], ['bedroom', 15.12], ['terrace', 7.18]]),
  T('H', 104.35, 3, { kind: 'terrace', area: 10.33 }, [5, 5], 1, '5-1', [
    ['entrance', 2.88], ['hallway', 6.76], ['passage', 4.94], ['utility', 2.4], ['wc', 2.25], ['bathroom', 3.74], ['bathroom', 3.74], ['storage', 3.15], ['kitchen', 8.12], ['livingDining', 23.59], ['primary', 15.05], ['child', 8.7], ['child', 8.7], ['terrace', 10.33]]),
  T('I', 110.92, 4, { kind: 'terrace', area: 5.03 }, [5, 5], 1, '5-2', [
    ['entrance', 3.51], ['hallway', 11.05], ['wc', 2.1], ['utility', 2.24], ['bathroom', 4.49], ['bathroom', 4.34], ['kitchen', 6.07], ['livingDining', 21.84], ['primary', 16.24], ['bedroom', 12.6], ['bedroom', 12.6], ['child', 8.81], ['terrace', 5.03]]),
];

/** Units of the live table that belong to a type (same building, same area to the cent). */
export function unitsOfType<U extends { building?: string; area?: number | string }>(t: ApartmentType, units: U[]): U[] {
  return units.filter((u) => u.building === t.building && Math.abs(Number(u.area) - t.area) < 0.005);
}
