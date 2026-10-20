import { GalleryPage } from '@/components/pages/Pages';
import { buildMetadata } from '@/lib/meta';
import { getSiteData } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata() {
  const d = await getSiteData();
  return buildMetadata(d, 'bs', 'gallery', { title: d.page.gallery?.title, text: d.page.gallery?.text, image: d.page.gallery?.page_image });
}

export default async function Page() {
  const data = await getSiteData();
  return <GalleryPage data={data} lang="bs" />;
}
