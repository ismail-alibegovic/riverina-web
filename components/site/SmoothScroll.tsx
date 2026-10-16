'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let instance: Lenis | null = null;
/** The page's single smooth-scroll engine (null under reduced motion). */
export const getLenis = () => instance;

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84;
    instance = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -headerH } });
    return () => { instance?.destroy(); instance = null; };
  }, []);
  return null;
}
