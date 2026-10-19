// Plan images cut from the AutoCAD sales sheets: the drawing part only, without the title block and the area table.
// Source: public/riverina/plans/{floor}-{unit}.webp (from the architect's PDFs).
// Output: public/riverina/units/{floor}-{unit}.webp (every apartment, for the apartment viewer) and
//         public/riverina/types/tip-{a..i}.webp (one per type, for the "Kolekcija stanova" section).
// Run: node scripts/make-type-plans.mjs
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';

// Representative unit per type, see `sample` in lib/apartmentTypes.ts.
const TYPES = { a: '1-6', b: '1-10', c: '1-1', d: '1-5', e: '5-3', f: '5-4', g: '5-6', h: '5-1', i: '5-2' };
const SRC = 'public/riverina/plans';

async function cut(code, out, width) {
  const src = `${SRC}/${code}.webp`;
  const { width: w, height: h } = await sharp(src).metadata();
  // The plan sits between the sheet title (top ~11 %) and the "position / area table" block (from ~59 %).
  // Extract and trim run as separate pipelines: within one, sharp trims before it extracts.
  const top = Math.round(h * 0.11), bottom = Math.round(h * 0.59);
  const band = await sharp(src)
    .extract({ left: Math.round(w * 0.03), top, width: Math.round(w * 0.94), height: bottom - top })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  const cropped = await sharp(band).trim({ background: '#ffffff', threshold: 40 }).toBuffer();
  await sharp(cropped)
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
}

await mkdir('public/riverina/types', { recursive: true });
await mkdir('public/riverina/units', { recursive: true });
for (const [t, code] of Object.entries(TYPES)) await cut(code, `public/riverina/types/tip-${t}.webp`, 900);
const codes = (await readdir(SRC)).filter((f) => /^\d+-\d+\.webp$/.test(f)).map((f) => f.slice(0, -5));
for (const code of codes) await cut(code, `public/riverina/units/${code}.webp`, 1100);
console.log(`${Object.keys(TYPES).length} type plans, ${codes.length} apartment plans`);
