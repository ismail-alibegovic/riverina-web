'use client';
import { useEffect, useRef } from 'react';
import { Lang, Page, tx } from '@/lib/content';
import { href, UI } from '@/lib/i18n';
import { LOADER_LOGO as LOGO } from '@/lib/loaderLogo';
import { loadMotion } from '@/lib/motion';
import { getLenis } from '../site/SmoothScroll';
import { Fill, Rich } from './text';

/**
 * The opening: the logo loader in front of the home hero.
 *
 * Loader (first home visit in a session): on the brand navy the Riverina logo is drawn shape by shape and a gold base
 * line draws under it. Then, as on elicyon.com, the navy field opens from the centre to the edges (an even-odd hole,
 * power3.inOut) onto the hero picture, which settles from ×1.22, while the logo travels into the header. It opens only
 * onto a decoded picture: no wait when it is ready, at most 2.5 s more on a slow line. The header's own logo
 * cross-fades in where the loader logo lands.
 *
 * Hero (the composition of the live site): the render full-bleed under a shade, the stepped name at the bottom left,
 * then the subtitle and the two links. Its CSS entrance (home.css) is held while the loader runs and starts as the
 * field opens. Later visits in the session: no loader, the entrance plays at once.
 * Without JavaScript or with reduced motion: no loader, everything in place.
 */
const HOLE = (p: number) => `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${p}% ${p}%, ${100 - p}% ${p}%, ${100 - p}% ${100 - p}%, ${p}% ${100 - p}%, ${p}% ${p}%)`;
/** used when the CMS has no hero picture: the approved 360° view at 315° */
const FALLBACK = '/riverina/hero/hero-315-bg.webp';
/** reveal direction of each logo shape, following its stroke: bowl →, gold leaf ↑, navy leaf ↓, ribbons → */
const DIRS = ['90deg', '0deg', '180deg', '90deg', '90deg'];

