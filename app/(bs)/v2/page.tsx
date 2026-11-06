import Home from '@/components/v2/Home';
import { getSiteData, plain } from '@/lib/content';
import { v2Meta } from '@/lib/v2/meta';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return v2Meta(d, 'bs', plain(d.page.hero?.subtitle, 'bs'));
}

export default async function Page() {
  return <Home data={await getSiteData()} lang="bs" />;
}
