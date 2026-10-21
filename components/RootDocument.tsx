import { display, body } from '@/app/fonts';
import { LOCALES, Lang } from '@/lib/i18n';
import '@/app/globals.css';
import '@/app/selector.css';
import '@/app/home.css';
import '@/app/apartments.css';
import '@/app/editorial.css';

// Runs before first paint: the intro curtain plays once per browser session, and only when the visit starts on a
// home page (`/`, `/en`, ...). Deep links (apartments, contact, shared links from ads) open straight on their content.
const INTRO = `try{var s=window.sessionStorage,h=/^\\/([a-z]{2}\\/?)?$/.test(location.pathname);if(s.getItem('rv-intro')||!h)document.documentElement.classList.add('intro-seen');s.setItem('rv-intro','1')}catch(e){document.documentElement.classList.add('intro-seen')}`;

/** Shared <html> shell for every root layout (one per language, plus admin). */
export default function RootDocument({ lang, children, intro = false }: { lang: Lang; children: React.ReactNode; intro?: boolean }) {
  return (
    <html suppressHydrationWarning lang={lang} dir={LOCALES[lang].dir} className={`${display.variable} ${body.variable}`}>
      <head>{intro && <script dangerouslySetInnerHTML={{ __html: INTRO }} />}</head>
      <body>{children}</body>
    </html>
  );
}
