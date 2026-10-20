import { Lang, Page, tx, plain } from '@/lib/content';
import { Fill, Heading, Paras } from './text';

/**
 * After the hero: a dimmed full-screen render, a centred stepped heading, one portrait image and a short text
 * in a narrow column (Elicyon "Leading the vision").
 */
export default function Vision({ vision, lang, tag }: { vision: NonNullable<Page['vision']>; lang: Lang; tag?: string }) {
  const title = tx(vision.title, lang);
  return (
    <section id="projekat" className="vis" aria-label={plain(title, lang)}>
      {vision.image && <div className="vis-bg" data-parallax="10"><Fill src={vision.image} sizes="100vw" quality={70} /></div>}
      <div className="vis-shade" aria-hidden="true" />
      {tag && <span className="ill-tag">{tag}</span>}
      <div className="vis-col">
        <Heading text={title} className="vis-title" />
        {vision.image2 && <figure className="vis-img" data-reveal="clip"><Fill src={vision.image2} alt="" sizes="(min-width: 900px) 30vw, 80vw" /></figure>}
        <div data-reveal="up"><Paras className="vis-text" text={tx(vision.text, lang)} /></div>
      </div>
    </section>
  );
}
