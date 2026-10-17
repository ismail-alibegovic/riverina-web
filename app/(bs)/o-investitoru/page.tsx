import { DeveloperPage } from '@/components/pages/Pages';
import { buildMetadata } from '@/lib/meta';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'bs', 'developer', { title: d.page.investor?.title, text: d.page.investor?.text, image: d.page.investor?.page_image });
}

export default async function Page() {
  const data = await getSiteData();
  return <DeveloperPage data={data} lang="bs" />;
}
