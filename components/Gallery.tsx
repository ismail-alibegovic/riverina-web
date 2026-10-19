'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

export type GalleryImage = { src: string; alt: string; caption: string };
type Labels = { close: string; prev: string; next: string; image: string };

/** Editorial image grid; a click opens the full-screen lightbox, focus returns to the thumbnail. */
export default function Gallery({ images, labels, tag }: { images: GalleryImage[]; labels: Labels; tag?: string }) {
  const [i, setI] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const name = (n: number) => images[n].alt || images[n].caption || labels.image.replace('{n}', String(n + 1));

  return (
    <>
      {/* editorial layout: a large and a small frame per row, offset against each other; the two columns drift at different speeds */}
      <ul className="gal-ed">
        {images.map((g, n) => (
          <li className="gal-cell" key={n}>
            <button type="button" className="gal-item" data-reveal="clip" data-parallax={n % 2 ? '9' : '4'} onClick={(e) => { opener.current = e.currentTarget; setI(n); }} aria-label={name(n)}>
              <Image src={g.src} alt="" fill sizes={n % 2 ? '(min-width: 900px) 34vw, 70vw' : '(min-width: 900px) 58vw, 100vw'} quality={80} />
              {tag && n === 0 && <span className="ill-tag" aria-hidden="true">{tag}</span>}
            </button>
            {g.caption && <p className="gal-caption" aria-hidden="true" data-reveal="fade"><span>{String(n + 1).padStart(2, '0')}</span>{g.caption}</p>}
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={i} onChange={(x) => { setI(x); if (x === null) opener.current?.focus({ preventScroll: true }); }} labels={labels} tag={tag} />
    </>
  );
}
