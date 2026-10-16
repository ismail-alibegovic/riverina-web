import Site from '@/components/Site';
import { getSiteData } from '@/lib/content';
import { pageMetadata } from '@/lib/meta';

export const revalidate = 300;
export const generateMetadata = () => pageMetadata('en');

export default async function HomeEn() {
  const data = await getSiteData();
  return <div lang="en"><Site data={data} lang="en" /></div>;
}
