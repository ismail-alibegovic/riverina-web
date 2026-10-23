import { display, body } from '@/app/fonts';
import { LOCALES, Lang } from '@/lib/i18n';
import '@/app/globals.css';
import '@/app/selector.css';
import '@/app/home.css';
import '@/app/apartments.css';
import '@/app/elicyon.css';

// Runs before first paint: the logo loader plays once per browser session, and only when the visit starts on a
// home page (`/`, `/en`, ...). Deep links (apartments, contact, shared links from ads) open straight on their content.
// While it plays the header waits and the page does not scroll (intro-run); a timer releases both if the scripts fail.
const INTRO = `try{var d=document.documentElement,s=window.sessionStorage,h=/^\\/([a-z]{2}\\/?)?$/.test(location.pathname);if(s.getItem('rv-intro')||!h||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro-seen');else{d.classList.add('intro-run');setTimeout(function(){d.classList.remove('intro-run')},9000)}s.setItem('rv-intro','1')}catch(e){document.documentElement.classList.add('intro-seen')}`;
// Page transitions between documents are a progressive enhancement (globals.css). When the browser skips one
// (a reload, a hidden tab, a fast second click) it rejects the transition's promises; nothing waits on them, so they
// are marked handled here instead of surfacing as uncaught errors. Runs before first paint, where pagereveal fires.
const VT = `(function(){function q(e){var v=e.viewTransition;if(!v)return;['ready','finished','updateCallbackDone'].forEach(function(k){v[k]&&v[k].catch(function(){})})}addEventListener('pagereveal',q);addEventListener('pageswap',q)})()`;

/** Shared <html> shell for every root layout (one per language, plus admin). */
export default function RootDocument({ lang, children, intro = false }: { lang: Lang; children: React.ReactNode; intro?: boolean }) {
  return (
    <html suppressHydrationWarning lang={lang} dir={LOCALES[lang].dir} className={`${display.variable} ${body.variable}`}>
      <head>
        {intro && <script dangerouslySetInnerHTML={{ __html: INTRO }} />}
        <script dangerouslySetInnerHTML={{ __html: VT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
