import { Fragment } from 'react';
import Image from 'next/image';
import { mediaUrl } from '@/lib/content';

/** Renders CMS text where *word* marks the contrasting word. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return <>{parts.map((p, i) => (p.startsWith('*') && p.endsWith('*') ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>))}</>;
}

/**
 * Two-part section heading: each CMS line becomes its own stepped line ("O / projektu").
 * `index` adds a small section number above it; every heading gets a gold hairline that draws in after the words.
 */
export function Heading({ text, as: Tag = 'h2', className = '', index }: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string; index?: number }) {
  if (!text) return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <Tag className={'split ' + className} data-reveal="lines">
      {index != null && <span className="sec-idx" aria-hidden="true">{String(index).padStart(2, '0')}</span>}
      {lines.map((l, i) => (
        <span className="split-line" key={i} style={{ '--i': i } as React.CSSProperties}><span><Rich text={l} /></span></span>
      ))}
      <span className="sec-rule" aria-hidden="true" />
    </Tag>
  );
}

/** Paragraphs separated by an empty line; single new lines become <br>. */
export function Paras({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p.split('\n').map((line, j) => (j ? [<br key={j} />, line] : line))}</p>
      ))}
    </div>
  );
}

/** Image that fills its (aspect-ratio) frame; works for /public paths and Supabase Storage paths. */
export function Fill({ src, alt = '', sizes, priority, className, quality = 80 }: { src?: string; alt?: string; sizes: string; priority?: boolean; className?: string; quality?: number }) {
  const url = mediaUrl(src);
  if (!url) return null;
  return <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className={className} quality={quality} />;
}
