// 3D apartment plans for the apartment viewer, from Google Drive "2-stanovi 3d osnova/SKICE 3D":
//   I/stan {n}.png  = apartment n on floors 1-4 (same layout on every floor),  II/STAN {n}.png = apartment n on floor 5.
// Copy both folders to assets-src/3d/ (not published, see .gitignore), then run: node scripts/make-3d-plans.mjs [folder]
// Output: public/riverina/3d/*.webp and lib/plans3d.json ({ "1-1": "/riverina/3d/f1-4-1.webp", ... }), read by lib/content.ts.
// These visuals are AI-assisted (see docs/assets-inventory.md); the site labels them as illustrations.
import sharp from 'sharp';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2] || 'assets-src/3d';
const OUT = 'public/riverina/3d';
const SETS = [{ dir: 'I', floors: [1, 2, 3, 4], name: 'f1-4' }, { dir: 'II', floors: [5], name: 'f5' }];

await mkdir(OUT, { recursive: true });
const map = {};
for (const set of SETS) {
  const dir = path.join(SRC, set.dir);
  if (!existsSync(dir)) { console.warn(`missing ${dir}`); continue; }
  for (const f of await readdir(dir)) {
    const m = /^stan\s*(\d+)\.(png|jpe?g|webp)$/i.exec(f);
    if (!m) continue;
    const file = `${set.name}-${Number(m[1])}.webp`;
    await sharp(path.join(dir, f)).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(OUT, file));
    for (const fl of set.floors) map[`${fl}-${Number(m[1])}`] = `/riverina/3d/${file}`;
  }
}
await writeFile('lib/plans3d.json', JSON.stringify(map, null, 0) + '\n');
console.log(`${Object.keys(map).length} apartments with a 3D plan`);
