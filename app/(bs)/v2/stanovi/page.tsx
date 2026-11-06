import Apartments from '@/components/v2/Apartments';
import { getSiteData } from '@/lib/content';
import { V2 } from '@/lib/v2/copy';
import { v2Meta } from '@/lib/v2/meta';

export const revalidate = 300;

export async function generateMetadata() {
  return v2Meta(await getSiteData(), 'bs', V2.bs.apartments);
}

export default async function Page() {
  return <Apartments data={await getSiteData()} lang="bs" />;
}
