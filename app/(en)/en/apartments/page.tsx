import ApartmentsOnly from '@/components/ApartmentsOnly';
import { getSiteData, tx } from '@/lib/content';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const d = await getSiteData();
  const title = `${tx(d.page.selector?.title, 'en') || 'Find your apartment'} · ${d.settings.project_name || 'Riverina Residence'}`;
  return { title, description: tx(d.page.selector?.text, 'en') || undefined, alternates: { canonical: '/en/apartments', languages: { bs: '/stanovi', en: '/en/apartments', 'x-default': '/stanovi' } } };
}

export default async function Page() {
  const data = await getSiteData();
  return <ApartmentsOnly data={data} lang="en" embed={false} />;
}
