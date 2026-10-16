import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/content';
import './globals.css';
import './selector.css';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL), title: 'Riverina Residence' };
export const viewport: Viewport = { themeColor: '#14213a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
