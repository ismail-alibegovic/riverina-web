import { display, body } from '@/app/fonts';
import { LOCALES, Lang } from '@/lib/i18n';
import '@/app/globals.css';
import '@/app/selector.css';

// Runs before first paint: the intro curtain plays once per browser session.
const INTRO = `try{var s=window.sessionStorage;if(s.getItem('rv-intro'))document.documentElement.classList.add('intro-seen');else s.setItem('rv-intro','1')}catch(e){document.documentElement.classList.add('intro-seen')}`;

/** Shared <html> shell for every root layout (one per language, plus admin). */
export default function RootDocument({ lang, children, intro = false }: { lang: Lang; children: React.ReactNode; intro?: boolean }) {
  return (
    <html suppressHydrationWarning lang={lang} dir={LOCALES[lang].dir} className={`${display.variable} ${body.variable}`}>
      <head>{intro && <script dangerouslySetInnerHTML={{ __html: INTRO }} />}</head>
      <body>{children}</body>
    </html>
  );
}
