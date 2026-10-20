'use client';
import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow, Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import Lightbox, { type LightboxLabels } from './Lightbox';

export type CoverImage = { src: string; alt: string; caption: string; group: string };

/**
 * Gallery page: a coverflow carousel (Swiper) of all renders, filtered by group. The centre picture sits in the
 * same coloured mat as the interiors carousel on the home page; its caption and number are below it.
 * Clicking the centre picture opens the full, uncropped render in the lightbox.
 */
export default function Coverflow({ images, groups, labels, tag }: { images: CoverImage[]; groups: { key: string; label: string }[]; labels: LightboxLabels & { all: string; open: string }; tag?: string }) {
  const [group, setGroup] = useState('');
  // start on the third picture so both sides of the centre are filled
  const [cur, setCur] = useState(Math.min(2, images.length - 1));
  const [box, setBox] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const list = useMemo(() => (group ? images.filter((im) => im.group === group) : images), [images, group]);
  const shown = groups.filter((g) => images.some((im) => im.group === g.key));
  const pad = (n: number) => String(n).padStart(2, '0');
  const it = list[cur];
  const start = useMemo(() => Math.min(2, list.length - 1), [list]);

  return (
    <div className="cf">
      {shown.length > 1 && (
        <div className="cf-filter" role="group" aria-label={labels.all}>
          {[{ key: '', label: labels.all }, ...shown].map((g) => (
            <button key={g.key || 'all'} type="button" className={'cf-chip' + (g.key === group ? ' is-on' : '')} aria-pressed={g.key === group} onClick={() => { setGroup(g.key); setCur(Math.min(2, (g.key ? images.filter((im) => im.group === g.key).length : images.length) - 1)); }}>
              {g.label}<sup>{pad(g.key ? images.filter((im) => im.group === g.key).length : images.length)}</sup>
            </button>
          ))}
        </div>
      )}
      <Swiper
        key={group}
        className="cf-swiper"
        modules={[EffectCoverflow, Pagination, Keyboard, A11y]}
        effect="coverflow"
        centeredSlides
        slidesPerView="auto"
        grabCursor
        keyboard={{ enabled: true }}
        speed={900}
        initialSlide={start}
        coverflowEffect={{ rotate: 34, stretch: 0, depth: 160, modifier: 1, slideShadows: false }}
        pagination={{ clickable: true }}
        a11y={{ prevSlideMessage: labels.prev, nextSlideMessage: labels.next }}
        onSlideChange={(s) => setCur(s.activeIndex)}
      >
        {list.map((im, i) => (
          <SwiperSlide key={im.src} className="cf-slide">
            <button
              type="button"
              className="cf-frame"
              aria-label={`${im.caption || im.alt} (${i + 1} / ${list.length})`}
              onClick={(e) => { if (i !== cur) return; opener.current = e.currentTarget; setBox(i); }}
            >
              <span className="cf-img"><Image src={im.src} alt="" fill sizes="(min-width: 900px) 34vw, 78vw" quality={80} draggable={false} /></span>
              {i === cur && <span className="cf-open" aria-hidden="true">{labels.open}</span>}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="cf-info" aria-live="polite">
        <p className="cf-count" aria-hidden="true">{pad(cur + 1)} / {pad(list.length)}</p>
        {it?.caption && <p className="label cf-title" key={it.src}>{it.caption}</p>}
        {tag && <p className="cf-tag">{tag}</p>}
      </div>
      <Lightbox images={list} index={box} onChange={(x) => { setBox(x); if (x === null) opener.current?.focus({ preventScroll: true }); }} labels={labels} tag={tag} />
    </div>
  );
}
