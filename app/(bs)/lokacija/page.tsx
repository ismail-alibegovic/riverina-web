import { LocationPage } from '@/components/pages/Pages';
import { buildMetadata } from '@/lib/meta';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'bs', 'location', { title: d.page.location?.title, text: d.page.location?.text, image: d.page.location?.page_image });
}

export default async function Page() {
  const data = await getSiteData();
  return <LocationPage data={data} lang="bs" />;
}
