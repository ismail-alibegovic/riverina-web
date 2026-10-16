import Site from '@/components/Site';
import { getSiteData } from '@/lib/content';
import { pageMetadata } from '@/lib/meta';

export const revalidate = 300;
export const generateMetadata = () => pageMetadata('bs');

export default async function Home() {
  const data = await getSiteData();
  return <Site data={data} lang="bs" />;
}
