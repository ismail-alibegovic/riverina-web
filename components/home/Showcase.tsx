'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { whenNear } from '@/lib/motion';
import { Heading } from './text';

export type ShowcaseItem = { src: string; caption: string };

/**
 * Wide renders on one horizontal strip. On desktop the section holds still while scrolling moves the strip sideways
 * (each image settles from a slight zoom); on touch, with reduced motion or without JavaScript it is a native
 * swipe strip with scroll snap.
 */
export default function Showcase({ title, text, items, index, tag, label }: { title: string; text: string; items: ShowcaseItem[]; index?: number; tag?: string; label: string }) {
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(1);
  const pad = (n: number) => String(n).padStart(2, '0');

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px) and (hover: hover)', () => {
          const track = el.querySelector<HTMLElement>('.sc-track')!;
          el.classList.add('is-pinned');
          const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
          const tween = gsap.to(track.querySelector('.sc-rail'), {
            x: () => -dist(),
            ease: 'none',
            scrollTrigger: {
              trigger: el, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
              onUpdate: (st) => {
                const bar = el.querySelector<HTMLElement>('.sc-bar i');
                if (bar) bar.style.transform = `scaleX(${st.progress})`;
                setCur(Math.min(items.length, Math.round(st.progress * (items.length - 1)) + 1));
              },
            },
          });
          gsap.utils.toArray<HTMLElement>('.sc-img', el).forEach((img) => {
            gsap.fromTo(img, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } });
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
            {text && <p className="lead">{text}</p>}
            <p className="label sc-count" aria-hidden="true"><b>{pad(cur)}</b> / {pad(items.length)}</p>
          </div>
        </div>
        <div className="sc-track">
          <ul className="sc-rail">
            {items.map((it, i) => (
              <li className="sc-item" key={it.src}>
                <figure>
                  <div className="sc-frame">
                    <Image className="sc-img" src={it.src} alt={it.caption} fill sizes="(min-width: 900px) 62vw, 86vw" quality={78} />
                    {tag && <span className="ill-tag">{tag}</span>}
                  </div>
                  <figcaption><span className="sc-n">{pad(i + 1)}</span>{it.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
        <div className="wrap wrap-wide sc-bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
