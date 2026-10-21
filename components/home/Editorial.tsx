import Image from 'next/image';
import { Rich, Paras } from './text';

/** Two-line stepped heading as on Elicyon: each line rises from a mask, then the second line slides to its indent. */
export function Stepped({ text, id, className = '', as: Tag = 'h2' }: { text: string; id?: string; className?: string; as?: 'h2' | 'h3' }) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <Tag id={id} className={'ed-heading ' + className} data-ed="heading">
      {lines.map((l, i) => <span key={i} className="ed-hl"><span className="ed-hl-in"><Rich text={l} /></span></span>)}
    </Tag>
  );
}

/**
 * Developer, after Elicyon's "Leading the vision": a full-screen picture (slow parallax) with a framed plate at its
 * centre and the heading stepped across the plate's top edge. The plate carries the developer's logo; only the
 * confirmed line about its role is shown (the CMS text appears once it is filled in).
 */
export function Investor({ title, text, role, logo, image, link, tag }: { title: string; text: string; role: string; logo?: string; image: string; link: { href: string; label: string }; tag?: string }) {
  return (
    <section id="investitor" className="ei" aria-labelledby="ei-title">
      <div className="ei-bg" data-ed="parallax" aria-hidden="true"><Image src={image} alt="" fill sizes="100vw" quality={72} /></div>
      <div className="ei-shade" aria-hidden="true" />
      <div className="ei-inner">
        <Stepped id="ei-title" text={title} className="ei-heading" />
        <div className="ei-plate" data-ed="frame">
          {logo && <div className="ei-logo"><Image src={logo} alt={title.replace(/\*/g, '').replace(/\n/g, ' ')} fill sizes="240px" /></div>}
        </div>
        <div className="ei-copy" data-ed="fade">
          {text ? <Paras className="ei-text" text={text} /> : <p className="ei-text">{role}</p>}
          <a className="eh-cta" href={link.href}><span>{link.label}</span></a>
        </div>
      </div>
      {tag && <span className="ec-tag">{tag}</span>}
    </section>
  );
}

/**
 * Location, in the place of Elicyon's journal: a stepped heading with a short confirmed text on the left, the link on
 * the right, and one wide plate below: the project's navy and gold map of Sarajevo with Ilidža marked. No distances or
 * places are shown until they are confirmed.
 */
export function Location({ title, text, map, alt, link }: { title: string; text: string; map: string; alt: string; link: { href: string; label: string } }) {
  return (
    <section id="lokacija" className="el" aria-labelledby="el-title">
      <div className="el-head">
        <div>
          <Stepped id="el-title" text={title} />
          {text && <div data-ed="fade"><Paras className="el-text" text={text} /></div>}
        </div>
        <a className="el-link" href={link.href} data-ed="fade"><span>{link.label}</span></a>
      </div>
      <figure className="el-map" data-ed="frame">
        <div className="el-map-in" data-ed="parallax"><Image src={map} alt={alt} fill sizes="(min-width: 1024px) 92vw, 100vw" quality={84} /></div>
      </figure>
    </section>
  );
}

/**
 * Closing frame, after Elicyon's "Get in touch": a full-screen picture inside a thick ivory border (a passe-partout).
 * The two text lines sit on the border, the invitation in the open window; hovering the invitation thins the border,
 * so the window widens.
 */
export function ContactFrame({ top, bottom, image, cta, tag }: { top: string; bottom: string; image: string; cta: { href: string; label: string }; tag?: string }) {
  return (
    <section className="ef" aria-label={top.replace(/\*/g, '').replace(/\n/g, ' ')}>
      <div className="ef-bg" data-ed="parallax" aria-hidden="true"><Image src={image} alt="" fill sizes="100vw" quality={78} /></div>
      <div className="ef-veil" aria-hidden="true" />
      <div className="ef-frame">
        <Stepped text={top} className="ef-top" as="h2" />
        <a className="ef-cta" href={cta.href}><span>{cta.label}</span></a>
        <Stepped text={bottom} className="ef-bottom" as="h3" />
        <div className="ef-border" aria-hidden="true" />
      </div>
      {tag && <span className="ec-tag ef-tag">{tag}</span>}
    </section>
  );
}
