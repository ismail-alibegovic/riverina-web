'use client';
import { useEffect } from 'react';
import type Lenis from 'lenis';
import { onMotion } from '@/lib/motion';
import { prepareCount, parallax, magnetic } from './scrollFx';
import 'lenis/dist/lenis.css';

let instance: Lenis | null = null;
/** The page's single smooth-scroll engine (null under reduced motion or before it has started). */
export const getLenis = () => instance;

export default function SmoothScroll() {
  useEffect(() => {
    // Scroll-reveal hooks: content stays visible without JavaScript; hidden states apply only after this class.
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Each element animates once; numbers marked [data-count] inside it count up as it appears.
    const counters = new Map<Element, () => void>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
        counters.get(e.target)?.();
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    if (reduce) return () => io.disconnect();
    html.classList.add('reveal-ready');
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const host = el.closest('[data-reveal]') || el;
      counters.set(host, prepareCount(el));
      io.observe(host);
    });
    const offMagnetic = magnetic();
    // Parallax needs GSAP; it is only worth loading once the visitor actually scrolls.
    let offParallax = () => {};
    const onFirstScroll = () => { offParallax = parallax(); };
    window.addEventListener('scroll', onFirstScroll, { once: true, passive: true });

    // Smooth scroll only smooths the mouse wheel (touch scrolling stays native), so it is skipped on touch screens
    // and started on the first wheel turn: it never competes with loading the page.
    let dead = false;
    const start = () => {
      import('lenis').then(({ default: L }) => {
        if (dead || instance) return;
        const headerH = parseFloat(getComputedStyle(html).getPropertyValue('--header-h')) || 84;
        const lenis = new L({ lerp: 0.085, anchors: { offset: -headerH }, autoRaf: true });
        instance = lenis;
        // Scroll animations (GSAP) load on demand; keep them in step with Lenis once they exist.
        onMotion(({ ScrollTrigger }) => { if (!dead) lenis.on('scroll', ScrollTrigger.update); });
      });
    };
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) window.addEventListener('wheel', start, { once: true, passive: true });
    // Fonts change the page height; re-measure pinned sections once they are in.
    onMotion(({ ScrollTrigger }) => { document.fonts?.ready.then(() => ScrollTrigger.refresh()); });
    return () => { dead = true; window.removeEventListener('wheel', start); window.removeEventListener('scroll', onFirstScroll); offParallax(); offMagnetic(); io.disconnect(); instance?.destroy(); instance = null; };
  }, []);
  return null;
}
