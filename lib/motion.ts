'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/** Soft ease-out used for every scroll reveal (no bounce). */
export const EASE = 'power3.out';
export { gsap, ScrollTrigger };
