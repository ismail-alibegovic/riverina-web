'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, FreeMode, Keyboard } from 'swiper/modules';
import 'swiper/css';
import type { TypeCard } from './Types';
import { Stepped } from './Editorial';

type Labels = { group: string; all: string; view: string; filterAll: string; prev: string; next: string };

/** the head grid's width (elicyon.css .er-head max-width) and side padding: the first card lines up with the heading */
const GRID = 1376, PAD_DESK = 32, PAD_PHONE = 20;

/**
 * The apartment collection as a card carousel: a stepped heading with short copy and the arrows beside it, a quiet
 * bedroom filter, then one card per apartment type running off the right edge of the screen. Each card shows the
 * type's 3D plan printed on the paper, its name and area, bedrooms, outdoor space, floors, how many apartments share
 * it and the live availability (prices only when the CMS shows them), and opens that type in the apartment finder.
 * Drag with momentum and soft edges (Swiper), arrows, keyboard; a thin progress rule shows where you are.
 */
export default function Residences({ cards, heading, text, note, labels, bedsMany, allHref }: { cards: TypeCard[]; heading: string; text: string; note: string; labels: Labels; bedsMany: string; allHref: string }) {
  const groups = useMemo(() => [
    { key: 'all', label: labels.filterAll, test: () => true },
    ...[1, 2, 3].map((b) => {
      const own = cards.filter((c) => (b === 3 ? c.bedrooms >= 3 : c.bedrooms === b));
      return { key: String(b), label: b === 3 ? bedsMany : own[0]?.bedLabel || '', test: (c: TypeCard) => (b === 3 ? c.bedrooms >= 3 : c.bedrooms === b), n: own.length };
    }).filter((g) => g.n),
  ], [cards, bedsMany, labels.filterAll]);
  const [group, setGroup] = useState('all');
  const shown = cards.filter((groups.find((g) => g.key === group) || groups[0]).test);

  const api = useRef<SwiperType | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [bar, setBar] = useState({ w: 100, x: 0 });

  /** first card on the heading's left edge, the last one ending on its right edge */
  const align = (s: SwiperType) => {
    const vw = window.innerWidth, pad = vw < 768 ? PAD_PHONE : PAD_DESK;
    const off = Math.max(pad, (vw - GRID) / 2);
    s.params.slidesOffsetBefore = off;
    s.params.slidesOffsetAfter = off;
    s.update();
  };
  const track = (s: SwiperType) => {
    setEdge({ start: s.isBeginning, end: s.isEnd });
    // virtualSize (the rail's full length) is set by Swiper at runtime but missing from its types
    const total = (s as SwiperType & { virtualSize?: number }).virtualSize || 0;
    const w = total > 0 ? Math.min(100, (s.width / total) * 100) : 100;
    setBar({ w, x: Math.max(0, Math.min(1, s.progress)) * (100 - w) });
  };

  useEffect(() => {
    const s = api.current;
    if (!s) return;
    s.slideTo(0, 0);
    s.update();
    track(s);
  }, [group]);

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="tipovi" className="er" aria-labelledby="er-title">
      <div className="er-head">
        <Stepped id="er-title" text={heading} />
        <div className="er-aside" data-ed="fade">
          {text && <p className="er-text">{text}</p>}
          <div className="er-nav">
            <button type="button" className="er-arrow" aria-label={labels.prev} disabled={edge.start} onClick={() => api.current?.slidePrev()}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            </button>
            <button type="button" className="er-arrow" aria-label={labels.next} disabled={edge.end} onClick={() => api.current?.slideNext()}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="er-filter" role="group" aria-label={labels.group}>
        {groups.map((g) => (
          <button key={g.key} type="button" className={'er-chip' + (group === g.key ? ' is-on' : '')} aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>{g.label}</button>
        ))}
      </div>

      <Swiper
        className="er-rail"
        modules={[A11y, FreeMode, Keyboard]}
        slidesPerView="auto"
        spaceBetween={24}
        speed={reduce ? 0 : 650}
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6, sticky: false }}
        breakpoints={{ 768: { freeMode: { enabled: false }, spaceBetween: 28 } }}
        a11y={{ prevSlideMessage: labels.prev, nextSlideMessage: labels.next, slideLabelMessage: '{{index}} / {{slidesLength}}' }}
        onSwiper={(s) => { api.current = s; align(s); track(s); }}
        onResize={(s) => { align(s); track(s); }}
        onProgress={track}
        onSlideChange={track}
      >
        {shown.map((c) => (
          <SwiperSlide key={c.id} className="er-slide">
            <a className={'er-card' + (c.soldOut ? ' is-sold' : '')} href={c.href}>
              <span className="er-cplan">
                <Image src={c.plan3d || c.plan} alt={c.planAlt} fill sizes="(min-width: 1024px) 400px, 82vw" quality={80} />
                {c.avail && <span className="er-status">{c.avail}</span>}
              </span>
              <span className="er-cbody">
                <span className="er-cname"><b>{c.name}</b><i>{c.area}</i></span>
                <span className="er-specs">
                  <span>{c.bedLabel}</span>
                  <span>{c.outdoor}</span>
                  <span>{c.floors}</span>
                  <span>{c.units}</span>
                </span>
                {c.price && <span className="er-price">{c.price}</span>}
                <span className="er-go">{labels.view}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
              </span>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="er-foot">
        <span className="er-progress" aria-hidden="true"><i style={{ width: `${bar.w}%`, transform: `translateX(${(bar.x / bar.w) * 100}%)` }} /></span>
        <div className="er-foot-row">
          <a className="er-all" href={allHref}><span>{labels.all}</span></a>
          {note && <p className="er-note">{note}</p>}
        </div>
      </div>
    </section>
  );
}
