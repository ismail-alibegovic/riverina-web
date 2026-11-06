import { toSelectorData, tx, type SiteData } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { V2, v2Href } from '@/lib/v2/copy';
import { v2Units, floorOf, type FloorShape } from '@/lib/v2/units';
import Shell from './Shell';
import Catalog from './Catalog';
import Tabs from './Tabs';
import JsonLd from '@/components/JsonLd';

/** Brand colours for the existing viewer (it applies them to its stage and its panels). */
export const VIEWER_COLORS = { ink: '#051836', 'ink-2': '#0c2750', paper: '#FAF1E8', card: '#FFFBF6', gold: '#C49345', line: 'rgba(5, 24, 54, .12)', muted: '#5b6475' };

export default function Apartments({ data, lang }: { data: SiteData; lang: Lang }) {
  const t = V2[lang];
  const units = v2Units(data, lang);
  const floors: Record<string, FloorShape | null> = {};
  units.forEach((u) => { const k = `${u.building}:${u.floor}`; if (!(k in floors)) floors[k] = floorOf(data, u.building, u.floor); });
  const sel = toSelectorData(data);
  sel.settings = { ...sel.settings, list: false, colors: { ...VIEWER_COLORS, ...(sel.settings.colors || {}) } };
  const title = tx(data.page.selector?.title, lang) || t.choose;
  return (
    <Shell data={data} lang={lang} tone="light" current="apartments" langHref={(l) => v2Href('apartments', l)}>
      <section className="k-apage" aria-labelledby="k-apage-title">
        <div className="kt-wrap k-apage-head">
          <h1 id="k-apage-title" className="k-apage-title" data-k="lines"><span className="kt-line"><span>{t.apartments}</span></span><sup>({units.length})</sup></h1>
          {tx(data.page.types?.text, lang) && <p className="k-small" data-k="up">{tx(data.page.types?.text, lang)}</p>}
        </div>
        {units.length ? (
          <Tabs
            labels={[t.catalogue, t.onBuilding]}
            lang={lang}
            sel={sel}
            title={title}
            intro={t.onBuildingText}
            catalogue={<><Catalog units={units} lang={lang} floors={floors} /><p className="k-note">{t.areaNote}</p></>}
          />
        ) : <p className="kt-wrap k-empty">{lang === 'bs' ? 'Pregled stanova uskoro.' : 'Apartment overview coming soon.'}</p>}
      </section>
      <JsonLd data={data} lang={lang} route="apartments" title={title} />
    </Shell>
  );
}
