import { notFound } from 'next/navigation';
import ApartmentsPage, { staticCodes, unitMeta } from '@/components/ApartmentsPage';
import { getSiteData } from '@/lib/content';
import { explorerPath } from '@/lib/explorer';
import { buildMetadata } from '@/lib/meta';
import type { Metadata } from 'next';

export const revalidate = 300;
export const generateStaticParams = staticCodes;

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const [d, { code }] = await Promise.all([getSiteData(), params]);
  const m = unitMeta(d, 'bs', decodeURIComponent(code));
  if (!m) return {};
  const base = buildMetadata(d, 'bs', 'apartments', m);
  const url = explorerPath('bs', { code: decodeURIComponent(code) });
  return { ...base, alternates: { canonical: url, languages: { bs: explorerPath('bs', { code }), en: explorerPath('en', { code }), 'x-default': explorerPath('bs', { code }) } }, openGraph: { ...base.openGraph, url } };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const [data, { code }] = await Promise.all([getSiteData(), params]);
  const c = decodeURIComponent(code);
  if (!unitMeta(data, 'bs', c)) notFound();
  return <ApartmentsPage data={data} lang="bs" code={c} />;
}
