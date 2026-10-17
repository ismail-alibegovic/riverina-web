'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export type GalleryImage = { src: string; alt: string; caption: string };
type Labels = { close: string; prev: string; next: string; image: string };

/** Image grid with a full-screen lightbox (rendered outside <main>, which is inert while it is open). Esc, arrows, focus kept inside and returned to the thumbnail. */
export default function Gallery({ images, labels }: { images: GalleryImage[]; labels: Labels }) {
  const [i, setI] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const name = (n: number) => images[n].alt || images[n].caption || labels.image.replace('{n}', String(n + 1));

  useEffect(() => {
    if (i === null) return;
    const html = document.documentElement;
    const main = document.getElementById('main');
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setI(null);
      if (e.key === 'ArrowRight') setI((x) => (x === null ? x : (x + 1) % images.length));
      if (e.key === 'ArrowLeft') setI((x) => (x === null ? x : (x - 1 + images.length) % images.length));
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
  }, [i, images.length]);

  // Focus the close button on open, return focus to the thumbnail on close.
  const open = i !== null;
  useEffect(() => {
    if (open) box.current?.querySelector<HTMLElement>('.lb-close')?.focus();
    else opener.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <div className={'gal-grid gal-n' + Math.min(images.length, 6)}>
        {images.map((g, n) => (
          <button type="button" key={n} className="gal-item" style={n === images.length - 1 && images.length > 1 ? { gridColumn: `span ${1 + ((4 - ((images.length + 3) % 4)) % 4)}` } : undefined} onClick={(e) => { opener.current = e.currentTarget; setI(n); }} aria-label={name(n)}>
            <Image src={g.src} alt="" fill sizes={n === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 50vw'} quality={78} />
            {g.caption && <span className="gal-cap" aria-hidden="true">{g.caption}</span>}
          </button>
        ))}
      </div>
      {i !== null && createPortal(
        <div ref={box} className="lb" role="dialog" aria-modal="true" aria-label={name(i)} onClick={(e) => { if (e.target === e.currentTarget) setI(null); }}>
          <button type="button" className="lb-close" onClick={() => setI(null)}>{labels.close} <span aria-hidden="true">✕</span></button>
          {images.length > 1 && <button type="button" className="lb-nav lb-prev" aria-label={labels.prev} onClick={() => setI((i - 1 + images.length) % images.length)}><span aria-hidden="true">‹</span></button>}
          <figure>
            <Image src={images[i].src} alt={images[i].alt} width={2000} height={1250} sizes="100vw" quality={80} style={{ width: 'auto', height: 'auto' }} />
            {images[i].caption && <figcaption>{images[i].caption}</figcaption>}
          </figure>
          {images.length > 1 && <button type="button" className="lb-nav lb-next" aria-label={labels.next} onClick={() => setI((i + 1) % images.length)}><span aria-hidden="true">›</span></button>}
        </div>,
        document.body,
      )}
    </>
  );
}
