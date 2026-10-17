// Builds the default social sharing image (1200x630) and web versions of the brand logos.
// Used when a page has no sharing image set in the CMS. Usage: node scripts/make-og.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200, H = 630;
const shade = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1729" stop-opacity=".25"/><stop offset=".55" stop-color="#0e1729" stop-opacity=".35"/><stop offset="1" stop-color="#0e1729" stop-opacity=".88"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0e1729" stop-opacity=".7"/><stop offset=".55" stop-color="#0e1729" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#h)"/><rect x="72" y="${H - 66}" width="56" height="1" fill="#b8955a"/></svg>`);
const logo = await sharp('public/brand/wordmark-light.png').resize({ width: 460 }).toBuffer();

await mkdir('public/og', { recursive: true });
await sharp('public/riverina/objekat/objekat-8.webp')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: shade }, { input: logo, left: 72, top: H - 66 - 40 - 103 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og/riverina.jpg');
console.log('public/og/riverina.jpg');

// Web versions of the brand PNGs (header, footer, intro); the PNGs stay as masters.
// Shown at most ~34 px high (wordmark) and 180 px wide (stacked logo): 3x that is plenty for sharp screens.
for (const [f, w, q] of [['wordmark', 480, 90], ['wordmark-light', 480, 90], ['logo-stacked-light', 400, 82]]) {
  const info = await sharp(`public/brand/${f}.png`).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, alphaQuality: 100, effort: 6 }).toFile(`public/brand/${f}.webp`);
  console.log(`public/brand/${f}.webp ${(info.size / 1024).toFixed(0)} KB`);
}

// Favicons from the Riverina mark: on ivory so the navy and gold both read in light and dark browser tabs.
const markOn = async (size, pad, out) => {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp('public/brand/mark.png').resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const m = await sharp(mark).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#f6f1e7' } })
    .composite([{ input: mark, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }])
    .png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out);
  console.log(out);
};
await markOn(192, 0.12, 'app/icon.png');
await markOn(180, 0.14, 'app/apple-icon.png');
