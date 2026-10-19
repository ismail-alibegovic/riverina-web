import { Lang, Page, tx } from '@/lib/content';
import { href } from '@/lib/i18n';
import { Fill, Heading } from './text';

/** Full-screen render with one closing statement and the way into the apartments, just before the enquiry form. */
export default function Statement({ st, lang, tag, cta }: { st: NonNullable<Page['statement']>; lang: Lang; tag?: string; cta: string }) {
  return (
    <section className="stm" aria-labelledby="stm-title">
      <div className="stm-media" data-parallax="10"><Fill src={st.image} alt="" sizes="100vw" quality={72} /></div>
      <div className="stm-shade" aria-hidden="true" />
      {tag && <span className="ill-tag">{tag}</span>}
      <div className="wrap stm-inner">
        {tx(st.eyebrow, lang) && <p className="label stm-eyebrow" data-reveal="up">{tx(st.eyebrow, lang)}</p>}
        <div id="stm-title"><Heading text={tx(st.title, lang)} className="is-center" /></div>
        {tx(st.text, lang) && <p className="stm-text" data-reveal="up">{tx(st.text, lang)}</p>}
        <div className="stm-ctas" data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}>
          <a className="btn btn-light" href={href('apartments', lang)} data-magnetic>{tx(st.cta, lang) || cta}</a>
          {tx(st.cta2, lang) && <a className="link-line" href="#kontakt">{tx(st.cta2, lang)}</a>}
        </div>
      </div>
    </section>
  );
}
