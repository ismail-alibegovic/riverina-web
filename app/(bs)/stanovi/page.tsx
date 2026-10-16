import ApartmentsOnly from '@/components/ApartmentsOnly';
import { getSiteData } from '@/lib/content';
import type { Metadata } from 'next';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Odaberite svoj stan · Riverina Residence', alternates: { canonical: '/stanovi' } };

export default async function Page() {
  const data = await getSiteData();
  return <ApartmentsOnly data={data} lang="bs" embed={false} />;
}
