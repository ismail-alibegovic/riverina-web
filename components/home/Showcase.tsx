'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { whenNear } from '@/lib/motion';
import { Heading } from './text';

export type ShowcaseItem = { src: string; caption: string };

/**
 * A dark film strip of wide renders. On desktop the section holds still while scrolling moves the strip sideways;
 * inside each frame the picture travels the other way (depth), and the frame closest to the centre is the active
 * one (its number turns gold, the counter follows). On touch, with reduced motion or without JavaScript it is a
 * native swipe strip with scroll snap.
 */
export default function Showcase({ title, text, items, index, tag, label }: { title: string; text: string; items: ShowcaseItem[]; index?: number; tag?: string; label: string }) {
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const pad = (n: number) => String(n).padStart(2, '0');

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px) and (hover: hover)', () => {
          el.classList.add('is-pinned');
          const track = el.querySelector<HTMLElement>('.sc-track')!;
          const rail = el.querySelector<HTMLElement>('.sc-rail')!;
          const frames = gsap.utils.toArray<HTMLElement>('.sc-item', el);
          const bar = el.querySelector<HTMLElement>('.sc-bar i');
          const dist = () => Math.max(0, rail.scrollWidth - track.clientWidth);
          let last = -1;
          const tween = gsap.to(rail, {
            x: () => -dist(),
            ease: 'none',
            scrollTrigger: {
              trigger: el, start: 'top top', end: () => '+=' + dist() * 1.15, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate: (st) => {
                if (bar) bar.style.transform = `scaleX(${st.progress})`;
                // active frame: the one whose centre is closest to the centre of the screen
                const mid = window.innerWidth / 2;
                let best = 0, bd = Infinity;
                frames.forEach((f, i) => { const r = f.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
                if (best !== last) { last = best; setCur(best); }
              },
            },
          });
          // depth: each picture drifts against the strip inside its frame
          gsap.utils.toArray<HTMLElement>('.sc-img', el).forEach((img) => {
            gsap.fromTo(img, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: img.closest('.sc-item'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
          });
          return () => el.classList.remove('is-pinned');
        });
      }, el);
      return () => { ctx.revert(); mm.revert(); ScrollTrigger.refresh(); };
    }, '0px 0px 30% 0px');
  }, [items.length]);

  return (
    <section ref={root} className="sc" aria-label={label}>
      <div className="sc-pin">
        <div className="wrap wrap-wide sc-head">
          <Heading text={title} index={index} />
          <div className="sc-meta" data-reveal="up">
            {text && <p className="sc-lead">{text}</p>}
            <p className="sc-count" aria-hidden="true"><b>{pad(cur + 1)}</b><span>/ {pad(items.length)}</span></p>
          </div>
        </div>
        <div className="sc-track">
          <ul className="sc-rail">
            {items.map((it, i) => (
              <li className={'sc-item' + (i === cur ? ' is-on' : '')} key={it.src}>
                <figure>
                  <div className="sc-frame"><Image className="sc-img" src={it.src} alt={it.caption} fill sizes="(min-width: 900px) 56vw, 86vw" quality={80} /></div>
                  <figcaption><span className="sc-n">{pad(i + 1)}</span><span className="sc-cap">{it.caption}</span></figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <div className="wrap wrap-wide sc-foot">
          <div className="sc-bar" aria-hidden="true"><i /></div>
          {tag && <span className="sc-tag">{tag}</span>}
        </div>
      </div>
    </section>
  );
}
