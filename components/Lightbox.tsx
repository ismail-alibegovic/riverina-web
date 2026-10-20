'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export type LightboxImage = { src: string; alt: string; caption: string };
export type LightboxLabels = { close: string; prev: string; next: string; image: string };

/**
 * Full-screen viewer rendered outside <main> (which is inert while it is open). Esc, arrows, focus kept inside;
 * the caller returns focus to whatever opened it when `index` becomes null.
 */
export default function Lightbox({ images, index, onChange, labels, tag }: { images: LightboxImage[]; index: number | null; onChange: (i: number | null) => void; labels: LightboxLabels; tag?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const name = (n: number) => images[n].alt || images[n].caption || labels.image.replace('{n}', String(n + 1));
  const n = images.length;

  useEffect(() => {
    if (index === null) return;
    const html = document.documentElement;
    const main = document.getElementById('main');
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') onChange((index + 1) % n);
      if (e.key === 'ArrowLeft') onChange((index - 1 + n) % n);
      if (e.key === 'Tab' && box.current) {
        const items = Array.from(box.current.querySelectorAll<HTMLElement>('button'));
        const at = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        items[(at + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    window.addEventListener('keydown', k);
    html.classList.add('menu-open');
    if (main) main.inert = true;
    return () => { window.removeEventListener('keydown', k); html.classList.remove('menu-open'); if (main) main.inert = false; };
  }, [index, n, onChange]);

  const open = index !== null;
  useEffect(() => { if (open) box.current?.querySelector<HTMLElement>('.lb-close')?.focus(); }, [open]);

  if (index === null) return null;
  return createPortal(
    <div ref={box} className="lb" role="dialog" aria-modal="true" aria-label={name(index)} onClick={(e) => { if (e.target === e.currentTarget) onChange(null); }}>
      <button type="button" className="lb-close" onClick={() => onChange(null)}>{labels.close} <span aria-hidden="true">✕</span></button>
      {n > 1 && <button type="button" className="lb-nav lb-prev" aria-label={labels.prev} onClick={() => onChange((index - 1 + n) % n)}><span aria-hidden="true">‹</span></button>}
      <figure>
        <Image src={images[index].src} alt={images[index].alt} width={2000} height={1250} sizes="100vw" quality={80} style={{ width: 'auto', height: 'auto' }} />
        {(images[index].caption || tag) && <figcaption>{[images[index].caption, tag].filter(Boolean).join(' · ')}</figcaption>}
      </figure>
      {n > 1 && <button type="button" className="lb-nav lb-next" aria-label={labels.next} onClick={() => onChange((index + 1) % n)}><span aria-hidden="true">›</span></button>}
    </div>,
    document.body,
  );
}
