'use client';
import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

/** Soft ease-out used for every scroll reveal (no bounce). */
export const EASE = 'power3.out';

export type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ST };
let loading: Promise<Motion> | null = null;
let ready: Motion | null = null;
const listeners: ((m: Motion) => void)[] = [];

/** GSAP + ScrollTrigger, loaded on first use so they never block the first paint. */
export function loadMotion(): Promise<Motion> {
  if (!loading) {
    loading = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
      g.gsap.registerPlugin(s.ScrollTrigger);
      ready = { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
      listeners.splice(0).forEach((fn) => fn(ready!));
      return ready;
    });
  }
  return loading;
}

/** Already loaded GSAP (or null). */
export const motionNow = () => ready;
/** Runs once GSAP is loaded (by any component). */
export function onMotion(fn: (m: Motion) => void) { if (ready) fn(ready); else listeners.push(fn); }

/**
 * Sets up a scroll animation when its element comes near the viewport and the visitor allows motion.
 * `setup` returns a cleanup; the returned function tears everything down.
 */
export function whenNear(el: Element, setup: (m: Motion) => (() => void) | void, margin = '0px 0px 50% 0px'): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  let cleanup: (() => void) | void;
  let dead = false;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    // If the animation code cannot load, show everything in its final state instead.
    loadMotion().then((m) => { if (!dead) cleanup = setup(m); }, () => document.documentElement.classList.remove('reveal-ready'));
  }, { rootMargin: margin });
  io.observe(el);
  return () => { dead = true; io.disconnect(); if (cleanup) cleanup(); };
}
