'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/motion';
import 'lenis/dist/lenis.css';

let instance: Lenis | null = null;
/** The page's single smooth-scroll engine (null under reduced motion). */
export const getLenis = () => instance;

export default function SmoothScroll() {
  useEffect(() => {
    // Scroll-reveal hooks: content stays visible without JavaScript; hidden states apply only after this class.
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    if (!reduce) {
      html.classList.add('reveal-ready');
      document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    }
    if (reduce) return () => io.disconnect();

    const headerH = parseFloat(getComputedStyle(html).getPropertyValue('--header-h')) || 84;
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -headerH } });
    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Fonts and lazy images change the page height; keep pinned sections measured correctly.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    return () => { io.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); instance = null; };
  }, []);
  return null;
}
