// Consistency check for lib/apartmentTypes.ts against the brochure and the architect's sheets.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { APARTMENT_TYPES, unitsOfType } from '../lib/apartmentTypes.ts';

const cents = (n: number) => Math.round(n * 100);

test('rooms add up to the type area', () => {
  for (const t of APARTMENT_TYPES) {
    assert.equal(cents(t.rooms.reduce((s, [, a]) => s + a, 0)), cents(t.area), `type ${t.id}`);
  }
});

test('outdoor area appears in the room list', () => {
  for (const t of APARTMENT_TYPES) {
    assert.ok(t.rooms.some(([k, a]) => k === t.outdoor.kind && a === t.outdoor.area), `type ${t.id}`);
  }
});

test('brochure totals: 63 apartments, 9 types, 46-111 m², 1-4 bedrooms', () => {
  assert.equal(APARTMENT_TYPES.length, 9);
  assert.equal(APARTMENT_TYPES.reduce((s, t) => s + t.count, 0), 63);
  assert.equal(Math.min(...APARTMENT_TYPES.map((t) => t.bedrooms)), 1);
  assert.equal(Math.max(...APARTMENT_TYPES.map((t) => t.bedrooms)), 4);
});

test('plan thumbnail and sample sheet exist for every type', () => {
  for (const t of APARTMENT_TYPES) {
    assert.ok(existsSync(`public/riverina/types/tip-${t.id.toLowerCase()}.webp`), `thumbnail ${t.id}`);
    assert.ok(existsSync(`public/riverina/plans/${t.sample}.webp`), `sheet ${t.sample}`);
  }
});

test('unitsOfType matches by building and area', () => {
  const units = [{ building: 'r1', area: '46.44' }, { building: 'r1', area: 46.44 }, { building: 'r2', area: 46.44 }, { building: 'r1', area: 49.55 }];
  assert.equal(unitsOfType(APARTMENT_TYPES[0], units).length, 2);
});
