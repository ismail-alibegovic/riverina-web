import Site from '@/components/Site';
import { getSiteData } from '@/lib/content';
import { buildMetadata } from '@/lib/meta';

export const revalidate = 300;
export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'en', 'home', { title: d.page.hero?.subtitle, text: d.page.hero?.subtitle, image: d.page.hero?.image });
}

export default async function HomeEn() {
  const data = await getSiteData();
  return <Site data={data} lang="en" />;
}
