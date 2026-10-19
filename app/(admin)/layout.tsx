import type { Viewport } from 'next';
import RootDocument from '@/components/RootDocument';

export const viewport: Viewport = { themeColor: '#14213a', width: 'device-width', initialScale: 1 };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="bs">{children}</RootDocument>;
}
