import { PrivacyPage } from '@/components/pages/Pages';
import { subMeta } from '@/components/pages/SubPage';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return subMeta(d, 'en', 'privacy', d.page.privacy?.title, d.page.privacy?.text, undefined);
}

export default async function Page() {
  const data = await getSiteData();
  return <PrivacyPage data={data} lang="en" />;
}
