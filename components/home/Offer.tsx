import Image from 'next/image';
import { Stepped } from './Editorial';

export type OfferItem = { title: string; src: string; href: string };

/**
 * After Elicyon's "Our services": a stepped heading with short copy at the top left, three portrait pictures in a
 * stepped row at the centre (the middle one lowest), each named over the picture and leading on, and a note with
 * one link at the bottom right. Every picture opens from below as it scrolls in and drifts slowly.
 */
export default function Offer({ title, text, note, cta, items }: { title: string; text: string; note: string; cta: { href: string; label: string }; items: OfferItem[] }) {
  return (
    <section className="eof" aria-labelledby="eof-title">
      <div className="eof-grid">
        <div className="eof-head">
          <Stepped id="eof-title" text={title} />
          {text && <p className="eof-text" data-ed="fade">{text}</p>}
        </div>
        <ul className="eof-row">
          {items.slice(0, 3).map((it, i) => (
            <li key={i} className={`eof-item eof-item-${i + 1}`}>
              <a href={it.href} className="eof-card">
                <span className="eof-pic" data-ed="frame">
                  <span className="eof-pic-in" data-ed="parallax"><Image src={it.src} alt="" fill sizes="(min-width: 1024px) 20vw, 60vw" quality={80} /></span>
                </span>
                <span className="eof-name">{it.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="eof-aside" data-ed="fade">
          {note && <p className="eof-note">{note}</p>}
          <a className="eof-link" href={cta.href}><span>{cta.label}</span></a>
        </div>
      </div>
    </section>
  );
}
