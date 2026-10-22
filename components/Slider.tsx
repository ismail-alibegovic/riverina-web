'use client';
import { Children, ReactNode, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType, SwiperOptions } from 'swiper/types';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';

type Props = {
  children: ReactNode;
  labels: { prev: string; next: string };
  /** cards: three across inside the page grid (two on tablets, one and a peek on phones); feature: one large centred
   *  picture with its neighbours dimmed at the sides */
  variant?: 'cards' | 'feature';
  /** remounts the track (e.g. when a filter changes the slides) */
  resetKey?: string;
  initial?: number;
  onChange?: (index: number) => void;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The site's one slider. Slides stay inside the centred page grid, move with one slow, even ease and can be dragged;
 * under them a single control row: the position in the display serif (01 / 07), a hairline that fills as you go,
 * and two square arrows. Keyboard arrows work while it is on screen; reduced motion jumps instead of gliding.
 */
export default function Slider({ children, labels, variant = 'cards', resetKey, initial = 0, onChange, className = '' }: Props) {
  const api = useRef<SwiperType | null>(null);
  const [pos, setPos] = useState({ i: 0, n: 1, start: true, end: false });
  const sync = (s: SwiperType) => {
    const n = Math.max(1, s.snapGrid.length);
    setPos({ i: Math.min(n - 1, s.snapIndex), n, start: s.isBeginning, end: s.isEnd });
    onChange?.(s.activeIndex);
  };
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layout: SwiperOptions = variant === 'feature'
    ? { slidesPerView: 1.18, centeredSlides: true, slideToClickedSlide: true, spaceBetween: 14, breakpoints: { 768: { slidesPerView: 1.6, spaceBetween: 28 }, 1200: { slidesPerView: 1.9, spaceBetween: 40 } } }
    : { slidesPerView: 1.12, spaceBetween: 16, breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1100: { slidesPerView: 3, spaceBetween: 28 } } };

  return (
    <div className={`sl sl-${variant} ${className}`.trim()}>
      <Swiper
        key={resetKey}
        className="sl-track"
        modules={[A11y, Keyboard]}
        {...layout}
        initialSlide={initial}
        speed={reduce ? 0 : 900}
        grabCursor
        threshold={6}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ prevSlideMessage: labels.prev, nextSlideMessage: labels.next, slideLabelMessage: '{{index}} / {{slidesLength}}' }}
        onSwiper={(s) => { api.current = s; sync(s); }}
        onSlideChange={sync}
        onResize={sync}
        onSnapGridLengthChange={sync}
      >
        {Children.toArray(children).map((c, k) => <SwiperSlide key={k} className="sl-slide">{c}</SwiperSlide>)}
      </Swiper>
      <div className="sl-nav">
        <p className="sl-count" aria-hidden="true"><b>{pad(pos.i + 1)}</b><span>/ {pad(pos.n)}</span></p>
        <span className="sl-bar" aria-hidden="true"><i style={{ transform: `scaleX(${(pos.i + 1) / pos.n})` }} /></span>
        <div className="sl-arrows">
          <button type="button" className="sl-arrow" aria-label={labels.prev} disabled={pos.start} onClick={() => api.current?.slidePrev()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
          </button>
          <button type="button" className="sl-arrow" aria-label={labels.next} disabled={pos.end} onClick={() => api.current?.slideNext()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
