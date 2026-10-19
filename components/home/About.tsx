import { Lang, Page, tx, plain, unitFacts } from '@/lib/content';
import { Fill, Heading, Paras } from './text';

/**
 * Editorial opening of the project: the heading with one large statement (the first paragraph), a wide picture of
 * the building with a smaller interior overlapping it (the two drift at different speeds), and the key figures.
 */
export default function About({ about, units, lang, index, tag }: { about: NonNullable<Page['about']>; units: any[]; lang: Lang; index?: number; tag?: string }) {
  const own = (about.facts || []).filter((f) => tx(f.value, lang)).map((f) => ({ value: tx(f.value, lang), label: tx(f.label, lang) }));
  const facts = own.length ? own : about.auto_facts !== false ? unitFacts(units, lang) : [];
  const paras = tx(about.text, lang).replace(/\[\[TBD:[^\]]*\]\]/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const [lead, ...rest] = paras;
  return (
    <section id="projekat" className="section about">
      <div className="wrap about-top">
        <div>
          {tx(about.eyebrow, lang) && <p className="eyebrow">{tx(about.eyebrow, lang)}</p>}
          <Heading text={tx(about.title, lang)} index={index} />
        </div>
        {lead && <p className="about-lead" data-reveal="up">{lead}</p>}
      </div>
      {(about.image || about.image2) && (
        <div className="wrap wrap-wide about-stage">
          {about.image && <figure className="about-a" data-reveal="clip" data-parallax="6"><Fill src={about.image} alt={plain(about.title, lang)} sizes="(min-width: 900px) 64vw, 100vw" />{tag && <span className="ill-tag">{tag}</span>}</figure>}
          {about.image2 && <figure className="about-b" data-reveal="clip" data-parallax="7" style={{ '--i': 2 } as React.CSSProperties}><Fill src={about.image2} alt="" sizes="(min-width: 900px) 40vw, 84vw" /></figure>}
          {rest.length > 0 && <div className="about-more" data-reveal="up"><Paras className="prose" text={rest.join('\n\n')} /></div>}
        </div>
      )}
      {facts.length > 0 && (
        <dl className="wrap about-facts">
          {facts.map((f, i) => (
            <div className="fact" key={i} data-reveal="up" style={{ '--i': i } as React.CSSProperties}>
              <dt className="fact-l">{f.label}</dt>
              <dd className="fact-v"><span aria-hidden="true" data-count>{f.value}</span><span className="sr-only">{f.value}</span></dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