export default function Opening({ hero, lang, name, tag }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string }) {
  const root = useRef<HTMLElement>(null);
  const t = UI[lang];
  const raw = tx(hero.title, lang) || name;
  // One-line titles of up to three words are stepped word by word, like a multi-line title.
  const lines = raw.includes('\n') ? raw.split('\n') : raw.trim().split(/\s+/).length <= 3 ? raw.trim().split(/\s+/) : [raw];
  const cta2 = tx(hero.cta2, lang);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = !html.classList.contains('intro-seen') && !reduce;
    el.classList.add('is-live'); // switches off the CSS fail-safes
    if (!intro) return;
    el.classList.add('is-intro'); // the hero entrance of the opening: a deeper zoom, the name later (elicyon.css)

    // the loader opens only onto a decoded picture
    const pic = el.querySelector<HTMLImageElement>('.hero-img');
    const picReady = !pic ? Promise.resolve() : pic.complete && pic.naturalWidth > 0 ? pic.decode().catch(() => {}) : new Promise<void>((done) => {
      pic.addEventListener('load', () => done(), { once: true });
      pic.addEventListener('error', () => done(), { once: true });
    });

    let dead = false;
    let undo = () => {};
    html.classList.add('intro-run');
    window.scrollTo(0, 0);
    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (dead) return;
      const q = (s: string) => Array.from(el.querySelectorAll<HTMLElement>(s));
      const ctx = gsap.context(() => {
        getLenis()?.stop();
        const field = el.querySelector<HTMLElement>('.ld-field')!;
        const logo = el.querySelector<HTMLElement>('.ld-logo')!;

        // 1 · the logo, shape by shape, each along its own stroke (soft-edged masks); a gold base line draws under it
        const draw = gsap.timeline();
        draw.fromTo(q('.ld-part'), { '--p': '0%' }, { '--p': '130%', duration: 1.05, ease: 'power2.inOut', stagger: 0.14 }, 0.1)
          .fromTo(q('.ld-word .ld-ch > span'), { y: 0, yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.045 }, 0.75)
          .fromTo(q('.ld-res .ld-ch > span'), { opacity: 0, y: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.035 }, 1.15)
          .fromTo(q('.ld-rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 1.2);
        const drawn = new Promise<void>((r) => { draw.eventCallback('onComplete', () => r()); });
        const pictured = Promise.race([picReady, new Promise((r) => setTimeout(r, 2500))]);
        Promise.all([drawn, pictured]).then(() => { if (!dead) ctx.add(reveal); });

        // 2 · as on elicyon.com: the navy field opens from the centre onto the picture while the logo, still over it,
        //     travels into the header; the hero's own entrance (zoom, then the name) starts with the opening
        const reveal = () => {
          const hole = { p: 50 };
          const travel = 1.8, open = 0.05, dur = 1.8;
          gsap.timeline({
            onComplete: () => {
              html.classList.remove('intro-run', 'intro-header', 'intro-landed', 'intro-open');
              el.classList.add('intro-done');
              getLenis()?.start();
              ScrollTrigger.refresh();
            },
          })
            .to(q('.ld-rule'), { scaleX: 0, duration: 0.5, ease: 'power2.in' }, 0)
            .add(() => {
              // measured when it starts, so the header's real position (any screen size) is the target
              const brand = document.querySelector<HTMLElement>('.hdr-brand');
              if (!brand) return;
              const a = logo.getBoundingClientRect(), b = brand.getBoundingClientRect();
              gsap.to(logo, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: b.height / a.height, duration: travel, ease: 'power3.inOut' });
            }, 0.05)
            .add(() => html.classList.add('intro-open'), open)
            .to(hole, { p: 0, duration: dur, ease: 'power3.inOut', onUpdate: () => { field.style.clipPath = HOLE(hole.p); } }, open)
            // the header (and its real logo) takes over where the travelling logo lands
            .add(() => html.classList.add('intro-header'), 0.05 + travel - 0.2)
            .add(() => html.classList.add('intro-landed'), 0.05 + travel)
            .to(logo, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.05 + travel)
            .set(el.querySelector('.ld'), { display: 'none' }, open + dur);
        };
      }, el);
      undo = () => ctx.revert();
    }, () => { html.classList.remove('intro-run'); el.classList.add('intro-done'); });

    return () => { dead = true; undo(); html.classList.remove('intro-run', 'intro-header', 'intro-landed', 'intro-open'); };
  }, []);

  const lineBox = (b: { left: number; top: number; width: number; height: number }) => ({ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` });
  const letters = (line: typeof LOGO.word | typeof LOGO.res, cls: string) => (
    <span className={`ld-line ${cls}`} style={lineBox(line)}>
      {line.letters.map(([x, w], i) => (
        <span key={i} className="ld-ch" style={{ left: `${x}%`, width: `${w}%` }}>
          <span style={{ backgroundImage: `url(${line.src})`, backgroundSize: `${10000 / w}% 100%`, backgroundPosition: `${w >= 100 ? 0 : (x / (100 - w)) * 100}% 0` }} />
        </span>
      ))}
    </span>
  );

  return (
    <section ref={root} className="hero eh" aria-labelledby="hero-title">
      {/* No scroll parallax here: it enlarges the picture (×1.16) and the render is only 1672 px wide, so it went soft.
          The picture stays at its natural size; only the entrance settles it to ×1. */}
      <div className="hero-media">
        <Fill src={hero.image || FALLBACK} sizes="100vw" priority quality={84} className="hero-img" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      {tag && <span className="ill-tag">{tag}</span>}
      <div className="wrap wrap-wide hero-inner" data-parallax-out>
        {tx(hero.eyebrow, lang) && <p className="label hero-eyebrow">{tx(hero.eyebrow, lang)}</p>}
        <h1 id="hero-title" className="hero-title">
          {lines.filter((l) => l.trim()).map((l, i) => (
            <span className="hero-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l.trim()} /></span></span>
          ))}
        </h1>
        <div className="hero-foot">
          {tx(hero.subtitle, lang) && <p className="hero-sub">{tx(hero.subtitle, lang)}</p>}
          <div className="hero-ctas">
            <a className="btn btn-light" href={href('apartments', lang)} data-magnetic>{tx(hero.cta, lang) || t.chooseApartment}</a>
            {cta2 && <a className="link-line" href="#kontakt">{cta2}</a>}
          </div>
        </div>
      </div>
      <span className="hero-scroll" aria-hidden="true"><i /></span>

      <div className="ld" aria-hidden="true">
        <div className="ld-field" style={{ clipPath: HOLE(50) }} />
        <div className="ld-stage">
          <div className="ld-logo" style={{ aspectRatio: String(LOGO.ratio) }}>
            {LOGO.mark.map((m, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.src} className="ld-part" src={m.src} alt="" style={{ ...lineBox(m), '--dir': DIRS[i] } as React.CSSProperties} />
            ))}
            {letters(LOGO.word, 'ld-word')}
            {letters(LOGO.res, 'ld-res')}
            <span className="ld-rule" />
          </div>
        </div>
      </div>
    </section>
  );
}
