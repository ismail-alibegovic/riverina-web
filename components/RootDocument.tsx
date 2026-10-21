import { display, body } from '@/app/fonts';
import { LOCALES, Lang } from '@/lib/i18n';
import '@/app/globals.css';
import '@/app/selector.css';
import '@/app/home.css';
import '@/app/apartments.css';
import '@/app/editorial.css';

// Page transitions between documents are a progressive enhancement (globals.css). When the browser skips one
// (a reload, a hidden tab, a fast second click) it rejects the transition's promises; nothing waits on them, so they
// are marked handled here instead of surfacing as uncaught errors. Runs before first paint, where pagereveal fires.
const VT = `(function(){function q(e){var v=e.viewTransition;if(!v)return;['ready','finished','updateCallbackDone'].forEach(function(k){v[k]&&v[k].catch(function(){})})}addEventListener('pagereveal',q);addEventListener('pageswap',q)})()`;

/** Shared <html> shell for every root layout (one per language, plus admin). */
export default function RootDocument({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang={lang} dir={LOCALES[lang].dir} className={`${display.variable} ${body.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: VT }} /></head>
      <body>{children}</body>
    </html>
  );
}
