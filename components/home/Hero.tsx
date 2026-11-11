import { Lang, Page, tx } from '@/lib/content';
import { href } from '@/lib/i18n';
import { Fill, Rich } from './text';

export type HeroFact = { label: string; value: string };

/**
 * Opening frame: the place before the building. A full-bleed render, a short line of introduction at the top,
 * the name set across the width in two voices (light grotesque + italic serif), and a translucent card with the
 * three facts a visitor needs first, ending in the way into the apartments.
 */
export default function Hero({ hero, lang, name, tag, facts, meta }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string; facts: HeroFact[]; meta: string[] }) {
  const raw = tx(hero.title, lang) || name;
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const cta2 = tx(hero.cta2, lang);
  return (
    <section className="hx" aria-labelledby="hero-title">
      <div className="hx-media" data-parallax="6">
        <Fill src={hero.image} sizes="100vw" priority quality={74} className="hx-img" />
      </div>
      <div className="hx-shade" aria-hidden="true" />
      <div className="wrap wrap-wide hx-inner" data-parallax-out>
        <div className="hx-top">
          {tx(hero.eyebrow, lang) && <p className="label hx-eyebrow">{tx(hero.eyebrow, lang)}</p>}
          {tx(hero.subtitle, lang) && <p className="hx-sub">{tx(hero.subtitle, lang)}</p>}
        </div>
        <div className="hx-bottom">
          <h1 id="hero-title" className="hx-title">
            {lines.map((l, i) => (
              <span className="hx-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
            ))}
          </h1>
          <aside className="hx-card" aria-label={name}>
            <dl>
              {facts.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
            <a className="btn btn-light hx-cta" href={href('apartments', lang)} data-magnetic>{tx(hero.cta, lang)}<span aria-hidden="true" className="arr">→</span></a>
            {cta2 && <a className="link-line hx-cta2" href="#kontakt">{cta2}</a>}
          </aside>
        </div>
        <ul className="hx-meta" aria-hidden="true">
          {meta.map((m) => <li key={m}>{m}</li>)}
          {tag && <li>{tag}</li>}
        </ul>
      </div>
    </section>
  );
}
