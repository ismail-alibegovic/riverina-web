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

// Line offsets in steps of STEP px at 1440 px (scaled with the viewport): the staircase the statement starts from.
const STEP = 72;
const FROM = [1, 2, 0, 3, 1, 3, 2].map((s) => s * STEP);
// Five images rise past the text at five speeds (Elicyon: start +100…+400 px, end −260 % … −400 % of their height).
const IMG_FROM = [100, 200, 100, 400, 300];
const IMG_TO = [-260, -400, -300, -320, -280];

/**
 * First editorial section, after Elicyon's statement. The paragraph pins for 2.8 screen heights and starts as a
 * staircase of lines; the bracketed words grey out and dissolve in random order, then every remaining word travels
 * to its place in one centred sentence of two or three lines (each word's start and end are measured from the two
 * layouts, so it works at any width). Five tall images rise past it at five speeds.
 * On phones the text is set directly in its final form and only the images move; reduced motion: nothing moves.
 */
export default function Prologue({ text, images, label }: { text: string; images: Img[]; label: string }) {
  const root = useRef<HTMLElement>(null);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean).map(parse);
  // the words that stay, in reading order: the final, centred sentence
  const kept = lines.flatMap((parts) => parts.filter((p) => !p.fade).flatMap((p) => p.t.split(/\s+/).filter(Boolean).map((w) => ({ w, em: p.em }))));

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
          const rowX = rows.map((_, i) => (FROM[i] ?? 0) * k);
          rows.forEach((r, i) => gsap.set(r, { x: rowX[i] }));
          const words = gsap.utils.toArray<HTMLElement>('.es-text .es-w', el);
          const targets = gsap.utils.toArray<HTMLElement>('.es-final .es-w', el);
          // offsets ignore transforms, so the travel can be measured at any time (also on refresh mid-scroll); they are
          // summed up to the pinned box, whichever ancestors happen to be offset parents (a transformed line is one)
          const at = (e: HTMLElement) => {
            let x = 0, y = 0, n: HTMLElement | null = e;
            while (n && n !== pin) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
            return { x, y };
          };
          const delta = (i: number) => {
            const w = words[i], a = at(w), b = at(targets[i]);
            const row = rows.indexOf(w.closest('.es-line') as HTMLElement);
            return { x: b.x - (a.x + (rowX[row] ?? 0)), y: b.y - a.y };
          };
          const fades = gsap.utils.toArray<HTMLElement>('.es-fade', el);
          const gone = gsap.utils.toArray<HTMLElement>('.es-line.is-gone', el);
          tl.to(fades, { opacity: 0.28, duration: 0.25, stagger: { amount: 0.2, from: 'random' } }, 0.04)
            .to([...fades, ...gone], { opacity: 0, duration: 0.25, stagger: { amount: 0.15, from: 'random' } }, 0.3)
            .to(words, { x: (i: number) => delta(i).x, y: (i: number) => delta(i).y, duration: 0.55, ease: 'power2.inOut', stagger: 0.008 }, 0.45);
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
                : <span key={j} className={p.em ? 'es-em' : undefined}>{p.t.split(/(\s+)/).map((w, m) => (w.trim() ? <span key={m} className="es-w">{w}</span> : w))}</span>))}
            </span>
          ))}
        </p>
        {/* the sentence the words settle into: measured only, never seen */}
        <p className="es-final" aria-hidden="true">
          {/* punctuation that follows a capitalised word ("Ilidži,") is its own word: no space before it */}
          {kept.map((k, i) => <span key={i}>{i > 0 && !/^[,.;:!?]/.test(k.w) ? ' ' : ''}<span className={'es-w' + (k.em ? ' es-em' : '')}>{k.w}</span></span>)}
        </p>
        <div className="es-imgs" aria-hidden="true">
          {images.slice(0, 5).map((im, i) => (
            <figure key={im.src} className={`es-img es-img-${i + 1}`}>
              <Image src={im.src} alt="" fill sizes="(min-width: 1024px) 23vw, 66vw" quality={80} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
