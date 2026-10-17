'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { whenNear } from '@/lib/motion';

export type Category = { title: string; src: string; href: string; linkLabel: string };

/** Full-screen image panels; the title spreads letter by letter across the frame as it scrolls in. */
export default function Categories({ items, tag }: { items: Category[]; tag?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap }) => {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.utils.toArray<HTMLElement>('.cat', el).forEach((panel) => {
            gsap.fromTo(panel.querySelector('.cat-media'), { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
            gsap.fromTo(panel.querySelectorAll('.cat-ch'), { yPercent: 105 }, { yPercent: 0, duration: 1.2, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: panel, start: 'top 55%', once: true } });
          });
        });
      }, el);
      return () => { ctx.revert(); mm.revert(); };
    });
  }, [items.length]);

  return (
    <div ref={root} className="cats">
      {items.map((c) => (
        <article className="cat" key={c.title}>
          <div className="cat-media"><Image src={c.src} alt="" fill sizes="100vw" quality={78} /></div>
          <div className="cat-shade" aria-hidden="true" />
          {tag && <span className="ill-tag">{tag}</span>}
          {c.href && <a className="link-line cat-link" href={c.href}>{c.linkLabel}<span className="sr-only">: {c.title}</span></a>}
          <h2 className="cat-title" aria-label={c.title}>
            {Array.from(c.title.toUpperCase()).map((ch, i) => (
              <span className="cat-chw" key={i} aria-hidden="true"><span className="cat-ch">{ch === ' ' ? ' ' : ch}</span></span>
            ))}
          </h2>
        </article>
      ))}
    </div>
  );
}
