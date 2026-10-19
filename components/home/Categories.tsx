'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { whenNear } from '@/lib/motion';
import { Rich } from './text';

export type Category = { title: string; caption: string; src: string; href: string; linkLabel: string };

/**
 * Full-screen panels that stack: each one stays put while the next slides over it (CSS sticky, no pinning).
 * A giant word spans the top of the frame and rises letter by letter; the caption and link sit bottom right,
 * the dots on the left show which panel this is (Elicyon "Commercial / Residential").
 */
export default function Categories({ items, tag }: { items: Category[]; tag?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap }) => {
      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          // the picture settles as its panel slides up over the previous one
          gsap.utils.toArray<HTMLElement>('.cat', el).forEach((panel) => {
            gsap.fromTo(panel.querySelector('.cat-media'), { scale: 1.14, yPercent: -4 }, { scale: 1, yPercent: 0, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: true } });
          });
        });
      }, el);
      return () => { ctx.revert(); mm.revert(); };
    });
  }, [items.length]);

  return (
    <div ref={root} className="cats">
      {items.map((c, n) => (
        <article className="cat" key={c.title} style={{ '--n': Array.from(c.title).length, zIndex: n + 1 } as React.CSSProperties}>
          <div className="cat-media"><Image src={c.src} alt="" fill sizes="100vw" quality={78} /></div>
          <div className="cat-shade" aria-hidden="true" />
          <h2 className="cat-title" data-reveal="chars" aria-label={c.title}>
            {Array.from(c.title.toUpperCase()).map((ch, i) => (
              <span className="cat-chw" key={i} aria-hidden="true"><span className="cat-ch" style={{ '--i': i } as React.CSSProperties}>{ch === ' ' ? ' ' : ch}</span></span>
            ))}
          </h2>
          {items.length > 1 && (
            <ol className="cat-dots" aria-hidden="true">
              {items.map((x, i) => <li key={x.title} className={i === n ? 'is-on' : ''} />)}
            </ol>
          )}
          <div className="cat-foot" data-reveal="up">
            {c.caption && <p className="cat-cap">{c.caption.split('\n').map((l, i) => <span key={i}><Rich text={l} /></span>)}</p>}
            {c.href && <a className="link-line cat-link" href={c.href}>{c.linkLabel}<span className="sr-only">: {c.title}</span></a>}
          </div>
          {tag && <span className="ill-tag">{tag}</span>}
        </article>
      ))}
    </div>
  );
}
