import { ContactPage } from '@/components/pages/Pages';
import { subMeta } from '@/components/pages/SubPage';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return subMeta(d, 'bs', 'contact', d.page.contact?.title, d.page.contact?.text, undefined);
}

export default async function Page() {
  const data = await getSiteData();
  return <ContactPage data={data} lang="bs" />;
}
