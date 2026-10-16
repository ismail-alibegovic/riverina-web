import { DeveloperPage } from '@/components/pages/Pages';
import { subMeta } from '@/components/pages/SubPage';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return subMeta(d, 'en', 'developer', d.page.investor?.title, d.page.investor?.text, d.page.investor?.page_image);
}

export default async function Page() {
  const data = await getSiteData();
  return <DeveloperPage data={data} lang="en" />;
}
