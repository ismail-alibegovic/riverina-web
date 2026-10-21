'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { whenNear } from '@/lib/motion';

type Img = { src: string; alt: string; caption?: string };
type Fact = { value: string; label: string };

/**
 * Editorial manifesto: a sheet of paper that slides over the hero. The sentence is set left like a magazine spread,
 * its words light up in reading order and the emphasised words get a gold rule. Two figures with numbered captions
 * open as the reader reaches them; one rides over the top edge of the sheet. Below, the verified key figures
 * (live from the apartments table) on hairlines. The gold ribbon continues from the hero.
 */
export default function Manifest({ text, images, label, facts = [] }: { text: string; images: Img[]; label: string; facts?: Fact[] }) {
  const root = useRef<HTMLElement>(null);
  const tokens = text.split(/(\*[^*]+\*|\s+)/g).filter(Boolean);
  const figs = images.slice(0, 2);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return whenNear(el, ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const desk = window.matchMedia('(min-width: 901px)').matches;
        const words = gsap.utils.toArray<HTMLElement>('.mx-w', el);
        const lit = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.mx-text'), start: desk ? 'top 72%' : 'top 82%', end: desk ? 'bottom 38%' : 'bottom 52%', scrub: 0.6 } });
        lit.to(words, { opacity: 1, stagger: 0.08, ease: 'none', duration: 0.3 }, 0);
        gsap.utils.toArray<HTMLElement>('.mx-w.is-em', el).forEach((w) => {
          lit.to(w, { '--u': 1, ease: 'power2.out', duration: 0.25 }, words.indexOf(w) * 0.08 + 0.1);
        });

        const ribbon = gsap.to(el.querySelector('.mx-ribbon'), { '--flow': 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 70%', scrub: 0.8 } });

        // figures: the frame opens upwards while the picture settles, then the picture drifts inside its frame
        const figTweens = gsap.utils.toArray<HTMLElement>('.mx-fig', el).flatMap((fig) => {
          const frame = fig.querySelector('.mx-frame')!;
          const img = fig.querySelector('img')!;
          const open = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 88%', once: true } })
            .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
            .fromTo(img, { scale: 1.35 }, { scale: 1.08, duration: 2.2, ease: 'expo.out' }, 0.15)
            .fromTo(fig.querySelectorAll('figcaption > *'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.9);
          const drift = gsap.fromTo(fig.querySelector('.mx-drift'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
          return [open, drift];
        });

        const factTl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.mx-facts'), start: 'top 86%', once: true } })
          .fromTo(el.querySelectorAll('.mx-fact'), { '--rule': 0 }, { '--rule': 1, duration: 1.2, stagger: 0.12, ease: 'expo.inOut' }, 0)
          .fromTo(el.querySelectorAll('.mx-fact dd, .mx-fact dt'), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, 0.25);
        const label = gsap.fromTo(el.querySelectorAll('.mx-label > *'), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el.querySelector('.mx-label'), start: 'top 90%', once: true } });

        return () => { [lit, ribbon, factTl, label, ...figTweens].forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); };
      });
      return () => mm.revert();
    });
  }, [text]);

  return (
    <section ref={root} className="mx" aria-label={label}>
      <svg className="ribbon mx-ribbon" viewBox="0 0 1440 1200" preserveAspectRatio="none" aria-hidden="true">
        <path className="is-desk" pathLength={1} d="M170 -10 C 165 160 120 300 140 460 C 160 620 260 712 520 716 C 820 720 1100 700 1250 760 C 1340 796 1400 860 1460 900" />
        <path className="is-mob" pathLength={1} d="M1470 250 C 1400 330 1405 520 1402 700 C 1400 860 1150 900 1080 1000 C 1020 1090 1180 1180 1460 1200" />
      </svg>
      <div className="wrap wrap-wide mx-grid">
        <p className="mx-label label"><span>01</span><span>{label}</span></p>

        <p className="mx-text">
          {tokens.map((t, i) => {
            if (/^\s+$/.test(t)) return ' ';
            // punctuation right after an emphasised word stays on its line
            if (/^[.,;:!?…]+$/.test(t) && /^\*.*\*$/.test(tokens[i - 1] || '')) return null;
            const em = t.startsWith('*') && t.endsWith('*');
            if (!em) return <span key={i} className="mx-w">{t}</span>;
            const parts = t.slice(1, -1).split(/\s+/);
            const tail = /^[.,;:!?…]+$/.test(tokens[i + 1] || '') ? tokens[i + 1] : '';
            return (
              <span key={i} className="mx-nb">
                {parts.map((part, j) => <span key={j}>{j ? ' ' : ''}<span className="mx-w is-em">{part}</span></span>)}
                {tail && <span className="mx-w">{tail}</span>}
              </span>
            );
          })}
        </p>

        {figs.map((im, i) => (
          <figure className={`mx-fig mx-fig-${i + 1}`} key={im.src}>
            <div className="mx-frame">
              <div className="mx-drift">
                <Image src={im.src} alt={im.alt} fill sizes={i === 0 ? '(min-width: 901px) 24vw, 62vw' : '(min-width: 901px) 18vw, 52vw'} quality={80} />
              </div>
            </div>
            {im.caption && (
              <figcaption><span className="mx-no">{String(i + 1).padStart(2, '0')}</span><span>{im.caption}</span></figcaption>
            )}
          </figure>
        ))}

        {facts.length > 0 && (
          <dl className="mx-facts">
            {facts.map((f) => (
              <div className="mx-fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value.replace('-', '–')}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
