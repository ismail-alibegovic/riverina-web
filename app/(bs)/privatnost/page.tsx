import { PrivacyPage } from '@/components/pages/Pages';
import { buildMetadata } from '@/lib/meta';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'bs', 'privacy', { title: d.page.privacy?.title, text: d.page.privacy?.text });
}

export default async function Page() {
  const data = await getSiteData();
  return <PrivacyPage data={data} lang="bs" />;
}
