'use client';
import Selector from '@/components/Selector';
import type { Lang } from '@/lib/i18n';

/** The existing interactive viewer (360° building, floors, apartment panel, compare, enquiry), unchanged in function. */
export default function BuildingView({ data, lang, title }: { data: any; lang: Lang; title: string }) {
  return <div className="k-bview"><Selector data={data} lang={lang} title={title} /></div>;
}
