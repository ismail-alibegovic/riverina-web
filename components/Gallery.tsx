'use client';
import { useEffect, useState } from 'react';

export default function Gallery({ images, closeLabel }: { images: { src: string; caption: string }[]; closeLabel: string }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setI(null);
      if (e.key === 'ArrowRight') setI((x) => (x === null ? x : (x + 1) % images.length));
      if (e.key === 'ArrowLeft') setI((x) => (x === null ? x : (x - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', k);
    document.documentElement.classList.add('menu-open');
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('menu-open'); };
  }, [i, images.length]);
  return (
    <>
      <div className={'gal-grid gal-n' + Math.min(images.length, 6)}>
        {images.map((g, n) => (
          <button type="button" key={n} className="gal-item" style={n === images.length - 1 && images.length > 1 ? { gridColumn: `span ${1 + ((4 - ((images.length + 3) % 4)) % 4)}` } : undefined} onClick={() => setI(n)} aria-label={g.caption || `Slika ${n + 1}`}>
            <img src={g.src} alt={g.caption} loading="lazy" />
            {g.caption && <span className="gal-cap">{g.caption}</span>}
          </button>
        ))}
      </div>
      {i !== null && (
        <div className="lb" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setI(null); }}>
          <button type="button" className="lb-close" onClick={() => setI(null)}>{closeLabel} ✕</button>
          {images.length > 1 && <button type="button" className="lb-nav lb-prev" aria-label="←" onClick={() => setI((i - 1 + images.length) % images.length)}>‹</button>}
          <figure><img src={images[i].src} alt={images[i].caption} />{images[i].caption && <figcaption>{images[i].caption}</figcaption>}</figure>
          {images.length > 1 && <button type="button" className="lb-nav lb-next" aria-label="→" onClick={() => setI((i + 1) % images.length)}>›</button>}
        </div>
      )}
    </>
  );
}
