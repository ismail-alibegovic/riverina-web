import type { Lang } from '@/lib/i18n';
import type { Building, Unit } from '@/lib/units';
import { EX, explorerPath, type FloorSummary } from '@/lib/explorer';
import BuildingStage from '../explorer/BuildingStage';
import { Rich } from './text';

/**
 * Home: the building as the way in. The same scene the explorer opens with (components/explorer/BuildingStage),
 * full screen; choosing a floor opens the explorer on that floor, and the render carries over between the pages.
 */
export default function BuildingPreview({ lang, title, text, floors, building, units, tag }: { lang: Lang; title: string; text: string; floors: FloorSummary[]; building: Building; units: Unit[]; tag?: string }) {
  const t = EX[lang];
  if (!building.facade) return null;
  // the floor cards only need position and status
  const light = units.map((u) => ({ ...u, rooms: [], plan: '', plan3d: '', pdf: '' }));
  return (
    <section id="zgrada" className="bp" aria-labelledby="bp-title">
      <BuildingStage lang={lang} facade={building.facade} floors={floors} plans={building.floors} units={light} tag={tag}
        intro={(
          <>
            <p className="label bs-eyebrow" data-reveal="fade">{building.name}</p>
            <h2 id="bp-title" className="bs-title" data-reveal="up"><Rich text={title} /></h2>
            <p className="bs-text" data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>{text}</p>
            <a className="btn btn-gold bs-cta" href={explorerPath(lang)} data-reveal="up" style={{ '--i': 2 } as React.CSSProperties}>{t.open}<span className="arr" aria-hidden="true">→</span></a>
          </>
        )} />
    </section>
  );
}
