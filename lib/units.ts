// One normalised list of apartments for the public site: the home building preview, the apartment explorer
// (/stanovi) and the apartment pages (/stanovi/<code>) all read it, so figures never disagree between them.
//
// Source of truth, in order:
//   1. the unit table in the CMS (status, price, orientation, plan and PDF uploads, hidden units),
//   2. the architect's AutoCAD sales sheets (public/riverina/pdf/<code>.pdf), for the area of every apartment,
//   3. the sales brochure types A–I (lib/apartmentTypes.ts), for bedrooms, rooms and the loggia or terrace.
// Without the CMS (local preview, database unreachable) the sheets alone give all 63 apartments, with the status
// "on request": the site never claims availability it has not read from the database.
import { mediaUrl, type SiteData } from './content';
import { APARTMENT_TYPES, ROOM_NAMES, unitsOfType, type ApartmentType, type RoomKey } from './apartmentTypes';
import { DEFAULT_FLOORS, type FloorPlan } from './floorPlans';
import PLANS_3D from './plans3d.json';
import { FACADE, fromCms, type Facade } from './facade';

export { SHEET_AREAS } from './sheetAreas';
import { SHEET_AREAS } from './sheetAreas';

/** 'unknown' = no status from the database: shown as "on request", never as available. */
export type Status = 'available' | 'reserved' | 'sold' | 'unavailable' | 'unknown';

export type Room = { key?: RoomKey; bs: string; en: string; area: number };

export type Unit = {
  building: string;
  code: string;
  floor: number;
  /** position on the floor, from the code (3-7 → 7) */
  no: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type?: string;
  outdoor?: { kind: 'loggia' | 'terrace'; area: number };
  orientation: string;
  status: Status;
  price: number | null;
  rooms: Room[];
  /** clean 2D plan cut from the sheet, else the CMS plan upload */
  plan: string;
  plan3d: string;
  pdf: string;
};

const num = (v: unknown) => (v == null || v === '' ? NaN : Number(v));
const STATUSES: Status[] = ['available', 'reserved', 'sold', 'unavailable'];

function typeOf(building: string, area: number): ApartmentType | undefined {
  return APARTMENT_TYPES.find((t) => unitsOfType(t, [{ building, area }]).length);
}

function build(raw: any): Unit {
  const building = String(raw.building || 'r1');
  const code = String(raw.code);
  const [f, n] = code.split('-').map(Number);
  const area = num(raw.area) > 0 ? Number(raw.area) : SHEET_AREAS[code] || 0;
  const t = typeOf(building, area);
  const ownRooms: Room[] = Array.isArray(raw.rooms) && raw.rooms.length
    ? raw.rooms.map((r: any) => ({ bs: r.n || '', en: r.n_en || r.n || '', area: Number(r.a) || 0 }))
    : [];
  const rooms: Room[] = ownRooms.length ? ownRooms : (t?.rooms || []).map(([k, a]) => ({ key: k, bs: ROOM_NAMES[k].bs, en: ROOM_NAMES[k].en, area: a }));
  const bathrooms = rooms.filter((r) => r.key === 'bathroom' || /kupatilo|bath/i.test(r.bs)).length;
  const sheet = `/riverina/plans/${code}.webp`;
  const cmsPlan = mediaUrl(raw.plan_path || raw.plan || '');
  return {
    building,
    code,
    floor: Number.isFinite(num(raw.floor)) && num(raw.floor) > 0 ? Number(raw.floor) : f || 0,
    no: n || 0,
    area,
    bedrooms: num(raw.bedrooms) > 0 ? Number(raw.bedrooms) : t?.bedrooms || 0,
    bathrooms,
    type: t?.id,
    outdoor: t?.outdoor,
    orientation: String(raw.orientation || ''),
    status: STATUSES.includes(raw.status) ? raw.status : 'unknown',
    price: num(raw.price) > 0 ? Number(raw.price) : null,
    rooms,
    // the sheet itself is the CMS default; the cut-out drawing reads better on screen
    plan: building === 'r1' && SHEET_AREAS[code] && (!cmsPlan || cmsPlan === sheet) ? `/riverina/units/${code}.webp` : cmsPlan,
    plan3d: building === 'r1' ? (PLANS_3D as Record<string, string>)[code] || '' : '',
    pdf: mediaUrl(raw.pdf_path || raw.pdf || '') || (SHEET_AREAS[code] ? `/riverina/pdf/${code}.pdf` : ''),
  };
}

/** All public apartments, sorted by floor and number. */
export function getUnits(data: Pick<SiteData, 'units'>): Unit[] {
  const db = (data.units || []).filter((u: any) => u && u.code);
  const list = db.length ? db.map(build) : Object.keys(SHEET_AREAS).map((code) => build({ building: 'r1', code }));
  return list.sort((a, b) => a.building.localeCompare(b.building) || a.floor - b.floor || a.no - b.no);
}

/** facade: the render with one zone per floor (CMS, else the default for Riverina 1, else none). */
export type Building = { id: string; name: string; floors: FloorPlan[]; levels: number[]; facade: Facade | null };

/** Buildings with apartments; floor plans from the CMS, else the ones generated from the architect's sheets. */
export function getBuildings(data: Pick<SiteData, 'scenes'>, units: Unit[]): Building[] {
  const scenes: any[] = data.scenes?.buildings || [];
  const ids = Array.from(new Set(units.map((u) => u.building)));
  return ids.map((id) => {
    const s = scenes.find((b) => b.id === id) || {};
    const cms: FloorPlan[] = (s.floors || []).filter((f: any) => f.image && f.shapes?.length).map((f: any) => ({ ...f, image: mediaUrl(f.image) }));
    const floors = (cms.length ? cms : DEFAULT_FLOORS[id] || []).slice().sort((a, b) => a.level - b.level);
    const levels = Array.from(new Set(units.filter((u) => u.building === id).map((u) => u.floor))).sort((a, b) => a - b);
    const facade = fromCms(s.facade, mediaUrl) || (id === 'r1' ? FACADE : null);
    return { id, name: s.name || (id === 'r1' ? 'Riverina 1' : id.toUpperCase()), floors, levels, facade };
  });
}

export const isOpen = (u: Unit) => u.status === 'available';
/** Statuses a visitor can still ask about (available, or no status from the database). */
export const isEnquirable = (u: Unit) => u.status === 'available' || u.status === 'unknown';
