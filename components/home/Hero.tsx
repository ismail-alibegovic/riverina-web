import { Lang, Page, tx } from '@/lib/content';
import { href } from '@/lib/i18n';
import { Fill, Rich } from './text';

export default function Hero({ hero, lang, name }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string }) {
  const raw = tx(hero.title, lang) || name;
  // One-line titles of up to three words are stepped word by word, like a multi-line title.
  const lines = raw.includes('\n') ? raw.split('\n') : raw.trim().split(/\s+/).length <= 3 ? raw.trim().split(/\s+/) : [raw];
  const cta2 = tx(hero.cta2, lang);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <Fill src={hero.image} sizes="100vw" priority className="hero-img" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap wrap-wide hero-inner">
        {tx(hero.eyebrow, lang) && <p className="label hero-eyebrow">{tx(hero.eyebrow, lang)}</p>}
        <h1 id="hero-title" className="hero-title">
          {lines.filter((l) => l.trim()).map((l, i) => (
            <span className="hero-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l.trim()} /></span></span>
          ))}
        </h1>
        <div className="hero-foot">
          {tx(hero.subtitle, lang) && <p className="hero-sub">{tx(hero.subtitle, lang)}</p>}
          <div className="hero-ctas">
            <a className="btn btn-light" href={href('apartments', lang)}>{tx(hero.cta, lang)}</a>
            {cta2 && <a className="link-line" href="#kontakt">{cta2}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
