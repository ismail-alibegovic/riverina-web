import { Lang, Page, tx, plain, unitFacts } from '@/lib/content';
import { Fill, Heading, Paras } from './text';

export default function About({ about, units, lang }: { about: NonNullable<Page['about']>; units: any[]; lang: Lang }) {
  const own = (about.facts || []).filter((f) => tx(f.value, lang)).map((f) => ({ value: tx(f.value, lang), label: tx(f.label, lang) }));
  const facts = own.length ? own : about.auto_facts !== false ? unitFacts(units, lang) : [];
  return (
    <section id="projekat" className="section about">
      <div className="wrap about-grid">
        <div>
          {tx(about.eyebrow, lang) && <p className="eyebrow">{tx(about.eyebrow, lang)}</p>}
          <Heading text={tx(about.title, lang)} />
        </div>
        <div data-reveal="up"><Paras className="prose" text={tx(about.text, lang)} /></div>
      </div>
      {facts.length > 0 && (
        <dl className="wrap facts">
          {facts.map((f, i) => (
            <div className="fact" key={i} data-reveal="up" style={{ '--i': i } as React.CSSProperties}>
              <dt className="fact-l">{f.label}</dt>
              <dd className="fact-v">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {about.image && (
        <div className="wrap wrap-wide">
          <div className="about-img" data-reveal="clip"><Fill src={about.image} alt={plain(about.title, lang)} sizes="(min-width: 1520px) 1520px, 100vw" /></div>
        </div>
      )}
    </section>
  );
}
