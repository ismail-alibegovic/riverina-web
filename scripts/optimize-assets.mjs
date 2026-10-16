// Converts approved originals from the materials folder into web-ready WebP files in public/riverina.
// Originals are never moved or modified. next/image derives AVIF/WebP sizes from these at request time.
// Usage: node scripts/optimize-assets.mjs [materialsRoot]
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2] || path.resolve(process.cwd(), '..');
const M = 'Riverina residence';
const out = path.resolve(process.cwd(), 'public/riverina');

// [source relative to materials root, destination relative to public/riverina, max width]
const FILES = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 19].map((n) => [`${M}/3-stanovi enterijer/${n}.png`, `enterijer/enterijer-${n}.webp`, 2000]),
  [`${M}/riverina-location-catalog-map.png`, 'lokacija/mapa-ilidza.webp', 2400],
];

// Investor logo comes from the vector PDF (AlYasin Logo/ALYASINGROUP2.pdf): rendered once with
// `sips -s format png -Z 2000`, then trimmed to public/riverina/investitor/alyasin-logo.webp.

let total = 0;
for (const [src, dest, width] of FILES) {
  const from = path.join(root, src);
  const to = path.join(out, dest);
  await mkdir(path.dirname(to), { recursive: true });
  const info = await sharp(from).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(to);
  const before = (await stat(from)).size;
  total += info.size;
  console.log(`${dest.padEnd(36)} ${info.width}x${info.height}  ${(before / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`done, ${(total / 1024 / 1024).toFixed(1)} MB written`);
