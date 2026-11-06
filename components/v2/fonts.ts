import { Inter, Playfair_Display } from 'next/font/google';

// The KEY TOWERS pairing: a modern grotesk for monumental headings and text, an elegant italic serif for the contrast word.
// latin-ext covers č ć đ š ž.
export const sans = Inter({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500'], variable: '--kt-sans', display: 'swap' });
export const serif = Playfair_Display({ subsets: ['latin', 'latin-ext'], weight: ['400'], style: ['italic', 'normal'], variable: '--kt-serif', display: 'swap' });
