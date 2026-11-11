import { Lang, SiteData, UI, illustrationLabel } from '@/lib/content';
import { href } from '@/lib/i18n';
import { siteNav } from '@/lib/nav';
import { getUnits, getBuildings, SHEET_AREAS } from '@/lib/units';
import { EX, beds, fill, m2, unitLabel, explorerPath, parseAt, type At } from '@/lib/explorer';
import Explorer from './explorer/Explorer';
import SiteChrome from './site/SiteChrome';
import Footer from './site/Footer';
import JsonLd from './JsonLd';

/** /stanovi and /stanovi/<code>: the explorer in the site frame, opened on the step the URL names. */
export default function ApartmentsPage({ data, lang, code, search }: { data: SiteData; lang: Lang; code?: string; search?: Record<string, string | string[] | undefined> }) {
  const t = UI[lang];
  const units = getUnits(data);
  const building = getBuildings(data, units)[0];
  const nav = siteNav(data, lang, 'apartments');
  const url = new URL('http://x' + explorerPath(lang, code ? { code } : undefined));
  Object.entries(search || {}).forEach(([k, v]) => typeof v === 'string' && url.searchParams.set(k, v));
  const initial: At = parseAt(url, new Set(units.map((u) => u.code)));
  const settings = { currency: data.settings.currency || 'KM', showPrice: !!data.settings.show_price, phone: String(data.page.contact?.phone || data.settings.phone || '') };
  return (
    <>
      <SiteChrome data={data} lang={lang} nav={nav} tone="dark" contactHref={href('contact', lang)}
        langHref={(l) => explorerPath(l, code ? { code } : undefined)} cta={{ href: '#kontakt', label: t.contact }} />
      <main id="main" className="ex-main">
        {building ? <Explorer lang={lang} units={units} building={building} settings={settings} initial={initial} tag={illustrationLabel(data.page, lang)} /> : <p className="empty-note">{t.noApartments}</p>}
      </main>
      <Footer data={data} lang={lang} nav={nav} />
      <JsonLd data={data} lang={lang} route="apartments" title={EX[lang].title} />
    </>
  );
}

/** Codes rendered at build time (the rest render on first request). */
export const staticCodes = () => Object.keys(SHEET_AREAS).map((code) => ({ code }));

/** Title and description of an apartment page. */
export function unitMeta(data: SiteData, lang: Lang, code: string) {
  const u = getUnits(data).find((x) => x.code === code);
  if (!u) return null;
  const t = EX[lang];
  const title = `${fill(t.apartmentN, { c: unitLabel(u) })}${u.type ? ', ' + fill(t.typeN, { t: u.type }) : ''} · ${m2(u.area, lang)}`;
  const text = [fill(t.floorN, { n: u.floor }), beds(u.bedrooms, lang), u.outdoor ? `${u.outdoor.kind === 'loggia' ? t.loggia : t.terrace} ${m2(u.outdoor.area, lang)}` : ''].filter(Boolean).join(' · ');
  return { title, text, image: u.plan3d || u.plan };
}
