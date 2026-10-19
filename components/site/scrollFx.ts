// Small scroll and pointer effects for the public site. All of them are skipped under prefers-reduced-motion
// (SmoothScroll does not call them then), and none hides content when JavaScript is off.
import { whenNear } from '@/lib/motion';

const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)); // expo out: fast start, long soft landing

/**
 * Counts the numbers inside an element up from zero, keeping everything around them ("46-111", "1.250 m²").
 * The server-rendered final text stays in the DOM until the count starts, then is restored exactly at the end.
 */
export function prepareCount(el: HTMLElement): () => void {
  const final = el.textContent || '';
  const parts = final.split(/(\d+(?:[.,]\d+)?)/);
  const nums = parts.map((p, i) => (i % 2 ? p : null));
  if (!nums.some(Boolean)) return () => {};
  const render = (t: number) => {
    el.textContent = parts.map((p, i) => {
      if (!(i % 2)) return p;
      const dec = (p.split(/[.,]/)[1] || '').length;
      const sep = p.includes(',') ? ',' : '.';
      const v = parseFloat(p.replace(',', '.')) * ease(t);
      return dec ? v.toFixed(dec).replace('.', sep) : String(Math.round(v));
    }).join('');
  };
  render(0);
  return () => {
    const start = performance.now(), dur = 1800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      if (t < 1) { render(t); requestAnimationFrame(tick); } else el.textContent = final;
    };
    requestAnimationFrame(tick);
  };
}

/**
 * [data-parallax="12"]: the image inside drifts ±12 % against the scroll (desktop only).
 * [data-parallax-out]: the hero content rises and fades as the hero scrolls away.
 */
export function parallax(): () => void {
  if (!window.matchMedia('(min-width: 900px)').matches) return () => {};
  const offs: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const target = el.querySelector('img');
    const amount = Number(el.dataset.parallax) || 10;
    if (!target) return;
    offs.push(whenNear(el, ({ gsap }) => {
      // the picture is enlarged by exactly the travel, so the frame never shows an empty edge
      const tw = gsap.fromTo(target, { yPercent: -amount, scale: 1 + Math.abs(amount) / 50 }, { yPercent: amount, scale: 1 + Math.abs(amount) / 50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set(target, { clearProps: 'transform' }); };
    }));
  });
  document.querySelectorAll<HTMLElement>('[data-parallax-out]').forEach((el) => {
    const section = el.closest('section') || el;
    offs.push(whenNear(section, ({ gsap }) => {
      const tw = gsap.to(el, { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } });
      return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set(el, { clearProps: 'transform,opacity' }); };
    }, '0px'));
  });
  return () => offs.forEach((off) => off());
}

/** [data-magnetic]: the button leans a few pixels towards the pointer (mouse and trackpad only). */
export function magnetic(): () => void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const move = (e: PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
    el.style.translate = `${(x * 14).toFixed(1)}px ${(y * 10).toFixed(1)}px`;
  };
  const leave = (e: PointerEvent) => { (e.currentTarget as HTMLElement).style.translate = ''; };
  els.forEach((el) => { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); });
  return () => els.forEach((el) => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); el.style.translate = ''; });
}
