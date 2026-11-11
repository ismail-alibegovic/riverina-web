import { Lang, Page, tx } from '@/lib/content';
import { href } from '@/lib/i18n';
import { Fill, Rich } from './text';

export type HeroFact = { label: string; value: string };

/**
 * Opening frame: Riverina 1 full-bleed under an open evening sky. The name runs across the full width in the sky
 * above the building (sans + italic serif), one line of introduction below it, and a frosted card in the bottom
 * corner holds the first facts and the way into the apartments. The picture is not darkened.
 *
 * The render's sky was extended upwards (riverina-1-nebo.webp) so the name has clear sky to sit on and the
 * picture is shown at a scale where it stays sharp on phones.
 */
export default function Hero({ hero, lang, name, tag, facts }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string; facts: HeroFact[] }) {
  const raw = tx(hero.title, lang) || name;
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const sub = tx(hero.subtitle, lang);
  const eyebrow = tx(hero.eyebrow, lang);
  const all = eyebrow ? [{ label: lang === 'en' ? 'Location' : 'Lokacija', value: eyebrow }, ...facts] : facts;
  return (
    <section className="hx" aria-labelledby="hero-title">
      <div className="hx-media">
        <Fill src={hero.image} sizes="100vw" priority quality={85} className="hx-img" />
      </div>
      <div className="hx-shade" aria-hidden="true" />
      <div className="wrap wrap-wide hx-inner">
        <div className="hx-head">
          <h1 id="hero-title" className="hx-title">
            {lines.map((l, i) => (
              <span className="hx-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
            ))}
          </h1>
          {sub && <p className="hx-sub">{sub}</p>}
        </div>
        <aside className="hx-card" aria-label={name}>
          {all.length > 0 && (
            <dl>
              {all.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          )}
          <a className="hx-cta" href={href('apartments', lang)} data-magnetic>{tx(hero.cta, lang)}<span aria-hidden="true" className="arr">→</span></a>
        </aside>
      </div>
      {tag && <span className="ill-tag hx-tag">{tag}</span>}
    </section>
  );
}
