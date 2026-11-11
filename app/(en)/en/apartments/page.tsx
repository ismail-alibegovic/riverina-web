import ApartmentsPage from '@/components/ApartmentsPage';
import { getSiteData } from '@/lib/content';
import { EX } from '@/lib/explorer';
import { buildMetadata } from '@/lib/meta';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const d = await getSiteData();
  return buildMetadata(d, 'en', 'apartments', { title: d.page.selector?.title || EX.en.title, text: d.page.selector?.text || EX.en.intro });
}

// Reads ?sprat= / ?tip= so the server renders the step the link names (the data itself is cached for 5 minutes).
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [data, search] = await Promise.all([getSiteData(), searchParams]);
  return <ApartmentsPage data={data} lang="en" search={search} />;
}
