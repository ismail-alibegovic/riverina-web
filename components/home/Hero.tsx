import { Lang, Page, tx } from '@/lib/content';
import { href } from '@/lib/i18n';
import { Fill, Rich } from './text';

export type HeroFact = { label: string; value: string };

/**
 * Opening frame: Riverina 1 full-bleed, with a deep navy fall-off at the bottom where all the text sits, so nothing
 * is set over the busy middle of the render. The name runs large at the bottom left, the intro and the way into
 * the apartments on the right, and the three first facts close the frame in one hairline row.
 */
export default function Hero({ hero, lang, name, tag, facts }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string; facts: HeroFact[] }) {
  const raw = tx(hero.title, lang) || name;
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const eyebrow = tx(hero.eyebrow, lang);
  const sub = tx(hero.subtitle, lang);
  const cta2 = tx(hero.cta2, lang);
  return (
    <section className="hx" aria-labelledby="hero-title">
      <div className="hx-media">
        <Fill src={hero.image} sizes="100vw" priority quality={85} className="hx-img" />
      </div>
      <div className="hx-shade" aria-hidden="true" />
      {tag && <span className="ill-tag hx-tag">{tag}</span>}
      <div className="wrap wrap-wide hx-inner">
        <div className="hx-head">
          <div className="hx-name">
            {eyebrow && <p className="label hx-eyebrow">{eyebrow}</p>}
            <h1 id="hero-title" className="hx-title">
              {lines.map((l, i) => (
                <span className="hx-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
              ))}
            </h1>
          </div>
          <div className="hx-intro">
            {sub && <p className="hx-sub">{sub}</p>}
            <div className="hx-ctas">
              <a className="btn btn-light hx-cta" href={href('apartments', lang)} data-magnetic>{tx(hero.cta, lang)}<span aria-hidden="true" className="arr">→</span></a>
              {cta2 && <a className="link-line hx-cta2" href="#kontakt">{cta2}</a>}
            </div>
          </div>
        </div>
        {facts.length > 0 && (
          <dl className="hx-facts" aria-label={name}>
            {facts.map((f) => (
              <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
