'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/motion';

type Img = { src: string; alt: string };

/** Large manifesto paragraph: pinned on desktop, words light up in reading order, portraits drift past at different speeds. */
export default function Manifest({ text, images, label }: { text: string; images: Img[]; label: string }) {
  const root = useRef<HTMLElement>(null);
  const tokens = text.split(/(\*[^*]+\*|\s+)/g).filter(Boolean);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', () => {
        const words = gsap.utils.toArray<HTMLElement>('.mf-w', el);
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 0.6, anticipatePin: 1 } });
        tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, ease: 'none', duration: 0.4 }, 0);
        gsap.utils.toArray<HTMLElement>('.mf-img', el).forEach((img) => {
          const speed = Number(img.dataset.speed || 1);
          tl.fromTo(img, { yPercent: 35 * speed }, { yPercent: -45 * speed, ease: 'none', duration: tl.duration() || 1 }, 0);
        });
      });
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 899px)', () => {
        gsap.fromTo('.mf-w', { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el.querySelector('.mf-text'), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 } });
      });
    }, el);
    return () => { ctx.revert(); mm.revert(); ScrollTrigger.refresh(); };
  }, [text]);

  return (
    <section ref={root} className="mf" aria-label={label}>
      <div className="mf-imgs">
        {images.slice(0, 5).map((im, i) => (
          <figure className={`mf-img mf-img-${i + 1}`} key={im.src} data-speed={[0.8, 1.3, 1, 1.6, 0.6][i]}>
            <Image src={im.src} alt={im.alt} fill sizes="(min-width: 900px) 16vw, 45vw" quality={78} />
          </figure>
        ))}
      </div>
      <div className="wrap mf-inner">
        <p className="mf-text">
          {tokens.map((t, i) => {
            if (/^\s+$/.test(t)) return ' ';
            const em = t.startsWith('*') && t.endsWith('*');
            return em
              ? t.slice(1, -1).split(/\s+/).map((part, j) => <span key={`${i}-${j}`} className="mf-w is-em">{j ? ' ' : ''}{part}</span>)
              : <span key={i} className="mf-w">{t}</span>;
          })}
        </p>
      </div>
    </section>
  );
}
