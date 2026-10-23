'use client';
import { useEffect } from 'react';
import { loadMotion } from '@/lib/motion';

/**
 * The shared editorial motion of the home page, with Elicyon's values: headings rise line by line from masks
 * (0.85 s, out-quart, 0.1 s apart) and the second line then slides to its indent (0.8 s, in-out-quart); copy and
 * links fade up (0.6 s); framed pictures open from the bottom; [data-ed="parallax"] pictures drift slowly.
 * Every element starts visible in the HTML; hidden states are set only once GSAP is running, and only for elements
 * still below the fold. Reduced motion: nothing moves.
 */
export default function EditorialMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let dead = false, undo = () => {};
    loadMotion().then(({ gsap }) => {
      if (dead) return;
      const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
      const ctx = gsap.context(() => {
        // frames are watched through their parent; several frames may share one (the developer collage)
        const watched = new Map<Element, Element[]>();
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            // a clipped frame is watched through its parent (Chromium counts clip-path in IntersectionObserver)
            const frames = watched.get(e.target);
            if (frames) {
              gsap.to(frames, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', stagger: 0.15 });
              return;
            }
            const el = e.target as HTMLElement, kind = el.dataset.ed;
            if (kind === 'heading') {
              const lines = el.querySelectorAll('.ed-hl-in');
              gsap.to(lines, { yPercent: 0, duration: 0.85, stagger: 0.1, delay: 0.2, ease: 'power3.out' });
              const second = el.querySelectorAll('.ed-hl')[1] as HTMLElement | undefined;
              if (second) gsap.to(second, { x: 0, duration: 0.8, delay: 0.45, ease: 'power3.inOut' });
            } else if (kind === 'fade') {
              gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: 'power3.out' });
            }
          });
        }, { threshold: 0.35 });
        document.querySelectorAll<HTMLElement>('[data-ed="heading"]').forEach((el) => {
          if (!below(el)) return;
          // the indent of the second line is its resting margin (CSS); it starts flush and slides into it
          const second = el.querySelectorAll('.ed-hl')[1] as HTMLElement | undefined;
          if (second) gsap.set(second, { x: -(parseFloat(getComputedStyle(second).marginLeft) || 0) });
          gsap.set(el.querySelectorAll('.ed-hl-in'), { yPercent: 105 });
          io.observe(el);
        });
        document.querySelectorAll<HTMLElement>('[data-ed="fade"]').forEach((el) => { if (below(el)) { gsap.set(el, { opacity: 0, y: 14 }); io.observe(el); } });
        document.querySelectorAll<HTMLElement>('[data-ed="frame"]').forEach((el) => {
          if (!below(el) || !el.parentElement) return;
          gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
          const p = el.parentElement, list = watched.get(p);
          if (list) list.push(el); else { watched.set(p, [el]); io.observe(p); }
        });
        document.querySelectorAll<HTMLElement>('[data-ed="parallax"]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        return () => io.disconnect();
      });
      undo = () => ctx.revert();
    });
    return () => { dead = true; undo(); };
  }, []);
  return null;
}
