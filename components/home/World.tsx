import { Lang, Page, tx, resolveLink } from '@/lib/content';
import { Fill, Heading } from './text';

/** Three cards leading to the inner pages, under a stepped heading with a short intro and one link (Elicyon "The world of"). */
export default function World({ world, lang, cta, more }: { world: NonNullable<Page['world']>; lang: Lang; cta: { href: string; label: string }; more: string }) {
  const items = (world.items || []).filter((it) => tx(it.title, lang) && it.link);
  return (
    <section className="section world">
      <div className="wrap wrap-wide">
        <Heading text={tx(world.title, lang)} className="world-title" />
        <div className="world-head" data-reveal="up">
          {tx(world.text, lang) && <p className="world-intro">{tx(world.text, lang)}</p>}
          <a className="link-line" href={cta.href}>{cta.label}</a>
        </div>
        <ul className="world-grid">
          {items.map((it, i) => (
            <li key={i} className="world-card" data-reveal="up" style={{ '--i': i } as React.CSSProperties}>
              <a href={resolveLink(it.link, lang)}>
                <span className="world-img" data-reveal="clip"><Fill src={it.image} alt="" sizes="(min-width: 900px) 30vw, 90vw" /></span>
                {tx(it.label, lang) && <span className="label world-label">{tx(it.label, lang)}</span>}
                <span className="world-name">{tx(it.title, lang)}</span>
                {tx(it.text, lang) && <span className="world-text">{tx(it.text, lang)}</span>}
                <span className="link-line world-more">{tx(it.link_label, lang) || more}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
