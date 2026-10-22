'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Lang, Page, tx } from '@/lib/content';
import { href, UI } from '@/lib/i18n';
import { LOADER_LOGO as LOGO } from '@/lib/loaderLogo';
import { loadMotion } from '@/lib/motion';
import { getLenis } from '../site/SmoothScroll';
import { HERO_SKYLINE as SKY } from '@/lib/heroSkyline';

/** Cap band of the display serif within a line box of line-height 1 (Cormorant Garamond): top and bottom, in em. */
const CAP_TOP = 0.19, CAP_BOTTOM = 0.82;
/** At most this share of any letter of the middle word may pass behind the building. */
const MAX_HIDDEN = 0.3;

/**
 * Places the middle word just above the building's skyline (resting picture: scale 1, no drift), so it tucks behind
 * the roof by at most MAX_HIDDEN of the cap height wherever it is, on any screen; the first word keeps clear above it.
 * The skyline comes from the cut-out itself (lib/heroSkyline.ts). Returns nothing; writes inline `top`s.
 */
function placeWords(el: HTMLElement) {
  const [w1, w2] = Array.from(el.querySelectorAll<HTMLElement>('.eh-w'));
  if (!w2) return;
  w1?.style.removeProperty('top'); w2.style.removeProperty('top');
  // the picture plate's own box (its height and offset differ between screens, see --mh and --shift)
  const box = el.querySelector<HTMLElement>('.eh-media');
  if (!box) return;
  const W = box.clientWidth, H = box.clientHeight, shift = box.offsetTop;
  const ox = parseFloat(getComputedStyle(el).getPropertyValue('--ox')) / 100;
  const tall = W / H < SKY.aspect;
  const imgW = tall ? H * SKY.aspect : W, imgH = tall ? H : W / SKY.aspect;
  const offX = tall ? (W - imgW) * ox : 0, offY = tall ? 0 : (H - imgH) / 2;
  const sky = (x: number) => {
    const i = Math.round(((x - offX) / imgW) * (SKY.cols.length - 1));
    return shift + offY + SKY.cols[Math.max(0, Math.min(SKY.cols.length - 1, i))] * imgH;
  };
  const fs = parseFloat(getComputedStyle(w2).fontSize);
  /** highest skyline point under a word's letters (its text, not its box); `trees` false skips the columns where the
   *  cut-out starts at the very top (the tree at the left edge), which the outer words may cross */
  const skyUnder = (w: HTMLElement, trees = true) => {
    const range = document.createRange(); range.selectNodeContents(w);
    const textW = range.getBoundingClientRect().width;
    const left = w.offsetLeft + (getComputedStyle(w).textAlign === 'center' ? (w.offsetWidth - textW) / 2 : 0);
    let high = Infinity;
    for (let x = left; x <= left + textW; x += 4) { const y = sky(x); if (trees || y > shift + offY + 0.005 * imgH) high = Math.min(high, y); }
    return high;
  };
  const capH = (CAP_BOTTOM - CAP_TOP) * fs;
  const top2 = skyUnder(w2) + MAX_HIDDEN * capH - CAP_BOTTOM * fs;
  w2.style.top = `${top2}px`;
  if (w1) {
    const header = document.querySelector('.hdr-inner')?.getBoundingClientRect().bottom ?? 0;
    // the first word stays clear of the roof below it as well as above the middle word
    const clear = skyUnder(w1, false) - CAP_BOTTOM * fs - 0.6 * fs;
    const wanted = Math.min(w1.offsetTop, top2 - 1.3 * fs, clear);
    w1.style.top = `${Math.max(wanted, header + 0.1 * fs - CAP_TOP * fs)}px`;
  }
}

/**
 * The opening, after elicyon.com (values read from its production code, see _phase-a/phase-a-audit.md):
 * a navy loader draws the Riverina logo shape by shape; then an even-odd hole grows from the centre of the navy
 * field to its edges (1.8 s, in-out-quart = GSAP power3.inOut) while the logo travels into the header and the picture settles from
 * ×1.2; at +1.4 s three words slide in. The middle word sits between the picture and a cut-out of the building
 * (sky removed), so it passes behind the roof. On later visits in the session only the words animate.
 * Without JavaScript or with reduced motion: no loader, everything in place.
 */
const HOLE = (p: number) => `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${p}% ${p}%, ${100 - p}% ${p}%, ${100 - p}% ${100 - p}%, ${p}% ${100 - p}%, ${p}% ${p}%)`;
const BG = '/riverina/hero/hero-315-bg.webp';
const FG = '/riverina/hero/hero-315-fg.webp';
/** reveal direction of each logo shape, following its stroke: bowl →, gold leaf ↑, navy leaf ↓, ribbons → */
const DIRS = ['90deg', '0deg', '180deg', '90deg', '90deg'];

