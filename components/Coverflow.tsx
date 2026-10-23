'use client';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from './Slider';
import Lightbox, { type LightboxLabels } from './Lightbox';

export type CoverImage = { src: string; alt: string; caption: string; group: string };

/**
 * Gallery page: every render on the site's one slider (feature form: the centre picture large, its neighbours
 * stepped back), filtered by group with underlined tabs. The caption sits under the slider; clicking the centre
 * picture opens the full, uncropped render in the lightbox, clicking a neighbour brings it to the centre.
 */
export default function Coverflow({ images, groups, labels, tag }: { images: CoverImage[]; groups: { key: string; label: string }[]; labels: LightboxLabels & { all: string; open: string }; tag?: string }) {
  const [group, setGroup] = useState('');
  const [cur, setCur] = useState(0);
  const [box, setBox] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const list = useMemo(() => (group ? images.filter((im) => im.group === group) : images), [images, group]);
  const shown = groups.filter((g) => images.some((im) => im.group === g.key));
  const pad = (n: number) => String(n).padStart(2, '0');
  const it = list[cur];

  return (
    <div className="cf">
      {shown.length > 1 && (
        <div className="cf-filter" role="group" aria-label={labels.all}>
          {[{ key: '', label: labels.all }, ...shown].map((g) => (
            <button key={g.key || 'all'} type="button" className={'cf-chip' + (g.key === group ? ' is-on' : '')} aria-pressed={g.key === group} onClick={() => { setGroup(g.key); setCur(0); }}>
              {g.label}<sup>{pad(g.key ? images.filter((im) => im.group === g.key).length : images.length)}</sup>
            </button>
          ))}
        </div>
      )}
      <div className="cf-in">
        <Slider variant="feature" resetKey={group} labels={{ prev: labels.prev, next: labels.next }} onChange={setCur}>
          {list.map((im, i) => (
            <button
              key={im.src}
              type="button"
              className="cf-frame"
              aria-label={`${im.caption || im.alt} (${i + 1} / ${list.length})`}
              onClick={(e) => { if (i !== cur) return; opener.current = e.currentTarget; setBox(i); }}
            >
              <span className="cf-img"><Image src={im.src} alt="" fill sizes="(min-width: 1200px) 52vw, (min-width: 768px) 62vw, 84vw" quality={82} draggable={false} /></span>
              {i === cur && <span className="cf-open" aria-hidden="true">{labels.open}</span>}
            </button>
          ))}
        </Slider>
        <div className="cf-info" aria-live="polite">
          {it?.caption && <p className="cf-title" key={it.src}>{it.caption}</p>}
          {tag && <p className="cf-tag">{tag}</p>}
        </div>
      </div>
      <Lightbox images={list} index={box} onChange={(x) => { setBox(x); if (x === null) opener.current?.focus({ preventScroll: true }); }} labels={labels} tag={tag} />
    </div>
  );
}
