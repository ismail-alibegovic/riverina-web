import ApartmentsOnly from '@/components/ApartmentsOnly';
import { getSiteData, UI } from '@/lib/content';
import { buildMetadata } from '@/lib/meta';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const d = await getSiteData();
  return buildMetadata(d, 'en', 'apartments', { title: d.page.selector?.title || UI.en.chooseApartment, text: d.page.selector?.text });
}

export default async function Page() {
  const data = await getSiteData();
  return <ApartmentsOnly data={data} lang="en" embed={false} />;
}
