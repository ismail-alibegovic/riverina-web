'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { loadMotion } from '@/lib/motion';
import { Stepped } from './Editorial';

export type Chapter = { title: string; caption: string; src: string; href: string; linkLabel: string };

/**
 * Project chapters after Elicyon's projects section: a short stepped heading, then a full-screen stage pinned for
 * three screen heights with the chapters stacked on top of each other. Each chapter word is split into letters set
 * in a three-step pattern (top, bottom, middle of the frame); scrolling gathers them into one line at the top, the
 * caption appears, and the chapter is wiped upwards to uncover the next. Dots show the current chapter.
 * Reduced motion: the chapters follow each other as plain full-screen panels, words already gathered.
 */
export default function Chapters({ items, heading, text, cta, tag }: { items: Chapter[]; heading: string; text: string; cta: { href: string; label: string }; tag?: string }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let dead = false, undo = () => {};
    loadMotion().then(({ gsap }) => {
      if (dead) return;
      const stage = el.querySelector<HTMLElement>('.ec-stage')!;
      const panels = gsap.utils.toArray<HTMLElement>('.ec-panel', el);
      const dots = gsap.utils.toArray<HTMLElement>('.ec-dot', el);
      const ctx = gsap.context(() => {
        const start = (ch: HTMLElement, i: number) => {
          // the word line starts below the header: the letters spread over the rest of the frame
          const word = ch.parentElement!, h = stage.clientHeight - word.offsetTop, lh = ch.offsetHeight, pad = parseFloat(getComputedStyle(word).paddingTop) || 0;
          return (i + 1) % 3 === 2 ? h - lh - pad * 2 : (i + 1) % 3 === 0 ? h / 2 - lh / 2 - pad : 0;
        };
        panels.forEach((p) => p.querySelectorAll<HTMLElement>('.ec-ch').forEach((ch, i) => gsap.set(ch, { y: start(ch, i) })));
        gsap.set(panels.map((p) => p.querySelector('.ec-foot')), { opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage, start: 'top top', end: () => `+=${stage.clientHeight * 3}`, scrub: true, pin: true, pinSpacing: true, invalidateOnRefresh: true,
            onUpdate: (s) => { const k = s.progress > 0.66 ? 2 : s.progress > 0.33 ? 1 : 0; dots.forEach((d, i) => d.classList.toggle('is-on', i === k)); },
            onRefreshInit: () => panels.forEach((p) => p.querySelectorAll<HTMLElement>('.ec-ch').forEach((ch, i) => gsap.set(ch, { y: start(ch, i) }))),
          },
        });
        panels.forEach((p, i) => {
          tl.to(p.querySelectorAll('.ec-ch'), { y: 0, ease: 'none' })
            .to(p.querySelector('.ec-foot'), { opacity: 1, ease: 'power2.out' }, '>-40%');
          if (i < panels.length - 1) tl.to(p, { clipPath: 'inset(0% 0% 100% 0%)', ease: 'none' });
        });
      }, el);
      undo = () => ctx.revert();
    });
    return () => { dead = true; undo(); };
  }, [items.length]);

  const lines = heading.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <section ref={root} className="ec" aria-label={lines.join(' ').replace(/\*/g, '')}>
      <div className="ec-intro">
        <Stepped text={heading} />
        {text && <p className="ec-text" data-ed="fade">{text}</p>}
        <a className="eh-cta ec-cta" href={cta.href} data-ed="fade"><span>{cta.label}</span></a>
      </div>
      <div className="ec-stage">
        {items.map((c, n) => {
          const word = c.title.toUpperCase();
          return (
            <article key={c.title} className="ec-panel" style={{ zIndex: items.length - n, '--n': Array.from(word).length } as React.CSSProperties}>
              <div className="ec-media"><Image src={c.src} alt="" fill sizes="100vw" quality={80} /></div>
              <div className="ec-shade" aria-hidden="true" />
              <h3 className="ec-word" aria-label={c.title}>
                {Array.from(word).map((ch, i) => <span key={i} className="ec-ch" aria-hidden="true">{ch === ' ' ? ' ' : ch}</span>)}
              </h3>
              <div className="ec-foot">
                <p className="ec-cap">{c.caption.split('\n').map((l, i) => <span key={i}>{l}</span>)}</p>
                {c.href && <a className="eh-cta" href={c.href}><span>{c.linkLabel}</span><span className="sr-only">: {c.title}</span></a>}
              </div>
              {tag && <span className="ec-tag">{tag}</span>}
            </article>
          );
        })}
        {items.length > 1 && (
          <ol className="ec-dots" aria-hidden="true">{items.map((c, i) => <li key={c.title} className={'ec-dot' + (i === 0 ? ' is-on' : '')} />)}</ol>
        )}
      </div>
    </section>
  );
}
