'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { loadMotion } from '@/lib/motion';

type Img = { src: string; alt: string };
type Part = { t: string; fade: boolean; em: boolean };

/** "Riverina {je novi} na *Ilidži*" → parts; {…} dissolves on scroll, *…* is set in capitals. */
function parse(line: string): Part[] {
  return line.split(/(\{[^}]*\}|\*[^*]+\*)/g).filter(Boolean).map((s) =>
    s.startsWith('{') ? { t: s.slice(1, -1), fade: true, em: false } : s.startsWith('*') ? { t: s.slice(1, -1), fade: false, em: true } : { t: s, fade: false, em: false });
}

// Line offsets in steps of STEP px at 1440 px (scaled with the viewport): where each line starts, and where it
// settles once the extra words have dissolved. On a fixed step the stagger reads as a deliberate staircase rather
// than as loose alignment; Elicyon staggers its seven lines the same way and re-offsets them on scroll.
const STEP = 72;
const FROM = [1, 2, 0, 3, 1, 3, 2].map((s) => s * STEP);
const TO = [0, 1, 0, 2, 1, 3, 2].map((s) => s * STEP);
// Five images rise past the text at five speeds (Elicyon: start +100…+400 px, end −260 % … −400 % of their height).
const IMG_FROM = [100, 200, 100, 400, 300];
const IMG_TO = [-260, -400, -300, -320, -280];

/**
 * First editorial section, after Elicyon's statement: the paragraph pins for 2.8 screen heights; the bracketed words
 * dissolve in random order and close up, and the lines slide to new offsets, so a longer sentence recomposes into a
 * shorter one. Every remaining word stays fully legible throughout. Images rise around it at different speeds.
 * On phones the text is set directly in its final form and only the images move; reduced motion: nothing moves.
 */
export default function Prologue({ text, images, label }: { text: string; images: Img[]; label: string }) {
  const root = useRef<HTMLElement>(null);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean).map(parse);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let dead = false, undo = () => {};
    loadMotion().then(({ gsap }) => {
      if (dead) return;
      const mm = gsap.matchMedia();
      mm.add({ desk: '(min-width: 1024px)', tab: '(min-width: 768px) and (max-width: 1023px)', phone: '(max-width: 767px)' }, (c) => {
        const { desk, tab } = c.conditions as Record<string, boolean>;
        const pin = el.querySelector<HTMLElement>('.es-pin')!;
        const k = (Math.min(window.innerWidth, 1600) / 1440) * (desk ? 1 : 0.6);
        const imgs = gsap.utils.toArray<HTMLElement>('.es-img', el);
        if (desk || tab) imgs.forEach((im, i) => gsap.set(im, { y: IMG_FROM[i] }));
        const length = desk ? 2.8 : tab ? 2.2 : 0.8;
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: desk || tab ? 'top top' : 'top 80%', end: () => `+=${pin.clientHeight * length}`, scrub: desk || tab ? true : 0.5, pin: desk || tab ? pin : false, invalidateOnRefresh: true } });
        imgs.forEach((im, i) => tl.fromTo(im, { yPercent: desk || tab ? 0 : 12 }, { yPercent: desk || tab ? IMG_TO[i] : -12, ease: 'none' }, 0));
        if (desk || tab) {
          const rows = gsap.utils.toArray<HTMLElement>('.es-line', el);
          rows.forEach((r, i) => gsap.set(r, { x: (FROM[i] ?? 0) * k }));
          const fades = gsap.utils.toArray<HTMLElement>('.es-fade', el);
          fades.forEach((f) => gsap.set(f, { maxWidth: f.scrollWidth + 2 }));
          const gone = gsap.utils.toArray<HTMLElement>('.es-line.is-gone', el);
          const inLine = fades.filter((f) => !f.closest('.is-gone'));
          // a line that dissolves completely goes first and closes up at once, so no empty row is left behind
          tl.to(gone, { opacity: 0, duration: 0.35 }, 0.05)
            .to(gone, { height: 0, duration: 0.55, ease: 'power2.inOut' }, 0.3)
            .to(inLine, { opacity: 0, duration: 0.5, stagger: { amount: 0.8, from: 'random' } }, 0.2)
            .to(inLine, { maxWidth: 0, duration: 0.8, ease: 'power2.out' }, '>-0.2')
            .to(rows, { x: (i: number) => (TO[i] ?? 0) * k, duration: 0.8, ease: 'power2.out' }, '<');
        }
        return () => { tl.scrollTrigger?.kill(); tl.kill(); };
      });
      undo = () => mm.revert();
    });
    return () => { dead = true; undo(); };
  }, [text]);

  return (
    <section ref={root} className="es" aria-label={label}>
      <div className="es-pin">
        <p className="es-text">
          {lines.map((parts, i) => (
            <span key={i} className={'es-line' + (parts.every((p) => p.fade || !p.t.trim()) ? ' is-gone' : '')}>
              {parts.map((p, j) => (p.fade
                ? <span key={j} className="es-fade">{p.t}</span>
                : <span key={j} className={p.em ? 'es-em' : undefined}>{p.t}</span>))}
            </span>
          ))}
        </p>
        <div className="es-imgs" aria-hidden="true">
          {images.slice(0, 5).map((im, i) => (
            <figure key={im.src} className={`es-img es-img-${i + 1}`}>
              <Image src={im.src} alt="" fill sizes="(min-width: 1024px) 16vw, 38vw" quality={78} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
