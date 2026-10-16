import type { Metadata } from 'next';
import { display, body } from './fonts';
import { UI } from '@/lib/i18n';
import './globals.css';
import './home.css';

export const metadata: Metadata = { title: '404 · Riverina Residence', robots: { index: false, follow: false } };

// One 404 for every language group (the app has a root layout per language). Shown in both languages.
export default function GlobalNotFound() {
  return (
    <html lang="bs" className={`${display.variable} ${body.variable}`}>
      <body>
        <main className="nf">
          <a href="/" className="nf-brand" aria-label="Riverina Residence"><img src="/brand/wordmark-light.png" alt="" width={700} height={157} /></a>
          <p className="nf-code" aria-hidden="true">404</p>
          <div className="nf-cols">
            <section>
              <h1 className="nf-title">{UI.bs.notFound}</h1>
              <p>{UI.bs.notFoundText}</p>
              <a className="link-line" href="/">{UI.bs.toHome}</a>
            </section>
            <section lang="en">
              <h2 className="nf-title">{UI.en.notFound}</h2>
              <p>{UI.en.notFoundText}</p>
              <a className="link-line" href="/en">{UI.en.toHome}</a>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
