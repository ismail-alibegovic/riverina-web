import Image from 'next/image';
import { Rich, Paras } from './text';
import InvestorLogo from './InvestorLogo';

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
 * Developer, after Elicyon's "Leading the vision", on an ivory ground with no picture behind it. Left: the developer's
 * logo built up band by band as it scrolls in, the stepped heading, the confirmed line about its role, the CMS text
 * (a placeholder until it is filled in) and the link. Right: three renders of the project in a stepped collage, each
 * drifting slowly at its own pace, with the illustration note.
 */
export function Investor({ title, text, placeholder, role, logo, images, link, tag }: { title: string; text: string; placeholder: string; role: string; logo?: string; images: { src: string; alt: string }[]; link: { href: string; label: string }; tag?: string }) {
  const name = title.replace(/\*/g, '').replace(/\n/g, ' ');
  return (
    <section id="investitor" className="ei" aria-labelledby="ei-title">
      <div className="ei-grid">
        <div className="ei-copy">
          {logo && <InvestorLogo src={logo} alt={name} />}
          <Stepped id="ei-title" text={title} className="ei-heading" />
          <p className="ei-role" data-ed="fade">{role}</p>
          <div className="ei-body" data-ed="fade">
            <Paras className="ei-text" text={text || placeholder} />
            <a className="ei-link" href={link.href}><span>{link.label}</span></a>
          </div>
        </div>
        <div className="ei-pics">
          {images.slice(0, 3).map((im, i) => (
            <figure key={im.src} className={`ei-pic ei-pic-${i + 1}`} data-ed="frame">
              <div className="ei-pic-in" data-ed="parallax"><Image src={im.src} alt={im.alt} fill sizes={i === 0 ? '(min-width: 1024px) 34vw, 80vw' : '(min-width: 1024px) 22vw, 50vw'} quality={78} /></div>
            </figure>
          ))}
          {tag && <span className="ei-tag">{tag}</span>}
        </div>
      </div>
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
        <Stepped id="el-title" text={title} />
        <div className="el-aside" data-ed="fade">
          {text && <Paras className="el-text" text={text} />}
          <a className="el-link" href={link.href}><span>{link.label}</span></a>
        </div>
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
