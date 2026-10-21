'use client';
import { useEffect, useRef } from 'react';
import { Lang, Page, tx } from '@/lib/content';
import { href, UI } from '@/lib/i18n';
import { whenNear } from '@/lib/motion';
import { Fill, Rich } from './text';

/**
 * Aperture hero. A navy field with an architectural drawing grid; the render sits in a tall window that opens on
 * load (a line is drawn, then the window swings open). The title crosses the window edge: ivory on the navy, navy on
 * the picture (a second, clipped copy). A gold ribbon from the logo flows into the window. Scrolling opens the
 * window to the full screen while the title parts; the manifest then slides over it like a sheet of paper.
 * Without JavaScript or with reduced motion everything stands in its resting state.
 */
export default function Hero({ hero, lang, name, tag }: { hero: NonNullable<Page['hero']>; lang: Lang; name: string; tag?: string }) {
  const root = useRef<HTMLElement>(null);
  const t = UI[lang];
  const raw = tx(hero.title, lang) || name;
  const lines = (raw.includes('\n') ? raw.split('\n') : raw.trim().split(/\s+/).length <= 3 ? raw.trim().split(/\s+/) : [raw]).map((l) => l.trim()).filter(Boolean);
  const cta2 = tx(hero.cta2, lang);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ap = el.querySelector<HTMLElement>('.hx-ap')!;
    const stage = el.querySelector<HTMLElement>('.hx-stage')!;
    // The window opens with a CSS animation (so it plays before any script); afterwards its size follows CSS variables.
    let opened = false;
    const open = () => { opened = true; el.classList.add('is-open'); };
    const running = ap.getAnimations().filter((a) => a.playState !== 'finished');
    // Reloaded further down the page: no entrance, the window takes its scrolled state at once.
    if (window.scrollY > 40) el.querySelectorAll('.hx-stage *').forEach((n) => n.getAnimations().forEach((a) => a.finish()));
    if (running.length) Promise.all(running.map((a) => a.finished)).then(open, open); else open();

    // The picture leans a little towards the pointer (desktop only).
    let raf = 0, mx = 0, my = 0, cx = 0, cy = 0;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
    const tick = () => {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      stage.style.setProperty('--mx', cx.toFixed(4)); stage.style.setProperty('--my', cy.toFixed(4));
      raf = Math.abs(mx - cx) + Math.abs(my - cy) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    if (fine) stage.addEventListener('pointermove', onMove);

    const offScroll = whenNear(el, ({ gsap }) => {
      let tl: gsap.core.Timeline | null = null;
      const build = () => {
        // resting window → full screen; the title parts and fades; the picture settles; a veil keeps the header legible
        tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
        tl.fromTo(stage, { '--o': 0 }, { '--o': 1, ease: 'power2.inOut', duration: 0.6 }, 0)
          .to(el.querySelector('.hx-zoom'), { scale: 1, ease: 'power2.inOut', duration: 0.6 }, 0)
          .to(el.querySelectorAll('.hx-line:nth-child(1)'), { xPercent: -14, ease: 'power1.in', duration: 0.42 }, 0)
          .to(el.querySelectorAll('.hx-line:nth-child(n+2)'), { xPercent: 12, ease: 'power1.in', duration: 0.42 }, 0)
          .to(el.querySelectorAll('.hx-words'), { opacity: 0, ease: 'power1.in', duration: 0.36 }, 0.04)
          .to(el.querySelectorAll('.hx-meta'), { opacity: 0, y: -24, ease: 'power1.in', duration: 0.2 }, 0)
          .to(el.querySelectorAll('.hx-grid, .hx-edge'), { opacity: 0, duration: 0.3 }, 0)
          .to(el.querySelector('.hx-ribbon'), { '--flow': 1, ease: 'none', duration: 0.5 }, 0)
          .to(el.querySelector('.hx-veil'), { opacity: 1, duration: 0.3 }, 0.3)
          .to(el.querySelector('.hx-dim'), { opacity: 0.55, ease: 'none', duration: 0.4 }, 0.6);
      };
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (opened) build(); else { const w = window.setInterval(() => { if (opened) { window.clearInterval(w); build(); } }, 60); return () => window.clearInterval(w); }
        return () => { tl?.scrollTrigger?.kill(); tl?.kill(); };
      });
      return () => mm.revert();
    }, '0px');

    return () => { offScroll(); stage.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const words = (ink?: boolean) => (
    <span className={'hx-words' + (ink ? ' is-ink' : '')} aria-hidden={ink || undefined}>
      {lines.map((l, i) => (
        <span className="hx-line" key={i} style={{ '--i': i } as React.CSSProperties}><span className="hx-line-in"><Rich text={l} /></span></span>
      ))}
    </span>
  );

  return (
    <section ref={root} className="hx" aria-labelledby="hero-title">
      {/* the header stays light over the hero picture until the paper sheet of the next section reaches it */}
      <span className="hx-hdr" data-hdr-until aria-hidden="true" />
      <div className="hx-stage">
        <div className="hx-grid" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>

        <svg className="ribbon hx-ribbon" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
          <path className="is-desk" pathLength={1} d="M-40 872 C 220 900 430 888 600 850 C 700 828 740 790 830 766 C 930 740 1010 772 1100 760" />
          <path className="is-desk is-thin" pathLength={1} d="M-40 890 C 250 916 470 906 640 868 C 740 846 790 812 880 790" />
          <path className="is-mob" pathLength={1} d="M-20 404 C 260 360 540 470 820 400 C 1060 340 1240 300 1480 330" />
          <path className="is-mob is-thin" pathLength={1} d="M-20 424 C 300 384 560 492 860 424 C 1100 368 1260 336 1480 356" />
        </svg>

        <span className="hx-edge" aria-hidden="true" />
        <h1 id="hero-title" className="hx-title">{words()}</h1>

        {/* the window: everything inside is clipped to it (picture, the navy copy of the title, the caption) */}
        <div className="hx-ap" aria-hidden="true">
          <div className="hx-zoom"><div className="hx-img"><Fill src={hero.image} sizes="(orientation: portrait) 200vh, 100vw" priority quality={80} /></div></div>
          <div className="hx-dim" />
          <div className="hx-veil" />
          {words(true)}
          {tag && <span className="hx-cap">{name} · {tag}</span>}
        </div>

        <p className="hx-meta hx-eyebrow label"><i aria-hidden="true" />{tx(hero.eyebrow, lang)}</p>
        <div className="hx-meta hx-foot">
          {tx(hero.subtitle, lang) && <p className="hx-sub">{tx(hero.subtitle, lang)}</p>}
          <div className="hx-ctas">
            <a className="hx-cta" href={href('apartments', lang)}><span>{tx(hero.cta, lang) || t.chooseApartment}</span><i aria-hidden="true" /></a>
            {cta2 && <a className="link-line hx-cta2" href="#kontakt">{cta2}</a>}
          </div>
        </div>
        <span className="hx-meta hx-scroll label" aria-hidden="true">{t.scrollHint}<i /></span>
      </div>
    </section>
  );
}