export default function Opening({ hero, lang, name, tag }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string }) {
  const root = useRef<HTMLElement>(null);
  const t = UI[lang];
  const words = (tx(hero.words, lang) || name).split('\n').map((w) => w.trim()).filter(Boolean).slice(0, 3);
  const cta2 = tx(hero.cta2, lang);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intro = !html.classList.contains('intro-seen') && !reduce;
    // the picture layers: shown once decoded (CSS fades them in), and the loader opens only onto a finished picture
    const pics = Array.from(el.querySelectorAll<HTMLImageElement>('.eh-zoom img'));
    const loaded = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0;
    if (pics.every(loaded)) el.classList.add('is-pic');
    const picReady = Promise.all(pics.map((img) => loaded(img) ? img.decode().catch(() => {}) : new Promise<void>((done) => {
      img.addEventListener('load', () => done(), { once: true });
      img.addEventListener('error', () => done(), { once: true });
    }))).then(() => el.classList.add('is-pic'));
    el.classList.add('is-live'); // switches off the CSS fail-safes
    const place = () => placeWords(el);
    place();
    document.fonts?.ready.then(place);
    let rz = 0;
    const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(place); };
    window.addEventListener('resize', onResize);
    if (reduce) return () => window.removeEventListener('resize', onResize);
    let dead = false;
    let undo = () => {};

    if (intro) {
      html.classList.add('intro-run');
      window.scrollTo(0, 0);
    }
    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (dead) return;
      const q = (s: string) => Array.from(el.querySelectorAll<HTMLElement>(s));
      const [w1, w2, w3] = q('.eh-w');
      const media = q('.eh-zoom');
      const ctx = gsap.context(() => {
        // words start a fifth of their width to the side (Elicyon: -20 %, +20 %, -20 %)
        gsap.set([w1, w2, w3].filter(Boolean), { opacity: 0, xPercent: (i: number) => (i === 1 ? 20 : -20) });
        const words = () => { gsap.to([w1, w2, w3].filter(Boolean), { opacity: 1, xPercent: 0, duration: 1.2, ease: 'power3.inOut', stagger: 0.1 }); };
        const feet = () => { gsap.fromTo(q('.eh-foot > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }); };

        if (!intro) {
          gsap.set(media, { scale: 1 });
          words(); feet();
          return;
        }
        const lenis = getLenis();
        lenis?.stop();
        const field = el.querySelector<HTMLElement>('.ld-field')!;
        const logo = el.querySelector<HTMLElement>('.ld-logo')!;
        // 1 · the logo, shape by shape, each along its own stroke (soft-edged masks); a gold base line draws under it
        const draw = gsap.timeline();
        draw.fromTo(q('.ld-part'), { '--p': '0%' }, { '--p': '130%', duration: 1.05, ease: 'power2.inOut', stagger: 0.14 }, 0.1)
          .fromTo(q('.ld-word .ld-ch > span'), { y: 0, yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.045 }, 0.75)
          .fromTo(q('.ld-res .ld-ch > span'), { opacity: 0, y: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.035 }, 1.15)
          .fromTo(q('.ld-rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 1.2);
        // the field opens only onto a decoded picture: no wait when it is ready, at most 2.5 s more on a slow line
        const drawn = new Promise<void>((r) => { draw.eventCallback('onComplete', () => r()); });
        const pictured = Promise.race([picReady, new Promise((r) => setTimeout(r, 2500))]);
        Promise.all([drawn, pictured]).then(() => { if (!dead) ctx.add(reveal); });

        // 2 · the logo rises into the header first, so it never crosses the picture; then the navy field opens from the
        //     centre to the edges and the picture settles from ×1.2. The field's top band is the last to go.
        const reveal = () => {
          const hole = { p: 50 };
          const travel = 1.5, open = 0.5, dur = 1.7;
          gsap.timeline({
            onComplete: () => {
              html.classList.remove('intro-run', 'intro-header', 'intro-landed');
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
              const s = b.height / a.height;
              gsap.to(logo, { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), scale: s, duration: travel, ease: 'power3.inOut' });
            }, 0.05)
            .to(hole, { p: 0, duration: dur, ease: 'power3.inOut', onUpdate: () => { field.style.clipPath = HOLE(hole.p); } }, open)
            .to(media, { scale: 1, duration: dur, ease: 'power3.inOut' }, open)
            .add(words, open + 1.0)
            .add(feet, open + 1.3)
            // the header (and its real logo) takes over where the travelling logo lands
            .add(() => html.classList.add('intro-header'), 0.05 + travel - 0.2)
            // landed: the header's own logo cross-fades in as the travelling one fades out
            .add(() => html.classList.add('intro-landed'), 0.05 + travel)
            .to(logo, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.05 + travel)
            .set(el.querySelector('.ld'), { display: 'none' }, open + dur);
        };
      }, el);

      // scrolling away: both picture layers drift down by 10 % (Elicyon), nothing else moves
      const drift = gsap.to(media, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      undo = () => { ctx.revert(); drift.scrollTrigger?.kill(); drift.kill(); };
    }, () => { html.classList.remove('intro-run'); el.classList.add('intro-done'); });

    return () => { dead = true; undo(); window.removeEventListener('resize', onResize); html.classList.remove('intro-run', 'intro-header', 'intro-landed'); };
  }, []);

  const word = (i: number) => words[i] && <span className={`eh-w eh-w${i + 1}`}>{words[i]}</span>;
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
    <section ref={root} className="eh" aria-labelledby="hero-title">
      {/* layer order (Elicyon): picture · middle word · building cut-out · ground shade · first and last word */}
      <div className="eh-media eh-bg" aria-hidden="true">
        <div className="eh-zoom"><Image src={BG} alt="" fill priority sizes="(orientation: portrait) 180vh, 100vw" quality={80} /></div>
        <div className="eh-sky" />
      </div>
      <h1 id="hero-title" className="eh-title">
        <span className="sr-only">{name}: </span>
        {word(0)}{word(1)}{word(2)}
      </h1>
      <div className="eh-media eh-fg" aria-hidden="true">
        <div className="eh-zoom"><Image src={FG} alt="" fill priority sizes="(orientation: portrait) 180vh, 100vw" quality={80} /></div>
      </div>
      <div className="eh-ground" aria-hidden="true" />

      <div className="eh-foot">
        <div className="eh-ctas">
          <a className="eh-cta" href={href('apartments', lang)}><span>{tx(hero.cta, lang) || t.chooseApartment}</span></a>
          {cta2 && <a className="eh-cta" href="#kontakt"><span>{cta2}</span></a>}
        </div>
        {tag && <p className="eh-cap">{name} · {tag}</p>}
      </div>

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
