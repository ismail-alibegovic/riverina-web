// Draft buildings are removed from the public data. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutDrafts } from '../lib/drafts.ts';

test('draft buildings and their units are removed', () => {
  const scenes = { masterplan: { views: [] }, buildings: [{ id: 'r1', status: 'active' }, { id: 'r2', status: 'draft' }, { id: 'r3', status: 'soon' }] };
  const units = [{ building: 'r1', code: 'A' }, { building: 'r2', code: 'B' }, { building: 'r3', code: 'C' }];
  const out = withoutDrafts(scenes, units);
  assert.deepEqual(out.scenes.buildings.map((b) => b.id), ['r1', 'r3']);
  assert.deepEqual(out.units.map((u) => u.code), ['A', 'C']);
  assert.deepEqual(out.scenes.masterplan, { views: [] });
});

test('without drafts nothing changes', () => {
  const scenes = { buildings: [{ id: 'r1' }] };
  const units = [{ building: 'r1' }];
  const out = withoutDrafts(scenes, units);
  assert.equal(out.scenes, scenes);
  assert.equal(out.units, units);
});
