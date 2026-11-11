import { Lang, Page, tx, mediaUrl } from '@/lib/content';
import { Fill, Rich, Paras } from './text';

/**
 * Living: a large headline with small pictures set between its words (the entrance, the greenery, a room with a
 * view), the short text under it, then the neighbourhood by the river as a wide panorama.
 */
export default function Vision({ vision, lang, tag }: { vision: NonNullable<Page['vision']>; lang: Lang; tag?: string }) {
  const lines = tx(vision.title, lang).split('\n').map((l) => l.trim()).filter(Boolean);
  const pics = (vision.images || []).filter((i) => i.path).map((i) => mediaUrl(i.path));
  // where the small pictures go: after the first word of the first line, then before and after the last line
  const at = (line: number, pos: 'after-first' | 'start' | 'end') => {
    const slot = line === 0 && pos === 'after-first' ? 0 : line === lines.length - 1 && pos === 'start' ? 1 : line === lines.length - 1 && pos === 'end' ? 2 : -1;
    return slot >= 0 && pics[slot] ? <span className="lv-pic" aria-hidden="true" style={{ '--i': slot } as React.CSSProperties}><Fill src={pics[slot]} sizes="180px" /></span> : null;
  };
  return (
    <section id="projekat" className="section lv" aria-labelledby="lv-title">
      <div className="wrap wrap-wide">
        <h2 id="lv-title" className="lv-title" data-reveal="up">
          {lines.map((l, i) => {
            const [first, ...rest] = l.split(' ');
            return (
              <span className="lv-line" key={i}>
                {lines.length > 1 && i === lines.length - 1 && at(i, 'start')}
                {i === 0 && rest.length ? <><Rich text={first} /> {at(0, 'after-first')} <Rich text={rest.join(' ')} /></> : <Rich text={l} />}
                {lines.length > 1 && i === lines.length - 1 && at(i, 'end')}
              </span>
            );
          })}
        </h2>
        <div data-reveal="up" style={{ '--i': 1 } as React.CSSProperties}><Paras className="lv-text" text={tx(vision.text, lang)} /></div>
      </div>
      {vision.image && (
        <div className="lv-pano" data-reveal="clip">
          <div className="lv-pano-in" data-parallax="8"><Fill src={vision.image} sizes="100vw" quality={78} /></div>
          {tag && <span className="ill-tag">{tag}</span>}
        </div>
      )}
    </section>
  );
}
