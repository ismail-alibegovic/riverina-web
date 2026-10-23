import Image from 'next/image';
import { Lang, Page, tx, unitFacts, mediaUrl } from '@/lib/content';
import { Stepped } from './Editorial';

/**
 * The project in brief, right after the hero, in the same language as the apartment finder: a stepped heading, one
 * paragraph, the key figures large over hairlines (two by two) and the link to the apartments on the left; one tall
 * picture of the building on the right, opening from below and drifting slowly.
 */
export default function About({ about, units, lang, cta, tag }: { about: NonNullable<Page['about']>; units: any[]; lang: Lang; cta: { href: string; label: string }; tag?: string }) {
  const own = (about.facts || []).filter((f) => tx(f.value, lang)).map((f) => ({ value: tx(f.value, lang), label: tx(f.label, lang) }));
  const facts = (own.length ? own : about.auto_facts !== false ? unitFacts(units, lang) : []).slice(0, 4);
  const lead = tx(about.text, lang).replace(/\[\[TBD:[^\]]*\]\]/g, '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)[0];
  return (
    <section id="projekat" className="ea" aria-labelledby="ea-title">
      <div className="ea-grid">
        <div className="ea-copy">
          <Stepped id="ea-title" text={tx(about.title, lang)} />
          {lead && <p className="ea-lead" data-ed="fade">{lead}</p>}
          {facts.length > 0 && (
            <dl className="ea-facts" data-ed="fade">
              {facts.map((f, i) => (
                <div className="ea-fact" key={i}>
                  <dt>{f.label}</dt>
                  <dd>{f.value.replace('-', '–')}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="ea-link" href={cta.href} data-ed="fade"><span>{cta.label}</span></a>
        </div>
        {about.image && (
          <figure className="ea-pic" data-ed="frame">
            <span className="ea-pic-in" data-ed="parallax"><Image src={mediaUrl(about.image)} alt="" fill sizes="(min-width: 1024px) 46vw, 100vw" quality={80} /></span>
            {tag && <figcaption className="ea-tag">{tag}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}
