import type { Metadata, Viewport } from 'next';
import RootDocument from '@/components/RootDocument';
import { SITE_URL } from '@/lib/content';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: 'Riverina Residence' };
export const viewport: Viewport = { themeColor: '#14213a', width: 'device-width', initialScale: 1 };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="bs" intro>{children}</RootDocument>;
}
