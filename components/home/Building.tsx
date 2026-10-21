'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { whenNear, loadMotion } from '@/lib/motion';

export type Floor = { key: string; no: string; label: string; count: string; href?: string };

type Props = {
  id: string;
  name: string;
  eyebrow: string;
  text: string;
  /** the building's 360° views from the CMS, in turning order */
  frames: string[];
  start: number;
  /** top floor first */
  floors: Floor[];
  cta: { href: string; label: string };
  tag?: string;
  labels: { drag: string; left: string; right: string; angle: string; floors: string };
};

const mod = (a: number, n: number) => ((a % n) + n) % n;
/** Frames through the image optimiser at a width that suits the screen. */
const sized = (src: string, w: number) => (src.startsWith('/') && !src.startsWith('//') ? src : `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`);

/**
 * Architectural presentation: the building turns as you scroll (its 360° views from the CMS, drawn on a canvas),
 * a dial reads the angle, and the floor section beside it climbs from the ground floor to the top as the building
 * turns. The frame opens like a pair of shutters; dragging or the arrow buttons turn it by hand. Floors link into the
 * apartment finder. Under reduced motion nothing is pinned and the building only turns by hand.
 */
export default function Building(p: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const n = p.frames.length;
  const [frame, setFrame] = useState(mod(p.start, n));
  const [floorOn, setFloorOn] = useState(-1);
  const state = useRef({ scroll: 0, drag: 0, imgs: [] as (HTMLImageElement | null)[], ready: false });

  const angle = (i: number) => Math.round((i * 360) / n);

  useEffect(() => {
    const el = root.current, cv = canvas.current;
    if (!el || !cv || !n) return;
    const st = state.current;
    const ctx = cv.getContext('2d');
    let shown = -1;

    const draw = () => {
      const want = mod(p.start + st.scroll + Math.round(st.drag), n);
      // the nearest frame that has loaded, so the building never blinks while the rest stream in
      let pick = -1;
      for (let d = 0; d < n && pick < 0; d++) for (const s of [want + d, want - d]) { const k = mod(s, n); if (st.imgs[k]?.complete && st.imgs[k]!.naturalWidth) { pick = k; break; } }
      setFrame(want);
      if (pick < 0 || !ctx) return;
      if (pick === shown && cv.dataset.w === String(cv.width)) return;
      const img = st.imgs[pick]!;
      const W = cv.width, H = cv.height, s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (W - w) / 2, (H - h) * 0.55, w, h);
      shown = pick; cv.dataset.w = String(W);
      if (!st.ready) { st.ready = true; el.classList.add('has-canvas'); }
    };

    const fit = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      el.querySelector<HTMLElement>('.bx-stage')?.style.setProperty('--fh', `${Math.round(r.height + 14)}px`);
      shown = -1; draw();
    };
    const ro = new ResizeObserver(fit);
    ro.observe(cv);

    // stream the frames once the section is close: the first view, then every third, then the rest
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const w = window.innerWidth > 900 ? 1200 : 828;
      const order = [0, ...Array.from({ length: n }, (_, i) => i).filter((i) => i && i % 3 === 0), ...Array.from({ length: n }, (_, i) => i).filter((i) => i % 3)];
      st.imgs = Array(n).fill(null);
      order.forEach((o) => {
        const k = mod(p.start + o, n);
        const img = new window.Image();
        img.decoding = 'async';
        img.onload = draw;
        img.src = sized(p.frames[k], w);
        st.imgs[k] = img;
      });
    }, { rootMargin: '0px 0px 120% 0px' });
    io.observe(el);

    // turning by hand: horizontal drag (vertical stays page scroll on touch screens)
    const stage = el.querySelector<HTMLElement>('.bx-frame')!;
    let down: { x: number; d: number } | null = null;
    const step = () => Math.max(18, stage.clientWidth / 40);
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, d: st.drag }; stage.setPointerCapture(e.pointerId); el.classList.add('is-dragging'); };
    const onMove = (e: PointerEvent) => { if (!down) return; st.drag = down.d - (e.clientX - down.x) / step(); draw(); };
    const onUp = () => { if (!down) return; down = null; st.drag = Math.round(st.drag); el.classList.remove('is-dragging'); draw(); };
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    const turn = (e: Event) => { const d = Number((e.currentTarget as HTMLElement).dataset.turn); st.drag = Math.round(st.drag) + d; draw(); };
    const btns = Array.from(el.querySelectorAll<HTMLElement>('[data-turn]'));
    btns.forEach((b) => b.addEventListener('click', turn));

    // scroll: one full turn while the section is pinned; the floor section climbs with it
    const offScroll = whenNear(el, ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const proxy = { p: 0 };
        const turnTw = gsap.to(proxy, {
          p: 1, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
          onUpdate: () => {
            st.scroll = Math.round(proxy.p * n) % n;
            setFloorOn(Math.min(p.floors.length - 1, Math.floor(proxy.p * p.floors.length * 0.999)));
            draw();
          },
        });
        const intro = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 62%', once: true } })
          .fromTo(el.querySelector('.bx-frame'), { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0)
          .fromTo(el.querySelector('.bx-canvas-wrap'), { scale: 1.25 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0.2)
          .fromTo(el.querySelectorAll('.bx-eyebrow > span, .bx-tl > span'), { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.08, ease: 'expo.out' }, 0.35)
          .fromTo(el.querySelectorAll('.bx-text, .bx-cta, .bx-dial, .bx-cap'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.7)
          .fromTo(el.querySelectorAll('.bx-floor'), { '--rule': 0, opacity: 0 }, { '--rule': 1, opacity: 1, duration: 1.1, stagger: 0.07, ease: 'expo.inOut' }, 0.5)
          .fromTo(el.querySelectorAll('.bx-tick'), { scaleY: 0 }, { scaleY: 1, duration: 0.8, stagger: 0.015, ease: 'expo.out' }, 0.9);
        return () => { [turnTw, intro].forEach((t) => { t.scrollTrigger?.kill(); t.kill(); }); st.scroll = 0; };
      });
      return () => mm.revert();
    }, '0px 0px 80% 0px');
    loadMotion();

    return () => { ro.disconnect(); io.disconnect(); offScroll(); stage.removeEventListener('pointerdown', onDown); stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerup', onUp); stage.removeEventListener('pointercancel', onUp); btns.forEach((b) => b.removeEventListener('click', turn)); };
  }, [n, p.start, p.frames, p.floors.length]);

  if (!n) return null;
  const deg = String(angle(frame)).padStart(3, '0');

  return (
    <section ref={root} className="bx" aria-labelledby={`bx-${p.id}`}>
      <div className="bx-sticky">
        <div className="wrap wrap-wide bx-grid">
          <div className="bx-head">
            <p className="bx-eyebrow label"><span>02</span><span>{p.eyebrow}</span></p>
            <h2 id={`bx-${p.id}`} className="bx-title"><span className="bx-tl"><span>{p.name}</span></span></h2>
            {p.text && <p className="bx-text">{p.text}</p>}
          </div>

          <figure className="bx-stage">
            <span className="bx-marks" aria-hidden="true"><i /><i /><i /><i /></span>
            <div className="bx-frame">
              <div className="bx-canvas-wrap">
                <Image className="bx-still" src={p.frames[mod(p.start, n)]} alt="" fill sizes="(min-width: 901px) 66vw, 100vw" quality={78} />
                <canvas ref={canvas} className="bx-canvas" aria-hidden="true" />
              </div>
              {p.tag && <span className="bx-cap">{p.name} · {p.tag}</span>}
              <span className="bx-hint label" aria-hidden="true"><i />{p.labels.drag}<i /></span>
            </div>
            <figcaption className="bx-dial">
              <span className="bx-deg" aria-live="polite"><span className="sr-only">{p.labels.angle.replace('{a}', String(angle(frame)))}</span><span aria-hidden="true">{deg}<sup>°</sup></span></span>
              <span className="bx-ticks" aria-hidden="true">
                {p.frames.map((_, i) => <i key={i} className={'bx-tick' + (i === frame ? ' is-on' : '') + (i % 6 === 0 ? ' is-major' : '')} />)}
              </span>
              <span className="bx-turn">
                <button type="button" data-turn="-1" aria-label={p.labels.left}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
                <button type="button" data-turn="1" aria-label={p.labels.right}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
              </span>
            </figcaption>
          </figure>

          <ol className="bx-floors" aria-label={p.labels.floors}>
            {p.floors.map((f, i) => {
              const on = floorOn === p.floors.length - 1 - i;
              const body = <><span className="bx-fno">{f.no}</span><span className="bx-flabel">{f.label}</span><span className="bx-fcount">{f.count}</span></>;
              return (
                <li key={f.key} className={'bx-floor' + (on ? ' is-on' : '')} style={{ '--i': i } as React.CSSProperties}>
                  {f.href ? <a href={f.href}>{body}</a> : <span className="bx-frow">{body}</span>}
                </li>
              );
            })}
          </ol>

          <a className="ed-cta bx-cta" href={p.cta.href}><span>{p.cta.label}</span><i aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
