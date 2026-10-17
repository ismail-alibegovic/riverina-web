import { ContactPage } from '@/components/pages/Pages';
import { buildMetadata } from '@/lib/meta';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'bs', 'contact', { title: d.page.contact?.title, text: d.page.contact?.text });
}

export default async function Page() {
  const data = await getSiteData();
  return <ContactPage data={data} lang="bs" />;
}
