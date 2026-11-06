import { notFound } from 'next/navigation';
import Detail from '@/components/v2/Detail';
import { getSiteData } from '@/lib/content';
import { V2, fill } from '@/lib/v2/copy';
import { v2Meta } from '@/lib/v2/meta';
import { v2Units } from '@/lib/v2/units';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getSiteData()).units.map((u) => ({ code: String(u.code) }));
}

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props) {
  const code = decodeURIComponent((await params).code);
  const d = await getSiteData();
  const u = v2Units(d, 'en').find((x) => x.code === code);
  if (!u) return {};
  return v2Meta(d, 'en', `${V2.en.no} ${u.code} · ${u.bedsLabel}, ${u.areaLabel}`, `${u.buildingName}, ${fill(V2.en.floorN, { n: u.floor })}. ${u.statusLabel}.`, u.plan);
}

export default async function Page({ params }: Props) {
  const code = decodeURIComponent((await params).code);
  const d = await getSiteData();
  if (!d.units.some((u) => String(u.code) === code)) notFound();
  return <Detail data={d} lang="en" code={code} />;
}
