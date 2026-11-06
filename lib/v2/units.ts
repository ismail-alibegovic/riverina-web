// Apartment data for the redesigned catalogue and detail pages. Everything comes from the live unit table
// (Supabase public_site_data) enriched with the brochure data the viewer already uses (toSelectorData).
import { LOCALES, type Lang } from '@/lib/i18n';
import { toSelectorData, type SiteData } from '@/lib/content';
import { DEFAULT_FLOORS } from '@/lib/floorPlans';
import { V2, fill, v2Unit } from './copy';

export type V2Status = 'available' | 'reserved' | 'sold' | 'unavailable';

export type V2Unit = {
  code: string;
  building: string;
  buildingName: string;
  floor: number;
  area: number;
  areaLabel: string;
  beds: number;
  bedsLabel: string;
  type: string;
  status: V2Status;
  statusLabel: string;
  price: string;
  plan: string;
  plan3d: string;
  pdf: string;
  href: string;
  outdoor: { kind: 'loggia' | 'terrace'; area: number; label: string } | null;
  rooms: { name: string; area: string }[];
};

export type FloorShape = { w: number; h: number; image: string; shapes: { unit: string; pts: [number, number][] }[] };

export const m2 = (n: number, lang: Lang) => n.toLocaleString(LOCALES[lang].number, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²';

export function bedsLabel(n: number, lang: Lang) {
  const t = V2[lang];
  const k = new Intl.PluralRules(LOCALES[lang].number).select(n);
  return fill(k === 'one' ? t.bed_one : k === 'few' ? t.bed_few : t.bed_other, { n });
}

export function v2Units(data: SiteData, lang: Lang): V2Unit[] {
  const t = V2[lang];
  const sel = toSelectorData(data);
  const names: Record<string, string> = Object.fromEntries(sel.buildings.map((b: any) => [b.id, b.name]));
  const loc = LOCALES[lang].number;
  const out = sel.units.map((u: any): V2Unit => {
    const status: V2Status = ['available', 'reserved', 'sold', 'unavailable'].includes(u.status) ? u.status : 'unavailable';
    const area = Number(u.area) || 0;
    const beds = Number(u.bedrooms) || 0;
    const showPrice = sel.settings.show_price && status !== 'sold' && Number(u.price) > 0;
    const outdoor = u.outdoor ? { kind: u.outdoor.kind, area: u.outdoor.area, label: `${u.outdoor.kind === 'terrace' ? t.terrace : t.loggia} ${m2(u.outdoor.area, lang)}` } : null;
    return {
      code: String(u.code),
      building: u.building,
      buildingName: names[u.building] || 'Riverina 1',
      floor: Number(u.floor) || 0,
      area,
      areaLabel: m2(area, lang),
      beds,
      bedsLabel: bedsLabel(beds, lang),
      type: u.type_id || '',
      status,
      statusLabel: t[status],
      price: showPrice ? Number(u.price).toLocaleString(loc) + ' ' + (sel.settings.currency || 'KM') : '',
      plan: u.plan_view || u.plan || '',
      plan3d: u.plan3d || '',
      pdf: u.pdf || '',
      href: v2Unit(String(u.code), lang),
      outdoor,
      rooms: (u.rooms || []).map((r: any) => ({ name: (lang !== 'bs' && r.n_en) || r.n, area: m2(Number(r.a), lang) })),
    };
  });
  // building, floor, then the number on the floor (1-2 before 1-10)
  return out.sort((a, b) => a.building.localeCompare(b.building) || a.floor - b.floor || num(a.code) - num(b.code));
}

const num = (code: string) => Number(code.split('-').pop()) || 0;

/** Floor outline with all apartment shapes, for the small "position on the floor" drawing. */
export function floorOf(data: SiteData, building: string, floor: number): FloorShape | null {
  const b = (data.scenes?.buildings || []).find((x: any) => x.id === building);
  const own = (b?.floors || []).find((f: any) => Number(f.level) === floor);
  if (own?.shapes?.length && own.w) return { w: own.w, h: own.h, image: own.image, shapes: own.shapes.map((s: any) => ({ unit: s.unit, pts: (s.polys?.[0] || s.pts || []) as [number, number][] })) };
  const def = (DEFAULT_FLOORS[building] || []).find((f) => f.level === floor);
  return def ? { w: def.w, h: def.h, image: def.image, shapes: def.shapes } : null;
}

/** Key figures of the first building, from the unit table. */
export function v2Facts(units: V2Unit[]) {
  if (!units.length) return null;
  const b = units[0].building;
  const own = units.filter((u) => u.building === b);
  const areas = own.map((u) => u.area).filter(Boolean);
  const beds = own.map((u) => u.beds).filter(Boolean);
  return {
    units: own.length,
    types: new Set(own.map((u) => u.type || u.area.toFixed(2))).size,
    floors: new Set(own.map((u) => u.floor).filter((f) => f > 0)).size,
    minArea: Math.round(Math.min(...areas)),
    maxArea: Math.round(Math.max(...areas)),
    minBeds: Math.min(...beds),
    maxBeds: Math.max(...beds),
  };
}
