import { LocationPage } from '@/components/pages/Pages';
import { subMeta } from '@/components/pages/SubPage';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return subMeta(d, 'bs', 'location', d.page.location?.title, d.page.location?.text, d.page.location?.page_image);
}

export default async function Page() {
  const data = await getSiteData();
  return <LocationPage data={data} lang="bs" />;
}
