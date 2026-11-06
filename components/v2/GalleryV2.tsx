'use client';
import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/Lightbox';
import { UI } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

type Img = { src: string; alt: string; caption: string };

/** Editorial mosaic, not a grid of equal cards: frames of different size and proportion, opened in the lightbox. */
export default function GalleryV2({ images, tag, lang }: { images: Img[]; tag?: string; lang: Lang }) {
  const t = UI[lang];
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const change = useCallback((i: number | null) => {
    setIndex(i);
    if (i === null) opener.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <div className="kt-wrap k-mosaic">
        {images.map((g, i) => (
          <figure key={g.src} className={'k-m k-m-' + (i + 1)} data-k="up" style={{ '--i': i % 3 } as React.CSSProperties}>
            <button type="button" className="k-img" onClick={(e) => { opener.current = e.currentTarget; setIndex(i); }} aria-label={`${t.galOpen}: ${g.alt || g.caption || t.image.replace('{n}', String(i + 1))}`}>
              <Image src={g.src} alt={g.alt} fill sizes={i === 0 ? '(min-width: 900px) 58vw, 100vw' : '(min-width: 900px) 30vw, 50vw'} quality={78} />
            </button>
            {g.caption && <figcaption>{g.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <Lightbox images={images} index={index} onChange={change} labels={{ close: t.close, prev: t.prev, next: t.next, image: t.image }} tag={tag} />
    </>
  );
}
