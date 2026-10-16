import ApartmentsOnly from '@/components/ApartmentsOnly';
import { getSiteData } from '@/lib/content';
import type { Metadata } from 'next';

export const revalidate = 300;
export const metadata: Metadata = { title: 'Choose your apartment · Riverina Residence', alternates: { canonical: '/en/stanovi' }, robots: { index: false, follow: false } };

export default async function Page() {
  const data = await getSiteData();
  return <ApartmentsOnly data={data} lang="en" embed={true} />;
}
