import { Cormorant_Garamond, Manrope } from 'next/font/google';

// Self-hosted at build time by next/font. latin-ext covers č ć đ š ž.
export const display = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
export const body = Manrope({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' });
