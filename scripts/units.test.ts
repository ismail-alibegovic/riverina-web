// Consistency of the apartment explorer data: sheet areas, brochure types, floor outlines, facade floors.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { SHEET_AREAS } from '../lib/sheetAreas.ts';
import { APARTMENT_TYPES, unitsOfType } from '../lib/apartmentTypes.ts';
import { FACADE } from '../lib/facade.ts';

const codes = Object.keys(SHEET_AREAS);
const units = codes.map((code) => ({ building: 'r1', code, area: SHEET_AREAS[code] }));

test('63 apartments on the sheets, each with its own PDF, plan, cut-out plan and 3D plan', () => {
  assert.equal(codes.length, 63);
  const plans3d = JSON.parse(readFileSync('lib/plans3d.json', 'utf8'));
  for (const c of codes) {
    assert.ok(existsSync(`public/riverina/pdf/${c}.pdf`), `pdf ${c}`);
    assert.ok(existsSync(`public/riverina/units/${c}.webp`), `plan ${c}`);
    assert.ok(plans3d[c] && existsSync('public' + plans3d[c]), `3d ${c}`);
  }
});

test('every sheet area is one brochure type, with the brochure counts', () => {
  for (const u of units) assert.equal(APARTMENT_TYPES.filter((t) => unitsOfType(t, [u]).length).length, 1, u.code);
  for (const t of APARTMENT_TYPES) assert.equal(unitsOfType(t, units).length, t.count, `type ${t.id}`);
});

test('every apartment has exactly one outline on its floor plan', () => {
  const floors = JSON.parse(readFileSync('lib/floorPlans.json', 'utf8')).r1 as { level: number; shapes: { unit: string }[] }[];
  const drawn = floors.flatMap((f) => f.shapes.map((s) => s.unit));
  assert.deepEqual([...drawn].sort(), [...codes].sort());
  for (const f of floors) for (const s of f.shapes) assert.equal(Number(s.unit.split('-')[0]), f.level, s.unit);
});

test('the facade has one zone per residential floor, stacked bottom to top', () => {
  assert.deepEqual(FACADE.floors.map((f) => f.level), [1, 2, 3, 4, 5]);
  const mid = (p: [number, number][]) => p.reduce((s, q) => s + q[1], 0) / p.length;
  for (let i = 1; i < FACADE.floors.length; i++) assert.ok(mid(FACADE.floors[i].pts) < mid(FACADE.floors[i - 1].pts));
  for (const f of FACADE.floors) for (const [x, y] of f.pts) assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1);
});
