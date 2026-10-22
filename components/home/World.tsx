import Image from 'next/image';
import { Lang, Page, tx, resolveLink, mediaUrl } from '@/lib/content';
import { Stepped } from './Editorial';

/**
 * After Elicyon's "The world of": a stepped heading with short copy at the top left and one link at the right, then
 * three large cards leading to the inner pages, each a tall picture (three different heights) with a small label,
 * the name in the display serif, a line of text and a link. Pictures open from below and drift slowly.
 */
export default function World({ world, lang, cta, more }: { world: NonNullable<Page['world']>; lang: Lang; cta: { href: string; label: string }; more: string }) {
  const items = (world.items || []).filter((it) => tx(it.title, lang) && it.link);
  return (
    <section className="ew" aria-labelledby="ew-title">
      <div className="ew-grid">
        <div className="ew-head">
          <Stepped id="ew-title" text={tx(world.title, lang)} />
          {tx(world.text, lang) && <p className="ew-text" data-ed="fade">{tx(world.text, lang)}</p>}
        </div>
        <a className="ew-link" href={cta.href} data-ed="fade"><span>{cta.label}</span></a>
        <ul className="ew-cards">
          {items.slice(0, 3).map((it, i) => (
            <li key={i} className={`ew-card ew-card-${i + 1}`}>
              <a href={resolveLink(it.link, lang)}>
                <span className="ew-pic" data-ed="frame">
                  <span className="ew-pic-in" data-ed="parallax">{it.image && <Image src={mediaUrl(it.image)} alt="" fill sizes="(min-width: 900px) 30vw, 90vw" quality={80} />}</span>
                </span>
                {tx(it.label, lang) && <span className="ew-label">{tx(it.label, lang)}</span>}
                <span className="ew-name">{tx(it.title, lang)}</span>
                {tx(it.text, lang) && <span className="ew-line">{tx(it.text, lang)}</span>}
                <span className="ew-more"><span>{tx(it.link_label, lang) || more}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
