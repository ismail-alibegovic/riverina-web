// Plan thumbnails for the apartment types section: the drawing part of one AutoCAD sales sheet per type,
// without the title block and the area table. Source: public/riverina/plans/{floor}-{unit}.webp (from the
// architect's PDFs). Output: public/riverina/types/tip-{a..i}.webp. Run: node scripts/make-type-plans.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Representative unit per type, see `sample` in lib/apartmentTypes.ts.
const TYPES = { a: '1-6', b: '1-10', c: '1-1', d: '1-5', e: '5-3', f: '5-4', g: '5-6', h: '5-1', i: '5-2' };
const OUT = 'public/riverina/types';

await mkdir(OUT, { recursive: true });
for (const [t, code] of Object.entries(TYPES)) {
  const src = `public/riverina/plans/${code}.webp`;
  const { width, height } = await sharp(src).metadata();
  // The plan sits between the sheet title (top ~11 %) and the "position / area table" block (from ~59 %).
  // Extract and trim run as separate pipelines: within one, sharp trims before it extracts.
  const top = Math.round(height * 0.11), bottom = Math.round(height * 0.59);
  const band = await sharp(src)
    .extract({ left: Math.round(width * 0.03), top, width: Math.round(width * 0.94), height: bottom - top })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  const cropped = await sharp(band).trim({ background: '#ffffff', threshold: 40 }).toBuffer();
  await sharp(cropped)
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' })
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${OUT}/tip-${t}.webp`);
  console.log(`tip-${t} ← ${code}`);
}
